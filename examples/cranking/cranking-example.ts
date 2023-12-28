require("dotenv").config();

import {
  Wallet,
  Exchange,
  Network,
  utils,
  programTypes,
  constants,
  Market,
  assets,
  types,
} from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";

let network: Network;
switch (process.env["network"]) {
  case "localnet":
    network = Network.LOCALNET;
    break;
  case "devnet":
    network = Network.DEVNET;
    break;
  case "mainnet":
    network = Network.MAINNET;
    break;
  default:
    throw Error("Unsupported network type!");
}

const NETWORK_URL = process.env["network_url"]!;
const MAX_ACCOUNTS_TO_FETCH = 99;
let crankingMarkets = new Array(constants.ACTIVE_MARKETS - 1).fill(false);
console.log(NETWORK_URL);
const assetList = [constants.Asset.BTC];

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms, undefined));
}

async function main() {
  // Generate a new keypair for wallet otherwise load from a private key.
  const userKey = Keypair.generate();
  const wallet = new Wallet(userKey);

  // Load from private_key stored in .env file.
  // const privateKey = Keypair.fromSecretKey(
  //   new Uint8Array(JSON.parse(Buffer.from(process.env.private_key).toString()))
  // );
  // const wallet = new Wallet(privateKey);

  // Create a solana web3 connection to devnet.
  const connection = new Connection(NETWORK_URL, "confirmed");

  // Airdropping SOL.
  // Only able to be done on localnet/devnet.
  if (network != Network.MAINNET) {
    await connection.requestAirdrop(wallet.publicKey, 100000000);
  }

  const loadExchangeConfig = types.defaultLoadExchangeConfig(
    network,
    connection,
    utils.defaultCommitment(),
    0, // ThrottleMs - increase if you are running into rate limit issues on startup.
    true
  );

  // We load the exchange with a valid wallet containing SOL to call permissionless zeta functions.
  await Exchange.load(loadExchangeConfig, wallet);

  // Display state of zeta markets
  setInterval(
    async function () {
      utils.displayState();
    },
    process.env.DISPLAY_STATE_INTERVAL
      ? parseInt(process.env.DISPLAY_STATE_INTERVAL)
      : 30000
  );

  /**
   * Cranks the serum dex event queue for each zeta market. This will process trades that consist of maker fills.
   * All other events are atomically processed at time of call such as taker fills and cancels.
   * Functionality here will keep track of markets that are currently being cranked, markets that have empty event queues
   * as well as allowing specification of whether only live markets are being cranked.
   * This will flush event queues completely upon call.
   * This function will poll all market event queues asynchronously so is quite expensive in terms of RPC requests per second.
   * Use crankExchangeThrottle if you are running into rate limit issues.
   */
  setInterval(
    async function () {
      assetList.map(async (asset) => {
        await utils.crankMarket(asset);
      });
    },
    process.env.CRANK_EXCHANGE_INTERVAL
      ? parseInt(process.env.CRANK_EXCHANGE_INTERVAL)
      : 5000
  );

  // Update pricing on live markets
  setInterval(
    async function () {
      await updatePricing();
    },
    process.env.UPDATE_PRICING_INTERVAL
      ? parseInt(process.env.UPDATE_PRICING_INTERVAL)
      : 5000
  );

  // Apply funding to any users holding perp positions
  setInterval(
    async function () {
      await applyFunding();
    }.bind(this),
    process.env.APPLY_FUNDING_INTERVAL
      ? parseInt(process.env.APPLY_FUNDING_INTERVAL)
      : 120_000
  );

  setInterval(
    async function () {
      await pruneExpiredTIFOrders();
    }.bind(this),
    process.env.PRUNE_EXPIRED_TIF_INTERVAL
      ? parseInt(process.env.PRUNE_EXPIRED_TIF_INTERVAL)
      : 60000
  );

  // Rebalance zeta vault and insurance fund
  setInterval(
    async function () {
      await rebalanceInsuranceVault();
    }.bind(this),
    process.env.REBALANCE_INSURANCE_VAULT_INTERVAL
      ? parseInt(process.env.REBALANCE_INSURANCE_VAULT_INTERVAL)
      : 20000
  );
}

/**
 * This calls zeta's permissionless update pricing function through the Exchange object.
 * Cranks zeta's on-chain pricing ensuring all our greeks and theos are up-to-date.
 */
async function updatePricing() {
  // Get relevant expiry indices.

  await Promise.all(
    assetList.map(async (asset) => {
      try {
        console.log(`[${assets.assetToName(asset)}] Update pricing`);
        await Exchange.updatePricing(asset);
      } catch (e) {
        console.error(
          `[${assets.assetToName(asset)}] Update pricing failed. ${e}`
        );
      }
    })
  );
}

async function applyFunding() {
  let marginAccPubkeys = [];
  try {
    marginAccPubkeys = await utils.getAllProgramAccountAddresses(
      types.ProgramAccountType.MarginAccount
    );
  } catch (e) {
    throw Error("Account address fetch error on applyFunding()!");
  }
  for (
    let i = 0;
    i < marginAccPubkeys.length;
    i += constants.MAX_FUNDING_ACCOUNTS
  ) {
    // Grab set of margin accounts
    let marginAccounts = [];
    try {
      marginAccounts =
        await Exchange.program.account.marginAccount.fetchMultiple(
          marginAccPubkeys.slice(i, i + constants.MAX_FUNDING_ACCOUNTS)
        );
    } catch (e) {
      throw Error("Account data fetch error on applyFunding()!");
    }

    // In that set: Check if any have non-zero perp positions
    // If they do, apply funding on them
    let fundingAccounts = new Map<constants.Asset, PublicKey[]>();
    for (var asset of Exchange.assets) {
      fundingAccounts.set(asset, []);
    }

    for (let j = 0; j < marginAccounts.length; j++) {
      if (marginAccounts[j].perpProductLedger.position.size != 0) {
        fundingAccounts
          .get(assets.fromProgramAsset(marginAccounts[j].asset))
          .push(marginAccPubkeys[i + j]);
      }
    }

    // This will automatically break into multiple txs if there are too many
    for (var asset of Exchange.assets) {
      await utils.applyPerpFunding(asset, fundingAccounts.get(asset));
    }
  }
}

async function pruneExpiredTIFOrders() {
  let subExchanges = Exchange.getAllSubExchanges();

  try {
    await Promise.all(
      subExchanges.map((se) => {
        return utils.pruneExpiredTIFOrders(se.asset);
      })
    );
    console.log("Pruned expired TIF orders.");
  } catch (e) {
    console.log("Failed to prune expired TIF orders.", `Error=${e}`);
  }
}

/**
 * Rebalances the zeta vault and the insurance vault to ensure consistent platform security.
 * Checks all margin accounts for non-zero rebalance amounts and rebalances them all.
 */
async function rebalanceInsuranceVault() {
  let marginAccPubkeys: PublicKey[];
  try {
    marginAccPubkeys = await utils.getAllProgramAccountAddresses(
      types.ProgramAccountType.MarginAccount
    );
  } catch (e) {
    console.log(
      "rebalanceInsuranceVault account address fetch error",
      `Error=${e}`
    );
  }

  for (let i = 0; i < marginAccPubkeys.length; i += MAX_ACCOUNTS_TO_FETCH) {
    let marginAccs: any[];
    try {
      marginAccs = await Exchange.program.account.marginAccount.fetchMultiple(
        marginAccPubkeys.slice(i, i + MAX_ACCOUNTS_TO_FETCH)
      );
    } catch (e) {
      console.log(
        "rebalanceInsuranceVault margin account fetch error",
        `Error=${e}`
      );
    }

    let remainingAccounts: any[] = new Array();
    for (let j = 0; j < marginAccs.length; j++) {
      if (marginAccs[j].rebalanceAmount.toNumber() != 0) {
        remainingAccounts.push({
          pubkey: marginAccPubkeys[i + j],
          isSigner: false,
          isWritable: true,
        });
      }
    }
    console.log(
      `[REBALANCE INSURANCE VAULT] for ${remainingAccounts.length} accounts.`
    );
    try {
      await Exchange.rebalanceInsuranceVault(remainingAccounts);
    } catch (e) {
      console.log(
        "rebalanceInsuranceVault vault error on transaction",
        `Error=${e}`
      );
    }
  }
}

main().catch(console.error.bind(console));

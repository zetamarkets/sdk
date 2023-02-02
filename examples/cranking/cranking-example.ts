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
const PROGRAM_ID = new PublicKey(process.env["program_id"]);
let crankingMarkets = new Array(constants.ACTIVE_MARKETS - 1).fill(false);
console.log(NETWORK_URL);
const assetList = [assets.Asset.SOL, assets.Asset.BTC];

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
    assets.allAssets(),
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

  // Crank all markets.
  setInterval(
    async function () {
      assetList.map(async (asset) => {
        await crankExchange(asset, true);
        // Use this instead of `crankExchange` if you wish to throttle your cranking.
        /*
      await crankExchangeThrottled(
        asset,
        true,
        process.env.CRANK_EXCHANGE_THROTTLE_MS
          ? parseInt(process.env.CRANK_EXCHANGE_THROTTLE_MS)
          : 1000
      );
      */
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
      await this.applyFunding();
    }.bind(this),
    process.env.APPLY_FUNDING_INTERVAL
      ? parseInt(process.env.APPLY_FUNDING_INTERVAL)
      : 120_000
  );

  // Retreat pricing on markets
  setInterval(
    async function () {
      assetList.map(async (asset) => {
        await retreatMarketNodes(asset);
      });
    },
    process.env.RETREAT_MARKET_NODES_INTERVAL
      ? parseInt(process.env.RETREAT_MARKET_NODES_INTERVAL)
      : 5000
  );

  // Rebalance zeta vault and insurance fund
  setInterval(
    async function () {
      assetList.map(async (asset) => {
        await rebalanceInsuranceVault(asset);
      });
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
  for (var asset of assetList) {
    let indicesToCrank = [];
    for (
      var i = 0;
      i < Exchange.getZetaGroupMarkets(asset).expirySeries.length;
      i++
    ) {
      let expirySeries = Exchange.getZetaGroupMarkets(asset).expirySeries[i];
      if (
        Exchange.clockTimestamp <= expirySeries.expiryTs &&
        expirySeries.strikesInitialized &&
        !expirySeries.dirty
      ) {
        indicesToCrank.push(i);
      }
    }
    await Promise.all(
      indicesToCrank.map(async (index) => {
        try {
          console.log(
            `[${assets.assetToName(asset)}] Update pricing index ${index}`
          );
          await Exchange.updatePricing(asset, index);
        } catch (e) {
          console.error(
            `[${assets.assetToName(
              asset
            )}] Index ${index}: Update pricing failed. ${e}`
          );
        }
      })
    );
  }
}

/**
 * This calls zeta's permissionless retreat market nodes function through the Exchange object.
 * Cranks zeta's on-chain volatility, retreat and interest functionality similiar to update pricing.
 */
async function retreatMarketNodes(asset: assets.Asset) {
  // Get relevant expiry indices.
  let indicesToRetreat = [];
  for (
    var i = 0;
    i < Exchange.getZetaGroupMarkets(asset).expirySeries.length;
    i++
  ) {
    if (Exchange.getZetaGroupMarkets(asset).expirySeries[i].isLive()) {
      indicesToRetreat.push(i);
    }
  }
  await Promise.all(
    indicesToRetreat.map(async (index) => {
      try {
        console.log(`[${assets.assetToName(asset)}] Retreating index ${index}`);
        await Exchange.retreatMarketNodes(asset, index);
      } catch (e) {
        console.error(
          `[${assets.assetToName(
            asset
          )}] Index ${index}: Retreat market nodes failed. ${e}`
        );
      }
    })
  );
}

function getMarketsToCrank(asset: assets.Asset, liveOnly: boolean): Market[] {
  let marketsToCrank = [];
  if (liveOnly) {
    let liveExpiryIndices =
      Exchange.getZetaGroupMarkets(asset).getTradeableExpiryIndices();
    liveExpiryIndices.map(async (index) => {
      marketsToCrank.push(
        Exchange.getZetaGroupMarkets(asset).getMarketsByExpiryIndex(index)
      );
    });
    marketsToCrank = marketsToCrank.flat(1);
  } else {
    marketsToCrank = Exchange.getMarkets(asset);
  }
  return marketsToCrank;
}

/**
 * Cranks the serum dex event queue for each zeta market. This will process trades that consist of maker fills.
 * All other events are atomically processed at time of call such as taker fills and cancels.
 * Functionality here will keep track of markets that are currently being cranked, markets that have empty event queues
 * as well as allowing specification of whether only live markets are being cranked.
 * This will flush event queues completely upon call.
 * This function will poll all market event queues asynchronously so is quite expensive in terms of RPC requests per second.
 * Use crankExchangeThrottle if you are running into rate limit issues.
 */
async function crankExchange(asset: assets.Asset, liveOnly: boolean) {
  let marketsToCrank: Market[] = getMarketsToCrank(asset, liveOnly);
  marketsToCrank.map(async (market) => {
    let eventQueue = await market.serumMarket.loadEventQueue(
      Exchange.provider.connection
    );

    if (eventQueue.length > 0 && !crankingMarkets[market.marketIndex]) {
      crankingMarkets[market.marketIndex] = true;
      try {
        while (eventQueue.length != 0) {
          try {
            await utils.crankMarket(asset, market.marketIndex);
          } catch (e) {
            console.error(
              `Cranking failed on market ${market.marketIndex}, ${e}`
            );
          }

          let currLength = eventQueue.length;

          eventQueue = await market.serumMarket.loadEventQueue(
            Exchange.provider.connection
          );

          let numCranked = currLength - eventQueue.length;
          console.log(
            `[${assets.assetToName(
              asset
            )}] Cranked ${numCranked} events for market ${market.marketIndex}`
          );
        }
      } catch (e) {
        console.error(`${e}`);
      }
      crankingMarkets[market.marketIndex] = false;
    }
  });
}

/**
 * Iteratively cranks each market event queue.
 * Allows an optional argument for `throttleMs` which is the duration it will sleep after each market crank.
 */
async function crankExchangeThrottled(
  asset: assets.Asset,
  liveOnly: boolean,
  throttleMs: number
) {
  let marketsToCrank: Market[] = getMarketsToCrank(asset, liveOnly);
  for (var i = 0; i < marketsToCrank.length; i++) {
    let market = marketsToCrank[i];
    let eventQueue = await market.serumMarket.loadEventQueue(
      Exchange.provider.connection
    );
    if (eventQueue.length > 0 && !crankingMarkets[market.marketIndex]) {
      crankingMarkets[market.marketIndex] = true;
      try {
        while (eventQueue.length != 0) {
          try {
            await utils.crankMarket(asset, market.marketIndex);
          } catch (e) {
            console.error(
              `Cranking failed on market ${market.marketIndex}, ${e}`
            );
          }

          let currLength = eventQueue.length;

          eventQueue = await market.serumMarket.loadEventQueue(
            Exchange.provider.connection
          );

          let numCranked = currLength - eventQueue.length;
          console.log(
            `[${assets.assetToName(
              asset
            )}] Cranked ${numCranked} events for market ${market.marketIndex}`
          );
        }
      } catch (e) {
        console.error(`${e}`);
      }
      crankingMarkets[market.marketIndex] = false;
      await sleep(throttleMs);
    }
  }
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
    let fundingAccounts = new Map<assets.Asset, PublicKey[]>();
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

/**
 * Rebalances the zeta vault and the insurance vault to ensure consistent platform security.
 * Checks all margin accounts for non-zero rebalance amounts and rebalances them all.
 */
async function rebalanceInsuranceVault(asset: assets.Asset) {
  let accs: any[] = await Exchange.program.account.marginAccount.all();
  let remainingAccounts: any[] = new Array();
  for (let i = 0; i < accs.length; i++) {
    let marginAccount = accs[i].account as programTypes.MarginAccount;
    if (marginAccount.rebalanceAmount.toNumber() != 0) {
      remainingAccounts.push({
        pubkey: accs[i].publicKey,
        isSigner: false,
        isWritable: true,
      });
    }
  }
  console.log(
    `[${assets.assetToName(asset)}] [REBALANCE INSURANCE VAULT] for ${
      remainingAccounts.length
    } accounts.`
  );
  try {
    await Exchange.rebalanceInsuranceVault(asset, remainingAccounts);
  } catch (e) {
    console.error("Rebalance insurance vault error on transaction!");
  }
}

main().catch(console.error.bind(console));

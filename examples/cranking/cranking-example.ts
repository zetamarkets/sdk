require("dotenv").config();

import {
  Wallet,
  Exchange,
  Network,
  utils,
  programTypes,
  constants,
} from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";

const NETWORK_URL = process.env["network_url"]!;
const PROGRAM_ID = new PublicKey(process.env["program_id"]);
let crankingMarkets = new Array(constants.ACTIVE_MARKETS).fill(false);
console.log(NETWORK_URL);

async function main() {
  // Generate a new keypair for wallet otherwise load from a private key.
  const userKey = Keypair.generate();
  const wallet = new Wallet(userKey);

  // Create a solana web3 connection to devnet.
  const connection = new Connection(NETWORK_URL, utils.defaultCommitment());

  // Airdropping SOL.
  await connection.requestAirdrop(wallet.publicKey, 100000000);

  // We load the exchange with a valid wallet containing SOL to call permissionless zeta functions.
  await Exchange.load(
    PROGRAM_ID,
    Network.DEVNET,
    connection,
    utils.defaultCommitment(),
    wallet,
    // ThrottleMs - increase if you are running into rate limit issues on startup.
    0
  );

  // Display state of zeta markets
  setInterval(
    async function () {
      utils.displayState();
    },
    process.env.DISPLAY_STATE_INTERVAL
      ? parseInt(process.env.DISPLAY_STATE_INTERVAL)
      : 5000
  );

  // Crank all markets.
  setInterval(
    async function () {
      await crankExchange(true);
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

  // Retreat pricing on markets
  setInterval(
    async function () {
      await retreatMarketNodes();
    },
    process.env.RETREAT_MARKET_NODES_INTERVAL
      ? parseInt(process.env.RETREAT_MARKET_NODES_INTERVAL)
      : 10000
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
 * This calls zeta's permissinless update pricing function through the Exchange object.
 * Cranks zeta's on-chain pricing ensuring all our greeks and theos are up-to-date.
 */
async function updatePricing() {
  // Get relevant expiry indices.
  let indicesToCrank = [];
  for (var i = 0; i < Exchange.markets.expirySeries.length; i++) {
    let expirySeries = Exchange.markets.expirySeries[i];
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
        console.log(`Update pricing index ${index}`);
        await Exchange.updatePricing(index);
      } catch (e) {
        console.error(`Index ${index}: Update pricing failed. ${e}`);
      }
    })
  );
}

/**
 * This calls zeta's permissinless retreat market nodes function through the Exchange object.
 * Cranks zeta's on-chain volatility, retreat and interest functionality similiar to update pricing.
 */
async function retreatMarketNodes() {
  // Get relevant expiry indices.
  let indicesToRetreat = [];
  for (var i = 0; i < Exchange.markets.expirySeries.length; i++) {
    if (Exchange.markets.expirySeries[i].isLive()) {
      indicesToRetreat.push(i);
    }
  }
  await Promise.all(
    indicesToRetreat.map(async (index) => {
      try {
        console.log(`Retreating index ${index}`);
        await Exchange.retreatMarketNodes(index);
      } catch (e) {
        console.error(`Index ${index}: Retreat market nodes failed. ${e}`);
      }
    })
  );
}

/**
 * cranks the serum dex event queue for each zeta market. This will process trades that consist of maker fills.
 * All other events are atomically processed at time of call such as taker fills and cancels.
 * Functionality here will keep track of markets that are currently being cranked, markets that have empty event queues
 * as well as allwoing specification of whether only live markets are being cranked.
 * This will flush event queues completely upon call.
 */
async function crankExchange(liveOnly: boolean) {
  let marketsToCrank = [];
  if (liveOnly) {
    let liveExpiryIndices = Exchange.markets.getTradeableExpiryIndices();
    liveExpiryIndices.map(async (index) => {
      marketsToCrank.push(Exchange.markets.getMarketsByExpiryIndex(index));
    });
    marketsToCrank = marketsToCrank.flat(1);
  } else {
    marketsToCrank = Exchange.markets.markets;
  }
  marketsToCrank.map(async (market) => {
    let eventQueue = await market.serumMarket.loadEventQueue(
      Exchange.provider.connection
    );

    if (eventQueue.length > 0 && !crankingMarkets[market.marketIndex]) {
      crankingMarkets[market.marketIndex] = true;
      try {
        while (eventQueue.length != 0) {
          try {
            await utils.crankMarket(market.marketIndex);
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
            `Cranked ${numCranked} events for market ${market.marketIndex}`
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
 * Rebalances the zeta vault and the insurance vault to ensure consistent platform security.
 * Checks all margin accounts for non-zero rebalance amounts and rebalances them all.
 */
async function rebalanceInsuranceVault() {
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
    `[REBALANCE INSURANCE VAULT] for ${remainingAccounts.length} accounts.`
  );
  try {
    await Exchange.rebalanceInsuranceVault(remainingAccounts);
  } catch (e) {
    this.alert("Rebalance insurance vault error on transaction!", true);
  }
}

main().catch(console.error.bind(console));

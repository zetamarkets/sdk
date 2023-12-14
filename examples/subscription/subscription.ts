require("dotenv").config();

import {
  Exchange,
  Network,
  utils,
  types,
  programTypes,
  subscription,
  constants,
  CrossClient,
} from "@zetamarkets/sdk";

import { PublicKey, Connection } from "@solana/web3.js";
import { Asset } from "@zetamarkets/sdk/dist/constants";

const NETWORK_URL = process.env["network_url"]!;

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

async function main() {
  // Create a solana web3 connection to devnet.
  const connection = new Connection(NETWORK_URL, "confirmed");

  const LOAD_CONFIG = {
    connection,
    opts: utils.commitmentConfig('processed'),
    network,
    throttleMs: 0,
    loadFromStore: true,
    // A really high amount, so the midpoint doesn't go whack if rpcs breaks
    // see: https://sierra-mountain.slack.com/archives/C046V1K4ZM2/p1700576227100309
    TIFBufferSeconds: 10000,
  };

  await Exchange.load(
    LOAD_CONFIG,
    // Exchange wallet can be ignored for normal clients.
    undefined
  );

  while (!Exchange.isInitialized) {
    await utils.sleep(100);
  }

  Exchange.getPerpMarket(Asset.SOL).subscribeOrderbook(() => console.log('Orderbook updated'));


  while (true) {
    const orderbook = Exchange.getOrderbook(Asset.SOL);
    console.log("Orderbook", `${orderbook.bids[0]?.price} @ ${orderbook.bids[0]?.size}`, `${orderbook.asks[0]?.price} @ ${orderbook.asks[0]?.size}`);
    
    await utils.sleep(300);
  }

 

  // Close to end the websockets.
  // await Exchange.close();
}

main().catch(console.error.bind(console));

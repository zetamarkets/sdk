require("dotenv").config();

import {
  Wallet,
  Client,
  Exchange,
  Network,
  utils,
  types,
  assets,
  events,
  constants,
} from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import fetch from "node-fetch";

const NETWORK_URL = process.env["network_url"]!;
const SERVER_URL = process.env["server_url"];
const STARTING_BALANCE = 5_000;

async function exchangeCallback(
  asset: assets.Asset,
  _eventType: events.EventType,
  _data: any
) {
  console.log(`[ExchangeCallback] Asset=${assets.assetToName(asset)}`);
}

async function clientCallback(
  asset: assets.Asset,
  _eventType: events.EventType,
  _data: any
) {
  console.log(`[ClientCallback] Asset=${assets.assetToName(asset)}`);
}

async function main() {
  // Generate a new keypair for wallet otherwise load from a private key.
  // const userKey = Keypair.generate();

  // Loads the private key in .env
  const userKey = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(Buffer.from(process.env.private_key!).toString()))
  );

  const wallet = new Wallet(userKey);

  // Create a solana web3 connection to devnet.
  const connection: Connection = new Connection(NETWORK_URL, "confirmed");

  // Airdropping SOL.
  // await connection.requestAirdrop(wallet.publicKey, 100_000_000);

  const loadExchangeConfig = types.defaultLoadExchangeConfig(
    Network.MAINNET,
    connection,
    assets.allAssets(),
    utils.defaultCommitment(),
    0,
    true
  );

  // await fetch(`${SERVER_URL}/faucet/USDC`, {
  //   method: "post",
  //   body: JSON.stringify({
  //     key: wallet.publicKey.toString(),
  //     amount: 10_000,
  //   }),
  //   headers: { "Content-Type": "application/json" },
  // });

  await Exchange.load(
    loadExchangeConfig
    // , wallet
    // , exchangeCallback
  );

  // console.log(Exchange.getOrderbook(assets.Asset.SOL, constants.PERP_INDEX));
  // console.log(Exchange.getOrderbook(assets.Asset.BTC, constants.PERP_INDEX));
  // console.log(Exchange.getOrderbook(assets.Asset.ETH, constants.PERP_INDEX));
  // console.log(Exchange.getOrderbook(assets.Asset.APT, constants.PERP_INDEX));
  // console.log(Exchange.getOrderbook(assets.Asset.ARB, constants.PERP_INDEX));

  // Exchange.getAllSubExchanges().forEach(async (se) => {
  //   await se.updateLiveSerumMarketsIfNeeded(0);
  // });

  const client = await Client.load(
    connection,
    wallet,
    undefined
    // , clientCallback
  );

  console.log(
    "Default, mark price =",
    Exchange.getMarkPrice(assets.Asset.SOL, constants.PERP_INDEX)
  );
  console.log(
    client.getMarginAccountState(assets.Asset.SOL, undefined, false)
      .unrealizedPnl
  );
  console.log("Include fees");
  console.log(
    client.getMarginAccountState(assets.Asset.SOL, undefined, true)
      .unrealizedPnl
  );

  console.log("Execution price = 21, no fees");
  console.log(
    client.getMarginAccountState(assets.Asset.SOL, 21, false).unrealizedPnl
  );
  console.log("Execution price = 21, include fees");
  console.log(
    client.getMarginAccountState(assets.Asset.SOL, 21, true).unrealizedPnl
  );

  console.log("Execution price = 20, no fees");
  console.log(
    client.getMarginAccountState(assets.Asset.SOL, 21, false).unrealizedPnl
  );
  console.log("Execution price = 20, include fees");
  console.log(
    client.getMarginAccountState(assets.Asset.SOL, 21, true).unrealizedPnl
  );

  // await client.deposit(
  //   assets.Asset.BTC,
  //   utils.convertDecimalToNativeInteger(STARTING_BALANCE)
  // );

  // utils.displayState();

  // // Show current orderbook for a market.
  // const index = constants.PERP_INDEX;
  // await Exchange.updateOrderbook(assets.Asset.BTC, index);
  // console.log(`BTC market ${index} orderbook:`);
  // console.log(Exchange.getOrderbook(assets.Asset.BTC, index));

  // // Place bid orders
  // await client.placeOrder(
  //   assets.Asset.BTC,
  //   index,
  //   utils.convertDecimalToNativeInteger(0.1),
  //   utils.convertDecimalToNativeLotSize(2),
  //   types.Side.BID,
  //   { tifOptions: {}, orderType: types.OrderType.LIMIT } // Extra optional parameters
  // );

  // // See our order in the orderbook.
  // await Exchange.updateOrderbook(assets.Asset.BTC, index);
  // console.log(`BTC market ${index} orderbook after our order:`);
  // console.log(Exchange.getOrderbook(assets.Asset.BTC, index));

  // // See our positions
  // await client.updateState(assets.Asset.BTC);
  // console.log(
  //   "BTC margin account positions:",
  //   client.getMarginPositions(assets.Asset.BTC)
  // );

  // // Check mark prices for the product.
  // console.log(
  //   "BTC mark price:",
  //   Exchange.getMarkPrice(assets.Asset.BTC, index)
  // );

  // // Calculate user margin account state.
  // let marginAccountState = client.getMarginAccountState(assets.Asset.BTC);
  // console.log("BTC Margin account state:", marginAccountState);
}

main().catch(console.error.bind(console));

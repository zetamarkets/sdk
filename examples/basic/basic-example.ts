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
} from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair, SOLANA_SCHEMA } from "@solana/web3.js";
import fetch from "node-fetch";
import { airdropUsdc } from "../liquidator-example/src/utils";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const NETWORK_URL = process.env["network_url"]!;
const SERVER_URL = process.env["server_url"];
const PROGRAM_ID = new PublicKey(process.env["program_id"]!);
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

export async function welcomeServer() {
  return await fetch(`${process.env.server_url}/`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
  });
}

export async function orderbookRequest(
  asset: assets.Asset,
  marketIndex: number
) {
  let text =
    `${process.env.server_url}/orderbook?asset=` +
    assets.assetToName(asset) +
    "&marketIndex=" +
    marketIndex;
  try {
    return await fetch(text, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log(e);
  }
}

async function main() {
  // Loads the private key in .env
  const privateKey = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(Buffer.from(process.env.private_key!).toString()))
  );

  const wallet = new Wallet(privateKey);

  // Create a solana web3 connection to devnet.
  const connection: Connection = new Connection(NETWORK_URL, "confirmed");

  console.time("Full load + placeorder");
  console.time("SubExchange load");
  await Exchange.load(
    assets.allAssets(),
    PROGRAM_ID,
    Network.DEVNET,
    connection,
    utils.defaultCommitment(),
    undefined,
    undefined
    // exchangeCallback
  );
  console.timeEnd("SubExchange load");
  console.time("SubClient load");
  const client = await Client.load(
    connection,
    wallet,
    undefined
    // clientCallback
  );
  console.timeEnd("SubClient load");

  // await mint(
  //   connection,
  //   wallet,
  //   privateKey,
  //   client,
  //   assets.Asset.SOL,
  //   true
  // );
  // await mint(
  //   connection,
  //   wallet,
  //   privateKey,
  //   client,
  //   assets.Asset.BTC,
  //   true
  // );

  utils.displayState();

  // Show current orderbook for a market.
  const index = 10;
  console.time("Update orderbook");
  await Exchange.updateOrderbook(assets.Asset.SOL, index);
  await Exchange.updateOrderbook(assets.Asset.BTC, index);
  console.timeEnd("Update orderbook");

  console.log(`SOL market ${index} orderbook:`);
  console.log(Exchange.getOrderbook(assets.Asset.SOL, index));
  console.log(`BTC market ${index} orderbook:`);
  console.log(Exchange.getOrderbook(assets.Asset.BTC, index));

  // Place bid orders.
  console.time("Cancel orders");
  await client.cancelAllOrders(assets.Asset.SOL);
  await client.cancelAllOrders(assets.Asset.BTC);
  console.timeEnd("Cancel orders");
  console.time("Place order");

  await client.placeOrder(
    assets.Asset.SOL,
    index,
    utils.convertDecimalToNativeInteger(0.1),
    100,
    types.Side.BID,
    types.OrderType.LIMIT
  );
  await client.placeOrder(
    assets.Asset.BTC,
    index,
    utils.convertDecimalToNativeInteger(0.1),
    200,
    types.Side.BID,
    types.OrderType.LIMIT
  );
  console.timeEnd("Place order");
  console.timeEnd("Full load + placeorder");

  console.time("Update state");

  await client.updateState(assets.Asset.SOL);
  await client.updateState(assets.Asset.BTC);
  console.log("Margin account positions:", client.marginPositions);
  console.log("Spread account positions:", client.spreadPositions);

  console.timeEnd("Update state");

  // See our order in the orderbook.
  // NOTE: Orderbook depth is capped to what is set, default = 5.
  // Set via `Exchange.getSubExchange(assets.Asset.SOL).markets.orderbookDepth = N`.

  await Exchange.updateOrderbook(assets.Asset.SOL, index);
  await Exchange.updateOrderbook(assets.Asset.BTC, index);

  console.log(`SOL market ${index} orderbook after our orders:`);
  console.log(Exchange.getOrderbook(assets.Asset.SOL, index));
  console.log(`BTC market ${index} orderbook after our orders:`);
  console.log(Exchange.getOrderbook(assets.Asset.BTC, index));

  // Avoid a self-trade
  // Alternatively call client.cancelAllOrdersAllAssets()
  await client.cancelAllOrdersNoError(assets.Asset.SOL);
  await client.cancelAllOrdersNoError(assets.Asset.BTC);

  // Place an order in cross with offers to get a position.
  await client.placeOrder(
    assets.Asset.BTC,
    index,
    utils.convertDecimalToNativeInteger(0.2),
    100,
    types.Side.ASK,
    types.OrderType.LIMIT
  );

  await client.updateState(assets.Asset.SOL);
  await client.updateState(assets.Asset.BTC);
  console.log("Margin account positions:", client.marginPositions);
  console.log("Spread account positions:", client.spreadPositions);

  // Check mark prices for the product.
  console.log(
    "SOL mark price:",
    Exchange.getMarkPrice(assets.Asset.SOL, index),
    "BTC mark price:",
    Exchange.getMarkPrice(assets.Asset.BTC, index)
  );

  // Calculate user margin account state.
  let marginAccountStateSol = client.getMarginAccountState(assets.Asset.SOL);
  let marginAccountStateBtc = client.getMarginAccountState(assets.Asset.BTC);

  console.log("BTC Margin account state:", marginAccountStateSol);
  console.log("SOL Margin account state:", marginAccountStateBtc);
}

main().catch(console.error.bind(console));

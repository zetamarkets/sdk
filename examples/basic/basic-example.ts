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
  asset: constants.Asset,
  _eventType: events.EventType,
  _data: any
) {
  console.log(`[ExchangeCallback] Asset=${assets.assetToName(asset)}`);
}

async function clientCallback(
  asset: constants.Asset,
  _eventType: events.EventType,
  _data: any
) {
  console.log(`[ClientCallback] Asset=${assets.assetToName(asset)}`);
}

async function main() {
  // Generate a new keypair for wallet otherwise load from a private key.
  const userKey = Keypair.generate();

  // Loads the private key in .env
  // const userKey = Keypair.fromSecretKey(
  //   new Uint8Array(JSON.parse(Buffer.from(process.env.private_key!).toString()))
  // );

  const wallet = new Wallet(userKey);

  // Create a solana web3 connection to devnet.
  const connection: Connection = new Connection(NETWORK_URL, "confirmed");

  // Airdropping SOL.
  await connection.requestAirdrop(wallet.publicKey, 100_000_000);

  const loadExchangeConfig = types.defaultLoadExchangeConfig(
    Network.DEVNET,
    connection,
    utils.defaultCommitment(),
    0,
    true
  );

  await fetch(`${SERVER_URL}/faucet/USDC`, {
    method: "post",
    body: JSON.stringify({
      key: wallet.publicKey.toString(),
      amount: 10_000,
    }),
    headers: { "Content-Type": "application/json" },
  });

  await Exchange.load(
    loadExchangeConfig
    // , wallet
    // , exchangeCallback
  );

  Exchange.getAllSubExchanges().forEach(async (se) => {
    await se.updatePerpSerumMarketIfNeeded(0);
  });

  const client = await Client.load(
    connection,
    wallet,
    undefined
    // , clientCallback
  );

  let tradingAsset = constants.Asset.APT;

  await client.deposit(
    tradingAsset,
    utils.convertDecimalToNativeInteger(STARTING_BALANCE)
  );

  utils.displayState();

  // Show current orderbook for a market.
  const index = constants.PERP_INDEX;
  await Exchange.updateOrderbook(tradingAsset);
  console.log(`${tradingAsset} Market ${index} orderbook:`);
  console.log(Exchange.getOrderbook(tradingAsset));

  // Place bid orders
  await client.placeOrder(
    tradingAsset,
    index,
    utils.convertDecimalToNativeInteger(0.1),
    utils.convertDecimalToNativeLotSize(2),
    types.Side.BID,
    { tifOptions: {}, orderType: types.OrderType.LIMIT } // Extra optional parameters
  );

  // See our order in the orderbook.
  await Exchange.updateOrderbook(tradingAsset);
  console.log(`${tradingAsset} Market ${index} orderbook after our order:`);
  console.log(Exchange.getOrderbook(tradingAsset));

  // See our positions
  await client.updateState(tradingAsset);
  console.log(
    `${tradingAsset} margin account positions: ${client.getMarginPositions(
      tradingAsset
    )}`
  );

  // Check mark prices for the product.
  console.log(
    `${tradingAsset} Mark price: ${Exchange.getMarkPrice(tradingAsset)}`
  );

  // Calculate user margin account state.
  let marginAccountState = client.getMarginAccountState(tradingAsset);
  console.log(`${tradingAsset} Margin account state:`, marginAccountState);
}

main().catch(console.error.bind(console));

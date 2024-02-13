require("dotenv").config();

import {
  Wallet,
  CrossClient,
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

  let loadExchangeConfig = types.defaultLoadExchangeConfig(
    Network.DEVNET,
    connection,
    utils.defaultCommitment(),
    0,
    true
  );

  // Optionally add a throttle for startup load to prevent rate-limiting on free-tier RPCs
  // loadExchangeConfig.throttleMs = 1000;

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

  const client = await CrossClient.load(
    connection,
    wallet,
    undefined
    // , clientCallback
  );

  let tradingAsset = constants.Asset.APT;

  await client.deposit(utils.convertDecimalToNativeInteger(STARTING_BALANCE));

  utils.displayState();

  // Show current orderbook for a market.
  console.log(`${tradingAsset} Market orderbook:`);
  console.log(Exchange.getOrderbook(tradingAsset));

  // Place bid orders
  await client.placeOrder(
    tradingAsset,
    utils.convertDecimalToNativeInteger(0.1),
    utils.convertDecimalToNativeLotSize(2),
    types.Side.BID,
    { tifOptions: {}, orderType: types.OrderType.LIMIT } // Extra optional parameters
  );

  // Allow orderbook to update (it uses a websocket subscription)
  await utils.sleep(1000);

  // See our order in the orderbook.
  console.log(`${tradingAsset} Market orderbook after our order:`);
  console.log(Exchange.getOrderbook(tradingAsset));

  // See our positions
  await client.updateState();
  console.log(
    `${tradingAsset} positions: ${client.getPositions(tradingAsset)}`
  );

  // Check mark prices for the product.
  console.log(
    `${tradingAsset} Mark price: ${Exchange.getMarkPrice(tradingAsset)}`
  );

  // Calculate user account state.
  let accountState = client.getAccountState();
  console.log(`${tradingAsset} Account state:`, accountState);
}

main().catch(console.error.bind(console));

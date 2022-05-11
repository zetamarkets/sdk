require("dotenv").config();

import {
  Wallet,
  Client,
  Exchange,
  Network,
  utils,
  types,
} from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import fetch from "node-fetch";

const NETWORK_URL = process.env["network_url"]!;
const SERVER_URL = process.env["server_url"];
const PROGRAM_ID = new PublicKey(process.env["program_id"]);
const STARTING_BALANCE = 10_000;

console.log(NETWORK_URL);

async function main() {
  // Generate a new keypair for wallet otherwise load from a private key.
  const userKey = Keypair.generate();
  const wallet = new Wallet(userKey);

  // Create a solana web3 connection to devnet.
  const connection: Connection = new Connection(NETWORK_URL, "confirmed");

  // Airdropping SOL.
  await connection.requestAirdrop(wallet.publicKey, 100000000);

  await fetch(`${SERVER_URL}/faucet/USDC`, {
    method: "post",
    body: JSON.stringify({
      key: wallet.publicKey.toString(),
      amount: 10_000,
    }),
    headers: { "Content-Type": "application/json" },
  });

  await Exchange.load(
    PROGRAM_ID,
    Network.DEVNET,
    connection,
    utils.defaultCommitment(),
    // Exchange wallet can be ignored for normal clients.
    undefined,
    // ThrottleMs - increase if you are running into rate limit issues on startup.
    0
  );

  const client = await Client.load(
    connection,
    wallet,
    utils.defaultCommitment(),
    undefined
  );

  await client.deposit(utils.convertDecimalToNativeInteger(STARTING_BALANCE));

  // Display existing exchange state.
  utils.displayState();

  // Show current orderbook for a market.
  // Pick INDEX: 6 KIND: call STRIKE: 235

  const index = 2;
  await Exchange.markets.markets[index].updateOrderbook();
  console.log(Exchange.markets.markets[index].orderbook);

  const orderPrice = utils.convertDecimalToNativeInteger(8);
  const orderLots = 1;

  // Place a bid order.
  await client.placeOrder(
    Exchange.markets.markets[index].address,
    orderPrice,
    orderLots,
    types.Side.BID
  );

  // See our orders.
  await client.updateState();
  console.log(client.orders);

  // See our order in the orderbook.
  // NOTE: Orderbook depth is capped to what is set, default = 5.
  // Set via `Exchange.markets.orderbookDepth = N`.
  console.log(Exchange.markets.markets[index].orderbook);

  // Place an order in cross with offers to get a position.
  await client.placeOrder(
    Exchange.markets.markets[index].address,
    utils.convertDecimalToNativeInteger(10),
    orderLots,
    types.Side.BID
  );

  await client.updateState();
  console.log(client.positions);

  // Check mark prices for the product.
  console.log(Exchange.getMarkPrice(index));

  // Calculate user margin account state.
  let marginAccountState = Exchange.riskCalculator.getMarginAccountState(
    client.marginAccount
  );
  console.log(marginAccountState);
}

main().catch(console.error.bind(console));

require("dotenv").config();

import { Wallet, Client, Network, utils, types } from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair, SOLANA_SCHEMA } from "@solana/web3.js";
import fetch from "node-fetch";
import { airdropUsdc } from "../liquidator-example/src/utils";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Parent } from "../../src/parent";
import { Asset } from "../../src/assets";
import { Exchange } from "../../src/exchange";

const NETWORK_URL = process.env["network_url"]!;
const SERVER_URL = process.env["server_url"];
const PROGRAM_ID = new PublicKey(process.env["program_id"]);
const STARTING_BALANCE = 10_000;

console.log(NETWORK_URL);
let usdcToken = null;

async function faucetUSDC(amount: number, key: String, mintAuthority: Keypair) {
  let userKey = null;

  try {
    userKey = new PublicKey(key);
    amount = utils.convertDecimalToNativeInteger(amount);
    let associatedAccount = await usdcToken.getOrCreateAssociatedAccountInfo(
      userKey
    );
    if (amount > utils.convertDecimalToNativeInteger(10_000)) {
      let err = "Cannot mint more than $10_000 USDC";
      console.log(`USDC airdrop failed: ${err}`);
      return;
    }

    if (
      associatedAccount.amount.toNumber() >
      utils.convertDecimalToNativeInteger(10_000)
    ) {
      let err = "User has more than $10_000 USDC";
      console.log(`USDC airdrop failed: ${err}`);
      return;
    }
    await usdcToken.mintTo(
      associatedAccount.address,
      mintAuthority.publicKey,
      [mintAuthority],
      amount
    );
    associatedAccount = await usdcToken.getAccountInfo(
      associatedAccount.address
    );
  } catch (e) {
    console.log(`USDC airdrop failed: ${e}`);
    return;
  }
  console.log(`Airdropped $${amount} USDC for ${userKey.toString()}.`);
}

async function main() {
  // Loads the private key in .env
  const privateKey = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(Buffer.from(process.env.private_key).toString()))
  );
  const mintAuthority = Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(Buffer.from(process.env.mint_authority).toString())
    )
  );
  const wallet = new Wallet(privateKey);

  // Create a solana web3 connection to devnet.
  const connection: Connection = new Connection(NETWORK_URL, "confirmed");

  // Airdropping SOL.
  await connection.requestAirdrop(wallet.publicKey, 100000000);

  // await fetch(`${SERVER_URL}/faucet/USDC`, {
  //   method: "post",
  //   body: JSON.stringify({
  //     key: wallet.publicKey.toString(),
  //     amount: 10_000,
  //   }),
  //   headers: { "Content-Type": "application/json" },
  // });

  let exchangeBtc = new Exchange();
  let exchangeSol = new Exchange();
  let parent = new Parent();
  await exchangeBtc.load(
    PROGRAM_ID,
    Network.DEVNET,
    Asset.BTC,
    connection,
    utils.defaultCommitment(),
    // Exchange wallet can be ignored for normal clients.
    undefined,
    // ThrottleMs - increase if you are running into rate limit issues on startup.
    0
  );
  await exchangeSol.load(
    PROGRAM_ID,
    Network.DEVNET,
    Asset.SOL,
    connection,
    utils.defaultCommitment(),
    // Exchange wallet can be ignored for normal clients.
    undefined,
    // ThrottleMs - increase if you are running into rate limit issues on startup.
    0
  );

  await parent.addExchange(Asset.SOL, exchangeSol);
  await parent.addExchange(Asset.BTC, exchangeBtc);

  const clientSol = await Client.load(
    connection,
    wallet,
    exchangeSol,
    utils.defaultCommitment(),
    undefined
  );

  const clientBtc = await Client.load(
    connection,
    wallet,
    exchangeBtc,
    utils.defaultCommitment(),
    undefined
  );

  /*
  const [vault, _vaultNonce] = await utils.getVault(
    exchangeSol.programId,
    exchangeSol.zetaGroupAddress
  );
  let usdcMintAddress = await utils.getTokenMint(connection, vault);
  usdcToken = new Token(
    connection,
    usdcMintAddress,
    TOKEN_PROGRAM_ID,
    privateKey
  );

  await faucetUSDC(10_000, wallet.publicKey.toString(), mintAuthority);

  await clientSol.deposit(
    utils.convertDecimalToNativeInteger(STARTING_BALANCE)
  );

  // Display existing exchange state.
  utils.displayState(exchangeSol);
  utils.displayState(exchangeBtc);

  // Show current orderbook for a market.
  // Pick INDEX: 6 KIND: call STRIKE: 235

  const index = 2;
  await exchangeSol.markets.markets[index].updateOrderbook();
  await exchangeBtc.markets.markets[index].updateOrderbook();

  console.log(exchangeSol.markets.markets[index].orderbook);
  console.log(exchangeBtc.markets.markets[index].orderbook);

  const orderPrice = utils.convertDecimalToNativeInteger(8);
  const orderLots = 1;

  */

  /*

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

  */
}

main().catch(console.error.bind(console));

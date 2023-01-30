require("dotenv").config();

import {
  Wallet,
  Client,
  Exchange,
  Network,
  utils,
  types,
  assets,
} from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import fetch from "node-fetch";

const NETWORK_URL = process.env["network_url"]!;
const SERVER_URL = process.env["server_url"];
const PROGRAM_ID = new PublicKey(process.env["program_id"]!);
const STARTING_BALANCE = 10_000;
const ASSETS = [assets.Asset.SOL];
const USER_KEY = Keypair.generate();
const WALLET = new Wallet(USER_KEY);
const CONNECTION: Connection = new Connection(NETWORK_URL, "confirmed");

async function main() {
  // Airdropping SOL.
  await CONNECTION.requestAirdrop(WALLET.publicKey, 1_00000000);

  await fetch(`${SERVER_URL}/faucet/USDC`, {
    method: "post",
    body: JSON.stringify({
      key: WALLET.publicKey.toString(),
      amount: 10_000,
    }),
    headers: { "Content-Type": "application/json" },
  });

  await Exchange.load(
    ASSETS,
    PROGRAM_ID,
    Network.DEVNET,
    CONNECTION,
    utils.defaultCommitment(),
    undefined,
    undefined
  );

  const client = await Client.load(
    CONNECTION,
    WALLET,
    undefined,
    undefined,
    undefined,
    undefined,
    true
  );

  await client.deposit(
    assets.Asset.BTC,
    utils.convertDecimalToNativeInteger(STARTING_BALANCE)
  );

  utils.displayState();
}

main().catch(console.error.bind(console));

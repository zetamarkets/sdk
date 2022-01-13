require("dotenv").config();

import * as anchor from "@project-serum/anchor";
import {
  Wallet,
  Exchange,
  Network,
  utils,
  constants,
  programTypes,
} from "@zetamarkets/sdk";
import { Commitment, PublicKey, Connection, Keypair } from "@solana/web3.js";
import fetch from "node-fetch";

const NETWORK_URL = process.env["network_url"]!;
const SERVER_URL = process.env["server_url"];
const PROGRAM_ID = new PublicKey(process.env["program_id"]);
const STARTING_BALANCE = 10_000;
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

console.log(NETWORK_URL);

async function main() {
  // Create a solana web3 connection to devnet.
  const connection: Connection = new Connection(NETWORK_URL, "confirmed");

  await Exchange.load(
    PROGRAM_ID,
    network,
    connection,
    utils.defaultCommitment(),
    // Exchange wallet can be ignored for normal clients.
    undefined,
    // ThrottleMs - increase if you are running into rate limit issues on startup.
    0
  );

  // Friday 8am UTC - 7th of January
  let expiryTs = 1641542400;

  let underlyingMint = constants.MINTS.SOL;

  let [settlementAddress, _] = await utils.getSettlement(
    Exchange.programId,
    underlyingMint,
    new anchor.BN(expiryTs)
  );

  let settlementAccount =
    (await Exchange.program.account.settlementAccount.fetch(
      settlementAddress
    )) as programTypes.SettlementAccount;

  let expiryDate = new Date(expiryTs * 1000);

  console.log(`Displaying strikes for expiration @ ${expiryDate}`);
  for (var i = 0; i < settlementAccount.strikes.length; i++) {
    // This market index is the index in the given expiry slice.
    console.log(
      `Market index: ${i} = ${utils.convertNativeBNToDecimal(
        settlementAccount.strikes[i]
      )}`
    );
  }

  let settlementPrice = utils.convertNativeBNToDecimal(
    settlementAccount.settlementPrice
  );

  console.log(`Settlement price: ${settlementPrice}`);

  await Exchange.close();
}

main().catch(console.error.bind(console));

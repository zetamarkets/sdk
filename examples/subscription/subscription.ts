require("dotenv").config();

import {
  Exchange,
  Network,
  utils,
  programTypes,
  subscription,
} from "@zetamarkets/sdk";

import { PublicKey, Connection } from "@solana/web3.js";

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

async function main() {
  // Create a solana web3 connection to devnet.
  const connection = new Connection(NETWORK_URL, "confirmed");

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

  subscription.subscribeProgramAccounts<programTypes.MarginAccount>(
    subscription.ProgramAccountType.MarginAccount,
    async (
      data: subscription.AccountSubscriptionData<programTypes.MarginAccount>
    ) => {
      console.log(data);
    }
  );

  await utils.sleep(10_000);

  // Close to end the websockets.
  await Exchange.close();
}

main().catch(console.error.bind(console));

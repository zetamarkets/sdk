require("dotenv").config();

import {
  Exchange,
  Network,
  utils,
  types,
  programTypes,
  subscription,
  constants,
} from "@zetamarkets/sdk";

import { PublicKey, Connection } from "@solana/web3.js";

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

  const loadExchangeConfig = types.defaultLoadExchangeConfig(
    network,
    connection,
    utils.defaultCommitment(),
    0, // ThrottleMs - increase if you are running into rate limit issues on startup.
    true
  );

  await Exchange.load(
    loadExchangeConfig,
    // Exchange wallet can be ignored for normal clients.
    undefined
  );

  subscription.subscribeProgramAccounts<programTypes.CrossMarginAccount>(
    types.ProgramAccountType.CrossMarginAccount,
    async (
      data: subscription.AccountSubscriptionData<programTypes.CrossMarginAccount>
    ) => {
      // Here you can filter for only accounts you care about (such as your own)
      console.log(data);
    }
  );

  await utils.sleep(100_000);

  // Close to end the websockets.
  // await Exchange.close();
}

main().catch(console.error.bind(console));

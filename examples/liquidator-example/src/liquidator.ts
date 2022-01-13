require("dotenv").config();
import { Client, Exchange, Network, utils, types } from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import { Wallet } from "@project-serum/anchor";
import {
  cancelAllActiveOrders,
  findAccountsAtRisk,
  findLiquidatableAccounts,
  liquidateAccounts,
} from "./liquidator-utils";
import * as anchor from "@project-serum/anchor";

import { airdropUsdc } from "./utils";

let client: Client;
let scanning: boolean = false;

// Function that will do a few things sequentially.
// 1. Get all margin accounts for the program.
// 2. Cancel all active orders for accounts at risk. (This is required to liquidate an account)
// 3. Naively liquidate all margin accounts at risk up to your own margin account available balance limit.
export async function scanMarginAccounts() {
  // Just early exit if previous scan is still running.
  if (scanning) {
    return;
  }
  console.log(`Scanning margin accounts...`);
  scanning = true;
  let marginAccounts: anchor.ProgramAccount[] =
    await Exchange.program.account.marginAccount.all();
  console.log(`${marginAccounts.length} margin accounts.`);

  let accountsAtRisk = await findAccountsAtRisk(marginAccounts);
  if (accountsAtRisk.length == 0) {
    console.log("No accounts at risk.");
    scanning = false;
    return;
  }

  // We need to cancel all orders on accounts that are at risk
  // before we are able to liquidate them.
  await cancelAllActiveOrders(client, accountsAtRisk);

  // Liquidate the accounts that are under water exclusive of initial
  // margin as cancelling active orders reduces initial margin to 0.
  let liquidatableAccounts: anchor.ProgramAccount[] =
    await findLiquidatableAccounts(accountsAtRisk);

  await liquidateAccounts(client, liquidatableAccounts);

  // Display the latest client state.
  await client.updateState();
  let clientMarginAccountState = Exchange.riskCalculator.getMarginAccountState(
    client.marginAccount
  );
  console.log(
    `Client margin account state: ${JSON.stringify(clientMarginAccountState)}`
  );
  scanning = false;
}

async function main() {
  let connection: Connection = new Connection(process.env.connection, {
    commitment: "confirmed",
    disableRetryOnRateLimit: true,
  });

  // Starting balance for USDC to airdrop.
  const startingBalance = 1_000_000;

  // Set the network for the SDK to use.
  const network = Network.DEVNET;
  const programId = new PublicKey(process.env.program_id);

  // Load user wallet.
  const keypair = Keypair.generate();

  // You can load from your local keypair as well.
  /*
  const keypair = Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(Buffer.from(process.env.private_key!).toString()))
  );
  */

  const wallet = new Wallet(keypair);
  // Add some solana and airdrop some fake USDC.
  if (network == Network.DEVNET) {
    // Airdrop 1 SOL.
    await connection.requestAirdrop(wallet.publicKey, 1_000_000_000);
    await airdropUsdc(wallet.publicKey, startingBalance);
  }

  // Load the SDK Exchange object.
  await Exchange.load(
    programId,
    network,
    connection,
    utils.defaultCommitment(),
    new types.DummyWallet(), // Normal clients don't need to use a real wallet for exchange loading.
    0 // Increase if you are getting rate limited on startup.
  );

  client = await Client.load(connection, wallet, utils.defaultCommitment());

  // The deposit function for client will initialize a margin account for you
  // atomically in the same transaction if you haven't created one already.
  await client.deposit(utils.convertDecimalToNativeInteger(startingBalance));

  setInterval(
    async () => {
      try {
        await scanMarginAccounts();
      } catch (e) {
        console.log(`Scan margin account error: ${e}`);
      }
    },
    process.env.check_interval_ms
      ? parseInt(process.env.check_interval_ms)
      : 5000
  );
}

main().catch(console.error.bind(console));

require("dotenv").config();

import * as anchor from "@zetamarkets/anchor";
import {
  Wallet,
  Exchange,
  Network,
  utils,
  constants,
  programTypes,
  assets,
  types,
} from "@zetamarkets/sdk";
import { PublicKey, Connection } from "@solana/web3.js";

const NETWORK_URL = process.env["network_url"]!;
const asset = assets.Asset.SOL;
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

  const loadExchangeConfig = types.defaultLoadExchangeConfig(
    network,
    connection,
    [asset],
    utils.defaultCommitment(),
    0, // ThrottleMs - increase if you are running into rate limit issues on startup.
    true
  );

  await Exchange.load(
    loadExchangeConfig,
    // Exchange wallet can be ignored for normal clients.
    undefined
  );

  // Friday 8am UTC - 7th of January
  let expiryTs = 1641542400;

  let underlyingMint = constants.MINTS[asset];

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

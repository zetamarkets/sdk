require("dotenv").config();

import { programTypes, Exchange, Network, events } from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import fetch from "node-fetch";

const NETWORK_URL = process.env["network_url"]!;
const PROGRAM_ID = new PublicKey(process.env["program_id"]);

async function callback(eventType: events.EventType, event: any) {
  console.log(`Callback: eventType: ${eventType} ${JSON.stringify(event)}`);
}

async function main() {
  // Create a solana web3 connection to devnet.
  const connection: Connection = new Connection(NETWORK_URL, "finalized");

  await Exchange.load(
    PROGRAM_ID,
    Network.MAINNET,
    connection,
    {
      skipPreflight: false,
      preflightCommitment: "finalized",
      commitment: "finalized",
    },
    // Exchange wallet can be ignored for normal clients.
    undefined,
    // ThrottleMs - increase if you are running into rate limit issues on startup.
    0
  );

  Exchange.program.addEventListener(
    "TradeEvent",
    (event: programTypes.TradeEvent, _slot) => {
      callback(events.EventType.TRADE, event);
    }
  );
}

main().catch(console.error.bind(console));

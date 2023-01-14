import {
  Wallet,
  Client,
  Exchange,
  Network,
  utils,
  types,
  assets,
  events,
} from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import fetch from "node-fetch";

// const NETWORK_URL = "https://zeta.rpcpool.com/kzuQbiYTHUY6xtyvS2y2CvE9";
const NETWORK_URL = "https://ams68.rpcpool.com/a9c963a5743180d4520cb8f0c8cb";
const SERVER_URL = "https://dex-mainnet-webserver.zeta.markets";
const PROGRAM_ID = new PublicKey("ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD");
const STARTING_BALANCE = 5_000;

const chainlink = require("@chainlink/solana-sdk");
require("dotenv").config();

async function main() {
  const userKey = Keypair.fromSecretKey(
    new Uint8Array(
      JSON.parse(
        Buffer.from(
          "[115,114,23,234,58,138,48,150,30,99,131,18,30,252,175,18,113,123,66,219,20,150,127,131,231,117,114,63,198,174,31,56,237,40,242,202,253,220,40,27,243,80,32,215,250,206,128,76,127,212,137,131,153,254,6,223,136,117,191,20,235,252,26,172]"
        ).toString()
      )
    )
  );

  const wallet = new Wallet(userKey);

  const connection: Connection = new Connection(NETWORK_URL, "confirmed");

  await Exchange.load(
    [assets.Asset.SOL, assets.Asset.BTC, assets.Asset.ETH],
    PROGRAM_ID,
    Network.MAINNET,
    connection,
    utils.defaultCommitment(),
    undefined,
    undefined
    // exchangeCallback
  );

  const client = await Client.load(
    connection,
    wallet,
    undefined
    // clientCallback
  );

  const CHAINLINK_FEED_ADDRESS = "B4vR6BW4WpLh1mFs6LL6iqL4nydbmE5Uzaz2LLsoAXqk";
  const CHAINLINK_PROGRAM_ID = new PublicKey(
    "cjg3oHmg9uuPsP8D6g29NWvhySJkdYdAo9D25PRbKXJ"
  );
  const feedAddress = new PublicKey(CHAINLINK_FEED_ADDRESS); //SOL-USD Mainnet Feed

  //load the data feed account
  let dataFeed = await chainlink.OCR2Feed.load(
    CHAINLINK_PROGRAM_ID,
    Exchange.provider
  );
  let listener = null;

  //listen for events agains the price feed, and grab the latest rounds price data
  listener = dataFeed.onRound(feedAddress, (event) => {
    console.log(event);
    console.log(event.observationsTS, event.answer.toNumber());
  });
}

main().catch(console.error.bind(console));

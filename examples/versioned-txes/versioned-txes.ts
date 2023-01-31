require("dotenv").config();

import {
  Wallet,
  Client,
  Exchange,
  Network,
  utils,
  types,
  assets,
  constants,
} from "@zetamarkets/sdk";
import { PublicKey, Connection, Keypair, Transaction } from "@solana/web3.js";
import fetch from "node-fetch";

const NETWORK_URL = process.env["network_url"]!;
const SERVER_URL = process.env["server_url"];
const PROGRAM_ID = new PublicKey(process.env["program_id"]!);
const STARTING_BALANCE = 10_000;
const ASSETS = [assets.Asset.SOL, assets.Asset.BTC, assets.Asset.ETH];
const USER_KEY = Keypair.generate();
const WALLET = new Wallet(USER_KEY);
const CONNECTION: Connection = new Connection(NETWORK_URL, "confirmed");

const MAX_SINGLE_MARKET_PLACE_ORDER_IXS = 13;
const MAX_ALL_PERP_MARKET_PLACE_ORDER_IXS = 9;

async function main() {
  // Airdropping SOL.
  await CONNECTION.requestAirdrop(WALLET.publicKey, 1_000000000);

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

  console.log("client loaded:", client.publicKey.toBase58());

  const amountToDeposit = (STARTING_BALANCE - 1000) / 3;
  await Promise.all(
    ASSETS.map(async (asset) => {
      return await client.deposit(
        asset,
        utils.convertDecimalToNativeInteger(amountToDeposit)
      );
    })
  );

  await utils.sleep(500);

  ASSETS.forEach((asset) => {
    console.log(
      `User margin acc balance for ${asset}: ${
        Exchange.riskCalculator.getMarginAccountState(
          client.getSubClient(asset).marginAccount
        ).balance
      }`
    );
  });

  await Promise.all(
    ASSETS.map(async (asset) => {
      let perpMa = Exchange.getPerpMarket(asset).address;
      return client.initializeOpenOrdersAccount(asset, perpMa);
    })
  );

  let singleMarketTx = new Transaction();
  let subClient = client.getSubClient(ASSETS[0]);
  for (let i = 0; i < MAX_SINGLE_MARKET_PLACE_ORDER_IXS; i++) {
    singleMarketTx.add(
      subClient.createPlaceOrderInstruction(
        constants.PERP_INDEX,
        utils.convertDecimalToNativeInteger(i + 1),
        utils.convertDecimalToNativeLotSize(1),
        types.Side.BID
      )
    );
  }

  await utils.processTransaction(
    client.provider,
    singleMarketTx,
    undefined,
    undefined,
    undefined,
    utils.getZetaLutArr()
  );

  await utils.sleep(2000);

  ASSETS.forEach((asset) => {
    console.log(
      `client has ${client.getOrders(asset).length} orders on ${asset}`
    );
  });

  await client.cancelAllOrders(ASSETS[0]);

  let multiMarketTx = new Transaction();
  ASSETS.forEach((asset, index) => {
    let subClient = client.getSubClient(asset);

    if (index == 0) {
      for (let i = 0; i < MAX_ALL_PERP_MARKET_PLACE_ORDER_IXS - 2; i++) {
        multiMarketTx.add(
          subClient.createPlaceOrderInstruction(
            constants.PERP_INDEX,
            utils.convertDecimalToNativeInteger(i + 1),
            utils.convertDecimalToNativeLotSize(0.01),
            types.Side.BID
          )
        );
      }
    } else {
      multiMarketTx.add(
        subClient.createPlaceOrderInstruction(
          constants.PERP_INDEX,
          utils.convertDecimalToNativeInteger(1),
          utils.convertDecimalToNativeLotSize(0.01),
          types.Side.BID
        )
      );
    }
  });

  await utils.processTransaction(
    client.provider,
    multiMarketTx,
    undefined,
    undefined,
    undefined,
    utils.getZetaLutArr()
  );

  await utils.sleep(2000);

  ASSETS.forEach((asset) => {
    console.log(
      `client has ${client.getOrders(asset).length} orders on ${asset}`
    );
  });

  await Exchange.close();
  await client.close();
}

main().catch(console.error.bind(console));

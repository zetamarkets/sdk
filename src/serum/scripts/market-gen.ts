import * as assets from "../../assets";
import * as utils from "../../utils";
import { exchange as Exchange } from "../../exchange";
import * as types from "../../types";
import { Network } from "../../network";
import * as constants from "../../constants";
import { Asset } from "../../constants";

import { Connection } from "@solana/web3.js";
import * as anchor from "@zetamarkets/anchor";
import * as fs from "fs";
import { DecodeType, returnDecodedType } from "./market-gen-utils";

const mainnetUrl = "";
const devnetUrl = "";

const main = async () => {
  let networks = [Network.MAINNET];
  let assetList = assets.allAssets();
  for (var network of networks) {
    let marketStore = {};
    let connectionUrl = network == Network.DEVNET ? devnetUrl : mainnetUrl;
    const LOAD_CONFIG: types.LoadExchangeConfig = {
      network: network,
      connection: new Connection(connectionUrl, utils.defaultCommitment()),
      opts: utils.defaultCommitment(),
      throttleMs: 0,
      loadFromStore: false,
      TIFBufferSeconds: 0,
    };

    // Note: If exchange.load() is failing you may need to use the old code before we sped up loading
    // Commit: https://github.com/zetamarkets/sdk/commit/c6ff9376a5cc9255b2dcfffaa330d3bac1446954#diff-c15e612fadecac34c3bc31bc36799f0f4be12ee1703b1a1753a89ae644f55305
    await Exchange.load(LOAD_CONFIG);
    for (var asset of assetList) {
      populateMarketStore(marketStore, asset, constants.PERP_INDEX);
    }
    await Exchange.close();

    const FILENAME = `MARKET-STORE.${network}.json`;
    fs.writeFile(FILENAME, JSON.stringify(marketStore), (_) => {});
  }
};

main().catch(console.error.bind(console));

function populateMarketStore(marketStore: Object, asset: Asset, index: number) {
  if (!(asset in marketStore)) {
    marketStore[asset] = {};
  }

  if (index in marketStore[asset]) {
    return;
  }

  marketStore[asset][index] = {};
  let store = marketStore[asset][index];
  let subExchange = Exchange.getSubExchange(asset);
  if (index != constants.PERP_INDEX) {
    throw Error("non-perps not supported");
  }
  let decodedSerumMarket = subExchange.markets.market.serumMarket.decoded;

  for (const k in decodedSerumMarket) {
    let value = decodedSerumMarket[k];
    switch (returnDecodedType(k)) {
      case DecodeType.AccountFlags: {
        store[k] = value;
        break;
      }
      case DecodeType.BN: {
        store[k] = new anchor.BN(value).toString();
        break;
      }
      case DecodeType.PublicKey: {
        store[k] = value.toString();
        break;
      }
    }
  }
}

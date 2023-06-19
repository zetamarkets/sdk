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
  let networks = [Network.DEVNET, Network.MAINNET];
  let assetList = assets.allAssets();
  for (var network of networks) {
    let marketStore = {};
    let connectionUrl = network == Network.DEVNET ? devnetUrl : mainnetUrl;
    const LOAD_CONFIG: types.LoadExchangeConfig = {
      assets: assetList,
      network: network,
      connection: new Connection(connectionUrl, utils.defaultCommitment()),
      opts: utils.defaultCommitment(),
      throttleMs: 0,
      loadFromStore: false,
    };

    await Exchange.load(LOAD_CONFIG);
    for (var asset of assetList) {
      populateMarketStore(marketStore, network, asset, constants.PERP_INDEX);
    }
    await Exchange.close();

    const FILENAME = `MARKET-STORE.${network}.json`;
    fs.writeFile(FILENAME, JSON.stringify(marketStore), (_) => {});
  }
};

main().catch(console.error.bind(console));

function populateMarketStore(
  marketStore: Object,
  network: Network,
  asset: Asset,
  index: number
) {
  if (!(network in marketStore)) {
    marketStore[network] = {};
  }
  if (!(asset in marketStore[network])) {
    marketStore[network][asset] = {};
  }

  if (index in marketStore[network][asset]) {
    return;
  }

  marketStore[network][asset][index] = {};
  let store = marketStore[network][asset][index];
  let subExchange = Exchange.getSubExchange(asset);
  let decodedSerumMarket: any;
  if (index == constants.PERP_INDEX) {
    decodedSerumMarket = subExchange.markets.perpMarket.serumMarket.decoded;
  } else {
    decodedSerumMarket = subExchange.markets.markets[index].serumMarket.decoded;
  }

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

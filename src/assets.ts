import { PublicKey } from "@solana/web3.js";

// Ordered in underlying sequence number.
export enum Asset {
  SOL = 0,
  BTC = 1,
  ETH = 2,
  UNDEFINED = 255,
}

import * as constants from "./constants";

export function assetToName(asset: Asset) {
  if (asset == Asset.SOL) return "SOL";
  if (asset == Asset.BTC) return "BTC";
  if (asset == Asset.ETH) return "ETH";
  throw Error("Invalid asset");
}

export function nameToAsset(name: string) {
  if (name == "SOL") return Asset.SOL;
  if (name == "BTC") return Asset.BTC;
  if (name == "ETH") return Asset.ETH;
  throw Error("Invalid asset");
}

export function oracleFeedToAsset(feed: string) {
  if (feed == "SOL/USD") return Asset.SOL;
  if (feed == "BTC/USD") return Asset.BTC;
  if (feed == "ETH/USD") return Asset.ETH;
  throw Error("Invalid asset");
}

export function getAssetMint(asset: Asset): PublicKey {
  return constants.MINTS[asset];
}

export function assetToOracleFeed(asset: Asset) {
  let name = assetToName(asset);
  return `${name}/USD`;
}

export function toProgramAsset(asset: Asset) {
  if (asset == Asset.SOL) return { sol: {} };
  if (asset == Asset.BTC) return { btc: {} };
  if (asset == Asset.ETH) return { eth: {} };
  throw Error("Invalid asset");
}

export function fromProgramAsset(asset: any) {
  if (asset.sol != undefined) return Asset.SOL;
  if (asset.btc != undefined) return Asset.BTC;
  if (asset.eth != undefined) return Asset.ETH;
  throw Error("Invalid asset");
}

import { PublicKey } from "@solana/web3.js";
import { objectEquals } from "./utils";

// Ordered in underlying sequence number.
export enum Asset {
  SOL = 0,
  BTC = 1,
  ETH = 2,
  UNDEFINED = 255,
}

import * as constants from "./constants";

export function isValidType(asset: Asset): boolean {
  try {
    assetToName(asset);
  } catch (e) {
    return false;
  }
  return true;
}

export function isValidStr(asset: string): boolean {
  try {
    nameToAsset(asset);
  } catch (e) {
    return false;
  }
  return true;
}

export function allAssets(): Asset[] {
  let allAssets: Asset[] = [];
  for (var a in Asset) {
    if (typeof Asset[a] === "number" && a != "UNDEFINED") {
      allAssets.push(nameToAsset(a));
    }
  }
  return allAssets;
}

export function assetToName(asset: Asset): string | null {
  if (asset == Asset.SOL) return "SOL";
  if (asset == Asset.BTC) return "BTC";
  if (asset == Asset.ETH) return "ETH";
  if (asset == Asset.UNDEFINED) return "UNDEFINED";
  if (asset == null) return null; // Some things, like clock callbacks, are for all assets and return asset=null
  throw Error("Invalid asset");
}

export function nameToAsset(name: string): Asset {
  if (name == "SOL") return Asset.SOL;
  if (name == "BTC") return Asset.BTC;
  if (name == "ETH") return Asset.ETH;
  if (name == "UNDEFINED") return Asset.UNDEFINED;
  throw Error("Invalid asset");
}

export function getAssetMint(asset: Asset): PublicKey {
  return constants.MINTS[asset];
}

export function toProgramAsset(asset: Asset) {
  if (asset == Asset.SOL) return { sol: {} };
  if (asset == Asset.BTC) return { btc: {} };
  if (asset == Asset.ETH) return { eth: {} };
  throw Error("Invalid asset");
}

export function fromProgramAsset(asset: any): Asset {
  if (objectEquals(asset, { sol: {} })) {
    return Asset.SOL;
  }
  if (objectEquals(asset, { btc: {} })) {
    return Asset.BTC;
  }
  if (objectEquals(asset, { eth: {} })) {
    return Asset.ETH;
  }
  throw Error("Invalid asset");
}

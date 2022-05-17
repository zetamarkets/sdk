import { PublicKey } from "@solana/web3.js";
import * as constants from "./constants";

// Ordered in underlying sequence number.
export enum Asset {
  SOL = 0,
  BTC = 1,
}

export function assetToName(asset: Asset) {
  if (asset == Asset.SOL) return "SOL";
  if (asset == Asset.BTC) return "BTC";
  throw Error("Invalid asset");
}

export function getAssetMint(assetType: Asset): PublicKey {
  return constants.MINTS[assetType];
}

export function assetToOracleFeed(asset: Asset) {
  let name = assetToName(asset);
  return `${name}/USD`;
}

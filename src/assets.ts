import { PublicKey } from "@solana/web3.js";
import { objectEquals } from "./utils";
import { Asset } from "./constants";

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
    if (typeof Asset[a] === "string" && a != "UNDEFINED") {
      allAssets.push(nameToAsset(a));
    }
  }
  return allAssets;
}

export function assetToName(asset: Asset): string | null {
  if (asset == Asset.SOL) return "SOL";
  if (asset == Asset.BTC) return "BTC";
  if (asset == Asset.ETH) return "ETH";
  if (asset == Asset.APT) return "APT";
  if (asset == Asset.ARB) return "ARB";
  if (asset == Asset.BNB) return "BNB";
  if (asset == Asset.UNDEFINED) return "UNDEFINED";
  if (asset == null) return null; // Some things, like clock callbacks, are for all assets and return asset=null
  throw Error("Invalid asset");
}

export function nameToAsset(name: string): Asset {
  if (name == "SOL") return Asset.SOL;
  if (name == "BTC") return Asset.BTC;
  if (name == "ETH") return Asset.ETH;
  if (name == "APT") return Asset.APT;
  if (name == "ARB") return Asset.ARB;
  if (name == "BNB") return Asset.BNB;
  if (name == "UNDEFINED") return Asset.UNDEFINED;
  throw Error("Invalid asset");
}

export function getAssetMint(asset: Asset): PublicKey {
  return constants.MINTS[asset];
}

export function toProgramAsset(asset: Asset): any {
  if (asset == Asset.SOL) return { sol: {} };
  if (asset == Asset.BTC) return { btc: {} };
  if (asset == Asset.ETH) return { eth: {} };
  if (asset == Asset.APT) return { apt: {} };
  if (asset == Asset.ARB) return { arb: {} };
  if (asset == Asset.BNB) return { bnb: {} };
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
  if (objectEquals(asset, { apt: {} })) {
    return Asset.APT;
  }
  if (objectEquals(asset, { arb: {} })) {
    return Asset.ARB;
  }
  if (objectEquals(asset, { bnb: {} })) {
    return Asset.BNB;
  }
  throw Error("Invalid asset");
}

export function assetToIndex(asset: Asset): number {
  switch (asset) {
    case Asset.SOL: {
      return 0;
    }
    case Asset.BTC: {
      return 1;
    }
    case Asset.ETH: {
      return 2;
    }
    case Asset.APT: {
      return 3;
    }
    case Asset.ARB: {
      return 4;
    }
    case Asset.BNB: {
      return 5;
    }
  }
  throw new Error("Invalid asset");
}

export function indexToAsset(index: number): Asset {
  switch (index) {
    case 0: {
      return Asset.SOL;
    }
    case 1: {
      return Asset.BTC;
    }
    case 2: {
      return Asset.ETH;
    }
    case 3: {
      return Asset.APT;
    }
    case 4: {
      return Asset.ARB;
    }
    case 5: {
      return Asset.BNB;
    }
  }
  throw new Error("Invalid index");
}

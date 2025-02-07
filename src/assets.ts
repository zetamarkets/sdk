import { PublicKey } from "@solana/web3.js";
import { objectEquals } from "./utils";
import { Asset } from "./constants";

import * as constants from "./constants";
import { Network } from "./network";

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

export function allAssets(network: Network = Network.MAINNET): Asset[] {
  let allAssets: Asset[] = [];
  for (var a in Asset) {
    if (typeof Asset[a] === "string" && a != "UNDEFINED") {
      allAssets.push(nameToAsset(a));
    }
  }

  // Keep devnet assets constant for ease of development and testing
  if (network == Network.DEVNET) {
    return [
      constants.Asset.SOL,
      constants.Asset.BTC,
      constants.Asset.ETH,
      constants.Asset.ARB,
      constants.Asset.APT,
      constants.Asset.PYTH,
      constants.Asset.BERA,
      constants.Asset.TIA,
    ];
  }

  return allAssets;
}

export function assetToName(asset: Asset): string | null {
  if (asset == Asset.SOL) return "SOL";
  if (asset == Asset.BTC) return "BTC";
  if (asset == Asset.ETH) return "ETH";
  if (asset == Asset.APT) return "APT";
  if (asset == Asset.ARB) return "ARB";
  if (asset == Asset.BERA) return "BERA";
  if (asset == Asset.PYTH) return "PYTH";
  if (asset == Asset.TIA) return "TIA";
  if (asset == Asset.JTO) return "JTO";
  if (asset == Asset.ONEMBONK) return "ONEMBONK";
  if (asset == Asset.SEI) return "SEI";
  if (asset == Asset.JUP) return "JUP";
  if (asset == Asset.DYM) return "DYM";
  if (asset == Asset.STRK) return "STRK";
  if (asset == Asset.WIF) return "WIF";
  if (asset == Asset.TNSR) return "TNSR";
  if (asset == Asset.POPCAT) return "POPCAT";
  if (asset == Asset.EIGEN) return "EIGEN";
  if (asset == Asset.DBR) return "DBR";
  if (asset == Asset.GOAT) return "GOAT";
  if (asset == Asset.DRIFT) return "DRIFT";
  if (asset == Asset.PNUT) return "PNUT";
  if (asset == Asset.PENGU) return "PENGU";
  if (asset == Asset.TRUMP) return "TRUMP";
  if (asset == null) return null; // Some things, like clock callbacks, are for all assets and return asset=null
  return "UNDEFINED";
}

export function nameToAsset(name: string): Asset {
  if (name == "SOL") return Asset.SOL;
  if (name == "BTC") return Asset.BTC;
  if (name == "ETH") return Asset.ETH;
  if (name == "APT") return Asset.APT;
  if (name == "ARB") return Asset.ARB;
  if (name == "BERA") return Asset.BERA;
  if (name == "PYTH") return Asset.PYTH;
  if (name == "TIA") return Asset.TIA;
  if (name == "JTO") return Asset.JTO;
  if (name == "ONEMBONK") return Asset.ONEMBONK;
  if (name == "SEI") return Asset.SEI;
  if (name == "JUP") return Asset.JUP;
  if (name == "DYM") return Asset.DYM;
  if (name == "STRK") return Asset.STRK;
  if (name == "WIF") return Asset.WIF;
  if (name == "TNSR") return Asset.TNSR;
  if (name == "POPCAT") return Asset.POPCAT;
  if (name == "EIGEN") return Asset.EIGEN;
  if (name == "DBR") return Asset.DBR;
  if (name == "GOAT") return Asset.GOAT;
  if (name == "DRIFT") return Asset.DRIFT;
  if (name == "PNUT") return Asset.PNUT;
  if (name == "PENGU") return Asset.PENGU;
  if (name == "TRUMP") return Asset.TRUMP;
  return Asset.UNDEFINED;
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
  if (asset == Asset.BERA) return { bera: {} };
  if (asset == Asset.PYTH) return { pyth: {} };
  if (asset == Asset.TIA) return { tia: {} };
  if (asset == Asset.JTO) return { jto: {} };
  if (asset == Asset.ONEMBONK) return { onembonk: {} };
  if (asset == Asset.SEI) return { sei: {} };
  if (asset == Asset.JUP) return { jup: {} };
  if (asset == Asset.DYM) return { dym: {} };
  if (asset == Asset.STRK) return { strk: {} };
  if (asset == Asset.WIF) return { wif: {} };
  if (asset == Asset.TNSR) return { tnsr: {} };
  if (asset == Asset.POPCAT) return { popcat: {} };
  if (asset == Asset.EIGEN) return { eigen: {} };
  if (asset == Asset.DBR) return { dbr: {} };
  if (asset == Asset.GOAT) return { goat: {} };
  if (asset == Asset.DRIFT) return { drift: {} };
  if (asset == Asset.PNUT) return { pnut: {} };
  if (asset == Asset.PENGU) return { pengu: {} };
  if (asset == Asset.TRUMP) return { trump: {} };
  return { undefined: {} };
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
  if (objectEquals(asset, { bera: {} })) {
    return Asset.BERA;
  }
  if (objectEquals(asset, { pyth: {} })) {
    return Asset.PYTH;
  }
  if (objectEquals(asset, { tia: {} })) {
    return Asset.TIA;
  }
  if (objectEquals(asset, { jto: {} })) {
    return Asset.JTO;
  }
  if (objectEquals(asset, { onembonk: {} })) {
    return Asset.ONEMBONK;
  }
  if (objectEquals(asset, { sei: {} })) {
    return Asset.SEI;
  }
  if (objectEquals(asset, { jup: {} })) {
    return Asset.JUP;
  }
  if (objectEquals(asset, { dym: {} })) {
    return Asset.DYM;
  }
  if (objectEquals(asset, { strk: {} })) {
    return Asset.STRK;
  }
  if (objectEquals(asset, { wif: {} })) {
    return Asset.WIF;
  }
  if (objectEquals(asset, { tnsr: {} })) {
    return Asset.TNSR;
  }
  if (objectEquals(asset, { popcat: {} })) {
    return Asset.POPCAT;
  }
  if (objectEquals(asset, { eigen: {} })) {
    return Asset.EIGEN;
  }
  if (objectEquals(asset, { dbr: {} })) {
    return Asset.DBR;
  }
  if (objectEquals(asset, { goat: {} })) {
    return Asset.GOAT;
  }
  if (objectEquals(asset, { drift: {} })) {
    return Asset.DRIFT;
  }
  if (objectEquals(asset, { pnut: {} })) {
    return Asset.PNUT;
  }
  if (objectEquals(asset, { pengu: {} })) {
    return Asset.PENGU;
  }
  if (objectEquals(asset, { trump: {} })) {
    return Asset.TRUMP;
  }
  return Asset.UNDEFINED;
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
    case Asset.BERA: {
      return 5;
    }
    case Asset.PYTH: {
      return 6;
    }
    case Asset.TIA: {
      return 7;
    }
    case Asset.JTO: {
      return 8;
    }
    case Asset.ONEMBONK: {
      return 9;
    }
    case Asset.SEI: {
      return 10;
    }
    case Asset.JUP: {
      return 11;
    }
    case Asset.DYM: {
      return 12;
    }
    case Asset.STRK: {
      return 13;
    }
    case Asset.WIF: {
      return 14;
    }
    case Asset.TNSR: {
      return 16;
    }
    case Asset.POPCAT: {
      return 17;
    }
    case Asset.EIGEN: {
      return 18;
    }
    case Asset.DBR: {
      return 19;
    }
    case Asset.GOAT: {
      return 20;
    }
    case Asset.DRIFT: {
      return 21;
    }
    case Asset.PNUT: {
      return 22;
    }
    case Asset.PENGU: {
      return 23;
    }
    case Asset.TRUMP: {
      return 24;
    }
  }
  return 255; // Undefined is 255 onchain
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
      return Asset.BERA;
    }
    case 6: {
      return Asset.PYTH;
    }
    case 7: {
      return Asset.TIA;
    }
    case 8: {
      return Asset.JTO;
    }
    case 9: {
      return Asset.ONEMBONK;
    }
    case 10: {
      return Asset.SEI;
    }
    case 11: {
      return Asset.JUP;
    }
    case 12: {
      return Asset.DYM;
    }
    case 13: {
      return Asset.STRK;
    }
    case 14: {
      return Asset.WIF;
    }
    case 16: {
      return Asset.TNSR;
    }
    case 17: {
      return Asset.POPCAT;
    }
    case 18: {
      return Asset.EIGEN;
    }
    case 19: {
      return Asset.DBR;
    }
    case 20: {
      return Asset.GOAT;
    }
    case 21: {
      return Asset.DRIFT;
    }
    case 22: {
      return Asset.PNUT;
    }
    case 23: {
      return Asset.PENGU;
    }
    case 24: {
      return Asset.TRUMP;
    }
  }
  return Asset.UNDEFINED;
}

export function assetMultiplier(asset: Asset): number {
  switch (asset) {
    case Asset.ONEMBONK: {
      return 1_000_000;
    }
  }
  return 1;
}

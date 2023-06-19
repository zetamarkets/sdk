import * as anchor from "@zetamarkets/anchor";
import { PublicKey } from "@solana/web3.js";
import { Asset } from "../constants";
import { Network } from "../network";
import * as devnetStore from "./MARKET-STORE.devnet.json";
import * as mainnetStore from "./MARKET-STORE.mainnet.json";
import { DecodeType, returnDecodedType } from "./scripts/market-gen-utils";

interface AccountFlags {
  initialized: boolean;
  market: boolean;
  openOrders: boolean;
  requestQueue: boolean;
  eventQueue: boolean;
  bids: boolean;
  asks: boolean;
}

interface MarketStoreRaw {
  accountFlags: AccountFlags;
  ownAddress: string;
  vaultSignerNonce: string;
  baseMint: string;
  quoteMint: string;
  baseVault: string;
  baseDepositsTotal: string;
  baseFeesAccruedstring: string;
  quoteVault: string;
  quoteDepositsTotal: string;
  quoteFeesAccrued: string;
  quoteDustThreshold: string;
  requestQueue: string;
  eventQueue: string;
  bids: string;
  asks: string;
  baseLotSize: string;
  quoteLotSize: string;
  feeRateBps: string;
  referrerRebatesAccrued: string;
  openOrdersAuthority: string;
  pruneAuthority: string;
  consumeEventsAuthority: string;
  epochLength: string;
  epochStartTs: string;
  startEpochSeqNum: string;
}

export function getDecodedMarket(
  network: Network,
  asset: Asset,
  index: number
): any {
  if (network == Network.LOCALNET) {
    throw Error("Unsupported network!");
  }
  let store = network == Network.DEVNET ? devnetStore : mainnetStore;
  let marketStoreRaw: MarketStoreRaw = store[asset][index];
  let decodedMarket = {};
  for (const k in marketStoreRaw) {
    let value = marketStoreRaw[k];
    switch (returnDecodedType(k)) {
      case DecodeType.AccountFlags: {
        decodedMarket[k] = value;
        break;
      }
      case DecodeType.BN: {
        decodedMarket[k] = new anchor.BN(value);
        break;
      }
      case DecodeType.PublicKey: {
        decodedMarket[k] = new PublicKey(value);
        break;
      }
    }
  }
  return decodedMarket;
}

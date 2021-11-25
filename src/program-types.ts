// Defines all the program structs for Zeta.

import { PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";

export interface State {
  admin: PublicKey;
  stateNonce: number;
  vaultNonce: number;
  serumNonce: number;
  mintAuthNonce: number;
  numUnderlyings: number;
  expiryIntervalSeconds: number;
  newExpiryThresholdSeconds: number;
  strikeInitializationThresholdSeconds: number;
}

export interface MarketIndexes {
  nonce: number;
  initialized: boolean;
  indexes: Array<number>;
}

export interface Underlying {
  mint: PublicKey;
}

export interface SettlementAccount {
  settlementPrice: anchor.BN;
  strikes: Array<anchor.BN>;
}

export interface ZetaGroup {
  initialized: boolean;
  nonce: number;
  frontExpiryIndex: number;
  underlyingMint: PublicKey;
  oracle: PublicKey;
  greeks: PublicKey;
  padding: Array<number>;
  products: Array<Product>;
  _productsPadding: Array<Product>;
  expirySeries: Array<ExpirySeries>;
  _expirySeriesPadding: Array<ExpirySeries>;
  insuranceVault: PublicKey;
  insuranceVaultNonce: number;
  totalInsuranceDepositedAmount: anchor.BN;
}

export interface Product {
  market: PublicKey;
  strike: Strike;
  dirty: boolean;
  kind: Object;
}

export interface Strike {
  isSet: boolean;
  value: anchor.BN;
}

export interface ExpirySeries {
  activeTs: anchor.BN;
  expiryTs: anchor.BN;
  dirty: boolean;
}

export interface OpenOrdersMap {
  userKey: PublicKey;
}

export interface Position {
  position: number;
  costOfTrades: anchor.BN;
  closingOrders: number;
  openingOrders: [number, number];
}

export interface MarginAccount {
  authority: PublicKey;
  nonce: number;
  balance: anchor.BN;
  forceCancelFlag: boolean;

  openOrdersNonce: Array<number>;
  seriesExpiry: Array<anchor.BN>;
  positions: Array<Position>;
  _positionsPadding: Array<Position>;

  overbankruptAmount: anchor.BN;
}

export interface Greeks {
  nonce: number;
  productGreeks: Array<ProductGreeks>;
  padding: Array<ProductGreeks>;
}

export interface ProductGreeks {
  theo: anchor.BN;
  delta: number;
  gamma: number;
  volatility: number;
  updateTimestamp: anchor.BN;
}

export interface TradeEvent {
  marginAccount: PublicKey;
  index: number;
  price: anchor.BN;
  size: number;
  isBid: boolean;
}

export interface InsuranceDepositAccount {
  amount: anchor.BN;
  nonce: number;
}

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
  pricingFrequencySeconds: number;
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

export interface PricingParameters {
  optionTradeNormalizer: AnchorDecimal;
  futureTradeNormalizer: AnchorDecimal;
  maxVolatilityRetreat: AnchorDecimal;
  maxInterestRetreat: AnchorDecimal;
  minDelta: anchor.BN;
  maxDelta: anchor.BN;
}

export interface ZetaGroup {
  nonce: number;
  frontExpiryIndex: number;
  underlyingMint: PublicKey;
  oracle: PublicKey;
  greeks: PublicKey;
  pricingParameters: PricingParameters;
  padding: Array<number>;
  products: Array<Product>;
  _productsPadding: Array<Product>;
  expirySeries: Array<ExpirySeries>;
  _expirySeriesPadding: Array<ExpirySeries>;
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
}

export interface Greeks {
  nonce: number;
  markPrice: Array<anchor.BN>;
  _markPricePadding: Array<anchor.BN>;
  productGreeks: Array<ProductGreeks>;
  _productGreeksPadding: Array<ProductGreeks>;
  updateTimestamp: Array<anchor.BN>;
  _updateTimestampPadding: Array<anchor.BN>;
  interestRate: Array<anchor.BN>;
  _interestRatePadding: Array<anchor.BN>;
  nodes: Array<anchor.BN>;
  volatility: Array<anchor.BN>;
  _volatilityPadding: Array<anchor.BN>;
  nodeKeys: Array<PublicKey>;
}

export interface MarketNode {
  index: number;
  nonce: number;
  nodeUpdates: Array<anchor.BN>;
  interestUpdate: anchor.BN;
}

export interface AnchorDecimal {
  flags: number;
  hi: number;
  lo: number;
  mid: number;
}

export interface ProductGreeks {
  delta: anchor.BN;
  vega: AnchorDecimal;
  volatility: AnchorDecimal;
}

export interface TradeEvent {
  marginAccount: PublicKey;
  index: number;
  price: anchor.BN;
  size: number;
  isBid: boolean;
}

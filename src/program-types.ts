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
  liquidatorLiquidationPercentage: number;
  insuranceVaultLiquidationPercentage: number;
  nativeTradeFeePercentage: anchor.BN;
  nativeUnderlyingFeePercentage: anchor.BN;
  nativeWhitelistUnderlyingFeePercentage: anchor.BN;
  nativeDepositLimit: anchor.BN;
  expirationThresholdSeconds: number;
  padding: Array<number>;
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
  minInterestRate: anchor.BN;
  maxInterestRate: anchor.BN;
  minVolatility: anchor.BN;
  maxVolatility: anchor.BN;
}

export interface MarginParameters {
  futureMarginInitial: anchor.BN;
  futureMarginMaintenance: anchor.BN;
  optionMarkPercentageLongInitial: anchor.BN;
  optionSpotPercentageLongInitial: anchor.BN;
  optionSpotPercentageShortInitial: anchor.BN;
  optionDynamicPercentageShortInitial: anchor.BN;
  optionMarkPercentageLongMaintenance: anchor.BN;
  optionSpotPercentageLongMaintenance: anchor.BN;
  optionSpotPercentageShortMaintenance: anchor.BN;
  optionDynamicPercentageShortMaintenance: anchor.BN;
  optionShortPutCapPercentage: anchor.BN;
  padding: Array<number>;
}

export interface HaltState {
  halted: boolean;
  spotPrice: anchor.BN;
  timestamp: anchor.BN;
  markPricesSet: Array<boolean>;
  _markPricesSetPadding: Array<boolean>;
  marketNodesCleaned: Array<boolean>;
  _marketNodesCleanedPadding: Array<boolean>;
  marketCleaned: Array<boolean>;
  _marketCleanedPadding: Array<boolean>;
}

export interface ZetaGroup {
  nonce: number;
  vaultNonce: number;
  insuranceVaultNonce: number;
  frontExpiryIndex: number;
  haltState: HaltState;
  underlyingMint: PublicKey;
  oracle: PublicKey;
  greeks: PublicKey;
  pricingParameters: PricingParameters;
  marginParameters: MarginParameters;
  products: Array<Product>;
  _productsPadding: Array<Product>;
  expirySeries: Array<ExpirySeries>;
  _expirySeriesPadding: Array<ExpirySeries>;
  totalInsuranceVaultDeposits: anchor.BN;
  padding: Array<number>;
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
  position: anchor.BN;
  costOfTrades: anchor.BN;
  closingOrders: anchor.BN;
  openingOrders: [anchor.BN, anchor.BN];
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

  rebalanceAmount: anchor.BN;
  padding: Array<number>;
}

export interface Greeks {
  nonce: number;
  markPrices: Array<anchor.BN>;
  _markPricesPadding: Array<anchor.BN>;
  productGreeks: Array<ProductGreeks>;
  _productGreeksPadding: Array<ProductGreeks>;
  updateTimestamp: Array<anchor.BN>;
  _updateTimestampPadding: Array<anchor.BN>;
  retreatExpirationTimestamp: Array<anchor.BN>;
  _retreatExpirationTimestampPadding: Array<anchor.BN>;
  interestRate: Array<anchor.BN>;
  _interestRatePadding: Array<anchor.BN>;
  nodes: Array<anchor.BN>;
  volatility: Array<anchor.BN>;
  _volatilityPadding: Array<anchor.BN>;
  nodeKeys: Array<PublicKey>;
  haltForcePricing: Array<boolean>;
  padding: Array<number>;
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
  costOfTrades: anchor.BN;
  size: anchor.BN;
  isBid: boolean;
  clientOrderId: anchor.BN;
  orderId: anchor.BN;
}

export interface InsuranceDepositAccount {
  nonce: number;
  amount: anchor.BN;
}

export interface WhitelistInsuranceAccount {
  nonce: number;
  userKey: PublicKey;
}

export interface WhitelistDepositAccount {
  nonce: number;
  userKey: PublicKey;
}

export interface SocializedLossAccount {
  nonce: number;
  overbankruptAmount: anchor.BN;
}

export interface WhitelistTradingFeesAccount {
  nonce: number;
  userKey: PublicKey;
}

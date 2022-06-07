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
  positionMovementFeeBps: number;
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
  markPricesSetPadding: Array<boolean>;
  marketNodesCleaned: Array<boolean>;
  marketNodesCleanedPadding: Array<boolean>;
  marketCleaned: Array<boolean>;
  marketCleanedPadding: Array<boolean>;
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
  productsPadding: Array<Product>;
  expirySeries: Array<ExpirySeries>;
  expirySeriesPadding: Array<ExpirySeries>;
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
  size: anchor.BN;
  costOfTrades: anchor.BN;
}

export interface OrderState {
  closingOrders: anchor.BN;
  openingOrders: [anchor.BN, anchor.BN];
}

export interface ProductLedger {
  position: Position;
  orderState: OrderState;
}

export interface MarginAccount {
  authority: PublicKey;
  nonce: number;
  balance: anchor.BN;
  forceCancelFlag: boolean;
  openOrdersNonce: Array<number>;
  seriesExpiry: Array<anchor.BN>;
  productLedgers: Array<ProductLedger>;
  productLedgersPadding: Array<ProductLedger>;
  rebalanceAmount: anchor.BN;
  asset: number;
  padding: Array<number>;
}

export interface SpreadAccount {
  authority: PublicKey;
  nonce: number;
  balance: anchor.BN;
  seriesExpiry: Array<anchor.BN>;
  positions: Array<Position>;
  positionsPadding: Array<Position>;
  asset: number;
  padding: Array<number>;
}

export interface Greeks {
  nonce: number;
  markPrices: Array<anchor.BN>;
  markPricesPadding: Array<anchor.BN>;
  productGreeks: Array<ProductGreeks>;
  productGreeksPadding: Array<ProductGreeks>;
  updateTimestamp: Array<anchor.BN>;
  updateTimestampPadding: Array<anchor.BN>;
  retreatExpirationTimestamp: Array<anchor.BN>;
  retreatExpirationTimestampPadding: Array<anchor.BN>;
  interestRate: Array<anchor.BN>;
  interestRatePadding: Array<anchor.BN>;
  nodes: Array<anchor.BN>;
  volatility: Array<anchor.BN>;
  volatilityPadding: Array<anchor.BN>;
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

export interface PlaceOrderEvent {
  fee: anchor.BN;
  oraclePrice: anchor.BN;
  orderId: anchor.BN;
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

export interface PositionMovementEvent {
  // Positive if movement from margin into spread, else negative.
  netBalanceTransfer: anchor.BN;
  marginAccountBalance: anchor.BN;
  spreadAccountBalance: anchor.BN;
  movementFees: anchor.BN;
}

export interface LiquidationEvent {
  liquidatorReward: anchor.BN;
  insuranceReward: anchor.BN;
  costOfTrades: anchor.BN;
  size: anchor.BN;
  remainingLiquidateeBalance: anchor.BN;
  remainingLiquidatorBalance: anchor.BN;
  markPrice: anchor.BN;
  underlyingPrice: anchor.BN;
}

// Defines all the program structs for Zeta.

import { PublicKey } from "@solana/web3.js";
import * as anchor from "@zetamarkets/anchor";

export interface State {
  admin: PublicKey;
  stateNonce: number;
  serumNonce: number;
  mintAuthNonce: number;
  numUnderlyings: number;
  numFlexUnderlyings: number;
  null: Array<number>;
  strikeInitializationThresholdSeconds: number;
  pricingFrequencySeconds: number;
  liquidatorLiquidationPercentage: number;
  insuranceVaultLiquidationPercentage: number;
  deprecatedFeeValues: Array<anchor.BN>;
  nativeDepositLimit: anchor.BN;
  expirationThresholdSeconds: number;
  positionMovementFeeBps: number;
  marginConcessionPercentage: number;
  treasuryWalletNonce: number;
  deprecatedOptionFeeValues: Array<anchor.BN>;
  referralsAdmin: PublicKey;
  referralsRewardsWalletNonce: number;
  maxPerpDeltaAge: number;
  secondaryAdmin: PublicKey;
  vaultNonce: number;
  insuranceVaultNonce: number;
  nativeWithdrawLimit: anchor.BN;
  withdrawLimitEpochSeconds: number;
  nativeOpenInterestLimit: anchor.BN;
  haltStates: Array<HaltStateV2>;
  haltStatesPadding: Array<HaltStateV2>;
  triggerAdmin: PublicKey;
  minLotSizes: Array<number>;
  minLotSizesPadding: Array<number>;
  tickSizes: Array<number>;
  tickSizesPadding: Array<number>;
  deprecatedMakerFeeValue: anchor.BN;
  nativeTakeTriggerOrderFeePercentage: anchor.BN;
  nativeMakerRebatePercentage: anchor.BN;
  maTypeAdmin: PublicKey;
  pricingAdmin: PublicKey;
  treasurySplitTokenAccount: PublicKey;
  treasurySplitPercentage: number;
  padding: Array<number>;
}

export interface Pricing {
  nonce: number;
  markPrices: Array<anchor.BN>;
  markPricesPadding: Array<anchor.BN>;
  updateTimestamps: Array<anchor.BN>;
  updateTimestampsPadding: Array<anchor.BN>;
  fundingDeltas: Array<AnchorDecimal>;
  fundingDeltasPadding: Array<AnchorDecimal>;
  latestFundingRates: Array<AnchorDecimal>;
  latestFundingRatesPadding: Array<AnchorDecimal>;
  latestMidpoints: Array<anchor.BN>;
  latestMidpointsPadding: Array<anchor.BN>;
  oracles: Array<PublicKey>;
  oraclesPadding: Array<PublicKey>;
  oracleBackupFeeds: Array<PublicKey>;
  oracleBackupFeedsPadding: Array<PublicKey>;
  markets: Array<PublicKey>;
  marketsPadding: Array<PublicKey>;
  perpSyncQueues: Array<PublicKey>;
  perpSyncQueuesPadding: Array<PublicKey>;
  perpParameters: Array<PerpParameters>;
  perpParametersPadding: Array<PerpParameters>;
  marginParameters: Array<MarginParameters>;
  marginParametersPadding: Array<MarginParameters>;
  products: Array<Product>;
  productsPadding: Array<Product>;
  zetaGroupKeys: Array<PublicKey>;
  zetaGroupKeysPadding: Array<PublicKey>;
  totalInsuranceVaultDeposits: anchor.BN;
  lastWithdrawTimestamp: anchor.BN;
  netOutflowSum: anchor.BN;
  haltForcePricing: Array<boolean>;
  haltForcePricingPadding: Array<boolean>;
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
}

export interface PerpParameters {
  minFundingRatePercent: anchor.BN;
  maxFundingRatePercent: anchor.BN;
  impactCashDelta: anchor.BN;
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

export interface HaltStateV2 {
  halted: boolean;
  timestamp: anchor.BN;
  spotPrice: anchor.BN;
  marketCleaned: boolean;
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

export interface CrossOpenOrdersMap {
  userKey: PublicKey;
  subaccountIndex: number;
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
  openingOrders: Array<anchor.BN>;
}

export interface ProductLedger {
  position: Position;
  orderState: OrderState;
}

export interface CrossMarginAccountInfo {
  initialized: boolean;
  name: Array<number>; // 10 byte string, stored as [u8; 10] onchain
}

export interface CrossMarginAccountManager {
  nonce: number;
  authority: PublicKey;
  accounts: Array<CrossMarginAccountInfo>;
  referrer: PublicKey;
  airdropCommunity: number;
  referredTimestamp: anchor.BN;
  padding: Array<number>;
}

export interface CrossMarginAccount {
  authority: PublicKey;
  delegatedPubkey: PublicKey;
  balance: anchor.BN;
  subaccountIndex: number;
  nonce: number;
  forceCancelFlag: boolean;
  accountType: any;
  openOrdersNonces: Array<number>;
  openOrdersNoncesPadding: Array<number>;
  rebalanceAmount: anchor.BN;
  lastFundingDeltas: Array<AnchorDecimal>;
  lastFundingDeltasPadding: Array<AnchorDecimal>;
  productLedgers: Array<ProductLedger>;
  productLedgersPadding: Array<ProductLedger>;
  triggerOrderBits: anchor.BN;
  rebateRebalanceAmount: anchor.BN;
  potentialOrderLoss: Array<anchor.BN>;
  potentialOrderLossPadding: Array<anchor.BN>;
  padding: Array<number>;
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
  perpProductLedger: ProductLedger;
  rebalanceAmount: anchor.BN;
  asset: any;
  accountType: any;
  lastFundingDelta: AnchorDecimal;
  delegatedPubkey: PublicKey;
  rebateRebalanceAmount: anchor.BN;
  padding: Array<number>;
}

export interface SpreadAccount {
  authority: PublicKey;
  nonce: number;
  balance: anchor.BN;
  seriesExpiry: Array<anchor.BN>;
  seriesExpiryPadding: anchor.BN;
  positions: Array<Position>;
  positionsPadding: Array<Position>;
  asset: any;
  padding: Array<number>;
}

export interface ReferrerIdAccount {
  referrerId: Array<number>;
  referrerPubkey: PublicKey;
}

export interface ReferrerPubkeyAccount {
  referrerPubkey: PublicKey;
}

export interface TriggerOrder {
  owner: PublicKey;
  marginAccount: PublicKey;
  openOrders: PublicKey;
  orderPrice: anchor.BN;
  triggerPrice: anchor.BN | null; // Option<u64>
  triggerTs: anchor.BN | null; // Option<u64>
  size: anchor.BN;
  creationTs: anchor.BN;
  triggerDirection: any | null; // Option<TriggerDirection>
  side: any; // enum Side
  asset: any; // enum Asset
  orderType: any; // enum OrderType
  bit: number;
  reduceOnly: boolean;
}

export interface PerpSyncQueue {
  nonce: number;
  head: number;
  length: number;
  queue: Array<AnchorDecimal>;
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

// TODO move these events to event.ts.
export interface PlaceOrderEvent {
  fee: anchor.BN;
  oraclePrice: anchor.BN;
  orderId: anchor.BN;
  expiryTs: anchor.BN;
  asset: any;
  marginAccount: PublicKey;
  clientOrderId: anchor.BN;
  user: PublicKey;
}

/**
 * @deprecated - here for historical documentation.
 */
export interface TradeEvent {
  marginAccount: PublicKey;
  index: number;
  costOfTrades: anchor.BN;
  size: anchor.BN;
  isBid: boolean;
  clientOrderId: anchor.BN;
  orderId: anchor.BN;
}

export interface TradeEventV2 {
  marginAccount: PublicKey;
  index: number;
  costOfTrades: anchor.BN;
  size: anchor.BN;
  isBid: boolean;
  clientOrderId: anchor.BN;
  orderId: anchor.BN;
  asset: number;
  user: PublicKey;
  isTaker: boolean;
  sequenceNumber: anchor.BN; // Unique id for the given market
}

export interface TradeEventV3 {
  marginAccount: PublicKey;
  index: number;
  costOfTrades: anchor.BN;
  size: anchor.BN;
  isBid: boolean;
  clientOrderId: anchor.BN;
  orderId: anchor.BN;
  asset: Object;
  user: PublicKey;
  isTaker: boolean;
  sequenceNumber: anchor.BN; // Unique id for the given market
  fee: anchor.BN;
  price: anchor.BN;
  pnl: anchor.BN;
  rebate: anchor.BN;
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
  liquidatee: PublicKey;
  liquidator: PublicKey;
  asset: Object;
  liquidateeMarginAccount: PublicKey;
  liquidatorMarginAccount: PublicKey;
}

export interface OrderCompleteEvent {
  marginAccount: PublicKey;
  user: PublicKey;
  asset: Object;
  marketIndex: number;
  side: Object;
  unfilledSize: anchor.BN; // > 0 for cancel or booted, 0 for non cancels
  orderId: anchor.BN;
  clientOrderId: anchor.BN;
  orderCompleteType: Object;
}

export interface ApplyFundingEvent {
  marginAccount: PublicKey;
  user: PublicKey;
  asset: Object;
  balanceChange: anchor.BN;
  remainingBalance: anchor.BN;
  fundingRate: anchor.BN;
  oraclePrice: anchor.BN;
  positionSize: anchor.BN;
}

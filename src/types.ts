import * as anchor from "@project-serum/anchor";
import { BN } from "@project-serum/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
import { Asset } from "./assets";
import { objectEquals } from "./utils";
import { MarginAccount } from "./program-types";

/**
 * Wallet interface for objects that can be used to sign provider transactions.
 */
export interface Wallet {
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  publicKey: PublicKey;
}

export class DummyWallet implements Wallet {
  constructor() {}

  async signTransaction(_tx: Transaction): Promise<Transaction> {
    throw Error("Not supported by dummy wallet!");
  }

  async signAllTransactions(_txs: Transaction[]): Promise<Transaction[]> {
    throw Error("Not supported by dummy wallet!");
  }

  get publicKey(): PublicKey {
    throw Error("Not supported by dummy wallet!");
  }
}

export enum OrderType {
  LIMIT,
  POSTONLY,
  FILLORKILL,
}

export function toProgramOrderType(orderType: OrderType) {
  if (orderType == OrderType.LIMIT) return { limit: {} };
  if (orderType == OrderType.POSTONLY) return { postOnly: {} };
  if (orderType == OrderType.FILLORKILL) return { fillOrKill: {} };
}

export enum Side {
  BID,
  ASK,
}

export function toProgramSide(side: Side) {
  if (side == Side.BID) return { bid: {} };
  if (side == Side.ASK) return { ask: {} };
  throw Error("Invalid side");
}

export function fromProgramSide(side: any): Side {
  if (objectEquals(side, { bid: {} })) {
    return Side.BID;
  }
  if (objectEquals(side, { ask: {} })) {
    return Side.ASK;
  }
  throw Error("Invalid program side!");
}

export enum Kind {
  UNINITIALIZED = "uninitialized",
  CALL = "call",
  PUT = "put",
  FUTURE = "future",
}

export function toProductKind(kind: Object): Kind {
  if (Object.keys(kind).includes(Kind.CALL)) return Kind.CALL;
  if (Object.keys(kind).includes(Kind.PUT)) return Kind.PUT;
  if (Object.keys(kind).includes(Kind.FUTURE)) return Kind.FUTURE;
  // We don't expect uninitialized.
  throw Error("Invalid product type");
}

export interface Order {
  marketIndex: number;
  market: PublicKey;
  price: number;
  size: number;
  side: Side;
  // Just an identifier, shouldn't be shown to users.
  orderId: BN;
  // Open orders account that owns the order.
  owner: PublicKey;
  // Client order id.
  clientOrderId: BN;
}

export function orderEquals(
  a: Order,
  b: Order,
  cmpOrderId: boolean = false
): boolean {
  let orderIdMatch = true;
  if (cmpOrderId) {
    orderIdMatch = a.orderId.eq(b.orderId);
  }

  return (
    a.marketIndex === b.marketIndex &&
    a.market.equals(b.market) &&
    a.price === b.price &&
    a.size === b.size &&
    a.side === b.side &&
    orderIdMatch
  );
}

export interface Position {
  marketIndex: number;
  market: PublicKey;
  size: number;
  costOfTrades: number;
}

export function positionEquals(a: Position, b: Position): boolean {
  return (
    a.marketIndex === b.marketIndex &&
    a.market.equals(b.market) &&
    a.size === b.size &&
    a.costOfTrades === b.costOfTrades
  );
}

export interface Level {
  price: number;
  size: number;
}

export interface DepthOrderbook {
  bids: Level[];
  asks: Level[];
}

export interface TopLevel {
  bid: Level | null;
  ask: Level | null;
}

export enum MarginType {
  /**
   * Margin for orders.
   */
  INITIAL = "initial",
  /**
   * Margin for positions.
   */
  MAINTENANCE = "maintenance",
}

export interface MarginRequirement {
  initialLong: number;
  initialShort: number;
  maintenanceLong: number;
  maintenanceShort: number;
}

export interface MarginAccountState {
  balance: number;
  initialMargin: number;
  maintenanceMargin: number;
  unrealizedPnl: number;
  availableBalanceInitial: number;
  availableBalanceMaintenance: number;
}

export interface CancelArgs {
  market: PublicKey;
  orderId: anchor.BN;
  cancelSide: Side;
}

export interface MarginParams {
  futureMarginInitial: number;
  futureMarginMaintenance: number;
  optionMarkPercentageLongInitial: number;
  optionSpotPercentageLongInitial: number;
  optionSpotPercentageShortInitial: number;
  optionDynamicPercentageShortInitial: number;
  optionMarkPercentageLongMaintenance: number;
  optionSpotPercentageLongMaintenance: number;
  optionSpotPercentageShortMaintenance: number;
  optionDynamicPercentageShortMaintenance: number;
  optionShortPutCapPercentage: number;
}

export enum ProgramAccountType {
  MarginAccount = "MarginAccount",
  SpreadAccount = "SpreadAccount",
}

export interface ClockData {
  timestamp: number;
  slot: number;
}

export enum MovementType {
  LOCK = 1,
  UNLOCK = 2,
}

export function toProgramMovementType(movementType: MovementType) {
  if (movementType == MovementType.LOCK) return { lock: {} };
  if (movementType == MovementType.UNLOCK) return { unlock: {} };
  throw Error("Invalid movement type");
}

export enum TreasuryMovementType {
  TO_TREASURY_FROM_INSURANCE = 1,
  TO_INSURANCE_FROM_TREASURY = 2,
  TO_TREASURY_FROM_REFERRALS_REWARDS = 3,
  TO_REFERRALS_REWARDS_FROM_TREASURY = 4,
}

export function toProgramTreasuryMovementType(
  treasuryMovementType: TreasuryMovementType
) {
  if (treasuryMovementType == TreasuryMovementType.TO_TREASURY_FROM_INSURANCE)
    return { toTreasuryFromInsurance: {} };
  if (treasuryMovementType == TreasuryMovementType.TO_INSURANCE_FROM_TREASURY)
    return { toInsuranceFromTreasury: {} };
  if (
    treasuryMovementType ==
    TreasuryMovementType.TO_TREASURY_FROM_REFERRALS_REWARDS
  )
    return { toTreasuryFromReferralsRewards: {} };
  if (
    treasuryMovementType ==
    TreasuryMovementType.TO_REFERRALS_REWARDS_FROM_TREASURY
  )
    return { toReferralsRewardsFromTreasury: {} };
  throw Error("Invalid treasury movement type");
}

export type MarketIdentifier = number | PublicKey;

export enum MarginAccountType {
  NORMAL = 0,
  MARKET_MAKER = 1,
}

export function fromProgramMarginAccountType(
  accountType: any
): MarginAccountType {
  if (objectEquals(accountType, { normal: {} })) {
    return MarginAccountType.NORMAL;
  }
  if (objectEquals(accountType, { marketMaker: {} })) {
    return MarginAccountType.MARKET_MAKER;
  }
  throw Error("Invalid margin account type");
}

export function isMarketMaker(marginAccount: MarginAccount) {
  return (
    fromProgramMarginAccountType(marginAccount.accountType) ==
    MarginAccountType.MARKET_MAKER
  );
}

export enum OrderCompleteType {
  CANCEL = 0,
  FILL = 1,
  BOOTED = 2,
}

export function fromProgramOrderCompleteType(
  orderCompleteType: any
): OrderCompleteType {
  if (objectEquals(orderCompleteType, { cancel: {} })) {
    return OrderCompleteType.CANCEL;
  }
  if (objectEquals(orderCompleteType, { fill: {} })) {
    return OrderCompleteType.FILL;
  }
  if (objectEquals(orderCompleteType, { booted: {} })) {
    return OrderCompleteType.BOOTED;
  }
  throw Error("Invalid order complete type");
}

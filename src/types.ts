import * as anchor from "@project-serum/anchor";
import { BN } from "@project-serum/anchor";
import { AccountInfo, PublicKey, Transaction } from "@solana/web3.js";

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

export enum Side {
  BID,
  ASK,
}

export function toProgramSide(side: Side) {
  if (side == Side.BID) return { bid: {} };
  if (side == Side.ASK) return { ask: {} };
  throw Error("Invalid side");
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
  position: number;
  costOfTrades: number;
}

export function positionEquals(a: Position, b: Position): boolean {
  return (
    a.marketIndex === b.marketIndex &&
    a.market.equals(b.market) &&
    a.position === b.position &&
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
  totalMargin: number;
  unrealizedPnl: number;
  availableBalance: number;
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

// Only support margin accounts for now.
export enum ProgramAccountType {
  MarginAccount = "MarginAccount",
}

export interface ClockData {
  timestamp: number;
  slot: number;
}

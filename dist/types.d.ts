import { BN } from "@project-serum/anchor";
import { PublicKey, Transaction } from "@solana/web3.js";
/**
 * Wallet interface for objects that can be used to sign provider transactions.
 */
export interface Wallet {
    signTransaction(tx: Transaction): Promise<Transaction>;
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
    publicKey: PublicKey;
}
export declare class DummyWallet implements Wallet {
    constructor();
    signTransaction(_tx: Transaction): Promise<Transaction>;
    signAllTransactions(_txs: Transaction[]): Promise<Transaction[]>;
    get publicKey(): PublicKey;
}
export declare enum Side {
    BID = 0,
    ASK = 1
}
export declare function toProgramSide(side: Side): {
    bid: {};
    ask?: undefined;
} | {
    ask: {};
    bid?: undefined;
};
export declare enum Kind {
    UNINITIALIZED = "uninitialized",
    CALL = "call",
    PUT = "put",
    FUTURE = "future"
}
export declare function toProductKind(kind: Object): Kind;
export interface Order {
    marketIndex: number;
    market: PublicKey;
    price: number;
    size: number;
    side: Side;
    orderId: BN;
    owner: PublicKey;
}
export declare function orderEquals(a: Order, b: Order, cmpOrderId?: boolean): boolean;
export interface Position {
    marketIndex: number;
    market: PublicKey;
    position: number;
    costOfTrades: number;
}
export declare function positionEquals(a: Position, b: Position): boolean;
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
export declare enum MarginType {
    /**
     * Margin for orders.
     */
    INITIAL = "initial",
    /**
     * Margin for positions.
     */
    MAINTENANCE = "maintenance"
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

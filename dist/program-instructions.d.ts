import { PublicKey, TransactionInstruction, Transaction } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import { Side } from "./types";
export declare function initializeMarginAccountTx(userKey: PublicKey): Promise<Transaction>;
/**
 * @param amount the native amount to deposit (6dp)
 */
export declare function depositIx(amount: number, marginAccount: PublicKey, usdcAccount: PublicKey, userKey: PublicKey): Promise<TransactionInstruction>;
/**
 * @param amount the native amount to withdraw (6dp)
 */
export declare function withdrawIx(amount: number, marginAccount: PublicKey, usdcAccount: PublicKey, userKey: PublicKey): Promise<TransactionInstruction>;
export declare function initializeOpenOrdersIx(market: PublicKey, userKey: PublicKey, marginAccount: PublicKey): Promise<[TransactionInstruction, PublicKey]>;
export declare function placeOrderIx(market: PublicKey, price: number, size: number, side: Side, marginAccount: PublicKey, authority: PublicKey, openOrders: PublicKey): Promise<TransactionInstruction>;
export declare function cancelOrderIx(market: PublicKey, userKey: PublicKey, marginAccount: PublicKey, openOrders: PublicKey, orderId: anchor.BN, side: Side): Promise<TransactionInstruction>;
export declare function cancelExpiredOrderIx(market: PublicKey, marginAccount: PublicKey, openOrders: PublicKey, orderId: anchor.BN, side: Side): Promise<TransactionInstruction>;
export declare function forceCancelOrdersIx(market: PublicKey, marginAccount: PublicKey, openOrders: PublicKey): Promise<TransactionInstruction>;
export declare function initializeZetaMarketTxs(marketIndex: number, requestQueue: PublicKey, eventQueue: PublicKey, bids: PublicKey, asks: PublicKey, marketIndexes: PublicKey): Promise<[Transaction, Transaction]>;
export interface UpdateGreeksArgs {
    index: number;
    theo: anchor.BN;
    delta: number;
    gamma: number;
    volatility: number;
}
export declare function updateGreeksIx(greekArgs: UpdateGreeksArgs): Promise<TransactionInstruction>;
export declare function initializeZetaGroupTx(underlyingMint: PublicKey, oracle: PublicKey): Promise<Transaction>;
export declare function liquidateIx(liquidator: PublicKey, liquidatorMarginAccount: PublicKey, market: PublicKey, liquidatedMarginAccount: PublicKey, size: number): Promise<TransactionInstruction>;
export declare function crankMarketIx(market: PublicKey, eventQueue: PublicKey, dexProgram: PublicKey, remainingAccounts: any[]): Promise<TransactionInstruction>;

/// <reference types="node" />
import * as anchor from "@project-serum/anchor";
import { ConfirmOptions, PublicKey, Connection, Signer, Transaction, TransactionInstruction, TransactionSignature, AccountInfo } from "@solana/web3.js";
import { Token } from "@solana/spl-token";
import { Market } from "./market";
export declare function getState(programId: PublicKey): Promise<[PublicKey, number]>;
export declare function getSettlement(programId: PublicKey, underlyingMint: PublicKey, expirationTs: anchor.BN): Promise<[PublicKey, number]>;
export declare function getOpenOrders(programId: PublicKey, market: PublicKey, userKey: PublicKey): Promise<[PublicKey, number]>;
export declare function createOpenOrdersAddress(programId: PublicKey, market: PublicKey, userKey: PublicKey, nonce: number): Promise<PublicKey>;
export declare function getOpenOrdersMap(programId: PublicKey, openOrders: PublicKey): Promise<[PublicKey, number]>;
export declare function getSerumAuthority(programId: PublicKey): Promise<[PublicKey, number]>;
export declare function getMintAuthority(programId: PublicKey): Promise<[PublicKey, number]>;
export declare function getVault(programId: PublicKey): Promise<[PublicKey, number]>;
export declare function getSerumVault(programId: PublicKey, mint: PublicKey): Promise<[PublicKey, number]>;
export declare function getZetaVault(programId: PublicKey, mint: PublicKey): Promise<[PublicKey, number]>;
export declare function getZetaGroup(programId: PublicKey, mint: PublicKey): Promise<[PublicKey, number]>;
export declare function getUnderlying(programId: PublicKey, underlyingIndex: number): Promise<[PublicKey, number]>;
export declare function getGreeks(programId: PublicKey, zetaGroup: PublicKey): Promise<[PublicKey, number]>;
export declare function getMarketIndexes(programId: PublicKey, zetaGroup: PublicKey): Promise<[PublicKey, number]>;
export declare function getBaseMint(programId: PublicKey, market: PublicKey): Promise<[PublicKey, number]>;
export declare function getQuoteMint(programId: PublicKey, market: PublicKey): Promise<[PublicKey, number]>;
export declare function getMarginAccount(programId: PublicKey, zetaGroup: PublicKey, userKey: PublicKey): Promise<[PublicKey, number]>;
export declare function getMarketUninitialized(programId: PublicKey, zetaGroup: PublicKey, marketIndex: number): Promise<[PublicKey, number]>;
/**
 * Returns the expected PDA by serum to own the serum vault
 * Serum uses a u64 as nonce which is not the same as
 * normal solana PDA convention and goes 0 -> 255
 */
export declare function getSerumVaultOwnerAndNonce(market: PublicKey, dexPid: PublicKey): Promise<[PublicKey, anchor.BN]>;
export declare function createUsdcMint(provider: anchor.Provider, usdcMintAuthority: PublicKey): Promise<Token>;
/**
 * Serum interprets publickeys as [u64; 4]
 * Which requires swap64 sorting.
 */
export declare function sortOpenOrderKeys(keys: PublicKey[]): PublicKey[];
/**
 * Normal sorting of keys
 */
export declare function sortMarketKeys(keys: PublicKey[]): PublicKey[];
export declare function getNativeAmount(amount: number): number;
export declare function getReadableAmount(amount: number): number;
export declare function getTokenMint(connection: Connection, key: PublicKey): Promise<PublicKey>;
/**
 * Copied from @solana/spl-token but their version requires you to
 * construct a Token object which is completely unnecessary
 */
export declare function getTokenAccountInfo(connection: Connection, key: PublicKey): Promise<any>;
export declare function getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): Promise<PublicKey>;
export declare function defaultCommitment(): ConfirmOptions;
export declare function processTransaction(provider: anchor.Provider, tx: Transaction, signers?: Array<Signer>, opts?: ConfirmOptions): Promise<TransactionSignature>;
export declare function getClockTimestamp(accountInfo: AccountInfo<Buffer>): number;
export declare function getPriceFromSerumOrderKey(key: anchor.BN): anchor.BN;
export declare function splitIxsIntoTx(ixs: TransactionInstruction[], ixsPerTx: number): Transaction[];
export declare function sleep(ms: any): Promise<void>;
export declare function getOrderedMarketIndexes(): number[];
export declare function getDirtySeriesIndices(): number[];
export declare function displayState(): void;
/**
 * Allows you to pass in a map that may have cached values for openOrdersAccounts
 * @param eventQueue
 * @param marketIndex
 * @param openOrdersToMargin
 * @returns remainingAccounts
 */
export declare function getCrankRemainingAccounts(eventQueue: any[], marketIndex: number, openOrdersToMargin?: Map<PublicKey, PublicKey>): Promise<any[]>;
export declare function getMarginFromOpenOrders(openOrders: PublicKey, marketIndex: number): Promise<anchor.web3.PublicKey>;
export declare function getNextStrikeInitialisationTs(): number;
export declare function cleanZetaMarkets(marketAccountTuples: any[]): Promise<void>;
export declare function settleUsers(userAccounts: any[], expiryTs: anchor.BN): Promise<void>;
export declare function crankMarket(market: Market, remainingAccounts: any[]): Promise<void>;
export declare function expireSeries(expiryTs: anchor.BN): Promise<anchor.web3.PublicKey>;
/**
 * Get the most recently expired index
 */
export declare function getMostRecentExpiredIndex(): number;
/**
 * Extract error code from custom non-anchor errors
 */
export declare function parseCustomErr(untranslatedError: string): anchor.ProgramError;

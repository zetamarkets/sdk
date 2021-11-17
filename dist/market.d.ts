import { Market as SerumMarket } from "@project-serum/serum";
import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { DepthOrderbook, TopLevel, Order, Kind } from "./types";
import { EventType } from "./events";
export declare class ZetaGroupMarkets {
    /**
     * Returns the index for the front expiry in expiry series.
     */
    get frontExpiryIndex(): number;
    private _frontExpiryIndex;
    /**
     * Returns the expiry series for this zeta group.
     */
    get expirySeries(): ExpirySeries[];
    private _expirySeries;
    /**
     * The list of markets in the same ordering as the zeta group account
     * They are in sorted order by market address.
     */
    get markets(): Market[];
    private _markets;
    set pollInterval(interval: number);
    get pollInterval(): number;
    private _pollInterval;
    private _lastPollTimestamp;
    private _subscribedMarketIndexes;
    /**
     * Returns the market's index.
     */
    getMarketsByExpiryIndex(index: number): Market[];
    /**
     * Returns the futures market given an expiry index.
     */
    getFuturesMarketByExpiryIndex(index: number): Market;
    private constructor();
    subscribeMarket(marketIndex: number): void;
    unsubscribeMarket(marketIndex: number): boolean;
    handlePolling(callback?: (eventType: EventType, data: any) => void): Promise<void>;
    /**
     * Will load a new instance of ZetaGroupMarkets
     * Should not be called outside of Exchange.
     */
    static load(opts: ConfirmOptions, throttleMs: number): Promise<ZetaGroupMarkets>;
    /**
     * Updates the option series state based off state in Exchange.
     */
    updateExpirySeries(): Promise<void>;
    /**
     * Returns the market object for a given index.
     */
    getMarket(market: PublicKey): Market;
    /**
     * Returns the market index for a given market address.
     */
    getMarketIndex(market: PublicKey): number;
    /**
     * Returns the index of expiry series that are tradeable.
     */
    getTradeableExpiryIndices(): number[];
    productsPerExpiry(): number;
}
export declare class ExpirySeries {
    expiryIndex: number;
    activeTs: number;
    expiryTs: number;
    dirty: boolean;
    strikesInitialized: boolean;
    constructor(expiryIndex: number, activeTs: number, expiryTs: number, dirty: boolean, strikesInitialized: boolean);
    isLive(): boolean;
}
/**
 * Wrapper class for a zeta market on serum.
 */
export declare class Market {
    /**
     * The market index corresponding to the zeta group account.
     */
    get marketIndex(): number;
    private _marketIndex;
    /**
     * The expiry series index this market belongs to.
     */
    get expiryIndex(): number;
    get expirySeries(): ExpirySeries;
    private _expiryIndex;
    /**
     * The type of product this market represents.
     */
    get kind(): Kind;
    private _kind;
    /**
     * The serum market address.
     */
    get address(): PublicKey;
    private _address;
    /**
     * The zeta group this market belongs to.
     * TODO currently there exists only one zeta group.
     */
    get zetaGroup(): PublicKey;
    private _zetaGroup;
    /**
     * The zeta vault for the quote mint.
     */
    get quoteVault(): PublicKey;
    private _quoteVault;
    /**
     * The zeta vault for the base mint.
     */
    get baseVault(): PublicKey;
    private _baseVault;
    /**
     * The serum Market object from @project-serum/ts
     */
    get serumMarket(): SerumMarket;
    private _serumMarket;
    private _bids;
    private _asks;
    /**
     * Returns the best N levels for bids and asks
     */
    get orderbook(): DepthOrderbook;
    private _orderbook;
    /**
     * The strike of this option, modified on new expiry.
     */
    get strike(): number;
    private _strike;
    /**
     * The depth of the orderbook loaded, default set to 5
     */
    get orderbookDepth(): number;
    set orderbookDepth(depth: number);
    private _orderbookDepth;
    constructor(marketIndex: number, expiryIndex: number, kind: Kind, address: PublicKey, zetaGroup: PublicKey, quoteVault: PublicKey, baseVault: PublicKey, serumMarket: SerumMarket);
    updateStrike(): void;
    updateOrderbook(): Promise<void>;
    getTopLevel(): TopLevel;
    getOrdersForAccount(openOrdersAddress: PublicKey): Order[];
    getMarketOrders(): Order[];
    cancelAllExpiredOrders(): Promise<void>;
}

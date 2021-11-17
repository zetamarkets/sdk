import * as anchor from "@project-serum/anchor";
import { MarginAccount } from "./program-types";
import { PublicKey, Connection, ConfirmOptions, TransactionSignature } from "@solana/web3.js";
import { Wallet } from "./types";
import { Position, Order, Side } from "./types";
import { EventType } from "./events";
export declare class Client {
    /**
     * Returns the user wallet public key.
     */
    get publicKey(): PublicKey;
    /**
     * Anchor provider for client, including wallet.
     */
    private _provider;
    /**
     * Anchor program wrapper for the IDL.
     */
    private _program;
    /**
     * Stores the user margin account state.
     */
    get marginAccount(): MarginAccount | null;
    private _marginAccount;
    /**
     * Client margin account address.
     */
    get marginAccountAddress(): PublicKey;
    private _marginAccountAddress;
    /**
     * Client usdc account address.
     */
    get usdcAccountAddress(): PublicKey;
    private _usdcAccountAddress;
    /**
     * User open order addresses.
     * If a user hasn't initialized it, it is set to PublicKey.default
     */
    get openOrdersAccounts(): PublicKey[];
    private _openOrdersAccounts;
    /**
     * Returns a list of the user's current orders.
     */
    get orders(): Order[];
    private _orders;
    /**
     * Returns a list of user current positions.
     */
    get positions(): Position[];
    private _positions;
    /**
     * The event emitter for the margin account subscription.
     */
    private _eventEmitter;
    /**
     * The listener for trade events.
     */
    private _tradeEventListener;
    /**
     * Timer id from SetInterval.
     */
    private _pollIntervalId;
    /**
     * Last update timestamp.
     */
    private _lastUpdateTimestamp;
    /**
     * Pending update.
     */
    private _pendingUpdate;
    /**
     * Polling interval.
     */
    get pollInterval(): number;
    set pollingInterval(interval: number);
    private _pollInterval;
    /**
     * User passed callback on load, stored for polling.
     */
    private _callback;
    private constructor();
    /**
     * Returns a new instance of Client, based off state in the Exchange singleton.
     * Requires the Exchange to be in a valid state to succeed.
     *
     * @param throttle    Defaults to true.
     *                    If set to false, margin account callbacks will also call
     *                    `updateState` instead of waiting for the poll.
     */
    static load(connection: Connection, wallet: Wallet, opts?: ConfirmOptions, callback?: (type: EventType, data: any) => void, throttle?: boolean): Promise<Client>;
    /**
     * @param desired interval for client polling.
     */
    private setPolling;
    /**
     * Polls the margin account for the latest state.
     */
    updateState(fetch?: boolean): Promise<void>;
    /**
     * @param amount  the native amount to deposit (6 dp)
     */
    deposit(amount: number): Promise<TransactionSignature>;
    /**
     * @param amount  the native amount to withdraw (6 dp)
     */
    withdraw(amount: number): Promise<TransactionSignature>;
    /**
     * Places an order on a zeta market.
     * @param market the address of the serum market
     * @param price  the native price of the order (6 d.p)
     * @param size   the quantity of the order
     * @param side   the side of the order. bid / ask
     */
    placeOrder(market: PublicKey, price: number, size: number, side: Side): Promise<TransactionSignature>;
    /**
     * Cancels a user order by orderId
     * @param market     the market address of the order to be cancelled.
     * @param orderId    the order id of the order.
     * @param side       the side of the order. bid / ask.
     */
    cancelOrder(market: PublicKey, orderId: anchor.BN, side: Side): Promise<TransactionSignature>;
    /**
     * Cancels a user order by orderId and atomically places an order
     * @param market     the market address of the order to be cancelled.
     * @param orderId    the order id of the order.
     * @param cancelSide       the side of the order. bid / ask.
     * @param newOrderprice  the native price of the order (6 d.p)
     * @param newOrderSize   the quantity of the order
     * @param newOrderside   the side of the order. bid / ask
     */
    cancelAndPlaceOrder(market: PublicKey, orderId: anchor.BN, cancelSide: Side, newOrderPrice: number, newOrderSize: number, newOrderSide: Side): Promise<TransactionSignature>;
    /**
     * Calls force cancel on another user's orders
     * @param market  Market to cancel orders on
     * @param marginAccountToCancel Users to be force-cancelled's margin account
     */
    forceCancelOrders(market: PublicKey, marginAccountToCancel: PublicKey): Promise<TransactionSignature>;
    /**
     * Calls liquidate on another user
     * @param market
     * @param liquidatedMarginAccount
     * @param size
     */
    liquidate(market: PublicKey, liquidatedMarginAccount: PublicKey, size: number): Promise<TransactionSignature>;
    /**
     * Cancels all active user orders
     */
    cancelAllOrders(): Promise<TransactionSignature[]>;
    private getRelevantMarketIndexes;
    private updateOrders;
    private updatePositions;
    /**
     * Closes the client websocket subscription to margin account.
     */
    close(): Promise<void>;
}

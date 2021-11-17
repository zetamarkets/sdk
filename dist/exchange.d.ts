import * as anchor from "@project-serum/anchor";
import { PublicKey, Connection, ConfirmOptions } from "@solana/web3.js";
import { Greeks, ExpirySeries, State, ZetaGroup } from "./program-types";
import { ZetaGroupMarkets } from "./market";
import { RiskCalculator } from "./risk";
import { EventType } from "./events";
import { Network } from "./network";
import { Oracle } from "./oracle";
import { DummyWallet, Wallet } from "./types";
import { UpdateGreeksArgs } from "./program-instructions";
export declare class Exchange {
    /**
     * Whether the object has been loaded.
     */
    get isInitialized(): boolean;
    private _isInitialized;
    /**
     * The solana network being used.
     */
    get network(): Network;
    private _network;
    /**
     * Anchor program instance.
     */
    get program(): anchor.Program;
    private _program;
    get programId(): PublicKey;
    /**
     * Anchor provider instance.
     */
    get provider(): anchor.Provider;
    get connection(): Connection;
    private _provider;
    /**
     * Account storing zeta state.
     */
    get state(): State;
    private _state;
    /**
     * Account storing zeta group account info.
     */
    get zetaGroup(): ZetaGroup;
    private _zetaGroup;
    /**
     * Address of state account.
     */
    get stateAddress(): PublicKey;
    private _stateAddress;
    /**
     * Address of zeta group account.
     */
    get zetaGroupAddress(): PublicKey;
    private _zetaGroupAddress;
    /**
     * Address of global vault token account.
     */
    get vaultAddress(): PublicKey;
    private _vaultAddress;
    /**
     * Zeta PDA for serum market authority
     */
    get serumAuthority(): PublicKey;
    private _serumAuthority;
    /**
     * Zeta PDA for minting serum mints
     */
    get mintAuthority(): PublicKey;
    private _mintAuthority;
    /**
     * Public key used as the stable coin mint.
     */
    get usdcMintAddress(): PublicKey;
    private _usdcMintAddress;
    /**
     * Returns the markets object.
     */
    get markets(): ZetaGroupMarkets;
    get numMarkets(): number;
    private _markets;
    private _eventEmitters;
    /**
     * Stores the latest timestamp received by websocket subscription
     * to the system clock account.
     */
    get clockTimestamp(): number;
    private _clockTimestamp;
    /**
     * Websocket subscription id for clock.
     */
    private _clockSubscriptionId;
    /**
     * Account storing all the greeks.
     */
    get greeks(): Greeks;
    private _greeks;
    /**
     * @param interval   How often to poll zeta group and state in seconds.
     */
    get pollInterval(): number;
    set pollInterval(interval: number);
    private _pollInterval;
    private _lastPollTimestamp;
    get oracle(): Oracle;
    private _oracle;
    /**
     * Risk calculator that holds all margin requirements.
     */
    get riskCalculator(): RiskCalculator;
    private _riskCalculator;
    get frontExpirySeries(): ExpirySeries;
    private init;
    initialize(programId: PublicKey, network: Network, connection: Connection, wallet: Wallet, usdcMint: PublicKey, params: StateParams, opts?: ConfirmOptions): Promise<void>;
    /**
     * Loads a fresh instance of the exchange object using on chain state.
     * @param throttle    Whether to sleep on market loading for rate limit reasons.
     */
    load(programId: PublicKey, network: Network, connection: Connection, opts: ConfirmOptions, wallet?: DummyWallet, throttleMs?: number, callback?: (event: EventType, data: any) => void): Promise<void>;
    /**
     * Initializes a zeta group
     */
    initializeZetaGroup(oracle: PublicKey, callback?: (type: EventType, data: any) => void): Promise<void>;
    /**
     * Update the expiry state variables for the program.
     */
    updateZetaState(params: StateParams): Promise<void>;
    /**
     * Initializes the zeta markets for a zeta group.
     */
    initializeZetaMarkets(): Promise<void>;
    /**
     * Will throw if it is not strike initialization time.
     */
    initializeMarketStrikes(): Promise<void>;
    /**
     * Polls the on chain account to update state.
     */
    updateState(): Promise<void>;
    /**
     * Polls the on chain account to update zeta group.
     */
    updateZetaGroup(): Promise<void>;
    updateGreeks(updates: UpdateGreeksArgs[]): Promise<void>;
    assertInitialized(): void;
    private subscribeZetaGroup;
    private subscribeClock;
    private subscribeGreeks;
    private subscribeOracle;
    private handlePolling;
    /**
     * @param index   market index to get mark price.
     */
    getMarkPrice(index: number): number;
    /**
     * Close the websockets.
     */
    close(): Promise<void>;
}
declare type StateParams = {
    readonly expiryIntervalSeconds: number;
    readonly newExpiryThresholdSeconds: number;
    readonly strikeInitializationThresholdSeconds: number;
};
export declare const exchange: Exchange;
export {};

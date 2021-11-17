"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchange = exports.Exchange = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const utils = __importStar(require("./utils"));
const constants = __importStar(require("./constants"));
const market_1 = require("./market");
const risk_1 = require("./risk");
const events_1 = require("./events");
const oracle_1 = require("./oracle");
const zeta_json_1 = __importDefault(require("./idl/zeta.json"));
const types_1 = require("./types");
const program_instructions_1 = require("./program-instructions");
class Exchange {
    constructor() {
        this._isInitialized = false;
        this._eventEmitters = [];
        this._pollInterval = constants.DEFAULT_EXCHANGE_POLL_INTERVAL;
    }
    /**
     * Whether the object has been loaded.
     */
    get isInitialized() {
        return this._isInitialized;
    }
    /**
     * The solana network being used.
     */
    get network() {
        return this._network;
    }
    /**
     * Anchor program instance.
     */
    get program() {
        return this._program;
    }
    get programId() {
        return this._program.programId;
    }
    /**
     * Anchor provider instance.
     */
    get provider() {
        return this._provider;
    }
    get connection() {
        return this._provider.connection;
    }
    /**
     * Account storing zeta state.
     */
    get state() {
        return this._state;
    }
    /**
     * Account storing zeta group account info.
     */
    get zetaGroup() {
        return this._zetaGroup;
    }
    // Program global addresses that will remain constant.
    /**
     * Address of state account.
     */
    get stateAddress() {
        return this._stateAddress;
    }
    /**
     * Address of zeta group account.
     */
    get zetaGroupAddress() {
        return this._zetaGroupAddress;
    }
    /**
     * Address of global vault token account.
     */
    get vaultAddress() {
        return this._vaultAddress;
    }
    /**
     * Zeta PDA for serum market authority
     */
    get serumAuthority() {
        return this._serumAuthority;
    }
    /**
     * Zeta PDA for minting serum mints
     */
    get mintAuthority() {
        return this._mintAuthority;
    }
    /**
     * Public key used as the stable coin mint.
     */
    get usdcMintAddress() {
        return this._usdcMintAddress;
    }
    /**
     * Returns the markets object.
     */
    get markets() {
        return this._markets;
    }
    get numMarkets() {
        return this._markets.markets.length;
    }
    /**
     * Stores the latest timestamp received by websocket subscription
     * to the system clock account.
     */
    get clockTimestamp() {
        return this._clockTimestamp;
    }
    /**
     * Account storing all the greeks.
     */
    get greeks() {
        return this._greeks;
    }
    /**
     * @param interval   How often to poll zeta group and state in seconds.
     */
    get pollInterval() {
        return this._pollInterval;
    }
    set pollInterval(interval) {
        if (interval < 0) {
            throw Error("Invalid polling interval");
        }
        this._pollInterval = interval;
    }
    /*
     * Oracle object that holds all oracle prices.
     */
    get oracle() {
        return this._oracle;
    }
    /**
     * Risk calculator that holds all margin requirements.
     */
    get riskCalculator() {
        return this._riskCalculator;
    }
    get frontExpirySeries() {
        return this._zetaGroup.expirySeries[this._zetaGroup.frontExpiryIndex];
    }
    init(programId, network, connection, wallet, opts) {
        if (exports.exchange.isInitialized) {
            throw "Exchange already initialized";
        }
        this._provider = new anchor.Provider(connection, wallet, opts || utils.defaultCommitment());
        this._network = network;
        this._program = new anchor.Program(zeta_json_1.default, programId, this._provider);
        this._oracle = new oracle_1.Oracle(this._network, connection);
        this._riskCalculator = new risk_1.RiskCalculator();
        this._lastPollTimestamp = 0;
    }
    async initialize(programId, network, connection, wallet, usdcMint, params, opts) {
        exports.exchange.init(programId, network, connection, wallet, opts);
        const [mintAuthority, mintAuthorityNonce] = await utils.getMintAuthority(programId);
        const [state, stateNonce] = await utils.getState(programId);
        const [serumAuthority, serumNonce] = await utils.getSerumAuthority(programId);
        const [vault, vaultNonce] = await utils.getVault(programId);
        await exports.exchange.program.rpc.initializeZetaState({
            stateNonce: stateNonce,
            vaultNonce: vaultNonce,
            serumNonce: serumNonce,
            mintAuthNonce: mintAuthorityNonce,
            expiryIntervalSeconds: params.expiryIntervalSeconds,
            newExpiryThresholdSeconds: params.newExpiryThresholdSeconds,
            strikeInitializationThresholdSeconds: params.strikeInitializationThresholdSeconds,
        }, {
            accounts: {
                state,
                vault,
                serumAuthority,
                mintAuthority,
                mint: usdcMint,
                rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                systemProgram: web3_js_1.SystemProgram.programId,
                tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                admin: wallet.publicKey,
            },
        });
        exports.exchange._stateAddress = state;
        exports.exchange._vaultAddress = vault;
        exports.exchange._serumAuthority = serumAuthority;
        exports.exchange._mintAuthority = mintAuthority;
        exports.exchange._usdcMintAddress = usdcMint;
        await exports.exchange.updateState();
        console.log(`Initialized zeta state!`);
        console.log(`Params: 
expiryIntervalSeconds=${params.expiryIntervalSeconds},
newExpiryThresholdSeconds=${params.newExpiryThresholdSeconds},
strikeInitializationThresholdSeconds=${params.strikeInitializationThresholdSeconds}`);
    }
    /**
     * Loads a fresh instance of the exchange object using on chain state.
     * @param throttle    Whether to sleep on market loading for rate limit reasons.
     */
    async load(programId, network, connection, opts, wallet = new types_1.DummyWallet(), throttleMs = 0, callback) {
        console.info(`Loading exchange.`);
        if (exports.exchange.isInitialized) {
            throw "Exchange already loaded.";
        }
        exports.exchange.init(programId, network, connection, wallet, opts);
        // Load variables from state.
        const [mintAuthority, _mintAuthorityNonce] = await utils.getMintAuthority(programId);
        const [state, _stateNonce] = await utils.getState(programId);
        const [serumAuthority, _serumNonce] = await utils.getSerumAuthority(programId);
        const [vault, _vaultNonce] = await utils.getVault(programId);
        let usdcMint = await utils.getTokenMint(this.connection, vault);
        exports.exchange._mintAuthority = mintAuthority;
        exports.exchange._stateAddress = state;
        exports.exchange._vaultAddress = vault;
        exports.exchange._serumAuthority = serumAuthority;
        exports.exchange._usdcMintAddress = usdcMint;
        // Load zeta group.
        // TODO: Use constants since we only have 1 underlying for now.
        const [underlying, _underlyingNonce] = await utils.getUnderlying(programId, 0);
        let underlyingAccount = await exports.exchange._program.account.underlying.fetch(underlying);
        const [zetaGroup, _zetaGroupNonce] = await utils.getZetaGroup(programId, underlyingAccount.mint);
        exports.exchange._zetaGroupAddress = zetaGroup;
        await exports.exchange.updateState();
        await exports.exchange.updateZetaGroup();
        if (exports.exchange.zetaGroup.products[exports.exchange.zetaGroup.products.length - 1].market.equals(web3_js_1.PublicKey.default)) {
            throw "Zeta group markets are uninitialized!";
        }
        exports.exchange._markets = await market_1.ZetaGroupMarkets.load(opts, throttleMs);
        exports.exchange._greeks = (await exports.exchange.program.account.greeks.fetch(exports.exchange._zetaGroup.greeks));
        exports.exchange._riskCalculator.updateMarginRequirements();
        // Set callbacks.
        exports.exchange.subscribeZetaGroup(callback);
        exports.exchange.subscribeGreeks(callback);
        await exports.exchange.subscribeClock(callback);
        await exports.exchange.subscribeOracle(callback);
        exports.exchange._isInitialized = true;
        console.log(`Exchange loaded @ ${new Date(exports.exchange.clockTimestamp * 1000)}`);
    }
    /**
     * Initializes a zeta group
     */
    async initializeZetaGroup(oracle, callback) {
        let underlyingIndex = this.state.numUnderlyings;
        let underlyingMint = constants.UNDERLYINGS[underlyingIndex];
        const [zetaGroup, _zetaGroupNonce] = await utils.getZetaGroup(this.program.programId, underlyingMint);
        this._zetaGroupAddress = zetaGroup;
        let tx = await program_instructions_1.initializeZetaGroupTx(underlyingMint, oracle);
        await utils.processTransaction(this._provider, tx);
        await this.updateZetaGroup();
        await this.updateState();
        this.subscribeZetaGroup(callback);
        this.subscribeClock(callback);
        this.subscribeGreeks(callback);
        await this.subscribeOracle(callback);
    }
    /**
     * Update the expiry state variables for the program.
     */
    async updateZetaState(params) {
        await this.program.rpc.updateZetaState({
            expiryIntervalSeconds: params.expiryIntervalSeconds,
            newExpiryThresholdSeconds: params.newExpiryThresholdSeconds,
            strikeInitializationThresholdSeconds: params.strikeInitializationThresholdSeconds,
        }, {
            accounts: {
                state: this._stateAddress,
                admin: this._provider.wallet.publicKey,
            },
        });
        await this.updateState();
    }
    /**
     * Initializes the zeta markets for a zeta group.
     */
    async initializeZetaMarkets() {
        // Initialize market indexes.
        let [marketIndexes, marketIndexesNonce] = await utils.getMarketIndexes(this.programId, this._zetaGroupAddress);
        console.log("Initializing market indexes.");
        await this.program.rpc.initializeMarketIndexes(marketIndexesNonce, {
            accounts: {
                state: this._stateAddress,
                marketIndexes,
                admin: this._provider.wallet.publicKey,
                systemProgram: web3_js_1.SystemProgram.programId,
                zetaGroup: this._zetaGroupAddress,
            },
        });
        // We initialize 50 indexes at a time in the program.
        for (var i = 0; i < constants.TOTAL_MARKETS; i += constants.MARKET_INDEX_LIMIT) {
            await this._program.rpc.addMarketIndexes({
                accounts: {
                    marketIndexes,
                    zetaGroup: this._zetaGroupAddress,
                },
            });
        }
        let marketIndexesAccount = (await this._program.account.marketIndexes.fetch(marketIndexes));
        if (!marketIndexesAccount.initialized) {
            throw Error("Market indexes are not initialized!");
        }
        for (var i = 0; i < this.zetaGroup.products.length; i++) {
            console.log(`Initializing zeta market ${i + 1}/${this.zetaGroup.products.length}`);
            const requestQueue = anchor.web3.Keypair.generate();
            const eventQueue = anchor.web3.Keypair.generate();
            const bids = anchor.web3.Keypair.generate();
            const asks = anchor.web3.Keypair.generate();
            let [tx, tx2] = await program_instructions_1.initializeZetaMarketTxs(marketIndexesAccount.indexes[i], requestQueue.publicKey, eventQueue.publicKey, bids.publicKey, asks.publicKey, marketIndexes);
            await this.provider.send(tx, [requestQueue, eventQueue, bids, asks]);
            await this.provider.send(tx2);
        }
        console.log("Market initialization complete!");
        await this.updateZetaGroup();
        this._markets = await market_1.ZetaGroupMarkets.load(utils.defaultCommitment(), 0);
        this._isInitialized = true;
    }
    /**
     * Will throw if it is not strike initialization time.
     */
    async initializeMarketStrikes() {
        await this.program.rpc.initializeMarketStrikes({
            accounts: {
                state: this.stateAddress,
                zetaGroup: this.zetaGroupAddress,
                oracle: this.zetaGroup.oracle,
            },
        });
    }
    /**
     * Polls the on chain account to update state.
     */
    async updateState() {
        this._state = (await this.program.account.state.fetch(this.stateAddress));
    }
    /**
     * Polls the on chain account to update zeta group.
     */
    async updateZetaGroup() {
        this._zetaGroup = (await this.program.account.zetaGroup.fetch(this.zetaGroupAddress));
    }
    async updateGreeks(updates) {
        let ixs = [];
        for (var i = 0; i < updates.length; i++) {
            ixs.push(await program_instructions_1.updateGreeksIx(updates[i]));
        }
        let txs = utils.splitIxsIntoTx(ixs, constants.MAX_GREEK_UPDATES_PER_TX);
        await Promise.all(txs.map(async (tx) => {
            await utils.processTransaction(this._provider, tx);
        }));
    }
    assertInitialized() {
        if (!this.isInitialized) {
            throw "Exchange uninitialized";
        }
    }
    subscribeZetaGroup(callback) {
        let eventEmitter = this._program.account.zetaGroup.subscribe(this._zetaGroupAddress);
        eventEmitter.on("change", async (zetaGroup) => {
            let expiry = this._zetaGroup !== undefined &&
                this._zetaGroup.frontExpiryIndex !== zetaGroup.frontExpiryIndex;
            this._zetaGroup = zetaGroup;
            if (this._markets !== undefined) {
                this._markets.updateExpirySeries();
            }
            if (callback !== undefined) {
                if (expiry) {
                    callback(events_1.EventType.EXPIRY, null);
                }
                else {
                    callback(events_1.EventType.EXCHANGE, null);
                }
            }
        });
        this._eventEmitters.push(eventEmitter);
    }
    async subscribeClock(callback) {
        if (this._clockSubscriptionId !== undefined) {
            throw Error("Clock already subscribed to.");
        }
        this._clockSubscriptionId = this._provider.connection.onAccountChange(web3_js_1.SYSVAR_CLOCK_PUBKEY, async (accountInfo, _context) => {
            this._clockTimestamp = utils.getClockTimestamp(accountInfo);
            if (callback !== undefined) {
                callback(events_1.EventType.CLOCK, null);
            }
            try {
                await this.handlePolling(callback);
            }
            catch (e) {
                console.log(`Exchange polling failed. Error: ${e}`);
            }
        });
        let accountInfo = await this._provider.connection.getAccountInfo(web3_js_1.SYSVAR_CLOCK_PUBKEY);
        this._clockTimestamp = utils.getClockTimestamp(accountInfo);
    }
    subscribeGreeks(callback) {
        if (this._zetaGroup === null) {
            throw Error("Cannot subscribe greeks. ZetaGroup is null.");
        }
        let eventEmitter = this._program.account.greeks.subscribe(this._zetaGroup.greeks);
        eventEmitter.on("change", async (greeks) => {
            this._greeks = greeks;
            if (callback !== undefined) {
                callback(events_1.EventType.GREEKS, null);
            }
            this._riskCalculator.updateMarginRequirements();
        });
        this._eventEmitters.push(eventEmitter);
    }
    async subscribeOracle(callback) {
        await this._oracle.subscribePriceFeeds((price) => {
            if (callback !== undefined) {
                callback(events_1.EventType.ORACLE, price);
            }
            this._riskCalculator.updateMarginRequirements();
        });
    }
    async handlePolling(callback) {
        if (!this._isInitialized) {
            return;
        }
        if (this._clockTimestamp > this._lastPollTimestamp + this._pollInterval) {
            this._lastPollTimestamp = this._clockTimestamp;
            await this.updateState();
            await this.updateZetaGroup();
            this._markets.updateExpirySeries();
            if (callback !== undefined) {
                callback(events_1.EventType.EXCHANGE, null);
            }
        }
        await this._markets.handlePolling(callback);
    }
    /**
     * @param index   market index to get mark price.
     */
    getMarkPrice(index) {
        return utils.getReadableAmount(this._greeks.productGreeks[index].theo.toNumber());
    }
    /**
     * Close the websockets.
     */
    async close() {
        await this._program.account.zetaGroup.unsubscribe(this._zetaGroupAddress);
        await this._program.account.greeks.unsubscribe(this._zetaGroup.greeks);
        for (var i = 0; i < this._eventEmitters.length; i++) {
            this._eventEmitters[i].removeListener("change");
        }
        this._eventEmitters = [];
        if (this._clockSubscriptionId !== undefined) {
            await this._provider.connection.removeAccountChangeListener(this._clockSubscriptionId);
            this._clockSubscriptionId = undefined;
        }
        await this._oracle.close();
    }
}
exports.Exchange = Exchange;
// Exchange singleton.
exports.exchange = new Exchange();

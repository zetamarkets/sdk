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
exports.Client = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const utils = __importStar(require("./utils"));
const constants_1 = require("./constants");
const exchange_1 = require("./exchange");
const web3_js_1 = require("@solana/web3.js");
const zeta_json_1 = __importDefault(require("./idl/zeta.json"));
const program_instructions_1 = require("./program-instructions");
const events_1 = require("./events");
class Client {
    constructor(connection, wallet, opts) {
        this._pollInterval = constants_1.DEFAULT_CLIENT_POLL_INTERVAL;
        this._provider = new anchor.Provider(connection, wallet, opts);
        this._program = new anchor.Program(zeta_json_1.default, exchange_1.exchange.programId, this._provider);
        this._openOrdersAccounts = Array(exchange_1.exchange.zetaGroup.products.length).fill(web3_js_1.PublicKey.default);
        this._positions = [];
        this._orders = [];
        this._lastUpdateTimestamp = 0;
        this._pendingUpdate = false;
        this._marginAccount = null;
    }
    /**
     * Returns the user wallet public key.
     */
    get publicKey() {
        return this._provider.wallet.publicKey;
    }
    /**
     * Stores the user margin account state.
     */
    get marginAccount() {
        return this._marginAccount;
    }
    /**
     * Client margin account address.
     */
    get marginAccountAddress() {
        return this._marginAccountAddress;
    }
    /**
     * Client usdc account address.
     */
    get usdcAccountAddress() {
        return this._usdcAccountAddress;
    }
    /**
     * User open order addresses.
     * If a user hasn't initialized it, it is set to PublicKey.default
     */
    get openOrdersAccounts() {
        return this._openOrdersAccounts;
    }
    /**
     * Returns a list of the user's current orders.
     */
    get orders() {
        return this._orders;
    }
    /**
     * Returns a list of user current positions.
     */
    get positions() {
        return this._positions;
    }
    /**
     * Polling interval.
     */
    get pollInterval() {
        return this._pollInterval;
    }
    set pollingInterval(interval) {
        if (interval < 0) {
            throw Error("Polling interval invalid!");
        }
        this._pollInterval = interval;
    }
    /**
     * Returns a new instance of Client, based off state in the Exchange singleton.
     * Requires the Exchange to be in a valid state to succeed.
     *
     * @param throttle    Defaults to true.
     *                    If set to false, margin account callbacks will also call
     *                    `updateState` instead of waiting for the poll.
     */
    static async load(connection, wallet, opts = utils.defaultCommitment(), callback = undefined, throttle = false) {
        console.log(`Loading client: ${wallet.publicKey.toString()}`);
        let client = new Client(connection, wallet, opts);
        let [marginAccountAddress, _nonce] = await utils.getMarginAccount(exchange_1.exchange.programId, exchange_1.exchange.zetaGroupAddress, wallet.publicKey);
        client._marginAccountAddress = marginAccountAddress;
        client._eventEmitter = client._program.account.marginAccount.subscribe(client.marginAccountAddress);
        client._callback = callback;
        client._eventEmitter.on("change", async (marginAccount) => {
            client._marginAccount = marginAccount;
            if (!throttle) {
                await client.updateState(false);
                client._lastUpdateTimestamp = exchange_1.exchange.clockTimestamp;
            }
            else {
                client._pendingUpdate = true;
            }
            if (callback !== undefined) {
                callback(events_1.EventType.USER, null);
            }
        });
        client._usdcAccountAddress = await utils.getAssociatedTokenAddress(exchange_1.exchange.usdcMintAddress, wallet.publicKey);
        // Update state without awaiting for updateOrders()
        try {
            client._marginAccount =
                (await client._program.account.marginAccount.fetch(client._marginAccountAddress));
        }
        catch (e) {
            console.log("User does not have a margin account.");
        }
        if (client.marginAccount !== null) {
            // Set open order pdas for initialized accounts.
            await Promise.all(exchange_1.exchange.zetaGroup.products.map(async (product, index) => {
                if (client.marginAccount.openOrdersNonce[index] !== 0) {
                    let [openOrdersPda, _openOrdersNonce] = await utils.getOpenOrders(exchange_1.exchange.programId, product.market, client.publicKey);
                    client._openOrdersAccounts[index] = openOrdersPda;
                }
            }));
            client.updatePositions();
            // We don't update orders here to make load faster.
            client._pendingUpdate = true;
        }
        if (callback !== undefined) {
            client._tradeEventListener = client._program.addEventListener("TradeEvent", (event, _slot) => {
                if (event.marginAccount.equals(marginAccountAddress)) {
                    callback(events_1.EventType.TRADE, event);
                }
            });
        }
        client.setPolling(constants_1.DEFAULT_CLIENT_TIMER_INTERVAL);
        return client;
    }
    /**
     * @param desired interval for client polling.
     */
    setPolling(timerInterval) {
        if (this._pollIntervalId !== undefined) {
            console.log(`Resetting existing timer to ${timerInterval} seconds.`);
            clearInterval(this._pollIntervalId);
        }
        this._pollIntervalId = setInterval(async () => {
            if (exchange_1.exchange.clockTimestamp >
                this._lastUpdateTimestamp + this._pollInterval ||
                this._pendingUpdate) {
                try {
                    await this.updateState();
                    this._pendingUpdate = false;
                    this._lastUpdateTimestamp = exchange_1.exchange.clockTimestamp;
                    if (this._callback !== undefined) {
                        this._callback(events_1.EventType.USER, null);
                    }
                }
                catch (e) {
                    console.log(`Client poll update failed. Error: ${e}`);
                }
            }
        }, timerInterval * 1000);
    }
    /**
     * Polls the margin account for the latest state.
     */
    async updateState(fetch = true) {
        if (fetch) {
            try {
                this._marginAccount = (await this._program.account.marginAccount.fetch(this._marginAccountAddress));
            }
            catch (e) {
                return;
            }
        }
        if (this._marginAccount !== null) {
            await this.updateOrders();
            this.updatePositions();
        }
    }
    /**
     * @param amount  the native amount to deposit (6 dp)
     */
    async deposit(amount) {
        // Check if the user has a USDC account.
        try {
            let tokenAccountInfo = await utils.getTokenAccountInfo(this._provider.connection, this._usdcAccountAddress);
            console.log(`Found user USDC associated token account ${this._usdcAccountAddress.toString()}. Balance = $${utils.getReadableAmount(tokenAccountInfo.amount.toNumber())}.`);
        }
        catch (e) {
            throw Error("User has no USDC associated token account. Please create one and deposit USDC.");
        }
        let tx = new web3_js_1.Transaction();
        if (this._marginAccount === null) {
            console.log("User has no margin account. Creating margin account...");
            tx = await program_instructions_1.initializeMarginAccountTx(this.publicKey);
        }
        tx.add(await program_instructions_1.depositIx(amount, this._marginAccountAddress, this._usdcAccountAddress, this.publicKey));
        let txId = await utils.processTransaction(this._provider, tx);
        console.log(`[DEPOSIT] $${utils.getReadableAmount(amount)}. Transaction: ${txId}`);
        return txId;
    }
    /**
     * @param amount  the native amount to withdraw (6 dp)
     */
    async withdraw(amount) {
        let tx = new web3_js_1.Transaction();
        tx.add(await program_instructions_1.withdrawIx(amount, this._marginAccountAddress, this._usdcAccountAddress, this.publicKey));
        return await utils.processTransaction(this._provider, tx);
    }
    /**
     * Places an order on a zeta market.
     * @param market the address of the serum market
     * @param price  the native price of the order (6 d.p)
     * @param size   the quantity of the order
     * @param side   the side of the order. bid / ask
     */
    async placeOrder(market, price, size, side) {
        let tx = new web3_js_1.Transaction();
        let marketIndex = exchange_1.exchange.markets.getMarketIndex(market);
        let openOrdersPda = null;
        if (this._openOrdersAccounts[marketIndex].equals(web3_js_1.PublicKey.default)) {
            console.log(`User doesn't have open orders account. Initialising for market ${market.toString()}.`);
            let [initIx, _openOrdersPda] = await program_instructions_1.initializeOpenOrdersIx(market, this.publicKey, this.marginAccountAddress);
            openOrdersPda = _openOrdersPda;
            tx.add(initIx);
        }
        else {
            openOrdersPda = this._openOrdersAccounts[marketIndex];
        }
        let orderIx = await program_instructions_1.placeOrderIx(market, price, size, side, this.marginAccountAddress, this.publicKey, openOrdersPda);
        tx.add(orderIx);
        let txId;
        try {
            this._openOrdersAccounts[marketIndex] = openOrdersPda;
            txId = await utils.processTransaction(this._provider, tx);
        }
        catch (e) {
            // If we were initializing open orders in the same tx.
            if (tx.instructions.length > 1) {
                this._openOrdersAccounts[marketIndex] = web3_js_1.PublicKey.default;
            }
            throw e;
        }
        return txId;
    }
    /**
     * Cancels a user order by orderId
     * @param market     the market address of the order to be cancelled.
     * @param orderId    the order id of the order.
     * @param side       the side of the order. bid / ask.
     */
    // TODO: Could probably derive side from this._orders.
    async cancelOrder(market, orderId, side) {
        let tx = new web3_js_1.Transaction();
        let index = exchange_1.exchange.markets.getMarketIndex(market);
        let ix = await program_instructions_1.cancelOrderIx(market, this.publicKey, this._marginAccountAddress, this._openOrdersAccounts[index], orderId, side);
        tx.add(ix);
        return await utils.processTransaction(this._provider, tx);
    }
    /**
     * Cancels a user order by orderId and atomically places an order
     * @param market     the market address of the order to be cancelled.
     * @param orderId    the order id of the order.
     * @param cancelSide       the side of the order. bid / ask.
     * @param newOrderprice  the native price of the order (6 d.p)
     * @param newOrderSize   the quantity of the order
     * @param newOrderside   the side of the order. bid / ask
     */
    // TODO: Could probably derive side from this._orders.
    async cancelAndPlaceOrder(market, orderId, cancelSide, newOrderPrice, newOrderSize, newOrderSide) {
        let tx = new web3_js_1.Transaction();
        let marketIndex = exchange_1.exchange.markets.getMarketIndex(market);
        let ixs = [];
        ixs.push(await program_instructions_1.cancelOrderIx(market, this.publicKey, this._marginAccountAddress, this._openOrdersAccounts[marketIndex], orderId, cancelSide));
        ixs.push(await program_instructions_1.placeOrderIx(market, newOrderPrice, newOrderSize, newOrderSide, this.marginAccountAddress, this.publicKey, this._openOrdersAccounts[marketIndex]));
        ixs.forEach((ix) => tx.add(ix));
        return await utils.processTransaction(this._provider, tx);
    }
    /**
     * Calls force cancel on another user's orders
     * @param market  Market to cancel orders on
     * @param marginAccountToCancel Users to be force-cancelled's margin account
     */
    async forceCancelOrders(market, marginAccountToCancel) {
        let marginAccount = (await this._program.account.marginAccount.fetch(marginAccountToCancel));
        let marketIndex = exchange_1.exchange.markets.getMarketIndex(market);
        let openOrdersAccountToCancel = await utils.createOpenOrdersAddress(exchange_1.exchange.programId, market, marginAccount.authority, marginAccount.openOrdersNonce[marketIndex]);
        let tx = new web3_js_1.Transaction();
        let ix = await program_instructions_1.forceCancelOrdersIx(market, marginAccountToCancel, openOrdersAccountToCancel);
        tx.add(ix);
        return await utils.processTransaction(this._provider, tx);
    }
    /**
     * Calls liquidate on another user
     * @param market
     * @param liquidatedMarginAccount
     * @param size
     */
    async liquidate(market, liquidatedMarginAccount, size) {
        let tx = new web3_js_1.Transaction();
        let ix = await program_instructions_1.liquidateIx(this.publicKey, this._marginAccountAddress, market, liquidatedMarginAccount, size);
        tx.add(ix);
        return await utils.processTransaction(this._provider, tx);
    }
    /**
     * Cancels all active user orders
     */
    async cancelAllOrders() {
        // Can only fit 6 cancels worth of accounts per transaction.
        // on 4 separate markets
        // Compute is fine.
        let ixs = [];
        for (var i = 0; i < this._orders.length; i++) {
            let order = this._orders[i];
            let ix = await program_instructions_1.cancelOrderIx(order.market, this.publicKey, this._marginAccountAddress, this._openOrdersAccounts[order.marketIndex], order.orderId, order.side);
            ixs.push(ix);
        }
        let txs = utils.splitIxsIntoTx(ixs, constants_1.MAX_CANCELS_PER_TX);
        let txIds = [];
        await Promise.all(txs.map(async (tx) => {
            txIds.push(await utils.processTransaction(this._provider, tx));
        }));
        return txIds;
    }
    getRelevantMarketIndexes() {
        let indexes = [];
        for (var i = 0; i < this._marginAccount.positions.length; i++) {
            let position = this._marginAccount.positions[i];
            if (position.position !== 0 ||
                position.openingOrders[0] != 0 ||
                position.openingOrders[1] != 0) {
                indexes.push(i);
            }
        }
        return indexes;
    }
    async updateOrders() {
        let orders = [];
        await Promise.all([...this.getRelevantMarketIndexes()].map(async (i) => {
            await exchange_1.exchange.markets.markets[i].updateOrderbook();
            orders.push(exchange_1.exchange.markets.markets[i].getOrdersForAccount(this._openOrdersAccounts[i]));
        }));
        this._orders = [].concat(...orders);
    }
    updatePositions() {
        let positions = [];
        for (var i = 0; i < this._marginAccount.positions.length; i++) {
            if (this._marginAccount.positions[i].position != 0) {
                positions.push({
                    marketIndex: i,
                    market: exchange_1.exchange.zetaGroup.products[i].market,
                    position: this._marginAccount.positions[i].position,
                    costOfTrades: this._marginAccount.positions[i].costOfTrades.toNumber(),
                });
            }
        }
        this._positions = positions;
    }
    /**
     * Closes the client websocket subscription to margin account.
     */
    async close() {
        await this._program.account.marginAccount.unsubscribe(this._marginAccountAddress);
        this._eventEmitter.removeListener("change");
        if (this._tradeEventListener !== undefined) {
            await this._program.removeEventListener(this._tradeEventListener);
        }
        if (this._pollIntervalId !== undefined) {
            clearInterval(this._pollIntervalId);
        }
    }
}
exports.Client = Client;

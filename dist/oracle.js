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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Oracle = void 0;
const oracle_utils_1 = require("./oracle-utils");
const constants = __importStar(require("./constants"));
class Oracle {
    constructor(network, connection) {
        this._network = network;
        this._connection = connection;
        this._subscriptionIds = new Map();
        this._data = new Map();
        this._callback = undefined;
    }
    getAvailablePriceFeeds() {
        return Object.keys(constants.PYTH_PRICE_FEEDS[this._network]);
    }
    getPrice(feed) {
        if (!this._data.has(feed)) {
            return null;
        }
        return this._data.get(feed);
    }
    async subscribePriceFeeds(callback) {
        if (this._callback != undefined) {
            throw Error("Oracle price feeds already subscribed to!");
        }
        this._callback = callback;
        let feeds = Object.keys(constants.PYTH_PRICE_FEEDS[this._network]);
        for (var i = 0; i < feeds.length; i++) {
            let feed = feeds[i];
            console.log(`Oracle subscribing to feed ${feed}`);
            let priceAddress = constants.PYTH_PRICE_FEEDS[this._network][feed];
            let subscriptionId = this._connection.onAccountChange(priceAddress, (accountInfo, _context) => {
                let priceData = oracle_utils_1.parsePythData(accountInfo.data);
                let currPrice = this._data.get(feed);
                if (currPrice !== undefined && currPrice.price === priceData.price) {
                    return;
                }
                let oracleData = {
                    feed,
                    price: priceData.price,
                };
                this._data.set(feed, oracleData);
                this._callback(oracleData);
            });
            this._subscriptionIds.set(feed, subscriptionId);
            // TODO set this so localnet has data for the oracle
            // Remove once there is an oracle simulator.
            let accountInfo = await this._connection.getAccountInfo(priceAddress);
            let priceData = oracle_utils_1.parsePythData(accountInfo.data);
            let oracleData = {
                feed,
                price: priceData.price,
            };
            this._data.set(feed, oracleData);
        }
    }
    async close() {
        for (let subscriptionId of this._subscriptionIds.values()) {
            await this._connection.removeAccountChangeListener(subscriptionId);
        }
    }
}
exports.Oracle = Oracle;

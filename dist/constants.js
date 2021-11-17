"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEX_ERRORS = exports.FUTURES_MARGIN_PARAMS = exports.OPTION_MARGIN_PARAMS = exports.DEFAULT_CLIENT_TIMER_INTERVAL = exports.DEFAULT_CLIENT_POLL_INTERVAL = exports.DEFAULT_MARKET_POLL_INTERVAL = exports.DEFAULT_EXCHANGE_POLL_INTERVAL = exports.TOTAL_MARKETS = exports.TOTAL_EXPIRIES = exports.ACTIVE_MARKETS = exports.ACTIVE_EXPIRIES = exports.PRODUCTS_PER_EXPIRY = exports.NUM_STRIKES = exports.CLUSTER_URLS = exports.PYTH_PRICE_FEEDS = exports.DEFAULT_ORDERBOOK_DEPTH = exports.MARKET_LOAD_LIMIT = exports.CRANK_ACCOUNT_LIMIT = exports.CLEAN_MARKET_LIMIT = exports.MARKET_INDEX_LIMIT = exports.MAX_SETTLEMENT_ACCOUNTS = exports.MAX_GREEK_UPDATES_PER_TX = exports.MAX_CANCELS_PER_TX = exports.DEX_PID = exports.UNDERLYINGS = exports.MINTS = void 0;
const web3_js_1 = require("@solana/web3.js");
exports.MINTS = {
    SOL: new web3_js_1.PublicKey("So11111111111111111111111111111111111111112"),
};
exports.UNDERLYINGS = [exports.MINTS["SOL"]];
exports.DEX_PID = new web3_js_1.PublicKey("DEX6XtaRGm4cNU2XE18ykY4RMAY3xdygdkas7CdhMLaF");
exports.MAX_CANCELS_PER_TX = 4;
exports.MAX_GREEK_UPDATES_PER_TX = 20;
exports.MAX_SETTLEMENT_ACCOUNTS = 20;
exports.MARKET_INDEX_LIMIT = 40;
// 3 accounts per set * 9 = 27 + 2 = 29 accounts.
exports.CLEAN_MARKET_LIMIT = 9;
exports.CRANK_ACCOUNT_LIMIT = 12;
// This is the most we can load per iteration without
// hitting the rate limit.
exports.MARKET_LOAD_LIMIT = 12;
exports.DEFAULT_ORDERBOOK_DEPTH = 5;
exports.PYTH_PRICE_FEEDS = {
    localnet: {
        "SOL/USD": new web3_js_1.PublicKey("2pRCJksgaoKRMqBfa7NTdd6tLYe9wbDFGCcCCZ6si3F7"),
    },
    devnet: {
        "SOL/USD": new web3_js_1.PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
    },
    mainnet_beta: {
        "SOL/USD": new web3_js_1.PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
    },
};
exports.CLUSTER_URLS = {
    localnet: "http://127.0.0.1:8899",
    devnet: "https://api.devnet.solana.com",
    mainnet_beta: "https://api.mainnet-beta.solana.com",
};
// These are fixed and shouldn't change in the future.
exports.NUM_STRIKES = 11;
exports.PRODUCTS_PER_EXPIRY = exports.NUM_STRIKES * 2 + 1; // +1 for the future.
exports.ACTIVE_EXPIRIES = 2;
exports.ACTIVE_MARKETS = exports.ACTIVE_EXPIRIES * exports.PRODUCTS_PER_EXPIRY;
exports.TOTAL_EXPIRIES = 6;
exports.TOTAL_MARKETS = exports.PRODUCTS_PER_EXPIRY * exports.TOTAL_EXPIRIES;
exports.DEFAULT_EXCHANGE_POLL_INTERVAL = 30;
exports.DEFAULT_MARKET_POLL_INTERVAL = 5;
exports.DEFAULT_CLIENT_POLL_INTERVAL = 20;
exports.DEFAULT_CLIENT_TIMER_INTERVAL = 2;
/**
 * markPricePercentageLong - Percentage of mark price for a long
 * spotPricePercentageLong = Percentage of spot price for a long
 * spotPricePercentageShort = Percentage of spot price for a short
 * basePercentageShort = The base percentage pre scaling for OTM
 */
exports.OPTION_MARGIN_PARAMS = {
    initial: {
        markPricePercentageLong: 1.0,
        spotPricePercentageLong: 0.15,
        spotPricePercentageShort: 0.1,
        basePercentageShort: 0.25,
    },
    maintenance: {
        markPricePercentageLong: 1.0,
        spotPricePercentageLong: 0.075,
        spotPricePercentageShort: 0.125,
        basePercentageShort: 0.05,
    },
};
exports.FUTURES_MARGIN_PARAMS = {
    initial: 0.15,
    maintenance: 0.075,
};
exports.DEX_ERRORS = new Map([
    [59, "Order doesn't exist"],
    [61, "Order would self-trade"],
]);

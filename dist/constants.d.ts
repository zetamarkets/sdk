import { PublicKey } from "@solana/web3.js";
export declare const MINTS: {
    SOL: PublicKey;
};
export declare const UNDERLYINGS: PublicKey[];
export declare const DEX_PID: PublicKey;
export declare const MAX_CANCELS_PER_TX = 4;
export declare const MAX_GREEK_UPDATES_PER_TX = 20;
export declare const MAX_SETTLEMENT_ACCOUNTS = 20;
export declare const MARKET_INDEX_LIMIT = 40;
export declare const CLEAN_MARKET_LIMIT = 9;
export declare const CRANK_ACCOUNT_LIMIT = 12;
export declare const MARKET_LOAD_LIMIT = 12;
export declare const DEFAULT_ORDERBOOK_DEPTH = 5;
export declare const PYTH_PRICE_FEEDS: {
    localnet: {
        "SOL/USD": PublicKey;
    };
    devnet: {
        "SOL/USD": PublicKey;
    };
    mainnet_beta: {
        "SOL/USD": PublicKey;
    };
};
export declare const CLUSTER_URLS: {
    localnet: string;
    devnet: string;
    mainnet_beta: string;
};
export declare const NUM_STRIKES = 11;
export declare const PRODUCTS_PER_EXPIRY: number;
export declare const ACTIVE_EXPIRIES = 2;
export declare const ACTIVE_MARKETS: number;
export declare const TOTAL_EXPIRIES = 6;
export declare const TOTAL_MARKETS: number;
export declare const DEFAULT_EXCHANGE_POLL_INTERVAL = 30;
export declare const DEFAULT_MARKET_POLL_INTERVAL = 5;
export declare const DEFAULT_CLIENT_POLL_INTERVAL = 20;
export declare const DEFAULT_CLIENT_TIMER_INTERVAL = 2;
/**
 * markPricePercentageLong - Percentage of mark price for a long
 * spotPricePercentageLong = Percentage of spot price for a long
 * spotPricePercentageShort = Percentage of spot price for a short
 * basePercentageShort = The base percentage pre scaling for OTM
 */
export declare const OPTION_MARGIN_PARAMS: {
    initial: {
        markPricePercentageLong: number;
        spotPricePercentageLong: number;
        spotPricePercentageShort: number;
        basePercentageShort: number;
    };
    maintenance: {
        markPricePercentageLong: number;
        spotPricePercentageLong: number;
        spotPricePercentageShort: number;
        basePercentageShort: number;
    };
};
export declare const FUTURES_MARGIN_PARAMS: {
    initial: number;
    maintenance: number;
};
export declare const DEX_ERRORS: Map<number, string>;

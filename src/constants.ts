import { PublicKey } from "@solana/web3.js";

export const MINTS = {
  SOL: new PublicKey("So11111111111111111111111111111111111111112"),
};

export const UNDERLYINGS = [MINTS["SOL"]];

export const DEX_PID = new PublicKey(
  "5CmWtUihvSrJpaUrpJ3H1jUa9DRjYz4v2xs6c3EgQWMf"
);

export const MAX_CANCELS_PER_TX = 4;
export const MAX_GREEK_UPDATES_PER_TX = 20;
export const MAX_SETTLEMENT_ACCOUNTS = 20;
export const MAX_REBALANCE_ACCOUNTS = 20;
export const MARKET_INDEX_LIMIT = 40;
// 3 accounts per set * 9 = 27 + 2 = 29 accounts.
export const CLEAN_MARKET_LIMIT = 9;
export const CRANK_ACCOUNT_LIMIT = 12;

// This is the most we can load per iteration without
// hitting the rate limit.
export const MARKET_LOAD_LIMIT = 12;

export const DEFAULT_ORDERBOOK_DEPTH = 5;

export const PYTH_PRICE_FEEDS = {
  localnet: {
    "SOL/USD": new PublicKey("2pRCJksgaoKRMqBfa7NTdd6tLYe9wbDFGCcCCZ6si3F7"),
  },
  devnet: {
    "SOL/USD": new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
  },
  mainnet_beta: {
    "SOL/USD": new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
  },
};

export const CLUSTER_URLS = {
  localnet: "http://127.0.0.1:8899",
  devnet: "https://api.devnet.solana.com",
  mainnet_beta: "https://api.mainnet-beta.solana.com",
};

// These are fixed and shouldn't change in the future.
export const NUM_STRIKES = 11;
export const PRODUCTS_PER_EXPIRY = NUM_STRIKES * 2 + 1; // +1 for the future.
export const ACTIVE_EXPIRIES = 2;
export const ACTIVE_MARKETS = ACTIVE_EXPIRIES * PRODUCTS_PER_EXPIRY;
export const TOTAL_EXPIRIES = 6;
export const TOTAL_MARKETS = PRODUCTS_PER_EXPIRY * TOTAL_EXPIRIES;

export const DEFAULT_EXCHANGE_POLL_INTERVAL = 30;
export const DEFAULT_MARKET_POLL_INTERVAL = 5;
export const DEFAULT_CLIENT_POLL_INTERVAL = 20;
export const DEFAULT_CLIENT_TIMER_INTERVAL = 2;

export const VOLATILITY_POINTS = 5;

// Numbers represented in BN are generally fixed point integers with precision of 6.
export const PLATFORM_PRECISION = 6;
export const PRICING_PRECISION = 12;

/**
 * markPricePercentageLong - Percentage of mark price for a long
 * spotPricePercentageLong = Percentage of spot price for a long
 * spotPricePercentageShort = Percentage of spot price for a short
 * basePercentageShort = The base percentage pre scaling for OTM
 */
export const OPTION_MARGIN_PARAMS = {
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

export const FUTURES_MARGIN_PARAMS = {
  initial: 0.15,
  maintenance: 0.075,
};

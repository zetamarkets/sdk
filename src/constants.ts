import { PublicKey } from "@solana/web3.js";
import { Asset } from "./assets";

// Asset keys are wormhole from mainnet.
export const MINTS = {
  [Asset.SOL]: new PublicKey("So11111111111111111111111111111111111111112"),
  [Asset.BTC]: new PublicKey("qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL"),
  [Asset.ETH]: new PublicKey("FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf"),
};

export const DEX_PID = {
  localnet: new PublicKey("5CmWtUihvSrJpaUrpJ3H1jUa9DRjYz4v2xs6c3EgQWMf"),
  devnet: new PublicKey("5CmWtUihvSrJpaUrpJ3H1jUa9DRjYz4v2xs6c3EgQWMf"),
  mainnet: new PublicKey("zDEXqXEG7gAyxb1Kg9mK5fPnUdENCGKzWrM21RMdWRq"),
};

export const MAX_SETTLE_AND_CLOSE_PER_TX = 4;
export const MAX_CANCELS_PER_TX = 3;
export const MAX_GREEK_UPDATES_PER_TX = 20;
export const MAX_SETTLEMENT_ACCOUNTS = 20;
export const MAX_FUNDING_ACCOUNTS = 20;
export const MAX_REBALANCE_ACCOUNTS = 18;
export const MAX_SETTLE_ACCOUNTS = 5;
export const MAX_ZETA_GROUPS = 20;
export const MAX_MARGIN_AND_SPREAD_ACCOUNTS = 20;
export const MAX_SET_REFERRALS_REWARDS_ACCOUNTS = 12;
export const MARKET_INDEX_LIMIT = 18;
// 3 accounts per set * 9 = 27 + 2 = 29 accounts.
export const CLEAN_MARKET_LIMIT = 9;
export const CRANK_ACCOUNT_LIMIT = 10;
export const MAX_MARKETS_TO_FETCH = 50;

// This is the most we can load per iteration without
// hitting the rate limit.
export const MARKET_LOAD_LIMIT = 12;

export const DEFAULT_ORDERBOOK_DEPTH = 5;
export const MAX_ORDER_TAG_LENGTH = 4;

// From the account itself in account.rs
// 8 + 32 + 1 + 8 + 1 + 138 + 48 + 5520 + 8
export const MARGIN_ACCOUNT_ASSET_OFFSET = 5764;
// 8 + 32 + 1 + 8 + 48 + 2208
export const SPREAD_ACCOUNT_ASSET_OFFSET = 2305;

export const PYTH_PRICE_FEEDS = {
  localnet: {
    [Asset.SOL]: new PublicKey("2pRCJksgaoKRMqBfa7NTdd6tLYe9wbDFGCcCCZ6si3F7"),
    [Asset.BTC]: new PublicKey("9WD5hzrwEtwbYyZ34BRnrSS11TzD7PTMyszKV5Ur4JxJ"),
    [Asset.ETH]: new PublicKey("FkUZhotvECPTBEXXzxBPjnJu6vPiQmptKyUDSXapBgHJ"),
  },
  devnet: {
    [Asset.SOL]: new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
    [Asset.BTC]: new PublicKey("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J"),
    [Asset.ETH]: new PublicKey("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw"),
  },
  mainnet: {
    [Asset.SOL]: new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
    [Asset.BTC]: new PublicKey("GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU"),
    [Asset.ETH]: new PublicKey("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB"),
  },
};

export const USDC_MINT_ADDRESS = {
  localnet: new PublicKey("6PEh8n3p7BbCTykufbq1nSJYAZvUp6gSwEANAs1ZhsCX"),
  devnet: new PublicKey("6PEh8n3p7BbCTykufbq1nSJYAZvUp6gSwEANAs1ZhsCX"),
  mainnet: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
};

export const CLUSTER_URLS = {
  localnet: "http://127.0.0.1:8899",
  devnet: "https://api.devnet.solana.com",
  mainnet: "https://api.mainnet-beta.solana.com",
};

// These are fixed and shouldn't change in the future.
export const NUM_STRIKES = 11;
export const PRODUCTS_PER_EXPIRY = NUM_STRIKES * 2 + 1; // +1 for the future.
export const SERIES_FUTURE_INDEX = PRODUCTS_PER_EXPIRY - 1;
export const ACTIVE_EXPIRIES = 2;
export const ACTIVE_MARKETS = ACTIVE_EXPIRIES * PRODUCTS_PER_EXPIRY + 1; // +1 for perp
export const TOTAL_EXPIRIES = 5;
export const TOTAL_MARKETS = PRODUCTS_PER_EXPIRY * (TOTAL_EXPIRIES + 1);
export const PERP_INDEX = TOTAL_MARKETS - 1;
// TODO maybe these should be renamed after perps?
// eg we tend to use ACTIVE_MARKETS as 'all the indexes that are active' rather than 'how many indexes are active'

export const DEFAULT_EXCHANGE_POLL_INTERVAL = 30;
export const DEFAULT_MARKET_POLL_INTERVAL = 5;
export const DEFAULT_CLIENT_POLL_INTERVAL = 20;
export const DEFAULT_CLIENT_TIMER_INTERVAL = 1;
export const UPDATING_STATE_LIMIT_SECONDS = 10;

export const VOLATILITY_POINTS = 5;

// Numbers represented in BN are generally fixed point integers with precision of 6.
export const PLATFORM_PRECISION = 6;
export const PRICING_PRECISION = 12;
export const MARGIN_PRECISION = 8;
export const POSITION_PRECISION = 3;

export const DEFAULT_ORDER_TAG = "SDK";

export const MAX_POSITION_MOVEMENTS = 10;
export const BPS_DENOMINATOR = 10_000;

export const BID_ORDERS_INDEX = 0;
export const ASK_ORDERS_INDEX = 1;

export const MAX_TOTAL_SPREAD_ACCOUNT_CONTRACTS = 100_000_000;

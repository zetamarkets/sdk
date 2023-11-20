import { PublicKey, AddressLookupTableAccount } from "@solana/web3.js";

// Ordered in underlying sequence number.
export enum Asset {
  SOL = "SOL",
  BTC = "BTC",
  ETH = "ETH",
  APT = "APT",
  ARB = "ARB",
  BNB = "BNB",
  PYTH = "PYTH",
  UNDEFINED = "UNDEFINED",
}

export const ZETA_PID: {
  localnet: PublicKey;
  devnet: PublicKey;
  mainnet: PublicKey;
} = {
  localnet: new PublicKey("BG3oRikW8d16YjUEmX3ZxHm9SiJzrGtMhsSR8aCw1Cd7"),
  devnet: new PublicKey("BG3oRikW8d16YjUEmX3ZxHm9SiJzrGtMhsSR8aCw1Cd7"),
  mainnet: new PublicKey("ZETAxsqBRek56DhiGXrn75yj2NHU3aYUnxvHXpkf3aD"),
};

// Asset keys are wormhole from mainnet.
export const MINTS = {
  [Asset.SOL]: new PublicKey("So11111111111111111111111111111111111111112"),
  [Asset.BTC]: new PublicKey("qfnqNqs3nCAHjnyCgLRDbBtq4p2MtHZxw8YjSyYhPoL"),
  [Asset.ETH]: new PublicKey("FeGn77dhg1KXRRFeSwwMiykZnZPw5JXW6naf2aQgZDQf"),
  [Asset.BNB]: new PublicKey("9gP2kCy3wA1ctvYWQk75guqXuHfrEomqydHLtcTCqiLa"),
};

// These are generated flexible PDAs and aren't reflective of an spl token mint.
export const FLEX_MINTS = {
  localnet: {
    [Asset.APT]: new PublicKey("FbfkphUHaAd7c27RqhzKBRAPX8T5AzFBH259sbGmNuvG"),
    [Asset.ARB]: new PublicKey("w8h6r5ogLihfuWeCA1gs7boxNjzbwWeQbXMB3UATaC6"),
    [Asset.PYTH]: new PublicKey("5PK1Ty2ac1Un6zY11Em7qF4FAYBgUu5y8Pt8ZtbepGnF"),
  },
  devnet: {
    [Asset.APT]: new PublicKey("FbfkphUHaAd7c27RqhzKBRAPX8T5AzFBH259sbGmNuvG"),
    [Asset.ARB]: new PublicKey("w8h6r5ogLihfuWeCA1gs7boxNjzbwWeQbXMB3UATaC6"),
  },
  mainnet: {
    [Asset.APT]: new PublicKey("8z8oShLky1PauW9hxv6AsjnricLqoK9MfmNZJDQNNNPr"),
    [Asset.ARB]: new PublicKey("Ebd7aUFu3rtsZruCzTnG4tjBoxaJdWT8S3t4yC8hVpbo"),
    [Asset.PYTH]: new PublicKey("BjZmtqBVKY1oUSUjgq9PBQWJPyWbcWTXYbQ1oWxa9NYp"),
  },
};

export const ZETAGROUP_PUBKEY_ASSET_MAP = {
  localnet: {
    ["HRobFXQ2HQvSgCLq2CU9ZG3DR2BxRaAffw5SvdNnvk97"]: Asset.SOL,
    ["CcLF7qQbgRQqUDmQeEkTSP2UbX82N9G91THjV5uRGCMW"]: Asset.BTC,
    ["8Ccch7LW5hd5j2NW8HdhUbDqB1yUN4dULVMNNHtfbPbV"]: Asset.ETH,
    ["5QyPHfnRttz4Tq7W7U5XEpKpvj7g3FTvMpE1BzL9w2Qi"]: Asset.APT,
    ["4fecsFCi8Tx4aFxvc8rAYT74RBmknQ3kqidZTejoqiw7"]: Asset.ARB,
    ["BAyFQXp7JBc26ZxMNBdzSjVDtEjQFXkcu7FYVniQFgyK"]: Asset.BNB,
  },
  devnet: {
    ["HRobFXQ2HQvSgCLq2CU9ZG3DR2BxRaAffw5SvdNnvk97"]: Asset.SOL,
    ["CcLF7qQbgRQqUDmQeEkTSP2UbX82N9G91THjV5uRGCMW"]: Asset.BTC,
    ["8Ccch7LW5hd5j2NW8HdhUbDqB1yUN4dULVMNNHtfbPbV"]: Asset.ETH,
    ["5QyPHfnRttz4Tq7W7U5XEpKpvj7g3FTvMpE1BzL9w2Qi"]: Asset.APT,
    ["4fecsFCi8Tx4aFxvc8rAYT74RBmknQ3kqidZTejoqiw7"]: Asset.ARB,
    ["BAyFQXp7JBc26ZxMNBdzSjVDtEjQFXkcu7FYVniQFgyK"]: Asset.BNB,
  },
  mainnet: {
    ["CoGhjFdyqzMFr5xVgznuBjULvoFbFtNN4bCdQzRArNK2"]: Asset.SOL,
    ["5XC7JWvLGGds4tjaawgY8FwMdotUb5rrEUmxcmyp5ZiW"]: Asset.BTC,
    ["HPnqfiRSVvuBjfHN9ah4Kecb6J9et2UTnNgUwtAJdV26"]: Asset.ETH,
    ["D19K6rrppbWAFa4jE1DJUStPnr7cSrqKk5TruGqfc5Ns"]: Asset.APT,
    ["CU6pPA2E2yQFqMzZKrFCmfjrSBEc6GxfmFrSqpqazygu"]: Asset.ARB,
    ["83vVPH4DaUxsi7otAK3yr8atUebbBxHQfHA6CLyzcDiW"]: Asset.BNB,
    ["2JRRckcZK4pRCMpLXtG9TkDw4QxJNiwwjs8BG6b5piFy"]: Asset.PYTH,
  },
};

export const DEX_PID: {
  localnet: PublicKey;
  devnet: PublicKey;
  mainnet: PublicKey;
} = {
  localnet: new PublicKey("5CmWtUihvSrJpaUrpJ3H1jUa9DRjYz4v2xs6c3EgQWMf"),
  devnet: new PublicKey("5CmWtUihvSrJpaUrpJ3H1jUa9DRjYz4v2xs6c3EgQWMf"),
  mainnet: new PublicKey("zDEXqXEG7gAyxb1Kg9mK5fPnUdENCGKzWrM21RMdWRq"),
};

export const CHAINLINK_PID: PublicKey = new PublicKey(
  "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny"
);

export const MAX_SETTLE_AND_CLOSE_PER_TX = 4;
export const MAX_CANCELS_PER_TX = 3;
export const MAX_CANCELS_PER_TX_LUT = 13;
export const MAX_GREEK_UPDATES_PER_TX = 20;
export const MAX_TRIGGER_CANCELS_PER_TX = 10;
export const MAX_SETTLEMENT_ACCOUNTS = 20;
export const MAX_FUNDING_ACCOUNTS = 20;
export const MAX_REBALANCE_ACCOUNTS = 18;
export const MAX_SETTLE_ACCOUNTS = 5;
export const MAX_ZETA_GROUPS = 20;
export const MAX_MARGIN_AND_SPREAD_ACCOUNTS = 20;
export const MAX_SET_REFERRALS_REWARDS_ACCOUNTS = 12;
export const MAX_INITIALIZE_MARKET_TIF_EPOCH_CYCLE_IXS_PER_TX = 15;
export const MARKET_INDEX_LIMIT = 18;
// 3 accounts per set * 9 = 27 + 2 = 29 accounts.
export const CLEAN_MARKET_LIMIT = 9;
export const CRANK_ACCOUNT_LIMIT = 12;
export const CRANK_PERP_ACCOUNT_LIMIT = 10;
export const MAX_MARKETS_TO_FETCH = 50;
export const MAX_ACCOUNTS_TO_FETCH = 99;

export const MIN_LOT_SIZE = 0.001;
export const PERP_MARKET_ORDER_SPOT_SLIPPAGE = 0.02;

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
    [Asset.ETH]: new PublicKey("4L2jLMAy8L7BbHKuaPoH7M7sxdYF9wE7B655WR5dTevM"),
    [Asset.APT]: new PublicKey("64nz875oGiwcDCx9RuwUjj188hBWPP4GRdJvYk6hrgay"),
    [Asset.ARB]: new PublicKey("APN6KouMoYPF3rR8KxSmWCWQwEW8PykMVpyTAPdLogk4"),
    [Asset.BNB]: new PublicKey("27xFcQmxoHoqpuMcZdwVMCwrrmZAFwN3QEuwtxskR1Lc"),
    [Asset.PYTH]: new PublicKey("5kkS7RmNdcECCMcgJ4gz4sCSFqnFozQeSNb3YhtZrhYx"),
  },
  devnet: {
    [Asset.SOL]: new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
    [Asset.BTC]: new PublicKey("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J"),
    [Asset.ETH]: new PublicKey("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw"),
    [Asset.APT]: new PublicKey("5d2QJ6u2NveZufmJ4noHja5EHs3Bv1DUMPLG5xfasSVs"),
    [Asset.ARB]: new PublicKey("4mRGHzjGerQNWKXyQAmr9kWqb9saPPHKqo1xziXGQ5Dh"),
    [Asset.BNB]: new PublicKey("GwzBgrXb4PG59zjce24SF2b9JXbLEjJJTBkmytuEZj1b"),
  },
  mainnet: {
    [Asset.SOL]: new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
    [Asset.BTC]: new PublicKey("GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU"),
    [Asset.ETH]: new PublicKey("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB"),
    [Asset.APT]: new PublicKey("FNNvb1AFDnDVPkocEri8mWbJ1952HQZtFLuwPiUjSJQ"),
    [Asset.ARB]: new PublicKey("5HRrdmghsnU3i2u5StaKaydS7eq3vnKVKwXMzCNKsc4C"),
    [Asset.BNB]: new PublicKey("4CkQJBxhU8EZ2UjhigbtdaPbpTe6mqf811fipYBFbSYN"),
    [Asset.PYTH]: new PublicKey("nrYkQQQur7z8rYTST3G9GqATviK5SxTDkrqd21MW6Ue"),
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
export const ACTIVE_PERP_MARKETS = 7;
export const UNUSED_PERP_MARKETS = 18;

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
export const TICK_SIZE = 100;

export const DEFAULT_ORDER_TAG = "SDK";

export const MAX_POSITION_MOVEMENTS = 10;
export const BPS_DENOMINATOR = 10_000;

export const BID_ORDERS_INDEX = 0;
export const ASK_ORDERS_INDEX = 1;

export const MAX_TOTAL_SPREAD_ACCOUNT_CONTRACTS = 100_000_000;

export const DEFAULT_MICRO_LAMPORTS_PER_CU_FEE = 1000;

export const STATIC_AND_PERPS_LUT: {
  devnet: AddressLookupTableAccount;
  mainnet: AddressLookupTableAccount;
} = {
  devnet: new AddressLookupTableAccount({
    key: new PublicKey("7d78oUykmcUTj7RWa3jNW3s2LA5WnjMB2woS26PoWUEr"),
    state: {
      deactivationSlot: BigInt("18446744073709551615"),
      lastExtendedSlot: 248778174,
      lastExtendedSlotStartIndex: 80,
      authority: new PublicKey("6qtNr6afnq8JjXQqxxgKfXQ2QKPrdVD232tivdrkhP39"),
      addresses: [
        new PublicKey("9VddCF6iEyZbjkCQ4g8VJpjEtuLsgmvRCc6LQwAvXigC"),
        new PublicKey("BditorsEXbVw6R8Woe6JhoyXC1beJCixYt57UMKuiwQi"),
        new PublicKey("5CmWtUihvSrJpaUrpJ3H1jUa9DRjYz4v2xs6c3EgQWMf"),
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        new PublicKey("7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"),
        new PublicKey("SysvarRent111111111111111111111111111111111"),
        new PublicKey("HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny"),
        new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
        new PublicKey("99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR"),
        new PublicKey("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J"),
        new PublicKey("6PxBx93S8x3tno1TsFZwT5VqP8drrRCbCXygEXYNkFJe"),
        new PublicKey("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw"),
        new PublicKey("669U43LNHx7LsVj95uYksnhXUfWKDsdzVqev3V4Jpw3P"),
        new PublicKey("5d2QJ6u2NveZufmJ4noHja5EHs3Bv1DUMPLG5xfasSVs"),
        new PublicKey("11111111111111111111111111111111"),
        new PublicKey("5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7"),
        new PublicKey("11111111111111111111111111111111"),
        new PublicKey("GwzBgrXb4PG59zjce24SF2b9JXbLEjJJTBkmytuEZj1b"),
        new PublicKey("11111111111111111111111111111111"),
        new PublicKey("JB43m9cTZVb4LcEfBA1Bf49nz4cod2Xt5i2HRAAMQvdo"),
        new PublicKey("6YcgjoTUTeafyFC5C6vgFCVoM69qgpj966PhCojwiS4Z"),
        new PublicKey("qjoUa8fC1DjsnwVwUCJQcVDJVYUhAnrqz3B9FSxVPAm"),
        new PublicKey("5kSQn4o4S4mRR48sLZ5kijvCjnnD4NbwPqaBaQYvC6wk"),
        new PublicKey("7Nm1pAysuk38D6uiU83wXfegzruqohVNwUippwSZNx71"),
        new PublicKey("V6Y9bCVTTwjBDYAJ6ixMWWFK7RKZcQeUcpufZaM3DDB"),
        new PublicKey("5yiNVYs4xpC26yY9K3DYTRvdFkdjBSnkyeSAA3Huf4Q2"),
        new PublicKey("CjwQEszLimhf3FkwqcB5rGppZS4ADLeCmtPvcRefv5qi"),
        new PublicKey("HM95yakZehLhBkVx2a5mwzTTf4UeqfDeSno17NstQKzd"),
        new PublicKey("GHSuFYv8SicmVC3c5DeKgFhjDdegNH552srPFufFysDU"),
        new PublicKey("HT9nmiVtAbLp3GFtfrhGCPGz1tBcvHyFz43pf8rtDArs"),
        new PublicKey("J8yPaachUYRo1qbtdvkQU6Ee2vzEt3JiYRncwkfoB3iZ"),
        new PublicKey("D9mSSsfXp9SUrSCrmPA8sDJ42GMn65Z5tZr9wtwbHEBy"),
        new PublicKey("AYUthyJDg6mvBWjGfEGYcnjRbw3TZbYCnEQyqUiPyw57"),
        new PublicKey("D7g6CGNVzebzzH1t98tBJKjA6FokiuXKaX3QVF53ZqcC"),
        new PublicKey("DLzvYrHo4bT8PoSwhxDWKhH9ZNsnPbE5cgCx1coCpeR6"),
        new PublicKey("2CtvLehungAsAcYhqnhLEoxuTaM5WqHrycn2YNpmnC4z"),
        new PublicKey("9bGCvH7MwfwyKuNzgfGRXU8sW9jWtFMJf4FmUsQxk13Z"),
        new PublicKey("8pQvXjUf9qq6Lsk9WE8tqtPXxgf4Yav32DneQDLaJr9k"),
        new PublicKey("Gxc3KYEgasnSbevj9GnzwDk2i82BRHACQ8HWtgA1VXUk"),
        new PublicKey("2fgyaTU1BeSk3LWbEh9p3D1H29hEt1wyy8qchKNGxBhg"),
        new PublicKey("FDXX8a9asz32d6EteL6Wnra71YjT45TuGHy8Y8dPntbq"),
        new PublicKey("JCk2bU5xNDUBk55W5BoEgNeKqssXdj15vLqhuzQEEiCU"),
        new PublicKey("HYv5Vb7G3849dYN8RG2pQx7awXiEk3nE9F3AGWnedffs"),
        new PublicKey("5RDbC6wYGhc1AjCCArwggtbAyPUse6yMcq3fgSzZqY5E"),
        new PublicKey("2CCypxRdB6tCackur4De72ZSnsNcicfSjWYZwAcVzEZ9"),
        new PublicKey("J5e19jEz625k7K5K3yinpMoHNzznv8smCemvKAYCWLMH"),
        new PublicKey("7QDHQhNjMzuKKk9T5vsdZ5hTfLu2P1pUGk2TKJKFd8hn"),
        new PublicKey("DYXqC6UGPwsz5W3jaFAJtpbBsvJpBSi34W6cMn7ZiL6m"),
        new PublicKey("2YBnvgCAh6WcXrs5Wz2uhi2nMuEVDXE28mQ5AmHjRaJQ"),
        new PublicKey("wkTZtYAo75bpqqy2J5A6emsLK69EYG8otvJipAbiJF9"),
        new PublicKey("FXgqEhVGX82dsyKMAgR2JCRaC9FNH4ih611bJftmD3tG"),
        new PublicKey("B3iV7Y5S9Xqu6cTECpBCAHtL2nwvZntD2d7F1zbpbQc3"),
        new PublicKey("J7E7gv1iofWZg8b37RVnKy2i1FAnCRBvgk54YpVtZ4WS"),
        new PublicKey("EPf7hymYW7bnwiBYGTRF4Ji2jJ2yTdn4XMTpR6N4zsGA"),
        new PublicKey("DNXXx5yaQm6Kd4embzqHW94kjjypxzZ8zCQthMvmHDq1"),
        new PublicKey("6VUvm4i9T2w9CXzLKaUDNTZ4KmK3xKCWz95xEoyKjjE8"),
        new PublicKey("Dd3K16uKGDa2Xc83NYQE9jpcMNZ9GRqmqggkkpXo4x4y"),
        new PublicKey("FUsWmTk7PaEvXCHFZH6XMbimgqbVkiKPXd35tHWo5vm4"),
        new PublicKey("Fc7FU4VATyYuvkhp6MuPUHWYHC9EBFknN5TTHs3wGjyn"),
        new PublicKey("CW5zwzmhQn9Pqjzxjdzr4AdmVSoehBQ2RdfyppU37uDE"),
        new PublicKey("Cvqd7RtB4bf9SJpmWwNd6GVXvtAX4m4DtSR5u2XahTQf"),
        new PublicKey("67XFnD7YuBfd52qPrD5FuasrQW21jLd4jxnDfozyeSvx"),
        new PublicKey("3H7nvQAJBzsXVPEyzpuL4kB3tPz5rs7XVxuxVLV7YDNy"),
        new PublicKey("JEDqstU8skdUF6bGsMzZaa17Tfuf3asxQPuLVXqmWqyt"),
        new PublicKey("2Ux9NzgadfR2PHyrSauzWLaNr99syCRKriwF4mnEqPUv"),
        new PublicKey("4NEK9db8v9PZC5RnzSEh596jNwfRMH6QcQQG2ZhqkStb"),
        new PublicKey("2mRZPMv67hz1QocPQ7JS5sEp8uD9u9TfdLoZzf8LciiZ"),
        new PublicKey("G3ytGgn7MzH5DpLCSBshkV4xQe1G4JBbTu7c9CCWA9U"),
        new PublicKey("J5t2VsFLSXGTaA1o2qCujduJ9dnHLok9QhYUroN2fc6X"),
        new PublicKey("6UEwXk5ixtC6rDJG7X2X6MLNwiAyjGZZyN6L1JG63n4H"),
        new PublicKey("FkHx7byyFDGheXCcmVxdavTDteotaDJZk8DBNBm2Maeb"),
        new PublicKey("zXEzviQpq8u89oAKdU7r3vHHxXpxC2547AoLzxCKSJ3"),
        new PublicKey("93DGPpMR6w3gqbrbpZrChqw8vihgHibmdejB4Q1p4DbP"),
        new PublicKey("Ag4cqXXAAxa9NCZcFgQuoeDkvtSbxwe6qaEfjw4aRnUH"),
        new PublicKey("2j1BJUDD9dXXzypVyjT5HXAy1e11VzjtMpGW4U7ynJXP"),
        new PublicKey("BN7EMGBdTBkJfAtuRhUWpDdewqk6RVF2CvyVku6fvH26"),
        new PublicKey("8yNLGd4fngCtsXeoVoEEE22Bicjkcuvq9GWbdHd6b6nK"),
        new PublicKey("HaAPQFP2nxinog4SDzJ8pZCv7eFNXxCxzhQrm5JrHckq"),
        new PublicKey("GQH1eMDvw9hysVFiiVRwdjWW4Pow5AjguY3U39Gnn1my"),
        new PublicKey("5xAbQKS8qdS4D5h78AusSraZDqyPjGfiDyzQNRBSgyqD"),
        new PublicKey("DwvnBtJW1x8LANmaVPgUt8F9uY9AEnXH9CM1dsBxvpd7"),
        new PublicKey("Ch4Gd1tyNhGnqRrHD112PvgevmCi5RA8br4CRESdJp9R"),
        new PublicKey("D2MvxY79gJUs1b1VmEiDTN85r8vgQDxU9Z2vE5oKVa4N"),
        new PublicKey("6KjVaBHGvFGcVzptCmqUgE6mRnLrbtssSP2nVN4SJWw8"),
        new PublicKey("DZP6WX2p8ZERhr9qHxpySt3hR77KU38KLFth1JfAhGe4"),
      ],
    },
  }),
  mainnet: new AddressLookupTableAccount({
    key: new PublicKey("CCKEj67kdDAjqwm5LdmTrXpH6zr2bWpAszAKc3fGM7dk"),
    state: {
      deactivationSlot: BigInt("18446744073709551615"),
      lastExtendedSlot: 231149614,
      lastExtendedSlotStartIndex: 80,
      authority: new PublicKey("BR47Yncz7AKKD4f6NuP83yxb31YjvYvZuHApjEvtP8tu"),
      addresses: [
        new PublicKey("8eExPiLp47xbSDYkbuem4qnLUpbLTfZBeFuEJoh6EUr2"),
        new PublicKey("BbKFezrmKD83PeVh74958MzgFAue1pZptipSNLz5ccpk"),
        new PublicKey("zDEXqXEG7gAyxb1Kg9mK5fPnUdENCGKzWrM21RMdWRq"),
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        new PublicKey("AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"),
        new PublicKey("SysvarRent111111111111111111111111111111111"),
        new PublicKey("HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny"),
        new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
        new PublicKey("CH31Xns5z3M1cTAbKW34jcxPPciazARpijcHj9rxtemt"),
        new PublicKey("GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU"),
        new PublicKey("Cv4T27XbjVoKUYwP72NQQanvZeA7W4YF9L4EnYT9kx5o"),
        new PublicKey("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB"),
        new PublicKey("716hFAECqotxcXcj8Hs8nr7AG6q9dBw2oX3k3M8V7uGq"),
        new PublicKey("FNNvb1AFDnDVPkocEri8mWbJ1952HQZtFLuwPiUjSJQ"),
        new PublicKey("11111111111111111111111111111111"),
        new PublicKey("5HRrdmghsnU3i2u5StaKaydS7eq3vnKVKwXMzCNKsc4C"),
        new PublicKey("11111111111111111111111111111111"),
        new PublicKey("4CkQJBxhU8EZ2UjhigbtdaPbpTe6mqf811fipYBFbSYN"),
        new PublicKey("F6rApkRBD31K6zZrwXt8aQrRKwzbZqCMH2vbMvBgftPX"),
        new PublicKey("nrYkQQQur7z8rYTST3G9GqATviK5SxTDkrqd21MW6Ue"),
        new PublicKey("11111111111111111111111111111111"),
        new PublicKey("JE6d41JRokZAMUEAznV8JP4h7i6Ain6CyJrQuweRipFU"),
        new PublicKey("EaNR74nCjrYyNDsuoWmq19pH76QSd1nuTzvJSr3RDQ6x"),
        new PublicKey("3rjBffJkFa9zdGr9xmTVxF3y6nL6iL1pASVzym7s5FGr"),
        new PublicKey("HcjrQKnbqKJuxHDLNM9LJPyxcQs237waNZXW7RwgvAps"),
        new PublicKey("Ec4xsLLgLc4wM5c19ZSvazE7M9Rtk2T6RzddNcSQKYGu"),
        new PublicKey("BEjGhNFnKT5weGtpBoFs5Y1mDN47Ntvag5aMV59nZRpk"),
        new PublicKey("CHBUBfU3zscTNsihdK3x44TbpTza1hwcsTUaZfk751b5"),
        new PublicKey("GYm6qTFwkGJx2ywetEuYrjHjhzVFCM2TwayyqS1HUPLG"),
        new PublicKey("7aXkF7AZE2D3h128eNJ7VVp72HCV1izjKFsJ8uNWtCFN"),
        new PublicKey("BKt2FdgBahn77joeawhNidswFxfgasPYCHWghRL4AKBR"),
        new PublicKey("2ZLdhFsrkAtdn9Kud4SZvqchQFvn5jVCHUdJ83vumKyR"),
        new PublicKey("J5DTCqRAjX1FyzoP2A2HVmmaXuG971HJ8X1Z8Rvvd8uT"),
        new PublicKey("6JSdqUr24mBt4MCQrZHRoSfeZbjgALx4MQunZwD8Uarg"),
        new PublicKey("4K1zxqAZn7bGAPN26W5mUaHrLMSpCk45gT4qVXwmfh39"),
        new PublicKey("8JSbFw4YT3bzpbbHs1wKmRCSAmKucAba7XSUWj1p8xK5"),
        new PublicKey("483SmqGQVxw3WDwcewMYHqC3Mu7ENxfTQJQtTR3ttpi7"),
        new PublicKey("DbzL5mT4nBaxuAs8ti4UeT2qougRBdujxa7GhLndM5Jz"),
        new PublicKey("7M9xhY2ARnrkCaBK5SNM3Lyd3FdbTu2EWBwG4TQcqpsv"),
        new PublicKey("5mvaZWcZa4gB3JZptZuFAJnmDFfo1JovhqTkkfEcsryD"),
        new PublicKey("DboTtkWW3KPvT14fag8N6iDUyDXaT8FeBszGV9xdfBx2"),
        new PublicKey("DhMH8oRQoAAb6poHVsvCqq3NCMj6aKUH2tGQG5Lo4bCg"),
        new PublicKey("63DZkAzoDXmzGzn9esoWSYpMLo4YB9oPHXreHKwuu4HA"),
        new PublicKey("J8x6y5G7GmTkuKTbbCAnfhn72vaUU2qsB6je9oKFigHM"),
        new PublicKey("A7D8zuxAmtui3XKz2VcxthAZ5HuwLbN74rrDapMJ3Z5d"),
        new PublicKey("CzK26LWpoU9UjSrZkVu97oZj63abJrNv1zp9Hy2zZdy5"),
        new PublicKey("CaqN8gomPEB1My2czRhetrj5ESKP3VRR3kwKhXtGxohG"),
        new PublicKey("4oAjuVLt5N9au2X3bhYLSi9LRqtk4caBvSPQRwhXuEKP"),
        new PublicKey("9YVE9r9cHFZNwm91p3Js8NBWVznesLSM8FZyswG2MG1B"),
        new PublicKey("DecjLCYjb7jdDp2UqA2MS4xjgDjZfvdgMjvkRW7oWs9L"),
        new PublicKey("8SH6uJe5rV13APZFQvkGdXPwTyeiLv67XTnv3EeYff3B"),
        new PublicKey("DhWWXYK2DSnCdK5rkAxJBkGb1SBR49RHpfHj2u1vobCJ"),
        new PublicKey("5Ehp2LtTRmjug39GphXhFEeguz7hGeg41N1U49wU8Kov"),
        new PublicKey("2Stzi7XE3btUQXaauTVB9brPAtPmGnrEDSJmp3w5VY2j"),
        new PublicKey("J6feTwcYDydW71Dp9qgfW7Mu9qk3qDRrDZAWV8NMVh9x"),
        new PublicKey("EPf7hymYW7bnwiBYGTRF4Ji2jJ2yTdn4XMTpR6N4zsGA"),
        new PublicKey("DNXXx5yaQm6Kd4embzqHW94kjjypxzZ8zCQthMvmHDq1"),
        new PublicKey("6VUvm4i9T2w9CXzLKaUDNTZ4KmK3xKCWz95xEoyKjjE8"),
        new PublicKey("Dd3K16uKGDa2Xc83NYQE9jpcMNZ9GRqmqggkkpXo4x4y"),
        new PublicKey("GqCVQuGMf8YkiaJkSrD98D3WZxFfktcKzAwdBEQsx1th"),
        new PublicKey("2BpEtArGNotp97DjVKwhYZ86WEq2Y5bLtGGDvicuJ9br"),
        new PublicKey("6nkbQueQanrsg2JVvqoZ6zPuZsiL3oLmTk7xgEpRAirD"),
        new PublicKey("7T1qeETZ6ZpbKJ7wmrWoxhewLaJRW9H4EgMnR1tgHYRQ"),
        new PublicKey("6S6WYL1mQFmVxsf3ft5MEH8hzxJA1LcUDzgwdJDj3yxc"),
        new PublicKey("GuNWJSV4k95FZdwhAcjdaPGGoh9cArc27yV4P54QwWdg"),
        new PublicKey("J18LXTGe2cPgpLKSCwXiG6tYkjcqEiaMUznM19Q8faVL"),
        new PublicKey("gP91avgCrV9KB2ATgRtMCNN2AN7oU9hK1frENe17QkR"),
        new PublicKey("DUtwwtnNBzpPTnzUiz23vqH93gd1qwEzGisyC5bLwCBv"),
        new PublicKey("A4SayHehmafd6DNjrzY3L9ddQEGw4UHV3LMcKfmyPcMT"),
        new PublicKey("8if1NcDaif8dxM3Ct6rRTQEj9GFwukadU1MDQHqCnw9h"),
        new PublicKey("GnSRgncxFbtxqZ4HmfnF6daCmgkc8tuQz9i37hUmwV5t"),
        new PublicKey("6JjDgGzqzU6Az7ZmTARAvBSwBxfXsqbVG3Rc9JGU9i4L"),
        new PublicKey("GQXdvh4dHvENTFi2CfVrh77aQD1Y6V7HMNYNCuvgbSuc"),
        new PublicKey("EC2PCjwcuBBFHp6gpAKa3kdpLVrQxdy7kgr7p4wPy8Vw"),
        new PublicKey("7j1N5UiXLFxaxFWq5tzZc5R3sjPHcF7jqfHJgAtE74q8"),
        new PublicKey("Eqt3anUy8nqDvzJaNvWvqBM32Ln4UUnLkfvdd9Ztfj81"),
        new PublicKey("6C3K3LDgVeiKZ93d4TTsax6qxjmr2Hm61873aR8ykJYT"),
        new PublicKey("Ao4fdNfwP1KPUwxoKbKVZ3Jp12MiCsK8gvvxbumn75by"),
        new PublicKey("238aPEmvSnFdra3gMYz2NPSwHPPTaf5bGxaqMXMs35GE"),
        new PublicKey("5JLWHAW2fX7C2PFc2Len3kUfjYJAKLAyUhb8i9nr9cH3"),
        new PublicKey("HhcUi31CHLScAV1dpQq1suxsXpg331fETUZU1GsNgVSx"),
        new PublicKey("GNp5Q8fwD45azybdXKfuYYTHRkUh2krX9ejYuNKMFNmR"),
        new PublicKey("DZdqa3nVJmyPc2ei397Cr1TufzZiNG3G6aRrV1AZ52p7"),
        new PublicKey("5qxoTJ3N5GRNJnWuZ4E8Ak4MUB4hiPwyCrn3VMPmgsAM"),
        new PublicKey("3cU8siJiNomBZDB12qA5QoRTwUMi2ZUa6f496js2RUwf"),
        new PublicKey("5DPKMXmf9WK1C6N1MoJLWjYApiP4KR8zNf1oofevGEub"),
        new PublicKey("B6sV248kSsj6n72osn3Wcuz87JX3RFMD7FZpgwdYGQTm"),
        new PublicKey("ALYccFbb6ZPmUuiGeFC6pers4bfgpV2RtKoFiAsyQK8X"),
        new PublicKey("DCSXWke6HzdA8J6FhcxxM7mrdr4mkNhN32KjVAPtCZeG"),
        new PublicKey("8tjRWGXkCAszLS1XF5Vf7uEiGvhpggaG2aNmqcvuKUC8"),
        new PublicKey("8jU96TshKzrLqXzZbUL5privTaT6RQqV1rGeJ6EMuoYS"),
        new PublicKey("D9A4dFKehqpcyNDdeRYvA9hkUDa2RUTF7zN6vwZVnT6w"),
        new PublicKey("7cdY8U9Q5T5ktvF8VtkkZ1E7bt5mqbcQJQUw4433uEaV"),
        new PublicKey("137rR2TJ7ryu7nBxNNCeCdXqEt79jQLo4YvTzhEoAEh4"),
        new PublicKey("4LhMuCufFL4aR1UvnNQ4zP49FqmjRj4uVrJ9qE7L1GxS"),
        new PublicKey("8UxG6sugH55rMybJkVXt3Pb3pJh9ZfRQbzajHEDDezsT"),
        new PublicKey("7Pnbf6WLGpsYjbjnQN4t8wMCzdDGsx9ZAyuLd4vZmN49"),
        new PublicKey("5Q245C352ChdBGWmNbiYmFneAUiMjhnbPwUqmdHWJ8U6"),
      ],
    },
  }),
};

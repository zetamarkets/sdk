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
  TIA = "TIA",
  JTO = "JTO",
  ONEMBONK = "ONEMBONK",
  SEI = "SEI",
  JUP = "JUP",
  DYM = "DYM",
  STRK = "STRK",
  WIF = "WIF",
  RNDR = "RNDR",
  TNSR = "TNSR",
  UNDEFINED = "UNDEFINED",
}

export enum MarginAccountType {
  NORMAL = 0,
  MARKET_MAKER = 1,
  MARKET_MAKER_T1 = 2,
  MARKET_MAKER_T0 = 3,
  MARKET_MAKER_T2 = 4,
  MARKET_MAKER_T3 = 5,
  MARKET_MAKER_T4 = 6,
  MARKET_MAKER_T5 = 7,
  MARKET_MAKER_T6 = 8,
  MARKET_MAKER_T7 = 9,
  MARKET_MAKER_T8 = 10,
  MARKET_MAKER_T9 = 11,
  NORMAL_T1 = 12,
  NORMAL_T2 = 13,
  NORMAL_T3 = 14,
  NORMAL_T4 = 15,
  NORMAL_T5 = 16,
  NORMAL_T6 = 17,
  NORMAL_T7 = 18,
  NORMAL_T8 = 19,
  NORMAL_T9 = 20,
  WITHDRAW_ONLY = 21,
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
    [Asset.TIA]: new PublicKey("3U2JttPo1k5xsapjuvQJQnH3Kj8D5HegF3PKoPReJ4JU"),
    [Asset.JTO]: new PublicKey("5x1KCouXo8Hwtsypsd8K3AaXT1Zs7WNNdKEJafuatey6"),
    [Asset.ONEMBONK]: new PublicKey(
      "LF8rzt8WSzMuH3E4pfryGvSWMc1jDponXdQHkzL2cGo"
    ),
    [Asset.SEI]: new PublicKey("Dju5Nvuet6GyBk7dBwWSG9cg2JDhtxKXHsBTs7HFbPk3"),
    [Asset.JUP]: new PublicKey("rYFexooTE27wUDaJsjpy8UdyKqUHxroPvfB2Hgmajjt"),
    [Asset.DYM]: new PublicKey("EgsE6WkPfaNT9iEDyrUmNb4C4jCaJ6BPC9wZsp6CdRFj"),
    [Asset.STRK]: new PublicKey("7dEBs64vVgs8Ws3DkK7cwxSMe9RzQ21pnYawXgFaxisp"),
    [Asset.WIF]: new PublicKey("BgDrDxc75EqPTXPUTCFMnYVYPeWK3CimPz2LGw4egsYc"),
    [Asset.RNDR]: new PublicKey("397Hd8iZXmzRf4jqCSuACtUUWeweYZRZ4DmgvVpMkHJf"),
    [Asset.TNSR]: new PublicKey("58MFM7mjjYMc6GoK6QUu7HuUmsih8aL5MTHptPE29p8G"),
  },
  devnet: {
    [Asset.APT]: new PublicKey("FbfkphUHaAd7c27RqhzKBRAPX8T5AzFBH259sbGmNuvG"),
    [Asset.ARB]: new PublicKey("w8h6r5ogLihfuWeCA1gs7boxNjzbwWeQbXMB3UATaC6"),
    [Asset.PYTH]: new PublicKey("5PK1Ty2ac1Un6zY11Em7qF4FAYBgUu5y8Pt8ZtbepGnF"),
    [Asset.TIA]: new PublicKey("3U2JttPo1k5xsapjuvQJQnH3Kj8D5HegF3PKoPReJ4JU"),
  },
  mainnet: {
    [Asset.APT]: new PublicKey("8z8oShLky1PauW9hxv6AsjnricLqoK9MfmNZJDQNNNPr"),
    [Asset.ARB]: new PublicKey("Ebd7aUFu3rtsZruCzTnG4tjBoxaJdWT8S3t4yC8hVpbo"),
    [Asset.PYTH]: new PublicKey("BjZmtqBVKY1oUSUjgq9PBQWJPyWbcWTXYbQ1oWxa9NYp"),
    [Asset.TIA]: new PublicKey("DmBnRoEiwGCud2C8X6h67ZLVhq6GyTm2NDRXvRz6uWYE"),
    [Asset.JTO]: new PublicKey("71jxAnng6EMHYZzXEBoRZUnnhd8iyoAoc1soUgPDMt9e"),
    [Asset.ONEMBONK]: new PublicKey(
      "76x829V8cNWymEBNjUuE22bUcVnShNeRwnXnegviejyj"
    ),
    [Asset.SEI]: new PublicKey("CTw2xSSAfrv9hJGVpB2R2q5xYrdX79i3hXeCiQiAKf2f"),
    [Asset.JUP]: new PublicKey("7uP5h7kxRaSbd2dz5e6gZp8yhqazyMvaXVoNZ4HsgZ2n"),
    [Asset.DYM]: new PublicKey("FxxBzHfSZc794sRw6aLs7KuaG9iBy1hSLLFV8LLQYAiL"),
    [Asset.STRK]: new PublicKey("C42HXAXQiV6EqxzTvmwff6FgCPNw7r2MgvJ9uv8UNdce"),
    [Asset.WIF]: new PublicKey("7jCmRqJaJq5iojCwGqq5DdwUBYPhrpvJcgNZsFLM4Pd5"),
    [Asset.RNDR]: new PublicKey("GSF4GTjWxacrQoVbf8PUcvCvMvZUzwXFEmb2Jso6XU5H"),
    [Asset.TNSR]: new PublicKey("3bTWLSNoD95dP2SHq4diRz3ZTeDXmybTsjPUQzRpTCHR"),
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
    ["HzEPLf1xmHdGjrbHG2WjfvEfU8AgcLudQyReVrWyZWB8"]: Asset.PYTH,
    ["9diwAsKMFYaAey7enhAWcWbyLgZ5XRALaukUhbcGytgm"]: Asset.TIA,
  },
  devnet: {
    ["HRobFXQ2HQvSgCLq2CU9ZG3DR2BxRaAffw5SvdNnvk97"]: Asset.SOL,
    ["CcLF7qQbgRQqUDmQeEkTSP2UbX82N9G91THjV5uRGCMW"]: Asset.BTC,
    ["8Ccch7LW5hd5j2NW8HdhUbDqB1yUN4dULVMNNHtfbPbV"]: Asset.ETH,
    ["5QyPHfnRttz4Tq7W7U5XEpKpvj7g3FTvMpE1BzL9w2Qi"]: Asset.APT,
    ["4fecsFCi8Tx4aFxvc8rAYT74RBmknQ3kqidZTejoqiw7"]: Asset.ARB,
    ["BAyFQXp7JBc26ZxMNBdzSjVDtEjQFXkcu7FYVniQFgyK"]: Asset.BNB,
    ["HzEPLf1xmHdGjrbHG2WjfvEfU8AgcLudQyReVrWyZWB8"]: Asset.PYTH,
    ["9diwAsKMFYaAey7enhAWcWbyLgZ5XRALaukUhbcGytgm"]: Asset.TIA,
  },
  mainnet: {
    ["CoGhjFdyqzMFr5xVgznuBjULvoFbFtNN4bCdQzRArNK2"]: Asset.SOL,
    ["5XC7JWvLGGds4tjaawgY8FwMdotUb5rrEUmxcmyp5ZiW"]: Asset.BTC,
    ["HPnqfiRSVvuBjfHN9ah4Kecb6J9et2UTnNgUwtAJdV26"]: Asset.ETH,
    ["D19K6rrppbWAFa4jE1DJUStPnr7cSrqKk5TruGqfc5Ns"]: Asset.APT,
    ["CU6pPA2E2yQFqMzZKrFCmfjrSBEc6GxfmFrSqpqazygu"]: Asset.ARB,
    ["83vVPH4DaUxsi7otAK3yr8atUebbBxHQfHA6CLyzcDiW"]: Asset.BNB,
    ["2JRRckcZK4pRCMpLXtG9TkDw4QxJNiwwjs8BG6b5piFy"]: Asset.PYTH,
    ["3gbBUKLs2Xm4KKRemwFNxSWmNRMohXwKtV8Yj1PNBUeD"]: Asset.TIA,
    ["Ddvq1YADoRuL4ATP4ThE9NWwsBSegb4XHd9C6jmUecQy"]: Asset.JTO,
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

// These are constants onchain
// We duplicate them here for convenient access for frontend and risk utils
export const FEE_TIER_MAP_BPS = {
  taker: {
    [MarginAccountType.MARKET_MAKER]: 0,
    [MarginAccountType.MARKET_MAKER_T0]: 10,
    [MarginAccountType.MARKET_MAKER_T1]: 9,
    [MarginAccountType.MARKET_MAKER_T2]: 8,
    [MarginAccountType.MARKET_MAKER_T3]: 7,
    [MarginAccountType.MARKET_MAKER_T4]: 6,
    [MarginAccountType.MARKET_MAKER_T5]: 5,
    [MarginAccountType.NORMAL]: 10,
    [MarginAccountType.NORMAL_T1]: 9,
    [MarginAccountType.NORMAL_T2]: 8,
    [MarginAccountType.NORMAL_T3]: 7,
    [MarginAccountType.NORMAL_T4]: 6,
    [MarginAccountType.NORMAL_T5]: 5,
    [MarginAccountType.NORMAL_T6]: 4,
    [MarginAccountType.NORMAL_T7]: 3,
  },
  maker: {
    [MarginAccountType.MARKET_MAKER]: 0,
    [MarginAccountType.MARKET_MAKER_T0]: 0,
    [MarginAccountType.MARKET_MAKER_T1]: 0,
    [MarginAccountType.MARKET_MAKER_T2]: 0,
    [MarginAccountType.MARKET_MAKER_T3]: 0,
    [MarginAccountType.MARKET_MAKER_T4]: 0,
    [MarginAccountType.MARKET_MAKER_T5]: 0,
    [MarginAccountType.NORMAL]: 2,
    [MarginAccountType.NORMAL_T1]: 1.8,
    [MarginAccountType.NORMAL_T2]: 1.6,
    [MarginAccountType.NORMAL_T3]: 1.4,
    [MarginAccountType.NORMAL_T4]: 1.2,
    [MarginAccountType.NORMAL_T5]: 1,
    [MarginAccountType.NORMAL_T6]: 0.8,
    [MarginAccountType.NORMAL_T7]: 0.6,
  },
};

export const ACCOUNT_TYPE_TO_FEE_TIER_MAP = {
  [MarginAccountType.MARKET_MAKER_T0]: 0,
  [MarginAccountType.MARKET_MAKER_T1]: 1,
  [MarginAccountType.MARKET_MAKER_T2]: 2,
  [MarginAccountType.MARKET_MAKER_T3]: 3,
  [MarginAccountType.MARKET_MAKER_T4]: 4,
  [MarginAccountType.MARKET_MAKER_T5]: 5,
  [MarginAccountType.MARKET_MAKER_T6]: 6,
  [MarginAccountType.MARKET_MAKER_T7]: 7,
  [MarginAccountType.NORMAL]: 0,
  [MarginAccountType.NORMAL_T1]: 1,
  [MarginAccountType.NORMAL_T2]: 2,
  [MarginAccountType.NORMAL_T3]: 3,
  [MarginAccountType.NORMAL_T4]: 4,
  [MarginAccountType.NORMAL_T5]: 5,
  [MarginAccountType.NORMAL_T6]: 6,
  [MarginAccountType.NORMAL_T7]: 7,
};

export const MAX_SETTLE_AND_CLOSE_PER_TX = 4;
export const MAX_CANCELS_PER_TX = 3;
export const MAX_CANCELS_PER_TX_LUT = 13;
export const MAX_PRUNE_CANCELS_PER_TX = 3;
export const MAX_PRUNE_CANCELS_PER_TX_LUT = 5;
export const MAX_ORDERS_PER_TX = 1;
export const MAX_ORDERS_PER_TX_LUT = 3;
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

export const MIN_NATIVE_MIN_LOT_SIZE = 1;
export const MIN_NATIVE_TICK_SIZE = 100;
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

export const PYTHNET_PRICE_FEED_IDS = {
  // Pyth sponsored
  [Asset.SOL]:
    "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
  // Pyth sponsored
  [Asset.BTC]:
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
  // Pyth sponsored
  [Asset.ETH]:
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
  [Asset.APT]:
    "0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5",
  [Asset.ARB]:
    "0x3fa4252848f9f0a1480be62745a4629d9eb1322aebab8a791e344b3b9c1adcf5",
  [Asset.BNB]:
    "0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f",
  // Pyth sponsored
  [Asset.PYTH]:
    "0x0bbf28e9a841a1cc788f6a361b17ca072d0ea3098a1e5df1c3922d06719579ff",
  [Asset.TIA]:
    "0x09f7c1d7dfbb7df2b8fe3d3d87ee94a2259d212da4f30c1f0540d066dfa44723",
  // Pyth sponsored
  [Asset.JTO]:
    "0xb43660a5f790c69354b0729a5ef9d50d68f1df92107540210b9cccba1f947cc2",
  // Pyth sponsored
  [Asset.ONEMBONK]:
    "0x72b021217ca3fe68922a19aaf990109cb9d84e9ad004b4d2025ad6f529314419",
  [Asset.SEI]:
    "0x53614f1cb0c031d4af66c04cb9c756234adad0e1cee85303795091499a4084eb",
  // Pyth sponsored
  [Asset.JUP]:
    "0x0a0408d619e9380abad35060f9192039ed5042fa6f82301d0e48bb52be830996",
  [Asset.DYM]:
    "0xa9f3b2a89c6f85a6c20a9518abde39b944e839ca49a0c92307c65974d3f14a57",
  [Asset.STRK]:
    "0x6a182399ff70ccf3e06024898942028204125a819e519a335ffa4579e66cd870",
  // Pyth sponsored
  [Asset.WIF]:
    "0x4ca4beeca86f0d164160323817a4e42b10010a724c2217c6ee41b54cd4cc61fc",
  [Asset.RNDR]:
    "0xab7347771135fc733f8f38db462ba085ed3309955f42554a14fa13e855ac0e2f",
  [Asset.TNSR]:
    "0x05ecd4597cd48fe13d6cc3596c62af4f9675aee06e2e0b94c06d8bee2b659e05",
};

export const PYTH_PRICE_FEEDS = {
  localnet: {
    [Asset.SOL]: new PublicKey("2pRCJksgaoKRMqBfa7NTdd6tLYe9wbDFGCcCCZ6si3F7"),
    [Asset.BTC]: new PublicKey("9WD5hzrwEtwbYyZ34BRnrSS11TzD7PTMyszKV5Ur4JxJ"),
    [Asset.ETH]: new PublicKey("4L2jLMAy8L7BbHKuaPoH7M7sxdYF9wE7B655WR5dTevM"),
    [Asset.APT]: new PublicKey("64nz875oGiwcDCx9RuwUjj188hBWPP4GRdJvYk6hrgay"),
    [Asset.ARB]: new PublicKey("APN6KouMoYPF3rR8KxSmWCWQwEW8PykMVpyTAPdLogk4"),
    [Asset.BNB]: new PublicKey("27xFcQmxoHoqpuMcZdwVMCwrrmZAFwN3QEuwtxskR1Lc"),
    [Asset.PYTH]: new PublicKey("5kkS7RmNdcECCMcgJ4gz4sCSFqnFozQeSNb3YhtZrhYx"),
    [Asset.TIA]: new PublicKey("FwZ5ZzkcWseaCKcu5iVWT5Ru29FDReARyiA6BaSSB5RH"),
    [Asset.JTO]: new PublicKey("EZg2yWshcvHikVk6KDw6vEsbbPtKPfTx537Fz4hhSmsc"),
    [Asset.ONEMBONK]: new PublicKey(
      "G6PKiDSNpyeFRM6iLyZWXTP4U8sKejdEHpDGEXJxTpdP"
    ),
    [Asset.SEI]: new PublicKey("EhC74qLWnp3i5y3EiPibQHdAkNU4F9kvcDuWgcQuLj6G"),
    [Asset.JUP]: new PublicKey("8uMQw668EowuxXcX6oYohLepTCoZmk9WEnj224qevLqj"),
    [Asset.DYM]: new PublicKey("9XFg7LwjRp2UjqkdiEdeA9wSNovgc5v9iW231UMfeSDz"),
    [Asset.STRK]: new PublicKey("6gtqwzdgeb8Luay2BSbyn3tobqfr3tWjdyP2tsySSiJu"),
    [Asset.WIF]: new PublicKey("Ae9pWfoS4jS8WFxMTApKHkmMaod171aRcekm1iFbsmoy"),
    [Asset.RNDR]: new PublicKey("7DvNVeya3b6WqcxSzUZFW9CWdDayJoRYjnpg2HVbgv2h"),
    [Asset.TNSR]: new PublicKey("GXza7qdvAfYhdBC3jTrhXt2kQyakrMsx6PoYFqddfeGu"),
  },
  devnet: {
    [Asset.SOL]: new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
    [Asset.BTC]: new PublicKey("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J"),
    [Asset.ETH]: new PublicKey("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw"),
    [Asset.APT]: new PublicKey("5d2QJ6u2NveZufmJ4noHja5EHs3Bv1DUMPLG5xfasSVs"),
    [Asset.ARB]: new PublicKey("4mRGHzjGerQNWKXyQAmr9kWqb9saPPHKqo1xziXGQ5Dh"),
    [Asset.BNB]: new PublicKey("GwzBgrXb4PG59zjce24SF2b9JXbLEjJJTBkmytuEZj1b"),
    [Asset.PYTH]: new PublicKey("ELF78ZhSr8u4SCixA7YSpjdZHZoSNrAhcyysbavpC2kA"),
    [Asset.TIA]: new PublicKey("4GiL1Y6u6JkPb7ckakzJgc414h6P7qoYnEKFcd1YtSB9"),
  },
  // Update to Pyth shard 0 addresses
  mainnet: {
    [Asset.SOL]: new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE"),
    [Asset.BTC]: new PublicKey("4cSM2e6rvbGQUFiJbqytoVMi5GgghSMr8LwVrT9VPSPo"),
    [Asset.ETH]: new PublicKey("42amVS4KgzR9rA28tkVYqVXjq9Qa8dcZQMbH5EYFX6XC"),
    [Asset.APT]: new PublicKey("9oR3Uh2zsp1CxLdsuFrg3QhY2eZ2e5eLjDgDfZ6oG2ev"),
    [Asset.ARB]: new PublicKey("36XiLSLUq1trLrK5ApwWs6LvozCjyTVgpr2uSAF3trF1"),
    [Asset.BNB]: new PublicKey("A3qp5QG9xGeJR1gexbW9b9eMMsMDLzx3rhud9SnNhwb4"),
    [Asset.PYTH]: new PublicKey("8vjchtMuJNY4oFQdTi8yCe6mhCaNBFaUbktT482TpLPS"),
    [Asset.TIA]: new PublicKey("6HpM5WSg4PCS4iAD13iSbcG4RbFErLS3pyC5qgtjqxqF"),
    [Asset.JTO]: new PublicKey("7ajR2zA4MGMMTqRAVjghTKqPPn4kbrj3pYkAVRVwTGzP"),
    [Asset.ONEMBONK]: new PublicKey(
      "DBE3N8uNjhKPRHfANdwGvCZghWXyLPdqdSbEW2XFwBiX"
    ),
    [Asset.SEI]: new PublicKey("GATaRyQr7hq52GQWq3TsCditpNhkgq5ad4EM14JoRMLu"),
    [Asset.JUP]: new PublicKey("7dbob1psH1iZBS7qPsm3Kwbf5DzSXK8Jyg31CTgTnxH5"),
    [Asset.DYM]: new PublicKey("7RxdEbZV3ec7jfbUzVPucaDBY3KRY4FS797rmHHzYQSo"),
    [Asset.STRK]: new PublicKey("CcRDwd4VYKq5pmUHHnzwujBZwTwfgE95UjjdoZW7qyEs"),
    [Asset.WIF]: new PublicKey("6B23K3tkb51vLZA14jcEQVCA1pfHptzEHFA93V5dYwbT"),
    [Asset.RNDR]: new PublicKey("GbgH1oen3Ne1RY4LwDgh8kEeA1KywHvs5x8zsx6uNV5M"),
    [Asset.TNSR]: new PublicKey("9TSGDwcPQX4JpAvZbu2Wp5b68wSYkQvHCvfeBjYcCyC"),
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
export const ACTIVE_PERP_MARKETS = 17;
export const UNUSED_PERP_MARKETS = 8;

export const DEFAULT_EXCHANGE_POLL_INTERVAL = 10;
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

export const DEFAULT_MICRO_LAMPORTS_PER_CU_FEE = 1_000;
export const PRIO_FEE_UPPER_LIMIT = 100_000;

export const STATIC_AND_PERPS_LUT: {
  devnet: AddressLookupTableAccount;
  mainnet: AddressLookupTableAccount;
} = {
  devnet: new AddressLookupTableAccount({
    key: new PublicKey("67NY6DLH2b1LsooGkraZvtLrbteBQVAkLPXYhLSk5o1z"),
    state: {
      deactivationSlot: BigInt("18446744073709551615"),
      lastExtendedSlot: 263299395,
      lastExtendedSlotStartIndex: 100,
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
        new PublicKey("ELF78ZhSr8u4SCixA7YSpjdZHZoSNrAhcyysbavpC2kA"),
        new PublicKey("AVQutgTg4Jd4o4A4P4aYLJF3gpq7xmsE6DZqw1Eq2NvS"),
        new PublicKey("4GiL1Y6u6JkPb7ckakzJgc414h6P7qoYnEKFcd1YtSB9"),
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
        new PublicKey("AVQutgTg4Jd4o4A4P4aYLJF3gpq7xmsE6DZqw1Eq2NvS"),
        new PublicKey("7pbGP7MoJZ7zpr5ngWrURjDMk3dgxdphnnURot7V2Nvs"),
        new PublicKey("6f35vNsWmky1wkiMGcXk7KUZUszaAfmBNv4tod9ZguXD"),
        new PublicKey("7edomgWHCcwR8rG349wWZDCVXba9BZxon5LcEnnx4kow"),
        new PublicKey("FJBabair8yvFbuYFaDK8Neqjof1BbWPS3wjpR17sKkst"),
        new PublicKey("C5oGeBgUREHZzHXjPbLLiBRBe6w6G91LYHjejQHAA6qL"),
        new PublicKey("8vrZSqsXrzMtR53iCrwVgh4bVh1LYANW2xQ5qZoQH3kw"),
        new PublicKey("5ub4h28b5d8Muf4Cw8JzET7BzCYe3vUALqXWedbzwuNG"),
        new PublicKey("2DWDgtCYtVvV6fpN9WHhMztt4fWgNcdpn5hGVcXWxe6Z"),
        new PublicKey("7Ty1AkSCmHpMLFNjH7xW2s2DkcMWggg3MkyYfWmwcKa5"),
        new PublicKey("DS4ThY5eeu7orkMbueVW2zwQVG8FUhBGn1dm1WyxH75P"),
        new PublicKey("9fV1YyxuhuxfiKQgTCtXVQPHAhSfVLNYccCwkDDnnurZ"),
        new PublicKey("6xkyhooKT2wnciP7xjipque9SDwHwPPamwsprsoVXgg9"),
        new PublicKey("FV8EEHjJvDUD8Kkp1DcomTatZBA81Z6C5AhmvyUwvEAh"),
        new PublicKey("7qPuwhidbrkuVPEKSzKTCJdTgK5sfNLRGjfNkDqiLvPi"),
        new PublicKey("3GxVoZpmiKLhDRa2cfVvDkbtVakm2f6sdW2TkDXMVsPt"),
        new PublicKey("BBMdzR51QMSxJ2NwcQ5UK119To5SfmGHJFHYHN6s8ycv"),
        new PublicKey("7q1cikNvmZZ4tDH7fnVLLf8vJC4ng6JVtjTcASXwN7fE"),
        new PublicKey("2NQQtizg4kS97o2WH2dXLyN3C4Xt48Vr3t5nsRP1SQCh"),
        new PublicKey("eGn33quwRDkdSm2234BgigDGPtE4uZ33X5cM3PqBcPQ"),
        new PublicKey("CN5eiAYd5Qzo3WspfrzuNBBWAvxQfMXscquBt41SZ3ds"),
        new PublicKey("E4rv8f3HyS1xgGVAYGA7UfeHmbzfcjE182HH56tCtoRS"),
      ],
    },
  }),
  mainnet: new AddressLookupTableAccount({
    key: new PublicKey("LAZFv47awUnd9jHkv8XGKFvkUjHtbg64WxDiZqZHubz"),
    state: {
      deactivationSlot: BigInt("18446744073709551615"),
      lastExtendedSlot: 272750852,
      lastExtendedSlotStartIndex: 210,
      authority: new PublicKey("EwXPBSBUPqYDNA3dUVZ3nonFuaw3wGGJqEUTJbknDirH"),
      addresses: [
        new PublicKey("8eExPiLp47xbSDYkbuem4qnLUpbLTfZBeFuEJoh6EUr2"),
        new PublicKey("BbKFezrmKD83PeVh74958MzgFAue1pZptipSNLz5ccpk"),
        new PublicKey("zDEXqXEG7gAyxb1Kg9mK5fPnUdENCGKzWrM21RMdWRq"),
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        new PublicKey("AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"),
        new PublicKey("SysvarRent111111111111111111111111111111111"),
        new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
        new PublicKey("GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU"),
        new PublicKey("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB"),
        new PublicKey("FNNvb1AFDnDVPkocEri8mWbJ1952HQZtFLuwPiUjSJQ"),
        new PublicKey("5HRrdmghsnU3i2u5StaKaydS7eq3vnKVKwXMzCNKsc4C"),
        new PublicKey("4CkQJBxhU8EZ2UjhigbtdaPbpTe6mqf811fipYBFbSYN"),
        new PublicKey("nrYkQQQur7z8rYTST3G9GqATviK5SxTDkrqd21MW6Ue"),
        new PublicKey("funeUsHgi2QKkLdUPASRLuYkaK8JaazCEz3HikbkhVt"),
        new PublicKey("D8UUgr8a3aR3yUeHLu7v8FWK7E8Y5sSU7qrYBXUJXBQ5"),
        new PublicKey("8ihFLu5FimgTQ1Unh4dVyEHUGodJ5gJQCrQf4KUVB9bN"),
        new PublicKey("6cUuAyAX3eXoiWkjFF77RQBEUF15AAMQ7d1hm4EPd3tv"),
        new PublicKey("g6eRCbboSwK4tSWngn773RCMexr1APQr4uA9bGZBYfo"),
        new PublicKey("CSRRrhXa6DYu1W5jf89A7unCATdug2Z33tYyV2NXZZxa"),
        new PublicKey("899ZkaKUTFZprwCAY3xnSAdWs3Ma6oDW3YqX8zpis1No"),
        new PublicKey("6ABgrEZk8urs6kJ1JNdC1sspH5zKXRqxy8sg3ZG2cQps"),
        new PublicKey("CYGfrBJB9HgLf9iZyN4aH5HvUAi2htQ4MjPxeXMf4Egn"),
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
        new PublicKey("EgN8rGcr2DRokxCebhkXuGBAQVkGeq7mGmzCGXsviT8r"),
        new PublicKey("6xkyhooKT2wnciP7xjipque9SDwHwPPamwsprsoVXgg9"),
        new PublicKey("FV8EEHjJvDUD8Kkp1DcomTatZBA81Z6C5AhmvyUwvEAh"),
        new PublicKey("7qPuwhidbrkuVPEKSzKTCJdTgK5sfNLRGjfNkDqiLvPi"),
        new PublicKey("3GxVoZpmiKLhDRa2cfVvDkbtVakm2f6sdW2TkDXMVsPt"),
        new PublicKey("CXWkPH6BzU8dhNy3LQkaCH54jSxQATyp11wHuhsAzT9n"),
        new PublicKey("2x1c7fXQdL5TDK9jbMvJ5VYM7wmPKUAQXrLAAFjvxSoc"),
        new PublicKey("EJ2oxzqG3uKmD8FrbBRevQpZrvcQMRFA2fYauChcihaK"),
        new PublicKey("BuDP4G7gjs4KdSQf1QenAygF8FksjH5Wu57maC9sezq7"),
        new PublicKey("JB7F3kQvRYcQj8kogwGR78CMshg857E96ef4LQYDzSu1"),
        new PublicKey("Bm6PXLobn7LBudgNdJKzUUNumAKAnEWuCoLVafsvPBda"),
        new PublicKey("FPia9JqQZ6XBe3Kq9MA4bbFaqojiSNePLbVLQj7hKqqa"),
        new PublicKey("9uYZdYf8aQd9YK6UrGUmz78pYpHscgHdD5f4cZojvmpH"),
        new PublicKey("7HzkSBwxFTft413SFQoznSpd9zu8yWLoPc51QY9Y2Uwb"),
        new PublicKey("9zGXeYAtgaMSafxCQxCTCWnK7W76wbPbjTYeMrCKx3wh"),
        new PublicKey("FCZjBQniB2WJjQhk2DR4kYvsoy7fj9PCKqyU6j3uQ8rx"),
        new PublicKey("2BXEjZqnRBhj3BrRbMERWnToEKErzxZmLPzLEmBHKdJT"),
        new PublicKey("9g3YcLnENdQKYCxg88o1VUhSXJQVD3Kf7uMVB7d1SyuG"),
        new PublicKey("3Vxn3hUebS9wYo5ejbhrXtxjDpp8iko4TW7sj3ub5wmv"),
        new PublicKey("BaiBruf847DKccBnGtfNgMm6mjHeXoYs64ZoFK5uuV6Z"),
        new PublicKey("GZycSPLqxhZuQYmv5wWjdwK4v3T1WStBpGxYem691vMG"),
        new PublicKey("Avy1abPkJKJdadFVieTuF8oeN6ZFWsKNtKzU1a8tgn6Z"),
        new PublicKey("Dy7j5mY3nxud8bow34MBUPhZqXutJRPjzEiXyNeiSMdD"),
        new PublicKey("CgUMT14wR6WHX9mKMS5BWtd4tk39hRxbxtNRvp4BdMHf"),
        new PublicKey("5Kdbu8k9hPU8fhAcszN2HYZdq5MHspV3y9ZKHA3t39ko"),
        new PublicKey("4EVR1QadXD8SQeEnzkVv2BUfJaYoM7iPcGziiuAgWPhi"),
        new PublicKey("CSh9paLCAfvE853RYQUtkCLqtBao87RX9FcxirK3pdX7"),
        new PublicKey("gn46ys7QKtWqQAW2MsuSV475AcFGn7gdNnSCLgw71DL"),
        new PublicKey("HTN3dEduTUp2VuFgo885BJ3KTp8WrPrZgEPiCVg2cVtD"),
        new PublicKey("JDRP3wxczYJ265fGUKXc26ZuDaHgp12CnSbPupsRvQUT"),
        new PublicKey("ETUAXwjeEEprVToJbMzB3vBJfLpEPxKzexdgmkMXuEk7"),
        new PublicKey("J7yjhCLdftzL95kGetry8pyX4eXn4Tjjh7KoWo599Sry"),
        new PublicKey("GdAX1L7jNsMmfN3kcCijk774aE2UtARV8frTozeUWT2E"),
        new PublicKey("5h5WtXRW6Hy5s846DU8GSPgoDgnxKFUFK3mYiEy9jqEv"),
        new PublicKey("APx2hFAqRAtbN6N7LdvYzDCtqGMGWySqVuvg9iMWfkZ8"),
        new PublicKey("H2RDp9L9Tfzp5jzAssNoMCpK2MmLrwJv1wnorEaHS2jJ"),
        new PublicKey("c3kdNx3v9iM4TPUvsZVrgXc5fS9CQz11BBnS62VsB8e"),
        new PublicKey("8cCG6AuMs8aqMN9vLdueYL6Q1kW35EGPBKcRDSyzKMga"),
        new PublicKey("5xSPk47YF3HCoU4wA4HR6KmzQK9whiA8HeUMBcGo9HXn"),
        new PublicKey("BWhHgAgRXoyLfTU33iZ31ME2bk6WTYZxSr74eUqJsJUM"),
        new PublicKey("FT174PMhUBye3qvdy2T1qncDc5pUsc5hTpn7xuXrCPXn"),
        new PublicKey("VdYom29m1yXemVTYFm1cw8Ycu7yzScxyzvG4P63wfW2"),
        new PublicKey("9Lsei9qMonizuuusFgdh94djt7fpgktGmh9PRi2j2GUQ"),
        new PublicKey("EU9uvnDuqNgunfmnxNAjhYi8iEKV3m7gnr5vatg2tgPj"),
        new PublicKey("3F4cdKDeLpvnUtxJ45ue4gs5kCZmhaeLDXN77RHGPfHu"),
        new PublicKey("GkjperyMoy6MCUyg73KzZy4WbfaRhKYAoTBjW3JRjYuG"),
        new PublicKey("8KTa6xFc1dTpm7fsSDKMe5zftHzC6mCR38f7XUp6ugqs"),
        new PublicKey("2iuKYW8qnPPjeWn9rpJUdJQvNWM2CyiSFZNprUFtcYQm"),
        new PublicKey("2FEs2ttf6vauffHDhvWf6F3HANB26iiSULxNF3FAdW1d"),
        new PublicKey("5raajUcFKgaRbyh6yRkAKWroLe6PwtgCAU1vT7wmmpFu"),
        new PublicKey("7Hz86pfpm5hxmzuJbNFbfJ8LEU8EnLL7fc3oyFgVrm5G"),
        new PublicKey("FYpmTRddSQufU9ZrwPHgAj39epj4dP3Qwfdznm3oC5SY"),
        new PublicKey("jQdzjLTZg7fQWGuWHjZmrkTjDNQ3DrAVKkzWvXVrzRm"),
        new PublicKey("DdFzaannSyXs12sB517GbtCsZihh8X9RS2ZKJKuTp5sG"),
        new PublicKey("2Vaf7yEBXi86SGhDM79w1dRQxz5NC2YFWshm5NxkRUDB"),
        new PublicKey("3Qrw5r74ZgwXLnuTgbYeA8WnHNJDoZEpEZXK3HAuwf21"),
        new PublicKey("Er174YjnV2nuAacfV4nYCAFBgJ6cTgJNaYNp5xPwGZUq"),
        new PublicKey("GWHvCw2WA6s1Vg42ahghWveQTf9t3fc2TnCPFm83L5a4"),
        new PublicKey("ALaSAUhuQtakYNgy5HjqrRQHMfCZ3BV2eUPrenPkPEpZ"),
        new PublicKey("9tbfxk5eVmgMmHGt4JBbp3PnH3Q9QCq1k5puahsqaR8n"),
        new PublicKey("4E2zitVTKfaJB91DJ3JvCR9yr3KcRAKmHee3GQcqmqMu"),
        new PublicKey("APNsyPLc1dNRzwk9C6puX8s7vtUFC6U2o7wyZ7kxk3GV"),
        new PublicKey("CJK3xFSe7WhMDz69vLBhAk3x5PaoXBTc8ep39XUEFhLg"),
        new PublicKey("HWStMu8eEqcKyf7jaLVuKEjVjwRhsZ47uC28QmuMxAzs"),
        new PublicKey("7cwSf9v33vH7HDcbD9fLTa7Dwr6e91f8C3aUMHuNkvHg"),
        new PublicKey("MPT1KEM3kE5XQZCYrMrvQqEVUJwdnkgbAhrrwvYeYa1"),
        new PublicKey("8W6mHYDt7Sd6VXWy7Sh82RX68PB2hrFy7KuwkraMbVH2"),
        new PublicKey("2SgUVRAWs1yuUjiYW8JCHb4g7R2gBHdEk5x9KJgn9zNy"),
        new PublicKey("CS4jRF49KnrFfDoSnC6LbRiz7oK5xJCYcSavdp7erJJd"),
        new PublicKey("AY6wqJ3ZjBYXmXKrpa7mZ7NcrqUF4w1KsH2zPGgMszyG"),
        new PublicKey("33ET7TdFt1kVuY2eVjU4rCnCzyKgfiZY9TbPSHb4zCHn"),
        new PublicKey("CdES4frNaF9AvE1Hyso6wbW3jaB1jR7HpZiSNSP4bC7m"),
        new PublicKey("4qdMQ6iLN8Mm4Sa8geNkF1E2PmYN4zB9mGdeW4kxMGBY"),
        new PublicKey("6wmWjNJPNCw3p3psBZM3DURJaxENVk4woYvJsCdcMb7R"),
        new PublicKey("HpTGysQZFppoLQcRrfFu47teEajxharPP7f19XJuKU16"),
        new PublicKey("ygRrmycNpMzEsqLYRpDMS9J1SHaFMG4Rm3tjkyVGVnc"),
        new PublicKey("EV1UdC9dSz7a66hqYW5TkVe6JihSAyfEwVLwYzy1cGXz"),
        new PublicKey("EPgAyxa8GJiQzy9pgiTA3bRinxfzyiNxDhorr1KGUznB"),
        new PublicKey("AXrWGEh3c8Jiz2Uhr6kiUxYypjgVYanm48jSWhXjudV8"),
        new PublicKey("8CCrvJUSFta3HMRSFSM5M1LUX2MeFHT5Wcgjo55HQCqC"),
        new PublicKey("7iXjCwhQg9sVys8Ze7Ybusf7WECJBABAmWvGxVMVfX7F"),
        new PublicKey("GcMVDi71RqWuBGgxSo8LKPoSCSkzPXAGmMnr3t5fJZar"),
        new PublicKey("FnDtHqrTuySW94Yy3QFYjMtvyYuJkRp3H6xtDDG1Ehi"),
        new PublicKey("KsUoxhYnaTUFTJ6SuAdAAmUBVrExhCq7SXE7BCu5irh"),
        new PublicKey("9JZFuP5C78QvDrz3HucskAU6uog3XkoEa4Tbwxs3TTgY"),
        new PublicKey("HHvs3T3rcFnZFiTdKn5eXwg1w9ADGB98CpyprHW7jYMB"),
        new PublicKey("GpvkM2TeZXqQzFtBBgqoJYfc3BPScEHaSk41dwMrsKiW"),
        new PublicKey("H3j7orNNo7pzzHJZ1WFsrpJAxWCiE8QW3aatbGufu2PC"),
        new PublicKey("7kK6k11pi8QVvo7zJGbiHR2UCHBYrW9zPQ3fWzWk4RsH"),
        new PublicKey("Bdbf9vq1uFucPdFCvpqEuDYnJgLhdgDG7qyFuNgyX1yn"),
        new PublicKey("5bscSoiVE5n6eXt5vWdYobYaNiifCkFxAPsD9HQ2wCff"),
        new PublicKey("7BctkfW23C3wn3wXBn1SCkZs59sjSUCr6aLeLnDpipY8"),
        new PublicKey("4pu3Wv5xKeuTTeBaWxu2qDFhyQsy2pZVfdarCA5oeor9"),
        new PublicKey("975f8PQYUDjRB2Cb5AMhMvuGdtZ9QTN3BmZ9CwgUeKBc"),
        new PublicKey("8cMRt9XEWvvmAHPk4gGrELwjBcGbVwsZBmsw88DJKBui"),
        new PublicKey("2YwQ84B94mAYsRU5CHzW7Nmok1C9UQbg1bhWdJNKSWE9"),
        new PublicKey("BLcCj2afh19jgkBSC4rXgWsP19cnNs2HUNHpnsVzVsmi"),
        new PublicKey("GdCnmCAMVmWkEBBXhzT6wjtjuWYT6kxatQEuRVdmp7rw"),
        new PublicKey("AofYjza6fUWPMUnrXt2mpFs1Z19Pbqpt6jddMLZtP3c9"),
        new PublicKey("9TSGDwcPQX4JpAvZbu2Wp5b68wSYkQvHCvfeBjYcCyC"),
        new PublicKey("7QVKAbXvB6GqHLQhhM9Aj921asgzWL45QVd6j2hyGjjP"),
        new PublicKey("3Ey7Y7o7gf4GtaWvhsrMwzHoEacEMhmmh9QQUZxdwxfD"),
        new PublicKey("3pMwdhwEDNJaGLnW4XCKfaTfrrZisKtXtfNe7MkAFf27"),
        new PublicKey("6YfkgfPy6GS1V571etgjk6c9bhXxDJmnuWfcCkV8sQS9"),
        new PublicKey("BEbJ8eMVknahSDqGkyREE2Bm7MJkAounDvTfYnpVjTfA"),
        new PublicKey("7rNJEJBevis6xjuGCqdijdgaVroYmkVswnywDxZV8dbP"),
        new PublicKey("BsWCDy6ZdYC4YXLmMmkRV9wCBxirCQpzQgAasQh8SMMy"),
        new PublicKey("8tjshdGp6cPyPV797CXs8r9aTUs3MGsgxr7vvpkQwifv"),
        new PublicKey("DTUy4MRxe1Vj6BcDwZNo5BnvN4Q2UqMKaqHhRqKndpoG"),
        new PublicKey("8rq8Z7hpk1mbaP61KremihYfBLyJ4hCZ4xBhBUCBC8bP"),
        new PublicKey("5oXbnF6JLwEbEc8gt91aTWyjeEAYVG21WdqK2KxeA2MR"),
        new PublicKey("7UVimffxr9ow1uXYxsr4LHAcV58mLzhmwaeKvJ1pjLiE"),
        new PublicKey("4cSM2e6rvbGQUFiJbqytoVMi5GgghSMr8LwVrT9VPSPo"),
        new PublicKey("42amVS4KgzR9rA28tkVYqVXjq9Qa8dcZQMbH5EYFX6XC"),
        new PublicKey("9oR3Uh2zsp1CxLdsuFrg3QhY2eZ2e5eLjDgDfZ6oG2ev"),
        new PublicKey("36XiLSLUq1trLrK5ApwWs6LvozCjyTVgpr2uSAF3trF1"),
        new PublicKey("A3qp5QG9xGeJR1gexbW9b9eMMsMDLzx3rhud9SnNhwb4"),
        new PublicKey("8vjchtMuJNY4oFQdTi8yCe6mhCaNBFaUbktT482TpLPS"),
        new PublicKey("6HpM5WSg4PCS4iAD13iSbcG4RbFErLS3pyC5qgtjqxqF"),
        new PublicKey("7ajR2zA4MGMMTqRAVjghTKqPPn4kbrj3pYkAVRVwTGzP"),
        new PublicKey("DBE3N8uNjhKPRHfANdwGvCZghWXyLPdqdSbEW2XFwBiX"),
        new PublicKey("GATaRyQr7hq52GQWq3TsCditpNhkgq5ad4EM14JoRMLu"),
        new PublicKey("7dbob1psH1iZBS7qPsm3Kwbf5DzSXK8Jyg31CTgTnxH5"),
        new PublicKey("7RxdEbZV3ec7jfbUzVPucaDBY3KRY4FS797rmHHzYQSo"),
        new PublicKey("CcRDwd4VYKq5pmUHHnzwujBZwTwfgE95UjjdoZW7qyEs"),
        new PublicKey("6B23K3tkb51vLZA14jcEQVCA1pfHptzEHFA93V5dYwbT"),
        new PublicKey("GbgH1oen3Ne1RY4LwDgh8kEeA1KywHvs5x8zsx6uNV5M"),
        new PublicKey("9TSGDwcPQX4JpAvZbu2Wp5b68wSYkQvHCvfeBjYcCyC"),
      ],
    },
  }),
};

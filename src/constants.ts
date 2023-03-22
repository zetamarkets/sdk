import { PublicKey, AddressLookupTableAccount } from "@solana/web3.js";
import { Asset } from "./assets";

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
};

// These are generated flexible PDAs and aren't reflective of an spl token mint.
export const FLEX_MINTS = {
  localnet: {
    [Asset.APT]: new PublicKey("FbfkphUHaAd7c27RqhzKBRAPX8T5AzFBH259sbGmNuvG"),
  },
  devnet: {
    [Asset.APT]: new PublicKey("FbfkphUHaAd7c27RqhzKBRAPX8T5AzFBH259sbGmNuvG"),
    [Asset.ARB]: new PublicKey("w8h6r5ogLihfuWeCA1gs7boxNjzbwWeQbXMB3UATaC6"),
  },
  mainnet: {
    [Asset.APT]: new PublicKey("8z8oShLky1PauW9hxv6AsjnricLqoK9MfmNZJDQNNNPr"),
    [Asset.ARB]: new PublicKey("Ebd7aUFu3rtsZruCzTnG4tjBoxaJdWT8S3t4yC8hVpbo"),
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
export const MAX_GREEK_UPDATES_PER_TX = 20;
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
    [Asset.APT]: new PublicKey("5FBj9HE3oBGXv5pNtYsrABRwt8EYgNVRa2hYoEd9uXCS"),
  },
  devnet: {
    [Asset.SOL]: new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
    [Asset.BTC]: new PublicKey("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J"),
    [Asset.ETH]: new PublicKey("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw"),
    [Asset.APT]: new PublicKey("5d2QJ6u2NveZufmJ4noHja5EHs3Bv1DUMPLG5xfasSVs"),
    // TODO: Fix this because this is the USDC price feed for now
    [Asset.ARB]: new PublicKey("5SSkXsEKQepHHAewytPVwdej4epN1nxgLVM84L4KXgy7"),
  },
  mainnet: {
    [Asset.SOL]: new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
    [Asset.BTC]: new PublicKey("GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU"),
    [Asset.ETH]: new PublicKey("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB"),
    [Asset.APT]: new PublicKey("FNNvb1AFDnDVPkocEri8mWbJ1952HQZtFLuwPiUjSJQ"),
    [Asset.ARB]: new PublicKey("Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD"),
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
    key: new PublicKey("GkmnUMKdpKePwGnaVVxwoC38CDKS1u9QzF9yM7e3JJPQ"),
    state: {
      deactivationSlot: BigInt("18446744073709551615"),
      lastExtendedSlot: 192364115,
      lastExtendedSlotStartIndex: 40,
      authority: new PublicKey("6qtNr6afnq8JjXQqxxgKfXQ2QKPrdVD232tivdrkhP39"),
      addresses: [
        new PublicKey("9VddCF6iEyZbjkCQ4g8VJpjEtuLsgmvRCc6LQwAvXigC"),
        new PublicKey("HRobFXQ2HQvSgCLq2CU9ZG3DR2BxRaAffw5SvdNnvk97"),
        new PublicKey("5CmWtUihvSrJpaUrpJ3H1jUa9DRjYz4v2xs6c3EgQWMf"),
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        new PublicKey("7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"),
        new PublicKey("SysvarRent111111111111111111111111111111111"),
        new PublicKey("HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny"),
        new PublicKey("9iyvGG3nEiEGv1eaDSNrthPmG3AcCJAAQ7esQzMtA9xy"),
        new PublicKey("J83w4HKfqxwcq3BEMMkPFSppX3gqekLyLJBexebFVkix"),
        new PublicKey("99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR"),
        new PublicKey("3YRLUEqrfQF6C3NtP3N5w977dGFZuXWoPm8nJCmVAiJt"),
        new PublicKey("EdVCmQ9FSPcVe5YySXDPCRmc8aDQLKJ9xvYBMZPie1Vw"),
        new PublicKey("669U43LNHx7LsVj95uYksnhXUfWKDsdzVqev3V4Jpw3P"),
        new PublicKey("4WKZv9ptg7zc9WCdyK7y5UfJsr3ACPeBiqWXirDQrDhV"),
        new PublicKey("HovQMDrbAgAYPCmHVSrezcSmkMtXSSUsLDFANExrZh2J"),
        new PublicKey("6PxBx93S8x3tno1TsFZwT5VqP8drrRCbCXygEXYNkFJe"),
        new PublicKey("JB43m9cTZVb4LcEfBA1Bf49nz4cod2Xt5i2HRAAMQvdo"),
        new PublicKey("6YcgjoTUTeafyFC5C6vgFCVoM69qgpj966PhCojwiS4Z"),
        new PublicKey("qjoUa8fC1DjsnwVwUCJQcVDJVYUhAnrqz3B9FSxVPAm"),
        new PublicKey("5kSQn4o4S4mRR48sLZ5kijvCjnnD4NbwPqaBaQYvC6wk"),
        new PublicKey("7Nm1pAysuk38D6uiU83wXfegzruqohVNwUippwSZNx71"),
        new PublicKey("V6Y9bCVTTwjBDYAJ6ixMWWFK7RKZcQeUcpufZaM3DDB"),
        new PublicKey("5yiNVYs4xpC26yY9K3DYTRvdFkdjBSnkyeSAA3Huf4Q2"),
        new PublicKey("CjwQEszLimhf3FkwqcB5rGppZS4ADLeCmtPvcRefv5qi"),
        new PublicKey("HM95yakZehLhBkVx2a5mwzTTf4UeqfDeSno17NstQKzd"),
        new PublicKey("7KbYYDoe942d2eqVoRFyD4Mt3wFRkiNhqLfL685SZyTW"),
        new PublicKey("GHSuFYv8SicmVC3c5DeKgFhjDdegNH552srPFufFysDU"),
        new PublicKey("HT9nmiVtAbLp3GFtfrhGCPGz1tBcvHyFz43pf8rtDArs"),
        new PublicKey("JCk2bU5xNDUBk55W5BoEgNeKqssXdj15vLqhuzQEEiCU"),
        new PublicKey("HYv5Vb7G3849dYN8RG2pQx7awXiEk3nE9F3AGWnedffs"),
        new PublicKey("5RDbC6wYGhc1AjCCArwggtbAyPUse6yMcq3fgSzZqY5E"),
        new PublicKey("2CCypxRdB6tCackur4De72ZSnsNcicfSjWYZwAcVzEZ9"),
        new PublicKey("J5e19jEz625k7K5K3yinpMoHNzznv8smCemvKAYCWLMH"),
        new PublicKey("7QDHQhNjMzuKKk9T5vsdZ5hTfLu2P1pUGk2TKJKFd8hn"),
        new PublicKey("DYXqC6UGPwsz5W3jaFAJtpbBsvJpBSi34W6cMn7ZiL6m"),
        new PublicKey("2YBnvgCAh6WcXrs5Wz2uhi2nMuEVDXE28mQ5AmHjRaJQ"),
        new PublicKey("wkTZtYAo75bpqqy2J5A6emsLK69EYG8otvJipAbiJF9"),
        new PublicKey("GASiAdWtzY8Sih3eQ4sxk6PukYahFDWeey9XPAGvLNdN"),
        new PublicKey("FXgqEhVGX82dsyKMAgR2JCRaC9FNH4ih611bJftmD3tG"),
        new PublicKey("B3iV7Y5S9Xqu6cTECpBCAHtL2nwvZntD2d7F1zbpbQc3"),
        new PublicKey("J8yPaachUYRo1qbtdvkQU6Ee2vzEt3JiYRncwkfoB3iZ"),
        new PublicKey("D9mSSsfXp9SUrSCrmPA8sDJ42GMn65Z5tZr9wtwbHEBy"),
        new PublicKey("AYUthyJDg6mvBWjGfEGYcnjRbw3TZbYCnEQyqUiPyw57"),
        new PublicKey("D7g6CGNVzebzzH1t98tBJKjA6FokiuXKaX3QVF53ZqcC"),
        new PublicKey("DLzvYrHo4bT8PoSwhxDWKhH9ZNsnPbE5cgCx1coCpeR6"),
        new PublicKey("2CtvLehungAsAcYhqnhLEoxuTaM5WqHrycn2YNpmnC4z"),
        new PublicKey("9bGCvH7MwfwyKuNzgfGRXU8sW9jWtFMJf4FmUsQxk13Z"),
        new PublicKey("8pQvXjUf9qq6Lsk9WE8tqtPXxgf4Yav32DneQDLaJr9k"),
        new PublicKey("Gxc3KYEgasnSbevj9GnzwDk2i82BRHACQ8HWtgA1VXUk"),
        new PublicKey("GJA4hfaGDLVNU8uWeS26VCrWNk62JaufLX2XbxuufQyH"),
        new PublicKey("2fgyaTU1BeSk3LWbEh9p3D1H29hEt1wyy8qchKNGxBhg"),
        new PublicKey("FDXX8a9asz32d6EteL6Wnra71YjT45TuGHy8Y8dPntbq"),
      ],
    },
  }),
  mainnet: new AddressLookupTableAccount({
    key: new PublicKey("DifZLpAPMcgA61KWE9Ff4mzsYDomhuatPo75zQUWnusM"),
    state: {
      deactivationSlot: BigInt("18446744073709551615"),
      lastExtendedSlot: 175134372,
      lastExtendedSlotStartIndex: 40,
      authority: new PublicKey("75zZnrrBw527TH1Y8fubVJLU1Mxh4ipESm1y3xj1Vshx"),
      addresses: [
        new PublicKey("8eExPiLp47xbSDYkbuem4qnLUpbLTfZBeFuEJoh6EUr2"),
        new PublicKey("CoGhjFdyqzMFr5xVgznuBjULvoFbFtNN4bCdQzRArNK2"),
        new PublicKey("zDEXqXEG7gAyxb1Kg9mK5fPnUdENCGKzWrM21RMdWRq"),
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        new PublicKey("AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"),
        new PublicKey("SysvarRent111111111111111111111111111111111"),
        new PublicKey("HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny"),
        new PublicKey("FRTCRjf8T5hFHZ9PKGPhYYVRWMFHKje4KwMAEttnDNBe"),
        new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
        new PublicKey("CH31Xns5z3M1cTAbKW34jcxPPciazARpijcHj9rxtemt"),
        new PublicKey("A4ZbGoDjbUhmvgSSZD5J9yjpVsYGXXjoTYZrkRdecGAS"),
        new PublicKey("JBu1AL4obBcCMqKBBxhpWCNUt136ijcuMZLFvTP7iWdB"),
        new PublicKey("716hFAECqotxcXcj8Hs8nr7AG6q9dBw2oX3k3M8V7uGq"),
        new PublicKey("6A7KX1pRLYzhP2WRtvfUNBmZit2qFt43yxjGN8N192Th"),
        new PublicKey("GVXRSBjFk6e6J3NbVPXohDJetcTjaeeuykUpbQF8UoMU"),
        new PublicKey("Cv4T27XbjVoKUYwP72NQQanvZeA7W4YF9L4EnYT9kx5o"),
        new PublicKey("JE6d41JRokZAMUEAznV8JP4h7i6Ain6CyJrQuweRipFU"),
        new PublicKey("EaNR74nCjrYyNDsuoWmq19pH76QSd1nuTzvJSr3RDQ6x"),
        new PublicKey("3rjBffJkFa9zdGr9xmTVxF3y6nL6iL1pASVzym7s5FGr"),
        new PublicKey("HcjrQKnbqKJuxHDLNM9LJPyxcQs237waNZXW7RwgvAps"),
        new PublicKey("Ec4xsLLgLc4wM5c19ZSvazE7M9Rtk2T6RzddNcSQKYGu"),
        new PublicKey("BEjGhNFnKT5weGtpBoFs5Y1mDN47Ntvag5aMV59nZRpk"),
        new PublicKey("CHBUBfU3zscTNsihdK3x44TbpTza1hwcsTUaZfk751b5"),
        new PublicKey("GYm6qTFwkGJx2ywetEuYrjHjhzVFCM2TwayyqS1HUPLG"),
        new PublicKey("7aXkF7AZE2D3h128eNJ7VVp72HCV1izjKFsJ8uNWtCFN"),
        new PublicKey("11111111111111111111111111111111"),
        new PublicKey("BKt2FdgBahn77joeawhNidswFxfgasPYCHWghRL4AKBR"),
        new PublicKey("2ZLdhFsrkAtdn9Kud4SZvqchQFvn5jVCHUdJ83vumKyR"),
        new PublicKey("J8x6y5G7GmTkuKTbbCAnfhn72vaUU2qsB6je9oKFigHM"),
        new PublicKey("A7D8zuxAmtui3XKz2VcxthAZ5HuwLbN74rrDapMJ3Z5d"),
        new PublicKey("CzK26LWpoU9UjSrZkVu97oZj63abJrNv1zp9Hy2zZdy5"),
        new PublicKey("CaqN8gomPEB1My2czRhetrj5ESKP3VRR3kwKhXtGxohG"),
        new PublicKey("4oAjuVLt5N9au2X3bhYLSi9LRqtk4caBvSPQRwhXuEKP"),
        new PublicKey("9YVE9r9cHFZNwm91p3Js8NBWVznesLSM8FZyswG2MG1B"),
        new PublicKey("DecjLCYjb7jdDp2UqA2MS4xjgDjZfvdgMjvkRW7oWs9L"),
        new PublicKey("8SH6uJe5rV13APZFQvkGdXPwTyeiLv67XTnv3EeYff3B"),
        new PublicKey("DhWWXYK2DSnCdK5rkAxJBkGb1SBR49RHpfHj2u1vobCJ"),
        new PublicKey("11111111111111111111111111111111"),
        new PublicKey("5Ehp2LtTRmjug39GphXhFEeguz7hGeg41N1U49wU8Kov"),
        new PublicKey("2Stzi7XE3btUQXaauTVB9brPAtPmGnrEDSJmp3w5VY2j"),
        new PublicKey("J5DTCqRAjX1FyzoP2A2HVmmaXuG971HJ8X1Z8Rvvd8uT"),
        new PublicKey("6JSdqUr24mBt4MCQrZHRoSfeZbjgALx4MQunZwD8Uarg"),
        new PublicKey("4K1zxqAZn7bGAPN26W5mUaHrLMSpCk45gT4qVXwmfh39"),
        new PublicKey("8JSbFw4YT3bzpbbHs1wKmRCSAmKucAba7XSUWj1p8xK5"),
        new PublicKey("483SmqGQVxw3WDwcewMYHqC3Mu7ENxfTQJQtTR3ttpi7"),
        new PublicKey("DbzL5mT4nBaxuAs8ti4UeT2qougRBdujxa7GhLndM5Jz"),
        new PublicKey("7M9xhY2ARnrkCaBK5SNM3Lyd3FdbTu2EWBwG4TQcqpsv"),
        new PublicKey("5mvaZWcZa4gB3JZptZuFAJnmDFfo1JovhqTkkfEcsryD"),
        new PublicKey("DboTtkWW3KPvT14fag8N6iDUyDXaT8FeBszGV9xdfBx2"),
        new PublicKey("11111111111111111111111111111111"),
        new PublicKey("DhMH8oRQoAAb6poHVsvCqq3NCMj6aKUH2tGQG5Lo4bCg"),
        new PublicKey("63DZkAzoDXmzGzn9esoWSYpMLo4YB9oPHXreHKwuu4HA"),
      ],
    },
  }),
};

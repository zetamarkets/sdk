import { PublicKey } from "@solana/web3.js";
import * as anchor from "@zetamarkets/anchor";

const serumMarketAccountFlags = {
  initialized: true,
  market: true,
  openOrders: false,
  requestQueue: false,
  eventQueue: false,
  bids: false,
  asks: false,
};

export const STATIC_SERUM_MARKETS = {
  devnet: {
    SOL: [
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "65jkDA7hwMgRCZhVnGvA18DMBHibHdqMRRNynN959BJ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7Qng28o8KFYm3cUX74PSjV4A3t275yN1jehMWR8MwhKE"),
        quoteMint: new PublicKey(
          "EjXNbzjfREUgebVqUFS1KkEMcE861o6LCjTr8gSfwn6R"
        ),
        baseVault: new PublicKey(
          "7opYqYWnhKPAUB9iC5SJsV8B5EvfbCa5fz2soWKBD9ax"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3JXef2Hp6q1dzV6tvZgHM83wJY9S24692TPctkS939Db"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7df5CKk8bCVft9fTD7KcLMeXva4XHpw6p9pVTxiMRsU"
        ),
        eventQueue: new PublicKey(
          "8fkmt5Wfgitpyrqcgty5g7vGhdah2NhmMdeXFfBijrfk"
        ),
        bids: new PublicKey("5x8TjgBzCsZHQCeXcas7mZdCmKH1QvQXw8AkxQz15yzv"),
        asks: new PublicKey("BmwKoLv5VpPeSPa2YvTCnRRDGgLPMCVn89WhC33sXoWa"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "HyQgkEKX16bAAT8K5g2VArtYkADdWEReYoPNbYYd3sg"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8uaqFCTdqwUy7RumfkxHDVGAtCVC1UWbw1W3twrzScx8"),
        quoteMint: new PublicKey(
          "6yWxk8cQQaVWerukVxaiBHH5UzJGoAVA5yaQm9WX1Vrq"
        ),
        baseVault: new PublicKey(
          "44QCcSQrxW5wyB3pEfSsJkme7LUQdGkKXoQ9HvwJwwxX"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DLivnFNgP3hw1oAaXZz5PbExtUKSt9nytMBT9aSPgm4w"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4R7FB4JVMj5HeFWSaGNEhcc2yzx6uG4cgayW8Mp9z45b"
        ),
        eventQueue: new PublicKey(
          "AjkppKVZNg6TuEMoYmSuG7NiitdYKoJFCzdUhoLarpES"
        ),
        bids: new PublicKey("7yEQJRnJv1NWDCM1a4oLKxNZ4QR4XacRnQn8i7SUgm8y"),
        asks: new PublicKey("7WJ9arKKnU4ksr2cJikjKHYTNyAF17owPRN5M6G8dMeE"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "QULgx4CY16ao5jc1TZkNN3QLQPUYbfp1Utpc9Jpsm7N"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4MNLuBCVkPnMJuNReUrejKPZx45i1qNaRi4NDmUbKu2n"),
        quoteMint: new PublicKey(
          "BwNmiSjXmDeoSE475xwh4vNQDkhrQ3LUYwHwz54fLwej"
        ),
        baseVault: new PublicKey("8ec5ab3ZDdjZGw8XfHzxAkijRQHkSq17KTCaxxSpN7k"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "aFD4SyG3uvMW4nUNDidXPoBU5MX7QEwp3MFFar7dvch"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "JoMWAC1rLeZNVKXdfYFkPEhY2PwunQP86edgK31GAV4"
        ),
        eventQueue: new PublicKey(
          "BW49xNnkgAumjWy4b42ohhxswuyvKZTd4HxNfykMJNgc"
        ),
        bids: new PublicKey("8fuGgANGaZWd7tP6kDv3ZDCDcpCUyFdTh7tKDBcCmpV6"),
        asks: new PublicKey("2nkw8ZzozG9TP4c1EbXLqaoR5AEy2GDi4ZrEUrj7dVuq"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "SZBsPRCjPWuiqz211wGwhDttrDcn8LSSbmMY9GhZrYa"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DrSRQ7ebEaLD3Zo5qhJYT9N9pAvMNHAxNepps2jRZ8Wt"),
        quoteMint: new PublicKey(
          "3ZEjc61qW3tLV88LcJXASVuw3jsp4wA8ZYcQudajyNwG"
        ),
        baseVault: new PublicKey(
          "A5J74vLhjPwsuqGEGEvmkUBa6tnnpi19Y95EoqFRYL93"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9cq8ByugTUK73XezZwvJDbodYmS2GsfSboTtw4oVex26"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "5nEKTGHeTY8asD2qmBNyPCgJUJN8CuAWvShoRSSActjF"
        ),
        eventQueue: new PublicKey(
          "CahHSAxBLzWUAz3XUyYxUH5VKUyjV6F3aoAtQZ15Ah3j"
        ),
        bids: new PublicKey("AZRxg8mS7g9UCMR4dPVpF3xaAX5v9Kp5c7teDrFBp8rN"),
        asks: new PublicKey("AiHqqPBp846M1E9wtfRZPUriMJLjxfChUjRqxFUWGuS2"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "ZSeT2F8SfH5jeYXUu5VDHfQ1XUdhvHc7VYPRGZvG32o"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6ACrD5z5VHXstUMqDxf2H5tFH92r52VMmgYEoLjMbXyf"),
        quoteMint: new PublicKey(
          "4M8H89Z1zXV3bwnV8DUhzWzpic6qTCCd5oqHhRet2ngc"
        ),
        baseVault: new PublicKey(
          "FuqitRNRXbVuuvYCYpHfFShpnd4tSN8F3hRc6ZRwGJfu"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BoWbhXF9JQ7hgB8rpVgSBozmNNBjfQPzBeR1LwukrEYv"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3qP6XBJYUr87gHjTKqN7d9BpbTT49UZE8nc5dSEZcJAg"
        ),
        eventQueue: new PublicKey(
          "GqpEtJ6pPDRyVG4NMQyfESMfPWsZb5aGDxPto9kVHu2t"
        ),
        bids: new PublicKey("7ekeMDDiBcSyNnXByoKkhSLKhNZ2TPyBhxNjjeuw69zg"),
        asks: new PublicKey("Dpe5aLF2L9CbdDwWuPuBqKRrMVmRprUoqk1Ddm7rqKNb"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "cyMFkSgKWbD3egFqnBPieAb96ZubJYUeb5y4TzWSVj1"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8gqkCVDVtjXP96WAxWhvD1vP95ZBfLg1vyhmemEZ1JuZ"),
        quoteMint: new PublicKey(
          "2FADPFNDAzhuYjNrvzyQFE74C2cLUuRDesRKL5S2NrMS"
        ),
        baseVault: new PublicKey("Mdy18iaGjjRbztQeUbcKEyC6Yh4PGyMQxhoDWr238FJ"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EqtADpCNLF3or28NBLTJC1TiBioxX9vQybGFx29hZ4oS"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "CruC22ev6KS3MysrtYMuQ8up9vom6yRWUnopvC73QUXB"
        ),
        eventQueue: new PublicKey(
          "1xp8dcmXfLhQGS5xrkNSB8oPznkoKiBd2b7dn3zcXSF"
        ),
        bids: new PublicKey("FxQgsVNJ3gVKxAEfkUGd7gQj6TdRfEP9CCkdG8eZVnT3"),
        asks: new PublicKey("7mHuSUdqfkgKGEwg2GmGHodppgnDch7MtSgFxejzyD7j"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "mrheJp1a8gA6CzREu9PiCw6ZGsVjCGYJHMisirAk6Cr"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("EkdPzDTeg3hShMDoXTJdpEFBjd6r526Xfbp45iBRPBfb"),
        quoteMint: new PublicKey(
          "5eZRPHqq4tXTzvaJK9k3Ma4g8suRBiucRCdFxtXUcfp4"
        ),
        baseVault: new PublicKey(
          "6VGwmfnkgcJSihmXQAj4UndJMhkE61xyifpK4B2RqMhZ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "ESazmmePfJDKhWEn9YuWZgC5HbZWNX6xBKF9n9Zb3gMB"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "BoRT7tkALaVLQhbgY7NG2Bcwk16vMR9BREdQu3QPkb3a"
        ),
        eventQueue: new PublicKey(
          "C45QN7du3SEjd1GjuhHWG3x9a8jQ4p4gYS7hvpTgWLi8"
        ),
        bids: new PublicKey("Ao7RNmheFzwYVJEMeUELpdNwxM3pw6HC1oY118MgZKqm"),
        asks: new PublicKey("BiGT2C7ttjdQQoY5vWfS2PrQbCEWUSL1tdnQ6X6s7xbp"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "ocATPjVkWowutWdRQsnFoB2a8EuF37zaetpxhgFw96w"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7fH1ZQhvBu7Pzk1RD1a9XM5pkeQ7Qo8aUSNsoJy4jxK8"),
        quoteMint: new PublicKey(
          "5Fqm3DYN4EdEkEzm6eesMeWhmvytgXGwkFtpv5hMiGXB"
        ),
        baseVault: new PublicKey(
          "4s4R8bnb5fqDXhNE9tpuhef6LVFsnrZHP49EiUpr22iC"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "A4AxzBcQBUkM3XsxrWpCZiA6fjkBbCnkAWeU8B9aC75v"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "28cJNZiuKKzMmPCw8FmrxrtvMr6CZ7krJPU4dMBaN7NQ"
        ),
        eventQueue: new PublicKey(
          "G84sancsDQNpef17TrHgnpMLLJcoeATQSTTcJKyBFV8E"
        ),
        bids: new PublicKey("GyDWcmpAmh9ZJZcMMNFdBr7itRvD2VVnAa1D8eh9wDrx"),
        asks: new PublicKey("GyM43nTrconuMGNsf1wxhuFfsHFP3ucBqj6YSZuLcJVy"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "sSAtQzcyHKhjbH6rsFMhhdS1rFtQ1bifVsq3keQoGab"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("514DhGXt3qy1uowSXcBLxtK4uDEuoVp7KDzwEvTGxCXJ"),
        quoteMint: new PublicKey(
          "8EZAy2NRGQeFLdxFf4F5cKFjh2NgL9FZDNrSBkAnqjQW"
        ),
        baseVault: new PublicKey(
          "BAW9FsxB25f9YURymufv3NbgQGbDw2NiiDtAzhHA5gmM"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7np8Jna5iHoQE1ChQB9M7HuFExTcHYjCtoThmg24e2Bs"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9a6nYjWhcyjtA9U2LNR9NDg4ZtgSSGsMqXZFQnoTF9tY"
        ),
        eventQueue: new PublicKey(
          "4o4w9D9XSXrWxdYm2cSLDchsGEKDtq5pWbtKHmgRoYvW"
        ),
        bids: new PublicKey("E6J4uKsg5vJdmEHTdXct6y7EZHcEpA85coV4Kavg3t3f"),
        asks: new PublicKey("27VBBVUNgcSG6Kh66eFBRRk6cB3dZYUarECxnYMyeEhg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "28qqhUGU1hJvvKCa8T1vouBFzJ2nuNM2UoJyhSzpnopy"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("95tjbs2AvGeq69JUasxd5PoTu2sMH2ofoJcqfvJHEZBh"),
        quoteMint: new PublicKey(
          "8xHVoiYh5ABEd2mNPNwQnvGC69c923FEbLtAdLiDyvGs"
        ),
        baseVault: new PublicKey(
          "HKFCThDAK6b9jKt6rW8d8sgmAgSzAyWmK2n4j8huSNGR"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CHDpsxZyV98x79ynTH4P6MXXWyp5Pr9JBtP9r8aCMfn8"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DTns71M38LpGShSj825P4Up7wEjRD3AbKt1sZA5aq3xV"
        ),
        eventQueue: new PublicKey(
          "9VNzoBifPvgvRX2HyyrmTcHoWzc9tqGBcTxE2a8cG4t9"
        ),
        bids: new PublicKey("7WumxauNdrnGvZXHJBwfB9e1TewqziGWjtwU1JBLFmwJ"),
        asks: new PublicKey("FophG7YfcCb6SQSqn49YHiMBZGSJo9SrfjBaq8tzeH9R"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "29gQsJU2qZMXPTQntfoCfZtHafGMtddw851zJLjTbuFH"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HDuXzToYegy8FiCWNxPv5z7tBhCr43KLJMv5edVXJs8b"),
        quoteMint: new PublicKey(
          "5eSjYNCBr2i4hwCQCM9MpsBWKaXc8xSYi7hgGCVbcmYm"
        ),
        baseVault: new PublicKey(
          "AEdVkmpcEpj9URDdrHPJuREUeQ86kZS7eaBgawmNyNn1"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "F2bGoUogyB5trLimYYvgChwXWqehgVr9jKPBb5e9GNqi"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "5tD38gXTdPXxXi6MujLFeZQCE9wQfNSQj52x58vGEX2p"
        ),
        eventQueue: new PublicKey(
          "2PR6F3BAsowV4wq5apjBTz94oMTZPFCzXcmzbZeMmucY"
        ),
        bids: new PublicKey("BFmwVgcK2WQxe5jzbkxCKdsChhPeujDechQDEVaq8PCn"),
        asks: new PublicKey("HTFpyt7eas1pyMKpav3fsUYJ96ixnAVKZEhYA7wMQqTH"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2JJaGTRbhemWLmjBWrByHPiwtC6g6RhXL34N4oMRwC19"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7GKnL9QvQJbnKV7UqVQULoCwWwj6ehh5AU94R79sDzmE"),
        quoteMint: new PublicKey(
          "EvVQZChN82ARfin2WPSJAHPEZiVRTuFg285cxCMHFm8t"
        ),
        baseVault: new PublicKey(
          "BX1Rg9FDopPr9wa25FkuggGoMtVkAR4LGGrNpPEMPUQU"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BDW3jtUNp7pa34wKQ2GpLu2pcbkwMWcuSPfj4cLLLuXG"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "A4CWKzoLUeFUXxTGn2kx4nKkJ5Ujq31uScohNTAktdz3"
        ),
        eventQueue: new PublicKey(
          "EQmAxUFbKS9mVar73CGEqLYJUK1jg8uhkPwdxWX38QeQ"
        ),
        bids: new PublicKey("8AAt64ondvpgvmMhYAAkJVGfu3xtHaZuBJYx3xt5uDpz"),
        asks: new PublicKey("7P43EvVquRK5kq1TxeVhW6xiKktgPsxv78LzQru1Gzog"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2U9uCwAdAXFn1fvLsCRqVC74vGhqBzBYce3QBV32oe48"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("45CiaBgT6xjQzNBdZbPyGfnoWsSpzhCNjTL2UpfJEYGv"),
        quoteMint: new PublicKey(
          "DQjptafQaJ954D4tQDJhNXh6ZMZBGwh1pvnM9w9zwdHg"
        ),
        baseVault: new PublicKey(
          "7UEtExuWTu9tPisQfLa26MR4uiKiotPQ8BDE87VKg7Pp"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "26t5q57SkaV7X2vEhCqxErpMCBGFzSLuPTkpyCNGdnbm"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3eNNt1thSoKeuhMvxsaKMSKeupLQaDN2nQVj9VWEAthh"
        ),
        eventQueue: new PublicKey(
          "Gv9AmzG99osMznBAwN5Ziwv4wrgmD4oJEawardo6Vg5K"
        ),
        bids: new PublicKey("sXgmpoV5QHtHvHPEpWwu5FjkxRY98FP8seWBAbMCvjc"),
        asks: new PublicKey("G9L3F4oRXvWBa8J5RYd3u4Fq4ftJFrgLp3ra3JmnQ8aR"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2doQid6YZtQggbfJE8gQRMvnMDq52Bkzo4WVpdWDGX52"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HpCBAHvQeXcbMpoCWvyQmTyyjcgmPQZWczFv1J65EjCL"),
        quoteMint: new PublicKey(
          "D4pVcSPXK9EfDeGPCDnbK9xoiZbaunaMJPVqh5YZacNm"
        ),
        baseVault: new PublicKey(
          "7865EMrTEor4LAHSx3nqWzSeus16m38yc8DJ6cv6npyK"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HJ3CMTcGR3RVzswaEpyyKxUZW6p1cEA8Q6ZqiAho4B4P"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "8z2BLNBodZfbJe9f9kZZsTAPeAR9zyKxXkPWL7UqviTH"
        ),
        eventQueue: new PublicKey(
          "Fw2tJ6K4uCWbh7G1DwcucKC4pr4HTzZRmfeVTJHjHWUd"
        ),
        bids: new PublicKey("336TkY6A7ZgUYM3vg9eggcsqsHyL7khCfSms87DUqeYY"),
        asks: new PublicKey("5Z1JJgr44uJWFmcbADFxtDKEqk3K9c2hCT98V2GzpxnV"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "39EsUxJPAcpmJUEC5LMFpZLMNTG61zM7tjhmV2Xiavjv"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7d8kmd9tHHF3VaUTG1jRwtgw5i5voueAZK7V649cZyaH"),
        quoteMint: new PublicKey(
          "9kmfnAQDEqKzaKSocNzrv7tBtDGR29h9G5qzj7EkeWtb"
        ),
        baseVault: new PublicKey(
          "3bvAdvKKLChDTzFXFJ7L333i6Jf1c55UFy99TuZPEk8W"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9P1h54SiakTTY1qF4Eg8BKbNJnF8PWG2hw6hE2CgCeGp"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3ERBuL1rvPovSfoJB75uEJuVQghb7EMngH6rzzYth9t3"
        ),
        eventQueue: new PublicKey(
          "GYTqRFdbtMStcviKG73eSGwkDJnaV8jhv99nsWwAvnPg"
        ),
        bids: new PublicKey("AYkk8KhApRekUha4sGr6xqZHKyWZ2RTZcxZBq8vWNhgv"),
        asks: new PublicKey("HvzciKTsHzZEDF726ELbU5mjJ5GR1V5eUcLh3L6tGwQb"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3Zx9echGogRypxEaZkhNGr87JwEf97MX6eUD3gpmVvHB"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DchfhwotRoJ8PNueNAeFsupYUKATCcnuqNHmTaoPJbyr"),
        quoteMint: new PublicKey("zvEUgrc9uyPedUoBSZgVKnEBv2gC1Q1s53wovzE1xUN"),
        baseVault: new PublicKey("ZoGX3xGsSDupszPcbpT7Z2k4KzXmvM9ydp6pjoKzKJi"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Fj4zkZX9Av4ypgp7zUPUCK4GQFDmhTpptobB2DVvzMyu"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "D6Vdb8n9v1J1P32y3S3pfMndHy2z2z6F1ACKsL9Z7skr"
        ),
        eventQueue: new PublicKey(
          "64AsyoXa4a28hdSfoRune7m51gDVMHMDLd1iqoWCRKov"
        ),
        bids: new PublicKey("FSP2j6wNHxvrPNQvfZFUivm8jXE72BY9fjt9BdGx53j8"),
        asks: new PublicKey("Cf7tbontcxaCLycySVrC5hWPg7a3AmDQUonzaqEgvWXh"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3aMFeXqo3x8bWZsW5ZaX6MC6X6wzodch7WJBpXjRFHb5"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("G5hYaSfsRgppWr1ateY3ZszUwcaKv3xvbwDRTa1R5gJ7"),
        quoteMint: new PublicKey(
          "Bf81YBKavRLi96157vw9CgaYfmm2mgMBGexzutFGENAP"
        ),
        baseVault: new PublicKey(
          "ELHKfpbSKH9W8JU2R9q6bG3wELJvkks9PvJGKhf9HZEW"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "76EasrBXnHn91sdUQdo7ucAXR5vXuEct5CnKuoP5fzQu"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "E4vZ2y93JwFd8x2fbeehpwTKoetUFmP5o5KqVkCLnqVM"
        ),
        eventQueue: new PublicKey(
          "ECjnyoZBXsdrV4XeRzQoJKfupZiAJzsg18VbKk3cHTzt"
        ),
        bids: new PublicKey("6cALoa7SELt7fsj5dsgVBizax9HUgpmPzpSTuPiRuEgE"),
        asks: new PublicKey("ArieSRCBAHeeHsf6sjDXpStvkWfDsay3KpjhTN2Fgv3b"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3vwUUXojnuE7zjZAvEZ2CikC6QdowMt3q5joKqtcmWT8"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HEXszSguw7L4T2U9zia9b4MC4zXqAGxD1x38yXvpvBx2"),
        quoteMint: new PublicKey(
          "7GfNsGM5oyNUxiVcsqgv7QdS9GhFXHg3synBUsPGFGRE"
        ),
        baseVault: new PublicKey(
          "6ZP6pUEoQbFPfgDarQ3mjiMxradTR1mnXjSELYNGYZn3"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7i3LbKXjkuFyjH5aGmakMHEc1kb287Jde9qM1e4NHdPr"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DCoJBXt3UKErobyeHmzkbXTTaEf3NhCBzQPt5HB1XHpT"
        ),
        eventQueue: new PublicKey(
          "6Vwh8XNNuPwJJeYPN3gyMTggzCvbHwXy5NFF45TCEFbT"
        ),
        bids: new PublicKey("6uZdZPwiHvjSd64K24QnnYbEKauXsmiRzuNPVZoeS4Pw"),
        asks: new PublicKey("Ddqe1fRJdRNA1qn2Qf8g33eaYKa9BqZPnxPENyE47dwS"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3zLr2kge4d4srj36vEekKttpRrnNURJuHHwaXB9HJo6u"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3HA7fdEBnzZpe541X2LSAcqfwXnm6b5ZD5Cd9r1wyaKH"),
        quoteMint: new PublicKey(
          "AxuUeJzgSpeioLNBAaeehXuGpehcAXvtuoFtrXiS3bHW"
        ),
        baseVault: new PublicKey(
          "CqeQ4NDPQaWAgekWTLiQPBVCw9q3HzegUaWxqoZZJKkV"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4aAdYRK5x4dtVXux6Lm84bXatN4C6kFZusxSQD2MuZsq"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4qCee5RhCWpRAmKtLkB4DfpfNSFDGLYCSAcYAzXvWJBv"
        ),
        eventQueue: new PublicKey(
          "FwjjTFQcGs7hRxJ8cLaKfgQdtrX4pZZ3f2sszj7SnXwi"
        ),
        bids: new PublicKey("5aAFAFsJ8bd6XYNhBv57hsn1Yxmnosbzb3ceCMadeHui"),
        asks: new PublicKey("9nqm1x1mJsEHnwZz2nzDCBpk2ihCnhXjpmHcmtWPkTHE"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "41bkKLtspPY75v9svZaQp5ji2Hczh5MmouJGksiyAs7E"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HpDPmUrbnqGoSzLCuawjTuA5sc3imiHW2P9S7ssMjdJD"),
        quoteMint: new PublicKey(
          "6GYbTPhGwFFxpHBDoTNziuz6kDdBCaSwhKHADxXmhZae"
        ),
        baseVault: new PublicKey(
          "Ge3rhej7QBHFsVG9KQq8CgxjnPShfPeV27dLkYwy1NZ5"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FRnuFgfDUf3fUtXt5NzP2KuRw7GhPS3kQdzq5bXf7stA"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6s7MEc23GLJE7wsoG69gNbBthCyWDQtZ8EBrNvkvHzRt"
        ),
        eventQueue: new PublicKey(
          "2vMtVehNDKW3QojoyEaPg5pCwMCgwiyyWwZ1TDx26TWN"
        ),
        bids: new PublicKey("5HQdxGCJh9YqFqvbheUpNNr5ouEZ3tGpECEh1X4XLnx1"),
        asks: new PublicKey("HTaaQS19G85a8PzTsHLdsBdYWAh4zgYxMwMhuyxKXwbA"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4MJvnWjho38hzuUE6NGKSfeWgQCcVWkYFxr81dgdKX8A"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HZA9kCYZQw7waTjMXbRdJRV1tBxe7VWah7Xn51hiowwd"),
        quoteMint: new PublicKey(
          "Hi2ukGnJnv8gMp1xrBqmsUALhTzBWQK8SX6SnrSpWwWo"
        ),
        baseVault: new PublicKey(
          "FY8FiZeViDsb8yLpqam7ZGzgJ6f6vWEnMSvcj7y2HHuP"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "AkHfYkD6ZD2v9ZygrCuACcxfZLJev9nu4hDmiBJCK15D"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "J52iyGsqK4mf9DY3PicSNSPHqRx6izXqp6FKHKD7uoW3"
        ),
        eventQueue: new PublicKey(
          "BjE55ZKcTa2yaj1nW6fkueLDbYWC9xsovmU4XyqCTu3P"
        ),
        bids: new PublicKey("LmNa7KVJitNzmWicgnTmUecRtrNHb5VrR7mHgcx9iCB"),
        asks: new PublicKey("E4FuibkmT327FDG6uEjus3bzXdaULYuhwjsGKjskuwJy"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4SAw2ti1rgxparrQCb4aQSDNgTfES7xpijA7nBRsFKeT"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("zp4RXpdvVSuPT5XGmEGN8wmDRtTJvsJvGz7GNBWxYmL"),
        quoteMint: new PublicKey(
          "9ecxBKvr4ttdvoPit7hnt37m5ek8s89522aNbgiJVUJh"
        ),
        baseVault: new PublicKey(
          "7cFZzgpXeNVnRWib6vTTyWC2RaWV6neXz3P7WLrnDXF6"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2RGSEi9ywsPZ9KfEpAjx9z6YeTEmYuhM3adsZxLDZXrq"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7GzTLTWAzrFo6k9qBPYMxBv2XfETU3uZWNNgTuzEzHig"
        ),
        eventQueue: new PublicKey(
          "8YDe3nca6Wka62qzze4Jr5Tbcg2BWfjhWB69tATAVvtQ"
        ),
        bids: new PublicKey("6tjomZzCwfA7N2MPG1BA9NSPdVGCHXUuEx9knipyybs5"),
        asks: new PublicKey("GL3xTtFpC5RRFV4cqjVdFrNeu34TSF2xwEjta4QpfRFA"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4bmSFKYdWL4J7VkRLqxyyTfi11nL59JLUwQ4oJDYwsjX"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Atz1a4osCBUetXPd1YAdfkAowwyhJsvMuqfxkjFSsidM"),
        quoteMint: new PublicKey(
          "2RZmqbpa11U2HMvdoAvLwV6hJ7ggJC6TKSVz9Uv7Ta8S"
        ),
        baseVault: new PublicKey(
          "6kJh4mZSXQEeQATfSzE9Ag2swv9XXYv4TSQtQJRAZ4dv"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EtnPVFRXggZMKo2YuUHsU5QbZgvWg1wh3W7aBpisSU8m"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "EfdvBpG51BtKAxZuKdz3F9MdjLh7XPrTy8d8Xt26wQvk"
        ),
        eventQueue: new PublicKey(
          "9nsQm82EBec2D3KjXw67cn3LsiRybchyGGBM53HoTLaR"
        ),
        bids: new PublicKey("C2vrFHEkC39e1CdJCm8YQWwyi8NJGotCACASYYQiuzkH"),
        asks: new PublicKey("8F4DsNteSaWZqZgB1FyGPhiqKQsoJ1KFid5MQ2GjAags"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4cjP1iviXiSsyayj9fGP1Q9513XckYe9joATqxTVS8sd"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BgM1XjTfe5yfK3QeSgrv8TL8eevttBV9kx1y3NuUokRX"),
        quoteMint: new PublicKey(
          "AXiE74aEqBfMkm5tr6Y4QnA3jNcUSYdVxjVX3XPpcvhX"
        ),
        baseVault: new PublicKey(
          "D2h7S5ZzYctXXo2E7Q2ouFQVpoJC4TpZ9yVdMcFCJmvb"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8HgEeNbm4TTnUFXeAvipTFsdFGxEmu4YsGhfiyrU7BU8"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9QYB1MJmg3HoNJ59WBhVrm4FneyJS3t7RK3BmNGagy8S"
        ),
        eventQueue: new PublicKey(
          "G1akSDjXiofRNApEb4uFuHBCeJ5GYktv9ADNqjp9CATE"
        ),
        bids: new PublicKey("EvhXouBEfo9LAvYX9xX3hgizmsqJeSWSVP5iXNKTR2WL"),
        asks: new PublicKey("DtNXA6rEgWeHBJmy91VFs1yqyouHRtd3tH9o68opwmD6"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4iwajhQnc5LiiE4Fw9gVrR7z1gX44Zk8228XWtax1gmt"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CpvGq332m2WFqpQ9BpDn81yNqvWaw7rhPzcRvTcj7A9p"),
        quoteMint: new PublicKey(
          "2tUcjFNT8eDkPmQtf68Ygd6zgvQsyJFccchWafcEncD3"
        ),
        baseVault: new PublicKey(
          "AQmzu3jv5EWdNC9afJvkM8x7eZ7aTrMf53o4VK2go5ek"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "J2im1d4E7ZJCgAckMvH9tBsAdFzmgxBjgjvp8JixA128"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DAYVe2cWQmPLZcraXbdZ1q1hVvkC5RaeX9MNPXjKBp3u"
        ),
        eventQueue: new PublicKey(
          "BjP4p5sGU71dN56fiNvVaN9dAGxKRdRErQb76J8N7zgq"
        ),
        bids: new PublicKey("HndgQ38S39G7QxiXCQCEU2qhUfMgpDTVBVZimeVgconJ"),
        asks: new PublicKey("EwThx5dpsd5DE8ts2jHy6tZgS9LTtJVV4ngQumykgPK8"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4raD3QLB9jKoUTzK48qfx2UdEaVHmc5xF8ZSaNK8vipk"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4iJPWfgLEPGoZ9qqTnLX4AACN1zuGGB4Px24BxakRo6W"),
        quoteMint: new PublicKey(
          "9kAV5rg818y6vd7z1GBKBEWsZcqsHaWzU7NoHMECpPbG"
        ),
        baseVault: new PublicKey(
          "88zAyBmUwVWtHDoRmvqEWPoJ7KojE9esz7cPjQSK2dx4"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Gbz815HYBgwmbHa5cXn2pBsHShNTt8s3h6CE5MHQJfnN"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "CvhdzgbXJEUDxuihwE3mXCYoKfqZonDtx8JEMLA8bHtN"
        ),
        eventQueue: new PublicKey(
          "4kXvdu6njz18UzyDdAtzgAmkLmJNwfPSoY6vZDsa9SQs"
        ),
        bids: new PublicKey("uhiJc4hTPgMoTxDL6LfBv31jm1ihFbcaPWbHyVF8v9Q"),
        asks: new PublicKey("GNEQbWKbSoenekwNE2T2EfoL7zxVCChysifRfMRNWA6L"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "52dzUWVbeYaHt8PgHKsg3WuApnLYTockFWH7euwroBqg"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4iPcwLBWprxxegMnsiETA1bX4webAma5se6uxzN8egzZ"),
        quoteMint: new PublicKey(
          "8ZNi2MJ1TvCS7QYS44sj3KXwsY3QkLryupKeGbDAH7n6"
        ),
        baseVault: new PublicKey("wUvSLomse3adtMcFViHwCRDfhyXQ7mcXanS4ZiJT7Uj"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "87WPqtANvcbSLT2Usz1LqGs5gpDk7J6zpniEbzkDrDhP"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3MM73Vt29zq2YDjccVT8fmDcYLcauqtRFsbrkKPTiHRm"
        ),
        eventQueue: new PublicKey(
          "2CGw26R7HDYKM4A7JaCgnFD5udy8mVvnJEowuisR7FPV"
        ),
        bids: new PublicKey("GRjqzWExKYZuV2piCzsiz8TCqTBNjgHzsnS87xMZq4vp"),
        asks: new PublicKey("B17qiUpWUceGjuRvSMMoPUvnz4JsNrDGfr3gVGs9zfdv"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5BtmmeZUXNuGRY5Prsos5BwyJKz8UkmyuQZCiy2eKPg9"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GcmikWv1997vJ388qkG18cX8YVPKq5AoEscnJYCFk99G"),
        quoteMint: new PublicKey(
          "84Fn17tTLpxBYXvYDfPFJkycHhBiND8yG65kw4WtvKkU"
        ),
        baseVault: new PublicKey(
          "47KuYuaFfk1kwpu1NUhXGf6qh95QRNshRfTyzBzMMTyC"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2a7syFiCwG25PLfm4KxpxQ6gurAYfsqPw4qZJsGniHEa"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Bm3HeLAKv54n4ep8UqVUMD5Nou5ABddoSRuQX1eeSLoA"
        ),
        eventQueue: new PublicKey(
          "4qfTkNiDjzMAok1wkLPeHRmpVki9FRaZfUefz7mCvAr8"
        ),
        bids: new PublicKey("5EV5FnUmb1gjj2YACpfxQHqGxbwMant8HB6XJtS2LDFj"),
        asks: new PublicKey("9u1u1SaTGjbs8GZ4Uf9xxHtDTfNzPYnHsF6kQhxaU2Eq"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5DgncrA9WhnVqT95WY5wUf9ZFV2hTHfigD7eRxQAo7nu"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5srbk28xXCPpX5GBQkCENmXn6Fdj8XH1CsxVJ4hCp8zK"),
        quoteMint: new PublicKey(
          "5PtKaihrXyw9ZNuUmtLKnvEBp4hZbVFCzuJQemVEaFNb"
        ),
        baseVault: new PublicKey(
          "A3HkPvz7MTHkWNeDcF3po1RZQxnpkb45XjWKbEGHLPR7"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "B1W19JQYDdAyS2EvZn9sVKU7XdNuZjLppmJGDxchqvJY"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6v5Av9RmDaX5AD1pbr4TyRaUfCvKxLaNb8DTh26xjkwY"
        ),
        eventQueue: new PublicKey(
          "7FumLMotxDMqpt54ELd2WEsCmSru72LFGsBan7ji5aaN"
        ),
        bids: new PublicKey("HAjRJUfyFTyn3bzScM85X4V7KhtBbpkvciJg9TuccMPg"),
        asks: new PublicKey("9tiVdo4Z6118e5F8RQUPx3bTraS7AYnkdwiw82XK5mrw"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5GXowmr8GJbL97JXHv657zwWMPzepc8ugMkXzk6ECFSi"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BNRuNKkt3j98nL2KwmN8VkvvGNzeW3opoVVsbTrfgFqS"),
        quoteMint: new PublicKey(
          "5RQz14BVDWmKDUpwfUNUyd72kCytcGbWRsqxXj6N729E"
        ),
        baseVault: new PublicKey(
          "Ac1Rbki25g91oNQDMp4ptammHEkqbqrRbTYQfAsqmWm8"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Gu5mtR6dqHhU8Eexwu4nETnHo2dg5X2SZaS6gV32RtbG"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Acwx3ButsqTnqYF5Be8Xp5pe31r5MGbwwTvLCnZh5QmB"
        ),
        eventQueue: new PublicKey(
          "9ntRFRUiHzcqK9kpGN94rmtiYGJ8YmoLEetuV3d5o6jg"
        ),
        bids: new PublicKey("758oX1UMJnKp2d5FJffoPQE1uNTeLR4Hp1DKkChvgXNP"),
        asks: new PublicKey("EMC7SCBZnoP7FSSwue4SrMyqaoqX65ftj4guktTpGhrE"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5XwsZ91u9h2mcFyco6Ws4Ambii4JChthe6g4vYMXJ16V"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("A4rF88A84RwiURhvi1DazR3FkLFEGde7ZrJ5cCXUMUaz"),
        quoteMint: new PublicKey(
          "HebQkQe1i65Qkj46nTJsoLehfPqTdhGSXJzt4KhKoFrb"
        ),
        baseVault: new PublicKey(
          "BHEQAGsXKpfaEvbN18NMeiuLZ7wEHPUgLhvj4oqwRYCi"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9dpbJ8GATjbtbiEKnh9ep8WAGwdsvwqSSJzMTixyZh19"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AD8Wv8QPmiGYwLQ8jBzcqA7329cPuv8gh5FuUFxNpHr4"
        ),
        eventQueue: new PublicKey(
          "DvZTDDJwechdjA82RJRiGfnJe7LVFBDp8bZ23jHF6aiv"
        ),
        bids: new PublicKey("5SgKfdF1mos9qiGuuokKHv2CY6e6y3rwEVZYpz9UxytD"),
        asks: new PublicKey("2ZZMMzxkKgEz3nHyV7TYtfWjNTjieizT5UwLiubs7K6L"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5idPbnaK9EYLJqXdDz311uci4mhcbbBYUSZKoNAsw2dc"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6q62pSuGJUNDoYA82M9CbJaMcziwUh8RXFmd83Yu5tRm"),
        quoteMint: new PublicKey(
          "4Chi58CvgMyRryYiPAtS7wZVp9hmzJ9ZMy2JQssjynXw"
        ),
        baseVault: new PublicKey(
          "ARYmNKDun4HLqcjt27eLp8gbGdowiR8HkF69eowbmJUb"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "GwaoF1Tdqd1X5DFzpn8ETdxz4AGXsctWHiqwKm4m53hL"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "FpBoSVcZvhts7cfD8psasJeGULdWc1bxRxNJ3Ntb1GLT"
        ),
        eventQueue: new PublicKey(
          "Etwj9BgDZo9UBCgtNKJ8649uQCRSbZq5tEXnxFQFgyAd"
        ),
        bids: new PublicKey("9zwc6YFgY6KK9H4MtJWxBjoBge1kcQ4aFrx91mqDy2XR"),
        asks: new PublicKey("7x2EbWusTYoJv5rKTEeULoskMUZhw43eorGPYUfhYwXD"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5k8w9t9VtASbcdGW9gnUpTGvocFm2Ze74CYpd5LS81yw"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("32vg1CaHCRnSG5a7Q98qRBTUSh2apAfckvX7JiTqb799"),
        quoteMint: new PublicKey(
          "7qwZTNLf9dehH9Z3jDUUchApe3d44iizTN61B1H4kwfJ"
        ),
        baseVault: new PublicKey(
          "38SyHGwNj2KcV3qoydAsavDExWzfZJHLN9uJ9KVjgsKA"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BgtDdyqbJ2QybKJ5XPAHv5EetHcdQjEP2J1xRfd8CY4C"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "C8kBM35rKUmPS4y8f1BefKZDwkogVjx1q17m637CohY4"
        ),
        eventQueue: new PublicKey(
          "AzxAZuvHg7VsJvyS2Qhy7MxXa8APBfvRLBFWJTqVrBv7"
        ),
        bids: new PublicKey("B6spBNnSn4W5EBHnStV7nNsaSnnNFNrfeHitpfYRL6Y8"),
        asks: new PublicKey("zg9n28MPtanQ9Eqb7SfWYcCUc1FxfzJgnSuDQcjpVPQ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5yisJ2YxBxZVqv69cUErDPxhD9Qt2JHQvkftG4wSt9uQ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GWvzcKba6sUV95181XW1G3Gv9HdaGnFtot8M8RVWMkWW"),
        quoteMint: new PublicKey(
          "98LFaVvLi5Cf8dZ62QVFdc295g8FgGwGNQJRsDBNfMaa"
        ),
        baseVault: new PublicKey("fQNUzhcKM82Gs9ZTLaSAdCus4Q1n4uVcHoJBfV2eX6R"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BRZ4Av8W5Vo8WhUjXxqhCSrj5zV75Gxg2MEosQng2BCg"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2i8BBP24iauT4ZxZVKBvsC6EG2JY2HTAReZZYXG5GfB9"
        ),
        eventQueue: new PublicKey(
          "F2xCqrigz2m2s4fDeUgjvm5krjbgWHuX3as2AebaXKFz"
        ),
        bids: new PublicKey("DqL2uXvN4WtWDj68Nj7EUZFLNzuZQDHj5hRiA7vTTQYJ"),
        asks: new PublicKey("2TPGQjcktAVx6Cx26EHXFAVjzaHmSaL44kRe3wY934T1"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "62zqyAF4qguWD1AYY76Kc5REjYebpNrAoVDXGq2mfoLU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("ANquAHB2kanfzgiTYwNoShEG51JkvQEyCLdhbUuepbZB"),
        quoteMint: new PublicKey(
          "CxRj6b1QmNQEM72FpVqWSVdHgLJ2CjGijhSG5TX1LBwS"
        ),
        baseVault: new PublicKey(
          "BfDgxGUMfZusKvyZX9iPsFbWJoA2GeN3uGCmdZR7gKuM"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "D1LpB5nwbR6EMTFc3H3FQyYeoYzWxqjzgdMn6gNNwkPy"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4ZZkzRUV6KKK4AUocwH5bofYYRn1R4qvmi1PcvV3kYgp"
        ),
        eventQueue: new PublicKey(
          "AnnRRifWcDhxNjqy3y1YBSCDMv777w9PBGS5uzc8bLRq"
        ),
        bids: new PublicKey("FcKKbCTnP5XKyVboYi2jdsGbYrXUB1RuN3MPm17atK1M"),
        asks: new PublicKey("pboLbL8HuTHSC1eWWZY9VPP3uGEa9FwKbDmFJRMMcLe"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "673Bquoz4PuWJDCHka1ky73HbWhU8zi997vAS36UzFTB"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GZHNykyiCQmgy8ezqCLr29P9YCifAXy3MS1uawRRmARm"),
        quoteMint: new PublicKey(
          "8j4piQ8bJudLc6EsBQwJktjQeWrFofoxHQGY9cxu9PzT"
        ),
        baseVault: new PublicKey(
          "Bo168JDACosP1jRJsbekxUpvg2uQUh3BJxgKb6VfknBL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9Sah5vG5hogcZwJvZgH6sar3ZN2ho3FYeBi2623MsaKP"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3Lin1zuxqUjp4s2Pp1Ni6fbguLJjVDaSMYQjDPMR9Mrs"
        ),
        eventQueue: new PublicKey(
          "B2SRqj4ugHHeiFL9K9pAdRYshDrCCFaVRVdv1v3FtBEK"
        ),
        bids: new PublicKey("2vXeZ96hC8cCPpzLoovHbCpsjGGCQ4tkQUDEoSLUDTkD"),
        asks: new PublicKey("8Qe6r8BvnmnA7DRYEG2accu1LBPTg1jX3RkAT2Gqirk9"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "69vEdNVMoZp67nzx3K1BruWfdtaUey6CaeGQ1j5Ah9tT"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GMURUDk2BnrgxauUwkuSczD5V7JFmYJgtoZNfVefgQH"),
        quoteMint: new PublicKey(
          "BZEDhdsMsSnFSh7W5UaqYokv6JkbmgZo8XDT37pgSA7d"
        ),
        baseVault: new PublicKey(
          "2jvjTnNriDnZjtWDH1cKp7QZWTuqDwvEzxKVeiTRTwNx"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DBP8WJVDqpBU1snCGiLhMnH7xHBJyMDBoMCTVNN4a67L"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "EwDTDCpNxB22rCa3EWhJBtdDVgwcvXd2no8FSGbR8mVQ"
        ),
        eventQueue: new PublicKey(
          "7cDAyYpXu6LnFLGpMRD8n2erQ7673zNvnnaixcM7o8yp"
        ),
        bids: new PublicKey("Hr6iLbBfwmjmGjuPbmXadrk83RSFRmXFaY9f3d2ZrR5i"),
        asks: new PublicKey("FZcRYq7epD8n7LcmkpE31hdvQwJghL7VsKnuR7EmAcmS"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6A1ZRgCBymXFCbFigHNR9aySbcjF2WYpv7u8888NpJTs"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("EYMrEwGteW7ws5AKDV2GMtGYryKHcTUsRLWTyMtUZ7jg"),
        quoteMint: new PublicKey(
          "EtfB62JaC4TKxQyinRg462Agi3Qm3yeo5jeGX2xyuNDR"
        ),
        baseVault: new PublicKey(
          "9S4v2UpTT7jUsrnbsdi8XUXhRqEWEq6RNqrZrWRL17FF"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9PrUieRQ117uarTSv8UNamvzocAUwWdHA93QQLVyi7bu"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "22tjMDmNg6LBkbeUnDUvmyR4XocKjHApzPd6iY1s1txv"
        ),
        eventQueue: new PublicKey(
          "HJS3JbXJF8psYdhZdGapfAyqevYbeaP4JbEm2Z3BQDt1"
        ),
        bids: new PublicKey("Et4jLamRAM92kseFZJTQAVYSqTQQVgYwr25R2kFrLNV8"),
        asks: new PublicKey("FW5SfvnAnjrtp7oF8D4W24dkP48h5zzLmKxSeEfVA8W9"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6DRkZbzfbnMxxP4EHKNYFdtFB5aDTGnYMbeSKvMnq64y"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8aM1kRdU2VFgDZeaXXg9gqTuHKJna1E9yx4uV3xJ1Dd"),
        quoteMint: new PublicKey(
          "9FQQSF3xeTu5xZhzUr1kjkNVvLdsNXCbjRLVsBvNee7K"
        ),
        baseVault: new PublicKey(
          "8xguzHN5bscQpaknLnA8pisAiqTV6B9yBQefg7TSQn71"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "AN6Zr7pcP7hQ5cuwrUEQatFtRBqEdiqtd8TCUWtMPT42"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3Pcqg8hopa9MPCmhyDZQggNsTvfmzJVYEpzWAv9DRmch"
        ),
        eventQueue: new PublicKey(
          "BK2awHFkaf2mnpc42JiJU8FS8ga9oXi13VNfXfZeTuF"
        ),
        bids: new PublicKey("DgL85Ybh2EJt7i35FHnwuT4nvLwxEBBbqTE38wuMV8ef"),
        asks: new PublicKey("A4RbPPsk9eEQXrcgzQ8vFJzixiwqVhF6e2Wd56zxswmn"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6LXF8yMRPweVFUDtjxesTAQ8Azc9FwdvbPcVkhmALL18"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DxxiN5H2z2jRcLwvhiRXEqo2ei3g3CuPMwfWoXwKNxpM"),
        quoteMint: new PublicKey(
          "GztvmeSpKJgLYZzNgUidHfzouPjnSkHDZKErPwrBPimb"
        ),
        baseVault: new PublicKey(
          "82M7dwnvBeWCVWuTCyjpN4EnyMPUCkvpoYaouNerCRAL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4QvfVYMpgWQHZ3dPad1WBPHJjD59vYuRSBqhkGTXnj5p"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4qgvq4hhoiQ4MTYooBkN7pnEx8WY2ELZXyMzkwwCEgh3"
        ),
        eventQueue: new PublicKey(
          "EfBZedTU6e8jgktz9LrnL21TNJgMnctsVcX8VPUcpejF"
        ),
        bids: new PublicKey("5ZZHHaB6CXScF5nP1eX1mYuzaks4BoQzjZCZn3L67GaF"),
        asks: new PublicKey("DaXcbFMW9trjVywmRP4JrYNiMaFXFhguVAPbgXezPeJm"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6Q8syGak5nMqUFFto9HjwR7YrntTRheXPjK2b7yK6cvn"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6qtaXYgeygR4KYiAxeztR4MVKySHphhYE6qdq8F8SRDZ"),
        quoteMint: new PublicKey(
          "EuTnUgjKygjwfs2UmsFjpYmTXJ34sEPDBy9zVxmDWoPB"
        ),
        baseVault: new PublicKey(
          "32WKF9YY5YKqH6nBHjEkYQ7PAKmWCoXmM4svcTdKcy3j"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "H9WU24vTzTJjVdubRK5d1X6qty8HpBUz87mySn2RtgkG"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6Y4foMHy865YSbh3DDjs1KP9GwuzbHiaH57a1PhG5Tqm"
        ),
        eventQueue: new PublicKey(
          "FQ8KcSJDtqU4Zfgbm5Hmfg9QJzHCvkq4qLgtHKm9GxcC"
        ),
        bids: new PublicKey("7LV2rS1oywDS7A4ZnBiP2HC16yBzpmx5uR3XFQBPhyU"),
        asks: new PublicKey("GxPVp8LhPgz1tMbi6B1wEMrQ4FFzZ8QbnkV4mwKQK5bv"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6SXmeDXi28Cy77NfmGQJqhoR28gKY1DxDPiiEmNJkigP"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9vWoUCPtAHSMYW2SCsjgmLMbCSgYCGJgELsXTqQssjfT"),
        quoteMint: new PublicKey(
          "2RgwodL15SvnMDijCGK9WTRbdCq5qGc4cEgDk6PrhB78"
        ),
        baseVault: new PublicKey(
          "AFu1saqcJX9bB6tPdTm6zR71ZKpjsgbjUcrv5q55HkKj"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EwGgnrxjEXrp9kUvERSuCwEqEHRkAGQA2uvYsYgkqSWd"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9zvSbhgU5qcxZCgG61rWYs49f6BbQsCy7eySS3qWeCQt"
        ),
        eventQueue: new PublicKey(
          "4RxDGL3bW2G61NLt7tbEb5cEhtTLQX7W2TV7nRWt2D97"
        ),
        bids: new PublicKey("AAdEjb19eHe96HnKNbVavVvz8rhjTmiFWD5vKzXLkYwr"),
        asks: new PublicKey("63haxsDiBGapqnmA4H4goXhnrngoHMMAxDfEdxw39VEd"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6Vhs7UF7unbX4xAek1QdFZhv4ViZ17fmrca6KhYA3aPy"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("mG7CuhYa7Kvva5hexv2XhxVu7qCwnxMm56dBG7Lw1fC"),
        quoteMint: new PublicKey(
          "Az931FGcJQWy2b9CceCgxZt5J4ECrW4MUTRjW3JjEXJ4"
        ),
        baseVault: new PublicKey(
          "2dUUnoAh8pmYTXnkQWB8mx3Kpu9x8W1sDLjNYa8Fn3Uz"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8HMXXVLkT3BCL61HiJCMCLwbHNSku6nXvZsYbN956tAn"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3eYmt2qGxD9EN1TmWeXcg94FRqg8CRRn7jaSc4v9XoFk"
        ),
        eventQueue: new PublicKey(
          "BpAHMKBfT79bJNoe9Kxoj1r2aeeDmAyVgNDkbx7J3see"
        ),
        bids: new PublicKey("CjWz8tHMttYHyVstuo4nHNbqjkKhMAAwcbj77jHmXhHh"),
        asks: new PublicKey("HWQRXrB6SypJbVyc9zQiYc5Za2jMnLzaCsQpsoh6ssQ2"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6cYAfbAf3xxt6ApQNaQmjosAknC9FXHjm3jNKiyrN7kL"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("94SJ2awPGc8VHxCvpVjK7ju7TbCEoSZ6bMKpoVJuWDEh"),
        quoteMint: new PublicKey(
          "B1GQC8YGyU5PbrBWJmoR4xM5EQH1YFERkXMVirbwcqBB"
        ),
        baseVault: new PublicKey(
          "Dp1QtBGDrKhamwhB7RR1NyKzoPu9EvSwnifp7C4K2JgZ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "GGZggYZ9Bgbrvp6Vuuw8cewgAo2AmGtr1NGLrYn6Mevu"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "8QQVJFTo15VG5HQBaYeVDyqtUiGHnquvyjmUnzFjqMms"
        ),
        eventQueue: new PublicKey(
          "FGpB4FVpbMLX2wyyQBK47ahjbfdiUFjbSUbeZtbX4QHu"
        ),
        bids: new PublicKey("Eb1TKyR45ksGLmtj3bHTTNbt8DYpTHdNqmsxyS9rt2J"),
        asks: new PublicKey("Hi5SjBVXqbqkJnUTdEod5zsqvsfht4sRW17HNJcJAJRG"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6e8yVZV9jCtJFvbLQcjHPbdkM8UN2DBHXd9HTEUEbNAL"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5Lm9Q72wrvyCy8peM17zFbqBN9jh4QXq7ryhyzCMHF6x"),
        quoteMint: new PublicKey(
          "59GNZBBB4wz7JnYVrmThBxQ2a6Xb8wUa7rA2E5buv5eK"
        ),
        baseVault: new PublicKey(
          "HE3mzCnpS2iRZ3EZ6fx57cg5nvM9hkvNZQDyffAtBwQ8"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3dT7PvCPYosDznk18FwRVZ4e1rzrJwH9WWoXKYQe8JZw"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Avg8r8AmBv1fpiEi9HkdbP7noVJBbRwHMvjX3nf8EDHq"
        ),
        eventQueue: new PublicKey(
          "6mhD9KFR8PKyFXhpUPVgcexSuK4gk2Sz6zPwUwRKdaYu"
        ),
        bids: new PublicKey("9cBCxCYZkQQUtACSdK2JgXr2bUY9RZ8Cwizso8PrhDhC"),
        asks: new PublicKey("9AKoYxxYUCLFw8u1n947RApBFHJztUnRvzCy1b7pHyjE"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6f37V1E9CodSiphFR9B7LWQ67M752TwRdcU5goAXxeew"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CWfhB334UJGjS9gbeXqVzXj78AYJSFW4cpoJrQxesZQD"),
        quoteMint: new PublicKey(
          "BdTtt9UXWibUiF2mewVhGvgPAvxNVMCYFkwXkFB1fi9f"
        ),
        baseVault: new PublicKey(
          "D7p3s9wa7fNZ1p5MHiX8DSQ1GaCEdjHQMTtV1va9JWys"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "6QkrrpaMmUvikG6uWMfeWhLzvMDUjsZSb5EC1VNbgsaF"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "5GScSBLaGT2SmEqqLxAb5SxE4s1AaUygBMJEVqeVR9E7"
        ),
        eventQueue: new PublicKey(
          "7DMSyScbvdp6GQX1KuWqksQPezsVf7VTbSzqwLUkzPQF"
        ),
        bids: new PublicKey("5QJ39p5gfXfqBDBiZ4UPCUvtS1vM5AqpAtmBbxZFu8oS"),
        asks: new PublicKey("FZaXbh9PPd4Ztn3PCrJoZwBaLhZ4mGgW6nsooLzod3Gx"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "JB43m9cTZVb4LcEfBA1Bf49nz4cod2Xt5i2HRAAMQvdo"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HT9nmiVtAbLp3GFtfrhGCPGz1tBcvHyFz43pf8rtDArs"),
        quoteMint: new PublicKey(
          "GHSuFYv8SicmVC3c5DeKgFhjDdegNH552srPFufFysDU"
        ),
        baseVault: new PublicKey("V6Y9bCVTTwjBDYAJ6ixMWWFK7RKZcQeUcpufZaM3DDB"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "5yiNVYs4xpC26yY9K3DYTRvdFkdjBSnkyeSAA3Huf4Q2"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6YcgjoTUTeafyFC5C6vgFCVoM69qgpj966PhCojwiS4Z"
        ),
        eventQueue: new PublicKey(
          "qjoUa8fC1DjsnwVwUCJQcVDJVYUhAnrqz3B9FSxVPAm"
        ),
        bids: new PublicKey("5kSQn4o4S4mRR48sLZ5kijvCjnnD4NbwPqaBaQYvC6wk"),
        asks: new PublicKey("7Nm1pAysuk38D6uiU83wXfegzruqohVNwUippwSZNx71"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
    ],
    BTC: [
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "AdBuhe5psTYF5ZuS9fX2JeWmRAD6ZsK7vFqy3xrcrBv"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("755jS8yGzYfW9mJuAScYU5dsJxCCGPMCKHDHLDxetDkc"),
        quoteMint: new PublicKey(
          "CAdUDCUF2LdEAWjtAHyHYUShku6Nd9k6obo8yLtgY4V3"
        ),
        baseVault: new PublicKey(
          "4XfJkphqsTw4KEDNo2KDTcMJrJJqMPw1drL1f8ZnqNDQ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9GjQtX1m7by5AJbf51v3hJ2sr9MC2dfksFMHctTPVZPw"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "CpHQ8GGQEquPHfiZmzi61RorqGXAUkVjEXE7oiXc2vnc"
        ),
        eventQueue: new PublicKey(
          "EzxWfmti66PmCsA7uLgHKopUidSLSHXjgia63xs6V14F"
        ),
        bids: new PublicKey("12XacQKgMptEtYescmXLesu1kpepZx52rd1VLtAtxkAb"),
        asks: new PublicKey("8GXS52TMsQdpgpmM4iN9rUWn85Xt2cgBmMkp2DZuhZSV"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "CcYkSRCKbWhmvRYZhPZmYQJ3aL4pXA6pwLP3EbvLM9c"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("EULD7LuVdrk1Xn7kYzsXNfCpEqRBf2bnysr9rTvYCUJP"),
        quoteMint: new PublicKey(
          "2DsMz5UmWCfTEezBvVeQ1Jgtcdomd9XHQeyLS9N4rY8o"
        ),
        baseVault: new PublicKey(
          "FitrntZMrPhLGUceVB1zXKUDGtfLmK7twdd1aW46Vvxn"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4auPezyCmqjZptTCJsb2jSCUyKF7CEY5FV2s4DxksZkH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GQHAHc7Fi5Eri6TPVrFNadd6FmcU3aFLhgBYZ9NUUs2B"
        ),
        eventQueue: new PublicKey(
          "5QKxL5ZNh3t7ThkB1Gy5t6u1Aixe5NbKmy6Mj3JmeRwa"
        ),
        bids: new PublicKey("7VA2AEVf4AK2GUyy7kDKPwACrxVXiDUDo9XJCE7YUshm"),
        asks: new PublicKey("5fsnW9jmwXomDDDAJPsYJTBKDJbK5sJqgrNSkbvNyLXP"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "EYdr7UB3ZyTfxGMRcgazaoutY73D2YdcN2oHLKFMBhY"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9mbJdXbWU7jAyx15EGezJVAPoDZXN1nR84H3duDJUKkf"),
        quoteMint: new PublicKey(
          "8vjC468nCdniouy1RJcmbDE5izX5hvpTYY7J3a8KVc7y"
        ),
        baseVault: new PublicKey(
          "FSeCF1ZM62kzNhLqcg2hZKoRXHoM3mfujwd15ktWp45N"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CtL63ahCH371JG6jLtMnZfaKHSUoehkofZVVCvizhhjN"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "EC18MeSRAion6FFrBU4owasgLN8Q9mvM5GnvoKkrsD7n"
        ),
        eventQueue: new PublicKey(
          "3gFNHmaCiwVXqe2s2cWvWb55hfLTybGs7LDSPnAX5y4r"
        ),
        bids: new PublicKey("4tt2bqMFDqRnhc5sphgEPy8r44HyAUBTqQwt1aeWm4Qp"),
        asks: new PublicKey("ARwphWP958cYN2LNJAvNC5Udfkkx8sRkZh8indY6d966"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "PEc1He5cdmVpoeYQ6UTEQDMFvNgo74qANi47uKhVc7A"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BPCNyK6Mn8g8u1sNhg23XeJiVexKVhVQsHi2gJL2y1rV"),
        quoteMint: new PublicKey(
          "68kVmBSWhvCZVUBU3tWqpPKRgDF8hKCMoiMFsxuTeRBS"
        ),
        baseVault: new PublicKey(
          "BZi27mePqk4SgsMJeBnFgtBjrfT26wd25j8whBhSnyHG"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EmXxzNgopXs6J9Q4xbVunRvhrkVf4KGXV2Hkdm6Z7AAY"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AhgsXndWTC7ftu9f6ZwTPTQDSZBq2zj9zPA8HNYuKqKi"
        ),
        eventQueue: new PublicKey(
          "pL2fNww1nPL984uzZbV4zxmHX2xjfow6QAvUDJ6kzbE"
        ),
        bids: new PublicKey("APXaP2UmGrJ5hRDWCCFHedviDjdNRxfsx1CGfAmPw993"),
        asks: new PublicKey("8PSUBcSCCUSWUdLwepQ5a55fqGmRuTqLCEcwfi3iwVnu"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "ez4pTSeHhdVqsQZ74DEAotp68teXTKDVwzVit3sdtHT"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FS867ftynPypB8bR6NEN3tF7xMiyJ3FEHYzwy9VRDXs2"),
        quoteMint: new PublicKey(
          "4FV3jC3WCtvhGyFdHn7aLzNPwvk7S4w6BdtnVPCS7tcm"
        ),
        baseVault: new PublicKey(
          "8p5aa8cqqz4nmpfnsaMD5oKcJoqag2MP4saRLip2yd8o"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8AWdrYuZNobb7rFWWPE5gS3hYs1K87umJHjqb7xQAMok"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Ggs8LXXtYHeSAsq3U1VQUJXwM53ef1ZfTPKjtWcZHoZL"
        ),
        eventQueue: new PublicKey(
          "9feSHmk8Krdiad9kuzAGcaaF7GSU9wLFzJuZWtVxXfm8"
        ),
        bids: new PublicKey("BQjSbHpEYgfkYF7MzfpcXH6W1PM7jmcYcreHdYWYCMzi"),
        asks: new PublicKey("6WhFihmxkEJ9jTyetGWUMHRT89fWyvgMrkcckLC2iJqS"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "f5VfNCPgmCyiDGCW3EGrFGNPqrM7g2rASjNXFXKpuyx"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CAyVkJ7awo3ZUiQiJe5yMNWmfY5Dv7Jvj5hEB3PYPQai"),
        quoteMint: new PublicKey(
          "9E2Gni8D34H4wqoALHRgra8mD4vfYTBh2hGkgFLzRYdu"
        ),
        baseVault: new PublicKey(
          "28pQ3m2WZ6NW5mh2d6CVPHwNszi6fDGqydaH7JrXKpnm"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "C1dE9qPUrA3gqk5SucGT8f6PiChLn6DkLapKEfDkYaxc"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6XdJe2CfFGMjx1vN7tp1mEgbmJwKscCKC2fTcLYTUkeg"
        ),
        eventQueue: new PublicKey(
          "GX7X51ErMfZVeyMw1PP4ghv9TBqsHEMp2YbY2M2pwUmw"
        ),
        bids: new PublicKey("2sTUMjnwjKxWgBnHztjMuqjwGN8F2dw3CiLrnspFKPLT"),
        asks: new PublicKey("4qw1gT5DnM425cXJLpQfyUVEPmXGoLK4yhsKzUJ4n3pQ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "pWotP1UPpYTW67Fzb493yLp2aeXYpr59AuxeznkYRaK"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5rNqCyxnnAgr64omNkQmCG1AKvPQ7Dh4b8xzrUPpeqGV"),
        quoteMint: new PublicKey(
          "95Jcj1E2GhejApoawVqbqEDrBgap6q34CtxzFqB2B2ER"
        ),
        baseVault: new PublicKey(
          "GSp3Cg3aJF2cyyD5p1rC1esZqpua2JN6K3URXZ1NEaxY"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9cHkvz8MJwGn9zNjgZMS5RoAbxroQnh2auaMKcPaLRRG"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "8aLjPK41RumoP3VurdivDY7AXTji6T9HtgooDyvwUPiZ"
        ),
        eventQueue: new PublicKey(
          "EhKthQk3XUXtXsx32cxstabAuherJ4Jfq9Mhg6oXKAs5"
        ),
        bids: new PublicKey("3yyHe8h3uBy3NMaxBtMkPUqwoZhRSe6G7ESvKDjAbMYW"),
        asks: new PublicKey("9ugaRqLmjSa33uCyY15AiDhUKtAYMDN5wVPntraWkk9P"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "qULmYuaYaHybjE48XGDqCTmEgAjFT7sg5SVPndsy9Qw"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HdxNwZtEEKFwzQpH6hBqFm7SAAuT3TqD2WdX59XqCUnv"),
        quoteMint: new PublicKey(
          "61mjDDcfULg7pkD5qQu2gpj6xJfNmTGEp5sFUP5W7vqb"
        ),
        baseVault: new PublicKey(
          "HTRNhve3VD9P7GbL7zeBk85oEoeuM5mucs1GikDMWeno"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2qU4Z6JjRjNCYvNDpFtu68PWsnnT7fBLkVmRPccBVykB"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "u8sczUcg1wRWUn9Wyk6tYN7QEJj1bQp8N4EFSo1h94T"
        ),
        eventQueue: new PublicKey(
          "8Pah69z9hLexnNSf3o7zwM3mEKeKWXFjSmepqgih8CJ4"
        ),
        bids: new PublicKey("E5cpZKAocaHfMhttTnVqneSKpVnHZzz8wbpPotp1vn5x"),
        asks: new PublicKey("FiFHuNcjT937wPvSZhdDsA1sNoNy2jH4yzN1ykhurpsL"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "28KLKkrpFtez4gaBd3M123TNEvhM4DdTcpKJxprtE5vZ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("ASMPmziJWa5cSu7rxJr9SB69dbpLX7tg72s6QEm7KM6o"),
        quoteMint: new PublicKey(
          "7SsWQCnUcTqr7qbMJVfwRZaueCkCn54gsTperZnUriJL"
        ),
        baseVault: new PublicKey(
          "6ZJ2j9poxWCzy8ymE9QTDRMgx4h5rUDUnQ3uzYaqguuh"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "5bg7Yv2ECkFXeLq9erchXtPVSaEuHpFyEr16SGah3wxv"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6ayYNoBSwaP6bpTXPM7DibfGGnZK5HQS8fx3UPUihPh7"
        ),
        eventQueue: new PublicKey(
          "Ho3mLCKoQjLW2aCRc6bBmczAkS3rhGJKLWApYPbwQTHf"
        ),
        bids: new PublicKey("F8dQxW6Y7X2oAZSJtAj6NEdFHfxz2ECwm2CMkYASQJb"),
        asks: new PublicKey("CfqczCb9zbAwfuqWrWzUUMADC2KiF19iYZZPyevAMfBe"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2DErjBW2vZf3EiFFtffWfn7sBG9ZRBSdBVHhEKgDb6F4"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9iy4teexKrKDNNpE5KxUTywaXimLiZwcxzoNZ1UVSNyV"),
        quoteMint: new PublicKey(
          "6MVSAC3tj7KFVqDptvfagbvzQkE6iz6mJHViUsjchtiP"
        ),
        baseVault: new PublicKey(
          "BBWzCdniAkcXzZoGLVPgHm6HKExGVfkLnVXLHaeXNtt9"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "ASiSDm5xpvm8ZAhycA4rUJDbHeydzczyTxYEx4NHwNg1"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "55X4vBY1Toy71GAUw9C8mnKYZ3hqv1uXfDEYUYv9X8VE"
        ),
        eventQueue: new PublicKey(
          "4zBbiNAH7B1K2dxSP9UpXmKBxG1ZAhm6ZyLxDQPQg4d8"
        ),
        bids: new PublicKey("ZdrFHMagGsEuWTqHb1Jh2D45XMsZbitY3rH8v4W6SNb"),
        asks: new PublicKey("7Ti4rz17SDnSy7o1GpBFzBNRngsz6Np8A5tm6GBbovN5"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2YJaZTe5FGDbjbXmKLMw28L7ZhsgaxrFbGmN6Wdc42UN"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("C8m11wQ89ugMUDdm1gjgE7vsHF1nP9AN1x886qYHjXQK"),
        quoteMint: new PublicKey(
          "HTq7MqyG5t9ifByHabjtDndbRtA67dQ8YovhiAbb69h5"
        ),
        baseVault: new PublicKey(
          "Fck8esUdZ3Gku4Uy3rgFZyy8bqhaAL5iKPpCR69PMMBc"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "46tATCNejhV5d62XTwzHcmUTaLL6ftoErojTygvCk4Vx"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6pfFXyNovSso6g57rojKD6d6RLSn1motbP4AevpEwR7L"
        ),
        eventQueue: new PublicKey(
          "2ExH97tjdj25Hi5JQHGx3jgMUnxhMjpkdyw3GvC7Kd4N"
        ),
        bids: new PublicKey("9dFLWFpWdXbpWcgfVRXqPzFBrYNqV9zs83Hd3QZyzGWF"),
        asks: new PublicKey("59eaBiRzude5h8vwx8SkPMWAGad7ag3g9pErbyiqV55F"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2c9sBCXJdBnEaLHKivqzDSSTK12br3Wj5VBGdD6AwoTQ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8xQd2SvBcEfHNhKbAAv4hFV7gfwHCZ5uK5Rft7iiDh48"),
        quoteMint: new PublicKey(
          "5RUFSpLDEHcaKCbYfRgkZbXLtBsLQ4e7yHZsnBTbg5Mm"
        ),
        baseVault: new PublicKey(
          "Ai4h1F1skPcASxw3xtA9q6hssyhGKtrdmQvqZd84nHZA"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FDxSjdsTDdcS38uzSQXyZPcNK8GNndb6PLVG92AYGHPm"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "D8dHByXmfQgzwEPCTU3gsNsK7r7SZaacG1YNvtxBskGE"
        ),
        eventQueue: new PublicKey(
          "GqmBHLV8bJUzvPbN5bmPidn6pAa3Yaod9iugWWd5pLDw"
        ),
        bids: new PublicKey("BcqAoXgQHBp1DKxrbuEzVHmrfDBTLkJkg6E5ti2Y2Hn1"),
        asks: new PublicKey("ANaz12XkFdbwW735iqhfBxuykso2JbquFZVbkAeZgLmn"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2r6DWProo8sSBx8FH62YV3if9qMnSeuozvg7Zb5BTkfG"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5snMs2igkq2ATKeCcGZVk9QDLoFvD6yhsWs5HaR19PBs"),
        quoteMint: new PublicKey(
          "CmCZAgrcRk5ajFVuTeajmbGbhG4Bq9jnxgaFjHn9UtmC"
        ),
        baseVault: new PublicKey(
          "74fkujeYFFxcSDFCE6zkRTFX7gfLBBoazNmNid6NHGXa"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "AZfLq3p1mubVv9Dusx4ejvVFfuAsRGQsjc36E2ZWUMLn"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GsMxRb8QguFcuHUcVm2duRLYDQRqSd8ftPSF88XAxMhY"
        ),
        eventQueue: new PublicKey(
          "BHNVaFQkoyTwjsRtrTtVToMsEEeepskHnfCdTciCnagq"
        ),
        bids: new PublicKey("CdJTfM3sX5R2QyMNLkak528aH6EDyMVYsrjfuJb1UDoe"),
        asks: new PublicKey("2Y3rYbT9YA7mSWa4bGaGydKUvbxVHykMZGBbBoUwzLmw"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3DGneY5jrFhZa7VEihVXnJsQ1RZ1s1eMcJVmraY3sYia"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7zqV6S36rLXhUKHJ6VjC7BtzKaeeFbg4kgtPtY5oARmE"),
        quoteMint: new PublicKey(
          "5T7tCGQiDzTMiSFG2q7fDzt8H8Ftsjk7bMfjmZ1CFyhV"
        ),
        baseVault: new PublicKey(
          "HUhkz2oU53Ss3LBvEjkSH86FDjK5kj2JF9RD8cNeQqXs"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "796TwVDA991CHYmsG9n23XxbESsHg1UNTAaCD5qFRs3"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "256Rw9FyJzX9DfdQuwPJoRAmvfd2kr9ikNY73YzXbiXi"
        ),
        eventQueue: new PublicKey(
          "F3EYx533nF1vhdN98edUiT8K4y8mGC1qS7rpY2shAdDC"
        ),
        bids: new PublicKey("3rdC2L1hCNSwCYCb3kofaxzB74zdSrjnVnLiPtEC6w18"),
        asks: new PublicKey("BtMUZU4YsETchhrsRxAW4Kmb1fLwmMa9aXooY5mMKmiL"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3W3THqzpUu72N7LzxWATigP7LQJfbrN9BSWiiSkWMmvR"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("14UmWhWMdnixuK46w4GdeLvuCtTtHzBE4FBnXP8PK46F"),
        quoteMint: new PublicKey(
          "BprpLhKy6VU17jjnwEKWE4xibMpb3DPRNs64YQjXpxiD"
        ),
        baseVault: new PublicKey(
          "GdxSdsBhbpFZFJowbV2cmxA7mXZSEH8EwzXpp2aFr7ex"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EZzcmY2H4pSgLXoBtMmZa7bMie8x6HPrb1S97AoHcUmD"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Dw8qnm6U7EKbq3J26T8XmGbQ31hgqpqHuALLYmNPYdgf"
        ),
        eventQueue: new PublicKey(
          "8UpqhMpBFPd3voPpsq2NcPNNL7TJZeEnXhCoGQA5xkFz"
        ),
        bids: new PublicKey("81kmFCx4e6nLRjF76hWmeb675VsGpuvik1qxe3EuNud3"),
        asks: new PublicKey("GqWao1RrsA2nBrcHxV3GZBh5wQQnLXLc9gMjyYE6tWUF"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3apdcTcSQDzS5GZH2aVrJyb6Hp1ykvsV39pHiw6pnTg1"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FQzEabhtLbYGK17G9AvLxBKdppCRjJSiRscJ2jrVEoyk"),
        quoteMint: new PublicKey(
          "GETvAZiyNVfvg3fL8m6mfkTXBaGQLkvxxsD1AGUHkASe"
        ),
        baseVault: new PublicKey(
          "J4AT6WYqRenjtXdjriUw4y54zcNQebaAygx7aFa2p8mJ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BEhNYzQt3WJqTvCWfUmUrP9Nxe88mEsE1EqkjxwzBS3f"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "JCaU3jM1e7v7PFoGg8Lg2LAfSTxrFTb1kKCyUoth9t2d"
        ),
        eventQueue: new PublicKey(
          "FARUJKRj4yG8EGNz3agj3CYh2kYZiPV7XXgZeW3Kkynw"
        ),
        bids: new PublicKey("7qdKyCGLqcXDHL3bjSFrvYWBV4WWqTadAAz7UUtHFhXp"),
        asks: new PublicKey("6JrFYjMngc6akjqDqecahUBNPpnoUSJVd6Ygb352dWLZ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3rb8b2PsNBLj5x7GqP92FPqxyY7crFkomFmZW6G5QUUF"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8he7Gp8J3KHmgnQWoN4vtxQuxrd4DNe11GR7HEwX5CHp"),
        quoteMint: new PublicKey(
          "FT9wpAZtvpTXnQRMH4jtCGMz9Dy3CQLhVwv6vQh3TBEb"
        ),
        baseVault: new PublicKey(
          "GQBwv6V2YvENfNvsFbMLuAF5pLBxQWKJ2oWLnufJAvir"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BMQUaU5QGii5t7Czww2Bbhui9Rm3o9z2TaXgMYNh3d4U"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Bt7zbHh9C7bY23mSi35XsLhyvweTJoyZS2VBeuaJLQa6"
        ),
        eventQueue: new PublicKey(
          "EPq48M6WzqjoRKFKh614ojRtQLcL8kqBKMn7JanSvr3w"
        ),
        bids: new PublicKey("3cKMsErK458Vqg9gBaiwShGfdz4vPhnyYRb4MzkZVRai"),
        asks: new PublicKey("4y2FyuvDyUkpGAbnzHnssgHokNZRpXU5gCzLuYZ3hvQx"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3tdK4HcCSMy7evekSk2skHZQgvzNjYEgGBRyt4FeiBNw"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3BuzwFQBrEz8y1o4EpNwffmd6Yb5nvwjDeHb1SXLyzyn"),
        quoteMint: new PublicKey(
          "3G5S2GNbU1wewESvkN6mu9ubb5spQzsBnpa3u4Ewavkw"
        ),
        baseVault: new PublicKey(
          "EWHAceFVs9w3r5adCJULNjAp9RBpZpgsVpKngY3PFC9m"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "AXdKxkJRkeTfm3EkrkNwJANMXM1NUHdUWtEckpxbfdKd"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GsJc6dUEyFFKm7ShmdAScy435TeVrnMiuBrxdSxpknAP"
        ),
        eventQueue: new PublicKey(
          "EZuqWJBWGcso1CqLdQ4GmMZKZu8SXNNo7Pr6UiBYaYA8"
        ),
        bids: new PublicKey("3WvANa7hXUWgQMvZQZXr3Who2ipGuXDoUMXGFurMdNU3"),
        asks: new PublicKey("BDd2wpuRLbZHzVhRdDysEN36SSRbmS8Jz4URV4xS46XA"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4BRinUTawWREAVNAW2Z5CMqUZNbzCsJYRpgGAuBDqafe"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FYAdKSnyhfeXb559Wn9Kh3TCNW5m2q3UkJRpYL6qw2KW"),
        quoteMint: new PublicKey(
          "5iihfLpDnZa68smsVTpwLoTVQmzPKZQA5ET1N5kcZ2uG"
        ),
        baseVault: new PublicKey(
          "441GWavhwWy52dzhVPK76brprURJS8igRxBtwoWsteUu"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BABFEQYaSRe6k7fuTGx8ASKgrXoYAA4oPgZaQDWTu46S"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "HxSEZRog7bUgFqnUSeo6WPMRqX57KRa7VpfZfhQKYgbX"
        ),
        eventQueue: new PublicKey(
          "7q47vZzXXTmAzaxhvboYEw87ZGXpRGMfnU8wmaP6QwCv"
        ),
        bids: new PublicKey("FVxVpnrGtWLbVPAGf9VA4Mxq4MoxAYGf7ps4z6ggnqdN"),
        asks: new PublicKey("4X28Tq6pEaVi6iMXb3hcBZgdhc6hqUPYqwwqs7eLiKRb"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4Khe9jwxBKNb1eVNud7Gqgo49Qvt7SjQb9nULbeRyd2X"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6rgTHBKpQy3SDwVP9uhxqJAHPQKDXdaDcs87obyjRKxS"),
        quoteMint: new PublicKey(
          "87sBgRXakTo3bxXCsd1BNFWi7s9xzzy31CSTJqWVS6fR"
        ),
        baseVault: new PublicKey(
          "36Xsn4vM2v27vRpMiB4EcKc54vwiNqmdtwMZXmNLZ8Sh"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "5oMQoQHnrngUKRPaZrmiysWXmNHaYXXDjCAtwtasYirx"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DoLpHzDXwzrricC5B8cMNyZCRNjNJyV51w8KHUTWYi3L"
        ),
        eventQueue: new PublicKey(
          "5ggpvENk1g2jt3VJmyccb2XeZaQgzd3nAxfYghZTURKz"
        ),
        bids: new PublicKey("2RdJNWRrDQxjX7NvYZMTTrGcJVeC1QLTibMq5DBdhe6N"),
        asks: new PublicKey("3GAFMFL2HM1VAyxyYCuY5qc8mhQXr6p1HXPVtF5wTSDK"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4PzRae4mjZkPpFzaW4NSjRgoQJHkKVWqstfm866QhoAV"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GNwPpdym2GMseVVq6qRjFEECPNApZYonoiKPaPdTEvGa"),
        quoteMint: new PublicKey(
          "47wG8rYoHDZWeR1Aoc8DqZDNN34vu8QL4jzjvoehzikr"
        ),
        baseVault: new PublicKey(
          "E2u3vh257cbXfdL4PBtF3TbSBcZuaeoLsfZPqZZbzeLW"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HKgmx6BEyKNdALUV3sKUApzgDFX6QkdPkZh6iQYHde9b"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AevifrA7tE34bhAceiPrZRCBZuaKDieAZoPqM7bayFyv"
        ),
        eventQueue: new PublicKey(
          "3mNCz351gRCi7qSCdtGrbSwPazrm7PXhzwUkEbihoozV"
        ),
        bids: new PublicKey("G8Vr3J1oUaK11jT4j5eNncVkovWjrtZzNnMhMmfp6yii"),
        asks: new PublicKey("3ZvEtihznYjHNvaAJzG9cXqmPQKZCxUP3Tga5rKAdZZ7"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4iu8iA28bK4bAwKfCzWwLLysnU5gGbS6ywehKkoBndS8"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5mDmxFMGHVpieSpLTkv6SRCsZ45GBaTTfX4jpwsB348z"),
        quoteMint: new PublicKey(
          "5KhNjYhTztpQWqmFWjoFm2Apn1t5bJf7EcnwdioLpqpU"
        ),
        baseVault: new PublicKey(
          "F9FZ1r1nK6C7opmkpE7oo4QuerdzK1yYPY8ot7MMWcTj"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9S4mhsrpPDK86PRYRR9wAgJT54o8U1bJmxAmUvsCrdvA"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9w8tuM7VQkZA4odyS83odUS9FUgf8wWVuhb3NRb7v9uT"
        ),
        eventQueue: new PublicKey(
          "DSq4VWLRjiWqnoK3Xr3vidzNYtvP2Bb2X4oXkXLyi2fw"
        ),
        bids: new PublicKey("2VPN2vPjtrNwTUxXZg27NKsY7AaPPbEB1xwoKwM61dkD"),
        asks: new PublicKey("CpsbyaVvmMQWK11NUxPtdd7axoF5Z89HfwAHPennpyb"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5SiNxTn8amNG4zpZbtKy4Sycok7QqXXYtFVrk6A3hWX5"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("MUGnEG8WG54Xr2255drMuLP6yYZLmar5cMy5yqUbMz9"),
        quoteMint: new PublicKey(
          "2ALZ6KFA4mqWevdGk6BM2Xeqm27cbfmPCj1mKed2iZKn"
        ),
        baseVault: new PublicKey("9KsBXDvFiuSKChCNJi3vtSVLTz7S2To34mjnRAw6vi9"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "aFDXdLxUCivsyhNZyg6EkkYuqxS3iErMjeNC8u9Bv76"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4mmFxQ3dvuJLHtbfi8bJ847oos3CkheRkrfJY9Un5zAe"
        ),
        eventQueue: new PublicKey(
          "9GPJTSzKGxvRPKBBWDZ1xVE1g8XaB2chpTcedRs5fPU8"
        ),
        bids: new PublicKey("4LX96BqeX2mxMWMPm7NfjU2HAs5mkYBq2qxRFnsUeNCo"),
        asks: new PublicKey("4igvVZjbJett5iBds1LLDeS4AfELDxJP3a8WFTDcJmxu"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5ZVzbrdRTxX4oUMWu4rzNLW3qgYQWR3Zyi4U4wDycU4E"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("ECSW9ePnJ7WUunoAbXPnM5mkVUBTDgmtjhHane7K41Dm"),
        quoteMint: new PublicKey(
          "3FAcaRS4fjAjqnPAnTnAr2CJrxo7wnZAouK1EpqhMSDA"
        ),
        baseVault: new PublicKey(
          "DUva4tRMXbUY9bFfmWn8gXunHhRk1fSkv2tS2uYHn2id"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2Yy3c29pAAaT2q6h1xyPrnj4YQWCVgvAc6BswRHGRohk"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "34YxLMpESmzdqJCujpJCMVHa4gDRNyUmT7oAPE3LitYn"
        ),
        eventQueue: new PublicKey(
          "FycRPFQmkGgYNTYfnGCK4ca65X5RuZsN6RE7CdKVR553"
        ),
        bids: new PublicKey("E1P4ab3nUaoyfpuruDCF5yNz16ojt1mp7FANeZsvT6Ve"),
        asks: new PublicKey("FajV4cmhsBid4mMYtJfziuLMcmp15tKWRuD6Vi4wckfs"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5Za4vREdgPbdMp89gpJLoksRyzgH2L2gxqZzyPhdERoe"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GcmUUWMoh9nWgpjmJ6ArtVrrNDZPboFT6zbQX4BUUpjN"),
        quoteMint: new PublicKey(
          "GnGmxR3VqjujN3oi98rAErX5WV8V3DuPeisUSVmJspsW"
        ),
        baseVault: new PublicKey(
          "8M7QC712Uj81DTD7we63oufgfQ8YfY94bR5PrA4ysQxL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "a41pENqG88GHe2F4LSQNfDLjiz5Hmr1kg3q6Ru3SWmH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "CgYMgDLpSvRx2tvXC6a4BqWB6MSNGG6YYeL8K6AH2zXA"
        ),
        eventQueue: new PublicKey(
          "APLVvSB7HVy6PgyeiFCoSmbKvaFy12EHvE1WTPfmiS8Y"
        ),
        bids: new PublicKey("34D1DxWiNMVeYEuGDNQc6jo5vckmbBeHudy4KBjHStjr"),
        asks: new PublicKey("CDTQ3XEKkj3712vahKbDVdK4Pbj2NBsbUtq7TgqQpHhR"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5epDEwBFmvuwHPDeeuVN4UjfMpm5cKqDz8CHjZqtVFbv"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("A1qEPmpGoYuSXCAK4imynpzPUxs4JjkvJ69w8JMzyhQA"),
        quoteMint: new PublicKey(
          "CVW8MNGupHtCxivPBDzcmqAHbXBkFEqaRmZJByLFRYoV"
        ),
        baseVault: new PublicKey(
          "GX3rCUK3Ym6PGUvjRHMqKX9UooqoT5pGaZqYb9UduPwz"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9fRkszYw35cEAxRtKgueKx1HqM2kVFx9e5bovZGD2nnz"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3RSKxj6YaYMLLkiyCahb2b63CsRKKXtNkE7SAf9SP6We"
        ),
        eventQueue: new PublicKey(
          "DRfsaBhjHsEVSwd62ftPKZ9FbfARVFyupFVSZoiM6TVR"
        ),
        bids: new PublicKey("BfTZuJG1PLtpkf8mryL6KB1fTZkVskHy6eSJRiXjcSwb"),
        asks: new PublicKey("9EXLzYate9i6EurGxNPuAXLdR95jsXokg8z9H363mc6Y"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5hJFVbnhHCHqZUYgc7CV3y74TUGZzP6vra8akckRBB5r"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7eX3efiHqJqR6zhifEcB7c3m4XQA3S23WWZ5aFJY24gr"),
        quoteMint: new PublicKey(
          "HVrqXRH824hgzJwdRnHEDqHndui6MJotZMaC981XuNYv"
        ),
        baseVault: new PublicKey(
          "AntXU5EssQDWXYPmCS6q4uMVbNdKnQe8yFM8N5FxXbZr"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Fi3AWrgw9C2XskRFW1zTMhLHT9FynbSHe57A17FZij7x"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DyoUih3uAnP7h36N8hAvyTsfdkwSJGGKDJNZqFthpHpP"
        ),
        eventQueue: new PublicKey(
          "DxVix59UDsep6EutDQ2rCUp6kiA2hmUZJHRJZXcvsEPn"
        ),
        bids: new PublicKey("9k16or9Vhyg45a59T3Fox7ejjzftyAExSiZm46yNg2EQ"),
        asks: new PublicKey("8buTbqiAhDhMznuSSxFDn5EhgmWkjFXdNCuuHqoes2Ef"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5r98u4AQCW8G6PCxS2dz92uVBDLwdCon1tM9ogWbGmNq"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CxYoAKba259wFJzWR2mcZg9wgZRpLByC6zVrgBA2M5f5"),
        quoteMint: new PublicKey(
          "J5cKAViHwmtUf31JCn3xqjsh687UPn5jpTPx19kpYtjd"
        ),
        baseVault: new PublicKey(
          "9LD96r4Z4RQ2W7YCjrzfLiSLWvrBEm3KyMgwJaazzwSY"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2W3jNaz9wsyMxynVEeASpEMGfrwezRgw9A4yTpziL8dd"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7BdXrUDfqu9Mzfev7ktW2JgWu64RtFyfhgN2qo6qttN4"
        ),
        eventQueue: new PublicKey(
          "3PJaBrREeZFZX1bq4ZxLkbp6UqhGE4WMzM2t3SgY2L9o"
        ),
        bids: new PublicKey("9v5odY9y1LVdQQGBTCKpPinfLBM2onDN8CX1R5JcQy4U"),
        asks: new PublicKey("AJBmHtc7muQGfgWnr3P6nPsWAnduHWbdytXYoXSzKBk8"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5t6gXZrg63a83K8nsrbqNAMb9qPzr9CAcJrNgqrgi4re"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("ASFriCBBc5ELkKyqd9rSKCdMM9PpuTBpWHWxG8tGPpv1"),
        quoteMint: new PublicKey(
          "86tJShAsP9Cy9ijrZabuP4kSbrhnoAoM9i6xggabc5PP"
        ),
        baseVault: new PublicKey(
          "FdNkfpYLx4WfM2JpM1Z56JcfQNPFfQbH9A4ZjYxggBe9"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EuA3mmEJGLzzsXw4ra8cPfN9DVZTBHCMSTZi6b88e9RU"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "92ikKGpzaNKy1z76q3RDjpxWH8tQ1B4uLaPspwro9LWa"
        ),
        eventQueue: new PublicKey(
          "AmNzfcmM8r1MXAwGervse6KCwxYxZp39WN18RSxDoss9"
        ),
        bids: new PublicKey("3nfZFoPNp8uvZofkzvJ8ubkvG6SVwwTQd3kEi7cRrdJq"),
        asks: new PublicKey("4RByayeJbo9FGykadZPXNj6uas9R1j9tiW2vpHar1vHX"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5vQqMh849SbVJqpFD5doe9AbnNJFoEyfDhoSpx4akPzj"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("41UQgoEWXy2jJdrcZkgBgikfz9VLCy2GUiriNCQJAfQa"),
        quoteMint: new PublicKey(
          "HCCTA33CGugVyxmi3jnV4nH29JjFmjUksNzBE9WBfYoA"
        ),
        baseVault: new PublicKey(
          "AZ9jwBCTbSMJzenvYs6SgL538Mr6AFZ43vMgmypk35iP"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "35Yt1BBa3ReX63ytPWZTn1usV9FasDRR7mCmBQjtq3aR"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "ETQPB7xbzM7ZP9fs2w2XRPqpDo81jbKx95NDdDNxDbAf"
        ),
        eventQueue: new PublicKey(
          "2tMkxREWRzUMFT8c5yECa7oD53esVYJEjrMbe2Y1zVzm"
        ),
        bids: new PublicKey("6Esh141rcL15iajb9K4SmTx8PFQ3Zhxp7ZNFvdHLTLkk"),
        asks: new PublicKey("egTQB5pxRULQBFtdUaUC1ET1EcLFfRaq4VttRHr9rkt"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "66G3bmJuaryMvuuXatAGYHPBmpQhnm8fveT7TogZ41cf"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3PLHLHfriQxugjz3AQ9skG3U1XCpxajtT7wgbTz6uDdk"),
        quoteMint: new PublicKey(
          "GLWefDoqyh69x9MGHLMqbU9LjhQYwyiaaoSnipG9FFNm"
        ),
        baseVault: new PublicKey(
          "CAUFm16HPcDN7HVtbFuCT77yHdrJRXw9mBYXLoLgECGr"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "59t47feeK9qhy5T35AMULsQcWqTcAaN8Z6kgFapsnr8G"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3MdeC7zy5DKiCWHgc6xLJQrEqb4SBcbN6qPK6oWwK66J"
        ),
        eventQueue: new PublicKey(
          "H3X8PzG92VSDMR6s8JHmie1mHHGQxR2EjrPta3gK234q"
        ),
        bids: new PublicKey("3HH2GD1t7oAE6MvhVuA7M32iC5XbRTqMtJXa6QucRSQp"),
        asks: new PublicKey("C9CcQEY8Aa63fJrSjXbq2tkfGyrmVokrv2ppqaD2ibXb"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "671F1HdFTXbuS9TYWGirQz72yBPiQcmU6LGC9aUhbkvc"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7BnBDPbRoKBZyQXpMyBm633d1dPWMLS8g8EwFSd7fMcF"),
        quoteMint: new PublicKey(
          "EUDYTsV2V6upeQpYKSTFgDmUdrqNb41GBNgSnKmoHJ4a"
        ),
        baseVault: new PublicKey(
          "EJEGMmFC6ut7qGSSVBbNpPPC9aedAqiXuBPeD49hj4UA"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "MBSjiyyqpWSYPKSFmCSFLaPYNTd5U1MGbwhj6goSAJy"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4MkQQMn9w87zwsUJC315QtX5jXuBX9y7g8DHPNqcuBeX"
        ),
        eventQueue: new PublicKey(
          "J1rPvKHWYkvPNDQrpQCk3XJB1cEjwoRfQNYrhDTvd8n1"
        ),
        bids: new PublicKey("J8VuAXaXC2D9HMCXZbSAypkZMYuacYqPFTUhv7xBKAiH"),
        asks: new PublicKey("5RiNFZk8haQD75ksqRPP6m9CCmNpSCC9TQQAqPCaFox7"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6AsF7kWtebK2BRvaYZPt3iXcpvoN3qZ729ZkCctzgqKy"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5vPL546esjH5zPEE3ZV5CPfHKNyvane6cX5c6e4MHjhF"),
        quoteMint: new PublicKey(
          "8Ne2a7HLhiRazTkb3wShMJEsByvPgGMvomTa4cbVT14K"
        ),
        baseVault: new PublicKey(
          "CgK24LfAhwyuAm3945b93zF4y6MaWNUHZSdMJX5PoBa5"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8mPAepgodZtZfajWu3aB5X72cqmp1GfY77tD4A999bs3"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "C7gKKLhjmbqoWBjPAHfDfr5X12BtEKBTFETTDxdnQzgs"
        ),
        eventQueue: new PublicKey(
          "7V6UrTVfs4hBJuGkYAvffCfHTGQnLpuLjzUqE6HBUjkz"
        ),
        bids: new PublicKey("B3KMuv6QaA3PGPcbZ2Ad8GvMg1PshUQBLpMFuf5Rdj3n"),
        asks: new PublicKey("BGq2AJehGdg4JzRrb89cb3maSvdBAPNpxLSeivqtbTg3"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6AudFC4uJUJTh7jHfGSddg5Jgn6agoWBCuqu8zjAREDr"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("64MM3KsErQ3wa3tjnyv2JUgR5qEsfMS5AmFZXW3VUzfE"),
        quoteMint: new PublicKey(
          "D26eikT8eRK874BWrFj6taCpgjQHizGycrDTq7MkD3Y2"
        ),
        baseVault: new PublicKey(
          "3QxJdiE5nhPzY9uxj293TRijdyTfTyp7SQcATJwMTMnw"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CPmNTqa5XPN15yQV8Xf8CSKxPdru4PHzs5JrqJWDRqbS"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "92JQZkcMwSMbASW2Vuyuwszo7vvQX3GKW5MQC2Yykrp6"
        ),
        eventQueue: new PublicKey(
          "FtfUACK17XN5NHxTVEgKG3ivyqqsCva72k6gvRBmuk2Z"
        ),
        bids: new PublicKey("BmcT3Bq3eWmT4YgvfRfG1gngog4SFwBKR45sEG4LeNxf"),
        asks: new PublicKey("ARb9hVqV62QyCiyQgdNyASQoXkLdaCXQHmuKvgs7whT1"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6CLLEbgmvWB31qq7646uu5yRtiRJjLsStyeirusZyASJ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HqE9mmQFuWp2oHuVr5MpbskujQiJNE6Jbpa8HwmKcNEq"),
        quoteMint: new PublicKey(
          "5tEjH52etMcM8p1qxZrckvU1UWQrkL8zf8dzyFcbMGTj"
        ),
        baseVault: new PublicKey(
          "BU4cgfdgxnFyJUo7dS69uqRjAfv68FsUfj7FbJs17fSA"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4F57kFm4cZDkkNdscWNkMUVxnkAS8kZfR9BdkjtCFVm2"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4kktnr4crXZRCr9ena3t4oD8gRdqCJ1HubyJBuLWNXJB"
        ),
        eventQueue: new PublicKey(
          "Eqgpoau2fhTEsQR8k16W7GmGz7HxNa3AngNBzMPRe3su"
        ),
        bids: new PublicKey("GyGKFexsdPtHuwimCTYkfXnqFseb9Bt6Fn8cciEp3nyG"),
        asks: new PublicKey("3iAatceYwf9FA8Nsk3JfdJFCQMWy8xD2oW6YgiutWsHz"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6LGwetDZ9h49u8fKMuAM8WVFDKy1c3KhdocPxKXX2ueJ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FXCB7DYokNjv9sKYLxokhEy3K3APS4wdDbAC7vVczgr2"),
        quoteMint: new PublicKey(
          "5Zqhys65UHeErXQ5m8Kbezzqvh8LFkJKdcXvWf26Am9j"
        ),
        baseVault: new PublicKey(
          "HEwuaXkUWfL2xBdenMgbHmCiguJJqG9fg1PVjwDyejkR"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9nBcigdac5ofAoypdwQT2ZhYgZoYxpNZqk1PZWdckx9j"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2FSi9oEhP4kAUTyeME3k2pQU7FBSfh7ovGTaPYu5Ahne"
        ),
        eventQueue: new PublicKey(
          "9pr8es9NwYaubjv2T3223qchawWiUyLKUfZe3TzPMtnB"
        ),
        bids: new PublicKey("6ET5Mjvmhggu3A95u8ojJC38D8Q8qV3mXTyZjBND28Lk"),
        asks: new PublicKey("2fNh9vBJ6fNzbm6PiSpMUzsh3qWzu6Cqs2vr2VFz62Pd"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6PAtPpepxJwmrhaXCTTb2sG683U6mUjuVRYxM7NZiyNj"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4DaJPpes2SiAK8g7gVGSqPybncxwanYm2Hqz5ry5D2dr"),
        quoteMint: new PublicKey(
          "8P3CDgvo99qHfpYxRvNPVG7EcUE6uTHsN4w7hWDyorNq"
        ),
        baseVault: new PublicKey(
          "EBatx1UbGKn4yXn8A3jX96G2uYrmSNR6M4XrX8etzcsX"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HJChZFZP3drf51NV4iTCK8VRinvToezxt8Sxq77xhJsh"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "91DNebRXckU13SVc85opUzFSWP3V5EpWDk9LjMyZHBa3"
        ),
        eventQueue: new PublicKey(
          "BNWnLcc5yEePCp7jbtjW6y7pcVxhJaSjXhr45fm4w7SJ"
        ),
        bids: new PublicKey("BkJYRvN6B5XuoXF1FQPXZ56Q1Vb2yeFhZvFrrYtyYsUw"),
        asks: new PublicKey("BgLU3ygnWTBxYpC2Lh9gWzVPTZKjpfmA6aQD25EHUirK"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6r4QrvqzxaHgWBsmC16bVQyeDMwunKUaNmhqTYZEDbXU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7uJbxfzsMt61oJBGenZhgXopvEjcaDSVXpMK8xdfPoJs"),
        quoteMint: new PublicKey(
          "BvUW4S7tHWLyvuzLNJtcwArsvN9qXBvDnYdi3g5Rnynq"
        ),
        baseVault: new PublicKey(
          "FhXVNtE6uVHZXKbHiEonwKK8EBiLZcNZ7ZueCY9W6i5R"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9FYgQwXQBKQjmuzQbRBXX7iGedNhf4yNYMr9WxktYpd1"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "F125qs9nj3etP4gTP1oaBfRkcRbqXkmQFbcKRxafpcHZ"
        ),
        eventQueue: new PublicKey(
          "8LFXgfawSKvJs8KuusjyYicpimeJzB4hDw6LjCeaciic"
        ),
        bids: new PublicKey("J1DHPkwpWjK8TRVoUHABAnhufhcv5NG7jdrmrwuvQHYA"),
        asks: new PublicKey("7RKZkYvs4fkDQBkJg5zpvCHEHwVcubR7NNxYKeYH13AN"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6tFP43fEPZaW4Tf7QCpWDLzay6YgRQZ5Unt4bHqJpXeC"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("2QBqTW4qLMEuMVfz1WNApHgJdCtJXWRsdeZWt5zDCxbf"),
        quoteMint: new PublicKey(
          "8b71Cmn74UobKPQrrwwppxQstiWJQpS2pthFUGCpLC8o"
        ),
        baseVault: new PublicKey(
          "JA3tdJrrqj2XWzFzdmgUfjY2Axxj2Q5YL9kqVG6GRUJg"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Wx3RQAup75jRBxB3z43NcRf9fDddg2mFvJ4rGtrztPo"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "CwzYt1mG5P97Vt8xcFHb56hWJ9bqrQV1RR6bGXPdkL2s"
        ),
        eventQueue: new PublicKey(
          "9bYFkhgh2Ei7UivdvimQ4h2bT1jv4XuDmireyYxMrS7B"
        ),
        bids: new PublicKey("fdvidVtV2sNuaHfWyosLW2JKB6qe6dEgqsH3mS4NCZA"),
        asks: new PublicKey("Bms9PXgSTbNC99Dth3bxFuMGrQRK2JoVuUm9d1jdNPv8"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7GxZVzEN61rQMcaCQHyGee7aebiCWcbRtJsaPycLyZzL"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FvDRcSPJ3gJKNr9h1GyUrVECWgMNNiKDFpWcitTCogSF"),
        quoteMint: new PublicKey(
          "H3yBNFwLpvLUJtJMyFU8q4xYti6SsyhQVHhV5tMWNVT7"
        ),
        baseVault: new PublicKey(
          "DgDnJnUg46BCeACFt7LioAPHi4gMN1SXsM5U4QZoDG4D"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "36aY1cyNSuDy7wxEos6GaKtCizy9ezjFEpfJx2frDfMk"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "FJ9wBH4zZ1ZP6uM9FGfw3sGQ2nmHYwWb12gFYJcMpWHt"
        ),
        eventQueue: new PublicKey(
          "G5ie5ezQhNxWwiUAWvxirtPcproyFsuQxcd85c6njvz3"
        ),
        bids: new PublicKey("ERTQVkgXLFxb8QSuvgL14U7rtqUE8NWgtHiFiRUxcj4K"),
        asks: new PublicKey("3vKbhgxcyf7g4iSszWsD946ijXXTmCHksRDA5NjuqYbu"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7LcCHD7EfwTsFMRyznuet1QMy9gKXMHD5RoNbvEv2vog"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HAcRXtU7MzQRtGPaCfRKStkRLwH3eTawPpkK18hZmgyT"),
        quoteMint: new PublicKey(
          "5cceKL3jWDyN2jRNPosiXLYWZCyXPp8grk7QK3RkpMRY"
        ),
        baseVault: new PublicKey(
          "HeSpg39WYzoBLD87UaNXq4V92nnqCz56Cka8eaXD7HT8"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7mXDZg1oJXH1ED1J9rj13ZCyrfQH5xRxoM5fykypu77y"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "FuLrSPjhNyhTGEw2uLLiEAJW2uEx4KJft3hxV5BKcBnp"
        ),
        eventQueue: new PublicKey(
          "5xZGDsthWbZCc6z8LgLn5K8apcf6Gmiypu12kaiuWVjm"
        ),
        bids: new PublicKey("7z4N4b1KaBQLBZa3DGx5QD4axadGAxCYbg8urh55zrdG"),
        asks: new PublicKey("Do9WYiRgAEXsNVGfqE7g89ahQFGq6EPDDDeNucjU723p"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7Srr6p3vGg8qg3AX3EDAoJHh1M9QnXpwcLGNDDj9CP6y"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GVgdAoytC37Zc8ofqUMZiQjXcVbJnbbtgwQpDVLsPoNt"),
        quoteMint: new PublicKey(
          "ASai7rdCb4sgXL63GNTsaWruN2J2XrQF7Zokc3KRFGPC"
        ),
        baseVault: new PublicKey(
          "C7aee91eS3ZuJ836MuTDnuA9Go35sFb1RCEXLxVKLNTL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "ES88u1qyMfPifga2DDsMuCXiFNJfd4d35NWKAJkpHfpp"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9TtaXxUmPPXgdsP2GqYUXDZ7X82ZE4M2sEkt54aram2r"
        ),
        eventQueue: new PublicKey(
          "5r8b9fG5muZrfb1V3gD1cQhd8QKBn11eafaL95N3SHws"
        ),
        bids: new PublicKey("Acww8x4hCcvERFRJFGN1tUM2W2BwkSz8mkhYAwJL7XZK"),
        asks: new PublicKey("H4VaFVMSpgiKunuMBXZ8zjhhCq44u2uUt7Wt9jGMoPiP"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7Zxidst4ZWZ9uE71jzqiwsUn6TZck6XYTk4CmqTE7XTt"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HeQvd8APrcSEutUDYkXnUDHBtFSEG4QsaftgGs9GPYwR"),
        quoteMint: new PublicKey(
          "3k1hnnQHkokYjShjznhNujRw1VstGPwxQvzcRDvrgMxf"
        ),
        baseVault: new PublicKey(
          "FAo3evuv6QDkdPzB7LyzKQdvwrX4dvfdLxX2UnFmCch2"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FjxFP9Z8frfYWeRfBA1XuCQxZ9L4bkdiUQSZWEqtxZxr"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AWZvmT9sGRoyctQKjEQumGDJWdtoa7U1x95FjtUz8PjN"
        ),
        eventQueue: new PublicKey(
          "4tAdfJUy18CTxc8yXwXNM13APxm3xXUHDFymrtNBfYFa"
        ),
        bids: new PublicKey("BdP7JUtJkZi248ELWaPStpGGDY2j69bzY78hLquyTcLc"),
        asks: new PublicKey("4i2SDi3yMfxVCiaRTsKQDJA4SaZrfoBn2VFCDPaU9WA8"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7bA7D9s6fKDkFXLMPdezjM5UYvMtxYtyZyevCKRoyoKv"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3ibN32ieuWyzcAvLZc4KpUDWkyEBF8WqCq22YCjprRdm"),
        quoteMint: new PublicKey(
          "41mBVRFEwgFZTyvehPaiHgorv1TrxR47VmuktngDgETr"
        ),
        baseVault: new PublicKey(
          "2ckGqLoiq3tHnQmXzjtpPNYWMiVf6D32VLtBKTchWM89"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "62DeVUu8aXnwt7uZGZMv8T7mSW3CFPv8UnPExrVPD7Xc"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "FY6ULWSbwgcD6fkhWjgxo64Ktz2guBNC1k5P5MD7pJon"
        ),
        eventQueue: new PublicKey(
          "AVgr5T8gMyhduFzad3LCBdq4v94ftZ29HpRmrdhirzmD"
        ),
        bids: new PublicKey("5xWFmqpuZL6Gtg2keBLJ9bH6hhxqt8kPsgRKdctLQXXc"),
        asks: new PublicKey("2Ltm33ovzzYymkjHuKHvTHPkXD8dsHMnDaGpWCEeGAkz"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7dmKcvMqhZzFpDKY7PqAC7knGRxzUWyNWJ6cAXFfvVTU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GuSvtqNCy4kM54RpoQorev8wYHQmQEfkbMvDsnS3BWP5"),
        quoteMint: new PublicKey(
          "BUuQVKm6izu3HSQdVw1KMTzK6fF6QB4Lc2vJ3UKWZDoE"
        ),
        baseVault: new PublicKey(
          "AJ8HEsmh82bzjzVb5mYERys37a8obamS58CpLzWUGVQA"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3FkSinuLdCuhFCdGk7Wi5NZf1geCVvM5owSgpcvuPA1i"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7HCpzssGzg4PkS7qc3i8daWdMtPwkECe6Z4ktdBmgGcG"
        ),
        eventQueue: new PublicKey(
          "9UNgGV5RySoYc64doiS3AfsKRVc5rtYrJHz7HjvAjVWi"
        ),
        bids: new PublicKey("9hM9oQcuGnbXF6vXNZYMJSUit1BRboycDczW1rS8PXuR"),
        asks: new PublicKey("EA3EZZ8bmvb9k94DFgQBAX2oTQVBd6RnH58oxPqWRfwY"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7eeFRRjRpVsRSHrNFrC4EZMic1GE1AdGJnumUWCZo843"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9baZUdJi39Er9rkDqvVRZcn6R88LsnsaJfw9vdndUxck"),
        quoteMint: new PublicKey(
          "99FYyKwQNtnDzfy4jCrUTvLgctBJPBch5EHvER26PdBr"
        ),
        baseVault: new PublicKey(
          "AGKBXFsoVjqKVZx15dp38VCSvTxV2gxk9VZFJ5wjvgZT"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "662irJKMUgbbGT2ehR8iYPH1U6k2ZXN5dfu8yjuAvAvg"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DwtuGUyGtkBZCZLw6zQgofrLeZq7Hg2figjgmnM38wdF"
        ),
        eventQueue: new PublicKey(
          "D4e2gonTiPEiWzY1PrNPVULyxyohu76vzTknNEwo2TA4"
        ),
        bids: new PublicKey("HabPdk2CG3h28TbFLDytH5N6EWn1jdbZGSati29HGYpd"),
        asks: new PublicKey("TFDirdL6iyLKb2MiJFPnTB9r6Xod1qAw16h7gPWdLVS"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "J8yPaachUYRo1qbtdvkQU6Ee2vzEt3JiYRncwkfoB3iZ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FDXX8a9asz32d6EteL6Wnra71YjT45TuGHy8Y8dPntbq"),
        quoteMint: new PublicKey(
          "2fgyaTU1BeSk3LWbEh9p3D1H29hEt1wyy8qchKNGxBhg"
        ),
        baseVault: new PublicKey(
          "2CtvLehungAsAcYhqnhLEoxuTaM5WqHrycn2YNpmnC4z"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9bGCvH7MwfwyKuNzgfGRXU8sW9jWtFMJf4FmUsQxk13Z"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "D9mSSsfXp9SUrSCrmPA8sDJ42GMn65Z5tZr9wtwbHEBy"
        ),
        eventQueue: new PublicKey(
          "AYUthyJDg6mvBWjGfEGYcnjRbw3TZbYCnEQyqUiPyw57"
        ),
        bids: new PublicKey("D7g6CGNVzebzzH1t98tBJKjA6FokiuXKaX3QVF53ZqcC"),
        asks: new PublicKey("DLzvYrHo4bT8PoSwhxDWKhH9ZNsnPbE5cgCx1coCpeR6"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
    ],
    ETH: [
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "9FhMnAUoDHoSPXn3LCy3nwPLvGYzLEmCZRJNRiF5MqE"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6AzNvaWwxzrQS4csks6zcpohZezd7pZ2iYL1qy2WN5DS"),
        quoteMint: new PublicKey(
          "BMEYENfA2dqu67NzF6iJiUFakMo3rskdtisK1JPkdW5f"
        ),
        baseVault: new PublicKey(
          "ELB7YWvUJHiNm8mozwSL7SiVTKYUJPKtVgVtTwJme9mD"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DwFqTRmYtu4g5FsyFESEbLCKqr94ZSUPZ7MAJEmZx2gG"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3WkqBdunjKNaYfG72YYA2LAbYBqwbeuMcKsWxWGRSBbr"
        ),
        eventQueue: new PublicKey(
          "5BkmaeuSFChWQY7rxWR7duLoM9ea3GjcZ4v8VwCEvq5J"
        ),
        bids: new PublicKey("6X4zuUjS73zfnE84npyvNaCDU8U199dPcDmyESTCCBAc"),
        asks: new PublicKey("48VH3Jr8Loq3RJTi2pyrk7pgWb8DyzPduSrhi8u3ckVp"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "FMZEBvxAtK2YJXwmvVWjXWeXmgm5GhuYXoCq1V8aUYf"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DyhhYfoAe9JM9SfB1kg99AuE3N5GdAWHYmGUU1fuogwK"),
        quoteMint: new PublicKey(
          "5LFACu8gu3tTNuVKcAV4ttAEqg7myiYQgTcxGBv8i6Dc"
        ),
        baseVault: new PublicKey(
          "G1cJooDyg9uk5JpYPjdD8jH43YNahQPuFD92BxFtHfqY"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "6cvDV1xmq1ZTbN6PTS5VNpeLiDCMqDhWU1SScGPJtZnb"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3KC4FLvka2fJjEq92FcPXBWhdUWNWn5gz37TcFWjakCV"
        ),
        eventQueue: new PublicKey(
          "CTFPJRiz1642pWfWpGYxSqR2AtUgN78E2QgHHZC8F1bW"
        ),
        bids: new PublicKey("HjQHV8sm3rGdTTGni2WbeP6teA1926JQouj4gfouKJyn"),
        asks: new PublicKey("FV857bAvDpzAFS5Wcq85MdMitr7mC8wuCNPS6JqCgV5o"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "NwBH7VfahPCqh6MY98kudGff4Dk9dJU4fjvUH9ucPKZ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3Ygh8xijLV3Dd6fzeEjwtqbFH8j9eSEEmG8m5E6REAk9"),
        quoteMint: new PublicKey(
          "GG9DQZgXqcFew2Q8fG9F1fWTLP5iGos6Lo3Q91ShLVq1"
        ),
        baseVault: new PublicKey(
          "DbembPUtWM33KPFiaVbfELqGVwYcoAHiygzWoGF6FEJg"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4wFKRMn5eMKgyNg66197nV2WDpTqG2AaEGzbxDiAStb4"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3YxpQJzvxe7TU4yQtCKbUfcFhJqDb8QAzbv5wvdNRMUr"
        ),
        eventQueue: new PublicKey(
          "2UnzkZJKX9w4MxDns3RMRfFJJAYq314KcMTTdVUT6ung"
        ),
        bids: new PublicKey("6yfCkkmXcTkKuM22oTj3igrKRtqcQy6Q66Scc1vu2fzA"),
        asks: new PublicKey("EGgu9UAQkcAu2RFaktGSQNqYcY5VotELT2W6UKVihwpc"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "Ug1qpH4y5r2Ha62RPs6zzWnr2YBc2UdGVW4jg6DDqEJ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("AAGCJJQQ1r4KgprRUNv9oaQJMU2RHsYJMFDN9efp3xjZ"),
        quoteMint: new PublicKey(
          "HNj6xupRK5m8AnsdJAmEChecN9FBH8adS2WjYSSrA6a5"
        ),
        baseVault: new PublicKey(
          "6ApZar5YjbqMjFjHWRrxGL8wkAne6hdU9ZZnhdkdodYV"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "E16kRJYh3E2RQhn9eQcPTCxcUVtG54ikmYWCgeCSPwC8"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DaDcDgjVDVH9z5vExyg2frb9nMbPmDYBTV9LiLSffYCp"
        ),
        eventQueue: new PublicKey(
          "ANjsAwyG1TMiaFifCckEStAf9KF4pMs9y4kAa3TF6R1w"
        ),
        bids: new PublicKey("DjFdMLougHrHaxY1Rakf14uBv5aVRp2gabCair2KdZMw"),
        asks: new PublicKey("6sZNRwqBjnvsjiz3roPb3CdMYL7tjoTom9d3jCqDrMHA"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "Wysp6dBaG8Dv4CkM31Xd1wDNvb8Pewq522saDGamWHp"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("739wxdRBmN5hLKGJPmMEJQjm6EKjG5EMxuE33nu1DL2g"),
        quoteMint: new PublicKey(
          "7VNDXrE53RgHYEbvQZzUqUhzJjy6ktQg1oT4WEKkMLd1"
        ),
        baseVault: new PublicKey("AFgydEzT3Hft2TtHLtbrWLPjpb1sc2DwsJpcJiyUsjK"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9gRFtm2ZKJyb2WagmuwY5pSzyjwMZettKg62VFzd8Dfi"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "81LRhwPsHebhNsGsw2df6KndPrdDEk7LTx6Dovdwvxb5"
        ),
        eventQueue: new PublicKey(
          "4wre2CTwk5hJG6w95wE6fstnNHQouST4q8ua8dsivqtn"
        ),
        bids: new PublicKey("EkhC94V6F2FbgGrpVQTvA8AuGqnJBKC2UQrfBMtdrc2X"),
        asks: new PublicKey("HYRzkejCrJcpZq2J9sx9UyPQoWBbSRUbKU1R1ysknH7G"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "XNohT5zKfyJYcBZW8WgM6D5EKjwWE4UnNT9QfMT78Sn"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FGVQ79bEmC3yZCDwpF51guraWNLTt37kmiVTNZhdesG4"),
        quoteMint: new PublicKey(
          "AqekwAgYuDWaT6aMKZ8JHkwV4jeZ9jxeFwYDq6nwTfsH"
        ),
        baseVault: new PublicKey(
          "HxEAtCqAPhdaBX933BJHodFqQjy3eQuQ3SafDUmHvf3S"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "wDjsb5G2MsVqkgnWxubnCndqir5AML5Mzns3AB1M878"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DQ7hrPheQEgXfhoXgNvatHS9as7Zucqdfw7TKuCjkmVs"
        ),
        eventQueue: new PublicKey(
          "FB2KcKktqkbgWQKs35hSwg3H6oHHwCVGwR2wiYEvyn7Y"
        ),
        bids: new PublicKey("8KtQFnYRhUzhBhnLzDQLq3c7faeehrqnHgmK3bLtUYmo"),
        asks: new PublicKey("ErVdcb1jgo42j3SmQ46o53vk6oQazH6dYZ8N84CwXGu"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "awocauRn5m3FMvkEyuAbgMhkiPtzmSUerEUj8CeMUC6"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DEnb3d461sQwEF9cv9bwDjBKrWwwQpPWuCrCiXnWaeaF"),
        quoteMint: new PublicKey(
          "Hwbekp6GSy6eEoTw4Lyx54684GGk9xDeskvANENsqkYq"
        ),
        baseVault: new PublicKey(
          "BGcHaYnahR12N2MTH5PcM31fEy6Qi6jT8j8NQZaVAJsT"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "F32jdRKQKN8U2gPSgFzcpt3q16fc828aAR5JF3oPFxbC"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GfusDrgpwSMTD38dHFrn1Am5pAbEm2qUrLG7Tcm81xM7"
        ),
        eventQueue: new PublicKey(
          "EmU8KJx9T1iG3QQKKiXtLxnAesdeK6qnodu8gU43pV9b"
        ),
        bids: new PublicKey("Dp6o6jbo9zK47iFDfSHW3yJpgsDMsedCjSWPWhHRPWCs"),
        asks: new PublicKey("DPBG3uZLp8fp4RCWAiVaBdiTAVMznPy4QPkusCeL6h3C"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "bvWvje31ScYTZjsyQpH3FRsrT2owCut2gGLSpbpv4nQ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("A6QDZBgtY7hHZmcN3F5SYVpq1UemEc3NBrou5w9d1kDJ"),
        quoteMint: new PublicKey(
          "EchdABaU2Nqq2ZMBuo9GaUMAqL3DVCVCydoT6dz9eBrp"
        ),
        baseVault: new PublicKey(
          "AGaptH2NZbpNgtovosCFMckbydb4hXGb13R48BDdRrJg"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "74hmaaTG1Rjm7RP97z9ZpM492DnRT7jDzvcRxzxjvkBE"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "87Swr5jSSnGXC99xbWRfNhQeHdF9LBk7t12gE4oLeh7u"
        ),
        eventQueue: new PublicKey(
          "4uLdErAUmGvjKqK2bdXJ1iuc7Lb5twT9hR5EZtb794HD"
        ),
        bids: new PublicKey("24pt9Zb2HNot6vWkXojRkrpj9UhH7iNYftM6b5HCEjsA"),
        asks: new PublicKey("2Prt4HRmpHJaxHJ5KPFhs2bYkgQKb3PDudEkkaJsBCa2"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "f8DwwNQSSsZz31EEPz5VwJgAqLSjJFDC9sZfLg7bHhm"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("B1JMFTeC1r4xP1irMPRA38y6kqKi3fbL72kteE6Phmff"),
        quoteMint: new PublicKey(
          "AqCdFcc27FvMx5ucy64ZB5G5caum6SLc7foBMwxWZ8te"
        ),
        baseVault: new PublicKey(
          "HNWbN8bAojoCYQ1jzumbPwkD5C8EoUYX96SqQMpogfpL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CdUSFfbLowBLkT3x1mwgxK2YqBFjnCSXbRJTkMWLPf4o"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AozeudUSPMf3F9XxkuBCFq7bGxrJ5UwZVhXzeC6t8XZ7"
        ),
        eventQueue: new PublicKey(
          "48FCDNrztMunGyEP4Mf1khf91nw9zS1pgsqWD5FbnYHP"
        ),
        bids: new PublicKey("2DjpxLuk6pv2LgzNz1ai19qptHE1w36eyNjakxCHMuV6"),
        asks: new PublicKey("Bg4jn2sSwYUbNEdqAh97p2FsMY1jP9kKi369pL36PrRz"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "zYtFwF6RagYeds3BppVLcymgEiWYgTiuJXc65ZWrW3R"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4kswnqUMVo7oPweWLsPyQijJrEG9hfTDTTQthVVWFLms"),
        quoteMint: new PublicKey(
          "3W3FoWrf4kFEQZgh3CCF5xfCsoCi85iCvntRS1syWqVA"
        ),
        baseVault: new PublicKey(
          "AtCxbBTnioQ7Hd1X16F2DbExWvoLp1kcUJHfSpkSUdoR"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "6PRYzevkQ4d6sKgqh599T9HxmhccopTHwKVuvVSGcaCk"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "H5ViG7HMwNYmhnRkNgwWjo7xUtvHmyfS1yXHDstAukUt"
        ),
        eventQueue: new PublicKey(
          "9UJS32FzLhjZUaa92aB3wycVGfcZ5rw9Wn5gU1K2bo97"
        ),
        bids: new PublicKey("E5zQ5GTSKydQPZ5UJ3uMQSqioPGZS14n7rV5VV79CL73"),
        asks: new PublicKey("3wjLEc71KbjSwa3xGJ5S57bJFFs6eDAJ2Pmt664Bj4cy"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2AgcYskqCUuiihNGwgikGJfX9SKYWB4pYwic9ghW1dJn"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5614dns6bBXe359mA2J67atfvHEY4tjZBULMRm6GaK29"),
        quoteMint: new PublicKey(
          "4oYdeiReTvd7CV7ScNKvt2PM26SVRJ8FxxDDEi9DYWvw"
        ),
        baseVault: new PublicKey(
          "9JwHNc55cSyeAi83ZM9Xhc99hixY5HoFtRk16ivY47Ma"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4y8XpbwR6EhNTNPUxad59kKLmek2f4krAvdiBKkyawDD"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2LwF6aLVG6yFt4oHeNw2zbSn6NVQBzFBwyzhw5kM4gz3"
        ),
        eventQueue: new PublicKey(
          "5K3Vz5t3tJLuE1eniZzBnAZahUEyGP9fsV4pGpcHJz2X"
        ),
        bids: new PublicKey("2s1PoZHmwTqs6zDWgdTXshTznKvBtdRHitEBz4Wn7vS7"),
        asks: new PublicKey("CmcucupojMVt8D7SKft4PWXXt28M342yTgGadTYrHhK9"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2MHG93oUWkynsszXkKioSshXAY8cqPaqArbXjERz6qQ7"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("EHx8Ys5SeMQ79vcagbTCF3rbrN8PhSKFvCZ4Y4vsyxn6"),
        quoteMint: new PublicKey(
          "8TbFyyW1SbBtgLnZpCGtSfnyyx8L4Z72ksr7jasXtXkj"
        ),
        baseVault: new PublicKey(
          "8WAdUU6srNH3Vms6v1wzyWEaDa6aJSEJRGXKRZzRHA39"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "35Vomg2APp68EQCHTHiDqWfBx4VxifHgeAewU6kidrCL"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "APn9eBfbzTHV7zE9fzBwEDV3BnBLLDjER1gBAJCGokYw"
        ),
        eventQueue: new PublicKey(
          "4VaszjJHNHGjYXS88vvaUzh4kd2wPPvJGH3MknCqGX8N"
        ),
        bids: new PublicKey("8C9uQDfHAfkz41adHGL1doewUtrXC5xrumgsup1CKhxm"),
        asks: new PublicKey("DxYcS8shLyxgCvZPE1bk4SSRGyEM5Nc1AuQVHNtDKsnF"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2TXgmXnopvBFVh5wiJyogm99ArkkF6nspK5uQYEw9PyC"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7bnKBMPKqbFU1G18tbh928CBwvxMP3HyPv8pzRSn94KS"),
        quoteMint: new PublicKey(
          "3iNuaMXmDkpV3yf55YQaaqPY3K5AWiv5k6ke26t9sktq"
        ),
        baseVault: new PublicKey(
          "87FHMjYRTVxzQ1LJhgJsbWtLyJ34vfYKtyMXkcmf3tPv"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HaUSfAS8nZT8qtCqo4tbpcisxvSZskZmbwUXjof3n5QV"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9ewh5gsUT2WTz6iHqJEcpCtiJsXe8cDAHvJG4EJMxcDz"
        ),
        eventQueue: new PublicKey(
          "8iWtkkVFa3LJAAfpnZrNtuCQDQ8hjN6cnv9Qx4SLiNwM"
        ),
        bids: new PublicKey("Cu5LrJAtPfkCjaKKtDtSoNDNiJkHqECZQg1pjqjoMMUN"),
        asks: new PublicKey("GD4knK1V52Xs7TywcTD9GUphif3hMSqbcwoTFHti1dyt"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2kuQ7dHwMkM4FR49Q4fsWqxFhe3rJfghDPgehBDyUCec"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("D6Ndz4g9Uf3hgs7MDDxzkVG9e5on789AMK18w8sKafCd"),
        quoteMint: new PublicKey(
          "9sYzSvC3EDCSfiZ4bnVaY7EWt2RWTRsYxn5bCJz7sH6F"
        ),
        baseVault: new PublicKey(
          "HreK6qfv4PKq9ifcoJ53PTQNKk8yAypg6FAEgyrQKvKe"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "C7ZdS3HYmEbsMpWNtG44NaSAWi19bstPjzkcgHrJKsvF"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3SQsqqt2Wv9tUjS2PyDNdYiDBatzfp8sq7wPAQZkvnYv"
        ),
        eventQueue: new PublicKey(
          "2Jw8wpszkNgMCoyZcNNFCHpkaM1DRozpUCaXT2TdQnd8"
        ),
        bids: new PublicKey("DuMt4TJJcs5ymFL8sAGBytbHzLefp6Ha3yTxHRLtENaa"),
        asks: new PublicKey("AJAEVYQhwJvaLGHbtCzKLo37jwinJ4brqrGG7yzhFgPd"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2tYANLgeNNneTREu5FigaJsaAazREcgn8jQE1jmXTw5i"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3wuGret7taCZ1z65QapBMsZSG7pe6gzpGpMQsrkHiuyS"),
        quoteMint: new PublicKey(
          "7Jt6n4vRNC3J2LoPBngdSJ8uJnZymATLN9LYJTrp45De"
        ),
        baseVault: new PublicKey(
          "CA2naB1kmAbuAk6Mw92N7M5KfRiSpf9VWBj5mmTYp7WL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FexQvFvpcYChMieUCRXC2ikdpARuWyUsH3SET73WysmE"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "s7zjeeN5F7skVab5DHdj8k4pvwPFPdJHSB13nENx1SA"
        ),
        eventQueue: new PublicKey(
          "GxDfNAzyLEgM4rvDqQGcsCL8vtn3zsK2uZe7VCPEUiY6"
        ),
        bids: new PublicKey("5mFqQQ8MxUGWQsTe4nU4zV8Aym7KUjfw7kxz8WSNLPbq"),
        asks: new PublicKey("fxURUgGkociVBN3AeNF2NS4Rr1Bsw9pYAcDGuVkmmoj"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2ytyG9X2mNuAuioQQ8cr2hmyn6ELZeYLZZYnavWG7xx6"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("G3B6HbPnsBFWLm5faAnfmDGFhgg5Stj8SRTbjmSiYcqZ"),
        quoteMint: new PublicKey(
          "5Dsxg5qud3jxTxY2w5RuYQavXgRSpt4kZABFE5N6oTyg"
        ),
        baseVault: new PublicKey(
          "C8cRDd5AKmxfsXDpRbi6t5cFHnnUgPofGmXiJhwEeL2p"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "nRYWwQr4fmYewJWLAZyvt4rpMAcu6pfeLhLUXBXVs3e"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AYX5SbAS8KXx6tCrSNkR5HsYzkQgceBuQAt5hzcvfdvQ"
        ),
        eventQueue: new PublicKey(
          "3MBJD5jsSea9EbMQbMYUswJNYJUCuhnTmEVniuyk1QsS"
        ),
        bids: new PublicKey("nhz7rwWCKqKncKGXxyQYAViZCuinAxAWjxnLD6sti2Q"),
        asks: new PublicKey("F4jNYZjXkUQJFKc7iiwFvqgx6Suu4yBEYmGfs8K58dQZ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3CQJyRjGLeYEphWYskeWx9z5D4xRzDQEgX3RdBesdkzE"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CaLsGrn4gQCFdC4aWBwiKkf4suSZN7DTAxet1QPZKtR2"),
        quoteMint: new PublicKey(
          "AVipnB4K1mWKmrNS8b7kBB8K7T8a2SddfwfBfkEVGcaf"
        ),
        baseVault: new PublicKey(
          "9S7HYDq2dDkLkstYKy3KgQDfQdph5DW8SwEMj4PphZmT"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "B2tQjQD1nihtp2KxPyMt3Dqqzq2uGxz1zGLDv8kqYVpH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DhUnQChnNkTJrzHiCUabxGX2MVLU7h6oGzTTWRv2yfCz"
        ),
        eventQueue: new PublicKey(
          "H4bkgNnvBBvTBYUzRa2t9DUhKeFDzRzduhwck5waGeeF"
        ),
        bids: new PublicKey("JAqCfhzwj6aDt9akN3r4w1VaBLh8qVqPp4Ev3wNQiDUF"),
        asks: new PublicKey("C3RGBap7wFVSacVJ4rYKkkNKh9MRa5SeMng4Ne58ntcg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3EbELQ8ywrz98WDKxxGFckqkbfX7gU5kYPMhSWuLmVF5"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FmG4FuqRafuuW4Tnm7eYZAnmvE8qfSUzFCfdDn126B4r"),
        quoteMint: new PublicKey(
          "3qaY39yD87nq2BUqYpWcDdkm9D21NZK8juPE5qG9ibxT"
        ),
        baseVault: new PublicKey(
          "6r4hiKKYBkZWVdAbwSffAsC5AwbXsD3ADzysw5KpobBj"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4HPQDhF5aBazKikEoQZDAqh4SYRxV7uYfDuC1NFsdqGL"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "74fhL3qHA17abKjH5N7oE15N9x2Up7HjCZ9Gszd419Wx"
        ),
        eventQueue: new PublicKey(
          "43W7sToUAVSqWRVuD3JZGFcnvo6fzxrS92SZf4xkGmC6"
        ),
        bids: new PublicKey("HgBGn3SzckxSeiUihwTLgp8chvma5TymAhpbh8UvKghM"),
        asks: new PublicKey("9du1B1ATpK3a6Ps2H1v2EG55xWKpRq3LEjS5L8GYMDBM"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3JJ5Gi5EGeCpPRUivpJqveqMXAwjF4Uf2xbTqDcUdGGz"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4Nmuy7s5uBx8ak95ktUbUR3FxtovsYudkYZy4LaTQtXB"),
        quoteMint: new PublicKey(
          "A9Hbs9hAM41p5HzGfdoP4e7tFqX5rRNuS69zhtfTFVu8"
        ),
        baseVault: new PublicKey(
          "F6C3KHj5sZromDC29pTTWTnB7Ag9GKxv4Dp34yTVSVcD"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9sHzbNei1T7TftayAWnihyBoqkBVGfWqVM5kZ8s1aZTS"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AeGLqcWLBWHmmMHMdCGaZgiZnTMSfQKPAB6rpXR7Gwap"
        ),
        eventQueue: new PublicKey(
          "Hfg63xGB7LbdBZNfeABKc3fGUog4YdS2y79BwW2vQVm"
        ),
        bids: new PublicKey("HLo9nK2cU6KkuCvfwdb5oVbKZJRRpbTVv1VKb6XszYAx"),
        asks: new PublicKey("2GBX6HSaeqyTnQCQKo6EeGFpam25bFF2voWoVdBUvWAA"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3QQH6dMR5QLG1WpqoVRwBtknWTNUNuSBFAsJeUSDkw4j"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CaNX8e5TzDnWF4t2rfZ9tTbmmG5s722mUcEQZEJ9KkM4"),
        quoteMint: new PublicKey(
          "DhW1ziiNUXdAgejFmK7Pw436Xix3BzVAWq37a916ERyN"
        ),
        baseVault: new PublicKey(
          "2wZjUWMyARWAkMENyTHwcY9DnfmKvmxdgtGU1R8brT6P"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2hpNPAsvsFLTZT1qXHTJjicY136xjrLsVVExHDuXmuks"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6abSyeJoY5qnGgiQBKxsB8H7NDnrpKaCWqJ1timgpsgt"
        ),
        eventQueue: new PublicKey(
          "3EhUbnJZtAgjyc9C8j5RhTRAkGt1BBVz1zqj2YsxQtaP"
        ),
        bids: new PublicKey("DTrJfjhjkkjhuF1PvLVAFBBt9ywcuBQ2qg32A3EknRf8"),
        asks: new PublicKey("5d8dq23BVA4N3o89KKqfLxjnGnhfwjy6Gay8ALSXg4gz"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3SjQaM5ZvvCMeeHBJesnUdZqm6v75dWrHKGW3wz1eGiG"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5JE3Tbeqvcb2oq7EUoYJ6NRFfpYDpZAUaaTbfnepiNb2"),
        quoteMint: new PublicKey(
          "9npCTPw2MaS22d3GoQKScSxGTYUQrEsjW6YT6KzDh4Rq"
        ),
        baseVault: new PublicKey(
          "CrFs7185x26c8oFJatvEk1uPkofKRX6vCijgf1zavEYJ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7GqeyZTFVxTqTwa1zaJPTXuK5N166zQhmc1g2gtmic5b"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "CDL9Q8nL5jQijqV3PbqVFSmdN4SAsbtGDpjYFgG7eycg"
        ),
        eventQueue: new PublicKey(
          "6HecuEM5MRYhmyLSZQc3hj8KdX8T98eVEA1Pc2ENr4cj"
        ),
        bids: new PublicKey("3anXHssg8z5Kmn53qu9XXJVQ9duAJ3pWwxXwsqVCsWE9"),
        asks: new PublicKey("GeZxXbuSFTw8229EYyCA9f1DGfAPFqqc6LtdsWCHu3y6"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3X1fbfmkxTboxYdgQBG8REGssE6wBuySiczbABPhqZcm"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8S4NRodH37YtkvNRwifkJydY7rd4YnFXR8BarpuoU1si"),
        quoteMint: new PublicKey(
          "69KFsKTYwfxQyoghqJLhjnBDhnUyAMJBeAB4zg1XkuVu"
        ),
        baseVault: new PublicKey(
          "6mxPbRzYCaW3aASJxSraYfSdg22Kc6ZoH3RBsKtGeqRp"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BCUcKYLWMMhUkh8kX4TGJdBDHcv251xF3yK5qK2RJAFs"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Gd6UnSL7HJaxZFGTLwwgAdFchdTFDWvkyVCtxBB36UXZ"
        ),
        eventQueue: new PublicKey(
          "6ayufsA43PbsXyA7KjGDhQ4MS3bi2dKAisqRkNSVGNqf"
        ),
        bids: new PublicKey("Gf2tVni1xEq4RguzpjdaWMe3mJddndx235HTMMLiGMw5"),
        asks: new PublicKey("92ATZWZPZSmvaNfUAvE3P35oYsNRYV5dRPfRckFsY5ri"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3buMQsgRrjsiLgGw6o5QAVbXW7ecZFX2TPBaBv9pTi76"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DEue28aoPnkEWJi3r2ErS3tWB7YxKyueLFBnpqd2QtMH"),
        quoteMint: new PublicKey(
          "5yR9L3AKCxuhjEyoFNa5c1exmxo5T1oKUTN8B5xrdy9b"
        ),
        baseVault: new PublicKey(
          "BeAHvfq9bET7CG1pGiz15qiyXvtqP11RH8T9afNYpEAu"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4kSoueWD5zWvfB7kiqp7P7rYHBosvErcxoNR1yKHJfmH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2XE9UogQr5AWsFezrACgmtB4rGwvp2JXz6LVwiaxtWWJ"
        ),
        eventQueue: new PublicKey(
          "5iyZ77EtSuENywUaXECnyX2gvBNwSD8oXgFxrh36v3Bh"
        ),
        bids: new PublicKey("5PjjLrxpL9A4msEq8wxCLafChTGDtGuB6guu7DdahMHx"),
        asks: new PublicKey("8JrvMgV17qAUKc92sx8F1dBr9uxPsuSFYVrTVAyFNcrX"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3cRRzJ73bAcR2NnRVubsYGXywgQYx16E5HZYgiWNQaFV"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Hz37fmiJ6V5B67B7n5iRZmpdoBTtKUQHnsKBMdsovmbN"),
        quoteMint: new PublicKey(
          "GteHMay7ZVYHTaCaAr3xPLfE11gVRV4tqWnsnAaURGNA"
        ),
        baseVault: new PublicKey(
          "HA73FDWBaf2PobbLpPd7YTraUaG7XKrrWgaK9SAccZit"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Ecxk7csKT9BMr8Yvgmy7t7dt6tnG8aEUxLhvQhfNQ4Ni"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "ESehgFrYjiJgwAqMhr6dmdBGvxqHPCDGnMhftUbrb1Ui"
        ),
        eventQueue: new PublicKey(
          "BojRgwxSWiqvXZawqQRyGe88rMg2xeYT9nXhJQB6FMre"
        ),
        bids: new PublicKey("H8iMdL35KUujEHmPYiizxeZqngmvqWroDz64ALDLY8zu"),
        asks: new PublicKey("5yQXmJM8BpT2qQH8F2FVrYdvz9iL6mSoomAFATGMpQUQ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3hVhNg4PdkbN1XQkBtFNnCh6iY6ShYqpEASAF9NDqpCg"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("AJeg4gAD69vMo5dgGYQVdCrPD5kqHpzwB8PMPtYTq5pQ"),
        quoteMint: new PublicKey(
          "2rRnmdE9cokihShqCBT4uao59nLJJWiKQDVG1rWkwTki"
        ),
        baseVault: new PublicKey(
          "HjaNzMSnyAKrLtt4mKUFKJvmNKUpbVsAgWiog6JrtsjF"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8RFjot1dPCHJL9FQgoyo1W7xbg1iCKsta1sRfzLYcuJD"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "HrNh5xUfThYS2zKcTpuQhBCdEXzSNYD3KkGvpnztM2QW"
        ),
        eventQueue: new PublicKey(
          "8CTTZvrkAjyVYKGc8djgqkcGZu67cHqJHPmJy1Zegd9B"
        ),
        bids: new PublicKey("51Fq3w3M8zUNGizD75CpJL4cjxVTHhtsUsB3wdxbf4QW"),
        asks: new PublicKey("4T7zqy87RCNbYXvv3pQ3NTB95Hegz4xngPw5JA9kcs2C"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3rZ3TkYgwTzGt3hHkJQJMcVyAVYiYUGmTsz6BaGxq2Rx"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DGE6HCb21FZ9iciKoUWWg1oM6rL3jvV3uvBVTAcLpPzw"),
        quoteMint: new PublicKey(
          "Hk5hVHVAMQsUCbiiDNt3YQCa3EVVPyDi5NN64UThqBdb"
        ),
        baseVault: new PublicKey(
          "7g5vkxbR8k4RcJsHziXWJ152ttVj3vCoYSrLwfTDMvv2"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "re2eqCV7nmcF2UUcFfXtUjUsYU6vxcnLmE9o86qpMhY"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "EY4GJ4JJqRJWqfjW9UXUDZe13HtbrN9vGSfYBVsreTrp"
        ),
        eventQueue: new PublicKey(
          "3u8BsvmtgmAzgxxf184FZhf3PXZ1S83ixHfRasdo62rD"
        ),
        bids: new PublicKey("VjGMULnn5snDDH5C4xzVU8otRdPWHUAhkHsWQciJqr1"),
        asks: new PublicKey("DTqs35oYbk6ZQgPBDphaDFUp2j82ZxZZhMWK4CqoF6gQ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3vQDKJSHrbu4cnqFYUmZ2ktxhcmgAQSSs4KYqVdY8DkS"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9YDK1a93uZSNsyTpXo8XbSmUQFC68hsqSShR9VQ9wrXf"),
        quoteMint: new PublicKey(
          "GoBRL91mJCWEWzZpL2Be2m1XLBEyun7ca7H9DpgNmTcg"
        ),
        baseVault: new PublicKey(
          "27GPuv6jdWecFN7EPtcRFxic1fqybpPfkUiD6oUhQ9dS"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "86ioB1JTQ1v7ikrfCXReCLNCFvijR87nvZ3LyNa8vzgw"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9PbF6yYei3Mx1arGAdLtY6HRCa4FfJNvjgrDiH71xxAE"
        ),
        eventQueue: new PublicKey(
          "9BShD8SLrdnM7D7KFAcHwx9rhBfDEhnU1p5XfC2YBhQv"
        ),
        bids: new PublicKey("3fvBq73hk8KK8PbPafEu7H7aCRLmybdEVV1bwMAoQPfk"),
        asks: new PublicKey("Hq8c5ojK68Luef42fn8cvn6X2R3zjpXPxraqsg2CY2Py"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4JQyH1FgkUEEorCr3kg3jXeLLBpGCfvJiczMPnuMCkjB"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("JDhiaE5Y21xesr7pm2eK9JqMAeAjKxAKPdoXytXRCaxp"),
        quoteMint: new PublicKey(
          "5FCS2bSgjtrm7i3yvea2rUqUgq13JQNKGoL6bKUQZ9Eq"
        ),
        baseVault: new PublicKey(
          "8yT4Ni7MgeHqjNF7BdoFppPMBpAVT72dtep6iGj8UC51"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FY1b4pwzAxNkQu58reTTb4mNCmTK7UVT6sndtbpSTWgc"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "G9p94SwRHNZKaGy2CibUcBuDDCRhAn38c79kLFo97Mj5"
        ),
        eventQueue: new PublicKey(
          "9LPkCx3L7WBvvxXRyXk8v3hTZH9xdoeSEXXtT5rnMfK2"
        ),
        bids: new PublicKey("FenMK3EoimfQo5Z56QXBGernD7px22PNvz9G2Fs75n5c"),
        asks: new PublicKey("Et5VbqEoJicpgFpvYhRRv84zKefpfBXTp2M4kiSfMBTd"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4U7eUZeFKc3d32wATydt4xDFsgNbj3aT2NixkXUNcpfZ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HB2KDFavAeKvw7csepyxKdBULbzvgcGRV3FHDBL5CG1t"),
        quoteMint: new PublicKey(
          "FkpGad7xzeQp6DtKF1rczLgT9M7TsAh75bMzg6ZvRBGH"
        ),
        baseVault: new PublicKey(
          "AT4mh8FzHgSCjbqsAxxiFUFQdrU8grc6oAeg9bxUsWpv"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DftqZsKdTKm1Q4bNE6AUXkJWfEDRiefjrCgpLiL8N9gW"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "C7yjRvEuFAWfQLaPeTAWGGSAjKMshCPjXDi9NTKS9ajE"
        ),
        eventQueue: new PublicKey(
          "GcDWB7xqSq8EyPV6J8BCPD9gPRrdRZvsrST5KX2yGHZU"
        ),
        bids: new PublicKey("8HosLo9xfrM3qJBfoKPKuXfLaWRX95f6hECLzstYPcan"),
        asks: new PublicKey("ESUtgwteB7A68NgqQXGKosWqoSY4speyNoiukPmg1eCG"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4tdfLnCPUkLJpEtKHz7WxiV9bAzMKbhvG84VARBHpyh6"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7Ttjt6cErPzM7tDZaj8EBuffWdUBFtbzWeJcj2BVboZM"),
        quoteMint: new PublicKey(
          "9H1wPwJAfYCXaxynYjLabbwKWB2zXcM7pWoRP1WhNhic"
        ),
        baseVault: new PublicKey(
          "3f2FkB2cySXQNwVx9dWsVfoWAi6YPCTKhyPRUKJzniCJ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "WS6J7pC28D2ThKF3aHwCyj67V85Lu2cNAttujEJqJiH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DpR4pDvQfcixBbr6uC8jnMPdvy5yonb693Gx6orWAs3G"
        ),
        eventQueue: new PublicKey(
          "9AjZEzgp8rJ4D4HCqhp7iESBU2SWwxd5rSvhbAJjvt1A"
        ),
        bids: new PublicKey("BqUV4hPjke3FB5PrxGPU76SQa2qcrSFwxMVmqCTLRcC6"),
        asks: new PublicKey("Hur4yUSeubcsjN945283Zsgy8w2qU3BXZBDqQzj4dVas"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "51gxDhauXGc99nRCfhQmptvxkYQQZfQ8yCKNRCdomMYu"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8YtHmgXacWE5tZrigMVphyyU4TeUU86wdDVSr1419AVX"),
        quoteMint: new PublicKey(
          "EUPV8FCe87V5czsg7SkDLNNaXZZfgvU2M2MWHEVVAJAL"
        ),
        baseVault: new PublicKey(
          "Dgr3MwVqbUru8oiZdN3np5MxgzTWT5bjQxS6tHfHnokW"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "5rn12rMXcfqGJg9Sv57XbXUo4Z3HiduS9DR4cYcRDAy8"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2wekZvx5YnoYgunu9Q58oVxibSW2TcYHRJ9d9L1sZnsK"
        ),
        eventQueue: new PublicKey(
          "6DZ6rF1CjSdhZaFhqCHYmjMVQzptaTNAtSG2VVHaxtVn"
        ),
        bids: new PublicKey("mKx2i3oygpSYUv7vrmpMvP6WgdfD8DgsauXVzZ8AFx7"),
        asks: new PublicKey("4B8FRcDQU6yVd9xtt9QUhGUMZbRypwxdPKN89ixnjGJr"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5EdafSq3oJZ1rxejW9QpL9ebBKtngZffF2miQpd9ZakF"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6noVjqy812ZvKLLyfp4WytYapg6JZCMQDpv7SYjXPYLb"),
        quoteMint: new PublicKey(
          "Haui5K2SsFSuhTka37JHG7kn8jR3XFnXLbDJmvuDfpaX"
        ),
        baseVault: new PublicKey(
          "9zafcGwfw5iJTjShaFh5NF2N8KMshfreRnyf3ZE2fyxZ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9BLbtcn4fmqtNVBnkkBaKcqxgzr3JKMrZjtF9N1BWqG6"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6wFH768UX4iHiwDKhDHYmaHdqqyYaLMA2YY5tQH7TEaw"
        ),
        eventQueue: new PublicKey(
          "56pa1gDCRNinRHdK7X2EGKntHEHgUbJGh8r1vbZE8bpn"
        ),
        bids: new PublicKey("5TsaPTDq7QncnaLfmnt73Zy5urjVZM6hZv25cWB4BdcZ"),
        asks: new PublicKey("7hizoY2NW6hDaXpiwv3fVbi8hzLYV7x7GgYnhpms79YL"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5GunapzjVZke1YBx7f3r4jtEvDEMNmaWiGBFKh8uFJSE"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("74WGTGMa2F6bjcXzJhxuspHNQ844veQRa8zxCMso6wYW"),
        quoteMint: new PublicKey(
          "4gJFbAFFCY5a2bR2QkYb5qAZ4ZjpvkJRvcsYUAMX4zXd"
        ),
        baseVault: new PublicKey(
          "DmXUmWWzKKshdHAZnfRvUr7UiZTrFaFQGmyFAmwPSPC3"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8orETBCB9mWC9YBC92KV1wwwCq8tG8unQ6j8YT5peLFw"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GW5YLXGdQPCChw8BdvD4uSN14L2FJfnMzN5RYmfquDtD"
        ),
        eventQueue: new PublicKey(
          "99edfJXjAt9mb5pe7qd9q6XBizWbLyYE1f6TQhRQypsd"
        ),
        bids: new PublicKey("DZjB2Sp1oj6cdjZRwRCu1aCsCKhDXDZwHNDoKHDDcgeF"),
        asks: new PublicKey("5r8y35eZFEifN2kJyTJvurE9KVbkDXPn8BpEQe3iAyfB"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5Hc4TRi6WFAFugdViw8e5AJZadqi4gZMxUqC7YRQ3KrS"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DkisKtdp4wCTRoygjbko8gw6dEZkH9MrJser5jkG3czZ"),
        quoteMint: new PublicKey(
          "6AcgeauW6gyFk3cguiDqsqV677zEUWk1urCShYyrhdtD"
        ),
        baseVault: new PublicKey(
          "78APs3dGX8tVY3FNkWRPS7BDgvSnfXM5bxtP3f41wJSs"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4sjasHyd1cicij5DenmCTcmsSmfJvRQk5SJekmsQ4Ea2"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "G6y7nrFcsGbsgqShq5dJSKBpNPJU8ZgNdKE2SbfEf7cD"
        ),
        eventQueue: new PublicKey(
          "3BXfmV98f4axSjhvwDJ84ZNVwEwmKSdf1H2rBcwU36cb"
        ),
        bids: new PublicKey("6QKUmBC3SZJo3WnFfeEiF5FhCL6yUugQLPxNqBVdF6LR"),
        asks: new PublicKey("DG6hegPLRt9tE7Afk9UiAAn92XXVGH9R82P3q2Qm3UYj"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5PJWoKRkLbCJJaVdzG1BBcNgr1gM7B5GdfQMMqGfsq19"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8LsrHtKb5xW5YZ8zYW4ijXPzqXTTAAZQmpLCWTbwuGST"),
        quoteMint: new PublicKey(
          "4rBpGNryDdZ5t5xKtCwBAVQA2nZeasACFeEphFM2Kn6z"
        ),
        baseVault: new PublicKey(
          "6imDqJpK4ML3aKfvxxoksA3Yh8fwgrGDedZPH184yHgy"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CjhDqXWASNHysaps4V2xri6ECuff2kREQzhqtGNfwUCn"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AVViHXt2CtHvo9oVTkZBsnomLwhxzSwzTTEhs1hSixkv"
        ),
        eventQueue: new PublicKey(
          "56ei38JaRDyEddWR9FtPcmGBFfgwXyiSoeKV4mdKzEQw"
        ),
        bids: new PublicKey("WsWFRQxMMVRWh51ysXnmJUzDEX86SASeWk9xsowB5qi"),
        asks: new PublicKey("7zUHHfNNR1vNLim6UvTezkud6LYZ98r8kKyBxVPgUuQE"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5X5kxVKxaV2cfuQw6ziWrvnVzJcmttnsnT764FJ2RTM4"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9j9rdnJ6A5H9ofPoyCpvcjG6gvvHEa5kHXEWhEF75Q5h"),
        quoteMint: new PublicKey(
          "HxTXJi77wHC2xegFxTu15Yt9EDQFNLf5xF8UrKrNUM8F"
        ),
        baseVault: new PublicKey(
          "HXYazHdRjPr6Pbjgym67m51dPJLrdPB6XVDMz4QWhfD2"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7nEZtDxw8Bmy1giiU55u5w1WFiNHazRBrznBR1CEhr7j"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9PoaoSdgEhyz68KA7BmnATSfhHLH9C2b1AL4sWSnnRte"
        ),
        eventQueue: new PublicKey(
          "BB8Ge5RjeZDggEVx7kfKQjZRXEFRGqHYEaEmcqoEcWX5"
        ),
        bids: new PublicKey("CaGj5BceJFtDWGX4UrxWg2oDauSPWdf5yW34MYmVfVd9"),
        asks: new PublicKey("5689MHCaDDGYsRhR7XjAYmTq7qFER52MRXsMSAc87Lz2"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5waRWkYzh4rno7CXPCDM7LqCcFX6XBYJmTtTr8ZrkKG7"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4Y1TsWbrRwhoEieRzqQhek7Q18SXCM5iEVmx5hayvJ4G"),
        quoteMint: new PublicKey(
          "CbtRU5tt4fZubAtaCbbz66WJPzv9YZMFJYQhopPcmKcy"
        ),
        baseVault: new PublicKey(
          "FQfpbE8GvK3J6WA4EAJqMhCkA9397uybbKK9qtqo3zAv"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9zcdqMt1HRDi4dLYPKwn3LEvu4kufcefFJLdFTspH9JW"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AFtfH7qApBUq3iUkWiFizjcDNBPkQ1LFhh6zKTGA4gLo"
        ),
        eventQueue: new PublicKey(
          "GwKaSYWLFcD7L6dirtFZvHaW2Qem8tVCaoVajc4Df1H8"
        ),
        bids: new PublicKey("JDztTNBMzSgHmkqc6nsS7Nt4rGGmjquZnmtHPmtGRa3t"),
        asks: new PublicKey("A6X4qZsxkywtnrXXdvpov449dFToG5LPRz9R8harVi84"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "67Czk27MKuEi78RzZrLkriA8Ktmea2TNM4f97L4NQLkv"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("53oyfHXyGMkx5pYgQX81C3F3QvoDyusrajmURKXkkqy6"),
        quoteMint: new PublicKey(
          "Eeod3uXwdPUW9epwRzxZVRiJmnS6RVJchcg4LEbt1zFi"
        ),
        baseVault: new PublicKey(
          "8G2LMa1GzMMyD7v4pwBDocx8S5wiTBjUuDWtx8iWN4xZ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "5ghRb7q5SAPPeAo5hn83s4hKvPTx2uETL9r1LyZY1uiH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "95ZvmwmzCKvR1xWnkVyuyQU86NMTYSzq5yjpae9LpG2i"
        ),
        eventQueue: new PublicKey(
          "9mQD97rGZHnqAvpTwnWXN3We8tuuaHPhaM3Jy3LLYswN"
        ),
        bids: new PublicKey("6Dn3pEEGP21Yz7es6Nx88vdzG6AgTDDwEkk1d1em2pqf"),
        asks: new PublicKey("F2GnvK54vdUyR9PoVLr5yLxy5s4eJpL6joayAC2ENSsJ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "68yU8dHffK1VTVt16paEemCsDZLjHBSfjGDu4q8mBcir"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3Lq2fZDzine4zLztwK9Zkr9ZL9W6F6ktdg7iHQwmQAcg"),
        quoteMint: new PublicKey(
          "9SgncrSUH7VpYJHdk7Kktrr6FFsRjqctnXpJqWC5WwRq"
        ),
        baseVault: new PublicKey(
          "81KpxwQM4yfuajKZGrhbNELrbg5W5cu1SYcfqhuSUPnL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "C4m9SVDUiNHsXcet4CCxdrT1eKBR4PT1a2XYnUvXuepB"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7zX91rr7RgTuagpp2iVfP4aADmNcV41RmztBJmKc8ZY4"
        ),
        eventQueue: new PublicKey(
          "A3W29WREuhe5WzEpVYnDqezw1YQ2JoshnSnZ1AAkz37S"
        ),
        bids: new PublicKey("AW3d6rbx5gAfNjCgzfrRNH4dvMgcQYoyrSiSimM21LMD"),
        asks: new PublicKey("BF2uELvqbEtPESB8icyqTXkffWtAeTjtNyQVBg2pWVyY"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6JdJP2jewFXzvmnTxfT7CB5FYgN9J9ioUyPibrUhu6HM"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("b273ioKtGsXhKa51UYj1gSSghSHtxnH8ct2Uo3R2oGx"),
        quoteMint: new PublicKey(
          "J4cbvDfk237mFdZsxWTxEjTbtP9fuT8g9vXuF5bLYQSy"
        ),
        baseVault: new PublicKey(
          "GZsbM71BZqoxcANtp12n3Ey1kaSo6WAbnAanDD1TnLJU"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4GxPoB19ZXBkfAEizuP4q1dz7a7rX6VbRJMPVWg7ACVN"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2Wvt4egGxfXBkiyYDxcayo3gVs4BkmNuGkrGW4wStdtM"
        ),
        eventQueue: new PublicKey(
          "34xwMcczh4fiBSvS41NjF4vG4WRf2HMzqZfT7SKZXzu3"
        ),
        bids: new PublicKey("6ADmoyuEiraRFaoc9vS6TfL67uDsemnAgVWVpcLDuV3g"),
        asks: new PublicKey("GDW8KtFyMWp4dib9BSXgsznhsjiDEfZqywjmjFcd3hWg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6QHHnnYJT3w7ikpGU8e1TXoYWWn37f7xkKyoMUaKpTv9"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("uqYjCYhJCj9YDEjL5GmktXM6kBERki9UnjVQJbuNjCa"),
        quoteMint: new PublicKey(
          "D3E3nFwgYtv98pempA1H3ASKC6357rGaaeMSQhUiZBJj"
        ),
        baseVault: new PublicKey(
          "DA3og9RmXoBQzNThyEj9yuTvJ6HCnsuBscanUqApUjaK"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "31cLNU5gVRaEd2rQL6ur47rdSLPEKmv6utV3e3PsuVqU"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2hWK9s7eBCqX9zo2ANRJgac9dU8QKTqg1ct3cmYkxDJK"
        ),
        eventQueue: new PublicKey(
          "EmqdovEtLDPj3YLFCenbXDV7cFwbjTj6sFeZo84KMUUU"
        ),
        bids: new PublicKey("JAWNgvf9iGTw4jVj93mCoMt264QLJTpgS9fCcSd9LC5d"),
        asks: new PublicKey("5osVSpfTwX5vtidkRYVurT1Lexx7EUKAAV8Y49Vb3qSr"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6TN7DLsAFthTWjpLXiiJ9xHRg87pwS1Yye4Hnja1HHnj"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9Ve4mykEkFtoD2GNsDcpjyq6VYmeHYWhmLtxC6PwdCB3"),
        quoteMint: new PublicKey(
          "EcZtam9p3zeg82FRDuTZxtQwZzAvNcsXLKrrwZ3Y19pB"
        ),
        baseVault: new PublicKey(
          "FXNaPFcGdjEV7ddWHEqk1GrYbftySVWEebrrvDnQSg62"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8SRQnWVSCiUcKwyMGN4BY4Ncqia1S1h4iGXav3oMCDss"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3GJ14dYBoX13RQzqApKMiCbnwAijXjnLZZhhP31pyE82"
        ),
        eventQueue: new PublicKey(
          "AXM884ySPkDXYJTsnRZ4FCAiZGNEdxBLCBMsXHxtBdwE"
        ),
        bids: new PublicKey("5MyBLXbAwSrmMe1c2kN8hL3HxeQwhdHPFwgxBsLDnvPg"),
        asks: new PublicKey("2vxdyFFjMkdqQi2XCjuLJ6SGVyiUvMTzdp89iMXEe5zG"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6a5dJ2AYCCSCamJf1jQ4wNAdsmGxmUYgDznW4gwbfLXd"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HsQKJRVs4buFvRf3QYT7C4Ctqddmi6kw3V3pHZZ1ayYV"),
        quoteMint: new PublicKey(
          "D55ryh2XDcHBKmKMBsCPaoKNTbf5jCRoaRJHbEa4v8S9"
        ),
        baseVault: new PublicKey(
          "2qnrsas3QtWojpiNazJpAMvokQNomoKoq2PWrbxY7KnU"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "6V6hUp5ZA8b2ykrDRwAhnmwWwKkZBorkhGhnxTMdc5Ws"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "JCf5paLyLf4ZA2zF5PUvanrvL1eXYwRycEXt5MPcLb8N"
        ),
        eventQueue: new PublicKey(
          "434hydgN4SjcYss3k1hikemAGudgY1Pxh2UYAcV3GEs9"
        ),
        bids: new PublicKey("Ykx5Wp62mbExj6Nx3zqDSWbArm8tnzz4ZHdpoosn9Qq"),
        asks: new PublicKey("EQZfypJHh1dGCMJnJMjSFgfkB7AYSJ5TUdpzBY1zJuKF"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6buQLvBGYmZVThLemDhrHFpe81yeJQz4QASbrkmS4SY8"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6aMsGxo9d784hGnXLxJxuJG8VkicHHLjLiiJTXfW4wET"),
        quoteMint: new PublicKey(
          "AE5b2CQb2EJjUk7yPtXALnauviwJsSnCF3sAyYTacwZP"
        ),
        baseVault: new PublicKey(
          "78qZWD79UwpfsxVqWLdFFHaKhnVndFPFZvAAJuxpN2cz"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DJtyVcQsAum7RDLAAnG3QR2GSEB12hBKi3tHUt3HvyaH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GVATrdL7ML7nxpLY3ynzamTj7dZw7GATLTqXded4cQjV"
        ),
        eventQueue: new PublicKey(
          "76ymbc11mTufKjsGmdcWBQXRKWiyoh9Eur1uRe2DEE1h"
        ),
        bids: new PublicKey("43rkWeXAa4VYUCKLx3FzmzZNJB2VbZLjYgi27XyUkDtY"),
        asks: new PublicKey("867JiMXUeTKNNr67uSKkMeeCsM4XtDnNN4ShLp48R4Pq"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6jkohTqNKNvJHsideEUxGrYvRdGGM3P8X6BFAqApLhCC"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("EcjtyrVkdK8cuDSr6gmSkGvDX2YpUmhHA2VByemxvYAx"),
        quoteMint: new PublicKey(
          "2sxfdsBAZ9CpwozNUyyzdBGDaSdi6tjXs9vub1yhujA6"
        ),
        baseVault: new PublicKey(
          "6pod7Vxb82Q9v7c6eUXLWsEqPwAw2T6NAp3feAq2y593"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2wmJRqTYb8cV12BKvvT6XVh8AWeytSRXMQ5FWhRUqLP7"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Ct1aejo1EXnnSHWnmzPDm11ZmsAyKZuikkx8m7tFkoDX"
        ),
        eventQueue: new PublicKey(
          "EBvHmYF2hbS6h4LGMeTCT9JPT9LxUFoPmKgwLgoJsqdm"
        ),
        bids: new PublicKey("9rjtoD6j8YDp4iyTpH39pJhHwCLu8oALj9gXmvyqebHK"),
        asks: new PublicKey("4ak5LQHj2MhZLDHWzoRchqcQpawrUqaxGtDBavFn7R9a"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6t3AUiDdzzJWCUFk1uUgEyHBZ8TZScZHDX18mREs2vse"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8PZRgsKxCv6EvTNVz3vA9DSUHEAyWecxtrfB5cfFUFVv"),
        quoteMint: new PublicKey(
          "H1aicDhc1cHvL2eEohBtYZWRvkrxRzwfZfhEE4H9Fy3m"
        ),
        baseVault: new PublicKey(
          "8Mpfe3TTvWR1dSvQHXwnLRnakQYs9jyxk4DU3Ek8EBPX"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CBeuL2D1H55zZ4NSxiNgau5NMyo7SenjpjD93PLa22Cx"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "G1cRBNHTRH4gaYVirZMk4EtfRQU3t4iirhGNyXMBZpVb"
        ),
        eventQueue: new PublicKey(
          "H6a8Rt1ACXpP14FrBRJNmg8k9aTDmjfxb3e1edCYuSE1"
        ),
        bids: new PublicKey("J6gGFm11pSbnMNpUEgDnwAUit1uL8LN6MmhS8u4BDpM9"),
        asks: new PublicKey("QMissYZb3HWXU1tS3vqQQQH6LM7WBUUiHrX36FoFYdy"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "JCk2bU5xNDUBk55W5BoEgNeKqssXdj15vLqhuzQEEiCU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("B3iV7Y5S9Xqu6cTECpBCAHtL2nwvZntD2d7F1zbpbQc3"),
        quoteMint: new PublicKey(
          "FXgqEhVGX82dsyKMAgR2JCRaC9FNH4ih611bJftmD3tG"
        ),
        baseVault: new PublicKey(
          "7QDHQhNjMzuKKk9T5vsdZ5hTfLu2P1pUGk2TKJKFd8hn"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DYXqC6UGPwsz5W3jaFAJtpbBsvJpBSi34W6cMn7ZiL6m"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "HYv5Vb7G3849dYN8RG2pQx7awXiEk3nE9F3AGWnedffs"
        ),
        eventQueue: new PublicKey(
          "5RDbC6wYGhc1AjCCArwggtbAyPUse6yMcq3fgSzZqY5E"
        ),
        bids: new PublicKey("2CCypxRdB6tCackur4De72ZSnsNcicfSjWYZwAcVzEZ9"),
        asks: new PublicKey("J5e19jEz625k7K5K3yinpMoHNzznv8smCemvKAYCWLMH"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        pruneAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        consumeEventsAuthority: new PublicKey(
          "7m134nU79ezr3b7jYSehnhto94AvSP4yexa3Wdhxff99"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
    ],
  },
  mainnet: {
    SOL: [
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "9mJqpFgEu1fp5FFpp2DsVn6qwtx3VNca5vkkzE6RQV5"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GaPtix5Aaxz6MMx6J64vurbYG1cgCPmMtPuypmB5kK5r"),
        quoteMint: new PublicKey(
          "DYbt86cMdKSpBicdboSGE9kLQaLQBZUPVr4wDy94tAnV"
        ),
        baseVault: new PublicKey(
          "BVudSyHziKoDBFFiuLwY688GG53nD84r5Nctqj6FaAfv"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9SbvSd4UdgTwWMdYsRR4PtuMxgyKELTLegiqm5UNZ9Z6"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "J6XzcqjDX8J58Q479XgYHzGnf5rboj2ByT1aHZNKajRS"
        ),
        eventQueue: new PublicKey(
          "D6HUdh6AZ9HgokB5g2yxadRBxwVSjUknTB9kPqkhZcS3"
        ),
        bids: new PublicKey("2YUvkrWEHmoEfKTPMSLDFGcC6Wnt7V6B4aB5PZfzUTBS"),
        asks: new PublicKey("HTTqMgwRPLjWcUyChy8Vvu3PU4czeowmtXpmjaZ4YgLP"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "CrGjq8nExZGVpKgo1tfCB9zzteYMnTeXkzRi4teYBmG"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DASCTVuUwRum1khQ7QgKhS6YZVtw2NgMeocjUkjsi782"),
        quoteMint: new PublicKey(
          "BTqKgboudUZH4tkvdRvvhxA2dBnXAEbq92tC98Uio5ww"
        ),
        baseVault: new PublicKey(
          "FdoDgu2x6cohcHUi3AUjYDCyg3t8cTyuU56Gbom6ymua"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "H7YTa17HSgK1T5FiPVCzZ4vVAuJ2vgscm9WiFGMQif9g"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "F8uRRdwgj6e3Z5LbVWgx7yoa3sZ7KsewSSfuAdS45HeP"
        ),
        eventQueue: new PublicKey(
          "DTHh2nnxtJXwarAM5GEmjAHgJgTtmg2WNsfbtaTTyNqa"
        ),
        bids: new PublicKey("AQrffFYCo1W59xhPCEGhw9HgdqqsCxEomFbyZ5zAxv7F"),
        asks: new PublicKey("E4xEZMyxPxb1eWWK9pTWfL6STdGprtbFHFdJ8EN8YT3"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "EqU3uPGMGpuTZsWEQUuTbtn7iEXuKQB3XUhnsw3kgDw"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8LEhLkPRd29rZLye1V5Xpu54LMshenVceSQQveei2JEH"),
        quoteMint: new PublicKey(
          "EQEbp67uAMPPKoeWittuSkL6sXbNaMBaBUzcKQ9CXgUy"
        ),
        baseVault: new PublicKey(
          "DnEw3i38LLzA1CWtcm4uvLuNdyFZEcGqBcgYK6qnnLGV"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2NJua8LoMzVGNATATCPWJSmYSPDT4KJ9fjXTyUykvGsa"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3nTTyPBiJfajKRatNTPheWeoyVSWacPUoGiBaTJSbFNB"
        ),
        eventQueue: new PublicKey(
          "B33j9m26J4RPdRp63wDV3n7F7Geo91oVEABfuSi6ZMSL"
        ),
        bids: new PublicKey("4NXFdcJHJLQvfEShmicxoEuDUhh1QncMa6xKCERv8LdQ"),
        asks: new PublicKey("EoHEhgvDJMu1Ua2e4EJvqX3h2588VFi5Zuayt9Tefzm9"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "UbMouKzbvRabaoMmzqGffjdzB9xn7ifmYM7KdHU4i1G"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7U5QVNysULZvGdMyS2mC6qX3PK9bPax1vJ4SVmeKmED4"),
        quoteMint: new PublicKey(
          "Dt5m1aB7FU35NpsZG9wfF21uUhv27Vz5QZBBgbMmJ45m"
        ),
        baseVault: new PublicKey(
          "2pKJqxxr1h7RsjGM49dGaGMADm7L5GzQEfzvkp9V7i9b"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9M55QWs5oQvXwzhZvWGusWi8v77jmzrh8M5ZVfwFLJhq"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "HtsBTLX2mzPWHh8PbZx7oxF381ZPn2fW6B5UMysQRFn2"
        ),
        eventQueue: new PublicKey(
          "5MbwEM7pN7iiwN7RCooWEUhnxdopP1LJFBwhobSbY8Fs"
        ),
        bids: new PublicKey("7trCk2vqYRXQQFBuhQGpHpfosHGnmxFbBabrnSyPrmuP"),
        asks: new PublicKey("Cna3t9s9GeztVquVbUGQUceN1FLgTZT8qSXKFwYKgCLu"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "XQpBTmtvcsGmR81Shgc3mEEVyxt29XkYroeUzSe6d1p"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Gs9jAigWQrju6vNSmeNM7TTH96PcVqBAnYtsvdbzrdTk"),
        quoteMint: new PublicKey(
          "6HByFaLWxjkJmuBsEt5RhCRiA44koMox5RtmXQAL3GR2"
        ),
        baseVault: new PublicKey(
          "AcDsj5bVKcHfJvKzgBDb9LdtgFtSMTzJEtuBYtjmdLjQ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8ojrETPdFiAN584S7CGR3XMAjTvWcDXKJc5dpLBK56B9"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4bbGrcb7pUm52nm334iNt4pdug9W9raAp8vT6VBFk6qy"
        ),
        eventQueue: new PublicKey(
          "9BHznHawLBAB1g6PRskucJrQRpcrvhd1AfjtSbFTmd2q"
        ),
        bids: new PublicKey("6XW3es62bQgVPpfR9RtD9nkWyy8eVfqRy5g9mr3BeSJ"),
        asks: new PublicKey("4uRhEAaKVeU7GYwpenvHtU15JqhtBy9EzR3MUgMkfTr6"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "oTVAoRCiHnfEds5MTPerZk6VunEp24bCae8oSVrQmSU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HYrzmw69PstuZFoaHrSHxzQYPq5Vxv3pU8YYJwNWUdc4"),
        quoteMint: new PublicKey("DjFBxd5uTgUCiPcUH9Zpzc6KW1agBnUxTMUk3bZTCuA"),
        baseVault: new PublicKey(
          "AhVpA7GF7csVUrtY4Gkbdg2DyjGKJr6xFhR8seqchj6C"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4HqRU2g13WhkPBKxLLtgtzwtRDhtuY8dJbwUx4HwyeQ7"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "5ghuaH52QzgEQ6H94sUqxAPXBbaYNzFk7goWChenrmmB"
        ),
        eventQueue: new PublicKey(
          "8HsPCyjCXxh1iP5p9uq6VTEKJXbz78vkhXV7r6o9o3L4"
        ),
        bids: new PublicKey("2hjDVEV52XZtFfzc5LQBM3bZdnhyezxj8qTu3mpWxLyG"),
        asks: new PublicKey("FE9oPkR5h2grAsrS66HhzrHckLkSMok9JpFvzPiAJ9Rb"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "sjUTHwPqmBTtuDNjHcmruyzibVdiXHgPXmr5hX6hQUg"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5FeTSiV5hua4PC8QvaLGQiwPWhRHHc8Cxf95hbEtRbJW"),
        quoteMint: new PublicKey(
          "JACHGzn3TPfKcG9NWvt5J21N3xguvB9r7SMvGVT88EUe"
        ),
        baseVault: new PublicKey(
          "HpEDeeUbay2Ebb8XiixAZw3gd2ppc46ysZeLkszRzDmS"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BsEm486mvpTrq8V7UeKoiSd4qbn9MmRUwR7KeTFksg2h"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "EvsZKLJr8Nojy1JeQf5tR3cZU2d2xW7ZUxdEN4uub9eA"
        ),
        eventQueue: new PublicKey(
          "AemsKj2Rz1Ur441L1s9huLpoX7sifog9ggmvia7RvCmM"
        ),
        bids: new PublicKey("B9gXoQg9aRuqCWTSuShsUjRxUFfaujpB4CFDSYgK6Q9K"),
        asks: new PublicKey("35UF4FWFkA7TUmgBYj8QBuvocz7cSt3QH3J3WY33stwa"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "srMVZsyvKwp8zZ9LLCN4oM3qoJNrLxutp53gpjKb3uD"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("H8Ra8niX1GKmcXrRod5JwrQSps841pccZJCvGFQNkL6r"),
        quoteMint: new PublicKey(
          "5XGwsDhvpkTxoaVcChnLK5yZwzCSh97Jz8UGiRFYxLvz"
        ),
        baseVault: new PublicKey(
          "5MwUn9GAWyqY5rJXNTVdZxr9s2LonbWYnnQZymxRmHiV"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DVmzxG7X3RKrRM4Y9GHETUSs7gPXuXk43CEE2sBqw3Yn"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "sbSuTymRhH4mfN598WTdnwd3BuR5L4XGGhsMt52kkae"
        ),
        eventQueue: new PublicKey(
          "DAuzub9trLLkmMFUwvaLUpnfT2hJ1p38cwT5sH4Mh8zo"
        ),
        bids: new PublicKey("HMXiJAf14VDNzVYz6RhovTMBJ9DDVdZFffcNEfYUcF4v"),
        asks: new PublicKey("2271pgckBJw9hSNfeY7zJ4u6fbkFg9o3iPJ39NB7qpzd"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "th2TJSNnHnMnxEa3xpwGs5koFVLXUhLDztMyM5RM2xq"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Hu2UBUtnJ8gXeHofhBEBCJdGvKTFxhDe3JMhkVEM3ouz"),
        quoteMint: new PublicKey(
          "3rXAJUzgWPiBQ7ocWQ8uhksnQYAN4vfcD8SCXJ2xc744"
        ),
        baseVault: new PublicKey(
          "Fa82EKX7Bos6ubMWvTiWKtWpNvwVBLegAS1KEU6ZMA1R"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3VThARo7HR5RDH8n9mtVVbyqJGWfdBgpZMZ9Rai6AChi"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4dot8TBWf27bhzmBd2FBfiVgCXeQ8TC967iFRyKGnxtV"
        ),
        eventQueue: new PublicKey(
          "BCsrfWJLwTBEZpvGJSK3QrrmbCnwCtpEaeJYJ2XFZpzB"
        ),
        bids: new PublicKey("8KeLBSwHJ9SaLdTCN8TaV4XQt96WoSvFfHp6uG7BP9mC"),
        asks: new PublicKey("9LQfHRjFbeqcZdxrEeUBPrAZVPRPjzLrf4QxpLTzYDey"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "21iZtRQWqBCBmq5oSCScpgU9JNEFLyEfWxdvpJxZuA8N"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4JHZ9AmHFhe6GW9sQV5niWfmC6UFpQkLHQWgAFuPzwP1"),
        quoteMint: new PublicKey(
          "9GppTJTM4CfMbHgvGhMQ8tQjdcSWEN8Cn86ayEzg4BJc"
        ),
        baseVault: new PublicKey(
          "GxxzZnq4YRsK6ApbbTW3jB3QVeSrmrSnGkQQxCCxMcNX"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9RYmUhWt2bZuwLGBd3cgYuCcPgpmR6vrVPQNHbtET3Ce"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6Eo5NyP6eLc7X3vaxQHqhY3uw8cwAWLVFjENAwEtXVK2"
        ),
        eventQueue: new PublicKey(
          "BhZr9nhw38348z5egW91qkKAJtx1jmEjcdtpNKZWkhsa"
        ),
        bids: new PublicKey("7dpcjAYPyDFmJ5R91kzBdUfiRxjJaVtd7oA7CjvCF71k"),
        asks: new PublicKey("E23kc2zeknekUvxTa2Md6msGcE5mrFvFLEbSnUBUyBx5"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "22EdZVCvLtUJKj9btwTXemPQttXpgGMCQamBKmnxcPpH"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("2DbirSm3PNhbq3K9zayYsdzoTFGV95Aw3tXS4Q6Q14nW"),
        quoteMint: new PublicKey(
          "BFEpis6YuMWa3QdHdGkvDXgDgFUx924zKzUpQaxfCzsY"
        ),
        baseVault: new PublicKey(
          "ARJ8gahpkaMZUwQsRsvy1PWYWHEU6N6PvtC3cy5a6ZM4"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "AaXY1XnxFog5vp6cNWeyq6jvJRRxeUBjEFEiABcrCpwo"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2Tzh3GQjSkvoMJLyQRfLRMaxrsVf8Zms6Q9UCygfRanF"
        ),
        eventQueue: new PublicKey(
          "Gy6quc3wbzkYkQBpbxs7LncpzGrXTZmbkJQCK5FhivUc"
        ),
        bids: new PublicKey("62jJUt67hPsjqmLT52w3dCowwkCJH8GgRD2md1URSJ3w"),
        asks: new PublicKey("HWBgCgscg8J3GkomHJf5pf3r5Px5zjPyGkknKk7hWsxF"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "25itv4pNVwu1uCqBkNXmBW6aKbJszqQz6XfWLxsMPjgB"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CRAHGvY6P18aKs9HGPEjWDoNjgSdWu9BHKbwSJAtoSvd"),
        quoteMint: new PublicKey(
          "FqQ4EAayZE1AEmqBRaJNspxt6M5nKRrSxZ1pVii6MM9M"
        ),
        baseVault: new PublicKey(
          "4yoMXkJfJYJB6AY5zGEpabEWY2QsbvZQWKxjdQApjnmL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2YxsgxVKMTH73XFoNs7wPVFRsGwdterPrw8CvgDtVQm5"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "38wKBpJo7dDvxs32GqV8tKtJTV2dapq9siv5dcrH3ne1"
        ),
        eventQueue: new PublicKey(
          "CichZnnVkuA2yAtsDCHEg6AHzmgHKYbjsGwr8rFJpxGX"
        ),
        bids: new PublicKey("GwTENbZgauiSRi7fvNXETGQujGVoa4aGBZGfmskAPcBy"),
        asks: new PublicKey("B2VKjGP83stEpxi5sAUmkNe7WKUmPd9EU86wuZ18ERxg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2FDDdCJnJ6mcXWfrcFsQ9gZpKoi46makwaUxwDeQP4ug"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HxpG7nDXkFkXprpr2zBksksm12iYQY7hhGujATiQ1uZP"),
        quoteMint: new PublicKey(
          "8ZYw4ZdgyRCRv2adJMHcFBtumU4VFaDRMeN4LmngLsE9"
        ),
        baseVault: new PublicKey(
          "DSxeMM3qQrgoLiMmZrvBjpwPiTFHY298xsBatq2QWzpm"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CsfCmwLUh6HSAPnW5b5XRZHJR4UhVr7aqZxcj6uKNx4D"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7xBQ65RTuPmZb7jXcRbNTocidYjZ4XDXbpAUWgYYCMAV"
        ),
        eventQueue: new PublicKey(
          "8ZiiaSpiPFBa3vKKmfEtdR5pT59mMU8c4di3gBBSYkXa"
        ),
        bids: new PublicKey("HmhLP4JqbykpvSuKhBitSUaNsZ8ZkeDFkWEHypCunRmo"),
        asks: new PublicKey("CwGBCCx6WC3TxDGNDRxmxihwEoTKNj5xncshXT54P868"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2VcuCse2T1RRigSeov9mFtoxxZMYYV5b5zbghTz9eTr8"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FdmziDwjD1jvec7u5rQt27zup4AF4DRFSuohsNQcaPAo"),
        quoteMint: new PublicKey(
          "CxDDV2StjrFMSdorD7YPzqpYunsJ8Bnc6ytkUyv7fcuf"
        ),
        baseVault: new PublicKey(
          "FkUQQCDKEb5fvtCi6KvcznVjPF6uVJEbvNTZmnAXBadz"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7HDSSnrjsSfrNoGrRf8hR8EnLmQ19Z3j64PdSzhmfLfY"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7VXzCTE159GNPzYd7mkV7aCMdj1YzHytcU7aowFfyJgJ"
        ),
        eventQueue: new PublicKey(
          "78LRmVZNNRtsgAM7qo9QuyrkjGKunmHhLm1atPGTmbCz"
        ),
        bids: new PublicKey("GCecaout6985v3SxHitN1af7EXYf5Cs6GXxVyeWSTaeY"),
        asks: new PublicKey("HkKnzN1FuehCSphfdaYKX2ncbsJKfTG8uDHpFomu1QpP"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2XWDvr5LkzoFANfCC8JUV4rbYiMyYWgtKH9zNDTCxVWU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("39G9ca2CNXiTAKtJH6461XWfYdgdy1U93QFqtUXwQTv6"),
        quoteMint: new PublicKey(
          "8c4mRT1QneJimYh5X6MrM7Gt6XibCsprkhZupABTaLm2"
        ),
        baseVault: new PublicKey(
          "B1Km6fCDaFnQqzv7M3H5eRUGqJbA9oMAFEMrj1vsgM7K"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DJTmUwiVKSd2dg1ASajWK35SZYLa9E6Bm13zr7qNnwwp"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3u6XuTHQxV2gWbGG6hhGbPPdFcDi1NEDhVKJwzAgKhVU"
        ),
        eventQueue: new PublicKey(
          "o6QqGAUybJrZZfLADpZhkVEWb4XTzCG12SKgFsR9GLq"
        ),
        bids: new PublicKey("Hp4mVMczLuFgzALfM7ab9DuqFNFQDWStqWXa8ocerGti"),
        asks: new PublicKey("EzM1GQdkCHjxSFKF8Kp72tb7TjiF82yuGsDPrZ1EDXUo"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2aj1A967u4xFZp4N1uj8VEHeEUP1KBygpYoYmUEs1T2q"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BJ7ore2QvBsgwKuaJsqnVS8vQ42NHxmzv2VuQeFVnWuD"),
        quoteMint: new PublicKey(
          "Dbfd8FMzcNdsuDnq9Q3nvZfJSnVbU3koQfde6D2cXdaU"
        ),
        baseVault: new PublicKey(
          "3rMpuTNBMX16Jhd6wYCZGCzgNfq89cWBWZwPXrm25mtQ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "656Tv6NfPuqGdMfp3gxyBdQuJBsQgegne6KpVA7ChC4y"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7Q3QGgEuMt4UVv9wtoKNP3YJDxLaWQFYpj9pSRmgJ828"
        ),
        eventQueue: new PublicKey(
          "ED6i89hL92nPduj82ytNDLgu2qj5zoW4wV5xWsf9KumT"
        ),
        bids: new PublicKey("5FBbDiE3ieuohQRX6nYNAnYyr2fKpFRSqk7Q8kcJzzRQ"),
        asks: new PublicKey("EG8vNzVGZYiBcBBkZJcmTpruBZMHQoTHLzTxXU8juava"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2fH6seyt7sHqEPyPtwsgxoTeca3EVr2ndajcN1YwvQpF"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FysNNynsAekuBj74WMUYo5Ksxfvqc2mvKVim4bkE2M7K"),
        quoteMint: new PublicKey(
          "GYiAxfWgnRGzdgc7f8A4EysyjcYNovArBseWu93LZVCB"
        ),
        baseVault: new PublicKey(
          "G2XyovRPVkGyRRecxaeRaxFo8243xGTZYxeNXgGX9uAt"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DAsYpN8JPaEUfpZoD7J4gUrEkmHbmnPYU1N9qfRDbPSS"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9hHDXjE23GX1wdaQFruToRWysmQQaGDbMFp29hQh7VwE"
        ),
        eventQueue: new PublicKey(
          "Ehf9WxWpVP8aEWb12rsnxUXnBBqeGa7PtTApj7FGLVYg"
        ),
        bids: new PublicKey("DzACQd4muhKHr2oHXxmPzHKVCCErAyZKX81WktpE5Vip"),
        asks: new PublicKey("EUXkkfwdRWhhnM4Zqg1RjXmZPH5G4wGoKxG8rJ2ATFPE"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2jor2tuBMgRASS5yXzASDvZoYLqHTao3Eppdj1ETb3MY"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BTMTxxrbnCU68E1j4w57Ur1t4H65ppzMuX3vGn6hxLZy"),
        quoteMint: new PublicKey(
          "2mfzDb6tUntR9Afiprp3drNyfJeNPy1JS559syqAcVXn"
        ),
        baseVault: new PublicKey("w9hVHdXWfkzWBEH13gRMrh9DhtCfTgvU6pQXYoE76nH"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9Ng5RqHky7qeQ286Vjc3wQkNkodUZnnPzpEDiENpRTSR"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AUk4HbKQjAz7oysxtfPT28UJ1cu21KmbKjJawJ1Hdu4H"
        ),
        eventQueue: new PublicKey(
          "nPbR2JBd2GEfHNPVQsku1Ph4Jmm2rgwombogAHriQmu"
        ),
        bids: new PublicKey("7dvewwVVbDSCiSbUZrmrbH9wy1SHypRU5pERNHXoUhrf"),
        asks: new PublicKey("jezARZCkCXvVcc5Gg3W8kjgLGfzzVgLoiy2ErsKQbab"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2naioxDXRspwKi5DHeKzjiAvvy39xLdAzdZYobo3Lygq"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DDvtk6oPiNW2mqYeVeZ8wLaFeat5pxAfmn2AsjtwS3HQ"),
        quoteMint: new PublicKey(
          "29gcrDcw1wpj3bKPDnnDkSDg732wvuVvgKTwSiCydzPG"
        ),
        baseVault: new PublicKey(
          "G2yu8SsCgCoWqUL91wPx78Y5Frph3ZEAKnZhrPG12yN9"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "G9NTLuDndkuiGdG7XMv9U4ZjySgKTR8irCkeMo6cEQKx"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "YFsrhoYk1iw582TxFAQD2acXAmdQ8N2yQCQyT49XuBb"
        ),
        eventQueue: new PublicKey(
          "4DZeesttgKoxYykg6UYWryiwpXh3ZZhL98yz1tARRyhG"
        ),
        bids: new PublicKey("6bMMjam8aZ1W5PLactpcFFFbx6T5cTU9pRuidJkjwYUT"),
        asks: new PublicKey("2gooCYwkhGcLoozzEVpk5qfoTUX5ZKzY7tAwHW33gZe7"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2txDi9CfoVtQPUvnQYWRcrtFtteN2AqRtGg1h8aAaTWM"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BGMpMYSHySNmgRd2FYjJyPicTUpMAQS6cyJcEo7tKzvm"),
        quoteMint: new PublicKey(
          "C3HDb7fRhp2BUMpYotfhE8nAmsi1vbTYpKWTsMLfUn8V"
        ),
        baseVault: new PublicKey(
          "CyeVUKFjyhuHgKDAxdA6WmbjCKKxjoxrMumoNLxjBcsq"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "AYD7YAXZaZTr7S7iQwkUc1eJTnPBAwLh22JnZMrqoLhc"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DYnBTEHhTYhJPxMjoZ4nS6QU8ATGeGNZVgPNmQusV5zj"
        ),
        eventQueue: new PublicKey(
          "Fz3Who8Pak5RFCcjbN4iRQy7K1yXpqFx8EbfmnWmrNC9"
        ),
        bids: new PublicKey("9Njq8CuCRcUuK9ocLMWMteopRRakVrjh4iXWcaHMGhHK"),
        asks: new PublicKey("3SPZEhFiV6pQjRUSwFYW9tRDMnP8BL88DMtka1wbxNA8"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2wG6UCYRuuomW8AhR2RCou88zGJRwJG8zZU3H56qZ9gY"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BHnydDKaHHqSEjkS8d8Rc7wnQSvCRzFNU39EzyskgBVD"),
        quoteMint: new PublicKey(
          "2mnVRJxqDGBgop97tQwPwHfGUsBgME2c4cak23LWbjt5"
        ),
        baseVault: new PublicKey(
          "EK513KpT95AZDmEiahjtwtVfAH6EyUBgiHF2EeEZE7ir"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "wB5dZ94zGScXGutGvWYUr4CqowWVV4P3xSdUTHgLch6"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "8af9JD15B6a2PAiBXbFQWisdmXjYGvBVfnjCnJM5fNPT"
        ),
        eventQueue: new PublicKey(
          "AvCrczvF47b7Semmzr3Zukf2AD6guUpgH3pognYep4WZ"
        ),
        bids: new PublicKey("2NybJzKyGLMMyQmZu6dUyjswA9wekjxNRQjVKfY6o2Nm"),
        asks: new PublicKey("GBnVEkiDkk7a7DBMgQzyDZAr2iG1k4TYPyXx9HmRFwij"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "32L43v3mDEWE3PbE6Bm8Pauc2BgHX2HeGZk1Ve7z9bAq"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7WNW8YfQkFHnynhoKMaZL4EiBdWbGLSZARGcruRyNfqc"),
        quoteMint: new PublicKey("sRWu5eLQrVYeLF83xuyhennZ37opcX96EqFgejWzd7q"),
        baseVault: new PublicKey(
          "HdVpatTZtCohpBRuVBMz4L8xpu53NfvHagh9XPhCnmtL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Hjy4wPwrrQa43uHEShZ5gaYnE17MnTuMMau9oR6FVj3S"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3HLGfTy4SiXfDUJNonYn34HJsRaHBdvet1bTmeKmrb2m"
        ),
        eventQueue: new PublicKey(
          "5xRqWSx66rCnfeabbYWMoyUKJbMVXuLrTZWXpS4GqozW"
        ),
        bids: new PublicKey("S7fXwchjDf5LnD5kiQ71S8tLLuWwxssnfqg9g5eJii8"),
        asks: new PublicKey("AGEiJq6qUS8Vi8P4XYT2dK7TY9EPuRHhqZZffGJAiogu"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "37Chq2NiKcTekr3WwnDdrV6edC2hVfxVkpEPhXJx2KWV"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5eKdcMwLmsnmZ3CSNLpsumxoFS6WZKNzW1oQNdxipAAM"),
        quoteMint: new PublicKey(
          "2XRjQTsnHLszFwusQoYmbrKASgYbNG4Z8FsZaUo28HBJ"
        ),
        baseVault: new PublicKey(
          "3rRQEJufhTkqj3GEtmhHuFS4deZtPAMQjn8esiwXoKfU"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HthbhY6EqH6PGfNYxn6fUujcHzjBiEcYwHobJ1R7aJ2E"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4huJFYstGNwUFn6f9coGEz44ie2odRoypawVBeidAKka"
        ),
        eventQueue: new PublicKey(
          "2NKGhYsBmC7yWhcWcFqoVKwWr7eKaNaGbjwyHE7SaRjk"
        ),
        bids: new PublicKey("Hd7J5JqypdqHsx5sL8MzSeZawYMetfcw39BggMKvbLBP"),
        asks: new PublicKey("2Ft6YmhBZJpuZL3fHitHHZFKL7m7AyC9XHDMWUZNrEdU"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "39PT8bwf9TgzUFNhFbwYrNFEAvgAqqbvFXaNj4spEWbC"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Bbm1FNEohBU8XWMHdhP4tApRuwwNdppSJaXDMVCrBDTf"),
        quoteMint: new PublicKey(
          "FVr9nkzRVZR8zU1EaneHw7XQvsucbm5M1QbChqPkFBzx"
        ),
        baseVault: new PublicKey(
          "9dcvQjhVvdRfdiiCeMNsnyJmXP7wkncPCe7Sj7kN662V"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4Yc3Torg7NWtqmLg8opdFmVaodu45WBix1dMkt1MJb8u"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "8aLyQcmjsSaLnX7Y2ZDQhP1YM9ehYKVTD75eyhgzt4RJ"
        ),
        eventQueue: new PublicKey(
          "AE4PxkFTYDd9QtThMuADUZCtziGvwq8WVhbSHzNSNPiM"
        ),
        bids: new PublicKey("2PgQxZcxvTpvNvc28rV9K6UaK81e1vEeknCBg61soH2f"),
        asks: new PublicKey("FySq4a4999UwP5y1cBAtmc6MsJpb9mDpNNNUNCNRz3ZX"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3LjJDn5iuB4wZryae6mxy33VhxiUwjDt7sYjwPn9E7Up"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Fas6EnMXqPMeg8mM157dyq88yZKDfhMVHHGHbXwbLqdj"),
        quoteMint: new PublicKey(
          "6uwzYy8kpz8Aj6Z3gxdj9MZCMz6dRKZ6BfU6etoSDSFb"
        ),
        baseVault: new PublicKey(
          "4nR4H3k6TryKbw3fN8qJ7RGt41vaHkw3rxd78Rgqf2yU"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CCRYrQKcV6ajHH1uQuvXRA46QDMSHpRFPuXaCUxFkRjt"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GKmg4XzKwixRbGJCnrWv6Rq3enTTZH6yJ5cuYCM7CN2y"
        ),
        eventQueue: new PublicKey(
          "A7frjsRmyArvkTjVTNEpudR5BjCnCaLAVBmqVUBL8tsQ"
        ),
        bids: new PublicKey("92EHj2X8UrcVXrtWydtoqS5xQss4Z7Ld2Uc26NVM9mEh"),
        asks: new PublicKey("ALWjZ8fmjVyVqLb5xXLN97zKSHEsTtXAWAYmTznBKPWS"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3TCbjkyeu6UqE2GRRErRG4tJjUqcxtxbHekYwknTniSa"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CHMCyE2bkdEXLJCaJToUusoNhCv4WuRxXRbK23hQKHXf"),
        quoteMint: new PublicKey("ZvDYSDjNB16djNLuu5qpA9tmPY4UwhpSC5UdZtYrt6N"),
        baseVault: new PublicKey(
          "DeoSuvjZvufxRUfGoKJffkPJ5P4FYL9ZhTN2xusjrrg3"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "ub8ZKLUCEEKxzkVnrAf4odH5zNwEnFqsizcHJawdkZ3"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "HT4PrPuFYDTFGikCLEN6qcJUHBfbZbxHh6NRwAm6BRWW"
        ),
        eventQueue: new PublicKey(
          "9uEf6oWjMYtmdLYoWhNxF8CyreQBViFHMw3js4axzW53"
        ),
        bids: new PublicKey("5JiqyXgoDQXP2Vxy1t4qV3uaVL4E6aeNv9CDSs5nxbFo"),
        asks: new PublicKey("EGPPqwshdxMxyT1dncoDdm8yhmE6HRn863zABbmEfMx1"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3UFE2soSbSDS5g8K15m5X5Aq7YnTmZf2McePzVtwicWh"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("J98U1pxQiGZVGCxyC9pzx4fDFcKtNULgZ2F1AAqtEzN1"),
        quoteMint: new PublicKey(
          "6kE6juZy6J5KoczsvsWEEt7zNFf6zbJ4P8TcpgLbhhFD"
        ),
        baseVault: new PublicKey(
          "5jrpEexy2eXDdLSFjBNCJYXEE72E2QgYLoKsxci5iZjd"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3LGUX8D64B4h6ssAoJ9Z6uWrfjV7vn1drfGz22HWjFBq"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "BAW74ZMuER3GgNCyzmgKB15inficfqCnzcFCMmQed6VY"
        ),
        eventQueue: new PublicKey(
          "HGM1QqZZTWQZnpUEUgosPkm6bceRzrXjFEqmSCHmkvrU"
        ),
        bids: new PublicKey("F1pXnERXWbsLyLSyaMyYJvxDdVvWqJAGzp7JK6PRCXL4"),
        asks: new PublicKey("8cz89ZevXLdjxHjttwG67ghhiL3VEFuvDV2FAGxaMcxh"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3aq4iYSPo3Phc4fkZavK7GPR7CfQVhjs3cwDkPXvQM6X"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GumYQap6pSV8Yvsg8orZXjfHTv8vvoBTrJqDpUAs8ZzB"),
        quoteMint: new PublicKey(
          "5chG8pSjScT1DFqZuhS4wQFkvZgJitcFr2EFUCUm1Mpx"
        ),
        baseVault: new PublicKey(
          "BN9mE4JnzUveVMPWWP4VJqxfWNL6L6vpWo9DzbaNpKtt"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "B8kGxtTHQEc4hQPoBz5vEwcepqjTY8MFyAEtuxSunfar"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "FuMDsrvEwcwdDXi2FxbTRdQ6TupF9Lie5RRZKQkqES7P"
        ),
        eventQueue: new PublicKey(
          "8dYvR9WPKWmhBsuRUMiax1RnLetVxPkgDGcgRPaZfx5A"
        ),
        bids: new PublicKey("9MVMYWCua7xxgEdiTUuCEia2HdVJyusvgwj2Ak26xYon"),
        asks: new PublicKey("2BhtyF6xNW8RKmk7BFeoZWL6P61KuJ89mEHQ69cp1v6b"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "41GnSNpHjDvM6Y9QidVDEUJSNmo6ARRroc68WXEJ5tka"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DJ5SiVNvxgfR1cn8eKSZREimdVMqzQt3R7bp49vDMBBy"),
        quoteMint: new PublicKey(
          "G6g4mF7zfvJSviGqZHsn7ekmPsV6rFkepbLnvH2ZWJaW"
        ),
        baseVault: new PublicKey(
          "5AMaMbiUti8rTgwgAYSL7NMjdVMQGDbP2p6CyQfZffBK"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4Xs9ox6is3oE65Ets9hijxcwBUyFTxxJo2LMsTXhpKcK"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "363R5xkigmVmhftFR69Rgj1dkjyqEMovKqzfSMuNnfpU"
        ),
        eventQueue: new PublicKey(
          "7VxsTKm7oFENBzkgFZtZbHhZ9vL2ieuLevnBjCzTHPoP"
        ),
        bids: new PublicKey("78NKjT9TnsKKmfdjfzACxgfFeV4DebcKY4JkFRAkT8pH"),
        asks: new PublicKey("C7745D1ANvtsv9jpQNZc75AWeeLKNti4kxQfurKtGCu"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "48yWZYF2oKqn8RgYjoWcCb1g4Q3gq62wFmzcYRTRQaom"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Agk5ZEqN1Ymy148FGdJ1FoQXYdZoWyW2FWirgCCdcf4g"),
        quoteMint: new PublicKey(
          "5foxGRMSVzmumWKoiKUcfaLmWCvfdhTS1wvxuNWH7SAZ"
        ),
        baseVault: new PublicKey(
          "6MkPfjvLVewVgMcBXTfGjzRFCjFcyGYBdk86A5S5dUQk"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CUg7yAPMmKUqD9JV6Vi2pDWud5umFUJSTkW8wiSWJ45T"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "B4ymXLCtSdRp5P7jrdTXWgcBHnmzF2Vc4PCc9ryNR3pX"
        ),
        eventQueue: new PublicKey(
          "4xGjqAsdpJLwzTFkeajRQLRT15SL8vU5mhN1KasDZBFQ"
        ),
        bids: new PublicKey("CYpeYop6ZHqEQESfxoVCyS6yp3nXHwi1FLJ2KYgAppHp"),
        asks: new PublicKey("5gvos7c4j2Jg4aAL4d97rgZQWXnnBqgm5eptcjHFY3Fo"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4Ccm8g32wNeR2MWCE5T6FWUohmS43gx1ouNw67Svxmp3"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("84UsXnYAQyaF2Wz9M6YMeeJosAvC72h1Y3MKSnCWJ4wi"),
        quoteMint: new PublicKey(
          "8JDd5MdGs24bZdhRMJBjLz1zoYyZKzRRqhKvTZmNrsxT"
        ),
        baseVault: new PublicKey(
          "7cE3dEb2jwN4J2y8BBYjnSTxpQraJDLkQBiuwhcxWkY9"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "6i9iyRNabzxPsC5hFY2RTeUjKazWvhdmtGq4xBfv7Y8M"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "91HVVNKhwpuEtBNL9UKz12UFhQVnQQDpUq5PFSGUMyRV"
        ),
        eventQueue: new PublicKey(
          "HNfr1bBEN6gmoeRGTqpbsmE4cSqfJFcbq19yFhS7Mgee"
        ),
        bids: new PublicKey("BeSZ3R44fPW6ZYrXSjXAsgYFWFfsQiDvtLK44nFVjN2n"),
        asks: new PublicKey("G4Fm1zyBZXqAY5zMVi98WeFU24CYPvCYNmBSAtxgqWsT"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4LS1YmuTKby3LKFnMXEbsrUozNxcVC24qZDfi8ryEWHM"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8gMSzAKvFxJ5NKJhuoZmw2vTBiJxw9HkqFwSmghzMLY3"),
        quoteMint: new PublicKey(
          "J8UacxXk9orEDhZENQmp7fasHXaoyAXju2FDY8fqVMG9"
        ),
        baseVault: new PublicKey("Kw4qWAKb6QgaUB5zNojd5vKVcQ95d6DwY9Fg7tEaEAP"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2BF8N8T1mWVoBrCFzuvXNtWuzYDkCv3p4PEpnbMtskMy"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "G4wdUUBeMyQyyR9sRCyKUmWQPzt2BKmT2Rzup1sDB19k"
        ),
        eventQueue: new PublicKey(
          "AgTtqrWpse2r6TV985goT9GK3qHZXEPxyEK15QCV8rrt"
        ),
        bids: new PublicKey("5bGDW3EKKK2YrkwSQDptqDZvu2BMZrYPDMA7iowSqexd"),
        asks: new PublicKey("7GzZd2nJe1cAZBYjPSvTPvrDKyErEfNfwhc2VJvBLFKg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4M3AcE7tRSXrQDpMyjTscMEuGNrtDXa6GcmUT6773pHp"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("44iST4oWJE8Mgnij4L8G9qJrmpu57BA5QNdabA3fbCRg"),
        quoteMint: new PublicKey(
          "143onpKW88muF4nZCj7YSXECugGveTNvy4hGhMNEoHsQ"
        ),
        baseVault: new PublicKey(
          "4ZbLdwTJAb5LPMYWkGpE3nmj4qPTSsAiMZdxHUteYxvG"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8sWK9vdbdwoQyFzYaJB9k7eqktwJCtVNuhzyJAarh7K8"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "5u1SpdBeAWn5rLiKt71hR73nxoJLMGKS4XNuKw3vuKY7"
        ),
        eventQueue: new PublicKey(
          "7RdzsTT7DRAGVZj9v7DntXLVJZWKRkBXxCqAqAKEjFRy"
        ),
        bids: new PublicKey("7QGAqJPitUKHTgZiGH4EHY4dXc4ErMu6PkN6CqTpiMBZ"),
        asks: new PublicKey("7tR3kcGy9FKdfswyt1YeXRtpyxjUqjc7bBc49eV3bLtU"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4hy1RrUg8JTECyYEKM3XPedArossReiL8fRfygyAq7Ko"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4ov4sN1JbDZmEh41NDa9DFNDCauZEhZW58mFAzCj1N5i"),
        quoteMint: new PublicKey(
          "3A6oDv4w5hMfS9UVgvXietbYBowVeMU719Yvm6eNVU69"
        ),
        baseVault: new PublicKey(
          "4LcSAfmzGzbkkWZh45mP42uzWM5DKwqpYgCsFT6yExTS"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7V3fLnjDj81t8nUJdd17ksUfvhVhGvhbiFiVK2Q7wGqo"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2zogyiFEV3ZnSJkDLDTUyDvgQRiXpTE7CxsRgvT1jWhS"
        ),
        eventQueue: new PublicKey(
          "72FRBfvK2N8uV8os2yL9S5boiaWSoBgkEdocttP9Tkbs"
        ),
        bids: new PublicKey("4CKnVMCXZ8KkCKTHWqfym6stzENrdpA5H8ez5zwxNFy8"),
        asks: new PublicKey("8U3PSxEmdT3m3WCBH3CPGeELWV1kZBsK54fzHk4jyYee"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4ofB2HThRZDzvArrSfbeinCJSYbPDDAh6jnCgJF2LYjB"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HnFqwvycQnVXWpr7eqbsgVZfvEsjLgLr6VqHf2YKkW9o"),
        quoteMint: new PublicKey(
          "5p5QGRcvn2mxBsQbcby23fBtpXHbP6rhbtCzEnTJwaGM"
        ),
        baseVault: new PublicKey(
          "6ue37fvphMgvGrKsv9YP9BGdmg46gEXCp2tmTGM3QNPb"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "nQWPSpVNPXYZse6jL4iaDntnuB5tUdn8rHUWf52ZP4A"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "8yWRbtNV1cBMTpyfckvi7f8zGRwDVDNSWpdFtxF8w1JE"
        ),
        eventQueue: new PublicKey(
          "A2gk8SS7fDVK9MRqmc5EYvVRFeahzZQ82P1UUAjeu154"
        ),
        bids: new PublicKey("BabZTkjiid5rJDcrHeEYQjv6P7wBC1gomNg1cgtDKp51"),
        asks: new PublicKey("HafWjpmSLQAusZyiny7q3nqzSN9VjM5gAT8PYJ8ixpPQ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4rczmV2j39mEp5n7gpCaEZqMwUaXEadcnysvacjEXpQs"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5cXQkiyZ1SYofUDCmiN9ELE1kPhgDub8afduHfgFFqCk"),
        quoteMint: new PublicKey(
          "3rNqNq6k5psHmwPjd264GXuqgHUuMsEUAuRDMkCACEZe"
        ),
        baseVault: new PublicKey(
          "BdXJsFxgn8L31wEYeF8cft989vxcXPHoTBjrLfBpoHQd"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3s2UsKn8AXBUNL5sgs7AwnKnsKeoLvL4natRVKbnysAR"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "8hy9krFNzsiXNfU5SFPso3bf8Q3DgrD5CejxUfLujskm"
        ),
        eventQueue: new PublicKey(
          "GWT5pFzo7g9oDWWMfJLUARwrEqXCGw591FLyWPiXS1Gj"
        ),
        bids: new PublicKey("DxtcRMjhNnuqU5JEab13LVhFiMcWNeqqF5ncbC5LbNLz"),
        asks: new PublicKey("8zbSXxA6t1tEc43dwrNMj1o2Les4UU2vQcSXarJ2HPTG"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5D5eM3REp1R4g7bYzSKxAVYCNQwj5zLC4Y5ciV8VkaHb"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3GugmFsDykdyyXD4ThfFeWxABYeJa6yuAJcpUeUXRQSZ"),
        quoteMint: new PublicKey(
          "4qBvF7NZi1NpMAGZbjUc8hw3Zp5Xb3SbmwpxuoWyG8E3"
        ),
        baseVault: new PublicKey(
          "Es1Z5mnreVcbm9fQRZqC7wq7YDdXn8v7K1Xrfxh7LK7q"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "GL97JGjyg2b6xFGbH1rDWaQSF5gtrhQ8XLUBJXtVdxeB"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "75bAbaur5sRKWk15aCjKYLj4c5YtBRUsTZKyaf1t7YwE"
        ),
        eventQueue: new PublicKey(
          "AVxsgDkXZ16V9Uxb3LgqdtffueLfEbXvMTwKg92M6yAJ"
        ),
        bids: new PublicKey("DCMmeNJq9MEx1KRw5udpsMqvmYjQGmtFP4c1XmMqDtDo"),
        asks: new PublicKey("9Dnx4d2PA27cFPtkFmZLkVqUsVK1ywftHBPWqqQpDw7r"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5F7ZQeHyXjQpqx9FzHhqfqu3RfV3cXwsjeMxVJqijHZQ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4yyZi7bKJfrLgZYTooVGYP8pJ717pbp5csenPXZXSaXG"),
        quoteMint: new PublicKey(
          "8y8XihQfJX539TUihQCVNbmPK3fKyq2gRk2wa3bYRUVK"
        ),
        baseVault: new PublicKey(
          "GVXyr6rYVNq7bQ7PjN3ejVijU15L3KP4HftzGo6akWDj"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2FydzKm8Jkiq1F2AKC2qALBtTv1n5Gv8rSgGgsC9oB7Q"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6pyXQZ4g1CFEYZgte819vcM43KVGCGuL9UTQj4puLjxw"
        ),
        eventQueue: new PublicKey(
          "3SHkmNgTGFS4zfyMesqUVjyxbZVEvn7MBPpAmvbT6VnF"
        ),
        bids: new PublicKey("CYvZvYrnQ6vSDBQRRHia9r4Henq7Wj3nBMmJwwmMwAy1"),
        asks: new PublicKey("FAdbm2Rh3vYSMTq8CEDtxrCBoYyWit48ZsJtWFuwyDmF"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5GVAUy4fPgXJ1xQ5z4fG4Kah7Xcgy5Ezh5ToAnFWpYr3"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3dLpQZLURknavE8zBvC6eKVoQUp4jWbM7iT6gTzTHs5m"),
        quoteMint: new PublicKey(
          "8cLsFK9oTSgCFB7MGVvTK6apS86t9sGSP9PXeKnipASV"
        ),
        baseVault: new PublicKey(
          "8kgLgRkBUehFHNNHsGTPuiLvW3ee4p2YH82328dtyNnM"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9PqxkiKrgqAMagd2ong74f9TxdAS11YUNc1m5ugsr7Tu"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "5KLbmGKtywwk35heoqvkchawCSCzBPfv9YdeE4Dg4fY9"
        ),
        eventQueue: new PublicKey(
          "4GCdxJmFzLpYrH9q4ibXcXaYHiRFghuqQppYHab496a9"
        ),
        bids: new PublicKey("ChRwZLNgt7Be8f4bn5uyJUs3CYbWSqXo47NP18US6oG3"),
        asks: new PublicKey("Cdfk8MoCLiVYsnQbjqLaDhk88ZUuPA1Z9HTarMBmoqkp"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5QQAtwDa5n7cQeaeW1MLA54jRPx6JzuGxFwejwyt5AqW"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("32ZiUxNVUQ3ViMHuQ6VoMjPwm1BSDLtzxG5MBfnKVLYV"),
        quoteMint: new PublicKey(
          "5Bc8ciHQghDPSsp2ihhndnEdR6GCX2RUMD3Cncrt514n"
        ),
        baseVault: new PublicKey(
          "F4ZzG4UDhvdXSoufdG1EmS6hFaTnYmXPuN4EbgzZv5gW"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BBgardVd7hVppPWH31QN75iBptVyUJhPxraGUnQFrE6t"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "HTN7QTGnZk5Szza1p4bUfWr8dGvTFusx78mRQFee721M"
        ),
        eventQueue: new PublicKey(
          "7y8BirwNUVeJTZ3EqtscruPSH3J9sDc86o9dNQLRLpT6"
        ),
        bids: new PublicKey("GfnX4MKFPgqkWefe3nU2uSqTnzGRPnkb6hFrMtHB3M8p"),
        asks: new PublicKey("6eukaW1JkLVm8FabF3NH3Esks4gSCGUVwZGfQUNAucP8"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5SNYkt7m33p6KA82M9HvD94WtFtdpVc59RsmhjtUkvqu"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CNoGN3QqvCu5RuDywRpoidYXx4ddTd3TEGaEft6XF8Y4"),
        quoteMint: new PublicKey(
          "GxyfPTwFjv27LuESF7PihGqd93K9y2JBuq49mDmVS4Fo"
        ),
        baseVault: new PublicKey(
          "2Fvcmqv5mosN3HsS1SJPtAWNCd7RyFp3pczFrFucpdAK"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "UTLZH6hvCecutmY4fsdX1Zx8NsjmkkM2mr1nD4QfLDu"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "itcwon3KDrRdSEcpWg2P25TiGoLbgM98DmEMwBFQQvY"
        ),
        eventQueue: new PublicKey(
          "8pMzMjuhTR312ZTEjfhEc3LVAZQWxXz2iZrM37cUETAN"
        ),
        bids: new PublicKey("3crteiyxDNLota2GG9LQoseKZ329LyEnDqQsRbgHKBaT"),
        asks: new PublicKey("Esj4e4X44WiX457DLngbw1GRxT9juXnHwLdsbiKjXHn9"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5TPgWQcy3HFuuJ9D3hNefMdAkvKevmb2dtTevxe5ssCu"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DyqrQ3Ta2Cp4wJQhPAb3GNQzLGdUU7vJFh2RRwtCG9G9"),
        quoteMint: new PublicKey(
          "9BxDrUoAeZGKmse1kUKDWtJSgB16iXaVANsqKiEGkywD"
        ),
        baseVault: new PublicKey(
          "CJ2UPRkrXee2cTipkGUpZm2RyHE1ByBSNVGY9dfqwUA7"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3mJebJT3FvShvfkL6h3pcQ7bCNudT2Sb19hmCzYE3rqn"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "HKsztHozobpj8bprLo9SscpC5oGFhoMPkeJHBtcpH1uo"
        ),
        eventQueue: new PublicKey(
          "E2npSBT1XF7XsNscYaAo6TQ5CC4vMBg7Q5QUWti1FYwJ"
        ),
        bids: new PublicKey("6NWcDZS2HbdLjtJRGAS7ePZeR5NCZtk6Xrv5Kk3qxoDo"),
        asks: new PublicKey("HEgrMNpnumDU6891Ly4Pdwd1wGL5JoUEeqRiVp3wVCun"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5ZgMd5Rtto3rysfqCiuFhFW2BhNf266rhWikuDZypdhY"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6CpNFpyqCSVca1BwoNh1y19kQqTXz1UD7HwbgZCR8YVL"),
        quoteMint: new PublicKey(
          "5ujPMTFEr6diPFYjAgGrBD7wD5bgyRY1t867fRb3oCPz"
        ),
        baseVault: new PublicKey(
          "7gPHftMSKEojHP8Tjwur6Nfi7YS5R5iq3L7UJxQGM9Q7"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CuNijqcaTwwmg525FBHTGgaBoTynXQw9yBXmX4Q6SVwH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AJHu19N6dSUy9ecwRXhUvQY4vHuYFKtP5niXYdaTvL6U"
        ),
        eventQueue: new PublicKey(
          "9fUyShfeoxXd7MtFLYNo33CegdWL81xka96pqLo99SXX"
        ),
        bids: new PublicKey("GTUmHfjHzgz3cZ6UTfsgecrYBgBUjKact42PRgVQ1k4D"),
        asks: new PublicKey("8346gjtF9ZPWDgMjdf3EWjnM5cqwxLSg3zm4tZWWHisG"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5kFHe2XKxTR82wjv2EvhAzixtngJXLqtffxTiemyMjW4"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("C6Ps3USUHHcW95dzgg5utMXQ1R49mXt8g38dEJVvvJ4c"),
        quoteMint: new PublicKey(
          "B3X3DKbsfiWSb9cZ6SSMuGhJxTS8a2UmFfg3NEFzC32f"
        ),
        baseVault: new PublicKey(
          "ABp18uKdcj7K4Tn6UCvqS74uuX8otCYqALvDR9DL78yh"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8XAywBCGvkjtNHmCmpbLm2DHVGwjg5TVofkGRstx4qsY"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3CdcNg2Y9YyJzZoSPZrDxA7hS2Fpg5Vi1SdAiJvDjXh7"
        ),
        eventQueue: new PublicKey(
          "7SEbXPXJBuivSPFbGYoabCUeFUBoo5TDttRakMnAUVjf"
        ),
        bids: new PublicKey("7aAbF2Gn1f96iMoRSQMkYm4wMvoFG677yWN1yY5wQyGS"),
        asks: new PublicKey("G3AQk15fDkeL6LUKCSGK66sSoiEX7uwzuzE1cKnLQLqj"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5oS7ADGjsGQ1w4k1FvfgSpybmfa9nrnhzXA83ZnZerBM"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FywuH5FZvUdYMi2W2ePtTB78qKAAHRuAnjicCuhfS21Q"),
        quoteMint: new PublicKey(
          "42zosYxbSgpnb8e3mAnrmq4W7641Nq7qb9Nt8yRLTsJv"
        ),
        baseVault: new PublicKey(
          "56nfyviJxFyx78VxED9air25PwBUphxjdvCunnRdwpnm"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "6jkcGV87j47ZHGbkbLZTX4rcWkkZAnnkvQdrKc7aYc4i"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "EgLrgzngPkdL7AuwE6ybdgWyDuVej8QPxUcqdNVgwaH"
        ),
        eventQueue: new PublicKey(
          "2m4cVA5h9gAb9zpyz9E5UHttPpNJ9VKDEUkmfzYENcaz"
        ),
        bids: new PublicKey("3ZpvAk7WYUs5K26HxnXT3HZMTWqHtpSWwjf1SquWt19Y"),
        asks: new PublicKey("JT4EwaoecBFM6R8eYDPf71aKnJ2no6Hb5biUBL71sEn"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "652F3eya36Lk9qLa5gMNGQYT1mEKdcLGkiUbxUztSJAh"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Dgwak255GzjK8L4E3b9zD42ZY7sRKLzMsCfRsKSD4kFv"),
        quoteMint: new PublicKey(
          "3Nabu6eAkuq3i2MRTx88B3qtf3ULUoumCKx45hN7CgQL"
        ),
        baseVault: new PublicKey(
          "5ukPjGw2zMz2YGw9nFeBu3JeyVfcZK7YEq9NRudUtWhP"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "D3r1VND8weCNoFybkc5YHeHWaBTdZasysV12J3G6zrPL"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9YnB3ySSoj1c2doCttsbVbGmgS84ebWVoVAHDcDGuUrH"
        ),
        eventQueue: new PublicKey(
          "57XHPRzqNQSsCfoQCXNt9ooU1WDsPrMT4ufqQdPZects"
        ),
        bids: new PublicKey("HiMkjfUv11mqaLVt4PYz8Pb1uvtc3yJmi9DBtEjzuHfo"),
        asks: new PublicKey("CVM9TibcKTMgoLLXvL1o7y3A9LbnKhhQkoQ6Hr25SbL1"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "JE6d41JRokZAMUEAznV8JP4h7i6Ain6CyJrQuweRipFU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("2ZLdhFsrkAtdn9Kud4SZvqchQFvn5jVCHUdJ83vumKyR"),
        quoteMint: new PublicKey(
          "BKt2FdgBahn77joeawhNidswFxfgasPYCHWghRL4AKBR"
        ),
        baseVault: new PublicKey(
          "BEjGhNFnKT5weGtpBoFs5Y1mDN47Ntvag5aMV59nZRpk"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CHBUBfU3zscTNsihdK3x44TbpTza1hwcsTUaZfk751b5"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "EaNR74nCjrYyNDsuoWmq19pH76QSd1nuTzvJSr3RDQ6x"
        ),
        eventQueue: new PublicKey(
          "3rjBffJkFa9zdGr9xmTVxF3y6nL6iL1pASVzym7s5FGr"
        ),
        bids: new PublicKey("HcjrQKnbqKJuxHDLNM9LJPyxcQs237waNZXW7RwgvAps"),
        asks: new PublicKey("Ec4xsLLgLc4wM5c19ZSvazE7M9Rtk2T6RzddNcSQKYGu"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
    ],
    BTC: [
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "13WCpNeZtBpLMSzAAB4WfWviFzF82wyNjY7Rz8sA1Bnd"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DY9X8iYqWsv9zwmySrszjTt1x2DEoWhAAi8rnSMKRXVR"),
        quoteMint: new PublicKey(
          "5wpf5LQG9dq43MuZAPWe5CJcDZpBhgc8W9v38wiDR6nv"
        ),
        baseVault: new PublicKey(
          "55pPmDkVdcWXVuFxSxEuUorfbZ8K3GHP9aA9PtJdm8xa"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8T1p9b7LvRmTed6zsEqDsZiFwNgWNz9S4vFznCX75uVm"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3kMs8mHksSVpXGDVtCAPw2XW4QoCeQqoUTAfunqzoN8g"
        ),
        eventQueue: new PublicKey(
          "jdx1c9fbjDFs1BZAADfRjx5Yd8Ehdk5xbDWBr1buihV"
        ),
        bids: new PublicKey("AFCxxGhCvosFHXCV62ejPM7nBTJa6SnAHsrpaN9EEmgX"),
        asks: new PublicKey("BRNdwwRTMEuDgavuYftGSJ14drNjSiQKLe6dxFsF7kEg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "PWYeZvXZZarjpF3gp2wgh4bXDx5nbH7sYXJYmhMLsZ7"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BzrKsVPWovmkJrUvwhP17YbA4crYYg5Buikm2s7TL19v"),
        quoteMint: new PublicKey(
          "8dA9W1p4mV24a6rLY8rM1bYnZedByme14E9LfBMAX7rn"
        ),
        baseVault: new PublicKey(
          "HgGyz3KnutADQKWovonFA2FzcSbpvC6b2nouAssZ5XJu"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2Vgcrs6BFo2JQxr5xKF799iFvzMDbW8X2tkrBVpd977J"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Ds8aQ3uewDWPpFvqAHzyKTDfJ85jZ3UAofmzqKxkAmxt"
        ),
        eventQueue: new PublicKey(
          "5zfoRoTKv4ei9Y7sQTjkVZqwWTyUyehsbVVbExemjJdK"
        ),
        bids: new PublicKey("ELcMAMDPt1AKykiGrgEeKMhBhcsSfcdG99qRQXPMBJFe"),
        asks: new PublicKey("6kDsSMjd9vUEGc8QhouTq1ZhF547ikLTiMJGTs8A4GX9"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "UxkZ46f2ScvbNnLgzQtV5ZY694c3gcqcMHTm5MBs3Jk"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FiqtjkYu2efZWvDMuozLt4gLk3Se4MFYgDo44JPsjfwK"),
        quoteMint: new PublicKey(
          "2PtmAVnqGnkBCnxHsKCprrg1NkWifWxiXTGK4DJvCzNB"
        ),
        baseVault: new PublicKey(
          "4aLikaU7BHe2BB4yCem7dx2KpBQthKhUm9SZQjBc3xVB"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "D96FLPycCVnFfGLm3nDdQxmCMV8UGUMqJeepPVBg7Xi1"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "5SGvTwefSiHAfbCcizv85bECRF3faSoMww7FCH7XrTBM"
        ),
        eventQueue: new PublicKey(
          "4dHAgFwS5h8nZzdcoXPzUezwt3rdeTS7sP5DtH4fiKpQ"
        ),
        bids: new PublicKey("DxjGCGiowGe6WuRpzHo95PrANApGo2KS1yVXMYtuoyPL"),
        asks: new PublicKey("6LEGeuWMPtfQVRMQMPnqJnrWHqDtqs7Jg5riNBPH92Mt"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "b65fWAA3SwqzsvEmEsuxsHcNVSZFiudppEAHaR3Xmk6"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Ewu7W3mfH25LMTQiTCfMXdy2MB3wT1NBw4ArWCaffp5P"),
        quoteMint: new PublicKey(
          "Bk2m4gkMr69doGBTiuhM84YEtv4MUhMHLeniCrQna2Ed"
        ),
        baseVault: new PublicKey(
          "C7WfeQLAeX3yNpGLkuV8uQWoDpBXY4zNArgr7JgTqpTf"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7eGw1UTgHaPWVQLD9hJjmUv95AsKsmfb4A4WAUnRNKoQ"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3JWyFXcAP8EVRbq7vhabvgKp9wr53s4oDSRZQxGjP2XC"
        ),
        eventQueue: new PublicKey(
          "FwAkYFCtczHJXfHuuxdJDRKsPTaqNfcWiuCyzEnHPYnf"
        ),
        bids: new PublicKey("5WD7KK4EGsjtzWymM1MR2Ue86yB6G9rvvZ4BXRZcX8HB"),
        asks: new PublicKey("4tFBkddXv6xc5tpt2B8TyijRQfDQoUr32MfziC8cnVsR"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "f4PxZRSpzdASLHYiTnYigjGMfULe2JiuzbSqydttEhM"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FCQKPtStXVgSCP3RCuVo6QBANafsGpA4WXrDB5kK1Xya"),
        quoteMint: new PublicKey("RyxqYpd1YwzgoFZJvSUHsGN7ShEkvwR2b9gEBZniRkL"),
        baseVault: new PublicKey(
          "9m8Y8Y9e4b3xSyWP98rMQ33Cc3MZEnwFyskpt9JMZeuY"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4HSLzXf7wqQkzJnx2MHXcyKp4uBjJmNRydG8qA2xNvGM"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "4LzNxb9GfkZLNDGrvGgsEnUHWKCJ1JWHpwqDhwM6QgGG"
        ),
        eventQueue: new PublicKey(
          "5UYvrwkA9fMfwdcNRQ7rULZhQrUatjx9TofF8F38LTHP"
        ),
        bids: new PublicKey("5bv5GLznT39EvFcuAbfSYGPGoK2DDrmDoyjHGJ8Xy4kH"),
        asks: new PublicKey("F2FSC35SRzBzV7CGhfYc5zniHiAbagCa4ngYRtfnoYit"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "iXqUdxKdXPhGZWwgCVHYkz7BXKgqpBvSXxZPSSn7x6h"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("B3CnxMGddhyhZQNEmu2L47y3NTd468rX3vuAnwgUcXzn"),
        quoteMint: new PublicKey(
          "HD4qxd6MiKJ47TccAyCkwxUUAzh2ASAn4rXFffoSTZJx"
        ),
        baseVault: new PublicKey(
          "7rr5zKUvokroJrxhqbPShKC9aNNDrSfB2hQi9XrG6mcU"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "889jauKwPtTQi3Xirv8hR1yhc5bRXSn3RkRdT8KmyxqA"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "8EhZfVXz2TS3ZHqi3TFfoBryPqw55RbMfDNEEx3HhC97"
        ),
        eventQueue: new PublicKey(
          "AM3f7hcnYF9FLumzNtS57YCks7DgTEcRbHt2cWXG6ddd"
        ),
        bids: new PublicKey("ExhRdcb7Xfn7BE2HfyXEXR3kykRSrk6NAj3f99MU5o7d"),
        asks: new PublicKey("AiJjfQcDCHKQvv77Li5DFUcdDdAUd89H5FooNu4ceebk"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "kPBr82ZPnA11aDqzYnETEjAvMXdbnp4EYMAtAwswrYS"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4Sjzx5F6QNYG3pqNg1sjhAHikcoKhEJYEx38V5kufmGQ"),
        quoteMint: new PublicKey(
          "3t8t5y8jC7A1Ma4sk8BdiaXmvyRuPggQW7q2KVyNjLAT"
        ),
        baseVault: new PublicKey(
          "8BqTHCwZj5Rsk4F3UvpSuzLThgzDf7wUBj8shfRYuvyd"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EptFomvEu36ZbaEykj7qv4Wv6wr9bAfD58s7xZRJTVnS"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DjCgKtizm8VzcTPYyaNwZhzEFnRURDQE4sNfLqF9BwzY"
        ),
        eventQueue: new PublicKey(
          "BW2ELBP95yeCN5njU75fBGdx3J863J2KLWMmkXfKcgpw"
        ),
        bids: new PublicKey("FHsha5Siezkr9GE7ynRMyjAvVtqucV3DpXjiLHB4BsTH"),
        asks: new PublicKey("DXkJJvr7PzhNqVH9P7rceQgrK4iJuD3RFtZ5x2RXEH1s"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "xaUvcxxx8FCSAsLuLzTAAuJYQyNAzB2ngXRPNWx5jNU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7kVxyMiM8jDNXH7b6s3PpjAf3hgXHW7MQnppdyxHk8j"),
        quoteMint: new PublicKey(
          "FRbVMWnyr31vHK8dowiz5aebtfW1iDuVYBRDBFV3rnUC"
        ),
        baseVault: new PublicKey(
          "2nbYjEPMxqUBvwY86W88Qecm7zgGnbqV3jzn8pXUnBj1"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FCp9HCgVvsiZcRmJMVr2SQPZBnBAUQTG3p4NhhSGM2vG"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "FfeawUQMj99RvSaobzcXHooEQEXkrF1nbv6tPc9D25o"
        ),
        eventQueue: new PublicKey(
          "F1VT6yNGjHRV8HS7aLEFoFocJ4jM89HVpek3Djej8Doe"
        ),
        bids: new PublicKey("8p1x1LTsrFSWy26Cz8sWHrioranLhjTdoJvRs4CGiTrh"),
        asks: new PublicKey("9H7erARH4PvyZaNDNTsFYUJEMTbN9DHqrEp1AMVzfZrq"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "zpz8shN9p4HXA2PyVEsNYx5bvBDFcjWV4iLWKPKr82D"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8fXSii9UHBpV1BneQ7mmbj4o7Jzd2EefKBy9FxvwrRLs"),
        quoteMint: new PublicKey(
          "AiFBb7kzif4v6RfnybZTTTfWK7abpNh1wSkW4cerCLHC"
        ),
        baseVault: new PublicKey(
          "88hfvT9r6c5EWrExxpKUN3zkkynQzSVh7d2y7H38QBh7"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9uW1ywYgfiyRvQsJfAGzPefV9pHsuT2oc7z6Vmg6mFQU"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6pNGEoi4oFQPJgVojnFV6hV9ZKhfjP8oyczEZCrdCmwp"
        ),
        eventQueue: new PublicKey(
          "Gg2oiW4gPEQJcfapFCrHaQtckqsCjEKppZcXi787vHGG"
        ),
        bids: new PublicKey("FpQgB56fVzSiN57CEGYeB7P29PvdXNPf1uab4oCimTrD"),
        asks: new PublicKey("ny7DS2FGDBW6T26TAe7qb3G49UtzZoane6iHKGVnYhy"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "24Xhe6JpjjSNbTTTkAz9soXauGaBifmRGLeD44VEPTZK"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Fe7SRE2ofxgXNyRcq4BzJDaw1MEW2TrgRF7zFY9pH2kY"),
        quoteMint: new PublicKey(
          "8puCy4swFwfvnyQyZiLFcZ1rTZndnrE6PNNp2X7MKwKh"
        ),
        baseVault: new PublicKey(
          "2qpwN2gjoLEGejg2exejNbS2ocRSuAhPHMcg5XacQTQo"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3Wg13SufjSJ9s5hEjDz5GjHXWn5d5TxCjrM1A7Yxx5hj"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DQmTuSXo5nyCNZ7Pu2hGaujPkz2PJ5YW1xi6kBJ3wV53"
        ),
        eventQueue: new PublicKey(
          "5ZhqWDTffaUpqR2pcQyZjfrfAhQip2vB1XjL1YT8Achk"
        ),
        bids: new PublicKey("HKffaiyKsAgLnHZZMKYotPRQUhCyXUbQKkFf2nAt3CAG"),
        asks: new PublicKey("7RLRhR1jn8t4EJKuQQFMFV3opusjyR9XxSUFV59hpYEf"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "291qSYbwX9D3AvXVpUz9fdMK7RRX6ivmFGMmHFtT4pbi"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BU8SVEaYGmyYX6iNZ6Tfymy6xhKTtzCJwj28oMkeVNoV"),
        quoteMint: new PublicKey(
          "6sgS2A2rBvpDo2cCVd13ppS2TbJ26Ane6eZX1MRmMtwv"
        ),
        baseVault: new PublicKey(
          "AzkeypwugGn1GpN3UJGh1ZePHDvHh4ptqdQFtV4KjiDJ"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Cd77qD3F5xcXqLZj4k3Tey7BTxuK99BSLNSFuXtR7Rb1"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "64Ay5Q7FfJWWoVdnsQFi6gc2WhjbwLcb1uur1R3xGa9t"
        ),
        eventQueue: new PublicKey(
          "2nFjE2Zr54rcD3RnQxXomyGVGzDKGYxsXedH5zRjhsnX"
        ),
        bids: new PublicKey("H8DSfH6aEUynFm7YEM2BRd4Dm6wzVNeCRcrGTsZuhBRQ"),
        asks: new PublicKey("5nmPeMt4a3jJyEUrGw2XcG91znyaUFtaj49mxNgfyaE4"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65_535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2Aqx5HsUtKSBjGyoXTdERimFVZb4hppHFBP3oPqCb44H"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("E3eCyzJrgq8VekabtajGvDyWGfqW5WVSiE7hQdGx8hDs"),
        quoteMint: new PublicKey(
          "GMwaZC4ZMpatF3gNaaiYoXq7GqLf4ALpad2v9D7Sm23o"
        ),
        baseVault: new PublicKey(
          "7v4QQEF9L1ec7HBcwrLP6YAZ3rVpzCRk1Pvs3iQdijmt"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EopHiE5zsPkQJAc5PjwBk5TX1EtMScWxQp8PXY1Q3x1M"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "FmU5ixzV34KrLkPjbP2XTKgkXHjAC12d9xmBo3RWuDjs"
        ),
        eventQueue: new PublicKey(
          "25V4uanTYGpTdvGbSKwcU9yYg6YsBRLNftiuDTjvkdBh"
        ),
        bids: new PublicKey("GW5GARVX6TAyoUwRFfu3sQWb6C6CRqvT5Q1v58tdEacQ"),
        asks: new PublicKey("DxfK4iLSj5DxWKduVFb2HxXWcv7Aw6NtF3AQpJXMMK9p"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2MXdiKgZxP1HV4aYLP8pb3aL4y1KEJqtd8oeJV9jKNGD"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("F86EH355wsncYUtpaEtiLUN3XJZQUQ8FPYkV7H9kRNYz"),
        quoteMint: new PublicKey(
          "7QejaCQnp5wpDYBgn7Dk3T5eRgfusjBsgx7FSz9PP9vp"
        ),
        baseVault: new PublicKey(
          "3v5hbMFP7GBcdSngwSa2vvCdpQGDb9ohuSejWrwTQdSi"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BMJmooBHHVcfhxYR68XuMSqLazWmixrxhbhqLoHjczr"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "A7rQLZCyyD9fSEkURD8Qvecje378U2S4aYWfYGs1FuWM"
        ),
        eventQueue: new PublicKey(
          "CMDy9TVd76GxXghQJU7CPd1cKQGutdFPNpSGPKvrKAQ9"
        ),
        bids: new PublicKey("9qpNzVESXiY3SeATBWfhzDvH9afuCZZhnRmUFt795g9w"),
        asks: new PublicKey("2v5SoRxDY6P6vitppe7nVq5scWoWyMiyHRU1cXGiVwHj"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2SY3VqfEBM3NddgLPHMmXK6zRcSTo6JMnGvDinRdZdnJ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GpBAWqptzEMbTGVmjbtNRrqJYn7c3ywYL2X4H8A91nr2"),
        quoteMint: new PublicKey(
          "G66nJDWcPnoEYBnzSTM3wAy3DqMte4cxSAtpxYEix49c"
        ),
        baseVault: new PublicKey(
          "5bQzsH4MRCPcx9WLNz3WkhmxusCGT3qWTdnMB8Bu1NXW"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "hJugq739UH8Epw8Ux1TZhYCY29kjYqe4Svbsnoyh6Eg"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7nJ35kw3Q1yt7EuqyAqm2ZWCwis9GB8drpMJm19HshSy"
        ),
        eventQueue: new PublicKey(
          "BSKSQedTxUkVJz2PdXuZadt16tGURXUgDvp84cWDK9jC"
        ),
        bids: new PublicKey("CBJsxf3Vikg5zwyoP1UstJgXBNTcJYD9Nu18DZYrcWkw"),
        asks: new PublicKey("D3qewfFGM6JsX62t1Ea7F15LQQv7i7TStqbWHDQ38Aoh"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2TYFSP8bq765fjB9zF7ifpok5Xnjxs8gTfPLUnUZkt7X"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7PN5XDaTPmaZ5xuae9Zswpy7kxRyexsU2FPAzB8ukfEN"),
        quoteMint: new PublicKey(
          "46HzusWLxPKnGkwromhLHbRfKTQdBPKsxFkKaYx2888q"
        ),
        baseVault: new PublicKey(
          "2TDnYsDPgzSxg7F9A5VuDqf7uoUURuf3YkvXwmrzFrT9"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FUzAFFtFYKY5RFGpvu6TzLArv9dtjm84fDYg5vD1E48K"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "CeG3AqR2bFvCF9YyuNabArnYBnTBdsu8oKRXUHvMg9g8"
        ),
        eventQueue: new PublicKey(
          "geTfgcF3VevtkrUPCqTmid1sWaaxycdg3LyJrKctBcT"
        ),
        bids: new PublicKey("4GvfmAuph5vPxWCxdXPGSFBoJxCKUaNttqMtxL1jkbT6"),
        asks: new PublicKey("5Eu5U6trBgGQw3kFuaH6H7xs8dHJatMFakQLmNdzLtnC"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2mSXWP2qVUQ5frxY7XwHmKoMuBionEeXmgpb14sqsWtG"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("54xGmem2NfPt1FpWa7KJY5CN6T3iH9KWeCPS7uCJTNVj"),
        quoteMint: new PublicKey(
          "H9mJp3EAWm3G2v98YxLRWEZiH8bTyUABKAnQKWsWj6L9"
        ),
        baseVault: new PublicKey(
          "67WpDGzbLMoPqgW1hPX9W9AeFxwAnM5iJhW5JcK1i66e"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8HhtC6tCFt3uGtgKKq4kBmHYQntVbVonL3aumK21Ma61"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "A5rP9Bd8qT9XcrYBMfTRKKFKNU9PpoAgAb9nsAkZ6Fna"
        ),
        eventQueue: new PublicKey(
          "D4hfnMoAiNGwWbpFX8FYBhrqu36vTC1ba1rvgeFoiCrs"
        ),
        bids: new PublicKey("7xTh47rJ7fzjfduv1bf4azPkQqPat5SWmkTBEZCoC1zT"),
        asks: new PublicKey("Ex98ujqBi69tjsgXsCQ4E3mYV4Jm7ERnRPQMAWacfQF6"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2sbpDwyUvz21UxVwJz2TzcMfDD283X1kFmtkV86G4b9C"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BP79C7hAn1aR2x742ZYyKBGv8NYWHZSvPVnyPrxfcCPG"),
        quoteMint: new PublicKey(
          "4euZN47wgsGJ7pFRxTUCUiJBVKX2LoZKysQi9wrFcbvn"
        ),
        baseVault: new PublicKey("7MELjRTxRhYEpbF9YxbokjJ9Fh1WAH67uiuQZULmk9R"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "B8K3Cq2XYQ2TEBMuCR83i3qEH61PfEtpkYhuetACCDo8"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "HkyVeBLZrWMMyCoeFKCrFrsZSf5iuV6BsXQM4qH2kpxJ"
        ),
        eventQueue: new PublicKey(
          "6niM86dfP8cytq8CCzstNfYSywo24qSJVK7bNvR8c29c"
        ),
        bids: new PublicKey("GBT4XAr3aWWzwkuDr6gCFMaMskSedxWAgkjG9s5Yb4wi"),
        asks: new PublicKey("sfaKnQ5vyn2K7dGqyBhHPp4FHFHMnzA3pSoAQrT2GdN"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2wCLHtUar3Z3L2n2REYpt9cn4azFsWbCxXGeoYJNNEcP"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("XbiEstFJyM3DskSTRozB9mpUoaZEix8i89YHjhdqwui"),
        quoteMint: new PublicKey(
          "DexHs5fhJ8RzSF83vaG5fqpNgtjntBua37qNeuMAZeta"
        ),
        baseVault: new PublicKey(
          "88qCwUng1ipj9N7nXUKC77jrTNQJpNNeSyY1NpDUDSUi"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "G2YT5C9yruvAnKQ8B86p4C1RmDJiGk41ubvNLyqc6DbY"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "BdRKTZpLLk38oNeCnFxEsZbtG3ufT8KRkN6ZW6vsXk2K"
        ),
        eventQueue: new PublicKey(
          "8ivGb4gpi9Z6vGReao3pa6pwZNiaENfCp7vd6RybtajA"
        ),
        bids: new PublicKey("98Nq9fUW7vYwcZwUBZ8ydgsqP6rgGo7raD8rFy1ZJb9Z"),
        asks: new PublicKey("BeyPTfwS3Y3R9QDZ7qwU4cT9SiQnXCJntTgYT4T3YeUU"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2wc8UfBZfC5i14CbwRDjbfKMqKLiXmbxANbKB4g52LjT"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CKVudskFppsd1P6i5UcbhGpJA7MxiciiF4pF4GYGTYCZ"),
        quoteMint: new PublicKey(
          "6YA9T7wuN8cnHYLXamzA4aNugr29xRSQZT5rVXQHYgGx"
        ),
        baseVault: new PublicKey(
          "9FLjRLT8DQaPNEctGh4bHUzH9kmr1Hqyit5144BjBJGG"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2xP3CkaU6Kawa51uG3VedY4cLx5aP8e2kSagb1tEDUQC"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "En7rmW15tiS5HmJfpmoRaffoADVwaYaaN3f2Sv1GUhJo"
        ),
        eventQueue: new PublicKey(
          "4241ytDeLzpxgJ2qJArsu7TxF9dPKWBj4mGZJvfScyi3"
        ),
        bids: new PublicKey("GfCaKRmfqje4uXmTc94wZc6KMrCpzDu5qWGNQ19yoxeF"),
        asks: new PublicKey("J5fx26kYojAZkbNF5j6iThFJHCLLmKByWdgaJpa3npBf"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2ztd6bXdTTu7JeYoGGJxYunZYje1GqHWGXRhdZkqZ7HJ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9aLJoaX4sx8QKDrjPLuHD5PyGWDAcBds96fmMbvafZZy"),
        quoteMint: new PublicKey(
          "Cac1hUFvdfwHBBaeJ2r1wtYCfbDTRda43A2K2Pc8ZeAi"
        ),
        baseVault: new PublicKey(
          "81Je8g22GDoYtivcPLsFFbT3YELkt3A91UKufqzoi8yv"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "28RzqQZW2bqN76xSzy2zFESRVQwajqbHo1Ab8qvydUUs"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "J3Jr7jtLSjJFQ7RiFcjSM8c5Qsi4wpyW5H82M89QtZuN"
        ),
        eventQueue: new PublicKey(
          "2WhVTUmU8bWiwrMr8LqFVdwc4sVwkyqXuaoP4KNgiLiS"
        ),
        bids: new PublicKey("5yyQsdrjyQkuNhrJ3KsaHoDx3gRrefPWLcGQGJWjzus9"),
        asks: new PublicKey("DtStzcbk3wBSREZCA64q1SUMBDRB4QbdoaY5CYVQBEAx"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "31GXATspmQ2sM6hJSvDUihJuDxZrsRNYjA3tdDFmm6HL"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DeTqMvagaNDR7HzjDVsEYoi7qneEdX6QDqBnDFHTR9hq"),
        quoteMint: new PublicKey(
          "DN5vTJCf5YBkzcNXTzWaPS5h3bDpcP8AmDjYbbHZoowr"
        ),
        baseVault: new PublicKey(
          "GPJq5vJsvKwPD3DxU9X2UuPFZ7XVsJiifPnzZdFAxqNg"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Hr1VjV3TfBrkwZTeGGpn6ZZniqmyFeNTcB9VkEmGDUr8"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "A8s2qCuwZy1DKtHQUQJBKcQMA9BxwiGRb454qNQPiL8F"
        ),
        eventQueue: new PublicKey(
          "HCvUtLd9Fm38osA5K9iiKBJgf9wi2vQYdQwGFLbcKHLx"
        ),
        bids: new PublicKey("3HMGd9NeUHk9TrNGppd25Hrqna1d9b8pmqNEhssgAopB"),
        asks: new PublicKey("5EZSKJixUePZDCRsWRUcySS8ANJJdn2suFyXrDE5pX4C"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3bshK2PU5Dv8F3WkHJ1EKSvjnNRzxUPgiSd5igxcG5NJ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Fj699PTEiRDGqiBebhzwm5TKGUewbAadyU9miY3LsjiQ"),
        quoteMint: new PublicKey("xbtUcdwQEG3gjjvGJP5nWUjvgiCkWHcNPFozb172HLS"),
        baseVault: new PublicKey(
          "ETnrEhrk8oY7kJq8r41ogoFf5P2qWSXgfteS3a47g1BR"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "813KxdTwoPQoTCpKHpHTRyrskh8ovwfZgP79XjWragMi"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6WcoX13UxtSkursweRiD4xncv8qro2U3oN9F8Wji91Ym"
        ),
        eventQueue: new PublicKey(
          "DKWsVGY4PcN5FqTGUUf8nuNyj3s4kJdgVkgAu48YsE8w"
        ),
        bids: new PublicKey("C4v1jprBypP8XUKR4Mhi47QV8Jsb8pYZW5VWvTwCPE4X"),
        asks: new PublicKey("FawYwbKhgaeUcT4XGrp3zMoLZ1ak3LJHt2ygGNqX84qK"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3ubhzPcuqMRKoCrBSxBL4Nnh492sipqaJXmK8TugWXdJ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DHALxCahVckZxqt7SzjG3tSTnpydpJE2qsFk7axVDhMm"),
        quoteMint: new PublicKey(
          "4B1DVNsjJbVRJyeFFfudQ8phHaXW2CdfG8RYdBiNdC3A"
        ),
        baseVault: new PublicKey(
          "6kJkXA9ss3dJnRiz7nPk8UgpZgXETzzJFXHsHaN2JK8E"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8EyEyZqDAhhh3BJTTApm6jkrTyWgvFf1r14yyB8XeLa3"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "QxVP3LFd1EEY212LBxL1fQpypGt7YPQh7X4vYk1XAKU"
        ),
        eventQueue: new PublicKey(
          "FGk1xV2qDpGgtuBSokUjCpb37e5fv8wDVaCvK2rQBmtp"
        ),
        bids: new PublicKey("WXzAVceEYY4ugygSzWtKzLzEMXy4kQcbnq75VhaAVSf"),
        asks: new PublicKey("EMgwBXyECv7nKjrifjwt5NdoJKZPS7TCvULPNB7XN9HY"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "42JyKA6rFvx7W9FVhuvc2pbkHqA5aX3nTJNgSaUyahtc"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("365uDR5ZDUpok52D5EK7SM5KWLwJwbk1fAY5UEAD2s1N"),
        quoteMint: new PublicKey(
          "7GfbdK9HJ2z63mdhBTmenbUy2QCUFdPiJ5KpVLHcF93S"
        ),
        baseVault: new PublicKey(
          "61KaxNRtVdwQcn8iBhAN5SsU7AyAeNVcbKoVet2aCY7i"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HFx1i4xzq9mfooHxmMD6K36SNs2vD2kMKr3iBcM6cHyB"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7WETFRVFgBXafssd8Zf8rNQMwy3g698zycib3wVj8VpM"
        ),
        eventQueue: new PublicKey(
          "EExaaAwB7xhrMRYE3EQQTGCMPwpwx5VmV9viBbhAY528"
        ),
        bids: new PublicKey("D211erH1HYFDuy8qHcKZoTP4Sfdw23xqaDdJTsBdukqK"),
        asks: new PublicKey("3ScM1zW7icm3EDm6xW9ePvpEv4toNBfBnDT9vV9H9iVd"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "47gMGPnegThHbfW2h5Fyn7ud2QEaJAqXwtxRVgQzHZj1"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FSUWjMa1nUzqagpEF8LHrvaseFJvvJ9mVntW3Lxtgnz8"),
        quoteMint: new PublicKey(
          "8RuDxT22HjvmefNpr4sypZMyHEjDcxgu6uEyigeKE9kK"
        ),
        baseVault: new PublicKey(
          "HbrCM9JsXwBYtrw6yciJ7S2Rdt3oDqasbWq641Ca1oW3"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "ASEmG5k1p717h8RwN2qb2JZqGYUUQBMmBr6fSdzLp17i"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Gy26sFE6ULSedfy9zXX7s9UwEY4mUAeeFRC5VAaak9u"
        ),
        eventQueue: new PublicKey(
          "CGXSxWWe4qs3Gez6sdGYq9BK42qtcjV5QSr1AAgzRwWi"
        ),
        bids: new PublicKey("46GUWqfcQRB49k3R5J3kazYCKsz3ZV7caDHsHHgNK499"),
        asks: new PublicKey("ENi5UcmWw9K7ttAt9SAGhqL2mVVTvUbkhS4P7f5YrnhR"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4HiaaHEDb3aq6YtJmwcbzBnN8VVXRm9rqT9ctNpvydVA"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("AwrtNSKSCAqXo5VzjUiXAUUtmEFS23VTnEG39rLvSA64"),
        quoteMint: new PublicKey(
          "FFAbgS29fQytJM1VZXvviwudHSMtJPGxzjog3FbDVeY3"
        ),
        baseVault: new PublicKey(
          "EQiXUwDjScbKE993bB7Fhbu8CM5gFrDXQSJBWkpcH1fz"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "5UD9EZ9gtLHBHJqu2ZRD91n8ASdUSTShunC5gYV2QJFU"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9ezf39BVZ6dQrbUHF7V9yfQ5QAEGEFv3pPNwRN4qvb1s"
        ),
        eventQueue: new PublicKey(
          "ExS3AHLNxRxB5ewaKTBZJjHSUhfnKX2R2DVizC7Vgosc"
        ),
        bids: new PublicKey("Dzig69BwhK3hsGHLs4AKSVAEGHKb48s7haJqth7CruZb"),
        asks: new PublicKey("BAXmiY9UnysDMxVH28k3gPC5JqiBNAxjjeFWf6C4FBLS"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4LNBeAeBRGk6XGceczR7Vb7VaH1KTqva49bYbKfujM9m"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BUKc3AoeqXe1x8JbQQaCqGF5akUVPe78NTxAyNjuqzVY"),
        quoteMint: new PublicKey(
          "3mzcZ3xFX3To6ohyj3oku1ev5Wvs1Z7DdUCdmYLrLaRd"
        ),
        baseVault: new PublicKey(
          "DAF2AKqjBsMPEF1pCMfgdetDCeSZh2h66htJAioqwN5D"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DMG9H6uqpXeca3jPfwuWEHxqM8hvefPjypcPQVpRKjbi"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7Auwo8Qvw2CUmxW9pEfXkGo4XveJfbfhufuYjJScNoSx"
        ),
        eventQueue: new PublicKey(
          "8GsQZoJqSc4ssw3JReTKWdVQbKSYnEGEVLJYvBvTjWhF"
        ),
        bids: new PublicKey("7QHRWcz4kxS6C2cg6ENsnA6HLozTBVbGxtTbFfWTCmRh"),
        asks: new PublicKey("2QAoymzxuCRDEtyqHQkBm83y9eV6XvtjDFp4cJBWmpqV"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4NKTWx8fM8X7YVm46GrbvLEH3uuCNBVL8x7TG653SpYm"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8yggSWG9R5mr189pkvi8wtMVaJQSy2REb2GVS5Uvd6Qx"),
        quoteMint: new PublicKey(
          "2jkwmVBRvvd3YfJgVg5Mc5t5wUgvedNnBGrSCZAUgAqK"
        ),
        baseVault: new PublicKey(
          "B4A3yG4wAPtc9p2AWGbBYLsfAdZBDZFGzW3LAi9ohLjr"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CnpzBQgF7v1uQ5Yzf6ztG4V2UtGZubVJRKNA52Vasr7o"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9VpFeZz5YcYuppzbLLmSenjqHbMCpnv6ePmFBHJ1vNVm"
        ),
        eventQueue: new PublicKey(
          "HWNt83g2yWhZWasVZJv5XagxsdhpfVAHKorhJsm6cq1s"
        ),
        bids: new PublicKey("BxDkUrDiEMXihu1BuqJtSC4Gbwbzshj19oqojMG118zv"),
        asks: new PublicKey("8JK8ima2KWZ7NLT2Xp7Kpo2jxi13bBbBYt7V1BTvuDsU"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4R2ZCwHcjV1ZzoxMtgSYXJKFtxyT9aLmYArtwwQgi2MM"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("DNqrwbvqU6k2kJYeST714Ahusayo8DXhuk9D2NpDwBFA"),
        quoteMint: new PublicKey(
          "6myM6BKQmnN8WdEyotkUUKC4jUZT68yLdhecjEQPg1oF"
        ),
        baseVault: new PublicKey(
          "ECECNbQHSnNNMNorUEYZoWu72LWz5zEhqiFhEVxhTv1C"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "62pRK8RHR9s3RZx3d1w55ybr3CYn2g11ZToMh9Nqsy8A"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "8kgFk1Y6S82GRUyXTMcSsuXSRcfdSLFobVMWECkQqbmo"
        ),
        eventQueue: new PublicKey(
          "F8uQL3gJoVwfrZT1kDrufpyeLZgbQibKPpPcd7QAVVVS"
        ),
        bids: new PublicKey("7C7DC9AMkozYUSivajq6FKktha14EooE81kKvCphGTMo"),
        asks: new PublicKey("CFSYwKELSLTgpcVkTgM6GXaqPFaa4KE4mk2mix6bGMam"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4TL6MBnyRDCM61drDPZioxrKsxEUqNkGnKYjMTZn5wzN"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HsWmQU3tn7Hddtifik8RQR34VRxfHgbjj1VdBZVkVBgt"),
        quoteMint: new PublicKey(
          "7bDXbwsnBwVeRuok5zKkqcBpGC1Hr4XcGEbyh5NrR7TV"
        ),
        baseVault: new PublicKey(
          "6DxFda5YisiFMM5Ni4oxyyDJ5cW5LvXD5AyhxecvrTxA"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7gctzzJTt3eZaGxHyRBH4q2rBPCa3bm83G2grfMpKVrH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DztSGa6UFKZVwmW72Z2Q8UsxL1tLFdn27s8pgQySZ6qe"
        ),
        eventQueue: new PublicKey(
          "3yvVQ8ZcuSu7Wo8D4TDFoRYudnGq4feqYTDgcGTpNDY8"
        ),
        bids: new PublicKey("CebC2fYG26UYXLGXHBFtFmgiF8y4nndgeGmv6XYHWKqM"),
        asks: new PublicKey("5E3tVmG6LozwQG5dAkiQb3ErDGDhMrQvKeKdLcf6ZCsg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4mwdmADsHUUW3z7F3HfMqF91ucWz2XrGG1L8tCs1MkPD"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7PJ5gEv7GzPtqdZmBZmfh6LVAPf6FBn99HzjxAiSEGG1"),
        quoteMint: new PublicKey(
          "2mQUqCseKZWr4kQMSQiFgs5XE7pxKj1oBEvUTJaFPf9Y"
        ),
        baseVault: new PublicKey(
          "9DhyFjjM21PAgYH13bVgmZyj2sddt4bw13s4cvpHFCR3"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "adH2vx1uTA73V4sBRGxCjzWPBYSP7twtffnHtFMxiVn"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7wGj7V4SNS7LzXrDoBotu3LX6dggNSY6KnWkNpu176jo"
        ),
        eventQueue: new PublicKey(
          "73Vq36x4X8LrvCJ51GuyJ5ogkigTjcw5F8uhwTZcuKmF"
        ),
        bids: new PublicKey("A6niK2m7gappmpVdshVr5zp34awr7evUXUQFB5WxMP2X"),
        asks: new PublicKey("C2QbHSiaMLfKmgRtTexPJysttsxrPhJReVkyjtiApVrg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "561BHuqd88wVT6qr7oKs41juLRTWoK5Wu8MUvmxEQp1z"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("46XPdb3GJD91hUQycTFFSY1gsDgiY1u1adid6UNdDwkM"),
        quoteMint: new PublicKey(
          "8EKw94G1gqXMZX2DYfH625Ph5bVUdMHHgfLFR8VzgLtK"
        ),
        baseVault: new PublicKey(
          "8uN571yxqeq7EJSNhkMrwuS88uMBa7yZuKRVVfQzjBAw"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "dG6rAoVDDEBeszNfUf4DCzTeHzxTNnFoUPvthTzQfXq"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "B2G5aFDswdfae4aMgS6jZNDpbB4AA7F6yJEZuSD69hYB"
        ),
        eventQueue: new PublicKey(
          "FNVHXQN238azn6gKbkKe9WugC3dYe1nS9bHV4KdGpoh8"
        ),
        bids: new PublicKey("75W6PiRm5RPLQvFHE9YdwH32vZRgJCCgJgVQdaFi6aM7"),
        asks: new PublicKey("CyjorDzk4tRzwD3xrYvuShGVF2vHU2kQpw3feMgHv8qY"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5DjvbdvoQtGHYeBuzvo5H1a8N8J3muapN2ytt4hi9bck"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4tqRYRmFsnx7JrbC33uVoFZV4aU5HtiEA87Zj5yGohtu"),
        quoteMint: new PublicKey(
          "J3fMr66ffZwono2UVreRmsDy8gFebS3GXLA3rqUnBRq9"
        ),
        baseVault: new PublicKey("6wfxauvJRQoSCZieAXkFGyN7x5jkV36nm1MytJs16cv"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "CMziiHEsJw9kW2anrZbgho8QsyJ9ijPd3VxaBsESMf7j"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "BB9yCjzxhfbL7YzHUPT8bzCMXGWNPx41Fss5ccC4XNaP"
        ),
        eventQueue: new PublicKey(
          "6cCbHBqq3HDf9p7WY8XWZpSPZDRrSQ68zQkVnysH99BH"
        ),
        bids: new PublicKey("3J8M8qSgQuknEnfUrAUcs5CMQfQxbkQx7Y8KC9ZWCsbE"),
        asks: new PublicKey("FRReqdovKjrU5EmV5e3AwrySMTK9K2d2K44fVEcTxfTR"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5VWopA9cGbtLyuwEwD2qezBZ3rbDMaFNxjVTBuRKpjWF"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7qxeLAfoajxjrZiQLhRYXcFB35R8v1E6fQAfVq5SH9xW"),
        quoteMint: new PublicKey(
          "3LzhKZMYfPKQCLWByRs8twS5mUVGK4SvJPyQQud7xvfb"
        ),
        baseVault: new PublicKey(
          "5fJxJgmHLXtzW3aRwKznpzxCwbvxSLmgDevi5o4Ho2f4"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BfXRGAAbmBx4Mak7Vhidk1wLgr81D7kLR9qyzxVuYuSr"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6tR6gn4SqfD1uirxNgSA3r1KXcvRkNR2nodx7gRyepsd"
        ),
        eventQueue: new PublicKey(
          "Dpnfmyqy9SGX8WtXAazopEMEtmD1mx4TdddgaWgDLEvE"
        ),
        bids: new PublicKey("Gs8z8wdMQNVY6d31Q39zdZgf4pj6TCdTHbXpW5ZdEdis"),
        asks: new PublicKey("9AhafH4YRBCwn38ikEtqYvTt44JZywjhtvukVQU71cTm"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5hbZowaFSakXZv94ZqqtbTqz3TRxs8JnZv17uQAn7KUA"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5NYAWFAJYhBwMS3UbXuBNs2RWmFD8JpcTA7WbVrP89Pf"),
        quoteMint: new PublicKey(
          "79LF6AfoJts9B1KVBSVEoZPFa6KPziTyaFQeKnqbNwxR"
        ),
        baseVault: new PublicKey(
          "7vRU5kBqy87bDsFRHC1c4QvW2nSx7HCVnLhSDdtsJurV"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9HqSVPe64QsTqP4ahamc7gLbEFV7W5KkgWTrQcytc1Q3"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "CFcVkxz2aYSy4LgGY2UvZoEyvBiCtKgTGdHoAEHdb1L1"
        ),
        eventQueue: new PublicKey(
          "HyGaxXVkfZr1FoU5bXiB1AufpTiPENyS6cnWCiMqxhji"
        ),
        bids: new PublicKey("C4DaUUzrd5JY5erL5uksosxffGNo5N9FkfuLcXUd23XU"),
        asks: new PublicKey("CWuxj1Xd5F3bx5uQJcJyHwnb3BDADWopJag5y15pZvUw"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5j6vNL5HpoN7XCCPb7wL2NpZNVUCh1FVAcZ5UFg3tbnW"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5T4Gp7p7wAqEqc5XdfiDGmfsBjFCMxnARxpHJ7SZi25D"),
        quoteMint: new PublicKey(
          "AZLC7NNnJkSJfQEGzLhgkixKmPxTQzJzyoSGU2WYsJUW"
        ),
        baseVault: new PublicKey(
          "5P8zaBgMqyFxBpXt3cduS8RsxeAwZfjonxGnvYivrm1U"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "J5nnwS9dm7hZAwNjo4MiysYDH59UxZQbEgCzG67sLRBV"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "C1p8En9PzmhCfw5QgHxt1ky9Me8DQHZcoGhEyauabFNf"
        ),
        eventQueue: new PublicKey(
          "88ujZ4wUQU7AEEHYh4KvTb3jfqWR1dCLEM8w14RqZVCA"
        ),
        bids: new PublicKey("9NnAK6cARGAhPVCRqQLz2Sx9SbrTiWk6qNkJFugxmxiC"),
        asks: new PublicKey("GLKNg7gDP1y61wpvCXc8TuCuF3hJ75rxfsDVh5kd8AG1"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5yoY4iZZ1vmyzVL5PFvjSn5bg46YSqpQYnXf5S3zD6js"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("2udaqX55sSC6dkCqQDJQ1bxprwThVmoT6MASoDQ9uXZ5"),
        quoteMint: new PublicKey(
          "FF8iNa1n3YVJcmV9J1Q3QTcXzttHCur2bKtCkLLivkHT"
        ),
        baseVault: new PublicKey(
          "2EerBwNE6s4XJJPdLgoX1RoWv6hLuXAJZjoD8YFRWHjK"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BJ4amerUddJjwMcaYMoZsfthEtQ34JC2R3UEoNEgmmmm"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "FoTd5ofJFvdEe6jCWCSAYofAhs4s2V9Dbz953vswe5p2"
        ),
        eventQueue: new PublicKey(
          "H332mZz5EWy2u6gcCkTNYHxxyYCsyHgyBUjtmZCmV3TP"
        ),
        bids: new PublicKey("7BFSi1zFZcALH2AQvGfRhV2v7HFGVbzR5szHx5WdSbSr"),
        asks: new PublicKey("A75rG9cJdMD31n4h8gSHWQVFM5NBY7eVeMUiWaFuuBBw"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6Cstm6XMhzo9TgyYFH4c1tMVW8bCv4hhNpFgAr5nhtzS"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9HQ6UctXgGKRNWVk4tHuV7eSTNTRukoo71h9vx1x7hVj"),
        quoteMint: new PublicKey(
          "4fr5T9rRf8tJrZHv3CAE8p91zmHs5gs6EEprQ11qNvkX"
        ),
        baseVault: new PublicKey(
          "4Zw4Su1aQr6vtDkh4xK8WUUoHEHEpVc33PXVRAfK12Zh"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "AptaAwRthYipHaCcCTcVa5QGFz5HAVuCipcAncUTvRwa"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "21VrZeorLpi5v5rWwGR9Pi9D8xzwCk4A6qenL1PZRJNr"
        ),
        eventQueue: new PublicKey(
          "ErQTUA91x3YjcfLMoDxoLV98JcXGbw22Mhazj8LKeEgt"
        ),
        bids: new PublicKey("A6jnmGHXYpoLHjEeYKGfXGzEMaKBBmMVCC4qbV5NnLUr"),
        asks: new PublicKey("BJ4sL8BK4kybAcNP7LqHyByNuVDSmc53NVPWKtmh1yqz"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6Luk77jcRqBG9Axy5Ekm1vR2iv9f6WhXMAiKD5YeyvS1"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HuK6PM1V252HkEvncjLvQfMdXzyds3U3WoBhwE62gQAK"),
        quoteMint: new PublicKey(
          "2RBpju88JLPtSMWdbotqvdQDSeSim2pZ7g4G1aYW6oT1"
        ),
        baseVault: new PublicKey(
          "Fq6wzvz5B8ALymLihmNWYZmVMUJAMZg8qifiBSvdQgdm"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "6axXkoJ2iMGXnz8UyFXoWkf84NuynLE6NiSbGFqk1DB4"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6xGQKQJNDd71WYrnDyfdhCovqNQJvh56hZ6vMsZxwKvb"
        ),
        eventQueue: new PublicKey(
          "9a1tHyAZTcWKi56t3kSoKaYTo2HQHEFRtERLGf7jaSzG"
        ),
        bids: new PublicKey("Gd9KNGyciX7GxypoHHedvK5dzR75RFWaU8sJrBcaTEJ6"),
        asks: new PublicKey("HHiXQuUnAf2Kyh6F8ZVXrEcioiuHbhhoE1f71WTzXQo3"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6RDJGksd3uPgBDvwKGVbpBCGbgiz2y4RjE6dDPPJEQCN"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7PxGAHHLh4KUdsitJ5o2iA4qJuNWHE5W7ubUnw2Locve"),
        quoteMint: new PublicKey(
          "5Gd4ES4bBEFC3YAJjaGh2ZswLZY9RcJrNtRDVDBHpJxu"
        ),
        baseVault: new PublicKey(
          "EPqGR5buARTVHAqdM4tSVYNn8TVQ6nc2baydiQRLc3hA"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "5hvqtDyyLD3BXxsBpcHSVivpxRXCX8aZjXJR3tcvmTYu"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3JdoHZS5D3Cn3HAEFSUrmnhvVLsjgkTVnoA9kT7mG4QV"
        ),
        eventQueue: new PublicKey(
          "CHePB8scFtMmFvVv4wYb3PbBU54kWKZFPAyYBhZa8mx4"
        ),
        bids: new PublicKey("AB89XmYqLhgG7jBe15pym1A4pzoSE2hrZpugaAyADcsK"),
        asks: new PublicKey("8TD45UsxUzAyJgbmodyVZ7zW68PhFSQW8QAVwzuGbdGW"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6bMddbCfLQHbaooipQU7UbycsVw1Ri5aH6bXGoR2WkCA"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("2FSTWzpWcj679kVuyPLtDcgQpMxKqs3RFzGiyQaZ4zXu"),
        quoteMint: new PublicKey(
          "CWPX9iJVw1zWtTevxKcrE9ib8QzD2XdtxsfUPzuyLyf5"
        ),
        baseVault: new PublicKey("DhnM3xfzfBq8CdC5VRW6pvn6TNXdriDxv9ykYBVM9kw"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "62YqUVwynDVpvFacJTfw3nVuSr1X7stLBo9VfdGSju6A"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DzLkSUTRSjxo4sLpdodRgajmTNkA4Z2Sp2K4LKeFWLsr"
        ),
        eventQueue: new PublicKey(
          "CLSF1zjUqopaDSGcp15aqbbTW5vUa2FSYEwW9DULK4Wr"
        ),
        bids: new PublicKey("8bt5FUwnSwdt2993wLwtAQEiuw5BF4nZmYhECMBXxS9h"),
        asks: new PublicKey("5HvxLXzFZq9QGBLCtoGTPw7M6CBfii7S12jqUFnNkBDZ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6c59VbMQRijR5RqkaHSgJn4D3XNpDqiCF1xTtsskfwwf"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GHKb2wL2i2UDrAsZidghFAhQ89sXbQ15yvN51YFGyeuo"),
        quoteMint: new PublicKey(
          "C9Yzx1o9STJD7fstgBf4QAP5gcAzLYwbAoStkgHiUH37"
        ),
        baseVault: new PublicKey(
          "8iuyepNKvPZyvDaePP3Z24kc8k3hUuW7EG65j6da9kHF"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HcUiTF9VSayUUKW3EbG9yDH2NsjLrt7CK4kXS3NqbCtB"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3hFtrLWbiVSUzzhEZ8wS1tCaK4deabQA7AqKE3MMD5HH"
        ),
        eventQueue: new PublicKey(
          "9enBpjCijtVPymyCswv7Siar8XSkWwawM3bjHtjGg2ey"
        ),
        bids: new PublicKey("8jJuthDvsst3biuuPrBde27t3XvLcNkdw8vMaGasss7h"),
        asks: new PublicKey("FeowLkJMT3zaypJdHG8f4AijyUUgMQg2vk6Lkdvu6fGF"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6gQ6viSnFVDYYLoGPBnygFWUZxKPoN7Akx8YS5npuCQ4"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("BpEEdDG48T7ZavnafEy9ZuiBXqRC3t5AcAecgcMmDxdZ"),
        quoteMint: new PublicKey(
          "7WAAWSqMCwcLPBrwdhiBHYFieJiBNuJA9QRAhdekRi1r"
        ),
        baseVault: new PublicKey(
          "DvsYBUxn4TA86F2ppjxoeYKfvcK72jfRmAKsdDjQx8yF"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "56B5991jC5WdS7sGshkYpU8dNoRp77jg9dLXzLuN45Q8"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "FTPJwrp9VvSXz3oEe4nrTEUxS1q9XNwXX88JpRvxThZs"
        ),
        eventQueue: new PublicKey(
          "AJr7xgfU8HPidf9eSeT2uogYMS33z777qoGtJ4nVkxAK"
        ),
        bids: new PublicKey("2pyKV7RHzXiXiLEG7arf8S6vmNgi1LPCJNTnmTFHhcXh"),
        asks: new PublicKey("75jYK1xt4wpHR8GSomW7RTMh6YGzKbpsVXM99k1pgRB8"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6s9iK8g6Jci72Te6KQNeHmFNiqMfHrxPucNNQUNV29JQ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5NANBP7f1kfzmUhNdghpKW6GDkM975zkPWayChN6rtQw"),
        quoteMint: new PublicKey("ACB7F4cQphDDRo3pmUHmdBHcmumA9DQxea9XxnrdRYb"),
        baseVault: new PublicKey(
          "76agUyMyk2bm4jgmdF5v8nVegqMnZvVmzzrmzFSF6Sq9"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3vFCeaKqR6s4o3xkvQAkgXtTCW3c3SihBGsgRUbaXj9S"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "5gUau9r4DSdsf5N4frj4KFiYhQWjpJySUj8aVdSQPQXn"
        ),
        eventQueue: new PublicKey(
          "9q5QAqWd5ixAGyE6cMn4LpXVLB1HeMQW984S5hu33ybT"
        ),
        bids: new PublicKey("5xZapPEbH9D4PbANEpJrxoU5spArpjKpQ2Zv1p4gKuy2"),
        asks: new PublicKey("EdzM24uqPvpeUA6tfpf2vD4zNMWbpERrw9fJnEXmjNqL"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6ycoKTvmYvN1d3RED84Gc28LFJjETHMP7sCfewoBpfhS"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HX91nYbx575UJ6bUSaj8KA9UL1Scywpd62tnDYAH9YCv"),
        quoteMint: new PublicKey(
          "9TeGKcCfRmoXY33c8FwZBjA1pXX8fmCqK1nSwR3FVpLC"
        ),
        baseVault: new PublicKey(
          "4KyrpBziP4t2Xhqc4hu9xLhuCLuqkA2ZwFKZFLGt8tsm"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HrsWys4Z7P2PnaednU4SitTe4Y1ywGjUvbRLtWQRmMZ9"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7VM1QdqwhLAJcqJBdDg8C2bFT2VPB8ox2tdqazESCPiK"
        ),
        eventQueue: new PublicKey(
          "yAbB8uABzzsUoZACDqMzCtWGdc8WbRt5s1CDwJPNRfH"
        ),
        bids: new PublicKey("9mktxbAENTtiv1NFudJCB34Fyo77sGnt7UnbZGzKNvkU"),
        asks: new PublicKey("69tHToEv16W3k4zNFJiZrta6eieFzRFU7E1sVKUq85mw"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7ayQdHG4h9BQyUWGNmeU58UBPjQaVbkpVXPTFfx4pVdH"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("AhM1M85JmL77DeCcPVh7gCF9NP7bHuNphT9ez5g6aHyt"),
        quoteMint: new PublicKey(
          "6fBnX78rRMNS7ZMsCTPfjvguiBNE5zLdioGzLvW4zkcK"
        ),
        baseVault: new PublicKey(
          "ARTR2VWZcfSrH8GMF3JDBDm4TP3p2dBAvqVt7PKc1FFn"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "JC3Xn6TqkhRAQFKCW4grziLWKKZWmhit6om5zpS9x7Tj"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AyAZf5TynHrfBwYPbMkU9hX3bEHTQPokTox6WK1KmjWw"
        ),
        eventQueue: new PublicKey(
          "5nEDKv1NkNMPLqVpNKxYoudtuGXaQcsEXV9FxUXE9iyu"
        ),
        bids: new PublicKey("5HeLL4po1P55fmxKCAf67qyYuZPne2eKmwhib9QDSYzc"),
        asks: new PublicKey("4J1UEiwYNxL5fnbAGRcVERYesYV2a6XUKvQMVSxRBWZz"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "J5DTCqRAjX1FyzoP2A2HVmmaXuG971HJ8X1Z8Rvvd8uT"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("63DZkAzoDXmzGzn9esoWSYpMLo4YB9oPHXreHKwuu4HA"),
        quoteMint: new PublicKey(
          "DhMH8oRQoAAb6poHVsvCqq3NCMj6aKUH2tGQG5Lo4bCg"
        ),
        baseVault: new PublicKey(
          "DbzL5mT4nBaxuAs8ti4UeT2qougRBdujxa7GhLndM5Jz"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7M9xhY2ARnrkCaBK5SNM3Lyd3FdbTu2EWBwG4TQcqpsv"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6JSdqUr24mBt4MCQrZHRoSfeZbjgALx4MQunZwD8Uarg"
        ),
        eventQueue: new PublicKey(
          "4K1zxqAZn7bGAPN26W5mUaHrLMSpCk45gT4qVXwmfh39"
        ),
        bids: new PublicKey("8JSbFw4YT3bzpbbHs1wKmRCSAmKucAba7XSUWj1p8xK5"),
        asks: new PublicKey("483SmqGQVxw3WDwcewMYHqC3Mu7ENxfTQJQtTR3ttpi7"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
    ],
    ETH: [
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "SbA1HyoJb9HHn9Jp7tps6BKWt4efYV3zhhBydRGckTF"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("EcAkxMAShUxxd8HhtFqq5ed68r1B24KeKhhTWJQTan9e"),
        quoteMint: new PublicKey(
          "EgrdQ4mVkRvRNh5vhYW2iNAXHKK2rWv7C1eSofkmfPBA"
        ),
        baseVault: new PublicKey(
          "ELrYxQVBhtNrs2AVeJ7gk8Hh6kAYmUFbEyUxj8mwBxVA"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "5x4CiQCFujCLVxYk7oAfDwmM8MpShX5Z3Nt96YFTXN7G"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3WkqBdunjKNaYfG72YYA2LAbYBqwbeuMcKsWxWGRSBbr"
        ),
        eventQueue: new PublicKey(
          "5BkmaeuSFChWQY7rxWR7duLoM9ea3GjcZ4v8VwCEvq5J"
        ),
        bids: new PublicKey("6X4zuUjS73zfnE84npyvNaCDU8U199dPcDmyESTCCBAc"),
        asks: new PublicKey("48VH3Jr8Loq3RJTi2pyrk7pgWb8DyzPduSrhi8u3ckVp"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "UoZ8hgiwcJD9VmhdNtzow24VctvuR7BLMfTkSsSHPho"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("7rpgok85zv5RBjmuhryJDFfcoeznHjtqZSFKosN7ragm"),
        quoteMint: new PublicKey(
          "9ABjNUn8EEXjGY3DbnuJCGCmh8iKqbBdYwYoPPXLPPwf"
        ),
        baseVault: new PublicKey(
          "23zEKWCoSw48CPHFdfseUjUbv8d8HSxwncf3GQYSC29d"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "89zWotzVTMY3iDLTh3EK6ZW8sQ7BoCxVih2mp6Zayap1"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3KC4FLvka2fJjEq92FcPXBWhdUWNWn5gz37TcFWjakCV"
        ),
        eventQueue: new PublicKey(
          "CTFPJRiz1642pWfWpGYxSqR2AtUgN78E2QgHHZC8F1bW"
        ),
        bids: new PublicKey("HjQHV8sm3rGdTTGni2WbeP6teA1926JQouj4gfouKJyn"),
        asks: new PublicKey("FV857bAvDpzAFS5Wcq85MdMitr7mC8wuCNPS6JqCgV5o"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "jWMwMmmC4fMPgtXH3PQGPzyVTRaV5Q1s67Db1NokQ1A"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("FnchhGZNDaXpV3rjqA6JEzhnjBpkLrgDMaVfZhnxv4LA"),
        quoteMint: new PublicKey(
          "B2DfhYYYmBhL7YH6B4Pgnw12jbvmW2hKTwWATFJX5B9a"
        ),
        baseVault: new PublicKey("uojFy6Yx7eXQVxEDJSc3RETgmAkzKRPvHsGTkBaDr3o"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "3vb8RhT78Fmid8jj8nVB99uNYzCrQdihNDSd7ZtaW6kB"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3YxpQJzvxe7TU4yQtCKbUfcFhJqDb8QAzbv5wvdNRMUr"
        ),
        eventQueue: new PublicKey(
          "2UnzkZJKX9w4MxDns3RMRfFJJAYq314KcMTTdVUT6ung"
        ),
        bids: new PublicKey("6yfCkkmXcTkKuM22oTj3igrKRtqcQy6Q66Scc1vu2fzA"),
        asks: new PublicKey("EGgu9UAQkcAu2RFaktGSQNqYcY5VotELT2W6UKVihwpc"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "netEYxPCbbW1DqAM1iPKn4qvDksw3aNwoJ6udJHN7BY"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5v69LS3K15pP6VtykxVJvpd8RpkFW5uP2n2Umh871mXU"),
        quoteMint: new PublicKey(
          "Dd6Y7HdFNZxPRgRKY4y51Srw7CfcZPfX51FS1gQE2qFk"
        ),
        baseVault: new PublicKey(
          "Gp2brAjhjjVRcv2xkp9micL3yMKJVV8udV3T4h4BcpWw"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7XgooSWm2GUzRBpjWE36rXyt8GkFjSCznjAUX4RDDUV3"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DaDcDgjVDVH9z5vExyg2frb9nMbPmDYBTV9LiLSffYCp"
        ),
        eventQueue: new PublicKey(
          "ANjsAwyG1TMiaFifCckEStAf9KF4pMs9y4kAa3TF6R1w"
        ),
        bids: new PublicKey("DjFdMLougHrHaxY1Rakf14uBv5aVRp2gabCair2KdZMw"),
        asks: new PublicKey("6sZNRwqBjnvsjiz3roPb3CdMYL7tjoTom9d3jCqDrMHA"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "xAK5YkUpy1Rk9HY3PEaS6nZwViVKyEgFy8HKm8w6dXc"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("CV5BvbJzh8LwZGH1Cd7M5RPPZrTPMJ1BtXHTWTPfaPQe"),
        quoteMint: new PublicKey(
          "7YJRQHC7vJQQue4KzcCNrjUQXw6Lt7RcuBXHnbFuUCzU"
        ),
        baseVault: new PublicKey(
          "7xEezCEF54we6VM9MikVPFj25vPGRV6diKDmMmttrxUL"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8mS38RBDiLMcCoo7fYoLD8oNBQdqxmSuCtSAnUNfeY6L"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "81LRhwPsHebhNsGsw2df6KndPrdDEk7LTx6Dovdwvxb5"
        ),
        eventQueue: new PublicKey(
          "4wre2CTwk5hJG6w95wE6fstnNHQouST4q8ua8dsivqtn"
        ),
        bids: new PublicKey("EkhC94V6F2FbgGrpVQTvA8AuGqnJBKC2UQrfBMtdrc2X"),
        asks: new PublicKey("HYRzkejCrJcpZq2J9sx9UyPQoWBbSRUbKU1R1ysknH7G"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "26mEmKBpLsvbXj5uvptPAbzbTKjmzaoq64DHPiu9KyeS"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("XRWQUPK937B1ekRBdesKfDZusFYJpoufcc8MVKty8pH"),
        quoteMint: new PublicKey(
          "529GgyD3JHRkcAPT2jiobQ313dNSG4m9BTPRQRjHARTg"
        ),
        baseVault: new PublicKey(
          "GR2PAdYnFe1rm71p71JvspkdK93fuYJXL4nCEis1WC8u"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Ej2Lh4Ree72n6Xc1fu6NUFMAPnzG5U2PHVWUQj3ePAeH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DQ7hrPheQEgXfhoXgNvatHS9as7Zucqdfw7TKuCjkmVs"
        ),
        eventQueue: new PublicKey(
          "FB2KcKktqkbgWQKs35hSwg3H6oHHwCVGwR2wiYEvyn7Y"
        ),
        bids: new PublicKey("8KtQFnYRhUzhBhnLzDQLq3c7faeehrqnHgmK3bLtUYmo"),
        asks: new PublicKey("ErVdcb1jgo42j3SmQ46o53vk6oQazH6dYZ8N84CwXGu"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "26xYH58Pkj9hyMeiQiQ58sGSu5FXctFsTtaHdXrUkt1K"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HpejSWG6Z8oD8H7rftrg3pG5fk6kYafxJWtKmvBHPtk2"),
        quoteMint: new PublicKey(
          "D69RnZiVKYDGAjv2WM2mosGnEFhLrFBpx5tHgvS3sKyr"
        ),
        baseVault: new PublicKey(
          "Ep29WBArSRr4RXNn5v3K6oQQK6SBDSbeVMedJSrG34Bm"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "74BQKNgPLTvJUTHGVBhV2q6wf1MXrN7x1Uk6L7snk6RG"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GfusDrgpwSMTD38dHFrn1Am5pAbEm2qUrLG7Tcm81xM7"
        ),
        eventQueue: new PublicKey(
          "EmU8KJx9T1iG3QQKKiXtLxnAesdeK6qnodu8gU43pV9b"
        ),
        bids: new PublicKey("Dp6o6jbo9zK47iFDfSHW3yJpgsDMsedCjSWPWhHRPWCs"),
        asks: new PublicKey("DPBG3uZLp8fp4RCWAiVaBdiTAVMznPy4QPkusCeL6h3C"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2WS4oXubdPQbqxmf764L39n7h8ntg1YWhoUco5md9gqt"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4XMERVcDpRfExAJ6aJA7Q7k1UGABDS6PHxNKGiUFZfkb"),
        quoteMint: new PublicKey(
          "AUoA7ordDjA6673TrNxrTevKAVMwJmdEbHpjxwYMgHs3"
        ),
        baseVault: new PublicKey(
          "B17mcWU6ZJdssA9FY37gZpcT97V4JgvexayQqcGFiFbx"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HCCfNWxcQ5AkU4Tn5bmTN7e5RLBPKd3UgSmZiYhPN3BZ"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "87Swr5jSSnGXC99xbWRfNhQeHdF9LBk7t12gE4oLeh7u"
        ),
        eventQueue: new PublicKey(
          "4uLdErAUmGvjKqK2bdXJ1iuc7Lb5twT9hR5EZtb794HD"
        ),
        bids: new PublicKey("24pt9Zb2HNot6vWkXojRkrpj9UhH7iNYftM6b5HCEjsA"),
        asks: new PublicKey("2Prt4HRmpHJaxHJ5KPFhs2bYkgQKb3PDudEkkaJsBCa2"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2c1sDXpagbVaqxvaeCFf9akzgvXJp4DqgvGbf7bD7L1z"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GsLgC2Q9RVbYJpxrtym4RYKzRWztuSKmUVuWp4KYVthm"),
        quoteMint: new PublicKey(
          "CYECGMfxw9wsnpG4eMvTje3UCukTMNmPrReYJdx9k76r"
        ),
        baseVault: new PublicKey(
          "44xrbKjzZjAXNubPZRn5cbqejr5A6myYyyBys3Kb6f3N"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FbRiyDZQyxmLwXrQPwssY5SKS8sM3jbDdJhgSNpBApVu"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AozeudUSPMf3F9XxkuBCFq7bGxrJ5UwZVhXzeC6t8XZ7"
        ),
        eventQueue: new PublicKey(
          "48FCDNrztMunGyEP4Mf1khf91nw9zS1pgsqWD5FbnYHP"
        ),
        bids: new PublicKey("2DjpxLuk6pv2LgzNz1ai19qptHE1w36eyNjakxCHMuV6"),
        asks: new PublicKey("Bg4jn2sSwYUbNEdqAh97p2FsMY1jP9kKi369pL36PrRz"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "2i6CEi29md4RceTc6W1A6rbLYCUxKdBW7y6mWcPuxXsr"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("H25rxtcT6wQGiRGYV2fcvQJiMS9qUaWyBEx4mHphMts5"),
        quoteMint: new PublicKey(
          "G7MVU8QGRMnf1kbj8BqykuzxLb5GHqbZGYX9NCXoTQnb"
        ),
        baseVault: new PublicKey(
          "3EuxjLy7JwvfhyuAReEjBrcspAPKk5QvEHJgm3FTVZTz"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "C9ZuQZsdud2VjvRELLjQf1xgKb6nTb7Hxz72hZEa47cg"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "H5ViG7HMwNYmhnRkNgwWjo7xUtvHmyfS1yXHDstAukUt"
        ),
        eventQueue: new PublicKey(
          "9UJS32FzLhjZUaa92aB3wycVGfcZ5rw9Wn5gU1K2bo97"
        ),
        bids: new PublicKey("E5zQ5GTSKydQPZ5UJ3uMQSqioPGZS14n7rV5VV79CL73"),
        asks: new PublicKey("3wjLEc71KbjSwa3xGJ5S57bJFFs6eDAJ2Pmt664Bj4cy"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "31HW4PLNxH8moCPoq8BpLx1Q4yMrTcMhmexfnD63RThK"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("2bgYcyh9DhxzBy8JTafuSunSANWgRfbqYv2owrpjMXvN"),
        quoteMint: new PublicKey(
          "5eEA9ox5CDvGeRAwM8BP5ZE3gCq8A5LZ9Vcp9iqqiepM"
        ),
        baseVault: new PublicKey(
          "ByvdjCwPS4xpMF2qnNsQrRDpLcpmw7jv4eQsjfkAf9V4"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "6wrVqd2Gqaq5KwMFmACGLwJRYpEia7JRa6TvWfMCiMWQ"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2LwF6aLVG6yFt4oHeNw2zbSn6NVQBzFBwyzhw5kM4gz3"
        ),
        eventQueue: new PublicKey(
          "5K3Vz5t3tJLuE1eniZzBnAZahUEyGP9fsV4pGpcHJz2X"
        ),
        bids: new PublicKey("2s1PoZHmwTqs6zDWgdTXshTznKvBtdRHitEBz4Wn7vS7"),
        asks: new PublicKey("CmcucupojMVt8D7SKft4PWXXt28M342yTgGadTYrHhK9"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "371VPAzPn7EkWkocmbcbyq3D62RK1c7HRNUjvxmBDkfC"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("81DioBfS6zV5DpYntH9AgHbbdmCgDdgt1x64jkQYt85E"),
        quoteMint: new PublicKey(
          "3coxQj7KwdmqtNv8NV2qq368LTWbVv96RwsTKJUXGFtk"
        ),
        baseVault: new PublicKey("nqgYn6Usqu6YPR7Q9QPywDQ6ZgRYKs3A4pasrVanyxm"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Bp8DYRRyNJRFnqVBNBt55nAxEgNXy8PKngX2csTF2jji"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "APn9eBfbzTHV7zE9fzBwEDV3BnBLLDjER1gBAJCGokYw"
        ),
        eventQueue: new PublicKey(
          "4VaszjJHNHGjYXS88vvaUzh4kd2wPPvJGH3MknCqGX8N"
        ),
        bids: new PublicKey("8C9uQDfHAfkz41adHGL1doewUtrXC5xrumgsup1CKhxm"),
        asks: new PublicKey("DxYcS8shLyxgCvZPE1bk4SSRGyEM5Nc1AuQVHNtDKsnF"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3B6WZXuzEQgDSCkejBvK8zPScWzPqySpAE2V8hhKyJGZ"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("AyqHs5BjES4VrfugGqoxQcTBxdmaEbPMJD7GByVkRFH4"),
        quoteMint: new PublicKey("zapJ1AXyCRgb85URdYqL3uiAwQvuSYWXJzkPTDvgiUU"),
        baseVault: new PublicKey(
          "B4qMFonnsV7HGHQZY3axzCArJFH4kX3jwwNchKBeyDYc"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "ApAM2xkZGbvuGmmaFAHkormojo6UYAxBXEYcE8uuRb1h"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9ewh5gsUT2WTz6iHqJEcpCtiJsXe8cDAHvJG4EJMxcDz"
        ),
        eventQueue: new PublicKey(
          "8iWtkkVFa3LJAAfpnZrNtuCQDQ8hjN6cnv9Qx4SLiNwM"
        ),
        bids: new PublicKey("Cu5LrJAtPfkCjaKKtDtSoNDNiJkHqECZQg1pjqjoMMUN"),
        asks: new PublicKey("GD4knK1V52Xs7TywcTD9GUphif3hMSqbcwoTFHti1dyt"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3Bc4qTRm4GnytofdBvWcQphgRQ55nxwHZcQNU3p7MVjs"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8uVZdRsZY7KShXxdJefkWp94DsDcF4km9CZ1Qsop5e9a"),
        quoteMint: new PublicKey(
          "7jrtQ7zfgTD8YmsgrwVnTfaa9fkk6ovFZaTLxDDJ12E7"
        ),
        baseVault: new PublicKey(
          "FrHASZe34uuwtbdKz8W5KYo2XduwJ8Ly593RzoAeKsR8"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7wUETqMwcx9NuMjFGJH6aMJvGN7UVhAZ4Zj9eDas1V28"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3SQsqqt2Wv9tUjS2PyDNdYiDBatzfp8sq7wPAQZkvnYv"
        ),
        eventQueue: new PublicKey(
          "2Jw8wpszkNgMCoyZcNNFCHpkaM1DRozpUCaXT2TdQnd8"
        ),
        bids: new PublicKey("DuMt4TJJcs5ymFL8sAGBytbHzLefp6Ha3yTxHRLtENaa"),
        asks: new PublicKey("AJAEVYQhwJvaLGHbtCzKLo37jwinJ4brqrGG7yzhFgPd"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3RTCSyqVitPiDme5hgKnBS2qPS426iWURzgTv3svBQRS"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("C8VgTTNDbseFusPDE6McUC4Kmy7qAZX5iPAjEAZwxovG"),
        quoteMint: new PublicKey(
          "2KkNUjsetuLiJFVpCVt6BMBf3JKtF4vrR6a26YZoop8z"
        ),
        baseVault: new PublicKey("qEL8umW8Rxz7Y959kHgpsPQz4n6rQC6jSaPUpxPYG6P"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2g5HEDaomhtwxsART3FpDPHRntSEtphgBzLPvMgbnmK8"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "s7zjeeN5F7skVab5DHdj8k4pvwPFPdJHSB13nENx1SA"
        ),
        eventQueue: new PublicKey(
          "GxDfNAzyLEgM4rvDqQGcsCL8vtn3zsK2uZe7VCPEUiY6"
        ),
        bids: new PublicKey("5mFqQQ8MxUGWQsTe4nU4zV8Aym7KUjfw7kxz8WSNLPbq"),
        asks: new PublicKey("fxURUgGkociVBN3AeNF2NS4Rr1Bsw9pYAcDGuVkmmoj"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3V8u4JPkkwB3SEmtkC3Q4vHRAKUgjpWgwh8UJb2za1Ne"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5rE8V26MULWJJvpVBEimJ6iFdxhSbNoo2J6uQJSV56mX"),
        quoteMint: new PublicKey(
          "6DEmi4CyWNiPAPL3oXEy9MqGJ2yFJDHwiwsmEnHJrP9Z"
        ),
        baseVault: new PublicKey(
          "5ZZwPWXvVcAWz3w1DpWmoaGkz6rQqNL7c38eUifqjwPj"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2fkCuSvGupHQY4TU7AnqodAGvmuVkAy9vqPHNbwwqh32"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AYX5SbAS8KXx6tCrSNkR5HsYzkQgceBuQAt5hzcvfdvQ"
        ),
        eventQueue: new PublicKey(
          "3MBJD5jsSea9EbMQbMYUswJNYJUCuhnTmEVniuyk1QsS"
        ),
        bids: new PublicKey("nhz7rwWCKqKncKGXxyQYAViZCuinAxAWjxnLD6sti2Q"),
        asks: new PublicKey("F4jNYZjXkUQJFKc7iiwFvqgx6Suu4yBEYmGfs8K58dQZ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3Wi11KjDFbTnPdbv72WP5Uaq1qYCD7bivCtApTYq8szo"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4EmuoM7JMwhSkJCdjdPx4rZZjwt18UN12vMP7NaaeHqd"),
        quoteMint: new PublicKey(
          "EJFpbKxCi3dd3dAifgXxabxFZayt8UB1bHMyAfk6cuTi"
        ),
        baseVault: new PublicKey(
          "3o5z41ZV3hjLi3vX9cGe1PpeZrwnxFAtCZoq2PJWffaq"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9r2jD1Xxep4B5h9Rmo7ijatJZC2Y47c6t91dgKiBwuFb"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DhUnQChnNkTJrzHiCUabxGX2MVLU7h6oGzTTWRv2yfCz"
        ),
        eventQueue: new PublicKey(
          "H4bkgNnvBBvTBYUzRa2t9DUhKeFDzRzduhwck5waGeeF"
        ),
        bids: new PublicKey("JAqCfhzwj6aDt9akN3r4w1VaBLh8qVqPp4Ev3wNQiDUF"),
        asks: new PublicKey("C3RGBap7wFVSacVJ4rYKkkNKh9MRa5SeMng4Ne58ntcg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3cV8JSB4KZLLcp6hBFH3NJUrP7Ap9vFPMrGcpHycMeKU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4SEg11Y6NLvSebyWmizMntqymRrBKBcimUmMrGm3stym"),
        quoteMint: new PublicKey(
          "AriS96JTpwZvH4sS7A2SnF5RUo9CudsMRhN6u1RHaPJ5"
        ),
        baseVault: new PublicKey(
          "FhvCeK9hmyMRmFbaBugTp66pRaHJGZTSfwVkbkDkH5V6"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "C2241tdhzRsnWzcLvtCwtSHQwq5YUFrVaJFB54Mmzh9U"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "74fhL3qHA17abKjH5N7oE15N9x2Up7HjCZ9Gszd419Wx"
        ),
        eventQueue: new PublicKey(
          "43W7sToUAVSqWRVuD3JZGFcnvo6fzxrS92SZf4xkGmC6"
        ),
        bids: new PublicKey("HgBGn3SzckxSeiUihwTLgp8chvma5TymAhpbh8UvKghM"),
        asks: new PublicKey("9du1B1ATpK3a6Ps2H1v2EG55xWKpRq3LEjS5L8GYMDBM"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3rpXggqyKTJBA446cVrFtrUDBMc2T2JoRX8jRQvofbbz"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("2yj39baE7s5pB1uTc9z1XG79qTU8vsU5tz7UscJ5Rtof"),
        quoteMint: new PublicKey(
          "8B7FiPnTpqdMeSJwWLgSdDSWkp92LtPT4fKBMcBiaJ1N"
        ),
        baseVault: new PublicKey("Zce5dpJhRFb8ZmMD5HxCXcEfqHSpG5qQLX47bAQCvo3"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9aBvKQuofksaG5eQ6igbCUCJwaws9x8AqSqd1AuSRyBP"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AeGLqcWLBWHmmMHMdCGaZgiZnTMSfQKPAB6rpXR7Gwap"
        ),
        eventQueue: new PublicKey(
          "Hfg63xGB7LbdBZNfeABKc3fGUog4YdS2y79BwW2vQVm"
        ),
        bids: new PublicKey("HLo9nK2cU6KkuCvfwdb5oVbKZJRRpbTVv1VKb6XszYAx"),
        asks: new PublicKey("2GBX6HSaeqyTnQCQKo6EeGFpam25bFF2voWoVdBUvWAA"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3u1geu8zHJakEogCVzggJUJ4NoXiki4hk2SBhj1K4F5q"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("29okdM57QeENBdaXDz1XqpMEed8TGcnwXkWUHq1LaXfz"),
        quoteMint: new PublicKey(
          "EkawU8trcNYpPFd3fk2rUijNPgfnyhGvULgV3UTf4he9"
        ),
        baseVault: new PublicKey(
          "BHUNAQ5hsksPFXmayKery4Y2cuqnZEA4isoMYmVN3tpa"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Hw6nFxBTjExs2r7JBRSntXuZHt6RkQRc8gDKoUugjRnc"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6abSyeJoY5qnGgiQBKxsB8H7NDnrpKaCWqJ1timgpsgt"
        ),
        eventQueue: new PublicKey(
          "3EhUbnJZtAgjyc9C8j5RhTRAkGt1BBVz1zqj2YsxQtaP"
        ),
        bids: new PublicKey("DTrJfjhjkkjhuF1PvLVAFBBt9ywcuBQ2qg32A3EknRf8"),
        asks: new PublicKey("5d8dq23BVA4N3o89KKqfLxjnGnhfwjy6Gay8ALSXg4gz"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3v2ZHDJTaFWDe4vfT6vrkgXGsR9QcYU8Dm6sPjLarPeK"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Hc5szVpPtFanTSu5wvzvppuGa7EkKGARNVRCgUEnkdDL"),
        quoteMint: new PublicKey(
          "4SquZhwHeTuGPvio86E9n3ZaorVXt3L3Cu7HC4w8tJFu"
        ),
        baseVault: new PublicKey(
          "FPF3zSvWBCfkQXSNwJkiUoNHPxq69jigia42JYC7XKS8"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7U5zWd496eYbKU6DwSekefZCqVq8oh2FKiLX8yQsaMxJ"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "CDL9Q8nL5jQijqV3PbqVFSmdN4SAsbtGDpjYFgG7eycg"
        ),
        eventQueue: new PublicKey(
          "6HecuEM5MRYhmyLSZQc3hj8KdX8T98eVEA1Pc2ENr4cj"
        ),
        bids: new PublicKey("3anXHssg8z5Kmn53qu9XXJVQ9duAJ3pWwxXwsqVCsWE9"),
        asks: new PublicKey("GeZxXbuSFTw8229EYyCA9f1DGfAPFqqc6LtdsWCHu3y6"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "3vBP71dRJWfc4B5BG9v4nhtW5AkBNSTDSPMQvhyKYG8v"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("47eRABJecQqRniS64fpRvv4ZDT16jmps5iR8NLAkmxSk"),
        quoteMint: new PublicKey(
          "97JpbEFddoyBoPXqx2CZFE3f6EoAa6LAbLbSBjiFMxSE"
        ),
        baseVault: new PublicKey(
          "FtVL6Sxi78s8Nc1oMFdhqjZcjQBfr9w4i5UKK1BaxL2H"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "PTHcHaCYa8QDUBQt5aKQrsLcTMdHwDD79Ui4JnUR7re"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Gd6UnSL7HJaxZFGTLwwgAdFchdTFDWvkyVCtxBB36UXZ"
        ),
        eventQueue: new PublicKey(
          "6ayufsA43PbsXyA7KjGDhQ4MS3bi2dKAisqRkNSVGNqf"
        ),
        bids: new PublicKey("Gf2tVni1xEq4RguzpjdaWMe3mJddndx235HTMMLiGMw5"),
        asks: new PublicKey("92ATZWZPZSmvaNfUAvE3P35oYsNRYV5dRPfRckFsY5ri"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4A9WSdRr4ANz1izgiZx7yn17BqqJKz3R6NHNnqbCEUBK"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("EhetHAcNHW3KaGdiQMouPn1zp5Y4kbNCnnYGeqJ9JiAR"),
        quoteMint: new PublicKey(
          "4pdHFUcdBhw8pr4ygw52nhuKhJkbohj9Hxxuhq5qXpVZ"
        ),
        baseVault: new PublicKey("QeuweZYLVXraveMNxYrs1AcKW2uPWmbRf2BPswRuZTZ"),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "uEEx9N59XtZaMimxJtwb7VZUKLz3vPSD61QDKgnGwK6"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2XE9UogQr5AWsFezrACgmtB4rGwvp2JXz6LVwiaxtWWJ"
        ),
        eventQueue: new PublicKey(
          "5iyZ77EtSuENywUaXECnyX2gvBNwSD8oXgFxrh36v3Bh"
        ),
        bids: new PublicKey("5PjjLrxpL9A4msEq8wxCLafChTGDtGuB6guu7DdahMHx"),
        asks: new PublicKey("8JrvMgV17qAUKc92sx8F1dBr9uxPsuSFYVrTVAyFNcrX"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4HkgicNeudgKdNckhW5SGqcKK8KEVqDVxSPCFPhMhqoG"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6Z5x8La655yCfULNgCHfK83ZL4oPSA6aW57yYrjgPNi6"),
        quoteMint: new PublicKey(
          "GWx51WE9J2xvifK1o8snsxUM8KXaVDeop7mGYgyYvQDy"
        ),
        baseVault: new PublicKey(
          "Cg9zb4ZEsq9NUsQMmNCvLpSikjiEwQFxyaxXKi8finCS"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9o9L2daEzHaDxWiBnM54daZ3gGSnhFU14aDCsCmAPUMs"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "ESehgFrYjiJgwAqMhr6dmdBGvxqHPCDGnMhftUbrb1Ui"
        ),
        eventQueue: new PublicKey(
          "BojRgwxSWiqvXZawqQRyGe88rMg2xeYT9nXhJQB6FMre"
        ),
        bids: new PublicKey("H8iMdL35KUujEHmPYiizxeZqngmvqWroDz64ALDLY8zu"),
        asks: new PublicKey("5yQXmJM8BpT2qQH8F2FVrYdvz9iL6mSoomAFATGMpQUQ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4Ng7aAVa4jeqJuVPJXHd1CtHMdJ6pjywW95HonneJ3WL"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("ADKqBrhQJPLDp131XMLyD5yFyMSqND88n68jH23DoQ3H"),
        quoteMint: new PublicKey(
          "7sKaiFWjQUxEM9QQJYrbU4mQMki5V5RrS4A731oa35Yo"
        ),
        baseVault: new PublicKey(
          "AbGVFnHxyz3kz5crsVUEDS64Xgt7Pg151fm2zRTseD1Y"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "BuVfd4PxVoxeM6gYs8h2x2sqLqFnTPi7QsbcRVrrv5Qk"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "HrNh5xUfThYS2zKcTpuQhBCdEXzSNYD3KkGvpnztM2QW"
        ),
        eventQueue: new PublicKey(
          "8CTTZvrkAjyVYKGc8djgqkcGZu67cHqJHPmJy1Zegd9B"
        ),
        bids: new PublicKey("51Fq3w3M8zUNGizD75CpJL4cjxVTHhtsUsB3wdxbf4QW"),
        asks: new PublicKey("4T7zqy87RCNbYXvv3pQ3NTB95Hegz4xngPw5JA9kcs2C"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4Xrn2Dkkp7G575ndzEgSzATsUQEiHdhrgyZohuawBCZ5"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("71jByjpV6rBrK6Uet6DtLD5svb4SpYGzXmUiyDNMVCUg"),
        quoteMint: new PublicKey(
          "HVJHa2Cr4b3atvcY7hduigd32KiBTPzqEZuCD2sZPe9V"
        ),
        baseVault: new PublicKey(
          "3iWcikXyKYPiGcFfKDwjzDrpbnXtKwvk6ZKxe1mVd4t6"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "B3PG9FQWXHmyHbz49A2Xu95mAA6rrgJH6y9mZVfrQdjS"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "EY4GJ4JJqRJWqfjW9UXUDZe13HtbrN9vGSfYBVsreTrp"
        ),
        eventQueue: new PublicKey(
          "3u8BsvmtgmAzgxxf184FZhf3PXZ1S83ixHfRasdo62rD"
        ),
        bids: new PublicKey("VjGMULnn5snDDH5C4xzVU8otRdPWHUAhkHsWQciJqr1"),
        asks: new PublicKey("DTqs35oYbk6ZQgPBDphaDFUp2j82ZxZZhMWK4CqoF6gQ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4bahSixm8aZbR3GmU4CJodbCYd4bfuWnxqkg16rLRPR7"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6UugiWSiukBZNYjL8ab2Yan57yErG367Zi1yjT9tnmTq"),
        quoteMint: new PublicKey(
          "EYqnDwjd8kEfdFF9Krsrg4UgL7TEcd8MyuWRgm7CZV6A"
        ),
        baseVault: new PublicKey(
          "9KQBnQTztg9nLmr86tw6YqKU5ym2yy5fZhHTSaro8AEC"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "AYLZew1cntU6ZNZRWLAQUrrbEcbeNK4VU3ytLoW7H16p"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9PbF6yYei3Mx1arGAdLtY6HRCa4FfJNvjgrDiH71xxAE"
        ),
        eventQueue: new PublicKey(
          "9BShD8SLrdnM7D7KFAcHwx9rhBfDEhnU1p5XfC2YBhQv"
        ),
        bids: new PublicKey("3fvBq73hk8KK8PbPafEu7H7aCRLmybdEVV1bwMAoQPfk"),
        asks: new PublicKey("Hq8c5ojK68Luef42fn8cvn6X2R3zjpXPxraqsg2CY2Py"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4bsifkFQu4VbtKkgHg9Yac9iUXvz4VN3vsv7nLWgk2RK"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4RihNQrruq1fsqLomskZLQ2GkuNByACfZquS1Xaw7Bti"),
        quoteMint: new PublicKey(
          "5qB5DPzCqyCAUsvUutEmLZcVkrfXfPNk1XctR4wknN45"
        ),
        baseVault: new PublicKey(
          "6AwizXA77GBqUgsteqgUVhxrjNkKZC1HnpZPbHH8Z5v2"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EzqM7T1KpcFCmYFygDsKbzzjUEubzgf7BifjUUs5GLf7"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "G9p94SwRHNZKaGy2CibUcBuDDCRhAn38c79kLFo97Mj5"
        ),
        eventQueue: new PublicKey(
          "9LPkCx3L7WBvvxXRyXk8v3hTZH9xdoeSEXXtT5rnMfK2"
        ),
        bids: new PublicKey("FenMK3EoimfQo5Z56QXBGernD7px22PNvz9G2Fs75n5c"),
        asks: new PublicKey("Et5VbqEoJicpgFpvYhRRv84zKefpfBXTp2M4kiSfMBTd"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4fUMsDu1bZ86qMc9Woq1wkqBXnA2w8x6NgX2ahSqTUvN"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("GSW69aNfX6ErsXkdc4KnygVY5qKdfmUjA52SAwJyrS3Z"),
        quoteMint: new PublicKey(
          "HbVUerxbf9CPJudJ6uBaRHXbpdsUvvfUuNpHj8DgJ2u2"
        ),
        baseVault: new PublicKey(
          "2GsnWyAVunyaX4fjfi5vGTXZE2pmjhubL8Gm7NSyFbHf"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8XFMhbgLhiniecJQQTtk4Fp8nLuXBZG6BcBiievtcMnh"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "C7yjRvEuFAWfQLaPeTAWGGSAjKMshCPjXDi9NTKS9ajE"
        ),
        eventQueue: new PublicKey(
          "GcDWB7xqSq8EyPV6J8BCPD9gPRrdRZvsrST5KX2yGHZU"
        ),
        bids: new PublicKey("8HosLo9xfrM3qJBfoKPKuXfLaWRX95f6hECLzstYPcan"),
        asks: new PublicKey("ESUtgwteB7A68NgqQXGKosWqoSY4speyNoiukPmg1eCG"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "4xX5VEoP7FFPkXb8KDuRoSxbMhKsmzDjhQ1xeGwiadKb"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6bvRqZhnrLQyY5PHtERWzrk5y8c7omQmELo7hRHgZ6h3"),
        quoteMint: new PublicKey("1DCoBrN2FoxZm6cJjXQKQVC1KYM2TZW3FGCqXNn7cy9"),
        baseVault: new PublicKey(
          "GiU32NvJcEjgsaKrm26J5oA5fXaN5ZsSZSeB2ZmYsHRi"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "8UWunZxEMVM7t7Q6JMip9WasUozpDS2XYxBmi9zfNkm2"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "DpR4pDvQfcixBbr6uC8jnMPdvy5yonb693Gx6orWAs3G"
        ),
        eventQueue: new PublicKey(
          "9AjZEzgp8rJ4D4HCqhp7iESBU2SWwxd5rSvhbAJjvt1A"
        ),
        bids: new PublicKey("BqUV4hPjke3FB5PrxGPU76SQa2qcrSFwxMVmqCTLRcC6"),
        asks: new PublicKey("Hur4yUSeubcsjN945283Zsgy8w2qU3BXZBDqQzj4dVas"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "58MtkJ8RWaZenJvUMX7j4ktLEQ5fHaf3KwL9rzgCLVCK"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("78oJ6CPnUKuz4rog6SWA2zMz4JD28aYBS7zYMpqziNTj"),
        quoteMint: new PublicKey(
          "6afnZcHJSgsuUsvV2a8GzwT2wm33B3Xyrtgo7ZF1itsG"
        ),
        baseVault: new PublicKey(
          "CgjLattrkbxVChKaqND8AMZmUvZda7byZ8yu7Uvby9Gm"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "9UsL2NmhHV7TfQtRGSnGAnpNkmgKggJXAttrLkT2mykV"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2wekZvx5YnoYgunu9Q58oVxibSW2TcYHRJ9d9L1sZnsK"
        ),
        eventQueue: new PublicKey(
          "6DZ6rF1CjSdhZaFhqCHYmjMVQzptaTNAtSG2VVHaxtVn"
        ),
        bids: new PublicKey("mKx2i3oygpSYUv7vrmpMvP6WgdfD8DgsauXVzZ8AFx7"),
        asks: new PublicKey("4B8FRcDQU6yVd9xtt9QUhGUMZbRypwxdPKN89ixnjGJr"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5Ecan5GmDFxBHNipjfDn66UwGPWQN5fwUcZipXFidEaU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6141dwQzSNtaeuppFeBTiu53EoX1Sop3KJanv2VsHH8S"),
        quoteMint: new PublicKey(
          "D2ZyJG2cvCCTjVAjXiuQLhBNY5okgHY9eKvwwFA3MRaC"
        ),
        baseVault: new PublicKey(
          "FTS62DZHc4H3SuSihe3582gCiJZCxs5Hj4w4UP7D8Cca"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FhR4YG2a752BaxmRbYzsM4cpSMBMxCkFo2zPpSsri84C"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "6wFH768UX4iHiwDKhDHYmaHdqqyYaLMA2YY5tQH7TEaw"
        ),
        eventQueue: new PublicKey(
          "56pa1gDCRNinRHdK7X2EGKntHEHgUbJGh8r1vbZE8bpn"
        ),
        bids: new PublicKey("5TsaPTDq7QncnaLfmnt73Zy5urjVZM6hZv25cWB4BdcZ"),
        asks: new PublicKey("7hizoY2NW6hDaXpiwv3fVbi8hzLYV7x7GgYnhpms79YL"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5UMLLoiUb9zncAEAMqitUGDoBMSmeCejnpJHi9qV3uPz"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("26EuyMEWL27sBueGmYZaGYaxuMzHGMaBzgtM5i1jHX5Y"),
        quoteMint: new PublicKey(
          "3cQToLvNv3gp2ykRAsXpieoHte3n3fGoSriVdB4iYn45"
        ),
        baseVault: new PublicKey(
          "FgjPkTE1rH2pxmAUeb8qJPwr8mAHiZgBS3boZxYhz2jd"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DUeianpqLBwGXMWD9ez8fmaHSxV5sJQNKNKNkdNJs6tv"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GW5YLXGdQPCChw8BdvD4uSN14L2FJfnMzN5RYmfquDtD"
        ),
        eventQueue: new PublicKey(
          "99edfJXjAt9mb5pe7qd9q6XBizWbLyYE1f6TQhRQypsd"
        ),
        bids: new PublicKey("DZjB2Sp1oj6cdjZRwRCu1aCsCKhDXDZwHNDoKHDDcgeF"),
        asks: new PublicKey("5r8y35eZFEifN2kJyTJvurE9KVbkDXPn8BpEQe3iAyfB"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5VLnucQ5uNPoRia8xvrYQbgX7XkDPd9vpWD5cgwCV3CC"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("HYaxYuQkiZBFTJf34PKSVJDNUSfSpJbG8i3GXi4AuiQb"),
        quoteMint: new PublicKey(
          "B8ZyD41yibjV3J9U9VLPKL9PcN6QPetBvcqSoXfRuKbk"
        ),
        baseVault: new PublicKey(
          "3ZyrC2mt3KejTTp5UuVQYJgDRihwFXM5EUDhuybRvYGY"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "Fsxpa3q3SMSBm1LXPQ69XTpMAvUBssAu22hL73THLZAd"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "G6y7nrFcsGbsgqShq5dJSKBpNPJU8ZgNdKE2SbfEf7cD"
        ),
        eventQueue: new PublicKey(
          "3BXfmV98f4axSjhvwDJ84ZNVwEwmKSdf1H2rBcwU36cb"
        ),
        bids: new PublicKey("6QKUmBC3SZJo3WnFfeEiF5FhCL6yUugQLPxNqBVdF6LR"),
        asks: new PublicKey("DG6hegPLRt9tE7Afk9UiAAn92XXVGH9R82P3q2Qm3UYj"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5VyYEcRTEPrz1NDSe5NmRz8UDEpGpHA1nR1vvbuhxGPY"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("B6uyBRzkcWF2aJwSUvyn9wY5rGsCqhKrVdhDiCti3Jdu"),
        quoteMint: new PublicKey("v5dANi1ouM1g4i6qWWXLqkYnJXAB3j13KudT2o2CaDE"),
        baseVault: new PublicKey(
          "BDZyzdidiAzcyJ7syh1AdjXmmV5qPEupiqNmxnMUKu66"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "F8yWf5H9UMzhh6tzaS9d1WgdkgDN4Lg2Vt1D4TPtHQkr"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AVViHXt2CtHvo9oVTkZBsnomLwhxzSwzTTEhs1hSixkv"
        ),
        eventQueue: new PublicKey(
          "56ei38JaRDyEddWR9FtPcmGBFfgwXyiSoeKV4mdKzEQw"
        ),
        bids: new PublicKey("WsWFRQxMMVRWh51ysXnmJUzDEX86SASeWk9xsowB5qi"),
        asks: new PublicKey("7zUHHfNNR1vNLim6UvTezkud6LYZ98r8kKyBxVPgUuQE"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5jVZErmJQR4ARrP3UTQDnHB4Q7PUPMoSVm8c639k5yR3"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("3ktTwL64d8pmyqudcRho3TJbTRVqRzJQSF1b3uv4Ke4d"),
        quoteMint: new PublicKey(
          "FSN2DxsBAjeUy89aBv4pLCUQWE4TA3gwvgjrxYCurzUs"
        ),
        baseVault: new PublicKey(
          "8PBiY4eV8q19KHkohEcMrNQNA13WiaFEDArFs1AYraxa"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "FtSnoLsopVDLBTPkDfXAJZX1JygJiqa76nntbFHzV9qq"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "9PoaoSdgEhyz68KA7BmnATSfhHLH9C2b1AL4sWSnnRte"
        ),
        eventQueue: new PublicKey(
          "BB8Ge5RjeZDggEVx7kfKQjZRXEFRGqHYEaEmcqoEcWX5"
        ),
        bids: new PublicKey("CaGj5BceJFtDWGX4UrxWg2oDauSPWdf5yW34MYmVfVd9"),
        asks: new PublicKey("5689MHCaDDGYsRhR7XjAYmTq7qFER52MRXsMSAc87Lz2"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5ki3X1ptiqu9gWiTGFbx9BAtmYjpFztBNEnc5FktZQRP"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("2L2jd7EJx37fQTYAV9raQSTREqWi5vC3UFmZnBBhqko9"),
        quoteMint: new PublicKey(
          "6tqHerhcNXWEz8bnvv8K1sJVH1VWT2aRMeDbhpqoCbQq"
        ),
        baseVault: new PublicKey(
          "79hBcfUe4d8zvPZJnd5aM7EKY2coqtLcJqmL7opvNWcW"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "4KgiHth3agcV8c3ZctcWkWEqMagw5AAaLQjZUFtx81Jf"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "AFtfH7qApBUq3iUkWiFizjcDNBPkQ1LFhh6zKTGA4gLo"
        ),
        eventQueue: new PublicKey(
          "GwKaSYWLFcD7L6dirtFZvHaW2Qem8tVCaoVajc4Df1H8"
        ),
        bids: new PublicKey("JDztTNBMzSgHmkqc6nsS7Nt4rGGmjquZnmtHPmtGRa3t"),
        asks: new PublicKey("A6X4qZsxkywtnrXXdvpov449dFToG5LPRz9R8harVi84"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5pJqJj4HhdHwp2DtzcdKTfY1LjFvRo2CMqfiTeEKhmbU"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("4Zycxei4XMfbBGAzjDKcCPMUTXYYhNHtGggwR7cPECWb"),
        quoteMint: new PublicKey(
          "8EC9MVXvXrn7YPV8bigBcbkhxBvSdf9NrXnTjCafx1GC"
        ),
        baseVault: new PublicKey(
          "BdvDDamdg2gGc5z3cV39eayVF8fXMp2KUuW85SeZcM8S"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "C3sRTTbHonPqKjTfHKboLG9zNdrrvhNtBc96b342g3pa"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "95ZvmwmzCKvR1xWnkVyuyQU86NMTYSzq5yjpae9LpG2i"
        ),
        eventQueue: new PublicKey(
          "9mQD97rGZHnqAvpTwnWXN3We8tuuaHPhaM3Jy3LLYswN"
        ),
        bids: new PublicKey("6Dn3pEEGP21Yz7es6Nx88vdzG6AgTDDwEkk1d1em2pqf"),
        asks: new PublicKey("F2GnvK54vdUyR9PoVLr5yLxy5s4eJpL6joayAC2ENSsJ"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "5t8d4iK8m7RU7UFPN58v4fEJjG2o6efYJKMG1bEzzVDK"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("6r1Azn1TLFKs8dQXTUAGiLrNY1aTuJaJ8rA9scc6kDQ8"),
        quoteMint: new PublicKey(
          "FHdRyuEMTuFBqdmCM45wr9vmc8rZvc5zib9cYuqEfzYH"
        ),
        baseVault: new PublicKey(
          "7wQ7ozuwWHBrHbHb193etVRChMTnD6Uni6yvxWSEhTQn"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "67jdcawVNoMYPRugZDouMRJPSXt5v5P9KgdmeFxiqtuE"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "7zX91rr7RgTuagpp2iVfP4aADmNcV41RmztBJmKc8ZY4"
        ),
        eventQueue: new PublicKey(
          "A3W29WREuhe5WzEpVYnDqezw1YQ2JoshnSnZ1AAkz37S"
        ),
        bids: new PublicKey("AW3d6rbx5gAfNjCgzfrRNH4dvMgcQYoyrSiSimM21LMD"),
        asks: new PublicKey("BF2uELvqbEtPESB8icyqTXkffWtAeTjtNyQVBg2pWVyY"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6T27q8H9oqa5M9WaZVRyYNGfHTxSq1dCm3LP1SYo98x2"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Ba6gxx9y3bW2CzQN2GRfMHPYkN9LhhPFcjSkyermunLa"),
        quoteMint: new PublicKey(
          "7V9JrvTUXv8aa8tLjx7Wz7iyEYYQ1igygRDVuW62dWd6"
        ),
        baseVault: new PublicKey(
          "9ztt1Ehekr1Fxw7YCpnoWxo4TKJpeNqbGtASEwrc6ziY"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "GzRAq3VgSd6EgcVd9F4h56qiw3BFYm7wtY3DpvmC5UWR"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2Wvt4egGxfXBkiyYDxcayo3gVs4BkmNuGkrGW4wStdtM"
        ),
        eventQueue: new PublicKey(
          "34xwMcczh4fiBSvS41NjF4vG4WRf2HMzqZfT7SKZXzu3"
        ),
        bids: new PublicKey("6ADmoyuEiraRFaoc9vS6TfL67uDsemnAgVWVpcLDuV3g"),
        asks: new PublicKey("GDW8KtFyMWp4dib9BSXgsznhsjiDEfZqywjmjFcd3hWg"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6WmYYzXEgNDAfYHajru6JBY7hBNUxQGMefgzAJHeJFNT"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("Dba9mRQn8L7vm2iBtAPwAE2YRW4ZcAf9ByNMMGrkzFr8"),
        quoteMint: new PublicKey(
          "EnXx2fwx8bu3tpLjHe4isoNFPpWcJfvJXoqg6ysEiiof"
        ),
        baseVault: new PublicKey(
          "DGdgad8at2ioAh23whjbLJBakoG861LZPoihgARYDLvY"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EtZ39NfZZL5tvxQQKjzat1LZaWNgVayevWqwnmtZdFri"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "2hWK9s7eBCqX9zo2ANRJgac9dU8QKTqg1ct3cmYkxDJK"
        ),
        eventQueue: new PublicKey(
          "EmqdovEtLDPj3YLFCenbXDV7cFwbjTj6sFeZo84KMUUU"
        ),
        bids: new PublicKey("JAWNgvf9iGTw4jVj93mCoMt264QLJTpgS9fCcSd9LC5d"),
        asks: new PublicKey("5osVSpfTwX5vtidkRYVurT1Lexx7EUKAAV8Y49Vb3qSr"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6ocqRqESQczMAYHLxdpFh1A2yUbqa3QFsdtCfAggLAiG"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("AiRiL9zP1SdbVUpsp7w9oiMpN227FrdeANazNm29osX8"),
        quoteMint: new PublicKey(
          "9WXX8bwPbZGCyALofsuTCNBgATUXiGR4ai41yE3yJdcg"
        ),
        baseVault: new PublicKey(
          "FMZwof1bsPBye5tbejsMKAc1p79Vof8FenCutYD2WDxT"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "2EhGBenWSpsFrVGCHchkiW2ANvpQZuoHsE8bTp5z5JYf"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "3GJ14dYBoX13RQzqApKMiCbnwAijXjnLZZhhP31pyE82"
        ),
        eventQueue: new PublicKey(
          "AXM884ySPkDXYJTsnRZ4FCAiZGNEdxBLCBMsXHxtBdwE"
        ),
        bids: new PublicKey("5MyBLXbAwSrmMe1c2kN8hL3HxeQwhdHPFwgxBsLDnvPg"),
        asks: new PublicKey("2vxdyFFjMkdqQi2XCjuLJ6SGVyiUvMTzdp89iMXEe5zG"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "6yf62maDeaXsmFHgcNuFt1eqfAvq3EYTsDy8hxs9gDfS"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("5hXxqYZM6X6mF3nh788zBu8aj8Q8H8QwfQKYYrAF5qFD"),
        quoteMint: new PublicKey(
          "5z1rAJBEeFVyfmGHrLCw95vCm9c7SsmgVviPuAmVXBpE"
        ),
        baseVault: new PublicKey(
          "HrMh1hh1qWZpuZbwd8KSQj1SX7jDGZfwpgMDutBvP2od"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "6rxL1YjuXuucgvnBcUJ1PNWFps6JPM87kkPoFwLgtcUc"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "JCf5paLyLf4ZA2zF5PUvanrvL1eXYwRycEXt5MPcLb8N"
        ),
        eventQueue: new PublicKey(
          "434hydgN4SjcYss3k1hikemAGudgY1Pxh2UYAcV3GEs9"
        ),
        bids: new PublicKey("Ykx5Wp62mbExj6Nx3zqDSWbArm8tnzz4ZHdpoosn9Qq"),
        asks: new PublicKey("EQZfypJHh1dGCMJnJMjSFgfkB7AYSJ5TUdpzBY1zJuKF"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "76u42N5ZsEWe9fkKFxNgJxAGxxvyxTLJK2j7RvRSnRMM"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("9VnaUtci6JwadzMTFNuoKp6ZVCpRj9ZDV7ndF2dcyyXx"),
        quoteMint: new PublicKey(
          "JAfYSno5Tn6ap8DG2witeef9jZAXFRCxgAbB49j823RJ"
        ),
        baseVault: new PublicKey(
          "DKQeKBz4QoXf5Jn7nCcZgZGsWx2f715MB1ZKgh8NEfnT"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "EiJ4xRTsozNXvkJC2PvqgFyM5oiDLHpEhw8SB4TXJ2YH"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "GVATrdL7ML7nxpLY3ynzamTj7dZw7GATLTqXded4cQjV"
        ),
        eventQueue: new PublicKey(
          "76ymbc11mTufKjsGmdcWBQXRKWiyoh9Eur1uRe2DEE1h"
        ),
        bids: new PublicKey("43rkWeXAa4VYUCKLx3FzmzZNJB2VbZLjYgi27XyUkDtY"),
        asks: new PublicKey("867JiMXUeTKNNr67uSKkMeeCsM4XtDnNN4ShLp48R4Pq"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7jym25MrkJVkCUnEDS8Uh8u65qVHBQjaacw2Cno7p3vW"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("F7biD1Bte7fgQXV6nuxknVf79ygTrfAa7rKDvsQNAVvH"),
        quoteMint: new PublicKey("PE8YGTHXuqiYFQ3UmyA5BSXw3PVVRg7tQGpU5nswdRP"),
        baseVault: new PublicKey(
          "7whPnx5XEECHTNbiVYx5dEbDMZzcsmv7ZsujsohGaRTe"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "HkRBk9iaCzVNLZ5ZNBraXHXoz5qm6XZh8FSroppVM4fR"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "Ct1aejo1EXnnSHWnmzPDm11ZmsAyKZuikkx8m7tFkoDX"
        ),
        eventQueue: new PublicKey(
          "EBvHmYF2hbS6h4LGMeTCT9JPT9LxUFoPmKgwLgoJsqdm"
        ),
        bids: new PublicKey("9rjtoD6j8YDp4iyTpH39pJhHwCLu8oALj9gXmvyqebHK"),
        asks: new PublicKey("4ak5LQHj2MhZLDHWzoRchqcQpawrUqaxGtDBavFn7R9a"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "7kFe7bYSfGTVeBowWcVE2VRHtgTA5YTyMXLhddbrawza"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("8tgEAtnHFFcWKd5VhgE5nt3pbEAC4D1drEGcSA1ZGfBP"),
        quoteMint: new PublicKey(
          "H9tywwzSFbqEuFPvYyvFfrQr7jaqAoRYx963Q2qGbFNA"
        ),
        baseVault: new PublicKey(
          "DXZEeBZdH8wkiivNABpwskGkazqYRPAbNPzmboVvDnhV"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "7SeRNGUw2ziFKgnUot5dCyJwQPgzfJLpyZ8BM8osLkVu"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "G1cRBNHTRH4gaYVirZMk4EtfRQU3t4iirhGNyXMBZpVb"
        ),
        eventQueue: new PublicKey(
          "H6a8Rt1ACXpP14FrBRJNmg8k9aTDmjfxb3e1edCYuSE1"
        ),
        bids: new PublicKey("J6gGFm11pSbnMNpUEgDnwAUit1uL8LN6MmhS8u4BDpM9"),
        asks: new PublicKey("QMissYZb3HWXU1tS3vqQQQH6LM7WBUUiHrX36FoFYdy"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
      {
        accountFlags: serumMarketAccountFlags,
        ownAddress: new PublicKey(
          "J8x6y5G7GmTkuKTbbCAnfhn72vaUU2qsB6je9oKFigHM"
        ),
        vaultSignerNonce: new anchor.BN(0),
        baseMint: new PublicKey("2Stzi7XE3btUQXaauTVB9brPAtPmGnrEDSJmp3w5VY2j"),
        quoteMint: new PublicKey(
          "5Ehp2LtTRmjug39GphXhFEeguz7hGeg41N1U49wU8Kov"
        ),
        baseVault: new PublicKey(
          "9YVE9r9cHFZNwm91p3Js8NBWVznesLSM8FZyswG2MG1B"
        ),
        baseDepositsTotal: new anchor.BN(0),
        baseFeesAccrued: new anchor.BN(0),
        quoteVault: new PublicKey(
          "DecjLCYjb7jdDp2UqA2MS4xjgDjZfvdgMjvkRW7oWs9L"
        ),
        quoteDepositsTotal: new anchor.BN(0),
        quoteFeesAccrued: new anchor.BN(0),
        quoteDustThreshold: new anchor.BN(0),
        requestQueue: new PublicKey(
          "A7D8zuxAmtui3XKz2VcxthAZ5HuwLbN74rrDapMJ3Z5d"
        ),
        eventQueue: new PublicKey(
          "CzK26LWpoU9UjSrZkVu97oZj63abJrNv1zp9Hy2zZdy5"
        ),
        bids: new PublicKey("CaqN8gomPEB1My2czRhetrj5ESKP3VRR3kwKhXtGxohG"),
        asks: new PublicKey("4oAjuVLt5N9au2X3bhYLSi9LRqtk4caBvSPQRwhXuEKP"),
        baseLotSize: new anchor.BN(1),
        quoteLotSize: new anchor.BN(1),
        feeRateBps: new anchor.BN(0),
        referrerRebatesAccrued: new anchor.BN(0),
        openOrdersAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        pruneAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        consumeEventsAuthority: new PublicKey(
          "AVNMK6wiGfppdQNg9WKfMRBXefDPGZFh2f3o1fRbgN8n"
        ),
        epochLength: new anchor.BN(65535),
        epochStartTs: new anchor.BN(0),
        startEpochSeqNum: new anchor.BN(0),
      },
    ],
  },
};

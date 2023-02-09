export enum DecodeType {
  AccountFlags,
  BN,
  PublicKey,
}

export function returnDecodedType(key: string): DecodeType {
  key = key.valueOf();
  if (key === "accountFlags") {
    return DecodeType.AccountFlags;
  }

  let bnList = [
    "vaultSignerNonce",
    "baseDepositsTotal",
    "baseFeesAccrued",
    "quoteDepositsTotal",
    "quoteFeesAccrued",
    "quoteDustThreshold",
    "baseLotSize",
    "quoteLotSize",
    "feeRateBps",
    "referrerRebatesAccrued",
    "epochLength",
    "epochStartTs",
    "startEpochSeqNum",
  ];

  if (bnList.includes(key)) {
    return DecodeType.BN;
  }

  return DecodeType.PublicKey;
}

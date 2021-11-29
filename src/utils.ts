import * as anchor from "@project-serum/anchor";
import {
  ConfirmOptions,
  PublicKey,
  Connection,
  Signer,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  sendAndConfirmRawTransaction,
  AccountInfo,
  SystemProgram,
} from "@solana/web3.js";
import {
  Token,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountLayout as TokenAccountLayout,
  AccountInfo as TokenAccountInfo,
  u64,
} from "@solana/spl-token";
import BufferLayout from "buffer-layout";
const BN = anchor.BN;

import * as constants from "./constants";
import { parseCustomError, idlErrors } from "./errors";
import { exchange as Exchange } from "./exchange";
import { Market } from "./market";
import { OpenOrdersMap } from "./program-types";
import { crankMarketIx } from "./program-instructions";

export async function getState(
  programId: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("state"))],
    programId
  );
}

export async function getSettlement(
  programId: PublicKey,
  underlyingMint: PublicKey,
  expirationTs: anchor.BN
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("settlement")),
      underlyingMint.toBuffer(),
      expirationTs.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );
}

export async function getOpenOrders(
  programId: PublicKey,
  market: PublicKey,
  userKey: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("open-orders")),
      constants.DEX_PID.toBuffer(),
      market.toBuffer(),
      userKey.toBuffer(),
    ],
    programId
  );
}

export async function createOpenOrdersAddress(
  programId: PublicKey,
  market: PublicKey,
  userKey: PublicKey,
  nonce: number
): Promise<PublicKey> {
  return await PublicKey.createProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("open-orders")),
      constants.DEX_PID.toBuffer(),
      market.toBuffer(),
      userKey.toBuffer(),
      Buffer.from([nonce]),
    ],
    programId
  );
}

export async function getOpenOrdersMap(
  programId: PublicKey,
  openOrders: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [openOrders.toBuffer()],
    programId
  );
}

export async function getSerumAuthority(
  programId: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("serum"))],
    programId
  );
}

export async function getMintAuthority(
  programId: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("mint-auth"))],
    programId
  );
}

export async function getVault(
  programId: PublicKey,
  zetaGroup: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("vault")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export async function getSerumVault(
  programId: PublicKey,
  mint: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("serum-vault")),
      mint.toBuffer(),
    ],
    programId
  );
}

export async function getZetaVault(
  programId: PublicKey,
  mint: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("zeta-vault")),
      mint.toBuffer(),
    ],
    programId
  );
}

export async function getZetaInsuranceVault(
  programId: PublicKey,
  zetaGroup: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("zeta-insurance-vault")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export async function getUserInsuranceDepositAccount(
  programId: PublicKey,
  zetaGroup: PublicKey,
  userKey: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("user-insurance-deposit")),
      zetaGroup.toBuffer(),
      userKey.toBuffer(),
    ],
    programId
  );
}

export async function getZetaGroup(
  programId: PublicKey,
  mint: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("zeta-group")),
      mint.toBuffer(),
    ],
    programId
  );
}

export async function getUnderlying(
  programId: PublicKey,
  underlyingIndex: number
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("underlying")),
      Buffer.from([underlyingIndex]),
    ],
    programId
  );
}

export async function getGreeks(
  programId: PublicKey,
  zetaGroup: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("greeks")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export async function getMarketIndexes(
  programId: PublicKey,
  zetaGroup: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("market-indexes")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export async function getBaseMint(
  programId: PublicKey,
  market: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("base-mint")),
      market.toBuffer(),
    ],
    programId
  );
}

export async function getQuoteMint(
  programId: PublicKey,
  market: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("quote-mint")),
      market.toBuffer(),
    ],
    programId
  );
}

export async function getMarginAccount(
  programId: PublicKey,
  zetaGroup: PublicKey,
  userKey: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("margin")),
      zetaGroup.toBuffer(),
      userKey.toBuffer(),
    ],
    programId
  );
}

export async function getMarketUninitialized(
  programId: PublicKey,
  zetaGroup: PublicKey,
  marketIndex: number
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("market")),
      zetaGroup.toBuffer(),
      Buffer.from([marketIndex]),
    ],
    programId
  );
}

/**
 * Returns the expected PDA by serum to own the serum vault
 * Serum uses a u64 as nonce which is not the same as
 * normal solana PDA convention and goes 0 -> 255
 */
export async function getSerumVaultOwnerAndNonce(
  market: PublicKey,
  dexPid: PublicKey
): Promise<[PublicKey, anchor.BN]> {
  const nonce = new BN(0);
  while (nonce.toNumber() < 255) {
    try {
      const vaultOwner: PublicKey = await PublicKey.createProgramAddress(
        [market.toBuffer(), nonce.toArrayLike(Buffer, "le", 8)],
        dexPid
      );
      return [vaultOwner, nonce];
    } catch (e) {
      nonce.iaddn(1);
    }
  }
  throw new Error("Unable to find nonce");
}

export async function createUsdcMint(
  provider: anchor.Provider,
  usdcMintAuthority: PublicKey
): Promise<Token> {
  let payer = (provider.wallet as anchor.Wallet).payer;
  // This is for USDC for the program overall
  let usdcMint = await Token.createMint(
    provider.connection,
    payer,
    usdcMintAuthority,
    null,
    6,
    TOKEN_PROGRAM_ID
  );
  return usdcMint;
}

/**
 * Serum interprets publickeys as [u64; 4]
 * Which requires swap64 sorting.
 */
export function sortOpenOrderKeys(keys: PublicKey[]): PublicKey[] {
  return keys.sort((a, b) =>
    a.toBuffer().swap64().compare(b.toBuffer().swap64())
  );
}

/**
 * Normal sorting of keys
 */
export function sortMarketKeys(keys: PublicKey[]): PublicKey[] {
  return keys.sort((a, b) => a.toBuffer().compare(b.toBuffer()));
}

// Converts from int/float to native fixed point number.
export function getNativeAmount(amount: number): number {
  return Math.floor(amount * Math.pow(10, 6));
}

// Converts from native fixed point number to normal decimal number.
export function getReadableAmount(amount: number): number {
  return amount / Math.pow(10, 6);
}

export async function getTokenMint(
  connection: Connection,
  key: PublicKey
): Promise<PublicKey> {
  let info = await getTokenAccountInfo(connection, key);
  return new PublicKey(info.mint);
}

/**
 * Copied from @solana/spl-token but their version requires you to
 * construct a Token object which is completely unnecessary
 */
export async function getTokenAccountInfo(
  connection: Connection,
  key: PublicKey
): Promise<any> {
  let info = await connection.getAccountInfo(key);
  if (info === null) {
    throw Error(`Token account ${key.toString()} doesn't exist.`);
  }
  if (info.data.length != TokenAccountLayout.span) {
    throw new Error(`Invalid account size`);
  }

  const data = Buffer.from(info.data);
  const accountInfo = TokenAccountLayout.decode(data);
  accountInfo.address = key;
  accountInfo.mint = new PublicKey(accountInfo.mint);
  accountInfo.owner = new PublicKey(accountInfo.owner);
  accountInfo.amount = u64.fromBuffer(accountInfo.amount);

  if (accountInfo.delegateOption === 0) {
    accountInfo.delegate = null;
    accountInfo.delegatedAmount = new u64(0);
  } else {
    accountInfo.delegate = new PublicKey(accountInfo.delegate);
    accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
  }

  accountInfo.isInitialized = accountInfo.state !== 0;
  accountInfo.isFrozen = accountInfo.state === 2;

  if (accountInfo.isNativeOption === 1) {
    accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
    accountInfo.isNative = true;
  } else {
    accountInfo.rentExemptReserve = null;
    accountInfo.isNative = false;
  }

  if (accountInfo.closeAuthorityOption === 0) {
    accountInfo.closeAuthority = null;
  } else {
    accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
  }

  return accountInfo;
}

export async function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  return (
    await PublicKey.findProgramAddress(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
}

export function defaultCommitment(): ConfirmOptions {
  return {
    skipPreflight: false,
    preflightCommitment: "processed",
    commitment: "processed",
  };
}

export async function processTransaction(
  provider: anchor.Provider,
  tx: Transaction,
  signers?: Array<Signer>,
  opts?: ConfirmOptions
): Promise<TransactionSignature> {
  const blockhash = await provider.connection.getRecentBlockhash();
  tx.recentBlockhash = blockhash.blockhash;
  tx.feePayer = provider.wallet.publicKey;
  tx = await provider.wallet.signTransaction(tx);
  if (signers === undefined) {
    signers = [];
  }
  signers
    .filter((s) => s !== undefined)
    .forEach((kp) => {
      tx.partialSign(kp);
    });

  try {
    let txSig = await sendAndConfirmRawTransaction(
      provider.connection,
      tx.serialize(),
      opts || defaultCommitment()
    );
    return txSig;
  } catch (err) {
    let translatedErr = anchor.ProgramError.parse(err, idlErrors);
    if (translatedErr === null) {
      throw parseCustomError(err);
    }
    throw translatedErr;
  }
}

const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};

const int64 = (property = "int64") => {
  return BufferLayout.blob(8, property);
};

const SystemClockLayout = BufferLayout.struct([
  uint64("slot"),
  int64("epochStartTimestamp"),
  uint64("epoch"),
  uint64("leaderScheduleEpoch"),
  int64("unixTimestamp"),
]);

export function getClockTimestamp(accountInfo: AccountInfo<Buffer>): number {
  let info = SystemClockLayout.decode(accountInfo.data);
  return Number(info.unixTimestamp.readBigInt64LE(0));
}

export function getPriceFromSerumOrderKey(key: anchor.BN): anchor.BN {
  return key.ushrn(64);
}

export function splitIxsIntoTx(
  ixs: TransactionInstruction[],
  ixsPerTx: number
): Transaction[] {
  let txs: Transaction[] = [];
  for (var i = 0; i < ixs.length; i += ixsPerTx) {
    let tx = new Transaction();
    let slice = ixs.slice(i, i + ixsPerTx);
    slice.forEach((ix) => tx.add(ix));
    txs.push(tx);
  }
  return txs;
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms, undefined));
}

// Returns the market indices ordered such that front expiry indexes are first.
export function getOrderedMarketIndexes(): number[] {
  let indexes = Array.from(Array(Exchange.zetaGroup.products.length).keys());
  let frontExpiryIndex = Exchange.zetaGroup.frontExpiryIndex;
  let backExpiryIndex = (frontExpiryIndex + 1) % 2;
  let frontStart = frontExpiryIndex * constants.PRODUCTS_PER_EXPIRY;
  let backStart = backExpiryIndex * constants.PRODUCTS_PER_EXPIRY;
  indexes = indexes
    .slice(frontStart, frontStart + constants.PRODUCTS_PER_EXPIRY)
    .concat(
      indexes.slice(backStart, backStart + constants.PRODUCTS_PER_EXPIRY)
    );
  return indexes;
}

export function getDirtySeriesIndices(): number[] {
  let dirtyIndices = [];
  for (var i = 0; i < Exchange.zetaGroup.expirySeries.length; i++) {
    if (Exchange.zetaGroup.expirySeries[i].dirty) {
      dirtyIndices.push(i);
    }
  }

  return dirtyIndices;
}

export function displayState() {
  let orderedIndexes = [
    Exchange.zetaGroup.frontExpiryIndex,
    getMostRecentExpiredIndex(),
  ];

  console.log(`[EXCHANGE] Display market state...`);
  for (var i = 0; i < orderedIndexes.length; i++) {
    let index = orderedIndexes[i];
    console.log(
      `Expiration @ ${new Date(
        Exchange.markets.expirySeries[index].expiryTs * 1000
      )}`
    );
    let markets = Exchange.markets.getMarketsByExpiryIndex(index);
    for (var j = 0; j < markets.length; j++) {
      let market = markets[j];
      console.log(
        `[MARKET] INDEX: ${market.marketIndex} KIND: ${market.kind} STRIKE: ${market.strike}`
      );
    }
  }
}

/**
 * Allows you to pass in a map that may have cached values for openOrdersAccounts
 * @param eventQueue
 * @param marketIndex
 * @param openOrdersToMargin
 * @returns remainingAccounts
 */
export async function getCrankRemainingAccounts(
  eventQueue: any[],
  marketIndex: number,
  openOrdersToMargin?: Map<PublicKey, PublicKey>
) {
  const openOrdersSet = new Set();
  for (var i = 0; i < eventQueue.length; i++) {
    openOrdersSet.add(eventQueue[i].openOrders.toString());
    if (openOrdersSet.size == constants.CRANK_ACCOUNT_LIMIT) {
      break;
    }
  }

  const uniqueOpenOrders = sortOpenOrderKeys(
    [...openOrdersSet].map((s) => new PublicKey(s))
  );

  let remainingAccounts: any[] = new Array(uniqueOpenOrders.length * 2);

  await Promise.all(
    uniqueOpenOrders.map(async (openOrders, index) => {
      let marginAccount: PublicKey;
      if (openOrdersToMargin && !openOrdersToMargin.has(openOrders)) {
        marginAccount = await getMarginFromOpenOrders(openOrders, marketIndex);
        openOrdersToMargin.set(openOrders, marginAccount);
      } else if (openOrdersToMargin && openOrdersToMargin.has(openOrders)) {
        marginAccount = openOrdersToMargin.get(openOrders);
      } else {
        marginAccount = await getMarginFromOpenOrders(openOrders, marketIndex);
      }

      let openOrdersIndex = index * 2;
      remainingAccounts[openOrdersIndex] = {
        pubkey: openOrders,
        isSigner: false,
        isWritable: true,
      };
      remainingAccounts[openOrdersIndex + 1] = {
        pubkey: marginAccount,
        isSigner: false,
        isWritable: true,
      };
    })
  );
  return remainingAccounts;
}

export async function getMarginFromOpenOrders(
  openOrders: PublicKey,
  marketIndex: number
) {
  const [openOrdersMap, _openOrdersMapNonce] = await getOpenOrdersMap(
    Exchange.programId,
    openOrders
  );
  let openOrdersMapInfo = (await Exchange.program.account.openOrdersMap.fetch(
    openOrdersMap
  )) as OpenOrdersMap;
  const [marginAccount, _marginNonce] = await getMarginAccount(
    Exchange.programId,
    Exchange.markets.markets[marketIndex].zetaGroup,
    openOrdersMapInfo.userKey
  );

  return marginAccount;
}

export function getNextStrikeInitialisationTs() {
  // If front expiration index is uninitialized
  let frontExpirySeries =
    Exchange.markets.expirySeries[Exchange.markets.frontExpiryIndex];
  if (!frontExpirySeries.strikesInitialized) {
    return (
      frontExpirySeries.activeTs -
      Exchange.state.strikeInitializationThresholdSeconds
    );
  }

  // Checks for the first uninitialized back expiry series after our front expiry index
  let backExpiryTs = 0;
  let expiryIndex = Exchange.markets.frontExpiryIndex;
  for (var i = 0; i < Exchange.markets.expirySeries.length; i++) {
    // Wrap around
    if (expiryIndex == Exchange.markets.expirySeries.length) {
      expiryIndex = 0;
    }

    if (!Exchange.markets.expirySeries[expiryIndex].strikesInitialized) {
      return (
        Exchange.markets.expirySeries[expiryIndex].activeTs -
        Exchange.state.strikeInitializationThresholdSeconds
      );
    }
    backExpiryTs = Math.max(
      backExpiryTs,
      Exchange.markets.expirySeries[expiryIndex].expiryTs
    );

    expiryIndex++;
  }

  return (
    backExpiryTs -
    Exchange.state.strikeInitializationThresholdSeconds -
    Exchange.state.newExpiryThresholdSeconds
  );
}

export async function cleanZetaMarkets(marketAccountTuples: any[]) {
  let txs: Transaction[] = [];
  for (
    var i = 0;
    i < marketAccountTuples.length;
    i += constants.CLEAN_MARKET_LIMIT
  ) {
    let tx = new Transaction();
    let slice = marketAccountTuples.slice(i, i + constants.CLEAN_MARKET_LIMIT);
    tx.add(
      await Exchange.program.instruction.cleanZetaMarkets({
        accounts: {
          state: Exchange.stateAddress,
          zetaGroup: Exchange.zetaGroupAddress,
        },
        remainingAccounts: slice.flat(),
      })
    );
    txs.push(tx);
  }

  await Promise.all(
    txs.map(async (tx) => {
      await processTransaction(Exchange.provider, tx);
    })
  );
}

export async function settleUsers(userAccounts: any[], expiryTs: anchor.BN) {
  let [settlement, settlementNonce] = await getSettlement(
    Exchange.programId,
    Exchange.zetaGroup.underlyingMint,
    expiryTs
  );

  // TODO this is naive, the program will throw if user has active
  // orders for this expiration timestamp.
  // Maybe add a check, otherwise, make sure clean option markets works.
  let remainingAccounts = userAccounts.map((acc) => {
    return { pubkey: acc.publicKey, isSigner: false, isWritable: true };
  });

  let txs = [];
  for (
    var i = 0;
    i < remainingAccounts.length;
    i += constants.MAX_SETTLEMENT_ACCOUNTS
  ) {
    let tx = new Transaction();
    let slice = remainingAccounts.slice(
      i,
      i + constants.MAX_SETTLEMENT_ACCOUNTS
    );
    tx.add(
      await Exchange.program.instruction.settlePositions(
        expiryTs,
        settlementNonce,
        {
          accounts: {
            zetaGroup: Exchange.zetaGroupAddress,
            settlementAccount: settlement,
          },
          remainingAccounts: slice,
        }
      )
    );
    txs.push(tx);
  }

  await Promise.all(
    txs.map(async (tx) => {
      let txSig = await processTransaction(Exchange.provider, tx);
      console.log(`Settling user: ${txSig}`);
    })
  );
}

export async function crankMarket(market: Market, remainingAccounts: any[]) {
  let tx = new Transaction().add(
    await crankMarketIx(
      market.address,
      market.serumMarket.decoded.eventQueue,
      constants.DEX_PID,
      remainingAccounts
    )
  );
  await processTransaction(Exchange.provider, tx);
}

export async function expireSeries(expiryTs: anchor.BN) {
  let [settlement, settlementNonce] = await getSettlement(
    Exchange.programId,
    Exchange.zetaGroup.underlyingMint,
    expiryTs
  );

  // TODO add some looping mechanism if called early.
  await Exchange.program.rpc.expireSeries(settlementNonce, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      oracle: Exchange.zetaGroup.oracle,
      settlementAccount: settlement,
      payer: Exchange.provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
      greeks: Exchange.zetaGroup.greeks,
    },
  });

  return settlement;
}

/**
 * Get the most recently expired index
 */
export function getMostRecentExpiredIndex() {
  if (Exchange.markets.frontExpiryIndex - 1 < 0) {
    return constants.ACTIVE_EXPIRIES - 1;
  } else {
    return Exchange.markets.frontExpiryIndex - 1;
  }
}

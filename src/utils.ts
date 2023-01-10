import * as anchor from "@zetamarkets/anchor";
import {
  Commitment,
  Keypair,
  ConfirmOptions,
  PublicKey,
  Connection,
  Signer,
  Transaction,
  TransactionInstruction,
  TransactionSignature,
  AccountInfo,
  SystemProgram,
  TransactionMessage,
  MessageV0,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  AccountLayout as TokenAccountLayout,
  u64,
} from "@solana/spl-token";
import BufferLayout from "buffer-layout";
const BN = anchor.BN;
import * as bs58 from "bs58";
import { Asset, assetToName, nameToAsset } from "./assets";
import * as fs from "fs";
import * as constants from "./constants";
import * as errors from "./errors";
import { exchange as Exchange } from "./exchange";
import { SubExchange } from "./subexchange";
import { Market } from "./market";
import {
  MarginAccount,
  ReferrerAlias,
  TradeEventV2,
  OpenOrdersMap,
} from "./program-types";
import * as types from "./types";
import * as instructions from "./program-instructions";
import { Decimal } from "./decimal";
import { readBigInt64LE } from "./oracle-utils";
import { assets } from ".";

export async function getState(
  programId: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("state"))],
    programId
  );
}

export async function getMarketNode(
  programId: PublicKey,
  zetaGroup: PublicKey,
  marketIndex: number
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("market-node")),
      zetaGroup.toBuffer(),
      Buffer.from([marketIndex]),
    ],
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
      constants.DEX_PID[Exchange.network].toBuffer(),
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
      constants.DEX_PID[Exchange.network].toBuffer(),
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

export async function getZetaTreasuryWallet(
  programId: PublicKey,
  mint: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("zeta-treasury-wallet")),
      mint.toBuffer(),
    ],
    programId
  );
}

export async function getZetaReferralsRewardsWallet(
  programId: PublicKey,
  mint: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(
        anchor.utils.bytes.utf8.encode("zeta-referrals-rewards-wallet")
      ),
      mint.toBuffer(),
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

export async function getUserWhitelistDepositAccount(
  programId: PublicKey,
  userKey: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("whitelist-deposit")),
      userKey.toBuffer(),
    ],
    programId
  );
}

export async function getUserWhitelistInsuranceAccount(
  programId: PublicKey,
  userKey: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("whitelist-insurance")),
      userKey.toBuffer(),
    ],
    programId
  );
}

export async function getUserWhitelistTradingFeesAccount(
  programId: PublicKey,
  userKey: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("whitelist-trading-fees")),
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

export async function getPerpSyncQueue(
  programId: PublicKey,
  zetaGroup: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("perp-sync-queue")),
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

export async function getSpreadAccount(
  programId: PublicKey,
  zetaGroup: PublicKey,
  userKey: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("spread")),
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

export async function getSocializedLossAccount(
  programId: PublicKey,
  zetaGroup: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("socialized-loss")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export async function getReferrerAccountAddress(
  programId: PublicKey,
  referrer: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("referrer")),
      referrer.toBuffer(),
    ],
    programId
  );
}

export async function getReferralAccountAddress(
  programId: PublicKey,
  user: PublicKey
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [Buffer.from(anchor.utils.bytes.utf8.encode("referral")), user.toBuffer()],
    programId
  );
}

export async function getReferrerAliasAddress(
  programId: PublicKey,
  alias: string
): Promise<[PublicKey, number]> {
  return await anchor.web3.PublicKey.findProgramAddress(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("referrer-alias")),
      Buffer.from(alias),
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

/**
 * Converts a decimal number to native fixed point integer of precision 6.
 */
export function convertDecimalToNativeInteger(amount: number): number {
  return parseInt(
    (amount * Math.pow(10, constants.PLATFORM_PRECISION)).toFixed(0)
  );
}

/**
 * Returns the trade event price. This may return a number that
 * does not divide perfectly by tick size (0.0001) if your order traded
 * against orders at different prices.
 */
export function getTradeEventPrice(event: TradeEventV2): number {
  let decimalCostOfTrades = convertNativeBNToDecimal(event.costOfTrades);
  let decimalSize = convertNativeLotSizeToDecimal(event.size.toNumber());
  return decimalCostOfTrades / decimalSize;
}

/**
 * Converts a native fixed point integer of precision 6 to decimal.
 */
export function convertNativeIntegerToDecimal(amount: number): number {
  return amount / Math.pow(10, constants.PLATFORM_PRECISION);
}

/**
 * Converts a program BN to a decimal number.
 * @param pricing   whether the BN you are converting is a pricing BN - defaults to false.
 */
export function convertNativeBNToDecimal(
  number: anchor.BN,
  precision = constants.PLATFORM_PRECISION
): number {
  // Note 53 bits - max number is slightly larger than 9 * 10 ^ 9 with decimals.
  let precisionBn = new anchor.BN(Math.pow(10, precision));

  return (
    // Integer
    number.div(precisionBn).toNumber() +
    // Decimal
    number.mod(precisionBn).toNumber() / precisionBn.toNumber()
  );
}

/**
 * Converts a native lot size where 1 unit = 0.001 lots to human readable decimal
 * @param amount
 */
export function convertNativeLotSizeToDecimal(amount: number): number {
  return amount / Math.pow(10, constants.POSITION_PRECISION);
}

/**
 * Converts a native lot size where 1 unit = 0.001 lots to human readable decimal
 * @param amount
 */
export function convertDecimalToNativeLotSize(amount: number): number {
  return parseInt(
    (amount * Math.pow(10, constants.POSITION_PRECISION)).toFixed(0)
  );
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
    accountInfo.delegatedAmount = 0;
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
    preflightCommitment: "confirmed",
    commitment: "confirmed",
  };
}

export function commitmentConfig(commitment: Commitment): ConfirmOptions {
  return {
    skipPreflight: false,
    preflightCommitment: commitment,
    commitment,
  };
}
export async function simulateTransaction(
  provider: anchor.AnchorProvider,
  tx: Transaction
) {
  let response: any;
  try {
    response = await provider.simulate(tx);
  } catch (err) {
    let parsedErr = parseError(err);
    throw parsedErr;
  }

  if (response === undefined) {
    throw new Error("Unable to simulate transaction");
  }
  const logs = response.logs;
  if (!logs) {
    throw new Error("Simulated logs not found");
  }

  let parser = new anchor.EventParser(
    Exchange.programId,
    Exchange.program.coder
  );

  let events = parser.parseLogs(response.logs);

  return { events, raw: logs };
}

export async function processTransaction(
  provider: anchor.AnchorProvider,
  tx: Transaction,
  signers?: Array<Signer>,
  opts?: ConfirmOptions,
  useLedger: boolean = false,
  blockhash?: string
): Promise<TransactionSignature> {
  // create v0 compatible message

  let v0Tx: VersionedTransaction = new VersionedTransaction(
    new TransactionMessage({
      payerKey: provider.wallet.publicKey,
      recentBlockhash:
        blockhash ?? (await provider.connection.getRecentBlockhash()).blockhash,
      instructions: tx.instructions,
    }).compileToV0Message()
  );

  let sigs = (signers ?? [])
    .filter((s) => s !== undefined)
    .map((kp) => {
      return kp;
    });

  v0Tx.sign(sigs);

  // if (useLedger) {
  //   tx = await Exchange.ledgerWallet.signTransaction(tx);
  // } else {
  //   tx = await provider.wallet.signTransaction(tx);
  // }

  v0Tx = (await provider.wallet.signTransaction(v0Tx)) as VersionedTransaction;

  try {
    return await anchor.sendAndConfirmRawTransaction(
      provider.connection,
      v0Tx.serialize(),
      opts || commitmentConfig(provider.connection.commitment)
    );
  } catch (err) {
    let parsedErr = parseError(err);
    throw parsedErr;
  }
}

export function parseError(err: any) {
  const anchorError = anchor.AnchorError.parse(err.logs);
  if (anchorError) {
    // Parse Anchor error into another type such that it's consistent.
    return errors.NativeAnchorError.parse(anchorError);
  }

  const programError = anchor.ProgramError.parse(err, errors.idlErrors);
  if (programError) {
    return programError;
  }

  let customErr = errors.parseCustomError(err);
  if (customErr != null) {
    return customErr;
  }

  let nativeErr = errors.NativeError.parse(err);
  if (nativeErr != null) {
    return nativeErr;
  }

  if (err.simulationResponse) {
    let simulatedError = anchor.AnchorError.parse(err.simulationResponse.logs);
    if (simulatedError) {
      return errors.NativeAnchorError.parse(simulatedError);
    }
  }

  return err;
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

export function getClockData(
  accountInfo: AccountInfo<Buffer>
): types.ClockData {
  let info = SystemClockLayout.decode(accountInfo.data);
  return {
    timestamp: Number(readBigInt64LE(info.unixTimestamp, 0)),
    slot: Number(readBigInt64LE(info.slot, 0)),
  };
}

export function getPriceFromSerumOrderKey(key: anchor.BN): anchor.BN {
  return key.ushrn(64);
}

export function getSeqNumFromSerumOrderKey(
  key: anchor.BN,
  isBid: boolean
): anchor.BN {
  let lower = key.maskn(64);
  if (isBid) {
    let x = lower.notn(64);
    return x;
  } else {
    return lower;
  }
}

export function splitIxsIntoTx(
  ixs: TransactionInstruction[],
  ixsPerTx: number
): Transaction[] {
  let txs: Transaction[] = [];
  for (var i = 0; i < ixs.length; i += ixsPerTx) {
    let tx = new Transaction();
    let slice = ixs.slice(i, i + ixsPerTx);
    for (let j = 0; j < slice.length; j++) {
      tx.add(slice[j]);
    }
    txs.push(tx);
  }
  return txs;
}

export async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms, undefined));
}

// Returns the market indices ordered such that front expiry indexes are first.
export function getOrderedMarketIndexes(asset: Asset): number[] {
  let subExchange = Exchange.getSubExchange(asset);
  let indexes = Array.from(Array(subExchange.zetaGroup.products.length).keys());
  let frontExpiryIndex = subExchange.zetaGroup.frontExpiryIndex;
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

export function getDirtySeriesIndices(asset: Asset): number[] {
  let dirtyIndices = [];
  let subExchange = Exchange.getSubExchange(asset);
  for (var i = 0; i < subExchange.zetaGroup.expirySeries.length; i++) {
    if (subExchange.zetaGroup.expirySeries[i].dirty) {
      dirtyIndices.push(i);
    }
  }

  return dirtyIndices;
}

/**
 * Given a market index, return the index to access the greeks.productGreeks.
 */
export function getGreeksIndex(marketIndex: number): number {
  let expirySeries = Math.floor(marketIndex / constants.PRODUCTS_PER_EXPIRY);
  let modIndex = marketIndex % constants.PRODUCTS_PER_EXPIRY;
  return (
    expirySeries * constants.NUM_STRIKES + (modIndex % constants.NUM_STRIKES)
  );
}

function printMarkets(markets: Market[], subExchange: SubExchange) {
  for (var j = 0; j < markets.length; j++) {
    let market = markets[j];

    // Custom log for perps
    if (market.kind == types.Kind.PERP) {
      let markPrice = subExchange.getMarkPrice(market.marketIndex);
      console.log(
        `[MARKET] INDEX: ${constants.PERP_INDEX} KIND: ${
          market.kind
        } MARK_PRICE ${markPrice.toFixed(6)}`
      );
      return;
    }

    let greeksIndex = getGreeksIndex(market.marketIndex);
    let markPrice = subExchange.getMarkPrice(market.marketIndex);

    let delta = 1;
    let sigma = 0;
    let vega = 0;

    if (market.kind != types.Kind.FUTURE) {
      delta = convertNativeBNToDecimal(
        subExchange.greeks.productGreeks[greeksIndex].delta,
        constants.PRICING_PRECISION
      );

      sigma = Decimal.fromAnchorDecimal(
        subExchange.greeks.productGreeks[greeksIndex].volatility
      ).toNumber();

      vega = Decimal.fromAnchorDecimal(
        subExchange.greeks.productGreeks[greeksIndex].vega
      ).toNumber();
    }

    console.log(
      `[MARKET] INDEX: ${market.marketIndex} KIND: ${market.kind} STRIKE: ${
        market.strike
      } MARK_PRICE: ${markPrice.toFixed(6)} DELTA: ${delta.toFixed(
        2
      )} IV: ${sigma.toFixed(6)} VEGA: ${vega.toFixed(6)}`
    );
  }
}

export function displayState() {
  let subExchanges = Exchange.subExchanges;

  for (var [asset, subExchange] of subExchanges) {
    let orderedIndexes = [
      subExchange.zetaGroup.frontExpiryIndex,
      getMostRecentExpiredIndex(asset),
    ];

    console.log(
      `[EXCHANGE ${assetToName(subExchange.asset)}] Display market state...`
    );

    // Products with expiries, ie options and futures
    for (var i = 0; i < orderedIndexes.length; i++) {
      let index = orderedIndexes[i];
      let expirySeries = subExchange.markets.expirySeries[index];
      console.log(
        `Active @ ${new Date(
          expirySeries.activeTs * 1000
        )}, Expiration @ ${new Date(
          expirySeries.expiryTs * 1000
        )} Live: ${expirySeries.isLive()}`
      );
      let interestRate = convertNativeBNToDecimal(
        subExchange.greeks.interestRate[index],
        constants.PRICING_PRECISION
      );
      console.log(`Interest rate: ${interestRate}`);
      printMarkets(
        subExchange.markets.getMarketsByExpiryIndex(index),
        subExchange
      );
    }

    // Products without expiries, ie perps
    printMarkets([subExchange.markets.perpMarket], subExchange);
  }
}

export async function getMarginFromOpenOrders(
  asset: Asset,
  openOrders: PublicKey,
  market: Market
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
    market.zetaGroup,
    openOrdersMapInfo.userKey
  );

  return marginAccount;
}

export function getNextStrikeInitialisationTs(asset: Asset) {
  let subExchange = Exchange.getSubExchange(asset);
  // If front expiration index is uninitialized
  let frontExpirySeries =
    subExchange.markets.expirySeries[subExchange.markets.frontExpiryIndex];
  if (!frontExpirySeries.strikesInitialized) {
    return (
      frontExpirySeries.activeTs -
      Exchange.state.strikeInitializationThresholdSeconds
    );
  }

  // Checks for the first uninitialized back expiry series after our front expiry index
  let backExpiryTs = 0;
  let expiryIndex = subExchange.markets.frontExpiryIndex;
  for (var i = 0; i < subExchange.markets.expirySeries.length; i++) {
    // Wrap around
    if (expiryIndex == subExchange.markets.expirySeries.length) {
      expiryIndex = 0;
    }

    if (!subExchange.markets.expirySeries[expiryIndex].strikesInitialized) {
      return (
        subExchange.markets.expirySeries[expiryIndex].activeTs -
        Exchange.state.strikeInitializationThresholdSeconds
      );
    }
    backExpiryTs = Math.max(
      backExpiryTs,
      subExchange.markets.expirySeries[expiryIndex].expiryTs
    );

    expiryIndex++;
  }

  return (
    backExpiryTs -
    Exchange.state.strikeInitializationThresholdSeconds -
    subExchange.zetaGroup.newExpiryThresholdSeconds
  );
}

export async function cleanZetaMarkets(
  asset: Asset,
  marketAccountTuples: any[]
) {
  let txs: Transaction[] = [];
  for (
    var i = 0;
    i < marketAccountTuples.length;
    i += constants.CLEAN_MARKET_LIMIT
  ) {
    let tx = new Transaction();
    let slice = marketAccountTuples.slice(i, i + constants.CLEAN_MARKET_LIMIT);
    tx.add(instructions.cleanZetaMarketsIx(asset, slice.flat()));
    txs.push(tx);
  }
  await Promise.all(
    txs.map(async (tx) => {
      await processTransaction(Exchange.provider, tx);
    })
  );
}

export async function cleanZetaMarketsHalted(
  asset: Asset,
  marketAccountTuples: any[]
) {
  let txs: Transaction[] = [];
  for (
    var i = 0;
    i < marketAccountTuples.length;
    i += constants.CLEAN_MARKET_LIMIT
  ) {
    let tx = new Transaction();
    let slice = marketAccountTuples.slice(i, i + constants.CLEAN_MARKET_LIMIT);
    tx.add(instructions.cleanZetaMarketsHaltedIx(asset, slice.flat()));
    txs.push(tx);
  }
  await Promise.all(
    txs.map(async (tx) => {
      await processTransaction(Exchange.provider, tx);
    })
  );
}

export async function settleUsers(
  asset: Asset,
  keys: PublicKey[],
  expiryTs: anchor.BN,
  accountType: types.ProgramAccountType = types.ProgramAccountType.MarginAccount
) {
  let [settlement, settlementNonce] = await getSettlement(
    Exchange.programId,
    Exchange.getSubExchange(asset).zetaGroup.underlyingMint,
    expiryTs
  );

  let remainingAccounts = keys.map((key) => {
    return { pubkey: key, isSigner: false, isWritable: true };
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
      accountType == types.ProgramAccountType.MarginAccount
        ? instructions.settlePositionsIx(
            asset,
            expiryTs,
            settlement,
            settlementNonce,
            slice
          )
        : instructions.settleSpreadPositionsIx(
            asset,
            expiryTs,
            settlement,
            settlementNonce,
            slice
          )
    );
    txs.push(tx);
  }

  await Promise.all(
    txs.map(async (tx) => {
      let txSig = await processTransaction(Exchange.provider, tx);
      console.log(`Settling users - TxId: ${txSig}`);
    })
  );
}

/*
 * Allows you to pass in a map that may have cached values for openOrdersAccounts
 */
export async function crankMarket(
  asset: Asset,
  marketIndex: number,
  openOrdersToMargin?: Map<PublicKey, PublicKey>,
  crankLimit?: number
) {
  let market = Exchange.getMarket(asset, marketIndex);
  let eventQueue = await market.serumMarket.loadEventQueue(Exchange.connection);
  if (eventQueue.length == 0) {
    return;
  }
  const openOrdersSet = new Set();
  // We pass in a couple of extra accounts for perps so the limit is lower
  let limit =
    market.kind == types.Kind.PERP
      ? constants.CRANK_PERP_ACCOUNT_LIMIT
      : constants.CRANK_ACCOUNT_LIMIT;

  // Manually defined crankLimit will override
  if (crankLimit) {
    limit = crankLimit;
  }

  for (var i = 0; i < eventQueue.length; i++) {
    openOrdersSet.add(eventQueue[i].openOrders.toString());
    if (openOrdersSet.size == limit) {
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
        marginAccount = await getMarginFromOpenOrders(
          asset,
          openOrders,
          market
        );
        openOrdersToMargin.set(openOrders, marginAccount);
      } else if (openOrdersToMargin && openOrdersToMargin.has(openOrders)) {
        marginAccount = openOrdersToMargin.get(openOrders);
      } else {
        marginAccount = await getMarginFromOpenOrders(
          asset,
          openOrders,
          market
        );
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

  if (marketIndex == constants.PERP_INDEX) {
    remainingAccounts.unshift(
      {
        pubkey: Exchange.getSubExchange(asset).greeksAddress,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: Exchange.getSubExchange(asset).perpSyncQueueAddress,
        isSigner: false,
        isWritable: true,
      }
    );
  }

  let tx = new Transaction().add(
    instructions.crankMarketIx(
      asset,
      market.address,
      market.serumMarket.eventQueueAddress,
      constants.DEX_PID[Exchange.network],
      remainingAccounts
    )
  );
  await processTransaction(Exchange.provider, tx);
}

/*
 * prune expired TIF orders from a list of market indices.
 */
export async function pruneExpiredTIFOrders(
  asset: Asset,
  marketIndices: number[]
) {
  let ixs = marketIndices.map((i) => {
    return instructions.pruneExpiredTIFOrdersIx(asset, i);
  });

  let txs = splitIxsIntoTx(ixs, 10);

  await Promise.all(
    txs.map(async (tx) => {
      return processTransaction(Exchange.provider, tx);
    })
  );
}

export async function expireSeries(asset: Asset, expiryTs: anchor.BN) {
  let subExchange = Exchange.getSubExchange(asset);
  let [settlement, settlementNonce] = await getSettlement(
    Exchange.programId,
    subExchange.zetaGroup.underlyingMint,
    expiryTs
  );

  // TODO add some looping mechanism if called early.
  let ix = Exchange.program.instruction.expireSeries(settlementNonce, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      oracle: subExchange.zetaGroup.oracle,
      settlementAccount: settlement,
      payer: Exchange.provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
      greeks: subExchange.zetaGroup.greeks,
    },
  });

  let tx = new Transaction().add(ix);
  await processTransaction(Exchange.provider, tx);
}

/**
 * Get the most recently expired index
 */
export function getMostRecentExpiredIndex(asset: Asset) {
  let subExchange = Exchange.getSubExchange(asset);
  if (subExchange.markets.frontExpiryIndex - 1 < 0) {
    return constants.ACTIVE_EXPIRIES - 1;
  } else {
    return subExchange.markets.frontExpiryIndex - 1;
  }
}

export function getMutMarketAccounts(
  asset: Asset,
  marketIndex: number
): Object[] {
  let market = Exchange.getMarket(asset, marketIndex);
  return [
    { pubkey: market.address, isSigner: false, isWritable: false },
    {
      pubkey: market.serumMarket.bidsAddress,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: market.serumMarket.asksAddress,
      isSigner: false,
      isWritable: false,
    },
  ];
}

export async function getCancelAllIxs(
  asset: Asset,
  orders: any[],
  expiration: boolean
): Promise<TransactionInstruction[]> {
  let ixs: TransactionInstruction[] = [];
  await Promise.all(
    orders.map(async (order) => {
      const [openOrdersMap, _openOrdersMapNonce] = await getOpenOrdersMap(
        Exchange.programId,
        order.owner
      );

      let openOrdersMapInfo =
        (await Exchange.program.account.openOrdersMap.fetch(
          openOrdersMap
        )) as OpenOrdersMap;

      const [marginAccount, _marginNonce] = await getMarginAccount(
        Exchange.programId,
        Exchange.getZetaGroupAddress(asset),
        openOrdersMapInfo.userKey
      );

      let ix = expiration
        ? instructions.cancelExpiredOrderIx(
            asset,
            order.marketIndex,
            marginAccount,
            order.owner,
            order.orderId,
            order.side
          )
        : instructions.cancelOrderHaltedIx(
            asset,
            order.marketIndex,
            marginAccount,
            order.owner,
            order.orderId,
            order.side
          );
      ixs.push(ix);
    })
  );
  return ixs;
}

export async function writeKeypair(filename: string, keypair: Keypair) {
  let secret = "[" + keypair.secretKey.toString() + "]";
  fs.writeFileSync(filename, secret);
}

export async function getAllProgramAccountAddresses(
  accountType: types.ProgramAccountType,
  asset: assets.Asset = undefined
): Promise<PublicKey[]> {
  let filters = [
    {
      memcmp: {
        offset: 0,
        bytes: bs58.encode(
          anchor.BorshAccountsCoder.accountDiscriminator(accountType)
        ),
      },
    },
  ];

  if (asset != undefined) {
    let assetOffset = 0;
    // From the account itself in account.rs
    if (accountType == types.ProgramAccountType.MarginAccount) {
      assetOffset = constants.MARGIN_ACCOUNT_ASSET_OFFSET;
    } else if (accountType == types.ProgramAccountType.SpreadAccount) {
      assetOffset = constants.SPREAD_ACCOUNT_ASSET_OFFSET;
    }

    filters.push({
      memcmp: {
        offset: assetOffset,
        bytes: bs58.encode([assets.assetToIndex(asset)]),
      },
    });
  }

  let noDataAccounts = await Exchange.provider.connection.getProgramAccounts(
    Exchange.programId,
    {
      commitment: Exchange.provider.connection.commitment,
      dataSlice: {
        offset: 0,
        length: 0,
      },
      filters: filters,
    }
  );

  let pubkeys: PublicKey[] = [];
  for (let i = 0; i < noDataAccounts.length; i++) {
    pubkeys.push(noDataAccounts[i].pubkey);
  }
  return pubkeys;
}

export async function getAllOpenOrdersAccountsByMarket(
  asset: Asset
): Promise<Map<number, Array<PublicKey>>> {
  let openOrdersByMarketIndex = new Map<number, Array<PublicKey>>();
  for (var market of Exchange.getMarkets(asset)) {
    openOrdersByMarketIndex.set(market.marketIndex, []);
  }

  let marginAccounts = await Exchange.program.account.marginAccount.all();
  await Promise.all(
    marginAccounts.map(async (acc) => {
      let marginAccount = acc.account as MarginAccount;
      if (assets.fromProgramAsset(marginAccount.asset) != asset) {
        return;
      }
      for (var market of Exchange.getMarkets(asset)) {
        let nonce = marginAccount.openOrdersNonce[market.marketIndex];
        if (nonce == 0) {
          continue;
        }
        let [openOrders, _nonce] = await getOpenOrders(
          Exchange.programId,
          market.address,
          marginAccount.authority
        );
        openOrdersByMarketIndex.get(market.marketIndex).push(openOrders);
      }
    })
  );
  return openOrdersByMarketIndex;
}

export async function settleAndBurnVaultTokensByMarket(
  asset: Asset,
  provider: anchor.AnchorProvider,
  openOrdersByMarketIndex: Map<number, Array<PublicKey>>,
  marketIndex: number
) {
  console.log(`Burning tokens for market index ${marketIndex}`);
  let market = Exchange.getMarket(asset, marketIndex);
  let openOrders = openOrdersByMarketIndex.get(marketIndex);
  let remainingAccounts = openOrders.map((key) => {
    return { pubkey: key, isSigner: false, isWritable: true };
  });

  const [vaultOwner, _vaultSignerNonce] = await getSerumVaultOwnerAndNonce(
    market.address,
    constants.DEX_PID[Exchange.network]
  );

  let txs = instructions.settleDexFundsTxs(
    asset,
    market.address,
    vaultOwner,
    remainingAccounts
  );

  for (var j = 0; j < txs.length; j += 5) {
    let txSlice = txs.slice(j, j + 5);
    await Promise.all(
      txSlice.map(async (tx) => {
        await processTransaction(provider, tx);
      })
    );
  }

  let burnTx = instructions.burnVaultTokenTx(asset, market.address);
  await processTransaction(provider, burnTx);
}

export async function settleAndBurnVaultTokens(
  asset: Asset,
  provider: anchor.AnchorProvider
) {
  let openOrdersByMarketIndex = await getAllOpenOrdersAccountsByMarket(asset);
  for (var market of Exchange.getMarkets(asset)) {
    console.log(`Burning tokens for market index ${market.marketIndex}`);
    let openOrders = openOrdersByMarketIndex.get(market.marketIndex);
    let remainingAccounts = openOrders.map((key) => {
      return { pubkey: key, isSigner: false, isWritable: true };
    });

    const [vaultOwner, _vaultSignerNonce] = await getSerumVaultOwnerAndNonce(
      market.address,
      constants.DEX_PID[Exchange.network]
    );

    let txs = instructions.settleDexFundsTxs(
      asset,
      market.address,
      vaultOwner,
      remainingAccounts
    );

    for (var j = 0; j < txs.length; j += 5) {
      let txSlice = txs.slice(j, j + 5);
      await Promise.all(
        txSlice.map(async (tx) => {
          await processTransaction(provider, tx);
        })
      );
    }

    let burnTx = instructions.burnVaultTokenTx(asset, market.address);
    await processTransaction(provider, burnTx);
  }
}

export async function burnVaultTokens(
  asset: Asset,
  provider: anchor.AnchorProvider
) {
  for (var market of Exchange.getMarkets(asset)) {
    console.log(`Burning tokens for market index ${market.marketIndex}`);
    let burnTx = instructions.burnVaultTokenTx(asset, market.address);
    await processTransaction(provider, burnTx);
  }
}

export async function cancelExpiredOrdersAndCleanMarkets(
  asset: Asset,
  expiryIndex: number
) {
  let marketsToClean =
    Exchange.getSubExchange(asset).markets.getMarketsByExpiryIndex(expiryIndex);
  let marketAccounts = await Promise.all(
    marketsToClean.map(async (market) => {
      await market.cancelAllExpiredOrders();
      return [
        { pubkey: market.address, isSigner: false, isWritable: false },
        {
          pubkey: market.serumMarket.bidsAddress,
          isSigner: false,
          isWritable: false,
        },
        {
          pubkey: market.serumMarket.asksAddress,
          isSigner: false,
          isWritable: false,
        },
      ];
    })
  );
  await cleanZetaMarkets(asset, marketAccounts);
}

/**
 * Calculates the total movement fees for a set of movements.
 * @param movements   list of position movements.
 * @param spotPrice   spot price in decimal
 * @param feeBps      fees charged in bps
 * @param decimal     whether to return fees in decimal or native integer (defaults to native integer)
 */
export function calculateMovementFees(
  movements: instructions.PositionMovementArg[],
  spotPrice: number,
  feeBps: number,
  decimal: boolean = false
): number {
  let fees = 0;
  let totalContracts = 0;
  for (var i = 0; i < movements.length; i++) {
    totalContracts += convertNativeLotSizeToDecimal(
      Math.abs(movements[i].size.toNumber())
    );
  }
  let notionalValue = totalContracts * spotPrice;
  let fee = (notionalValue * feeBps) / constants.BPS_DENOMINATOR;
  return decimal ? fee : convertDecimalToNativeInteger(fee);
}

export function getOrCreateKeypair(filename: string): Keypair {
  let keypair: Keypair;
  if (fs.existsSync(filename)) {
    // File exists.
    keypair = Keypair.fromSecretKey(
      Buffer.from(
        JSON.parse(
          fs.readFileSync(filename, {
            encoding: "utf-8",
          })
        )
      )
    );
  } else {
    // File does not exist
    keypair = Keypair.generate();
    writeKeypair(filename, keypair);
  }
  return keypair;
}

export function toAssets(assetsStr: string[]): Asset[] {
  let assets: Asset[] = [];
  for (var asset of assetsStr) {
    assets.push(nameToAsset(asset));
  }
  return assets;
}

export function objectEquals(a: any, b: any): boolean {
  return JSON.stringify(a) == JSON.stringify(b);
}

export async function fetchReferrerAliasAccount(
  referrer: PublicKey = undefined,
  alias: string = undefined
): Promise<ReferrerAlias> {
  if (!referrer && !alias) {
    return null;
  }

  let referrerAliases = await Exchange.program.account.referrerAlias.all();
  for (var i = 0; i < referrerAliases.length; i++) {
    let acc = referrerAliases[i].account as ReferrerAlias;
    if (
      (referrer && acc.referrer.equals(referrer)) ||
      (alias && convertBufferToTrimmedString(acc.alias) == alias)
    ) {
      return acc;
    }
  }

  return null;
}

export function convertBufferToTrimmedString(buffer: number[]): string {
  let bufferString = Buffer.from(buffer).toString().trim();
  let splitIndex = bufferString.length;
  for (let index = 0; index < bufferString.length; ++index) {
    if (bufferString.charCodeAt(index) === 0) {
      splitIndex = index;
      break;
    }
  }
  return bufferString.substring(0, splitIndex);
}

export async function applyPerpFunding(asset: Asset, keys: PublicKey[]) {
  let remainingAccounts = keys.map((key) => {
    return { pubkey: key, isSigner: false, isWritable: true };
  });

  let txs = [];
  for (
    var i = 0;
    i < remainingAccounts.length;
    i += constants.MAX_FUNDING_ACCOUNTS
  ) {
    let tx = new Transaction();
    let slice = remainingAccounts.slice(i, i + constants.MAX_FUNDING_ACCOUNTS);
    tx.add(instructions.applyPerpFundingIx(asset, slice));
    txs.push(tx);
  }

  await Promise.all(
    txs.map(async (tx) => {
      let txSig = await processTransaction(Exchange.provider, tx);
    })
  );
}

export function getProductLedger(marginAccount: MarginAccount, index: number) {
  if (index == constants.PERP_INDEX) {
    return marginAccount.perpProductLedger;
  }
  return marginAccount.productLedgers[index];
}

export function getTIFOffset(marketInfo: Market, tifOptions: types.TIFOptions) {
  if (
    tifOptions.expiryOffset == undefined &&
    tifOptions.expiryTs == undefined
  ) {
    return 0;
  }

  if (
    tifOptions.expiryOffset != undefined &&
    tifOptions.expiryTs != undefined
  ) {
    throw new Error("Cannot set both expiryOffset and expiryTs");
  }

  let currEpochStartTs = marketInfo.serumMarket.epochStartTs.toNumber();
  let epochLength = marketInfo.serumMarket.epochLength.toNumber();
  let epochEnd = currEpochStartTs + epochLength;
  let now = Exchange.clockTimestamp;

  // get correct epoch end in case where serumMarket data is not up to date
  if (now > epochEnd) {
    currEpochStartTs = now - (now % epochLength);
    epochEnd = currEpochStartTs + epochLength;
  }

  if (tifOptions.expiryOffset != undefined) {
    if (tifOptions.expiryOffset <= 0) {
      throw new Error("Invalid expiry offset");
    }

    let desiredExpiryTs = now + tifOptions.expiryOffset;
    let desiredOffset = desiredExpiryTs % epochLength;

    if (epochEnd >= desiredExpiryTs) {
      return desiredOffset;
    } else {
      // Cap the offset at the end of the cycle.
      return epochLength;
    }
  }

  if (tifOptions.expiryTs != undefined) {
    if (tifOptions.expiryTs < Exchange.clockTimestamp) {
      throw new Error("Cannot place an expired order");
    }

    let tifOffset = tifOptions.expiryTs - currEpochStartTs;

    if (tifOffset > epochLength) {
      return epochLength;
    }

    if (tifOffset <= 0) {
      throw new Error("Cannot place an expired order");
    }

    return tifOffset;
  }
}

export function isOrderExpired(
  orderTIFOffset: number,
  orderSeqNum: anchor.BN,
  epochStartTs: number,
  startEpochSeqNum: anchor.BN
): boolean {
  if (orderTIFOffset == 0) {
    return false;
  }

  if (epochStartTs + orderTIFOffset < Exchange.clockTimestamp) {
    return true;
  }

  if (startEpochSeqNum.gt(orderSeqNum)) {
    return true;
  }

  return false;
}

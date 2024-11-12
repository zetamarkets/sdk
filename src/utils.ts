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
  VersionedTransaction,
  AddressLookupTableAccount,
  ComputeBudgetProgram,
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
import { assetToName, nameToAsset } from "./assets";
import { Asset } from "./constants";
import * as fs from "fs";
import * as constants from "./constants";
import * as errors from "./errors";
import { exchange as Exchange } from "./exchange";
import { SubExchange } from "./subexchange";
import { Market } from "./market";
import {
  TriggerOrder,
  MarginAccount,
  TradeEventV3,
  OpenOrdersMap,
  CrossOpenOrdersMap,
  CrossMarginAccount,
  MarketIndexes,
} from "./program-types";
import * as types from "./types";
import * as instructions from "./program-instructions";
import { assets } from ".";
import { Network } from "./network";
import cloneDeep from "lodash.clonedeep";
import * as os from "os";
import { OpenOrders, _OPEN_ORDERS_LAYOUT_V2 } from "./serum/market";
import { HttpProvider } from "@bloxroute/solana-trader-client-ts";
import axios from "axios";

export function getNativeTickSize(asset: Asset): number {
  return Exchange.state.tickSizes[assets.assetToIndex(asset)];
}

export function getDecimalMinLotSize(asset: Asset): number {
  return getNativeMinLotSize(asset) / 10 ** constants.POSITION_PRECISION;
}

export function getNativeMinLotSize(asset: Asset): number {
  let assetIndex = assets.assetToIndex(asset);
  if (Exchange.state != undefined) {
    return Exchange.state.minLotSizes[assetIndex];
  }
  return 1000;
}

export function getState(programId: PublicKey): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("state"))],
    programId
  );
}

export function getMarketNode(
  programId: PublicKey,
  zetaGroup: PublicKey,
  marketIndex: number
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("market-node")),
      zetaGroup.toBuffer(),
      Buffer.from([marketIndex]),
    ],
    programId
  );
}

export function getSettlement(
  programId: PublicKey,
  underlyingMint: PublicKey,
  expirationTs: anchor.BN
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("settlement")),
      underlyingMint.toBuffer(),
      expirationTs.toArrayLike(Buffer, "le", 8),
    ],
    programId
  );
}

export function getCrossOpenOrders(
  programId: PublicKey,
  market: PublicKey,
  account: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("cross-open-orders")),
      constants.DEX_PID[Exchange.network].toBuffer(),
      market.toBuffer(),
      account.toBuffer(),
    ],
    programId
  );
}

export function getOpenOrders(
  programId: PublicKey,
  market: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("open-orders")),
      constants.DEX_PID[Exchange.network].toBuffer(),
      market.toBuffer(),
      userKey.toBuffer(),
    ],
    programId
  );
}

export function createOpenOrdersAddress(
  programId: PublicKey,
  market: PublicKey,
  userKey: PublicKey,
  nonce: number
): PublicKey {
  return PublicKey.createProgramAddressSync(
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

export function createCrossOpenOrdersAddress(
  programId: PublicKey,
  market: PublicKey,
  userKey: PublicKey,
  nonce: number
): PublicKey {
  return PublicKey.createProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("cross-open-orders")),
      constants.DEX_PID[Exchange.network].toBuffer(),
      market.toBuffer(),
      userKey.toBuffer(),
      Buffer.from([nonce]),
    ],
    programId
  );
}

export function getCrossOpenOrdersMap(
  programId: PublicKey,
  openOrders: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("cross-open-orders-map")),
      openOrders.toBuffer(),
    ],
    programId
  );
}

export function getOpenOrdersMap(
  programId: PublicKey,
  openOrders: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [openOrders.toBuffer()],
    programId
  );
}

export function getSerumAuthority(programId: PublicKey): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("serum"))],
    programId
  );
}

export function getMintAuthority(programId: PublicKey): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("mint-auth"))],
    programId
  );
}

export function getVault(
  programId: PublicKey,
  zetaGroup: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("vault")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export function getCombinedVault(programId: PublicKey): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("combined-vault"))],
    programId
  );
}

export function getSerumVault(
  programId: PublicKey,
  mint: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("serum-vault")),
      mint.toBuffer(),
    ],
    programId
  );
}

export function getZetaVault(
  programId: PublicKey,
  mint: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("zeta-vault")),
      mint.toBuffer(),
    ],
    programId
  );
}

export function getZetaInsuranceVault(
  programId: PublicKey,
  zetaGroup: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("zeta-insurance-vault")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export function getZetaCombinedInsuranceVault(
  programId: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(
        anchor.utils.bytes.utf8.encode("zeta-combined-insurance-vault")
      ),
    ],
    programId
  );
}

export function getZetaTreasuryWallet(
  programId: PublicKey,
  mint: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("zeta-treasury-wallet")),
      mint.toBuffer(),
    ],
    programId
  );
}

export function getZetaReferralsRewardsWallet(
  programId: PublicKey,
  mint: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(
        anchor.utils.bytes.utf8.encode("zeta-referrals-rewards-wallet")
      ),
      mint.toBuffer(),
    ],
    programId
  );
}

export function getUserInsuranceDepositAccount(
  programId: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(
        anchor.utils.bytes.utf8.encode("combined-user-insurance-deposit")
      ),
      userKey.toBuffer(),
    ],
    programId
  );
}

export function getUserWhitelistDepositAccount(
  programId: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("whitelist-deposit")),
      userKey.toBuffer(),
    ],
    programId
  );
}

export function getUserWhitelistInsuranceAccount(
  programId: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("whitelist-insurance")),
      userKey.toBuffer(),
    ],
    programId
  );
}

export function getUserWhitelistTradingFeesAccount(
  programId: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("whitelist-trading-fees")),
      userKey.toBuffer(),
    ],
    programId
  );
}

export function getZetaGroup(
  programId: PublicKey,
  mint: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("zeta-group")),
      mint.toBuffer(),
    ],
    programId
  );
}

export function getPricing(programId: PublicKey): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("pricing"))],
    programId
  );
}

export function getUnderlying(
  programId: PublicKey,
  underlyingIndex: number
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("underlying")),
      Buffer.from([underlyingIndex]),
    ],
    programId
  );
}

export function getFlexUnderlying(
  programId: PublicKey,
  underlyingIndex: number
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("flex-underlying")),
      Buffer.from([underlyingIndex]),
    ],
    programId
  );
}

export function getFlexUnderlyingMint(
  programId: PublicKey,
  underlyingIndex: number
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("flex-underlying-mint")),
      Buffer.from([underlyingIndex]),
    ],
    programId
  );
}

export function getGreeks(
  programId: PublicKey,
  zetaGroup: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("greeks")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export function getPerpSyncQueue(
  programId: PublicKey,
  zetaGroup: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("perp-sync-queue")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export function getMarketIndexes(
  programId: PublicKey,
  zetaGroup: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("market-indexes")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export function getBaseMint(
  programId: PublicKey,
  market: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("base-mint")),
      market.toBuffer(),
    ],
    programId
  );
}

export function getQuoteMint(
  programId: PublicKey,
  market: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("quote-mint")),
      market.toBuffer(),
    ],
    programId
  );
}

export function getReferrerIdAccount(
  programId: PublicKey,
  id: string
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("referrer-id-account")),
      Buffer.from(id.replace(/[\0]+$/g, "")),
    ],
    programId
  );
}

export function getReferrerPubkeyAccount(
  programId: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("referrer-pubkey-account")),
      userKey.toBuffer(),
    ],
    programId
  );
}

export function getCrossMarginAccountManager(
  programId: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("cross-margin-manager")),
      userKey.toBuffer(),
    ],
    programId
  );
}

export function getCrossMarginAccount(
  programId: PublicKey,
  userKey: PublicKey,
  seedNumber: Uint8Array
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("cross-margin")),
      userKey.toBuffer(),
      seedNumber,
    ],
    programId
  );
}

export function getMarginAccount(
  programId: PublicKey,
  zetaGroup: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("margin")),
      zetaGroup.toBuffer(),
      userKey.toBuffer(),
    ],
    programId
  );
}

export function getSpreadAccount(
  programId: PublicKey,
  zetaGroup: PublicKey,
  userKey: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("spread")),
      zetaGroup.toBuffer(),
      userKey.toBuffer(),
    ],
    programId
  );
}

export function getTriggerOrder(
  programId: PublicKey,
  marginAccount: PublicKey,
  triggerOrderBit: Uint8Array
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("trigger-order")),
      marginAccount.toBuffer(),
      triggerOrderBit,
    ],
    programId
  );
}

export function getMarketUninitialized(
  programId: PublicKey,
  zetaGroup: PublicKey,
  marketIndex: number
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("market")),
      zetaGroup.toBuffer(),
      Buffer.from([marketIndex]),
    ],
    programId
  );
}

export function getSocializedLossAccount(
  programId: PublicKey,
  zetaGroup: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("socialized-loss")),
      zetaGroup.toBuffer(),
    ],
    programId
  );
}

export function getCombinedSocializedLossAccount(
  programId: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("combined-socialized-loss"))],
    programId
  );
}

export function getReferrerAccountAddress(
  programId: PublicKey,
  referrer: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("referrer")),
      referrer.toBuffer(),
    ],
    programId
  );
}

export function getReferralAccountAddress(
  programId: PublicKey,
  user: PublicKey
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode("referral")), user.toBuffer()],
    programId
  );
}

export function getReferrerAliasAddress(
  programId: PublicKey,
  alias: string
): [PublicKey, number] {
  return anchor.web3.PublicKey.findProgramAddressSync(
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
export function getSerumVaultOwnerAndNonce(
  market: PublicKey,
  dexPid: PublicKey
): [PublicKey, anchor.BN] {
  const nonce = new BN(0);
  while (nonce.toNumber() < 255) {
    try {
      const vaultOwner: PublicKey = PublicKey.createProgramAddressSync(
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
 * roundingFactor argument will round the result to the nearest <roundingFactor>. Default is 100.
 */
export function convertDecimalToNativeInteger(
  amount: number,
  roundingFactor: number = constants.MIN_NATIVE_TICK_SIZE
): number {
  return (
    Math.trunc(
      (amount * Math.pow(10, constants.PLATFORM_PRECISION)) / roundingFactor
    ) * roundingFactor
  );
}

/**
 * Returns the trade event price. This may return a number that
 * does not divide perfectly by tick size (0.0001) if your order traded
 * against orders at different prices.
 */
export function getTradeEventPrice(event: TradeEventV3): number {
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
 * Converts a human readable decimal to a native lot size where 1 unit = 0.001 lots
 * @param amount
 */
export function convertDecimalToNativeLotSize(
  amount: number,
  roundingFactor: number = constants.MIN_NATIVE_MIN_LOT_SIZE
): number {
  return (
    Math.trunc(
      (amount * Math.pow(10, constants.POSITION_PRECISION)) / roundingFactor
    ) * roundingFactor
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

export function getAssociatedTokenAddress(
  mint: PublicKey,
  owner: PublicKey
): PublicKey {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
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
  let opts = {
    skipPreflight: false,
    preflightCommitment: commitment,
    commitment,
  };

  if (Exchange.maxRpcRetries != undefined) {
    opts["maxRetries"] = Exchange.maxRpcRetries;
  }

  return opts;
}

export async function getTradeEventsFromTx(
  txId: string,
  marginAccountFilter?: PublicKey
): Promise<TradeEventV3[]> {
  const parser = new anchor.EventParser(
    Exchange.programId,
    Exchange.program.coder
  );

  const tx = await Exchange.connection.getTransaction(txId, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });

  const logs = tx.meta.logMessages;

  if (!logs) {
    console.warn("No logs found");
    return;
  }

  const events = parser.parseLogs(logs);
  const tradeEvents: TradeEventV3[] = [];

  for (const event of events) {
    if (event.name.startsWith("TradeEvent")) {
      if (
        marginAccountFilter &&
        event.data.marginAccount.toString() != marginAccountFilter.toString()
      ) {
        continue;
      }
      tradeEvents.push(event.data as TradeEventV3);
    }
  }

  return tradeEvents;
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

function txConfirmationCheck(expectedLevel: string, currentLevel: string) {
  const levels = ["processed", "confirmed", "finalized"];

  if (levels.indexOf(expectedLevel) == -1) {
    throw Error(
      "Please use commitment level 'processed', 'confirmed' or 'finalized'"
    );
  }

  if (levels.indexOf(currentLevel) >= levels.indexOf(expectedLevel)) {
    return true;
  }
  return false;
}

export async function processTransactionBloxroute(
  httpProvider: HttpProvider,
  anchorProvider: anchor.AnchorProvider,
  tx: Transaction,
  tip: number,
  blockhash?: { blockhash: string; lastValidBlockHeight: number },
  retries?: number,
  skipConfirmation?: boolean
): Promise<TransactionSignature> {
  tx.add(
    SystemProgram.transfer({
      fromPubkey: anchorProvider.publicKey,
      toPubkey: new PublicKey(
        "HWEoBxYs7ssKuudEjzjmpfJVX7Dvi7wescFsVx2L5yoY" // Trader API tip wallet
      ),
      lamports: tip,
    })
  );

  if (Exchange.priorityFee != 0) {
    tx.instructions.unshift(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: Math.round(Exchange.priorityFee),
      })
    );
  }

  let failures = 0;
  while (true) {
    let recentBlockhash = blockhash ?? (await Exchange.getCachedBlockhash());

    let v0Tx: VersionedTransaction = new VersionedTransaction(
      new TransactionMessage({
        payerKey: anchorProvider.publicKey,
        recentBlockhash: recentBlockhash.blockhash,
        instructions: tx.instructions,
      }).compileToV0Message(getZetaLutArr())
    );
    v0Tx = (await anchorProvider.wallet.signTransaction(
      v0Tx
    )) as VersionedTransaction;
    let rawTx = v0Tx.serialize();

    if (Exchange.postSignCallback) {
      await Exchange.postSignCallback();
    }

    let txSig;
    try {
      txSig = (
        await httpProvider.postSubmitV2({
          transaction: {
            content: Buffer.from(rawTx).toString("base64"),
            isCleanup: false,
          },
          skipPreFlight: true,
          frontRunningProtection: false,
        })
      ).signature;

      // Poll the tx confirmation for N seconds
      // Polling is more reliable than websockets using confirmTransaction()
      let currentBlockHeight = 0;
      if (!skipConfirmation) {
        while (currentBlockHeight < recentBlockhash.lastValidBlockHeight) {
          let status = await anchorProvider.connection.getSignatureStatuses([
            txSig,
          ]);
          currentBlockHeight = await anchorProvider.connection.getBlockHeight(
            anchorProvider.connection.commitment
          );
          if (status.value[0] != null) {
            if (status.value[0].err != null) {
              // Gets caught and parsed in the later catch
              let err = parseInt(
                status.value[0].err["InstructionError"][1]["Custom"]
              );
              throw err;
            }
            if (
              txConfirmationCheck(
                "confirmed",
                status.value[0].confirmationStatus.toString()
              )
            ) {
              return txSig;
            }
          }
          await sleep(1500); // Don't spam the RPC
        }
        throw Error(`Transaction ${txSig} was not confirmed`);
      } else {
        return txSig;
      }
    } catch (err) {
      let parsedErr = parseError(err);
      failures += 1;
      if (!retries || failures > retries) {
        console.log(`txSig: ${txSig} failed. Error = ${parsedErr}`);
        throw parsedErr;
      }
      console.log(`Transaction failed to send. Retrying...`);
      console.log(`failCount=${failures}. error=${parsedErr}`);
    }
  }
}

/// Note that you must add in the jito tip instruction before you send this to here
export async function processVersionedTransactionJito(
  provider: anchor.AnchorProvider,
  tx: VersionedTransaction,
  signers?: Array<Signer>,
  opts?: ConfirmOptions,
  blockhash?: { blockhash: string; lastValidBlockHeight: number }
): Promise<TransactionSignature> {
  let recentBlockhash = blockhash ?? (await Exchange.getCachedBlockhash());

  tx.sign(
    (signers ?? [])
      .filter((s) => s !== undefined)
      .map((kp) => {
        return kp;
      })
  );
  tx = (await provider.wallet.signTransaction(tx)) as VersionedTransaction;

  let rawTx = tx.serialize();

  const encodedTx = bs58.encode(rawTx);
  const jitoURL = "https://mainnet.block-engine.jito.wtf/api/v1/transactions";
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "sendTransaction",
    params: [encodedTx],
  };

  let txOpts = opts || commitmentConfig(provider.connection.commitment);
  let txSig: string;

  if (Exchange.postSignCallback) {
    await Exchange.postSignCallback();
  }

  try {
    const response = await axios.post(jitoURL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    txSig = response.data.result;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Jito Bundle Error: cannot send.");
  }

  if (Exchange.skipRpcConfirmation) {
    return txSig;
  }

  let currentBlockHeight = await provider.connection.getBlockHeight(
    provider.connection.commitment
  );

  while (currentBlockHeight < recentBlockhash.lastValidBlockHeight) {
    // Keep resending to maximise the chance of confirmation
    await provider.connection.sendRawTransaction(rawTx, {
      skipPreflight: true,
      preflightCommitment: provider.connection.commitment,
      maxRetries: 0,
    });

    let status = await provider.connection.getSignatureStatuses([txSig]);
    currentBlockHeight = await provider.connection.getBlockHeight(
      provider.connection.commitment
    );
    if (status.value[0] != null) {
      if (status.value[0].err != null) {
        // Gets caught and parsed in the later catch
        let err = parseInt(
          status.value[0].err["InstructionError"][1]["Custom"]
        );
        let parsedErr = parseError(err);
        throw parsedErr;
      }
      if (
        txConfirmationCheck(
          txOpts.commitment ? txOpts.commitment.toString() : "confirmed",
          status.value[0].confirmationStatus.toString()
        )
      ) {
        return txSig;
      }
    }
    await sleep(500); // Don't spam the RPC
  }
  throw Error(`Transaction ${txSig} was not confirmed`);
}

export async function processTransactionJito(
  provider: anchor.AnchorProvider,
  tx: Transaction,
  signers?: Array<Signer>,
  opts?: ConfirmOptions,
  lutAccs?: AddressLookupTableAccount[],
  blockhash?: { blockhash: string; lastValidBlockHeight: number }
): Promise<TransactionSignature> {
  if (Exchange.jitoTip == 0) {
    throw Error("Jito bundle tip has not been set.");
  }

  if (Exchange.priorityFee != 0) {
    tx.instructions.unshift(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: Math.round(Exchange.priorityFee),
      })
    );
  }

  tx.instructions.push(
    SystemProgram.transfer({
      fromPubkey: Exchange.provider.publicKey,
      toPubkey: new PublicKey(
        "DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL" // Jito tip account
      ),
      lamports: Exchange.jitoTip, // tip
    })
  );

  let recentBlockhash = blockhash ?? (await Exchange.getCachedBlockhash());

  let vTx: VersionedTransaction = new VersionedTransaction(
    new TransactionMessage({
      payerKey: provider.wallet.publicKey,
      recentBlockhash: recentBlockhash.blockhash,
      instructions: tx.instructions,
    }).compileToV0Message(lutAccs)
  );

  vTx.sign(
    (signers ?? [])
      .filter((s) => s !== undefined)
      .map((kp) => {
        return kp;
      })
  );
  vTx = (await provider.wallet.signTransaction(vTx)) as VersionedTransaction;

  let rawTx = vTx.serialize();

  const encodedTx = bs58.encode(rawTx);
  const jitoURL = "https://mainnet.block-engine.jito.wtf/api/v1/transactions";
  const payload = {
    jsonrpc: "2.0",
    id: 1,
    method: "sendTransaction",
    params: [encodedTx],
  };

  if (Exchange.postSignCallback) {
    await Exchange.postSignCallback();
  }

  let txOpts = opts || commitmentConfig(provider.connection.commitment);
  let txSig: string;
  try {
    const response = await axios.post(jitoURL, payload, {
      headers: { "Content-Type": "application/json" },
    });
    txSig = response.data.result;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Jito Bundle Error: cannot send.");
  }

  if (Exchange.skipRpcConfirmation) {
    return txSig;
  }

  let currentBlockHeight = await provider.connection.getBlockHeight(
    provider.connection.commitment
  );

  while (currentBlockHeight < recentBlockhash.lastValidBlockHeight) {
    // Keep resending to maximise the chance of confirmation
    await provider.connection.sendRawTransaction(rawTx, {
      skipPreflight: true,
      preflightCommitment: provider.connection.commitment,
      maxRetries: 0,
    });

    let status = await provider.connection.getSignatureStatuses([txSig]);
    currentBlockHeight = await provider.connection.getBlockHeight(
      provider.connection.commitment
    );
    if (status.value[0] != null) {
      if (status.value[0].err != null) {
        // Gets caught and parsed in the later catch
        let err = parseInt(
          status.value[0].err["InstructionError"][1]["Custom"]
        );
        let parsedErr = parseError(err);
        throw parsedErr;
      }
      if (
        txConfirmationCheck(
          txOpts.commitment ? txOpts.commitment.toString() : "confirmed",
          status.value[0].confirmationStatus.toString()
        )
      ) {
        return txSig;
      }
    }
    await sleep(500); // Don't spam the RPC
  }
  throw Error(`Transaction ${txSig} was not confirmed`);
}

export async function sendRawTransactionCaught(con: Connection, rawTx: any) {
  try {
    let txSig = await con.sendRawTransaction(rawTx, {
      skipPreflight: true,
      preflightCommitment: con.commitment,
      maxRetries: 0,
    });
    return txSig;
  } catch (e) {
    console.log(`Error sending tx: ${e}`);
  }
}

export async function sendJitoTxCaught(payload: any) {
  try {
    let response = await axios.post(
      "https://mainnet.block-engine.jito.wtf/api/v1/transactions",
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data.result;
  } catch (e) {
    console.log(`Error sending tx: ${e}`);
  }
}

export async function processVersionedTransaction(
  provider: anchor.AnchorProvider,
  tx: VersionedTransaction,
  signers?: Array<Signer>,
  opts?: ConfirmOptions,
  blockhash?: { blockhash: string; lastValidBlockHeight: number },
  retries?: number
): Promise<TransactionSignature> {
  if (Exchange.useJitoBundle) {
    return processVersionedTransactionJito(
      provider,
      tx,
      signers,
      opts,
      blockhash
    );
  }

  let failures = 0;
  while (true) {
    let rawTx: Buffer | Uint8Array;

    let recentBlockhash = blockhash ?? (await Exchange.getCachedBlockhash());

    tx.sign(
      (signers ?? [])
        .filter((s) => s !== undefined)
        .map((kp) => {
          return kp;
        })
    );
    tx = (await provider.wallet.signTransaction(tx)) as VersionedTransaction;
    rawTx = tx.serialize();

    let txOpts = opts || commitmentConfig(provider.connection.commitment);
    let txSig;
    let allConnections = [provider.connection].concat(
      Exchange.doubleDownConnections
    );
    try {
      // Integration tests don't like the split send + confirm :(
      if (Exchange.network == Network.LOCALNET) {
        return await anchor.sendAndConfirmRawTransaction(
          provider.connection,
          rawTx,
          txOpts
        );
      }

      let promises = [];
      for (var con of allConnections) {
        promises.push(sendRawTransactionCaught(con, rawTx));
      }

      // Jito's transactions endpoint, not a bundle
      // Might as well send it here for extra success, it's free
      if (Exchange.network == Network.MAINNET) {
        const encodedTx = bs58.encode(rawTx);
        const payload = {
          jsonrpc: "2.0",
          id: 1,
          method: "sendTransaction",
          params: [encodedTx],
        };
        promises.push(sendJitoTxCaught(payload));
      }

      // All tx sigs are the same
      let txSigs = await Promise.all(promises);
      let txSig = txSigs.find(
        (sig) => typeof sig === "string" && sig.length > 0
      );

      // Poll the tx confirmation for N seconds
      // Polling is more reliable than websockets using confirmTransaction()
      let currentBlockHeight = 0;
      if (!Exchange.skipRpcConfirmation) {
        let resendCounter = 0;
        while (
          currentBlockHeight <
          recentBlockhash.lastValidBlockHeight
        ) {
          // Keep resending to maximise the chance of confirmation
          resendCounter += 1;
          if (resendCounter % 4 == 0) {
            for (var con of allConnections) {
              promises.push(sendRawTransactionCaught(con, rawTx));
            }
            await Promise.race(promises);
          }

          let status = await provider.connection.getSignatureStatuses([txSig]);
          currentBlockHeight = await provider.connection.getBlockHeight(
            provider.connection.commitment
          );
          if (status.value[0] != null) {
            if (status.value[0].err != null) {
              // Gets caught and parsed in the later catch
              let err = parseInt(
                status.value[0].err["InstructionError"][1]["Custom"]
              );
              throw err;
            }
            if (
              txConfirmationCheck(
                txOpts.commitment ? txOpts.commitment.toString() : "confirmed",
                status.value[0].confirmationStatus.toString()
              )
            ) {
              return txSig;
            }
          }
          await sleep(500); // Don't spam the RPC
        }
        throw Error(`Transaction ${txSig} was not confirmed`);
      } else {
        return txSig;
      }
    } catch (err) {
      let parsedErr = parseError(err);
      failures += 1;
      if (!retries || failures > retries) {
        console.log(`txSig: ${txSig} failed. Error = ${parsedErr}`);
        throw parsedErr;
      }
      console.log(`Transaction failed to send. Retrying...`);
      console.log(`failCount=${failures}. error=${parsedErr}`);
    }
  }
}

export async function processTransaction(
  provider: anchor.AnchorProvider,
  tx: Transaction,
  signers?: Array<Signer>,
  opts?: ConfirmOptions,
  useLedger: boolean = false,
  lutAccs?: AddressLookupTableAccount[],
  blockhash?: { blockhash: string; lastValidBlockHeight: number },
  retries?: number
): Promise<TransactionSignature> {
  if (Exchange.useJitoBundle) {
    return processTransactionJito(
      provider,
      tx,
      signers,
      opts,
      lutAccs,
      blockhash
    );
  }

  if (Exchange.httpProvider) {
    let txSig = await processTransactionBloxroute(
      Exchange.httpProvider,
      provider,
      tx,
      Exchange.tipMultiplier * Exchange.priorityFee + 1050,
      blockhash,
      retries,
      Exchange.skipRpcConfirmation
    );
    return txSig;
  }

  let failures = 0;
  while (true) {
    let rawTx: Buffer | Uint8Array;

    if (Exchange.priorityFee != 0) {
      tx.instructions.unshift(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: Math.round(Exchange.priorityFee),
        })
      );
    }

    let recentBlockhash = blockhash ?? (await Exchange.getCachedBlockhash());

    if (lutAccs) {
      if (useLedger) {
        throw Error("Ledger does not support versioned transactions");
      }

      let v0Tx: VersionedTransaction = new VersionedTransaction(
        new TransactionMessage({
          payerKey: provider.wallet.publicKey,
          recentBlockhash: recentBlockhash.blockhash,
          instructions: tx.instructions,
        }).compileToV0Message(lutAccs)
      );
      v0Tx.sign(
        (signers ?? [])
          .filter((s) => s !== undefined)
          .map((kp) => {
            return kp;
          })
      );
      v0Tx = (await provider.wallet.signTransaction(
        v0Tx
      )) as VersionedTransaction;
      rawTx = v0Tx.serialize();
    } else {
      tx.recentBlockhash = recentBlockhash.blockhash;
      tx.feePayer = useLedger
        ? Exchange.ledgerWallet.publicKey
        : provider.wallet.publicKey;

      (signers ?? [])
        .filter((s) => s !== undefined)
        .forEach((kp) => {
          tx.partialSign(kp);
        });

      if (useLedger) {
        tx = await Exchange.ledgerWallet.signTransaction(tx);
      } else {
        tx = (await provider.wallet.signTransaction(tx)) as Transaction;
      }
      rawTx = tx.serialize();
    }

    if (Exchange.postSignCallback) {
      await Exchange.postSignCallback();
    }

    let txOpts = opts || commitmentConfig(provider.connection.commitment);
    let txSig;
    let allConnections = [provider.connection].concat(
      Exchange.doubleDownConnections
    );
    try {
      // Integration tests don't like the split send + confirm :(
      if (Exchange.network == Network.LOCALNET) {
        return await anchor.sendAndConfirmRawTransaction(
          provider.connection,
          rawTx,
          txOpts
        );
      }

      let promises = [];
      for (var con of allConnections) {
        promises.push(sendRawTransactionCaught(con, rawTx));
      }

      // Jito's transactions endpoint, not a bundle
      // Might as well send it here for extra success, it's free
      if (Exchange.network == Network.MAINNET) {
        const encodedTx = bs58.encode(rawTx);
        const payload = {
          jsonrpc: "2.0",
          id: 1,
          method: "sendTransaction",
          params: [encodedTx],
        };
        promises.push(sendJitoTxCaught(payload));
      }

      // All tx sigs are the same
      let txSigs = await Promise.all(promises);
      let txSig = txSigs.find(
        (sig) => typeof sig === "string" && sig.length > 0
      );

      // Poll the tx confirmation for N seconds
      // Polling is more reliable than websockets using confirmTransaction()
      let currentBlockHeight = 0;
      if (!Exchange.skipRpcConfirmation) {
        let resendCounter = 0;
        while (
          currentBlockHeight <
          recentBlockhash.lastValidBlockHeight
        ) {
          // Keep resending to maximise the chance of confirmation
          resendCounter += 1;
          if (resendCounter % 4 == 0) {
            for (var con of allConnections) {
              promises.push(sendRawTransactionCaught(con, rawTx));
            }
            await Promise.race(promises);
          }

          let status = await provider.connection.getSignatureStatuses([txSig]);
          currentBlockHeight = await provider.connection.getBlockHeight(
            provider.connection.commitment
          );
          if (status.value[0] != null) {
            if (status.value[0].err != null) {
              // Gets caught and parsed in the later catch
              let err = parseInt(
                status.value[0].err["InstructionError"][1]["Custom"]
              );
              throw err;
            }
            if (
              txConfirmationCheck(
                txOpts.commitment ? txOpts.commitment.toString() : "confirmed",
                status.value[0].confirmationStatus.toString()
              )
            ) {
              return txSig;
            }
          }
          await sleep(500); // Don't spam the RPC
        }
        throw Error(`Transaction ${txSig} was not confirmed`);
      } else {
        return txSig;
      }
    } catch (err) {
      let parsedErr = parseError(err);
      failures += 1;
      if (!retries || failures > retries) {
        console.log(`txSig: ${txSig} failed. Error = ${parsedErr}`);
        throw parsedErr;
      }
      console.log(`Transaction failed to send. Retrying...`);
      console.log(`failCount=${failures}. error=${parsedErr}`);
    }
  }
}

export function parseError(err: any) {
  const anchorError = anchor.AnchorError.parse(err.logs);
  if (anchorError) {
    // Parse Anchor error into another type such that it's consistent.
    return errors.NativeAnchorError.parse(anchorError);
  }

  const programError = anchor.ProgramError.parse(err, errors.idlErrors);
  if (typeof err == typeof 0 && errors.idlErrors.has(err)) {
    return new errors.NativeAnchorError(
      parseInt(err),
      errors.idlErrors.get(err),
      [],
      []
    );
  }
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

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/errors.js#L758
const ERR_BUFFER_OUT_OF_BOUNDS = () =>
  new Error("Attempt to access memory outside buffer bounds");

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/errors.js#L1262
const ERR_OUT_OF_RANGE = (str: string, range: string, received: number) =>
  new Error(
    `The value of "${str} is out of range. It must be ${range}. Received ${received}`
  );

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/errors.js#L968
const ERR_INVALID_ARG_TYPE = (name: string, expected: string, actual: any) =>
  new Error(
    `The "${name}" argument must be of type ${expected}. Received ${actual}`
  );

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/validators.js#L127-L130
function validateNumber(value: any, name: string) {
  if (typeof value !== "number")
    throw ERR_INVALID_ARG_TYPE(name, "number", value);
}

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/buffer.js#L68-L80
function boundsError(value: number, length: number) {
  if (Math.floor(value) !== value) {
    validateNumber(value, "offset");
    throw ERR_OUT_OF_RANGE("offset", "an integer", value);
  }

  if (length < 0) throw ERR_BUFFER_OUT_OF_BOUNDS();

  throw ERR_OUT_OF_RANGE("offset", `>= 0 and <= ${length}`, value);
}

// https://github.com/nodejs/node/blob/v14.17.0/lib/internal/buffer.js#L129-L145
export function readBigInt64LE(buffer: Buffer, offset = 0): bigint {
  validateNumber(offset, "offset");
  const first = buffer[offset];
  const last = buffer[offset + 7];
  if (first === undefined || last === undefined)
    boundsError(offset, buffer.length - 8);
  // tslint:disable-next-line:no-bitwise
  const val =
    buffer[offset + 4] +
    buffer[offset + 5] * 2 ** 8 +
    buffer[offset + 6] * 2 ** 16 +
    (last << 24); // Overflow
  return (
    (BigInt(val) << BigInt(32)) + // tslint:disable-line:no-bitwise
    BigInt(
      first +
        buffer[++offset] * 2 ** 8 +
        buffer[++offset] * 2 ** 16 +
        buffer[++offset] * 2 ** 24
    )
  );
}

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

function printMarkets(subExchange: SubExchange) {
  let markPrice = subExchange.getMarkPrice();
  console.log(
    `[MARKET] INDEX: ${constants.PERP_INDEX} MARK_PRICE ${markPrice.toFixed(6)}`
  );
}

export function displayState() {
  let subExchanges = Exchange.subExchanges;

  for (var [asset, subExchange] of subExchanges) {
    // Products without expiries, ie perps
    printMarkets(subExchange);
  }
}

// Either margin or cross margin acc
export async function getAccountFromOpenOrders(
  openOrders: PublicKey,
  asset: Asset
) {
  let crossOpenOrdersMapInfo =
    (await Exchange.program.account.crossOpenOrdersMap.fetchNullable(
      getCrossOpenOrdersMap(Exchange.programId, openOrders)[0]
    )) as CrossOpenOrdersMap;

  // If it was a CrossMarginAccount, just proceed
  if (crossOpenOrdersMapInfo != null) {
    return getCrossMarginAccount(
      Exchange.programId,
      crossOpenOrdersMapInfo.userKey,
      Uint8Array.from([crossOpenOrdersMapInfo.subaccountIndex])
    )[0];
  }

  // If it wasn't a CrossMarginAccount, it should be a MarginAccount or error
  let openOrdersMapInfo = (await Exchange.program.account.openOrdersMap.fetch(
    getOpenOrdersMap(Exchange.programId, openOrders)[0]
  )) as OpenOrdersMap;
  return getMarginAccount(
    Exchange.programId,
    Exchange.pricing.zetaGroupKeys[assets.assetToIndex(asset)],
    openOrdersMapInfo.userKey
  )[0];
}

export async function getCrossMarginFromOpenOrders(openOrders: PublicKey) {
  const [openOrdersMap, _openOrdersMapNonce] = getCrossOpenOrdersMap(
    Exchange.programId,
    openOrders
  );
  let openOrdersMapInfo =
    (await Exchange.program.account.crossOpenOrdersMap.fetch(
      openOrdersMap
    )) as CrossOpenOrdersMap;
  const [crossMarginAccount, _marginNonce] = getCrossMarginAccount(
    Exchange.programId,
    openOrdersMapInfo.userKey,
    Uint8Array.from([openOrdersMapInfo.subaccountIndex])
  );

  return crossMarginAccount;
}

export async function getMarginFromOpenOrders(
  asset: Asset,
  openOrders: PublicKey,
  market: Market
) {
  const [openOrdersMap, _openOrdersMapNonce] = getOpenOrdersMap(
    Exchange.programId,
    openOrders
  );
  let openOrdersMapInfo = (await Exchange.program.account.openOrdersMap.fetch(
    openOrdersMap
  )) as OpenOrdersMap;
  const [marginAccount, _marginNonce] = getMarginAccount(
    Exchange.programId,
    market.zetaGroup,
    openOrdersMapInfo.userKey
  );

  return marginAccount;
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

export async function cleanZetaMarketHalted(asset: Asset) {
  let tx = new Transaction();
  tx.add(instructions.cleanZetaMarketHaltedIx(asset));
  await processTransaction(Exchange.provider, tx);
}

/*
 * Allows you to pass in a map that may have cached values for openOrdersAccounts
 * returns true in case where event queue is empty, false if events were cranked
 */
export async function crankMarket(
  asset: Asset,
  openOrdersToMargin?: Map<string, PublicKey>,
  crankLimit?: number
): Promise<boolean> {
  let ix = await createCrankMarketIx(asset, openOrdersToMargin, crankLimit);
  if (ix == null) return true;
  let tx = new Transaction()
    .add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 250_000,
      })
    )
    .add(ix);
  await processTransaction(Exchange.provider, tx);
  return false;
}

export async function createCrankMarketIx(
  asset: Asset,
  openOrdersToMargin?: Map<string, PublicKey>,
  crankLimit?: number
): Promise<TransactionInstruction | null> {
  let market = Exchange.getPerpMarket(asset);
  let eventQueue = await market.serumMarket.loadEventQueue(Exchange.connection);
  if (eventQueue.length == 0) {
    return null;
  }
  const openOrdersSet = new Set();
  // We pass in a couple of extra accounts for perps so the limit is lower
  let limit = constants.CRANK_PERP_ACCOUNT_LIMIT;

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
      if (
        openOrdersToMargin &&
        !openOrdersToMargin.has(openOrders.toBase58())
      ) {
        marginAccount = await getAccountFromOpenOrders(openOrders, asset);
        openOrdersToMargin.set(openOrders.toBase58(), marginAccount);
      } else if (
        openOrdersToMargin &&
        openOrdersToMargin.has(openOrders.toBase58())
      ) {
        marginAccount = openOrdersToMargin.get(openOrders.toBase58());
      } else {
        marginAccount = await getAccountFromOpenOrders(openOrders, asset);
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

  return instructions.crankMarketIx(
    asset,
    market.address,
    market.serumMarket.eventQueueAddress,
    constants.DEX_PID[Exchange.network],
    remainingAccounts
  );
}

/*
 * prune expired TIF orders from a list of market indices.
 */
export async function pruneExpiredTIFOrders(asset: Asset) {
  let tx = new Transaction().add(instructions.pruneExpiredTIFOrdersIx(asset));
  return processTransaction(Exchange.provider, tx);
}

export async function pruneExpiredTIFOrdersV2(asset: Asset, limit: number) {
  let tx = new Transaction().add(
    instructions.pruneExpiredTIFOrdersIxV2(asset, limit)
  );
  return processTransaction(Exchange.provider, tx);
}

export function getMutMarketAccounts(asset: Asset): Object[] {
  let market = Exchange.getPerpMarket(asset);
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
  _expiration: boolean
): Promise<TransactionInstruction[]> {
  let ixs: TransactionInstruction[] = [];
  await Promise.all(
    orders.map(async (order) => {
      const [openOrdersMap, _openOrdersMapNonce] = getCrossOpenOrdersMap(
        Exchange.programId,
        order.owner
      );

      let openOrdersMapInfo =
        await Exchange.program.account.crossOpenOrdersMap.fetchNullable(
          openOrdersMap
        );

      let account;

      // MarginAccount
      if (openOrdersMapInfo == null) {
        const [openOrdersMap, _openOrdersMapNonce] = getOpenOrdersMap(
          Exchange.programId,
          order.owner
        );
        let map = (await Exchange.program.account.openOrdersMap.fetch(
          openOrdersMap
        )) as OpenOrdersMap;
        const [marginAccount, _marginNonce] = getMarginAccount(
          Exchange.programId,
          Exchange.getZetaGroupAddress(asset),
          map.userKey
        );
        account = marginAccount;
      }
      // CrossMarginAccount
      else {
        let map = openOrdersMapInfo as CrossOpenOrdersMap;
        const [marginAccount, _marginNonce] = getCrossMarginAccount(
          Exchange.programId,
          map.userKey,
          Uint8Array.from([map.subaccountIndex])
        );
        account = marginAccount;
      }

      let ix = instructions.cancelOrderHaltedIx(
        asset,
        account,
        order.owner,
        order.orderId,
        order.side
      );
      ixs.push(ix);
    })
  );
  return ixs;
}

export function writeKeypair(filename: string, keypair: Keypair) {
  let secret = "[" + keypair.secretKey.toString() + "]";
  fs.writeFileSync(filename, secret);
}

export async function getAllProgramAccountAddresses(
  accountType: types.ProgramAccountType,
  asset: Asset = undefined
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

export async function getAllOpenOrdersAccounts(
  asset: Asset,
  accountLimit?: number
): Promise<PublicKey[]> {
  let allOpenOrders: PublicKey[] = [];
  let market = Exchange.getPerpMarket(asset);

  let maPubkeys = await getAllProgramAccountAddresses(
    types.ProgramAccountType.MarginAccount
  );

  // Randomly grab the first N only to avoid overloading the app
  maPubkeys.sort(() => Math.random() - 0.5);
  if (accountLimit) {
    maPubkeys = maPubkeys.slice(0, accountLimit);
  }
  console.log(`${maPubkeys.length} marginAccounts pubkeys`);
  let marginAccounts = [];
  for (let i = 0; i < maPubkeys.length; i += constants.MAX_ACCOUNTS_TO_FETCH) {
    marginAccounts = marginAccounts.concat(
      await Exchange.program.account.marginAccount.fetchMultiple(
        maPubkeys.slice(i, i + constants.MAX_ACCOUNTS_TO_FETCH)
      )
    );
  }

  marginAccounts.forEach((marginAccount) => {
    if (assets.fromProgramAsset(marginAccount.asset) != asset) {
      return;
    }

    let nonce = marginAccount.openOrdersNonce[constants.PERP_INDEX];
    if (nonce != 0) {
      let [openOrders, _nonce] = getOpenOrders(
        Exchange.programId,
        market.address,
        marginAccount.authority
      );
      allOpenOrders.push(openOrders);
    }
  });

  let cmaPubkeys = await getAllProgramAccountAddresses(
    types.ProgramAccountType.CrossMarginAccount
  );
  // Randomly grab the first N only to avoid overloading the app
  cmaPubkeys.sort(() => Math.random() - 0.5);
  if (accountLimit) {
    cmaPubkeys = cmaPubkeys.slice(0, accountLimit);
  }
  console.log(`${cmaPubkeys.length} crossMarginAccounts`);
  let crossMarginAccounts = [];
  for (let i = 0; i < cmaPubkeys.length; i += constants.MAX_ACCOUNTS_TO_FETCH) {
    crossMarginAccounts = crossMarginAccounts.concat(
      await Exchange.program.account.crossMarginAccount.fetchMultiple(
        cmaPubkeys.slice(i, i + constants.MAX_ACCOUNTS_TO_FETCH)
      )
    );
  }

  crossMarginAccounts.forEach((crossMarginAccount, i) => {
    let nonce = crossMarginAccount.openOrdersNonces[assets.assetToIndex(asset)];
    if (nonce != 0) {
      let [openOrders, _nonce] = getCrossOpenOrders(
        Exchange.programId,
        market.address,
        cmaPubkeys[i]
      );
      allOpenOrders.push(openOrders);
    }
  });

  return allOpenOrders;
}

export async function settleAndBurnVaultTokens(
  asset: Asset,
  provider: anchor.AnchorProvider,
  accountLimit: number = 100
) {
  let openOrdersRaw = await getAllOpenOrdersAccounts(asset, accountLimit);

  let openOrdersFiltered = [];
  for (
    var i = 0;
    i < openOrdersRaw.length;
    i += constants.MAX_ACCOUNTS_TO_FETCH
  ) {
    let ooBatch = await Exchange.connection.getMultipleAccountsInfo(
      openOrdersRaw.slice(i, i + constants.MAX_ACCOUNTS_TO_FETCH),
      provider.connection.commitment
    );

    for (var j = 0; j < ooBatch.length; j++) {
      const decoded = _OPEN_ORDERS_LAYOUT_V2.decode(ooBatch[j].data);
      let openOrdersAccount = new OpenOrders(
        openOrdersRaw[i + j],
        decoded,
        Exchange.programId
      );

      if (
        openOrdersAccount.baseTokenFree.toNumber() != 0 ||
        openOrdersAccount.baseTokenTotal.toNumber() != 0 ||
        openOrdersAccount.quoteTokenFree.toNumber() != 0 ||
        openOrdersAccount.quoteTokenTotal.toNumber() != 0
      ) {
        openOrdersFiltered.push(openOrdersRaw[i + j]);
      }
    }
  }

  let market = Exchange.getPerpMarket(asset);
  console.log(
    `Burning tokens for ${openOrdersFiltered.length} openOrders accounts`
  );
  let remainingAccounts = openOrdersFiltered.map((key) => {
    return { pubkey: key, isSigner: false, isWritable: true };
  });

  const [vaultOwner, _vaultSignerNonce] = getSerumVaultOwnerAndNonce(
    market.address,
    constants.DEX_PID[Exchange.network]
  );

  let txs = instructions.settleDexFundsTxs(
    asset,
    vaultOwner,
    remainingAccounts
  );

  for (var j = 0; j < txs.length; j += 5) {
    console.log("Settle tx num =", j);
    let txSlice = txs.slice(j, j + 5);
    await Promise.all(
      txSlice.map(async (tx, i) => {
        try {
          await processTransaction(provider, tx);
        } catch (e) {
          console.log(`Settle failed on tx ${j + i}, continuing...`);
        }
      })
    );
  }

  let burnTx = instructions.burnVaultTokenTx(asset);
  await processTransaction(provider, burnTx);
}

export async function burnVaultTokens(
  asset: Asset,
  provider: anchor.AnchorProvider
) {
  let market = Exchange.getPerpMarket(asset);
  console.log(`Burning tokens`);
  let burnTx = instructions.burnVaultTokenTx(asset);
  await processTransaction(provider, burnTx);
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

export async function fetchReferralId(user: PublicKey) {
  const accKey = getReferrerPubkeyAccount(Exchange.programId, user)[0];
  const accBuffer =
    await Exchange.program.account.referrerPubkeyAccount.fetchNullable(
      accKey.toString()
    );

  if (accBuffer == null) {
    return null;
  }
  return Buffer.from(accBuffer.referrerId).toString();
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

export async function executeTriggerOrder(
  asset: Asset,
  side: types.Side,
  triggerOrderBit: number,
  triggerOrder: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  payer: PublicKey
) {
  let tx = new Transaction().add(
    instructions.executeTriggerOrderV2Ix(
      asset,
      side,
      triggerOrderBit,
      triggerOrder,
      marginAccount,
      openOrders,
      payer
    )
  );

  await processTransaction(Exchange.provider, tx);
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
  startEpochSeqNum: anchor.BN,
  TIFBufferSeconds: number
): boolean {
  if (orderTIFOffset == 0) {
    return false;
  }

  if (
    epochStartTs + orderTIFOffset <
    Exchange.clockTimestamp - TIFBufferSeconds
  ) {
    return true;
  }

  if (startEpochSeqNum.gt(orderSeqNum)) {
    return true;
  }

  return false;
}

export function getZetaLutArr(): AddressLookupTableAccount[] {
  if (Exchange.network == Network.LOCALNET) {
    return [];
  }
  return constants.STATIC_AND_PERPS_LUT[Exchange.network];
}

export function getUnderlyingMint(asset: Asset) {
  if (asset in constants.MINTS) {
    return constants.MINTS[asset];
  }
  if (asset in constants.FLEX_MINTS[Exchange.network]) {
    return constants.FLEX_MINTS[Exchange.network][asset];
  }
  throw Error("Underlying mint does not exist!");
}

export function isFlexUnderlying(asset: Asset) {
  return asset in constants.FLEX_MINTS[Exchange.network];
}

export function median(arr: number[]): number | undefined {
  if (!arr.length) return undefined;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid];
}

export async function isAffiliateCodeAvailable(code: string): Promise<boolean> {
  let referrerIdAddress = getReferrerIdAccount(Exchange.programId, code)[0];
  let referrerIdAccount =
    await Exchange.program.account.referrerIdAccount.fetchNullable(
      referrerIdAddress
    );

  return referrerIdAccount == null;
}

export const checkLiquidity = (
  size: number,
  asset: Asset,
  side: types.Side,
  slippage?: number,
  orderbook?: types.DepthOrderbook
): types.LiquidityCheckInfo => {
  // We default to min lot size to still show a price
  const fillSize = size || getDecimalMinLotSize(asset);

  slippage ??= constants.PERP_MARKET_ORDER_SPOT_SLIPPAGE;
  orderbook ??= Exchange.getOrderbook(asset);

  const orderbookSide =
    side === types.Side.ASK ? orderbook.bids : orderbook.asks;

  // Invalid order
  if (!orderbookSide || !orderbookSide.length) {
    return { validLiquidity: false, avgPrice: 0, worstPrice: 0 };
  }

  let validLiquidity = false;
  // Size seen on the orderbook that satisfies the specified price
  let seenSize = 0;
  // The cumulative trade value for the seen size
  let cumAmount = 0;
  // The price of the worst orderbook level that will statisfy the request size entirely
  let worstPrice = 0;
  for (let i = 0; i < orderbookSide.length; i++) {
    const orderbookLevel = orderbookSide[i];
    const isWithinSlippge = checkWithinSlippageTolerance(
      orderbookLevel.price,
      side,
      asset,
      orderbook,
      slippage
    );

    if (!isWithinSlippge) {
      // If not within slippage break early, not a valid market order
      break;
    }

    // Size remaining to fill from orderbook
    const sizeRemaining = fillSize - seenSize;
    // We can satify our size requirements without taking the entire level's size
    const sizeToFill = Math.min(sizeRemaining, orderbookLevel.size);

    seenSize += sizeToFill;
    cumAmount += sizeToFill * orderbookLevel.price;
    worstPrice = orderbookLevel.price;
    validLiquidity = seenSize >= fillSize;

    // Size requirements satified
    if (validLiquidity) break;
  }
  // Average price across all the seen levels
  const avgPrice = cumAmount / seenSize || Exchange.getMarkPrice(asset);

  return { validLiquidity, avgPrice, worstPrice };
};

const checkWithinSlippageTolerance = (
  price: number,
  side: types.Side,
  asset: Asset,
  orderbook: types.DepthOrderbook,
  slippage: number
): boolean => {
  const spotPrice = Exchange.getMarkPrice(asset);

  const orderbookMidpoint =
    !orderbook.asks.length || !orderbook.bids.length
      ? undefined
      : (orderbook.asks[0].price + orderbook.bids[0].price) / 2;
  const markPrice = orderbookMidpoint || spotPrice;

  if (side === types.Side.BID && price < markPrice) return true;
  if (side === types.Side.ASK && price > markPrice) return true;

  const maxSlippage = slippage * markPrice;

  return Math.abs(price - markPrice) <= Math.abs(maxSlippage);
};

export function deepCloneCrossMarginAccount(
  marginAccount: CrossMarginAccount
): CrossMarginAccount {
  return cloneDeep(marginAccount) as CrossMarginAccount;
}

/**
 * Initializes the zeta markets for a zeta group.
 */
export async function initializeZetaMarkets(
  asset: Asset,
  zetaGroupAddress: PublicKey
) {
  // Initialize market indexes.
  let [marketIndexes, marketIndexesNonce] = getMarketIndexes(
    Exchange.programId,
    zetaGroupAddress
  );

  console.log("Initializing market indexes.");

  let tx = new Transaction().add(
    instructions.initializeMarketIndexesIx(
      asset,
      marketIndexes,
      marketIndexesNonce
    )
  );
  try {
    await processTransaction(
      Exchange.provider,
      tx,
      [],
      defaultCommitment(),
      Exchange.useLedger
    );
  } catch (e) {
    console.error(`Initialize market indexes failed: ${e}`);
  }

  let tx2 = new Transaction().add(
    instructions.addPerpMarketIndexIx(asset, marketIndexes)
  );

  try {
    await processTransaction(
      Exchange.provider,
      tx2,
      [],
      defaultCommitment(),
      Exchange.useLedger
    );
    await sleep(100);
  } catch (e) {
    console.error(`Add market indexes failed: ${e}`);
    console.log(e);
  }

  let marketIndexesAccount =
    (await Exchange.program.account.marketIndexes.fetch(
      marketIndexes
    )) as MarketIndexes;

  if (!marketIndexesAccount.initialized) {
    throw Error("Market indexes are not initialized!");
  }
  await initializeZetaMarket(
    asset,
    zetaGroupAddress,
    marketIndexes,
    marketIndexesAccount
  );
}

async function initializeZetaMarket(
  asset: Asset,
  zetaGroupAddress: PublicKey,
  marketIndexes: PublicKey,
  marketIndexesAccount: MarketIndexes
) {
  console.log(`Initializing zeta market`);

  const homedir = os.homedir();
  let dir = `${homedir}/keys/${assetToName(asset)}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let i = constants.PERP_INDEX;

  const requestQueue = getOrCreateKeypair(`${dir}/rq-${i}.json`);
  const eventQueue = getOrCreateKeypair(`${dir}/eq-${i}.json`);
  const bids = getOrCreateKeypair(`${dir}/bids-${i}.json`);
  const asks = getOrCreateKeypair(`${dir}/asks-${i}.json`);

  let [tx, tx2] = await instructions.initializeZetaMarketTxs(
    asset,
    marketIndexesAccount.indexes[i],
    requestQueue.publicKey,
    eventQueue.publicKey,
    bids.publicKey,
    asks.publicKey,
    marketIndexes,
    zetaGroupAddress
  );

  let marketInitialized = false;
  let accountsInitialized = false;
  if (Exchange.network != Network.LOCALNET) {
    // Validate that the market hasn't already been initialized
    // So no sol is wasted on unnecessary accounts.
    const [market, _marketNonce] = getMarketUninitialized(
      Exchange.programId,
      zetaGroupAddress,
      marketIndexesAccount.indexes[i]
    );

    let info = await Exchange.provider.connection.getAccountInfo(market);
    if (info !== null) {
      marketInitialized = true;
    }

    info = await Exchange.provider.connection.getAccountInfo(bids.publicKey);
    if (info !== null) {
      accountsInitialized = true;
    }
  }

  if (accountsInitialized) {
    console.log(`Market ${i} serum accounts already initialized...`);
  } else {
    try {
      console.log("initialize zeta market accounts");
      await processTransaction(
        Exchange.provider,
        tx,
        [requestQueue, eventQueue, bids, asks],
        commitmentConfig(Exchange.connection.commitment),
        Exchange.useLedger
      );
    } catch (e) {
      console.error(`Initialize zeta market serum accounts ${i} failed: ${e}`);
    }
  }

  if (marketInitialized) {
    console.log(`Market ${i} already initialized. Skipping...`);
  } else {
    try {
      console.log("initialize zeta market instruction");
      await processTransaction(
        Exchange.provider,
        tx2,
        [],
        commitmentConfig(Exchange.connection.commitment),
        Exchange.useLedger
      );
    } catch (e) {
      console.error(`Initialize zeta market ${i} failed: ${e}`);
    }
  }
}

export function calculateTakeTriggerOrderExecutionPrice(
  triggerOrder: TriggerOrder
) {
  if (triggerOrder.triggerPrice == null) {
    throw new Error("Trigger order needs a trigger price.");
  }
  let fee =
    Exchange.state.nativeTakeTriggerOrderFeePercentage.toNumber() / 100_000_000;
  let tradePriceFee = fee * triggerOrder.triggerPrice.toNumber();
  let side = types.fromProgramSide(triggerOrder.side);
  let executionPrice = null;
  if (side == types.Side.BID) {
    executionPrice = Math.min(
      triggerOrder.orderPrice.toNumber(),
      triggerOrder.triggerPrice.toNumber() + tradePriceFee
    );
  } else {
    executionPrice = Math.max(
      triggerOrder.orderPrice.toNumber(),
      triggerOrder.triggerPrice.toNumber() - tradePriceFee
    );
  }
  return executionPrice;
}

export function getFeeTier(accountType: constants.MarginAccountType): number {
  let tier = constants.ACCOUNT_TYPE_TO_FEE_TIER_MAP[accountType];
  if (tier == undefined) {
    return 0;
  }
  return tier;
}

export function getFeeBps(
  isTaker: boolean,
  accountType: constants.MarginAccountType
): number {
  let feeMap = isTaker
    ? constants.FEE_TIER_MAP_BPS["taker"]
    : constants.FEE_TIER_MAP_BPS["maker"];

  let fee = feeMap[accountType];
  if (fee == undefined) {
    return feeMap[constants.MarginAccountType.NORMAL];
  }
  return fee;
}

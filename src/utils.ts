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
  MarginAccount,
  ReferrerAlias,
  TradeEventV3,
  OpenOrdersMap,
  CrossOpenOrdersMap,
  CrossMarginAccount,
} from "./program-types";
import * as types from "./types";
import * as instructions from "./program-instructions";
import { Decimal } from "./decimal";
import { readBigInt64LE } from "./oracle-utils";
import { assets } from ".";
import { Network } from "./network";
import cloneDeep from "lodash.clonedeep";

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
 * roundingFactor argument will round the result to the nearest <roundingFactor>. Default is TICK_SIZE.
 */
export function convertDecimalToNativeInteger(
  amount: number,
  roundingFactor: number = constants.TICK_SIZE
): number {
  return (
    parseInt(
      (
        (amount * Math.pow(10, constants.PLATFORM_PRECISION)) /
        roundingFactor
      ).toFixed(0)
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
  lutAccs?: AddressLookupTableAccount[],
  blockhash?: { blockhash: string; lastValidBlockHeight: number }
): Promise<TransactionSignature> {
  let rawTx: Buffer | Uint8Array;

  if (Exchange.priorityFee != 0) {
    tx.instructions.unshift(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: Exchange.priorityFee,
      })
    );
  }

  let recentBlockhash =
    blockhash ??
    (await provider.connection.getLatestBlockhash(
      Exchange.blockhashCommitment
    ));

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

  try {
    // Integration tests don't like the split send + confirm :(
    if (Exchange.network == Network.LOCALNET) {
      return await anchor.sendAndConfirmRawTransaction(
        provider.connection,
        rawTx,
        opts || commitmentConfig(provider.connection.commitment)
      );
    }

    let txSig = await provider.connection.sendRawTransaction(
      rawTx,
      opts || commitmentConfig(provider.connection.commitment)
    );
    let result = await provider.connection.confirmTransaction({
      blockhash: recentBlockhash.blockhash,
      lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
      signature: txSig,
    });
    if (result.value.err != null) {
      let parsedErr = parseError(result.value.err);
      throw parsedErr;
    }
    return txSig;
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
  openOrdersToMargin?: Map<PublicKey, PublicKey>,
  crankLimit?: number
): Promise<boolean> {
  let market = Exchange.getPerpMarket(asset);
  let eventQueue = await market.serumMarket.loadEventQueue(Exchange.connection);
  if (eventQueue.length == 0) {
    return true;
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

  // TODO test support for both crossmargin and marginaccounts
  await Promise.all(
    uniqueOpenOrders.map(async (openOrders, index) => {
      let marginAccount: PublicKey;
      if (openOrdersToMargin && !openOrdersToMargin.has(openOrders)) {
        marginAccount = await getAccountFromOpenOrders(openOrders, asset);
        openOrdersToMargin.set(openOrders, marginAccount);
      } else if (openOrdersToMargin && openOrdersToMargin.has(openOrders)) {
        marginAccount = openOrdersToMargin.get(openOrders);
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
  return false;
}

/*
 * prune expired TIF orders from a list of market indices.
 */
export async function pruneExpiredTIFOrders(asset: Asset) {
  let tx = new Transaction().add(instructions.pruneExpiredTIFOrdersIx(asset));
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
  asset: Asset
): Promise<PublicKey[]> {
  let allOpenOrders: PublicKey[] = [];
  let market = Exchange.getPerpMarket(asset);

  let marginAccounts = await Exchange.program.account.marginAccount.all();
  marginAccounts.forEach((acc) => {
    let marginAccount = acc.account as MarginAccount;
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

  let crossMarginAccounts =
    await Exchange.program.account.crossMarginAccount.all();
  crossMarginAccounts.forEach((acc) => {
    let crossMarginAccount = acc.account as CrossMarginAccount;

    let nonce = crossMarginAccount.openOrdersNonces[assets.assetToIndex(asset)];
    if (nonce != 0) {
      let [openOrders, _nonce] = getCrossOpenOrders(
        Exchange.programId,
        market.address,
        acc.publicKey
      );
      allOpenOrders.push(openOrders);
    }
  });

  return allOpenOrders;
}

export async function settleAndBurnVaultTokens(
  asset: Asset,
  provider: anchor.AnchorProvider
) {
  let openOrders = await getAllOpenOrdersAccounts(asset);
  let market = Exchange.getPerpMarket(asset);
  console.log(`Burning tokens`);
  let remainingAccounts = openOrders.map((key) => {
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
    let txSlice = txs.slice(j, j + 5);
    await Promise.all(
      txSlice.map(async (tx) => {
        await processTransaction(provider, tx);
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

export async function executeTriggerOrder(
  asset: Asset,
  side: types.Side,
  triggerOrderBit: number,
  triggerOrder: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey
) {
  let tx = new Transaction().add(
    instructions.executeTriggerOrderIx(
      asset,
      side,
      triggerOrderBit,
      triggerOrder,
      marginAccount,
      openOrders
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

export function getZetaLutArr(): AddressLookupTableAccount[] {
  if (Exchange.network == Network.LOCALNET) {
    return [];
  }
  return [constants.STATIC_AND_PERPS_LUT[Exchange.network]];
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

export const checkLiquidity = (
  size: number,
  asset: Asset,
  side: types.Side,
  orderbook: types.DepthOrderbook
): types.LiquidityCheckInfo => {
  // We default to min lot size to still show a price
  const fillSize = size || constants.MIN_LOT_SIZE;

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
      orderbook
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
  orderbook: types.DepthOrderbook
): boolean => {
  const spotPrice = Exchange.getMarkPrice(asset);

  const orderbookMidpoint =
    !orderbook.asks.length || !orderbook.bids.length
      ? undefined
      : (orderbook.asks[0].price + orderbook.bids[0].price) / 2;
  const markPrice = orderbookMidpoint || spotPrice;

  if (side === types.Side.BID && price < markPrice) return true;
  if (side === types.Side.ASK && price > markPrice) return true;

  const maxSlippage = constants.PERP_MARKET_ORDER_SPOT_SLIPPAGE * markPrice;

  return Math.abs(price - markPrice) <= Math.abs(maxSlippage);
};

export function deepCloneCrossMarginAccount(
  marginAccount: CrossMarginAccount
): CrossMarginAccount {
  return cloneDeep(marginAccount) as CrossMarginAccount;
}

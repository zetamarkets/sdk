import { exchange as Exchange } from "./exchange";
import {
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
  AccountMeta,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as utils from "./utils";
import * as anchor from "@project-serum/anchor";
import * as types from "./types";
import * as constants from "./constants";
import { Asset } from "./assets";
import { Market } from "./market";

export function initializeMarginAccountIx(
  zetaGroup: PublicKey,
  marginAccount: PublicKey,
  user: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.initializeMarginAccount({
    accounts: {
      zetaGroup,
      marginAccount,
      authority: user,
      payer: user,
      zetaProgram: Exchange.programId,
      systemProgram: SystemProgram.programId,
    },
  });
}

export function closeMarginAccountIx(
  asset: Asset,
  userKey: PublicKey,
  marginAccount: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.closeMarginAccount({
    accounts: {
      marginAccount,
      authority: userKey,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
    },
  });
}

export async function initializeInsuranceDepositAccountIx(
  asset: Asset,
  userKey: PublicKey,
  userWhitelistInsuranceKey: PublicKey
): Promise<TransactionInstruction> {
  let subExchange = Exchange.getSubExchange(asset);
  let [insuranceDepositAccount, nonce] =
    await utils.getUserInsuranceDepositAccount(
      Exchange.programId,
      subExchange.zetaGroupAddress,
      userKey
    );

  return Exchange.program.instruction.initializeInsuranceDepositAccount(nonce, {
    accounts: {
      zetaGroup: subExchange.zetaGroupAddress,
      insuranceDepositAccount,
      authority: userKey,
      systemProgram: SystemProgram.programId,
      whitelistInsuranceAccount: userWhitelistInsuranceKey,
    },
  });
}

/**
 * @param amount the native amount to deposit (6dp)
 */
export async function depositIx(
  asset: Asset,
  amount: number,
  marginAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey,
  whitelistDepositAccount: PublicKey | undefined
): Promise<TransactionInstruction> {
  let remainingAccounts =
    whitelistDepositAccount !== undefined
      ? [
          {
            pubkey: whitelistDepositAccount,
            isSigner: false,
            isWritable: false,
          },
        ]
      : [];
  let subExchange = Exchange.getSubExchange(asset);

  // TODO: Probably use mint to find decimal places in future.
  return Exchange.program.instruction.deposit(new anchor.BN(amount), {
    accounts: {
      zetaGroup: subExchange.zetaGroupAddress,
      marginAccount: marginAccount,
      vault: subExchange.vaultAddress,
      userTokenAccount: usdcAccount,
      socializedLossAccount: subExchange.socializedLossAccountAddress,
      authority: userKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      state: Exchange.stateAddress,
      greeks: subExchange.zetaGroup.greeks,
    },
    remainingAccounts,
  });
}

/**
 * @param amount
 * @param insuranceDepositAccount
 * @param usdcAccount
 * @param userKey
 */
export function depositInsuranceVaultIx(
  asset: Asset,
  amount: number,
  insuranceDepositAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.depositInsuranceVault(
    new anchor.BN(amount),
    {
      accounts: {
        zetaGroup: subExchange.zetaGroupAddress,
        insuranceVault: subExchange.insuranceVaultAddress,
        insuranceDepositAccount,
        userTokenAccount: usdcAccount,
        zetaVault: subExchange.vaultAddress,
        socializedLossAccount: subExchange.socializedLossAccountAddress,
        authority: userKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  );
}

export function withdrawInsuranceVaultIx(
  asset: Asset,
  percentageAmount: number,
  insuranceDepositAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.withdrawInsuranceVault(
    new anchor.BN(percentageAmount),
    {
      accounts: {
        zetaGroup: subExchange.zetaGroupAddress,
        insuranceVault: subExchange.insuranceVaultAddress,
        insuranceDepositAccount,
        userTokenAccount: usdcAccount,
        authority: userKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  );
}

/**
 * @param amount the native amount to withdraw (6dp)
 */
export function withdrawIx(
  asset: Asset,
  amount: number,
  marginAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.withdraw(new anchor.BN(amount), {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      vault: subExchange.vaultAddress,
      marginAccount: marginAccount,
      userTokenAccount: usdcAccount,
      authority: userKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      greeks: subExchange.zetaGroup.greeks,
      oracle: subExchange.zetaGroup.oracle,
      socializedLossAccount: subExchange.socializedLossAccountAddress,
    },
  });
}

export async function initializeOpenOrdersIx(
  asset: Asset,
  market: PublicKey,
  userKey: PublicKey,
  marginAccount: PublicKey
): Promise<[TransactionInstruction, PublicKey]> {
  const [openOrdersPda, _openOrdersNonce] = await utils.getOpenOrders(
    Exchange.programId,
    market,
    userKey
  );

  const [openOrdersMap, _openOrdersMapNonce] = await utils.getOpenOrdersMap(
    Exchange.programId,
    openOrdersPda
  );

  return [
    Exchange.program.instruction.initializeOpenOrders({
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: Exchange.getZetaGroupAddress(asset),
        dexProgram: constants.DEX_PID[Exchange.network],
        systemProgram: SystemProgram.programId,
        openOrders: openOrdersPda,
        marginAccount: marginAccount,
        authority: userKey,
        payer: userKey,
        market: market,
        rent: SYSVAR_RENT_PUBKEY,
        serumAuthority: Exchange.serumAuthority,
        openOrdersMap,
      },
    }),
    openOrdersPda,
  ];
}

export async function closeOpenOrdersIx(
  asset: Asset,
  market: PublicKey,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey
): Promise<TransactionInstruction> {
  const [openOrdersMap, openOrdersMapNonce] = await utils.getOpenOrdersMap(
    Exchange.programId,
    openOrders
  );

  return Exchange.program.instruction.closeOpenOrders(openOrdersMapNonce, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      dexProgram: constants.DEX_PID[Exchange.network],
      openOrders,
      marginAccount: marginAccount,
      authority: userKey,
      market: market,
      serumAuthority: Exchange.serumAuthority,
      openOrdersMap,
    },
  });
}

export function placeOrderIx(
  asset: Asset,
  marketIndex: number,
  price: number,
  size: number,
  side: types.Side,
  clientOrderId: number,
  marginAccount: PublicKey,
  authority: PublicKey,
  openOrders: PublicKey,
  whitelistTradingFeesAccount: PublicKey | undefined
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  let remainingAccounts =
    whitelistTradingFeesAccount !== undefined
      ? [
          {
            pubkey: whitelistTradingFeesAccount,
            isSigner: false,
            isWritable: false,
          },
        ]
      : [];

  return Exchange.program.instruction.placeOrder(
    new anchor.BN(price),
    new anchor.BN(size),
    types.toProgramSide(side),
    clientOrderId == 0 ? null : new anchor.BN(clientOrderId),
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: subExchange.zetaGroupAddress,
        marginAccount: marginAccount,
        authority: authority,
        dexProgram: constants.DEX_PID[Exchange.network],
        tokenProgram: TOKEN_PROGRAM_ID,
        serumAuthority: Exchange.serumAuthority,
        greeks: subExchange.zetaGroup.greeks,
        openOrders: openOrders,
        rent: SYSVAR_RENT_PUBKEY,
        marketAccounts: {
          market: marketData.serumMarket.decoded.ownAddress,
          requestQueue: marketData.serumMarket.decoded.requestQueue,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          coinVault: marketData.serumMarket.decoded.baseVault,
          pcVault: marketData.serumMarket.decoded.quoteVault,
          // User params.
          orderPayerTokenAccount:
            side == types.Side.BID
              ? marketData.quoteVault
              : marketData.baseVault,
          coinWallet: marketData.baseVault,
          pcWallet: marketData.quoteVault,
        },
        oracle: subExchange.zetaGroup.oracle,
        marketNode: subExchange.greeks.nodeKeys[marketIndex],
        marketMint:
          side == types.Side.BID
            ? marketData.serumMarket.quoteMintAddress
            : marketData.serumMarket.baseMintAddress,
        mintAuthority: Exchange.mintAuthority,
      },
      remainingAccounts,
    }
  );
}

export function placeOrderV2Ix(
  asset: Asset,
  marketIndex: number,
  price: number,
  size: number,
  side: types.Side,
  orderType: types.OrderType,
  clientOrderId: number,
  marginAccount: PublicKey,
  authority: PublicKey,
  openOrders: PublicKey,
  whitelistTradingFeesAccount: PublicKey | undefined
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  let remainingAccounts =
    whitelistTradingFeesAccount !== undefined
      ? [
          {
            pubkey: whitelistTradingFeesAccount,
            isSigner: false,
            isWritable: false,
          },
        ]
      : [];
  return Exchange.program.instruction.placeOrderV2(
    new anchor.BN(price),
    new anchor.BN(size),
    types.toProgramSide(side),
    types.toProgramOrderType(orderType),
    clientOrderId == 0 ? null : new anchor.BN(clientOrderId),
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: subExchange.zetaGroupAddress,
        marginAccount: marginAccount,
        authority: authority,
        dexProgram: constants.DEX_PID[Exchange.network],
        tokenProgram: TOKEN_PROGRAM_ID,
        serumAuthority: Exchange.serumAuthority,
        greeks: subExchange.zetaGroup.greeks,
        openOrders: openOrders,
        rent: SYSVAR_RENT_PUBKEY,
        marketAccounts: {
          market: marketData.serumMarket.decoded.ownAddress,
          requestQueue: marketData.serumMarket.decoded.requestQueue,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          coinVault: marketData.serumMarket.decoded.baseVault,
          pcVault: marketData.serumMarket.decoded.quoteVault,
          // User params.
          orderPayerTokenAccount:
            side == types.Side.BID
              ? marketData.quoteVault
              : marketData.baseVault,
          coinWallet: marketData.baseVault,
          pcWallet: marketData.quoteVault,
        },
        oracle: subExchange.zetaGroup.oracle,
        marketNode: subExchange.greeks.nodeKeys[marketIndex],
        marketMint:
          side == types.Side.BID
            ? marketData.serumMarket.quoteMintAddress
            : marketData.serumMarket.baseMintAddress,
        mintAuthority: Exchange.mintAuthority,
      },
      remainingAccounts,
    }
  );
}

export function placeOrderV3Ix(
  asset: Asset,
  marketIndex: number,
  price: number,
  size: number,
  side: types.Side,
  orderType: types.OrderType,
  clientOrderId: number,
  tag: String,
  marginAccount: PublicKey,
  authority: PublicKey,
  openOrders: PublicKey,
  whitelistTradingFeesAccount: PublicKey | undefined
): TransactionInstruction {
  if (tag.length > constants.MAX_ORDER_TAG_LENGTH) {
    throw Error(
      `Tag is too long! Max length = ${constants.MAX_ORDER_TAG_LENGTH}`
    );
  }
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  let remainingAccounts =
    whitelistTradingFeesAccount !== undefined
      ? [
          {
            pubkey: whitelistTradingFeesAccount,
            isSigner: false,
            isWritable: false,
          },
        ]
      : [];
  return Exchange.program.instruction.placeOrderV3(
    new anchor.BN(price),
    new anchor.BN(size),
    types.toProgramSide(side),
    types.toProgramOrderType(orderType),
    clientOrderId == 0 ? null : new anchor.BN(clientOrderId),
    new String(tag),
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: subExchange.zetaGroupAddress,
        marginAccount: marginAccount,
        authority: authority,
        dexProgram: constants.DEX_PID[Exchange.network],
        tokenProgram: TOKEN_PROGRAM_ID,
        serumAuthority: Exchange.serumAuthority,
        greeks: subExchange.zetaGroup.greeks,
        openOrders: openOrders,
        rent: SYSVAR_RENT_PUBKEY,
        marketAccounts: {
          market: marketData.serumMarket.decoded.ownAddress,
          requestQueue: marketData.serumMarket.decoded.requestQueue,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          coinVault: marketData.serumMarket.decoded.baseVault,
          pcVault: marketData.serumMarket.decoded.quoteVault,
          // User params.
          orderPayerTokenAccount:
            side == types.Side.BID
              ? marketData.quoteVault
              : marketData.baseVault,
          coinWallet: marketData.baseVault,
          pcWallet: marketData.quoteVault,
        },
        oracle: subExchange.zetaGroup.oracle,
        marketNode: subExchange.greeks.nodeKeys[marketIndex],
        marketMint:
          side == types.Side.BID
            ? marketData.serumMarket.quoteMintAddress
            : marketData.serumMarket.baseMintAddress,
        mintAuthority: Exchange.mintAuthority,
      },
      remainingAccounts,
    }
  );
}

export function placePerpOrderIx(
  asset: Asset,
  marketIndex: number,
  price: number,
  size: number,
  side: types.Side,
  orderType: types.OrderType,
  clientOrderId: number,
  tag: String,
  marginAccount: PublicKey,
  authority: PublicKey,
  openOrders: PublicKey,
  whitelistTradingFeesAccount: PublicKey | undefined
): TransactionInstruction {
  if (tag.length > constants.MAX_ORDER_TAG_LENGTH) {
    throw Error(
      `Tag is too long! Max length = ${constants.MAX_ORDER_TAG_LENGTH}`
    );
  }
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = subExchange.markets.perpMarket;
  let remainingAccounts =
    whitelistTradingFeesAccount !== undefined
      ? [
          {
            pubkey: whitelistTradingFeesAccount,
            isSigner: false,
            isWritable: false,
          },
        ]
      : [];
  return Exchange.program.instruction.placePerpOrder(
    new anchor.BN(price),
    new anchor.BN(size),
    types.toProgramSide(side),
    types.toProgramOrderType(orderType),
    clientOrderId == 0 ? null : new anchor.BN(clientOrderId),
    new String(tag),
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: subExchange.zetaGroupAddress,
        marginAccount: marginAccount,
        authority: authority,
        dexProgram: constants.DEX_PID[Exchange.network],
        tokenProgram: TOKEN_PROGRAM_ID,
        serumAuthority: Exchange.serumAuthority,
        greeks: subExchange.zetaGroup.greeks,
        openOrders: openOrders,
        rent: SYSVAR_RENT_PUBKEY,
        marketAccounts: {
          market: marketData.serumMarket.decoded.ownAddress,
          requestQueue: marketData.serumMarket.decoded.requestQueue,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          coinVault: marketData.serumMarket.decoded.baseVault,
          pcVault: marketData.serumMarket.decoded.quoteVault,
          // User params.
          orderPayerTokenAccount:
            side == types.Side.BID
              ? marketData.quoteVault
              : marketData.baseVault,
          coinWallet: marketData.baseVault,
          pcWallet: marketData.quoteVault,
        },
        oracle: subExchange.zetaGroup.oracle,
        marketMint:
          side == types.Side.BID
            ? marketData.serumMarket.quoteMintAddress
            : marketData.serumMarket.baseMintAddress,
        mintAuthority: Exchange.mintAuthority,
        perpSyncQueue: subExchange.zetaGroup.perpSyncQueue,
      },
      remainingAccounts,
    }
  );
}

export function cancelOrderIx(
  asset: Asset,
  marketIndex: number,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: types.Side
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  return Exchange.program.instruction.cancelOrder(
    types.toProgramSide(side),
    orderId,
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          zetaGroup: subExchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          oracle: subExchange.zetaGroup.oracle,
        },
      },
    }
  );
}

export function cancelOrderNoErrorIx(
  asset: Asset,
  marketIndex: number,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: types.Side
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  return Exchange.program.instruction.cancelOrderNoError(
    types.toProgramSide(side),
    orderId,
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          zetaGroup: subExchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          oracle: subExchange.zetaGroup.oracle,
        },
      },
    }
  );
}

export function cancelAllMarketOrdersIx(
  asset: Asset,
  marketIndex: number,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  return Exchange.program.instruction.cancelAllMarketOrders({
    accounts: {
      authority: userKey,
      cancelAccounts: {
        zetaGroup: subExchange.zetaGroupAddress,
        state: Exchange.stateAddress,
        marginAccount,
        dexProgram: constants.DEX_PID[Exchange.network],
        serumAuthority: Exchange.serumAuthority,
        openOrders,
        market: marketData.address,
        bids: marketData.serumMarket.decoded.bids,
        asks: marketData.serumMarket.decoded.asks,
        eventQueue: marketData.serumMarket.decoded.eventQueue,
        oracle: subExchange.zetaGroup.oracle,
      },
    },
  });
}

export function cancelOrderByClientOrderIdIx(
  asset: Asset,
  marketIndex: number,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  clientOrderId: anchor.BN
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  return Exchange.program.instruction.cancelOrderByClientOrderId(
    clientOrderId,
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          zetaGroup: subExchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          oracle: subExchange.zetaGroup.oracle,
        },
      },
    }
  );
}

export function cancelOrderByClientOrderIdNoErrorIx(
  asset: Asset,
  marketIndex: number,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  clientOrderId: anchor.BN
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  return Exchange.program.instruction.cancelOrderByClientOrderIdNoError(
    clientOrderId,
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          zetaGroup: subExchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          oracle: subExchange.zetaGroup.oracle,
        },
      },
    }
  );
}

export function cancelExpiredOrderIx(
  asset: Asset,
  marketIndex: number,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: types.Side
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  return Exchange.program.instruction.cancelExpiredOrder(
    types.toProgramSide(side),
    orderId,
    {
      accounts: {
        cancelAccounts: {
          zetaGroup: subExchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          oracle: subExchange.zetaGroup.oracle,
        },
      },
    }
  );
}

export function forceCancelOrdersIx(
  asset: Asset,
  marketIndex: number,
  marginAccount: PublicKey,
  openOrders: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  return Exchange.program.instruction.forceCancelOrders({
    accounts: {
      greeks: subExchange.zetaGroup.greeks,
      oracle: subExchange.zetaGroup.oracle,
      cancelAccounts: {
        zetaGroup: subExchange.zetaGroupAddress,
        state: Exchange.stateAddress,
        marginAccount,
        dexProgram: constants.DEX_PID[Exchange.network],
        serumAuthority: Exchange.serumAuthority,
        openOrders,
        market: marketData.address,
        bids: marketData.serumMarket.decoded.bids,
        asks: marketData.serumMarket.decoded.asks,
        eventQueue: marketData.serumMarket.decoded.eventQueue,
        oracle: subExchange.zetaGroup.oracle,
      },
    },
  });
}

export async function initializeZetaMarketTxs(
  asset: Asset,
  marketIndex: number,
  seedIndex: number,
  requestQueue: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  marketIndexes: PublicKey
): Promise<[Transaction, Transaction]> {
  let subExchange = Exchange.getSubExchange(asset);
  const [market, marketNonce] = await utils.getMarketUninitialized(
    Exchange.programId,
    subExchange.zetaGroupAddress,
    seedIndex
  );

  const [vaultOwner, vaultSignerNonce] = await utils.getSerumVaultOwnerAndNonce(
    market,
    constants.DEX_PID[Exchange.network]
  );

  const [baseMint, baseMintNonce] = await utils.getBaseMint(
    Exchange.program.programId,
    market
  );
  const [quoteMint, quoteMintNonce] = await utils.getQuoteMint(
    Exchange.program.programId,
    market
  );
  // Create SPL token vaults for serum trading owned by the Zeta program
  const [zetaBaseVault, zetaBaseVaultNonce] = await utils.getZetaVault(
    Exchange.program.programId,
    baseMint
  );
  const [zetaQuoteVault, zetaQuoteVaultNonce] = await utils.getZetaVault(
    Exchange.program.programId,
    quoteMint
  );
  // Create SPL token vaults for serum trading owned by the DEX program
  const [dexBaseVault, dexBaseVaultNonce] = await utils.getSerumVault(
    Exchange.program.programId,
    baseMint
  );
  const [dexQuoteVault, dexQuoteVaultNonce] = await utils.getSerumVault(
    Exchange.program.programId,
    quoteMint
  );

  let fromPubkey = Exchange.useLedger
    ? Exchange.ledgerWallet.publicKey
    : Exchange.provider.wallet.publicKey;

  const tx = new Transaction();
  tx.add(
    SystemProgram.createAccount({
      fromPubkey,
      newAccountPubkey: requestQueue,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          5120 + 12
        ),
      space: 5120 + 12,
      programId: constants.DEX_PID[Exchange.network],
    }),
    SystemProgram.createAccount({
      fromPubkey,
      newAccountPubkey: eventQueue,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          262144 + 12
        ),
      space: 262144 + 12,
      programId: constants.DEX_PID[Exchange.network],
    }),
    SystemProgram.createAccount({
      fromPubkey,
      newAccountPubkey: bids,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          65536 + 12
        ),
      space: 65536 + 12,
      programId: constants.DEX_PID[Exchange.network],
    }),
    SystemProgram.createAccount({
      fromPubkey,
      newAccountPubkey: asks,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          65536 + 12
        ),
      space: 65536 + 12,
      programId: constants.DEX_PID[Exchange.network],
    })
  );

  let tx2 = new Transaction().add(
    Exchange.program.instruction.initializeZetaMarket(
      {
        index: marketIndex,
        marketNonce,
        baseMintNonce,
        quoteMintNonce,
        zetaBaseVaultNonce,
        zetaQuoteVaultNonce,
        dexBaseVaultNonce,
        dexQuoteVaultNonce,
        vaultSignerNonce,
      },
      {
        accounts: {
          state: Exchange.stateAddress,
          marketIndexes: marketIndexes,
          zetaGroup: subExchange.zetaGroupAddress,
          admin: Exchange.state.admin,
          market,
          requestQueue: requestQueue,
          eventQueue: eventQueue,
          bids: bids,
          asks: asks,
          baseMint,
          quoteMint,
          zetaBaseVault,
          zetaQuoteVault,
          dexBaseVault,
          dexQuoteVault,
          vaultOwner,
          mintAuthority: Exchange.mintAuthority,
          serumAuthority: Exchange.serumAuthority,
          dexProgram: constants.DEX_PID[Exchange.network],
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
      }
    )
  );
  return [tx, tx2];
}

export async function initializePerpSyncQueueIx(
  asset: Asset
): Promise<TransactionInstruction> {
  let [perpSyncQueue, nonce] = await utils.getPerpSyncQueue(
    Exchange.programId,
    Exchange.getSubExchange(asset).zetaGroupAddress
  );

  return Exchange.program.instruction.initializePerpSyncQueue(nonce, {
    accounts: {
      admin: Exchange.state.admin,
      zetaProgram: Exchange.programId,
      state: Exchange.stateAddress,
      perpSyncQueue,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      systemProgram: SystemProgram.programId,
    },
  });
}

export async function initializeZetaGroupIx(
  asset: Asset,
  underlyingMint: PublicKey,
  oracle: PublicKey,
  pricingArgs: InitializeZetaGroupPricingArgs,
  perpArgs: UpdatePerpParametersArgs,
  marginArgs: UpdateMarginParametersArgs,
  expiryArgs: UpdateZetaGroupExpiryArgs
): Promise<TransactionInstruction> {
  let [zetaGroup, zetaGroupNonce] = await utils.getZetaGroup(
    Exchange.programId,
    underlyingMint
  );

  let [underlying, underlyingNonce] = await utils.getUnderlying(
    Exchange.programId,
    Exchange.state.numUnderlyings
  );
  let subExchange = Exchange.getSubExchange(asset);
  let [greeks, greeksNonce] = await utils.getGreeks(
    Exchange.programId,
    subExchange.zetaGroupAddress
  );

  let [perpSyncQueue, perpSyncQueueNonce] = await utils.getPerpSyncQueue(
    Exchange.programId,
    subExchange.zetaGroupAddress
  );

  let [vault, vaultNonce] = await utils.getVault(
    Exchange.programId,
    subExchange.zetaGroupAddress
  );

  let [insuranceVault, insuranceVaultNonce] = await utils.getZetaInsuranceVault(
    Exchange.programId,
    subExchange.zetaGroupAddress
  );

  let [socializedLossAccount, socializedLossAccountNonce] =
    await utils.getSocializedLossAccount(
      Exchange.programId,
      subExchange.zetaGroupAddress
    );

  return Exchange.program.instruction.initializeZetaGroup(
    {
      zetaGroupNonce,
      underlyingNonce,
      greeksNonce,
      vaultNonce,
      insuranceVaultNonce,
      socializedLossAccountNonce,
      perpSyncQueueNonce,
      interestRate: pricingArgs.interestRate,
      volatility: pricingArgs.volatility,
      optionTradeNormalizer: pricingArgs.optionTradeNormalizer,
      futureTradeNormalizer: pricingArgs.futureTradeNormalizer,
      maxVolatilityRetreat: pricingArgs.maxVolatilityRetreat,
      maxInterestRetreat: pricingArgs.maxInterestRetreat,
      maxDelta: pricingArgs.maxDelta,
      minDelta: pricingArgs.minDelta,
      minInterestRate: pricingArgs.minInterestRate,
      maxInterestRate: pricingArgs.maxInterestRate,
      minVolatility: pricingArgs.minVolatility,
      maxVolatility: pricingArgs.maxVolatility,
      futureMarginInitial: marginArgs.futureMarginInitial,
      futureMarginMaintenance: marginArgs.futureMarginMaintenance,
      optionMarkPercentageLongInitial:
        marginArgs.optionMarkPercentageLongInitial,
      optionSpotPercentageLongInitial:
        marginArgs.optionSpotPercentageLongInitial,
      optionSpotPercentageShortInitial:
        marginArgs.optionSpotPercentageShortInitial,
      optionDynamicPercentageShortInitial:
        marginArgs.optionDynamicPercentageShortInitial,
      optionMarkPercentageLongMaintenance:
        marginArgs.optionMarkPercentageLongMaintenance,
      optionSpotPercentageLongMaintenance:
        marginArgs.optionSpotPercentageLongMaintenance,
      optionSpotPercentageShortMaintenance:
        marginArgs.optionSpotPercentageShortMaintenance,
      optionDynamicPercentageShortMaintenance:
        marginArgs.optionDynamicPercentageShortMaintenance,
      optionShortPutCapPercentage: marginArgs.optionShortPutCapPercentage,
      expiryIntervalSeconds: expiryArgs.expiryIntervalSeconds,
      newExpiryThresholdSeconds: expiryArgs.newExpiryThresholdSeconds,
      minFundingRatePercent: perpArgs.minFundingRatePercent,
      maxFundingRatePercent: perpArgs.maxFundingRatePercent,
      perpImpactCashDelta: perpArgs.perpImpactCashDelta,
    },
    {
      accounts: {
        state: Exchange.stateAddress,
        admin: Exchange.state.admin,
        systemProgram: SystemProgram.programId,
        underlyingMint,
        zetaProgram: Exchange.programId,
        oracle,
        zetaGroup,
        greeks,
        perpSyncQueue,
        underlying,
        vault,
        insuranceVault,
        socializedLossAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        usdcMint: Exchange.usdcMintAddress,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  );
}

export function collectTreasuryFundsIx(
  collectionTokenAccount: PublicKey,
  amount: anchor.BN,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.collectTreasuryFunds(amount, {
    accounts: {
      state: Exchange.stateAddress,
      treasuryWallet: Exchange.treasuryWalletAddress,
      collectionTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      admin,
    },
  });
}

export function treasuryMovementIx(
  asset: Asset,
  treasuryMovementType: types.TreasuryMovementType,
  amount: anchor.BN
): TransactionInstruction {
  return Exchange.program.instruction.treasuryMovement(
    types.toProgramTreasuryMovementType(treasuryMovementType),
    amount,
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: Exchange.getZetaGroupAddress(asset),
        insuranceVault: Exchange.getInsuranceVaultAddress(asset),
        treasuryWallet: Exchange.treasuryWalletAddress,
        referralsRewardsWallet: Exchange.referralsRewardsWalletAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
        admin: Exchange.provider.wallet.publicKey,
      },
    }
  );
}

export function rebalanceInsuranceVaultIx(
  asset: Asset,
  remainingAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.rebalanceInsuranceVault({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      zetaVault: Exchange.getVaultAddress(asset),
      insuranceVault: Exchange.getInsuranceVaultAddress(asset),
      treasuryWallet: Exchange.treasuryWalletAddress,
      socializedLossAccount: Exchange.getSocializedLossAccountAddress(asset),
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    remainingAccounts,
  });
}

export function liquidateIx(
  asset: Asset,
  liquidator: PublicKey,
  liquidatorMarginAccount: PublicKey,
  market: PublicKey,
  liquidatedMarginAccount: PublicKey,
  size: number
): TransactionInstruction {
  let liquidateSize: any = new anchor.BN(size);
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.liquidate(liquidateSize, {
    accounts: {
      state: Exchange.stateAddress,
      liquidator,
      liquidatorMarginAccount,
      greeks: subExchange.zetaGroup.greeks,
      oracle: subExchange.zetaGroup.oracle,
      market,
      zetaGroup: subExchange.zetaGroupAddress,
      liquidatedMarginAccount,
    },
  });
}

export function crankMarketIx(
  asset: Asset,
  market: PublicKey,
  eventQueue: PublicKey,
  dexProgram: PublicKey,
  remainingAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.crankEventQueue({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      market,
      eventQueue,
      dexProgram,
      serumAuthority: Exchange.serumAuthority,
    },
    remainingAccounts,
  });
}

export async function initializeMarketNodeIx(
  asset: Asset,
  index: number
): Promise<TransactionInstruction> {
  let subExchange = Exchange.getSubExchange(asset);
  let [marketNode, nonce] = await utils.getMarketNode(
    Exchange.programId,
    subExchange.zetaGroupAddress,
    index
  );

  return Exchange.program.instruction.initializeMarketNode(
    { nonce, index },
    {
      accounts: {
        zetaGroup: subExchange.zetaGroupAddress,
        marketNode,
        greeks: subExchange.greeksAddress,
        payer: Exchange.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    }
  );
}

export function retreatMarketNodesIx(
  asset: Asset,
  expiryIndex: number
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let head = expiryIndex * constants.PRODUCTS_PER_EXPIRY;
  let remainingAccounts = subExchange.greeks.nodeKeys
    .map((x: PublicKey) => {
      return {
        pubkey: x,
        isSigner: false,
        isWritable: true,
      };
    })
    .slice(head, head + constants.PRODUCTS_PER_EXPIRY);

  return Exchange.program.instruction.retreatMarketNodes(expiryIndex, {
    accounts: {
      zetaGroup: subExchange.zetaGroupAddress,
      greeks: subExchange.greeksAddress,
      oracle: subExchange.zetaGroup.oracle,
    },
    remainingAccounts,
  });
}

export function updatePricingIx(
  asset: Asset,
  expiryIndex: number
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.updatePricing(expiryIndex, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      greeks: subExchange.greeksAddress,
      oracle: subExchange.zetaGroup.oracle,
      perpBids: subExchange.markets.perpMarket.serumMarket.decoded.bids,
      perpAsks: subExchange.markets.perpMarket.serumMarket.decoded.asks,
    },
  });
}

export function applyPerpFundingIx(
  asset: Asset,
  remainingAccounts: any[]
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.applyPerpFunding({
    accounts: {
      zetaGroup: subExchange.zetaGroupAddress,
      greeks: subExchange.greeksAddress,
    },
    remainingAccounts, // margin accounts
  });
}

export function updatePricingParametersIx(
  asset: Asset,
  args: UpdatePricingParametersArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updatePricingParameters(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      admin,
    },
  });
}

export function updateMarginParametersIx(
  asset: Asset,
  args: UpdateMarginParametersArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateMarginParameters(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      admin,
    },
  });
}

export function updatePerpParametersIx(
  asset: Asset,
  args: UpdatePerpParametersArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updatePerpParameters(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      admin,
    },
  });
}

export function updateZetaGroupExpiryParameters(
  asset: Asset,
  args: UpdateZetaGroupExpiryArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateZetaGroupExpiryParameters(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      admin,
    },
  });
}

export function updateVolatilityNodesIx(
  asset: Asset,
  nodes: Array<anchor.BN>,
  admin: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.updateVolatilityNodes(nodes, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      greeks: subExchange.greeksAddress,
      admin,
    },
  });
}

export function initializeZetaStateIx(
  stateAddress: PublicKey,
  stateNonce: number,
  serumAuthority: PublicKey,
  treasuryWallet: PublicKey,
  referralsAdmin: PublicKey,
  referralsRewardsWallet: PublicKey,
  serumNonce: number,
  mintAuthority: PublicKey,
  mintAuthorityNonce: number,
  params: StateParams
): TransactionInstruction {
  let args: any = params;
  args["stateNonce"] = stateNonce;
  args["serumNonce"] = serumNonce;
  args["mintAuthNonce"] = mintAuthorityNonce;

  return Exchange.program.instruction.initializeZetaState(args, {
    accounts: {
      state: stateAddress,
      serumAuthority,
      mintAuthority,
      treasuryWallet,
      referralsAdmin,
      referralsRewardsWallet,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      usdcMint: Exchange.usdcMintAddress,
      admin: Exchange.provider.wallet.publicKey,
    },
  });
}

export function initializeZetaTreasuryWalletIx(): TransactionInstruction {
  return Exchange.program.instruction.initializeZetaTreasuryWallet({
    accounts: {
      state: Exchange.stateAddress,
      treasuryWallet: Exchange.treasuryWalletAddress,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      usdcMint: Exchange.usdcMintAddress,
      admin: Exchange.provider.wallet.publicKey,
    },
  });
}

export function initializeZetaReferralsRewardsWalletIx(): TransactionInstruction {
  return Exchange.program.instruction.initializeZetaReferralsRewardsWallet({
    accounts: {
      state: Exchange.stateAddress,
      referralsRewardsWallet: Exchange.referralsRewardsWalletAddress,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      usdcMint: Exchange.usdcMintAddress,
      admin: Exchange.provider.wallet.publicKey,
    },
  });
}

export function updateZetaStateIx(
  params: StateParams,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateZetaState(params, {
    accounts: {
      state: Exchange.stateAddress,
      admin,
    },
  });
}

export function initializeMarketIndexesIx(
  asset: Asset,
  marketIndexes: PublicKey,
  nonce: number
): TransactionInstruction {
  return Exchange.program.instruction.initializeMarketIndexes(nonce, {
    accounts: {
      state: Exchange.stateAddress,
      marketIndexes: marketIndexes,
      admin: Exchange.state.admin,
      systemProgram: SystemProgram.programId,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
    },
  });
}
export function addMarketIndexesIx(
  asset: Asset,
  marketIndexes: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.addMarketIndexes({
    accounts: {
      marketIndexes,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
    },
  });
}

export function initializeMarketStrikesIx(
  asset: Asset
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.initializeMarketStrikes({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      oracle: subExchange.zetaGroup.oracle,
    },
  });
}

export async function initializeWhitelistDepositAccountIx(
  asset: Asset,
  user: PublicKey,
  admin: PublicKey
): Promise<TransactionInstruction> {
  let [whitelistDepositAccount, whitelistDepositNonce] =
    await utils.getUserWhitelistDepositAccount(
      Exchange.program.programId,
      user
    );

  return Exchange.program.instruction.initializeWhitelistDepositAccount(
    whitelistDepositNonce,
    {
      accounts: {
        whitelistDepositAccount,
        admin,
        user: user,
        systemProgram: SystemProgram.programId,
        state: Exchange.stateAddress,
      },
    }
  );
}

export async function initializeWhitelistInsuranceAccountIx(
  user: PublicKey,
  admin: PublicKey
): Promise<TransactionInstruction> {
  let [whitelistInsuranceAccount, whitelistInsuranceNonce] =
    await utils.getUserWhitelistInsuranceAccount(
      Exchange.program.programId,
      user
    );

  return Exchange.program.instruction.initializeWhitelistInsuranceAccount(
    whitelistInsuranceNonce,
    {
      accounts: {
        whitelistInsuranceAccount,
        admin,
        user: user,
        systemProgram: SystemProgram.programId,
        state: Exchange.stateAddress,
      },
    }
  );
}

export async function initializeWhitelistTradingFeesAccountIx(
  user: PublicKey,
  admin: PublicKey
): Promise<TransactionInstruction> {
  let [whitelistTradingFeesAccount, whitelistTradingFeesNonce] =
    await utils.getUserWhitelistTradingFeesAccount(
      Exchange.program.programId,
      user
    );

  return Exchange.program.instruction.initializeWhitelistTradingFeesAccount(
    whitelistTradingFeesNonce,
    {
      accounts: {
        whitelistTradingFeesAccount,
        admin,
        user: user,
        systemProgram: SystemProgram.programId,
        state: Exchange.stateAddress,
      },
    }
  );
}

export async function referUserIx(
  user: PublicKey,
  referrer: PublicKey
): Promise<TransactionInstruction> {
  let [referrerAccount, _referrerAccountNonce] =
    await utils.getReferrerAccountAddress(Exchange.program.programId, referrer);

  let [referralAccount, _referralAccountNonce] =
    await utils.getReferralAccountAddress(Exchange.program.programId, user);

  return Exchange.program.instruction.referUser({
    accounts: {
      user,
      referrerAccount,
      referralAccount,
      systemProgram: SystemProgram.programId,
    },
  });
}

export async function initializeReferrerAccountIx(
  referrer: PublicKey
): Promise<TransactionInstruction> {
  let [referrerAccount, _referrerAccountNonce] =
    await utils.getReferrerAccountAddress(Exchange.program.programId, referrer);

  return Exchange.program.instruction.initializeReferrerAccount({
    accounts: {
      referrer,
      referrerAccount,
      systemProgram: SystemProgram.programId,
    },
  });
}

export async function initializeReferrerAliasIx(
  referrer: PublicKey,
  alias: string
): Promise<TransactionInstruction> {
  let [referrerAccount] = await utils.getReferrerAccountAddress(
    Exchange.program.programId,
    referrer
  );

  let [referrerAlias] = await utils.getReferrerAliasAddress(
    Exchange.program.programId,
    alias
  );

  return Exchange.program.instruction.initializeReferrerAlias(alias, {
    accounts: {
      referrer,
      referrerAlias,
      referrerAccount,
      systemProgram: SystemProgram.programId,
    },
  });
}

export async function setReferralsRewardsIx(
  args: SetReferralsRewardsArgs[],
  referralsAdmin: PublicKey,
  remainingAccounts: AccountMeta[]
): Promise<TransactionInstruction> {
  return Exchange.program.instruction.setReferralsRewards(args, {
    accounts: {
      state: Exchange.stateAddress,
      referralsAdmin,
    },
    remainingAccounts,
  });
}

export async function claimReferralsRewardsIx(
  userReferralsAccount: PublicKey,
  userTokenAccount: PublicKey,
  user: PublicKey
): Promise<TransactionInstruction> {
  return Exchange.program.instruction.claimReferralsRewards({
    accounts: {
      state: Exchange.stateAddress,
      referralsRewardsWallet: Exchange.referralsRewardsWalletAddress,
      userReferralsAccount,
      userTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      user,
    },
  });
}

export function settlePositionsTxs(
  asset: Asset,
  expirationTs: anchor.BN,
  settlementPda: PublicKey,
  nonce: number,
  marginAccounts: any[]
): Transaction[] {
  let txs = [];
  for (
    var i = 0;
    i < marginAccounts.length;
    i += constants.MAX_SETTLEMENT_ACCOUNTS
  ) {
    let tx = new Transaction();
    let slice = marginAccounts.slice(i, i + constants.MAX_SETTLEMENT_ACCOUNTS);
    tx.add(settlePositionsIx(asset, expirationTs, settlementPda, nonce, slice));
    txs.push(tx);
  }
  return txs;
}

export function settlePositionsIx(
  asset: Asset,
  expirationTs: anchor.BN,
  settlementPda: PublicKey,
  nonce: number,
  marginAccounts: AccountMeta[]
): TransactionInstruction {
  return Exchange.program.instruction.settlePositions(expirationTs, nonce, {
    accounts: {
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      settlementAccount: settlementPda,
    },
    remainingAccounts: marginAccounts,
  });
}

export function settleSpreadPositionsIx(
  asset: Asset,
  expirationTs: anchor.BN,
  settlementPda: PublicKey,
  nonce: number,
  spreadAccounts: AccountMeta[]
): TransactionInstruction {
  return Exchange.program.instruction.settleSpreadPositions(
    expirationTs,
    nonce,
    {
      accounts: {
        zetaGroup: Exchange.getZetaGroupAddress(asset),
        settlementAccount: settlementPda,
      },
      remainingAccounts: spreadAccounts,
    }
  );
}

export function settleSpreadPositionsHaltedTxs(
  asset: Asset,
  spreadAccounts: AccountMeta[],
  admin: PublicKey
): Transaction[] {
  let txs = [];
  for (
    var i = 0;
    i < spreadAccounts.length;
    i += constants.MAX_SETTLEMENT_ACCOUNTS
  ) {
    let slice = spreadAccounts.slice(i, i + constants.MAX_SETTLEMENT_ACCOUNTS);
    txs.push(
      new Transaction().add(settleSpreadPositionsHaltedIx(asset, slice, admin))
    );
  }
  return txs;
}

export function settlePositionsHaltedTxs(
  asset: Asset,
  marginAccounts: AccountMeta[],
  admin: PublicKey
): Transaction[] {
  let txs = [];
  for (
    var i = 0;
    i < marginAccounts.length;
    i += constants.MAX_SETTLEMENT_ACCOUNTS
  ) {
    let slice = marginAccounts.slice(i, i + constants.MAX_SETTLEMENT_ACCOUNTS);
    txs.push(
      new Transaction().add(settlePositionsHaltedIx(asset, slice, admin))
    );
  }
  return txs;
}

export function settlePositionsHaltedIx(
  asset: Asset,
  marginAccounts: AccountMeta[],
  admin: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.settlePositionsHalted({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      greeks: subExchange.greeksAddress,
      admin,
    },
    remainingAccounts: marginAccounts,
  });
}

export function settleSpreadPositionsHaltedIx(
  asset: Asset,
  spreadAccounts: AccountMeta[],
  admin: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.settleSpreadPositionsHalted({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      greeks: subExchange.greeksAddress,
      admin,
    },
    remainingAccounts: spreadAccounts,
  });
}

export function cleanZetaMarketsIx(
  asset: Asset,
  marketAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.cleanZetaMarkets({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
    },
    remainingAccounts: marketAccounts,
  });
}

export function cleanZetaMarketsHaltedIx(
  asset: Asset,
  marketAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.cleanZetaMarketsHalted({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
    },
    remainingAccounts: marketAccounts,
  });
}

export function updatePricingHaltedIx(
  asset: Asset,
  expiryIndex: number,
  admin: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.updatePricingHalted(expiryIndex, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      greeks: subExchange.greeksAddress,
      admin,
    },
  });
}

export function cleanMarketNodesIx(
  asset: Asset,
  expiryIndex: number
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let head = expiryIndex * constants.PRODUCTS_PER_EXPIRY;
  let remainingAccounts = subExchange.greeks.nodeKeys
    .map((x: PublicKey) => {
      return {
        pubkey: x,
        isSigner: false,
        isWritable: true,
      };
    })
    .slice(head, head + constants.PRODUCTS_PER_EXPIRY);

  return Exchange.program.instruction.cleanMarketNodes(expiryIndex, {
    accounts: {
      zetaGroup: subExchange.zetaGroupAddress,
      greeks: subExchange.greeksAddress,
    },
    remainingAccounts,
  });
}

export function cancelOrderHaltedIx(
  asset: Asset,
  marketIndex: number,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: types.Side
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getMarket(asset, marketIndex);
  return Exchange.program.instruction.cancelOrderHalted(
    types.toProgramSide(side),
    orderId,
    {
      accounts: {
        cancelAccounts: {
          zetaGroup: subExchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
          oracle: subExchange.zetaGroup.oracle,
        },
      },
    }
  );
}

export function haltZetaGroupIx(
  asset: Asset,
  zetaGroupAddress: PublicKey,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.haltZetaGroup({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: zetaGroupAddress,
      greeks: Exchange.getSubExchange(asset).greeksAddress,
      admin,
    },
  });
}

export function unhaltZetaGroupIx(
  zetaGroupAddress: PublicKey,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.unhaltZetaGroup({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: zetaGroupAddress,
      admin,
    },
  });
}

export function updateHaltStateIx(
  zetaGroupAddress: PublicKey,
  args: UpdateHaltStateArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateHaltState(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: zetaGroupAddress,
      admin,
    },
  });
}

export function updateVolatilityIx(
  asset: Asset,
  args: UpdateVolatilityArgs,
  admin: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.updateVolatility(args, {
    accounts: {
      state: Exchange.stateAddress,
      greeks: subExchange.greeksAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      admin,
    },
  });
}

export function updateInterestRateIx(
  asset: Asset,
  args: UpdateInterestRateArgs,
  admin: PublicKey
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.updateInterestRate(args, {
    accounts: {
      state: Exchange.stateAddress,
      greeks: subExchange.greeksAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      admin,
    },
  });
}

export function updateAdminIx(
  admin: PublicKey,
  newAdmin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateAdmin({
    accounts: {
      state: Exchange.stateAddress,
      admin,
      newAdmin,
    },
  });
}

export function updateReferralsAdminIx(
  admin: PublicKey,
  newReferralsAdmin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateReferralsAdmin({
    accounts: {
      state: Exchange.stateAddress,
      admin,
      newAdmin: newReferralsAdmin,
    },
  });
}

export function expireSeriesOverrideIx(
  asset: Asset,
  admin: PublicKey,
  settlementAccount: PublicKey,
  args: ExpireSeriesOverrideArgs
): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  return Exchange.program.instruction.expireSeriesOverride(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: subExchange.zetaGroupAddress,
      settlementAccount: settlementAccount,
      admin: admin,
      systemProgram: SystemProgram.programId,
      greeks: subExchange.greeksAddress,
    },
  });
}

export function initializeSpreadAccountIx(
  zetaGroup: PublicKey,
  spreadAccount: PublicKey,
  user: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.initializeSpreadAccount({
    accounts: {
      zetaGroup,
      spreadAccount,
      authority: user,
      payer: user,
      zetaProgram: Exchange.programId,
      systemProgram: SystemProgram.programId,
    },
  });
}

export function closeSpreadAccountIx(
  zetaGroup: PublicKey,
  spreadAccount: PublicKey,
  user: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.closeSpreadAccount({
    accounts: {
      zetaGroup,
      spreadAccount,
      authority: user,
    },
  });
}

export function positionMovementIx(
  asset: Asset,
  zetaGroup: PublicKey,
  marginAccount: PublicKey,
  spreadAccount: PublicKey,
  user: PublicKey,
  greeks: PublicKey,
  oracle: PublicKey,
  movementType: types.MovementType,
  movements: PositionMovementArg[]
): TransactionInstruction {
  return Exchange.program.instruction.positionMovement(
    types.toProgramMovementType(movementType),
    movements,
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup,
        marginAccount,
        spreadAccount,
        authority: user,
        greeks,
        oracle,
      },
    }
  );
}

export function transferExcessSpreadBalanceIx(
  zetaGroup: PublicKey,
  marginAccount: PublicKey,
  spreadAccount: PublicKey,
  user: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.transferExcessSpreadBalance({
    accounts: {
      zetaGroup,
      marginAccount,
      spreadAccount,
      authority: user,
    },
  });
}

export function settleDexFundsTxs(
  asset: Asset,
  marketKey: PublicKey,
  vaultOwner: PublicKey,
  remainingAccounts: any[]
): Transaction[] {
  let market = Exchange.getSubExchange(asset).markets.getMarket(marketKey);
  let accounts = {
    state: Exchange.stateAddress,
    market: market.address,
    zetaBaseVault: market.baseVault,
    zetaQuoteVault: market.quoteVault,
    dexBaseVault: market.serumMarket.decoded.baseVault,
    dexQuoteVault: market.serumMarket.decoded.quoteVault,
    vaultOwner,
    mintAuthority: Exchange.mintAuthority,
    serumAuthority: Exchange.serumAuthority,
    dexProgram: constants.DEX_PID[Exchange.network],
    tokenProgram: TOKEN_PROGRAM_ID,
  };

  let txs: Transaction[] = [];
  for (
    var j = 0;
    j < remainingAccounts.length;
    j += constants.MAX_SETTLE_ACCOUNTS
  ) {
    let tx = new Transaction();
    let slice = remainingAccounts.slice(j, j + constants.MAX_SETTLE_ACCOUNTS);
    tx.add(
      Exchange.program.instruction.settleDexFunds({
        accounts,
        remainingAccounts: slice,
      })
    );
    txs.push(tx);
  }
  return txs;
}

export function settleDexFundsIx(
  asset: Asset,
  marketKey: PublicKey,
  vaultOwner: PublicKey,
  openOrders: PublicKey
): TransactionInstruction {
  let market = Exchange.getSubExchange(asset).markets.getMarket(marketKey);
  let accounts = {
    state: Exchange.stateAddress,
    market: market.address,
    zetaBaseVault: market.baseVault,
    zetaQuoteVault: market.quoteVault,
    dexBaseVault: market.serumMarket.decoded.baseVault,
    dexQuoteVault: market.serumMarket.decoded.quoteVault,
    vaultOwner,
    mintAuthority: Exchange.mintAuthority,
    serumAuthority: Exchange.serumAuthority,
    dexProgram: constants.DEX_PID[Exchange.network],
    tokenProgram: TOKEN_PROGRAM_ID,
  };
  let remainingAccounts = [
    {
      pubkey: openOrders,
      isSigner: false,
      isWritable: true,
    },
  ];
  return Exchange.program.instruction.settleDexFunds({
    accounts,
    remainingAccounts,
  });
}

export function burnVaultTokenTx(
  asset: Asset,
  marketKey: PublicKey
): Transaction {
  let market = Exchange.getSubExchange(asset).markets.getMarket(marketKey);
  let tx = new Transaction();
  tx.add(
    Exchange.program.instruction.burnVaultTokens({
      accounts: {
        state: Exchange.stateAddress,
        mint: market.serumMarket.decoded.quoteMint,
        vault: market.quoteVault,
        serumAuthority: Exchange.serumAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    })
  );
  tx.add(
    Exchange.program.instruction.burnVaultTokens({
      accounts: {
        state: Exchange.stateAddress,
        mint: market.serumMarket.decoded.baseMint,
        vault: market.baseVault,
        serumAuthority: Exchange.serumAuthority,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    })
  );
  return tx;
}

export function overrideExpiryIx(
  zetaGroup: PublicKey,
  args: OverrideExpiryArgs
): TransactionInstruction {
  return Exchange.program.instruction.overrideExpiry(args, {
    accounts: {
      state: Exchange.stateAddress,
      admin: Exchange.state.admin,
      zetaGroup,
    },
  });
}

export async function toggleMarketMakerIx(
  isMarketMaker: boolean,
  zetaGroup: PublicKey,
  user: PublicKey
): Promise<TransactionInstruction> {
  let [marginAccount, _nonce] = await utils.getMarginAccount(
    Exchange.programId,
    zetaGroup,
    user
  );
  return Exchange.program.instruction.toggleMarketMaker(isMarketMaker, {
    accounts: {
      state: Exchange.stateAddress,
      admin: Exchange.state.admin,
      marginAccount,
    },
  });
}

export interface ExpireSeriesOverrideArgs {
  settlementNonce: number;
  settlementPrice: anchor.BN;
}

export interface UpdateHaltStateArgs {
  spotPrice: anchor.BN;
  timestamp: anchor.BN;
}

export interface UpdateVolatilityArgs {
  expiryIndex: number;
  volatility: Array<anchor.BN>;
}

export interface UpdateInterestRateArgs {
  expiryIndex: number;
  interestRate: anchor.BN;
}

export interface StateParams {
  strikeInitializationThresholdSeconds: number;
  pricingFrequencySeconds: number;
  liquidatorLiquidationPercentage: number;
  insuranceVaultLiquidationPercentage: number;
  nativeD1TradeFeePercentage: anchor.BN;
  nativeD1UnderlyingFeePercentage: anchor.BN;
  nativeWhitelistUnderlyingFeePercentage: anchor.BN;
  nativeDepositLimit: anchor.BN;
  expirationThresholdSeconds: number;
  positionMovementFeeBps: number;
  marginConcessionPercentage: number;
  nativeOptionTradeFeePercentage: anchor.BN;
  nativeOptionUnderlyingFeePercentage: anchor.BN;
  nativePerpTradeFeePercentage: anchor.BN;
  nativePerpUnderlyingFeePercentage: anchor.BN;
}

export interface UpdatePricingParametersArgs {
  optionTradeNormalizer: anchor.BN;
  futureTradeNormalizer: anchor.BN;
  maxVolatilityRetreat: anchor.BN;
  maxInterestRetreat: anchor.BN;
  maxDelta: anchor.BN;
  minDelta: anchor.BN;
  minInterestRate: anchor.BN;
  maxInterestRate: anchor.BN;
  minVolatility: anchor.BN;
  maxVolatility: anchor.BN;
}

export interface InitializeZetaGroupPricingArgs {
  interestRate: anchor.BN;
  volatility: Array<anchor.BN>;
  optionTradeNormalizer: anchor.BN;
  futureTradeNormalizer: anchor.BN;
  maxVolatilityRetreat: anchor.BN;
  maxInterestRetreat: anchor.BN;
  minDelta: anchor.BN;
  maxDelta: anchor.BN;
  minInterestRate: anchor.BN;
  maxInterestRate: anchor.BN;
  minVolatility: anchor.BN;
  maxVolatility: anchor.BN;
}

export interface UpdateMarginParametersArgs {
  futureMarginInitial: anchor.BN;
  futureMarginMaintenance: anchor.BN;
  optionMarkPercentageLongInitial: anchor.BN;
  optionSpotPercentageLongInitial: anchor.BN;
  optionSpotPercentageShortInitial: anchor.BN;
  optionDynamicPercentageShortInitial: anchor.BN;
  optionMarkPercentageLongMaintenance: anchor.BN;
  optionSpotPercentageLongMaintenance: anchor.BN;
  optionSpotPercentageShortMaintenance: anchor.BN;
  optionDynamicPercentageShortMaintenance: anchor.BN;
  optionShortPutCapPercentage: anchor.BN;
}

export interface UpdatePerpParametersArgs {
  minFundingRatePercent: anchor.BN;
  maxFundingRatePercent: anchor.BN;
  perpImpactCashDelta: anchor.BN;
}

export interface UpdateZetaGroupExpiryArgs {
  expiryIntervalSeconds: number;
  newExpiryThresholdSeconds: number;
}

export interface PositionMovementArg {
  index: number;
  size: anchor.BN;
}

export interface OverrideExpiryArgs {
  expiryIndex: number;
  activeTs: anchor.BN;
  expiryTs: anchor.BN;
}

export interface SetReferralsRewardsArgs {
  referralsAccountKey: PublicKey;
  pendingRewards: anchor.BN;
  overwrite: boolean;
}

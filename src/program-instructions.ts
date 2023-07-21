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
import * as anchor from "@zetamarkets/anchor";
import * as types from "./types";
import { Asset } from "./constants";
import * as constants from "./constants";
import { assetToIndex, toProgramAsset } from "./assets";
import { Market } from "./market";

export function initializeCombinedInsuranceVaultIx(): TransactionInstruction {
  let [insuranceVault, insuranceVaultNonce] =
    utils.getZetaCombinedInsuranceVault(Exchange.programId);
  return Exchange.program.instruction.initializeCombinedInsuranceVault(
    insuranceVaultNonce,
    {
      accounts: {
        state: Exchange.stateAddress,
        insuranceVault: insuranceVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        usdcMint: Exchange.usdcMintAddress,
        admin: Exchange.state.admin,
        systemProgram: SystemProgram.programId,
      },
    }
  );
}

export function initializeCombinedVaultIx(): TransactionInstruction {
  let [vault, vaultNonce] = utils.getCombinedVault(Exchange.programId);
  return Exchange.program.instruction.initializeCombinedVault(vaultNonce, {
    accounts: {
      state: Exchange.stateAddress,
      vault: vault,
      tokenProgram: TOKEN_PROGRAM_ID,
      usdcMint: Exchange.usdcMintAddress,
      admin: Exchange.state.admin,
      systemProgram: SystemProgram.programId,
    },
  });
}

export function initializeCombinedSocializedLossAccountIx(): TransactionInstruction {
  let [account, accountNonce] = utils.getCombinedSocializedLossAccount(
    Exchange.programId
  );
  return Exchange.program.instruction.initializeCombinedSocializedLossAccount(
    accountNonce,
    {
      accounts: {
        state: Exchange.stateAddress,
        socializedLossAccount: account,
        tokenProgram: TOKEN_PROGRAM_ID,
        usdcMint: Exchange.usdcMintAddress,
        admin: Exchange.state.admin,
        systemProgram: SystemProgram.programId,
      },
    }
  );
}

export function migrateToCrossMarginAccountIx(
  marginAccounts: PublicKey[],
  crossMarginAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  let remainingAccounts = [];
  for (var account of marginAccounts) {
    remainingAccounts.push({
      pubkey: account,
      isSigner: false,
      isWritable: true,
    });
  }
  return Exchange.program.instruction.migrateToCrossMarginAccount({
    accounts: {
      crossMarginAccount,
      pricing: Exchange.pricingAddress,
      authority: userKey,
    },
    remainingAccounts,
  });
}

export function initializeCrossMarginAccountManagerIx(
  crossMarginAccountManager: PublicKey,
  user: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.initializeCrossMarginAccountManager({
    accounts: {
      crossMarginAccountManager,
      authority: user,
      payer: user,
      zetaProgram: Exchange.programId,
      systemProgram: SystemProgram.programId,
    },
  });
}

export function closeCrossMarginAccountManagerIx(
  userKey: PublicKey,
  crossMarginAccountManager: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.closeCrossMarginAccountManager({
    accounts: {
      crossMarginAccountManager,
      authority: userKey,
    },
  });
}

export function initializeCrossMarginAccountIx(
  crossMarginAccount: PublicKey,
  crossMarginAccountManager: PublicKey,
  user: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.initializeCrossMarginAccount(0, {
    accounts: {
      crossMarginAccount,
      crossMarginAccountManager,
      authority: user,
      payer: user,
      zetaProgram: Exchange.programId,
      systemProgram: SystemProgram.programId,
    },
  });
}

export function closeCrossMarginAccountIx(
  userKey: PublicKey,
  crossMarginAccount: PublicKey,
  crossMarginAccountManager: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.closeCrossMarginAccount(0, {
    accounts: {
      crossMarginAccount,
      crossMarginAccountManager,
      authority: userKey,
    },
  });
}

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

export function initializeInsuranceDepositAccountIx(
  payer: PublicKey,
  userKey: PublicKey,
  userWhitelistInsuranceKey: PublicKey
): TransactionInstruction {
  let [insuranceDepositAccount, nonce] = utils.getUserInsuranceDepositAccount(
    Exchange.programId,
    userKey
  );

  return Exchange.program.instruction.initializeInsuranceDepositAccount(nonce, {
    accounts: {
      insuranceDepositAccount,
      payer,
      authority: userKey,
      systemProgram: SystemProgram.programId,
      whitelistInsuranceAccount: userWhitelistInsuranceKey,
    },
  });
}

/**
 * @param amount the native amount to deposit (6dp)
 */
export function depositV2Ix(
  amount: number,
  marginAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey,
  whitelistDepositAccount: PublicKey | undefined
): TransactionInstruction {
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

  // TODO: Probably use mint to find decimal places in future.
  return Exchange.program.instruction.depositV2(new anchor.BN(amount), {
    accounts: {
      pricing: Exchange.pricingAddress,
      marginAccount: marginAccount,
      vault: Exchange.combinedVaultAddress,
      userTokenAccount: usdcAccount,
      socializedLossAccount: Exchange.combinedSocializedLossAccountAddress,
      authority: userKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      state: Exchange.stateAddress,
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
export function depositInsuranceVaultV2Ix(
  amount: number,
  insuranceDepositAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.depositInsuranceVaultV2(
    new anchor.BN(amount),
    {
      accounts: {
        state: Exchange.stateAddress,
        pricing: Exchange.pricingAddress,
        insuranceVault: Exchange.combinedInsuranceVaultAddress,
        insuranceDepositAccount,
        userTokenAccount: usdcAccount,
        zetaVault: Exchange.combinedVaultAddress,
        socializedLossAccount: Exchange.combinedSocializedLossAccountAddress,
        authority: userKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  );
}

export function withdrawInsuranceVaultV2Ix(
  percentageAmount: number,
  insuranceDepositAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.withdrawInsuranceVaultV2(
    new anchor.BN(percentageAmount),
    {
      accounts: {
        state: Exchange.stateAddress,
        pricing: Exchange.pricingAddress,
        insuranceVault: Exchange.combinedInsuranceVaultAddress,
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
export function withdrawV2Ix(
  amount: number,
  marginAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.withdrawV2(new anchor.BN(amount), {
    accounts: {
      state: Exchange.stateAddress,
      pricing: Exchange.pricingAddress,
      vault: Exchange.combinedVaultAddress,
      marginAccount: marginAccount,
      userTokenAccount: usdcAccount,
      authority: userKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      socializedLossAccount: Exchange.combinedSocializedLossAccountAddress,
    },
  });
}

export function initializeOpenOrdersV2Ix(
  market: PublicKey,
  userKey: PublicKey,
  authority: PublicKey,
  marginAccount: PublicKey
): [TransactionInstruction, PublicKey] {
  const [openOrdersPda, _openOrdersNonce] = utils.getOpenOrders(
    Exchange.programId,
    market,
    userKey
  );

  const [openOrdersMap, _openOrdersMapNonce] = utils.getOpenOrdersMap(
    Exchange.programId,
    openOrdersPda
  );

  return [
    Exchange.program.instruction.initializeOpenOrdersV2({
      accounts: {
        state: Exchange.stateAddress,
        dexProgram: constants.DEX_PID[Exchange.network],
        systemProgram: SystemProgram.programId,
        openOrders: openOrdersPda,
        marginAccount: marginAccount,
        authority: authority,
        payer: authority,
        market: market,
        rent: SYSVAR_RENT_PUBKEY,
        serumAuthority: Exchange.serumAuthority,
        openOrdersMap,
      },
    }),
    openOrdersPda,
  ];
}

export function initializeOpenOrdersV3Ix(
  asset: Asset,
  market: PublicKey,
  authority: PublicKey,
  crossMarginAccount: PublicKey
): [TransactionInstruction, PublicKey] {
  const [openOrdersPda, _openOrdersNonce] = utils.getCrossOpenOrders(
    Exchange.programId,
    market,
    crossMarginAccount
  );

  const [openOrdersMap, _openOrdersMapNonce] = utils.getCrossOpenOrdersMap(
    Exchange.programId,
    openOrdersPda
  );

  return [
    Exchange.program.instruction.initializeOpenOrdersV3(toProgramAsset(asset), {
      accounts: {
        state: Exchange.stateAddress,
        dexProgram: constants.DEX_PID[Exchange.network],
        systemProgram: SystemProgram.programId,
        openOrders: openOrdersPda,
        crossMarginAccount: crossMarginAccount,
        authority: authority,
        payer: authority,
        market: market,
        rent: SYSVAR_RENT_PUBKEY,
        serumAuthority: Exchange.serumAuthority,
        openOrdersMap,
      },
    }),
    openOrdersPda,
  ];
}

export function closeOpenOrdersV3Ix(
  asset: Asset,
  userKey: PublicKey,
  crossMarginAccount: PublicKey,
  openOrders: PublicKey
): TransactionInstruction {
  const [openOrdersMap, openOrdersMapNonce] = utils.getCrossOpenOrdersMap(
    Exchange.programId,
    openOrders
  );

  return Exchange.program.instruction.closeOpenOrdersV3(
    openOrdersMapNonce,
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        pricing: Exchange.pricingAddress,
        dexProgram: constants.DEX_PID[Exchange.network],
        openOrders,
        crossMarginAccount: crossMarginAccount,
        authority: userKey,
        market: Exchange.getPerpMarket(asset).address,
        serumAuthority: Exchange.serumAuthority,
        openOrdersMap,
      },
    }
  );
}

export function closeOpenOrdersV2Ix(
  market: PublicKey,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey
): TransactionInstruction {
  const [openOrdersMap, openOrdersMapNonce] = utils.getOpenOrdersMap(
    Exchange.programId,
    openOrders
  );

  return Exchange.program.instruction.closeOpenOrdersV2(openOrdersMapNonce, {
    accounts: {
      state: Exchange.stateAddress,
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

export function placePerpOrderV3Ix(
  asset: Asset,
  price: number,
  size: number,
  side: types.Side,
  orderType: types.OrderType,
  clientOrderId: number,
  tag: String,
  tifOffset: number,
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
  return Exchange.program.instruction.placePerpOrderV3(
    new anchor.BN(price),
    new anchor.BN(size),
    types.toProgramSide(side),
    types.toProgramOrderType(orderType),
    clientOrderId == 0 ? null : new anchor.BN(clientOrderId),
    new String(tag),
    tifOffset == 0 ? null : tifOffset,
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        pricing: Exchange.pricingAddress,
        marginAccount: marginAccount,
        authority: authority,
        dexProgram: constants.DEX_PID[Exchange.network],
        tokenProgram: TOKEN_PROGRAM_ID,
        serumAuthority: Exchange.serumAuthority,
        openOrders: openOrders,
        rent: SYSVAR_RENT_PUBKEY,
        marketAccounts: {
          market: marketData.serumMarket.address,
          requestQueue: marketData.serumMarket.requestQueueAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          coinVault: marketData.serumMarket.baseVaultAddress,
          pcVault: marketData.serumMarket.quoteVaultAddress,
          // User params.
          orderPayerTokenAccount:
            side == types.Side.BID
              ? marketData.quoteVault
              : marketData.baseVault,
          coinWallet: marketData.baseVault,
          pcWallet: marketData.quoteVault,
        },
        oracle: Exchange.pricing.oracles[assetToIndex(asset)],
        oracleBackupFeed:
          Exchange.pricing.oracleBackupFeeds[assetToIndex(asset)],
        oracleBackupProgram: constants.CHAINLINK_PID,
        marketMint:
          side == types.Side.BID
            ? marketData.serumMarket.quoteMintAddress
            : marketData.serumMarket.baseMintAddress,
        mintAuthority: Exchange.mintAuthority,
        perpSyncQueue: Exchange.pricing.perpSyncQueues[assetToIndex(asset)],
      },
      remainingAccounts,
    }
  );
}

export function placeTriggerOrderIx(
  asset: Asset,
  orderPrice: number,
  triggerPrice: number,
  triggerDirection: types.TriggerDirection,
  triggerOrderIndex: number,
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
  let [triggerOrderInfo, _nonce] = utils.getTriggerOrderInfo(
    Exchange.programId,
    marginAccount,
    Uint8Array.from([triggerOrderIndex])
  );

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
  return Exchange.program.instruction.placeTriggerOrder(
    triggerOrderIndex,
    new anchor.BN(orderPrice),
    new anchor.BN(triggerPrice),
    types.toProgramTriggerDirection(triggerDirection),
    new anchor.BN(size),
    types.toProgramSide(side),
    types.toProgramOrderType(orderType),
    clientOrderId == 0 ? null : new anchor.BN(clientOrderId),
    new String(tag),
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        openOrders: openOrders,
        authority: authority,
        marginAccount: marginAccount,
        pricing: Exchange.pricingAddress,
        triggerOrderInfo: triggerOrderInfo,
        systemProgram: SystemProgram.programId,
        dexProgram: constants.DEX_PID[Exchange.network],
        market: Exchange.getPerpMarket(asset).serumMarket.address,
      },
      remainingAccounts,
    }
  );
}
export function executeTriggerOrderIx(
  asset: Asset,
  side: types.Side,
  triggerOrderIndex: number,
  triggerOrderInfo: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  whitelistTradingFeesAccount: PublicKey | undefined
): TransactionInstruction {
  let marketData = Exchange.getPerpMarket(asset);
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

  return Exchange.program.instruction.executeTriggerOrder(triggerOrderIndex, {
    accounts: {
      admin: Exchange.state.secondaryAdmin,
      triggerOrderInfo: triggerOrderInfo,
      placeOrderAccounts: {
        state: Exchange.stateAddress,
        pricing: Exchange.pricingAddress,
        marginAccount: marginAccount,
        dexProgram: constants.DEX_PID[Exchange.network],
        tokenProgram: TOKEN_PROGRAM_ID,
        serumAuthority: Exchange.serumAuthority,
        openOrders: openOrders,
        rent: SYSVAR_RENT_PUBKEY,
        marketAccounts: {
          market: marketData.serumMarket.address,
          requestQueue: marketData.serumMarket.requestQueueAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          coinVault: marketData.serumMarket.baseVaultAddress,
          pcVault: marketData.serumMarket.quoteVaultAddress,
          // User params.
          orderPayerTokenAccount:
            side == types.Side.BID
              ? marketData.quoteVault
              : marketData.baseVault,
          coinWallet: marketData.baseVault,
          pcWallet: marketData.quoteVault,
        },
        oracle: Exchange.pricing.oracles[assetToIndex(asset)],
        oracleBackupFeed:
          Exchange.pricing.oracleBackupFeeds[assetToIndex(asset)],
        oracleBackupProgram: constants.CHAINLINK_PID,
        marketMint:
          side == types.Side.BID
            ? marketData.serumMarket.quoteMintAddress
            : marketData.serumMarket.baseMintAddress,
        mintAuthority: Exchange.mintAuthority,
        perpSyncQueue: Exchange.pricing.perpSyncQueues[assetToIndex(asset)],
      },
    },
    remainingAccounts,
  });
}
export function cancelTriggerOrderIx(
  triggerOrderIndex: number,
  payer: PublicKey,
  triggerOrderInfo: PublicKey,
  marginAccount: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.cancelTriggerOrder(triggerOrderIndex, {
    accounts: {
      state: Exchange.stateAddress,
      payer: payer,
      admin: Exchange.state.secondaryAdmin,
      triggerOrderInfo: triggerOrderInfo,
      marginAccount: marginAccount,
    },
  });
}
export function editTriggerOrderIx(
  newOrderPrice: number,
  newTriggerPrice: number,
  newTriggerDirection: types.TriggerDirection,
  newSize: number,
  newSide: types.Side,
  newOrderType: types.OrderType,
  newClientOrderId: number,
  owner: PublicKey,
  triggerOrderInfo: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.editTriggerOrder(
    new anchor.BN(newOrderPrice),
    new anchor.BN(newTriggerPrice),
    types.toProgramTriggerDirection(newTriggerDirection),
    new anchor.BN(newSize),
    types.toProgramSide(newSide),
    types.toProgramOrderType(newOrderType),
    newClientOrderId == 0 ? null : new anchor.BN(newClientOrderId),
    {
      accounts: {
        owner: owner,
        triggerOrderInfo: triggerOrderInfo,
      },
    }
  );
}

export function cancelOrderIx(
  asset: Asset,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: types.Side
): TransactionInstruction {
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.cancelOrder(
    types.toProgramSide(side),
    orderId,
    toProgramAsset(asset),
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          state: Exchange.stateAddress,
          marginAccount: marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
        },
      },
    }
  );
}

export function cancelOrderNoErrorIx(
  asset: Asset,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: types.Side
): TransactionInstruction {
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.cancelOrderNoError(
    types.toProgramSide(side),
    orderId,
    toProgramAsset(asset),
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          state: Exchange.stateAddress,
          marginAccount: marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
        },
      },
    }
  );
}

export function pruneExpiredTIFOrdersIx(asset: Asset): TransactionInstruction {
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.pruneExpiredTifOrders({
    accounts: {
      dexProgram: constants.DEX_PID[Exchange.network],
      state: Exchange.stateAddress,
      serumAuthority: Exchange.serumAuthority,
      market: marketData.address,
      bids: marketData.serumMarket.bidsAddress,
      asks: marketData.serumMarket.asksAddress,
      eventQueue: marketData.serumMarket.eventQueueAddress,
    },
  });
}

export function cancelAllMarketOrdersIx(
  asset: Asset,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey
): TransactionInstruction {
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.cancelAllMarketOrders(
    toProgramAsset(asset),
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          state: Exchange.stateAddress,
          marginAccount: marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
        },
      },
    }
  );
}

export function cancelOrderByClientOrderIdIx(
  asset: Asset,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  clientOrderId: anchor.BN
): TransactionInstruction {
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.cancelOrderByClientOrderId(
    clientOrderId,
    toProgramAsset(asset),
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          state: Exchange.stateAddress,
          marginAccount: marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
        },
      },
    }
  );
}

export function cancelOrderByClientOrderIdNoErrorIx(
  asset: Asset,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  clientOrderId: anchor.BN
): TransactionInstruction {
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.cancelOrderByClientOrderIdNoError(
    clientOrderId,
    toProgramAsset(asset),
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          state: Exchange.stateAddress,
          marginAccount: marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
        },
      },
    }
  );
}

export function forceCancelOrderByOrderIdV2Ix(
  asset: Asset,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: types.Side
): TransactionInstruction {
  let assetIndex = assetToIndex(asset);
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.forceCancelOrderByOrderIdV2(
    types.toProgramSide(side),
    orderId,
    toProgramAsset(asset),
    {
      accounts: {
        pricing: Exchange.pricingAddress,
        oracle: Exchange.pricing.oracles[assetIndex],
        oracleBackupFeed: Exchange.pricing.oracleBackupFeeds[assetIndex],
        oracleBackupProgram: constants.CHAINLINK_PID,
        cancelAccounts: {
          state: Exchange.stateAddress,
          marginAccount: marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
        },
      },
    }
  );
}

export function forceCancelOrdersV2Ix(
  asset: Asset,
  marginAccount: PublicKey,
  openOrders: PublicKey
): TransactionInstruction {
  let assetIndex = assetToIndex(asset);
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.forceCancelOrdersV2(
    toProgramAsset(asset),
    {
      accounts: {
        pricing: Exchange.pricingAddress,
        oracle: Exchange.pricing.oracles[assetIndex],
        oracleBackupFeed: Exchange.pricing.oracleBackupFeeds[assetIndex],
        oracleBackupProgram: constants.CHAINLINK_PID,
        cancelAccounts: {
          state: Exchange.stateAddress,
          marginAccount: marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
        },
      },
    }
  );
}

export function initializeZetaMarketTIFEpochCyclesIx(
  asset: Asset,
  cycleLength: number
): TransactionInstruction {
  return Exchange.program.instruction.initializeMarketTifEpochCycle(
    cycleLength,
    {
      accounts: {
        state: Exchange.stateAddress,
        admin: Exchange.state.admin,
        market: Exchange.getPerpMarket(asset).address,
        serumAuthority: Exchange.serumAuthority,
        dexProgram: constants.DEX_PID[Exchange.network],
      },
    }
  );
}

export async function initializeZetaMarketTxs(
  asset: Asset,
  seedIndex: number,
  requestQueue: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  marketIndexes: PublicKey
): Promise<[Transaction, Transaction]> {
  let subExchange = Exchange.getSubExchange(asset);
  const [market, marketNonce] = utils.getMarketUninitialized(
    Exchange.programId,
    subExchange.zetaGroupAddress,
    seedIndex
  );

  const [vaultOwner, vaultSignerNonce] = utils.getSerumVaultOwnerAndNonce(
    market,
    constants.DEX_PID[Exchange.network]
  );

  const [baseMint, baseMintNonce] = utils.getBaseMint(
    Exchange.program.programId,
    market
  );
  const [quoteMint, quoteMintNonce] = utils.getQuoteMint(
    Exchange.program.programId,
    market
  );
  // Create SPL token vaults for serum trading owned by the Zeta program
  const [zetaBaseVault, zetaBaseVaultNonce] = utils.getZetaVault(
    Exchange.program.programId,
    baseMint
  );
  const [zetaQuoteVault, zetaQuoteVaultNonce] = utils.getZetaVault(
    Exchange.program.programId,
    quoteMint
  );
  // Create SPL token vaults for serum trading owned by the DEX program
  const [dexBaseVault, dexBaseVaultNonce] = utils.getSerumVault(
    Exchange.program.programId,
    baseMint
  );
  const [dexQuoteVault, dexQuoteVaultNonce] = utils.getSerumVault(
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
        asset: toProgramAsset(asset),
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
          pricing: Exchange.pricingAddress,
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

export function initializeUnderlyingIx(
  underlyingMint: PublicKey,
  flexUnderlying: boolean
): TransactionInstruction {
  let [underlying, _underlyingNonce] = flexUnderlying
    ? utils.getFlexUnderlying(
        Exchange.programId,
        Exchange.state.numFlexUnderlyings
      )
    : utils.getUnderlying(Exchange.programId, Exchange.state.numUnderlyings);

  return Exchange.program.instruction.initializeUnderlying(flexUnderlying, {
    accounts: {
      admin: Exchange.state.admin,
      zetaProgram: Exchange.programId,
      state: Exchange.stateAddress,
      systemProgram: SystemProgram.programId,
      underlying: underlying,
      underlyingMint: underlyingMint,
    },
  });
}

export function initializePerpSyncQueueIx(
  asset: Asset
): TransactionInstruction {
  let [perpSyncQueue, nonce] = utils.getPerpSyncQueue(
    Exchange.programId,
    Exchange.getSubExchange(asset).zetaGroupAddress
  );

  return Exchange.program.instruction.initializePerpSyncQueue(
    nonce,
    toProgramAsset(asset),
    {
      accounts: {
        admin: Exchange.state.admin,
        zetaProgram: Exchange.programId,
        state: Exchange.stateAddress,
        perpSyncQueue,
        pricing: Exchange.pricingAddress,
        systemProgram: SystemProgram.programId,
      },
    }
  );
}

export function initializeZetaGroupIx(
  asset: Asset,
  underlyingMint: PublicKey,
  oracle: PublicKey,
  oracleBackupFeed: PublicKey,
  oracleBackupProgram: PublicKey,
  pricingArgs: InitializeZetaGroupPricingArgs,
  perpArgs: UpdatePerpParametersArgs,
  marginArgs: UpdateMarginParametersArgs,
  expiryArgs: UpdateZetaGroupExpiryArgs,
  perpsOnly: boolean,
  flexUnderlying: boolean
): TransactionInstruction {
  let [zetaGroup, zetaGroupNonce] = utils.getZetaGroup(
    Exchange.programId,
    underlyingMint
  );

  let [underlying, underlyingNonce] = flexUnderlying
    ? utils.getFlexUnderlying(
        Exchange.programId,
        Exchange.state.numFlexUnderlyings
      )
    : utils.getUnderlying(Exchange.programId, Exchange.state.numUnderlyings);

  let [greeks, greeksNonce] = utils.getGreeks(Exchange.programId, zetaGroup);

  let [perpSyncQueue, perpSyncQueueNonce] = utils.getPerpSyncQueue(
    Exchange.programId,
    zetaGroup
  );

  let [vault, vaultNonce] = utils.getVault(Exchange.programId, zetaGroup);

  let [insuranceVault, insuranceVaultNonce] = utils.getZetaInsuranceVault(
    Exchange.programId,
    zetaGroup
  );

  let [socializedLossAccount, socializedLossAccountNonce] =
    utils.getSocializedLossAccount(Exchange.programId, zetaGroup);

  return Exchange.program.instruction.initializeZetaGroup(
    {
      perpsOnly,
      flexUnderlying: flexUnderlying,
      assetOverride: toProgramAsset(asset) as any,
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
        oracleBackupFeed,
        oracleBackupProgram,
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
  treasuryMovementType: types.TreasuryMovementType,
  amount: anchor.BN
): TransactionInstruction {
  return Exchange.program.instruction.treasuryMovement(
    types.toProgramTreasuryMovementType(treasuryMovementType),
    amount,
    {
      accounts: {
        state: Exchange.stateAddress,
        insuranceVault: Exchange.getInsuranceVaultAddress(),
        treasuryWallet: Exchange.treasuryWalletAddress,
        referralsRewardsWallet: Exchange.referralsRewardsWalletAddress,
        tokenProgram: TOKEN_PROGRAM_ID,
        admin: Exchange.provider.wallet.publicKey,
      },
    }
  );
}

export function rebalanceInsuranceVaultIx(
  remainingAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.rebalanceInsuranceVault({
    accounts: {
      state: Exchange.stateAddress,
      zetaVault: Exchange.combinedVaultAddress,
      insuranceVault: Exchange.combinedInsuranceVaultAddress,
      treasuryWallet: Exchange.treasuryWalletAddress,
      socializedLossAccount: Exchange.combinedSocializedLossAccountAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    remainingAccounts,
  });
}

export function liquidateV2Ix(
  asset: Asset,
  liquidator: PublicKey,
  liquidatorAccount: PublicKey,
  market: PublicKey,
  liquidatedAccount: PublicKey,
  size: number
): TransactionInstruction {
  let liquidateSize: any = new anchor.BN(size);
  let asset_index = assetToIndex(asset);
  return Exchange.program.instruction.liquidateV2(
    liquidateSize,
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        liquidator,
        liquidatorAccount,
        pricing: Exchange.pricingAddress,
        oracle: Exchange.pricing.oracles[asset_index],
        oracleBackupFeed: Exchange.pricing.oracleBackupFeeds[asset_index],
        oracleBackupProgram: constants.CHAINLINK_PID,
        market,
        liquidatedAccount,
      },
    }
  );
}

export function crankMarketIx(
  asset: Asset,
  market: PublicKey,
  eventQueue: PublicKey,
  dexProgram: PublicKey,
  remainingAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.crankEventQueue(toProgramAsset(asset), {
    accounts: {
      state: Exchange.stateAddress,
      pricing: Exchange.pricingAddress,
      perpSyncQueue: Exchange.getSubExchange(asset).perpSyncQueueAddress,
      market,
      eventQueue,
      dexProgram,
      serumAuthority: Exchange.serumAuthority,
    },
    remainingAccounts,
  });
}

export function updatePricingV2Ix(asset: Asset): TransactionInstruction {
  let subExchange = Exchange.getSubExchange(asset);
  let marketData = Exchange.getPerpMarket(asset);
  let asset_index = assetToIndex(asset);
  return Exchange.program.instruction.updatePricingV2(toProgramAsset(asset), {
    accounts: {
      state: Exchange.stateAddress,
      pricing: Exchange.pricingAddress,
      oracle: Exchange.pricing.oracles[asset_index],
      oracleBackupFeed: Exchange.pricing.oracleBackupFeeds[asset_index],
      oracleBackupProgram: constants.CHAINLINK_PID,
      perpMarket: marketData.address,
      perpBids: subExchange.markets.perpMarket.serumMarket.bidsAddress,
      perpAsks: subExchange.markets.perpMarket.serumMarket.asksAddress,
    },
  });
}

export function applyPerpFundingIx(
  asset: Asset,
  remainingAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.applyPerpFunding(toProgramAsset(asset), {
    accounts: {
      state: Exchange.stateAddress,
      pricing: Exchange.pricingAddress,
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
  return Exchange.program.instruction.updateMarginParameters(
    args,
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        pricing: Exchange.pricingAddress,
        admin,
      },
    }
  );
}

export function updatePerpParametersIx(
  asset: Asset,
  args: UpdatePerpParametersArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updatePerpParameters(
    args,
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        pricing: Exchange.pricingAddress,
        admin,
      },
    }
  );
}

export function updateZetaGroupMarginParametersIx(
  asset: Asset,
  args: UpdateMarginParametersArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateZetaGroupMarginParameters(
    args,
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: Exchange.getZetaGroupAddress(asset),
        admin,
      },
    }
  );
}

export function updateZetaGroupPerpParametersIx(
  asset: Asset,
  args: UpdatePerpParametersArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateZetaGroupPerpParameters(
    args,
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: Exchange.getZetaGroupAddress(asset),
        admin,
      },
    }
  );
}

export function updateZetaGroupExpiryParametersIx(
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

export function toggleZetaGroupPerpsOnlyIx(
  asset: Asset,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.toggleZetaGroupPerpsOnly({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.getZetaGroupAddress(asset),
      admin,
    },
  });
}

export function initializeZetaPricingIx(
  perpArgs: UpdatePerpParametersArgs,
  marginArgs: UpdateMarginParametersArgs
): TransactionInstruction {
  let [pricing, pricingNonce] = utils.getPricing(Exchange.programId);
  return Exchange.program.instruction.initializeZetaPricing(
    {
      minFundingRatePercent: perpArgs.minFundingRatePercent,
      maxFundingRatePercent: perpArgs.maxFundingRatePercent,
      perpImpactCashDelta: perpArgs.perpImpactCashDelta,
      marginInitial: marginArgs.futureMarginInitial,
      marginMaintenance: marginArgs.futureMarginMaintenance,
      pricingNonce: pricingNonce,
    },
    {
      accounts: {
        state: Exchange.stateAddress,
        pricing: pricing,
        admin: Exchange.state.admin,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  );
}

export function updateZetaPricingPubkeysIx(
  args: UpdateZetaPricingPubkeysArgs
): TransactionInstruction {
  return Exchange.program.instruction.updateZetaPricingPubkeys(args, {
    accounts: {
      state: Exchange.stateAddress,
      pricing: Exchange.pricingAddress,
      admin: Exchange.state.admin,
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
  params: StateParams,
  secondaryAdmin: PublicKey
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
      secondaryAdmin: secondaryAdmin,
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

export function addPerpMarketIndexIx(
  asset: Asset,
  marketIndexes: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.addPerpMarketIndex(
    toProgramAsset(asset),
    {
      accounts: {
        marketIndexes,
        pricing: Exchange.pricingAddress,
      },
    }
  );
}

export function initializeMarketIndexesIx(
  asset: Asset,
  marketIndexes: PublicKey,
  nonce: number
): TransactionInstruction {
  return Exchange.program.instruction.initializeMarketIndexes(
    nonce,
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        marketIndexes: marketIndexes,
        admin: Exchange.state.admin,
        systemProgram: SystemProgram.programId,
        pricing: Exchange.pricingAddress,
      },
    }
  );
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
      oracle: Exchange.pricing.oracles[assetToIndex(asset)],
      oracleBackupFeed: Exchange.pricing.oracleBackupFeeds[assetToIndex(asset)],
      oracleBackupProgram: constants.CHAINLINK_PID,
    },
  });
}

export function initializeWhitelistDepositAccountIx(
  asset: Asset,
  user: PublicKey,
  admin: PublicKey
): TransactionInstruction {
  let [whitelistDepositAccount, whitelistDepositNonce] =
    utils.getUserWhitelistDepositAccount(Exchange.program.programId, user);

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

export function initializeWhitelistInsuranceAccountIx(
  user: PublicKey,
  admin: PublicKey
): TransactionInstruction {
  let [whitelistInsuranceAccount, whitelistInsuranceNonce] =
    utils.getUserWhitelistInsuranceAccount(Exchange.program.programId, user);

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

export function initializeWhitelistTradingFeesAccountIx(
  user: PublicKey,
  admin: PublicKey
): TransactionInstruction {
  let [whitelistTradingFeesAccount, whitelistTradingFeesNonce] =
    utils.getUserWhitelistTradingFeesAccount(Exchange.program.programId, user);

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

export function referUserIx(
  user: PublicKey,
  referrer: PublicKey
): TransactionInstruction {
  let [referrerAccount, _referrerAccountNonce] =
    utils.getReferrerAccountAddress(Exchange.program.programId, referrer);

  let [referralAccount, _referralAccountNonce] =
    utils.getReferralAccountAddress(Exchange.program.programId, user);

  return Exchange.program.instruction.referUser({
    accounts: {
      user,
      referrerAccount,
      referralAccount,
      systemProgram: SystemProgram.programId,
    },
  });
}

export function initializeReferrerAccountIx(
  referrer: PublicKey
): TransactionInstruction {
  let [referrerAccount, _referrerAccountNonce] =
    utils.getReferrerAccountAddress(Exchange.program.programId, referrer);

  return Exchange.program.instruction.initializeReferrerAccount({
    accounts: {
      referrer,
      referrerAccount,
      systemProgram: SystemProgram.programId,
    },
  });
}

export function initializeReferrerAliasIx(
  referrer: PublicKey,
  alias: string
): TransactionInstruction {
  let [referrerAccount] = utils.getReferrerAccountAddress(
    Exchange.program.programId,
    referrer
  );

  let [referrerAlias] = utils.getReferrerAliasAddress(
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

export function setReferralsRewardsIx(
  args: SetReferralsRewardsArgs[],
  referralsAdmin: PublicKey,
  remainingAccounts: AccountMeta[]
): TransactionInstruction {
  return Exchange.program.instruction.setReferralsRewards(args, {
    accounts: {
      state: Exchange.stateAddress,
      referralsAdmin,
    },
    remainingAccounts,
  });
}

export function claimReferralsRewardsIx(
  userReferralsAccount: PublicKey,
  userTokenAccount: PublicKey,
  user: PublicKey
): TransactionInstruction {
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
  return Exchange.program.instruction.settlePositionsHalted(
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        pricing: Exchange.pricingAddress,
        admin,
      },
      remainingAccounts: marginAccounts,
    }
  );
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

export function cleanZetaMarketHaltedIx(asset: Asset): TransactionInstruction {
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.cleanZetaMarketHalted(
    toProgramAsset(asset),
    {
      accounts: {
        state: Exchange.stateAddress,
        market: marketData.address,
        bids: marketData.serumMarket.bidsAddress,
        asks: marketData.serumMarket.asksAddress,
      },
    }
  );
}

export function cancelOrderHaltedIx(
  asset: Asset,
  account: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: types.Side
): TransactionInstruction {
  let marketData = Exchange.getPerpMarket(asset);
  return Exchange.program.instruction.cancelOrderHalted(
    types.toProgramSide(side),
    orderId,
    toProgramAsset(asset),
    {
      accounts: {
        cancelAccounts: {
          state: Exchange.stateAddress,
          marginAccount: account,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.bidsAddress,
          asks: marketData.serumMarket.asksAddress,
          eventQueue: marketData.serumMarket.eventQueueAddress,
        },
      },
    }
  );
}

export function haltIx(asset: Asset, admin: PublicKey): TransactionInstruction {
  return Exchange.program.instruction.halt(toProgramAsset(asset), {
    accounts: {
      state: Exchange.stateAddress,
      pricing: Exchange.pricingAddress,
      admin,
    },
  });
}

export function unhaltIx(
  asset: Asset,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.unhalt(toProgramAsset(asset), {
    accounts: {
      state: Exchange.stateAddress,
      pricing: Exchange.pricingAddress,
      admin,
    },
  });
}

export function updateHaltStateIx(
  args: UpdateHaltStateArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateHaltState(args, {
    accounts: {
      state: Exchange.stateAddress,
      admin,
    },
  });
}

export function updateAdminIx(
  secondary: boolean,
  admin: PublicKey,
  newAdmin: PublicKey
): TransactionInstruction {
  let accounts = {
    accounts: {
      state: Exchange.stateAddress,
      admin,
      newAdmin,
    },
  };

  if (secondary) {
    return Exchange.program.instruction.updateSecondaryAdmin(accounts);
  }
  return Exchange.program.instruction.updateAdmin(accounts);
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
  oracleBackupFeed: PublicKey,
  oracleBackupProgram: PublicKey,
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
        oracleBackupFeed,
        oracleBackupProgram,
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
    dexBaseVault: market.serumMarket.baseVaultAddress,
    dexQuoteVault: market.serumMarket.quoteVaultAddress,
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
    dexBaseVault: market.serumMarket.baseVaultAddress,
    dexQuoteVault: market.serumMarket.quoteVaultAddress,
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
        mint: market.serumMarket.quoteMintAddress,
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
        mint: market.serumMarket.baseMintAddress,
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

export function toggleMarketMakerIx(
  isMarketMaker: boolean,
  account: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.toggleMarketMaker(isMarketMaker, {
    accounts: {
      state: Exchange.stateAddress,
      admin: Exchange.state.admin,
      marginAccount: account,
    },
  });
}

export function editDelegatedPubkeyIx(
  delegatedPubkey: PublicKey,
  account: PublicKey,
  authority: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.editDelegatedPubkey(delegatedPubkey, {
    accounts: {
      marginAccount: account,
      authority,
    },
  });
}

export interface ExpireSeriesOverrideArgs {
  settlementNonce: number;
  settlementPrice: anchor.BN;
}

export interface UpdateHaltStateArgs {
  asset: any;
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
  maxPerpDeltaAgeSeconds: number;
  nativeWithdrawLimit: anchor.BN;
  withdrawLimitEpochSeconds: number;
  nativeOpenInterestLimit: anchor.BN;
  triggerOrderTimeoutSeconds: number;
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

export interface UpdateZetaPricingPubkeysArgs {
  asset: any;
  oracle: PublicKey;
  oracleBackupFeed: PublicKey;
  market: PublicKey;
  perpSyncQueue: PublicKey;
  zetaGroupKey: PublicKey;
}

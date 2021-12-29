import { exchange as Exchange } from "./exchange";
import {
  PublicKey,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as utils from "./utils";
import * as anchor from "@project-serum/anchor";
import { Side, toProgramSide } from "./types";
import * as constants from "./constants";

export async function initializeMarginAccountTx(
  userKey: PublicKey
): Promise<Transaction> {
  let tx = new Transaction();
  const [marginAccount, nonce] = await utils.getMarginAccount(
    Exchange.programId,
    Exchange.zetaGroupAddress,
    userKey
  );
  tx.add(
    Exchange.program.instruction.initializeMarginAccount(nonce, {
      accounts: {
        zetaGroup: Exchange.zetaGroupAddress,
        marginAccount: marginAccount,
        authority: userKey,
        zetaProgram: Exchange.programId,
        systemProgram: SystemProgram.programId,
      },
    })
  );
  return tx;
}

export async function initializeInsuranceDepositAccountIx(
  userKey: PublicKey,
  userWhitelistInsuranceKey: PublicKey
): Promise<TransactionInstruction> {
  let [insuranceDepositAccount, nonce] =
    await utils.getUserInsuranceDepositAccount(
      Exchange.programId,
      Exchange.zetaGroupAddress,
      userKey
    );

  return Exchange.program.instruction.initializeInsuranceDepositAccount(nonce, {
    accounts: {
      zetaGroup: Exchange.zetaGroupAddress,
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
  // TODO: Probably use mint to find decimal places in future.
  return Exchange.program.instruction.deposit(new anchor.BN(amount), {
    accounts: {
      zetaGroup: Exchange.zetaGroupAddress,
      marginAccount: marginAccount,
      vault: Exchange.vaultAddress,
      userTokenAccount: usdcAccount,
      socializedLossAccount: Exchange.socializedLossAccountAddress,
      authority: userKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      state: Exchange.stateAddress,
      greeks: Exchange.zetaGroup.greeks,
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
  amount: number,
  insuranceDepositAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.depositInsuranceVault(
    new anchor.BN(amount),
    {
      accounts: {
        zetaGroup: Exchange.zetaGroupAddress,
        insuranceVault: Exchange.insuranceVaultAddress,
        insuranceDepositAccount,
        userTokenAccount: usdcAccount,
        zetaVault: Exchange.vaultAddress,
        socializedLossAccount: Exchange.socializedLossAccountAddress,
        authority: userKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  );
}

export function withdrawInsuranceVaultIx(
  percentageAmount: number,
  insuranceDepositAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.withdrawInsuranceVault(
    new anchor.BN(percentageAmount),
    {
      accounts: {
        zetaGroup: Exchange.zetaGroupAddress,
        insuranceVault: Exchange.insuranceVaultAddress,
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
  amount: number,
  marginAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.withdraw(new anchor.BN(amount), {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      vault: Exchange.vaultAddress,
      marginAccount: marginAccount,
      userTokenAccount: usdcAccount,
      authority: userKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      greeks: Exchange.zetaGroup.greeks,
      oracle: Exchange.zetaGroup.oracle,
      socializedLossAccount: Exchange.socializedLossAccountAddress,
    },
  });
}

export async function initializeOpenOrdersIx(
  market: PublicKey,
  userKey: PublicKey,
  marginAccount: PublicKey
): Promise<[TransactionInstruction, PublicKey]> {
  const [openOrdersPda, openOrdersNonce] = await utils.getOpenOrders(
    Exchange.programId,
    market,
    userKey
  );

  const [openOrdersMap, openOrdersMapNonce] = await utils.getOpenOrdersMap(
    Exchange.programId,
    openOrdersPda
  );

  return [
    Exchange.program.instruction.initializeOpenOrders(
      openOrdersNonce,
      openOrdersMapNonce,
      {
        accounts: {
          state: Exchange.stateAddress,
          zetaGroup: Exchange.zetaGroupAddress,
          dexProgram: constants.DEX_PID[Exchange.network],
          systemProgram: SystemProgram.programId,
          openOrders: openOrdersPda,
          marginAccount: marginAccount,
          authority: userKey,
          market: market,
          rent: SYSVAR_RENT_PUBKEY,
          serumAuthority: Exchange.serumAuthority,
          openOrdersMap,
        },
      }
    ),
    openOrdersPda,
  ];
}

export function placeOrderIx(
  marketIndex: number,
  price: number,
  size: number,
  side: Side,
  clientOrderId: number,
  marginAccount: PublicKey,
  authority: PublicKey,
  openOrders: PublicKey,
  whitelistTradingFeesAccount: PublicKey | undefined
): TransactionInstruction {
  let marketData = Exchange.markets.markets[marketIndex];
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
    toProgramSide(side),
    clientOrderId == 0 ? null : new anchor.BN(clientOrderId),
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: Exchange.zetaGroupAddress,
        marginAccount: marginAccount,
        authority: authority,
        dexProgram: constants.DEX_PID[Exchange.network],
        tokenProgram: TOKEN_PROGRAM_ID,
        serumAuthority: Exchange.serumAuthority,
        greeks: Exchange.zetaGroup.greeks,
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
            side == Side.BID ? marketData.quoteVault : marketData.baseVault,
          coinWallet: marketData.baseVault,
          pcWallet: marketData.quoteVault,
        },
        oracle: Exchange.zetaGroup.oracle,
        marketNode: Exchange.greeks.nodeKeys[marketIndex],
        marketMint:
          side == Side.BID
            ? marketData.serumMarket.quoteMintAddress
            : marketData.serumMarket.baseMintAddress,
        mintAuthority: Exchange.mintAuthority,
      },
      remainingAccounts,
    }
  );
}

export function cancelOrderIx(
  marketIndex: number,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: Side
): TransactionInstruction {
  let marketData = Exchange.markets.markets[marketIndex];
  return Exchange.program.instruction.cancelOrder(
    toProgramSide(side),
    orderId,
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          zetaGroup: Exchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
        },
      },
    }
  );
}

export function cancelOrderByClientOrderIdIx(
  marketIndex: number,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  clientOrderId: anchor.BN
): TransactionInstruction {
  let marketData = Exchange.markets.markets[marketIndex];
  return Exchange.program.instruction.cancelOrderByClientOrderId(
    clientOrderId,
    {
      accounts: {
        authority: userKey,
        cancelAccounts: {
          zetaGroup: Exchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
        },
      },
    }
  );
}

export function cancelExpiredOrderIx(
  marketIndex: number,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: Side
): TransactionInstruction {
  let marketData = Exchange.markets.markets[marketIndex];
  return Exchange.program.instruction.cancelExpiredOrder(
    toProgramSide(side),
    orderId,
    {
      accounts: {
        cancelAccounts: {
          zetaGroup: Exchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
        },
      },
    }
  );
}

export function forceCancelOrdersIx(
  marketIndex: number,
  marginAccount: PublicKey,
  openOrders: PublicKey
): TransactionInstruction {
  let marketData = Exchange.markets.markets[marketIndex];
  return Exchange.program.instruction.forceCancelOrders({
    accounts: {
      greeks: Exchange.zetaGroup.greeks,
      oracle: Exchange.zetaGroup.oracle,
      cancelAccounts: {
        zetaGroup: Exchange.zetaGroupAddress,
        state: Exchange.stateAddress,
        marginAccount,
        dexProgram: constants.DEX_PID[Exchange.network],
        serumAuthority: Exchange.serumAuthority,
        openOrders,
        market: marketData.address,
        bids: marketData.serumMarket.decoded.bids,
        asks: marketData.serumMarket.decoded.asks,
        eventQueue: marketData.serumMarket.decoded.eventQueue,
      },
    },
  });
}

export async function initializeZetaMarketTxs(
  marketIndex: number,
  seedIndex: number,
  requestQueue: PublicKey,
  eventQueue: PublicKey,
  bids: PublicKey,
  asks: PublicKey,
  marketIndexes: PublicKey
): Promise<[Transaction, Transaction]> {
  const [market, marketNonce] = await utils.getMarketUninitialized(
    Exchange.programId,
    Exchange.zetaGroupAddress,
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

  const tx = new Transaction();
  tx.add(
    SystemProgram.createAccount({
      fromPubkey: Exchange.provider.wallet.publicKey,
      newAccountPubkey: requestQueue,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          5120 + 12
        ),
      space: 5120 + 12,
      programId: constants.DEX_PID[Exchange.network],
    }),
    SystemProgram.createAccount({
      fromPubkey: Exchange.provider.wallet.publicKey,
      newAccountPubkey: eventQueue,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          262144 + 12
        ),
      space: 262144 + 12,
      programId: constants.DEX_PID[Exchange.network],
    }),
    SystemProgram.createAccount({
      fromPubkey: Exchange.provider.wallet.publicKey,
      newAccountPubkey: bids,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          65536 + 12
        ),
      space: 65536 + 12,
      programId: constants.DEX_PID[Exchange.network],
    }),
    SystemProgram.createAccount({
      fromPubkey: Exchange.provider.wallet.publicKey,
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
          zetaGroup: Exchange.zetaGroupAddress,
          admin: Exchange.provider.wallet.publicKey,
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

export async function initializeZetaGroupIx(
  underlyingMint: PublicKey,
  oracle: PublicKey,
  pricingArgs: InitializeZetaGroupPricingArgs,
  marginArgs: UpdateMarginParametersArgs
): Promise<TransactionInstruction> {
  let [zetaGroup, zetaGroupNonce] = await utils.getZetaGroup(
    Exchange.programId,
    underlyingMint
  );

  let [underlying, underlyingNonce] = await utils.getUnderlying(
    Exchange.programId,
    Exchange.state.numUnderlyings
  );

  let [greeks, greeksNonce] = await utils.getGreeks(
    Exchange.programId,
    Exchange.zetaGroupAddress
  );

  let [vault, vaultNonce] = await utils.getVault(
    Exchange.programId,
    Exchange.zetaGroupAddress
  );

  let [insuranceVault, insuranceVaultNonce] = await utils.getZetaInsuranceVault(
    Exchange.programId,
    Exchange.zetaGroupAddress
  );

  let [socializedLossAccount, socializedLossAccountNonce] =
    await utils.getSocializedLossAccount(
      Exchange.programId,
      Exchange.zetaGroupAddress
    );

  return Exchange.program.instruction.initializeZetaGroup(
    {
      zetaGroupNonce,
      underlyingNonce,
      greeksNonce,
      vaultNonce,
      insuranceVaultNonce,
      socializedLossAccountNonce,
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
    },
    {
      accounts: {
        state: Exchange.stateAddress,
        admin: Exchange.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        underlyingMint,
        zetaProgram: Exchange.programId,
        oracle,
        zetaGroup,
        greeks,
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

export function rebalanceInsuranceVaultIx(
  remainingAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.rebalanceInsuranceVault({
    accounts: {
      zetaGroup: Exchange.zetaGroupAddress,
      zetaVault: Exchange.vaultAddress,
      insuranceVault: Exchange.insuranceVaultAddress,
      socializedLossAccount: Exchange.socializedLossAccountAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    remainingAccounts,
  });
}

export function liquidateIx(
  liquidator: PublicKey,
  liquidatorMarginAccount: PublicKey,
  market: PublicKey,
  liquidatedMarginAccount: PublicKey,
  size: number
): TransactionInstruction {
  return Exchange.program.instruction.liquidate(new anchor.BN(size), {
    accounts: {
      state: Exchange.stateAddress,
      liquidator,
      liquidatorMarginAccount,
      greeks: Exchange.zetaGroup.greeks,
      oracle: Exchange.zetaGroup.oracle,
      market,
      zetaGroup: Exchange.zetaGroupAddress,
      liquidatedMarginAccount,
    },
  });
}

export function crankMarketIx(
  market: PublicKey,
  eventQueue: PublicKey,
  dexProgram: PublicKey,
  remainingAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.crankEventQueue({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      market,
      eventQueue,
      dexProgram,
      serumAuthority: Exchange.serumAuthority,
    },
    remainingAccounts,
  });
}

export async function initializeMarketNodeIx(
  index: number
): Promise<TransactionInstruction> {
  let [marketNode, nonce] = await utils.getMarketNode(
    Exchange.programId,
    Exchange.zetaGroupAddress,
    index
  );

  return Exchange.program.instruction.initializeMarketNode(
    { nonce, index },
    {
      accounts: {
        zetaGroup: Exchange.zetaGroupAddress,
        marketNode,
        greeks: Exchange.greeksAddress,
        payer: Exchange.provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    }
  );
}

export function retreatMarketNodesIx(
  expiryIndex: number
): TransactionInstruction {
  let head = expiryIndex * constants.PRODUCTS_PER_EXPIRY;
  let remainingAccounts = Exchange.greeks.nodeKeys
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
      zetaGroup: Exchange.zetaGroupAddress,
      greeks: Exchange.greeksAddress,
      oracle: Exchange.zetaGroup.oracle,
    },
    remainingAccounts,
  });
}

export function updatePricingIx(expiryIndex: number): TransactionInstruction {
  return Exchange.program.instruction.updatePricing(expiryIndex, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      greeks: Exchange.greeksAddress,
      oracle: Exchange.zetaGroup.oracle,
    },
  });
}

export function updatePricingParametersIx(
  args: UpdatePricingParametersArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updatePricingParameters(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      admin,
    },
  });
}

export function updateMarginParametersIx(
  args: UpdateMarginParametersArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateMarginParameters(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      admin,
    },
  });
}

export function updateVolatilityNodesIx(
  nodes: Array<anchor.BN>,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateVolatilityNodes(nodes, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      greeks: Exchange.greeksAddress,
      admin,
    },
  });
}

export function initializeZetaStateIx(
  stateAddress: PublicKey,
  stateNonce: number,
  serumAuthority: PublicKey,
  serumNonce: number,
  mintAuthority: PublicKey,
  mintAuthorityNonce: number,
  params: StateParams
): TransactionInstruction {
  let args: Object = params;
  args["stateNonce"] = stateNonce;
  args["serumNonce"] = serumNonce;
  args["mintAuthNonce"] = mintAuthorityNonce;
  return Exchange.program.instruction.initializeZetaState(args, {
    accounts: {
      state: stateAddress,
      serumAuthority,
      mintAuthority,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
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
  marketIndexes: PublicKey,
  nonce: number
): TransactionInstruction {
  return Exchange.program.instruction.initializeMarketIndexes(nonce, {
    accounts: {
      state: Exchange.stateAddress,
      marketIndexes: marketIndexes,
      admin: Exchange.provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
      zetaGroup: Exchange.zetaGroupAddress,
    },
  });
}
export function addMarketIndexesIx(
  marketIndexes: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.addMarketIndexes({
    accounts: {
      marketIndexes,
      zetaGroup: Exchange.zetaGroupAddress,
    },
  });
}

export function initializeMarketStrikesIx(): TransactionInstruction {
  return Exchange.program.instruction.initializeMarketStrikes({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      oracle: Exchange.zetaGroup.oracle,
    },
  });
}

export async function initializeWhitelistDepositAccountIx(
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

export function settlePositionsTxs(
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
    tx.add(settlePositionsIx(expirationTs, settlementPda, nonce, slice));
    txs.push(tx);
  }
  return txs;
}

export function settlePositionsIx(
  expirationTs: anchor.BN,
  settlementPda: PublicKey,
  nonce: number,
  marginAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.settlePositions(expirationTs, nonce, {
    accounts: {
      zetaGroup: Exchange.zetaGroupAddress,
      settlementAccount: settlementPda,
    },
    remainingAccounts: marginAccounts,
  });
}

export function settlePositionsHaltedTxs(
  marginAccounts: any[],
  admin: PublicKey
): Transaction[] {
  let txs = [];
  for (
    var i = 0;
    i < marginAccounts.length;
    i += constants.MAX_SETTLEMENT_ACCOUNTS
  ) {
    let slice = marginAccounts.slice(i, i + constants.MAX_SETTLEMENT_ACCOUNTS);
    txs.push(new Transaction().add(settlePositionsHaltedIx(slice, admin)));
  }
  return txs;
}

export function settlePositionsHaltedIx(
  marginAccounts: any[],
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.settlePositionsHalted({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      greeks: Exchange.greeksAddress,
      admin,
    },
    remainingAccounts: marginAccounts,
  });
}

export function cleanZetaMarketsIx(
  marketAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.cleanZetaMarkets({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
    },
    remainingAccounts: marketAccounts,
  });
}

export function cleanZetaMarketsHaltedIx(
  marketAccounts: any[]
): TransactionInstruction {
  return Exchange.program.instruction.cleanZetaMarketsHalted({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
    },
    remainingAccounts: marketAccounts,
  });
}

export function updatePricingHaltedIx(
  expiryIndex: number,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updatePricingHalted(expiryIndex, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      greeks: Exchange.greeksAddress,
      admin,
    },
  });
}

export function cleanMarketNodesIx(
  expiryIndex: number
): TransactionInstruction {
  let head = expiryIndex * constants.PRODUCTS_PER_EXPIRY;
  let remainingAccounts = Exchange.greeks.nodeKeys
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
      zetaGroup: Exchange.zetaGroupAddress,
      greeks: Exchange.greeksAddress,
    },
    remainingAccounts,
  });
}

export function cancelOrderHaltedIx(
  marketIndex: number,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: Side
): TransactionInstruction {
  let marketData = Exchange.markets.markets[marketIndex];
  return Exchange.program.instruction.cancelOrderHalted(
    toProgramSide(side),
    orderId,
    {
      accounts: {
        cancelAccounts: {
          zetaGroup: Exchange.zetaGroupAddress,
          state: Exchange.stateAddress,
          marginAccount,
          dexProgram: constants.DEX_PID[Exchange.network],
          serumAuthority: Exchange.serumAuthority,
          openOrders,
          market: marketData.address,
          bids: marketData.serumMarket.decoded.bids,
          asks: marketData.serumMarket.decoded.asks,
          eventQueue: marketData.serumMarket.decoded.eventQueue,
        },
      },
    }
  );
}

export function haltZetaGroupIx(
  zetaGroupAddress: PublicKey,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.haltZetaGroup({
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: zetaGroupAddress,
      greeks: Exchange.greeksAddress,
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
  args: UpdateVolatilityArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateVolatility(args, {
    accounts: {
      state: Exchange.stateAddress,
      greeks: Exchange.greeksAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      admin,
    },
  });
}

export function updateInterestRateIx(
  args: UpdateInterestRateArgs,
  admin: PublicKey
): TransactionInstruction {
  return Exchange.program.instruction.updateInterestRate(args, {
    accounts: {
      state: Exchange.stateAddress,
      greeks: Exchange.greeksAddress,
      zetaGroup: Exchange.zetaGroupAddress,
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

export function expireSeriesOverrideIx(
  admin: PublicKey,
  settlementAccount: PublicKey,
  args: ExpireSeriesOverrideArgs
): TransactionInstruction {
  return Exchange.program.instruction.expireSeriesOverride(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      settlementAccount: settlementAccount,
      admin: admin,
      systemProgram: SystemProgram.programId,
      greeks: Exchange.greeksAddress,
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
  expiryIntervalSeconds: number;
  newExpiryThresholdSeconds: number;
  strikeInitializationThresholdSeconds: number;
  pricingFrequencySeconds: number;
  liquidatorLiquidationPercentage: number;
  insuranceVaultLiquidationPercentage: number;
  nativeTradeFeePercentage: anchor.BN;
  nativeUnderlyingFeePercentage: anchor.BN;
  nativeWhitelistUnderlyingFeePercentage: anchor.BN;
  nativeDepositLimit: anchor.BN;
  expirationThresholdSeconds: number;
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

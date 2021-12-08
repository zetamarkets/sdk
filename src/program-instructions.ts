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
  userKey: PublicKey
): Promise<TransactionInstruction> {
  // TODO: Probably use mint to find decimal places in future.

  let vaultAddress = await utils.createVaultAddress(
    Exchange.programId,
    Exchange.zetaGroupAddress,
    Exchange.zetaGroup.vaultNonce
  );

  return Exchange.program.instruction.deposit(new anchor.BN(amount), {
    accounts: {
      zetaGroup: Exchange.zetaGroupAddress,
      marginAccount: marginAccount,
      vault: vaultAddress,
      userTokenAccount: usdcAccount,
      authority: userKey,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
  });
}

/**
 * @param amount
 * @param insuranceDepositAccount
 * @param usdcAccount
 * @param userKey
 */
export async function depositInsuranceVaultIx(
  amount: number,
  insuranceDepositAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): Promise<TransactionInstruction> {
  let insuranceVaultAddress = await utils.createZetaInsuranceVaultAddress(
    Exchange.programId,
    Exchange.zetaGroupAddress,
    Exchange.zetaGroup.insuranceVaultNonce
  );

  return Exchange.program.instruction.depositInsuranceVault(
    new anchor.BN(amount),
    {
      accounts: {
        zetaGroup: Exchange.zetaGroupAddress,
        insuranceVault: insuranceVaultAddress,
        insuranceDepositAccount,
        userTokenAccount: usdcAccount,
        authority: userKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    }
  );
}

export async function withdrawInsuranceVaultIx(
  percentageAmount: number,
  insuranceDepositAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): Promise<TransactionInstruction> {
  let insuranceVaultAddress = await utils.createZetaInsuranceVaultAddress(
    Exchange.programId,
    Exchange.zetaGroupAddress,
    Exchange.zetaGroup.insuranceVaultNonce
  );

  return Exchange.program.instruction.withdrawInsuranceVault(
    new anchor.BN(percentageAmount),
    {
      accounts: {
        zetaGroup: Exchange.zetaGroupAddress,
        insuranceVault: insuranceVaultAddress,
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
export async function withdrawIx(
  amount: number,
  marginAccount: PublicKey,
  usdcAccount: PublicKey,
  userKey: PublicKey
): Promise<TransactionInstruction> {
  let vaultAddress = await utils.createVaultAddress(
    Exchange.programId,
    Exchange.zetaGroupAddress,
    Exchange.zetaGroup.vaultNonce
  );

  return Exchange.program.instruction.withdraw(new anchor.BN(amount), {
    accounts: {
      zetaGroup: Exchange.zetaGroupAddress,
      vault: vaultAddress,
      marginAccount: marginAccount,
      userTokenAccount: usdcAccount,
      authority: userKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      greeks: Exchange.zetaGroup.greeks,
      oracle: Exchange.zetaGroup.oracle,
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
          dexProgram: constants.DEX_PID,
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

export async function placeOrderIx(
  marketIndex: number,
  price: number,
  size: number,
  side: Side,
  marginAccount: PublicKey,
  authority: PublicKey,
  openOrders: PublicKey,
  whitelistTradingFeesAccount?: PublicKey
): Promise<TransactionInstruction> {
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
    {
      accounts: {
        state: Exchange.stateAddress,
        zetaGroup: Exchange.zetaGroupAddress,
        marginAccount: marginAccount,
        authority: authority,
        dexProgram: constants.DEX_PID,
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
      },
      remainingAccounts,
    }
  );
}

export async function cancelOrderIx(
  marketIndex: number,
  userKey: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: Side
): Promise<TransactionInstruction> {
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
          dexProgram: constants.DEX_PID,
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

export async function cancelExpiredOrderIx(
  marketIndex: number,
  marginAccount: PublicKey,
  openOrders: PublicKey,
  orderId: anchor.BN,
  side: Side
): Promise<TransactionInstruction> {
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
          dexProgram: constants.DEX_PID,
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
  market: PublicKey,
  marginAccount: PublicKey,
  openOrders: PublicKey
): TransactionInstruction {
  let marketData = Exchange.markets.getMarket(market);
  return Exchange.program.instruction.forceCancelOrders({
    accounts: {
      greeks: Exchange.zetaGroup.greeks,
      oracle: Exchange.zetaGroup.oracle,
      cancelAccounts: {
        zetaGroup: Exchange.zetaGroupAddress,
        state: Exchange.stateAddress,
        marginAccount,
        dexProgram: constants.DEX_PID,
        serumAuthority: Exchange.serumAuthority,
        openOrders,
        market,
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
    constants.DEX_PID
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
      programId: constants.DEX_PID,
    }),
    SystemProgram.createAccount({
      fromPubkey: Exchange.provider.wallet.publicKey,
      newAccountPubkey: eventQueue,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          262144 + 12
        ),
      space: 262144 + 12,
      programId: constants.DEX_PID,
    }),
    SystemProgram.createAccount({
      fromPubkey: Exchange.provider.wallet.publicKey,
      newAccountPubkey: bids,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          65536 + 12
        ),
      space: 65536 + 12,
      programId: constants.DEX_PID,
    }),
    SystemProgram.createAccount({
      fromPubkey: Exchange.provider.wallet.publicKey,
      newAccountPubkey: asks,
      lamports:
        await Exchange.provider.connection.getMinimumBalanceForRentExemption(
          65536 + 12
        ),
      space: 65536 + 12,
      programId: constants.DEX_PID,
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
          dexProgram: constants.DEX_PID,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        },
      }
    )
  );
  return [tx, tx2];
}

export interface UpdatePricingParameterArgs {
  optionTradeNormalizer: anchor.BN;
  futureTradeNormalizer: anchor.BN;
  maxVolatilityRetreat: anchor.BN;
  maxInterestRetreat: anchor.BN;
  maxDelta: anchor.BN;
  minDelta: anchor.BN;
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
}

export async function initializeZetaGroupIx(
  underlyingMint: PublicKey,
  oracle: PublicKey,
  args: InitializeZetaGroupPricingArgs
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

  return Exchange.program.instruction.initializeZetaGroup(
    {
      zetaGroupNonce,
      underlyingNonce,
      greeksNonce,
      vaultNonce,
      insuranceVaultNonce,
      interestRate: args.interestRate,
      volatility: args.volatility,
      optionTradeNormalizer: args.optionTradeNormalizer,
      futureTradeNormalizer: args.futureTradeNormalizer,
      maxVolatilityRetreat: args.maxVolatilityRetreat,
      maxInterestRetreat: args.maxInterestRetreat,
      maxDelta: args.maxDelta,
      minDelta: args.minDelta,
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
        tokenProgram: TOKEN_PROGRAM_ID,
        usdcMint: Exchange.usdcMintAddress,
        rent: SYSVAR_RENT_PUBKEY,
      },
    }
  );
}

export async function rebalanceInsuranceVaultIx(
  remainingAccounts: any[]
): Promise<TransactionInstruction> {
  let vaultAddress = await utils.createVaultAddress(
    Exchange.programId,
    Exchange.zetaGroupAddress,
    Exchange.zetaGroup.vaultNonce
  );

  let insuranceVaultAddress = await utils.createZetaInsuranceVaultAddress(
    Exchange.programId,
    Exchange.zetaGroupAddress,
    Exchange.zetaGroup.insuranceVaultNonce
  );

  return Exchange.program.instruction.rebalanceInsuranceVault({
    accounts: {
      zetaGroup: Exchange.zetaGroupAddress,
      zetaVault: vaultAddress,
      insuranceVault: insuranceVaultAddress,
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
  args: UpdatePricingParameterArgs
): TransactionInstruction {
  return Exchange.program.instruction.updatePricingParameters(args, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      admin: Exchange.provider.wallet.publicKey,
    },
  });
}

export function updateVolatilityNodesIx(
  nodes: Array<anchor.BN>
): TransactionInstruction {
  return Exchange.program.instruction.updateVolatilityNodes(nodes, {
    accounts: {
      state: Exchange.stateAddress,
      zetaGroup: Exchange.zetaGroupAddress,
      greeks: Exchange.greeksAddress,
      admin: Exchange.provider.wallet.publicKey,
    },
  });
}

export type StateParams = {
  readonly expiryIntervalSeconds: number;
  readonly newExpiryThresholdSeconds: number;
  readonly strikeInitializationThresholdSeconds: number;
  readonly pricingFrequencySeconds: number;
  readonly insuranceVaultLiquidationPercentage: number;
};

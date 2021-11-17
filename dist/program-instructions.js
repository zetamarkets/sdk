"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crankMarketIx = exports.liquidateIx = exports.initializeZetaGroupTx = exports.updateGreeksIx = exports.initializeZetaMarketTxs = exports.forceCancelOrdersIx = exports.cancelExpiredOrderIx = exports.cancelOrderIx = exports.placeOrderIx = exports.initializeOpenOrdersIx = exports.withdrawIx = exports.depositIx = exports.initializeMarginAccountTx = void 0;
const exchange_1 = require("./exchange");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const utils = __importStar(require("./utils"));
const anchor = __importStar(require("@project-serum/anchor"));
const types_1 = require("./types");
const constants = __importStar(require("./constants"));
async function initializeMarginAccountTx(userKey) {
    let tx = new web3_js_1.Transaction();
    const [marginAccount, nonce] = await utils.getMarginAccount(exchange_1.exchange.programId, exchange_1.exchange.zetaGroupAddress, userKey);
    tx.add(await exchange_1.exchange.program.instruction.createMarginAccount(nonce, {
        accounts: {
            marginAccount: marginAccount,
            authority: userKey,
            systemProgram: web3_js_1.SystemProgram.programId,
            zetaProgram: exchange_1.exchange.programId,
            zetaGroup: exchange_1.exchange.zetaGroupAddress,
        },
    }));
    tx.add(await exchange_1.exchange.program.instruction.initializeMarginAccount(nonce, {
        accounts: {
            zetaGroup: exchange_1.exchange.zetaGroupAddress,
            marginAccount: marginAccount,
            authority: userKey,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
            systemProgram: web3_js_1.SystemProgram.programId,
        },
    }));
    return tx;
}
exports.initializeMarginAccountTx = initializeMarginAccountTx;
/**
 * @param amount the native amount to deposit (6dp)
 */
async function depositIx(amount, marginAccount, usdcAccount, userKey) {
    // TODO: Probably use mint to find decimal places in future.
    return await exchange_1.exchange.program.instruction.deposit(new anchor.BN(amount), {
        accounts: {
            state: exchange_1.exchange.stateAddress,
            zetaGroup: exchange_1.exchange.zetaGroupAddress,
            marginAccount: marginAccount,
            vault: exchange_1.exchange.vaultAddress,
            userTokenAccount: usdcAccount,
            authority: userKey,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
        },
    });
}
exports.depositIx = depositIx;
/**
 * @param amount the native amount to withdraw (6dp)
 */
async function withdrawIx(amount, marginAccount, usdcAccount, userKey) {
    return await exchange_1.exchange.program.instruction.withdraw(new anchor.BN(amount), {
        accounts: {
            state: exchange_1.exchange.stateAddress,
            zetaGroup: exchange_1.exchange.zetaGroupAddress,
            vault: exchange_1.exchange.vaultAddress,
            marginAccount: marginAccount,
            userTokenAccount: usdcAccount,
            authority: userKey,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            greeks: exchange_1.exchange.zetaGroup.greeks,
            oracle: exchange_1.exchange.zetaGroup.oracle,
        },
    });
}
exports.withdrawIx = withdrawIx;
async function initializeOpenOrdersIx(market, userKey, marginAccount) {
    const [openOrdersPda, openOrdersNonce] = await utils.getOpenOrders(exchange_1.exchange.programId, market, userKey);
    const [openOrdersMap, openOrdersMapNonce] = await utils.getOpenOrdersMap(exchange_1.exchange.programId, openOrdersPda);
    return [
        await exchange_1.exchange.program.instruction.initializeOpenOrders(openOrdersNonce, openOrdersMapNonce, {
            accounts: {
                state: exchange_1.exchange.stateAddress,
                zetaGroup: exchange_1.exchange.zetaGroupAddress,
                dexProgram: constants.DEX_PID,
                systemProgram: web3_js_1.SystemProgram.programId,
                openOrders: openOrdersPda,
                marginAccount: marginAccount,
                authority: userKey,
                market: market,
                rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                serumAuthority: exchange_1.exchange.serumAuthority,
                openOrdersMap,
            },
        }),
        openOrdersPda,
    ];
}
exports.initializeOpenOrdersIx = initializeOpenOrdersIx;
async function placeOrderIx(market, price, size, side, marginAccount, authority, openOrders) {
    let marketData = exchange_1.exchange.markets.getMarket(market);
    return await exchange_1.exchange.program.instruction.placeOrder(new anchor.BN(price), new anchor.BN(size), types_1.toProgramSide(side), {
        accounts: {
            state: exchange_1.exchange.stateAddress,
            zetaGroup: exchange_1.exchange.zetaGroupAddress,
            marginAccount: marginAccount,
            authority: authority,
            dexProgram: constants.DEX_PID,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            serumAuthority: exchange_1.exchange.serumAuthority,
            greeks: exchange_1.exchange.zetaGroup.greeks,
            openOrders: openOrders,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
            marketAccounts: {
                market: marketData.serumMarket.decoded.ownAddress,
                requestQueue: marketData.serumMarket.decoded.requestQueue,
                eventQueue: marketData.serumMarket.decoded.eventQueue,
                bids: marketData.serumMarket.decoded.bids,
                asks: marketData.serumMarket.decoded.asks,
                coinVault: marketData.serumMarket.decoded.baseVault,
                pcVault: marketData.serumMarket.decoded.quoteVault,
                // User params.
                orderPayerTokenAccount: side == types_1.Side.BID ? marketData.quoteVault : marketData.baseVault,
                coinWallet: marketData.baseVault,
                pcWallet: marketData.quoteVault,
            },
            oracle: exchange_1.exchange.zetaGroup.oracle,
        },
    });
}
exports.placeOrderIx = placeOrderIx;
async function cancelOrderIx(market, userKey, marginAccount, openOrders, orderId, side) {
    let marketData = exchange_1.exchange.markets.getMarket(market);
    return await exchange_1.exchange.program.instruction.cancelOrder(types_1.toProgramSide(side), orderId, {
        accounts: {
            authority: userKey,
            cancelAccounts: {
                zetaGroup: exchange_1.exchange.zetaGroupAddress,
                state: exchange_1.exchange.stateAddress,
                marginAccount,
                dexProgram: constants.DEX_PID,
                serumAuthority: exchange_1.exchange.serumAuthority,
                openOrders,
                market: market,
                bids: marketData.serumMarket.decoded.bids,
                asks: marketData.serumMarket.decoded.asks,
                eventQueue: marketData.serumMarket.decoded.eventQueue,
            },
        },
    });
}
exports.cancelOrderIx = cancelOrderIx;
async function cancelExpiredOrderIx(market, marginAccount, openOrders, orderId, side) {
    let marketData = exchange_1.exchange.markets.getMarket(market);
    return await exchange_1.exchange.program.instruction.cancelExpiredOrder(types_1.toProgramSide(side), orderId, {
        accounts: {
            cancelAccounts: {
                zetaGroup: exchange_1.exchange.zetaGroupAddress,
                state: exchange_1.exchange.stateAddress,
                marginAccount,
                dexProgram: constants.DEX_PID,
                serumAuthority: exchange_1.exchange.serumAuthority,
                openOrders,
                market: market,
                bids: marketData.serumMarket.decoded.bids,
                asks: marketData.serumMarket.decoded.asks,
                eventQueue: marketData.serumMarket.decoded.eventQueue,
            },
        },
    });
}
exports.cancelExpiredOrderIx = cancelExpiredOrderIx;
async function forceCancelOrdersIx(market, marginAccount, openOrders) {
    let marketData = exchange_1.exchange.markets.getMarket(market);
    return await exchange_1.exchange.program.instruction.forceCancelOrders({
        accounts: {
            greeks: exchange_1.exchange.zetaGroup.greeks,
            oracle: exchange_1.exchange.zetaGroup.oracle,
            cancelAccounts: {
                zetaGroup: exchange_1.exchange.zetaGroupAddress,
                state: exchange_1.exchange.stateAddress,
                marginAccount,
                dexProgram: constants.DEX_PID,
                serumAuthority: exchange_1.exchange.serumAuthority,
                openOrders,
                market,
                bids: marketData.serumMarket.decoded.bids,
                asks: marketData.serumMarket.decoded.asks,
                eventQueue: marketData.serumMarket.decoded.eventQueue,
            },
        },
    });
}
exports.forceCancelOrdersIx = forceCancelOrdersIx;
async function initializeZetaMarketTxs(marketIndex, requestQueue, eventQueue, bids, asks, marketIndexes) {
    let [market, marketNonce] = await utils.getMarketUninitialized(exchange_1.exchange.program.programId, exchange_1.exchange.zetaGroupAddress, marketIndex);
    const [vaultOwner, vaultSignerNonce] = await utils.getSerumVaultOwnerAndNonce(market, constants.DEX_PID);
    const [baseMint, baseMintNonce] = await utils.getBaseMint(exchange_1.exchange.program.programId, market);
    const [quoteMint, quoteMintNonce] = await utils.getQuoteMint(exchange_1.exchange.program.programId, market);
    // Create SPL token vaults for serum trading owned by the Zeta program
    const [zetaBaseVault, zetaBaseVaultNonce] = await utils.getZetaVault(exchange_1.exchange.program.programId, baseMint);
    const [zetaQuoteVault, zetaQuoteVaultNonce] = await utils.getZetaVault(exchange_1.exchange.program.programId, quoteMint);
    // Create SPL token vaults for serum trading owned by the DEX program
    const [dexBaseVault, dexBaseVaultNonce] = await utils.getSerumVault(exchange_1.exchange.program.programId, baseMint);
    const [dexQuoteVault, dexQuoteVaultNonce] = await utils.getSerumVault(exchange_1.exchange.program.programId, quoteMint);
    const tx = new web3_js_1.Transaction();
    tx.add(web3_js_1.SystemProgram.createAccount({
        fromPubkey: exchange_1.exchange.provider.wallet.publicKey,
        newAccountPubkey: requestQueue,
        lamports: await exchange_1.exchange.provider.connection.getMinimumBalanceForRentExemption(5120 + 12),
        space: 5120 + 12,
        programId: constants.DEX_PID,
    }), web3_js_1.SystemProgram.createAccount({
        fromPubkey: exchange_1.exchange.provider.wallet.publicKey,
        newAccountPubkey: eventQueue,
        lamports: await exchange_1.exchange.provider.connection.getMinimumBalanceForRentExemption(262144 + 12),
        space: 262144 + 12,
        programId: constants.DEX_PID,
    }), web3_js_1.SystemProgram.createAccount({
        fromPubkey: exchange_1.exchange.provider.wallet.publicKey,
        newAccountPubkey: bids,
        lamports: await exchange_1.exchange.provider.connection.getMinimumBalanceForRentExemption(65536 + 12),
        space: 65536 + 12,
        programId: constants.DEX_PID,
    }), web3_js_1.SystemProgram.createAccount({
        fromPubkey: exchange_1.exchange.provider.wallet.publicKey,
        newAccountPubkey: asks,
        lamports: await exchange_1.exchange.provider.connection.getMinimumBalanceForRentExemption(65536 + 12),
        space: 65536 + 12,
        programId: constants.DEX_PID,
    }));
    let tx2 = new web3_js_1.Transaction().add(await exchange_1.exchange.program.instruction.initializeZetaMarket({
        market: marketNonce,
        baseMint: baseMintNonce,
        quoteMint: quoteMintNonce,
        zetaBaseVault: zetaBaseVaultNonce,
        zetaQuoteVault: zetaQuoteVaultNonce,
        dexBaseVault: dexBaseVaultNonce,
        dexQuoteVault: dexQuoteVaultNonce,
        vaultSigner: vaultSignerNonce,
    }, {
        accounts: {
            state: exchange_1.exchange.stateAddress,
            marketIndexes: marketIndexes,
            zetaGroup: exchange_1.exchange.zetaGroupAddress,
            admin: exchange_1.exchange.provider.wallet.publicKey,
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
            mintAuthority: exchange_1.exchange.mintAuthority,
            serumAuthority: exchange_1.exchange.serumAuthority,
            dexProgram: constants.DEX_PID,
            systemProgram: web3_js_1.SystemProgram.programId,
            tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
        },
    }));
    return [tx, tx2];
}
exports.initializeZetaMarketTxs = initializeZetaMarketTxs;
async function updateGreeksIx(greekArgs) {
    return await exchange_1.exchange.program.instruction.updateGreeks(greekArgs, {
        accounts: {
            state: exchange_1.exchange.stateAddress,
            zetaGroup: exchange_1.exchange.zetaGroupAddress,
            greeks: exchange_1.exchange.zetaGroup.greeks,
            admin: exchange_1.exchange.provider.wallet.publicKey,
        },
    });
}
exports.updateGreeksIx = updateGreeksIx;
async function initializeZetaGroupTx(underlyingMint, oracle) {
    let [zetaGroup, zetaGroupNonce] = await utils.getZetaGroup(exchange_1.exchange.programId, underlyingMint);
    let [underlying, underlyingNonce] = await utils.getUnderlying(exchange_1.exchange.programId, exchange_1.exchange.state.numUnderlyings);
    let [greeks, greeksNonce] = await utils.getGreeks(exchange_1.exchange.programId, exchange_1.exchange.zetaGroupAddress);
    let tx = new web3_js_1.Transaction();
    tx.add(await exchange_1.exchange.program.instruction.createGreeksAccount(greeksNonce, {
        accounts: {
            state: exchange_1.exchange.stateAddress,
            greeks,
            admin: exchange_1.exchange.provider.wallet.publicKey,
            systemProgram: web3_js_1.SystemProgram.programId,
            zetaProgram: exchange_1.exchange.programId,
            zetaGroup: zetaGroup,
        },
    }));
    tx.add(await exchange_1.exchange.program.instruction.createZetaGroupAccount(zetaGroupNonce, {
        accounts: {
            state: exchange_1.exchange.stateAddress,
            zetaGroup,
            admin: exchange_1.exchange.provider.wallet.publicKey,
            systemProgram: web3_js_1.SystemProgram.programId,
            underlyingMint,
            zetaProgram: exchange_1.exchange.programId,
        },
    }));
    tx.add(await exchange_1.exchange.program.instruction.initializeZetaGroup({
        zetaGroupNonce,
        underlyingNonce,
        greeksNonce,
    }, {
        accounts: {
            state: exchange_1.exchange.stateAddress,
            zetaGroup,
            admin: exchange_1.exchange.provider.wallet.publicKey,
            systemProgram: web3_js_1.SystemProgram.programId,
            underlyingMint: underlyingMint,
            underlying,
            oracle,
            greeks,
        },
    }));
    return tx;
}
exports.initializeZetaGroupTx = initializeZetaGroupTx;
async function liquidateIx(liquidator, liquidatorMarginAccount, market, liquidatedMarginAccount, size) {
    return await exchange_1.exchange.program.instruction.liquidate(new anchor.BN(size), {
        accounts: {
            liquidator,
            liquidatorMarginAccount,
            greeks: exchange_1.exchange.zetaGroup.greeks,
            oracle: exchange_1.exchange.zetaGroup.oracle,
            market,
            zetaGroup: exchange_1.exchange.zetaGroupAddress,
            liquidatedMarginAccount,
        },
    });
}
exports.liquidateIx = liquidateIx;
async function crankMarketIx(market, eventQueue, dexProgram, remainingAccounts) {
    return await exchange_1.exchange.program.instruction.crankEventQueue({
        accounts: {
            state: exchange_1.exchange.stateAddress,
            zetaGroup: exchange_1.exchange.zetaGroupAddress,
            market,
            eventQueue,
            dexProgram,
            serumAuthority: exchange_1.exchange.serumAuthority,
        },
        remainingAccounts,
    });
}
exports.crankMarketIx = crankMarketIx;

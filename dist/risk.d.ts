import { Kind, MarginType, MarginRequirement, MarginAccountState } from "./types";
import { MarginAccount } from "./program-types";
export declare class RiskCalculator {
    /**
     * Returns the margin requirements for all markets,
     * indexed by market index.
     */
    get marginRequirement(): Array<MarginRequirement>;
    private _marginRequirements;
    constructor();
    updateMarginRequirements(): void;
    /**
     * Returns the margin requirement for a given market and size.
     * @param productIndex   market index of the product to calculate margin for.
     * @param size           signed integer of size for margin requirements (short orders should be negative)
     * @param marginType     type of margin calculation.
     */
    getMarginRequirement(productIndex: number, size: number, marginType: MarginType): number;
    /**
     * Returns the size of an order that would be considered "opening", when applied to margin requirements.
     * Total intended trade size = closing size + opening size
     * @param size           signed integer of size for margin requirements (short orders should be negative)
     * @param position       signed integer the user's current position for that product (0 if none).
     * @param closingSize    unsigned integer of the user's current closing order quantity for that product (0 if none)
     */
    calculateOpeningSize(size: number, position: number, closingSize: number): number;
    /**
     * Returns the unrealized pnl for a given MarginAccount
     * @param marginAccount   the user's MarginAccount.
     */
    calculateUnrealizedPnl(marginAccount: MarginAccount): number;
    /**
     * Returns the total initial margin requirement for a given account.
     * @param marginAccount   the user's MarginAccount.
     */
    calculateTotalInitialMargin(marginAccount: MarginAccount): number;
    /**
     * Returns the total maintenance margin requirement for a given account.
     * @param marginAccount   the user's MarginAccount.
     */
    calculateTotalMaintenanceMargin(marginAccount: MarginAccount): number;
    /**
     * Returns the total margin requirement for a given account.
     * @param marginAccount   the user's MarginAccount.
     */
    calculateTotalMargin(marginAccount: MarginAccount): number;
    /**
     * Returns the aggregate margin account state.
     * @param marginAccount   the user's MarginAccount.
     */
    getMarginAccountState(marginAccount: MarginAccount): MarginAccountState;
}
/**
 * Calculates the price at which a position will be liquidated.
 * @param accountBalance    margin account balance.
 * @param marginRequirement total margin requirement for margin account.
 * @param unrealizedPnl     unrealized pnl for margin account.
 * @param markPrice         mark price of product being calculated.
 * @param position          signed position size of user.
 */
export declare function calculateLiquidationPrice(accountBalance: number, marginRequirement: number, unrealizedPnl: number, markPrice: number, position: number): number;
/**
 * Calculates how much the strike is out of the money.
 * @param kind          product kind (expect CALL/PUT);
 * @param strike        strike of the product.
 * @param spotPrice     price of the spot.
 */
export declare function calculateOtmAmount(kind: Kind, strike: number, spotPrice: number): number;
/**
 * Calculates the margin requirement for given market index.
 * @param productIndex  market index of the product.
 * @param spotPrice     price of the spot.
 */
export declare function calculateProductMargin(productIndex: number, spotPrice: number): MarginRequirement;
/**
 * Calculates the margin requirement for a future.
 * @param spotPrice     price of the spot.
 */
export declare function calculateFutureMargin(spotPrice: number): MarginRequirement;
/**
 * @param markPrice         mark price of product being calculated.
 * @param spotPrice         spot price of the underlying from oracle.
 * @param strike            strike of the option.
 * @param kind              kind of the option (expect CALL/PUT)
 */
export declare function calculateOptionMargin(spotPrice: number, markPrice: number, kind: Kind, strike: number): MarginRequirement;
/**
 * Calculates the margin requirement for a short option.
 * @param spotPrice    margin account balance.
 * @param otmAmount    otm amount calculated `from calculateOtmAmount`
 * @param marginType   type of margin calculation
 */
export declare function calculateShortOptionMargin(spotPrice: number, otmAmount: number, marginType: MarginType): number;
/**
 * Calculates the margin requirement for a long option.
 * @param spotPrice    margin account balance.
 * @param markPrice    mark price of option from greeks account.
 * @param marginType   type of margin calculation
 */
export declare function calculateLongOptionMargin(spotPrice: number, markPrice: number, marginType: MarginType): number;

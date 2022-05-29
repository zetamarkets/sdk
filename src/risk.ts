import { exchange as Exchange } from "./exchange";
import {
  Kind,
  MarginType,
  MarginRequirement,
  MarginAccountState,
  ProgramAccountType,
} from "./types";
import { ACTIVE_MARKETS } from "./constants";
import { SpreadAccount, MarginAccount } from "./program-types";
import {
  convertNativeBNToDecimal,
  convertNativeLotSizeToDecimal,
} from "./utils";

export class RiskCalculator {
  /**
   * Returns the margin requirements for all markets,
   * indexed by market index.
   */
  public get marginRequirement(): Array<MarginRequirement> {
    return this._marginRequirements;
  }
  private _marginRequirements: Array<MarginRequirement>;

  public constructor() {
    this._marginRequirements = new Array(ACTIVE_MARKETS);
  }

  public updateMarginRequirements() {
    if (Exchange.greeks === undefined || Exchange.oracle === undefined) {
      return;
    }
    let oraclePrice = Exchange.oracle.getPrice("SOL/USD");
    let spotPrice = oraclePrice === null ? 0 : oraclePrice.price;
    for (var i = 0; i < this._marginRequirements.length; i++) {
      this._marginRequirements[i] = calculateProductMargin(i, spotPrice);
    }
  }

  /**
   * Returns the margin requirement for a given market and size.
   * @param productIndex   market index of the product to calculate margin for.
   * @param size           signed integer of size for margin requirements (short orders should be negative)
   * @param marginType     type of margin calculation.
   */
  public getMarginRequirement(
    productIndex: number,
    size: number,
    marginType: MarginType
  ): number {
    if (this._marginRequirements[productIndex] === null) {
      return 0;
    }
    if (size > 0) {
      if (marginType == MarginType.INITIAL) {
        return size * this._marginRequirements[productIndex].initialLong;
      } else {
        return size * this._marginRequirements[productIndex].maintenanceLong;
      }
    } else {
      if (marginType == MarginType.INITIAL) {
        return (
          Math.abs(size) * this._marginRequirements[productIndex].initialShort
        );
      } else {
        return (
          Math.abs(size) *
          this._marginRequirements[productIndex].maintenanceShort
        );
      }
    }
  }

  /**
   * Returns the size of an order that would be considered "opening", when applied to margin requirements.
   * Total intended trade size = closing size + opening size
   * @param size           signed integer of size for margin requirements (short orders should be negative)
   * @param position       signed integer the user's current position for that product (0 if none).
   * @param closingSize    unsigned integer of the user's current closing order quantity for that product (0 if none)
   */
  public calculateOpeningSize(
    size: number,
    position: number,
    closingSize: number
  ): number {
    if ((size > 0 && position > 0) || (size < 0 && position < 0)) {
      return size;
    }
    let closeSize = Math.min(Math.abs(size), Math.abs(position) - closingSize);
    let openingSize = Math.abs(size) - closeSize;
    let sideMultiplier = size >= 0 ? 1 : -1;

    return sideMultiplier * openingSize;
  }

  /**
   * Returns the unrealized pnl for a given margin or spread account.
   * @param account the user's spread or margin account.
   */
  public calculateUnrealizedPnl(
    account: any,
    accountType: ProgramAccountType = ProgramAccountType.MarginAccount
  ): number {
    let pnl = 0;
    for (var i = 0; i < ACTIVE_MARKETS; i++) {
      const position =
        accountType == ProgramAccountType.MarginAccount
          ? account.productLedgers[i].position
          : account.positions[i];
      const size = position.size.toNumber();
      if (size == 0) {
        continue;
      }
      if (size > 0) {
        pnl +=
          convertNativeLotSizeToDecimal(size) *
            convertNativeBNToDecimal(Exchange.greeks.markPrices[i]) -
          convertNativeBNToDecimal(position.costOfTrades);
      } else {
        pnl +=
          convertNativeLotSizeToDecimal(size) *
            convertNativeBNToDecimal(Exchange.greeks.markPrices[i]) +
          convertNativeBNToDecimal(position.costOfTrades);
      }
    }
    return pnl;
  }

  /**
   * Returns the total initial margin requirement for a given account.
   * This inclues initial margin on positions which is used for
   * Place order, Withdrawal and Force Cancels
   * @param marginAccount   the user's MarginAccount.
   */
  public calculateTotalInitialMargin(marginAccount: MarginAccount): number {
    let margin = 0;
    for (var i = 0; i < marginAccount.productLedgers.length; i++) {
      let ledger = marginAccount.productLedgers[i];
      let size = ledger.position.size.toNumber();
      let bidOpenOrders = ledger.orderState.openingOrders[0].toNumber();
      let askOpenOrders = ledger.orderState.openingOrders[1].toNumber();
      if (bidOpenOrders == 0 && askOpenOrders == 0 && size == 0) {
        continue;
      }

      let longLots = convertNativeLotSizeToDecimal(bidOpenOrders);
      let shortLots = convertNativeLotSizeToDecimal(askOpenOrders);

      if (size > 0) {
        longLots += Math.abs(convertNativeLotSizeToDecimal(size));
      } else if (size < 0) {
        shortLots += Math.abs(convertNativeLotSizeToDecimal(size));
      }

      let marginForMarket =
        this.getMarginRequirement(
          i,
          // Positive for buys.
          longLots,
          MarginType.INITIAL
        ) +
        this.getMarginRequirement(
          i,
          // Negative for sells.
          -shortLots,
          MarginType.INITIAL
        );
      if (marginForMarket !== undefined) {
        margin += marginForMarket;
      }
    }
    return margin;
  }

  /**
   * Returns the total maintenance margin requirement for a given account.
   * This only uses maintenance margin on positions and is used for
   * liquidations.
   * @param marginAccount   the user's MarginAccount.
   */
  public calculateTotalMaintenanceMargin(marginAccount: MarginAccount): number {
    let margin = 0;
    for (var i = 0; i < marginAccount.productLedgers.length; i++) {
      let position = marginAccount.productLedgers[i].position;
      let size = position.size.toNumber();
      if (size == 0) {
        continue;
      }
      let positionMargin = this.getMarginRequirement(
        i,
        // This is signed.
        convertNativeLotSizeToDecimal(size),
        MarginType.MAINTENANCE
      );
      if (positionMargin !== undefined) {
        margin += positionMargin;
      }
    }
    return margin;
  }

  /**
   * Returns the total maintenance margin requirement for a given account including orders.
   * This calculates maintenance margin across all positions and orders.
   * This value is used to determine margin when sending a closing order only.
   * @param marginAccount   the user's MarginAccount.
   */
  public calculateTotalMaintenanceMarginIncludingOrders(
    marginAccount: MarginAccount
  ): number {
    let margin = 0;
    for (var i = 0; i < marginAccount.productLedgers.length; i++) {
      let ledger = marginAccount.productLedgers[i];
      let size = ledger.position.size.toNumber();
      let bidOpenOrders = ledger.orderState.openingOrders[0].toNumber();
      let askOpenOrders = ledger.orderState.openingOrders[1].toNumber();
      if (bidOpenOrders == 0 && askOpenOrders == 0 && size == 0) {
        continue;
      }

      let longLots = convertNativeLotSizeToDecimal(bidOpenOrders);
      let shortLots = convertNativeLotSizeToDecimal(askOpenOrders);

      if (size > 0) {
        longLots += Math.abs(convertNativeLotSizeToDecimal(size));
      } else if (size < 0) {
        shortLots += Math.abs(convertNativeLotSizeToDecimal(size));
      }

      let marginForMarket =
        this.getMarginRequirement(
          i,
          // Positive for buys.
          longLots,
          MarginType.MAINTENANCE
        ) +
        this.getMarginRequirement(
          i,
          // Negative for sells.
          -shortLots,
          MarginType.MAINTENANCE
        );
      if (marginForMarket !== undefined) {
        margin += marginForMarket;
      }
    }
    return margin;
  }

  /**
   * Returns the aggregate margin account state.
   * @param marginAccount   the user's MarginAccount.
   */
  public getMarginAccountState(
    marginAccount: MarginAccount
  ): MarginAccountState {
    let balance = convertNativeBNToDecimal(marginAccount.balance);
    let unrealizedPnl = this.calculateUnrealizedPnl(marginAccount);
    let initialMargin = this.calculateTotalInitialMargin(marginAccount);
    let maintenanceMargin = this.calculateTotalMaintenanceMargin(marginAccount);
    let availableBalanceInitial: number =
      balance + unrealizedPnl - initialMargin;
    let availableBalanceMaintenance: number =
      balance + unrealizedPnl - maintenanceMargin;
    return {
      balance,
      initialMargin,
      maintenanceMargin,
      unrealizedPnl,
      availableBalanceInitial,
      availableBalanceMaintenance,
    };
  }
}

// ** Calculation util functions **

/**
 * Calculates the price at which a position will be liquidated.
 * @param accountBalance    margin account balance.
 * @param marginRequirement total margin requirement for margin account.
 * @param unrealizedPnl     unrealized pnl for margin account.
 * @param markPrice         mark price of product being calculated.
 * @param position          signed position size of user.
 */
export function calculateLiquidationPrice(
  accountBalance: number,
  marginRequirement: number,
  unrealizedPnl: number,
  markPrice: number,
  position: number
): number {
  if (position == 0) {
    return 0;
  }
  let availableBalance = accountBalance - marginRequirement + unrealizedPnl;
  return markPrice - availableBalance / position;
}

/**
 * Calculates how much the strike is out of the money.
 * @param kind          product kind (expect CALL/PUT);
 * @param strike        strike of the product.
 * @param spotPrice     price of the spot.
 */
export function calculateOtmAmount(
  kind: Kind,
  strike: number,
  spotPrice: number
): number {
  switch (kind) {
    case Kind.CALL: {
      return Math.max(0, strike - spotPrice);
    }
    case Kind.PUT: {
      return Math.max(0, spotPrice - strike);
    }
    default:
      throw Error("Unsupported kind for OTM amount.");
  }
}

/**
 * Calculates the margin requirement for given market index.
 * @param productIndex  market index of the product.
 * @param spotPrice     price of the spot.
 */
export function calculateProductMargin(
  productIndex: number,
  spotPrice: number
): MarginRequirement {
  let market = Exchange.markets.markets[productIndex];
  if (market.strike == null) {
    return null;
  }
  let kind = market.kind;
  let strike = market.strike;
  let markPrice = convertNativeBNToDecimal(
    Exchange.greeks.markPrices[productIndex]
  );
  switch (kind) {
    case Kind.FUTURE:
      return calculateFutureMargin(spotPrice);
    case Kind.CALL:
    case Kind.PUT:
      return calculateOptionMargin(spotPrice, markPrice, kind, strike);
  }
}

/**
 * Calculates the margin requirement for a future.
 * @param spotPrice     price of the spot.
 */
export function calculateFutureMargin(spotPrice: number): MarginRequirement {
  let initial = spotPrice * Exchange.marginParams.futureMarginInitial;
  let maintenance = spotPrice * Exchange.marginParams.futureMarginMaintenance;
  return {
    initialLong: initial,
    initialShort: initial,
    maintenanceLong: maintenance,
    maintenanceShort: maintenance,
  };
}

/**
 * @param markPrice         mark price of product being calculated.
 * @param spotPrice         spot price of the underlying from oracle.
 * @param strike            strike of the option.
 * @param kind              kind of the option (expect CALL/PUT)
 */
export function calculateOptionMargin(
  spotPrice: number,
  markPrice: number,
  kind: Kind,
  strike: number
): MarginRequirement {
  let otmAmount = calculateOtmAmount(kind, strike, spotPrice);
  let initialLong = calculateLongOptionMargin(
    spotPrice,
    markPrice,
    MarginType.INITIAL
  );
  let initialShort = calculateShortOptionMargin(
    spotPrice,
    otmAmount,
    MarginType.INITIAL
  );
  let maintenanceLong = calculateLongOptionMargin(
    spotPrice,
    markPrice,
    MarginType.MAINTENANCE
  );
  let maintenanceShort = calculateShortOptionMargin(
    spotPrice,
    otmAmount,
    MarginType.MAINTENANCE
  );

  return {
    initialLong,
    initialShort:
      kind == Kind.PUT
        ? Math.min(
            initialShort,
            Exchange.marginParams.optionShortPutCapPercentage * strike
          )
        : initialShort,
    maintenanceLong,
    maintenanceShort:
      kind == Kind.PUT
        ? Math.min(
            maintenanceShort,
            Exchange.marginParams.optionShortPutCapPercentage * strike
          )
        : maintenanceShort,
  };
}

/**
 * Calculates the margin requirement for a short option.
 * @param spotPrice    margin account balance.
 * @param otmAmount    otm amount calculated `from calculateOtmAmount`
 * @param marginType   type of margin calculation
 */
export function calculateShortOptionMargin(
  spotPrice: number,
  otmAmount: number,
  marginType: MarginType
): number {
  let basePercentageShort =
    marginType == MarginType.INITIAL
      ? Exchange.marginParams.optionDynamicPercentageShortInitial
      : Exchange.marginParams.optionDynamicPercentageShortMaintenance;

  let spotPricePercentageShort =
    marginType == MarginType.INITIAL
      ? Exchange.marginParams.optionSpotPercentageShortInitial
      : Exchange.marginParams.optionSpotPercentageShortMaintenance;

  let dynamicMargin = spotPrice * (basePercentageShort - otmAmount / spotPrice);
  let minMargin = spotPrice * spotPricePercentageShort;
  return Math.max(dynamicMargin, minMargin);
}

/**
 * Calculates the margin requirement for a long option.
 * @param spotPrice    margin account balance.
 * @param markPrice    mark price of option from greeks account.
 * @param marginType   type of margin calculation
 */
export function calculateLongOptionMargin(
  spotPrice: number,
  markPrice: number,
  marginType: MarginType
): number {
  let markPercentageLong =
    marginType == MarginType.INITIAL
      ? Exchange.marginParams.optionMarkPercentageLongInitial
      : Exchange.marginParams.optionMarkPercentageLongMaintenance;

  let spotPercentageLong =
    marginType == MarginType.INITIAL
      ? Exchange.marginParams.optionSpotPercentageLongInitial
      : Exchange.marginParams.optionSpotPercentageLongMaintenance;

  return Math.min(
    markPrice * markPercentageLong,
    spotPrice * spotPercentageLong
  );
}

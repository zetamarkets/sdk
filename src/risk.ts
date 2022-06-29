import { exchange as Exchange } from "./exchange";
import * as types from "./types";
import * as constants from "./constants";
import { SpreadAccount, MarginAccount } from "./program-types";
import {
  convertNativeBNToDecimal,
  convertNativeLotSizeToDecimal,
} from "./utils";
import { assetToOracleFeed, Asset, fromProgramAsset } from "./assets";

export class RiskCalculator {
  private _marginRequirements: Map<Asset, Array<types.MarginRequirement>>;

  public constructor(assets: Asset[]) {
    this._marginRequirements = new Map();
    for (var asset of assets) {
      this._marginRequirements.set(asset, new Array(constants.ACTIVE_MARKETS));
    }
  }

  public getMarginRequirements(asset: Asset): Array<types.MarginRequirement> {
    return this._marginRequirements.get(asset);
  }

  public updateMarginRequirements(asset: Asset) {
    if (
      Exchange.getSubExchange(asset).greeks === undefined ||
      Exchange.oracle === undefined
    ) {
      throw Error("Pricing (greeks and/or oracle) is not initialized");
    }
    let oraclePrice = Exchange.oracle.getPrice(assetToOracleFeed(asset));
    let spotPrice = oraclePrice === null ? 0 : oraclePrice.price;
    for (var i = 0; i < this._marginRequirements.get(asset).length; i++) {
      this._marginRequirements.get(asset)[i] = calculateProductMargin(
        asset,
        i,
        spotPrice
      );
    }
  }

  /**
   * Returns the margin requirement for a given market and size.
   * @param asset          underlying asset type.
   * @param productIndex   market index of the product to calculate margin for.
   * @param size           signed integer of size for margin requirements (short orders should be negative)
   * @param marginType     type of margin calculation.
   */
  public getMarginRequirement(
    asset: Asset,
    productIndex: number,
    size: number,
    marginType: types.MarginType
  ): number {
    if (this._marginRequirements.get(asset)[productIndex] === null) {
      return null;
    }
    if (size > 0) {
      if (marginType == types.MarginType.INITIAL) {
        return (
          size * this._marginRequirements.get(asset)[productIndex].initialLong
        );
      } else {
        return (
          size *
          this._marginRequirements.get(asset)[productIndex].maintenanceLong
        );
      }
    } else {
      if (marginType == types.MarginType.INITIAL) {
        return (
          Math.abs(size) *
          this._marginRequirements.get(asset)[productIndex].initialShort
        );
      } else {
        return (
          Math.abs(size) *
          this._marginRequirements.get(asset)[productIndex].maintenanceShort
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
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount
  ): number {
    let pnl = 0;

    for (var i = 0; i < constants.ACTIVE_MARKETS; i++) {
      const position =
        accountType == types.ProgramAccountType.MarginAccount
          ? account.productLedgers[i].position
          : account.positions[i];
      const size = position.size.toNumber();
      if (size == 0) {
        continue;
      }
      let subExchange = Exchange.getSubExchange(
        fromProgramAsset(account.asset)
      );
      if (size > 0) {
        pnl +=
          convertNativeLotSizeToDecimal(size) *
            convertNativeBNToDecimal(subExchange.greeks.markPrices[i]) -
          convertNativeBNToDecimal(position.costOfTrades);
      } else {
        pnl +=
          convertNativeLotSizeToDecimal(size) *
            convertNativeBNToDecimal(subExchange.greeks.markPrices[i]) +
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
    let asset = fromProgramAsset(marginAccount.asset);
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
          asset,
          i,
          // Positive for buys.
          longLots,
          types.MarginType.INITIAL
        ) +
        this.getMarginRequirement(
          asset,
          i,
          // Negative for sells.
          -shortLots,
          types.MarginType.INITIAL
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
   * @param asset           underlying asset type
   * @param marginAccount   the user's MarginAccount.
   */
  public calculateTotalMaintenanceMargin(marginAccount: MarginAccount): number {
    let asset = fromProgramAsset(marginAccount.asset);
    let margin = 0;
    for (var i = 0; i < marginAccount.productLedgers.length; i++) {
      let position = marginAccount.productLedgers[i].position;
      let size = position.size.toNumber();
      if (size == 0) {
        continue;
      }
      let positionMargin = this.getMarginRequirement(
        asset,
        i,
        // This is signed.
        convertNativeLotSizeToDecimal(size),
        types.MarginType.MAINTENANCE
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
   * @param asset           underlying asset type
   * @param marginAccount   the user's MarginAccount.
   */
  public calculateTotalMaintenanceMarginIncludingOrders(
    marginAccount: MarginAccount
  ): number {
    let asset = fromProgramAsset(marginAccount.asset);
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
          asset,
          i,
          // Positive for buys.
          longLots,
          types.MarginType.MAINTENANCE
        ) +
        this.getMarginRequirement(
          asset,
          i,
          // Negative for sells.
          -shortLots,
          types.MarginType.MAINTENANCE
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
  ): types.MarginAccountState {
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
  kind: types.Kind,
  strike: number,
  spotPrice: number
): number {
  switch (kind) {
    case types.Kind.CALL: {
      return Math.max(0, strike - spotPrice);
    }
    case types.Kind.PUT: {
      return Math.max(0, spotPrice - strike);
    }
    default:
      throw Error("Unsupported kind for OTM amount.");
  }
}

/**
 * Calculates the margin requirement for given market index.
 * @param asset         underlying asset (SOL, BTC, etc.)
 * @param productIndex  market index of the product.
 * @param spotPrice     price of the spot.
 */
export function calculateProductMargin(
  asset: Asset,
  productIndex: number,
  spotPrice: number
): types.MarginRequirement {
  let subExchange = Exchange.getSubExchange(asset);
  let market = subExchange.markets.markets[productIndex];
  if (market.strike == null) {
    return null;
  }
  let kind = market.kind;
  let strike = market.strike;
  let markPrice = convertNativeBNToDecimal(
    subExchange.greeks.markPrices[productIndex]
  );
  switch (kind) {
    case types.Kind.FUTURE:
      return calculateFutureMargin(asset, spotPrice);
    case types.Kind.CALL:
    case types.Kind.PUT:
      return calculateOptionMargin(asset, spotPrice, markPrice, kind, strike);
  }
}

/**
 * Calculates the margin requirement for a future.
 * @param asset         underlying asset (SOL, BTC, etc.)
 * @param spotPrice     price of the spot.
 */
export function calculateFutureMargin(
  asset: Asset,
  spotPrice: number
): types.MarginRequirement {
  let subExchange = Exchange.getSubExchange(asset);
  let initial = spotPrice * subExchange.marginParams.futureMarginInitial;
  let maintenance =
    spotPrice * subExchange.marginParams.futureMarginMaintenance;
  return {
    initialLong: initial,
    initialShort: initial,
    maintenanceLong: maintenance,
    maintenanceShort: maintenance,
  };
}

/**
 * @param asset             underlying asset (SOL, BTC, etc.)
 * @param markPrice         mark price of product being calculated.
 * @param spotPrice         spot price of the underlying from oracle.
 * @param strike            strike of the option.
 * @param kind              kind of the option (expect CALL/PUT)
 */
export function calculateOptionMargin(
  asset: Asset,
  spotPrice: number,
  markPrice: number,
  kind: types.Kind,
  strike: number
): types.MarginRequirement {
  let otmAmount = calculateOtmAmount(kind, strike, spotPrice);
  let initialLong = calculateLongOptionMargin(
    asset,
    spotPrice,
    markPrice,
    types.MarginType.INITIAL
  );
  let initialShort = calculateShortOptionMargin(
    asset,
    spotPrice,
    otmAmount,
    types.MarginType.INITIAL
  );
  let maintenanceLong = calculateLongOptionMargin(
    asset,
    spotPrice,
    markPrice,
    types.MarginType.MAINTENANCE
  );
  let maintenanceShort = calculateShortOptionMargin(
    asset,
    spotPrice,
    otmAmount,
    types.MarginType.MAINTENANCE
  );
  let subExchange = Exchange.getSubExchange(asset);
  return {
    initialLong,
    initialShort:
      kind == types.Kind.PUT
        ? Math.min(
            initialShort,
            subExchange.marginParams.optionShortPutCapPercentage * strike
          )
        : initialShort,
    maintenanceLong,
    maintenanceShort:
      kind == types.Kind.PUT
        ? Math.min(
            maintenanceShort,
            subExchange.marginParams.optionShortPutCapPercentage * strike
          )
        : maintenanceShort,
  };
}

/**
 * Calculates the margin requirement for a short option.
 * @param asset        underlying asset (SOL, BTC, etc.)
 * @param spotPrice    margin account balance.
 * @param otmAmount    otm amount calculated `from calculateOtmAmount`
 * @param marginType   type of margin calculation
 */
export function calculateShortOptionMargin(
  asset: Asset,
  spotPrice: number,
  otmAmount: number,
  marginType: types.MarginType
): number {
  let subExchange = Exchange.getSubExchange(asset);
  let basePercentageShort =
    marginType == types.MarginType.INITIAL
      ? subExchange.marginParams.optionDynamicPercentageShortInitial
      : subExchange.marginParams.optionDynamicPercentageShortMaintenance;

  let spotPricePercentageShort =
    marginType == types.MarginType.INITIAL
      ? subExchange.marginParams.optionSpotPercentageShortInitial
      : subExchange.marginParams.optionSpotPercentageShortMaintenance;

  let dynamicMargin = spotPrice * (basePercentageShort - otmAmount / spotPrice);
  let minMargin = spotPrice * spotPricePercentageShort;
  return Math.max(dynamicMargin, minMargin);
}

/**
 * Calculates the margin requirement for a long option.
 * @param asset        underlying asset (SOL, BTC, etc.)
 * @param spotPrice    margin account balance.
 * @param markPrice    mark price of option from greeks account.
 * @param marginType   type of margin calculation
 */
export function calculateLongOptionMargin(
  asset: Asset,
  spotPrice: number,
  markPrice: number,
  marginType: types.MarginType
): number {
  let subExchange = Exchange.getSubExchange(asset);
  let markPercentageLong =
    marginType == types.MarginType.INITIAL
      ? subExchange.marginParams.optionMarkPercentageLongInitial
      : subExchange.marginParams.optionMarkPercentageLongMaintenance;

  let spotPercentageLong =
    marginType == types.MarginType.INITIAL
      ? subExchange.marginParams.optionSpotPercentageLongInitial
      : subExchange.marginParams.optionSpotPercentageLongMaintenance;

  return Math.min(
    markPrice * markPercentageLong,
    spotPrice * spotPercentageLong
  );
}

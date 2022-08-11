import { exchange as Exchange } from "./exchange";
import * as types from "./types";
import * as constants from "./constants";
import {
  SpreadAccount,
  MarginAccount,
  ZetaGroup,
  Position,
  ProductLedger,
  PositionMovementEvent,
} from "./program-types";
import {
  convertDecimalToNativeInteger,
  convertNativeBNToDecimal,
  convertNativeLotSizeToDecimal,
} from "./utils";
import { Asset, fromProgramAsset } from "./assets";
import { BN } from "@project-serum/anchor";
import { assets, Client, instructions, utils } from ".";
import { cloneDeep } from "lodash";

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
    let oraclePrice = Exchange.oracle.getPrice(asset);
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
   * This includes initial margin on positions which is used for
   * Place order, withdrawal and force cancels
   * @param marginAccount   the user's MarginAccount.
   */
  public calculateTotalInitialMargin(marginAccount: MarginAccount): number {
    let asset = fromProgramAsset(marginAccount.asset);
    let marketMaker = types.isMarketMaker(marginAccount);
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

      if (!marketMaker) {
        if (size > 0) {
          longLots += Math.abs(convertNativeLotSizeToDecimal(size));
        } else if (size < 0) {
          shortLots += Math.abs(convertNativeLotSizeToDecimal(size));
        }
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

      if (marketMaker) {
        // Mark initial margin to concession (only contains open order margin).
        marginForMarket *= Exchange.state.marginConcessionPercentage / 100;
        // Add position margin which doesn't get concessions.
        marginForMarket += this.getMarginRequirement(
          asset,
          i,
          // This is signed.
          convertNativeLotSizeToDecimal(size),
          types.MarginType.MAINTENANCE
        );
      }

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

  public async calculatePositionMovement(
    user: Client,
    asset: Asset,
    movementType: types.MovementType,
    movements: instructions.PositionMovementArg[]
  ): Promise<PositionMovementEvent> {
    if (movements.length > constants.MAX_POSITION_MOVEMENTS)
      throw Error("Exceeded max position movements.");
    let marginAccount = user.getMarginAccount(asset);
    let spreadAccount = user.getSpreadAccount(asset);

    if (spreadAccount === null) {
      let positions = [];
      let positionsPadding = [];
      let seriesExpiry = [];
      for (let i = 0; i < 46; i++) {
        positions.push({
          size: new BN(0),
          costOfTrades: new BN(0),
        });
      }
      for (let i = 0; i < 92; i++) {
        positionsPadding.push({
          size: new BN(0),
          costOfTrades: new BN(0),
        });
      }
      for (let i = 0; i < 6; i++) {
        seriesExpiry.push(new BN(0));
      }

      spreadAccount = {
        authority: marginAccount.authority,
        nonce: 0,
        balance: new BN(0),
        seriesExpiry,
        positions,
        positionsPadding,
        asset: assets.toProgramAsset(asset),
        padding: new Array(262).fill(0),
      };
    }

    // Copy account objects to perform simulated position movement
    let simulatedMarginAccount = cloneDeep(marginAccount);
    let simulatedSpreadAccount = cloneDeep(spreadAccount);

    let nativeSpot = utils.convertDecimalToNativeInteger(
      await Exchange.oracle.fetchPrice(Exchange.getZetaGroup(asset).oracle)
    );

    // Perform movement by movement type onto new margin and spread accounts
    movePositions(
      Exchange.getZetaGroup(asset),
      simulatedSpreadAccount,
      simulatedMarginAccount,
      movementType,
      movements
    );

    // Calculate margin requirements for new margin and spread accounts
    // Calculate margin requirements for old margin and spread accounts
    let totalContracts = 0;
    for (let i = 0; i < movements.length; i++) {
      totalContracts = totalContracts + Math.abs(movements[i].size.toNumber());
    }
    let movementNotional = calculateNormalizedCostOfTrades(
      nativeSpot,
      totalContracts
    );
    let movementFees =
      (movementNotional / constants.BPS_DENOMINATOR) *
      Exchange.state.positionMovementFeeBps;
    simulatedMarginAccount.balance = new BN(
      simulatedMarginAccount.balance.toNumber() - movementFees
    );
    simulatedMarginAccount.rebalanceAmount = new BN(
      simulatedMarginAccount.rebalanceAmount.toNumber() + movementFees
    );

    if (!checkMarginAccountMarginRequirement(simulatedMarginAccount))
      throw Error("Failed maintenance margin requirement.");

    // Temporarily add limitation for maximum contracts locked as a safety.
    // Set to 100k total contracts for now.
    totalContracts = 0;
    for (let i = 0; i < simulatedSpreadAccount.positions.length; i++) {
      totalContracts =
        totalContracts +
        Math.abs(simulatedSpreadAccount.positions[i].size.toNumber());
    }

    if (totalContracts > constants.MAX_TOTAL_SPREAD_ACCOUNT_CONTRACTS)
      throw Error("Exceeded max spread account contracts.");

    let netTransfer =
      simulatedSpreadAccount.balance.toNumber() -
      spreadAccount.balance.toNumber();

    return {
      netBalanceTransfer: new BN(netTransfer),
      marginAccountBalance: simulatedMarginAccount.balance,
      spreadAccountBalance: simulatedSpreadAccount.balance,
      movementFees: new BN(movementFees),
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

function calculateSpreadMarginRequirements(
  strikes: number[],
  positions: Position[]
) {
  if (strikes.length !== constants.NUM_STRIKES) return;
  // Structure the strikes as such [0, s0, s1, ..., sN-1]
  // with 0 being the 0 strike call (future).
  let adjustedStrikes = new Array(constants.NUM_STRIKES + 1).fill(0);
  for (let i = 0; i < constants.NUM_STRIKES; i++) {
    if (strikes[i] === null) continue;
    adjustedStrikes[i + 1] = strikes[i];
  }

  let callPositions = positions.slice(0, constants.NUM_STRIKES);
  let putPositions = positions.slice(
    constants.NUM_STRIKES,
    constants.NUM_STRIKES * 2
  );
  let futurePosition = positions[constants.SERIES_FUTURE_INDEX].size.toNumber();

  let cumCallPnl = calculateCallCumPnl(
    adjustedStrikes,
    callPositions,
    futurePosition
  );
  let cumPutPnl = calculatePutCumPnl(adjustedStrikes, putPositions);
  let totalPositionPnl = new Array(constants.NUM_STRIKES + 1).fill(0);

  for (let i = 0; i < cumCallPnl.length; i++) {
    totalPositionPnl[i] = cumCallPnl[i] + cumPutPnl[i];
  }

  let minPositionPnl = Math.min(...totalPositionPnl);
  let totalCostOfTrades = 0;
  for (let i = 0; i < positions.length; i++) {
    totalCostOfTrades +=
      positions[i].size.toNumber() > 0
        ? positions[i].costOfTrades.toNumber()
        : -positions[i].costOfTrades.toNumber();
  }

  return Math.abs(Math.min(minPositionPnl - totalCostOfTrades, 0));
}

function calculateCallCumPnl(
  strikes: number[],
  callPositions: Position[],
  futurePosition: number
) {
  let cumCallPositions = new Array(constants.NUM_STRIKES + 1).fill(0);
  let cumCallPnl = new Array(constants.NUM_STRIKES + 1).fill(0);
  cumCallPositions[0] = futurePosition;
  for (let i = 0; i < constants.NUM_STRIKES; i++) {
    cumCallPositions[i + 1] =
      callPositions[i].size.toNumber() + cumCallPositions[i];
    let strikeDiff = strikes[i + 1] - strikes[i];
    // The incremental change in pnl is the cumulative position from the previous index
    // multiplied by the difference in strike price
    let pnlDelta = calculateSignedCostOfTrades(strikeDiff, cumCallPositions[i]);
    cumCallPnl[i + 1] = cumCallPnl[i] + pnlDelta;
  }

  if (cumCallPositions[constants.NUM_STRIKES] < 0) {
    throw Error("Naked short call is not allowed.");
  }
  return cumCallPnl;
}

export function calculatePutCumPnl(
  strikes: number[],
  putPositions: Position[]
) {
  let cumPutPositions = new Array(constants.NUM_STRIKES + 1).fill(0);
  let cumPutPnl = new Array(constants.NUM_STRIKES + 1).fill(0);
  cumPutPositions[constants.NUM_STRIKES] =
    putPositions[constants.NUM_STRIKES - 1].size.toNumber();
  for (let i = constants.NUM_STRIKES - 1; i >= 0; i--) {
    let positionSize = i === 0 ? 0 : putPositions[i - 1].size.toNumber();
    cumPutPositions[i] = positionSize + cumPutPositions[i + 1];
    let strikeDiff = strikes[i + 1] - strikes[i];
    // The incremental change in pnl is the cumulative position from the previous index
    // multiplied by the difference in strike price
    let pnlDelta = calculateSignedCostOfTrades(
      strikeDiff,
      cumPutPositions[i + 1]
    );
    cumPutPnl[i] = cumPutPnl[i + 1] + pnlDelta;
  }
  return cumPutPnl;
}

function calculateSpreadAccountMarginRequirement(
  spreadAccount: SpreadAccount,
  zetaGroup: ZetaGroup
) {
  let marginRequirement = 0;
  for (let i = 0; i < zetaGroup.expirySeries.length; i++) {
    // Skip if strikes are uninitialised
    if (!zetaGroup.products[i].strike.isSet) {
      continue;
    }
    let strikes = Exchange.getSubExchange(
      assets.fromProgramAsset(zetaGroup.asset)
    )
      .markets.getStrikesByExpiryIndex(i)
      // Convert to native integer, as all calculations are worked in native size
      .map((strike) => convertDecimalToNativeInteger(strike));
    let positions = getPositionsByExpiryIndexforSpreadAccount(spreadAccount, i);
    marginRequirement =
      marginRequirement + calculateSpreadMarginRequirements(strikes, positions);
  }

  return marginRequirement;
}

function getPositionsByExpiryIndexforSpreadAccount(
  spreadAccount: SpreadAccount,
  expiryIndex: number
): Position[] {
  let head = expiryIndex * constants.PRODUCTS_PER_EXPIRY;
  return spreadAccount.positions.slice(
    head,
    head + constants.PRODUCTS_PER_EXPIRY
  );
}

function checkMarginAccountMarginRequirement(marginAccount: MarginAccount) {
  let pnl = Exchange.riskCalculator.calculateUnrealizedPnl(
    marginAccount,
    types.ProgramAccountType.MarginAccount
  );
  let totalMaintenanceMargin =
    Exchange.riskCalculator.calculateTotalMaintenanceMargin(marginAccount);
  let buffer = marginAccount.balance.toNumber() + pnl - totalMaintenanceMargin;
  return buffer > 0;
}

function movePositions(
  zetaGroup: ZetaGroup,
  spreadAccount: SpreadAccount,
  marginAccount: MarginAccount,
  movementType: types.MovementType,
  movements: instructions.PositionMovementArg[]
) {
  for (let i = 0; i < movements.length; i++) {
    let size = movements[i].size.toNumber();
    let index = movements[i].index;
    if (size === 0 || index >= constants.ACTIVE_MARKETS) {
      throw Error("Invalid movement.");
    }

    if (movementType === types.MovementType.LOCK) {
      lockMarginAccountPosition(marginAccount, spreadAccount, index, size);
    } else if (movementType === types.MovementType.UNLOCK) {
      unlockSpreadAccountPosition(marginAccount, spreadAccount, index, size);
    } else {
      throw Error("Invalid movement type.");
    }
  }

  let spreadMarginRequirements = calculateSpreadAccountMarginRequirement(
    spreadAccount,
    zetaGroup
  );

  if (spreadMarginRequirements > spreadAccount.balance.toNumber()) {
    let diff = spreadMarginRequirements - spreadAccount.balance.toNumber();
    if (diff > marginAccount.balance.toNumber()) {
      throw Error("Insufficient funds to collateralize spread account.");
    }
    // Move funds from margin to spread.
    spreadAccount.balance = new BN(spreadAccount.balance.toNumber() + diff);
    marginAccount.balance = new BN(marginAccount.balance.toNumber() - diff);
  } else if (spreadMarginRequirements < spreadAccount.balance.toNumber()) {
    let diff = spreadAccount.balance.toNumber() - spreadMarginRequirements;
    // Move funds from spread to margin.
    spreadAccount.balance = new BN(spreadAccount.balance.toNumber() - diff);
    marginAccount.balance = new BN(marginAccount.balance.toNumber() + diff);
  }
}

function unlockSpreadAccountPosition(
  marginAccount: MarginAccount,
  spreadAccount: SpreadAccount,
  index: number,
  size: number
) {
  let position = spreadAccount.positions[index];
  let costOfTrades = moveSize(position, size);
  handleExecutionCostOfTrades(marginAccount, index, size, costOfTrades, false);
}

export function handleExecutionCostOfTrades(
  marginAccount: MarginAccount,
  index: number,
  size: number,
  costOfTrades: number,
  orderbook: boolean
) {
  if (size === 0) {
    if (costOfTrades !== 0)
      throw Error("Cost of trades must be greater than zero.");
    return;
  }
  let ledger = marginAccount.productLedgers[index];
  let [openSize, closeSize] = getExecutionOpenCloseSize(
    ledger.position.size.toNumber(),
    size
  );
  let sideIndex = size > 0 ? 0 : 1;

  if (orderbook) {
    ledger.orderState.closingOrders = new BN(
      ledger.orderState.closingOrders.toNumber() - closeSize
    );
    ledger.orderState.openingOrders[sideIndex] = new BN(
      ledger.orderState.openingOrders[sideIndex].toNumber() - openSize
    );
  }

  let [openCostOfTrades, closeCostOfTrades] = getOpenCloseCostOfTrades(
    openSize,
    closeSize,
    costOfTrades
  );
  let signedOpenSize = size >= 0 ? openSize : -openSize;
  resetClosingOrders(ledger);

  closePosition(ledger.position, marginAccount, closeSize, closeCostOfTrades);

  openPosition(ledger.position, signedOpenSize, openCostOfTrades);
  rebalanceOrders(ledger);
}

function lockMarginAccountPosition(
  marginAccount: MarginAccount,
  spreadAccount: SpreadAccount,
  index: number,
  size: number
) {
  let ledger = marginAccount.productLedgers[index];
  resetClosingOrders(ledger);
  let costOfTrades = moveSize(ledger.position, size);
  rebalanceOrders(ledger);
  lockSpreadAccountPosition(spreadAccount, index, size, costOfTrades);
}

function rebalanceOrders(ledger: ProductLedger) {
  if (
    ledger.orderState.closingOrders.toNumber() !== 0 ||
    ledger.position.size.toNumber() === 0
  )
    return;

  // If long, closing order size are asks
  // If short, closing order size are bids
  let index =
    ledger.position.size.toNumber() > 0
      ? constants.ASK_ORDERS_INDEX
      : constants.BID_ORDERS_INDEX;
  ledger.orderState.closingOrders = new BN(
    Math.min(
      Math.abs(ledger.position.size.toNumber()),
      ledger.orderState.openingOrders[index].toNumber()
    )
  );
  ledger.orderState.openingOrders[index] = new BN(
    ledger.orderState.openingOrders[index].toNumber() -
      ledger.orderState.closingOrders.toNumber()
  );
}

/// Moves closing orders to the respective opening orders.
/// To be called before executing or moving positions.
/// `rebalance_orders` should be called after executing.
function resetClosingOrders(ledger: ProductLedger) {
  if (
    ledger.orderState.closingOrders.toNumber() === 0 ||
    ledger.position.size.toNumber() === 0
  )
    return;
  // If long, closing order size are asks
  // If short, closing order size are bids
  let index =
    ledger.position.size.toNumber() > 0
      ? constants.ASK_ORDERS_INDEX
      : constants.BID_ORDERS_INDEX;
  ledger.orderState.openingOrders[index] = new BN(
    ledger.orderState.openingOrders[index].toNumber() +
      ledger.orderState.closingOrders.toNumber()
  );
  ledger.orderState.closingOrders = new BN(0);
}

function moveSize(position: Position, size: number) {
  if (size === 0) return 0;
  if (
    (size > 0 && position.size.toNumber() < size) ||
    (size < 0 && position.size.toNumber() > size)
  ) {
    throw Error("Invalid movement size.");
  }
  let costOfTrades;
  if (size === position.size.toNumber()) {
    costOfTrades = position.costOfTrades;
    position.costOfTrades = new BN(0);
    position.size = new BN(0);
  } else {
    costOfTrades = prorataCostOfTrades(position, Math.abs(size));
    // larger (-ve) minus smaller (-ve) or larger (+ve) minus larger (+ve) -> 0
    position.size = new BN(position.size.toNumber() - size);
    position.costOfTrades = new BN(
      position.costOfTrades.toNumber() - costOfTrades
    );
  }

  return costOfTrades;
}

export function lockSpreadAccountPosition(
  spreadAccount: SpreadAccount,
  index: number,
  size: number,
  costOfTrades: number
) {
  let position = spreadAccount.positions[index];
  let [openSize, closeSize] = getExecutionOpenCloseSize(
    position.size.toNumber(),
    size
  );
  // Prorata cost of trades here.
  let [openCostOfTrades, closeCostOfTrades] = getOpenCloseCostOfTrades(
    openSize,
    closeSize,
    costOfTrades
  );

  closePosition(position, spreadAccount, closeSize, closeCostOfTrades);
  let signedOpenSize = size >= 0 ? openSize : -openSize;
  openPosition(position, signedOpenSize, openCostOfTrades);
}

function getExecutionOpenCloseSize(
  positionSize: number,
  executionSize: number
) {
  // If is opening size
  if (
    (executionSize > 0 && positionSize >= 0) ||
    (executionSize < 0 && positionSize <= 0)
  ) {
    return [Math.abs(executionSize), 0];
  }
  let executionSizeAbs = Math.abs(executionSize);
  let closeSize = Math.min(executionSizeAbs, Math.abs(positionSize));
  let openSize = executionSizeAbs - closeSize;

  return [openSize, closeSize];
}

function getOpenCloseCostOfTrades(
  openSize: number,
  closeSize: number,
  costOfTrades: number
) {
  let size = openSize + closeSize;
  let closeCostOfTrades;
  let openCostOfTrades;
  if (openSize === 0) {
    openCostOfTrades = 0;
    closeCostOfTrades = costOfTrades;
  } else {
    closeCostOfTrades = (costOfTrades / size) * closeSize;
    openCostOfTrades = costOfTrades - closeCostOfTrades;
  }
  return [openCostOfTrades, closeCostOfTrades];
}

function openPosition(position: Position, size: number, costOfTrades: number) {
  if (size === 0 || costOfTrades === 0) return;

  // Assert same side
  if (
    (size > 0 && position.size.toNumber() < 0) ||
    (size < 0 && position.size.toNumber() > 0)
  )
    return;

  position.size = new BN(position.size.toNumber() + size);
  position.costOfTrades = new BN(
    position.costOfTrades.toNumber() + costOfTrades
  );
}

function closePosition(
  position: Position,
  account: SpreadAccount | MarginAccount,
  size: number,
  executionCostOfTrades: number
) {
  if (size === 0) return;
  let positionSizeAbs = Math.abs(position.size.toNumber());
  // Cannot close more than your position
  if (size > positionSizeAbs) return;

  let fullClose = size === positionSizeAbs;
  let closedCostOfTrades = prorataCostOfTrades(position, size);
  /*
   * Cases:
   * 1. Closing long position
   * - Profitable if execution COT > closed COT (bought for more than purchase)
   * - Loss if execution COT < closed COT (Sold for less than purchase)
   * 2. Closing short position
   * - Profitable if execution COT < closed COT (bought back for less than sold)
   * - Loss if execution COT > closed COT (bought back for more than sold)
   */
  let [profitable, balanceDelta] =
    closedCostOfTrades >= executionCostOfTrades
      ? [
          position.size.toNumber() < 0,
          closedCostOfTrades - executionCostOfTrades,
        ]
      : [
          position.size.toNumber() > 0,
          executionCostOfTrades - closedCostOfTrades,
        ];

  if (profitable) {
    account.balance = new BN(account.balance.toNumber() + balanceDelta);
  } else {
    account.balance = new BN(account.balance.toNumber() - balanceDelta);
  }

  if (position.size.toNumber() > 0) {
    position.size = new BN(position.size.toNumber() - size);
  } else {
    position.size = new BN(position.size.toNumber() + size);
  }

  // Closed_cost_of_trades may have small rounding error.
  if (fullClose) {
    position.costOfTrades = new BN(0);
  } else {
    position.costOfTrades = new BN(
      position.costOfTrades.toNumber() - closedCostOfTrades
    );
  }
}

function prorataCostOfTrades(position: Position, size: number) {
  let sizeAbs = Math.abs(position.size.toNumber());
  if (size === sizeAbs) {
    return position.costOfTrades.toNumber();
  } else {
    // TODO: Double check division of BN -> numbers
    return Math.floor(position.costOfTrades.toNumber() / sizeAbs) * size;
  }
}

function calculateSignedCostOfTrades(price: number, size: number): number {
  return (price * size) / Math.pow(10, constants.POSITION_PRECISION);
}

function calculateNormalizedCostOfTrades(price: number, size: number): number {
  return Math.abs(price * size) / Math.pow(10, constants.POSITION_PRECISION);
}

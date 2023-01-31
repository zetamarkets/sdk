import { BN } from "@zetamarkets/anchor";
import { types, Exchange, constants, assets, instructions } from ".";
import { Asset } from "./assets";
import {
  Position,
  SpreadAccount,
  ZetaGroup,
  MarginAccount,
  ProductLedger,
} from "./program-types";
import {
  convertNativeBNToDecimal,
  convertDecimalToNativeInteger,
  getProductLedger,
} from "./utils";

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
  let market = Exchange.getMarket(asset, productIndex);
  if (market.strike == null) {
    return null;
  }
  let kind = market.kind;
  let strike = market.strike;

  switch (kind) {
    case types.Kind.FUTURE:
      return calculateFutureMargin(asset, spotPrice);
    case types.Kind.CALL:
    case types.Kind.PUT:
      return calculateOptionMargin(
        asset,
        spotPrice,
        convertNativeBNToDecimal(subExchange.greeks.markPrices[productIndex]),
        kind,
        strike
      );
    case types.Kind.PERP:
      return calculatePerpMargin(asset, spotPrice);
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
 * Calculates the margin requirement for a perp.
 * @param asset         underlying asset (SOL, BTC, etc.)
 * @param spotPrice     price of the spot.
 */
export function calculatePerpMargin(
  asset: Asset,
  spotPrice: number
): types.MarginRequirement {
  return calculateFutureMargin(asset, spotPrice);
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

export function calculateSpreadAccountMarginRequirement(
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

/**
 * Note: BN maths below are achieved through a BN -> number -> BN method.
 * If overflow errors occur, change this in future to pure BN math.
 */

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

export function checkMarginAccountMarginRequirement(
  marginAccount: MarginAccount
) {
  let pnl = Exchange.riskCalculator.calculateUnrealizedPnl(
    marginAccount,
    types.ProgramAccountType.MarginAccount
  );
  let totalMaintenanceMargin =
    Exchange.riskCalculator.calculateTotalMaintenanceMargin(marginAccount);
  let buffer = marginAccount.balance.toNumber() + pnl - totalMaintenanceMargin;
  return buffer > 0;
}

export function movePositions(
  zetaGroup: ZetaGroup,
  spreadAccount: SpreadAccount,
  marginAccount: MarginAccount,
  movementType: types.MovementType,
  movements: instructions.PositionMovementArg[]
) {
  for (let i = 0; i < movements.length; i++) {
    let size = movements[i].size.toNumber();
    let index = movements[i].index;
    if (size === 0 || index >= constants.ACTIVE_MARKETS - 1) {
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
    if (costOfTrades !== 0) {
      throw Error("Cost of trades must be greater than zero.");
    }
    return;
  }
  let ledger = getProductLedger(marginAccount, index);
  let [openSize, closeSize] = getExecutionOpenCloseSize(
    ledger.position.size.toNumber(),
    size
  );
  let sideIndex =
    size > 0 ? constants.BID_ORDERS_INDEX : constants.ASK_ORDERS_INDEX;

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
  let ledger = getProductLedger(marginAccount, index);
  resetClosingOrders(ledger);
  let costOfTrades = moveSize(ledger.position, size);
  rebalanceOrders(ledger);
  lockSpreadAccountPosition(spreadAccount, index, size, costOfTrades);
}

function rebalanceOrders(ledger: ProductLedger) {
  if (
    ledger.orderState.closingOrders.toNumber() !== 0 ||
    ledger.position.size.toNumber() === 0
  ) {
    return;
  }

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
  ) {
    return;
  }

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
    return Math.floor(position.costOfTrades.toNumber() / sizeAbs) * size;
  }
}

function calculateSignedCostOfTrades(price: number, size: number): number {
  return Math.floor(
    (price * size) / Math.pow(10, constants.POSITION_PRECISION)
  );
}

export function calculateNormalizedCostOfTrades(
  price: number,
  size: number
): number {
  return Math.floor(
    Math.abs(price * size) / Math.pow(10, constants.POSITION_PRECISION)
  );
}

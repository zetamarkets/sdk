import { BN } from "@zetamarkets/anchor";
import { types, Exchange, constants, assets } from ".";
import { Asset } from "./constants";
import {
  Position,
  SpreadAccount,
  MarginAccount,
  ProductLedger,
} from "./program-types";
import { getProductLedger, convertNativeBNToDecimal } from "./utils";

export function collectRiskMaps(
  imMap: Map<Asset, Number>,
  imSCMap: Map<Asset, Number>,
  mmMap: Map<Asset, Number>,
  mmioMap: Map<Asset, Number>,
  upnlMap: Map<Asset, Number>,
  unpaidFundingMap: Map<Asset, Number>
): Map<Asset, types.AssetRiskState> {
  let allAssets = assets.allAssets();
  let collectedRiskState = new Map();
  for (let a of allAssets) {
    collectedRiskState.set(a, {
      initialMargin: imMap.get(a),
      initialMarginSkipConcession: imSCMap.get(a),
      maintenanceMargin: mmMap.get(a),
      maintenanceMarginIncludingOrders: mmioMap.get(a),
      unrealizedPnl: upnlMap.get(a),
      unpaidFunding: unpaidFundingMap.get(a),
    });
  }
  return collectedRiskState;
}

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
 * @param spotPrice     price of the spot.
 */
export function calculateProductMargin(
  asset: Asset,
  spotPrice: number
): types.MarginRequirement {
  let market = Exchange.getPerpMarket(asset);
  if (market.strike == null) {
    return null;
  }
  let kind = market.kind;

  switch (kind) {
    case types.Kind.PERP:
      return calculatePerpMargin(asset, spotPrice);
    default:
      throw Error("Non-perp not supported");
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
  let assetIndex = assets.assetToIndex(asset);
  let initial =
    spotPrice *
    convertNativeBNToDecimal(
      Exchange.pricing.marginParameters[assetIndex].futureMarginInitial,
      constants.MARGIN_PRECISION
    );
  let maintenance =
    spotPrice *
    convertNativeBNToDecimal(
      Exchange.pricing.marginParameters[assetIndex].futureMarginMaintenance,
      constants.MARGIN_PRECISION
    );
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

export function checkMarginAccountMarginRequirement(
  marginAccount: MarginAccount
) {
  let pnl = Exchange.riskCalculator.calculateUnrealizedPnl(
    marginAccount,
    types.ProgramAccountType.MarginAccount
  );
  let totalMaintenanceMargin =
    Exchange.riskCalculator.calculateTotalMaintenanceMargin(
      marginAccount,
      types.ProgramAccountType.MarginAccount
    ) as number;
  let buffer = marginAccount.balance.toNumber() + pnl - totalMaintenanceMargin;
  return buffer > 0;
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

import { types, Exchange, constants, assets } from ".";
import { Asset } from "./constants";
import { MarginAccount } from "./program-types";
import { convertNativeBNToDecimal } from "./utils";

/**
 * Assemble a collected risk state Map<Asset, types.AssetRiskState>, describing important values on a per-asset basis.
 * This is used getCrossMarginAccountState() and you probably don't need to be accessing it directly.
 * @param imMap Initial margins map
 * @param imSCMap Initial margins (skip concession) map
 * @param mmMap Maintenance margins map
 * @param mmioMap Maintenance margins (including orders) map
 * @param upnlMap Unrealised PnL map
 * @param unpaidFundingMap Unpaid funding map
 * @returns map of AssetRiskStates for each asset
 */
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
 * @param accountBalance    margin account balance in decimal USDC
 * @param marginRequirement total margin requirement for margin account, in decimal USDC
 * @param unrealizedPnl     signed unrealized pnl for margin account, in decimal USDC
 * @param markPrice         mark price of product being calculated, in decimal USDC
 * @param position          signed position size of user, in decimal USDC
 * @returns Liquidation price, in decimal USDC
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
 * Calculates the margin requirement for a given market.
 * @param asset         underlying asset (SOL, BTC, etc.)
 * @param spotPrice     price of the spot, in decimal USDC
 * @returns Margin in decimal USDC
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
 * Calculates the margin requirement for a given market.
 * @param asset         underlying asset (SOL, BTC, etc.)
 * @param spotPrice     price of the spot, in decimal USDC
 * @returns Margin in decimal USDC
 */
export function calculatePerpMargin(
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
 * Checks whether a given account has enough maintenance margin. If not, it may be liquidated.
 * @param marginAccount The MarginAccount itself.
 * @returns Whether the account has enough maintenance margin.
 */
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

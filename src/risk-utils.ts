import { types, Exchange, constants, assets } from ".";
import { Asset } from "./constants";
import { CrossMarginAccount, MarginAccount } from "./program-types";
import {
  convertDecimalToNativeInteger,
  convertDecimalToNativeLotSize,
  convertNativeBNToDecimal,
  convertNativeLotSizeToDecimal,
  getFeeBps,
} from "./utils";
import cloneDeep from "lodash.clonedeep";
import * as anchor from "@zetamarkets/anchor";

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
  unpaidFundingMap: Map<Asset, Number>,
  potentialOrderLossMap: Map<Asset, Number>
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
      potentialOrderLoss: potentialOrderLossMap.get(a),
    });
  }
  return collectedRiskState;
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
  return calculatePerpMargin(asset, spotPrice);
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

/**
 * Simulate adding an extra position/order into an existing CrossMarginAccount.
 * This will change the account! Therefore do a deep clone first if you want a new account to simulate.
 * @param marginAccount The CrossMarginAccount itself
 * @param isTaker Whether or not the order crosses the orderbook in full and becomes a position
 * @param asset The market on which we're trading
 * @param side Bid or ask
 * @param price The trade price, in decimal USDC
 * @param size The trade size, in decimal USDC (absolute value, so it must be > 0)
 */
export function addFakeTradeToAccount(
  marginAccount: CrossMarginAccount,
  isTaker: boolean,
  asset: constants.Asset,
  side: types.Side,
  price: number,
  size: number
) {
  let assetIndex = assets.assetToIndex(asset);
  let editedPosition = marginAccount.productLedgers[assetIndex].position;
  let editedOrderState = marginAccount.productLedgers[assetIndex].orderState;
  let markPrice = Exchange.getMarkPrice(asset);

  let fee = (getFeeBps(isTaker, marginAccount.accountType) / 10000) * price;

  let sizeNative = convertDecimalToNativeLotSize(size);
  let currentSizeBN = editedPosition.size;
  let currentSize = currentSizeBN.toNumber();
  // Fake the new position, moving both editedPosition and editedOrderState
  if (isTaker) {
    editedPosition.size = editedPosition.size.add(
      new anchor.BN(side == types.Side.BID ? sizeNative : -sizeNative)
    );
    marginAccount.balance = marginAccount.balance.sub(
      new anchor.BN(convertDecimalToNativeInteger(fee * size, 1))
    );

    // If we're just adding to costOfTrades
    if (
      (side == types.Side.BID && currentSize > 0) ||
      (side == types.Side.ASK && currentSize < 0)
    ) {
      editedPosition.costOfTrades = editedPosition.costOfTrades.add(
        new anchor.BN(size * convertDecimalToNativeInteger(price, 1))
      );

      let openIndex = side == types.Side.BID ? 1 : 0;
      let diff = anchor.BN.min(
        editedOrderState.openingOrders[openIndex],
        new anchor.BN(sizeNative)
      );
      editedOrderState.closingOrders = editedOrderState.closingOrders.add(diff);
      editedOrderState.openingOrders[openIndex] =
        editedOrderState.openingOrders[openIndex].sub(diff);
    }
    // If we're just reducing the current position
    else if (sizeNative < Math.abs(currentSize)) {
      let entryPrice = new anchor.BN(
        editedPosition.costOfTrades.toNumber() /
          convertNativeLotSizeToDecimal(Math.abs(currentSize))
      );
      let priceDiff = entryPrice.sub(
        new anchor.BN(convertDecimalToNativeInteger(price, 1))
      );

      let sizeMul = side == types.Side.BID ? size : -1 * size;

      marginAccount.balance = marginAccount.balance.add(
        new anchor.BN(sizeMul * priceDiff.toNumber())
      );

      editedPosition.costOfTrades = editedPosition.costOfTrades.sub(
        editedPosition.costOfTrades
          .mul(new anchor.BN(sizeNative))
          .div(currentSizeBN.abs())
      );

      let openIndex = side == types.Side.BID ? 0 : 1;
      let diff = anchor.BN.min(
        editedOrderState.closingOrders,
        new anchor.BN(sizeNative)
      );
      editedOrderState.closingOrders = editedOrderState.closingOrders.sub(diff);
      editedOrderState.openingOrders[openIndex] =
        editedOrderState.openingOrders[openIndex].add(diff);
    }
    // If we're zeroing out the current position and opening a position on the other side
    else {
      if (Math.abs(currentSize) > 0) {
        let entryPrice = new anchor.BN(
          editedPosition.costOfTrades.toNumber() /
            convertNativeLotSizeToDecimal(Math.abs(currentSize))
        );
        let priceDiff = entryPrice.sub(
          new anchor.BN(convertDecimalToNativeInteger(price, 1))
        );
        marginAccount.balance = marginAccount.balance.add(
          new anchor.BN(
            side == types.Side.BID
              ? convertNativeLotSizeToDecimal(currentSizeBN.abs())
              : -convertNativeLotSizeToDecimal(currentSizeBN.abs())
          ).mul(priceDiff)
        );
      }

      editedPosition.costOfTrades = new anchor.BN(
        convertNativeLotSizeToDecimal(
          Math.abs(editedPosition.size.toNumber())
        ) * convertDecimalToNativeInteger(price, 1)
      );

      let sameSide = side == types.Side.BID ? 0 : 1;
      let otherSide = side == types.Side.BID ? 1 : 0;
      editedOrderState.openingOrders[sameSide] = editedOrderState.openingOrders[
        sameSide
      ].add(editedOrderState.closingOrders);

      editedOrderState.closingOrders = anchor.BN.max(
        editedOrderState.openingOrders[otherSide].sub(
          editedPosition.size.abs()
        ),
        new anchor.BN(0)
      );

      editedOrderState.openingOrders[otherSide] =
        editedOrderState.openingOrders[otherSide].sub(
          editedOrderState.closingOrders
        );
    }
  }
  // Fake the new order. editedPosition is untouched
  else {
    // Any non-filled trades have an extra PnL adjustment
    // Only negative PnL is used
    let pnlAdjustment = size * (markPrice - price);
    pnlAdjustment = Math.min(
      0,
      side == types.Side.BID ? pnlAdjustment : -pnlAdjustment
    );
    marginAccount.balance = marginAccount.balance.add(
      new anchor.BN(convertDecimalToNativeInteger(pnlAdjustment, 1))
    );

    // If we're just adding an extra order on the same side as the existing position
    if (
      (side == types.Side.BID && currentSize > 0) ||
      (side == types.Side.ASK && currentSize < 0)
    ) {
      let i = side == types.Side.BID ? 0 : 1;
      editedOrderState.openingOrders[i] = editedOrderState.openingOrders[i].add(
        new anchor.BN(sizeNative)
      );
    }

    // If we're adding to the opposite side then both openingOrders and closingOrders change
    else {
      let i = side == types.Side.BID ? 0 : 1;
      let newOrderSize = editedOrderState.closingOrders
        .add(editedOrderState.openingOrders[i])
        .add(new anchor.BN(sizeNative));
      editedOrderState.closingOrders = anchor.BN.min(
        newOrderSize,
        editedPosition.size.abs()
      );
      editedOrderState.openingOrders[i] = newOrderSize.sub(
        editedOrderState.closingOrders
      );
    }
  }

  marginAccount.productLedgers[assetIndex].orderState = editedOrderState;
  marginAccount.productLedgers[assetIndex].position = editedPosition;
  marginAccount.lastFundingDeltas[assetIndex] =
    Exchange.pricing.fundingDeltas[assetIndex];
}

/**
 * Simulate adding an extra position/order into an existing CrossMarginAccount, but deep copy the account first and return that deep copied account
 * @param marginAccount the CrossMarginAccount itself, untouched if clone = true
 * @param clone Whether to deep-copy the marginAccount as part of the function. You can speed up execution by providing your own already deep-copied marginAccount if calling this multiple times.
 * @param executionInfo A hypothetical trade. Object containing: asset (Asset), price (decimal USDC), size (signed decimal), isTaker (whether or not it trades for full size)
 * @returns The edited CrossMarginAccount with an added trade/order
 */
export function fakeTrade(
  marginAccount: CrossMarginAccount,
  clone: boolean,
  executionInfo: types.ExecutionInfo
): CrossMarginAccount {
  let account = clone
    ? (cloneDeep(marginAccount) as CrossMarginAccount)
    : marginAccount;
  addFakeTradeToAccount(
    account,
    executionInfo.isTaker,
    executionInfo.asset,
    executionInfo.size > 0 ? types.Side.BID : types.Side.ASK,
    executionInfo.price,
    Math.abs(executionInfo.size)
  );
  return account;
}

export function addFakeCancelToAccount(
  marginAccount: CrossMarginAccount,
  order: types.Order
) {
  const assetIndex = assets.assetToIndex(order.asset);
  const bidAskIndex = order.side == types.Side.BID ? 0 : 1;

  const nativeOrderSize = convertDecimalToNativeLotSize(order.size);

  let totalOrders =
    marginAccount.productLedgers[assetIndex].orderState.closingOrders +
    marginAccount.productLedgers[assetIndex].orderState.openingOrders[0] +
    marginAccount.productLedgers[assetIndex].orderState.openingOrders[1];

  if (totalOrders == nativeOrderSize) {
    marginAccount.potentialOrderLoss[assetIndex] = new anchor.BN(0);
  } else {
    let totalMaxLoss = marginAccount.potentialOrderLoss[assetIndex];
    let maxLossPerLot = totalMaxLoss / totalOrders;
    let averageMaxLoss = maxLossPerLot * nativeOrderSize;
    marginAccount.potentialOrderLoss[assetIndex].sub(
      new anchor.BN(averageMaxLoss)
    );
  }

  const cancelOpening = Math.min(
    marginAccount.productLedgers[assetIndex].orderState.openingOrders[
      bidAskIndex
    ].toNumber(),
    nativeOrderSize
  );
  const cancelClosing = nativeOrderSize - cancelOpening;

  marginAccount.productLedgers[assetIndex].orderState.openingOrders[
    bidAskIndex
  ] = new anchor.BN(
    marginAccount.productLedgers[assetIndex].orderState.openingOrders[
      bidAskIndex
    ].toNumber() - cancelOpening
  );

  marginAccount.productLedgers[assetIndex].orderState.closingOrders =
    new anchor.BN(
      marginAccount.productLedgers[assetIndex].orderState.closingOrders -
        cancelClosing
    );
}

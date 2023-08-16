import { exchange as Exchange } from "./exchange";
import * as types from "./types";
import * as constants from "./constants";
import { CrossMarginAccount, MarginAccount } from "./program-types";
import {
  convertNativeBNToDecimal,
  convertNativeLotSizeToDecimal,
} from "./utils";
import { assetToIndex, fromProgramAsset } from "./assets";
import { Asset } from "./constants";
import { assets, Decimal } from ".";
import {
  calculateLiquidationPrice,
  calculateProductMargin,
  collectRiskMaps,
} from "./risk-utils";

export class RiskCalculator {
  private _marginRequirements: Map<Asset, Array<types.MarginRequirement>>;
  private _perpMarginRequirements: Map<Asset, types.MarginRequirement>;

  public constructor(assets: Asset[]) {
    this._marginRequirements = new Map();
    this._perpMarginRequirements = new Map();
    for (var asset of assets) {
      this._marginRequirements.set(
        asset,
        new Array(constants.ACTIVE_MARKETS - 1)
      );
    }
  }

  public getPerpMarginRequirements(asset: Asset): types.MarginRequirement {
    return this._perpMarginRequirements.get(asset);
  }

  public updateMarginRequirements(asset: Asset) {
    if (Exchange.pricing === undefined || Exchange.oracle === undefined) {
      throw Error("Pricing is not initialized");
    }
    let oraclePrice = Exchange.oracle.getPrice(asset);
    let spotPrice = oraclePrice === null ? 0 : oraclePrice.price;

    this._perpMarginRequirements.set(
      asset,
      calculateProductMargin(asset, spotPrice)
    );

    return;
  }

  /**
   * Returns the margin requirement for a given market and size.
   * @param asset          underlying asset type.
   * @param size           signed integer of size for margin requirements (short orders should be negative)
   * @param marginType     type of margin calculation.
   */
  public getPerpMarginRequirement(
    asset: Asset,
    size: number,
    marginType: types.MarginType
  ): number {
    return this.calculateMarginRequirement(
      this._perpMarginRequirements.get(asset),
      size,
      marginType
    );
  }

  private calculateMarginRequirement(
    marginRequirement: types.MarginRequirement,
    size: number,
    marginType: types.MarginType
  ) {
    if (marginRequirement === null) {
      return null;
    }

    if (size > 0) {
      if (marginType == types.MarginType.INITIAL) {
        return size * marginRequirement.initialLong;
      } else {
        return size * marginRequirement.maintenanceLong;
      }
    } else {
      if (marginType == types.MarginType.INITIAL) {
        return Math.abs(size) * marginRequirement.initialShort;
      } else {
        return Math.abs(size) * marginRequirement.maintenanceShort;
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

  public calculateUnpaidFunding(
    account: MarginAccount,
    accountType: types.ProgramAccountType
  ): number;
  public calculateUnpaidFunding(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType
  ): Map<Asset, number>;

  /**
   * Returns the unpaid funding for a given margin or crossmargin account.
   * @param account The MarginAccount or CrossMarginAccount itself
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateUnpaidFunding(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount
  ): any {
    // Spread accounts cannot hold perps and therefore have no unpaid funding
    if (accountType == types.ProgramAccountType.SpreadAccount) {
      return 0;
    }
    let funding = 0;

    // Margin account only has 1 asset, but for CrossMarginAccount we iterate through all assets
    let assetList =
      accountType == types.ProgramAccountType.MarginAccount
        ? [assets.fromProgramAsset(account.asset)]
        : Exchange.assets;

    let fundingMap: Map<Asset, number> = new Map();
    for (var asset of assetList) {
      const position =
        accountType == types.ProgramAccountType.MarginAccount
          ? account.perpProductLedger.position
          : account.productLedgers[assets.assetToIndex(asset)].position;

      const size =
        position.size.toNumber() / Math.pow(10, constants.POSITION_PRECISION);

      let deltaDiff =
        (Decimal.fromAnchorDecimal(
          Exchange.pricing.fundingDeltas[assetToIndex(asset)]
        ).toNumber() -
          Decimal.fromAnchorDecimal(
            accountType == types.ProgramAccountType.MarginAccount
              ? account.lastFundingDelta
              : account.lastFundingDeltas[assetToIndex(asset)]
          ).toNumber()) /
        Math.pow(10, constants.PLATFORM_PRECISION);

      let assetFunding = -1 * size * deltaDiff;
      fundingMap.set(asset, assetFunding);
      // Note that there is some rounding occurs here in the Zeta program
      // but we omit it in this function for simplicity
      funding += assetFunding;
    }
    if (accountType == types.ProgramAccountType.MarginAccount) {
      return funding;
    } else {
      return fundingMap;
    }
  }

  /**
   * Calculates the estimated realized PnL of the account by passing in an execution price and using taker fees
   * @param account The MarginAccount or CrossMarginAccount itself
   * @param accountType MarginAccount or CrossMarginAccount
   * @param executionInfo Information about how the PnL is hypothetically realised - execution price, asset and whether to add fees
   */
  public estimateRealizedPnl(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount,
    executionInfo: { asset: Asset; price: number; addTakerFees: boolean }
  ): number {
    // Number for MarginAccount, Map for CrossMarginAccount
    if (accountType == types.ProgramAccountType.CrossMarginAccount) {
      let pnl = this.calculatePnl(
        account as CrossMarginAccount,
        accountType,
        executionInfo
      );
      return Array.from(pnl.values()).reduce((a, b) => a + b, 0);
    } else if (accountType == types.ProgramAccountType.MarginAccount) {
      return this.calculatePnl(
        account as MarginAccount,
        accountType,
        executionInfo
      );
    }

    return 0;
  }

  public calculateUnrealizedPnl(
    account: MarginAccount,
    accountType: types.ProgramAccountType
  ): number;
  public calculateUnrealizedPnl(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType
  ): Map<Asset, number>;

  /**
   * Calculates the unrealised PnL of the account, marking all positions to the markPrice
   * @param account The MarginAccount or CrossMarginAccount itself
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateUnrealizedPnl(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount
  ): any {
    return this.calculatePnl(account, accountType, undefined);
  }

  private calculatePnl(
    account: MarginAccount,
    accountType: types.ProgramAccountType,
    executionInfo:
      | { asset: Asset; price: number; addTakerFees: boolean }
      | undefined
  ): number;
  private calculatePnl(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType,
    executionInfo:
      | { asset: Asset; price: number; addTakerFees: boolean }
      | undefined
  ): Map<Asset, number>;
  private calculatePnl(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount,
    executionInfo:
      | { asset: Asset; price: number; addTakerFees: boolean }
      | undefined = undefined
  ): any {
    let pnl = 0;

    let i_list = [];

    if (accountType == types.ProgramAccountType.CrossMarginAccount) {
      i_list = [...Array(constants.ACTIVE_PERP_MARKETS).keys()];
    } else {
      i_list = [constants.PERP_INDEX];
    }

    let upnlMap: Map<Asset, number> = new Map();
    for (var i of i_list) {
      // No perps in spread accounts
      if (
        i == constants.PERP_INDEX &&
        accountType == types.ProgramAccountType.SpreadAccount
      ) {
        continue;
      }

      let position: any;
      if (accountType == types.ProgramAccountType.MarginAccount) {
        position = account.perpProductLedger.position;
      } else if (accountType == types.ProgramAccountType.SpreadAccount) {
        position = account.positions[i];
      } else {
        position = account.productLedgers[i].position;
      }

      let asset: Asset;
      let assetPnl: number = 0;
      if (accountType == types.ProgramAccountType.CrossMarginAccount) {
        asset = assets.indexToAsset(i);
      } else {
        asset = fromProgramAsset(account.asset);
      }

      const size = position.size.toNumber();
      if (size == 0) {
        upnlMap.set(asset, 0);
        continue;
      }

      let subExchange = Exchange.getSubExchange(asset);
      let price =
        executionInfo && executionInfo.asset == asset
          ? executionInfo.price
          : subExchange.getMarkPrice();
      if (size > 0) {
        assetPnl +=
          convertNativeLotSizeToDecimal(size) * price -
          convertNativeBNToDecimal(position.costOfTrades);
      } else {
        assetPnl +=
          convertNativeLotSizeToDecimal(size) * price +
          convertNativeBNToDecimal(position.costOfTrades);
      }
      if (
        executionInfo &&
        executionInfo.asset == asset &&
        executionInfo.addTakerFees
      ) {
        assetPnl -=
          convertNativeLotSizeToDecimal(Math.abs(size)) *
          (convertNativeBNToDecimal(Exchange.state.nativeD1TradeFeePercentage) /
            100) *
          subExchange.getMarkPrice();
      }
      upnlMap.set(asset, assetPnl);
      pnl += assetPnl;
    }

    if (accountType == types.ProgramAccountType.MarginAccount) {
      return pnl;
    } else {
      return upnlMap;
    }
  }

  public calculateTotalInitialMargin(
    account: MarginAccount,
    accountType: types.ProgramAccountType,
    skipConcession: boolean
  ): number;
  public calculateTotalInitialMargin(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType,
    skipConcession: boolean
  ): Map<Asset, number>;
  /**
   * Returns the total initial margin requirement for a given account.
   * This includes initial margin on positions which is used for
   * Place order, withdrawal and force cancels
   * @param account the user's margin or crossmargin account.
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateTotalInitialMargin(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount,
    skipConcession: boolean = false
  ): any {
    // Margin account only has 1 asset, but for CrossMarginAccount we iterate through all assets
    let assetList =
      accountType == types.ProgramAccountType.MarginAccount
        ? [assets.fromProgramAsset(account.asset)]
        : Exchange.assets;

    let marginForMarkets = 0;
    let marketMaker = types.isMarketMaker(account);

    let imMap: Map<Asset, number> = new Map();
    for (var asset of assetList) {
      const ledger =
        accountType == types.ProgramAccountType.MarginAccount
          ? account.perpProductLedger
          : account.productLedgers[assets.assetToIndex(asset)];

      let size = ledger.position.size.toNumber();
      let bidOpenOrders = ledger.orderState.openingOrders[0].toNumber();
      let askOpenOrders = ledger.orderState.openingOrders[1].toNumber();
      if (bidOpenOrders == 0 && askOpenOrders == 0 && size == 0) {
        imMap.set(asset, 0);
        continue;
      }

      let longLots = convertNativeLotSizeToDecimal(bidOpenOrders);
      let shortLots = convertNativeLotSizeToDecimal(askOpenOrders);

      if (!marketMaker || skipConcession) {
        if (size > 0) {
          longLots += Math.abs(convertNativeLotSizeToDecimal(size));
        } else if (size < 0) {
          shortLots += Math.abs(convertNativeLotSizeToDecimal(size));
        }
      }

      let marginForMarket: number = undefined;
      let longLotsMarginReq = this.getPerpMarginRequirement(
        asset,
        // Positive for buys.
        longLots,
        types.MarginType.INITIAL
      );
      let shortLotsMarginReq = this.getPerpMarginRequirement(
        asset,
        // Negative for sells.
        -shortLots,
        types.MarginType.INITIAL
      );

      marginForMarket =
        longLots > shortLots ? longLotsMarginReq : shortLotsMarginReq;

      if (marketMaker && !skipConcession) {
        // Mark initial margin to concession (only contains open order margin).
        marginForMarket *= Exchange.state.marginConcessionPercentage / 100;
        // Add position margin which doesn't get concessions.
        marginForMarket += this.getPerpMarginRequirement(
          asset,
          // This is signed.
          convertNativeLotSizeToDecimal(size),
          types.MarginType.MAINTENANCE
        );
      }
      imMap.set(asset, marginForMarket);
      marginForMarkets += marginForMarket;
    }
    if (accountType == types.ProgramAccountType.MarginAccount) {
      return marginForMarkets;
    } else {
      return imMap;
    }
  }

  public calculateTotalMaintenanceMargin(
    account: MarginAccount,
    accountType: types.ProgramAccountType
  ): number;
  public calculateTotalMaintenanceMargin(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType
  ): Map<Asset, number>;
  /**
   * Returns the total maintenance margin requirement for a given account.
   * This only uses maintenance margin on positions and is used for
   * liquidations.
   * @param account the user's margin or crossmargin account.
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateTotalMaintenanceMargin(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount
  ): any {
    // Margin account only has 1 asset, but for CrossMarginAccount we iterate through all assets
    let assetList =
      accountType == types.ProgramAccountType.MarginAccount
        ? [assets.fromProgramAsset(account.asset)]
        : Exchange.assets;

    let margins = 0;
    let marginMap: Map<Asset, number> = new Map();
    for (var asset of assetList) {
      const ledger =
        accountType == types.ProgramAccountType.MarginAccount
          ? account.perpProductLedger
          : account.productLedgers[assets.assetToIndex(asset)];

      let position = ledger.position;
      let size = position.size.toNumber();
      if (size == 0) {
        marginMap.set(asset, 0);
        continue;
      }

      let assetMargin = this.getPerpMarginRequirement(
        asset,
        // This is signed.
        convertNativeLotSizeToDecimal(size),
        types.MarginType.MAINTENANCE
      );

      marginMap.set(asset, assetMargin);
      margins += assetMargin;
    }
    if (accountType == types.ProgramAccountType.MarginAccount) {
      return margins;
    } else {
      return marginMap;
    }
  }

  public calculateTotalMaintenanceMarginIncludingOrders(
    account: MarginAccount,
    accountType: types.ProgramAccountType
  ): number;
  public calculateTotalMaintenanceMarginIncludingOrders(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType
  ): Map<Asset, number>;
  /**
   * Returns the total maintenance margin requirement for a given account including orders.
   * This calculates maintenance margin across all positions and orders.
   * This value is used to determine margin when sending a closing order only.
   * @param account the user's margin or crossmargin account.
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateTotalMaintenanceMarginIncludingOrders(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount
  ): number | Map<Asset, number> {
    // Margin account only has 1 asset, but for CrossMarginAccount we iterate through all assets
    let assetList =
      accountType == types.ProgramAccountType.MarginAccount
        ? [assets.fromProgramAsset(account.asset)]
        : Exchange.assets;

    let margins = 0;
    let marginMap: Map<Asset, number> = new Map();
    for (var asset of assetList) {
      const ledger =
        accountType == types.ProgramAccountType.MarginAccount
          ? account.perpProductLedger
          : account.productLedgers[assets.assetToIndex(asset)];
      let size = ledger.position.size.toNumber();
      let bidOpenOrders = ledger.orderState.openingOrders[0].toNumber();
      let askOpenOrders = ledger.orderState.openingOrders[1].toNumber();

      marginMap.set(asset, 0);
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

      let assetMargin =
        this.getPerpMarginRequirement(
          asset,
          // Positive for buys.
          longLots,
          types.MarginType.MAINTENANCE
        ) +
        this.getPerpMarginRequirement(
          asset,
          // Negative for sells.
          -shortLots,
          types.MarginType.MAINTENANCE
        );

      margins += assetMargin;
      marginMap.set(asset, assetMargin);
    }

    if (accountType == types.ProgramAccountType.MarginAccount) {
      return margins;
    } else {
      return marginMap;
    }
  }

  /**
   * Returns the aggregate margin account state.
   * @param marginAccount   the user's CrossMarginAccount.
   */
  public getCrossMarginAccountState(
    marginAccount: CrossMarginAccount
  ): types.CrossMarginAccountState {
    let balance = convertNativeBNToDecimal(marginAccount.balance);
    let accType = types.ProgramAccountType.CrossMarginAccount;
    let unrealizedPnl = this.calculateUnrealizedPnl(
      marginAccount,
      accType
    ) as Map<Asset, number>;
    let unpaidFunding = this.calculateUnpaidFunding(
      marginAccount,
      accType
    ) as Map<Asset, number>;
    let initialMargin = this.calculateTotalInitialMargin(
      marginAccount,
      accType,
      false
    ) as Map<Asset, number>;
    let initialMarginSkipConcession = this.calculateTotalInitialMargin(
      marginAccount,
      accType,
      true
    ) as Map<Asset, number>;
    let maintenanceMargin = this.calculateTotalMaintenanceMargin(
      marginAccount,
      accType
    ) as Map<Asset, number>;
    let maintenanceMarginIncludingOrders =
      this.calculateTotalMaintenanceMarginIncludingOrders(
        marginAccount,
        accType
      ) as Map<Asset, number>;

    let upnlTotal = Array.from(unrealizedPnl.values()).reduce(
      (a, b) => a + b,
      0
    );
    let unpaidFundingTotal = Array.from(unpaidFunding.values()).reduce(
      (a, b) => a + b,
      0
    );
    let imTotal = Array.from(initialMargin.values()).reduce((a, b) => a + b, 0);
    let imSkipConcessionTotal = Array.from(
      initialMarginSkipConcession.values()
    ).reduce((a, b) => a + b, 0);
    let mmTotal = Array.from(maintenanceMargin.values()).reduce(
      (a, b) => a + b,
      0
    );
    let mmioTotal = Array.from(
      maintenanceMarginIncludingOrders.values()
    ).reduce((a, b) => a + b, 0);

    let availableBalanceInitial: number =
      balance + upnlTotal + unpaidFundingTotal - imTotal;
    let availableBalanceWithdrawable: number =
      balance + upnlTotal + unpaidFundingTotal - imSkipConcessionTotal;
    let availableBalanceMaintenance: number =
      balance + upnlTotal + unpaidFundingTotal - mmTotal;
    let availableBalanceMaintenanceIncludingOrders: number =
      balance + upnlTotal + unpaidFundingTotal - mmioTotal;
    return {
      balance,
      availableBalanceInitial,
      availableBalanceMaintenance,
      availableBalanceMaintenanceIncludingOrders,
      availableBalanceWithdrawable,
      assetState: collectRiskMaps(
        initialMargin,
        initialMarginSkipConcession,
        maintenanceMargin,
        maintenanceMarginIncludingOrders,
        unrealizedPnl,
        unpaidFunding
      ),
      initialMarginTotal: imTotal,
      initalMarginSkipConcessionTotal: imSkipConcessionTotal,
      maintenanceMarginTotal: mmTotal,
      maintenanceMarginIncludingOrdersTotal: mmioTotal,
      unrealizedPnlTotal: upnlTotal,
      unpaidFundingTotal: unpaidFundingTotal,
    };
  }

  /**
   * Returns the aggregate margin account state.
   * @param marginAccount   the user's MarginAccount.
   */
  public getMarginAccountState(
    marginAccount: MarginAccount
  ): types.MarginAccountState {
    let balance = convertNativeBNToDecimal(marginAccount.balance);
    let unrealizedPnl = this.calculateUnrealizedPnl(
      marginAccount,
      types.ProgramAccountType.MarginAccount
    ) as number;
    let unpaidFunding = this.calculateUnpaidFunding(
      marginAccount,
      types.ProgramAccountType.MarginAccount
    ) as number;
    let initialMargin = this.calculateTotalInitialMargin(
      marginAccount,
      types.ProgramAccountType.MarginAccount,
      false
    ) as number;
    let initialMarginSkipConcession = this.calculateTotalInitialMargin(
      marginAccount,
      types.ProgramAccountType.MarginAccount,
      true
    ) as number;
    let maintenanceMargin = this.calculateTotalMaintenanceMargin(
      marginAccount,
      types.ProgramAccountType.MarginAccount
    ) as number;
    let availableBalanceInitial: number =
      balance + unrealizedPnl + unpaidFunding - initialMargin;
    let availableBalanceWithdrawable: number =
      balance + unrealizedPnl + unpaidFunding - initialMarginSkipConcession;
    let availableBalanceMaintenance: number =
      balance + unrealizedPnl + unpaidFunding - maintenanceMargin;
    return {
      balance,
      initialMargin,
      initialMarginSkipConcession,
      maintenanceMargin,
      unrealizedPnl,
      unpaidFunding,
      availableBalanceInitial,
      availableBalanceMaintenance,
      availableBalanceWithdrawable,
    };
  }

  /**
   * Find the maximum size a user is allowed to trade, given the position they're currently in
   * @param marginAccount The user's CrossMarginAccount itself
   * @param tradeAsset The asset being traded
   * @param tradeSide The side (bid/ask) being traded
   * @param tradePrice The price the user wishes to execute at
   * @param bufferPercent An added buffer on top of the final result, so that quick price movements don't immediately make you hit leverage limits
   * @param addTakerFees Whether to account for taker fees or not in the estimations
   * @returns
   */
  public getMaxTradeSize(
    marginAccount: CrossMarginAccount,
    tradeAsset: constants.Asset,
    tradeSide: types.Side,
    tradePrice: number,
    bufferPercent: number = 5,
    addTakerFees: boolean = true
  ): number {
    let state = this.getCrossMarginAccountState(marginAccount);

    let executionPrices = new Map();
    executionPrices.set(tradeAsset, tradePrice);

    let estimatedPnl = this.estimateRealizedPnl(
      marginAccount,
      types.ProgramAccountType.CrossMarginAccount,
      { asset: tradeAsset, price: tradePrice, addTakerFees: addTakerFees }
    );
    let realizedBalanceInit =
      state.balance +
      estimatedPnl +
      state.unpaidFundingTotal -
      state.initialMarginTotal;

    let realizedBalanceMaintInclOrders =
      state.balance +
      estimatedPnl +
      state.unpaidFundingTotal -
      state.maintenanceMarginIncludingOrdersTotal;

    let fee = addTakerFees
      ? (convertNativeBNToDecimal(Exchange.state.nativeD1TradeFeePercentage) /
          100) *
        tradePrice
      : 0;

    let position = convertNativeLotSizeToDecimal(
      marginAccount.productLedgers[assets.assetToIndex(tradeAsset)].position
        .size
    );
    let positionAbs = Math.abs(position);
    let init = convertNativeBNToDecimal(
      Exchange.pricing.marginParameters[assets.assetToIndex(tradeAsset)]
        .futureMarginInitial,
      constants.MARGIN_PRECISION
    );
    let maint = convertNativeBNToDecimal(
      Exchange.pricing.marginParameters[assets.assetToIndex(tradeAsset)]
        .futureMarginMaintenance,
      constants.MARGIN_PRECISION
    );
    let markPrice = Exchange.getMarkPrice(tradeAsset);
    let extraUPNLPerLot =
      tradeSide == types.Side.BID
        ? markPrice - tradePrice
        : tradePrice - markPrice;

    // (currentBalance + currentUPNL + unpaid funding - currentIM) + extraUPNL - extraIM - fees > 0
    // state.availableBalanceInitial + extraUPNL - extraIM - fees > 0
    // Where X is the number of extra lots:
    // state.availableBalanceInitial + X*extraUPNLPerLot - X*init*markPrice - X*fee > 0
    // X < state.availableBalanceInitial / (init*markPrice + fee - extraUPNLPerLot)
    let openSize =
      state.availableBalanceInitial /
      (init * markPrice + fee - extraUPNLPerLot);

    // (currentBalance + currentUPNL + unpaid funding - currentMMIO) + extraMMIO - fees > 0
    // realizedBalanceMaintInclOrders + extraMMIO - fees > 0
    // Where X is the number of extra lots:
    // realizedBalanceMaintInclOrders + X*maint*markPrice - X*fee > 0
    // X < realizedBalanceMaintInclOrders / (fee - maint*markPrice)
    let closeSize = realizedBalanceMaintInclOrders / (fee - maint * markPrice);

    // Equation falls apart if there is no positive X, means that you can close your position entirely
    if (closeSize <= 0 || closeSize >= positionAbs) {
      closeSize = positionAbs;
    }

    // (currentBalance + currentUPNL + unpaid funding - currentIM) + extraIMClose - extraIMOpen + extraUPNLOpen - fees > 0
    // realizedBalanceInit + extraIMClose - extraIMOpen + extraUPNLOpen - fees > 0
    // Where X is the number of extra lots opened on the other side:
    // realizedBalanceInit + position*init*markPrice - X*init*markPrice + X*extraUPNLPerLot - X*fee > 0
    // X < (realizedBalanceInit + position*init*markPrice) / (init*markPrice + fee - extraUPNLPerLot)

    let closeOpenSize = closeSize;
    if (closeSize == positionAbs) {
      closeOpenSize =
        positionAbs +
        (realizedBalanceInit + positionAbs * init * markPrice) /
          (init * markPrice + fee - extraUPNLPerLot);
    }

    if (
      position == 0 ||
      (position > 0 && tradeSide == types.Side.BID) ||
      (position < 0 && tradeSide == types.Side.ASK)
    ) {
      // Strictly an opening order - use initial margin
      return ((100 - bufferPercent) / 100) * openSize;
    } else {
      // Either only close (uses maint margin incl orders),
      // or close full size + open more (uses initial margin)
      // Return the one that gives the biggest size
      return Math.max(((100 - bufferPercent) / 100) * closeOpenSize, closeSize);
    }
  }

  public getLiquidationPrice(
    asset: Asset,
    signedPosition: number,
    marginAccount: CrossMarginAccount
  ) {
    let state = this.getCrossMarginAccountState(marginAccount);
    return calculateLiquidationPrice(
      state.balance,
      state.maintenanceMarginTotal,
      state.unrealizedPnlTotal,
      Exchange.getMarkPrice(asset),
      signedPosition
    );
  }
}

import { exchange as Exchange } from "./exchange";
import * as types from "./types";
import * as constants from "./constants";
import { CrossMarginAccount, MarginAccount } from "./program-types";
import {
  convertNativeBNToDecimal,
  convertNativeLotSizeToDecimal,
  convertDecimalToNativeInteger,
  convertNativeIntegerToDecimal,
  getFeeBps,
} from "./utils";
import { assetToIndex, fromProgramAsset } from "./assets";
import { Asset } from "./constants";
import { assets, Decimal, programTypes } from ".";
import {
  addFakeTradeToAccount,
  calculateProductMargin,
  fakeTrade,
  collectRiskMaps,
  addFakeCancelToAccount,
} from "./risk-utils";

import cloneDeep from "lodash.clonedeep";

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

  /**
   * Get the internal margin requirements for a perp market
   * @param asset underlying asset type.
   * @returns MarginRequirement object with initial and maintenance margin requirements. Values are decimals, for 1 lot.
   */
  public getPerpMarginRequirements(asset: Asset): types.MarginRequirement {
    return this._perpMarginRequirements.get(asset);
  }

  /**
   * Update the internal margin requirements for a perp market
   * @param asset underlying asset type.
   */
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
   * @param size           signed size for margin requirements (short orders should be negative), in decimal USDC lots.
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
    if (marginRequirement === null || marginRequirement === undefined) {
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
   * Total intended trade size = closing size + opening size. All arguments must use the same precision.
   * @param size           signed number of size for margin requirements (short orders should be negative)
   * @param position       signed number the user's current position for that product (0 if none).
   * @param closingSize    unsigned number of the user's current closing order quantity for that product (0 if none)
   *
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
   * Returns the unpaid funding for a given margin or crossmargin account.
   * @param account The MarginAccount itself
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateUnpaidFunding(
    account: MarginAccount,
    accountType: types.ProgramAccountType
  ): number;
  /**
   * Returns the unpaid funding for a given margin or crossmargin account.
   * @param account The CrossMarginAccount itself
   * @param accountType MarginAccount or CrossMarginAccount
   */
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
   * Calculates the estimated realized PnL of the position by passing in an execution price and using taker fees
   * @param account The MarginAccount or CrossMarginAccount itself
   * @param accountType MarginAccount or CrossMarginAccount
   * @param executionInfo Information about how the PnL is hypothetically realised. asset (Asset), price (in decimal), size (in fixed POSITION_PRECISION, signed in the same direction as the existing position you're exiting), addTakerFees (bool)
   */
  public estimateRealizedPnl(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount,
    executionInfo: types.ExecutionInfo
  ): number {
    // Number for MarginAccount, Map for CrossMarginAccount
    if (accountType == types.ProgramAccountType.CrossMarginAccount) {
      let pnl = this.calculatePnl(
        account as CrossMarginAccount,
        accountType,
        executionInfo
      );
      return pnl.get(executionInfo.asset);
    } else if (accountType == types.ProgramAccountType.MarginAccount) {
      return this.calculatePnl(
        account as MarginAccount,
        accountType,
        executionInfo
      );
    }

    return 0;
  }

  /**
   * Calculates the unrealised PnL of the account, marking all positions to the markPrice
   * @param account The MarginAccount itself
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateUnrealizedPnl(
    account: MarginAccount,
    accountType: types.ProgramAccountType
  ): number;
  /**
   * Calculates the unrealised PnL of the account, marking all positions to the markPrice
   * @param account The CrossMarginAccount itself
   * @param accountType MarginAccount or CrossMarginAccount
   */
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
    executionInfo: types.ExecutionInfo | undefined
  ): number;
  private calculatePnl(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType,
    executionInfo: types.ExecutionInfo | undefined
  ): Map<Asset, number>;
  private calculatePnl(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount,
    executionInfo: types.ExecutionInfo | undefined = undefined
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

      let size =
        executionInfo &&
        executionInfo.size != undefined &&
        executionInfo.asset == asset
          ? executionInfo.size
          : position.size.toNumber();

      // Clamp executionInfo.size such that
      // 0 < executionInfo.size < position.size
      if (
        executionInfo &&
        executionInfo.size != undefined &&
        executionInfo.asset == asset
      ) {
        let warn = false;
        if (
          (size < 0 && position.size.toNumber() > 0) ||
          (size > 0 && position.size.toNumber() < 0)
        ) {
          warn = true;
          size = 0;
        } else if (Math.abs(size) > Math.abs(position.size.toNumber())) {
          warn = true;
          size = position.size.toNumber();
        }
        if (warn) {
          console.warn(
            `Warning: executionInfo.size should not be greater than existing position, and should be on the same side. existingPosition=${position.size.toNumber()}, executionInfo.size=${
              executionInfo.size
            }. Clamped executionInfo.size to ${size}`
          );
        }
      }

      const costOfTrades =
        convertNativeBNToDecimal(position.costOfTrades) *
        (size / position.size.toNumber());

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
        assetPnl += convertNativeLotSizeToDecimal(size) * price - costOfTrades;
      } else {
        assetPnl += convertNativeLotSizeToDecimal(size) * price + costOfTrades;
      }
      if (executionInfo && executionInfo.asset == asset) {
        assetPnl -=
          convertNativeLotSizeToDecimal(Math.abs(size)) *
          (getFeeBps(executionInfo.isTaker, account.accountType) / 10000) *
          price;
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

  public getPotentialOrderLoss(
    account: CrossMarginAccount
  ): Map<Asset, number> {
    const i_list = [...Array(constants.ACTIVE_PERP_MARKETS).keys()];

    const potentialOrderLossMap: Map<Asset, number> = new Map();
    for (var i of i_list) {
      const asset = assets.indexToAsset(i);
      const potentialOrderLoss = convertNativeIntegerToDecimal(
        account.potentialOrderLoss[i].toNumber()
      );
      potentialOrderLossMap.set(asset, potentialOrderLoss);
    }

    return potentialOrderLossMap;
  }

  /**
   * Returns the total initial margin requirement for a given account.
   * This includes initial margin on positions which is used for
   * Place order, withdrawal and force cancels
   * @param account The MarginAccount itself.
   * @param accountType MarginAccount or CrossMarginAccount
   * @param skipConcession Whether to skip margin concessions or not
   */
  public calculateTotalInitialMargin(
    account: MarginAccount,
    accountType: types.ProgramAccountType,
    skipConcession: boolean
  ): number;
  /**
   * Returns the total initial margin requirement for a given account.
   * This includes initial margin on positions which is used for
   * Place order, withdrawal and force cancels
   * @param account The CrossMarginAccount itself.
   * @param accountType MarginAccount or CrossMarginAccount
   * @param skipConcession Whether to skip margin concessions or not
   */
  public calculateTotalInitialMargin(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType,
    skipConcession: boolean
  ): Map<Asset, number>;
  /**
   * Returns the total initial margin requirement for a given account.
   * This includes initial margin on positions which is used for
   * Place order, withdrawal and force cancels
   * @param account The MarginAccount or CrossMarginAccount itself.
   * @param accountType MarginAccount or CrossMarginAccount
   * @param skipConcession Whether to skip margin concessions or not
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

  /**
   * Returns the total maintenance margin requirement for a given account.
   * This only uses maintenance margin on positions and is used for
   * liquidations.
   * @param account The MarginAccount itself.
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateTotalMaintenanceMargin(
    account: MarginAccount,
    accountType: types.ProgramAccountType
  ): number;
  /**
   * Returns the total maintenance margin requirement for a given account.
   * This only uses maintenance margin on positions and is used for
   * liquidations.
   * @param account The CrossMarginAccount itself.
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateTotalMaintenanceMargin(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType
  ): Map<Asset, number>;
  /**
   * Returns the total maintenance margin requirement for a given account.
   * This only uses maintenance margin on positions and is used for
   * liquidations.
   * @param account The MarginAccount or CrossMarginAccount itself.
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

  /**
   * Returns the total maintenance margin requirement for a given account including orders.
   * This calculates maintenance margin across all positions and orders.
   * This value is used to determine margin when sending a closing order only.
   * @param account The MarginAccount itself.
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateTotalMaintenanceMarginIncludingOrders(
    account: MarginAccount,
    accountType: types.ProgramAccountType
  ): number;
  /**
   * Returns the total maintenance margin requirement for a given account including orders.
   * This calculates maintenance margin across all positions and orders.
   * This value is used to determine margin when sending a closing order only.
   * @param account The CrossMarginAccount itself.
   * @param accountType MarginAccount or CrossMarginAccount
   */
  public calculateTotalMaintenanceMarginIncludingOrders(
    account: CrossMarginAccount,
    accountType: types.ProgramAccountType
  ): Map<Asset, number>;
  /**
   * Returns the total maintenance margin requirement for a given account including orders.
   * This calculates maintenance margin across all positions and orders.
   * This value is used to determine margin when sending a closing order only.
   * @param account The MarginAccount or CrossMarginAccount itself.
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

    let potentialOrderLoss = this.getPotentialOrderLoss(marginAccount);

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

    let potentialOrderLossTotal = Array.from(
      potentialOrderLoss.values()
    ).reduce((a, b) => a + b, 0);

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

    let equity: number = balance + upnlTotal + unpaidFundingTotal;
    let availableBalanceInitial: number =
      balance +
      upnlTotal +
      unpaidFundingTotal -
      imTotal -
      potentialOrderLossTotal;
    let availableBalanceWithdrawable: number =
      balance +
      Math.min(0, upnlTotal) +
      unpaidFundingTotal -
      imSkipConcessionTotal;
    let availableBalanceMaintenance: number =
      balance +
      upnlTotal +
      unpaidFundingTotal -
      mmTotal -
      potentialOrderLossTotal;
    let availableBalanceMaintenanceIncludingOrders: number =
      balance +
      upnlTotal +
      unpaidFundingTotal -
      mmioTotal -
      potentialOrderLossTotal;
    return {
      balance,
      equity,
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
        unpaidFunding,
        potentialOrderLoss
      ),
      initialMarginTotal: imTotal,
      initalMarginSkipConcessionTotal: imSkipConcessionTotal,
      maintenanceMarginTotal: mmTotal,
      maintenanceMarginIncludingOrdersTotal: mmioTotal,
      unrealizedPnlTotal: upnlTotal,
      unpaidFundingTotal: unpaidFundingTotal,
      potentialOrderLossTotal,
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
    let equity: number = balance + unrealizedPnl + unpaidFunding;
    let availableBalanceInitial: number =
      balance + unrealizedPnl + unpaidFunding - initialMargin;
    let availableBalanceWithdrawable: number =
      balance + unrealizedPnl + unpaidFunding - initialMarginSkipConcession;
    let availableBalanceMaintenance: number =
      balance + unrealizedPnl + unpaidFunding - maintenanceMargin;
    return {
      balance,
      equity,
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
   * Find the maximum size a user is allowed to trade, given the position they're currently in.
   * This function uses a binary search to approximate the largest size the user can trade.
   * The arguments 'thresholdPercent', 'bufferPercent' and 'maxIterations' can be changed to get the right tradeoff between precision and speed.
   * @param marginAccount The user's CrossMarginAccount itself
   * @param tradeAsset The asset being traded
   * @param tradeSide The side (bid/ask) being traded
   * @param tradePrice The price the user wishes to execute at, in decimal USDC. If tradePrice is <= 0, getMaxTradeSize returns undefined.
   * @param isTaker Whether the full size is expected to trade or not. Only set this to true if the orderbook is deep enough as it may result in less conservative values.
   * @param thresholdPercent The ratio of availableBalanceInitial/balance at which we decide a size is close enough to the maximum and can return
   * @param bufferPercent An added buffer on top of the final result, so that quick price movements don't immediately make you hit leverage limits
   * @param maxIterations The maximum amount of iterations for the binary search when finding a good size
   * @returns size in decimal, strictly >= 0. If tradePrice is <= 0, this returns undefined.
   */
  public getMaxTradeSize(
    marginAccount: CrossMarginAccount,
    tradeAsset: constants.Asset,
    tradeSide: types.Side,
    tradePrice: number,
    maxLeverage: number = -1,
    isTaker: boolean = true,
    fakeCancel: types.Order = undefined,
    thresholdPercent: number = 1,
    bufferPercent: number = 5,
    maxIterations: number = 100
  ): number | undefined {
    if (tradePrice <= 0) {
      return undefined;
    }
    // Don't cap leverage if not a taker trade, because leverage only counts positions
    if (maxLeverage <= 0 || !isTaker) {
      maxLeverage = -1;
    }
    if (thresholdPercent <= 0) {
      throw Error("thresholdPercent must be > 0");
    }
    let state = this.getCrossMarginAccountState(marginAccount);
    let assetIndex = assets.assetToIndex(tradeAsset);

    if (state.balance == 0) {
      return 0;
    }

    let realizedBalanceMaintInclOrders =
      state.balance +
      Array.from(
        this.calculatePnl(
          marginAccount,
          types.ProgramAccountType.CrossMarginAccount,
          {
            asset: tradeAsset,
            price: tradePrice,
            size: undefined,
            isTaker: isTaker,
          }
        ).values()
      ).reduce((a, b) => a + b, 0) +
      state.unpaidFundingTotal -
      state.maintenanceMarginIncludingOrdersTotal -
      state.potentialOrderLossTotal;

    let fee =
      (getFeeBps(isTaker, marginAccount.accountType) / 10000) * tradePrice;

    let productLedger = marginAccount.productLedgers[assetIndex];
    let position = convertNativeLotSizeToDecimal(
      productLedger.position.size.toNumber()
    );
    let positionAbs = Math.abs(position);

    let maint = convertNativeBNToDecimal(
      Exchange.pricing.marginParameters[assetIndex].futureMarginMaintenance,
      constants.MARGIN_PRECISION
    );
    let init = convertNativeBNToDecimal(
      Exchange.pricing.marginParameters[assetIndex].futureMarginInitial,
      constants.MARGIN_PRECISION
    );
    let markPrice = Exchange.getMarkPrice(tradeAsset);

    // If only closing the existing position -> Special case using MaintenanceMarginIncludingOrders
    // (currentBalance + currentUPNL + unpaid funding - currentMMIO) + extraMMIO - fees > 0
    // realizedBalanceMaintInclOrders + extraMMIO - fees > 0
    // Where X is the number of extra lots:
    // realizedBalanceMaintInclOrders + X*maint*markPrice - X*fee > 0
    // X < realizedBalanceMaintInclOrders / (fee - maint*markPrice)
    let closeSize = realizedBalanceMaintInclOrders / (fee - maint * markPrice);

    // Cap the closing size to be how much we can send with MM requirements only
    if (
      closeSize <= 0 ||
      closeSize >=
        positionAbs -
          convertNativeLotSizeToDecimal(
            productLedger.orderState.closingOrders.toNumber()
          )
    ) {
      closeSize =
        positionAbs -
        convertNativeLotSizeToDecimal(
          productLedger.orderState.closingOrders.toNumber()
        );
    }
    if (
      position != 0 &&
      ((position < 0 && tradeSide == types.Side.BID) ||
        (position > 0 && tradeSide == types.Side.ASK))
    ) {
      closeSize = closeSize;
    } else {
      closeSize = 0;
    }

    // If we're not strictly closing an existing position, we need to estimate the max size
    let editedAccount = cloneDeep(marginAccount) as CrossMarginAccount;

    if (fakeCancel) {
      addFakeCancelToAccount(editedAccount, fakeCancel);
    }

    let currentPosition = cloneDeep(
      editedAccount.productLedgers[assetIndex].position
    ) as programTypes.Position;
    let currentOrderState = cloneDeep(
      editedAccount.productLedgers[assetIndex].orderState
    ) as programTypes.OrderState;
    let currentBalance = editedAccount.balance;

    // Iterate until we find a good size using a binary search
    let sizeLowerBound = 0;
    let sizeUpperBound =
      2 *
      Math.max(
        0,
        Math.max(state.balance, state.availableBalanceInitial) /
          (init * Math.min(Exchange.getMarkPrice(tradeAsset), tradePrice))
      );
    if (sizeUpperBound == 0) {
      return closeSize;
    }
    let size = sizeUpperBound / 2;
    let iteration = 0;
    while (true) {
      iteration += 1;

      // Couldn't find a suitable size
      if (iteration > maxIterations) {
        return Math.max(
          closeSize,
          Math.floor(
            10 ** constants.POSITION_PRECISION *
              ((100 - bufferPercent) / 100) *
              size
          ) /
            10 ** constants.POSITION_PRECISION
        );
      }

      if (size < 0.001) {
        return Math.max(closeSize, 0);
      }

      size =
        Math.floor(10 ** constants.POSITION_PRECISION * size) /
        10 ** constants.POSITION_PRECISION;

      editedAccount.productLedgers[assetIndex].position =
        cloneDeep(currentPosition);
      editedAccount.productLedgers[assetIndex].orderState =
        cloneDeep(currentOrderState);
      editedAccount.balance = currentBalance;

      addFakeTradeToAccount(
        editedAccount,
        isTaker,
        tradeAsset,
        tradeSide,
        tradePrice,
        size
      );

      let newState = this.getCrossMarginAccountState(editedAccount);
      let equity =
        newState.balance +
        newState.unrealizedPnlTotal +
        newState.unpaidFundingTotal;
      let nonLeverageBuffer = (equity - newState.initialMarginTotal) / equity;

      let buffer =
        maxLeverage == -1
          ? nonLeverageBuffer
          : Math.min(
              (maxLeverage -
                this.getLeverage(editedAccount, undefined, false)) /
                maxLeverage,
              nonLeverageBuffer
            );

      if (
        buffer < thresholdPercent / 100 &&
        buffer > 0 &&
        newState.balance > 0
      ) {
        return Math.max(
          closeSize,
          Math.floor(
            10 ** constants.POSITION_PRECISION *
              ((100 - bufferPercent) / 100) *
              size
          ) /
            10 ** constants.POSITION_PRECISION
        );
      } else if (
        (maxLeverage == -1 && newState.initialMarginTotal > equity) ||
        (maxLeverage != -1 && buffer < 0) ||
        buffer > 1
      ) {
        sizeUpperBound = size;
        size = (sizeLowerBound + size) / 2;
      } else {
        sizeLowerBound = size;
        size = (sizeUpperBound + size) / 2;
      }
    }

    return 0;
  }

  /**
   * Find the price at which a given position will be subject to liquidation.
   * (under the assumption that the prices of other assets stays static)
   * @param asset The asset being traded
   * @param marginAccount The CrossMarginAccount itself.
   * @returns Liquidation price, in decimal USDC
   */
  public getEstimatedLiquidationPrice(
    asset: Asset,
    marginAccount: CrossMarginAccount,
    executionInfo?: types.ExecutionInfo,
    clone: boolean = true
  ): number {
    let account = marginAccount;
    if (executionInfo) {
      account = fakeTrade(marginAccount, clone, executionInfo);
    }

    // K is the accumulated maintenance margin and unrealized pnl offsets from other assets
    let K = 0;
    for (var a of Exchange.assets) {
      if (a == asset) {
        continue;
      }

      const ledger = account.productLedgers[assets.assetToIndex(a)];
      const posSizeNative = ledger.position.size.toNumber();
      if (posSizeNative == 0) {
        continue;
      }
      const posSize = convertNativeLotSizeToDecimal(posSizeNative);
      const assetMmNative = convertDecimalToNativeInteger(
        this.getPerpMarginRequirement(a, posSize, types.MarginType.MAINTENANCE)
      );
      K -= assetMmNative;

      let assetUpnl;
      const nativePosDelta =
        convertDecimalToNativeInteger(Exchange.getMarkPrice(a)) * posSize;
      const nativeCot = ledger.position.costOfTrades.toNumber();
      if (posSize > 0) {
        assetUpnl = nativePosDelta - nativeCot;
      } else {
        assetUpnl = nativePosDelta + nativeCot;
      }
      K += assetUpnl;
    }

    const liqAssetPledger = account.productLedgers[assets.assetToIndex(asset)];
    const posSizeNative = liqAssetPledger.position.size.toNumber();
    const nativeCot = liqAssetPledger.position.costOfTrades.toNumber();

    if (posSizeNative == 0) {
      return 0;
    }

    const posSize = convertNativeLotSizeToDecimal(posSizeNative);
    const C = convertNativeBNToDecimal(
      Exchange.pricing.marginParameters[assets.assetToIndex(asset)]
        .futureMarginMaintenance,
      constants.MARGIN_PRECISION
    );

    const nativeCotOffset = posSize > 0 ? -nativeCot : nativeCot;
    const num = convertNativeIntegerToDecimal(
      account.balance.toNumber() + nativeCotOffset + K
    );
    const denom = Math.abs(posSize) * C - posSize;
    return Math.max(0, num / denom);
  }

  /**
   * Get an account's equity, which is the balance including unrealized PnL and unpaid funding.
   * You can optionally provide executionInfo to mimick a fake order/trade, which will return the account's equity after that order/trade occurs.
   * @param marginAccount The CrossMarginAccount itself, edited in-place if executionInfo is provided
   * @param executionInfo (Optional) A hypothetical trade. Object containing: asset (Asset), price (decimal USDC), size (signed decimal), isTaker (whether or not it trades for full size)
   * @param clone Whether to deep-copy the marginAccount as part of the function. You can speed up execution by providing your own already deep-copied marginAccount if calling multiple risk.ts functions.
   * @returns A decimal USDC representing the account equity
   */
  public getEquity(
    marginAccount: CrossMarginAccount,
    executionInfo?: types.ExecutionInfo,
    clone: boolean = true
  ): number {
    if (marginAccount.balance.toNumber() == 0) return 0;

    let account = marginAccount;
    if (executionInfo) {
      account = fakeTrade(marginAccount, clone, executionInfo);
    }
    return this.getCrossMarginAccountState(account).equity;
  }

  /**
   * Get an account's buying power, which is the position size you can get additional exposure to.
   * You can optionally provide executionInfo to mimick a fake order/trade, which will return the account's buying power after that order/trade occurs.
   * @param marginAccount The CrossMarginAccount itself, edited in-place if executionInfo is provided
   * @param asset The underlying for which we're estimating buying power
   * @param executionInfo (Optional) A hypothetical trade. Object containing: asset (Asset), price (decimal USDC), size (signed decimal), isTaker (whether or not it trades for full size)
   * @param clone Whether to deep-copy the marginAccount as part of the function. You can speed up execution by providing your own already deep-copied marginAccount if calling multiple risk.ts functions.
   * @returns A decimal USDC representing the buying power
   */
  public getBuyingPower(
    marginAccount: CrossMarginAccount,
    asset: Asset,
    executionInfo?: types.ExecutionInfo,
    clone: boolean = true
  ): number {
    if (marginAccount.balance.toNumber() == 0) return 0;

    let account = marginAccount;
    let markPrice = Exchange.getMarkPrice(asset);
    let initialMarginPerLot = this.getPerpMarginRequirement(
      asset,
      1,
      types.MarginType.INITIAL
    );

    if (executionInfo) {
      account = fakeTrade(marginAccount, clone, executionInfo);
    }
    let state = this.getCrossMarginAccountState(account);
    let freeCollateral = state.availableBalanceInitial;

    return freeCollateral * (markPrice / initialMarginPerLot);
  }

  /**
   * Get an account's margin usage, which is a decimal percentage from 0 to 100 representing the percentage of equity used in maintenance margin.
   * You can optionally provide executionInfo to mimick a fake order/trade, which will return the account's margin usage after that order/trade occurs.
   * @param marginAccount The CrossMarginAccount itself, edited in-place if executionInfo is provided
   * @param executionInfo (Optional) A hypothetical trade. Object containing: asset (Asset), price (decimal USDC), size (signed decimal), isTaker (whether or not it trades for full size)
   * @param clone Whether to deep-copy the marginAccount as part of the function. You can speed up execution by providing your own already deep-copied marginAccount if calling multiple risk.ts functions.
   * @returns A decimal percentage representing margin usage.
   */
  public getMarginUsagePercent(
    marginAccount: CrossMarginAccount,
    executionInfo?: types.ExecutionInfo,
    clone: boolean = true
  ): number {
    if (marginAccount.balance.toNumber() == 0) return 0;

    let account = marginAccount;
    if (executionInfo) {
      account = fakeTrade(marginAccount, clone, executionInfo);
    }
    let state = this.getCrossMarginAccountState(account);
    return 100 * (state.maintenanceMarginTotal / state.equity);
  }

  /**
   * Get an account's free collateral, which is the amount of available collateral the account has for trading. Equivalent to 'availableBalanceInitial'
   * You can optionally provide executionInfo to mimick a fake order/trade, which will return the account's free collateral after that order/trade occurs.
   * @param marginAccount The CrossMarginAccount itself, edited in-place if executionInfo is provided
   * @param executionInfo (Optional) A hypothetical trade. Object containing: asset (Asset), price (decimal USDC), size (signed decimal), isTaker (whether or not it trades for full size)
   * @param clone Whether to deep-copy the marginAccount as part of the function. You can speed up execution by providing your own already deep-copied marginAccount if calling multiple risk.ts functions.
   * @returns A decimal USDC representing the available collateral.
   */
  public getFreeCollateral(
    marginAccount: CrossMarginAccount,
    executionInfo?: types.ExecutionInfo,
    clone: boolean = true
  ): number {
    if (marginAccount.balance.toNumber() == 0) return 0;

    let account = marginAccount;
    if (executionInfo) {
      account = fakeTrade(marginAccount, clone, executionInfo);
    }
    return this.getCrossMarginAccountState(account).availableBalanceInitial;
  }

  /**
   * Get an account's current leverage
   * You can optionally provide executionInfo to mimick a fake order/trade, which will return the account's current leverage after that order/trade occurs.
   * @param marginAccount The CrossMarginAccount itself, edited in-place if executionInfo is provided
   * @param executionInfo (Optional) A hypothetical trade. Object containing: asset (Asset), price (decimal USDC), size (signed decimal), isTaker (whether or not it trades for full size)
   * @param clone Whether to deep-copy the marginAccount as part of the function. You can speed up execution by providing your own already deep-copied marginAccount if calling multiple risk.ts functions.
   * @param overrideEquity whether to override the equity part of the calc, using the unchanged equity
   * @param useExecutionInfoPrice whether to override the mark price with the executionInfo price
   * @returns A decimal value representing the current leverage.
   */
  public getLeverage(
    marginAccount: CrossMarginAccount,
    executionInfo?: types.ExecutionInfo,
    clone: boolean = true,
    overrideEquity: boolean = false,
    useExecutionInfoPrice: boolean = false
  ): number {
    if (marginAccount.balance.toNumber() == 0) return 0;

    let account = marginAccount;
    if (executionInfo) {
      account = fakeTrade(marginAccount, clone, executionInfo);
    }

    // Sum up all the positions in the account
    let positionValue = 0;
    for (var asset of Exchange.assets) {
      let markPrice =
        useExecutionInfoPrice && executionInfo && executionInfo.asset == asset
          ? executionInfo.price
          : Exchange.getMarkPrice(asset);

      positionValue +=
        Math.abs(
          convertNativeLotSizeToDecimal(
            account.productLedgers[
              assets.assetToIndex(asset)
            ].position.size.toNumber()
          )
        ) * markPrice;
    }

    return (
      positionValue /
      (overrideEquity
        ? this.getCrossMarginAccountState(marginAccount).equity
        : this.getCrossMarginAccountState(account).equity)
    );
  }
}

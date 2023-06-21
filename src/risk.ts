import { exchange as Exchange } from "./exchange";
import * as types from "./types";
import * as constants from "./constants";
import {
  CrossMarginAccount,
  MarginAccount,
  PositionMovementEvent,
} from "./program-types";
import {
  convertNativeBNToDecimal,
  convertNativeLotSizeToDecimal,
} from "./utils";
import { assetToIndex, fromProgramAsset } from "./assets";
import { Asset } from "./constants";
import { BN } from "@zetamarkets/anchor";
import { assets, Client, Decimal, instructions, utils } from ".";
import { cloneDeep } from "lodash";
import {
  calculateProductMargin,
  movePositions,
  calculateNormalizedCostOfTrades,
  checkMarginAccountMarginRequirement,
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

  public getMarginRequirements(asset: Asset): Array<types.MarginRequirement> {
    return this._marginRequirements.get(asset);
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
    let marginRequirement =
      productIndex == constants.PERP_INDEX
        ? this._perpMarginRequirements.get(asset)
        : this._marginRequirements.get(asset)[productIndex];
    return this.calculateMarginRequirement(marginRequirement, size, marginType);
  }

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

  public calculateMarginRequirement(
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

  /**
   * Returns the unpaid funding for a given margin account.
   * @param account the user's spread (returns 0) or margin account.
   */
  public calculateUnpaidFunding(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount
  ): number {
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

      // Note that there is some rounding occurs here in the Zeta program
      // but we omit it in this function for simplicity
      funding += -1 * size * deltaDiff;
    }
    return funding;
  }

  /**
   * Returns the unrealized pnl for a given margin or spread account.
   * @param account the user's spread or margin account.
   */
  public calculateUnrealizedPnl(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount,
    executionPrice: number = undefined,
    addTakerFees: boolean = false
  ): number {
    let pnl = 0;

    let i_list = [];

    if (accountType == types.ProgramAccountType.CrossMarginAccount) {
      i_list = [...Array(constants.ACTIVE_PERP_MARKETS - 1).keys()];
    } else {
      i_list = [...Array(constants.ACTIVE_MARKETS - 1).keys()];
      i_list.push(constants.PERP_INDEX);
    }

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

      const size = position.size.toNumber();
      if (size == 0) {
        continue;
      }

      let asset;
      if (accountType == types.ProgramAccountType.CrossMarginAccount) {
        asset = assets.indexToAsset(i);
      } else {
        asset = fromProgramAsset(account.asset);
      }

      let subExchange = Exchange.getSubExchange(asset);
      if (size > 0) {
        pnl +=
          convertNativeLotSizeToDecimal(size) *
            (executionPrice ? executionPrice : subExchange.getMarkPrice()) -
          convertNativeBNToDecimal(position.costOfTrades);
      } else {
        pnl +=
          convertNativeLotSizeToDecimal(size) *
            (executionPrice ? executionPrice : subExchange.getMarkPrice()) +
          convertNativeBNToDecimal(position.costOfTrades);
      }
      if (addTakerFees) {
        pnl -=
          convertNativeLotSizeToDecimal(Math.abs(size)) *
          (convertNativeBNToDecimal(Exchange.state.nativeD1TradeFeePercentage) /
            100) *
          subExchange.getMarkPrice();
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
  public calculateTotalInitialMargin(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount,
    skipConcession: boolean = false
  ): number {
    // Margin account only has 1 asset, but for CrossMarginAccount we iterate through all assets
    let assetList =
      accountType == types.ProgramAccountType.MarginAccount
        ? [assets.fromProgramAsset(account.asset)]
        : Exchange.assets;

    let marginForMarkets = 0;
    let marketMaker = types.isMarketMaker(account);
    for (var asset of assetList) {
      const ledger =
        accountType == types.ProgramAccountType.MarginAccount
          ? account.perpProductLedger
          : account.productLedgers[assets.assetToIndex(asset)];

      let size = ledger.position.size.toNumber();
      let bidOpenOrders = ledger.orderState.openingOrders[0].toNumber();
      let askOpenOrders = ledger.orderState.openingOrders[1].toNumber();
      if (bidOpenOrders == 0 && askOpenOrders == 0 && size == 0) {
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
      let longLotsMarginReq = this.getMarginRequirement(
        asset,
        constants.PERP_INDEX,
        // Positive for buys.
        longLots,
        types.MarginType.INITIAL
      );
      let shortLotsMarginReq = this.getMarginRequirement(
        asset,
        constants.PERP_INDEX,
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
        marginForMarket += this.getMarginRequirement(
          asset,
          constants.PERP_INDEX,
          // This is signed.
          convertNativeLotSizeToDecimal(size),
          types.MarginType.MAINTENANCE
        );
      }

      marginForMarkets += marginForMarket;
    }

    return marginForMarkets;
  }

  /**
   * Returns the total maintenance margin requirement for a given account.
   * This only uses maintenance margin on positions and is used for
   * liquidations.
   * @param asset           underlying asset type
   * @param marginAccount   the user's MarginAccount.
   */
  public calculateTotalMaintenanceMargin(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount
  ): number {
    // Margin account only has 1 asset, but for CrossMarginAccount we iterate through all assets
    let assetList =
      accountType == types.ProgramAccountType.MarginAccount
        ? [assets.fromProgramAsset(account.asset)]
        : Exchange.assets;

    let margins = 0;
    for (var asset of assetList) {
      const ledger =
        accountType == types.ProgramAccountType.MarginAccount
          ? account.perpProductLedger
          : account.productLedgers[assets.assetToIndex(asset)];

      let position = ledger.position;
      let size = position.size.toNumber();
      if (size == 0) {
        continue;
      }
      margins += this.getMarginRequirement(
        asset,
        constants.PERP_INDEX,
        // This is signed.
        convertNativeLotSizeToDecimal(size),
        types.MarginType.MAINTENANCE
      );
    }

    return margins;
  }

  /**
   * Returns the total maintenance margin requirement for a given account including orders.
   * This calculates maintenance margin across all positions and orders.
   * This value is used to determine margin when sending a closing order only.
   * @param asset           underlying asset type
   * @param marginAccount   the user's MarginAccount.
   */
  public calculateTotalMaintenanceMarginIncludingOrders(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount
  ): number {
    // Margin account only has 1 asset, but for CrossMarginAccount we iterate through all assets
    let assetList =
      accountType == types.ProgramAccountType.MarginAccount
        ? [assets.fromProgramAsset(account.asset)]
        : Exchange.assets;

    let margins = 0;
    for (var asset of assetList) {
      const ledger =
        accountType == types.ProgramAccountType.MarginAccount
          ? account.perpProductLedger
          : account.productLedgers[assets.assetToIndex(asset)];
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

      margins +=
        this.getMarginRequirement(
          asset,
          constants.PERP_INDEX,
          // Positive for buys.
          longLots,
          types.MarginType.MAINTENANCE
        ) +
        this.getMarginRequirement(
          asset,
          constants.PERP_INDEX,
          // Negative for sells.
          -shortLots,
          types.MarginType.MAINTENANCE
        );
    }

    return margins;
  }

  /**
   * Returns the aggregate margin account state.
   * @param crossMarginAccount   the user's CrossMarginAccount.
   */
  public getCrossMarginAccountState(
    marginAccount: CrossMarginAccount,
    pnlExecutionPrice: number = undefined,
    pnlAddTakerFees: boolean = false
  ): types.MarginAccountState {
    let balance = convertNativeBNToDecimal(marginAccount.balance);
    let accType = types.ProgramAccountType.CrossMarginAccount;
    let unrealizedPnl = this.calculateUnrealizedPnl(
      marginAccount,
      accType,
      pnlExecutionPrice,
      pnlAddTakerFees
    );
    let unpaidFunding = this.calculateUnpaidFunding(marginAccount, accType);
    let initialMargin = this.calculateTotalInitialMargin(
      marginAccount,
      accType
    );
    let initialMarginSkipConcession = this.calculateTotalInitialMargin(
      marginAccount,
      accType,
      true
    );
    let maintenanceMargin = this.calculateTotalMaintenanceMargin(
      marginAccount,
      accType
    );
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
   * Returns the aggregate margin account state.
   * @param marginAccount   the user's MarginAccount.
   */
  public getMarginAccountState(
    marginAccount: MarginAccount,
    pnlExecutionPrice: number = undefined,
    pnlAddTakerFees: boolean = false
  ): types.MarginAccountState {
    let balance = convertNativeBNToDecimal(marginAccount.balance);
    let unrealizedPnl = this.calculateUnrealizedPnl(
      marginAccount,
      types.ProgramAccountType.MarginAccount,
      pnlExecutionPrice,
      pnlAddTakerFees
    );
    let unpaidFunding = this.calculateUnpaidFunding(marginAccount);
    let initialMargin = this.calculateTotalInitialMargin(marginAccount);
    let initialMarginSkipConcession = this.calculateTotalInitialMargin(
      marginAccount,
      types.ProgramAccountType.MarginAccount,
      true
    );
    let maintenanceMargin = this.calculateTotalMaintenanceMargin(marginAccount);
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

  public calculatePositionMovement(
    user: Client,
    asset: Asset,
    movementType: types.MovementType,
    movements: instructions.PositionMovementArg[]
  ): PositionMovementEvent {
    if (movements.length > constants.MAX_POSITION_MOVEMENTS) {
      throw Error("Exceeded max position movements.");
    }

    let marginAccount = user.getMarginAccount(asset);
    let spreadAccount = user.getSpreadAccount(asset);

    if (spreadAccount === null) {
      let positions = [];
      let positionsPadding = [];
      let seriesExpiry = [];
      for (let i = 0; i < constants.ACTIVE_MARKETS - 1; i++) {
        positions.push({
          size: new BN(0),
          costOfTrades: new BN(0),
        });
      }
      for (let i = 0; i < constants.TOTAL_MARKETS; i++) {
        positionsPadding.push({
          size: new BN(0),
          costOfTrades: new BN(0),
        });
      }
      for (
        let i = 0;
        i < constants.TOTAL_MARKETS - (constants.ACTIVE_MARKETS - 1);
        i++
      ) {
        seriesExpiry.push(new BN(0));
      }

      spreadAccount = {
        authority: marginAccount.authority,
        nonce: 0,
        balance: new BN(0),
        seriesExpiry,
        seriesExpiryPadding: new BN(0),
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
      Exchange.oracle.getPrice(asset).price
    );

    // Perform movement by movement type onto new margin and spread accounts
    movePositions(
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

import { exchange as Exchange } from "./exchange";
import * as types from "./types";
import * as constants from "./constants";
import { MarginAccount, PositionMovementEvent } from "./program-types";
import {
  convertNativeBNToDecimal,
  convertNativeLotSizeToDecimal,
} from "./utils";
import { Asset, fromProgramAsset } from "./assets";
import { BN } from "@project-serum/anchor";
import { assets, Client, instructions, utils } from ".";
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
    this._perpMarginRequirements.set(
      asset,
      calculateProductMargin(asset, constants.PERP_INDEX, spotPrice)
    );
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
    return this.calculateMarginRequirement(
      this._marginRequirements.get(asset)[productIndex],
      size,
      marginType
    );
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
   * Returns the unrealized pnl for a given margin or spread account.
   * @param account the user's spread or margin account.
   */
  public calculateUnrealizedPnl(
    account: any,
    accountType: types.ProgramAccountType = types.ProgramAccountType
      .MarginAccount
  ): number {
    let pnl = 0;

    for (var i = 0; i < constants.ACTIVE_MARKETS - 1; i++) {
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
  public calculateTotalInitialMargin(
    marginAccount: MarginAccount,
    skipConcession: boolean = false
  ): number {
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
        i,
        // Positive for buys.
        longLots,
        types.MarginType.INITIAL
      );
      let shortLotsMarginReq = this.getMarginRequirement(
        asset,
        i,
        // Negative for sells.
        -shortLots,
        types.MarginType.INITIAL
      );
      if ((i + 1) % constants.PRODUCTS_PER_EXPIRY == 0) {
        marginForMarket =
          longLots > shortLots ? longLotsMarginReq : shortLotsMarginReq;
      } else {
        marginForMarket = longLotsMarginReq + shortLotsMarginReq;
      }

      if (marketMaker && !skipConcession) {
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
    let initialMarginSkipConcession = this.calculateTotalInitialMargin(
      marginAccount,
      true
    );
    let maintenanceMargin = this.calculateTotalMaintenanceMargin(marginAccount);
    let availableBalanceInitial: number =
      balance + unrealizedPnl - initialMargin;
    let availableBalanceWithdrawable: number =
      balance + unrealizedPnl - initialMarginSkipConcession;
    let availableBalanceMaintenance: number =
      balance + unrealizedPnl - maintenanceMargin;
    return {
      balance,
      initialMargin,
      initialMarginSkipConcession,
      maintenanceMargin,
      unrealizedPnl,
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
      for (let i = 0; i < constants.ACTIVE_MARKETS; i++) {
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
        i < constants.TOTAL_MARKETS - constants.ACTIVE_MARKETS;
        i++
      ) {
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
      Exchange.oracle.getPrice(asset).price
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

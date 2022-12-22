import * as anchor from "@project-serum/anchor";
import * as utils from "./utils";
import { Asset, assetToName } from "./assets";
import * as constants from "./constants";
import { exchange as Exchange } from "./exchange";
import {
  SpreadAccount,
  MarginAccount,
  PositionMovementEvent,
} from "./program-types";
import {
  PublicKey,
  Connection,
  Transaction,
  TransactionSignature,
  AccountInfo,
  Context,
  TransactionInstruction,
} from "@solana/web3.js";
import * as types from "./types";
import * as instructions from "./program-instructions";
import { EventType } from "./events";
import { Client } from "./client";
import { SubExchange } from "./subexchange";

export class SubClient {
  /**
   * Stores the user margin account state.
   */
  public get marginAccount(): MarginAccount | null {
    return this._marginAccount;
  }
  private _marginAccount: MarginAccount | null;

  /**
   * SubClient margin account address.
   */
  public get marginAccountAddress(): PublicKey {
    return this._marginAccountAddress;
  }
  private _marginAccountAddress: PublicKey;

  /**
   * SubClient's underlying asset, used to grab the subExchange.
   */
  public get asset(): Asset {
    return this._asset;
  }
  private _asset: Asset;

  /**
   * A reference to this subclient's parent, to grab things like usdc and whitelist addresses
   */
  public get parent(): Client {
    return this._parent;
  }
  private _parent: Client;

  /**
   * A reference to the subExchange corresponding to the same asset this subclient is using,
   * so that we don't need to fetch it every time
   */
  public get subExchange(): SubExchange {
    return this._subExchange;
  }
  private _subExchange: SubExchange;

  /**
   * Stores the user margin account state.
   */
  public get spreadAccount(): SpreadAccount | null {
    return this._spreadAccount;
  }
  private _spreadAccount: SpreadAccount | null;

  /**
   * SubClient margin account address.
   */
  public get spreadAccountAddress(): PublicKey {
    return this._spreadAccountAddress;
  }
  private _spreadAccountAddress: PublicKey;

  /**
   * User open order addresses.
   * If a user hasn't initialized it, it is set to PublicKey.default
   */
  public get openOrdersAccounts(): PublicKey[] {
    return this._openOrdersAccounts;
  }
  private _openOrdersAccounts: PublicKey[];

  /**
   * Returns a list of the user's current orders.
   */
  public get orders(): types.Order[] {
    return this._orders;
  }
  private _orders: types.Order[];

  /**
   * Returns a list of user current margin account positions.
   */
  public get marginPositions(): types.Position[] {
    return this._marginPositions;
  }
  private _marginPositions: types.Position[];

  /**
   * Returns a list of user current spread account positions.
   */
  public get spreadPositions(): types.Position[] {
    return this._spreadPositions;
  }
  private _spreadPositions: types.Position[];

  /**
   * The subscription id for the margin account subscription.
   */
  private _marginAccountSubscriptionId: number = undefined;

  /**
   * The subscription id for the spread account subscription.
   */
  private _spreadAccountSubscriptionId: number = undefined;

  /**
   * Last update timestamp.
   */
  private _lastUpdateTimestamp: number;

  /**
   * Pending update.
   */
  private _pendingUpdate: boolean;

  /**
   * The context slot of the pending update.
   */
  private _pendingUpdateSlot: number = 0;

  /**
   * Polling interval.
   */
  public get pollInterval(): number {
    return this._pollInterval;
  }
  public set pollInterval(interval: number) {
    if (interval < 0) {
      throw Error("Polling interval invalid!");
    }
    this._pollInterval = interval;
  }
  private _pollInterval: number = constants.DEFAULT_CLIENT_POLL_INTERVAL;

  /**
   * User passed callback on load, stored for polling.
   */
  private _callback: (asset: Asset, type: EventType, data: any) => void;

  private _updatingState: boolean = false;

  private _updatingStateTimestamp: number = undefined;

  private constructor(asset: Asset, parent: Client) {
    this._asset = asset;
    this._subExchange = Exchange.getSubExchange(asset);
    this._openOrdersAccounts = Array(constants.TOTAL_MARKETS).fill(
      PublicKey.default
    );
    this._parent = parent;

    this._marginPositions = [];
    this._spreadPositions = [];
    this._orders = [];
    this._lastUpdateTimestamp = 0;
    this._pendingUpdate = false;
    this._marginAccount = null;
    this._spreadAccount = null;
  }

  /**
   * Returns a new instance of SubClient, based off state in the Exchange singleton.
   * Requires the Exchange to be in a valid state to succeed.
   *
   * @param throttle    Defaults to true.
   *                    If set to false, margin account callbacks will also call
   *                    `updateState` instead of waiting for the poll.
   */
  public static async load(
    asset: Asset,
    parent: Client,
    connection: Connection,
    wallet: types.Wallet,
    callback: (asset: Asset, type: EventType, data: any) => void = undefined,
    throttle: boolean = false
  ): Promise<SubClient> {
    let subClient = new SubClient(asset, parent);
    let [marginAccountAddress, _marginAccountNonce] =
      await utils.getMarginAccount(
        Exchange.programId,
        subClient._subExchange.zetaGroupAddress,
        wallet.publicKey
      );

    let [spreadAccountAddress, _spreadAccountNonce] =
      await utils.getSpreadAccount(
        Exchange.programId,
        subClient._subExchange.zetaGroupAddress,
        wallet.publicKey
      );

    subClient._marginAccountAddress = marginAccountAddress;
    subClient._spreadAccountAddress = spreadAccountAddress;

    subClient._callback = callback;

    subClient._marginAccountSubscriptionId = connection.onAccountChange(
      subClient._marginAccountAddress,
      async (accountInfo: AccountInfo<Buffer>, context: Context) => {
        subClient._marginAccount = Exchange.program.coder.accounts.decode(
          types.ProgramAccountType.MarginAccount,
          accountInfo.data
        );

        if (throttle || subClient._updatingState) {
          subClient._pendingUpdate = true;
          subClient._pendingUpdateSlot = context.slot;
          return;
        }

        await subClient.updateState(false);
        subClient._lastUpdateTimestamp = Exchange.clockTimestamp;

        if (callback !== undefined) {
          callback(asset, EventType.USER, null);
        }

        await subClient.updateOpenOrdersAddresses();
      },
      connection.commitment
    );

    subClient._spreadAccountSubscriptionId = connection.onAccountChange(
      subClient._spreadAccountAddress,
      async (accountInfo: AccountInfo<Buffer>, _context: Context) => {
        subClient._spreadAccount = Exchange.program.coder.accounts.decode(
          types.ProgramAccountType.SpreadAccount,
          accountInfo.data
        );

        subClient.updateSpreadPositions();

        if (callback !== undefined) {
          callback(asset, EventType.USER, null);
        }
      },
      connection.commitment
    );

    try {
      subClient._marginAccount =
        (await Exchange.program.account.marginAccount.fetch(
          subClient._marginAccountAddress
        )) as unknown as MarginAccount;

      // Set open order pdas for initialized accounts.
      await subClient.updateOpenOrdersAddresses();
      subClient.updateMarginPositions();
      // We don't update orders here to make load faster.
      subClient._pendingUpdate = true;
    } catch (e) {
      console.log(`User does not have a margin account for ${asset}.`);
    }

    try {
      subClient._spreadAccount =
        (await Exchange.program.account.spreadAccount.fetch(
          subClient._spreadAccountAddress
        )) as unknown as SpreadAccount;
      subClient.updateSpreadPositions();
    } catch (e) {
      console.log(`User does not have a spread account for ${asset}.`);
    }

    return subClient;
  }

  public async pollUpdate() {
    if (
      Exchange.clockTimestamp >
        this._lastUpdateTimestamp + this._pollInterval ||
      this._pendingUpdate
    ) {
      try {
        if (this._updatingState) {
          return;
        }
        let latestSlot = this._pendingUpdateSlot;
        await this.updateState();
        // If there was a margin account websocket callback, we want to
        // trigger an `updateState` on the next timer tick.
        if (latestSlot == this._pendingUpdateSlot) {
          this._pendingUpdate = false;
        }
        this._lastUpdateTimestamp = Exchange.clockTimestamp;
        if (this._callback !== undefined) {
          this._callback(this.asset, EventType.USER, null);
        }
      } catch (e) {
        console.log(`SubClient poll update failed. Error: ${e}`);
      }
    }
  }

  private toggleUpdateState(toggleOn: boolean) {
    if (toggleOn) {
      this._updatingState = true;
      this._updatingStateTimestamp = Date.now() / 1000;
    } else {
      this._updatingState = false;
      this._updatingStateTimestamp = undefined;
    }
  }

  // Safety to reset this._updatingState
  private checkResetUpdatingState() {
    if (
      this._updatingState &&
      Date.now() / 1000 - this._updatingStateTimestamp >
        constants.UPDATING_STATE_LIMIT_SECONDS
    ) {
      this.toggleUpdateState(false);
    }
  }

  /**
   * Polls the margin account for the latest state.
   */
  public async updateState(fetch = true, force = false) {
    this.checkResetUpdatingState();

    if (this._updatingState && !force) {
      return;
    }

    this.toggleUpdateState(true);

    if (fetch) {
      try {
        this._marginAccount =
          (await Exchange.program.account.marginAccount.fetch(
            this._marginAccountAddress
          )) as unknown as MarginAccount;
      } catch (e) {
        this.toggleUpdateState(false);
        return;
      }

      try {
        this._spreadAccount =
          (await Exchange.program.account.spreadAccount.fetch(
            this._spreadAccountAddress
          )) as unknown as SpreadAccount;
      } catch (e) {}
    }

    try {
      if (this._marginAccount !== null) {
        this.updateMarginPositions();
        await this.updateOrders();
      }

      if (this._spreadAccount !== null) {
        this.updateSpreadPositions();
      }
    } catch (e) {}

    this.toggleUpdateState(false);
  }

  /**
   * @param amount  the native amount to deposit (6 decimals fixed point)
   */
  public async deposit(amount: number): Promise<TransactionSignature> {
    // Check if the user has a USDC account.
    let tx = new Transaction();
    if (this._marginAccount === null) {
      console.log("User has no margin account. Creating margin account...");
      tx.add(
        instructions.initializeMarginAccountIx(
          this._subExchange.zetaGroupAddress,
          this._marginAccountAddress,
          this._parent.publicKey
        )
      );
    }
    tx.add(
      await instructions.depositIx(
        this.asset,
        amount,
        this._marginAccountAddress,
        this._parent.usdcAccountAddress,
        this._parent.publicKey,
        this._parent.whitelistDepositAddress
      )
    );
    let txId = await utils.processTransaction(this._parent.provider, tx);
    return txId;
  }

  /**
   * Closes a subClient's margin account
   */
  public async closeMarginAccount(): Promise<TransactionSignature> {
    if (this._marginAccount === null) {
      throw Error("User has no margin account to close");
    }

    let tx = new Transaction().add(
      instructions.closeMarginAccountIx(
        this.asset,
        this._parent.publicKey,
        this._marginAccountAddress
      )
    );
    let txId = await utils.processTransaction(this._parent.provider, tx);
    this._marginAccount = null;
    return txId;
  }

  /**
   * Closes a subClient's spread account
   */
  public async closeSpreadAccount(): Promise<TransactionSignature> {
    if (this._spreadAccount === null) {
      throw Error("User has no spread account to close");
    }
    let subExchange = this._subExchange;
    let tx = new Transaction();
    tx.add(
      instructions.transferExcessSpreadBalanceIx(
        subExchange.zetaGroupAddress,
        this.marginAccountAddress,
        this._spreadAccountAddress,
        this._parent.publicKey
      )
    );
    tx.add(
      instructions.closeSpreadAccountIx(
        subExchange.zetaGroupAddress,
        this._spreadAccountAddress,
        this._parent.publicKey
      )
    );
    let txId = await utils.processTransaction(this._parent.provider, tx);
    this._spreadAccount = null;
    return txId;
  }

  /**
   * @param amount  the native amount to withdraw (6 dp)
   */
  public async withdraw(amount: number): Promise<TransactionSignature> {
    let tx = new Transaction();
    tx.add(
      instructions.withdrawIx(
        this.asset,
        amount,
        this._marginAccountAddress,
        this._parent.usdcAccountAddress,
        this._parent.publicKey
      )
    );
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Withdraws the entirety of the subClient's margin account and then closes it.
   */
  public async withdrawAndCloseMarginAccount(): Promise<TransactionSignature> {
    if (this._marginAccount === null) {
      throw Error("User has no margin account to withdraw or close.");
    }
    let tx = new Transaction();
    tx.add(
      instructions.withdrawIx(
        this.asset,
        this._marginAccount.balance.toNumber(),
        this._marginAccountAddress,
        this._parent.usdcAccountAddress,
        this._parent.publicKey
      )
    );
    tx.add(
      instructions.closeMarginAccountIx(
        this.asset,
        this._parent.publicKey,
        this._marginAccountAddress
      )
    );
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Places a fill or kill  order on a zeta market.
   * If successful - it will lock the full size into a user's spread account.
   * It will create the spread account if the user didn't have one already.
   * @param market          the address of the serum market
   * @param price           the native price of the order (6 d.p as integer)
   * @param size            the quantity of the order (3 d.p)
   * @param side            the side of the order. bid / ask
   */
  public async placeOrderAndLockPosition(
    market: PublicKey,
    price: number,
    size: number,
    side: types.Side,
    tag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let subExchange = this._subExchange;
    let marketIndex = subExchange.markets.getMarketIndex(market);

    let openOrdersPda = null;
    if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      console.log(
        `User doesn't have open orders account. Initialising for market ${market.toString()}.`
      );
      let [initIx, _openOrdersPda] = await instructions.initializeOpenOrdersIx(
        this.asset,
        market,
        this._parent.publicKey,
        this.marginAccountAddress
      );
      openOrdersPda = _openOrdersPda;
      tx.add(initIx);
    } else {
      openOrdersPda = this._openOrdersAccounts[marketIndex];
    }

    let orderIx = instructions.placeOrderV4Ix(
      this.asset,
      marketIndex,
      price,
      size,
      side,
      types.OrderType.FILLORKILL,
      0, // Default to none for now.
      tag,
      0,
      this.marginAccountAddress,
      this._parent.publicKey,
      openOrdersPda,
      this._parent.whitelistTradingFeesAddress
    );

    tx.add(orderIx);

    if (this.spreadAccount == null) {
      console.log("User has no spread account. Creating spread account...");
      tx.add(
        instructions.initializeSpreadAccountIx(
          subExchange.zetaGroupAddress,
          this.spreadAccountAddress,
          this._parent.publicKey
        )
      );
    }

    let movementSize = side == types.Side.BID ? size : -size;
    let movements: instructions.PositionMovementArg[] = [
      {
        index: marketIndex,
        size: new anchor.BN(movementSize),
      },
    ];

    tx.add(
      instructions.positionMovementIx(
        this._asset,
        subExchange.zetaGroupAddress,
        this.marginAccountAddress,
        this.spreadAccountAddress,
        this._parent.publicKey,
        subExchange.greeksAddress,
        subExchange.zetaGroup.oracle,
        types.MovementType.LOCK,
        movements
      )
    );

    let txId = await utils.processTransaction(this._parent.provider, tx);
    this._openOrdersAccounts[marketIndex] = openOrdersPda;

    return txId;
  }

  /**
   * Places an order on a zeta market.
   * @param market          the address of the serum market
   * @param price           the native price of the order (6 d.p as integer)
   * @param size            the quantity of the order (3 d.p)
   * @param side            the side of the order. bid / ask
   * @param explicitTIF     whether to calculate the relative TIF offset or use absolute TIF offset
   * @param tifOffset       the TIF offset at which the order will expire
   * @param orderType       the type of the order. limit / ioc / post-only
   * @param clientOrderId   optional: subClient order id (non 0 value)
   * @param tag             optional: the string tag corresponding to who is inserting
   * NOTE: If duplicate subClient order ids are used, after a cancel order,
   * to cancel the second order with the same subClient order id,
   * you may need to crank the corresponding event queue to flush that order id
   * from the user open orders account before cancelling the second order.
   * (Depending on the order in which the order was cancelled).
   */
  public async placeOrder(
    market: PublicKey,
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = this._subExchange.markets.getMarketIndex(market);

    let openOrdersPda = null;
    if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      console.log(
        `[${assetToName(
          this.asset
        )}] User doesn't have open orders account. Initialising for market ${market.toString()}.`
      );

      let [initIx, _openOrdersPda] = await instructions.initializeOpenOrdersIx(
        this.asset,
        market,
        this._parent.publicKey,
        this.marginAccountAddress
      );
      openOrdersPda = _openOrdersPda;
      tx.add(initIx);
    } else {
      openOrdersPda = this._openOrdersAccounts[marketIndex];
    }

    let tifOffsetToUse = utils.getTIFOffset(
      this._subExchange.markets.getMarket(market),
      options.explicitTIF != undefined ? options.explicitTIF : true,
      options.tifOffset != undefined ? options.tifOffset : 0
    );

    let orderIx = instructions.placeOrderV4Ix(
      this.asset,
      marketIndex,
      price,
      size,
      side,
      options.orderType != undefined
        ? options.orderType
        : types.OrderType.LIMIT,
      options.clientOrderId != undefined ? options.clientOrderId : 0,
      options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
      tifOffsetToUse,
      this.marginAccountAddress,
      this._parent.publicKey,
      openOrdersPda,
      this._parent.whitelistTradingFeesAddress
    );

    tx.add(orderIx);

    let txId: TransactionSignature;
    txId = await utils.processTransaction(
      this._parent.provider,
      tx,
      undefined,
      undefined,
      undefined,
      options.blockhash
    );
    this._openOrdersAccounts[marketIndex] = openOrdersPda;
    return txId;
  }

  /**
   * Places an order on a zeta perp market.
   * @param price           the native price of the order (6 d.p as integer)
   * @param size            the quantity of the order (3 d.p)
   * @param side            the side of the order. bid / ask
   * @param orderType       the type of the order. limit / ioc / post-only
   * @param clientOrderId   optional: subClient order id (non 0 value)
   * @param tag             optional: the string tag corresponding to who is inserting
   * NOTE: If duplicate subClient order ids are used, after a cancel order,
   * to cancel the second order with the same subClient order id,
   * you may need to crank the corresponding event queue to flush that order id
   * from the user open orders account before cancelling the second order.
   * (Depending on the order in which the order was cancelled).
   */
  public async placePerpOrder(
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let market = Exchange.getPerpMarket(this._asset).address;
    let marketIndex = constants.PERP_INDEX;

    let openOrdersPda = null;
    if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      console.log(
        `[${assetToName(
          this.asset
        )}] User doesn't have open orders account. Initialising for market ${market.toString()}.`
      );

      let [initIx, _openOrdersPda] = await instructions.initializeOpenOrdersIx(
        this.asset,
        market,
        this._parent.publicKey,
        this.marginAccountAddress
      );
      openOrdersPda = _openOrdersPda;
      tx.add(initIx);
    } else {
      openOrdersPda = this._openOrdersAccounts[marketIndex];
    }

    let tifOffsetToUse = utils.getTIFOffset(
      this._subExchange.markets.getMarket(market),
      options.explicitTIF != undefined ? options.explicitTIF : true,
      options.tifOffset != undefined ? options.tifOffset : 0
    );
    let orderIx = instructions.placePerpOrderV2Ix(
      this.asset,
      marketIndex,
      price,
      size,
      side,
      options.orderType != undefined
        ? options.orderType
        : types.OrderType.LIMIT,
      options.clientOrderId != undefined ? options.clientOrderId : 0,
      options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
      tifOffsetToUse,
      this.marginAccountAddress,
      this._parent.publicKey,
      openOrdersPda,
      this._parent.whitelistTradingFeesAddress
    );

    tx.add(orderIx);

    let txId: TransactionSignature;
    txId = await utils.processTransaction(
      this._parent.provider,
      tx,
      undefined,
      undefined,
      undefined,
      options.blockhash
    );
    this._openOrdersAccounts[marketIndex] = openOrdersPda;
    return txId;
  }

  public createCancelOrderNoErrorInstruction(
    marketIndex: number,
    orderId: anchor.BN,
    side: types.Side
  ): TransactionInstruction {
    return instructions.cancelOrderNoErrorIx(
      this.asset,
      marketIndex,
      this._parent.publicKey,
      this._marginAccountAddress,
      this._openOrdersAccounts[marketIndex],
      orderId,
      side
    );
  }

  public createCancelAllMarketOrdersInstruction(
    marketIndex: number
  ): TransactionInstruction {
    return instructions.cancelAllMarketOrdersIx(
      this.asset,
      marketIndex,
      this._parent.publicKey,
      this._marginAccountAddress,
      this._openOrdersAccounts[marketIndex]
    );
  }

  public createPlaceOrderInstruction(
    marketIndex: number,
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions
  ): TransactionInstruction {
    if (marketIndex == constants.PERP_INDEX) {
      return this.createPlacePerpOrderInstruction(price, size, side, options);
    }

    let tifOffsetToUse = utils.getTIFOffset(
      Exchange.getMarket(this._asset, marketIndex),
      options.explicitTIF != undefined ? options.explicitTIF : true,
      options.tifOffset != undefined ? options.tifOffset : 0
    );

    return instructions.placeOrderV4Ix(
      this.asset,
      marketIndex,
      price,
      size,
      side,
      options.orderType != undefined
        ? options.orderType
        : types.OrderType.LIMIT,
      options.clientOrderId != undefined ? options.clientOrderId : 0,
      options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
      tifOffsetToUse,
      this.marginAccountAddress,
      this._parent.publicKey,
      this._openOrdersAccounts[marketIndex],
      this._parent.whitelistTradingFeesAddress
    );
  }

  public createPlacePerpOrderInstruction(
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions
  ): TransactionInstruction {
    if (
      this._openOrdersAccounts[constants.PERP_INDEX].equals(PublicKey.default)
    ) {
      console.log(
        `No open orders account for ${assetToName(
          this.asset
        )}-PERP. Please call client.placeOrder() or client.initializeOpenOrdersAccount()`
      );
      throw Error("User does not have an open orders account.");
    }
    return instructions.placePerpOrderV2Ix(
      this.asset,
      constants.PERP_INDEX,
      price,
      size,
      side,
      options.orderType != undefined
        ? options.orderType
        : types.OrderType.LIMIT,
      options.clientOrderId != undefined ? options.clientOrderId : 0,
      options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
      options.tifOffset != undefined ? options.tifOffset : 0,
      this.marginAccountAddress,
      this._parent.publicKey,
      this._openOrdersAccounts[constants.PERP_INDEX],
      this._parent.whitelistTradingFeesAddress
    );
  }

  /**
   * Cancels a user order by orderId
   * @param market     the market address of the order to be cancelled.
   * @param orderId    the order id of the order.
   * @param side       the side of the order. bid / ask.
   */
  public async cancelOrder(
    market: PublicKey,
    orderId: anchor.BN,
    side: types.Side
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let index = this._subExchange.markets.getMarketIndex(market);
    let ix = instructions.cancelOrderIx(
      this.asset,
      index,
      this._parent.publicKey,
      this._marginAccountAddress,
      this._openOrdersAccounts[index],
      orderId,
      side
    );
    tx.add(ix);
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Cancels a user order by subClient order id.
   * It will only cancel the FIRST
   * @param market          the market address of the order to be cancelled.
   * @param clientOrderId   the subClient order id of the order. (Non zero value).
   */
  public async cancelOrderByClientOrderId(
    market: PublicKey,
    clientOrderId: number
  ): Promise<TransactionSignature> {
    if (clientOrderId == 0) {
      throw Error("SubClient order id cannot be 0.");
    }
    let tx = new Transaction();
    let index = this._subExchange.markets.getMarketIndex(market);
    let ix = instructions.cancelOrderByClientOrderIdIx(
      this.asset,
      index,
      this._parent.publicKey,
      this._marginAccountAddress,
      this._openOrdersAccounts[index],
      new anchor.BN(clientOrderId)
    );
    tx.add(ix);
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Cancels a user order by orderId and atomically places an order
   * @param market     the market address of the order to be cancelled.
   * @param orderId    the order id of the order.
   * @param cancelSide       the side of the order. bid / ask.
   * @param newOrderPrice  the native price of the order (6 d.p) as integer
   * @param newOrderSize   the quantity of the order (3 d.p) as integer
   * @param newOrderSide   the side of the order. bid / ask
   * @param newOrderType   the type of the order, limit / ioc / post-only
   * @param clientOrderId   optional: subClient order id (non 0 value)
   * @param newOrderTag     optional: the string tag corresponding to who is inserting. Default "SDK", max 4 length
   */
  public async cancelAndPlaceOrder(
    market: PublicKey,
    orderId: anchor.BN,
    cancelSide: types.Side,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    options: types.OrderOptions
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = this._subExchange.markets.getMarketIndex(market);
    tx.add(
      instructions.cancelOrderIx(
        this.asset,
        marketIndex,
        this._parent.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        orderId,
        cancelSide
      )
    );

    let tifOffsetToUse = utils.getTIFOffset(
      this._subExchange.markets.getMarket(market),
      options.explicitTIF != undefined ? options.explicitTIF : true,
      options.tifOffset != undefined ? options.tifOffset : 0
    );

    tx.add(
      instructions.placeOrderV4Ix(
        this.asset,
        marketIndex,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        options.orderType != undefined
          ? options.orderType
          : types.OrderType.LIMIT,
        options.clientOrderId != undefined ? options.clientOrderId : 0,
        options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
        tifOffsetToUse,
        this.marginAccountAddress,
        this._parent.publicKey,
        this._openOrdersAccounts[marketIndex],
        this._parent.whitelistTradingFeesAddress
      )
    );
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Cancels a user order by subClient order id and atomically places an order by new subClient order id.
   * @param market                  the market address of the order to be cancelled and new order.
   * @param cancelClientOrderId     the subClient order id of the order to be cancelled.
   * @param newOrderPrice           the native price of the order (6 d.p) as integer
   * @param newOrderSize            the quantity of the order (3 d.p) as integer
   * @param newOrderSide            the side of the order. bid / ask
   * @param newOrderType            the type of the order, limit / ioc / post-only
   * @param newOrderClientOrderId   the subClient order id for the new order
   * @param newOrderTag     optional: the string tag corresponding to who is inserting. Default "SDK", max 4 length
   */
  public async cancelAndPlaceOrderByClientOrderId(
    market: PublicKey,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOptions: types.OrderOptions
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = this._subExchange.markets.getMarketIndex(market);
    tx.add(
      instructions.cancelOrderByClientOrderIdIx(
        this.asset,
        marketIndex,
        this._parent.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        new anchor.BN(cancelClientOrderId)
      )
    );

    let tifOffsetToUse = utils.getTIFOffset(
      this._subExchange.markets.getMarket(market),
      newOptions.explicitTIF != undefined ? newOptions.explicitTIF : true,
      newOptions.tifOffset != undefined ? newOptions.tifOffset : 0
    );
    tx.add(
      instructions.placeOrderV4Ix(
        this.asset,
        marketIndex,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        newOptions.orderType != undefined
          ? newOptions.orderType
          : types.OrderType.LIMIT,
        newOptions.clientOrderId != undefined ? newOptions.clientOrderId : 0,
        newOptions.tag != undefined
          ? newOptions.tag
          : constants.DEFAULT_ORDER_TAG,
        tifOffsetToUse,
        this.marginAccountAddress,
        this._parent.publicKey,
        this._openOrdersAccounts[marketIndex],
        this._parent.whitelistTradingFeesAddress
      )
    );
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Cancels a user order by client order id and atomically places an order by new client order id.
   * Uses the 'NoError' cancel instruction, so a failed cancellation won't prohibit the placeOrder
   * @param market                  the market address of the order to be cancelled and new order.
   * @param cancelClientOrderId     the client order id of the order to be cancelled.
   * @param newOrderPrice           the native price of the order (6 d.p) as integer
   * @param newOrderSize            the quantity of the order (3 d.p) as integer
   * @param newOrderSide            the side of the order. bid / ask
   * @param newOrderType            the type of the order, limit / ioc / post-only
   * @param newOrderClientOrderId   the client order id for the new order
   * @param newOrderTag     optional: the string tag corresponding to who is inserting. Default "SDK", max 4 length
   */
  public async replaceByClientOrderId(
    market: PublicKey,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOptions: types.OrderOptions
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = this._subExchange.markets.getMarketIndex(market);
    tx.add(
      instructions.cancelOrderByClientOrderIdNoErrorIx(
        this.asset,
        marketIndex,
        this._parent.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        new anchor.BN(cancelClientOrderId)
      )
    );

    let tifOffsetToUse = utils.getTIFOffset(
      this._subExchange.markets.getMarket(market),
      newOptions.explicitTIF != undefined ? newOptions.explicitTIF : true,
      newOptions.tifOffset != undefined ? newOptions.tifOffset : 0
    );
    tx.add(
      instructions.placeOrderV4Ix(
        this.asset,
        marketIndex,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        newOptions.orderType != undefined
          ? newOptions.orderType
          : types.OrderType.LIMIT,
        newOptions.clientOrderId != undefined ? newOptions.clientOrderId : 0,
        newOptions.tag != undefined
          ? newOptions.tag
          : constants.DEFAULT_ORDER_TAG,
        tifOffsetToUse,
        this.marginAccountAddress,
        this._parent.publicKey,
        this._openOrdersAccounts[marketIndex],
        this._parent.whitelistTradingFeesAddress
      )
    );
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Initializes a user open orders account for a given market.
   * This is handled atomically by place order but can be used by subClients to initialize it independent of placing an order.
   */
  public async initializeOpenOrdersAccount(
    market: PublicKey
  ): Promise<TransactionSignature> {
    let marketIndex = this._subExchange.markets.getMarketIndex(market);
    if (!this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      throw Error("User already has an open orders account for market!");
    }

    let [initIx, openOrdersPda] = await instructions.initializeOpenOrdersIx(
      this.asset,
      market,
      this._parent.publicKey,
      this.marginAccountAddress
    );

    let tx = new Transaction().add(initIx);
    let txId = await utils.processTransaction(this._parent.provider, tx);
    this._openOrdersAccounts[marketIndex] = openOrdersPda;
    return txId;
  }

  /**
   * Closes a user open orders account for a given market.
   */
  public async closeOpenOrdersAccount(
    market: PublicKey
  ): Promise<TransactionSignature> {
    let marketIndex = this._subExchange.markets.getMarketIndex(market);
    if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      throw Error("User has no open orders account for this market!");
    }

    const [vaultOwner, _vaultSignerNonce] =
      await utils.getSerumVaultOwnerAndNonce(
        market,
        constants.DEX_PID[Exchange.network]
      );

    let tx = new Transaction();
    tx.add(
      instructions.settleDexFundsIx(
        this.asset,
        market,
        vaultOwner,
        this._openOrdersAccounts[marketIndex]
      )
    );

    tx.add(
      await instructions.closeOpenOrdersIx(
        this.asset,
        market,
        this._parent.publicKey,
        this.marginAccountAddress,
        this._openOrdersAccounts[marketIndex]
      )
    );
    let txId = await utils.processTransaction(this._parent.provider, tx);
    this._openOrdersAccounts[marketIndex] = PublicKey.default;
    return txId;
  }

  /**
   * Closes multiple user open orders account for a given set of markets.
   * Cannot pass in multiple of the same market address
   */
  public async closeMultipleOpenOrdersAccount(
    markets: PublicKey[]
  ): Promise<TransactionSignature[]> {
    let combinedIxs: TransactionInstruction[] = [];
    let subExchange = this._subExchange;
    for (var i = 0; i < markets.length; i++) {
      let market = markets[i];
      let marketIndex = subExchange.markets.getMarketIndex(market);
      if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
        throw Error("User has no open orders account for this market!");
      }
      const [vaultOwner, _vaultSignerNonce] =
        await utils.getSerumVaultOwnerAndNonce(
          market,
          constants.DEX_PID[Exchange.network]
        );
      let settleIx = instructions.settleDexFundsIx(
        this.asset,
        market,
        vaultOwner,
        this._openOrdersAccounts[marketIndex]
      );
      let closeIx = await instructions.closeOpenOrdersIx(
        this.asset,
        market,
        this._parent.publicKey,
        this.marginAccountAddress,
        this._openOrdersAccounts[marketIndex]
      );
      combinedIxs.push(settleIx);
      combinedIxs.push(closeIx);
    }

    let txIds: string[] = [];

    let combinedTxs = utils.splitIxsIntoTx(
      combinedIxs,
      constants.MAX_SETTLE_AND_CLOSE_PER_TX
    );

    for (var i = 0; i < combinedTxs.length; i++) {
      let tx = combinedTxs[i];
      let txId = await utils.processTransaction(this._parent.provider, tx);
      txIds.push(txId);
    }

    // Reset openOrdersAccount keys
    for (var i = 0; i < markets.length; i++) {
      let market = markets[i];
      let marketIndex = subExchange.markets.getMarketIndex(market);
      this._openOrdersAccounts[marketIndex] = PublicKey.default;
    }

    return txIds;
  }

  /**
   * Calls force cancel on another user's orders
   * @param market  Market to cancel orders on
   * @param marginAccountToCancel Users to be force-cancelled's margin account
   */
  public async forceCancelOrderByOrderId(
    market: PublicKey,
    marginAccountToCancel: PublicKey,
    orderId: anchor.BN,
    side: types.Side
  ): Promise<TransactionSignature> {
    let marginAccount = (await Exchange.program.account.marginAccount.fetch(
      marginAccountToCancel
    )) as unknown as MarginAccount;

    let marketIndex = this._subExchange.markets.getMarketIndex(market);

    let openOrdersAccountToCancel = await utils.createOpenOrdersAddress(
      Exchange.programId,
      market,
      marginAccount.authority,
      marginAccount.openOrdersNonce[marketIndex]
    );

    let tx = new Transaction();
    let ix = instructions.forceCancelOrderByOrderIdIx(
      this.asset,
      marketIndex,
      marginAccountToCancel,
      openOrdersAccountToCancel,
      orderId,
      side
    );
    tx.add(ix);
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Calls force cancel on another user's orders
   * @param market  Market to cancel orders on
   * @param marginAccountToCancel Users to be force-cancelled's margin account
   */
  public async forceCancelOrders(
    market: PublicKey,
    marginAccountToCancel: PublicKey
  ): Promise<TransactionSignature> {
    let marginAccount = (await Exchange.program.account.marginAccount.fetch(
      marginAccountToCancel
    )) as unknown as MarginAccount;

    let marketIndex = this._subExchange.markets.getMarketIndex(market);

    let openOrdersAccountToCancel = await utils.createOpenOrdersAddress(
      Exchange.programId,
      market,
      marginAccount.authority,
      marginAccount.openOrdersNonce[marketIndex]
    );

    let tx = new Transaction();
    let ix = instructions.forceCancelOrdersIx(
      this.asset,
      marketIndex,
      marginAccountToCancel,
      openOrdersAccountToCancel
    );
    tx.add(ix);
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Calls liquidate on another user
   * @param market
   * @param liquidatedMarginAccount
   * @param size                        the quantity of the order (3 d.p)
   */
  public async liquidate(
    market: PublicKey,
    liquidatedMarginAccount: PublicKey,
    size: number
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let ix = instructions.liquidateIx(
      this.asset,
      this._parent.publicKey,
      this._marginAccountAddress,
      market,
      liquidatedMarginAccount,
      size
    );
    tx.add(ix);
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Instruction builder for cancelAllOrders()
   * Returns a list of instructions cancelling all of this subclient's orders
   */
  public cancelAllOrdersIxs(): TransactionInstruction[] {
    let ixs = [];
    for (var i = 0; i < this._orders.length; i++) {
      let order = this._orders[i];
      let ix = instructions.cancelOrderIx(
        this.asset,
        order.marketIndex,
        this._parent.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[order.marketIndex],
        order.orderId,
        order.side
      );
      ixs.push(ix);
    }
    return ixs;
  }

  /**
   * Instruction builder for cancelAllOrdersNoError()
   * Returns a list of instructions cancelling all of this subclient's orders
   */
  public cancelAllOrdersNoErrorIxs(): TransactionInstruction[] {
    let ixs = [];
    for (var i = 0; i < this._orders.length; i++) {
      let order = this._orders[i];
      let ix = instructions.cancelOrderNoErrorIx(
        this.asset,
        order.marketIndex,
        this._parent.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[order.marketIndex],
        order.orderId,
        order.side
      );
      ixs.push(ix);
    }
    return ixs;
  }

  /**
   * Cancels all active user orders
   */
  public async cancelAllOrders(): Promise<TransactionSignature[]> {
    // Can only fit 6 cancels worth of accounts per transaction.
    // on 4 separate markets
    // Compute is fine.
    let txs = utils.splitIxsIntoTx(
      this.cancelAllOrdersIxs(),
      constants.MAX_CANCELS_PER_TX
    );
    let txIds: string[] = [];
    await Promise.all(
      txs.map(async (tx) => {
        txIds.push(await utils.processTransaction(this._parent.provider, tx));
      })
    );
    return txIds;
  }

  /**
   * Cancels all active user orders, but will not crash if some cancels fail
   */
  public async cancelAllOrdersNoError(): Promise<TransactionSignature[]> {
    // Can only fit 6 cancels worth of accounts per transaction.
    // on 4 separate markets
    // Compute is fine.
    let txs = utils.splitIxsIntoTx(
      this.cancelAllOrdersNoErrorIxs(),
      constants.MAX_CANCELS_PER_TX
    );
    let txIds: string[] = [];
    await Promise.all(
      txs.map(async (tx) => {
        txIds.push(await utils.processTransaction(this._parent.provider, tx));
      })
    );
    return txIds;
  }

  /**
   * Moves positions to and from spread and margin account, based on the type.
   * @param movementType    - type of movement
   * @param movements       - vector of position movements
   */
  public async positionMovement(
    movementType: types.MovementType,
    movements: instructions.PositionMovementArg[]
  ): Promise<TransactionSignature> {
    let tx = this.getPositionMovementTx(movementType, movements);
    return await utils.processTransaction(this._parent.provider, tx);
  }

  /**
   * Moves positions to and from spread and margin account, based on the type.
   * @param movementType    - type of movement
   * @param movements       - vector of position movements
   */
  public async simulatePositionMovement(
    movementType: types.MovementType,
    movements: instructions.PositionMovementArg[]
  ): Promise<PositionMovementEvent> {
    let tx = this.getPositionMovementTx(movementType, movements);
    let response = await utils.simulateTransaction(this._parent.provider, tx);

    let events = response.events;
    let positionMovementEvent = undefined;
    for (var i = 0; i < events.length; i++) {
      if (events[i].name == "PositionMovementEvent") {
        positionMovementEvent = events[i].data;
        break;
      }
    }

    if (positionMovementEvent == undefined) {
      throw new Error("Failed to simulate position movement.");
    }

    return positionMovementEvent;
  }

  private getPositionMovementTx(
    movementType: types.MovementType,
    movements: instructions.PositionMovementArg[]
  ): Transaction {
    if (movements.length > constants.MAX_POSITION_MOVEMENTS) {
      throw new Error(
        `Max position movements exceeded. Max = ${constants.MAX_POSITION_MOVEMENTS} < ${movements.length}`
      );
    }

    let tx = new Transaction();
    this.assertHasMarginAccount();
    let subExchange = this._subExchange;

    if (this.spreadAccount == null) {
      console.log("User has no spread account. Creating spread account...");
      tx.add(
        instructions.initializeSpreadAccountIx(
          subExchange.zetaGroupAddress,
          this.spreadAccountAddress,
          this._parent.publicKey
        )
      );
    }

    tx.add(
      instructions.positionMovementIx(
        this._asset,
        subExchange.zetaGroupAddress,
        this.marginAccountAddress,
        this.spreadAccountAddress,
        this._parent.publicKey,
        subExchange.greeksAddress,
        subExchange.zetaGroup.oracle,
        movementType,
        movements
      )
    );

    return tx;
  }

  /**
   * Transfers any non required balance in the spread account to margin account.
   */
  public async transferExcessSpreadBalance(): Promise<TransactionSignature> {
    let tx = new Transaction().add(
      instructions.transferExcessSpreadBalanceIx(
        this._subExchange.zetaGroupAddress,
        this.marginAccountAddress,
        this.spreadAccountAddress,
        this._parent.publicKey
      )
    );
    return await utils.processTransaction(this._parent.provider, tx);
  }

  private getRelevantMarketIndexes(): number[] {
    let indexes = [];
    for (var i = 0; i < this._marginAccount.productLedgers.length; i++) {
      let ledger = this._marginAccount.productLedgers[i];
      if (
        ledger.position.size.toNumber() !== 0 ||
        ledger.orderState.openingOrders[0].toNumber() != 0 ||
        ledger.orderState.openingOrders[1].toNumber() != 0
      ) {
        indexes.push(i);
      }
    }

    // Push perps productLedger too if relevant
    let perpLedger = this._marginAccount.perpProductLedger;
    if (
      perpLedger.position.size.toNumber() !== 0 ||
      perpLedger.orderState.openingOrders[0].toNumber() != 0 ||
      perpLedger.orderState.openingOrders[1].toNumber() != 0
    ) {
      indexes.push(constants.PERP_INDEX);
    }
    return indexes;
  }

  private async updateOrders() {
    let orders = [];
    await Promise.all(
      [...this.getRelevantMarketIndexes()].map(async (i) => {
        let market = Exchange.getMarket(this._asset, i);
        await market.updateOrderbook();
        orders.push(market.getOrdersForAccount(this._openOrdersAccounts[i]));
      })
    );

    let allOrders = [].concat(...orders);
    const asset = this._asset;
    this._orders = allOrders.filter(function (order: types.Order) {
      let seqNum = utils.getSeqNumFromSerumOrderKey(
        order.orderId,
        order.side == types.Side.BID ? true : false
      );
      let serumMarket = Exchange.getMarket(
        asset,
        order.marketIndex
      ).serumMarket;

      return !utils.isOrderExpired(
        order.tifOffset,
        seqNum,
        serumMarket.epochStartTs.toNumber(),
        serumMarket.startEpochSeqNum
      );
    });
  }

  private updateMarginPositions() {
    let positions: types.Position[] = [];
    for (var i = 0; i < this._marginAccount.productLedgers.length; i++) {
      if (this._marginAccount.productLedgers[i].position.size.toNumber() != 0) {
        positions.push({
          marketIndex: i,
          market: this._subExchange.zetaGroup.products[i].market,
          size: utils.convertNativeLotSizeToDecimal(
            this._marginAccount.productLedgers[i].position.size.toNumber()
          ),
          costOfTrades: utils.convertNativeBNToDecimal(
            this._marginAccount.productLedgers[i].position.costOfTrades
          ),
        });
      }
    }

    // perps too
    if (this._marginAccount.perpProductLedger.position.size.toNumber() != 0) {
      positions.push({
        marketIndex: constants.PERP_INDEX,
        market: this._subExchange.zetaGroup.perp.market,
        size: utils.convertNativeLotSizeToDecimal(
          this._marginAccount.perpProductLedger.position.size.toNumber()
        ),
        costOfTrades: utils.convertNativeBNToDecimal(
          this._marginAccount.perpProductLedger.position.costOfTrades
        ),
      });
    }
    this._marginPositions = positions;
  }

  private updateSpreadPositions() {
    let positions: types.Position[] = [];
    for (var i = 0; i < this._spreadAccount.positions.length; i++) {
      if (this._spreadAccount.positions[i].size.toNumber() != 0) {
        positions.push({
          marketIndex: i,
          market: this._subExchange.zetaGroup.products[i].market,
          size: utils.convertNativeLotSizeToDecimal(
            this._spreadAccount.positions[i].size.toNumber()
          ),
          costOfTrades: utils.convertNativeBNToDecimal(
            this._spreadAccount.positions[i].costOfTrades
          ),
        });
      }
    }
    this._spreadPositions = positions;
  }

  private async updateOpenOrdersAddresses() {
    await Promise.all(
      this._subExchange.zetaGroup.products.map(async (product, index) => {
        if (
          // If the nonce is not zero, we know there is an open orders account.
          this._marginAccount.openOrdersNonce[index] !== 0 &&
          // If this is equal to default, it means we haven't added the PDA yet.
          this._openOrdersAccounts[index].equals(PublicKey.default)
        ) {
          let [openOrdersPda, _openOrdersNonce] = await utils.getOpenOrders(
            Exchange.programId,
            product.market,
            this._parent.publicKey
          );
          this._openOrdersAccounts[index] = openOrdersPda;
        }
      })
    );

    // perps too
    if (
      // If the nonce is not zero, we know there is an open orders account.
      this._marginAccount.openOrdersNonce[constants.PERP_INDEX] !== 0 &&
      // If this is equal to default, it means we haven't added the PDA yet.
      this._openOrdersAccounts[constants.PERP_INDEX].equals(PublicKey.default)
    ) {
      let [openOrdersPda, _openOrdersNonce] = await utils.getOpenOrders(
        Exchange.programId,
        this._subExchange.zetaGroup.perp.market,
        this._parent.publicKey
      );
      this._openOrdersAccounts[constants.PERP_INDEX] = openOrdersPda;
    }
  }

  private assertHasMarginAccount() {
    if (this.marginAccount == null) {
      throw Error("Margin account doesn't exist!");
    }
  }

  /**
   * Getter functions for raw user margin account state.
   */

  /**
   * @param index - market index.
   * @param decimal - whether to convert to readable decimal.
   */
  public getMarginPositionSize(
    index: number,
    decimal: boolean = false
  ): number {
    let position = this.getProductLedger(index).position;
    let size = position.size.toNumber();
    return decimal ? utils.convertNativeLotSizeToDecimal(size) : size;
  }

  /**
   * @param index - market index.
   * @param decimal - whether to convert to readable decimal.
   */
  public getMarginCostOfTrades(
    index: number,
    decimal: boolean = false
  ): number {
    let position = this.getProductLedger(index).position;
    let costOfTrades = position.costOfTrades.toNumber();
    return decimal
      ? utils.convertNativeIntegerToDecimal(costOfTrades)
      : costOfTrades;
  }

  /**
   * @param index - market index.
   * @param decimal - whether to convert to readable decimal.
   */
  public getOpeningOrders(
    index: number,
    side: types.Side,
    decimal: boolean = false
  ): number {
    let orderState = this.getProductLedger(index).orderState;
    let orderIndex = side == types.Side.BID ? 0 : 1;
    let size = orderState.openingOrders[orderIndex].toNumber();
    return decimal ? utils.convertNativeLotSizeToDecimal(size) : size;
  }

  /**
   * @param index - market index.
   * @param decimal - whether to convert to readable decimal.
   */
  public getClosingOrders(index: number, decimal: boolean = false): number {
    let orderState = this.getProductLedger(index).orderState;
    let size = orderState.closingOrders.toNumber();
    return decimal ? utils.convertNativeLotSizeToDecimal(size) : size;
  }

  /**
   * Getter functions for raw user spread account state.
   */

  /**
   * @param index - market index.
   * @param decimal - whether to convert to readable decimal.
   */
  public getSpreadPositionSize(
    index: number,
    decimal: boolean = false
  ): number {
    let position = this.spreadAccount.positions[index];
    let size = position.size.toNumber();
    return decimal ? utils.convertNativeLotSizeToDecimal(size) : size;
  }

  /**
   * @param index - market index.
   * @param decimal - whether to convert to readable decimal.
   */
  public getSpreadCostOfTrades(
    index: number,
    decimal: boolean = false
  ): number {
    let position = this.spreadAccount.positions[index];
    let costOfTrades = position.costOfTrades.toNumber();
    return decimal
      ? utils.convertNativeIntegerToDecimal(costOfTrades)
      : costOfTrades;
  }

  /**
   * Getter function to grab the correct product ledger because perps is separate
   */
  public getProductLedger(index: number) {
    return utils.getProductLedger(this.marginAccount, index);
  }

  /**
   * Closes the subClient websocket subscription to margin account.
   */
  public async close() {
    if (this._marginAccountSubscriptionId !== undefined) {
      await this._parent.provider.connection.removeAccountChangeListener(
        this._marginAccountSubscriptionId
      );
      this._marginAccountSubscriptionId = undefined;
    }

    if (this._spreadAccountSubscriptionId !== undefined) {
      await this._parent.provider.connection.removeAccountChangeListener(
        this._spreadAccountSubscriptionId
      );
      this._spreadAccountSubscriptionId = undefined;
    }
  }
}

import * as anchor from "@project-serum/anchor";
import * as utils from "./utils";
import {
  MAX_SETTLE_AND_CLOSE_PER_TX,
  MAX_CANCELS_PER_TX,
  MAX_POSITION_MOVEMENTS,
  DEFAULT_CLIENT_POLL_INTERVAL,
  DEFAULT_CLIENT_TIMER_INTERVAL,
  DEX_PID,
  DEFAULT_ORDER_TAG,
} from "./constants";
import { Exchange, exchange as ExchangeSingleton } from "./exchange";
import {
  SpreadAccount,
  MarginAccount,
  TradeEvent,
  PositionMovementEvent,
} from "./program-types";
import {
  PublicKey,
  Connection,
  ConfirmOptions,
  Transaction,
  TransactionSignature,
  AccountInfo,
  Context,
  TransactionInstruction,
} from "@solana/web3.js";
import idl from "./idl/zeta.json";
import { Zeta } from "./types/zeta";
import {
  ProgramAccountType,
  Wallet,
  CancelArgs,
  OrderType,
  Position,
  Order,
  Side,
  MovementType,
} from "./types";
import {
  initializeMarginAccountIx,
  closeMarginAccountIx,
  initializeOpenOrdersIx,
  closeOpenOrdersIx,
  placeOrderIx,
  placeOrderV2Ix,
  placeOrderV3Ix,
  depositIx,
  withdrawIx,
  cancelOrderIx,
  cancelOrderByClientOrderIdIx,
  forceCancelOrdersIx,
  liquidateIx,
  settleDexFundsIx,
  initializeSpreadAccountIx,
  closeSpreadAccountIx,
  positionMovementIx,
  transferExcessSpreadBalanceIx,
  PositionMovementArg,
} from "./program-instructions";

import { EventType } from "./events";

export class Client {
  /**
   * Returns the user wallet public key.
   */
  public get publicKey(): PublicKey {
    return this._provider.wallet.publicKey;
  }

  /**
   * Anchor provider for client, including wallet.
   */
  public get provider(): anchor.AnchorProvider {
    return this._provider;
  }
  private _provider: anchor.AnchorProvider;

  /**
   * Anchor program wrapper for the IDL.
   */
  private _program: anchor.Program;

  /**
   * Stores the user margin account state.
   */
  public get marginAccount(): MarginAccount | null {
    return this._marginAccount;
  }
  private _marginAccount: MarginAccount | null;

  /**
   * Client margin account address.
   */
  public get marginAccountAddress(): PublicKey {
    return this._marginAccountAddress;
  }
  private _marginAccountAddress: PublicKey;

  /**
   * Client's exchange.
   */
  public get exchange(): Exchange {
    return this._exchange;
  }
  private _exchange: Exchange;

  /**
   * Stores the user margin account state.
   */
  public get spreadAccount(): SpreadAccount | null {
    return this._spreadAccount;
  }
  private _spreadAccount: SpreadAccount | null;

  /**
   * Client margin account address.
   */
  public get spreadAccountAddress(): PublicKey {
    return this._spreadAccountAddress;
  }
  private _spreadAccountAddress: PublicKey;

  /**
   * Client usdc account address.
   */
  public get usdcAccountAddress(): PublicKey {
    return this._usdcAccountAddress;
  }
  private _usdcAccountAddress: PublicKey;

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
  public get orders(): Order[] {
    return this._orders;
  }
  private _orders: Order[];

  /**
   * Returns a list of user current positions.
   */
  public get positions(): Position[] {
    return this._positions;
  }
  private _positions: Position[];

  /**
   * Returns a list of user current spread account positions.
   */
  public get spreadPositions(): Position[] {
    return this._spreadPositions;
  }
  private _spreadPositions: Position[];

  /**
   * The subscription id for the margin account subscription.
   */
  private _marginAccountSubscriptionId: number = undefined;

  /**
   * The subscription id for the spread account subscription.
   */
  private _spreadAccountSubscriptionId: number = undefined;

  /**
   * The listener for trade events.
   */
  private _tradeEventListener: any;

  /**
   * Timer id from SetInterval.
   */
  private _pollIntervalId: any;

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
   * whitelist deposit account.
   */
  public get whitelistDepositAddress(): PublicKey | undefined {
    return this._whitelistDepositAddress;
  }
  private _whitelistDepositAddress: PublicKey | undefined;

  /**
   * whitelist trading fees account.
   */
  public get whitelistTradingFeesAddress(): PublicKey | undefined {
    return this._whitelistTradingFeesAddress;
  }
  private _whitelistTradingFeesAddress: PublicKey | undefined;

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
  private _pollInterval: number = DEFAULT_CLIENT_POLL_INTERVAL;

  /**
   * User passed callback on load, stored for polling.
   */
  private _callback: (type: EventType, data: any) => void;

  private _updatingState: boolean = false;

  private constructor(
    connection: Connection,
    wallet: Wallet,
    opts: ConfirmOptions
  ) {
    this._provider = new anchor.AnchorProvider(connection, wallet, opts);
    this._program = new anchor.Program(
      idl as anchor.Idl,
      ExchangeSingleton.programId,
      this._provider
    ) as anchor.Program<Zeta>;

    this._openOrdersAccounts = Array(
      ExchangeSingleton.zetaGroup.products.length
    ).fill(PublicKey.default);

    this._positions = [];
    this._orders = [];
    this._lastUpdateTimestamp = 0;
    this._pendingUpdate = false;
    this._marginAccount = null;
    this._spreadAccount = null;
  }

  /**
   * Returns a new instance of Client, based off state in the Exchange singleton.
   * Requires the Exchange to be in a valid state to succeed.
   *
   * @param throttle    Defaults to true.
   *                    If set to false, margin account callbacks will also call
   *                    `updateState` instead of waiting for the poll.
   */
  public static async load(
    connection: Connection,
    wallet: Wallet,
    exchange: Exchange,
    opts: ConfirmOptions = utils.defaultCommitment(),
    callback: (type: EventType, data: any) => void = undefined,
    throttle: boolean = false
  ): Promise<Client> {
    console.log(`Loading client: ${wallet.publicKey.toString()}`);
    let client = new Client(connection, wallet, opts);
    let [marginAccountAddress, _marginAccountNonce] =
      await utils.getMarginAccount(
        exchange.programId,
        exchange.zetaGroupAddress,
        wallet.publicKey
      );

    let [spreadAccountAddress, _spreadAccountNonce] =
      await utils.getSpreadAccount(
        exchange.programId,
        exchange.zetaGroupAddress,
        wallet.publicKey
      );

    client._marginAccountAddress = marginAccountAddress;
    client._spreadAccountAddress = spreadAccountAddress;

    client._exchange = exchange;

    client._callback = callback;

    client._marginAccountSubscriptionId = connection.onAccountChange(
      client._marginAccountAddress,
      async (accountInfo: AccountInfo<Buffer>, context: Context) => {
        client._marginAccount = client._program.coder.accounts.decode(
          ProgramAccountType.MarginAccount,
          accountInfo.data
        );

        if (throttle || client._updatingState) {
          client._pendingUpdate = true;
          client._pendingUpdateSlot = context.slot;
          return;
        }

        await client.updateState(false);
        client._lastUpdateTimestamp = exchange.clockTimestamp;

        if (callback !== undefined) {
          callback(EventType.USER, null);
        }

        await client.updateOpenOrdersAddresses();
      },
      connection.commitment
    );

    client._spreadAccountSubscriptionId = connection.onAccountChange(
      client._spreadAccountAddress,
      async (accountInfo: AccountInfo<Buffer>, _context: Context) => {
        client._spreadAccount = client._program.coder.accounts.decode(
          ProgramAccountType.SpreadAccount,
          accountInfo.data
        );

        client.updateSpreadPositions();

        if (callback !== undefined) {
          callback(EventType.USER, null);
        }
      },
      connection.commitment
    );

    client._usdcAccountAddress = await utils.getAssociatedTokenAddress(
      exchange.usdcMintAddress,
      wallet.publicKey
    );

    try {
      client._marginAccount =
        (await client._program.account.marginAccount.fetch(
          client._marginAccountAddress
        )) as unknown as MarginAccount;

      // Set open order pdas for initialized accounts.
      await client.updateOpenOrdersAddresses();
      client.updatePositions();
      // We don't update orders here to make load faster.
      client._pendingUpdate = true;
    } catch (e) {
      console.log("User does not have a margin account.");
    }

    try {
      client._spreadAccount =
        (await client._program.account.spreadAccount.fetch(
          client._spreadAccountAddress
        )) as unknown as SpreadAccount;
      client.updateSpreadPositions();
    } catch (e) {
      console.log("User does not have a spread account.");
    }

    client._whitelistDepositAddress = undefined;
    try {
      let [whitelistDepositAddress, _whitelistTradingFeesNonce] =
        await utils.getUserWhitelistDepositAccount(
          exchange.programId,
          wallet.publicKey
        );
      await client._program.account.whitelistDepositAccount.fetch(
        whitelistDepositAddress
      );
      console.log("User is whitelisted for unlimited deposits into zeta.");
      client._whitelistDepositAddress = whitelistDepositAddress;
    } catch (e) {}

    client._whitelistTradingFeesAddress = undefined;
    try {
      let [whitelistTradingFeesAddress, _whitelistTradingFeesNonce] =
        await utils.getUserWhitelistTradingFeesAccount(
          exchange.programId,
          wallet.publicKey
        );
      await client._program.account.whitelistTradingFeesAccount.fetch(
        whitelistTradingFeesAddress
      );
      console.log("User is whitelisted for trading fees.");
      client._whitelistTradingFeesAddress = whitelistTradingFeesAddress;
    } catch (e) {}

    if (callback !== undefined) {
      client._tradeEventListener = client._program.addEventListener(
        "TradeEvent",
        (event: TradeEvent, _slot) => {
          if (event.marginAccount.equals(marginAccountAddress)) {
            callback(EventType.TRADE, event);
          }
        }
      );
    }

    client.setPolling(DEFAULT_CLIENT_TIMER_INTERVAL);
    return client;
  }

  /**
   * @param timerInterval   desired interval for client polling.
   */
  private setPolling(timerInterval: number) {
    if (this._pollIntervalId !== undefined) {
      console.log(`Resetting existing timer to ${timerInterval} seconds.`);
      clearInterval(this._pollIntervalId);
    }

    this._pollIntervalId = setInterval(async () => {
      if (
        ExchangeSingleton.clockTimestamp >
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
          this._lastUpdateTimestamp = ExchangeSingleton.clockTimestamp;
          if (this._callback !== undefined) {
            this._callback(EventType.USER, null);
          }
        } catch (e) {
          console.log(`Client poll update failed. Error: ${e}`);
        }
      }
    }, timerInterval * 1000);
  }

  /**
   * Polls the margin account for the latest state.
   */
  public async updateState(fetch = true, force = false) {
    if (this._updatingState && !force) {
      return;
    }
    this._updatingState = true;
    if (fetch) {
      try {
        this._marginAccount = (await this._program.account.marginAccount.fetch(
          this._marginAccountAddress
        )) as unknown as MarginAccount;
      } catch (e) {
        this._updatingState = false;
        return;
      }

      try {
        this._spreadAccount = (await this._program.account.spreadAccount.fetch(
          this._spreadAccountAddress
        )) as unknown as SpreadAccount;
      } catch (e) {}
    }

    if (this._marginAccount !== null) {
      await this.updateOrders();
      this.updatePositions();
    }

    if (this._spreadAccount !== null) {
      this.updateSpreadPositions();
    }

    this._updatingState = false;
  }

  /**
   * @param amount  the native amount to deposit (6 decimals fixed point)
   */
  public async deposit(amount: number): Promise<TransactionSignature> {
    // Check if the user has a USDC account.
    await this.usdcAccountCheck();

    let tx = new Transaction();
    if (this._marginAccount === null) {
      console.log("User has no margin account. Creating margin account...");
      tx.add(
        initializeMarginAccountIx(
          this._exchange.zetaGroupAddress,
          this._marginAccountAddress,
          this.publicKey
        )
      );
    }
    tx.add(
      await depositIx(
        amount,
        this._marginAccountAddress,
        this._usdcAccountAddress,
        this.publicKey,
        this._whitelistDepositAddress
      )
    );
    let txId = await utils.processTransaction(this._provider, tx);
    return txId;
  }

  /**
   * Closes a client's margin account
   */
  public async closeMarginAccount(): Promise<TransactionSignature> {
    if (this._marginAccount === null) {
      throw Error("User has no margin account to close");
    }

    let tx = new Transaction().add(
      closeMarginAccountIx(this.publicKey, this._marginAccountAddress)
    );
    let txId = await utils.processTransaction(this._provider, tx);
    this._marginAccount = null;
    return txId;
  }

  /**
   * Closes a client's spread account
   */
  public async closeSpreadAccount(): Promise<TransactionSignature> {
    if (this._spreadAccount === null) {
      throw Error("User has no spread account to close");
    }

    let tx = new Transaction();
    tx.add(
      transferExcessSpreadBalanceIx(
        ExchangeSingleton.zetaGroupAddress,
        this.marginAccountAddress,
        this._spreadAccountAddress,
        this.publicKey
      )
    );
    tx.add(
      closeSpreadAccountIx(
        ExchangeSingleton.zetaGroupAddress,
        this._spreadAccountAddress,
        this.publicKey
      )
    );
    let txId = await utils.processTransaction(this._provider, tx);
    this._spreadAccount = null;
    return txId;
  }

  /**
   * @param amount  the native amount to withdraw (6 dp)
   */
  public async withdraw(amount: number): Promise<TransactionSignature> {
    let tx = new Transaction();
    tx.add(
      withdrawIx(
        amount,
        this._marginAccountAddress,
        this._usdcAccountAddress,
        this.publicKey
      )
    );
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Withdraws the entirety of the client's margin account and then closes it.
   */
  public async withdrawAndCloseMarginAccount(): Promise<TransactionSignature> {
    if (this._marginAccount === null) {
      throw Error("User has no margin account to withdraw or close.");
    }
    let tx = new Transaction();
    tx.add(
      withdrawIx(
        this._marginAccount.balance.toNumber(),
        this._marginAccountAddress,
        this._usdcAccountAddress,
        this.publicKey
      )
    );
    tx.add(closeMarginAccountIx(this.publicKey, this._marginAccountAddress));
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Places an order on a zeta market.
   * @param market          the address of the serum market
   * @param price           the native price of the order (6 d.p as integer)
   * @param size            the quantity of the order (3 d.p)
   * @param side            the side of the order. bid / ask
   * @param clientOrderId   optional: client order id (non 0 value)
   * NOTE: If duplicate client order ids are used, after a cancel order,
   * to cancel the second order with the same client order id,
   * you may need to crank the corresponding event queue to flush that order id
   * from the user open orders account before cancelling the second order.
   * (Depending on the order in which the order was cancelled).
   */
  public async placeOrder(
    market: PublicKey,
    price: number,
    size: number,
    side: Side,
    clientOrderId = 0
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);

    let openOrdersPda = null;
    if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      console.log(
        `User doesn't have open orders account. Initialising for market ${market.toString()}.`
      );
      let [initIx, _openOrdersPda] = await initializeOpenOrdersIx(
        market,
        this.publicKey,
        this.marginAccountAddress
      );
      openOrdersPda = _openOrdersPda;
      tx.add(initIx);
    } else {
      openOrdersPda = this._openOrdersAccounts[marketIndex];
    }

    let orderIx = placeOrderIx(
      marketIndex,
      price,
      size,
      side,
      clientOrderId,
      this.marginAccountAddress,
      this.publicKey,
      openOrdersPda,
      this._whitelistTradingFeesAddress
    );

    tx.add(orderIx);

    let txId = await utils.processTransaction(this._provider, tx);
    this._openOrdersAccounts[marketIndex] = openOrdersPda;

    return txId;
  }

  /**
   * Places an order on a zeta market.
   * @param market          the address of the serum market
   * @param price           the native price of the order (6 d.p as integer)
   * @param size            the quantity of the order (3 d.p)
   * @param side            the side of the order. bid / ask
   * @param orderType       the type of the order. limit / ioc / post-only
   * @param clientOrderId   optional: client order id (non 0 value)
   * NOTE: If duplicate client order ids are used, after a cancel order,
   * to cancel the second order with the same client order id,
   * you may need to crank the corresponding event queue to flush that order id
   * from the user open orders account before cancelling the second order.
   * (Depending on the order in which the order was cancelled).
   */
  public async placeOrderV2(
    market: PublicKey,
    price: number,
    size: number,
    side: Side,
    orderType: OrderType,
    clientOrderId = 0
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);

    let openOrdersPda = null;
    if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      console.log(
        `User doesn't have open orders account. Initialising for market ${market.toString()}.`
      );
      let [initIx, _openOrdersPda] = await initializeOpenOrdersIx(
        market,
        this.publicKey,
        this.marginAccountAddress
      );
      openOrdersPda = _openOrdersPda;
      tx.add(initIx);
    } else {
      openOrdersPda = this._openOrdersAccounts[marketIndex];
    }

    let orderIx = placeOrderV2Ix(
      marketIndex,
      price,
      size,
      side,
      orderType,
      clientOrderId,
      this.marginAccountAddress,
      this.publicKey,
      openOrdersPda,
      this._whitelistTradingFeesAddress
    );

    tx.add(orderIx);

    let txId = await utils.processTransaction(this._provider, tx);
    this._openOrdersAccounts[marketIndex] = openOrdersPda;

    return txId;
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
    side: Side,
    tag: String = DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    let tx = new Transaction();

    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);

    let openOrdersPda = null;
    if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      console.log(
        `User doesn't have open orders account. Initialising for market ${market.toString()}.`
      );
      let [initIx, _openOrdersPda] = await initializeOpenOrdersIx(
        market,
        this.publicKey,
        this.marginAccountAddress
      );
      openOrdersPda = _openOrdersPda;
      tx.add(initIx);
    } else {
      openOrdersPda = this._openOrdersAccounts[marketIndex];
    }

    let orderIx = placeOrderV3Ix(
      marketIndex,
      price,
      size,
      side,
      OrderType.FILLORKILL,
      0, // Default to none for now.
      tag,
      this.marginAccountAddress,
      this.publicKey,
      openOrdersPda,
      this._whitelistTradingFeesAddress
    );

    tx.add(orderIx);

    if (this.spreadAccount == null) {
      console.log("User has no spread account. Creating spread account...");
      tx.add(
        initializeSpreadAccountIx(
          ExchangeSingleton.zetaGroupAddress,
          this.spreadAccountAddress,
          this.publicKey
        )
      );
    }

    let movementSize = side == Side.BID ? size : -size;
    let movements: PositionMovementArg[] = [
      {
        index: marketIndex,
        size: new anchor.BN(movementSize),
      },
    ];

    tx.add(
      positionMovementIx(
        ExchangeSingleton.zetaGroupAddress,
        this.marginAccountAddress,
        this.spreadAccountAddress,
        this.publicKey,
        ExchangeSingleton.greeksAddress,
        ExchangeSingleton.zetaGroup.oracle,
        MovementType.LOCK,
        movements
      )
    );

    let txId = await utils.processTransaction(this._provider, tx);
    this._openOrdersAccounts[marketIndex] = openOrdersPda;

    return txId;
  }

  /**
   * Places an order on a zeta market.
   * @param market          the address of the serum market
   * @param price           the native price of the order (6 d.p as integer)
   * @param size            the quantity of the order (3 d.p)
   * @param side            the side of the order. bid / ask
   * @param orderType       the type of the order. limit / ioc / post-only
   * @param clientOrderId   optional: client order id (non 0 value)
   * @param tag             optional: the string tag corresponding to who is inserting
   * NOTE: If duplicate client order ids are used, after a cancel order,
   * to cancel the second order with the same client order id,
   * you may need to crank the corresponding event queue to flush that order id
   * from the user open orders account before cancelling the second order.
   * (Depending on the order in which the order was cancelled).
   */
  public async placeOrderV3(
    market: PublicKey,
    price: number,
    size: number,
    side: Side,
    orderType: OrderType,
    clientOrderId = 0,
    tag: String = DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);

    let openOrdersPda = null;
    if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      console.log(
        `User doesn't have open orders account. Initialising for market ${market.toString()}.`
      );
      let [initIx, _openOrdersPda] = await initializeOpenOrdersIx(
        market,
        this.publicKey,
        this.marginAccountAddress
      );
      openOrdersPda = _openOrdersPda;
      tx.add(initIx);
    } else {
      openOrdersPda = this._openOrdersAccounts[marketIndex];
    }

    let orderIx = placeOrderV3Ix(
      marketIndex,
      price,
      size,
      side,
      orderType,
      clientOrderId,
      tag,
      this.marginAccountAddress,
      this.publicKey,
      openOrdersPda,
      this._whitelistTradingFeesAddress
    );

    tx.add(orderIx);

    let txId: TransactionSignature;
    txId = await utils.processTransaction(this._provider, tx);
    this._openOrdersAccounts[marketIndex] = openOrdersPda;
    return txId;
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
    side: Side
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let index = ExchangeSingleton.markets.getMarketIndex(market);
    let ix = cancelOrderIx(
      index,
      this.publicKey,
      this._marginAccountAddress,
      this._openOrdersAccounts[index],
      orderId,
      side
    );
    tx.add(ix);
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Cancels a user order by client order id.
   * It will only cancel the FIRST
   * @param market          the market address of the order to be cancelled.
   * @param clientOrderId   the client order id of the order. (Non zero value).
   */
  public async cancelOrderByClientOrderId(
    market: PublicKey,
    clientOrderId: number
  ): Promise<TransactionSignature> {
    if (clientOrderId == 0) {
      throw Error("Client order id cannot be 0.");
    }
    let tx = new Transaction();
    let index = ExchangeSingleton.markets.getMarketIndex(market);
    let ix = cancelOrderByClientOrderIdIx(
      index,
      this.publicKey,
      this._marginAccountAddress,
      this._openOrdersAccounts[index],
      new anchor.BN(clientOrderId)
    );
    tx.add(ix);
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Cancels a user order by orderId and atomically places an order
   * @param market     the market address of the order to be cancelled.
   * @param orderId    the order id of the order.
   * @param cancelSide       the side of the order. bid / ask.
   * @param newOrderPrice  the native price of the order (6 d.p) as integer
   * @param newOrderSize   the quantity of the order (3 d.p) as integer
   * @param newOrderSide   the side of the order. bid / ask
   */
  public async cancelAndPlaceOrder(
    market: PublicKey,
    orderId: anchor.BN,
    cancelSide: Side,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: Side,
    clientOrderId = 0
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);
    tx.add(
      cancelOrderIx(
        marketIndex,
        this.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        orderId,
        cancelSide
      )
    );
    tx.add(
      placeOrderIx(
        marketIndex,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        clientOrderId,
        this.marginAccountAddress,
        this.publicKey,
        this._openOrdersAccounts[marketIndex],
        this._whitelistTradingFeesAddress
      )
    );
    return await utils.processTransaction(this._provider, tx);
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
   * @param clientOrderId   optional: client order id (non 0 value)
   */
  public async cancelAndPlaceOrderV2(
    market: PublicKey,
    orderId: anchor.BN,
    cancelSide: Side,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: Side,
    newOrderType: OrderType,
    clientOrderId = 0
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);
    tx.add(
      cancelOrderIx(
        marketIndex,
        this.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        orderId,
        cancelSide
      )
    );
    tx.add(
      placeOrderV2Ix(
        marketIndex,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        newOrderType,
        clientOrderId,
        this.marginAccountAddress,
        this.publicKey,
        this._openOrdersAccounts[marketIndex],
        this._whitelistTradingFeesAddress
      )
    );
    return await utils.processTransaction(this._provider, tx);
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
   * @param clientOrderId   optional: client order id (non 0 value)
   * @param newOrderTag     optional: the string tag corresponding to who is inserting. Default "SDK", max 4 length
   */
  public async cancelAndPlaceOrderV3(
    market: PublicKey,
    orderId: anchor.BN,
    cancelSide: Side,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: Side,
    newOrderType: OrderType,
    clientOrderId = 0,
    newOrderTag: String = DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);
    tx.add(
      cancelOrderIx(
        marketIndex,
        this.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        orderId,
        cancelSide
      )
    );
    tx.add(
      placeOrderV3Ix(
        marketIndex,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        newOrderType,
        clientOrderId,
        newOrderTag,
        this.marginAccountAddress,
        this.publicKey,
        this._openOrdersAccounts[marketIndex],
        this._whitelistTradingFeesAddress
      )
    );
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Cancels a user order by client order id and atomically places an order by new client order id.
   * @param market                  the market address of the order to be cancelled and new order.
   * @param cancelClientOrderId     the client order id of the order to be cancelled.
   * @param newOrderPrice           the native price of the order (6 d.p) as integer
   * @param newOrderSize            the quantity of the order (3 d.p) as integer
   * @param newOrderSide            the side of the order. bid / ask
   * @param newOrderClientOrderId   the client order id for the new order
   */
  public async cancelAndPlaceOrderByClientOrderId(
    market: PublicKey,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: Side,
    newOrderClientOrderId: number
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);
    tx.add(
      cancelOrderByClientOrderIdIx(
        marketIndex,
        this.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        new anchor.BN(cancelClientOrderId)
      )
    );
    tx.add(
      placeOrderIx(
        marketIndex,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        newOrderClientOrderId,
        this.marginAccountAddress,
        this.publicKey,
        this._openOrdersAccounts[marketIndex],
        this._whitelistTradingFeesAddress
      )
    );
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Cancels a user order by client order id and atomically places an order by new client order id.
   * @param market                  the market address of the order to be cancelled and new order.
   * @param cancelClientOrderId     the client order id of the order to be cancelled.
   * @param newOrderPrice           the native price of the order (6 d.p) as integer
   * @param newOrderSize            the quantity of the order (3 d.p) as integer
   * @param newOrderSide            the side of the order. bid / ask
   * @param newOrderType            the type of the order, limit / ioc / post-only
   * @param newOrderClientOrderId   the client order id for the new order
   */
  public async cancelAndPlaceOrderByClientOrderIdV2(
    market: PublicKey,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: Side,
    newOrderType: OrderType,
    newOrderClientOrderId: number
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);
    tx.add(
      cancelOrderByClientOrderIdIx(
        marketIndex,
        this.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        new anchor.BN(cancelClientOrderId)
      )
    );
    tx.add(
      placeOrderV2Ix(
        marketIndex,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        newOrderType,
        newOrderClientOrderId,
        this.marginAccountAddress,
        this.publicKey,
        this._openOrdersAccounts[marketIndex],
        this._whitelistTradingFeesAddress
      )
    );
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Initializes a user open orders account for a given market.
   * This is handled atomically by place order but can be used by clients to initialize it independent of placing an order.
   */
  public async initializeOpenOrdersAccount(
    market: PublicKey
  ): Promise<TransactionSignature> {
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);
    if (!this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      throw Error("User already has an open orders account for market!");
    }

    let [initIx, openOrdersPda] = await initializeOpenOrdersIx(
      market,
      this.publicKey,
      this.marginAccountAddress
    );

    let tx = new Transaction().add(initIx);
    let txId = await utils.processTransaction(this._provider, tx);
    this._openOrdersAccounts[marketIndex] = openOrdersPda;
    return txId;
  }

  /**
   * Closes a user open orders account for a given market.
   */
  public async closeOpenOrdersAccount(
    market: PublicKey
  ): Promise<TransactionSignature> {
    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);
    if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
      throw Error("User has no open orders account for this market!");
    }

    const [vaultOwner, _vaultSignerNonce] =
      await utils.getSerumVaultOwnerAndNonce(
        market,
        DEX_PID[ExchangeSingleton.network]
      );

    let tx = new Transaction();
    tx.add(
      settleDexFundsIx(
        market,
        vaultOwner,
        this._openOrdersAccounts[marketIndex]
      )
    );

    tx.add(
      await closeOpenOrdersIx(
        market,
        this.publicKey,
        this.marginAccountAddress,
        this._openOrdersAccounts[marketIndex]
      )
    );
    let txId = await utils.processTransaction(this._provider, tx);
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
    for (var i = 0; i < markets.length; i++) {
      let market = markets[i];
      let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);
      if (this._openOrdersAccounts[marketIndex].equals(PublicKey.default)) {
        throw Error("User has no open orders account for this market!");
      }
      const [vaultOwner, _vaultSignerNonce] =
        await utils.getSerumVaultOwnerAndNonce(
          market,
          DEX_PID[ExchangeSingleton.network]
        );
      let settleIx = settleDexFundsIx(
        market,
        vaultOwner,
        this._openOrdersAccounts[marketIndex]
      );
      let closeIx = await closeOpenOrdersIx(
        market,
        this.publicKey,
        this.marginAccountAddress,
        this._openOrdersAccounts[marketIndex]
      );
      combinedIxs.push(settleIx);
      combinedIxs.push(closeIx);
    }

    let txIds: string[] = [];

    let combinedTxs = utils.splitIxsIntoTx(
      combinedIxs,
      MAX_SETTLE_AND_CLOSE_PER_TX
    );

    await Promise.all(
      combinedTxs.map(async (tx) => {
        txIds.push(await utils.processTransaction(this._provider, tx));
      })
    );

    // Reset openOrdersAccount keys
    for (var i = 0; i < markets.length; i++) {
      let market = markets[i];
      let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);
      this._openOrdersAccounts[marketIndex] = PublicKey.default;
    }

    return txIds;
  }

  /**
   * Cancels multiple user orders by orderId
   * @param cancelArguments list of cancelArgs objects which contains the arguments of cancel instructions
   */
  public async cancelMultipleOrders(
    cancelArguments: CancelArgs[]
  ): Promise<TransactionSignature[]> {
    let ixs = [];
    for (var i = 0; i < cancelArguments.length; i++) {
      let marketIndex = ExchangeSingleton.markets.getMarketIndex(
        cancelArguments[i].market
      );
      let ix = cancelOrderIx(
        marketIndex,
        this.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        cancelArguments[i].orderId,
        cancelArguments[i].cancelSide
      );
      ixs.push(ix);
    }
    let txs = utils.splitIxsIntoTx(ixs, MAX_CANCELS_PER_TX);
    let txIds: string[] = [];
    await Promise.all(
      txs.map(async (tx) => {
        txIds.push(await utils.processTransaction(this._provider, tx));
      })
    );
    return txIds;
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
    let marginAccount = (await this._program.account.marginAccount.fetch(
      marginAccountToCancel
    )) as unknown as MarginAccount;

    let marketIndex = ExchangeSingleton.markets.getMarketIndex(market);

    let openOrdersAccountToCancel = await utils.createOpenOrdersAddress(
      ExchangeSingleton.programId,
      market,
      marginAccount.authority,
      marginAccount.openOrdersNonce[marketIndex]
    );

    let tx = new Transaction();
    let ix = forceCancelOrdersIx(
      marketIndex,
      marginAccountToCancel,
      openOrdersAccountToCancel
    );
    tx.add(ix);
    return await utils.processTransaction(this._provider, tx);
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
    let ix = liquidateIx(
      this.publicKey,
      this._marginAccountAddress,
      market,
      liquidatedMarginAccount,
      size
    );
    tx.add(ix);
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Cancels all active user orders
   */
  public async cancelAllOrders(): Promise<TransactionSignature[]> {
    // Can only fit 6 cancels worth of accounts per transaction.
    // on 4 separate markets
    // Compute is fine.
    let ixs = [];
    for (var i = 0; i < this._orders.length; i++) {
      let order = this._orders[i];
      let ix = cancelOrderIx(
        order.marketIndex,
        this.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[order.marketIndex],
        order.orderId,
        order.side
      );
      ixs.push(ix);
    }

    let txs = utils.splitIxsIntoTx(ixs, MAX_CANCELS_PER_TX);
    let txIds: string[] = [];
    await Promise.all(
      txs.map(async (tx) => {
        txIds.push(await utils.processTransaction(this._provider, tx));
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
    movementType: MovementType,
    movements: PositionMovementArg[]
  ): Promise<TransactionSignature> {
    let tx = this.getPositionMovementTx(movementType, movements);
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Moves positions to and from spread and margin account, based on the type.
   * @param movementType    - type of movement
   * @param movements       - vector of position movements
   */
  public async simulatePositionMovement(
    movementType: MovementType,
    movements: PositionMovementArg[]
  ): Promise<PositionMovementEvent> {
    let tx = this.getPositionMovementTx(movementType, movements);
    let response = await utils.simulateTransaction(this.provider, tx);

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
    movementType: MovementType,
    movements: PositionMovementArg[]
  ): Transaction {
    if (movements.length > MAX_POSITION_MOVEMENTS) {
      throw new Error(
        `Max position movements exceeded. Max = ${MAX_POSITION_MOVEMENTS} < ${movements.length}`
      );
    }

    let tx = new Transaction();
    this.assertHasMarginAccount();

    if (this.spreadAccount == null) {
      console.log("User has no spread account. Creating spread account...");
      tx.add(
        initializeSpreadAccountIx(
          ExchangeSingleton.zetaGroupAddress,
          this.spreadAccountAddress,
          this.publicKey
        )
      );
    }

    tx.add(
      positionMovementIx(
        ExchangeSingleton.zetaGroupAddress,
        this.marginAccountAddress,
        this.spreadAccountAddress,
        this.publicKey,
        ExchangeSingleton.greeksAddress,
        ExchangeSingleton.zetaGroup.oracle,
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
      transferExcessSpreadBalanceIx(
        ExchangeSingleton.zetaGroupAddress,
        this.marginAccountAddress,
        this.spreadAccountAddress,
        this.publicKey
      )
    );
    return await utils.processTransaction(this._provider, tx);
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
    return indexes;
  }

  private async updateOrders() {
    let orders = [];
    await Promise.all(
      [...this.getRelevantMarketIndexes()].map(async (i) => {
        await ExchangeSingleton.markets.markets[i].updateOrderbook();
        orders.push(
          ExchangeSingleton.markets.markets[i].getOrdersForAccount(
            this._openOrdersAccounts[i]
          )
        );
      })
    );
    this._orders = [].concat(...orders);
  }

  private updatePositions() {
    let positions: Position[] = [];
    for (var i = 0; i < this._marginAccount.productLedgers.length; i++) {
      if (this._marginAccount.productLedgers[i].position.size.toNumber() != 0) {
        positions.push({
          marketIndex: i,
          market: ExchangeSingleton.zetaGroup.products[i].market,
          size: utils.convertNativeLotSizeToDecimal(
            this._marginAccount.productLedgers[i].position.size.toNumber()
          ),
          costOfTrades: utils.convertNativeBNToDecimal(
            this._marginAccount.productLedgers[i].position.costOfTrades
          ),
        });
      }
    }
    this._positions = positions;
  }

  private updateSpreadPositions() {
    let positions: Position[] = [];
    for (var i = 0; i < this._spreadAccount.positions.length; i++) {
      if (this._spreadAccount.positions[i].size.toNumber() != 0) {
        positions.push({
          marketIndex: i,
          market: ExchangeSingleton.zetaGroup.products[i].market,
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

  private async usdcAccountCheck() {
    try {
      let tokenAccountInfo = await utils.getTokenAccountInfo(
        this._provider.connection,
        this._usdcAccountAddress
      );
      console.log(
        `Found user USDC associated token account ${this._usdcAccountAddress.toString()}. Balance = $${utils.convertNativeBNToDecimal(
          tokenAccountInfo.amount
        )}.`
      );
    } catch (e) {
      throw Error(
        "User has no USDC associated token account. Please create one and deposit USDC."
      );
    }
  }

  private async updateOpenOrdersAddresses() {
    await Promise.all(
      ExchangeSingleton.zetaGroup.products.map(async (product, index) => {
        if (
          // If the nonce is not zero, we know there is an open orders account.
          this._marginAccount.openOrdersNonce[index] !== 0 &&
          // If this is equal to default, it means we haven't added the PDA yet.
          this._openOrdersAccounts[index].equals(PublicKey.default)
        ) {
          let [openOrdersPda, _openOrdersNonce] = await utils.getOpenOrders(
            ExchangeSingleton.programId,
            product.market,
            this.publicKey
          );
          this._openOrdersAccounts[index] = openOrdersPda;
        }
      })
    );
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
    let size =
      this.marginAccount.productLedgers[index].position.size.toNumber();
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
    let costOfTrades =
      this.marginAccount.productLedgers[index].position.costOfTrades.toNumber();
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
    side: Side,
    decimal: boolean = false
  ): number {
    let orderIndex = side == Side.BID ? 0 : 1;
    let size =
      this.marginAccount.productLedgers[index].orderState.openingOrders[
        orderIndex
      ].toNumber();
    return decimal ? utils.convertNativeLotSizeToDecimal(size) : size;
  }

  /**
   * @param index - market index.
   * @param decimal - whether to convert to readable decimal.
   */
  public getClosingOrders(index: number, decimal: boolean = false): number {
    let size =
      this.marginAccount.productLedgers[
        index
      ].orderState.closingOrders.toNumber();
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
    let size = this.spreadAccount.positions[index].size.toNumber();
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
    let costOfTrades =
      this.spreadAccount.positions[index].costOfTrades.toNumber();
    return decimal
      ? utils.convertNativeIntegerToDecimal(costOfTrades)
      : costOfTrades;
  }

  /**
   * Closes the client websocket subscription to margin account.
   */
  public async close() {
    if (this._marginAccountSubscriptionId !== undefined) {
      await this._provider.connection.removeAccountChangeListener(
        this._marginAccountSubscriptionId
      );
      this._marginAccountSubscriptionId = undefined;
    }

    if (this._spreadAccountSubscriptionId !== undefined) {
      await this._provider.connection.removeAccountChangeListener(
        this._spreadAccountSubscriptionId
      );
      this._spreadAccountSubscriptionId = undefined;
    }

    if (this._tradeEventListener !== undefined) {
      await this._program.removeEventListener(this._tradeEventListener);
      this._tradeEventListener = undefined;
    }

    if (this._pollIntervalId !== undefined) {
      clearInterval(this._pollIntervalId);
      this._pollIntervalId = undefined;
    }
  }
}

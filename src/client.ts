import * as anchor from "@project-serum/anchor";
import * as utils from "./utils";
import {
  MAX_CANCELS_PER_TX,
  DEFAULT_CLIENT_POLL_INTERVAL,
  DEFAULT_CLIENT_TIMER_INTERVAL,
  POSITION_PRECISION,
} from "./constants";
import { exchange as Exchange } from "./exchange";
import { MarginAccount, TradeEvent } from "./program-types";
import {
  PublicKey,
  Connection,
  ConfirmOptions,
  Transaction,
  TransactionSignature,
  AccountInfo,
  Context,
} from "@solana/web3.js";
import idl from "./idl/zeta.json";
import { ProgramAccountType, Wallet, CancelArgs } from "./types";
import {
  initializeMarginAccountTx,
  initializeOpenOrdersIx,
  placeOrderIx,
  depositIx,
  withdrawIx,
  cancelOrderIx,
  cancelOrderByClientOrderIdIx,
  forceCancelOrdersIx,
  liquidateIx,
} from "./program-instructions";

import { Position, Order, Side } from "./types";
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
  private _provider: anchor.Provider;

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
   * The event emitter for the margin account subscription.
   */
  private _eventEmitter: any;

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
  private _whitelistDepositAddress: PublicKey | undefined;

  /**
   * whitelist trading fees account.
   */
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
    this._provider = new anchor.Provider(connection, wallet, opts);
    this._program = new anchor.Program(
      idl as anchor.Idl,
      Exchange.programId,
      this._provider
    );

    this._openOrdersAccounts = Array(Exchange.zetaGroup.products.length).fill(
      PublicKey.default
    );

    this._positions = [];
    this._orders = [];
    this._lastUpdateTimestamp = 0;
    this._pendingUpdate = false;
    this._marginAccount = null;
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
    opts: ConfirmOptions = utils.defaultCommitment(),
    callback: (type: EventType, data: any) => void = undefined,
    throttle: boolean = false
  ): Promise<Client> {
    console.log(`Loading client: ${wallet.publicKey.toString()}`);
    let client = new Client(connection, wallet, opts);
    let [marginAccountAddress, _marginAccountNonce] =
      await utils.getMarginAccount(
        Exchange.programId,
        Exchange.zetaGroupAddress,
        wallet.publicKey
      );

    client._marginAccountAddress = marginAccountAddress;

    client._callback = callback;

    connection.onAccountChange(
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
        client._lastUpdateTimestamp = Exchange.clockTimestamp;

        if (callback !== undefined) {
          callback(EventType.USER, null);
        }

        await client.updateOpenOrdersAddresses();
      },
      connection.commitment
    );

    client._usdcAccountAddress = await utils.getAssociatedTokenAddress(
      Exchange.usdcMintAddress,
      wallet.publicKey
    );

    // Update state without awaiting for updateOrders()
    try {
      client._marginAccount =
        (await client._program.account.marginAccount.fetch(
          client._marginAccountAddress
        )) as MarginAccount;
    } catch (e) {
      console.log("User does not have a margin account.");
    }

    if (client.marginAccount !== null) {
      // Set open order pdas for initialized accounts.
      await client.updateOpenOrdersAddresses();
      client.updatePositions();
      // We don't update orders here to make load faster.
      client._pendingUpdate = true;
    }

    client._whitelistDepositAddress = undefined;
    try {
      let [whitelistDepositAddress, _whitelistTradingFeesNonce] =
        await utils.getUserWhitelistDepositAccount(
          Exchange.programId,
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
          Exchange.programId,
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
   * @param desired interval for client polling.
   */
  private setPolling(timerInterval: number) {
    if (this._pollIntervalId !== undefined) {
      console.log(`Resetting existing timer to ${timerInterval} seconds.`);
      clearInterval(this._pollIntervalId);
    }

    this._pollIntervalId = setInterval(async () => {
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
  public async updateState(fetch = true) {
    if (this._updatingState) {
      return;
    }
    this._updatingState = true;
    if (fetch) {
      try {
        this._marginAccount = (await this._program.account.marginAccount.fetch(
          this._marginAccountAddress
        )) as MarginAccount;
      } catch (e) {
        this._updatingState = false;
        return;
      }
    }
    if (this._marginAccount !== null) {
      await this.updateOrders();
      this.updatePositions();
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
      tx = await initializeMarginAccountTx(this.publicKey);
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
    console.log(
      `[DEPOSIT] $${utils.convertNativeIntegerToDecimal(
        amount
      )}. Transaction: ${txId}`
    );
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
    let marketIndex = Exchange.markets.getMarketIndex(market);

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

    let txId: TransactionSignature;
    try {
      this._openOrdersAccounts[marketIndex] = openOrdersPda;
      txId = await utils.processTransaction(this._provider, tx);
    } catch (e) {
      // If we were initializing open orders in the same tx.
      if (tx.instructions.length > 1) {
        this._openOrdersAccounts[marketIndex] = PublicKey.default;
      }
      throw e;
    }
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
    let index = Exchange.markets.getMarketIndex(market);
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
    let index = Exchange.markets.getMarketIndex(market);
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
   * @param newOrderprice  the native price of the order (6 d.p) as integer
   * @param newOrderSize   the quantity of the order (3 d.p) as integer
   * @param newOrderside   the side of the order. bid / ask
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
    let marketIndex = Exchange.markets.getMarketIndex(market);
    let ixs = [];
    ixs.push(
      cancelOrderIx(
        marketIndex,
        this.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        orderId,
        cancelSide
      )
    );
    ixs.push(
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
    ixs.forEach((ix) => tx.add(ix));
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Cancels a user order by client order id and atomically places an order by new client order id.
   * @param market                  the market address of the order to be cancelled and new order.
   * @param cancelClientOrderId     the client order id of the order to be cancelled.
   * @param newOrderprice           the native price of the order (6 d.p) as integer
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
    let marketIndex = Exchange.markets.getMarketIndex(market);
    let ixs = [];
    ixs.push(
      cancelOrderByClientOrderIdIx(
        marketIndex,
        this.publicKey,
        this._marginAccountAddress,
        this._openOrdersAccounts[marketIndex],
        new anchor.BN(cancelClientOrderId)
      )
    );
    ixs.push(
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
    ixs.forEach((ix) => tx.add(ix));
    return await utils.processTransaction(this._provider, tx);
  }

  /**
   * Initializes a user open orders account for a given market.
   * This is handled atomically by place order but can be used by clients to initialize it independent of placing an order.
   */
  public async initializeOpenOrdersAccount(
    market: PublicKey
  ): Promise<TransactionSignature> {
    let marketIndex = Exchange.markets.getMarketIndex(market);
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
   * Cancels a user order by orderId and atomically places an order
   * @param cancelArguments list of cancelArgs objects which contains the arguments of cancel instructions
   */
  public async cancelMultipleOrders(
    cancelArguments: CancelArgs[]
  ): Promise<TransactionSignature[]> {
    let ixs = [];
    for (var i = 0; i < cancelArguments.length; i++) {
      let marketIndex = Exchange.markets.getMarketIndex(
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
    )) as MarginAccount;

    let marketIndex = Exchange.markets.getMarketIndex(market);

    let openOrdersAccountToCancel = await utils.createOpenOrdersAddress(
      Exchange.programId,
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

  private getRelevantMarketIndexes(): number[] {
    let indexes = [];
    for (var i = 0; i < this._marginAccount.positions.length; i++) {
      let position = this._marginAccount.positions[i];
      if (
        position.position.toNumber() !== 0 ||
        position.openingOrders[0].toNumber() != 0 ||
        position.openingOrders[1].toNumber() != 0
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
        await Exchange.markets.markets[i].updateOrderbook();
        orders.push(
          Exchange.markets.markets[i].getOrdersForAccount(
            this._openOrdersAccounts[i]
          )
        );
      })
    );
    this._orders = [].concat(...orders);
  }

  private updatePositions() {
    let positions: Position[] = [];
    for (var i = 0; i < this._marginAccount.positions.length; i++) {
      if (this._marginAccount.positions[i].position.toNumber() != 0) {
        positions.push({
          marketIndex: i,
          market: Exchange.zetaGroup.products[i].market,
          position: utils.convertNativeLotSizeToDecimal(
            this._marginAccount.positions[i].position.toNumber()
          ),
          costOfTrades: utils.convertNativeBNToDecimal(
            this._marginAccount.positions[i].costOfTrades
          ),
        });
      }
    }
    this._positions = positions;
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
      Exchange.zetaGroup.products.map(async (product, index) => {
        if (
          // If the nonce is not zero, we know there is an open orders account.
          this._marginAccount.openOrdersNonce[index] !== 0 &&
          // If this is equal to default, it means we haven't added the PDA yet.
          this._openOrdersAccounts[index].equals(PublicKey.default)
        ) {
          let [openOrdersPda, _openOrdersNonce] = await utils.getOpenOrders(
            Exchange.programId,
            product.market,
            this.publicKey
          );
          this._openOrdersAccounts[index] = openOrdersPda;
        }
      })
    );
  }

  /**
   * Closes the client websocket subscription to margin account.
   */
  public async close() {
    await this._program.account.marginAccount.unsubscribe(
      this._marginAccountAddress
    );
    this._eventEmitter.removeListener("change");
    if (this._tradeEventListener !== undefined) {
      await this._program.removeEventListener(this._tradeEventListener);
    }
    if (this._pollIntervalId !== undefined) {
      clearInterval(this._pollIntervalId);
    }
  }
}

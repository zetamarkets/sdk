import * as anchor from "@zetamarkets/anchor";
import * as utils from "./utils";
import { exchange as Exchange } from "./exchange";
import {
  SpreadAccount,
  MarginAccount,
  CrossMarginAccount,
  PositionMovementEvent,
  ReferralAccount,
  ReferrerAccount,
  TradeEventV3,
  OrderCompleteEvent,
  ProductLedger,
} from "./program-types";
import {
  PublicKey,
  Connection,
  ConfirmOptions,
  TransactionSignature,
  Transaction,
  TransactionInstruction,
  AccountInfo,
  Context,
} from "@solana/web3.js";
import * as constants from "./constants";
import { referUserIx } from "./program-instructions";
import { EventType } from "./events";
import * as types from "./types";
import { Asset } from "./assets";
import * as instructions from "./program-instructions";
import { assets } from ".";

export class Client {
  /**
   * Anchor provider instance.
   */
  public get provider(): anchor.AnchorProvider {
    return this._provider;
  }
  public get connection(): Connection {
    return this._provider.connection;
  }
  private _provider: anchor.AnchorProvider;

  /**
   * Stores the user referral account data.
   */
  public get referralAccount(): ReferralAccount | null {
    return this._referralAccount;
  }
  private _referralAccount: ReferralAccount | null;
  private _referralAccountAddress: PublicKey;

  /**
   * Stores the user referrer account data.
   */
  public get referrerAccount(): ReferrerAccount | null {
    return this._referrerAccount;
  }
  private _referrerAccount: ReferrerAccount | null;

  /**
   * Stores the user referrer account alias.
   */
  public get referrerAlias(): string | null {
    return this._referrerAlias;
  }
  private _referrerAlias: string | null;

  /**
   * Client margin account address.
   */
  public get publicKey(): PublicKey {
    if (this._delegatorKey != undefined) {
      return this._delegatorKey;
    }
    return this.provider.wallet.publicKey;
  }

  /**
   * User open order addresses.
   * If a user hasn't initialized it, it is set to PublicKey.default
   */
  public get crossMarginOpenOrdersAccounts(): Map<Asset, PublicKey> {
    return this._crossMarginOpenOrdersAccounts;
  }
  private _crossMarginOpenOrdersAccounts: Map<Asset, PublicKey>;

  /**
   * Client usdc account address.
   */
  public get usdcAccountAddress(): PublicKey {
    return this._usdcAccountAddress;
  }
  private _usdcAccountAddress: PublicKey;

  /**
   * Stores the user margin account state.
   */
  public get crossMarginAccount(): CrossMarginAccount | null {
    return this._crossMarginAccount;
  }
  private _crossMarginAccount: CrossMarginAccount | null;

  /**
   * Client cross-margin account address.
   */
  public get crossMarginAccountAddress(): PublicKey {
    return this._crossMarginAccountAddress;
  }
  private _crossMarginAccountAddress: PublicKey;

  /**
   * User token account address (for the cross-margin account).
   */
  public get userTokenAccountAddress(): PublicKey {
    return this._userTokenAccountAddress;
  }
  private _userTokenAccountAddress: PublicKey;

  /**
   * User balance is kept in a separate token account
   */
  public get balance(): number {
    return this._balance;
  }
  // TODO update this periodically by fetching from chain
  private _balance: number;

  /**
   * Returns a list of user current cross-margin account positions.
   */
  public get crossMarginPositions(): types.Position[] {
    return this._crossMarginPositions;
  }
  private _crossMarginPositions: types.Position[];

  /**
   * Returns a list of the user's current cross-margin account orders.
   */
  public get orders(): types.Order[] {
    return this._orders;
  }
  private _orders: types.Order[];

  /**
   * The subscription id for the cross-margin account subscription.
   */
  private _crossMarginAccountSubscriptionId: number = undefined;

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
   * The listener for trade v3 events.
   */
  private _tradeEventV3Listener: any;

  /**
   * The listener for OrderComplete events.
   */
  private _orderCompleteEventListener: any;

  /**
   * Timer id from SetInterval.
   */
  private _pollIntervalId: any;

  public get delegatorKey(): PublicKey {
    return this._delegatorKey;
  }
  private _delegatorKey: PublicKey = undefined;

  public get useVersionedTxs(): boolean {
    return this._useVersionedTxs;
  }
  private _useVersionedTxs: boolean = false;

  private constructor(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions
  ) {
    this._provider = new anchor.AnchorProvider(connection, wallet, opts);
    this._referralAccount = null;
    this._referrerAccount = null;
    this._referrerAlias = null;
    this._crossMarginAccount = null;
    this._crossMarginOpenOrdersAccounts = new Map();
  }

  public static async load(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions = utils.defaultCommitment(),
    callback: (asset: Asset, type: EventType, data: any) => void = undefined,
    throttle: boolean = false,
    delegator: PublicKey = undefined,
    useVersionedTxs: boolean = false
  ): Promise<Client> {
    let client = new Client(connection, wallet, opts);

    let owner = wallet.publicKey;
    if (delegator != undefined) {
      owner = delegator;
      client._delegatorKey = delegator;
    }

    client._useVersionedTxs = useVersionedTxs;
    client._usdcAccountAddress = utils.getAssociatedTokenAddress(
      Exchange.usdcMintAddress,
      owner
    );
    client._whitelistDepositAddress = undefined;
    client._whitelistTradingFeesAddress = undefined;

    let [crossMarginAccountAddress, _crossMarginAccountNonce] =
      utils.getCrossMarginAccount(Exchange.programId, owner);
    client._crossMarginAccountAddress = crossMarginAccountAddress;

    let [userTokenAccount, _userTokenAccountNonce] = utils.getUserTokenAccount(
      Exchange.programId,
      crossMarginAccountAddress,
      Exchange.usdcMintAddress
    );
    client._userTokenAccountAddress = userTokenAccount;

    client._crossMarginAccountSubscriptionId = connection.onAccountChange(
      client._crossMarginAccountAddress,
      async (accountInfo: AccountInfo<Buffer>, context: Context) => {
        client._crossMarginAccount = Exchange.program.coder.accounts.decode(
          types.ProgramAccountType.CrossMarginAccount,
          accountInfo.data
        );

        if (throttle || client._updatingState) {
          client._pendingUpdate = true;
          client._pendingUpdateSlot = context.slot;
          return;
        }

        await client.updateState(undefined, false);
        client._lastUpdateTimestamp = Exchange.clockTimestamp;

        if (callback !== undefined) {
          callback(null, EventType.USER, {
            UserCallbackType: types.UserCallbackType.CROSSMARGINACCOUNTCHANGE,
          });
        }

        client.updateOpenOrdersAddresses();
      },
      connection.commitment
    );

    const whitelistDepositAddress = utils.getUserWhitelistDepositAccount(
      Exchange.programId,
      owner
    )[0];
    const whitelistTradingFeesAddress =
      utils.getUserWhitelistTradingFeesAccount(Exchange.programId, owner)[0];

    if (
      (await Exchange.program.account.whitelistDepositAccount.fetchNullable(
        whitelistDepositAddress
      )) != null
    ) {
      console.log("User is whitelisted for unlimited deposits into zeta.");
      client._whitelistDepositAddress = whitelistDepositAddress;
    }
    if (
      (await Exchange.program.account.whitelistTradingFeesAccount.fetchNullable(
        whitelistTradingFeesAddress
      )) != null
    ) {
      console.log("User is whitelisted for trading fees.");
      client._whitelistTradingFeesAddress = whitelistTradingFeesAddress;
    }

    Exchange.assets.forEach((asset, _i) => {
      client._crossMarginOpenOrdersAccounts.set(asset, PublicKey.default);
    });

    client.setPolling(constants.DEFAULT_CLIENT_TIMER_INTERVAL);
    client._referralAccountAddress = undefined;
    client._referrerAlias = undefined;

    if (callback !== undefined) {
      client._tradeEventV3Listener = Exchange.program.addEventListener(
        "TradeEventV3",
        (event: TradeEventV3, _slot) => {
          if (
            client._crossMarginAccountAddress.toString() ==
            event.marginAccount.toString()
          ) {
            callback(
              assets.fromProgramAsset(event.asset),
              EventType.TRADEV3,
              event
            );
          }
        }
      );

      client._orderCompleteEventListener = Exchange.program.addEventListener(
        "OrderCompleteEvent",
        (event: OrderCompleteEvent, _slot) => {
          if (
            client._crossMarginAccountAddress.toString() ==
            event.marginAccount.toString()
          ) {
            callback(
              assets.fromProgramAsset(event.asset),
              EventType.ORDERCOMPLETE,
              event
            );
          }
        }
      );
    }

    // TODO
    // client.updateOrders();
    // any other updates in subclient.load()

    return client;
  }

  public setUseVersionedTxs(useVersionedTxs: boolean) {
    this._useVersionedTxs = useVersionedTxs;
  }

  public async setReferralData() {
    this.delegatedCheck();
    try {
      let [referrerAccount] = utils.getReferrerAccountAddress(
        Exchange.programId,
        this.publicKey
      );

      this._referrerAccount =
        (await Exchange.program.account.referrerAccount.fetch(
          referrerAccount
        )) as unknown as ReferrerAccount;
      console.log(`User is a referrer. ${this.publicKey}.`);

      let referrerAlias = await utils.fetchReferrerAliasAccount(this.publicKey);
      if (referrerAlias !== null) {
        let existingAlias = Buffer.from(referrerAlias.alias).toString().trim();
        this._referrerAlias = existingAlias;
      }
    } catch (e) {}

    try {
      let [referralAccountAddress, _nonce] = utils.getReferralAccountAddress(
        Exchange.programId,
        this.publicKey
      );

      this._referralAccountAddress = referralAccountAddress;
      this._referralAccount =
        (await Exchange.program.account.referralAccount.fetch(
          referralAccountAddress
        )) as unknown as ReferralAccount;
      console.log(
        `User has been referred by ${this._referralAccount.referrer.toString()}.`
      );
    } catch (e) {}
  }

  public async referUser(referrer: PublicKey): Promise<TransactionSignature> {
    this.delegatedCheck();
    let [referrerAccount] = utils.getReferrerAccountAddress(
      Exchange.programId,
      referrer
    );

    try {
      await Exchange.program.account.referrerAccount.fetch(referrerAccount);
    } catch (e) {
      throw Error(`Invalid referrer. ${referrer.toString()}`);
    }
    let tx = new Transaction().add(
      referUserIx(this.provider.wallet.publicKey, referrer)
    );
    let txId = await utils.processTransaction(this.provider, tx);

    [this._referralAccountAddress] = utils.getReferralAccountAddress(
      Exchange.programId,
      this.publicKey
    );

    this._referralAccount =
      (await Exchange.program.account.referralAccount.fetch(
        this._referralAccountAddress
      )) as unknown as ReferralAccount;

    return txId;
  }

  /**
   * @param timerInterval   desired interval for subClient polling.
   */
  private setPolling(timerInterval: number) {
    if (this._pollIntervalId !== undefined) {
      console.log(`Resetting existing timer to ${timerInterval} seconds.`);
      clearInterval(this._pollIntervalId);
    }

    this._pollIntervalId = setInterval(async () => {
      await this.pollUpdate();
    }, timerInterval * 1000);
  }

  public async pollUpdate() {
    // if (
    //   Exchange.clockTimestamp >
    //     this._lastUpdateTimestamp + this._pollInterval ||
    //   this._pendingUpdate
    // ) {
    //   try {
    //     if (this._updatingState) {
    //       return;
    //     }
    //     let latestSlot = this._pendingUpdateSlot;
    //     await this.updateState();
    //     // If there was a margin account websocket callback, we want to
    //     // trigger an `updateState` on the next timer tick.
    //     if (latestSlot == this._pendingUpdateSlot) {
    //       this._pendingUpdate = false;
    //     }
    //     this._lastUpdateTimestamp = Exchange.clockTimestamp;
    //     if (this._callback !== undefined) {
    //       this._callback(this.asset, EventType.USER, {
    //         UserCallbackType: types.UserCallbackType.POLLUPDATE,
    //       });
    //     }
    //   } catch (e) {
    //     console.log(`SubClient poll update failed. Error: ${e}`);
    //   }
    // }
  }

  public marketIdentifierToPublicKey(
    asset: Asset,
    market: types.MarketIdentifier
  ) {
    // marketIndex is either number or PublicKey
    let marketPubkey: PublicKey;
    if (typeof market == "number") {
      marketPubkey = Exchange.getMarket(asset, market).address;
    } else {
      marketPubkey = market;
    }
    return marketPubkey;
  }

  public marketIdentifierToIndex(asset: Asset, market: types.MarketIdentifier) {
    let index: number;
    if (typeof market == "number") {
      index = market;
    } else {
      index = Exchange.getZetaGroupMarkets(asset).getMarketIndex(market);
    }
    return index;
  }

  public async placeOrderCrossMargin(
    asset: Asset,
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    let marketPubkey = Exchange.getPerpMarket(asset).address;

    let tx = new Transaction();

    let openOrdersPda = null;
    if (
      this._crossMarginOpenOrdersAccounts.get(asset).equals(PublicKey.default)
    ) {
      console.log(
        `[${assets.assetToName(
          asset
        )}] User doesn't have open orders account. Initialising...`
      );

      let [initIx, _openOrdersPda] =
        instructions.initializeOpenOrdersCrossMarginIx(
          asset,
          marketPubkey,
          this.publicKey,
          this.provider.wallet.publicKey,
          this.crossMarginAccountAddress
        );
      openOrdersPda = _openOrdersPda;
      tx.add(initIx);
    } else {
      openOrdersPda = this._crossMarginOpenOrdersAccounts.get(asset);
    }

    let tifOffsetToUse = utils.getTIFOffset(
      Exchange.getZetaGroupMarkets(asset).getMarket(marketPubkey),
      options.tifOptions
    );

    let orderIx = instructions.placeOrderCrossMarginIx(
      asset,
      price,
      size,
      side,
      options.orderType != undefined
        ? options.orderType
        : types.OrderType.LIMIT,
      options.clientOrderId != undefined ? options.clientOrderId : 0,
      options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
      tifOffsetToUse,
      this.crossMarginAccountAddress,
      this.provider.wallet.publicKey,
      openOrdersPda,
      this._userTokenAccountAddress,
      this.whitelistTradingFeesAddress
    );

    tx.add(orderIx);

    let txId: TransactionSignature = await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined,
      options.blockhash
    );
    this._crossMarginOpenOrdersAccounts.set(asset, openOrdersPda);
    return txId;
  }

  // TODO functions for createPlaceXXXOrderInstruction and createCancelXXXInstruction

  public async editDelegatedPubkey(
    asset: Asset,
    delegatedPubkey: PublicKey
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    let tx = new Transaction();

    tx.add(
      instructions.editDelegatedPubkeyIx(
        asset,
        delegatedPubkey,
        this.crossMarginAccountAddress,
        this.provider.wallet.publicKey
      )
    );

    return await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
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

  public async depositCrossMargin(
    amount: number
  ): Promise<TransactionSignature> {
    await this.usdcAccountCheck();
    this.delegatedCheck();

    // Check if the user has a cross margin account.
    let tx = new Transaction();
    if (this._crossMarginAccount === null) {
      console.log(
        "User has no cross-margin account. Creating cross-margin account..."
      );
      tx.add(
        instructions.initializeCrossMarginAccountIx(
          this._crossMarginAccountAddress,
          this.provider.wallet.publicKey
        )
      );
      tx.add(
        instructions.initializeUserTokenAccountIx(
          this._crossMarginAccountAddress,
          this.provider.wallet.publicKey
        )
      );
    }

    tx.add(
      instructions.depositCrossMarginIx(
        amount,
        this._crossMarginAccountAddress,
        this._userTokenAccountAddress,
        this._usdcAccountAddress,
        this.provider.wallet.publicKey
      )
    );

    return await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  public async updateCrossmarginAccount(fetch, force) {}

  /**
   * Polls the margin account for the latest state.
   * @param asset The underlying asset (eg SOL, BTC)
   * @param fetch Whether to fetch and update _marginAccount and _spreadAccount in the subClient
   * @param force Whether to forcefully update even though we may be already updating state currently
   */
  public async updateState(
    asset: Asset = undefined,
    fetch = true,
    force = false
  ) {
    // TODO add a this._updatingState like in subclient
    // So that we can use `fetch` and `force`
    this._crossMarginAccount =
      (await Exchange.program.account.crossMarginAccount.fetch(
        this._crossMarginAccountAddress
      )) as unknown as CrossMarginAccount;

    let positions: types.Position[] = [];
    for (
      var i = 0;
      i < this._crossMarginAccount.crossMarginProductLedgers.length;
      i++
    ) {
      if (
        this._crossMarginAccount.crossMarginProductLedgers[
          i
        ].productLedger.position.size.toNumber() != 0
      ) {
        positions.push({
          asset: assets.fromProgramAsset(
            this._crossMarginAccount.crossMarginProductLedgers[i].asset
          ),
          marketIndex: constants.PERP_INDEX,
          market: Exchange.getPerpMarket(asset).address,
          size: utils.convertNativeLotSizeToDecimal(
            this._crossMarginAccount.crossMarginProductLedgers[
              i
            ].productLedger.position.size.toNumber()
          ),
          costOfTrades: utils.convertNativeBNToDecimal(
            this._crossMarginAccount.crossMarginProductLedgers[i].productLedger
              .position.costOfTrades
          ),
        });
      }
    }
    this._crossMarginPositions = positions;

    let allAssetOrders = [];
    await Promise.all(
      Exchange.assets.map(async (asset, _i) => {
        let orders = [];
        let market = Exchange.getPerpMarket(asset);
        await market.updateOrderbook();
        orders.push(
          market.getOrdersForAccount(
            this._crossMarginOpenOrdersAccounts.get(asset)
          )
        );

        let allOrders = [].concat(...orders);
        allAssetOrders = allAssetOrders.concat(
          allOrders.filter(function (order: types.Order) {
            let seqNum = utils.getSeqNumFromSerumOrderKey(
              order.orderId,
              order.side == types.Side.BID
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
          })
        );
      })
    );
    this._orders = allAssetOrders;
  }

  public getCrossMarginAccountState(
    pnlExecutionPrice: number = undefined,
    pnlAddTakerFees: boolean = false
  ): types.MarginAccountState {
    return Exchange.riskCalculator.getCrossMarginAccountState(
      this.crossMarginAccount,
      this.balance,
      pnlExecutionPrice,
      pnlAddTakerFees
    );
  }

  public async closeCrossMarginAccount(
    asset: Asset
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    if (this._crossMarginAccount === null) {
      throw Error("User has no cross-margin account to close");
    }
    // TODO closeCrossMarginAccountIx
    return null;
  }

  public async withdrawCrossMargin(
    amount: number
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    let tx = new Transaction();
    tx.add(
      instructions.withdrawCrossMarginIx(
        amount,
        this._crossMarginAccountAddress,
        this._userTokenAccountAddress,
        this._usdcAccountAddress,
        this.provider.wallet.publicKey
      )
    );
    return await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  // TODO

  //   public async withdrawAndCloseCrossMarginAccount(
  //   ): Promise<TransactionSignature> {
  //   }

  public async cancelAllAssetMarketOrders(): Promise<TransactionSignature> {
    let tx = new Transaction();

    for (var asset of Exchange.assets) {
      if (
        this.crossMarginOpenOrdersAccounts.get(asset).equals(PublicKey.default)
      ) {
        continue;
      }

      tx.add(
        instructions.cancelAllMarketOrdersCrossMarginIx(
          asset,
          this.provider.wallet.publicKey,
          this.crossMarginAccountAddress,
          this.crossMarginOpenOrdersAccounts.get(asset)
        )
      );
    }
    return await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  public async cancelAllMarketOrders(
    asset: Asset
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let ix = instructions.cancelAllMarketOrdersCrossMarginIx(
      asset,
      this.provider.wallet.publicKey,
      this.crossMarginAccountAddress,
      this.crossMarginOpenOrdersAccounts.get(asset)
    );
    tx.add(ix);
    return await utils.processTransaction(this.provider, tx);
  }

  /**
   * Cancels a user order by orderId
   * @param market     the market address of the order to be cancelled.
   * @param orderId    the order id of the order.
   * @param side       the side of the order. bid / ask.
   */
  public async cancelOrderCrossMargin(
    asset: Asset,
    orderId: anchor.BN,
    side: types.Side
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let ix = instructions.cancelOrderCrossMarginIx(
      asset,
      this.provider.wallet.publicKey,
      this._crossMarginAccountAddress,
      this._crossMarginOpenOrdersAccounts.get(asset),
      orderId,
      side
    );
    tx.add(ix);
    return await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  public async replaceByClientOrderId(
    asset: Asset,
    market: types.MarketIdentifier,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOptions: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    tx.add(
      instructions.cancelOrderByClientOrderIdNoErrorCrossMarginIx(
        asset,
        this.provider.wallet.publicKey,
        this._crossMarginAccountAddress,
        this._crossMarginOpenOrdersAccounts.get(asset),
        new anchor.BN(cancelClientOrderId)
      )
    );

    let tifOffsetToUse = utils.getTIFOffset(
      Exchange.getPerpMarket(asset),
      newOptions.tifOptions
    );

    tx.add(
      instructions.placeOrderCrossMarginIx(
        asset,
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
        this.crossMarginAccountAddress,
        this.provider.wallet.publicKey,
        this.crossMarginOpenOrdersAccounts.get(asset),
        this._userTokenAccountAddress,
        this.whitelistTradingFeesAddress
      )
    );

    return await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined,
      newOptions.blockhash
    );
  }

  public async initializeOpenOrdersAccount(
    asset: Asset,
    market: PublicKey
  ): Promise<TransactionSignature> {
    if (
      !this._crossMarginOpenOrdersAccounts.get(asset).equals(PublicKey.default)
    ) {
      throw Error("User already has an open orders account for market!");
    }

    let [initIx, openOrdersPda] =
      instructions.initializeOpenOrdersCrossMarginIx(
        asset,
        market,
        this.publicKey,
        this.provider.wallet.publicKey,
        this.crossMarginAccountAddress
      );

    let tx = new Transaction().add(initIx);
    let txId = await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
    this._crossMarginOpenOrdersAccounts.set(asset, openOrdersPda);

    return txId;
  }

  // TODO

  //   public async closeOpenOrdersAccount(
  //     asset: Asset,
  //     market: PublicKey
  //   ): Promise<TransactionSignature> {
  //     return await this.getSubClient(asset).closeOpenOrdersAccount(market);
  //   }

  //   public async closeMultipleOpenOrdersAccount(
  //     asset: Asset,
  //     markets: PublicKey[]
  //   ): Promise<TransactionSignature[]> {
  //     return await this.getSubClient(asset).closeMultipleOpenOrdersAccount(
  //       markets
  //     );
  //   }

  public async cancelMultipleOrdersCrossMargin(
    cancelArguments: types.CrossMarginCancelArgs[]
  ): Promise<TransactionSignature[]> {
    let ixs = [];
    for (var i = 0; i < cancelArguments.length; i++) {
      let asset = cancelArguments[i].asset;
      let ix = instructions.cancelOrderCrossMarginIx(
        asset,
        this.provider.wallet.publicKey,
        this.crossMarginAccountAddress,
        this.crossMarginOpenOrdersAccounts.get(asset),
        cancelArguments[i].orderId,
        cancelArguments[i].cancelSide
      );
      ixs.push(ix);
    }
    let txs = utils.splitIxsIntoTx(
      ixs,
      this.useVersionedTxs
        ? constants.MAX_CANCELS_PER_TX_LUT
        : constants.MAX_CANCELS_PER_TX
    );
    let txIds: string[] = [];
    await Promise.all(
      txs.map(async (tx) => {
        txIds.push(await utils.processTransaction(this.provider, tx));
      })
    );
    return txIds;
  }

  public async cancelMultipleOrdersNoErrorCrossMargin(
    cancelArguments: types.CancelArgs[]
  ): Promise<TransactionSignature[]> {
    let ixs = [];
    for (var i = 0; i < cancelArguments.length; i++) {
      let asset = cancelArguments[i].asset;
      let ix = instructions.cancelOrderNoErrorCrossMarginIx(
        asset,
        this.provider.wallet.publicKey,
        this.crossMarginAccountAddress,
        this.crossMarginOpenOrdersAccounts.get(asset),
        cancelArguments[i].orderId,
        cancelArguments[i].cancelSide
      );
      ixs.push(ix);
    }
    let txs = utils.splitIxsIntoTx(
      ixs,
      this.useVersionedTxs
        ? constants.MAX_CANCELS_PER_TX_LUT
        : constants.MAX_CANCELS_PER_TX
    );
    let txIds: string[] = [];
    await Promise.all(
      txs.map(async (tx) => {
        txIds.push(await utils.processTransaction(this.provider, tx));
      })
    );
    return txIds;
  }

  public async forceCancelOrderByOrderId(
    asset: Asset,
    market: types.MarketIdentifier,
    marginAccountToCancel: PublicKey,
    orderId: anchor.BN,
    side: types.Side
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    let marginAccount = (await Exchange.program.account.marginAccount.fetch(
      marginAccountToCancel
    )) as unknown as CrossMarginAccount;

    let openOrdersAccountToCancel = utils.createOpenOrdersAddress(
      Exchange.programId,
      this.marketIdentifierToPublicKey(asset, market),
      marginAccount.authority,
      marginAccount.openOrdersNonce[assets.assetToIndex(asset)]
    );

    let [userTokenAccount, _userTokenAccountNonce] = utils.getUserTokenAccount(
      Exchange.programId,
      marginAccountToCancel,
      Exchange.usdcMintAddress
    );

    let tx = new Transaction();
    let ix = instructions.forceCancelOrderByOrderIdCrossMarginIx(
      asset,
      marginAccountToCancel,
      openOrdersAccountToCancel,
      userTokenAccount,
      orderId,
      side
    );
    tx.add(ix);
    return await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  public async forceCancelOrders(
    asset: Asset,
    market: types.MarketIdentifier,
    marginAccountToCancel: PublicKey
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    let marginAccount = (await Exchange.program.account.marginAccount.fetch(
      marginAccountToCancel
    )) as unknown as CrossMarginAccount;

    let openOrdersAccountToCancel = utils.createOpenOrdersAddress(
      Exchange.programId,
      this.marketIdentifierToPublicKey(asset, market),
      marginAccount.authority,
      marginAccount.openOrdersNonce[assets.assetToIndex(asset)]
    );

    let [userTokenAccount, _userTokenAccountNonce] = utils.getUserTokenAccount(
      Exchange.programId,
      marginAccountToCancel,
      Exchange.usdcMintAddress
    );

    let tx = new Transaction();
    let ix = instructions.forceCancelOrdersCrossMarginIx(
      asset,
      marginAccountToCancel,
      openOrdersAccountToCancel,
      userTokenAccount
    );
    tx.add(ix);
    return await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this.useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  // TODO

  //   public async liquidate(
  //     asset: Asset,
  //     market: types.MarketIdentifier,
  //     liquidatedMarginAccount: PublicKey,
  //     size: number
  //   ): Promise<TransactionSignature> {
  //     return await this.getSubClient(asset).liquidate(
  //       this.marketIdentifierToPublicKey(asset, market),
  //       liquidatedMarginAccount,
  //       size
  //     );
  //   }

  public getMarginPositions() {
    return this._crossMarginPositions;
  }

  public getOrders() {
    return this._orders;
  }

  public getOpeningOrders(
    asset: Asset,
    side: types.Side,
    decimal: boolean = false
  ): number {
    let orderState = this.getProductLedger(asset).orderState;
    let orderIndex = side == types.Side.BID ? 0 : 1;
    let size = orderState.openingOrders[orderIndex].toNumber();
    return decimal ? utils.convertNativeLotSizeToDecimal(size) : size;
  }

  public getClosingOrders(asset: Asset, decimal: boolean = false): number {
    let orderState = this.getProductLedger(asset).orderState;
    let size = orderState.closingOrders.toNumber();
    return decimal ? utils.convertNativeLotSizeToDecimal(size) : size;
  }

  public getOpenOrdersAccounts(): PublicKey[] {
    return [...this._crossMarginOpenOrdersAccounts.values()];
  }

  public getOpenOrdersAccount(asset: Asset): PublicKey {
    return this._crossMarginOpenOrdersAccounts.get(asset);
  }

  public getCrossMarginAccount(): CrossMarginAccount | null {
    return this.crossMarginAccount;
  }

  public getCrossMarginAccountAddress(): PublicKey {
    return this.crossMarginAccountAddress;
  }

  public async initializeReferrerAccount() {
    this.delegatedCheck();
    let tx = new Transaction().add(
      await instructions.initializeReferrerAccountIx(this.publicKey)
    );
    await utils.processTransaction(this._provider, tx);
  }

  public async initializeReferrerAlias(
    alias: string
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    if (alias.length > 15) {
      throw new Error("Alias cannot be over 15 chars!");
    }

    let [referrerAccountAddress] = utils.getReferrerAccountAddress(
      Exchange.programId,
      this.publicKey
    );

    try {
      await Exchange.program.account.referrerAccount.fetch(
        referrerAccountAddress
      );
    } catch (e) {
      throw Error(`User is not a referrer, cannot create alias.`);
    }

    let referrerAlias = await utils.fetchReferrerAliasAccount(this.publicKey);
    if (referrerAlias !== null) {
      let existingAlias = Buffer.from(referrerAlias.alias).toString().trim();
      throw Error(`Referrer already has alias. ${existingAlias}`);
    }

    let tx = new Transaction().add(
      await instructions.initializeReferrerAliasIx(this.publicKey, alias)
    );

    let txid = await utils.processTransaction(this.provider, tx);
    this._referrerAlias = alias;

    return txid;
  }

  public async claimReferrerRewards(): Promise<TransactionSignature> {
    this.delegatedCheck();
    let [referrerAccountAddress] = utils.getReferrerAccountAddress(
      Exchange.programId,
      this.publicKey
    );
    let tx = new Transaction().add(
      await instructions.claimReferralsRewardsIx(
        referrerAccountAddress,
        this._usdcAccountAddress,
        this.provider.wallet.publicKey
      )
    );
    return await utils.processTransaction(this._provider, tx);
  }

  public async claimReferralRewards(): Promise<TransactionSignature> {
    this.delegatedCheck();
    let [referralAccountAddress] = utils.getReferralAccountAddress(
      Exchange.programId,
      this.publicKey
    );
    let tx = new Transaction().add(
      await instructions.claimReferralsRewardsIx(
        referralAccountAddress,
        this._usdcAccountAddress,
        this.provider.wallet.publicKey
      )
    );
    return await utils.processTransaction(this._provider, tx);
  }

  public getProductLedger(asset: Asset): ProductLedger {
    return this._crossMarginAccount.crossMarginProductLedgers[
      assets.assetToIndex(asset)
    ].productLedger;
  }

  private updateOpenOrdersAddresses() {
    Exchange.markPrices.products.map((product, index) => {
      let asset_index = assets.indexToAsset(index);
      if (
        // If the nonce is not zero, we know there is an open orders account.
        this._crossMarginAccount.openOrdersNonce[index] !== 0 &&
        // If this is equal to default, it means we haven't added the PDA yet.
        this._crossMarginOpenOrdersAccounts
          .get(asset_index)
          .equals(PublicKey.default)
      ) {
        let [openOrdersPda, _openOrdersNonce] = utils.getOpenOrders(
          Exchange.programId,
          product.market,
          this.publicKey
        );
        this._crossMarginOpenOrdersAccounts.set(asset_index, openOrdersPda);
      }
    });
  }

  public async close() {
    if (this._crossMarginAccountSubscriptionId !== undefined) {
      await this.provider.connection.removeAccountChangeListener(
        this._crossMarginAccountSubscriptionId
      );
      this._crossMarginAccountSubscriptionId = undefined;
    }
    if (this._pollIntervalId !== undefined) {
      clearInterval(this._pollIntervalId);
      this._pollIntervalId = undefined;
    }

    if (this._tradeEventV3Listener !== undefined) {
      await Exchange.program.removeEventListener(this._tradeEventV3Listener);
      this._tradeEventV3Listener = undefined;
    }

    if (this._orderCompleteEventListener !== undefined) {
      await Exchange.program.removeEventListener(
        this._orderCompleteEventListener
      );
      this._orderCompleteEventListener = undefined;
    }
  }

  private delegatedCheck() {
    if (this.delegatorKey) {
      throw Error(
        "Function not supported by delegated client. Please load without 'delegator' argument"
      );
    }
  }
}

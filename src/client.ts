import * as anchor from "@zetamarkets/anchor";
import * as utils from "./utils";
import { exchange as Exchange } from "./exchange";
import {
  SpreadAccount,
  MarginAccount,
  PositionMovementEvent,
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
} from "@solana/web3.js";
import * as constants from "./constants";
import { EventType } from "./events";
import * as types from "./types";
import { Asset } from "./constants";
import { SubClient } from "./subclient";
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
   * Client margin account address.
   */
  public get publicKey(): PublicKey {
    if (this._delegatorKey != undefined) {
      return this._delegatorKey;
    }
    return this.provider.wallet.publicKey;
  }

  /**
   * Client usdc account address.
   */
  public get usdcAccountAddress(): PublicKey {
    return this._usdcAccountAddress;
  }
  private _usdcAccountAddress: PublicKey;

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
   * A map for quick access when getting a callback
   */
  private _marginAccountToAsset: Map<String, Asset>;

  /**
   * Timer id from SetInterval.
   */
  private _pollIntervalId: any;

  public get subClients(): Map<Asset, SubClient> {
    return this._subClients;
  }

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
    this._subClients = new Map();
    this._marginAccountToAsset = new Map();
  }
  private _subClients: Map<Asset, SubClient>;

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

    const ACCS_PER_SUBCLIENT = 2;

    const subClientToFetchPromises = Exchange.assets
      .map((a) => {
        let marginAccountAddress = utils.getMarginAccount(
          Exchange.programId,
          Exchange.getZetaGroupAddress(a),
          owner
        )[0];

        let spreadAccountAddress = utils.getSpreadAccount(
          Exchange.programId,
          Exchange.getZetaGroupAddress(a),
          owner
        )[0];

        return [
          Exchange.program.account.marginAccount.fetchNullable(
            marginAccountAddress
          ),
          Exchange.program.account.spreadAccount.fetchNullable(
            spreadAccountAddress
          ),
        ];
      })
      .flat();

    const whitelistDepositAddress = utils.getUserWhitelistDepositAccount(
      Exchange.programId,
      owner
    )[0];
    const whitelistTradingFeesAddress =
      utils.getUserWhitelistTradingFeesAccount(Exchange.programId, owner)[0];

    const promiseResults = await Promise.all(
      subClientToFetchPromises.concat([
        Exchange.program.account.whitelistDepositAccount.fetchNullable(
          whitelistDepositAddress
        ),
        Exchange.program.account.whitelistTradingFeesAccount.fetchNullable(
          whitelistTradingFeesAddress
        ),
      ])
    );

    if (promiseResults[Exchange.assets.length * ACCS_PER_SUBCLIENT] != null) {
      console.log("User is whitelisted for unlimited deposits into zeta.");
      client._whitelistDepositAddress = whitelistDepositAddress;
    }
    if (
      promiseResults[Exchange.assets.length * ACCS_PER_SUBCLIENT + 1] != null
    ) {
      console.log("User is whitelisted for trading fees.");
      client._whitelistTradingFeesAddress = whitelistTradingFeesAddress;
    }

    Exchange.assets.forEach((asset, i) => {
      const subClient = SubClient.load(
        asset,
        client,
        connection,
        owner,
        [
          promiseResults[i * ACCS_PER_SUBCLIENT],
          promiseResults[i * ACCS_PER_SUBCLIENT + 1],
        ],
        callback,
        throttle
      );
      client.addSubClient(asset, subClient);
      client._marginAccountToAsset.set(
        subClient.marginAccountAddress.toString(),
        asset
      );
    });

    client.setPolling(constants.DEFAULT_CLIENT_TIMER_INTERVAL);

    if (callback !== undefined) {
      client._tradeEventV3Listener = Exchange.program.addEventListener(
        "TradeEventV3",
        (event: TradeEventV3, _slot) => {
          if (
            client._marginAccountToAsset.has(event.marginAccount.toString())
          ) {
            callback(
              client._marginAccountToAsset.get(event.marginAccount.toString()),
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
            client._marginAccountToAsset.has(event.marginAccount.toString())
          ) {
            callback(
              client._marginAccountToAsset.get(event.marginAccount.toString()),
              EventType.ORDERCOMPLETE,
              event
            );
          }
        }
      );
    }

    await Promise.all(
      client.getAllSubClients().map(async (subClient) => {
        return subClient.updateOrders();
      })
    );

    return client;
  }

  public setUseVersionedTxs(useVersionedTxs: boolean) {
    this._useVersionedTxs = useVersionedTxs;
  }

  private addSubClient(asset: Asset, subClient: SubClient) {
    this._subClients.set(asset, subClient);
  }

  public getSubClient(asset: Asset): SubClient {
    return this._subClients.get(asset);
  }

  public getAllSubClients(): SubClient[] {
    return [...this._subClients.values()];
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
      await Promise.all(
        this.getAllSubClients().map(async (subClient) => {
          subClient.pollUpdate();
        })
      );
    }, timerInterval * 1000);
  }

  public marketIdentifierToPublicKey(
    asset: Asset,
    market: types.MarketIdentifier
  ) {
    // marketIndex is either number or PublicKey
    let marketPubkey: PublicKey;
    if (typeof market == "number") {
      if (market != constants.PERP_INDEX) {
        throw Error("Non-perp market");
      }
      marketPubkey = Exchange.getPerpMarket(asset).address;
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

  // Refresh this._subExchange in the subClients, useful for integration testing
  public relinkExchange() {
    for (var subclient of this.subClients.values()) {
      subclient.updateSubExchange();
    }
  }

  public async placeOrder(
    asset: Asset,
    market: types.MarketIdentifier,
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    let marketPubkey = this.marketIdentifierToPublicKey(asset, market);
    if (marketPubkey == Exchange.getPerpMarket(asset).address) {
      return await this.getSubClient(asset).placePerpOrder(
        price,
        size,
        side,
        options
      );
    } else {
      throw Error("Cannot place non-perp order");
    }
  }

  public async placePerpOrder(
    asset: Asset,
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).placePerpOrder(
      price,
      size,
      side,
      options
    );
  }

  public createPlacePerpOrderInstruction(
    asset: Asset,
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions = types.defaultOrderOptions()
  ): TransactionInstruction {
    return this.getSubClient(asset).createPlacePerpOrderInstruction(
      price,
      size,
      side,
      options
    );
  }

  public createCancelOrderNoErrorInstruction(
    asset: Asset,
    market: types.MarketIdentifier,
    orderId: anchor.BN,
    side: types.Side
  ): TransactionInstruction {
    return this.getSubClient(asset).createCancelOrderNoErrorInstruction(
      this.marketIdentifierToIndex(asset, market),
      orderId,
      side
    );
  }

  public createCancelAllMarketOrdersInstruction(
    asset: Asset,
    market: types.MarketIdentifier
  ): TransactionInstruction {
    return this.getSubClient(asset).createCancelAllMarketOrdersInstruction(
      this.marketIdentifierToIndex(asset, market)
    );
  }

  public async editDelegatedPubkey(
    asset: Asset,
    delegatedPubkey: PublicKey
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).editDelegatedPubkey(delegatedPubkey);
  }

  public async migrateFunds(
    amount: number,
    withdrawAsset: Asset,
    depositAsset: Asset
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    await this.usdcAccountCheck();
    let tx = new Transaction();
    let withdrawSubClient = this.getSubClient(withdrawAsset);
    let depositSubClient = this.getSubClient(depositAsset);

    // Create withdraw ix
    tx.add(
      instructions.withdrawV2Ix(
        amount,
        withdrawSubClient.marginAccountAddress,
        this.usdcAccountAddress,
        this.provider.wallet.publicKey
      )
    );

    // Create deposit tx
    if (depositSubClient.marginAccount === null) {
      console.log("User has no margin account. Creating margin account...");
      tx.add(
        instructions.initializeMarginAccountIx(
          depositSubClient.subExchange.zetaGroupAddress,
          depositSubClient.marginAccountAddress,
          this.provider.wallet.publicKey
        )
      );
    }
    tx.add(
      instructions.depositV2Ix(
        amount,
        depositSubClient.marginAccountAddress,
        this.usdcAccountAddress,
        this.provider.wallet.publicKey,
        this.whitelistDepositAddress
      )
    );

    return await utils.processTransaction(this._provider, tx);
  }

  public async deposit(
    asset: Asset,
    amount: number
  ): Promise<TransactionSignature> {
    await this.usdcAccountCheck();
    return await this.getSubClient(asset).deposit(amount);
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
    if (asset != undefined) {
      await this.getSubClient(asset).updateState(fetch, force);
    } else {
      await Promise.all(
        this.getAllSubClients().map(async (subClient) => {
          await subClient.updateState(fetch, force);
        })
      );
    }
  }

  public async cancelAllOrders(
    asset: Asset = undefined
  ): Promise<TransactionSignature[]> {
    if (asset != undefined) {
      return await this.getSubClient(asset).cancelAllOrders();
    } else {
      // Grab all cancel instructions across all assets
      let ixs = [];

      this.getAllSubClients().map((subclient) => {
        ixs = ixs.concat(subclient.cancelAllOrdersIxs());
      });

      // Pack them into txs as efficiently as possible
      let txs = utils.splitIxsIntoTx(
        ixs,
        this.useVersionedTxs
          ? constants.MAX_CANCELS_PER_TX_LUT
          : constants.MAX_CANCELS_PER_TX
      );
      let txIds: string[] = [];
      await Promise.all(
        txs.map(async (tx) => {
          txIds.push(
            await utils.processTransaction(
              this.provider,
              tx,
              undefined,
              undefined,
              undefined,
              this.useVersionedTxs ? utils.getZetaLutArr() : undefined
            )
          );
        })
      );
      return txIds;
    }
  }

  public async cancelAllOrdersNoError(
    asset: Asset = undefined
  ): Promise<TransactionSignature[]> {
    if (asset != undefined) {
      return await this.getSubClient(asset).cancelAllOrdersNoError();
    } else {
      // Grab all cancel instructions across all assets
      let ixs = [];

      this.getAllSubClients().map((subclient) => {
        ixs = ixs.concat(subclient.cancelAllOrdersNoErrorIxs());
      });

      // Pack them into txs as efficiently as possible
      let txs = utils.splitIxsIntoTx(
        ixs,
        this.useVersionedTxs
          ? constants.MAX_CANCELS_PER_TX_LUT
          : constants.MAX_CANCELS_PER_TX
      );
      let txIds: string[] = [];
      await Promise.all(
        txs.map(async (tx) => {
          txIds.push(
            await utils.processTransaction(
              this.provider,
              tx,
              undefined,
              undefined,
              undefined,
              this.useVersionedTxs ? utils.getZetaLutArr() : undefined
            )
          );
        })
      );
      return txIds;
    }
  }

  public getMarginAccountState(asset: Asset): types.MarginAccountState {
    return Exchange.riskCalculator.getMarginAccountState(
      this.getSubClient(asset).marginAccount
    );
  }

  public async closeMarginAccount(asset: Asset): Promise<TransactionSignature> {
    return await this.getSubClient(asset).closeMarginAccount();
  }

  public async closeSpreadAccount(asset: Asset): Promise<TransactionSignature> {
    return await this.getSubClient(asset).closeSpreadAccount();
  }

  public async withdraw(
    asset: Asset,
    amount: number
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).withdraw(amount);
  }

  public async withdrawAndCloseMarginAccount(
    asset: Asset
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).withdrawAndCloseMarginAccount();
  }

  public async cancelAllPerpMarketOrders(): Promise<TransactionSignature> {
    let tx = new Transaction();

    for (var asset of Exchange.assets) {
      let sc = this.getSubClient(asset);
      if (
        sc.marginAccount == null ||
        sc.openOrdersAccounts[constants.PERP_INDEX].equals(PublicKey.default)
      ) {
        continue;
      }

      tx.add(
        instructions.cancelAllMarketOrdersIx(
          asset,
          this.provider.wallet.publicKey,
          this.getSubClient(asset).marginAccountAddress,
          this.getSubClient(asset).openOrdersAccounts[constants.PERP_INDEX]
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
    asset: Asset,
    market: types.MarketIdentifier
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let index = Exchange.getZetaGroupMarkets(asset).getMarketIndex(
      this.marketIdentifierToPublicKey(asset, market)
    );
    let ix = instructions.cancelAllMarketOrdersIx(
      asset,
      this.provider.wallet.publicKey,
      this.getSubClient(asset).marginAccountAddress,
      this.getSubClient(asset).openOrdersAccounts[index]
    );
    tx.add(ix);
    return await utils.processTransaction(this.provider, tx);
  }

  public async cancelOrder(
    asset: Asset,
    market: types.MarketIdentifier,
    orderId: anchor.BN,
    side: types.Side
  ): Promise<TransactionSignature> {
    let marketPubkey = this.marketIdentifierToPublicKey(asset, market);
    return await this.getSubClient(asset).cancelOrder(
      marketPubkey,
      orderId,
      side
    );
  }

  public async cancelOrderByClientOrderId(
    asset: Asset,
    market: types.MarketIdentifier,
    clientOrderId: number
  ): Promise<TransactionSignature> {
    let marketPubkey = this.marketIdentifierToPublicKey(asset, market);
    return await this.getSubClient(asset).cancelOrderByClientOrderId(
      marketPubkey,
      clientOrderId
    );
  }

  public async cancelAndPlaceOrder(
    asset: Asset,
    market: types.MarketIdentifier,
    orderId: anchor.BN,
    cancelSide: types.Side,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOptions: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).cancelAndPlaceOrder(
      this.marketIdentifierToPublicKey(asset, market),
      orderId,
      cancelSide,
      newOrderPrice,
      newOrderSize,
      newOrderSide,
      newOptions
    );
  }

  public async cancelAndPlaceOrderByClientOrderId(
    asset: Asset,
    market: types.MarketIdentifier,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOptions: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).cancelAndPlaceOrderByClientOrderId(
      this.marketIdentifierToPublicKey(asset, market),
      cancelClientOrderId,
      newOrderPrice,
      newOrderSize,
      newOrderSide,
      newOptions
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
    return await this.getSubClient(asset).replaceByClientOrderId(
      this.marketIdentifierToPublicKey(asset, market),
      cancelClientOrderId,
      newOrderPrice,
      newOrderSize,
      newOrderSide,
      newOptions
    );
  }

  public async initializeOpenOrdersAccount(
    asset: Asset,
    market: PublicKey
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).initializeOpenOrdersAccount(market);
  }

  public async closeOpenOrdersAccount(
    asset: Asset,
    market: PublicKey
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).closeOpenOrdersAccount(market);
  }

  public async closeMultipleOpenOrdersAccount(
    asset: Asset,
    markets: PublicKey[]
  ): Promise<TransactionSignature[]> {
    return await this.getSubClient(asset).closeMultipleOpenOrdersAccount(
      markets
    );
  }

  public async cancelMultipleOrders(
    cancelArguments: types.CancelArgs[]
  ): Promise<TransactionSignature[]> {
    let ixs = [];
    for (var i = 0; i < cancelArguments.length; i++) {
      let asset = cancelArguments[i].asset;
      let marketIndex = Exchange.getZetaGroupMarkets(asset).getMarketIndex(
        cancelArguments[i].market
      );
      let ix = instructions.cancelOrderIx(
        asset,
        this.provider.wallet.publicKey,
        this.getSubClient(asset).marginAccountAddress,
        this.getSubClient(asset).openOrdersAccounts[marketIndex],
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

  public async cancelMultipleOrdersNoError(
    asset: Asset,
    cancelArguments: types.CancelArgs[]
  ): Promise<TransactionSignature[]> {
    let ixs = [];
    for (var i = 0; i < cancelArguments.length; i++) {
      let asset = cancelArguments[i].asset;
      let marketIndex = Exchange.getZetaGroupMarkets(asset).getMarketIndex(
        cancelArguments[i].market
      );
      let ix = instructions.cancelOrderNoErrorIx(
        asset,
        this.provider.wallet.publicKey,
        this.getSubClient(asset).marginAccountAddress,
        this.getSubClient(asset).openOrdersAccounts[marketIndex],
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
    return await this.getSubClient(asset).forceCancelOrderByOrderId(
      this.marketIdentifierToPublicKey(asset, market),
      marginAccountToCancel,
      orderId,
      side
    );
  }

  public async forceCancelOrders(
    asset: Asset,
    market: types.MarketIdentifier,
    marginAccountToCancel: PublicKey
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).forceCancelOrders(
      this.marketIdentifierToPublicKey(asset, market),
      marginAccountToCancel
    );
  }

  public async liquidate(
    asset: Asset,
    market: types.MarketIdentifier,
    liquidatedMarginAccount: PublicKey,
    size: number
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).liquidate(
      this.marketIdentifierToPublicKey(asset, market),
      liquidatedMarginAccount,
      size
    );
  }

  public async transferExcessSpreadBalance(
    asset: Asset
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).transferExcessSpreadBalance();
  }

  public getMarginPositionSize(
    asset: Asset,
    index: number,
    decimal: boolean = false
  ): number {
    return this.getSubClient(asset).getMarginPositionSize(index, decimal);
  }

  public getMarginCostOfTrades(
    asset: Asset,
    index: number,
    decimal: boolean = false
  ): number {
    return this.getSubClient(asset).getMarginCostOfTrades(index, decimal);
  }

  public getMarginPositions(asset: Asset) {
    return this.getSubClient(asset).marginPositions;
  }

  public getSpreadPositions(asset: Asset) {
    return this.getSubClient(asset).spreadPositions;
  }
  public getOrders(asset: Asset) {
    return this.getSubClient(asset).orders;
  }

  public getOpeningOrders(
    asset: Asset,
    index: number,
    side: types.Side,
    decimal: boolean = false
  ): number {
    return this.getSubClient(asset).getOpeningOrders(index, side, decimal);
  }

  public getClosingOrders(
    asset: Asset,
    index: number,
    decimal: boolean = false
  ): number {
    return this.getSubClient(asset).getClosingOrders(index, decimal);
  }

  public getOpenOrdersAccounts(asset: Asset): PublicKey[] {
    return this.getSubClient(asset).openOrdersAccounts;
  }

  public getSpreadPositionSize(
    asset: Asset,
    index: number,
    decimal: boolean = false
  ) {
    return this.getSubClient(asset).getSpreadPositionSize(index, decimal);
  }

  public getSpreadCostOfTrades(
    asset: Asset,
    index: number,
    decimal: boolean = false
  ): number {
    return this.getSubClient(asset).getSpreadCostOfTrades(index, decimal);
  }

  public getSpreadAccount(asset: Asset): SpreadAccount | null {
    return this.getSubClient(asset).spreadAccount;
  }

  public getSpreadAccountAddress(asset: Asset): PublicKey {
    return this.getSubClient(asset).spreadAccountAddress;
  }

  public getMarginAccount(asset: Asset): MarginAccount | null {
    return this.getSubClient(asset).marginAccount;
  }

  public getMarginAccountAddress(asset: Asset): PublicKey {
    return this.getSubClient(asset).marginAccountAddress;
  }

  public getMarginAccountAddresses(): PublicKey[] {
    let addresses = [];
    for (var asset of Exchange.assets) {
      addresses.push(this.getSubClient(asset).marginAccountAddress);
    }
    return addresses;
  }

  public getProductLedger(asset: Asset, marketIndex: number): ProductLedger {
    return this.getSubClient(asset).getProductLedger(marketIndex);
  }

  public async close() {
    await Promise.all(
      this.getAllSubClients().map(async (subClient) => {
        subClient.close();
      })
    );
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

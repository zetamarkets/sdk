import * as anchor from "@project-serum/anchor";
import {
  PublicKey,
  Connection,
  ConfirmOptions,
  TransactionSignature,
} from "@solana/web3.js";
import * as utils from "./utils";
import * as constants from "./constants";
import {
  MarginAccount,
  PositionMovementEvent,
  SpreadAccount,
} from "./program-types";
import { EventType } from "./events";
import * as types from "./types";
import { Asset } from "./assets";
import { SubClient } from "./subclient";
import { exchange as Exchange } from "./exchange";
import * as instructions from "./program-instructions";

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
   * Returns the user wallet public key.
   */
  public get publicKey(): PublicKey {
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
   * Timer id from SetInterval.
   */
  private _pollIntervalId: any;

  private constructor(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions
  ) {
    this._provider = new anchor.AnchorProvider(connection, wallet, opts);
    this._subClients = new Map();
  }

  public get subClients(): Map<Asset, SubClient> {
    return this._subClients;
  }
  private _subClients: Map<Asset, SubClient>;

  public static async load(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions = utils.defaultCommitment(),
    callback: (asset: Asset, type: EventType, data: any) => void = undefined,
    throttle: boolean = false
  ): Promise<Client> {
    let client = new Client(connection, wallet, opts);

    client._usdcAccountAddress = await utils.getAssociatedTokenAddress(
      Exchange.usdcMintAddress,
      wallet.publicKey
    );

    client._whitelistDepositAddress = undefined;
    try {
      let [whitelistDepositAddress, _whitelistTradingFeesNonce] =
        await utils.getUserWhitelistDepositAccount(
          Exchange.programId,
          wallet.publicKey
        );
      await Exchange.program.account.whitelistDepositAccount.fetch(
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
      await Exchange.program.account.whitelistTradingFeesAccount.fetch(
        whitelistTradingFeesAddress
      );
      console.log("User is whitelisted for trading fees.");
      client._whitelistTradingFeesAddress = whitelistTradingFeesAddress;
    } catch (e) {}

    await Promise.all(
      Exchange.assets.map(async (asset) => {
        const subClient = await SubClient.load(
          asset,
          client,
          connection,
          wallet,
          callback,
          throttle
        );
        client.addSubClient(asset, subClient);
      })
    );

    client.setPolling(constants.DEFAULT_CLIENT_TIMER_INTERVAL);

    return client;
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
    marketIndex: types.MarketIdentifier
  ) {
    // marketIndex is either number or PublicKey
    let market: PublicKey;
    if (typeof marketIndex == "number") {
      market =
        Exchange.getSubExchange(asset).markets.markets[marketIndex].address;
    } else {
      market = marketIndex;
    }
    return market;
  }

  public async placeOrder(
    asset: Asset,
    marketIndex: types.MarketIdentifier,
    price: number,
    size: number,
    side: types.Side,
    type: types.OrderType = types.OrderType.LIMIT,
    clientOrderId = 0,
    tag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).placeOrderV3(
      this.marketIdentifierToPublicKey(asset, marketIndex),
      price,
      size,
      side,
      type,
      clientOrderId,
      tag
    );
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
    if (asset) {
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
    if (asset) {
      return await this.getSubClient(asset).cancelAllOrders();
    } else {
      let allTxIds = [];
      await Promise.all(
        this.getAllSubClients().map(async (subClient) => {
          let txIds = await subClient.cancelAllOrders();
          allTxIds = allTxIds.concat(txIds);
        })
      );
      return allTxIds;
    }
  }

  public async cancelAllOrdersNoError(
    asset: Asset = undefined
  ): Promise<TransactionSignature[]> {
    if (asset) {
      return await this.getSubClient(asset).cancelAllOrdersNoError();
    } else {
      let allTxIds = [];
      await Promise.all(
        this.getAllSubClients().map(async (subClient) => {
          let txIds = await subClient.cancelAllOrdersNoError();
          allTxIds = allTxIds.concat(txIds);
        })
      );
      return allTxIds;
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

  public async placeOrderAndLockPosition(
    asset: Asset,
    marketIndex: types.MarketIdentifier,
    price: number,
    size: number,
    side: types.Side,
    tag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).placeOrderAndLockPosition(
      this.marketIdentifierToPublicKey(asset, marketIndex),
      price,
      size,
      side,
      tag
    );
  }

  public async cancelOrder(
    asset: Asset,
    marketIndex: types.MarketIdentifier,
    orderId: anchor.BN,
    side: types.Side
  ): Promise<TransactionSignature> {
    let market = this.marketIdentifierToPublicKey(asset, marketIndex);
    return await this.getSubClient(asset).cancelOrder(market, orderId, side);
  }

  public async cancelOrderByClientOrderId(
    asset: Asset,
    marketIndex: types.MarketIdentifier,
    clientOrderId: number
  ): Promise<TransactionSignature> {
    let market = this.marketIdentifierToPublicKey(asset, marketIndex);
    return await this.getSubClient(asset).cancelOrderByClientOrderId(
      market,
      clientOrderId
    );
  }

  public async cancelAndPlaceOrder(
    asset: Asset,
    marketIndex: types.MarketIdentifier,
    orderId: anchor.BN,
    cancelSide: types.Side,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOrderType: types.OrderType = types.OrderType.LIMIT,
    clientOrderId = 0,
    newOrderTag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).cancelAndPlaceOrderV3(
      this.marketIdentifierToPublicKey(asset, marketIndex),
      orderId,
      cancelSide,
      newOrderPrice,
      newOrderSize,
      newOrderSide,
      newOrderType,
      clientOrderId,
      newOrderTag
    );
  }

  public async cancelAndPlaceOrderByClientOrderId(
    asset: Asset,
    marketIndex: types.MarketIdentifier,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOrderType: types.OrderType,
    newOrderClientOrderId: number,
    newOrderTag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).cancelAndPlaceOrderByClientOrderIdV3(
      this.marketIdentifierToPublicKey(asset, marketIndex),
      cancelClientOrderId,
      newOrderPrice,
      newOrderSize,
      newOrderSide,
      newOrderType,
      newOrderClientOrderId,
      newOrderTag
    );
  }

  public async replaceByClientOrderId(
    asset: Asset,
    marketIndex: types.MarketIdentifier,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOrderType: types.OrderType,
    newOrderClientOrderId: number,
    newOrderTag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).replaceByClientOrderIdV3(
      this.marketIdentifierToPublicKey(asset, marketIndex),
      cancelClientOrderId,
      newOrderPrice,
      newOrderSize,
      newOrderSide,
      newOrderType,
      newOrderClientOrderId,
      newOrderTag
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
    asset: Asset,
    cancelArguments: types.CancelArgs[]
  ): Promise<TransactionSignature[]> {
    return await this.getSubClient(asset).cancelMultipleOrders(cancelArguments);
  }

  public async cancelMultipleOrdersNoError(
    asset: Asset,
    cancelArguments: types.CancelArgs[]
  ): Promise<TransactionSignature[]> {
    return await this.getSubClient(asset).cancelMultipleOrdersNoError(
      cancelArguments
    );
  }

  public async forceCancelOrders(
    asset: Asset,
    marketIndex: types.MarketIdentifier,
    marginAccountToCancel: PublicKey
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).forceCancelOrders(
      this.marketIdentifierToPublicKey(asset, marketIndex),
      marginAccountToCancel
    );
  }

  public async liquidate(
    asset: Asset,
    marketIndex: types.MarketIdentifier,
    liquidatedMarginAccount: PublicKey,
    size: number
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).liquidate(
      this.marketIdentifierToPublicKey(asset, marketIndex),
      liquidatedMarginAccount,
      size
    );
  }

  public async positionMovement(
    asset: Asset,
    movementType: types.MovementType,
    movements: instructions.PositionMovementArg[]
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).positionMovement(
      movementType,
      movements
    );
  }

  public async simulatePositionMovement(
    asset: Asset,
    movementType: types.MovementType,
    movements: instructions.PositionMovementArg[]
  ): Promise<PositionMovementEvent> {
    return await this.getSubClient(asset).simulatePositionMovement(
      movementType,
      movements
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

  public getSpreadAccount(asset: Asset): SpreadAccount {
    return this.getSubClient(asset).spreadAccount;
  }

  public getSpreadAccountAddress(asset: Asset): PublicKey {
    return this.getSubClient(asset).spreadAccountAddress;
  }

  public getMarginAccount(asset: Asset): MarginAccount {
    return this.getSubClient(asset).marginAccount;
  }

  public getMarginAccountAddress(asset: Asset): PublicKey {
    return this.getSubClient(asset).marginAccountAddress;
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
  }
}

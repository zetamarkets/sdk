import * as anchor from "@project-serum/anchor";
import * as utils from "./utils";
import { exchange as Exchange } from "./exchange";
import {
  SpreadAccount,
  MarginAccount,
  PositionMovementEvent,
  ReferralAccount,
  ReferrerAccount,
} from "./program-types";
import {
  PublicKey,
  Connection,
  ConfirmOptions,
  TransactionSignature,
  Transaction,
} from "@solana/web3.js";
import * as constants from "./constants";
import { referUserIx } from "./program-instructions";
import { EventType } from "./events";
import * as types from "./types";
import { Asset } from "./assets";
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
   * Stores the user referral account data.
   */
  public get referralAccount(): ReferralAccount | null {
    return this._referralAccount;
  }
  private _referralAccount: ReferralAccount | null;
  private _referralAccountAddress: PublicKey;

  /**
   * Client margin account address.
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

  public get subClients(): Map<Asset, SubClient> {
    return this._subClients;
  }

  private constructor(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions
  ) {
    this._provider = new anchor.AnchorProvider(connection, wallet, opts);
    this._subClients = new Map();
    this._referralAccount = null;
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
    client._referralAccountAddress = undefined;
    try {
      let [referralAccountAddress, _nonce] =
        await utils.getReferralAccountAddress(
          Exchange.programId,
          wallet.publicKey
        );

      client._referralAccountAddress = referralAccountAddress;
      client._referralAccount =
        (await Exchange.program.account.referralAccount.fetch(
          referralAccountAddress
        )) as unknown as ReferralAccount;
      console.log(
        `User has been referred by ${client._referralAccount.referrer.toString()}.`
      );
    } catch (e) {}

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
    // This is referring itself by another referrer.
  }

  public async referUser(referrer: PublicKey): Promise<TransactionSignature> {
    let [referrerAccount] = await utils.getReferrerAccountAddress(
      Exchange.programId,
      referrer
    );

    try {
      await Exchange.program.account.referrerAccount.fetch(referrerAccount);
    } catch (e) {
      throw Error(`Invalid referrer. ${referrer.toString()}`);
    }
    let tx = new Transaction().add(
      await referUserIx(this.provider.wallet.publicKey, referrer)
    );
    let txId = await utils.processTransaction(this.provider, tx);

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
      marketPubkey =
        Exchange.getSubExchange(asset).markets.markets[market].address;
    } else {
      marketPubkey = market;
    }
    return marketPubkey;
  }

  public async placeOrder(
    asset: Asset,
    market: types.MarketIdentifier,
    price: number,
    size: number,
    side: types.Side,
    type: types.OrderType = types.OrderType.LIMIT,
    clientOrderId = 0,
    tag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).placeOrderV3(
      this.marketIdentifierToPublicKey(asset, market),
      price,
      size,
      side,
      type,
      clientOrderId,
      tag
    );
  }

  public async migrateFunds(
    amount: number,
    withdrawAsset: assets.Asset,
    depositAsset: assets.Asset
  ): Promise<TransactionSignature> {
    await this.usdcAccountCheck();
    let tx = new Transaction();
    let withdrawSubClient = this.getSubClient(withdrawAsset);
    let depositSubClient = this.getSubClient(depositAsset);

    // Create withdraw ix
    tx.add(
      instructions.withdrawIx(
        withdrawAsset,
        amount,
        withdrawSubClient.marginAccountAddress,
        this.usdcAccountAddress,
        this.publicKey
      )
    );

    // Create deposit tx
    if (depositSubClient.marginAccount === null) {
      console.log("User has no margin account. Creating margin account...");
      tx.add(
        instructions.initializeMarginAccountIx(
          depositSubClient.subExchange.zetaGroupAddress,
          depositSubClient.marginAccountAddress,
          this.publicKey
        )
      );
    }
    tx.add(
      await instructions.depositIx(
        depositAsset,
        amount,
        depositSubClient.marginAccountAddress,
        this.usdcAccountAddress,
        this.publicKey,
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
    market: types.MarketIdentifier,
    price: number,
    size: number,
    side: types.Side,
    tag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).placeOrderAndLockPosition(
      this.marketIdentifierToPublicKey(asset, market),
      price,
      size,
      side,
      tag
    );
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
    newOrderType: types.OrderType = types.OrderType.LIMIT,
    clientOrderId = 0,
    newOrderTag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).cancelAndPlaceOrderV3(
      this.marketIdentifierToPublicKey(asset, market),
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
    market: types.MarketIdentifier,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOrderType: types.OrderType,
    newOrderClientOrderId: number,
    newOrderTag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).cancelAndPlaceOrderByClientOrderIdV3(
      this.marketIdentifierToPublicKey(asset, market),
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
    market: types.MarketIdentifier,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOrderType: types.OrderType,
    newOrderClientOrderId: number,
    newOrderTag: String = constants.DEFAULT_ORDER_TAG
  ): Promise<TransactionSignature> {
    return await this.getSubClient(asset).replaceByClientOrderIdV3(
      this.marketIdentifierToPublicKey(asset, market),
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

  public async initializeReferrerAlias(
    alias: string
  ): Promise<TransactionSignature> {
    let [referrerAccountAddress] = await utils.getReferrerAccountAddress(
      Exchange.programId,
      this.publicKey
    );

    let [referrerAliasAddress] = await utils.getReferrerAliasAddress(
      Exchange.programId,
      alias
    );

    let referrerAccount: ReferrerAccount;
    try {
      referrerAccount = await Exchange.program.account.referrerAccount.fetch(
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

    return await utils.processTransaction(this.provider, tx);
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

import * as anchor from "@zetamarkets/anchor";
import * as utils from "./utils";
import {
  assetToIndex,
  assetToName,
  fromProgramAsset,
  indexToAsset,
} from "./assets";
import * as constants from "./constants";
import { Asset } from "./constants";
import { exchange as Exchange } from "./exchange";
import {
  CrossMarginAccount,
  CrossMarginAccountManager,
  CrossMarginAccountInfo,
  ReferralAccount,
  ReferrerAccount,
  TradeEventV3,
  OrderCompleteEvent,
  ProductLedger,
} from "./program-types";
import {
  PublicKey,
  Connection,
  Transaction,
  TransactionSignature,
  AccountInfo,
  Context,
  TransactionInstruction,
  ConfirmOptions,
} from "@solana/web3.js";
import * as types from "./types";
import * as instructions from "./program-instructions";
import { EventType } from "./events";
import { Client } from "./client";
import { SubExchange } from "./subexchange";
import { assets, programTypes } from ".";

export class CrossClient {
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
   * Stores the user margin account state.
   */
  public get account(): CrossMarginAccount | null {
    return this._account;
  }
  private _account: CrossMarginAccount | null;

  /**
   * CrossClient margin account address.
   */
  public get accountAddress(): PublicKey {
    return this._accountAddress;
  }
  private _accountAddress: PublicKey;

  /**
   * Stores the user margin account manager state.
   */
  public get accountManager(): CrossMarginAccountManager | null {
    return this._accountManager;
  }
  private _accountManager: CrossMarginAccountManager | null;

  /**
   * CrossClient margin account manager address.
   */
  public get accountManagerAddress(): PublicKey {
    return this._accountManagerAddress;
  }
  private _accountManagerAddress: PublicKey;

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
  public get orders(): Map<Asset, types.Order[]> {
    return this._orders;
  }
  private _orders: Map<Asset, types.Order[]>;

  /**
   * Returns a list of user current margin account positions.
   */
  public get positions(): Map<Asset, types.Position[]> {
    return this._positions;
  }
  private _positions: Map<Asset, types.Position[]>;

  /**
   * Index in CrossMarginAccountManager
   */
  public get subaccountIndex(): number {
    return this._subaccountIndex;
  }
  private _subaccountIndex: number;

  /**
   * The subscription id for the margin account subscription.
   */
  private _accountSubscriptionId: number = undefined;

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

  private constructor(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions
  ) {
    this._openOrdersAccounts = Array(constants.ACTIVE_PERP_MARKETS).fill(
      PublicKey.default
    );

    this._positions = new Map();
    this._orders = new Map();
    for (var asset of Exchange.assets) {
      this._positions.set(asset, []);
      this._orders.set(asset, []);
    }

    this._lastUpdateTimestamp = 0;
    this._pendingUpdate = false;
    this._account = null;
    this._accountManager = null;

    this._provider = new anchor.AnchorProvider(connection, wallet, opts);
    this._referralAccount = null;
    this._referrerAccount = null;
    this._referrerAlias = null;
  }

  /**
   * Returns a new instance of CrossClient, based off state in the Exchange singleton.
   * Requires the Exchange to be in a valid state to succeed.
   *
   * @param throttle    Defaults to true.
   *                    If set to false, margin account callbacks will also call
   *                    `updateState` instead of waiting for the poll.
   */
  public static async load(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions = utils.defaultCommitment(),
    callback: (asset: Asset, type: EventType, data: any) => void = undefined,
    throttle: boolean = false,
    delegator: PublicKey = undefined,
    useVersionedTxs: boolean = false,
    subaccountIndex: number = 0
  ): Promise<CrossClient> {
    let client = new CrossClient(connection, wallet, opts);
    let owner = wallet.publicKey;
    if (delegator != undefined) {
      owner = delegator;
      client._delegatorKey = delegator;
    }

    client._subaccountIndex = subaccountIndex;
    client._useVersionedTxs = useVersionedTxs;
    client._usdcAccountAddress = utils.getAssociatedTokenAddress(
      Exchange.usdcMintAddress,
      owner
    );
    client._whitelistDepositAddress = undefined;
    client._whitelistTradingFeesAddress = undefined;

    const whitelistDepositAddress = utils.getUserWhitelistDepositAccount(
      Exchange.programId,
      owner
    )[0];
    const whitelistTradingFeesAddress =
      utils.getUserWhitelistTradingFeesAccount(Exchange.programId, owner)[0];

    let accountAddress = utils.getCrossMarginAccount(
      Exchange.programId,
      owner,
      Uint8Array.from([subaccountIndex]) // seed number for subaccounts
    )[0];

    let accountManagerAddress = utils.getCrossMarginAccountManager(
      Exchange.programId,
      owner
    )[0];

    // Fetch all of them at the same time to speed up client loading
    let promiseResults = await Promise.all([
      Exchange.program.account.crossMarginAccountManager.fetchNullable(
        accountManagerAddress
      ),
      Exchange.program.account.crossMarginAccount.fetchNullable(accountAddress),
      Exchange.program.account.whitelistDepositAccount.fetchNullable(
        whitelistDepositAddress
      ),
      Exchange.program.account.whitelistTradingFeesAccount.fetchNullable(
        whitelistTradingFeesAddress
      ),
    ]);

    if (promiseResults[2] != null) {
      console.log("User is whitelisted for unlimited deposits into zeta.");
      client._whitelistDepositAddress = whitelistDepositAddress;
    }
    if (promiseResults[3] != null) {
      console.log("User is whitelisted for trading fees.");
      client._whitelistTradingFeesAddress = whitelistTradingFeesAddress;
    }

    client._accountAddress = accountAddress;
    client._accountManagerAddress = accountManagerAddress;
    client._callback = callback;

    client._accountSubscriptionId = connection.onAccountChange(
      client._accountAddress,
      async (accountInfo: AccountInfo<Buffer>, context: Context) => {
        client._account = Exchange.program.coder.accounts.decode(
          types.ProgramAccountType.CrossMarginAccount,
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
          callback(null, EventType.USER, {
            UserCallbackType: types.UserCallbackType.CROSSMARGINACCOUNTCHANGE,
          });
        }

        client.updateOpenOrdersAddresses();
      },
      connection.commitment
    );

    if (promiseResults[0] != null) {
      client._accountManager = promiseResults[0] as CrossMarginAccountManager;
    } else {
      console.log(`User does not have a cross margin account manager.`);
    }

    if (promiseResults[1] != null) {
      client._account = promiseResults[1] as CrossMarginAccount;
      // Set open order pdas for initialized accounts.
      client.updateOpenOrdersAddresses();
      client.updatePositions();
      // We don't update orders here to make load faster.
      client._pendingUpdate = true;
    } else {
      console.log(`User does not have a cross margin account.`);
    }

    client.setPolling(constants.DEFAULT_CLIENT_TIMER_INTERVAL);
    client._referralAccountAddress = undefined;
    client._referrerAlias = undefined;

    if (callback !== undefined) {
      client._tradeEventV3Listener = Exchange.program.addEventListener(
        "TradeEventV3",
        (event: TradeEventV3, _slot) => {
          if (
            client._accountAddress.toString() == event.marginAccount.toString()
          ) {
            callback(fromProgramAsset(event.asset), EventType.TRADEV3, event);
          }
        }
      );

      client._orderCompleteEventListener = Exchange.program.addEventListener(
        "OrderCompleteEvent",
        (event: OrderCompleteEvent, _slot) => {
          if (
            client._accountAddress.toString() == event.marginAccount.toString()
          ) {
            callback(
              fromProgramAsset(event.asset),
              EventType.ORDERCOMPLETE,
              event
            );
          }
        }
      );
    }

    await client.updateOrders();

    return client;
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
          this._callback(null, EventType.USER, {
            UserCallbackType: types.UserCallbackType.POLLUPDATE,
          });
        }
      } catch (e) {
        console.log(`CrossClient poll update failed. Error: ${e}`);
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
        this._account =
          (await Exchange.program.account.crossMarginAccount.fetch(
            this._accountAddress
          )) as unknown as CrossMarginAccount;
      } catch (e) {
        this.toggleUpdateState(false);
        return;
      }
    }

    try {
      if (this._account !== null) {
        this.updatePositions();
        await this.updateOrders();
      }
    } catch (e) {}

    this.toggleUpdateState(false);
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
      instructions.referUserIx(this.provider.wallet.publicKey, referrer)
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

  public async findUserMarginAccounts(): Promise<PublicKey[]> {
    let marginAccounts = [];

    await Promise.all(
      Exchange.assets.map(async (asset) => {
        // Address
        let [address, _nonce] = utils.getMarginAccount(
          Exchange.programId,
          Exchange.getZetaGroupAddress(asset),
          this.publicKey
        );

        // Check if the address is valid
        let account =
          Exchange.program.account.marginAccount.fetchNullable(address);

        if (account) {
          console.log(`Found ${asset} MarginAccount`);
          marginAccounts.push(account);
        }
      })
    );

    return marginAccounts;
  }

  public async migrateToCrossMarginAccount(): Promise<TransactionSignature[]> {
    this.delegatedCheck();
    this.usdcAccountCheck();

    // Dynamically figure out the user's existing margin accounts
    let marginAccounts = await this.findUserMarginAccounts();

    let txs = [];

    // Check if the user has accounts set up
    let tx = new Transaction();
    if (this._account === null) {
      console.log(
        "User has no cross margin account manager. Creating account manager..."
      );
      tx.add(
        instructions.initializeCrossMarginAccountManagerIx(
          this._accountManagerAddress,
          this._provider.wallet.publicKey
        )
      );
    }
    if (this._account === null) {
      console.log("User has no cross margin account. Creating account...");
      tx.add(
        instructions.initializeCrossMarginAccountIx(
          this._accountAddress,
          this._accountManagerAddress,
          this._provider.wallet.publicKey
        )
      );
    }
    tx.add(
      instructions.migrateToCrossMarginAccountIx(
        marginAccounts,
        this._accountAddress,
        this.publicKey
      )
    );
    txs.push(tx);

    let closeAccs = await Exchange.program.account.marginAccount.fetchMultiple(
      marginAccounts
    );
    for (var i = 0; i < closeAccs.length; i++) {
      let acc = closeAccs[i] as programTypes.MarginAccount;
      let asset = assets.fromProgramAsset(acc.asset);
      let market = Exchange.getPerpMarket(asset).address;
      const [vaultOwner, _vaultSignerNonce] = utils.getSerumVaultOwnerAndNonce(
        market,
        constants.DEX_PID[Exchange.network]
      );
      tx = new Transaction();
      tx.add(
        instructions.settleDexFundsIx(
          asset,
          market,
          vaultOwner,
          utils.getOpenOrders(Exchange.programId, market, this.publicKey)[0]
        )
      );
      tx.add(
        instructions.closeOpenOrdersV2Ix(
          market,
          this.publicKey,
          marginAccounts[i],
          utils.getOpenOrders(Exchange.programId, market, this.publicKey)[0]
        )
      );
      tx.add(
        instructions.closeMarginAccountIx(
          asset,
          this.publicKey,
          marginAccounts[i]
        )
      );
      txs.push(tx);
    }

    // Needs to be in order, can't do this async
    let sigs = [];
    for (var t of txs) {
      sigs.push(
        await utils.processTransaction(
          this._provider,
          t,
          undefined,
          undefined,
          undefined,
          this._useVersionedTxs ? utils.getZetaLutArr() : undefined
        )
      );
    }
    return sigs;
  }

  /**
   * @param amount  the native amount to deposit (6 decimals fixed point)
   */
  public async deposit(amount: number): Promise<TransactionSignature> {
    this.delegatedCheck();
    this.usdcAccountCheck();
    // Check if the user has accounts set up
    let tx = new Transaction();
    if (this._account === null) {
      console.log(
        "User has no cross margin account manager. Creating account manager..."
      );
      tx.add(
        instructions.initializeCrossMarginAccountManagerIx(
          this._accountManagerAddress,
          this._provider.wallet.publicKey
        )
      );
    }
    if (this._account === null) {
      console.log("User has no cross margin account. Creating account...");
      tx.add(
        instructions.initializeCrossMarginAccountIx(
          this._accountAddress,
          this._accountManagerAddress,
          this._provider.wallet.publicKey
        )
      );
    }
    tx.add(
      instructions.depositV2Ix(
        amount,
        this._accountAddress,
        this._usdcAccountAddress,
        this._provider.wallet.publicKey,
        this._whitelistDepositAddress
      )
    );

    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  public getAccountState(
    pnlExecutionPrice: number = undefined,
    pnlAddTakerFees: boolean = false
  ): types.MarginAccountState {
    return Exchange.riskCalculator.getCrossMarginAccountState(
      this._account,
      pnlExecutionPrice,
      pnlAddTakerFees
    );
  }

  /**
   * Closes a CrossClient's account
   */
  public async closeAccount(): Promise<TransactionSignature> {
    this.delegatedCheck();
    if (this._account === null) {
      throw Error("User has no account to close");
    }

    let tx = new Transaction().add(
      instructions.closeCrossMarginAccountIx(
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._accountManagerAddress
      )
    );
    let txId: TransactionSignature = await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
    this._account = null;
    return txId;
  }

  /**
   * Closes a CrossClient's account
   */
  public async closeAccountManager(): Promise<TransactionSignature> {
    this.delegatedCheck();
    if (this._accountManager === null) {
      throw Error("User has no account manager to close");
    }

    let tx = new Transaction().add(
      instructions.closeCrossMarginAccountManagerIx(
        this._provider.wallet.publicKey,
        this._accountManagerAddress
      )
    );
    let txId: TransactionSignature = await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
    this._account = null;
    return txId;
  }

  /**
   * @param amount  the native amount to withdraw (6 dp)
   */
  public async withdraw(amount: number): Promise<TransactionSignature> {
    this.delegatedCheck();
    let tx = new Transaction();
    tx.add(
      instructions.withdrawV2Ix(
        amount,
        this._accountAddress,
        this._usdcAccountAddress,
        this._provider.wallet.publicKey
      )
    );
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  /**
   * Withdraws the entirety of the CrossClient's margin account and then closes it.
   */
  public async withdrawAndCloseAccount(): Promise<TransactionSignature> {
    this.delegatedCheck();
    if (this._account === null) {
      throw Error("User has no margin account to withdraw or close.");
    }
    let tx = new Transaction();
    tx.add(
      instructions.withdrawV2Ix(
        this._account.balance.toNumber(),
        this._accountAddress,
        this._usdcAccountAddress,
        this._provider.wallet.publicKey
      )
    );
    tx.add(
      instructions.closeCrossMarginAccountIx(
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._accountManagerAddress
      )
    );
    let txId: TransactionSignature = await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
    this._account = null;
    return txId;
  }

  /**
   * Places an order on a zeta perp market.
   * @param price           the native price of the order (6 d.p as integer)
   * @param size            the quantity of the order (3 d.p)
   * @param side            the side of the order. bid / ask
   * @param orderType       the type of the order. limit / ioc / post-only
   * @param clientOrderId   optional: CrossClient order id (non 0 value)
   * @param tag             optional: the string tag corresponding to who is inserting
   * NOTE: If duplicate CrossClient order ids are used, after a cancel order,
   * to cancel the second order with the same CrossClient order id,
   * you may need to crank the corresponding event queue to flush that order id
   * from the user open orders account before cancelling the second order.
   * (Depending on the order in which the order was cancelled).
   */
  public async placeOrder(
    asset: Asset,
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let assetIndex = assetToIndex(asset);
    let market = Exchange.getPerpMarket(asset);
    let openOrdersPda = null;
    if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      console.log(
        `[${assetToName(
          asset
        )}] User doesn't have open orders account. Initialising for asset ${asset}}.`
      );

      let [initIx, _openOrdersPda] = instructions.initializeOpenOrdersV3Ix(
        asset,
        Exchange.getPerpMarket(asset).address,
        this._provider.wallet.publicKey,
        this._accountAddress
      );
      openOrdersPda = _openOrdersPda;
      tx.add(initIx);
    } else {
      openOrdersPda = this._openOrdersAccounts[assetIndex];
    }

    let tifOffsetToUse = utils.getTIFOffset(market, options.tifOptions);

    let orderIx = instructions.placePerpOrderV3Ix(
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
      this.accountAddress,
      this._provider.wallet.publicKey,
      openOrdersPda,
      this._whitelistTradingFeesAddress
    );

    tx.add(orderIx);

    let txId: TransactionSignature = await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      options.blockhash
    );
    this._openOrdersAccounts[assetIndex] = openOrdersPda;
    return txId;
  }

  public async editDelegatedPubkey(
    delegatedPubkey: PublicKey
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    let tx = new Transaction();

    tx.add(
      instructions.editDelegatedPubkeyIx(
        delegatedPubkey,
        this.accountAddress,
        this._provider.wallet.publicKey
      )
    );

    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  public createCancelOrderNoErrorInstruction(
    asset: Asset,
    orderId: anchor.BN,
    side: types.Side
  ): TransactionInstruction {
    return instructions.cancelOrderNoErrorIx(
      asset,
      this._provider.wallet.publicKey,
      this._accountAddress,
      this._openOrdersAccounts[assetToIndex(asset)],
      orderId,
      side
    );
  }

  public async cancelMarketOrders(asset: Asset): Promise<TransactionSignature> {
    let tx = new Transaction();
    let assetIndex = assetToIndex(asset);
    if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      return null;
    }

    tx.add(
      instructions.cancelAllMarketOrdersIx(
        asset,
        this.provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetIndex]
      )
    );
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  public async cancelAllMarketOrders(): Promise<TransactionSignature> {
    let tx = new Transaction();

    for (var asset of Exchange.assets) {
      let assetIndex = assetToIndex(asset);
      if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
        continue;
      }

      tx.add(
        instructions.cancelAllMarketOrdersIx(
          asset,
          this.provider.wallet.publicKey,
          this._accountAddress,
          this._openOrdersAccounts[assetIndex]
        )
      );
    }
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  public createCancelAllMarketOrdersInstruction(
    asset: Asset
  ): TransactionInstruction {
    return instructions.cancelAllMarketOrdersIx(
      asset,
      this._provider.wallet.publicKey,
      this._accountAddress,
      this._openOrdersAccounts[assetToIndex(asset)]
    );
  }

  public async cancelMultipleOrders(
    cancelArguments: types.CancelArgs[]
  ): Promise<TransactionSignature[]> {
    let ixs = [];
    for (var i = 0; i < cancelArguments.length; i++) {
      let asset = cancelArguments[i].asset;

      let ix = instructions.cancelOrderIx(
        asset,
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetToIndex(asset)],
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
        txIds.push(await utils.processTransaction(this._provider, tx));
      })
    );
    return txIds;
  }

  public async cancelMultipleOrdersNoError(
    cancelArguments: types.CancelArgs[]
  ): Promise<TransactionSignature[]> {
    let ixs = [];
    for (var i = 0; i < cancelArguments.length; i++) {
      let asset = cancelArguments[i].asset;

      let ix = instructions.cancelOrderNoErrorIx(
        asset,
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetToIndex(asset)],
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
        txIds.push(await utils.processTransaction(this._provider, tx));
      })
    );
    return txIds;
  }

  public createPlacePerpOrderInstruction(
    asset: Asset,
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions = types.defaultOrderOptions()
  ): TransactionInstruction {
    let assetIndex = assetToIndex(asset);
    if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      console.log(`No open orders account for ${assetToName(asset)}`);
      throw Error("User does not have an open orders account.");
    }

    let market = Exchange.getPerpMarket(asset);
    let tifOffset = utils.getTIFOffset(market, options.tifOptions);

    return instructions.placePerpOrderV3Ix(
      asset,
      price,
      size,
      side,
      options.orderType != undefined
        ? options.orderType
        : types.OrderType.LIMIT,
      options.clientOrderId != undefined ? options.clientOrderId : 0,
      options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
      tifOffset,
      this.accountAddress,
      this._provider.wallet.publicKey,
      this._openOrdersAccounts[assetIndex],
      this._whitelistTradingFeesAddress
    );
  }

  /**
   * Cancels a user order by orderId
   * @param asset     the asset of the order to be cancelled.
   * @param orderId    the order id of the order.
   * @param side       the side of the order. bid / ask.
   */
  public async cancelOrder(
    asset: Asset,
    orderId: anchor.BN,
    side: types.Side
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let ix = instructions.cancelOrderIx(
      asset,
      this._provider.wallet.publicKey,
      this._accountAddress,
      this._openOrdersAccounts[assetToIndex(asset)],
      orderId,
      side
    );
    tx.add(ix);
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  /**
   * Cancels a user order by CrossClient order id.
   * It will only cancel the FIRST
   * @param asset          the asset of the order to be cancelled.
   * @param clientOrderId   the CrossClient order id of the order. (Non zero value).
   */
  public async cancelOrderByClientOrderId(
    asset: Asset,
    clientOrderId: number
  ): Promise<TransactionSignature> {
    if (clientOrderId == 0) {
      throw Error("CrossClient order id cannot be 0.");
    }
    let tx = new Transaction();
    let ix = instructions.cancelOrderByClientOrderIdIx(
      asset,
      this._provider.wallet.publicKey,
      this._accountAddress,
      this._openOrdersAccounts[assetToIndex(asset)],
      new anchor.BN(clientOrderId)
    );
    tx.add(ix);
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  /**
   * Cancels a user order by orderId and atomically places an order
   * @param asset     the asset of the order to be cancelled.
   * @param orderId    the order id of the order.
   * @param cancelSide       the side of the order. bid / ask.
   * @param newOrderPrice  the native price of the order (6 d.p) as integer
   * @param newOrderSize   the quantity of the order (3 d.p) as integer
   * @param newOrderSide   the side of the order. bid / ask
   * @param newOrderType   the type of the order, limit / ioc / post-only
   * @param clientOrderId   optional: CrossClient order id (non 0 value)
   * @param newOrderTag     optional: the string tag corresponding to who is inserting. Default "SDK", max 4 length
   */
  public async cancelAndPlaceOrder(
    asset: Asset,
    orderId: anchor.BN,
    cancelSide: types.Side,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    options: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    let market = Exchange.getPerpMarket(asset);
    let assetIndex = assetToIndex(asset);
    let tx = new Transaction();
    tx.add(
      instructions.cancelOrderIx(
        asset,
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetIndex],
        orderId,
        cancelSide
      )
    );

    let tifOffsetToUse = utils.getTIFOffset(market, options.tifOptions);

    tx.add(
      instructions.placePerpOrderV3Ix(
        asset,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        options.orderType != undefined
          ? options.orderType
          : types.OrderType.LIMIT,
        options.clientOrderId != undefined ? options.clientOrderId : 0,
        options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
        tifOffsetToUse,
        this.accountAddress,
        this._provider.wallet.publicKey,
        this._openOrdersAccounts[assetIndex],
        this._whitelistTradingFeesAddress
      )
    );

    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      options.blockhash
    );
  }

  /**
   * Cancels a user order by CrossClient order id and atomically places an order by new CrossClient order id.
   * @param asset                  the asset of the order to be cancelled and new order.
   * @param cancelClientOrderId     the CrossClient order id of the order to be cancelled.
   * @param newOrderPrice           the native price of the order (6 d.p) as integer
   * @param newOrderSize            the quantity of the order (3 d.p) as integer
   * @param newOrderSide            the side of the order. bid / ask
   * @param newOrderType            the type of the order, limit / ioc / post-only
   * @param newOrderClientOrderId   the CrossClient order id for the new order
   * @param newOrderTag     optional: the string tag corresponding to who is inserting. Default "SDK", max 4 length
   */
  public async cancelAndPlaceOrderByClientOrderId(
    asset: Asset,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOptions: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    let market = Exchange.getPerpMarket(asset);
    let assetIndex = assetToIndex(asset);
    let tx = new Transaction();
    tx.add(
      instructions.cancelOrderByClientOrderIdIx(
        asset,
        this.provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetIndex],
        new anchor.BN(cancelClientOrderId)
      )
    );

    let tifOffsetToUse = utils.getTIFOffset(market, newOptions.tifOptions);

    tx.add(
      instructions.placePerpOrderV3Ix(
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
        this.accountAddress,
        this.provider.wallet.publicKey,
        this._openOrdersAccounts[assetIndex],
        this.whitelistTradingFeesAddress
      )
    );

    return await utils.processTransaction(
      this.provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      newOptions.blockhash
    );
  }

  /**
   * Cancels a user order by client order id and atomically places an order by new client order id.
   * Uses the 'NoError' cancel instruction, so a failed cancellation won't prohibit the placeOrder
   * @param asset                  the asset of the order to be cancelled and new order.
   * @param cancelClientOrderId     the client order id of the order to be cancelled.
   * @param newOrderPrice           the native price of the order (6 d.p) as integer
   * @param newOrderSize            the quantity of the order (3 d.p) as integer
   * @param newOrderSide            the side of the order. bid / ask
   * @param newOrderType            the type of the order, limit / ioc / post-only
   * @param newOrderClientOrderId   the client order id for the new order
   * @param newOrderTag     optional: the string tag corresponding to who is inserting. Default "SDK", max 4 length
   */
  public async replaceByClientOrderId(
    asset: Asset,
    cancelClientOrderId: number,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    newOptions: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    let market = Exchange.getPerpMarket(asset);
    let assetIndex = assetToIndex(asset);
    tx.add(
      instructions.cancelOrderByClientOrderIdNoErrorIx(
        asset,
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetIndex],
        new anchor.BN(cancelClientOrderId)
      )
    );

    let tifOffsetToUse = utils.getTIFOffset(market, newOptions.tifOptions);

    tx.add(
      instructions.placePerpOrderV3Ix(
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
        this._accountAddress,
        this._provider.wallet.publicKey,
        this._openOrdersAccounts[assetIndex],
        this._whitelistTradingFeesAddress
      )
    );

    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      newOptions.blockhash
    );
  }

  /**
   * Initializes a user open orders account for a given market.
   * This is handled atomically by place order but can be used by CrossClients to initialize it independent of placing an order.
   */
  public async initializeOpenOrdersAccount(
    asset: Asset
  ): Promise<TransactionSignature> {
    let assetIndex = assetToIndex(asset);
    if (!this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      throw Error("User already has an open orders account for market!");
    }

    let [initIx, openOrdersPda] = instructions.initializeOpenOrdersV3Ix(
      asset,
      Exchange.getPerpMarket(asset).address,
      this._provider.wallet.publicKey,
      this.accountAddress
    );

    let tx = new Transaction().add(initIx);
    let txId = await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
    this._openOrdersAccounts[assetIndex] = openOrdersPda;
    return txId;
  }

  /**
   * Closes a user open orders account for a given market.
   */
  public async closeOpenOrdersAccount(
    asset: Asset
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    let assetIndex = assetToIndex(asset);
    if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      throw Error("User has no open orders account for this market!");
    }
    let market = Exchange.getPerpMarket(asset);
    const [vaultOwner, _vaultSignerNonce] = utils.getSerumVaultOwnerAndNonce(
      market.address,
      constants.DEX_PID[Exchange.network]
    );

    let tx = new Transaction();
    tx.add(
      instructions.settleDexFundsIx(
        asset,
        market.address,
        vaultOwner,
        this._openOrdersAccounts[assetIndex]
      )
    );

    tx.add(
      instructions.closeOpenOrdersV3Ix(
        asset,
        this._provider.wallet.publicKey,
        this.accountAddress,
        this._openOrdersAccounts[assetIndex]
      )
    );
    let txId = await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
    this._openOrdersAccounts[assetIndex] = PublicKey.default;
    return txId;
  }

  /**
   * Closes multiple user open orders account for a given set of markets.
   * Cannot pass in multiple of the same market address
   */
  public async closeMultipleOpenOrdersAccount(
    assets: Asset[]
  ): Promise<TransactionSignature[]> {
    this.delegatedCheck();
    let combinedIxs: TransactionInstruction[] = [];
    let markets = [];
    for (var asset of assets) {
      markets.push(Exchange.getPerpMarket(asset));
    }
    for (var i = 0; i < assets.length; i++) {
      let assetIndex = assetToIndex(asset);
      let market = markets[i];
      if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
        throw Error("User has no open orders account for this market!");
      }
      const [vaultOwner, _vaultSignerNonce] = utils.getSerumVaultOwnerAndNonce(
        market,
        constants.DEX_PID[Exchange.network]
      );
      let settleIx = instructions.settleDexFundsIx(
        asset,
        market,
        vaultOwner,
        this._openOrdersAccounts[assetIndex]
      );
      let closeIx = instructions.closeOpenOrdersV3Ix(
        market,
        this._provider.wallet.publicKey,
        this.accountAddress,
        this._openOrdersAccounts[assetIndex]
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
      let txId = await utils.processTransaction(
        this._provider,
        tx,
        undefined,
        undefined,
        undefined,
        this._useVersionedTxs ? utils.getZetaLutArr() : undefined
      );
      txIds.push(txId);
    }

    // Reset openOrdersAccount keys
    for (var i = 0; i < assets.length; i++) {
      let assetIndex = assetToIndex(asset);
      this._openOrdersAccounts[assetIndex] = PublicKey.default;
    }

    return txIds;
  }

  /**
   * Calls force cancel on another user's orders
   * @param asset  Asset to cancel orders on
   * @param marginAccountToCancel Users to be force-cancelled's margin account
   */
  public async forceCancelOrderByOrderId(
    asset: Asset,
    marginAccountToCancel: PublicKey,
    orderId: anchor.BN,
    side: types.Side
  ): Promise<TransactionSignature> {
    this.delegatedCheck();

    let account =
      await Exchange.program.account.crossMarginAccount.fetchNullable(
        marginAccountToCancel
      );

    let openOrdersAccountToCancel: PublicKey;

    // CrossMarginAccount
    if (account) {
      openOrdersAccountToCancel = utils.createCrossOpenOrdersAddress(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        marginAccountToCancel,
        account.openOrdersNonces[assetToIndex(asset)]
      );
    }
    // MarginAccount
    else {
      let account = await Exchange.program.account.marginAccount.fetchNullable(
        marginAccountToCancel
      );
      openOrdersAccountToCancel = utils.createOpenOrdersAddress(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        marginAccountToCancel,
        account.openOrdersNonces[constants.PERP_INDEX]
      );
    }

    let tx = new Transaction();
    let ix = instructions.forceCancelOrderByOrderIdV2Ix(
      asset,
      marginAccountToCancel,
      openOrdersAccountToCancel,
      orderId,
      side
    );
    tx.add(ix);
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  /**
   * Calls force cancel on another user's orders
   * @param asset  Asset to cancel orders on
   * @param marginAccountToCancel Users to be force-cancelled's margin account
   */
  public async forceCancelOrders(
    asset: Asset,
    marginAccountToCancel: PublicKey
  ): Promise<TransactionSignature> {
    this.delegatedCheck();

    let account =
      await Exchange.program.account.crossMarginAccount.fetchNullable(
        marginAccountToCancel
      );

    let openOrdersAccountToCancel: PublicKey;

    // CrossMarginAccount
    if (account) {
      openOrdersAccountToCancel = utils.createCrossOpenOrdersAddress(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        marginAccountToCancel,
        account.openOrdersNonces[assetToIndex(asset)]
      );
    }
    // MarginAccount
    else {
      let account = await Exchange.program.account.marginAccount.fetchNullable(
        marginAccountToCancel
      );
      openOrdersAccountToCancel = utils.createOpenOrdersAddress(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        marginAccountToCancel,
        account.openOrdersNonces[constants.PERP_INDEX]
      );
    }

    let tx = new Transaction();
    let ix = instructions.forceCancelOrdersV2Ix(
      asset,
      marginAccountToCancel,
      openOrdersAccountToCancel
    );
    tx.add(ix);

    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  /**
   * Calls liquidate on another user
   * @param market
   * @param liquidatedMarginAccount
   * @param size                        the quantity of the order (3 d.p)
   */
  public async liquidate(
    asset: Asset,
    liquidatedMarginAccount: PublicKey,
    size: number
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    let tx = new Transaction();
    let ix = instructions.liquidateV2Ix(
      asset,
      this._provider.wallet.publicKey,
      this._accountAddress,
      Exchange.getPerpMarket(asset).address,
      liquidatedMarginAccount,
      size
    );
    tx.add(ix);
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined
    );
  }

  /**
   * Instruction builder for cancelAllOrders()
   * Returns a list of instructions cancelling all of this CrossClient's orders
   */
  public cancelAllOrdersIxs(asset: Asset): TransactionInstruction[] {
    let ixs = [];
    for (var i = 0; i < this._orders.get(asset).length; i++) {
      let order = this._orders.get(asset)[i];
      let ix = instructions.cancelOrderIx(
        asset,
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetToIndex(asset)],
        order.orderId,
        order.side
      );
      ixs.push(ix);
    }
    return ixs;
  }

  /**
   * Instruction builder for cancelAllOrdersNoError()
   * Returns a list of instructions cancelling all of this CrossClient's orders
   */
  public cancelAllOrdersNoErrorIxs(asset: Asset): TransactionInstruction[] {
    let ixs = [];
    for (var i = 0; i < this._orders.get(asset).length; i++) {
      let order = this._orders.get(asset)[i];
      let ix = instructions.cancelOrderNoErrorIx(
        asset,
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetToIndex(asset)],
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
  public async cancelAllOrders(
    asset: Asset = undefined
  ): Promise<TransactionSignature[]> {
    let allAssets = [];
    if (asset != undefined) {
      allAssets = [asset];
    } else {
      allAssets = Exchange.assets;
    }

    // Grab all cancel instructions across all assets
    let ixs = [];

    allAssets.map((asset) => {
      ixs = ixs.concat(this.cancelAllOrdersIxs(asset));
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

  /**
   * Cancels all active user orders
   */
  public async cancelAllOrdersNoError(
    asset: Asset = undefined
  ): Promise<TransactionSignature[]> {
    let allAssets = [];
    if (asset != undefined) {
      allAssets = [asset];
    } else {
      allAssets = Exchange.assets;
    }

    // Grab all cancel instructions across all assets
    let ixs = [];

    allAssets.map((asset) => {
      ixs = ixs.concat(this.cancelAllOrdersNoErrorIxs(asset));
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

  public getOrders(asset: Asset): types.Order[] {
    return this._orders.get(asset);
  }

  public getPositions(asset: Asset): types.Position[] {
    return this._positions.get(asset);
  }

  public async updateOrders() {
    if (this._account == null) {
      console.log("User has no margin account, cannot update orders.");
      return;
    }

    let orders = [];

    await Promise.all(
      Exchange.assets.map(async (asset) => {
        let market = Exchange.getPerpMarket(asset);
        await market.updateOrderbook();
        orders.push(
          market.getOrdersForAccount(
            this._openOrdersAccounts[assetToIndex(asset)]
          )
        );
      })
    );

    let allOrders = [].concat(...orders);
    let allOrdersFiltered = allOrders.filter(function (order: types.Order) {
      let seqNum = utils.getSeqNumFromSerumOrderKey(
        order.orderId,
        order.side == types.Side.BID
      );
      let serumMarket = Exchange.getPerpMarket(order.asset).serumMarket;

      return !utils.isOrderExpired(
        order.tifOffset,
        seqNum,
        serumMarket.epochStartTs.toNumber(),
        serumMarket.startEpochSeqNum
      );
    });
    let ordersByAsset = new Map();
    await Promise.all(
      Exchange.assets.map(async (asset) => {
        ordersByAsset.set(asset, []);
      })
    );
    for (var order of allOrdersFiltered) {
      ordersByAsset.get(order.asset).push(order);
    }

    this._orders = ordersByAsset;
  }

  private updatePositions() {
    let positions = new Map();
    for (var asset of Exchange.assets) {
      positions.set(asset, []);
    }

    for (var i = 0; i < this._account.productLedgers.length; i++) {
      if (this._account.productLedgers[i].position.size.toNumber() != 0) {
        let asset = indexToAsset(i);
        positions.get(asset).push({
          marketIndex: constants.PERP_INDEX,
          market: Exchange.getPerpMarket(asset).address,
          size: utils.convertNativeLotSizeToDecimal(
            this._account.productLedgers[i].position.size.toNumber()
          ),
          costOfTrades: utils.convertNativeBNToDecimal(
            this._account.productLedgers[i].position.costOfTrades
          ),
          asset: asset,
        });
      }
    }

    for (var asset of Exchange.assets) {
      this._positions.set(asset, []);
    }
    this._positions = positions;
  }

  private updateOpenOrdersAddresses() {
    Exchange.assets.map((asset) => {
      let assetIndex = assetToIndex(asset);
      if (
        // If the nonce is not zero, we know there is an open orders account.
        this._account.openOrdersNonces[assetIndex] !== 0 &&
        // If this is equal to default, it means we haven't added the PDA yet.
        this._openOrdersAccounts[assetIndex].equals(PublicKey.default)
      ) {
        let [openOrdersPda, _openOrdersNonce] = utils.getCrossOpenOrders(
          Exchange.programId,
          Exchange.getPerpMarket(asset).address,
          this.accountAddress
        );
        this._openOrdersAccounts[assetIndex] = openOrdersPda;
      }
    });
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

  /**
   * Getter functions for raw user margin account state.
   */

  /**
   * @param asset - market asset.
   * @param decimal - whether to convert to readable decimal.
   */
  public getPositionSize(asset: Asset, decimal: boolean = false): number {
    let position = this.getProductLedger(asset).position;
    let size = position.size.toNumber();
    return decimal ? utils.convertNativeLotSizeToDecimal(size) : size;
  }

  /**
   * @param asset - market asset.
   * @param decimal - whether to convert to readable decimal.
   */
  public getCostOfTrades(asset: Asset, decimal: boolean = false): number {
    let position = this.getProductLedger(asset).position;
    let costOfTrades = position.costOfTrades.toNumber();
    return decimal
      ? utils.convertNativeIntegerToDecimal(costOfTrades)
      : costOfTrades;
  }

  /**
   * @param asset - market asset.
   * @param decimal - whether to convert to readable decimal.
   */
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

  /**
   * @param asset - market asset.
   * @param decimal - whether to convert to readable decimal.
   */
  public getClosingOrders(asset: Asset, decimal: boolean = false): number {
    let orderState = this.getProductLedger(asset).orderState;
    let size = orderState.closingOrders.toNumber();
    return decimal ? utils.convertNativeLotSizeToDecimal(size) : size;
  }

  public async initializeReferrerAccount() {
    this.delegatedCheck();
    let tx = new Transaction().add(
      await instructions.initializeReferrerAccountIx(this.publicKey)
    );
    await utils.processTransaction(this._provider, tx);
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

  /**
   * Getter function to grab the correct product ledger because perps is separate
   */
  public getProductLedger(asset: Asset) {
    return this._account.productLedgers[assetToIndex(asset)];
  }

  /**
   * Closes the CrossClient websocket subscription to margin account.
   */
  public async close() {
    if (this._accountSubscriptionId !== undefined) {
      await this._provider.connection.removeAccountChangeListener(
        this._accountSubscriptionId
      );
      this._accountSubscriptionId = undefined;
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
    if (this._delegatorKey) {
      throw Error(
        "Function not supported by delegated client. Please load without 'delegator' argument"
      );
    }
  }
}

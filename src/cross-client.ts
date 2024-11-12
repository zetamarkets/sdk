import * as anchor from "@zetamarkets/anchor";
import { BN } from "@zetamarkets/anchor";
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
  TradeEventV3,
  OrderCompleteEvent,
  ProductLedger,
} from "./program-types";
import {
  PublicKey,
  Transaction,
  TransactionSignature,
  AccountInfo,
  Context,
  Connection,
  TransactionInstruction,
  ConfirmOptions,
  SYSVAR_CLOCK_PUBKEY,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { PublicKey as PublicKeyZstd } from "zeta-solana-web3";
import * as types from "./types";
import * as instructions from "./program-instructions";
import { EventType } from "./events";
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

  public get txRetryAmount(): number {
    return this._txRetryAmount;
  }
  private _txRetryAmount: number = undefined;

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
   * Returns a list of the user's current orders, not including trigger orders
   */
  public get orders(): Map<Asset, types.Order[]> {
    return this._orders;
  }
  private _orders: Map<Asset, types.Order[]>;

  /**
   * Returns a list of the user's current trigger orders.
   */
  public get triggerOrders(): Map<Asset, types.TriggerOrder[]> {
    return this._triggerOrders;
  }
  private _triggerOrders: Map<Asset, types.TriggerOrder[]>;

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
   * The subscription id for the margin account manager subscription.
   */
  private _accountManagerSubscriptionId: number = undefined;

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
  private _callback: (
    asset: Asset,
    type: EventType,
    slot: number,
    data: any
  ) => void;

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
    this._triggerOrders = new Map();
    for (var asset of Exchange.assets) {
      this._positions.set(asset, []);
      this._orders.set(asset, []);
    }

    this._lastUpdateTimestamp = 0;
    this._pendingUpdate = false;
    this._account = null;
    this._accountManager = null;

    this._provider = new anchor.AnchorProvider(connection, wallet, opts);
  }

  /**
   * Returns a new instance of CrossClient, based off state in the Exchange singleton.
   * Requires the Exchange to be in a valid state to succeed.
   *
   * @param throttle    Defaults to false.
   *                    If set to false, margin account callbacks will also call
   *                    `updateState` instead of waiting for the poll.
   */
  public static async load(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions = utils.defaultCommitment(),
    callback: (
      asset: Asset,
      type: EventType,
      slot: number,
      data: any
    ) => void = undefined,
    throttle: boolean = false,
    delegator: PublicKey = undefined,
    useVersionedTxs: boolean = false,
    txRetryAmount: number = undefined,
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
    client._txRetryAmount = txRetryAmount;
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
        try {
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
            callback(null, EventType.USER, context.slot, {
              UserCallbackType: types.UserCallbackType.CROSSMARGINACCOUNTCHANGE,
            });
          }
  
          client.updateOpenOrdersAddresses();
        } catch (e) {
          console.log(`CrossMarginAccount subscription failed. Error: ${e}`);
        }
      },
      connection.commitment
    );

    client._accountManagerSubscriptionId = connection.onAccountChange(
      client._accountManagerAddress,
      async (accountInfo: AccountInfo<Buffer>, context: Context) => {
        try {
          client._accountManager = Exchange.program.coder.accounts.decode(
            types.ProgramAccountType.CrossMarginAccountManager,
            accountInfo.data
          );
  
          if (callback !== undefined) {
            callback(null, EventType.USER, context.slot, {
              UserCallbackType: types.UserCallbackType.CROSSMARGINACCOUNTCHANGE,
            });
          }
        } catch (e) {
          console.log(`CrossMarginAccountManager subscription failed. Error: ${e}`);
        }
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

    if (callback !== undefined) {
      client._tradeEventV3Listener = Exchange.program.addEventListener(
        "TradeEventV3",
        (event: TradeEventV3, slot) => {
          if (
            client._accountAddress.toString() == event.marginAccount.toString()
          ) {
            callback(
              fromProgramAsset(event.asset),
              EventType.TRADEV3,
              slot,
              event
            );
          }
        }
      );

      client._orderCompleteEventListener = Exchange.program.addEventListener(
        "OrderCompleteEvent",
        (event: OrderCompleteEvent, slot) => {
          if (
            client._accountAddress.toString() == event.marginAccount.toString()
          ) {
            callback(
              fromProgramAsset(event.asset),
              EventType.ORDERCOMPLETE,
              slot,
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
    this.updateOpenOrdersSync();
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
        let fetchSlot = await this.updateState();
        // If there was a margin account websocket callback, we want to
        // trigger an `updateState` on the next timer tick.
        if (latestSlot == this._pendingUpdateSlot) {
          this._pendingUpdate = false;
        }
        this._lastUpdateTimestamp = Exchange.clockTimestamp;
        if (this._callback !== undefined) {
          this._callback(null, EventType.USER, fetchSlot, {
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
  public async updateState(fetch = true, force = false): Promise<number> {
    this.checkResetUpdatingState();

    if (this._updatingState && !force) {
      return;
    }

    this.toggleUpdateState(true);

    let fetchSlot: number = 0;
    if (fetch) {
      try {
        let [clockInfo, crossMarginAccountInfo, crossMarginAccountManagerInfo] =
          await Exchange.connection.getMultipleAccountsInfo([
            SYSVAR_CLOCK_PUBKEY as PublicKeyZstd,
            this._accountAddress as PublicKeyZstd,
            this._accountManagerAddress as PublicKeyZstd,
          ]);
        fetchSlot = utils.getClockData(clockInfo).slot;
        this._account = Exchange.program.coder.accounts.decode(
          types.ProgramAccountType.CrossMarginAccount,
          crossMarginAccountInfo.data
        );
        this._accountManager = Exchange.program.coder.accounts.decode(
          types.ProgramAccountType.CrossMarginAccountManager,
          crossMarginAccountManagerInfo.data
        );
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
    return fetchSlot;
  }

  public setUseVersionedTxs(useVersionedTxs: boolean) {
    this._useVersionedTxs = useVersionedTxs;
  }

  public setTxRetryAmount(txRetryAmount: number) {
    this._txRetryAmount = txRetryAmount;
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

  public async findUserMarginAccounts(): Promise<{
    addresses: PublicKey[];
    accounts: programTypes.MarginAccount[];
  }> {
    let marginAddresses: PublicKey[] = [];
    let marginAccounts: programTypes.MarginAccount[] = [];

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
          await Exchange.program.account.marginAccount.fetchNullable(address);

        if (account) {
          console.log(`Found ${asset} MarginAccount`);
          marginAddresses.push(address);
          marginAccounts.push(account as programTypes.MarginAccount);
        }
      })
    );

    return { addresses: marginAddresses, accounts: marginAccounts };
  }

  public async cleanupMarginAccounts(): Promise<TransactionSignature[]> {
    let accs = await this.findUserMarginAccounts();
    let marginAddresses = accs.addresses;
    let marginAccounts = accs.accounts;

    if (this._account == null) {
      throw Error("User has no cross margin account yet, nothing to cleanup.");
    }

    if (this._accountManager == null) {
      throw Error(
        "User has no cross margin account manager yet, nothing to cleanup."
      );
    }

    const txs: Transaction[] = [];
    for (var i = 0; i < marginAccounts.length; i++) {
      let acc = marginAccounts[i];
      let asset = assets.fromProgramAsset(acc.asset);
      let market = Exchange.getPerpMarket(asset).address;
      const [vaultOwner, _vaultSignerNonce] = utils.getSerumVaultOwnerAndNonce(
        market,
        constants.DEX_PID[Exchange.network]
      );

      let ppl = acc.perpProductLedger;
      if (
        ppl.orderState.closingOrders.toNumber() != 0 ||
        ppl.orderState.openingOrders[0].toNumber() != 0 ||
        ppl.orderState.openingOrders[1].toNumber() != 0 ||
        ppl.position.size.toNumber != 0 ||
        ppl.position.costOfTrades.toNumber() != 0
      ) {
        throw Error("Margin accounts are not properly cleared.");
      }

      let tx = new Transaction();
      if (acc.openOrdersNonce[constants.PERP_INDEX] != 0) {
        tx.add(
          instructions.settleDexFundsIx(
            asset,
            vaultOwner,
            utils.getOpenOrders(Exchange.programId, market, this.publicKey)[0]
          )
        );
        tx.add(
          instructions.closeOpenOrdersV2Ix(
            market,
            this.publicKey,
            marginAddresses[i],
            utils.getOpenOrders(Exchange.programId, market, this.publicKey)[0]
          )
        );
      }
      tx.add(
        instructions.closeMarginAccountIx(
          asset,
          this.publicKey,
          marginAddresses[i]
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
          this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
          undefined,
          this._txRetryAmount
        )
      );
    }
    return sigs;
  }

  public async initializeReferrerAccount(
    id: string
  ): Promise<TransactionSignature> {
    let tx = new Transaction();

    if ((await this.hasReferrerAccounts()) == true) {
      throw Error("User already has a referrer account!");
    }

    if (this._accountManager === null) {
      console.log(
        "User has no cross margin account manager. Creating account manager..."
      );
      tx.add(
        instructions.initializeCrossMarginAccountManagerV2Ix(
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
      instructions.initializeReferrerAccountsIx(
        id,
        this.publicKey,
        utils.getReferrerIdAccount(Exchange.programId, id)[0],
        utils.getReferrerPubkeyAccount(Exchange.programId, this.publicKey)[0]
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

  public async migrateToCrossMarginAccount(
    referrer?: PublicKey
  ): Promise<TransactionSignature[]> {
    this.delegatedCheck();
    await this.usdcAccountCheck();

    // Dynamically figure out the user's existing margin accounts
    let accs = await this.findUserMarginAccounts();
    let marginAddresses = accs.addresses;
    let marginAccounts = accs.accounts;

    let txs = [];

    // Check if the user has accounts set up
    let tx = new Transaction();
    if (this._accountManager === null) {
      console.log(
        "User has no cross margin account manager. Creating account manager..."
      );
      tx.add(
        instructions.initializeCrossMarginAccountManagerV2Ix(
          this._accountManagerAddress,
          this._provider.wallet.publicKey,
          referrer
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
        marginAddresses,
        this._accountAddress,
        this.publicKey
      )
    );
    txs.push(tx);

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
          this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
          undefined,
          this._txRetryAmount
        )
      );
    }
    return sigs;
  }

  public async initializeAccounts(
    referrerId?: string
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    // Check if the user has accounts set up
    let tx = new Transaction();
    if (this._accountManager === null) {
      console.log(
        "User has no cross margin account manager. Creating account manager..."
      );

      let referrerAddress = undefined;

      if (referrerId) {
        let failures = 0;
        while (referrerAddress == undefined) {
          try {
            referrerAddress = (
              await Exchange.program.account.referrerIdAccount.fetch(
                utils
                  .getReferrerIdAccount(Exchange.programId, referrerId)[0]
                  .toString()
              )
            ).referrerPubkey;
          } catch (e) {
            failures += 1;
            if (failures > 3) {
              throw Error(
                `Error fetching referrer pubkey for ID=${referrerId}, please double-check it. Error: ${e}`
              );
            } else {
              console.log(`Failed fetching ReferrerIdAccount, retrying...`);
            }
          }
        }
      }
      tx.add(
        instructions.initializeCrossMarginAccountManagerV2Ix(
          this._accountManagerAddress,
          this._provider.wallet.publicKey,
          referrerAddress
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
   * @param amount  the native amount to deposit (6 decimals fixed point)
   * @param referrerId the referrer's ID to use in initializeCrossMarginAccountManager (only used when creating a new account)
   */
  public async deposit(
    amount: number,
    referrerId?: string
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    await this.usdcAccountCheck();
    // Check if the user has accounts set up
    let tx = new Transaction();
    if (this._accountManager === null) {
      console.log(
        "User has no cross margin account manager. Creating account manager..."
      );

      let referrerAddress = undefined;

      if (referrerId) {
        let failures = 0;
        while (referrerAddress == undefined) {
          try {
            referrerAddress = (
              await Exchange.program.account.referrerIdAccount.fetch(
                utils
                  .getReferrerIdAccount(Exchange.programId, referrerId)[0]
                  .toString()
              )
            ).referrerPubkey;
          } catch (e) {
            failures += 1;
            if (failures > 3) {
              throw Error(
                `Error fetching referrer pubkey for ID=${referrerId}, please double-check it. Error: ${e}`
              );
            } else {
              console.log(`Failed fetching ReferrerIdAccount, retrying...`);
            }
          }
        }
      }
      tx.add(
        instructions.initializeCrossMarginAccountManagerV2Ix(
          this._accountManagerAddress,
          this._provider.wallet.publicKey,
          referrerAddress
        )
      );
    } else {
      if (referrerId) {
        console.warn(
          "Provided referrer ID when an account manager already exists. A referrer ID can only be placed on a brand new account."
        );
      }
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );
  }

  public getAccountState(): types.CrossMarginAccountState {
    return Exchange.riskCalculator.getCrossMarginAccountState(this._account);
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );
    this._accountManager = null;
    return txId;
  }

  /**
   * Closes the CrossMarginAccount and CrossMarginAccountManager in one transaction
   */
  public async closeAccountAndManager(): Promise<TransactionSignature> {
    this.delegatedCheck();
    if (this._account === null) {
      throw Error("User has no account to close");
    }
    if (this._accountManager === null) {
      throw Error("User has no account manager to close");
    }
    let tx = new Transaction().add(
      instructions.closeCrossMarginAccountIx(
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._accountManagerAddress
      )
    );
    tx.add(
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
    this._accountManager = null;
    this._account = null;
    return txId;
  }

  /**
   * @param amount  the native amount to withdraw (6 dp)
   */
  public async withdraw(amount: number): Promise<TransactionSignature> {
    this.delegatedCheck();

    let tx = new Transaction().add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 300_000,
      })
    );
    try {
      await this.usdcAccountCheck();
    } catch (e) {
      tx.add(
        splToken.Token.createAssociatedTokenAccountInstruction(
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
          splToken.TOKEN_PROGRAM_ID,
          constants.USDC_MINT_ADDRESS[Exchange.network],
          this._usdcAccountAddress,
          this.publicKey,
          this.publicKey
        )
      );
    }

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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );
  }

  /**
   * Withdraws the entirety of the CrossClient's margin account and then closes it.
   * Useful for only closing one subaccount.
   */
  public async withdrawAndCloseAccount(): Promise<TransactionSignature> {
    this.delegatedCheck();
    if (this._account === null) {
      throw Error("User has no margin account to withdraw or close.");
    }

    let tx = new Transaction();
    try {
      await this.usdcAccountCheck();
    } catch (e) {
      tx.add(
        splToken.Token.createAssociatedTokenAccountInstruction(
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
          splToken.TOKEN_PROGRAM_ID,
          constants.USDC_MINT_ADDRESS[Exchange.network],
          this._usdcAccountAddress,
          this.publicKey,
          this.publicKey
        )
      );
    }

    if (this._account.balance > 0) {
      tx.add(
        instructions.withdrawV2Ix(
          this._account.balance.toNumber(),
          this._accountAddress,
          this._usdcAccountAddress,
          this._provider.wallet.publicKey
        )
      );
    }
    tx.add(
      instructions.rebalanceInsuranceVaultIx([
        { pubkey: this.accountAddress, isSigner: false, isWritable: true },
      ])
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );
    this._account = null;
    return txId;
  }

  /**
   * Withdraws the entirety of the CrossClient's margin account and then closes it.
   * Useful for closing the main account and everything
   */
  public async withdrawAndCloseAccountAndCloseManager(): Promise<TransactionSignature> {
    this.delegatedCheck();
    if (this._account === null) {
      throw Error("User has no margin account to withdraw or close.");
    }
    if (this._accountManager === null) {
      throw Error("User has no account manager to close");
    }

    let tx = new Transaction();
    try {
      await this.usdcAccountCheck();
    } catch (e) {
      tx.add(
        splToken.Token.createAssociatedTokenAccountInstruction(
          splToken.ASSOCIATED_TOKEN_PROGRAM_ID,
          splToken.TOKEN_PROGRAM_ID,
          constants.USDC_MINT_ADDRESS[Exchange.network],
          this._usdcAccountAddress,
          this.publicKey,
          this.publicKey
        )
      );
    }

    if (this._account.balance > 0) {
      tx.add(
        instructions.withdrawV2Ix(
          this._account.balance.toNumber(),
          this._accountAddress,
          this._usdcAccountAddress,
          this._provider.wallet.publicKey
        )
      );
    }
    tx.add(
      instructions.rebalanceInsuranceVaultIx([
        { pubkey: this.accountAddress, isSigner: false, isWritable: true },
      ])
    );
    tx.add(
      instructions.closeCrossMarginAccountIx(
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._accountManagerAddress
      )
    );
    tx.add(
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
    this._accountManager = null;
    return txId;
  }

  public async hasReferrerAccounts(): Promise<boolean> {
    // Firstly, close all referrer accounts
    let referrerPubkeyAccountAddress = utils.getReferrerPubkeyAccount(
      Exchange.programId,
      this.publicKey
    )[0];
    let referrerPubkeyAccount =
      await Exchange.program.account.referrerPubkeyAccount.fetchNullable(
        referrerPubkeyAccountAddress
      );
    return referrerPubkeyAccount != null;
  }

  public async remakeReferrerAccounts(
    id: string
  ): Promise<TransactionSignature> {
    this.delegatedCheck();

    let tx = new Transaction();

    // Firstly, close all referrer accounts
    if ((await this.hasReferrerAccounts()) == true) {
      let referrerPubkeyAccountAddress = utils.getReferrerPubkeyAccount(
        Exchange.programId,
        this.publicKey
      )[0];
      let referrerPubkeyAccount =
        await Exchange.program.account.referrerPubkeyAccount.fetch(
          referrerPubkeyAccountAddress
        );
      let id = Buffer.from(referrerPubkeyAccount.referrerId).toString();
      let referrerIdAccountAddress = utils.getReferrerIdAccount(
        Exchange.programId,
        id
      )[0];

      tx.add(
        instructions.closeReferrerAccountsIx(
          this.publicKey,
          referrerIdAccountAddress,
          referrerPubkeyAccountAddress
        )
      );
    }

    // Secondly, make new ones with the provided ID
    tx.add(
      instructions.initializeReferrerAccountsIx(
        id,
        this.publicKey,
        utils.getReferrerIdAccount(Exchange.programId, id)[0],
        utils.getReferrerPubkeyAccount(Exchange.programId, this.publicKey)[0]
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

  public async closeReferrerAccounts(): Promise<TransactionSignature> {
    this.delegatedCheck();

    // Fetch all required accounts because we don't store them in the client
    let referrerPubkeyAccountAddress = utils.getReferrerPubkeyAccount(
      Exchange.programId,
      this.publicKey
    )[0];
    let referrerPubkeyAccount =
      await Exchange.program.account.referrerPubkeyAccount.fetch(
        referrerPubkeyAccountAddress
      );
    let id = Buffer.from(referrerPubkeyAccount.referrerId).toString();
    let referrerIdAccountAddress = utils.getReferrerIdAccount(
      Exchange.programId,
      id
    )[0];

    let tx = new Transaction().add(
      instructions.closeReferrerAccountsIx(
        this.publicKey,
        referrerIdAccountAddress,
        referrerPubkeyAccountAddress
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
    options: types.OrderOptions = types.defaultOrderOptions(),
    preIxs: TransactionInstruction[] = []
  ): Promise<TransactionSignature> {
    let tx = new Transaction().add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 300_000,
      })
    );
    let assetIndex = assetToIndex(asset);
    let market = Exchange.getPerpMarket(asset);
    let openOrdersPda = null;
    if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      console.log(
        `[${assetToName(
          asset
        )}] User doesn't have open orders account. Initialising for asset ${asset}.`
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

    if (preIxs.length > 0) {
      tx.add(...preIxs);
    }

    let tifOffsetToUse = utils.getTIFOffset(market, options.tifOptions);

    let orderIx = instructions.placePerpOrderV5Ix(
      asset,
      price,
      size,
      side,
      options.orderType != undefined
        ? options.orderType
        : types.OrderType.LIMIT,
      options.reduceOnly != undefined ? options.reduceOnly : false,
      options.clientOrderId != undefined ? options.clientOrderId : 0,
      options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
      tifOffsetToUse,
      this.accountAddress,
      this._provider.wallet.publicKey,
      openOrdersPda,
      this._whitelistTradingFeesAddress,
      options.selfTradeBehavior
    );

    tx.add(orderIx);

    let txId: TransactionSignature = await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      options.blockhash,
      this._txRetryAmount
    );
    this._openOrdersAccounts[assetIndex] = openOrdersPda;
    return txId;
  }

  /**
   * Find the next available bit to store a trigger order (0 to 127)
   * @param startIndex optional, the index from which to start looking (0 to 127)
   * @returns the first available bit (0 to 127)
   */
  public findAvailableTriggerOrderBit(startIndex: number = 0): number {
    // If we haven't loaded properly for whatever reason just use the last index to minimise the chance of collisions
    if (!this.account || !this.account.triggerOrderBits) {
      return 127;
    }
    for (var i = startIndex; i < 128; i++) {
      let mask: BN = new BN(1).shln(i); // 1 << i
      if (this.account.triggerOrderBits.and(mask).isZero()) {
        return i;
      }
    }
    throw Error("No space for a new trigger order. Delete some and try again.");
  }

  // A trigger order that will fire at a certain unix timestamp
  public async placeTimestampTriggerOrder(
    asset: Asset,
    orderPrice: number,
    triggerTime: anchor.BN,
    size: number,
    side: types.Side,
    orderType: types.OrderType,
    options: types.TriggerOrderOptions = types.defaultTriggerOrderOptions()
  ): Promise<TransactionSignature> {
    return await this.placeTriggerOrder(
      asset,
      orderPrice,
      size,
      side,
      0,
      types.TriggerDirection.UNINITIALIZED,
      triggerTime,
      orderType,
      options
    );
  }

  // A trigger order that will fire when markPrice passes triggerPrice in triggerDirection
  public async placePriceTriggerOrder(
    asset: Asset,
    orderPrice: number,
    triggerPrice: number,
    size: number,
    side: types.Side,
    orderType: types.OrderType,
    options: types.TriggerOrderOptions = types.defaultTriggerOrderOptions(),
    triggerDirection: types.TriggerDirection = types.getDefaultTriggerDirection(
      side
    )
  ): Promise<TransactionSignature> {
    return await this.placeTriggerOrder(
      asset,
      orderPrice,
      size,
      side,
      triggerPrice,
      triggerDirection,
      new anchor.BN(0),
      orderType,
      options
    );
  }

  private async placeTriggerOrder(
    asset: Asset,
    orderPrice: number,
    size: number,
    side: types.Side,
    triggerPrice: number,
    triggerDirection: types.TriggerDirection = types.getDefaultTriggerDirection(
      side
    ),
    triggerTimestamp: anchor.BN,
    orderType: types.OrderType,
    options: types.TriggerOrderOptions = types.defaultTriggerOrderOptions()
  ): Promise<TransactionSignature> {
    let triggerOrderBit = this.findAvailableTriggerOrderBit();

    let openOrdersPda = null;
    let assetIndex = assets.assetToIndex(asset);
    let tx = new Transaction();

    if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      console.log(
        `[${assetToName(
          asset
        )}] User doesn't have open orders account. Initialising for asset ${asset}.`
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

    tx.add(
      instructions.placeTriggerOrderIx(
        asset,
        orderPrice,
        triggerPrice,
        triggerDirection,
        triggerTimestamp,
        triggerOrderBit,
        size,
        side,
        orderType,
        options.reduceOnly != undefined ? options.reduceOnly : false,
        options.tag,
        this.accountAddress,
        this._provider.wallet.publicKey,
        openOrdersPda
      )
    );

    let txId: TransactionSignature = await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      options.blockhash,
      this._txRetryAmount
    );
    this._openOrdersAccounts[assetIndex] = openOrdersPda;
    return txId;
  }

  /*
   * Note: When using this you must pass in the trigger order bit yourself, you can do this by calling
   * CrossClient.findAvailableTriggerOrderBit(),
   * If you need to create more than one instruction atomically
   * put in consecutvie nubmers for triggerOrderBit
   */
  public createPlaceTriggerOrderIx(
    asset: Asset,
    orderPrice: number,
    size: number,
    side: types.Side,
    triggerPrice: number,
    triggerDirection: types.TriggerDirection = types.getDefaultTriggerDirection(
      side
    ),
    triggerTimestamp: anchor.BN,
    orderType: types.OrderType,
    triggerOrderBit: number,
    options: types.TriggerOrderOptions = types.defaultTriggerOrderOptions()
  ): TransactionInstruction {
    let assetIndex = assets.assetToIndex(asset);
    let openOrdersAccount = this._openOrdersAccounts[assetIndex];
    if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      // This account won't be created unless explicitly done so before this instruction
      // Purposely don't throw because there are some frontend cases which do more complicated tx building
      openOrdersAccount = utils.getCrossOpenOrders(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        this._accountAddress
      )[0];
      console.warn(`No open orders account for ${assetToName(asset)}`);
    }

    return instructions.placeTriggerOrderIx(
      asset,
      orderPrice,
      triggerPrice,
      triggerDirection,
      triggerTimestamp,
      triggerOrderBit,
      size,
      side,
      orderType,
      options.reduceOnly != undefined ? options.reduceOnly : false,
      options.tag,
      this.accountAddress,
      this._provider.wallet.publicKey,
      openOrdersAccount
    );
  }

  /**
   * Close all positions using market orders
   * @param orderPrices Manual override for what price to send, decimal format
   */
  public async closeAllPositions(orderPrices: Map<Asset, number>) {
    let ixs = [];

    for (var position of [...this._positions.values()].flat()) {
      let side = position.size < 0 ? types.Side.BID : types.Side.ASK;

      if (!orderPrices.has(position.asset)) {
        throw Error(`orderPrices does not have a value for ${position.asset}`);
      }
      let price = orderPrices.get(position.asset);

      ixs.push(
        this.createPlacePerpOrderInstruction(
          position.asset,
          utils.convertDecimalToNativeInteger(price),
          utils.convertDecimalToNativeLotSize(Math.abs(position.size)),
          side,
          { orderType: types.OrderType.FILLORKILL, tifOptions: {} } // We want to error if the trade didn't work for full size
        )
      );
    }

    let txs = utils.splitIxsIntoTx(
      ixs,
      this.useVersionedTxs
        ? constants.MAX_ORDERS_PER_TX_LUT
        : constants.MAX_ORDERS_PER_TX
    );
    let txIds: string[] = [];
    await Promise.all(
      txs.map(async (tx) => {
        txIds.push(
          await utils.processTransaction(
            this._provider,
            tx,
            undefined,
            undefined,
            undefined,
            this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
            undefined,
            this._txRetryAmount
          )
        );
      })
    );

    return txIds;
  }

  public async cancelAllTriggerOrders(asset: Asset | undefined) {
    let orders = [];
    if (asset == undefined) {
      // All assets
      orders = [...this._triggerOrders.values()].flat();
    } else {
      orders = this.getTriggerOrders(asset);
    }

    if (orders.length < 1) {
      return;
    }

    let triggerOrderIndexes = orders.map((order) => {
      return order.triggerOrderBit;
    });

    let txs = this.createCancelTriggerOrdersTxs(triggerOrderIndexes);

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
            this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
            undefined,
            this._txRetryAmount
          )
        );
      })
    );

    return txIds;
  }

  public async cancelAllTriggerOrdersAndPlaceOrder(
    asset: Asset,
    price: number,
    size: number,
    side: types.Side,
    options: types.OrderOptions = types.defaultOrderOptions()
  ) {
    let triggerOrderIndexes = this.getTriggerOrders(asset).map(
      (triggerOrder) => {
        return triggerOrder.triggerOrderBit;
      }
    );

    let txs = this.createCancelTriggerOrdersTxs(triggerOrderIndexes);

    let placeIx = instructions.placePerpOrderV5Ix(
      asset,
      price,
      size,
      side,
      options.orderType != undefined
        ? options.orderType
        : types.OrderType.LIMIT,
      options.reduceOnly != undefined ? options.reduceOnly : false,
      options.clientOrderId != undefined ? options.clientOrderId : 0,
      options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
      utils.getTIFOffset(Exchange.getPerpMarket(asset), options.tifOptions),
      this.accountAddress,
      this._provider.wallet.publicKey,
      this._openOrdersAccounts[assetToIndex(asset)],
      this._whitelistTradingFeesAddress,
      options.selfTradeBehavior
    );

    // Edge case where user has 0 trigger orders
    if (txs.length == 0) {
      txs[0] = new Transaction().add(placeIx);
    } else {
      txs[txs.length - 1].add(placeIx);
    }
    // Send the first N-1 cancels async
    // The last cancel contains a placeOrder after it, which should come after the cancels are all completed successfully
    let txsWithoutLast = txs.slice(0, txs.length - 1);
    let txIds: string[] = [];

    await Promise.all(
      txsWithoutLast.map(async (tx) => {
        txIds.push(
          await utils.processTransaction(
            this.provider,
            tx,
            undefined,
            undefined,
            undefined,
            this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
            undefined,
            this._txRetryAmount
          )
        );
      })
    );
    txIds.push(
      await utils.processTransaction(
        this.provider,
        txs[txs.length - 1],
        undefined,
        undefined,
        undefined,
        this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
        undefined,
        this._txRetryAmount
      )
    );
    return txIds;
  }

  private createCancelTriggerOrdersTxs(indexes: number[]) {
    let txs = [];

    for (
      var i = 0;
      i < indexes.length;
      i += constants.MAX_TRIGGER_CANCELS_PER_TX
    ) {
      let tx = new Transaction();
      for (var j = 0; j < constants.MAX_TRIGGER_CANCELS_PER_TX; j++) {
        // Don't want to overrun on the last one
        if (i + j >= indexes.length) {
          break;
        }
        let triggerAccount = utils.getTriggerOrder(
          Exchange.programId,
          this._accountAddress,
          new Uint8Array([indexes[i + j]])
        )[0];
        tx.add(
          instructions.cancelTriggerOrderV2Ix(
            indexes[i + j],
            this.publicKey,
            triggerAccount,
            this._accountAddress
          )
        );
      }
      txs.push(tx);
    }

    return txs;
  }

  public async cancelTriggerOrder(orderIndex: number) {
    let triggerAccount = utils.getTriggerOrder(
      Exchange.programId,
      this._accountAddress,
      new Uint8Array([orderIndex])
    )[0];
    let tx = new Transaction().add(
      instructions.cancelTriggerOrderV2Ix(
        orderIndex,
        this._provider.wallet.publicKey,
        triggerAccount,
        this._accountAddress
      )
    );
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );
  }

  public async editTimestampTriggerOrder(
    orderIndex: number,
    newOrderPrice: number,
    newTriggerTime: anchor.BN,
    newSize: number,
    newSide: types.Side,
    newOrderType: types.OrderType,
    newOptions: types.TriggerOrderOptions = types.defaultTriggerOrderOptions()
  ): Promise<TransactionSignature> {
    return await this.editTriggerOrder(
      orderIndex,
      newOrderPrice,
      newSize,
      newSide,
      0,
      types.TriggerDirection.UNINITIALIZED,
      newTriggerTime,
      newOrderType,
      newOptions
    );
  }

  public async takeTriggerOrder(
    orderIndex: number,
    asset: Asset,
    orderMarginAccount: PublicKey
  ) {
    let triggerAccount = utils.getTriggerOrder(
      Exchange.programId,
      orderMarginAccount,
      new Uint8Array([orderIndex])
    )[0];

    let tx = new Transaction().add(
      instructions.takeTriggerOrderIx(
        asset,
        triggerAccount,
        orderIndex,
        orderMarginAccount,
        this._accountAddress,
        this.provider.wallet.publicKey
      )
    );
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );
  }

  public async editPriceTriggerOrder(
    orderIndex: number,
    newOrderPrice: number,
    newTriggerPrice: number,
    newSize: number,
    newSide: types.Side,
    newDirection: types.TriggerDirection,
    newOrderType: types.OrderType,
    newOptions: types.TriggerOrderOptions = types.defaultTriggerOrderOptions()
  ): Promise<TransactionSignature> {
    return await this.editTriggerOrder(
      orderIndex,
      newOrderPrice,
      newSize,
      newSide,
      newTriggerPrice,
      newDirection,
      new anchor.BN(0),
      newOrderType,
      newOptions
    );
  }

  private async editTriggerOrder(
    orderIndex: number,
    newOrderPrice: number,
    newSize: number,
    newSide: types.Side,
    newTriggerPrice: number,
    newDirection: types.TriggerDirection,
    newTriggerTimestamp: anchor.BN,
    newOrderType: types.OrderType,
    newOptions: types.TriggerOrderOptions = types.defaultTriggerOrderOptions()
  ): Promise<TransactionSignature> {
    let triggerAccount = utils.getTriggerOrder(
      Exchange.programId,
      this._accountAddress,
      new Uint8Array([orderIndex])
    )[0];
    let tx = new Transaction().add(
      instructions.editTriggerOrderIx(
        newOrderPrice,
        newTriggerPrice,
        newDirection,
        newTriggerTimestamp,
        newSize,
        newSide,
        newOrderType,
        newOptions.reduceOnly != undefined ? newOptions.reduceOnly : false,
        this._provider.wallet.publicKey,
        triggerAccount,
        this._accountAddress
      )
    );
    let txSig = await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );

    // Editing a trigger order doesn't prompt an account change because the bits stay the same.
    // Therefore just manually fire this
    if (this._callback !== undefined) {
      this._callback(null, EventType.USER, Exchange.clockSlot, {
        UserCallbackType: types.UserCallbackType.CROSSMARGINACCOUNTCHANGE,
      });
    }

    return txSig;
  }

  public async chooseAirdropCommunity(
    community: types.AirdropCommunity
  ): Promise<TransactionSignature> {
    this.delegatedCheck();
    let tx = new Transaction();

    if (this._accountManager === null) {
      console.log(
        "User has no cross margin account manager. Creating account manager..."
      );
      tx.add(
        instructions.initializeCrossMarginAccountManagerV2Ix(
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
      instructions.chooseAirdropCommunityIx(
        community,
        this.accountManagerAddress,
        this._provider.wallet.publicKey
      )
    );

    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );
  }

  public createCancelOrderNoErrorInstruction(
    asset: Asset,
    orderId: BN,
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
    );
  }

  public async cancelAllMarketOrders(): Promise<TransactionSignature[]> {
    let ixs = [];

    for (var asset of Exchange.assets) {
      let assetIndex = assetToIndex(asset);
      if (
        this.getOrders(asset).length < 1 ||
        this._openOrdersAccounts[assetIndex].equals(PublicKey.default)
      ) {
        continue;
      }

      ixs.push(
        instructions.cancelAllMarketOrdersIx(
          asset,
          this.provider.wallet.publicKey,
          this._accountAddress,
          this._openOrdersAccounts[assetIndex]
        )
      );
    }

    let txs = utils.splitIxsIntoTx(
      ixs,
      this.useVersionedTxs
        ? constants.MAX_PRUNE_CANCELS_PER_TX_LUT
        : constants.MAX_PRUNE_CANCELS_PER_TX
    );
    let txIds: string[] = [];
    await Promise.all(
      txs.map(async (tx) => {
        txIds.push(
          await utils.processTransaction(
            this._provider,
            tx,
            undefined,
            undefined,
            undefined,
            this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
            undefined,
            this._txRetryAmount
          )
        );
      })
    );

    return txIds;
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
        txIds.push(
          await utils.processTransaction(
            this._provider,
            tx,
            undefined,
            undefined,
            undefined,
            this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
            undefined,
            this._txRetryAmount
          )
        );
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
        txIds.push(
          await utils.processTransaction(
            this._provider,
            tx,
            undefined,
            undefined,
            undefined,
            this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
            undefined,
            this._txRetryAmount
          )
        );
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
    let openOrdersAccount = this._openOrdersAccounts[assetIndex];
    if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      // This account won't be created unless explicitly done so before this instruction
      // Purposely don't throw because there are some frontend cases which do more complicated tx building
      openOrdersAccount = utils.getCrossOpenOrders(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        this._accountAddress
      )[0];
      console.warn(`No open orders account for ${assetToName(asset)}`);
    }

    let market = Exchange.getPerpMarket(asset);
    let tifOffset = utils.getTIFOffset(market, options.tifOptions);

    return instructions.placePerpOrderV5Ix(
      asset,
      price,
      size,
      side,
      options.orderType != undefined
        ? options.orderType
        : types.OrderType.LIMIT,
      options.reduceOnly != undefined ? options.reduceOnly : false,
      options.clientOrderId != undefined ? options.clientOrderId : 0,
      options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
      tifOffset,
      this.accountAddress,
      this._provider.wallet.publicKey,
      openOrdersAccount,
      this._whitelistTradingFeesAddress,
      options.selfTradeBehavior
    );
  }

  public createPlaceMultiOrderInstruction(
    asset: Asset,
    bids: types.PlaceMultiOrderArg[],
    asks: types.PlaceMultiOrderArg[],
    orderType: types.OrderType
  ): TransactionInstruction {
    if (
      orderType != types.OrderType.POSTONLY &&
      orderType != types.OrderType.POSTONLYSLIDE &&
      orderType != types.OrderType.POSTONLYFRONT
    ) {
      throw new Error("Invalid order type.");
    }

    let assetIndex = assetToIndex(asset);
    let openOrdersAccount = this._openOrdersAccounts[assetIndex];
    if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
      // This account won't be created unless explicitly done so before this instruction
      // Purposely don't throw because there are some frontend cases which do more complicated tx building
      openOrdersAccount = utils.getCrossOpenOrders(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        this._accountAddress
      )[0];
      console.warn(`No open orders account for ${assetToName(asset)}`);
    }

    let market = Exchange.getPerpMarket(asset);
    let bidOrders: instructions.OrderArgs[] = [];
    let askOrders: instructions.OrderArgs[] = [];

    for (var i = 0; i < bids.length; i++) {
      let o = bids[i];
      let clientOrderId = o.clientOrderId != undefined ? o.clientOrderId : 0;
      let tifOffset = utils.getTIFOffset(market, o.tifOptions);
      let offset = tifOffset == 0 ? null : tifOffset;
      bidOrders.push({
        price: new anchor.BN(o.price),
        size: new anchor.BN(o.size),
        clientOrderId: clientOrderId == 0 ? null : new anchor.BN(clientOrderId),
        tifOffset: offset,
      });
    }

    for (var i = 0; i < asks.length; i++) {
      let o = asks[i];
      let clientOrderId = o.clientOrderId != undefined ? o.clientOrderId : 0;
      let tifOffset = utils.getTIFOffset(market, o.tifOptions);
      let offset = tifOffset == 0 ? null : tifOffset;
      askOrders.push({
        price: new anchor.BN(o.price),
        size: new anchor.BN(o.size),
        clientOrderId: clientOrderId == 0 ? null : new anchor.BN(clientOrderId),
        tifOffset: offset,
      });
    }

    return instructions.placeMultiOrdersIx(
      asset,
      bidOrders,
      askOrders,
      orderType,
      this.accountAddress,
      this._provider.wallet.publicKey,
      openOrdersAccount
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
    orderId: BN,
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
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
      new BN(clientOrderId)
    );
    tx.add(ix);
    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
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
    orderId: BN,
    cancelSide: types.Side,
    newOrderPrice: number,
    newOrderSize: number,
    newOrderSide: types.Side,
    options: types.OrderOptions = types.defaultOrderOptions()
  ): Promise<TransactionSignature> {
    let market = Exchange.getPerpMarket(asset);
    let assetIndex = assetToIndex(asset);
    let tx = new Transaction().add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 300_000,
      })
    );
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
      instructions.placePerpOrderV5Ix(
        asset,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        options.orderType != undefined
          ? options.orderType
          : types.OrderType.LIMIT,
        options.reduceOnly != undefined ? options.reduceOnly : false,
        options.clientOrderId != undefined ? options.clientOrderId : 0,
        options.tag != undefined ? options.tag : constants.DEFAULT_ORDER_TAG,
        tifOffsetToUse,
        this.accountAddress,
        this._provider.wallet.publicKey,
        this._openOrdersAccounts[assetIndex],
        this._whitelistTradingFeesAddress,
        options.selfTradeBehavior
      )
    );

    return await utils.processTransaction(
      this._provider,
      tx,
      undefined,
      undefined,
      undefined,
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      options.blockhash,
      this._txRetryAmount
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
    let tx = new Transaction().add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 300_000,
      })
    );
    tx.add(
      instructions.cancelOrderByClientOrderIdIx(
        asset,
        this.provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetIndex],
        new BN(cancelClientOrderId)
      )
    );

    let tifOffsetToUse = utils.getTIFOffset(market, newOptions.tifOptions);

    tx.add(
      instructions.placePerpOrderV5Ix(
        asset,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        newOptions.orderType != undefined
          ? newOptions.orderType
          : types.OrderType.LIMIT,
        newOptions.reduceOnly != undefined ? newOptions.reduceOnly : false,
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
      newOptions.blockhash,
      this._txRetryAmount
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
    let tx = new Transaction().add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 300_000,
      })
    );
    let market = Exchange.getPerpMarket(asset);
    let assetIndex = assetToIndex(asset);
    tx.add(
      instructions.cancelOrderByClientOrderIdNoErrorIx(
        asset,
        this._provider.wallet.publicKey,
        this._accountAddress,
        this._openOrdersAccounts[assetIndex],
        new BN(cancelClientOrderId)
      )
    );

    let tifOffsetToUse = utils.getTIFOffset(market, newOptions.tifOptions);

    tx.add(
      instructions.placePerpOrderV5Ix(
        asset,
        newOrderPrice,
        newOrderSize,
        newOrderSide,
        newOptions.orderType != undefined
          ? newOptions.orderType
          : types.OrderType.LIMIT,
        newOptions.reduceOnly != undefined ? newOptions.reduceOnly : false,
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
      newOptions.blockhash,
      this._txRetryAmount
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
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
        vaultOwner,
        this._openOrdersAccounts[assetIndex]
      )
    );

    tx.add(
      instructions.closeOpenOrdersV4Ix(
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
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
    for (var asset of assets) {
      let assetIndex = assetToIndex(asset);
      if (this._openOrdersAccounts[assetIndex].equals(PublicKey.default)) {
        throw Error("User has no open orders account for this market!");
      }
      const [vaultOwner, _vaultSignerNonce] = utils.getSerumVaultOwnerAndNonce(
        Exchange.getPerpMarket(asset).address,
        constants.DEX_PID[Exchange.network]
      );
      let settleIx = instructions.settleDexFundsIx(
        asset,
        vaultOwner,
        this._openOrdersAccounts[assetIndex]
      );
      let closeIx = instructions.closeOpenOrdersV4Ix(
        asset,
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
        this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
        undefined,
        this._txRetryAmount
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
    orderId: BN,
    side: types.Side
  ): Promise<TransactionSignature> {
    let accountInfo = await Exchange.connection.getAccountInfo(
      marginAccountToCancel as PublicKeyZstd
    );

    let account: programTypes.MarginAccount | programTypes.CrossMarginAccount;
    let openOrdersAccountToCancel: PublicKey;

    try {
      account =
        Exchange.program.account.crossMarginAccount.coder.accounts.decode(
          types.ProgramAccountType.CrossMarginAccount,
          accountInfo.data
        ) as programTypes.CrossMarginAccount;

      openOrdersAccountToCancel = utils.createCrossOpenOrdersAddress(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        marginAccountToCancel,
        account.openOrdersNonces[assetToIndex(asset)]
      );
    } catch (e) {
      account = Exchange.program.account.marginAccount.coder.accounts.decode(
        types.ProgramAccountType.MarginAccount,
        accountInfo.data
      ) as programTypes.MarginAccount;
      openOrdersAccountToCancel = utils.createOpenOrdersAddress(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        account.authority,
        account.openOrdersNonce[constants.PERP_INDEX]
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
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
    let accountInfo = await Exchange.connection.getAccountInfo(
      marginAccountToCancel as PublicKeyZstd
    );

    let account: programTypes.MarginAccount | programTypes.CrossMarginAccount;
    let openOrdersAccountToCancel: PublicKey;

    try {
      account =
        Exchange.program.account.crossMarginAccount.coder.accounts.decode(
          types.ProgramAccountType.CrossMarginAccount,
          accountInfo.data
        ) as programTypes.CrossMarginAccount;

      openOrdersAccountToCancel = utils.createCrossOpenOrdersAddress(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        marginAccountToCancel,
        account.openOrdersNonces[assetToIndex(asset)]
      );
    } catch (e) {
      account = Exchange.program.account.marginAccount.coder.accounts.decode(
        types.ProgramAccountType.MarginAccount,
        accountInfo.data
      ) as programTypes.MarginAccount;
      openOrdersAccountToCancel = utils.createOpenOrdersAddress(
        Exchange.programId,
        Exchange.getPerpMarket(asset).address,
        account.authority,
        account.openOrdersNonce[constants.PERP_INDEX]
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
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
    let tx = new Transaction().add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 300_000,
      })
    );
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
      this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
      undefined,
      this._txRetryAmount
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
            this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
            undefined,
            this._txRetryAmount
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
            this._useVersionedTxs ? utils.getZetaLutArr() : undefined,
            undefined,
            this._txRetryAmount
          )
        );
      })
    );
    return txIds;
  }

  public getTriggerOrder(triggerOrderBit: number): types.TriggerOrder {
    let triggerOrders: types.TriggerOrder[] = [
      ...this._triggerOrders.values(),
    ].flat();

    for (var triggerOrder of triggerOrders) {
      if (triggerOrder.triggerOrderBit == triggerOrderBit) {
        return triggerOrder;
      }
    }

    throw new Error(`Cannot find trigger order with bit=${triggerOrderBit}`);
  }

  public getTriggerOrders(asset: Asset): types.TriggerOrder[] {
    return this._triggerOrders.get(asset);
  }

  public getOrders(asset: Asset): types.Order[] {
    return this._orders.get(asset);
  }

  public getPositions(asset: Asset): types.Position[] {
    return this._positions.get(asset);
  }

  public updateOpenOrdersSync() {
    if (this._account == null) {
      console.log("User has no margin account, cannot update orders.");
      return;
    }

    let orders = [];

    Exchange.assets.forEach((asset) => {
      try {
        let market = Exchange.getPerpMarket(asset);
        orders.push(
          market.getOrdersForAccount(
            this._openOrdersAccounts[assetToIndex(asset)]
          )
        );
      } catch (e) {
        console.warn(`Warning: ${e}`);
        return;
      }
    });

    let allOrders = [].concat(...orders);
    let allOrdersFiltered = allOrders.filter(function (order: types.Order) {
      let seqNum = utils.getSeqNumFromSerumOrderKey(
        order.orderId,
        order.side == types.Side.BID
      );
      let market = Exchange.getPerpMarket(order.asset);
      let serumMarket = market.serumMarket;

      return !utils.isOrderExpired(
        order.tifOffset,
        seqNum,
        serumMarket.epochStartTs.toNumber(),
        serumMarket.startEpochSeqNum,
        market.TIFBufferSeconds
      );
    });
    let ordersByAsset = new Map();

    Exchange.assets.forEach((asset) => {
      ordersByAsset.set(asset, []);
    });

    for (var order of allOrdersFiltered) {
      ordersByAsset.get(order.asset).push(order);
    }

    this._orders = ordersByAsset;
  }

  public async updateOrders() {
    this.updateOpenOrdersSync();
    if (!this.account || !this.account.triggerOrderBits) {
      return;
    }

    let triggerOrderBits = [];

    // Do this sequentially so the indexes remain in order
    // Therefore sequential updateOrders() calls won't jumble the order of this._triggerOrders
    for (var i = 0; i < 128; i++) {
      let mask: BN = new BN(1).shln(i); // 1 << i
      if (!this.account.triggerOrderBits.and(mask).isZero()) {
        triggerOrderBits.push(i);
      }
    }

    let triggerOrders = [];
    let triggerOrdersByAsset: Map<Asset, types.TriggerOrder[]> = new Map();
    await Promise.all(
      Exchange.assets.map(async (asset) => {
        triggerOrdersByAsset.set(asset, []);
      })
    );

    let triggerOrderAddresses = triggerOrderBits.map(
      (index) =>
        utils.getTriggerOrder(
          Exchange.programId,
          this.accountAddress,
          new Uint8Array([index])
        )[0]
    );

    for (
      let i = 0;
      i < triggerOrderAddresses.length;
      i += constants.MAX_ACCOUNTS_TO_FETCH
    ) {
      let addressSlice = triggerOrderAddresses.slice(
        i,
        i + constants.MAX_ACCOUNTS_TO_FETCH
      );

      let fetchedSlice =
        await Exchange.program.account.triggerOrder.fetchMultiple(addressSlice);

      let fetchedSliceDecoded = fetchedSlice.map(
        (order) => order as programTypes.TriggerOrder
      );

      triggerOrders = triggerOrders.concat(fetchedSliceDecoded);
    }

    triggerOrders.forEach((rawOrder, i) => {
      let order = {
        orderPrice: rawOrder.orderPrice.toNumber(),
        triggerPrice: rawOrder.triggerPrice
          ? rawOrder.triggerPrice.toNumber()
          : null,
        size: rawOrder.size.toNumber(),
        creationTs: rawOrder.creationTs.toNumber(),
        triggerDirection: rawOrder.triggerDirection
          ? types.fromProgramTriggerDirection(rawOrder.triggerDirection)
          : null,
        triggerTimestamp: rawOrder.triggerTs ? rawOrder.triggerTs : null,
        side: types.fromProgramSide(rawOrder.side),
        asset: assets.fromProgramAsset(rawOrder.asset),
        orderType: types.fromProgramOrderType(rawOrder.orderType),
        reduceOnly: rawOrder.reduceOnly,
        triggerOrderBit: rawOrder.bit,
      } as types.TriggerOrder;

      triggerOrdersByAsset.get(order.asset).push(order);
    });

    this._triggerOrders = triggerOrdersByAsset;
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
    if (this._accountManagerSubscriptionId !== undefined) {
      await this._provider.connection.removeAccountChangeListener(
        this._accountManagerSubscriptionId
      );
      this._accountManagerSubscriptionId = undefined;
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

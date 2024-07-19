import * as anchor from "@zetamarkets/anchor";
import {
  PublicKey,
  Transaction,
  ConfirmOptions,
  AccountMeta,
  TransactionInstruction,
  AccountInfo,
} from "@solana/web3.js";
import * as utils from "./utils";
import * as constants from "./constants";
import {
  ExpirySeries,
  MarketIndexes,
  ProductGreeks,
  PerpSyncQueue,
} from "./program-types";
import { Market, ZetaGroupMarkets } from "./market";
import { EventType } from "./events";
import { Network } from "./network";
import { assetToIndex, assetToName, toProgramAsset } from "./assets";
import { Asset } from "./constants";
import * as instructions from "./program-instructions";
import * as fs from "fs";
import * as os from "os";
import * as types from "./types";
import { exchange as Exchange } from "./exchange";

export class SubExchange {
  /**
   * Whether the object has been set up (in .initialize()).
   */
  public get isSetup(): boolean {
    return this._isSetup;
  }
  private _isSetup: boolean = false;

  /**
   * Whether the object has been initialized (in .load()).
   */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }
  private _isInitialized: boolean = false;

  /**
   * The asset loaded to the this.
   */
  public get asset(): Asset {
    return this._asset;
  }
  private _asset: Asset;
  // Program global addresses that will remain constant.

  /**
   * Address of zeta group account.
   */
  public get zetaGroupAddress(): PublicKey {
    return this._zetaGroupAddress;
  }
  private _zetaGroupAddress: PublicKey;

  /**
   * Address of greeks account.
   */
  public get greeksAddress(): PublicKey {
    return this._greeksAddress;
  }
  private _greeksAddress: PublicKey;

  /**
   * Returns the markets object.
   */
  public get markets(): ZetaGroupMarkets {
    return this._markets;
  }
  private _markets: ZetaGroupMarkets;

  private _eventEmitters: any[] = [];

  /**
   * Account storing the queue which synchronises taker/maker perp funding payments.
   * You shouldn't need to read from this, it's mainly for our integration tests
   */
  public get perpSyncQueue(): PerpSyncQueue {
    return this._perpSyncQueue;
  }
  private _perpSyncQueue: PerpSyncQueue;

  public get perpSyncQueueAddress(): PublicKey {
    return this._perpSyncQueueAddress;
  }
  private _perpSyncQueueAddress: PublicKey;

  public get halted(): boolean {
    return Exchange.state.haltStates[assetToIndex(this._asset)].halted;
  }

  public async initialize(asset: Asset) {
    if (this.isSetup) {
      throw Error("SubExchange already initialized.");
    }

    this._asset = asset;

    // Load zeta group.
    let underlyingMint = utils.getUnderlyingMint(asset);

    // Grab zetagroupaddress manually because Pricing acc isnt loaded yet at this point
    this._zetaGroupAddress = utils.getZetaGroup(
      Exchange.programId,
      underlyingMint
    )[0];

    this._greeksAddress = utils.getGreeks(
      Exchange.programId,
      this._zetaGroupAddress
    )[0];

    this._perpSyncQueueAddress = utils.getPerpSyncQueue(
      Exchange.programId,
      this._zetaGroupAddress
    )[0];

    this._isSetup = true;
  }

  /**
   * Loads a fresh instance of the subExchange object using on chain state.
   * @param throttleMs    Whether to sleep on market loading for rate limit reasons.
   */
  public async load(
    asset: Asset,
    opts: ConfirmOptions,
    perpSyncQueue: PerpSyncQueue,
    decodedSrmMarket: any,
    bidAccInfo: AccountInfo<Buffer>,
    askAccInfo: AccountInfo<Buffer>,
    clockData: types.ClockData
  ) {
    console.info(`Loading ${assetToName(asset)} subExchange.`);

    if (this.isInitialized) {
      throw Error("SubExchange already loaded.");
    }

    this._perpSyncQueue = perpSyncQueue;

    this._markets = await ZetaGroupMarkets.load(
      asset,
      opts,
      decodedSrmMarket,
      bidAccInfo,
      askAccInfo,
      clockData
    );

    Exchange.riskCalculator.updateMarginRequirements(asset);

    // Set callbacks.
    this.subscribePerpSyncQueue();

    this._isInitialized = true;

    console.info(`${assetToName(this.asset)} SubExchange loaded`);
    return;
  }

  /**
   * Refreshes serum markets cache
   */
  public async updateSerumMarkets() {
    console.info(
      `Refreshing Serum markets for ${assetToName(this._asset)} SubExchange.`
    );

    await this._markets.market.serumMarket.updateDecoded(Exchange.connection);

    console.log(
      `${assetToName(this.asset)} SubExchange Serum markets refreshed`
    );
  }

  /**
   * Checks only if the perp serum markets are stale and refreshes it if so
   */
  public async updatePerpSerumMarketIfNeeded(epochDelay: number) {
    if (!Exchange.isInitialized) {
      return;
    }

    if (Exchange.isHalted(this._asset)) {
      return;
    }

    let m = this._markets.market;

    if (
      m.serumMarket.epochLength.toNumber() == 0 ||
      m.serumMarket.startEpochSeqNum.isZero() ||
      m.serumMarket.epochStartTs.toNumber() +
        m.serumMarket.epochLength.toNumber() +
        epochDelay >
        Exchange.clockTimestamp
    ) {
      return;
    }

    await m.serumMarket.updateDecoded(Exchange.connection);

    // Can get spammy on non-mainnet if no one is placing orders
    // because TIF epochs automatically roll over on new orders
    if (Exchange.network == Network.MAINNET) {
      console.log(
        `${assetToName(this.asset)} SubExchange perp Serum market refreshed`
      );
    }
  }

  /**
   * Update the margin parameters for a zeta group.
   */
  public async updateMarginParameters(
    args: instructions.UpdateMarginParametersArgs
  ) {
    let tx = new Transaction().add(
      instructions.updateMarginParametersIx(
        this.asset,
        args,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   * Update the perp parameters for a zeta group.
   */
  public async updatePerpParameters(
    args: instructions.UpdatePerpParametersArgs
  ) {
    let tx = new Transaction().add(
      instructions.updatePerpParametersIx(
        this.asset,
        args,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async initializeZetaMarketsTIFEpochCycle(cycleLengthSecs: number) {
    if (cycleLengthSecs > 65_535) {
      throw Error("Can't initialize TIF epoch cycle > u16::MAX");
    }

    let ixs: TransactionInstruction[] = [];
    ixs.push(
      instructions.initializeZetaMarketTIFEpochCyclesIx(
        this.asset,
        cycleLengthSecs
      )
    );

    let txs = utils.splitIxsIntoTx(
      ixs,
      constants.MAX_INITIALIZE_MARKET_TIF_EPOCH_CYCLE_IXS_PER_TX
    );

    await Promise.all(
      txs.map(async (tx) => {
        await utils.processTransaction(
          Exchange.provider,
          tx,
          [],
          utils.commitmentConfig(Exchange.connection.commitment),
          Exchange.useLedger
        );
      })
    );

    await this.updateSerumMarkets();
  }

  public async initializePerpSyncQueue() {
    let tx = new Transaction().add(
      await instructions.initializePerpSyncQueueIx(this.asset)
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async initializeUnderlying(flexUnderlying: boolean) {
    let tx = new Transaction().add(
      instructions.initializeUnderlyingIx(
        await utils.getUnderlyingMint(this._asset),
        flexUnderlying
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   * Update pricing for an expiry index.
   */
  public async updatePricing() {
    let tx = new Transaction().add(instructions.updatePricingV2Ix(this.asset));
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async updatePricingV3(price: anchor.BN, timestamp: anchor.BN) {
    let tx = new Transaction().add(
      instructions.updatePricingV3Ix(this.asset, price, timestamp)
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public assertInitialized() {
    if (!this.isInitialized) {
      throw Error("SubExchange uninitialized");
    }
  }

  private subscribePerpSyncQueue() {
    if (this._zetaGroupAddress === PublicKey.default) {
      throw Error("Cannot subscribe perpSyncQueue. ZetaGroup is null.");
    }

    let eventEmitter = Exchange.program.account.perpSyncQueue.subscribe(
      Exchange.pricing.perpSyncQueues[assetToIndex(this._asset)],
      Exchange.provider.connection.commitment
    );

    // Purposely don't push out a callback here, users shouldn't care about
    // updates to perpSyncQueue
    eventEmitter.on("change", async (perpSyncQueue: PerpSyncQueue) => {
      this._perpSyncQueue = perpSyncQueue;
    });

    this._eventEmitters.push(eventEmitter);
  }

  /**
   * @param index   market index to get mark price.
   */
  public getMarkPrice(): number {
    let price = Exchange.pricing.markPrices[assetToIndex(this._asset)];

    return utils.convertNativeBNToDecimal(price, constants.PLATFORM_PRECISION);
  }

  /**
   * Returns all perp & nonperk markets in a single list
   */
  public getMarket(): Market {
    return this._markets.market;
  }

  /**
   * @param user user pubkey to be whitelisted for uncapped deposit
   */
  public async whitelistUserForDeposit(user: PublicKey) {
    let tx = new Transaction().add(
      instructions.initializeWhitelistDepositAccountIx(
        this.asset,
        user,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   * @param user user pubkey to be whitelisted for our insurance vault
   */
  public async whitelistUserForInsuranceVault(user: PublicKey) {
    let tx = new Transaction().add(
      instructions.initializeWhitelistInsuranceAccountIx(
        user,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   * @param user user pubkey to be whitelisted for trading fees
   */
  public async whitelistUserForTradingFees(user: PublicKey) {
    let tx = new Transaction().add(
      instructions.initializeWhitelistTradingFeesAccountIx(
        user,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   * Halt zeta group functionality.
   */

  public assertHalted() {
    if (!Exchange.state.haltStates[assetToIndex(this.asset)].halted) {
      throw Error("Not halted.");
    }
  }

  public async halt() {
    let tx = new Transaction().add(
      instructions.haltIx(this.asset, Exchange.provider.wallet.publicKey)
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async unhalt() {
    let tx = new Transaction().add(
      instructions.unhaltIx(this.asset, Exchange.provider.wallet.publicKey)
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async updateHaltState(timestamp: anchor.BN, spotPrice: anchor.BN) {
    let tx = new Transaction().add(
      instructions.updateHaltStateIx(
        {
          asset: toProgramAsset(this.asset),
          spotPrice: spotPrice,
          timestamp: timestamp,
        },
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async settlePositionsHalted(marginAccounts: AccountMeta[]) {
    let txs = instructions.settlePositionsHaltedTxs(
      this._asset,
      marginAccounts,
      Exchange.state.pricingAdmin
    );

    await Promise.all(
      txs.map(async (tx) => {
        await utils.processTransaction(Exchange.provider, tx);
      })
    );
  }

  public async cancelAllOrdersHalted() {
    this.assertHalted();
    await this.getMarket().cancelAllOrdersHalted();
  }

  public async cleanZetaMarketHalted() {
    this.assertHalted();
    await utils.cleanZetaMarketHalted(this._asset);
  }

  /**
   * Close the websockets.
   */
  public async close() {
    this._isInitialized = false;
    this._isSetup = false;

    await Exchange.program.account.perpSyncQueue.unsubscribe(
      Exchange.pricing.perpSyncQueues[assetToIndex(this._asset)]
    );

    await this.markets.market.unsubscribeOrderbook();

    for (var i = 0; i < this._eventEmitters.length; i++) {
      this._eventEmitters[i].removeListener("change");
    }
    this._eventEmitters = [];
  }
}

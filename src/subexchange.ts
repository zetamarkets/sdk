import * as anchor from "@zetamarkets/anchor";
import {
  PublicKey,
  Transaction,
  ConfirmOptions,
  AccountMeta,
  TransactionInstruction,
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
  public get numMarkets(): number {
    return this.getMarkets().length;
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

  public get marginParams(): types.MarginParams {
    return this._marginParams;
  }
  private _marginParams: types.MarginParams;

  public get halted(): boolean {
    return Exchange.state.haltStates[assetToIndex(this._asset)].halted;
  }

  public async initialize(asset: Asset) {
    if (this.isSetup) {
      throw "SubExchange already initialized.";
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
   * @param throttle    Whether to sleep on market loading for rate limit reasons.
   */
  public async load(
    asset: Asset,
    opts: ConfirmOptions,
    fetchedAccs: any[],
    loadFromStore: boolean,
    throttleMs = 0,
    callback?: (asset: Asset, event: EventType, data: any) => void
  ) {
    console.info(`Loading ${assetToName(asset)} subExchange.`);

    if (this.isInitialized) {
      throw "SubExchange already loaded.";
    }

    this._perpSyncQueue = fetchedAccs[0] as PerpSyncQueue;
    this.updateMarginParams();

    this._markets = await ZetaGroupMarkets.load(
      asset,
      opts,
      throttleMs,
      loadFromStore
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

    await Promise.all(
      this._markets.markets
        .map(async (m) => {
          return m.serumMarket.updateDecoded(Exchange.connection);
        })
        .concat([
          this._markets.perpMarket.serumMarket.updateDecoded(
            Exchange.connection
          ),
        ])
    );

    console.log(
      `${assetToName(this.asset)} SubExchange Serum markets refreshed`
    );
  }

  /**
   * Checks only if the perp serum markets are stale and refreshes it if so
   */
  public async updatePerpSerumMarketIfNeeded(epochDelay: number) {
    let m = this._markets.perpMarket;

    if (
      m.serumMarket.epochLength.toNumber() == 0 ||
      m.serumMarket.epochStartTs.toNumber() +
        m.serumMarket.epochLength.toNumber() +
        epochDelay >
        Exchange.clockTimestamp
    ) {
      return;
    }

    await m.serumMarket.updateDecoded(Exchange.connection);

    console.log(
      `${assetToName(this.asset)} SubExchange perp Serum market refreshed`
    );
  }

  /**
   * Update the pricing parameters for a zeta group.
   */
  public async updatePricingParameters(
    args: instructions.UpdatePricingParametersArgs
  ) {
    let tx = new Transaction().add(
      instructions.updatePricingParametersIx(
        this.asset,
        args,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
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

  /**
   * Update the margin parameters for a zeta group.
   */
  public async updateZetaGroupExpiryParameters(
    args: instructions.UpdateZetaGroupExpiryArgs
  ) {
    let tx = new Transaction().add(
      instructions.updateZetaGroupExpiryParametersIx(
        this.asset,
        args,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   * Toggles whether a zeta group is perps-only or not
   */
  public async toggleZetaGroupPerpsOnly() {
    let tx = new Transaction().add(
      instructions.toggleZetaGroupPerpsOnlyIx(
        this.asset,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   * Initializes the zeta markets for a zeta group.
   */
  public async initializeZetaMarkets() {
    // Initialize market indexes.
    let [marketIndexes, marketIndexesNonce] = utils.getMarketIndexes(
      Exchange.programId,
      this._zetaGroupAddress
    );

    console.log("Initializing market indexes.");

    let tx = new Transaction().add(
      instructions.initializeMarketIndexesIx(
        this._asset,
        marketIndexes,
        marketIndexesNonce
      )
    );
    try {
      await utils.processTransaction(
        Exchange.provider,
        tx,
        [],
        utils.defaultCommitment(),
        Exchange.useLedger
      );
    } catch (e) {
      console.error(`Initialize market indexes failed: ${e}`);
    }

    let tx2 = new Transaction().add(
      instructions.addPerpMarketIndexIx(this.asset, marketIndexes)
    );

    try {
      await utils.processTransaction(
        Exchange.provider,
        tx2,
        [],
        utils.defaultCommitment(),
        Exchange.useLedger
      );
      await utils.sleep(100);
    } catch (e) {
      console.error(`Add market indexes failed: ${e}`);
      console.log(e);
    }

    let marketIndexesAccount =
      (await Exchange.program.account.marketIndexes.fetch(
        marketIndexes
      )) as MarketIndexes;

    if (!marketIndexesAccount.initialized) {
      throw Error("Market indexes are not initialized!");
    }
    await this.initializeZetaMarket(marketIndexes, marketIndexesAccount);
  }

  private async initializeZetaMarket(
    marketIndexes: PublicKey,
    marketIndexesAccount: MarketIndexes
  ) {
    console.log(`Initializing zeta market`);

    const homedir = os.homedir();
    let dir = `${homedir}/keys/${assetToName(this.asset)}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let i = constants.PERP_INDEX;

    const requestQueue = utils.getOrCreateKeypair(`${dir}/rq-${i}.json`);
    const eventQueue = utils.getOrCreateKeypair(`${dir}/eq-${i}.json`);
    const bids = utils.getOrCreateKeypair(`${dir}/bids-${i}.json`);
    const asks = utils.getOrCreateKeypair(`${dir}/asks-${i}.json`);

    let [tx, tx2] = await instructions.initializeZetaMarketTxs(
      this.asset,
      marketIndexesAccount.indexes[i],
      requestQueue.publicKey,
      eventQueue.publicKey,
      bids.publicKey,
      asks.publicKey,
      marketIndexes
    );

    let marketInitialized = false;
    let accountsInitialized = false;
    if (Exchange.network != Network.LOCALNET) {
      // Validate that the market hasn't already been initialized
      // So no sol is wasted on unnecessary accounts.
      const [market, _marketNonce] = utils.getMarketUninitialized(
        Exchange.programId,
        this._zetaGroupAddress,
        marketIndexesAccount.indexes[i]
      );

      let info = await Exchange.provider.connection.getAccountInfo(market);
      if (info !== null) {
        marketInitialized = true;
      }

      info = await Exchange.provider.connection.getAccountInfo(bids.publicKey);
      if (info !== null) {
        accountsInitialized = true;
      }
    }

    if (accountsInitialized) {
      console.log(`Market ${i} serum accounts already initialized...`);
    } else {
      try {
        await utils.processTransaction(
          Exchange.provider,
          tx,
          [requestQueue, eventQueue, bids, asks],
          utils.commitmentConfig(Exchange.connection.commitment),
          Exchange.useLedger
        );
      } catch (e) {
        console.error(
          `Initialize zeta market serum accounts ${i} failed: ${e}`
        );
      }
    }

    if (marketInitialized) {
      console.log(`Market ${i} already initialized. Skipping...`);
    } else {
      try {
        await utils.processTransaction(
          Exchange.provider,
          tx2,
          [],
          utils.commitmentConfig(Exchange.connection.commitment),
          Exchange.useLedger
        );
      } catch (e) {
        console.error(`Initialize zeta market ${i} failed: ${e}`);
      }
    }
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

  /**
   * Will throw if it is not strike initialization time.
   */
  public async initializeMarketStrikes() {
    let tx = new Transaction().add(
      instructions.initializeMarketStrikesIx(this.asset)
    );
    await utils.processTransaction(Exchange.provider, tx);
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

  public assertInitialized() {
    if (!this.isInitialized) {
      throw "SubExchange uninitialized";
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

  public async handlePolling(
    callback?: (asset: Asset, eventType: EventType, data: any) => void
  ) {
    if (!this._isInitialized) {
      return;
    }
    this._markets.updateExpirySeries();
    if (callback !== undefined) {
      callback(this.asset, EventType.EXCHANGE, null);
    }

    await this._markets.handlePolling(callback);
  }

  public async updateSubExchangeState() {
    this._markets.updateExpirySeries();
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
  public getMarkets(): Market[] {
    return this._markets.markets.concat(this._markets.perpMarket);
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

  public updateMarginParams() {
    if (Exchange.pricing === undefined) {
      return;
    }
    this._marginParams = {
      futureMarginInitial: utils.convertNativeBNToDecimal(
        Exchange.pricing.marginParameters[assetToIndex(this._asset)]
          .futureMarginInitial,
        constants.MARGIN_PRECISION
      ),
      futureMarginMaintenance: utils.convertNativeBNToDecimal(
        Exchange.pricing.marginParameters[assetToIndex(this._asset)]
          .futureMarginMaintenance,
        constants.MARGIN_PRECISION
      ),
    };
  }

  /**
   * Halt zeta group functionality.
   */

  public assertHalted() {
    if (!Exchange.state.haltStates[assetToIndex(this.asset)].halted) {
      throw "Not halted.";
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
      Exchange.provider.wallet.publicKey
    );

    await Promise.all(
      txs.map(async (tx) => {
        await utils.processTransaction(Exchange.provider, tx);
      })
    );
  }

  public async cancelAllOrdersHalted() {
    this.assertHalted();
    await Promise.all(
      this.getMarkets().map(async (market) => {
        await market.cancelAllOrdersHalted();
      })
    );
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
    for (var i = 0; i < this._eventEmitters.length; i++) {
      this._eventEmitters[i].removeListener("change");
    }
    this._eventEmitters = [];
  }
}

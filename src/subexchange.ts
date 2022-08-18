import * as anchor from "@project-serum/anchor";
import {
  PublicKey,
  Transaction,
  ConfirmOptions,
  AccountMeta,
} from "@solana/web3.js";
import * as utils from "./utils";
import * as constants from "./constants";
import {
  Greeks,
  ExpirySeries,
  ZetaGroup,
  MarketIndexes,
  ProductGreeks,
} from "./program-types";
import { ZetaGroupMarkets } from "./market";
import { EventType } from "./events";
import { Network } from "./network";
import { Asset, assetToName } from "./assets";
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
   * Account storing zeta group account info.
   */
  public get zetaGroup(): ZetaGroup {
    return this._zetaGroup;
  }
  private _zetaGroup: ZetaGroup;

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
   * Public key for a given zeta group vault.
   */
  public get vaultAddress(): PublicKey {
    return this._vaultAddress;
  }
  private _vaultAddress: PublicKey;

  /**
   * Public key for insurance vault.
   */
  public get insuranceVaultAddress(): PublicKey {
    return this._insuranceVaultAddress;
  }
  private _insuranceVaultAddress: PublicKey;

  /**
   * Public key for socialized loss account.
   */
  public get socializedLossAccountAddress(): PublicKey {
    return this._socializedLossAccountAddress;
  }
  private _socializedLossAccountAddress: PublicKey;

  /**
   * Returns the markets object.
   */
  public get markets(): ZetaGroupMarkets {
    return this._markets;
  }
  public get numMarkets(): number {
    return this._markets.markets.length;
  }
  private _markets: ZetaGroupMarkets;

  private _eventEmitters: any[] = [];

  /**
   * Account storing all the greeks.
   */
  public get greeks(): Greeks {
    return this._greeks;
  }
  private _greeks: Greeks;

  public get greeksAddress(): PublicKey {
    return this._greeksAddress;
  }
  private _greeksAddress: PublicKey;

  public get marginParams(): types.MarginParams {
    return this._marginParams;
  }
  private _marginParams: types.MarginParams;

  public get frontExpirySeries(): ExpirySeries {
    return this._zetaGroup.expirySeries[this._zetaGroup.frontExpiryIndex];
  }

  public get halted(): boolean {
    return this._zetaGroup.haltState.halted;
  }

  public async initialize(asset: Asset) {
    if (this.isSetup) {
      throw "SubExchange already initialized.";
    }

    this._asset = asset;

    // Load zeta group.
    let underlyingMint = constants.MINTS[asset];

    const [zetaGroup, _zetaGroupNonce] = await utils.getZetaGroup(
      Exchange.programId,
      underlyingMint
    );
    this._zetaGroupAddress = zetaGroup;

    let [greeks, _greeksNonce] = await utils.getGreeks(
      Exchange.programId,
      this.zetaGroupAddress
    );

    this._greeksAddress = greeks;

    const [vaultAddress, _vaultNonce] = await utils.getVault(
      Exchange.programId,
      this._zetaGroupAddress
    );

    const [insuranceVaultAddress, _insuranceNonce] =
      await utils.getZetaInsuranceVault(
        Exchange.programId,
        this.zetaGroupAddress
      );

    const [socializedLossAccount, _socializedLossAccountNonce] =
      await utils.getSocializedLossAccount(
        Exchange.programId,
        this._zetaGroupAddress
      );

    this._vaultAddress = vaultAddress;
    this._insuranceVaultAddress = insuranceVaultAddress;
    this._socializedLossAccountAddress = socializedLossAccount;

    this._isSetup = true;
  }

  /**
   * Loads a fresh instance of the subExchange object using on chain state.
   * @param throttle    Whether to sleep on market loading for rate limit reasons.
   */
  public async load(
    asset: Asset,
    programId: PublicKey,
    network: Network,
    opts: ConfirmOptions,
    throttleMs = 0,
    callback?: (asset: Asset, event: EventType, data: any) => void
  ) {
    console.info(`Loading ${assetToName(asset)} subExchange.`);

    if (this.isInitialized) {
      throw "SubExchange already loaded.";
    }

    await this.updateZetaGroup();

    this._markets = await ZetaGroupMarkets.load(this.asset, opts, 0);

    if (
      this.zetaGroup.products[this.zetaGroup.products.length - 1].market.equals(
        PublicKey.default
      )
    ) {
      throw "Zeta group markets are uninitialized!";
    }

    this._markets = await ZetaGroupMarkets.load(asset, opts, throttleMs);
    this._greeks = (await Exchange.program.account.greeks.fetch(
      this.greeksAddress
    )) as Greeks;
    Exchange.riskCalculator.updateMarginRequirements(asset);

    // Set callbacks.
    this.subscribeZetaGroup(asset, callback);
    this.subscribeGreeks(asset, callback);

    this._isInitialized = true;

    console.log(`${assetToName(this.asset)} SubExchange loaded`);
  }

  /**
   * Initializes the market nodes for a zeta group.
   */
  public async initializeMarketNodes(zetaGroup: PublicKey) {
    let indexes = [...Array(constants.ACTIVE_MARKETS).keys()];
    await Promise.all(
      indexes.map(async (index: number) => {
        let tx = new Transaction().add(
          await instructions.initializeMarketNodeIx(this.asset, index)
        );
        await utils.processTransaction(Exchange.provider, tx);
      })
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
    await this.updateZetaGroup();
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
    await this.updateZetaGroup();
  }

  /**
   * Update the margin parameters for a zeta group.
   */
  public async updateZetaGroupExpiryParameters(
    args: instructions.UpdateZetaGroupExpiryArgs
  ) {
    let tx = new Transaction().add(
      instructions.updateZetaGroupExpiryParameters(
        this.asset,
        args,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
    await this.updateZetaGroup();
  }

  /**
   * Update the volatility nodes for a surface.
   */
  public async updateVolatilityNodes(nodes: Array<anchor.BN>) {
    if (nodes.length != constants.VOLATILITY_POINTS) {
      throw Error(
        `Invalid number of nodes. Expected ${constants.VOLATILITY_POINTS}.`
      );
    }
    let tx = new Transaction().add(
      instructions.updateVolatilityNodesIx(
        this.asset,
        nodes,
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
    let [marketIndexes, marketIndexesNonce] = await utils.getMarketIndexes(
      Exchange.programId,
      this._zetaGroupAddress
    );

    console.log("Initializing market indexes.");

    let tx = new Transaction().add(
      instructions.initializeMarketIndexesIx(
        this.asset,
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

    // We initialize 50 indexes at a time in the program.
    let tx2 = new Transaction().add(
      instructions.addMarketIndexesIx(this.asset, marketIndexes)
    );

    for (
      var i = 0;
      i < constants.TOTAL_MARKETS;
      i += constants.MARKET_INDEX_LIMIT
    ) {
      try {
        await utils.processTransaction(
          Exchange.provider,
          tx2,
          [],
          utils.defaultCommitment(),
          Exchange.useLedger
        );
      } catch (e) {
        console.error(`Add market indexes failed: ${e}`);
      }
    }

    let marketIndexesAccount =
      (await Exchange.program.account.marketIndexes.fetch(
        marketIndexes
      )) as MarketIndexes;

    if (!marketIndexesAccount.initialized) {
      throw Error("Market indexes are not initialized!");
    }

    let indexes = [...Array(this.zetaGroup.products.length).keys()];
    if (!Exchange.useLedger) {
      await Promise.all(
        indexes.map(async (i) => {
          await this.initializeZetaMarket(
            i,
            marketIndexes,
            marketIndexesAccount
          );
        })
      );
    } else {
      for (var i = 0; i < this.zetaGroup.products.length; i++) {
        await this.initializeZetaMarket(i, marketIndexes, marketIndexesAccount);
      }
    }
  }

  private async initializeZetaMarket(
    i: number,
    marketIndexes: PublicKey,
    marketIndexesAccount: MarketIndexes
  ) {
    console.log(
      `Initializing zeta market ${i + 1}/${this.zetaGroup.products.length}`
    );

    const homedir = os.homedir();
    let dir = `${homedir}/keys/${assetToName(this.asset)}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const requestQueue = utils.getOrCreateKeypair(`${dir}/rq-${i}.json`);
    const eventQueue = utils.getOrCreateKeypair(`${dir}/eq-${i}.json`);
    const bids = utils.getOrCreateKeypair(`${dir}/bids-${i}.json`);
    const asks = utils.getOrCreateKeypair(`${dir}/asks-${i}.json`);

    let [tx, tx2] = await instructions.initializeZetaMarketTxs(
      this.asset,
      i,
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
      const [market, _marketNonce] = await utils.getMarketUninitialized(
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

  /**
   * Will throw if it is not strike initialization time.
   */
  public async initializeMarketStrikes() {
    let tx = new Transaction().add(
      instructions.initializeMarketStrikesIx(this.asset)
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   * Polls the on chain account to update zeta group.
   */
  public async updateZetaGroup() {
    this._zetaGroup = (await Exchange.program.account.zetaGroup.fetch(
      this.zetaGroupAddress
    )) as ZetaGroup;
    this.updateMarginParams();
  }

  /**
   * Update pricing for an expiry index.
   */
  public async updatePricing(expiryIndex: number) {
    let tx = new Transaction().add(
      instructions.updatePricingIx(this.asset, expiryIndex)
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   * Retreat volatility surface and interest rates for an expiry index.
   */
  public async retreatMarketNodes(expiryIndex: number) {
    let tx = new Transaction().add(
      instructions.retreatMarketNodesIx(this.asset, expiryIndex)
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public assertInitialized() {
    if (!this.isInitialized) {
      throw "SubExchange uninitialized";
    }
  }

  private subscribeZetaGroup(
    asset: Asset,
    callback?: (asset: Asset, type: EventType, data: any) => void
  ) {
    let eventEmitter = Exchange.program.account.zetaGroup.subscribe(
      this._zetaGroupAddress,
      Exchange.provider.connection.commitment
    );

    eventEmitter.on("change", async (zetaGroup: ZetaGroup) => {
      let expiry =
        this._zetaGroup !== undefined &&
        this._zetaGroup.frontExpiryIndex !== zetaGroup.frontExpiryIndex;
      this._zetaGroup = zetaGroup;
      if (this._markets !== undefined) {
        this._markets.updateExpirySeries();
      }
      this.updateMarginParams();
      if (callback !== undefined) {
        if (expiry) {
          callback(this.asset, EventType.EXPIRY, null);
        } else {
          callback(this.asset, EventType.EXCHANGE, null);
        }
      }
    });

    this._eventEmitters.push(eventEmitter);
  }

  private subscribeGreeks(
    asset: Asset,
    callback?: (asset: Asset, type: EventType, data: any) => void
  ) {
    if (this._zetaGroup === null) {
      throw Error("Cannot subscribe greeks. ZetaGroup is null.");
    }

    let eventEmitter = Exchange.program.account.greeks.subscribe(
      this._zetaGroup.greeks,
      Exchange.provider.connection.commitment
    );

    eventEmitter.on("change", async (greeks: Greeks) => {
      this._greeks = greeks;
      if (this._isInitialized) {
        Exchange.riskCalculator.updateMarginRequirements(asset);
      }
      if (callback !== undefined) {
        callback(this.asset, EventType.GREEKS, null);
      }
    });

    this._eventEmitters.push(eventEmitter);
  }

  public async handlePolling(
    callback?: (asset: Asset, eventType: EventType, data: any) => void
  ) {
    if (!this._isInitialized) {
      return;
    }
    await this.updateZetaGroup();
    this._markets.updateExpirySeries();
    if (callback !== undefined) {
      callback(this.asset, EventType.EXCHANGE, null);
    }

    await this._markets.handlePolling(callback);
  }

  public async updateSubExchangeState() {
    await this.updateZetaGroup();
    this._markets.updateExpirySeries();
  }

  /**
   * @param index   market index to get mark price.
   */
  public getMarkPrice(index: number): number {
    return utils.convertNativeBNToDecimal(
      this._greeks.markPrices[index],
      constants.PLATFORM_PRECISION
    );
  }

  /**
   * @param user user pubkey to be whitelisted for uncapped deposit
   */
  public async whitelistUserForDeposit(user: PublicKey) {
    let tx = new Transaction().add(
      await instructions.initializeWhitelistDepositAccountIx(
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
      await instructions.initializeWhitelistInsuranceAccountIx(
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
      await instructions.initializeWhitelistTradingFeesAccountIx(
        user,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   *
   * @param movementType move funds from treasury wallet to insurance fund or the opposite
   * @param amount an array of remaining accounts (margin accounts) that will be rebalanced
   */
  public async treasuryMovement(
    treasuryMovementType: types.TreasuryMovementType,
    amount: anchor.BN
  ) {
    let tx = new Transaction().add(
      instructions.treasuryMovementIx(this.asset, treasuryMovementType, amount)
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  /**
   *
   * @param marginAccounts an array of remaining accounts (margin accounts) that will be rebalanced
   */
  public async rebalanceInsuranceVault(marginAccounts: any[]) {
    let txs = [];
    for (
      var i = 0;
      i < marginAccounts.length;
      i += constants.MAX_REBALANCE_ACCOUNTS
    ) {
      let tx = new Transaction();
      let slice = marginAccounts.slice(i, i + constants.MAX_REBALANCE_ACCOUNTS);
      tx.add(instructions.rebalanceInsuranceVaultIx(this.asset, slice));
      txs.push(tx);
    }
    try {
      await Promise.all(
        txs.map(async (tx) => {
          let txSig = await utils.processTransaction(Exchange.provider, tx);
          console.log(`[REBALANCE INSURANCE VAULT]: ${txSig}`);
        })
      );
    } catch (e) {
      console.log(`Error in rebalancing the insurance vault ${e}`);
    }
  }

  public updateMarginParams() {
    if (this.zetaGroup === undefined) {
      return;
    }
    this._marginParams = {
      futureMarginInitial: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.futureMarginInitial,
        constants.MARGIN_PRECISION
      ),
      futureMarginMaintenance: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.futureMarginMaintenance,
        constants.MARGIN_PRECISION
      ),
      optionMarkPercentageLongInitial: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.optionMarkPercentageLongInitial,
        constants.MARGIN_PRECISION
      ),
      optionSpotPercentageLongInitial: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.optionSpotPercentageLongInitial,
        constants.MARGIN_PRECISION
      ),
      optionSpotPercentageShortInitial: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.optionSpotPercentageShortInitial,
        constants.MARGIN_PRECISION
      ),
      optionDynamicPercentageShortInitial: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.optionDynamicPercentageShortInitial,
        constants.MARGIN_PRECISION
      ),
      optionMarkPercentageLongMaintenance: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.optionMarkPercentageLongMaintenance,
        constants.MARGIN_PRECISION
      ),
      optionSpotPercentageLongMaintenance: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.optionSpotPercentageLongMaintenance,
        constants.MARGIN_PRECISION
      ),
      optionSpotPercentageShortMaintenance: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.optionSpotPercentageShortMaintenance,
        constants.MARGIN_PRECISION
      ),
      optionDynamicPercentageShortMaintenance: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.optionDynamicPercentageShortMaintenance,
        constants.MARGIN_PRECISION
      ),
      optionShortPutCapPercentage: utils.convertNativeBNToDecimal(
        this.zetaGroup.marginParameters.optionShortPutCapPercentage,
        constants.MARGIN_PRECISION
      ),
    };
  }

  /**
   * Halt zeta group functionality.
   */

  public assertHalted() {
    if (!this.zetaGroup.haltState.halted) {
      throw "Zeta group not halted.";
    }
  }

  public async haltZetaGroup(zetaGroupAddress: PublicKey) {
    let tx = new Transaction().add(
      instructions.haltZetaGroupIx(
        this.asset,
        zetaGroupAddress,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async unhaltZetaGroup(zetaGroupAddress: PublicKey) {
    let tx = new Transaction().add(
      instructions.unhaltZetaGroupIx(
        zetaGroupAddress,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async updateHaltState(
    zetaGroupAddress: PublicKey,
    args: instructions.UpdateHaltStateArgs
  ) {
    let tx = new Transaction().add(
      instructions.updateHaltStateIx(
        zetaGroupAddress,
        args,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async settlePositionsHalted(marginAccounts: AccountMeta[]) {
    let txs = instructions.settlePositionsHaltedTxs(
      this.asset,
      marginAccounts,
      Exchange.provider.wallet.publicKey
    );

    await Promise.all(
      txs.map(async (tx) => {
        await utils.processTransaction(Exchange.provider, tx);
      })
    );
  }

  public async settleSpreadPositionsHalted(spreadAccounts: AccountMeta[]) {
    let txs = instructions.settleSpreadPositionsHaltedTxs(
      this.asset,
      spreadAccounts,
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
      this._markets.markets.map(async (market) => {
        await market.cancelAllOrdersHalted();
      })
    );
  }

  public async cleanZetaMarketsHalted() {
    this.assertHalted();
    let marketAccounts = await Promise.all(
      this._markets.markets.map(async (market) => {
        return utils.getMutMarketAccounts(this.asset, market.marketIndex);
      })
    );
    await utils.cleanZetaMarketsHalted(this.asset, marketAccounts);
  }

  public async updatePricingHalted(expiryIndex: number) {
    let tx = new Transaction().add(
      instructions.updatePricingHaltedIx(
        this.asset,
        expiryIndex,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async cleanMarketNodes(expiryIndex: number) {
    let tx = new Transaction().add(
      instructions.cleanMarketNodesIx(this.asset, expiryIndex)
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async updateVolatility(args: instructions.UpdateVolatilityArgs) {
    let tx = new Transaction().add(
      instructions.updateVolatilityIx(
        this.asset,
        args,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public async updateInterestRate(args: instructions.UpdateInterestRateArgs) {
    let tx = new Transaction().add(
      instructions.updateInterestRateIx(
        this.asset,
        args,
        Exchange.provider.wallet.publicKey
      )
    );
    await utils.processTransaction(Exchange.provider, tx);
  }

  public getProductGreeks(
    marketIndex: number,
    expiryIndex: number
  ): ProductGreeks {
    let index =
      ((marketIndex - expiryIndex * constants.PRODUCTS_PER_EXPIRY) %
        constants.NUM_STRIKES) +
      expiryIndex * constants.NUM_STRIKES;
    return this._greeks.productGreeks[index];
  }

  /**
   * Close the websockets.
   */
  public async close() {
    this._isInitialized = false;
    this._isSetup = false;

    await Exchange.program.account.zetaGroup.unsubscribe(
      this._zetaGroupAddress
    );
    await Exchange.program.account.greeks.unsubscribe(this._zetaGroup.greeks);
    for (var i = 0; i < this._eventEmitters.length; i++) {
      this._eventEmitters[i].removeListener("change");
    }
    this._eventEmitters = [];
  }
}

import * as anchor from "@project-serum/anchor";
import {
  SYSVAR_RENT_PUBKEY,
  PublicKey,
  SystemProgram,
  Transaction,
  Connection,
  ConfirmOptions,
  SYSVAR_CLOCK_PUBKEY,
  AccountInfo,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as utils from "./utils";
import * as constants from "./constants";
import {
  Greeks,
  ExpirySeries,
  State,
  ZetaGroup,
  MarketIndexes,
} from "./program-types";
import { ZetaGroupMarkets } from "./market";
import { RiskCalculator } from "./risk";
import { EventType } from "./events";
import { Network } from "./network";
import { Oracle, OraclePrice } from "./oracle";
import idl from "./idl/zeta.json";
import { ClockData, MarginParams, DummyWallet, Wallet } from "./types";
import * as instructions from "./program-instructions";
export class Exchange {
  /**
   * Whether the object has been loaded.
   */
  public get isInitialized(): boolean {
    return this._isInitialized;
  }
  private _isInitialized: boolean = false;

  /**
   * The solana network being used.
   */
  public get network(): Network {
    return this._network;
  }
  private _network: Network;

  /**
   * Anchor program instance.
   */
  public get program(): anchor.Program {
    return this._program;
  }
  private _program: anchor.Program;

  public get programId(): PublicKey {
    return this._program.programId;
  }

  /**
   * Anchor provider instance.
   */
  public get provider(): anchor.Provider {
    return this._provider;
  }
  public get connection(): Connection {
    return this._provider.connection;
  }
  private _provider: anchor.Provider;

  /**
   * Account storing zeta state.
   */
  public get state(): State {
    return this._state;
  }
  private _state: State;

  /**
   * Account storing zeta group account info.
   */
  public get zetaGroup(): ZetaGroup {
    return this._zetaGroup;
  }
  private _zetaGroup: ZetaGroup;

  // Program global addresses that will remain constant.

  /**
   * Address of state account.
   */
  public get stateAddress(): PublicKey {
    return this._stateAddress;
  }
  private _stateAddress: PublicKey;

  /**
   * Address of zeta group account.
   */
  public get zetaGroupAddress(): PublicKey {
    return this._zetaGroupAddress;
  }
  private _zetaGroupAddress: PublicKey;

  /**
   * Zeta PDA for serum market authority
   */
  public get serumAuthority(): PublicKey {
    return this._serumAuthority;
  }
  private _serumAuthority: PublicKey;

  /**
   * Zeta PDA for minting serum mints
   */
  public get mintAuthority(): PublicKey {
    return this._mintAuthority;
  }
  private _mintAuthority: PublicKey;

  /**
   * Public key used as the stable coin mint.
   */
  public get usdcMintAddress(): PublicKey {
    return this._usdcMintAddress;
  }
  private _usdcMintAddress: PublicKey;
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
   * Stores the latest timestamp received by websocket subscription
   * to the system clock account.
   */
  public get clockTimestamp(): number {
    return this._clockTimestamp;
  }
  private _clockTimestamp: number;

  /**
   * Stores the latest clock slot from clock subscription.
   */
  public get clockSlot(): number {
    return this._clockSlot;
  }
  private _clockSlot: number;
  /**
   * Websocket subscription id for clock.
   */
  private _clockSubscriptionId: number;

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

  public get marginParams(): MarginParams {
    return this._marginParams;
  }
  private _marginParams: MarginParams;

  /**
   * @param interval   How often to poll zeta group and state in seconds.
   */
  public get pollInterval(): number {
    return this._pollInterval;
  }
  public set pollInterval(interval: number) {
    if (interval < 0) {
      throw Error("Invalid polling interval");
    }
    this._pollInterval = interval;
  }

  private _pollInterval: number = constants.DEFAULT_EXCHANGE_POLL_INTERVAL;
  private _lastPollTimestamp: number;

  /*
   * Oracle object that holds all oracle prices.
   */
  public get oracle(): Oracle {
    return this._oracle;
  }
  private _oracle: Oracle;

  /**
   * Risk calculator that holds all margin requirements.
   */
  public get riskCalculator(): RiskCalculator {
    return this._riskCalculator;
  }
  private _riskCalculator: RiskCalculator;

  public get frontExpirySeries(): ExpirySeries {
    return this._zetaGroup.expirySeries[this._zetaGroup.frontExpiryIndex];
  }

  public get halted(): boolean {
    return this._zetaGroup.haltState.halted;
  }

  private _programSubscriptionIds: number[] = [];

  private init(
    programId: PublicKey,
    network: Network,
    connection: Connection,
    wallet: Wallet,
    opts?: ConfirmOptions
  ) {
    if (exchange.isInitialized) {
      throw "Exchange already initialized";
    }
    this._provider = new anchor.Provider(
      connection,
      wallet,
      opts || utils.commitmentConfig(connection.commitment)
    );
    this._network = network;
    this._program = new anchor.Program(
      idl as anchor.Idl,
      programId,
      this._provider
    );
    this._oracle = new Oracle(this._network, connection);
    this._riskCalculator = new RiskCalculator();
    this._lastPollTimestamp = 0;
  }

  public async initialize(
    programId: PublicKey,
    network: Network,
    connection: Connection,
    wallet: Wallet,
    params: instructions.StateParams,
    opts?: ConfirmOptions
  ) {
    exchange.init(programId, network, connection, wallet, opts);

    const [mintAuthority, mintAuthorityNonce] = await utils.getMintAuthority(
      programId
    );
    const [state, stateNonce] = await utils.getState(programId);
    const [serumAuthority, serumNonce] = await utils.getSerumAuthority(
      programId
    );

    let tx = new Transaction().add(
      instructions.initializeZetaStateIx(
        state,
        stateNonce,
        serumAuthority,
        serumNonce,
        mintAuthority,
        mintAuthorityNonce,
        params
      )
    );
    try {
      await utils.processTransaction(this._provider, tx);
    } catch (e) {
      console.error(`Initialize zeta state failed: ${e}`);
    }

    exchange._stateAddress = state;
    exchange._serumAuthority = serumAuthority;
    exchange._mintAuthority = mintAuthority;
    exchange._usdcMintAddress = constants.USDC_MINT_ADDRESS[network];

    await exchange.updateState();
    console.log(`Initialized zeta state!`);
    console.log(
      `Params:
expiryIntervalSeconds=${params.expiryIntervalSeconds},
newExpiryThresholdSeconds=${params.newExpiryThresholdSeconds},
strikeInitializationThresholdSeconds=${params.strikeInitializationThresholdSeconds}
pricingFrequencySeconds=${params.pricingFrequencySeconds}
insuranceVaultLiquidationPercentage=${params.insuranceVaultLiquidationPercentage}
expirationThresholdSeconds=${params.expirationThresholdSeconds}`
    );
  }

  /**
   * Loads a fresh instance of the exchange object using on chain state.
   * @param throttle    Whether to sleep on market loading for rate limit reasons.
   */
  public async load(
    programId: PublicKey,
    network: Network,
    connection: Connection,
    opts: ConfirmOptions,
    wallet = new DummyWallet(),
    throttleMs = 0,
    callback?: (event: EventType, data: any) => void
  ) {
    console.info(`Loading exchange.`);

    if (exchange.isInitialized) {
      throw "Exchange already loaded.";
    }

    exchange.init(programId, network, connection, wallet, opts);

    // Load variables from state.
    const [mintAuthority, _mintAuthorityNonce] = await utils.getMintAuthority(
      programId
    );
    const [state, _stateNonce] = await utils.getState(programId);
    const [serumAuthority, _serumNonce] = await utils.getSerumAuthority(
      programId
    );

    exchange._mintAuthority = mintAuthority;
    exchange._stateAddress = state;
    exchange._serumAuthority = serumAuthority;

    // Load zeta group.
    // TODO: Use constants since we only have 1 underlying for now.
    const [underlying, _underlyingNonce] = await utils.getUnderlying(
      programId,
      0
    );

    let underlyingAccount: any =
      await exchange._program.account.underlying.fetch(underlying);

    const [zetaGroup, _zetaGroupNonce] = await utils.getZetaGroup(
      programId,
      underlyingAccount.mint
    );

    exchange._zetaGroupAddress = zetaGroup;

    await exchange.subscribeOracle(callback);
    await exchange.updateState();
    await exchange.updateZetaGroup();

    const [vaultAddress, _vaultNonce] = await utils.getVault(
      exchange.programId,
      zetaGroup
    );

    const [insuranceVaultAddress, _insuranceNonce] =
      await utils.getZetaInsuranceVault(
        exchange.programId,
        exchange.zetaGroupAddress
      );

    const [socializedLossAccount, _socializedLossAccountNonce] =
      await utils.getSocializedLossAccount(
        exchange.programId,
        exchange._zetaGroupAddress
      );

    exchange._vaultAddress = vaultAddress;
    exchange._insuranceVaultAddress = insuranceVaultAddress;
    exchange._socializedLossAccountAddress = socializedLossAccount;
    exchange._usdcMintAddress = constants.USDC_MINT_ADDRESS[network];

    if (
      exchange.zetaGroup.products[
        exchange.zetaGroup.products.length - 1
      ].market.equals(PublicKey.default)
    ) {
      throw "Zeta group markets are uninitialized!";
    }

    let [greeks, _greeksNonce] = await utils.getGreeks(
      exchange.programId,
      exchange.zetaGroupAddress
    );

    exchange._greeksAddress = greeks;
    exchange._markets = await ZetaGroupMarkets.load(opts, throttleMs);
    exchange._greeks = (await exchange.program.account.greeks.fetch(
      greeks
    )) as Greeks;
    exchange._riskCalculator.updateMarginRequirements();

    // Set callbacks.
    exchange.subscribeZetaGroup(callback);
    exchange.subscribeGreeks(callback);

    await exchange.subscribeClock(callback);

    exchange._isInitialized = true;

    console.log(
      `Exchange loaded @ ${new Date(exchange.clockTimestamp * 1000)}`
    );
  }

  /**
   * Initializes the market nodes for a zeta group.
   */
  public async initializeMarketNodes(zetaGroup: PublicKey) {
    let indexes = [...Array(constants.ACTIVE_MARKETS).keys()];
    await Promise.all(
      indexes.map(async (index: number) => {
        let tx = new Transaction().add(
          await instructions.initializeMarketNodeIx(index)
        );
        await utils.processTransaction(this._provider, tx);
      })
    );
  }

  /**
   * Initializes a zeta group
   */
  public async initializeZetaGroup(
    oracle: PublicKey,
    pricingArgs: instructions.InitializeZetaGroupPricingArgs,
    marginArgs: instructions.UpdateMarginParametersArgs,
    callback?: (type: EventType, data: any) => void
  ) {
    // TODO fix to be dynamic once we support more than 1 underlying.
    // TODO if deployment breaks midway, this won't necessarily represent the index you want to initialize.
    // let underlyingIndex = this.state.numUnderlyings;
    let underlyingMint = constants.UNDERLYINGS[0];

    const [zetaGroup, _zetaGroupNonce] = await utils.getZetaGroup(
      this.program.programId,
      underlyingMint
    );
    this._zetaGroupAddress = zetaGroup;

    let [greeks, _greeksNonce] = await utils.getGreeks(
      this.programId,
      this._zetaGroupAddress
    );
    this._greeksAddress = greeks;

    const [vaultAddress, _vaultNonce] = await utils.getVault(
      exchange.programId,
      zetaGroup
    );
    this._vaultAddress = vaultAddress;

    const [insuranceVaultAddress, _insuranceNonce] =
      await utils.getZetaInsuranceVault(
        exchange.programId,
        exchange.zetaGroupAddress
      );
    this._insuranceVaultAddress = insuranceVaultAddress;

    const [socializedLossAccount, _socializedLossAccountNonce] =
      await utils.getSocializedLossAccount(
        exchange.programId,
        exchange._zetaGroupAddress
      );
    this._socializedLossAccountAddress = socializedLossAccount;

    let tx = new Transaction().add(
      await instructions.initializeZetaGroupIx(
        underlyingMint,
        oracle,
        pricingArgs,
        marginArgs
      )
    );
    try {
      await utils.processTransaction(this._provider, tx);
    } catch (e) {
      console.error(`Initialize zeta group failed: ${e}`);
    }

    await this.updateZetaGroup();
    await this.updateState();

    this._greeks = (await exchange.program.account.greeks.fetch(
      greeks
    )) as Greeks;

    this.subscribeZetaGroup(callback);
    this.subscribeClock(callback);
    this.subscribeGreeks(callback);
    await this.subscribeOracle(callback);
  }

  /**
   * Update the expiry state variables for the program.
   */
  public async updateZetaState(params: instructions.StateParams) {
    let tx = new Transaction().add(
      instructions.updateZetaStateIx(params, this._provider.wallet.publicKey)
    );
    await utils.processTransaction(this._provider, tx);
    await this.updateState();
  }

  /**
   * Update the pricing parameters for a zeta group.
   */
  public async updatePricingParameters(
    args: instructions.UpdatePricingParametersArgs
  ) {
    let tx = new Transaction().add(
      instructions.updatePricingParametersIx(
        args,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
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
        args,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
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
        nodes,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
  }

  /**
   * Initializes the zeta markets for a zeta group.
   */
  public async initializeZetaMarkets() {
    // Initialize market indexes.
    let [marketIndexes, marketIndexesNonce] = await utils.getMarketIndexes(
      this.programId,
      this._zetaGroupAddress
    );

    console.log("Initializing market indexes.");

    let tx = new Transaction().add(
      instructions.initializeMarketIndexesIx(marketIndexes, marketIndexesNonce)
    );
    try {
      await utils.processTransaction(this._provider, tx);
    } catch (e) {
      console.error(`Initialize market indexes failed: ${e}`);
    }

    // We initialize 50 indexes at a time in the program.
    let tx2 = new Transaction().add(
      instructions.addMarketIndexesIx(marketIndexes)
    );

    for (
      var i = 0;
      i < constants.TOTAL_MARKETS;
      i += constants.MARKET_INDEX_LIMIT
    ) {
      try {
        await utils.processTransaction(this._provider, tx2);
      } catch (e) {
        console.error(`Add market indexes failed: ${e}`);
      }
    }

    let marketIndexesAccount = (await this._program.account.marketIndexes.fetch(
      marketIndexes
    )) as MarketIndexes;

    if (!marketIndexesAccount.initialized) {
      throw Error("Market indexes are not initialized!");
    }

    let indexes = [...Array(this.zetaGroup.products.length).keys()];
    await Promise.all(
      indexes.map(async (i) => {
        console.log(
          `Initializing zeta market ${i + 1}/${this.zetaGroup.products.length}`
        );

        const requestQueue = anchor.web3.Keypair.generate();
        const eventQueue = anchor.web3.Keypair.generate();
        const bids = anchor.web3.Keypair.generate();
        const asks = anchor.web3.Keypair.generate();

        // Store the keypairs locally.
        utils.writeKeypair(`keys/rq-${i}.json`, requestQueue);
        utils.writeKeypair(`keys/eq-${i}.json`, eventQueue);
        utils.writeKeypair(`keys/bids-${i}.json`, bids);
        utils.writeKeypair(`keys/asks-${i}.json`, asks);

        let [tx, tx2] = await instructions.initializeZetaMarketTxs(
          i,
          marketIndexesAccount.indexes[i],
          requestQueue.publicKey,
          eventQueue.publicKey,
          bids.publicKey,
          asks.publicKey,
          marketIndexes
        );

        let initialized = false;
        if (this.network != Network.LOCALNET) {
          // Validate that the market hasn't already been initialized
          // So no sol is wasted on unnecessary accounts.
          const [market, _marketNonce] = await utils.getMarketUninitialized(
            this.programId,
            this._zetaGroupAddress,
            marketIndexesAccount.indexes[i]
          );

          let info = await this.provider.connection.getAccountInfo(market);
          if (info !== null) {
            initialized = true;
          }
        }

        if (initialized) {
          console.log(`Market ${i} already initialized. Skipping...`);
        } else {
          try {
            await this.provider.send(tx, [
              requestQueue,
              eventQueue,
              bids,
              asks,
            ]);
            await this.provider.send(tx2);
          } catch (e) {
            console.error(`Initialize zeta market ${i} failed: ${e}`);
          }
        }
      })
    );

    console.log("Market initialization complete!");
    await this.updateZetaGroup();

    this._markets = await ZetaGroupMarkets.load(utils.defaultCommitment(), 0);
    this._isInitialized = true;
  }

  /**
   * Will throw if it is not strike initialization time.
   */
  public async initializeMarketStrikes() {
    let tx = new Transaction().add(instructions.initializeMarketStrikesIx());
    await utils.processTransaction(this._provider, tx);
  }

  /**
   * Polls the on chain account to update state.
   */
  public async updateState() {
    this._state = (await this.program.account.state.fetch(
      this.stateAddress
    )) as State;
  }

  /**
   * Polls the on chain account to update zeta group.
   */
  public async updateZetaGroup() {
    this._zetaGroup = (await this.program.account.zetaGroup.fetch(
      this.zetaGroupAddress
    )) as ZetaGroup;
    this.updateMarginParams();
  }

  /**
   * Update pricing for an expiry index.
   */
  public async updatePricing(expiryIndex: number) {
    let tx = new Transaction().add(instructions.updatePricingIx(expiryIndex));
    await utils.processTransaction(this._provider, tx);
  }

  /**
   * Retreat volatility surface and interest rates for an expiry index.
   */
  public async retreatMarketNodes(expiryIndex: number) {
    let tx = new Transaction().add(
      instructions.retreatMarketNodesIx(expiryIndex)
    );
    await utils.processTransaction(this._provider, tx);
  }

  public assertInitialized() {
    if (!this.isInitialized) {
      throw "Exchange uninitialized";
    }
  }

  private subscribeZetaGroup(callback?: (type: EventType, data: any) => void) {
    let eventEmitter = this._program.account.zetaGroup.subscribe(
      this._zetaGroupAddress,
      this._provider.connection.commitment
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
          callback(EventType.EXPIRY, null);
        } else {
          callback(EventType.EXCHANGE, null);
        }
      }
    });

    this._eventEmitters.push(eventEmitter);
  }

  private setClockData(data: ClockData) {
    this._clockTimestamp = data.timestamp;
    this._clockSlot = data.slot;
  }

  private async subscribeClock(
    callback?: (type: EventType, data: any) => void
  ) {
    if (this._clockSubscriptionId !== undefined) {
      throw Error("Clock already subscribed to.");
    }
    this._clockSubscriptionId = this._provider.connection.onAccountChange(
      SYSVAR_CLOCK_PUBKEY,
      async (accountInfo: AccountInfo<Buffer>, _context: any) => {
        this.setClockData(utils.getClockData(accountInfo));
        if (callback !== undefined) {
          callback(EventType.CLOCK, null);
        }
        try {
          await this.handlePolling(callback);
        } catch (e) {
          console.log(`Exchange polling failed. Error: ${e}`);
        }
      },
      this._provider.connection.commitment
    );
    let accountInfo = await this._provider.connection.getAccountInfo(
      SYSVAR_CLOCK_PUBKEY
    );
    this.setClockData(utils.getClockData(accountInfo));
  }

  private subscribeGreeks(callback?: (type: EventType, data: any) => void) {
    if (this._zetaGroup === null) {
      throw Error("Cannot subscribe greeks. ZetaGroup is null.");
    }

    let eventEmitter = this._program.account.greeks.subscribe(
      this._zetaGroup.greeks,
      this._provider.connection.commitment
    );

    eventEmitter.on("change", async (greeks: Greeks) => {
      this._greeks = greeks;
      if (callback !== undefined) {
        callback(EventType.GREEKS, null);
      }
      this._riskCalculator.updateMarginRequirements();
    });

    this._eventEmitters.push(eventEmitter);
  }

  private async subscribeOracle(
    callback?: (type: EventType, data: any) => void
  ) {
    await this._oracle.subscribePriceFeeds((price: OraclePrice) => {
      if (callback !== undefined) {
        callback(EventType.ORACLE, price);
      }
      if (this._isInitialized) {
        this._riskCalculator.updateMarginRequirements();
      }
    });
  }

  private async handlePolling(
    callback?: (eventType: EventType, data: any) => void
  ) {
    if (!this._isInitialized) {
      return;
    }
    if (this._clockTimestamp > this._lastPollTimestamp + this._pollInterval) {
      this._lastPollTimestamp = this._clockTimestamp;
      await this.updateState();
      await this.updateZetaGroup();
      this._markets.updateExpirySeries();
      if (callback !== undefined) {
        callback(EventType.EXCHANGE, null);
      }
    }
    await this._markets.handlePolling(callback);
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
        user,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
  }

  /**
   * @param user user pubkey to be whitelisted for our insurance vault
   */
  public async whitelistUserForInsuranceVault(user: PublicKey) {
    let tx = new Transaction().add(
      await instructions.initializeWhitelistInsuranceAccountIx(
        user,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
  }

  /**
   * @param user user pubkey to be whitelisted for trading fees
   */
  public async whitelistUserForTradingFees(user: PublicKey) {
    let tx = new Transaction().add(
      await instructions.initializeWhitelistTradingFeesAccountIx(
        user,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
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
      tx.add(instructions.rebalanceInsuranceVaultIx(slice));
      txs.push(tx);
    }
    try {
      await Promise.all(
        txs.map(async (tx) => {
          let txSig = await utils.processTransaction(this._provider, tx);
          console.log(`[REBALANCE INSURANCE VAULT]: ${txSig}`);
        })
      );
    } catch (e) {
      console.log(`Error in rebalancing the insurance vault ${e}`);
    }
  }

  /**
   * Helper function to get the deposit limits
   */
  public async getDepositLimit() {
    return utils.convertNativeBNToDecimal(this.state.nativeDepositLimit);
  }

  public addProgramSubscriptionId(id: number) {
    this._programSubscriptionIds.push(id);
  }

  /**
   * Close the websockets.
   */
  public async close() {
    await this._program.account.zetaGroup.unsubscribe(this._zetaGroupAddress);
    await this._program.account.greeks.unsubscribe(this._zetaGroup.greeks);
    for (var i = 0; i < this._eventEmitters.length; i++) {
      this._eventEmitters[i].removeListener("change");
    }
    this._eventEmitters = [];
    if (this._clockSubscriptionId !== undefined) {
      await this.connection.removeAccountChangeListener(
        this._clockSubscriptionId
      );
      this._clockSubscriptionId = undefined;
    }
    await this._oracle.close();
    for (var i = 0; i < this._programSubscriptionIds.length; i++) {
      await this.connection.removeProgramAccountChangeListener(
        this._programSubscriptionIds[i]
      );
    }
    this._programSubscriptionIds = [];
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
        zetaGroupAddress,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
  }

  public async unhaltZetaGroup(zetaGroupAddress: PublicKey) {
    let tx = new Transaction().add(
      instructions.unhaltZetaGroupIx(
        zetaGroupAddress,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
  }

  public async updateHaltState(
    zetaGroupAddress: PublicKey,
    args: instructions.UpdateHaltStateArgs
  ) {
    let tx = new Transaction().add(
      instructions.updateHaltStateIx(
        zetaGroupAddress,
        args,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
  }

  public async settlePositionsHalted(marginAccounts: any[]) {
    let txs = instructions.settlePositionsHaltedTxs(
      marginAccounts,
      this._provider.wallet.publicKey
    );

    await Promise.all(
      txs.map(async (tx) => {
        await utils.processTransaction(this._provider, tx);
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
        return utils.getMutMarketAccounts(market.marketIndex);
      })
    );
    await utils.cleanZetaMarketsHalted(marketAccounts);
  }

  public async updatePricingHalted(expiryIndex: number) {
    let tx = new Transaction().add(
      instructions.updatePricingHaltedIx(
        expiryIndex,
        this._provider.wallet.publicKey
      )
    );
    await utils.processTransaction(this._provider, tx);
  }

  public async cleanMarketNodes(expiryIndex: number) {
    let tx = new Transaction().add(
      instructions.cleanMarketNodesIx(expiryIndex)
    );
    await utils.processTransaction(this._provider, tx);
  }

  public async updateVolatility(args: instructions.UpdateVolatilityArgs) {
    let tx = new Transaction().add(
      instructions.updateVolatilityIx(args, this._provider.wallet.publicKey)
    );
    await utils.processTransaction(this._provider, tx);
  }

  public async updateInterestRate(args: instructions.UpdateInterestRateArgs) {
    let tx = new Transaction().add(
      instructions.updateInterestRateIx(args, this._provider.wallet.publicKey)
    );
    await utils.processTransaction(this._provider, tx);
  }
}

// Exchange singleton.
export const exchange = new Exchange();

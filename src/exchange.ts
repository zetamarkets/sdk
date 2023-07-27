import * as anchor from "@zetamarkets/anchor";
import {
  PublicKey,
  Transaction,
  Connection,
  ConfirmOptions,
  SYSVAR_CLOCK_PUBKEY,
  AccountInfo,
  AccountMeta,
  Commitment,
} from "@solana/web3.js";
import * as utils from "./utils";
import * as constants from "./constants";
import * as assets from "./assets";
import { PerpSyncQueue, ProductGreeks, State, Pricing } from "./program-types";
import { ExpirySeries, Market, ZetaGroupMarkets } from "./market";
import { RiskCalculator } from "./risk";
import { EventType } from "./events";
import { Network } from "./network";
import { Oracle, OraclePrice } from "./oracle";
import idl from "./idl/zeta.json";
import { Zeta } from "./types/zeta";
import * as types from "./types";
import { assetToIndex, toProgramAsset } from "./assets";
import { Asset } from "./constants";
import { SubExchange } from "./subexchange";
import * as instructions from "./program-instructions";
import { Orderbook } from "./serum/market";
import fetch from "cross-fetch";

export class Exchange {
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
   * Account storing zeta state.
   */
  public get state(): State {
    return this._state;
  }
  private _state: State;

  /**
   * Account storing zeta pricing.
   */
  public get pricing(): Pricing {
    return this._pricing;
  }
  private _pricing: Pricing;

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
  public get program(): anchor.Program<Zeta> {
    return this._program;
  }
  private _program: anchor.Program<Zeta>;

  public get programId(): PublicKey {
    return this._program.programId;
  }

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
   * Public key used as the stable coin mint.
   */
  public get usdcMintAddress(): PublicKey {
    return this._usdcMintAddress;
  }
  private _usdcMintAddress: PublicKey;

  /**
   * ConfirmOptions, stored so we don't need it again when making a SerumMarket.
   */
  public get opts(): ConfirmOptions {
    return this._opts;
  }
  private _opts: ConfirmOptions;

  /*
   * One SubExchange per underlying.
   */
  public get subExchanges(): Map<Asset, SubExchange> {
    return this._subExchanges;
  }
  private _subExchanges: Map<Asset, SubExchange> = new Map();

  /**
   * The assets being used
   */
  public get assets(): Asset[] {
    return this._assets;
  }
  private _assets: Asset[];

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
   * Address of state account.
   */
  public get stateAddress(): PublicKey {
    return this._stateAddress;
  }
  private _stateAddress: PublicKey;

  /**
   * Address of zeta pricing account.
   */
  public get pricingAddress(): PublicKey {
    return this._pricingAddress;
  }
  private _pricingAddress: PublicKey;

  /**
   * Public key for treasury wallet.
   */
  public get treasuryWalletAddress(): PublicKey {
    return this._treasuryWalletAddress;
  }
  private _treasuryWalletAddress: PublicKey;

  /**
   * Public key for referral rewards wallet.
   */
  public get referralsRewardsWalletAddress(): PublicKey {
    return this._referralsRewardsWalletAddress;
  }
  private _referralsRewardsWalletAddress: PublicKey;

  /**
   * Public key for combined insurance fund.
   */
  public get combinedInsuranceVaultAddress(): PublicKey {
    return this._combinedInsuranceVaultAddress;
  }
  private _combinedInsuranceVaultAddress: PublicKey;

  /**
   * Public key for combined deposit vault.
   */
  public get combinedVaultAddress(): PublicKey {
    return this._combinedVaultAddress;
  }
  private _combinedVaultAddress: PublicKey;

  /**
   * Public key for combined socialized loss account.
   */
  public get combinedSocializedLossAccountAddress(): PublicKey {
    return this._combinedSocializedLossAccountAddress;
  }
  private _combinedSocializedLossAccountAddress: PublicKey;

  /**
   * Stores the latest timestamp received by websocket subscription
   * to the system clock account.
   */
  public get clockTimestamp(): number {
    return this._clockTimestamp;
  }
  private _clockTimestamp: number = undefined;

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

  public get ledgerWallet(): any {
    return this._ledgerWallet;
  }
  private _ledgerWallet: any;

  public get useLedger(): boolean {
    return this._useLedger;
  }

  public setLedgerWallet(wallet: any) {
    this._useLedger = true;
    this._ledgerWallet = wallet;
  }

  // Handy map to grab zetagroup asset by pubkey without an RPC fetch
  // or having to manually filter all zetaGroups
  public zetaGroupPubkeyToAsset(key: PublicKey): Asset {
    return this._zetaGroupPubkeyToAsset.get(key);
  }
  private _zetaGroupPubkeyToAsset: Map<PublicKey, Asset> = new Map();

  private _useLedger: boolean = false;

  private _programSubscriptionIds: number[] = [];

  private _eventEmitters: any[] = [];

  // Micro lamports per CU of fees.
  public get priorityFee(): number {
    return this._priorityFee;
  }
  private _priorityFee: number = 0;

  public get useAutoPriorityFee(): boolean {
    return this._useAutoPriorityFee;
  }
  private _useAutoPriorityFee: boolean = false;

  // Micro lamports per CU of fees.
  public get autoPriorityFeeUpperLimit(): number {
    return this._autoPriorityFeeUpperLimit;
  }
  private _autoPriorityFeeUpperLimit: number =
    constants.DEFAULT_MICRO_LAMPORTS_PER_CU_FEE;

  public get blockhashCommitment(): Commitment {
    return this._blockhashCommitment;
  }
  private _blockhashCommitment: Commitment = "finalized";

  public toggleAutoPriorityFee() {
    this._useAutoPriorityFee = !this._useAutoPriorityFee;
  }

  public updatePriorityFee(microLamportsPerCU: number) {
    this._priorityFee = microLamportsPerCU;
  }

  public updateAutoPriorityFeeUpperLimit(microLamportsPerCU: number) {
    this._autoPriorityFeeUpperLimit = microLamportsPerCU;
  }

  public updateBlockhashCommitment(commitment: Commitment) {
    this._blockhashCommitment = commitment;
  }

  public initialize(
    loadConfig: types.LoadExchangeConfig,
    wallet = new types.DummyWallet()
  ) {
    if (this.isSetup) {
      throw "Exchange already setup";
    }
    this._assets = assets.allAssets();
    this._provider = new anchor.AnchorProvider(
      loadConfig.connection,
      wallet instanceof types.DummyWallet ? null : wallet,
      loadConfig.opts ||
        utils.commitmentConfig(loadConfig.connection.commitment)
    );
    this._opts = loadConfig.opts;
    this._network = loadConfig.network;
    this._program = new anchor.Program(
      idl as anchor.Idl,
      constants.ZETA_PID[loadConfig.network],
      this._provider
    ) as anchor.Program<Zeta>;

    for (var asset of assets.allAssets()) {
      this.addSubExchange(asset, new SubExchange());
      this.getSubExchange(asset).initialize(asset);
    }

    this._combinedVaultAddress = utils.getCombinedVault(this.programId)[0];
    this._combinedInsuranceVaultAddress = utils.getZetaCombinedInsuranceVault(
      this.programId
    )[0];
    this._combinedSocializedLossAccountAddress =
      utils.getCombinedSocializedLossAccount(this.programId)[0];

    this._isSetup = true;
  }

  public async initializeCombinedInsuranceVault() {
    let tx = new Transaction().add(
      instructions.initializeCombinedInsuranceVaultIx()
    );
    try {
      await utils.processTransaction(this._provider, tx);
    } catch (e) {
      console.error(`initializeCombinedInsuranceVault failed: ${e}`);
    }

    let [insuranceVault, _insuranceVaultNonce] =
      utils.getZetaCombinedInsuranceVault(this.programId);
    this._combinedInsuranceVaultAddress = insuranceVault;
  }

  public async initializeCombinedVault() {
    let tx = new Transaction().add(instructions.initializeCombinedVaultIx());
    try {
      await utils.processTransaction(this._provider, tx);
    } catch (e) {
      console.error(`initializeCombinedVault failed: ${e}`);
    }

    let [vault, _vaultNonce] = utils.getCombinedVault(this.programId);
    this._combinedVaultAddress = vault;
  }

  public async initializeCombinedSocializedLossAccount() {
    let tx = new Transaction().add(
      instructions.initializeCombinedSocializedLossAccountIx()
    );
    try {
      await utils.processTransaction(this._provider, tx);
    } catch (e) {
      console.error(`initializeCombinedSocializedLossAccount failed: ${e}`);
    }

    let [account, _accountNonce] = utils.getCombinedSocializedLossAccount(
      this.programId
    );
    this._combinedSocializedLossAccountAddress = account;
  }

  public async initializeZetaState(
    params: instructions.StateParams,
    referralAdmin: PublicKey,
    secondaryAdmin: PublicKey
  ) {
    const [mintAuthority, mintAuthorityNonce] = utils.getMintAuthority(
      this.programId
    );
    const [state, stateNonce] = utils.getState(this.programId);
    const [pricing, _pricingNonce] = utils.getPricing(this.programId);
    const [serumAuthority, serumNonce] = utils.getSerumAuthority(
      this.programId
    );

    this._usdcMintAddress = constants.USDC_MINT_ADDRESS[this.network];

    const [treasuryWallet, _treasuryWalletNonce] = utils.getZetaTreasuryWallet(
      this.programId,
      this._usdcMintAddress
    );

    const [referralRewardsWallet, _referralRewardsWalletNonce] =
      utils.getZetaReferralsRewardsWallet(
        this.programId,
        this._usdcMintAddress
      );

    let tx = new Transaction().add(
      instructions.initializeZetaStateIx(
        state,
        stateNonce,
        serumAuthority,
        treasuryWallet,
        referralAdmin,
        referralRewardsWallet,
        serumNonce,
        mintAuthority,
        mintAuthorityNonce,
        params,
        secondaryAdmin
      )
    );
    try {
      await utils.processTransaction(this._provider, tx);
    } catch (e) {
      console.error(`Initialize zeta state failed: ${e}`);
    }

    this._mintAuthority = mintAuthority;
    this._stateAddress = state;
    this._pricingAddress = pricing;
    this._serumAuthority = serumAuthority;
    this._treasuryWalletAddress = treasuryWallet;
    this._referralsRewardsWalletAddress = referralRewardsWallet;
    await this.updateState();
  }

  public async initializeZetaPricing(
    perpArgs: instructions.UpdatePerpParametersArgs,
    marginArgs: instructions.UpdateMarginParametersArgs
  ) {
    let tx = new Transaction().add(
      instructions.initializeZetaPricingIx(perpArgs, marginArgs)
    );
    try {
      await utils.processTransaction(
        this._provider,
        tx,
        [],
        utils.defaultCommitment(),
        this.useLedger
      );
    } catch (e) {
      console.error(`Initialize zeta pricing failed: ${e}`);
      console.log(e);
    }

    await this.updateZetaPricing();
  }

  public async initializeZetaGroup(
    asset: Asset,
    oracle: PublicKey,
    oracleBackupFeed: PublicKey,
    oracleBackupProgram: PublicKey,
    pricingArgs: instructions.InitializeZetaGroupPricingArgs,
    perpArgs: instructions.UpdatePerpParametersArgs,
    marginArgs: instructions.UpdateMarginParametersArgs,
    expiryArgs: instructions.UpdateZetaGroupExpiryArgs,
    perpsOnly: boolean = false,
    flexUnderlying: boolean = false
  ) {
    let underlyingMint = utils.getUnderlyingMint(asset);
    let tx = new Transaction().add(
      instructions.initializeZetaGroupIx(
        asset,
        underlyingMint,
        oracle,
        oracleBackupFeed,
        oracleBackupProgram,
        pricingArgs,
        perpArgs,
        marginArgs,
        expiryArgs,
        perpsOnly,
        flexUnderlying
      )
    );
    try {
      await utils.processTransaction(
        this._provider,
        tx,
        [],
        utils.defaultCommitment(),
        this.useLedger
      );
    } catch (e) {
      console.error(`Initialize zeta group failed: ${e}`);
      console.log(e);
    }

    await this.updateState();

    if (this.getSubExchange(asset) == undefined) {
      await this.addSubExchange(asset, new SubExchange());
      await this.getSubExchange(asset).initialize(asset);
    }

    await this.updateZetaPricing();
  }

  public async load(
    loadConfig: types.LoadExchangeConfig,
    wallet = new types.DummyWallet(),
    callback?: (asset: Asset, event: EventType, data: any) => void
  ) {
    if (this.isInitialized) {
      throw "Exchange already loaded";
    }

    if (loadConfig.network == Network.LOCALNET && loadConfig.loadFromStore) {
      throw Error("Cannot load localnet from store");
    }

    if (!this.isSetup) {
      this.initialize(loadConfig, wallet);
    }

    this._riskCalculator = new RiskCalculator(this.assets);

    // Load variables from state.
    this._mintAuthority = utils.getMintAuthority(this.programId)[0];
    this._stateAddress = utils.getState(this.programId)[0];
    this._pricingAddress = utils.getPricing(this.programId)[0];
    this._serumAuthority = utils.getSerumAuthority(this.programId)[0];
    this._usdcMintAddress = constants.USDC_MINT_ADDRESS[loadConfig.network];
    this._treasuryWalletAddress = utils.getZetaTreasuryWallet(
      this.programId,
      this._usdcMintAddress
    )[0];
    this._referralsRewardsWalletAddress = utils.getZetaReferralsRewardsWallet(
      this.programId,
      this._usdcMintAddress
    )[0];

    this._lastPollTimestamp = 0;
    await this.updateZetaPricing();
    this._oracle = new Oracle(this.network, this.connection);

    const subExchangeToFetchAddrs: PublicKey[] = this.assets
      .map((a) => {
        const se = this.getSubExchange(a);
        return [se.perpSyncQueueAddress];
      })
      .flat()
      .concat([SYSVAR_CLOCK_PUBKEY]);

    const accFetchPromises: Promise<any>[] = subExchangeToFetchAddrs.map(
      (addr) => {
        return this.provider.connection.getAccountInfo(addr);
      }
    );
    const allPromises: Promise<any>[] = accFetchPromises.concat([
      this.subscribeOracle(this.assets, callback),
    ]);

    const accFetches = (await Promise.all(allPromises)).slice(
      0,
      assets.allAssets().length + 1
    );

    let perpSyncQueueAccs: PerpSyncQueue[] = [];
    for (let i = 0; i < accFetches.length - 1; i++) {
      perpSyncQueueAccs.push(
        this.program.account.perpSyncQueue.coder.accounts.decode(
          types.ProgramAccountType.PerpSyncQueue,
          accFetches[i].data
        ) as PerpSyncQueue
      );
    }

    const clockData = utils.getClockData(accFetches.at(-1));
    this.subscribeClock(clockData, callback);
    this.subscribePricing(callback);

    await Promise.all(
      this.assets.map(async (asset, i) => {
        return this.getSubExchange(asset).load(
          asset,
          this.opts,
          [perpSyncQueueAccs[i]],
          loadConfig.loadFromStore,
          loadConfig.throttleMs,
          callback
        );
      })
    );

    for (var se of this.getAllSubExchanges()) {
      this._zetaGroupPubkeyToAsset.set(se.zetaGroupAddress, se.asset);
    }

    await this.updateExchangeState();

    this._isInitialized = true;
  }

  private addSubExchange(asset: Asset, subExchange: SubExchange) {
    this._subExchanges.set(asset, subExchange);
  }

  public getSubExchange(asset: Asset): SubExchange {
    try {
      return this._subExchanges.get(asset);
    } catch (_e) {
      throw Error(
        `Failed to get subExchange for asset=${asset}, have you called Exchange.load()?`
      );
    }
  }

  public getAllSubExchanges(): SubExchange[] {
    return [...this._subExchanges.values()];
  }

  private async updateAutoFee() {
    let accountList = [];

    // Query the most written-to accounts
    // Note: getRecentPrioritizationFees() will account for global fees too if no one is writing to our accs
    for (var asset of this.assets) {
      let sub = this.getSubExchange(asset);
      accountList.push(sub.perpSyncQueueAddress.toString());
      accountList.push(sub.greeksAddress.toString());
    }

    try {
      let data = await fetch(this.provider.connection.rpcEndpoint, {
        method: "post",
        body: `{"jsonrpc":"2.0", "id":1, "method":"getRecentPrioritizationFees", "params":[["${accountList.join(
          `","`
        )}"]]}`,
        headers: { "Content-Type": "application/json" },
      });

      let fees = (await data.json()).result
        .sort((a, b) => b.slot - a.slot) // Sort descending
        .slice(0, 20) // Grab the latest 20
        .map((obj) => obj.prioritizationFee); // Take a list of prioritizationFee values only

      let median = utils.median(fees);
      this._priorityFee = Math.min(median, this._autoPriorityFeeUpperLimit);
      console.log(
        `AutoUpdate priority fee. New fee = ${this._priorityFee} microlamports per compute unit`
      );
    } catch (e) {
      console.log(`updateAutoFee failed ${e}`);
    }
  }

  private async subscribeOracle(
    assets: Asset[],
    callback?: (asset: Asset, type: EventType, data: any) => void
  ) {
    return this._oracle.subscribePriceFeeds(
      assets,
      (asset: Asset, price: OraclePrice) => {
        if (this.isInitialized) {
          this._riskCalculator.updateMarginRequirements(asset);
        }
        if (callback !== undefined) {
          callback(asset, EventType.ORACLE, price);
        }
      }
    );
  }

  private setClockData(data: types.ClockData) {
    this._clockTimestamp = data.timestamp;
    this._clockSlot = data.slot;
  }

  private subscribeClock(
    clockData: types.ClockData,
    callback?: (asset: Asset, type: EventType, data: any) => void
  ) {
    if (this._clockSubscriptionId !== undefined) {
      throw Error("Clock already subscribed to.");
    }
    this._clockSubscriptionId = this.provider.connection.onAccountChange(
      SYSVAR_CLOCK_PUBKEY,
      async (accountInfo: AccountInfo<Buffer>, _context: any) => {
        this.setClockData(utils.getClockData(accountInfo));

        await Promise.all(
          this._assets.map((a) => {
            return this.updatePerpSerumMarketIfNeeded(a, 0);
          })
        );

        if (callback !== undefined) {
          callback(null, EventType.CLOCK, null);
        }
        try {
          if (
            this._clockTimestamp >
              this._lastPollTimestamp + this._pollInterval &&
            this.isInitialized
          ) {
            this._lastPollTimestamp = this._clockTimestamp;
            await Promise.all(
              this.getAllSubExchanges().map(async (subExchange) => {
                await subExchange.handlePolling(callback);
              })
            );
            if (this._useAutoPriorityFee == true) {
              await this.updateAutoFee();
            }
          }
        } catch (e) {
          console.log(`SubExchange polling failed. Error: ${e}`);
        }
      },
      this.provider.connection.commitment
    );
    this.setClockData(clockData);
  }

  public addProgramSubscriptionId(id: number) {
    this._programSubscriptionIds.push(id);
  }

  public async updateExchangeState() {
    await this.updateState();
    await this.updateZetaPricing();
    await Promise.all(
      this.assets.map(async (asset) => {
        this.getZetaGroupMarkets(asset).updateExpirySeries();
      })
    );
  }

  /**
   * Polls the on chain account to update state.
   */
  public async updateState() {
    this._state = (await this.program.account.state.fetch(
      this.stateAddress
    )) as State;
  }

  // TODO add subscription to this account

  /**
   * Polls the on chain account to update mark prices
   */
  public async updateZetaPricing() {
    this._pricing = (await this.program.account.pricing.fetch(
      this.pricingAddress
    )) as Pricing;
  }

  /**
   * Update the expiry state variables for the program.
   */
  public async updateZetaState(params: instructions.StateParams) {
    let tx = new Transaction().add(
      instructions.updateZetaStateIx(params, this.provider.wallet.publicKey)
    );
    await utils.processTransaction(this.provider, tx);
    await this.updateState();
  }

  private subscribePricing(
    callback?: (asset: Asset, type: EventType, data: any) => void
  ) {
    let eventEmitter = this._program.account.pricing.subscribe(
      this._pricingAddress,
      this.provider.connection.commitment
    );

    eventEmitter.on("change", async (pricing: Pricing) => {
      this._pricing = pricing;
      if (callback !== undefined) {
        callback(null, EventType.PRICING, null);
      }
    });

    this._eventEmitters.push(eventEmitter);
  }

  public subscribeMarket(asset: Asset) {
    this.getSubExchange(asset).markets.subscribeMarket(constants.PERP_INDEX);
  }

  public unsubscribeMarket(asset: Asset) {
    this.getSubExchange(asset).markets.unsubscribeMarket(constants.PERP_INDEX);
  }

  public subscribePerp(asset: Asset) {
    this.getSubExchange(asset).markets.subscribePerp();
  }

  public unsubscribePerp(asset: Asset) {
    this.getSubExchange(asset).markets.unsubscribePerp();
  }

  public async updateOrderbook(asset: Asset) {
    return await this.getPerpMarket(asset).updateOrderbook();
  }

  public async updateAllOrderbooks(live: boolean = true) {
    // This assumes that every market has 1 asksAddress and 1 bidsAddress
    let allLiveMarkets = [];
    this.assets.forEach((asset) => {
      allLiveMarkets = allLiveMarkets.concat([this.getPerpMarket(asset)]);
    });

    if (live) {
      allLiveMarkets = allLiveMarkets.filter(
        (m) => m.kind == types.Kind.PERP || m.expirySeries.isLive()
      );
    }

    let liveMarketsSlices: Market[][] = [];
    for (
      let i = 0;
      i < allLiveMarkets.length;
      i += constants.MAX_MARKETS_TO_FETCH
    ) {
      liveMarketsSlices.push(
        allLiveMarkets.slice(i, i + constants.MAX_MARKETS_TO_FETCH)
      );
    }

    await Promise.all(
      liveMarketsSlices.map(async (liveMarkets) => {
        let liveMarketAskAddresses = liveMarkets.map(
          (m) => m.serumMarket.asksAddress
        );
        let liveMarketBidAddresses = liveMarkets.map(
          (m) => m.serumMarket.bidsAddress
        );

        let accountInfos = await this.connection.getMultipleAccountsInfo(
          liveMarketAskAddresses.concat(liveMarketBidAddresses)
        );
        const half = Math.ceil(accountInfos.length / 2);
        const asksAccountInfos = accountInfos.slice(0, half);
        const bidsAccountInfos = accountInfos.slice(-half);

        // A bit of a weird one but we want a map of liveMarkets -> accountInfos because
        // we'll do the following orderbook updates async
        let liveMarketsToAskAccountInfosMap: Map<
          Market,
          AccountInfo<Buffer>
        > = new Map();
        let liveMarketsToBidAccountInfosMap: Map<
          Market,
          AccountInfo<Buffer>
        > = new Map();
        liveMarkets.map((m, i) => {
          liveMarketsToAskAccountInfosMap.set(m, asksAccountInfos[i]);
          liveMarketsToBidAccountInfosMap.set(m, bidsAccountInfos[i]);
        });

        await Promise.all(
          liveMarkets.map(async (market) => {
            market.asks = Orderbook.decode(
              market.serumMarket,
              liveMarketsToAskAccountInfosMap.get(market).data
            );
            market.bids = Orderbook.decode(
              market.serumMarket,
              liveMarketsToBidAccountInfosMap.get(market).data
            );
            market.updateOrderbook(false);
          })
        );
      })
    );
  }

  public getZetaGroupMarkets(asset: Asset): ZetaGroupMarkets {
    return this.getSubExchange(asset).markets;
  }

  public getPerpMarket(asset: Asset): Market {
    return this.getSubExchange(asset).markets.perpMarket;
  }

  public getMarketsByExpiryIndex(asset: Asset, index: number): Market[] {
    return this.getSubExchange(asset).markets.getMarketsByExpiryIndex(index);
  }

  public getExpirySeriesList(asset: Asset): ExpirySeries[] {
    return this.getSubExchange(asset).markets.expirySeries;
  }

  public getZetaGroupAddress(asset: Asset): PublicKey {
    return this.getSubExchange(asset).zetaGroupAddress;
  }

  public getPerpSyncQueue(asset: Asset): PerpSyncQueue {
    return this.getSubExchange(asset).perpSyncQueue;
  }

  public getOrderbook(asset: Asset): types.DepthOrderbook {
    return this.getPerpMarket(asset).orderbook;
  }

  public getMarkPrice(asset: Asset): number {
    return this.getSubExchange(asset).getMarkPrice();
  }

  public getInsuranceVaultAddress(): PublicKey {
    return this._combinedInsuranceVaultAddress;
  }

  public getVaultAddress(): PublicKey {
    return this._combinedVaultAddress;
  }

  public getSocializedLossAccountAddress(): PublicKey {
    return this._combinedSocializedLossAccountAddress;
  }

  public async updatePricingParameters(
    asset: Asset,
    args: instructions.UpdatePricingParametersArgs
  ) {
    await this.getSubExchange(asset).updatePricingParameters(args);
  }

  public async updateMarginParameters(
    asset: Asset,
    args: instructions.UpdateMarginParametersArgs
  ) {
    await this.getSubExchange(asset).updateMarginParameters(args);
  }

  public async updatePerpParameters(
    asset: Asset,
    args: instructions.UpdatePerpParametersArgs
  ) {
    await this.getSubExchange(asset).updatePerpParameters(args);
  }

  public async updateZetaGroupExpiryParameters(
    asset: Asset,
    args: instructions.UpdateZetaGroupExpiryArgs
  ) {
    await this.getSubExchange(asset).updateZetaGroupExpiryParameters(args);
  }

  public async toggleZetaGroupPerpsOnly(asset: Asset) {
    await this.getSubExchange(asset).toggleZetaGroupPerpsOnly();
  }

  public async updateSerumMarkets(asset: Asset) {
    await this.getSubExchange(asset).updateSerumMarkets();
  }

  public async updatePerpSerumMarketIfNeeded(asset: Asset, epochDelay: number) {
    await this.getSubExchange(asset).updatePerpSerumMarketIfNeeded(epochDelay);
  }

  public async initializeZetaMarkets(asset: Asset) {
    await this.getSubExchange(asset).initializeZetaMarkets();
  }

  public async initializeZetaMarketsTIFEpochCycle(
    asset: Asset,
    cycleLengthSecs: number
  ) {
    await this.getSubExchange(asset).initializeZetaMarketsTIFEpochCycle(
      cycleLengthSecs
    );
  }

  public async initializeMarketStrikes(asset: Asset) {
    await this.getSubExchange(asset).initializeMarketStrikes();
  }

  public async initializePerpSyncQueue(asset: Asset) {
    await this.getSubExchange(asset).initializePerpSyncQueue();
  }

  public async initializeUnderlying(asset: Asset, flexUnderlying: boolean) {
    await this.getSubExchange(asset).initializeUnderlying(flexUnderlying);
  }

  public async updatePricing(asset: Asset) {
    await this.getSubExchange(asset).updatePricing();
  }

  public async updatePricingPubkeys(
    asset: Asset,
    oracle: PublicKey,
    oracleBackupFeed: PublicKey,
    market: PublicKey,
    perpSyncQueue: PublicKey,
    zetaGroupKey: PublicKey
  ) {
    let tx = new Transaction().add(
      instructions.updateZetaPricingPubkeysIx({
        asset: toProgramAsset(asset) as any,
        oracle,
        oracleBackupFeed,
        market,
        perpSyncQueue,
        zetaGroupKey,
      })
    );
    await utils.processTransaction(this.provider, tx);

    await this.updateZetaPricing();
  }

  public async updateSubExchangeState(asset: Asset) {
    await this.getSubExchange(asset).updateSubExchangeState();
  }

  public async whitelistUserForDeposit(asset: Asset, user: PublicKey) {
    await this.getSubExchange(asset).whitelistUserForDeposit(user);
  }

  public async whitelistUserForInsuranceVault(asset: Asset, user: PublicKey) {
    await this.getSubExchange(asset).whitelistUserForInsuranceVault(user);
  }

  public async whitelistUserForTradingFees(asset: Asset, user: PublicKey) {
    await this.getSubExchange(asset).whitelistUserForTradingFees(user);
  }

  public async treasuryMovement(
    treasuryMovementType: types.TreasuryMovementType,
    amount: anchor.BN
  ) {
    let tx = new Transaction().add(
      instructions.treasuryMovementIx(treasuryMovementType, amount)
    );
    await utils.processTransaction(this._provider, tx);
  }

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

  public async halt(asset: Asset) {
    await this.getSubExchange(asset).halt();
  }

  public async unhalt(asset: Asset) {
    await this.getSubExchange(asset).unhalt();
  }

  public async updateHaltState(
    asset: Asset,
    timestamp: anchor.BN,
    spotPrice: anchor.BN
  ) {
    await this.getSubExchange(asset).updateHaltState(timestamp, spotPrice);
  }

  public async settlePositionsHalted(
    asset: Asset,
    marginAccounts: AccountMeta[]
  ) {
    await this.getSubExchange(asset).settlePositionsHalted(marginAccounts);
  }

  public async cancelAllOrdersHalted(asset: Asset) {
    await this.getSubExchange(asset).cancelAllOrdersHalted();
  }

  public async cleanZetaMarketHalted(asset: Asset) {
    await this.getSubExchange(asset).cleanZetaMarketHalted();
  }

  public isHalted(asset: Asset) {
    return this.getSubExchange(asset).halted;
  }

  public async close() {
    this._isInitialized = false;
    this._isSetup = false;

    await Promise.all(
      this.getAllSubExchanges().map(async (subExchange) => {
        await subExchange.close();
      })
    );
    await this._oracle.close();

    if (this._clockSubscriptionId !== undefined) {
      await this.connection.removeAccountChangeListener(
        this._clockSubscriptionId
      );
      this._clockSubscriptionId = undefined;
    }

    await this._program.account.pricing.unsubscribe(this._pricingAddress);

    for (var i = 0; i < this._programSubscriptionIds.length; i++) {
      await this.connection.removeProgramAccountChangeListener(
        this._programSubscriptionIds[i]
      );
    }
    this._programSubscriptionIds = [];

    for (var i = 0; i < this._eventEmitters.length; i++) {
      this._eventEmitters[i].removeListener("change");
    }
    this._eventEmitters = [];
  }
}

// Exchange singleton.
export const exchange = new Exchange();

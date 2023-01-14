import * as anchor from "@project-serum/anchor";
import {
  PublicKey,
  Transaction,
  Connection,
  ConfirmOptions,
  SYSVAR_CLOCK_PUBKEY,
  AccountInfo,
  AccountMeta,
} from "@solana/web3.js";
import * as utils from "./utils";
import * as constants from "./constants";
import {
  Greeks,
  PerpSyncQueue,
  ProductGreeks,
  State,
  ZetaGroup,
} from "./program-types";
import { ExpirySeries, Market, ZetaGroupMarkets } from "./market";
import { RiskCalculator } from "./risk";
import { EventType } from "./events";
import { Network } from "./network";
import { Oracle, OraclePrice } from "./oracle";
import idl from "./idl/zeta.json";
import { Zeta } from "./types/zeta";
import * as types from "./types";
import { Asset } from "./assets";
import { SubExchange } from "./subexchange";
import * as instructions from "./program-instructions";
import { Orderbook } from "./serum/market";

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

  private _useLedger: boolean = false;

  private _programSubscriptionIds: number[] = [];

  public async initialize(
    assets: Asset[],
    programId: PublicKey,
    network: Network,
    connection: Connection,
    opts: ConfirmOptions,
    wallet = new types.DummyWallet()
  ) {
    if (this.isSetup) {
      throw "Exchange already setup";
    }
    this._assets = assets;
    this._provider = new anchor.AnchorProvider(
      connection,
      wallet,
      opts || utils.commitmentConfig(connection.commitment)
    );
    this._opts = opts;
    this._network = network;
    this._program = new anchor.Program(
      idl as anchor.Idl,
      programId,
      this._provider
    ) as anchor.Program<Zeta>;

    for (var asset of assets) {
      await this.addSubExchange(asset, new SubExchange());
      await this.getSubExchange(asset).initialize(asset);
    }
    this._isSetup = true;
  }

  public async initializeZetaState(
    params: instructions.StateParams,
    referralAdmin: PublicKey
  ) {
    const [mintAuthority, mintAuthorityNonce] = await utils.getMintAuthority(
      this.programId
    );
    const [state, stateNonce] = await utils.getState(this.programId);
    const [serumAuthority, serumNonce] = await utils.getSerumAuthority(
      this.programId
    );

    this._usdcMintAddress = constants.USDC_MINT_ADDRESS[this.network];

    const [treasuryWallet, _treasuryWalletNonce] =
      await utils.getZetaTreasuryWallet(this.programId, this._usdcMintAddress);

    const [referralRewardsWallet, _referralRewardsWalletNonce] =
      await utils.getZetaReferralsRewardsWallet(
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
        params
      )
    );
    try {
      await utils.processTransaction(this._provider, tx);
    } catch (e) {
      console.error(`Initialize zeta state failed: ${e}`);
    }

    this._mintAuthority = mintAuthority;
    this._stateAddress = state;
    this._serumAuthority = serumAuthority;
    this._treasuryWalletAddress = treasuryWallet;
    this._referralsRewardsWalletAddress = referralRewardsWallet;
    await this.updateState();
  }

  public async initializeZetaGroup(
    asset: Asset,
    oracle: PublicKey,
    oracleBackupFeed: PublicKey,
    oracleBackupProgram: PublicKey,
    pricingArgs: instructions.InitializeZetaGroupPricingArgs,
    perpArgs: instructions.UpdatePerpParametersArgs,
    marginArgs: instructions.UpdateMarginParametersArgs,
    expiryArgs: instructions.UpdateZetaGroupExpiryArgs
  ) {
    let tx = new Transaction().add(
      await instructions.initializeZetaGroupIx(
        asset,
        constants.MINTS[asset],
        oracle,
        oracleBackupFeed,
        oracleBackupProgram,
        pricingArgs,
        perpArgs,
        marginArgs,
        expiryArgs
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
    }
    await this.updateState();
    await this.getSubExchange(asset).updateZetaGroup();
  }

  public async load(
    assets: Asset[],
    programId: PublicKey,
    network: Network,
    connection: Connection,
    opts: ConfirmOptions,
    wallet = new types.DummyWallet(),
    throttleMs = 0,
    callback?: (asset: Asset, event: EventType, data: any) => void
  ) {
    if (this.isInitialized) {
      throw "Exchange already loaded";
    }

    if (!this.isSetup) {
      await this.initialize(
        assets,
        programId,
        network,
        connection,
        opts,
        wallet
      );
    }

    this._riskCalculator = new RiskCalculator(this.assets);

    // Load variables from state.
    const [mintAuthority, _mintAuthorityNonce] = await utils.getMintAuthority(
      this.programId
    );
    const [state, _stateNonce] = await utils.getState(this.programId);
    const [serumAuthority, _serumNonce] = await utils.getSerumAuthority(
      this.programId
    );

    this._mintAuthority = mintAuthority;
    this._stateAddress = state;
    this._serumAuthority = serumAuthority;
    this._usdcMintAddress = constants.USDC_MINT_ADDRESS[network];

    const [treasuryWallet, _treasuryWalletnonce] =
      await utils.getZetaTreasuryWallet(this.programId, this._usdcMintAddress);
    this._treasuryWalletAddress = treasuryWallet;

    const [referralsRewardsWallet, _referralsRewardsWalletNonce] =
      await utils.getZetaReferralsRewardsWallet(
        this.programId,
        this._usdcMintAddress
      );
    this._referralsRewardsWalletAddress = referralsRewardsWallet;

    this._lastPollTimestamp = 0;

    this._oracle = new Oracle(this.network, this.connection);
    await this.subscribeOracle(this.assets, callback);

    await Promise.all(
      this.assets.map(async (asset) => {
        await this.getSubExchange(asset).load(
          asset,
          this.programId,
          this.network,
          this.opts,
          throttleMs,
          callback
        );
      })
    );

    await this.updateState();
    await this.subscribeClock(callback);

    this._isInitialized = true;
  }

  private async addSubExchange(asset: Asset, subExchange: SubExchange) {
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

  private async subscribeOracle(
    assets: Asset[],
    callback?: (asset: Asset, type: EventType, data: any) => void
  ) {
    await this._oracle.subscribePriceFeeds(
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

  private async subscribeClock(
    callback?: (asset: Asset, type: EventType, data: any) => void
  ) {
    if (this._clockSubscriptionId !== undefined) {
      throw Error("Clock already subscribed to.");
    }
    this._clockSubscriptionId = this.provider.connection.onAccountChange(
      SYSVAR_CLOCK_PUBKEY,
      async (accountInfo: AccountInfo<Buffer>, _context: any) => {
        this.setClockData(utils.getClockData(accountInfo));
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
          }
        } catch (e) {
          console.log(`SubExchange polling failed. Error: ${e}`);
        }
      },
      this.provider.connection.commitment
    );
    let accountInfo = await this.provider.connection.getAccountInfo(
      SYSVAR_CLOCK_PUBKEY
    );
    this.setClockData(utils.getClockData(accountInfo));
  }

  public addProgramSubscriptionId(id: number) {
    this._programSubscriptionIds.push(id);
  }

  public async updateExchangeState() {
    await this.updateState();
    await Promise.all(
      this.assets.map(async (asset) => {
        await this.updateZetaGroup(asset);
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

  public async initializeMarketNodes(asset: Asset, zetaGroup: PublicKey) {
    await this.getSubExchange(asset).initializeMarketNodes(zetaGroup);
  }

  public subscribeMarket(asset: Asset, index: number) {
    this.getSubExchange(asset).markets.subscribeMarket(index);
  }

  public unsubscribeMarket(asset: Asset, index: number) {
    this.getSubExchange(asset).markets.unsubscribeMarket(index);
  }

  public subscribePerp(asset: Asset) {
    this.getSubExchange(asset).markets.subscribePerp();
  }

  public unsubscribePerp(asset: Asset) {
    this.getSubExchange(asset).markets.unsubscribePerp();
  }

  public async updateOrderbook(asset: Asset, index: number) {
    await this.getMarket(asset, index).updateOrderbook();
  }

  public async updateAllOrderbooks(live: boolean = true) {
    // This assumes that every market has 1 asksAddress and 1 bidsAddress
    let allLiveMarkets = [];
    this.assets.forEach((asset) => {
      allLiveMarkets = allLiveMarkets.concat(this.getMarkets(asset));
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

  public getMarket(asset: Asset, index: number): Market {
    if (index == constants.PERP_INDEX) {
      return this.getPerpMarket(asset);
    }
    return this.getSubExchange(asset).markets.markets[index];
  }

  public getMarkets(asset: Asset): Market[] {
    return this.getSubExchange(asset).markets.markets.concat(
      this.getSubExchange(asset).markets.perpMarket
    );
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

  public getZetaGroup(asset: Asset): ZetaGroup {
    return this.getSubExchange(asset).zetaGroup;
  }

  public getZetaGroupAddress(asset: Asset): PublicKey {
    return this.getSubExchange(asset).zetaGroupAddress;
  }

  public getGreeks(asset: Asset): Greeks {
    return this.getSubExchange(asset).greeks;
  }

  public getPerpSyncQueue(asset: Asset): PerpSyncQueue {
    return this.getSubExchange(asset).perpSyncQueue;
  }

  public getOrderbook(asset: Asset, index: number): types.DepthOrderbook {
    return this.getMarket(asset, index).orderbook;
  }

  public getMarkPrice(asset: Asset, index: number): number {
    return this.getSubExchange(asset).getMarkPrice(index);
  }

  public getInsuranceVaultAddress(asset: Asset): PublicKey {
    return this.getSubExchange(asset).insuranceVaultAddress;
  }

  public getVaultAddress(asset: Asset): PublicKey {
    return this.getSubExchange(asset).vaultAddress;
  }

  public getSocializedLossAccountAddress(asset: Asset): PublicKey {
    return this.getSubExchange(asset).socializedLossAccountAddress;
  }

  public async updatePricingParameters(
    asset: Asset,
    args: instructions.UpdatePricingParametersArgs
  ) {
    await this.getSubExchange(asset).updatePricingParameters(args);
  }

  public getMarginParams(asset: Asset) {
    return this.getSubExchange(asset).marginParams;
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

  public async updateVolatilityNodes(asset: Asset, nodes: Array<anchor.BN>) {
    await this.getSubExchange(asset).updateVolatilityNodes(nodes);
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

  public async updateZetaGroup(asset: Asset) {
    await this.getSubExchange(asset).updateZetaGroup();
  }

  public async updatePricing(asset: Asset, expiryIndex: number) {
    await this.getSubExchange(asset).updatePricing(expiryIndex);
  }

  public async retreatMarketNodes(asset: Asset, expiryIndex: number) {
    await this.getSubExchange(asset).retreatMarketNodes(expiryIndex);
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
    asset: Asset,
    treasuryMovementType: types.TreasuryMovementType,
    amount: anchor.BN
  ) {
    await this.getSubExchange(asset).treasuryMovement(
      treasuryMovementType,
      amount
    );
  }

  public async rebalanceInsuranceVault(asset: Asset, marginAccounts: any[]) {
    await this.getSubExchange(asset).rebalanceInsuranceVault(marginAccounts);
  }

  public updateMarginParams(asset: Asset) {
    this.getSubExchange(asset).updateMarginParams();
  }

  public async haltZetaGroup(asset: Asset, zetaGroupAddress: PublicKey) {
    await this.getSubExchange(asset).haltZetaGroup(zetaGroupAddress);
  }

  public async unhaltZetaGroup(asset: Asset, zetaGroupAddress: PublicKey) {
    await this.getSubExchange(asset).unhaltZetaGroup();
  }

  public async updateHaltState(
    asset: Asset,
    zetaGroupAddress: PublicKey,
    args: instructions.UpdateHaltStateArgs
  ) {
    await this.getSubExchange(asset).updateHaltState(zetaGroupAddress, args);
  }

  public async settlePositionsHalted(
    asset: Asset,
    marginAccounts: AccountMeta[]
  ) {
    await this.getSubExchange(asset).settlePositionsHalted(marginAccounts);
  }

  public async settleSpreadPositionsHalted(
    asset: Asset,
    marginAccounts: AccountMeta[]
  ) {
    await this.getSubExchange(asset).settleSpreadPositionsHalted(
      marginAccounts
    );
  }

  public async cancelAllOrdersHalted(asset: Asset) {
    await this.getSubExchange(asset).cancelAllOrdersHalted();
  }

  public async cleanZetaMarketsHalted(asset: Asset) {
    await this.getSubExchange(asset).cleanZetaMarketsHalted();
  }

  public async updatePricingHalted(asset: Asset, expiryIndex: number) {
    await this.getSubExchange(asset).updatePricingHalted(expiryIndex);
  }

  public isHalted(asset: Asset) {
    return this.getSubExchange(asset).halted;
  }

  public async cleanMarketNodes(asset: Asset, expiryIndex: number) {
    await this.getSubExchange(asset).cleanMarketNodes(expiryIndex);
  }

  public async updateVolatility(
    asset: Asset,
    args: instructions.UpdateVolatilityArgs
  ) {
    await this.getSubExchange(asset).updateVolatility(args);
  }

  public async updateInterestRate(
    asset: Asset,
    args: instructions.UpdateInterestRateArgs
  ) {
    await this.getSubExchange(asset).updateInterestRate(args);
  }

  public getProductGreeks(
    asset: Asset,
    marketIndex: number,
    expiryIndex: number
  ): ProductGreeks {
    return this.getSubExchange(asset).getProductGreeks(
      marketIndex,
      expiryIndex
    );
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

    for (var i = 0; i < this._programSubscriptionIds.length; i++) {
      await this.connection.removeProgramAccountChangeListener(
        this._programSubscriptionIds[i]
      );
    }
    this._programSubscriptionIds = [];
  }
}

// Exchange singleton.
export const exchange = new Exchange();

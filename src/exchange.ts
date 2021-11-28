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
import { DummyWallet, Wallet } from "./types";
import {
  initializeZetaMarketTxs,
  initializeZetaGroupIx,
  updateGreeksIx,
  UpdateGreeksArgs,
} from "./program-instructions";

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
   * Address of global vault token account.
   */
  public get vaultAddress(): PublicKey {
    return this._vaultAddress;
  }
  private _vaultAddress: PublicKey;

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
      opts || utils.defaultCommitment()
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
    usdcMint: PublicKey,
    params: StateParams,
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
    const [vault, vaultNonce] = await utils.getVault(programId);

    await exchange.program.rpc.initializeZetaState(
      {
        stateNonce: stateNonce,
        vaultNonce: vaultNonce,
        serumNonce: serumNonce,
        mintAuthNonce: mintAuthorityNonce,
        expiryIntervalSeconds: params.expiryIntervalSeconds,
        newExpiryThresholdSeconds: params.newExpiryThresholdSeconds,
        strikeInitializationThresholdSeconds:
          params.strikeInitializationThresholdSeconds,
      },
      {
        accounts: {
          state,
          vault,
          serumAuthority,
          mintAuthority,
          mint: usdcMint,
          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          admin: wallet.publicKey,
        },
      }
    );

    exchange._stateAddress = state;
    exchange._vaultAddress = vault;
    exchange._serumAuthority = serumAuthority;
    exchange._mintAuthority = mintAuthority;
    exchange._usdcMintAddress = usdcMint;

    await exchange.updateState();
    console.log(`Initialized zeta state!`);
    console.log(
      `Params:
expiryIntervalSeconds=${params.expiryIntervalSeconds},
newExpiryThresholdSeconds=${params.newExpiryThresholdSeconds},
strikeInitializationThresholdSeconds=${params.strikeInitializationThresholdSeconds}`
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
    const [vault, _vaultNonce] = await utils.getVault(programId);
    let usdcMint = await utils.getTokenMint(this.connection, vault);

    exchange._mintAuthority = mintAuthority;
    exchange._stateAddress = state;
    exchange._vaultAddress = vault;
    exchange._serumAuthority = serumAuthority;
    exchange._usdcMintAddress = usdcMint;

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

    await exchange.updateState();
    await exchange.updateZetaGroup();

    if (
      exchange.zetaGroup.products[
        exchange.zetaGroup.products.length - 1
      ].market.equals(PublicKey.default)
    ) {
      throw "Zeta group markets are uninitialized!";
    }

    exchange._markets = await ZetaGroupMarkets.load(opts, throttleMs);
    exchange._greeks = (await exchange.program.account.greeks.fetch(
      exchange._zetaGroup.greeks
    )) as Greeks;
    exchange._riskCalculator.updateMarginRequirements();

    // Set callbacks.
    exchange.subscribeZetaGroup(callback);
    exchange.subscribeGreeks(callback);

    await exchange.subscribeClock(callback);
    await exchange.subscribeOracle(callback);

    exchange._isInitialized = true;

    console.log(
      `Exchange loaded @ ${new Date(exchange.clockTimestamp * 1000)}`
    );
  }

  /**
   * Initializes a zeta group
   */
  public async initializeZetaGroup(
    oracle: PublicKey,
    callback?: (type: EventType, data: any) => void
  ) {
    let underlyingIndex = this.state.numUnderlyings;
    let underlyingMint = constants.UNDERLYINGS[underlyingIndex];

    const [zetaGroup, _zetaGroupNonce] = await utils.getZetaGroup(
      this.program.programId,
      underlyingMint
    );
    this._zetaGroupAddress = zetaGroup;

    let tx = new Transaction().add(
      await initializeZetaGroupIx(underlyingMint, oracle)
    );
    await utils.processTransaction(this._provider, tx);

    await this.updateZetaGroup();
    await this.updateState();

    this.subscribeZetaGroup(callback);
    this.subscribeClock(callback);
    this.subscribeGreeks(callback);
    await this.subscribeOracle(callback);
  }

  /**
   * Update the expiry state variables for the program.
   */
  public async updateZetaState(params: StateParams) {
    await this.program.rpc.updateZetaState(
      {
        expiryIntervalSeconds: params.expiryIntervalSeconds,
        newExpiryThresholdSeconds: params.newExpiryThresholdSeconds,
        strikeInitializationThresholdSeconds:
          params.strikeInitializationThresholdSeconds,
      },
      {
        accounts: {
          state: this._stateAddress,
          admin: this._provider.wallet.publicKey,
        },
      }
    );
    await this.updateState();
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

    await this.program.rpc.initializeMarketIndexes(marketIndexesNonce, {
      accounts: {
        state: this._stateAddress,
        marketIndexes,
        admin: this._provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        zetaGroup: this._zetaGroupAddress,
      },
    });

    // We initialize 50 indexes at a time in the program.
    for (
      var i = 0;
      i < constants.TOTAL_MARKETS;
      i += constants.MARKET_INDEX_LIMIT
    ) {
      await this._program.rpc.addMarketIndexes({
        accounts: {
          marketIndexes,
          zetaGroup: this._zetaGroupAddress,
        },
      });
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

        let [tx, tx2] = await initializeZetaMarketTxs(
          i,
          marketIndexesAccount.indexes[i],
          requestQueue.publicKey,
          eventQueue.publicKey,
          bids.publicKey,
          asks.publicKey,
          marketIndexes
        );
        await this.provider.send(tx, [requestQueue, eventQueue, bids, asks]);
        await this.provider.send(tx2);
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
    await this.program.rpc.initializeMarketStrikes({
      accounts: {
        state: this.stateAddress,
        zetaGroup: this.zetaGroupAddress,
        oracle: this.zetaGroup.oracle,
      },
    });
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
  }

  public async updateGreeks(updates: UpdateGreeksArgs[]) {
    let ixs = [];
    for (var i = 0; i < updates.length; i++) {
      ixs.push(await updateGreeksIx(updates[i]));
    }
    let txs = utils.splitIxsIntoTx(ixs, constants.MAX_GREEK_UPDATES_PER_TX);
    await Promise.all(
      txs.map(async (tx) => {
        await utils.processTransaction(this._provider, tx);
      })
    );
  }

  public assertInitialized() {
    if (!this.isInitialized) {
      throw "Exchange uninitialized";
    }
  }

  private subscribeZetaGroup(callback?: (type: EventType, data: any) => void) {
    let eventEmitter = this._program.account.zetaGroup.subscribe(
      this._zetaGroupAddress
    );

    eventEmitter.on("change", async (zetaGroup: ZetaGroup) => {
      let expiry =
        this._zetaGroup !== undefined &&
        this._zetaGroup.frontExpiryIndex !== zetaGroup.frontExpiryIndex;
      this._zetaGroup = zetaGroup;
      if (this._markets !== undefined) {
        this._markets.updateExpirySeries();
      }
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

  private async subscribeClock(
    callback?: (type: EventType, data: any) => void
  ) {
    if (this._clockSubscriptionId !== undefined) {
      throw Error("Clock already subscribed to.");
    }
    this._clockSubscriptionId = this._provider.connection.onAccountChange(
      SYSVAR_CLOCK_PUBKEY,
      async (accountInfo: AccountInfo<Buffer>, _context: any) => {
        this._clockTimestamp = utils.getClockTimestamp(accountInfo);
        if (callback !== undefined) {
          callback(EventType.CLOCK, null);
        }
        try {
          await this.handlePolling(callback);
        } catch (e) {
          console.log(`Exchange polling failed. Error: ${e}`);
        }
      }
    );
    let accountInfo = await this._provider.connection.getAccountInfo(
      SYSVAR_CLOCK_PUBKEY
    );
    this._clockTimestamp = utils.getClockTimestamp(accountInfo);
  }

  private subscribeGreeks(callback?: (type: EventType, data: any) => void) {
    if (this._zetaGroup === null) {
      throw Error("Cannot subscribe greeks. ZetaGroup is null.");
    }

    let eventEmitter = this._program.account.greeks.subscribe(
      this._zetaGroup.greeks
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
      this._riskCalculator.updateMarginRequirements();
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
    return utils.getReadableAmount(this._greeks.markPrice[index].toNumber());
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
      await this._provider.connection.removeAccountChangeListener(
        this._clockSubscriptionId
      );
      this._clockSubscriptionId = undefined;
    }
    await this._oracle.close();
  }
}

type StateParams = {
  readonly expiryIntervalSeconds: number;
  readonly newExpiryThresholdSeconds: number;
  readonly strikeInitializationThresholdSeconds: number;
};

// Exchange singleton.
export const exchange = new Exchange();

import * as anchor from "@project-serum/anchor";
import { Orderbook, Market as SerumMarket } from "./serum/market";
import { ConfirmOptions, PublicKey } from "@solana/web3.js";
import { exchange as Exchange } from "./exchange";
import * as constants from "./constants";
import {
  getZetaVault,
  processTransaction,
  getPriceFromSerumOrderKey,
  sleep,
  convertNativeBNToDecimal,
  convertNativeLotSizeToDecimal,
  getCancelAllIxs,
  splitIxsIntoTx,
} from "./utils";
import * as types from "./types";

import { EventType, OrderbookEvent } from "./events";
import { Asset } from "./assets";

export class ZetaGroupMarkets {
  /**
   * Returns the index for the front expiry in expiry series.
   */
  public get frontExpiryIndex(): number {
    return this._frontExpiryIndex;
  }
  private _frontExpiryIndex: number;
  /**
   * Returns the expiry series for this zeta group.
   */
  public get expirySeries(): ExpirySeries[] {
    return this._expirySeries;
  }
  private _expirySeries: Array<ExpirySeries>;
  /**
   * The underlying asset this set of markets belong to.
   */
  public get asset(): Asset {
    return this._asset;
  }
  private _asset: Asset;

  /**
   * The list of markets in the same ordering as the zeta group account
   * They are in sorted order by market address.
   */
  public get markets(): Market[] {
    return this._markets;
  }
  private _markets: Array<Market>;

  public get perpMarket(): Market {
    return this._perpMarket;
  }
  private _perpMarket: Market;

  public set pollInterval(interval: number) {
    if (interval < 0) {
      throw Error("Invalid poll interval");
    }
    this._pollInterval = interval;
  }
  public get pollInterval(): number {
    return this._pollInterval;
  }
  private _pollInterval: number = constants.DEFAULT_MARKET_POLL_INTERVAL;

  private _lastPollTimestamp: number;

  private _subscribedMarketIndexes: Set<number>;

  private _subscribedPerp: boolean;
  /**
   * Returns the market's index.
   */
  public getMarketsByExpiryIndex(expiryIndex: number): Market[] {
    let head = expiryIndex * this.productsPerExpiry();
    return this._markets.slice(head, head + this.productsPerExpiry());
  }

  /**
   * Returns all strikes given an expiry index. Strikes are returned as decimal numbers.
   */
  public getStrikesByExpiryIndex(expiryIndex: number): number[] {
    let strikes = Array(constants.NUM_STRIKES).fill(0);
    let markets = this.getMarketsByExpiryIndex(expiryIndex);
    for (let i = 0; i < constants.NUM_STRIKES; i++) {
      strikes[i] = markets[i].strike;
    }
    return strikes;
  }

  /**
   * Returns the options market given an expiry index and options kind.
   */
  public getOptionsMarketByExpiryIndex(
    expiryIndex: number,
    kind: types.Kind
  ): Market[] {
    let markets = this.getMarketsByExpiryIndex(expiryIndex);
    switch (kind) {
      case types.Kind.CALL:
        return markets.slice(0, constants.NUM_STRIKES);
      case types.Kind.PUT:
        return markets.slice(constants.NUM_STRIKES, 2 * constants.NUM_STRIKES);
      default:
        throw Error("Options market kind not supported, must be CALL or PUT");
    }
  }

  /**
   * Returns the futures market given an expiry index.
   */
  public getFuturesMarketByExpiryIndex(expiryIndex: number): Market {
    let markets = this.getMarketsByExpiryIndex(expiryIndex);
    let market = markets[markets.length - 1];
    if (market.kind != types.Kind.FUTURE) {
      throw Error("Futures market kind error");
    }
    return market;
  }

  public getMarketByExpiryKindStrike(
    expiryIndex: number,
    kind: types.Kind,
    strike?: number
  ): Market | undefined {
    let markets = this.getMarketsByExpiryIndex(expiryIndex);
    let marketsKind: Array<Market>;
    if (kind === types.Kind.CALL || kind === types.Kind.PUT) {
      if (strike === undefined) {
        throw new Error("Strike must be specified for options markets");
      }
      marketsKind = this.getOptionsMarketByExpiryIndex(expiryIndex, kind);
    } else if (kind === types.Kind.FUTURE) {
      return this.getFuturesMarketByExpiryIndex(expiryIndex);
    } else {
      throw new Error("Only CALL, PUT, FUTURE kinds are supported");
    }

    let market = marketsKind.filter((x) => x.strike == strike);
    return markets.length == 0 ? undefined : markets[0];
  }

  private constructor(asset: Asset) {
    let subExchange = Exchange.getSubExchange(asset);
    this._asset = asset;
    this._expirySeries = new Array(subExchange.zetaGroup.expirySeries.length);
    this._markets = new Array(subExchange.zetaGroup.products.length);
    this._subscribedMarketIndexes = new Set<number>();
    this._lastPollTimestamp = 0;
  }

  public subscribeMarket(marketIndex: number) {
    if (
      marketIndex >= this._markets.length &&
      marketIndex != constants.PERP_INDEX
    ) {
      throw Error(`Market index ${marketIndex} doesn't exist.`);
    }
    this._subscribedMarketIndexes.add(marketIndex);
  }

  public unsubscribeMarket(marketIndex: number): boolean {
    return this._subscribedMarketIndexes.delete(marketIndex);
  }

  public subscribePerp() {
    this._subscribedPerp = true;
  }

  public unsubscribePerp() {
    this._subscribedPerp = false;
  }

  public async handlePolling(
    callback?: (asset: Asset, eventType: EventType, data: any) => void
  ) {
    if (
      Exchange.clockTimestamp >
      this._lastPollTimestamp + this._pollInterval
    ) {
      this._lastPollTimestamp = Exchange.clockTimestamp;
      let indexes = Array.from(this._subscribedMarketIndexes);
      await Promise.all(
        indexes.map(async (index) => {
          try {
            await this._markets[index].updateOrderbook();
          } catch (e) {
            console.error(`Orderbook poll failed: ${e}`);
          }
          if (callback !== undefined) {
            let data: OrderbookEvent = { marketIndex: index };
            callback(this.asset, EventType.ORDERBOOK, data);
          }
        })
      );

      if (this._subscribedPerp) {
        try {
          await this._perpMarket.updateOrderbook();
        } catch (e) {
          console.error(`Orderbook poll failed: ${e}`);
        }
        if (callback !== undefined) {
          let data: OrderbookEvent = { marketIndex: constants.PERP_INDEX };
          callback(this.asset, EventType.ORDERBOOK, data);
        }
      }
    }
  }

  /**
   * Will load a new instance of ZetaGroupMarkets
   * Should not be called outside of SubExchange.
   */
  public static async load(
    asset: Asset,
    opts: ConfirmOptions,
    throttleMs: number
  ): Promise<ZetaGroupMarkets> {
    let instance = new ZetaGroupMarkets(asset);
    let subExchange = Exchange.getSubExchange(asset);

    let productsPerExpiry = Math.floor(
      subExchange.zetaGroup.products.length /
        subExchange.zetaGroup.expirySeries.length
    );

    let indexes = [...Array(constants.ACTIVE_MARKETS - 1).keys()];
    for (var i = 0; i < indexes.length; i += constants.MARKET_LOAD_LIMIT) {
      let slice = indexes.slice(i, i + constants.MARKET_LOAD_LIMIT);
      await Promise.all(
        slice.map(async (index) => {
          let marketAddr = subExchange.zetaGroup.products[index].market;
          let serumMarket = await SerumMarket.load(
            Exchange.connection,
            marketAddr,
            { commitment: opts.commitment, skipPreflight: opts.skipPreflight },
            constants.DEX_PID[Exchange.network]
          );
          let [baseVaultAddr, _baseVaultNonce] = await getZetaVault(
            Exchange.programId,
            serumMarket.baseMintAddress
          );
          let [quoteVaultAddr, _quoteVaultNonce] = await getZetaVault(
            Exchange.programId,
            serumMarket.quoteMintAddress
          );

          let expiryIndex = Math.floor(index / productsPerExpiry);

          instance._markets[index] = new Market(
            asset,
            index,
            expiryIndex,
            types.toProductKind(subExchange.zetaGroup.products[index].kind),
            marketAddr,
            subExchange.zetaGroupAddress,
            quoteVaultAddr,
            baseVaultAddr,
            serumMarket
          );
        })
      );

      await sleep(throttleMs);
    }

    // Perps product/market is separate
    let marketAddr = subExchange.zetaGroup.perp.market;
    let serumMarket = await SerumMarket.load(
      Exchange.connection,
      marketAddr,
      { commitment: opts.commitment, skipPreflight: opts.skipPreflight },
      constants.DEX_PID[Exchange.network]
    );
    let [baseVaultAddr, _baseVaultNonce] = await getZetaVault(
      Exchange.programId,
      serumMarket.baseMintAddress
    );
    let [quoteVaultAddr, _quoteVaultNonce] = await getZetaVault(
      Exchange.programId,
      serumMarket.quoteMintAddress
    );
    instance._perpMarket = new Market(
      asset,
      constants.PERP_INDEX, // not in use but technically sits at the end of the list of Products in the ZetaGroup
      null,
      types.toProductKind(subExchange.zetaGroup.perp.kind),
      marketAddr,
      subExchange.zetaGroupAddress,
      quoteVaultAddr,
      baseVaultAddr,
      serumMarket
    );

    instance.updateExpirySeries();
    return instance;
  }

  /**
   * Updates the option series state based off state in SubExchange.
   */
  public async updateExpirySeries() {
    let subExchange = Exchange.getSubExchange(this.asset);
    for (var i = 0; i < subExchange.zetaGroup.products.length; i++) {
      this._markets[i].updateStrike();
    }

    this._frontExpiryIndex = subExchange.zetaGroup.frontExpiryIndex;
    for (var i = 0; i < subExchange.zetaGroup.expirySeries.length; i++) {
      let strikesInitialized =
        this._markets[i * this.productsPerExpiry()].strike != null;
      this._expirySeries[i] = new ExpirySeries(
        this.asset,
        i,
        subExchange.zetaGroup.expirySeries[i].activeTs.toNumber(),
        subExchange.zetaGroup.expirySeries[i].expiryTs.toNumber(),
        subExchange.zetaGroup.expirySeries[i].dirty,
        strikesInitialized
      );
    }
  }

  /**
   * Returns the market object for a given index.
   */
  public getMarket(market: PublicKey): Market {
    let index = this.getMarketIndex(market);
    return index == constants.PERP_INDEX
      ? this._perpMarket
      : this._markets[index];
  }

  /**
   * Returns the market index for a given market address.
   */
  public getMarketIndex(market: PublicKey): number {
    let compare = (a: PublicKey, b: PublicKey) =>
      a.toBuffer().compare(b.toBuffer());

    let m = 0;
    let n = this._markets.length - 1;
    while (m <= n) {
      let k = (n + m) >> 1;
      let cmp = compare(market, this._markets[k].address);
      if (cmp > 0) {
        m = k + 1;
      } else if (cmp < 0) {
        n = k - 1;
      } else {
        return k;
      }
    }
    if (compare(market, this._perpMarket.address) == 0) {
      return constants.PERP_INDEX;
    }
    throw Error("Market doesn't exist!");
  }

  /**
   * Returns the index of expiry series that are tradeable.
   */
  public getTradeableExpiryIndices(): number[] {
    let result = [];
    for (var i = 0; i < this._expirySeries.length; i++) {
      let expirySeries = this._expirySeries[i];
      if (expirySeries.isLive()) {
        result.push(i);
      }
    }
    return result;
  }

  public productsPerExpiry(): number {
    return Math.floor(this._markets.length / this.expirySeries.length);
  }
}

export class ExpirySeries {
  asset: Asset;
  expiryIndex: number;
  activeTs: number;
  expiryTs: number;
  dirty: boolean;
  strikesInitialized: boolean;

  public constructor(
    asset: Asset,
    expiryIndex: number,
    activeTs: number,
    expiryTs: number,
    dirty: boolean,
    strikesInitialized: boolean
  ) {
    this.asset = asset;
    this.expiryIndex = expiryIndex;
    this.activeTs = activeTs;
    this.expiryTs = expiryTs;
    this.dirty = dirty;
    this.strikesInitialized = strikesInitialized;
  }

  public isLive(): boolean {
    return (
      Exchange.clockTimestamp >= this.activeTs &&
      Exchange.clockTimestamp < this.expiryTs &&
      this.strikesInitialized &&
      !this.dirty
    );
  }
}

/**
 * Wrapper class for a zeta market on serum.
 */
export class Market {
  /**
   * The market index corresponding to the zeta group account.
   */
  public get marketIndex(): number {
    return this._marketIndex;
  }
  private _marketIndex: number;
  /**
   * The expiry series index this market belongs to.
   */
  public get expiryIndex(): number {
    return this._expiryIndex;
  }
  public get expirySeries(): ExpirySeries {
    return Exchange.getSubExchange(this.asset).markets.expirySeries[
      this.expiryIndex
    ];
  }
  private _expiryIndex: number;

  /**
   * The underlying asset this set of markets belong to.
   */
  public get asset(): Asset {
    return this._asset;
  }
  private _asset: Asset;

  /**
   * The type of product this market represents.
   */
  public get kind(): types.Kind {
    return this._kind;
  }
  private _kind: types.Kind;

  /**
   * The serum market address.
   */
  public get address(): PublicKey {
    return this._address;
  }
  private _address: PublicKey;

  /**
   * The zeta group this market belongs to.
   * TODO currently there exists only one zeta group.
   */
  public get zetaGroup(): PublicKey {
    return this._zetaGroup;
  }
  private _zetaGroup: PublicKey;

  /**
   * The zeta vault for the quote mint.
   */
  public get quoteVault(): PublicKey {
    return this._quoteVault;
  }
  private _quoteVault: PublicKey;

  /**
   * The zeta vault for the base mint.
   */
  public get baseVault(): PublicKey {
    return this._baseVault;
  }
  private _baseVault: PublicKey;

  /**
   * The serum Market object from @project-serum/ts
   */
  public get serumMarket(): SerumMarket {
    return this._serumMarket;
  }
  private _serumMarket: SerumMarket;

  public set bids(bids: Orderbook) {
    this._bids = bids;
  }
  private _bids: Orderbook;

  public set asks(asks: Orderbook) {
    this._asks = asks;
  }
  private _asks: Orderbook;

  /**
   * Returns the best N levels for bids and asks
   */
  public get orderbook(): types.DepthOrderbook {
    return this._orderbook;
  }
  private _orderbook: types.DepthOrderbook;

  /**
   * The strike of this option, modified on new expiry.
   */
  public get strike(): number {
    return this._strike;
  }
  private _strike: number;

  public constructor(
    asset: Asset,
    marketIndex: number,
    expiryIndex: number,
    kind: types.Kind,
    address: PublicKey,
    zetaGroup: PublicKey,
    quoteVault: PublicKey,
    baseVault: PublicKey,
    serumMarket: SerumMarket
  ) {
    this._asset = asset;
    this._marketIndex = marketIndex;
    this._expiryIndex = expiryIndex;
    this._kind = kind;
    this._address = address;
    this._zetaGroup = zetaGroup;
    this._quoteVault = quoteVault;
    this._baseVault = baseVault;
    this._serumMarket = serumMarket;
    this._strike = 0;
    this._orderbook = { bids: [], asks: [] };
  }

  public updateStrike() {
    let strike =
      this._marketIndex == constants.PERP_INDEX
        ? Exchange.getSubExchange(this.asset).zetaGroup.perp.strike
        : Exchange.getSubExchange(this.asset).zetaGroup.products[
            this._marketIndex
          ].strike;

    if (!strike.isSet) {
      this._strike = null;
    } else {
      this._strike = convertNativeBNToDecimal(strike.value);
    }
  }

  public async updateOrderbook(loadSerum: boolean = true) {
    // if not loadSerum, we assume that this._bids and this._asks was set elsewhere manually beforehand
    if (loadSerum) {
      [this._bids, this._asks] = await Promise.all([
        this._serumMarket.loadBids(Exchange.provider.connection),
        this._serumMarket.loadAsks(Exchange.provider.connection),
      ]);
    }

    [this._bids, this._asks].map((orderbookSide) => {
      const descending = orderbookSide.isBids ? true : false;
      const levels = []; // (price, size)
      for (const { key, quantity } of orderbookSide.slab.items(descending)) {
        const price = getPriceFromSerumOrderKey(key);
        if (levels.length > 0 && levels[levels.length - 1][0].eq(price)) {
          levels[levels.length - 1][1].iadd(quantity);
        } else {
          levels.push([price, new anchor.BN(quantity.toNumber())]);
        }
      }

      this._orderbook[orderbookSide.isBids ? "bids" : "asks"] = levels.map(
        ([priceLots, sizeLots]) => {
          return {
            price: this._serumMarket.priceLotsToNumber(priceLots),
            size: convertNativeLotSizeToDecimal(
              this._serumMarket.baseSizeLotsToNumber(sizeLots)
            ),
          };
        }
      );
    });
  }

  public getTopLevel(): types.TopLevel {
    let topLevel: types.TopLevel = { bid: null, ask: null };
    if (this._orderbook.bids.length != 0) {
      topLevel.bid = this._orderbook.bids[0];
    }
    if (this._orderbook.asks.length != 0) {
      topLevel.ask = this._orderbook.asks[0];
    }
    return topLevel;
  }

  static convertOrder(market: Market, order: any): types.Order {
    return {
      marketIndex: market.marketIndex,
      market: market.address,
      price: order.price,
      size: convertNativeLotSizeToDecimal(order.size),
      side: order.side == "buy" ? types.Side.BID : types.Side.ASK,
      orderId: order.orderId,
      owner: order.openOrdersAddress,
      clientOrderId: order.clientId,
    };
  }

  public getOrdersForAccount(openOrdersAddress: PublicKey): types.Order[] {
    let orders = [...this._bids, ...this._asks].filter((order) =>
      order.openOrdersAddress.equals(openOrdersAddress)
    );

    return orders.map((order) => {
      return Market.convertOrder(this, order);
    });
  }

  public getMarketOrders(): types.Order[] {
    return [...this._bids, ...this._asks].map((order) => {
      return Market.convertOrder(this, order);
    });
  }

  public getBidOrders(): types.Order[] {
    console.log("*");
    return [...this._bids].map((order) => {
      return Market.convertOrder(this, order);
    });
  }

  public getAskOrders(): types.Order[] {
    return [...this._asks].map((order) => {
      return Market.convertOrder(this, order);
    });
  }

  public async cancelAllExpiredOrders() {
    await this.updateOrderbook();
    let orders = this.getMarketOrders();

    // Assumption of similar MAX number of instructions as regular cancel
    let ixs = await getCancelAllIxs(this.asset, orders, true);
    let txs = splitIxsIntoTx(ixs, constants.MAX_CANCELS_PER_TX);

    await Promise.all(
      txs.map(async (tx) => {
        await processTransaction(Exchange.provider, tx);
      })
    );
  }

  public async cancelAllOrdersHalted() {
    Exchange.getSubExchange(this.asset).assertHalted();

    await this.updateOrderbook();
    let orders = this.getMarketOrders();
    let ixs = await getCancelAllIxs(this.asset, orders, false);
    let txs = splitIxsIntoTx(ixs, constants.MAX_CANCELS_PER_TX);
    await Promise.all(
      txs.map(async (tx) => {
        await processTransaction(Exchange.provider, tx);
      })
    );
  }
}

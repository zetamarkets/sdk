import * as anchor from "@zetamarkets/anchor";
import { Orderbook, Market as SerumMarket, throwIfNull } from "./serum/market";
import {
  AccountInfo,
  ConfirmOptions,
  Context,
  PublicKey,
} from "@solana/web3.js";
import {
  Connection as ConnectionZstd,
  PublicKey as PublicKeyZstd,
} from "zeta-solana-web3";
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
  getSeqNumFromSerumOrderKey,
  isOrderExpired,
} from "./utils";
import * as types from "./types";
import { EventType } from "./events";
import { assetToIndex } from "./assets";
import { Asset } from "./constants";

export class ZetaGroupMarkets {
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
  public get market(): Market {
    return this._market;
  }
  private _market: Market;

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

  private constructor(asset: Asset) {
    this._asset = asset;
    this._lastPollTimestamp = 0;
  }

  /**
   * Will load a new instance of ZetaGroupMarkets
   * Should not be called outside of SubExchange.
   */
  public static async load(
    asset: Asset,
    opts: ConfirmOptions,
    decodedSrmMarket: any,
    bidAccInfo: AccountInfo<Buffer> | undefined,
    askAccInfo: AccountInfo<Buffer> | undefined,
    clockData: types.ClockData
  ): Promise<ZetaGroupMarkets> {
    let instance = new ZetaGroupMarkets(asset);
    let subExchange = Exchange.getSubExchange(asset);

    // Perps product/market is separate
    let marketAddr = Exchange.pricing.products[assetToIndex(asset)].market;
    let serumMarket: SerumMarket;

    serumMarket = SerumMarket.loadFromDecoded(
      decodedSrmMarket,
      {
        commitment: opts.commitment,
        skipPreflight: opts.skipPreflight,
      },
      constants.DEX_PID[Exchange.network] as PublicKeyZstd
    );

    let [baseVaultAddr, _baseVaultNonce] = getZetaVault(
      Exchange.programId,
      serumMarket.baseMintAddress
    );
    let [quoteVaultAddr, _quoteVaultNonce] = getZetaVault(
      Exchange.programId,
      serumMarket.quoteMintAddress
    );

    instance._market = new Market(
      asset,
      marketAddr,
      subExchange.zetaGroupAddress,
      quoteVaultAddr,
      baseVaultAddr,
      serumMarket
    );

    let book = undefined;
    if (bidAccInfo && askAccInfo) {
      book = serumMarket.loadBidsAndAsksFromData(
        clockData,
        bidAccInfo,
        askAccInfo
      );
    } else {
      book = await serumMarket.loadBidsAndAsks(
        Exchange.provider.connection as unknown as ConnectionZstd
      );
    }

    instance._market.bids = book.bids;
    instance._market.asks = book.asks;
    instance._market.updateOrderbook();

    return instance;
  }

  /**
   * Returns the market object for a given index.
   */
  public getMarket(): Market {
    return this._market;
  }

  /**
   * Returns the market index for a given market address.
   */
  public getMarketIndex(market: PublicKey): number {
    let compare = (a: PublicKey, b: PublicKey) =>
      a.toBuffer().compare(b.toBuffer());

    let sub = Exchange.getSubExchange(this.asset);
    if (compare(market, sub.markets.market.address) == 0) {
      return constants.PERP_INDEX;
    } else {
      throw Error(
        "Cannot get market index of non perp market on perp only market!"
      );
    }
  }
}

/**
 * Wrapper class for a zeta market on serum.
 */
export class Market {
  /**
   * The underlying asset this set of markets belong to.
   */
  public get asset(): Asset {
    return this._asset;
  }
  private _asset: Asset;

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

  public get bidsSlot(): number {
    return this._bidsSlot;
  }
  private _bidsSlot: number;
  public get asksSlot(): number {
    return this._asksSlot;
  }
  private _asksSlot: number;
  private _bidsSubscriptionId: number;
  private _asksSubscriptionId: number;

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

  public set TIFBufferSeconds(buffer: number) {
    this._TIFBufferSeconds = buffer;
  }
  public get TIFBufferSeconds(): number {
    return this._TIFBufferSeconds;
  }
  private _TIFBufferSeconds: number;

  public constructor(
    asset: Asset,
    address: PublicKey,
    zetaGroup: PublicKey,
    quoteVault: PublicKey,
    baseVault: PublicKey,
    serumMarket: SerumMarket
  ) {
    this._asset = asset;
    this._address = address;
    this._zetaGroup = zetaGroup;
    this._quoteVault = quoteVault;
    this._baseVault = baseVault;
    this._serumMarket = serumMarket;
    this._strike = 0;
    this._orderbook = { bids: [], asks: [] };
    this._bidsSlot = 0;
    this._asksSlot = 0;
    this._TIFBufferSeconds = 0;
  }

  public updateStrike() {
    let strike = Exchange.pricing.products[assetToIndex(this._asset)].strike;

    if (!strike.isSet) {
      this._strike = null;
    } else {
      this._strike = convertNativeBNToDecimal(strike.value);
    }
  }

  public subscribeOrderbook(
    callback?: (asset: Asset, type: EventType, slot: number, data: any) => void
  ) {
    let connection = Exchange.orderbookConnection
      ? Exchange.orderbookConnection
      : Exchange.provider.connection;
    this._bidsSubscriptionId = connection.onAccountChange(
      this.serumMarket.decoded.bids,
      async (accountInfo: AccountInfo<Buffer>, context: Context) => {
        let decodedMarket = Orderbook.decode(
          this.serumMarket,
          throwIfNull(accountInfo).data
        );
        this._bids = decodedMarket;
        this._bidsSlot = context.slot;
        this.updateOrderbook();
        if (callback !== undefined) {
          callback(this.asset, EventType.ORDERBOOK, context.slot, null);
        }
      },
      connection.commitment
    );

    this._asksSubscriptionId = connection.onAccountChange(
      this.serumMarket.decoded.asks,
      async (accountInfo: AccountInfo<Buffer>, context: Context) => {
        let decodedMarket = Orderbook.decode(
          this.serumMarket,
          throwIfNull(accountInfo).data
        );
        this._asks = decodedMarket;
        this._asksSlot = context.slot;
        this.updateOrderbook();
        if (callback !== undefined) {
          callback(this.asset, EventType.ORDERBOOK, context.slot, null);
        }
      },
      connection.commitment
    );
  }

  public async unsubscribeOrderbook(wipeState: boolean = false) {
    let connection = Exchange.orderbookConnection
      ? Exchange.orderbookConnection
      : Exchange.provider.connection;
    if (this._bidsSubscriptionId !== undefined) {
      await connection.removeAccountChangeListener(this._bidsSubscriptionId);
      this._bidsSubscriptionId = undefined;
    }

    if (this._asksSubscriptionId !== undefined) {
      await connection.removeAccountChangeListener(this._asksSubscriptionId);
      this._asksSubscriptionId = undefined;
    }

    // Only after we're definitely no longer updating
    if (wipeState) {
      this._bids = undefined;
      this._asks = undefined;
      this._bidsSlot = 0;
      this._asksSlot = 0;
      this.updateOrderbook();
    }
  }

  public async forceFetchOrderbook() {
    let orderbook = await this.serumMarket.loadBidsAndAsks(Exchange.connection);
    this._bids = orderbook.bids;
    this._asks = orderbook.asks;
    this.updateOrderbook();
  }

  public updateOrderbook() {
    // On a fresh subscription if there isn't data yet
    if (this._bids == undefined || this._asks == undefined) {
      this._orderbook = { bids: [], asks: [] };
      return;
    }

    [this._bids, this._asks].map((orderbookSide) => {
      const descending = orderbookSide.isBids ? true : false;
      const levels = []; // (price, size, tifOffset, owners)
      for (const {
        key,
        quantity,
        tifOffset,
        owner,
      } of orderbookSide.slab.items(descending)) {
        let seqNum = getSeqNumFromSerumOrderKey(key, orderbookSide.isBids);
        if (
          isOrderExpired(
            tifOffset.toNumber(),
            seqNum,
            this._serumMarket.epochStartTs.toNumber(),
            this._serumMarket.startEpochSeqNum,
            this._TIFBufferSeconds
          )
        ) {
          continue;
        }

        const price = getPriceFromSerumOrderKey(key);
        if (levels.length > 0 && levels[levels.length - 1][0].eq(price)) {
          levels[levels.length - 1][1].iadd(quantity);
          levels[levels.length - 1][2].add(owner.toString());
        } else {
          levels.push([
            price,
            new anchor.BN(quantity.toNumber()),
            new Set<string>([owner.toString()]),
          ]);
        }
      }

      this._orderbook[orderbookSide.isBids ? "bids" : "asks"] = levels.map(
        ([priceLots, sizeLots, owners]) => {
          return {
            price: this._serumMarket.priceLotsToNumber(priceLots),
            size: convertNativeLotSizeToDecimal(
              this._serumMarket.baseSizeLotsToNumber(sizeLots)
            ),
            owners: owners,
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
      marketIndex: constants.PERP_INDEX,
      market: market.address,
      price: order.price,
      size: convertNativeLotSizeToDecimal(order.size),
      side: order.side == "buy" ? types.Side.BID : types.Side.ASK,
      orderId: order.orderId,
      owner: order.openOrdersAddress,
      clientOrderId: order.clientId,
      tifOffset: order.tifOffset,
      asset: market.asset,
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
    return [...this._bids].map((order) => {
      return Market.convertOrder(this, order);
    });
  }

  public getAskOrders(): types.Order[] {
    return [...this._asks].map((order) => {
      return Market.convertOrder(this, order);
    });
  }

  public async cancelAllOrdersHalted() {
    Exchange.getSubExchange(this.asset).assertHalted();

    this.updateOrderbook();
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

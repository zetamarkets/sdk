import { PublicKey, Connection, AccountInfo, Context } from "@solana/web3.js";
import { parsePythData, Price } from "./oracle-utils";
import { Network } from "./network";
import { exchange as Exchange } from "./exchange";
import * as constants from "./constants";
import { Asset, assetToOracleFeed, oracleFeedToAsset } from "./assets";

export class Oracle {
  private _connection: Connection;
  private _network: Network;
  private _data: Map<string, OraclePrice>;
  private _subscriptionIds: Map<string, number>;
  private _callback: (asset: Asset, price: OraclePrice) => void;

  public constructor(network: Network, connection: Connection) {
    this._network = network;
    this._connection = connection;
    this._subscriptionIds = new Map();
    this._data = new Map();
    this._callback = undefined;
  }

  public getAvailablePriceFeeds(): string[] {
    return Object.keys(constants.PYTH_PRICE_FEEDS[this._network]);
  }

  public getPrice(feed: string): OraclePrice {
    if (!this._data.has(feed)) {
      return null;
    }
    return this._data.get(feed);
  }

  public getPriceAge(feed: string): number {
    return Date.now() / 1000 - this.getPrice(feed).lastUpdatedTime;
  }

  // Allows fetching of any pyth oracle price.
  public async fetchPrice(oracleKey: PublicKey): Promise<number> {
    let accountInfo = await this._connection.getAccountInfo(oracleKey);
    let priceData = parsePythData(accountInfo.data);
    return priceData.price;
  }

  // Fetch and update an oracle price manually
  public async pollPrice(
    feed: string,
    triggerCallback = true
  ): Promise<OraclePrice> {
    if (!(feed in constants.PYTH_PRICE_FEEDS[this._network])) {
      throw Error("Invalid Oracle feed, no matching pubkey!");
    }
    let asset = oracleFeedToAsset(feed); // throws if it can't map to a known asset

    let priceAddress = constants.PYTH_PRICE_FEEDS[this._network][feed];
    let accountInfo = await this._connection.getAccountInfo(priceAddress);
    let priceData = parsePythData(accountInfo.data);
    let oracleData = {
      feed,
      price: priceData.price,
      lastUpdatedTime: Exchange.clockTimestamp,
      lastUpdatedSlot: priceData.publishSlot,
    };
    this._data.set(feed, oracleData);

    if (triggerCallback) {
      this._callback(asset, oracleData);
    }
    return oracleData;
  }

  public async subscribePriceFeeds(
    assets: Asset[],
    callback: (asset: Asset, price: OraclePrice) => void
  ) {
    if (this._callback != undefined) {
      throw Error("Oracle price feeds already subscribed to!");
    }
    this._callback = callback;

    await Promise.all(
      assets.map(async (asset) => {
        let feed = assetToOracleFeed(asset);
        console.log(`Oracle subscribing to feed ${feed}`);
        let priceAddress = constants.PYTH_PRICE_FEEDS[this._network][feed];
        let subscriptionId = this._connection.onAccountChange(
          priceAddress,
          (accountInfo: AccountInfo<Buffer>, _context: Context) => {
            let priceData = parsePythData(accountInfo.data);
            let currPrice = this._data.get(feed);
            if (
              currPrice !== undefined &&
              currPrice.price === priceData.price
            ) {
              return;
            }
            let oracleData = {
              feed,
              price: priceData.price,
              lastUpdatedTime: Exchange.clockTimestamp,
              lastUpdatedSlot: priceData.publishSlot,
            };
            this._data.set(feed, oracleData);
            this._callback(asset, oracleData);
          },
          Exchange.provider.connection.commitment
        );

        this._subscriptionIds.set(feed, subscriptionId);
        // TODO set this so localnet has data for the oracle
        // Remove once there is an oracle simulator.
        await this.pollPrice(feed, true);
      })
    );
  }

  public async close() {
    for (let subscriptionId of this._subscriptionIds.values()) {
      await this._connection.removeAccountChangeListener(subscriptionId);
    }
  }
}

export interface OraclePrice {
  feed: string;
  price: number;
  lastUpdatedTime: number;
  lastUpdatedSlot: bigint;
}

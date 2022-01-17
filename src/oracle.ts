import { PublicKey, Connection, AccountInfo, Context } from "@solana/web3.js";
import { parsePythData, Price } from "./oracle-utils";
import { Network } from "./network";
import { exchange as Exchange } from "./exchange";
import * as constants from "./constants";

export class Oracle {
  private _connection: Connection;
  private _network: Network;
  private _data: Map<string, OraclePrice>;
  private _subscriptionIds: Map<string, number>;
  private _callback: (price: OraclePrice) => void;

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

  // Allows fetching of any pyth oracle price.
  public async fetchPrice(oracleKey: PublicKey): Promise<number> {
    let accountInfo = await this._connection.getAccountInfo(oracleKey);
    let priceData = parsePythData(accountInfo.data);
    return priceData.price;
  }

  public async subscribePriceFeeds(callback: (price: OraclePrice) => void) {
    if (this._callback != undefined) {
      throw Error("Oracle price feeds already subscribed to!");
    }
    this._callback = callback;
    let feeds = Object.keys(constants.PYTH_PRICE_FEEDS[this._network]);
    for (var i = 0; i < feeds.length; i++) {
      let feed = feeds[i];
      console.log(`Oracle subscribing to feed ${feed}`);
      let priceAddress = constants.PYTH_PRICE_FEEDS[this._network][feed];
      let subscriptionId = this._connection.onAccountChange(
        priceAddress,
        (accountInfo: AccountInfo<Buffer>, _context: Context) => {
          let priceData = parsePythData(accountInfo.data);
          let currPrice = this._data.get(feed);
          if (currPrice !== undefined && currPrice.price === priceData.price) {
            return;
          }
          let oracleData = {
            feed,
            price: priceData.price,
          };
          this._data.set(feed, oracleData);
          this._callback(oracleData);
        },
        Exchange.provider.connection.commitment
      );
      this._subscriptionIds.set(feed, subscriptionId);

      // TODO set this so localnet has data for the oracle
      // Remove once there is an oracle simulator.
      let accountInfo = await this._connection.getAccountInfo(priceAddress);
      let priceData = parsePythData(accountInfo.data);
      let oracleData = {
        feed,
        price: priceData.price,
      };
      this._data.set(feed, oracleData);
    }
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
}

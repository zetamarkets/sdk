import { PublicKey, Connection, AccountInfo, Context } from "@solana/web3.js";
import { parsePythData, Price } from "./oracle-utils";
import { Network } from "./network";
import { exchange as Exchange } from "./exchange";
import * as constants from "./constants";
import { Asset } from "./constants";
import { assetToName } from "./assets";

export class Oracle {
  private _connection: Connection;
  private _network: Network;
  private _data: Map<Asset, OraclePrice>;
  private _subscriptionIds: Map<Asset, number>;
  private _callback: (asset: Asset, price: OraclePrice, slot: number) => void;

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

  public getPrice(asset: Asset): OraclePrice {
    if (!this._data.has(asset)) {
      return null;
    }
    return this._data.get(asset);
  }

  public getPriceAge(asset: Asset): number {
    return Date.now() / 1000 - this.getPrice(asset).lastUpdatedTime;
  }

  // Allows fetching of any pyth oracle price.
  public async fetchPrice(oracleKey: PublicKey): Promise<number> {
    let accountInfo = await this._connection.getAccountInfo(oracleKey);
    let priceData = parsePythData(accountInfo.data);
    return priceData.price;
  }

  // Fetch and update an oracle price manually
  public async pollPrice(
    asset: Asset,
    triggerCallback = true
  ): Promise<OraclePrice> {
    if (!(asset in constants.PYTH_PRICE_FEEDS[this._network])) {
      throw Error("Invalid Oracle feed, no matching asset!");
    }

    let priceAddress = constants.PYTH_PRICE_FEEDS[this._network][asset];
    let accountInfo = await this._connection.getAccountInfo(priceAddress);
    let priceData = parsePythData(accountInfo.data);
    let oracleData = {
      asset,
      price: priceData.price,
      lastUpdatedTime: Exchange.clockTimestamp,
      lastUpdatedSlot: priceData.publishSlot,
    };
    this._data.set(asset, oracleData);

    if (triggerCallback) {
      this._callback(asset, oracleData, Number(priceData.publishSlot));
    }
    return oracleData;
  }

  public async subscribePriceFeeds(
    assetList: Asset[],
    callback: (asset: Asset, price: OraclePrice, slot: number) => void
  ) {
    if (this._callback != undefined) {
      throw Error("Oracle price feeds already subscribed to!");
    }
    this._callback = callback;

    await Promise.all(
      assetList.map(async (asset) => {
        console.log(`Oracle subscribing to feed ${assetToName(asset)}`);
        let priceAddress = constants.PYTH_PRICE_FEEDS[this._network][asset];
        let subscriptionId = this._connection.onAccountChange(
          priceAddress,
          (accountInfo: AccountInfo<Buffer>, context: Context) => {
            let priceData = parsePythData(accountInfo.data);
            let currPrice = this._data.get(asset);
            if (
              currPrice !== undefined &&
              currPrice.price === priceData.price
            ) {
              return;
            }
            let oracleData = {
              asset,
              price: priceData.price,
              lastUpdatedTime: Exchange.clockTimestamp,
              lastUpdatedSlot: priceData.publishSlot,
            };
            this._data.set(asset, oracleData);
            this._callback(asset, oracleData, context.slot);
          },
          Exchange.provider.connection.commitment
        );

        this._subscriptionIds.set(asset, subscriptionId);
        // Set this so the oracle contains a price on initialization.
        await this.pollPrice(asset, true);
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
  asset: Asset;
  price: number;
  lastUpdatedTime: number;
  lastUpdatedSlot: bigint;
}

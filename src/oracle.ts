import { Connection, PublicKey, AccountInfo, Context } from "@solana/web3.js";
import { Network } from "./network";
import { exchange as Exchange } from "./exchange";
import * as constants from "./constants";
import { Asset } from "./constants";
import { assetMultiplier, assetToName } from "./assets";
import * as types from "./types";
import { PythSolanaReceiver } from "@pythnetwork/pyth-solana-receiver";
import { PriceUpdateAccount } from "@pythnetwork/pyth-solana-receiver/lib/PythSolanaReceiver";
import { parsePriceData } from "@pythnetwork/client";

// TODO: Replace the LOCALNET / MAINNET PYTH DIFF STUFF ONCE WE START CRANKING NEW PRICE FEEDS

export class Oracle {
  private _connection: Connection;
  private _network: Network;
  private _data: Map<Asset, OraclePrice>;
  private _eventEmitters: Map<Asset, any>;
  private _subscriptionIds: Map<Asset, number>;
  private _callback: (asset: Asset, price: OraclePrice, slot: number) => void;
  private _pythReceiver: PythSolanaReceiver;

  public constructor(network: Network, connection: Connection) {
    this._network = network;
    this._connection = connection;
    this._eventEmitters = new Map();
    this._subscriptionIds = new Map();
    this._data = new Map();
    this._callback = undefined;
    this._pythReceiver = new PythSolanaReceiver({
      connection,
      wallet: new types.PythDummyWallet(),
    });
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

  public async getPriceUpdateAccount(
    account: PublicKey
  ): Promise<PriceUpdateAccount> {
    return await this._pythReceiver.receiver.account.priceUpdateV2.fetch(
      account
    );
  }

  public getOwnOraclePriceObjectFromBuffer(
    asset: Asset,
    data: Buffer
  ): OraclePrice {
    let priceData = parsePriceData(data);
    const price = priceData.aggregate.price * assetMultiplier(asset);
    return {
      asset,
      price,
      lastUpdatedTime: Exchange.clockTimestamp,
      lastUpdatedSlot: BigInt(priceData.aggregate.publishSlot),
    };
  }

  // Fetch and update an oracle price manually
  public async pollPrice(
    asset: Asset,
    triggerCallback = true
  ): Promise<OraclePrice> {
    if (!(asset in constants.PYTH_PRICE_FEEDS[this._network])) {
      throw Error("Invalid Oracle feed, no matching asset!");
    }

    let priceAddress: PublicKey =
      constants.PYTH_PRICE_FEEDS[this._network][asset];

    let oracleData: OraclePrice;
    let slot: number;

    if (this._network == Network.LOCALNET) {
      let priceUpdate = await this.getPriceUpdateAccount(priceAddress);

      const price =
        priceUpdate.priceMessage.price.toNumber() *
        10 ** priceUpdate.priceMessage.exponent *
        assetMultiplier(asset);

      oracleData = {
        asset,
        price,
        lastUpdatedTime: priceUpdate.priceMessage.publishTime.toNumber(),
        lastUpdatedSlot: BigInt(priceUpdate.postedSlot.toNumber()),
      };
      slot = priceUpdate.postedSlot.toNumber();
    } else {
      let accountInfo = await this._connection.getAccountInfo(priceAddress);
      oracleData = this.getOwnOraclePriceObjectFromBuffer(
        asset,
        accountInfo.data
      );
    }

    this._data.set(asset, oracleData);

    if (triggerCallback) {
      this._callback(asset, oracleData, slot);
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

        let priceAddress: PublicKey =
          constants.PYTH_PRICE_FEEDS[this._network][asset];

        if (this._network == Network.LOCALNET) {
          let eventEmitter =
            this._pythReceiver.receiver.account.priceUpdateV2.subscribe(
              priceAddress,
              this._connection.commitment
            );

          eventEmitter.on("change", async (priceUpdate: PriceUpdateAccount) => {
            const price =
              priceUpdate.priceMessage.price.toNumber() *
              10 ** priceUpdate.priceMessage.exponent *
              assetMultiplier(asset);

            const publishSlot = priceUpdate.postedSlot.toNumber();
            let currPrice = this._data.get(asset);
            if (currPrice !== undefined && currPrice.price === price) {
              return;
            }
            const oracleData = {
              asset,
              price,
              lastUpdatedTime: priceUpdate.priceMessage.publishTime.toNumber(),
              lastUpdatedSlot: publishSlot,
            };
            this._data.set(asset, oracleData);
            this._callback(asset, oracleData, publishSlot);
          });
          this._eventEmitters.set(asset, eventEmitter);
        } else {
          let subscriptionId = this._connection.onAccountChange(
            priceAddress,
            (accountInfo: AccountInfo<Buffer>, context: Context) => {
              let oracleData = this.getOwnOraclePriceObjectFromBuffer(
                asset,
                accountInfo.data
              );

              let currPrice = this._data.get(asset);
              if (
                currPrice !== undefined &&
                currPrice.price === oracleData.price
              ) {
                return;
              }

              this._data.set(asset, oracleData);
              this._callback(asset, oracleData, context.slot);
            },
            Exchange.provider.connection.commitment
          );

          this._subscriptionIds.set(asset, subscriptionId);
        }

        // Set this so the oracle contains a price on initialization.
        await this.pollPrice(asset, true);
      })
    );
  }

  public async close() {
    if (this._network == Network.LOCALNET) {
      await Promise.all(
        Exchange.assets.map(async (asset) => {
          let priceAddress = constants.PYTH_PRICE_FEEDS[this._network][asset];
          return this._pythReceiver.receiver.account.priceUpdateV2.unsubscribe(
            priceAddress
          );
        })
      );
      for (let eventEmitter of this._eventEmitters.values()) {
        await eventEmitter.removeListener("change");
      }
      this._eventEmitters = new Map();
    }

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

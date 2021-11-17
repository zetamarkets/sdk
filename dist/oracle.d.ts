import { Connection } from "@solana/web3.js";
import { Network } from "./network";
export declare class Oracle {
    private _connection;
    private _network;
    private _data;
    private _subscriptionIds;
    private _callback;
    constructor(network: Network, connection: Connection);
    getAvailablePriceFeeds(): string[];
    getPrice(feed: string): OraclePrice;
    subscribePriceFeeds(callback: (price: OraclePrice) => void): Promise<void>;
    close(): Promise<void>;
}
export interface OraclePrice {
    feed: string;
    price: number;
}

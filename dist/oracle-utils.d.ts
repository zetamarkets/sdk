/// <reference types="node" />
import { Buffer } from "buffer";
export declare function readBigInt64LE(buffer: Buffer, offset?: number): bigint;
export declare function readBigUInt64LE(buffer: Buffer, offset?: number): bigint;
export interface Price {
    price: number;
    publishSlot: bigint;
}
export declare function parsePythData(data: Buffer): Price;

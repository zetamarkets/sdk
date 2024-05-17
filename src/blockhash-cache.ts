import { BlockhashWithExpiryBlockHeight } from "@solana/web3.js";

export class BlockhashCache {
  private ttlSecs: number;
  private blockhashes: Array<{
    ts: number;
    blockhash: BlockhashWithExpiryBlockHeight;
  }>;

  constructor(ttl: number = 60) {
    this.ttlSecs = ttl;
    this.blockhashes = [];
  }

  set(blockhash: BlockhashWithExpiryBlockHeight, ts: number): void {
    this.blockhashes.push({ ts, blockhash });

    // Keep only N seconds of blockhashes
    let pops = 0;
    for (const item of this.blockhashes) {
      if (item.ts < ts - this.ttlSecs) {
        pops++;
      } else {
        break;
      }
    }

    for (let i = 0; i < pops; i++) {
      this.blockhashes.shift();
    }
  }

  get(): BlockhashWithExpiryBlockHeight {
    if (this.blockhashes.length > 0) {
      return this.blockhashes[0].blockhash;
    } else {
      throw new Error("No blockhash available");
    }
  }
}

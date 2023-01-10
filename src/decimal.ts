// Typescript port for rust decimal deserialization.

import { AnchorDecimal } from "./program-types";
import { BN } from "@zetamarkets/anchor";

const SCALE_MASK: number = 0x00ff_0000;
const SCALE_SHIFT: number = 16;
const SIGN_MASK: number = 0x8000_0000;

export class Decimal {
  private _flags: number;
  private _hi: number;
  private _lo: number;
  private _mid: number;

  public constructor(flags: number, hi: number, lo: number, mid: number) {
    this._flags = flags;
    this._hi = hi;
    this._lo = lo;
    this._mid = mid;
  }

  public static fromAnchorDecimal(decimal: AnchorDecimal): Decimal {
    return new Decimal(decimal.flags, decimal.hi, decimal.lo, decimal.mid);
  }

  public scale(): number {
    return (this._flags & SCALE_MASK) >> SCALE_SHIFT;
  }

  public isSignNegative(): boolean {
    return (this._flags & SIGN_MASK) != 0;
  }

  public isSignPositive(): boolean {
    return (this._flags & SIGN_MASK) == 0;
  }

  public toBN(): BN {
    let bytes = [
      (this._hi >> 24) & 0xff,
      (this._hi >> 16) & 0xff,
      (this._hi >> 8) & 0xff,
      this._hi & 0xff,
      (this._mid >> 24) & 0xff,
      (this._mid >> 16) & 0xff,
      (this._mid >> 8) & 0xff,
      this._mid & 0xff,
      (this._lo >> 24) & 0xff,
      (this._lo >> 16) & 0xff,
      (this._lo >> 8) & 0xff,
      this._lo & 0xff,
    ];

    return this.isSignNegative()
      ? new BN(-1).mul(new BN(new Uint8Array(bytes)))
      : new BN(new Uint8Array(bytes));
  }

  public isUnset(): boolean {
    return this._hi == 0 && this._mid == 0 && this._lo == 0 && this._flags == 0;
  }

  public toNumber(): number {
    if (this.isUnset()) {
      return 0;
    }

    let scale = this.scale();
    if (scale == 0) {
      // TODO don't need yet as we don't expect scale 0 decimals.
      throw Error("Scale 0 is not handled.");
    }

    let bn = this.toBN();
    // We use toString because only 53 bits can be stored for floats.
    return (bn.toString() as any) / 10 ** scale;
  }
}

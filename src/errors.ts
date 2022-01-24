import idl from "./idl/zeta.json";
import * as anchor from "@project-serum/anchor";

export const DEX_ERRORS: Map<number, string> = new Map([
  [59, "Order doesn't exist"],
  [61, "Order would self-trade"],
]);

export enum NATIVE_ERROR_CODES {
  ZeroLamportsBalance = 10000,
  InsufficientLamports = 10001,
  UnconfirmedTransaction = 10002,
  FailedToGetRecentBlockhash = 10003,
}

export const NATIVE_ERRORS: Map<number, [string, string]> = new Map([
  [
    10000,
    [
      "Attempt to debit an account but found no record of a prior credit.",
      "Zero SOL in wallet.",
    ],
  ],
  [10001, ["insufficient lamports", "Insufficient SOL in wallet."]],
  [
    10002,
    [
      "Transaction was not confirmed",
      "Transaction was not confirmed. Please check transaction signature.",
    ],
  ],
  [
    10003,
    [
      "failed to get recent blockhash",
      "Failed to get recent blockhash. Please retry.",
    ],
  ],
]);

export function parseIdlErrors(idl: anchor.Idl): Map<number, string> {
  const errors = new Map();
  if (idl.errors) {
    idl.errors.forEach((e) => {
      let msg = e.msg ?? e.name;
      errors.set(e.code, msg);
    });
  }
  return errors;
}

/**
 * Extract error code from custom non-anchor errors
 */
export function parseCustomError(untranslatedError: string) {
  let components = untranslatedError.toString().split("custom program error: ");
  if (components.length !== 2) {
    return null;
  }

  let errorCode: number;
  try {
    errorCode = parseInt(components[1]);
  } catch (parseErr) {
    return null;
  }

  // Parse user error.
  let errorMsg = DEX_ERRORS.get(errorCode);
  if (errorMsg !== undefined) {
    return new anchor.ProgramError(
      errorCode,
      errorMsg,
      errorCode + ": " + errorMsg
    );
  }
  return null;
}

export class NativeError extends Error {
  constructor(
    readonly code: number,
    readonly msg: string,
    readonly data: Object = null,
    ...params: any[]
  ) {
    super(...params);
  }

  public static parse(error: any): NativeError | null {
    let errorString = error.toString();
    if (error.logs) {
      errorString += error.logs.join(" ");
    }
    for (const [code, [errorSubstring, msg]] of NATIVE_ERRORS.entries()) {
      if (errorString.includes(errorSubstring)) {
        if (code == NATIVE_ERROR_CODES.UnconfirmedTransaction) {
          return new NativeError(code, msg, {
            transactionSignature:
              NativeError.parseTransactionSignature(errorString),
          });
        } else {
          return new NativeError(code, msg);
        }
      }
    }
    return null;
  }

  public static parseTransactionSignature(error: string): string | null {
    let components = error.split("Check signature ");
    if (components.length != 2) {
      return null;
    }
    try {
      let txSig = components[1].split(" ")[0];
      return txSig;
    } catch (e) {
      return null;
    }
  }
}

export const idlErrors = parseIdlErrors(idl as anchor.Idl);

import idl from "./idl/zeta.json";
import * as anchor from "@zetamarkets/anchor";

export const DEX_ERRORS: Map<number, string> = new Map([
  [41, "Client order ID not found"],
  [59, "Order doesn't exist"],
  [61, "Order would self-trade"],
]);

export enum NATIVE_ERROR_CODES {
  ZeroLamportsBalance = 0,
  InsufficientLamports = 1,
  UnconfirmedTransaction = 2,
  FailedToGetRecentBlockhash = 3,
}

export const NATIVE_ERRORS: Map<number, [string, string]> = new Map([
  [
    0,
    [
      "Attempt to debit an account but found no record of a prior credit.",
      "Zero SOL in wallet.",
    ],
  ],
  [1, ["insufficient lamports", "Insufficient SOL in wallet."]],
  [
    2,
    [
      "Transaction was not confirmed",
      "Transaction was not confirmed. Please check transaction signature.",
    ],
  ],
  [
    3,
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
    return new anchor.ProgramError(errorCode, errorMsg);
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
      if (
        errorString.includes(errorSubstring) ||
        errorString == code.toString()
      ) {
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

  public toString(): string {
    return this.msg;
  }
}

/**
 * Example Anchor error.
    {
      errorLogs: [
        'Program log: AnchorError thrown in programs/zeta/src/lib.rs:1008. Error Code: StrikeInitializationNotReady. Error Number: 6036. Error Message: Strike initialization not ready.'
      ],
      logs: [
        'Program BG3oRikW8d16YjUEmX3ZxHm9SiJzrGtMhsSR8aCw1Cd7 invoke [1]',
        'Program log: Instruction: InitializeMarketStrikes',
        'Program log: ClockTs=1651837190, StrikeInitTs=1651837207',
        'Program log: AnchorError thrown in programs/zeta/src/lib.rs:1008. Error Code: StrikeInitializationNotReady. Error Number: 6036. Error Message: Strike initialization not ready.',
        'Program BG3oRikW8d16YjUEmX3ZxHm9SiJzrGtMhsSR8aCw1Cd7 consumed 7006 of 1400000 compute units',
        'Program BG3oRikW8d16YjUEmX3ZxHm9SiJzrGtMhsSR8aCw1Cd7 failed: custom program error: 0x1794'
      ],
      error: {
        errorCode: { code: 'StrikeInitializationNotReady', number: 6036 },
        errorMessage: 'Strike initialization not ready',
        comparedValues: undefined,
        origin: { file: 'programs/zeta/src/lib.rs', line: 1008 }
      },
      _programErrorStack: ProgramErrorStack { stack: [ [PublicKey] ] }
    }
 * Anchor error is rich but in information but breaks the assumptions on errors by existing clients.
 */
export class NativeAnchorError extends Error {
  constructor(
    readonly code: number,
    readonly msg: string,
    readonly logs: string[],
    readonly errorLogs: string[]
  ) {
    super(errorLogs.join("\n"));
  }

  public static parse(error: anchor.AnchorError): NativeAnchorError {
    let err = new NativeAnchorError(
      error.error.errorCode.number,
      error.error.errorMessage,
      error.logs,
      error.errorLogs
    );
    return err;
  }

  public toString(): string {
    return this.msg;
  }
}

export const idlErrors = parseIdlErrors(idl as anchor.Idl);

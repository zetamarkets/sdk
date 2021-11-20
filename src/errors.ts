import idl from "./idl/zeta.json";
import * as anchor from "@project-serum/anchor";

export const DEX_ERRORS: Map<number, string> = new Map([
  [59, "Order doesn't exist"],
  [61, "Order would self-trade"],
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
}

export const idlErrors = parseIdlErrors(idl as anchor.Idl);

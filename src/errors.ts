import idl from "./idl/zeta.json";
import * as anchor from "@project-serum/anchor";

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

export const idlErrors = parseIdlErrors(idl as anchor.Idl);

// Singleton
import { exchange as Exchange } from "./exchange";
import { Client } from "./client";
import { InsuranceClient } from "./insurance-client";
import { Network } from "./network";
import { Decimal } from "./decimal";
import { idlErrors as Errors } from "./errors";
import { Oracle, OraclePrice } from "./oracle";
import idl from "./idl/zeta.json";
import { Wallet } from "@project-serum/anchor";
import { Market } from "./market";

import * as utils from "./utils";
import * as constants from "./constants";
import * as types from "./types";
import * as instructions from "./program-instructions";
import * as programTypes from "./program-types";
import * as risk from "./risk";
import * as events from "./events";
import * as subscription from "./subscription";

export {
  utils,
  Exchange,
  constants,
  types,
  Client,
  Decimal,
  instructions,
  InsuranceClient,
  Network,
  Errors,
  Oracle,
  OraclePrice,
  programTypes,
  risk,
  events,
  idl,
  Wallet,
  Market,
  subscription,
};

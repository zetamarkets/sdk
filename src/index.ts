// Singleton
import { exchange as Exchange } from "./exchange";
import { SubExchange } from "./subexchange";
import { CrossClient } from "./cross-client";
import { InsuranceClient } from "./insurance-client";
import { Network } from "./network";
import { Decimal } from "./decimal";
import { Oracle, OraclePrice } from "./oracle";
import idl from "./idl/zeta.json";
import { Wallet } from "@zetamarkets/anchor";
import { Market } from "./market";

import * as network from "./network";
import * as assets from "./assets";
import * as errors from "./errors";
import * as utils from "./utils";
import * as constants from "./constants";
import * as types from "./types";
import * as instructions from "./program-instructions";
import * as programTypes from "./program-types";
import * as risk from "./risk";
import * as riskUtils from "./risk-utils";
import * as events from "./events";
import * as subscription from "./subscription";
import { Market as SerumMarket, OpenOrders } from "./serum/market";

export {
  assets,
  utils,
  SubExchange,
  Exchange,
  constants,
  types,
  CrossClient,
  Decimal,
  instructions,
  InsuranceClient,
  network,
  Network,
  errors,
  Oracle,
  OraclePrice,
  programTypes,
  risk,
  riskUtils,
  events,
  idl,
  Wallet,
  Market,
  subscription,
  SerumMarket,
  OpenOrders,
};

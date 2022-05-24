import * as anchor from "@project-serum/anchor";
import {
  PublicKey,
  Transaction,
  Connection,
  ConfirmOptions,
  SYSVAR_CLOCK_PUBKEY,
  AccountInfo,
  AccountMeta,
} from "@solana/web3.js";
import * as utils from "./utils";
import * as constants from "./constants";
import {
  Greeks,
  ExpirySeries,
  State,
  ZetaGroup,
  MarketIndexes,
} from "./program-types";
import { ZetaGroupMarkets } from "./market";
import { RiskCalculator } from "./risk";
import { EventType } from "./events";
import { Network } from "./network";
import { Oracle, OraclePrice } from "./oracle";
import idl from "./idl/zeta.json";
import { Zeta } from "./types/zeta";
import { ClockData, MarginParams, DummyWallet, Wallet } from "./types";
import { Asset, assetToName } from "./assets";
import { Exchange } from "./exchange";
import * as instructions from "./program-instructions";
import * as fs from "fs";
import * as os from "os";

export class Parent {
  /**
   * Whether the object has been loaded.
   */
  public get exchanges(): Map<Asset, Exchange> {
    return this._exchanges;
  }
  private _exchanges: Map<Asset, Exchange> = new Map();

  public async addExchange(asset: Asset, exchange: Exchange) {
    // TODO check if already exists?
    this._exchanges[asset] = exchange;
  }

  public async getExchange(asset: Asset) {
    return this._exchanges[asset];
  }
}

// Parent singleton.
export const parent = new Parent();

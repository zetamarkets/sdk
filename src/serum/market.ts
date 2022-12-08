import { blob, seq, struct, u8 } from "buffer-layout";
import { accountFlagsLayout, publicKeyLayout, u128, u64 } from "./layout";
import { Slab, SLAB_LAYOUT } from "./slab";
import BN from "bn.js";
import {
  Account,
  AccountInfo,
  Commitment,
  Connection,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { decodeEventQueue, decodeRequestQueue } from "./queue";
import { Buffer } from "buffer";

export const _MARKET_STAT_LAYOUT_V1 = struct([
  blob(5),

  accountFlagsLayout("accountFlags"),

  publicKeyLayout("ownAddress"),

  u64("vaultSignerNonce"),

  publicKeyLayout("baseMint"),
  publicKeyLayout("quoteMint"),

  publicKeyLayout("baseVault"),
  u64("baseDepositsTotal"),
  u64("baseFeesAccrued"),

  publicKeyLayout("quoteVault"),
  u64("quoteDepositsTotal"),
  u64("quoteFeesAccrued"),

  u64("quoteDustThreshold"),

  publicKeyLayout("requestQueue"),
  publicKeyLayout("eventQueue"),

  publicKeyLayout("bids"),
  publicKeyLayout("asks"),

  u64("baseLotSize"),
  u64("quoteLotSize"),

  u64("feeRateBps"),

  blob(7),
]);

export const MARKET_STATE_LAYOUT_V2 = struct([
  blob(5),

  accountFlagsLayout("accountFlags"),

  publicKeyLayout("ownAddress"),

  u64("vaultSignerNonce"),

  publicKeyLayout("baseMint"),
  publicKeyLayout("quoteMint"),

  publicKeyLayout("baseVault"),
  u64("baseDepositsTotal"),
  u64("baseFeesAccrued"),

  publicKeyLayout("quoteVault"),
  u64("quoteDepositsTotal"),
  u64("quoteFeesAccrued"),

  u64("quoteDustThreshold"),

  publicKeyLayout("requestQueue"),
  publicKeyLayout("eventQueue"),

  publicKeyLayout("bids"),
  publicKeyLayout("asks"),

  u64("baseLotSize"),
  u64("quoteLotSize"),

  u64("feeRateBps"),

  u64("referrerRebatesAccrued"),

  blob(7),
]);

export const MARKET_STATE_LAYOUT_V3 = struct([
  blob(5),

  accountFlagsLayout("accountFlags"),

  publicKeyLayout("ownAddress"),

  u64("vaultSignerNonce"),

  publicKeyLayout("baseMint"),
  publicKeyLayout("quoteMint"),

  publicKeyLayout("baseVault"),
  u64("baseDepositsTotal"),
  u64("baseFeesAccrued"),

  publicKeyLayout("quoteVault"),
  u64("quoteDepositsTotal"),
  u64("quoteFeesAccrued"),

  u64("quoteDustThreshold"),

  publicKeyLayout("requestQueue"),
  publicKeyLayout("eventQueue"),

  publicKeyLayout("bids"),
  publicKeyLayout("asks"),

  u64("baseLotSize"),
  u64("quoteLotSize"),

  u64("feeRateBps"),

  u64("referrerRebatesAccrued"),

  publicKeyLayout("authority"),
  publicKeyLayout("pruneAuthority"),

  blob(1024),

  blob(7),
]);

export class Market {
  private _decoded: any;
  private _baseSplTokenDecimals: number;
  private _quoteSplTokenDecimals: number;
  private _skipPreflight: boolean;
  private _commitment: Commitment;
  private _programId: PublicKey;
  private _openOrdersAccountsCache: {
    [publickKey: string]: { accounts: OpenOrders[]; ts: number };
  };
  private _layoutOverride?: any;

  private _feeDiscountKeysCache: {
    [publicKey: string]: {
      accounts: Array<{
        balance: number;
        mint: PublicKey;
        pubkey: PublicKey;
        feeTier: number;
      }>;
      ts: number;
    };
  };

  constructor(
    decoded,
    baseMintDecimals: number,
    quoteMintDecimals: number,
    options: MarketOptions = {},
    programId: PublicKey,
    layoutOverride?: any
  ) {
    const { skipPreflight = false, commitment = "recent" } = options;
    if (!decoded.accountFlags.initialized || !decoded.accountFlags.market) {
      throw new Error("Invalid market state");
    }
    this._decoded = decoded;
    this._baseSplTokenDecimals = baseMintDecimals;
    this._quoteSplTokenDecimals = quoteMintDecimals;
    this._skipPreflight = skipPreflight;
    this._commitment = commitment;
    this._programId = programId;
    this._openOrdersAccountsCache = {};
    this._feeDiscountKeysCache = {};
    this._layoutOverride = layoutOverride;
  }

  static async load(
    connection: Connection,
    address: PublicKey,
    options: MarketOptions = {},
    programId: PublicKey,
    layoutOverride?: any
  ) {
    const { owner, data } = throwIfNull(
      await connection.getAccountInfo(address),
      "Market not found"
    );
    if (!owner.equals(programId)) {
      throw new Error("Address not owned by program: " + owner.toBase58());
    }

    const decoded = MARKET_STATE_LAYOUT_V3.decode(data);
    if (
      !decoded.accountFlags.initialized ||
      !decoded.accountFlags.market ||
      !decoded.ownAddress.equals(address)
    ) {
      throw new Error("Invalid market");
    }
    const [baseMintDecimals, quoteMintDecimals] = await Promise.all([
      getMintDecimals(connection, decoded.baseMint),
      getMintDecimals(connection, decoded.quoteMint),
    ]);
    return new Market(
      decoded,
      baseMintDecimals,
      quoteMintDecimals,
      options,
      programId,
      layoutOverride
    );
  }

  get programId(): PublicKey {
    return this._programId;
  }

  get address(): PublicKey {
    return this._decoded.ownAddress;
  }

  get publicKey(): PublicKey {
    return this.address;
  }

  get baseMintAddress(): PublicKey {
    return this._decoded.baseMint;
  }

  get quoteMintAddress(): PublicKey {
    return this._decoded.quoteMint;
  }

  get bidsAddress(): PublicKey {
    return this._decoded.bids;
  }

  get asksAddress(): PublicKey {
    return this._decoded.asks;
  }

  get decoded(): any {
    return this._decoded;
  }

  async loadBids(connection: Connection): Promise<Orderbook> {
    const { data } = throwIfNull(
      await connection.getAccountInfo(this._decoded.bids)
    );
    return Orderbook.decode(this, data);
  }

  async loadAsks(connection: Connection): Promise<Orderbook> {
    const { data } = throwIfNull(
      await connection.getAccountInfo(this._decoded.asks)
    );
    return Orderbook.decode(this, data);
  }

  async loadOrdersForOwner(
    connection: Connection,
    ownerAddress: PublicKey,
    cacheDurationMs = 0
  ): Promise<Order[]> {
    const [bids, asks, openOrdersAccounts] = await Promise.all([
      this.loadBids(connection),
      this.loadAsks(connection),
      this.findOpenOrdersAccountsForOwner(
        connection,
        ownerAddress,
        cacheDurationMs
      ),
    ]);
    return this.filterForOpenOrders(bids, asks, openOrdersAccounts);
  }

  filterForOpenOrders(
    bids: Orderbook,
    asks: Orderbook,
    openOrdersAccounts: OpenOrders[]
  ): Order[] {
    return [...bids, ...asks].filter((order) =>
      openOrdersAccounts.some((openOrders) =>
        order.openOrdersAddress.equals(openOrders.address)
      )
    );
  }

  async findOpenOrdersAccountsForOwner(
    connection: Connection,
    ownerAddress: PublicKey,
    cacheDurationMs = 0
  ): Promise<OpenOrders[]> {
    const strOwner = ownerAddress.toBase58();
    const now = new Date().getTime();
    if (
      strOwner in this._openOrdersAccountsCache &&
      now - this._openOrdersAccountsCache[strOwner].ts < cacheDurationMs
    ) {
      return this._openOrdersAccountsCache[strOwner].accounts;
    }
    const openOrdersAccountsForOwner = await OpenOrders.findForMarketAndOwner(
      connection,
      this.address,
      ownerAddress,
      this._programId
    );
    this._openOrdersAccountsCache[strOwner] = {
      accounts: openOrdersAccountsForOwner,
      ts: now,
    };
    return openOrdersAccountsForOwner;
  }

  async loadRequestQueue(connection: Connection) {
    const { data } = throwIfNull(
      await connection.getAccountInfo(this._decoded.requestQueue)
    );
    return decodeRequestQueue(data);
  }

  async loadEventQueue(connection: Connection) {
    const { data } = throwIfNull(
      await connection.getAccountInfo(this._decoded.eventQueue)
    );
    return decodeEventQueue(data);
  }

  async loadFills(connection: Connection, limit = 100) {
    // TODO: once there's a separate source of fills use that instead
    const { data } = throwIfNull(
      await connection.getAccountInfo(this._decoded.eventQueue)
    );
    const events = decodeEventQueue(data, limit);
    return events
      .filter(
        (event) => event.eventFlags.fill && event.nativeQuantityPaid.gtn(0)
      )
      .map(this.parseFillEvent.bind(this));
  }

  parseFillEvent(event) {
    let size, price, side, priceBeforeFees;
    if (event.eventFlags.bid) {
      side = "buy";
      priceBeforeFees = event.eventFlags.maker
        ? event.nativeQuantityPaid.add(event.nativeFeeOrRebate)
        : event.nativeQuantityPaid.sub(event.nativeFeeOrRebate);
      price = divideBnToNumber(
        priceBeforeFees.mul(this._baseSplTokenMultiplier),
        this._quoteSplTokenMultiplier.mul(event.nativeQuantityReleased)
      );
      size = divideBnToNumber(
        event.nativeQuantityReleased,
        this._baseSplTokenMultiplier
      );
    } else {
      side = "sell";
      priceBeforeFees = event.eventFlags.maker
        ? event.nativeQuantityReleased.sub(event.nativeFeeOrRebate)
        : event.nativeQuantityReleased.add(event.nativeFeeOrRebate);
      price = divideBnToNumber(
        priceBeforeFees.mul(this._baseSplTokenMultiplier),
        this._quoteSplTokenMultiplier.mul(event.nativeQuantityPaid)
      );
      size = divideBnToNumber(
        event.nativeQuantityPaid,
        this._baseSplTokenMultiplier
      );
    }
    return {
      ...event,
      side,
      price,
      feeCost:
        this.quoteSplSizeToNumber(event.nativeFeeOrRebate) *
        (event.eventFlags.maker ? -1 : 1),
      size,
    };
  }

  private get _baseSplTokenMultiplier() {
    return new BN(10).pow(new BN(this._baseSplTokenDecimals));
  }

  private get _quoteSplTokenMultiplier() {
    return new BN(10).pow(new BN(this._quoteSplTokenDecimals));
  }

  priceLotsToNumber(price: BN) {
    return divideBnToNumber(
      price.mul(this._decoded.quoteLotSize).mul(this._baseSplTokenMultiplier),
      this._decoded.baseLotSize.mul(this._quoteSplTokenMultiplier)
    );
  }

  priceNumberToLots(price: number): BN {
    return new BN(
      Math.round(
        (price *
          Math.pow(10, this._quoteSplTokenDecimals) *
          this._decoded.baseLotSize.toNumber()) /
          (Math.pow(10, this._baseSplTokenDecimals) *
            this._decoded.quoteLotSize.toNumber())
      )
    );
  }

  baseSplSizeToNumber(size: BN) {
    return divideBnToNumber(size, this._baseSplTokenMultiplier);
  }

  quoteSplSizeToNumber(size: BN) {
    return divideBnToNumber(size, this._quoteSplTokenMultiplier);
  }

  baseSizeLotsToNumber(size: BN) {
    return divideBnToNumber(
      size.mul(this._decoded.baseLotSize),
      this._baseSplTokenMultiplier
    );
  }

  baseSizeNumberToLots(size: number): BN {
    const native = new BN(
      Math.round(size * Math.pow(10, this._baseSplTokenDecimals))
    );
    // rounds down to the nearest lot size
    return native.div(this._decoded.baseLotSize);
  }

  quoteSizeLotsToNumber(size: BN) {
    return divideBnToNumber(
      size.mul(this._decoded.quoteLotSize),
      this._quoteSplTokenMultiplier
    );
  }

  quoteSizeNumberToLots(size: number): BN {
    const native = new BN(
      Math.round(size * Math.pow(10, this._quoteSplTokenDecimals))
    );
    // rounds down to the nearest lot size
    return native.div(this._decoded.quoteLotSize);
  }

  get minOrderSize() {
    return this.baseSizeLotsToNumber(new BN(1));
  }

  get tickSize() {
    return this.priceLotsToNumber(new BN(1));
  }
}

export interface MarketOptions {
  skipPreflight?: boolean;
  commitment?: Commitment;
}

export interface OrderParams<T = Account> {
  owner: T;
  payer: PublicKey;
  side: "buy" | "sell";
  price: number;
  size: number;
  orderType?: "limit" | "ioc" | "postOnly";
  clientId?: BN;
  openOrdersAddressKey?: PublicKey;
  openOrdersAccount?: Account;
  feeDiscountPubkey?: PublicKey | null;
  selfTradeBehavior?:
    | "decrementTake"
    | "cancelProvide"
    | "abortTransaction"
    | undefined;
  programId?: PublicKey;
}

export const _OPEN_ORDERS_LAYOUT_V1 = struct([
  blob(5),

  accountFlagsLayout("accountFlags"),

  publicKeyLayout("market"),
  publicKeyLayout("owner"),

  // These are in spl-token (i.e. not lot) units
  u64("baseTokenFree"),
  u64("baseTokenTotal"),
  u64("quoteTokenFree"),
  u64("quoteTokenTotal"),

  u128("freeSlotBits"),
  u128("isBidBits"),

  seq(u128(), 128, "orders"),
  seq(u64(), 128, "clientIds"),

  blob(7),
]);

export const _OPEN_ORDERS_LAYOUT_V2 = struct([
  blob(5),

  accountFlagsLayout("accountFlags"),

  publicKeyLayout("market"),
  publicKeyLayout("owner"),

  // These are in spl-token (i.e. not lot) units
  u64("baseTokenFree"),
  u64("baseTokenTotal"),
  u64("quoteTokenFree"),
  u64("quoteTokenTotal"),

  u128("freeSlotBits"),
  u128("isBidBits"),

  seq(u128(), 128, "orders"),
  seq(u64(), 128, "clientIds"),

  u64("referrerRebatesAccrued"),

  blob(7),
]);

export class OpenOrders {
  private _programId: PublicKey;

  address: PublicKey;
  market!: PublicKey;
  owner!: PublicKey;

  baseTokenFree!: BN;
  baseTokenTotal!: BN;
  quoteTokenFree!: BN;
  quoteTokenTotal!: BN;

  orders!: BN[];
  clientIds!: BN[];

  constructor(address: PublicKey, decoded, programId: PublicKey) {
    this.address = address;
    this._programId = programId;
    Object.assign(this, decoded);
  }

  static async findForOwner(
    connection: Connection,
    ownerAddress: PublicKey,
    programId: PublicKey
  ) {
    const filters = [
      {
        memcmp: {
          offset: _OPEN_ORDERS_LAYOUT_V2.offsetOf("owner"),
          bytes: ownerAddress.toBase58(),
        },
      },
      {
        dataSize: _OPEN_ORDERS_LAYOUT_V2.span,
      },
    ];
    const accounts = await getFilteredProgramAccounts(
      connection,
      programId,
      filters
    );
    return accounts.map(({ publicKey, accountInfo }) =>
      OpenOrders.fromAccountInfo(publicKey, accountInfo, programId)
    );
  }

  static async findForMarketAndOwner(
    connection: Connection,
    marketAddress: PublicKey,
    ownerAddress: PublicKey,
    programId: PublicKey
  ) {
    const filters = [
      {
        memcmp: {
          offset: _OPEN_ORDERS_LAYOUT_V2.offsetOf("market"),
          bytes: marketAddress.toBase58(),
        },
      },
      {
        memcmp: {
          offset: _OPEN_ORDERS_LAYOUT_V2.offsetOf("owner"),
          bytes: ownerAddress.toBase58(),
        },
      },
      {
        dataSize: _OPEN_ORDERS_LAYOUT_V2.span,
      },
    ];
    const accounts = await getFilteredProgramAccounts(
      connection,
      programId,
      filters
    );
    return accounts.map(({ publicKey, accountInfo }) =>
      OpenOrders.fromAccountInfo(publicKey, accountInfo, programId)
    );
  }

  static async load(
    connection: Connection,
    address: PublicKey,
    programId: PublicKey
  ) {
    const accountInfo = await connection.getAccountInfo(address);
    if (accountInfo === null) {
      throw new Error("Open orders account not found");
    }
    return OpenOrders.fromAccountInfo(address, accountInfo, programId);
  }

  static fromAccountInfo(
    address: PublicKey,
    accountInfo: AccountInfo<Buffer>,
    programId: PublicKey
  ) {
    const { owner, data } = accountInfo;
    if (!owner.equals(programId)) {
      throw new Error("Address not owned by program");
    }
    const decoded = _OPEN_ORDERS_LAYOUT_V2.decode(data);
    if (!decoded.accountFlags.initialized || !decoded.accountFlags.openOrders) {
      throw new Error("Invalid open orders account");
    }
    return new OpenOrders(address, decoded, programId);
  }
}

export const ORDERBOOK_LAYOUT = struct([
  blob(5),
  accountFlagsLayout("accountFlags"),
  SLAB_LAYOUT.replicate("slab"),
  blob(7),
]);

export class Orderbook {
  market: Market;
  isBids: boolean;
  slab: Slab;

  constructor(market: Market, accountFlags, slab: Slab) {
    if (!accountFlags.initialized || !(accountFlags.bids ^ accountFlags.asks)) {
      throw new Error("Invalid orderbook");
    }
    this.market = market;
    this.isBids = accountFlags.bids;
    this.slab = slab;
  }

  static get LAYOUT() {
    return ORDERBOOK_LAYOUT;
  }

  static decode(market: Market, buffer: Buffer) {
    const { accountFlags, slab } = ORDERBOOK_LAYOUT.decode(buffer);
    return new Orderbook(market, accountFlags, slab);
  }

  getL2(depth: number): [number, number, BN, BN][] {
    const descending = this.isBids;
    const levels: [BN, BN][] = []; // (price, size)
    for (const { key, quantity } of this.slab.items(descending)) {
      const price = getPriceFromKey(key);
      if (levels.length > 0 && levels[levels.length - 1][0].eq(price)) {
        levels[levels.length - 1][1].iadd(quantity);
      } else if (levels.length === depth) {
        break;
      } else {
        levels.push([price, quantity]);
      }
    }
    return levels.map(([priceLots, sizeLots]) => [
      this.market.priceLotsToNumber(priceLots),
      this.market.baseSizeLotsToNumber(sizeLots),
      priceLots,
      sizeLots,
    ]);
  }

  [Symbol.iterator]() {
    return this.items(false);
  }

  *items(descending = false): Generator<Order> {
    for (const {
      key,
      ownerSlot,
      owner,
      quantity,
      feeTier,
      clientOrderId,
    } of this.slab.items(descending)) {
      const price = getPriceFromKey(key);
      yield {
        orderId: key,
        clientId: clientOrderId,
        openOrdersAddress: owner,
        openOrdersSlot: ownerSlot,
        feeTier,
        price: this.market.priceLotsToNumber(price),
        priceLots: price,
        size: this.market.baseSizeLotsToNumber(quantity),
        sizeLots: quantity,
        side: (this.isBids ? "buy" : "sell") as "buy" | "sell",
      };
    }
  }
}

export interface Order {
  orderId: BN;
  openOrdersAddress: PublicKey;
  openOrdersSlot: number;
  price: number;
  priceLots: BN;
  size: number;
  feeTier: number;
  sizeLots: BN;
  side: "buy" | "sell";
  clientId?: BN;
}

function getPriceFromKey(key) {
  return key.ushrn(64);
}

function divideBnToNumber(numerator: BN, denominator: BN): number {
  const quotient = numerator.div(denominator).toNumber();
  const rem = numerator.umod(denominator);
  const gcd = rem.gcd(denominator);
  return quotient + rem.div(gcd).toNumber() / denominator.div(gcd).toNumber();
}

const MINT_LAYOUT = struct([blob(44), u8("decimals"), blob(37)]);

export async function getMintDecimals(
  connection: Connection,
  mint: PublicKey
): Promise<number> {
  if (
    mint.equals(new PublicKey("So11111111111111111111111111111111111111112"))
  ) {
    return 9;
  }
  const { data } = throwIfNull(
    await connection.getAccountInfo(mint),
    "mint not found"
  );
  const { decimals } = MINT_LAYOUT.decode(data);
  return decimals;
}

async function getFilteredProgramAccounts(
  connection: Connection,
  programId: PublicKey,
  filters
): Promise<{ publicKey: PublicKey; accountInfo: AccountInfo<Buffer> }[]> {
  // @ts-ignore
  const resp = await connection._rpcRequest("getProgramAccounts", [
    programId.toBase58(),
    {
      commitment: connection.commitment,
      filters,
      encoding: "base64",
    },
  ]);
  if (resp.error) {
    throw new Error(resp.error.message);
  }
  return resp.result.map(
    ({ pubkey, account: { data, executable, owner, lamports } }) => ({
      publicKey: new PublicKey(pubkey),
      accountInfo: {
        data: Buffer.from(data[0], "base64"),
        executable,
        owner: new PublicKey(owner),
        lamports,
      },
    })
  );
}

function throwIfNull<T>(value: T | null, message = "account not found"): T {
  if (value === null) {
    throw new Error(message);
  }
  return value;
}

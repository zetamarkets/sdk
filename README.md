<div align="center">
  <img height="120px" src="./logo.png" />

  <h1 style="margin-top: 0px">Zeta SDK 🔌</h1>

  <p>
    <a href="https://discord.gg/dD7YREfBkR"
      ><img
        alt="Discord Chat"
        src="https://img.shields.io/discord/841556000632078378?color=blueviolet"
    /></a>
    <a href="https://opensource.org/licenses/Apache-2.0"
      ><img
        alt="License"
        src="https://img.shields.io/github/license/project-serum/anchor?color=blueviolet"
    /></a>
  </p>
</div>

## Zeta SDK

This is the typescript library to interact with our Zeta program smart contract.

[Learn more about Zeta.](https://zetamarkets.gitbook.io/zeta/whitepaper/)

[Try out Zeta devnet.](https://devnet.zeta.markets/)

## Variables

| Key         |                    Value                     |
| ----------- | :------------------------------------------: |
| NETWORK_URL |        https://api.devnet.solana.com         |
| PROGRAM_ID  | BG3oRikW8d16YjUEmX3ZxHm9SiJzrGtMhsSR8aCw1Cd7 |
| SERVER_URL  |         https://server.zeta.markets          |

PROGRAM_ID is subject to change based on redeployments.

## Context

Zeta is a protocol that allows the trading of undercollateralized options and futures on Solana, using the Serum DEX for its order matching. Zeta is only available on devnet with SOL as the underlying asset.

Each asset corresponds to a `ZetaGroup` account. A Zeta group contains all the respective data for its markets.

Zeta markets use a circular buffer of expirations, as the Serum markets are re-used after expiry.

| Field                 |       Value       |
| --------------------- | :---------------: |
| Expiration interval   |      1 Week       |
| Number of expiries    |         2         |
| Number of strikes     |        11         |
| Supported instruments | Call, Put, Future |

As such - there are 23 markets per expiry

- 11 calls, 11 puts, 1 future

We are on weekly expiries.

Native numbers are represented with BN to the precision of 6 d.p as u64 integers in the smart contract code.

They will need to be divided by 10^6 to get the decimal value.

Use our helper functions in `src/utils.ts` to convert.

```ts
// A variable of type BN (big number)
let balance: BN = client.marginAccount.balance;

// If you had deposited $10,000 USDC
balance.toNumber(); // == 10_000_000_000

// Convert decimal number to native fixed point.
utils.convertDecimalToNativeInteger(10_000); // == 10_000_000_000;

// Convert native integer to decimal.
utils.convertNativeIntegerToDecimal(balance.toNumber()); // == 10_000

// Convert native BN to decimal.
utils.convertNativeBNToDecimal(balance); // == 10_000
```

## Install

```sh
npm install @zetamarkets/sdk
```

## Getting started

### Setting up a wallet

```sh
# Generate new keypair at ./bot-key.json
solana-keygen new -o bot-key.json

# View new pubkey address
solana-keygen pubkey bot-key.json

# Put private key into .env file used by script
# (Make sure you are in the same directory as where you are running the script.)
echo private_key=`cat bot-key.json` >> .env
```

### Basic setup boilerplate

```ts
// Loads the local .env file into `process.env`.
require("dotenv").config();

import { Connection, Keypair } from "@solana/web3.js";
import {
  Client,
  Exchange,
  Network,
  Wallet,
  utils,
  types,
} from "@zetamarkets/sdk";
import fetch from "node-fetch";

// Loads the private key in .env
const privateKey = Keypair.fromSecretKey(
  new Uint8Array(JSON.parse(Buffer.from(process.env.private_key).toString()))
);
const wallet = new Wallet(privateKey);

// Starts a solana web3 connection to an RPC endpoint
const connection = new Connection(networkUrl, utils.defaultCommitment());

// Airdrop some SOL to your wallet
await connection.requestAirdrop(wallet.publicKey, 100000000);

// USDC faucet - Mint $10,000 USDC (Note USDC is fake on devnet)
await fetch(`${SERVER_URL}/faucet/USDC`, {
  method: "post",
  body: JSON.stringify({
    key: wallet.publicKey.toString(),
    amount: 10_000,
  }),
  headers: { "Content-Type": "application/json" },
});

// Loads the SDK exchange singleton. This can take up to 10 seconds...
await Exchange.load(
  PROGRAM_ID,
  Network.DEVNET,
  connection,
  utils.defaultCommitment(),
  undefined, // Exchange wallet can be ignored for normal clients.
  0, // ThrottleMs - increase if you are running into rate limit issues on startup.
  undefined // Callback - See below for more details.
);
```

### Displaying exchange state

```ts
// Display existing exchange state i.e. markets available and their indices.
// Can only be run after `Exchange` is loaded.
utils.displayState();

`
[EXCHANGE] Display market state...
Expiration @ Thu Nov 18 2021 08:00:00 GMT+0800
[MARKET] INDEX: 23 KIND: call STRIKE: 220
[MARKET] INDEX: 24 KIND: call STRIKE: 223
[MARKET] INDEX: 25 KIND: call STRIKE: 226
// ... Deleted for space ...
[MARKET] INDEX: 44 KIND: put STRIKE: 260
[MARKET] INDEX: 45 KIND: future STRIKE: 0
Expiration @ Fri Nov 19 2021 08:00:00 GMT+0800
[MARKET] INDEX: 0 KIND: call STRIKE: 205
[MARKET] INDEX: 1 KIND: call STRIKE: 208
[MARKET] INDEX: 2 KIND: call STRIKE: 211
// ... Deleted for space ...
[MARKET] INDEX: 20 KIND: put STRIKE: 240
[MARKET] INDEX: 21 KIND: put STRIKE: 245
[MARKET] INDEX: 22 KIND: future STRIKE: 0
`;
```

Note our markets are identified by index - in a circular buffer fashion for expiries.

### User margin accounts

A user's state is represented by a `MarginAccount` in the Zeta program. This is per underlying per user.

It stores all the state related to a user's balance, open orders and positions.

Creation is baked into the `deposit` function if you don't have one already.

```ts
// Load the user SDK client.
const client = await Client.load(
  connection,
  wallet, // Use the loaded wallet.
  utils.defaultCommitment(),
  undefined // Callback - See below for more details.
);

// This will create a margin account on first deposit.
await client.deposit(utils.convertDecimalToNativeInteger(10_000));
```

Structure

```ts
// client.marginAccount
export interface MarginAccount {
  authority: PublicKey; // Wallet publickey.
  nonce: number; // Margin account PDA nonce.
  balance: anchor.BN; // Balance - doesn't take into account unrealized pnl.
  forceCancelFlag: boolean; // If you are underwater, liquidators can cancel your open orders in consecutive transactions.

  openOrdersNonce: Array<number>; // Open orders account PDA nonce.
  seriesExpiry: Array<anchor.BN>; // Expiry timestamp for your orders and positions (used for settlement)
  positions: Array<Position>; // Vector of your positions and open order state.
  _positionsPadding: Array<Position>;
}
```

The details should be abstracted away into `client.orders` and `client.positions` in the SDK.

### Basic script setup to place a trade and view positions

For examples sake, we want to see the orderbook for market index 2, i.e. the CALL option expiring on Fri Nov 19 with strike 211.

```ts
const index = 2;
await Exchange.markets.markets[index].updateOrderbook();
console.log(Exchange.markets.markets[index].orderbook);
```

NOTE: Orderbook depth is capped to default = 5.

Set via `Exchange.markets.orderbookDepth = N`.

```ts
`
{
  bids: [
    { price: 7.71, size: 23 },
    { price: 6.58, size: 309 },
    { price: 5.71, size: 251 },
    { price: 5.52, size: 8 }
  ],
  asks: [ { price: 9.53, size: 23 } ]
}
`;
```

Placing an order.

- Placing an order on a new market (market index) will create a serum `OpenOrders` account. This is handled by the SDK.
- The minimum price is $0.0001.
- The minimum trade tick size is 0.001.

```ts
// We need to convert price to the native spl token amount (6.dp)
// utils.convertDecimalToNativeInteger(8) == (8*10^6)
const orderPrice = utils.convertDecimalToNativeInteger(8);

// We need to convert to our native option lot size.
// utils.convertDecimalToNativeLotSize(1) == (1*10^3)
const orderLots = utils.convertDecimalToNativeLotSize(1);

// Place a bid order.
await client.placeOrder(
  Exchange.markets.markets[index].address,
  orderPrice,
  orderLots,
  types.Side.BID
);
```

See client order.

```ts
await client.updateState();
console.log(client.orders);

// `client.orders` is a list of orders in market index order.
`
[
  {
    marketIndex: 2,
    market: PublicKey {
      _bn: <BN: 94cce37bd47128c757766685f012cac541a534ba9ed59e6bf05cd004eae1ae5>
    },    // This is the market address represented as a PublicKey
    price: 8,
    size: 1,
    side: 0, // 0 for bids, 1 for asks
    orderId: <BN: 7a1200fffffffffffdfdc2>, // This is used to cancel.
    owner: PublicKey {
      _bn: <BN: 153d79e2816b07fb2388abb9bd6feb64a481f422c5ff390ad8346eb70f09111d>
    }
  }
]
`;

// See our new order on the orderbook.
console.log(Exchange.markets.markets[index].orderbook);
`
{
  bids: [
    { price: 8, size: 1 }, // This is our order
    { price: 7.99, size: 23 },
    { price: 6.58, size: 309 },
    { price: 5.71, size: 251 },
    { price: 5.52, size: 8 }
  ],
  asks: [ { price: 9.53, size: 23 } ]
}
`;
```

Place bid order in cross to get a position (Best ask was 9.53)

```ts
// Place an order in cross with offers to get a position.
await client.placeOrder(
  Exchange.markets.markets[index].address,
  utils.convertDecimalToNativeInteger(10),
  orderLots,
  types.Side.BID
);

// View our position
await client.updateState();
console.log(client.positions);

// `client.positions` is a list of positions in market index order.
`
[
  {
    marketIndex: 2,
    market: PublicKey {
      _bn: <BN: 94cce37bd47128c757766685f012cac541a534ba9ed59e6bf05cd004eae1ae5>
    },
    position: 1,
    costOfTrades: 9.53 // 6 d.p, so $9.53
  }
]
`;
```

We have a position of 1, with cost of trades 9530000 / 10^6 = $9.53.

Cancel order.

```ts
// We only have one order at the moment.
let order = client.orders[0];
await client.cancelOrder(order.market, order.orderId, order.side);
```

Cancel all orders.

```ts
await client.cancelAllOrders();
```

See `src/client.ts` for full functionality.

### Check market mark price

This is the price that position is marked to - (This is calculated by our on chain black scholes pricing that is constantly being cranked.)

```ts
// Use the market index you wish to check.
console.log(Exchange.getMarkPrice(index));
// The fair price of this option is $8.202024.
`8.202024`;
```

### Calculate user margin account state

```ts
let marginAccountState = Exchange.riskCalculator.getMarginAccountState(
  client.marginAccount
);
console.log(marginAccountState);

// These values have all been normalized (converted from 6 dp fixed point integer to decimal)
`
{
  balance: 10000,                       // Deposited $10,000
  initialMargin: 8.202024,              // Initial margin, from the 1 open order
  maintenanceMargin: 8.202024,          // Maintenance margin, from the 1 position
  totalMargin: 16.404048,               // Sum of initial and maintenance
  unrealizedPnl: -1.3279759999999996,   // Unrealized pnl, marked to mark price
  availableBalance: 9982.267976         // Equity available for trading.
}
`;
```

## Zeta market data

Zeta market data is available through `Exchange.markets`, which simplifies the data in `Exchange.zetaGroup` to be more easily understood.

Markets are indexed via 0..N-1 (N being 46 for now.) and are grouped in `ExpirySeries`.

```ts
// Whole markets object
let markets = Exchange.markets;

// Index directly to access a particular market.
let market = markets.markets[5];

// See market data
let strike = market.strike;
let kind = market.kind; // This is a Kind ENUM.

// Ensure you have polled to see latest state.
let orderbook = market.orderbook;

// See expiry data of the market.
// This contains expiry index, active timestamp, expiry ts, and whether strikes are initialized.
let expirySeries = market.expirySeries;
```

See `src/markets.ts` to see full functionality.

## Viewing oracle price

The `Exchange` object creates an oracle subscription to SOL/USD on load.
You can access the latest oracle prices like so.

```ts
// Get the available price feeds.
Exchange.oracle.getAvailablePriceFeeds();

// Get the price of a given feed.
let price = Exchange.oracle.getPrice("SOL/USD");
```

See callbacks to update state live.

## Callbacks and state tracking

Due to the number of changing states in the Zeta program, the SDK makes use of Solana websockets for users to receive callbacks when accounts are **polled and or changed.**

There are two categories of callbacks, one relating to user state and the other non-user based state (program state).

The callback function is passed in either

- `Exchange.load` - for non user events.
- `Client.load` - for user events.

You can see these `EventType` in `src/events.ts`.

**NOTE: Some callbacks are done on poll so don't always reflect a change in state.**

| Event     |     Type     |                                                                                   Meaning                                                                                    |                                          Change |
| --------- | :----------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ----------------------------------------------: |
| EXCHANGE  |   Program    |                                                                    Strike initialization, market cleaning                                                                    |                              Exchange.zetaGroup |
| EXPIRY    |   Program    |                                                                         On option series expiration                                                                          |                                Exchange.markets |
| GREEKS    |   Program    |                                                                    When greeks are updated (mark prices)                                                                     | Exchange.greeks or <br> Exchange.riskCalculator |
| ORDERBOOK |   Program    |                                                                        When an orderbook poll occurs.                                                                        |                                Exchange.markets |
| ORACLE    | Pyth oracle  |                                                                              Pyth price update.                                                                              |                                 Exchange.oracle |
| CLOCK     | Solana clock |                                                                         Solana clock account change.                                                                         |                         Exchange.clockTimestamp |
| TRADE     |     User     |                                                                             On user trade event.                                                                             |                            client.marginAccount |
| USER      |     User     | When the user's margin account <br> changes, which can occur on <br> inserts, cancels, trades, withdrawals, <br> deposits, settlement, liquidation, <br> force cancellations |                            client.marginAccount |

These callbacks should eliminate the need to poll for most accounts, unless you need certainty on the state, in which case there are polling functions available in `Exchange` and `Client`.

```ts
// Generic callback function to pass into `Exchange.load` or `Client.load`.
async function callback(eventType: events.EventType, data: any) {
  switch (eventType) {
    case events.EventType.CLOCK:
      // ... Handle via Exchange.clockTimestamp
    case events.EventType.<SomeOtherEvent>:
      break;
  }
}
```

### Event data

The function definition of a callback is
` (event: EventType, data: any) => void`

Only `ORACLE` and `ORDERBOOK` events have data in them.

ORACLE:

```ts
export interface OraclePrice {
  feed: string; // The feed's name i.e. SOL/USD
  price: number; // i.e. 1000.23
}
```

ORDERBOOK:

```ts
export interface OrderbookEvent {
  marketIndex: number; // The market index that was updated.
}
```

After receiving an orderbook update, you can assume `Exchange.markets.markets[marketIndex].orderbook` is the latest state.

## Native polling in SDK

There is polling natively built into the SDK `Exchange` and `Client` objects since state relies quite heavily on websockets.

This was to ensure that:

1. SDK program state would correct itself on websocket issues.
2. There was a mechanism for users to poll state on some defined interval (and get a callback when it happened, see below).

### Exchange polling

`Exchange` has a default poll interval of `constants.DEFAULT_EXCHANGE_POLL_INTERVAL` (set to 30 seconds).

You can change this via setting `Exchange.pollInterval`.

This will poll `ZetaGroup` and zeta `State` accounts.

### Market orderbook polling

Users can elect to poll markets at a certain frequency too. This has a default poll interval of `constants.DEFAULT_MARKET_POLL_INTERVAL`. (5 seconds).

You can change this via `Exchange.markets.pollInterval`.

Users have to subscribe to a market index for polling to be done on it. This is because each market requires 2 RPC requests, so polling all markets can easily hit rate limits if not on a dedicated provider.

```ts
// Subscribe to a market index.
Exchange.markets.subscribeMarket(index);

// Unsubscribe to a market index.
Exchange.markets.unsubscribeMarket(index);

// Manually poll a market index.
await Exchange.markets.markets[index].updateOrderbook();
```

### Client polling and throttle

`Client` has a default poll interval of `constants.DEFAULT_CLIENT_POLL_INTERVAL` (set to 20 seconds).

You can change this via `client.pollInterval`.

This is _almost_ how often the SDK will call `await client.updateState()`, which is the manual way of polling user state.

There is a timer that on default fires every 2 seconds, checking the last poll timestamp. If time greater than client.pollInterval has elapsed or there is a pending update, it will poll.

Pending update refers to a margin account websocket change callback. (The SDK subscribes to user `MarginAccount` on `Client.load`.)

This will do multiple things (`client.updateState()`):

1. Fetch user margin account (`client.marginAccount`).
2. Update user orders (this will poll the market orderbook for each market that the user has a non zero position or open orders in - `client.orders`).
3. Update user positions (`client.positions`).

This timer can be modified via `client.setPolling(intervalSeconds)`.

Tying into this, the motivation behind this complexity is that if a user is asynchronously placing and cancelling orders across multiple markets, you may receive multiple margin account callbacks across consecutive slots.

If each call back polls relevant markets for the latest user order state (2 polls per market), you can easily hit rate limits.

If `throttle` is set to `true`, in `Client.load`, then this timer allows users to batch client polling to the next timer interval (i.e. optimistically, 5 consecutive slot updates will only trigger 1 poll).

Alternatively, `throttle` can be set to `false`, and `client.updateState` will be called on every margin account change and ensure you have the latest state at all times.

### Shutting down

When you want to shut down or restart the client, call this to disconnect the respective websockets.

```ts
// Close exchange object.
await Exchange.close();

// Close client object.
await client.close();
```

## Licensing

[Apache 2.0](./LICENSE).

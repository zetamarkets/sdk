# Changelog

All notable changes to this project will be documented in this file.
Version changes are pinned to SDK releases.

## [Unreleased]

- events: Add new OrderCompleteEvent. ([#135](https://github.com/zetamarkets/sdk/pull/135))
- events: Remove CancelEvent. ([#135](https://github.com/zetamarkets/sdk/pull/135))

## [0.16.3]

- referrals: Fix referral alias fetching bug. ([#139](https://github.com/zetamarkets/sdk/pull/139))

## [0.16.2]

- referrals: Add referrer support in Client. ([#137](https://github.com/zetamarkets/sdk/pull/137))

## [0.16.1]

- referrals: Support referrer aliases. ([#134](https://github.com/zetamarkets/sdk/pull/134))

## [0.16.0]

- general: Multiasset support. ([#124](https://github.com/zetamarkets/sdk/pull/124))
  - A lot of breaking changes, please see below and updated README.md
  - A guide on how to migrate from older versions to 0.16.0 is available on ([Gitbook](https://zetamarkets.gitbook.io/zeta/build-with-zeta/zeta-sdk/multi-asset-sdk-guide))

### Breaking

- Most functions now take in Asset as their first argument
- Most client and exchange functions are now part of subClient and subExchange respectively
  - You should not need to access these directly, client and exchange will have helper functions for everything
- Oracle no longer uses string feeds ("SOL/USD") in favour of the Asset enum
- Exchange and client callbacks now pass back the Asset object
- client.positions is renamed to .marginPositions for consistency with .spreadPositions
  - These are both in subclient now due to multiasset changes, but are accessible with client.getMarginPositions() and client.getSpreadPositions()
- toNetwork() is moved to network.ts

## [0.15.0]

- Skipped 0.15.0 due to versioning issues.

## [0.14.4]

- client: Add extra safety around client state updates. ([#129](https://github.com/zetamarkets/sdk/pull/129))
- client: Add referral logic for client. ([#130](https://github.com/zetamarkets/sdk/pull/130))
- program: Add instruction logic for referrals. ([#130](https://github.com/zetamarkets/sdk/pull/130))
- events: Cancel events. ([#131](https://github.com/zetamarkets/sdk/pull/131))

## [0.14.3]

- program: Add Asset to MarginAccount, SpreadAccount and ZetaGroup. ([#126](https://github.com/zetamarkets/sdk/pull/126))
- risk: Add functionality for market maker margin concessions. ([#128](https://github.com/zetamarkets/sdk/pull/128))

## [0.14.2]

- general: Specify buffer-layout version in package.json. ([#119](https://github.com/zetamarkets/sdk/pull/119))
- program: Add new NoError cancel instructions. ([#114](https://github.com/zetamarkets/sdk/pull/114))
- client: Add new instructions ReplaceByClientOrderId, CancelAllOrdersNoError and CancelMultipleOrdersNoError. ([#114](https://github.com/zetamarkets/sdk/pull/114))
- events: Add new event LiquidationEvent. ([#118](https://github.com/zetamarkets/sdk/pull/118))
- risk: Add unrealized pnl calculations for spread accounts. ([#119](https://github.com/zetamarkets/sdk/pull/119))

### Breaking

- instruction: `InitializeOpenOrders` now takes explicit payer. This affects placing an order on a new market. ([#121](https://github.com/zetamarkets/sdk/pull/121))

## [0.14.1]

- oracle: `OraclePrice` now contains `lastUpdatedTime` which is seconds since Linux epoch. `GetPriceAge` can be called to get the time between `now` and `lastUpdatedTime`. (([#115](https://github.com/zetamarkets/sdk/pull/115)))
- oracle: Now has explicit `pollPrice` function to fetch the latest oracle price manually. (([#115](https://github.com/zetamarkets/sdk/pull/115)))

## [0.14.0]

- events: Add new event PlaceOrderEvent. ([#107](https://github.com/zetamarkets/sdk/pull/107))
- program: Add new instruction PlaceOrderV3. ([#104](https://github.com/zetamarkets/sdk/pull/104))
- program: Change liquidate() size argument in program from u32 to u64. ([#103](https://github.com/zetamarkets/sdk/pull/103))
- program: Mark greek accounts as immutable in certain instructions.
- program: Add support for spread accounts. ([#102](https://github.com/zetamarkets/sdk/pull/102))
- client: Added helper getter functions for user margin account and spread account state. ([#102](https://github.com/zetamarkets/sdk/pull/102))
- anchor: Bump to 0.24.2. ([#110](https://github.com/zetamarkets/sdk/pull/110))
- errors: Parse anchor `AnchorError` to local `NativeAnchorError` to standardise error fields. ([#110](https://github.com/zetamarkets/sdk/pull/110))
- errors: Refactor error handling and parse simulation errors. ([#111](https://github.com/zetamarkets/sdk/pull/111))
- client: Expose whitelist deposit address. ([#112](https://github.com/zetamarkets/sdk/pull/112))

### Breaking

- instruction: `InitializeMarginAccount` now explicitly specifies the payer for composability reasons. ([#108](https://github.com/zetamarkets/sdk/pull/108))
- instruction: `InitializeMarginAccount` no longer requires a nonce to be passed in for the PDA generation. ([#102](https://github.com/zetamarkets/sdk/pull/102))
- client: SDK type `Position` field `position` has been renamed to `size`. ([#102](https://github.com/zetamarkets/sdk/pull/102))
- program-types: Smart contract type `Position` field `position` has been renamed to `size`. ([#102](https://github.com/zetamarkets/sdk/pull/102))
- program-types: `MarginAccount` field `positions` of type `Position` has been renamed to `productLedgers` of type `ProductLedger` that contains a `Position` and a `OrderState`. `Position` contains `size` and `costOfTrades` and `OrderState` contains opening and closing order data. ([#102](https://github.com/zetamarkets/sdk/pull/102))
- events: new code in anchor for deserializing events. This update is required for `TradeEvent` to be deserialized correctly.

Note: As the memory layout of Zeta accounts has not changed, merely refactored or renamed, using an older version of the SDK for existing accounts is not breaking as it will still deserialize correctly. Updating to the latest SDK will let users access the newest features and improvements.

- The only breaking portion is calling `InitializeMarginAccount` on new account deposits.

## [0.13.0] 2022-03-13

- anchor: bump to v0.22.1. ([#98](https://github.com/zetamarkets/sdk/pull/98))

### Breaking

- errors: New anchor release maps program errors from 6000, instead of 300. Errors won't map correctly without upgrading to this version.

## [0.12.4] 2022-02-28

- client: Add functionality to withdraw and close margin account in single transaction. ([#98](https://github.com/zetamarkets/sdk/pull/98))

## [0.12.3] 2022-02-28

- client: expose provider as client provider might not be the same as exchange provider. ([#97](https://github.com/zetamarkets/sdk/pull/97))

## [0.12.2] 2022-02-27

- client: expose client address.

## [0.12.1] 2022-02-25

- exchange: greek and oracle callback after margin requirements are updated.

## [0.12.0] 2022-02-23

- client: Add in functionality to close a margin account, close an open orders account and close multiple open orders accounts. ([#93](https://github.com/zetamarkets/sdk/pull/93))
- general: Add in functionality to accomodate for extra order types (post-only & fill-or-kill). ([#93](https://github.com/zetamarkets/sdk/pull/93))
- general: Add in placeOrderV2 to allow order type to be specified. ([#93](https://github.com/zetamarkets/sdk/pull/93))

## [0.11.0] 2022-02-02

- risk: Change margin calculations to reflect new changes. See https://zetamarkets.gitbook.io/zeta/zeta-protocol/collateral-framework ([#85](https://github.com/zetamarkets/sdk/pull/85))
- example: Update liquidator example in line with margin changes. ([#85](https://github.com/zetamarkets/sdk/pull/85))
- utils: Add token burning functionality. ([#87](https://github.com/zetamarkets/sdk/pull/87))
- risk: Add function to calculate maintenance margin requirements including orders, used for sending orders that close positions only. ([#89](https://github.com/zetamarkets/sdk/pull/89))

### Breaking

- risk: All user actions now check initial margin requirements across all open orders and positions. See changes in `risk.ts`. ([#85](https://github.com/zetamarkets/sdk/pull/85))
- risk: `MarginAccountState` - `availableBalance` has been deprecated. Use `availableBalanceInitial` to check a margin account's available balance for placing orders, withdrawing and liquidating other users. Use `availableBalanceMaintenance` to see if a user can be liquidated. ([#85](https://github.com/zetamarkets/sdk/pull/85))

## [0.10.5] 2022-01-29

- client: Fix client margin account subscriptions. ([#84](https://github.com/zetamarkets/sdk/pull/84))
- risk: Fix risk calculation for initial margin. ([#86](https://github.com/zetamarkets/sdk/pull/86))

## [0.10.4] 2022-01-24

- error: Add handling for a few native errors i.e. insufficient lamports and unconfirmed tx. ([#83](https://github.com/zetamarkets/sdk/pull/83))
- error: Unconfirmed transaction error passes back an error object with transactionSignature as a field in data. ([#83](https://github.com/zetamarkets/sdk/pull/83))

## [0.10.3] 2022-01-22

- utils: Add `updateExchangeState` to exchange to allow for state refresh without websocket. ([#82](https://github.com/zetamarkets/sdk/pull/82))

## [0.10.2] 2022-01-21

- utils: `getClockData` now uses local `readBigInt64LE` to fix browser compatibility issues.

## [0.10.1] 2022-01-19

- exchange: Close sets initialized flag to false so it can be reloaded. ([#80](https://github.com/zetamarkets/sdk/pull/80))

## [0.10.0] 2022-01-17

- risk: Remove redundant calculation in `getMarginAccountState`. ([#59](https://github.com/zetamarkets/sdk/pull/59))
- program-types: Add force halt pricing field to `Greeks`. ([#63](https://github.com/zetamarkets/sdk/pull/63))
- examples: Fix cranking example. ([#63](https://github.com/zetamarkets/sdk/pull/64))
- examples: Add example to display settlement prints. ([#64](https://github.com/zetamarkets/sdk/pull/64))
- subscription: Add `subscription` to allow for websocket subscription to all program accounts of a particular type. Currently only supports `MarginAccount`. ([#71](https://github.com/zetamarkets/sdk/pull/71))
- examples: Add subscription example. ([#71](https://github.com/zetamarkets/sdk/pull/71))
- utils: Add a function to fetch all the addresses for a certain program account. Currently only supports `MarginAccount`. ([#72](https://github.com/zetamarkets/sdk/pull/72))
- general: Modify default commitment levels to confirmed. ([#73](https://github.com/zetamarkets/sdk/pull/73))
- client: Add `cancelAndPlaceOrderByClientOrderId`. ([#73](https://github.com/zetamarkets/sdk/pull/73))
- exchange: Add clock slot. ([#74](https://github.com/zetamarkets/sdk/pull/74))
- client: Optimise polling such that only one `updateState` can be called at all times. Pending updates are batched to the next timer tick. ([#74](https://github.com/zetamarkets/sdk/pull/74))
- client: Reduce DEFAULT_CLIENT_TIMER_INTERVAL to 1 for more frequent pending update refreshes. ([#74](https://github.com/zetamarkets/sdk/pull/74))
- market: Remove orderbook depth. Always store the full orderbook size. ([#74](https://github.com/zetamarkets/sdk/pull/74))
- oracle: Allow oracle object to decode any pyth address. ([#77](https://github.com/zetamarkets/sdk/pull/77))

## [0.9.5] 2021-12-29

- program-types: Add fields to `PricingParameters`. ([#56](https://github.com/zetamarkets/sdk/pull/56))
- examples: Add basic liquidator example. ([#60](https://github.com/zetamarkets/sdk/pull/60))

## [0.9.4] 2021-12-29

- examples: Added a cranking example that calls all of zeta's permissionless instructions with relevant documentation. ([#47](https://github.com/zetamarkets/sdk/pull/47))
- risk: Added in new calculations for short put margin requirements. ([#49](https://github.com/zetamarkets/sdk/pull/49))
- exchange: New margin parameter for MarginParameters account. ([#49](https://github.com/zetamarkets/sdk/pull/49))
- exchange: Add new instruction to update admin. ([#48](https://github.com/zetamarkets/sdk/pull/48))
- market: Add `getBidOrders` and `getAskOrders` for market. ([#50](https://github.com/zetamarkets/sdk/pull/50))
- client: Add `initializeOpenOrdersAccount` for independent open orders account creation. ([#50](https://github.com/zetamarkets/sdk/pull/50))
- general: Add user keys to whitelist accounts. ([#53](https://github.com/zetamarkets/sdk/pull/539))
- exchange: Add `expireSeriesOverride` instruction. ([#52](https://github.com/zetamarkets/sdk/pull/52))

## [0.9.3] 2021-12-24

- general: Rename margin parameters to be more intuitive from `optionBase` to `optionDynamic`. ([#44](https://github.com/zetamarkets/sdk/pull/44))
- exchange: Fix race condition on `Exchange.load` that would result in NaN margin requirements temporarily. ([#44](https://github.com/zetamarkets/sdk/pull/44))
- events: Trade event now emits `orderId` and `clientOrderId` if set, otherwise it is 0. These are represented in BN. ([#45](https://github.com/zetamarkets/sdk/pull/45))
- client: Deposit limit for non white-listed users. ([#40](https://github.com/zetamarkets/sdk/pull/40))

### Breaking

- events: TradeEvent now emits `costOfTrades` instead of `price`. Users can use `utils.getTradeEventPrice(event)` to get the trade price. If your order was a taker and traded against multiple orders in the one insert, the TradeEvent will aggregate across each execution. As a result, the trade price returned is the average trade price across the total taker size. ([#45](https://github.com/zetamarkets/sdk/pull/45))
- events: TradeEvent size is now a BN. ([#45](https://github.com/zetamarkets/sdk/pull/45))
- client: Users can only deposit up to a threshold where their balance + unrealized_pnl + new deposit < deposit limit unless they are previously whitelisted. Deposit limit can be found in the `Exchange.state` account. ([#40](https://github.com/zetamarkets/sdk/pull/40))

## [0.9.2] 2021-12-23

- utils: bugfix - Floating point error in `convertDecimalToNativeInteger`. ([#43](https://github.com/zetamarkets/sdk/pull/43))

## [0.9.1] 2021-12-20

- client: bugfix - `client.orders` size is represented in Decimals. ([#42](https://github.com/zetamarkets/sdk/pull/42))

## [0.9.0] 2021-12-20

- exchange: Add whitelist trading fees account initialization. ([#24](https://github.com/zetamarkets/sdk/pull/24))
- client: Add whitelist trading functionality for reduced fees. ([#24](https://github.com/zetamarkets/sdk/pull/24))
- general: Support new changes for socialized loss mechanism. ([#25](https://github.com/zetamarkets/sdk/pull/25))
- client: Fix withdrawal instruction bug. ([#25](https://github.com/zetamarkets/sdk/pull/25))
- general: Added typedoc documentation and github action for publishing to gh-pages. ([#30](https://github.com/zetamarkets/sdk/pull/30))
- general: Changed pkg manager from npm to yarn. ([#30](https://github.com/zetamarkets/sdk/pull/30))
- client: Add whitelist trading functionality for reduced fees. ([#24](https://github.com/zetamarkets/sdk/pull/24/))
- risk: Handle new margin calculation parameters being read from `ZetaGroup`. ([#31](https://github.com/zetamarkets/sdk/pull/31))
- general: Move minting of dex tokens to place_order instead. ([#33](https://github.com/zetamarkets/sdk/pull/33))
- client: Support client order ids for `PlaceOrder` and add `CancelOrderByClientOrderId`. ([#33](https://github.com/zetamarkets/sdk/pull/33))
- client: Add client order id to `Order`. ([#33](https://github.com/zetamarkets/sdk/pull/33))
- refactor: Replace program rpc calls with TransactionInstructions. ([#34](https://github.com/zetamarkets/sdk/pull/34))
- general: Support platform halt functionality. ([#34](https://github.com/zetamarkets/sdk/pull/34))
- general: Making lot size more minute in execution and tick sizes. ([#35](https://github.com/zetamarkets/sdk/pull/35))
- utils : Add `convertNativeLotSizeToDecimal` and `convertDecimalToNativeLotSize` for new lot size changes. ([#35](https://github.com/zetamarkets/sdk/pull/35))
- program-types: `MarginAccount` fields `position`, `openingOrders` and `closingOrders` are now represented as a BN instead of number. ([#35](https://github.com/zetamarkets/sdk/pull/35))
- general: Add padding to `Greeks`, `MarginAccount` and `State` accounts. ([#35](https://github.com/zetamarkets/sdk/pull/35))

### Breaking

- general: Minimum price increment is now 0.0001 for both options and futures. ([#35](https://github.com/zetamarkets/sdk/pull/35))
- general: Minimum trade tick size is now 0.001 for both options and futures. ([#35](https://github.com/zetamarkets/sdk/pull/35))
- client: `placeOrder`, `liquidate` and `cancelAndPlaceOrder` now expect the native integer size as the argument for size. i.e. trading 1.000 options will require you to pass in 1_000 or `convertDecimalToNativeLotSize(1)`. ([#35](https://github.com/zetamarkets/sdk/pull/35))
- utils: `convertNativeBNToDecimal` now takes in an optional argument for the number of fixed point precision.

## [0.8.3] 2021-12-08

- npm: Fix issue with 0.8.2 package.

## [0.8.2] 2021-12-08

- constants: Migrate to new serum DEX pid to fix execution bug. ([#21](https://github.com/zetamarkets/sdk/pull/21))

## [0.8.1] 2021-12-07

- market: Add helper functions for finding a market given parameters. ([#9](https://github.com/zetamarkets/sdk/pull/9))
- client: Update client open orders address on callback for scenario where open orders address is initialized outside of the sdk. ([#20](https://github.com/zetamarkets/sdk/pull/20))

## [0.8.0] 2021-12-06

- insurance-client: Insurance fund functionality, whitelist checks, deposit & withdrawal. ([#9](https://github.com/zetamarkets/sdk/pull/9))
- exchange: Insurance functionality, whitelist a user, rebalance vaults. ([#9](https://github.com/zetamarkets/sdk/pull/9))
- general: Add functionality to SDK to support on chain options pricing. ([#11](https://github.com/zetamarkets/sdk/pull/11))
- anchor: Bump to Anchor v0.18.2 typescript. ([#11](https://github.com/zetamarkets/sdk/pull/11))
- utils: refactor util functions for converting between numbers and BN. ([#14](https://github.com/zetamarkets/sdk/pull/14))
- exchange: Add functionality to handle scenario where deployment fails and redeployment is required. ([#14](https://github.com/zetamarkets/sdk/pull/14))
- risk: Fix mark price precision error in `RiskCalculator` for margin calculations. ([#15](https://github.com/zetamarkets/sdk/pull/15))

### Breaking

- utils: Deprecated `getNativeAmount` and `getReadableAmount` in `src/utils.ts`. This is replaced by `convertDecimalToNativeInteger`, `convertNativeIntegerToDecimal`, `convertNativeBNToDecimal` in `src/utils.ts`. ([#14](https://github.com/zetamarkets/sdk/pull/14))
- client: Client position `costOfTrades` are now represented in decimal instead of native fixed point integer. ([#14](https://github.com/zetamarkets/sdk/pull/14))
- exchange: Deprecated `Greeks` account `theo` field in `ProductGreeks`. This is now replaced by `Exchange.greeks.markPrices[productIndex]`. ([#11](https://github.com/zetamarkets/sdk/pull/11))

## [0.7.3] 2021-11-29

- error: Move error related functionality to error.ts. ([#6](https://github.com/zetamarkets/sdk/pull/6))
- client: Add `CancelMultipleOrders`. ([#8](https://github.com/zetamarkets/sdk/pull/8))

Note: Skipped versions due to NPM issues.

## [0.7.0] 2021-11-17

- client: improve logging on deposit.
- client: throttle defaults to false instead of true.
- utils: improve display state.
- risk: add `getMarginAccountState` to risk calculator for general margin account state.
- general: export anchor Wallet so it is accessible via this sdk.

### Breaking

- exchange: Load `throttle` argument is now `throttleMs` for the ms to throttle per set of markets polled.

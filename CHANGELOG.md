# Changelog

All notable changes to this project will be documented in this file.
Version changes are pinned to SDK releases.

## [Unreleased]

- constants: Migrate to new serum DEX pid to fix execution bug ([#21](https://github.com/zetamarkets/sdk/pull/21))

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

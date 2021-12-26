## Cranking

There are multiple permissionless instructions that `crank` or keep the zeta platform in an up to date state.
This example runs all the necessary instructions.

1. Crank event queue.
- This will process maker fill events to ensure that user margin accounts are in the correct state after trades occur.

2. Update pricing.
- This calls our instruction to recalculate mark prices and greeks for our products on a expiry basis.

3. Retreat market nodes.
- This retreats our volatility surface and interest rates based on the trades that have occurred on the platform.

4. Rebalance insurance vault.
- This moves funds collected from fees between margin accounts and the insurance vault (which is used to ensure platform security).

## Variables

```sh
# See the variables set for cranking frequency and set it here. Times are in milliseconds.
vim .env
```

## Setup

```sh
npm install

npm run start
```

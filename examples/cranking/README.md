## Cranking

There are multiple permissionless instructions that "crank", keeping the zeta platform in an up to date state. This example runs all the necessary instructions.

1. Crank event queue: Process maker fill events to ensure that user margin accounts are in the correct state after trades occur.
2. Update pricing: Recalculate mark prices for our products on an expiry basis. This will also update perp funding rates.
3. Rebalance insurance vault: Moves funds collected from fees between margin accounts and the insurance vault (which is used to ensure platform security).
4. Apply perp funding: Periodically apply any unpaid funding to all margin accounts holding perp positions.
5. Prune expired TIF orders: When an order of TIF expires it must be pruned to get deleted. This happens automatically if a counterparty tries to trade against it however.

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

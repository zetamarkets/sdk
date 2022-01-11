## Setup

This should show how to find previous settlement prints for a given underlying as well as historical strikes for a given expiry timestamp.

You will need to specify the expiration timestamp in the code.

This example specifies the print for `Fri Jan 07 2022 16:00:00 GMT+0800` for `$SOL` options.

```sh
npm install

ts-node settlement-print.ts
```

### Expected output

```
https://api.devnet.solana.com
Loading exchange.
Oracle subscribing to feed SOL/USD
Exchange loaded @ Tue Jan 11 2022 13:36:13 GMT+0800 (Singapore Standard Time)
Displaying strikes for expiration @ Fri Jan 07 2022 16:00:00 GMT+0800 (Singapore Standard Time)
Market index: 0 = 90
Market index: 1 = 95
Market index: 2 = 100
Market index: 3 = 125
Market index: 4 = 150
Market index: 5 = 175
Market index: 6 = 200
Market index: 7 = 225
Market index: 8 = 250
Market index: 9 = 275
Market index: 10 = 300
Market index: 11 = 90
Market index: 12 = 95
Market index: 13 = 100
Market index: 14 = 125
Market index: 15 = 150
Market index: 16 = 175
Market index: 17 = 200
Market index: 18 = 225
Market index: 19 = 250
Market index: 20 = 275
Market index: 21 = 300
Market index: 22 = 0
Settlement price: 138.75
```

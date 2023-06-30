<div align="center">
  <img height="120px" src="./logo.png" />

  <h1 style="margin-top: 0px">Zeta Liquidator 💦</h1>

  <p>
    <a href="https://discord.gg/dD7YREfBkR"
      ><img
        alt="Discord Chat"
        src="https://img.shields.io/discord/841556000632078378?color=blueviolet"
    /></a>
    <a href="https://opensource.org/licenses/Apache-2.0"
      ><img
        alt="License"
        src="https://img.shields.io/badge/License-Apache%202.0-blueviolet"
    /></a>
  </p>
</div>

<div align="center">
⚠️⚠️WARNING⚠️⚠️
 <h3 style="margin-top: 0px">Performing liquidations is a risky endeavour, and is not guaranteed to be profitable. Those performing liquidations should be advised that their capital is not guaranteed to be safe and should only risk what they are willing to lose. This software is unaudited / untested and should solely serve as an example for interacting with the Zeta DEX.  </h3>
</div>

# Zeta Liquidator

This is the typescript library containing an example liquidator, which helps secure the Zeta platform from overbankrupt accounts.

[Learn more about Zeta.](https://zetamarkets.gitbook.io/zeta/whitepaper/)

[Try out Zeta devnet.](https://devnet.zeta.markets/)

## Variables

| Key         |                    Value                     |
| ----------- | :------------------------------------------: |
| NETWORK_URL |        https://api.devnet.solana.com         |
| PROGRAM_ID  | BG3oRikW8d16YjUEmX3ZxHm9SiJzrGtMhsSR8aCw1Cd7 |

PROGRAM_ID is subject to change based on redeployments.

## Context

Zeta is a protocol that allows the trading of undercollateralized perps, futures and options on Solana, using an orderbook matching system. Zeta is available with SOL, BTC and ETH as underlying assets, with more to come!

The Zeta liquidator repository contains two basic liquidator examples that should work out of the box and provide baseline examples for how to run a liquidator. Zeta's full-liquidator liquidates any future or option that requires liquidation, as long as there is enough capital in the liquidator's vault.

How the liquidation process works on Zeta DEX:

1. An underwater account goes below maintenance margin, and is able to be liquidated.
2. Liquidators must cancel all open orders for that account before performing liquidations.
3. Liquidations occur at mark price +/- a liquidation reward for shorts/longs. This reward is currently set at 30% of the maintenance margin requirement.
4. Liquidators can send in liquidation instructions and proceed to liquidate positions one at a time for a certain party. At each liquidation instruction the smart contract code checks that the user is still below their maintenance margin requirement (partial liquidations).

## Getting started

Generating a new keypair.

```sh
solana-keygen new -o bot-key.json

# View new pubkey address
solana-keygen pubkey bot-key.json

# Put private key into .env file
echo private_key=`cat bot-key.json` >> .env
```

| Key               |                    Value                     |                                    Explanation                                     |
| ----------------- | :------------------------------------------: | :--------------------------------------------------------------------------------: |
| check_interval_ms |                     5000                     | The frequency in milliseconds that the script will scan for liquidatable accounts. |
| connection        |        https://api.devnet.solana.com         |                          The rpc endpoint to connect to.                           |
| program_id        | BG3oRikW8d16YjUEmX3ZxHm9SiJzrGtMhsSR8aCw1Cd7 |                                 Zeta's Program ID.                                 |
| private_key       |        [insert your private key here]        |              The private key you will use for your liquidator client.              |
| server_url        |    dex-devnet-webserver-ecs.zeta.markets     |                    The server endpoint to airdrop devnet usdc.                     |

# Install dependencies

```sh
npm install
```

# Run script

```
npm run start
```

# Contribute to the Repo

Please reach out on Zeta's Discord or Twitter if you're interested in joining Zeta's awesome open source community and contributing code!

## Licensing

[Apache 2.0](./LICENSE).

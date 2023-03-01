export type Zeta = {
  "version": "0.1.0",
  "name": "zeta",
  "instructions": [
    {
      "name": "initializeZetaGroup",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "underlyingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpSyncQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "underlying",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeZetaGroupArgs"
          }
        }
      ]
    },
    {
      "name": "overrideExpiry",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "OverrideExpiryArgs"
          }
        }
      ]
    },
    {
      "name": "initializeMarginAccount",
      "accounts": [
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "zetaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeSpreadAccount",
      "accounts": [
        {
          "name": "spreadAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "zetaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeMarginAccount",
      "accounts": [
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeSpreadAccount",
      "accounts": [
        {
          "name": "spreadAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializePerpSyncQueue",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "zetaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpSyncQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeMarketIndexes",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketIndexes",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeMarketNode",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeMarketNodeArgs"
          }
        }
      ]
    },
    {
      "name": "haltZetaGroup",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "unhaltZetaGroup",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateHaltState",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "HaltZetaGroupArgs"
          }
        }
      ]
    },
    {
      "name": "updateVolatility",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateVolatilityArgs"
          }
        }
      ]
    },
    {
      "name": "updateInterestRate",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateInterestRateArgs"
          }
        }
      ]
    },
    {
      "name": "addMarketIndexes",
      "docs": [
        "This instruction allows us to generate the market PDA index seed we require",
        "to initialize markets in an order that remains sorted.",
        "Future unlisted markets can still retain this sorted property.",
        "",
        "There are two stages of this instruction:",
        "1. Generating the market pdas that use their respective index as seed 0..TOTAL_MARKETS -1",
        "and populating the keys inside zeta_group. These will be set back to default.",
        "2. Sorting the generated market pdas and storing their respective index seed within",
        "market indexes."
      ],
      "accounts": [
        {
          "name": "marketIndexes",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeZetaState",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referralsAdmin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralsRewardsWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeStateArgs"
          }
        }
      ]
    },
    {
      "name": "initializeZetaTreasuryWallet",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeZetaReferralsRewardsWallet",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referralsRewardsWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateAdmin",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newAdmin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateReferralsAdmin",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newAdmin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateZetaState",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateStateArgs"
          }
        }
      ]
    },
    {
      "name": "updateOracle",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateOracleBackupFeed",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updatePricingParameters",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdatePricingParametersArgs"
          }
        }
      ]
    },
    {
      "name": "updateMarginParameters",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateMarginParametersArgs"
          }
        }
      ]
    },
    {
      "name": "updatePerpParameters",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdatePerpParametersArgs"
          }
        }
      ]
    },
    {
      "name": "updateZetaGroupExpiryParameters",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateZetaGroupExpiryArgs"
          }
        }
      ]
    },
    {
      "name": "cleanZetaMarkets",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cleanZetaMarketsHalted",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "settlePositions",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "settlementAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryTs",
          "type": "u64"
        },
        {
          "name": "settlementNonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "settlePositionsHalted",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "settleSpreadPositions",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "settlementAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryTs",
          "type": "u64"
        },
        {
          "name": "settlementNonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "settleSpreadPositionsHalted",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeMarketStrikes",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "expireSeriesOverride",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "settlementAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "ExpireSeriesOverrideArgs"
          }
        }
      ]
    },
    {
      "name": "expireSeries",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "settlementAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "settlementNonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeZetaMarket",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketIndexes",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "requestQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaBaseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaQuoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexBaseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexQuoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeMarketArgs"
          }
        }
      ]
    },
    {
      "name": "initializeMarketTifEpochCycle",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epochLength",
          "type": "u16"
        }
      ]
    },
    {
      "name": "retreatMarketNodes",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "cleanMarketNodes",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateVolatilityNodes",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "nodes",
          "type": {
            "array": [
              "u64",
              5
            ]
          }
        }
      ]
    },
    {
      "name": "updatePricing",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpBids",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpAsks",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "applyPerpFunding",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updatePricingHalted",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "perpMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpBids",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpAsks",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositInsuranceVault",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawInsuranceVault",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "percentageAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeOpenOrders",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrdersMap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeOpenOrders",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrdersMap",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mapNonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeWhitelistDepositAccount",
      "accounts": [
        {
          "name": "whitelistDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeWhitelistInsuranceAccount",
      "accounts": [
        {
          "name": "whitelistInsuranceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeWhitelistTradingFeesAccount",
      "accounts": [
        {
          "name": "whitelistTradingFeesAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeInsuranceDepositAccount",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "insuranceDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistInsuranceAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "placeOrder",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "placeOrderV2",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "placeOrderV3",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "tag",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "placePerpOrder",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpSyncQueue",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "tag",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "placePerpOrderV2",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpSyncQueue",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "tag",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "tifOffset",
          "type": {
            "option": "u16"
          }
        }
      ]
    },
    {
      "name": "placeOrderV4",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "tag",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "tifOffset",
          "type": {
            "option": "u16"
          }
        }
      ]
    },
    {
      "name": "cancelOrder",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "cancelOrderNoError",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "cancelAllMarketOrders",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": []
    },
    {
      "name": "cancelOrderHalted",
      "accounts": [
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "cancelOrderByClientOrderId",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "clientOrderId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelOrderByClientOrderIdNoError",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "clientOrderId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelExpiredOrder",
      "accounts": [
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "pruneExpiredTifOrders",
      "accounts": [
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQueue",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "forceCancelOrderByOrderId",
      "accounts": [
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "forceCancelOrders",
      "accounts": [
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": []
    },
    {
      "name": "crankEventQueue",
      "docs": [
        "The only events that need to be cranked are maker fills."
      ],
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "collectTreasuryFunds",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "treasuryMovement",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referralsRewardsWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "treasuryMovementType",
          "type": {
            "defined": "TreasuryMovementType"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "rebalanceInsuranceVault",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "liquidate",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "liquidatorMarginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidatedMarginAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "size",
          "type": "u64"
        }
      ]
    },
    {
      "name": "burnVaultTokens",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "settleDexFunds",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaBaseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaQuoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexBaseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexQuoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "positionMovement",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "spreadAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "movementType",
          "type": {
            "defined": "MovementType"
          }
        },
        {
          "name": "movements",
          "type": {
            "vec": {
              "defined": "PositionMovementArg"
            }
          }
        }
      ]
    },
    {
      "name": "transferExcessSpreadBalance",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "spreadAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "toggleMarketMaker",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isMarketMaker",
          "type": "bool"
        }
      ]
    },
    {
      "name": "initializeReferrerAccount",
      "accounts": [
        {
          "name": "referrer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "referrerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "referUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "referrerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeReferrerAlias",
      "accounts": [
        {
          "name": "referrer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "referrerAlias",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referrerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "alias",
          "type": "string"
        }
      ]
    },
    {
      "name": "setReferralsRewards",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralsAdmin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "vec": {
              "defined": "SetReferralsRewardsArgs"
            }
          }
        }
      ]
    },
    {
      "name": "claimReferralsRewards",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralsRewardsWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userReferralsAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "editDelegatedPubkey",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newKey",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "modifyAsset",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newOracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newBackupOracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAsset",
          "type": {
            "defined": "Asset"
          }
        }
      ]
    },
    {
      "name": "resetNumFlexUnderlyings",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "greeks",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "markPrices",
            "type": {
              "array": [
                "u64",
                46
              ]
            }
          },
          {
            "name": "markPricesPadding",
            "type": {
              "array": [
                "u64",
                91
              ]
            }
          },
          {
            "name": "perpMarkPrice",
            "type": "u64"
          },
          {
            "name": "productGreeks",
            "type": {
              "array": [
                {
                  "defined": "ProductGreeks"
                },
                22
              ]
            }
          },
          {
            "name": "productGreeksPadding",
            "type": {
              "array": [
                {
                  "defined": "ProductGreeks"
                },
                44
              ]
            }
          },
          {
            "name": "updateTimestamp",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          },
          {
            "name": "updateTimestampPadding",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          },
          {
            "name": "retreatExpirationTimestamp",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          },
          {
            "name": "retreatExpirationTimestampPadding",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          },
          {
            "name": "interestRate",
            "type": {
              "array": [
                "i64",
                2
              ]
            }
          },
          {
            "name": "interestRatePadding",
            "type": {
              "array": [
                "i64",
                4
              ]
            }
          },
          {
            "name": "nodes",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          },
          {
            "name": "volatility",
            "type": {
              "array": [
                "u64",
                10
              ]
            }
          },
          {
            "name": "volatilityPadding",
            "type": {
              "array": [
                "u64",
                20
              ]
            }
          },
          {
            "name": "nodeKeys",
            "type": {
              "array": [
                "publicKey",
                138
              ]
            }
          },
          {
            "name": "haltForcePricing",
            "type": {
              "array": [
                "bool",
                6
              ]
            }
          },
          {
            "name": "perpUpdateTimestamp",
            "type": "u64"
          },
          {
            "name": "perpFundingDelta",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "perpLatestFundingRate",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "perpLatestMidpoint",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                1593
              ]
            }
          }
        ]
      }
    },
    {
      "name": "marketIndexes",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "indexes",
            "type": {
              "array": [
                "u8",
                138
              ]
            }
          }
        ]
      }
    },
    {
      "name": "openOrdersMap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "state",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "stateNonce",
            "type": "u8"
          },
          {
            "name": "serumNonce",
            "type": "u8"
          },
          {
            "name": "mintAuthNonce",
            "type": "u8"
          },
          {
            "name": "numUnderlyings",
            "type": "u8"
          },
          {
            "name": "numFlexUnderlyings",
            "type": "u8"
          },
          {
            "name": "null",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "strikeInitializationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "pricingFrequencySeconds",
            "type": "u32"
          },
          {
            "name": "liquidatorLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "insuranceVaultLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "nativeD1TradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeD1UnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeWhitelistUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeDepositLimit",
            "type": "u64"
          },
          {
            "name": "expirationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "positionMovementFeeBps",
            "type": "u8"
          },
          {
            "name": "marginConcessionPercentage",
            "type": "u8"
          },
          {
            "name": "treasuryWalletNonce",
            "type": "u8"
          },
          {
            "name": "nativeOptionTradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "referralsAdmin",
            "type": "publicKey"
          },
          {
            "name": "referralsRewardsWalletNonce",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                107
              ]
            }
          }
        ]
      }
    },
    {
      "name": "underlying",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "settlementAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "settlementPrice",
            "type": "u64"
          },
          {
            "name": "strikes",
            "type": {
              "array": [
                "u64",
                23
              ]
            }
          }
        ]
      }
    },
    {
      "name": "perpSyncQueue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "head",
            "type": "u16"
          },
          {
            "name": "length",
            "type": "u16"
          },
          {
            "name": "queue",
            "type": {
              "array": [
                {
                  "defined": "AnchorDecimal"
                },
                600
              ]
            }
          }
        ]
      }
    },
    {
      "name": "zetaGroup",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "vaultNonce",
            "type": "u8"
          },
          {
            "name": "insuranceVaultNonce",
            "type": "u8"
          },
          {
            "name": "frontExpiryIndex",
            "type": "u8"
          },
          {
            "name": "haltState",
            "type": {
              "defined": "HaltState"
            }
          },
          {
            "name": "underlyingMint",
            "type": "publicKey"
          },
          {
            "name": "oracle",
            "type": "publicKey"
          },
          {
            "name": "greeks",
            "type": "publicKey"
          },
          {
            "name": "pricingParameters",
            "type": {
              "defined": "PricingParameters"
            }
          },
          {
            "name": "marginParameters",
            "type": {
              "defined": "MarginParameters"
            }
          },
          {
            "name": "products",
            "type": {
              "array": [
                {
                  "defined": "Product"
                },
                46
              ]
            }
          },
          {
            "name": "productsPadding",
            "type": {
              "array": [
                {
                  "defined": "Product"
                },
                91
              ]
            }
          },
          {
            "name": "perp",
            "type": {
              "defined": "Product"
            }
          },
          {
            "name": "expirySeries",
            "type": {
              "array": [
                {
                  "defined": "ExpirySeries"
                },
                2
              ]
            }
          },
          {
            "name": "expirySeriesPadding",
            "type": {
              "array": [
                {
                  "defined": "ExpirySeries"
                },
                4
              ]
            }
          },
          {
            "name": "totalInsuranceVaultDeposits",
            "type": "u64"
          },
          {
            "name": "asset",
            "type": {
              "defined": "Asset"
            }
          },
          {
            "name": "expiryIntervalSeconds",
            "type": "u32"
          },
          {
            "name": "newExpiryThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "perpParameters",
            "type": {
              "defined": "PerpParameters"
            }
          },
          {
            "name": "perpSyncQueue",
            "type": "publicKey"
          },
          {
            "name": "oracleBackupFeed",
            "type": "publicKey"
          },
          {
            "name": "perpsOnly",
            "type": "bool"
          },
          {
            "name": "flexUnderlying",
            "type": "bool"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                964
              ]
            }
          }
        ]
      }
    },
    {
      "name": "marketNode",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "nodeUpdates",
            "type": {
              "array": [
                "i64",
                5
              ]
            }
          },
          {
            "name": "interestUpdate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "spreadAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "seriesExpiry",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          },
          {
            "name": "seriesExpiryPadding",
            "type": "u64"
          },
          {
            "name": "positions",
            "type": {
              "array": [
                {
                  "defined": "Position"
                },
                46
              ]
            }
          },
          {
            "name": "positionsPadding",
            "type": {
              "array": [
                {
                  "defined": "Position"
                },
                92
              ]
            }
          },
          {
            "name": "asset",
            "type": {
              "defined": "Asset"
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                262
              ]
            }
          }
        ]
      }
    },
    {
      "name": "marginAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "forceCancelFlag",
            "type": "bool"
          },
          {
            "name": "openOrdersNonce",
            "type": {
              "array": [
                "u8",
                138
              ]
            }
          },
          {
            "name": "seriesExpiry",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          },
          {
            "name": "seriesExpiryPadding",
            "type": "u64"
          },
          {
            "name": "productLedgers",
            "type": {
              "array": [
                {
                  "defined": "ProductLedger"
                },
                46
              ]
            }
          },
          {
            "name": "productLedgersPadding",
            "type": {
              "array": [
                {
                  "defined": "ProductLedger"
                },
                91
              ]
            }
          },
          {
            "name": "perpProductLedger",
            "type": {
              "defined": "ProductLedger"
            }
          },
          {
            "name": "rebalanceAmount",
            "type": "i64"
          },
          {
            "name": "asset",
            "type": {
              "defined": "Asset"
            }
          },
          {
            "name": "accountType",
            "type": {
              "defined": "MarginAccountType"
            }
          },
          {
            "name": "lastFundingDelta",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "delegatedPubkey",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                338
              ]
            }
          }
        ]
      }
    },
    {
      "name": "socializedLossAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "overbankruptAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "whitelistDepositAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "userKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "whitelistInsuranceAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "userKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "insuranceDepositAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "whitelistTradingFeesAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "userKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "referrerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "hasAlias",
            "type": "bool"
          },
          {
            "name": "referrer",
            "type": "publicKey"
          },
          {
            "name": "pendingRewards",
            "type": "u64"
          },
          {
            "name": "claimedRewards",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "referralAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "referrer",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "pendingRewards",
            "type": "u64"
          },
          {
            "name": "claimedRewards",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "referrerAlias",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "alias",
            "type": {
              "array": [
                "u8",
                15
              ]
            }
          },
          {
            "name": "referrer",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ProductGreeks",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "vega",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "volatility",
            "type": {
              "defined": "AnchorDecimal"
            }
          }
        ]
      }
    },
    {
      "name": "AnchorDecimal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "flags",
            "type": "u32"
          },
          {
            "name": "hi",
            "type": "u32"
          },
          {
            "name": "lo",
            "type": "u32"
          },
          {
            "name": "mid",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "HaltState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "halted",
            "type": "bool"
          },
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "markPricesSet",
            "type": {
              "array": [
                "bool",
                2
              ]
            }
          },
          {
            "name": "markPricesSetPadding",
            "type": {
              "array": [
                "bool",
                3
              ]
            }
          },
          {
            "name": "perpMarkPriceSet",
            "type": "bool"
          },
          {
            "name": "marketNodesCleaned",
            "type": {
              "array": [
                "bool",
                2
              ]
            }
          },
          {
            "name": "marketNodesCleanedPadding",
            "type": {
              "array": [
                "bool",
                4
              ]
            }
          },
          {
            "name": "marketCleaned",
            "type": {
              "array": [
                "bool",
                46
              ]
            }
          },
          {
            "name": "marketCleanedPadding",
            "type": {
              "array": [
                "bool",
                91
              ]
            }
          },
          {
            "name": "perpMarketCleaned",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "PricingParameters",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "optionTradeNormalizer",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "futureTradeNormalizer",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "maxVolatilityRetreat",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "maxInterestRetreat",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "maxDelta",
            "type": "u64"
          },
          {
            "name": "minDelta",
            "type": "u64"
          },
          {
            "name": "minVolatility",
            "type": "u64"
          },
          {
            "name": "maxVolatility",
            "type": "u64"
          },
          {
            "name": "minInterestRate",
            "type": "i64"
          },
          {
            "name": "maxInterestRate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "MarginParameters",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "futureMarginInitial",
            "type": "u64"
          },
          {
            "name": "futureMarginMaintenance",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionShortPutCapPercentage",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "PerpParameters",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "maxFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "impactCashDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ExpirySeries",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "activeTs",
            "type": "u64"
          },
          {
            "name": "expiryTs",
            "type": "u64"
          },
          {
            "name": "dirty",
            "type": "bool"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                15
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Strike",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isSet",
            "type": "bool"
          },
          {
            "name": "value",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Product",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "strike",
            "type": {
              "defined": "Strike"
            }
          },
          {
            "name": "dirty",
            "type": "bool"
          },
          {
            "name": "kind",
            "type": {
              "defined": "Kind"
            }
          }
        ]
      }
    },
    {
      "name": "Position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "i64"
          },
          {
            "name": "costOfTrades",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "OrderState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "closingOrders",
            "type": "u64"
          },
          {
            "name": "openingOrders",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "ProductLedger",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "position",
            "type": {
              "defined": "Position"
            }
          },
          {
            "name": "orderState",
            "type": {
              "defined": "OrderState"
            }
          }
        ]
      }
    },
    {
      "name": "HaltZetaGroupArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateVolatilityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expiryIndex",
            "type": "u8"
          },
          {
            "name": "volatility",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "UpdateInterestRateArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expiryIndex",
            "type": "u8"
          },
          {
            "name": "interestRate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "SetReferralsRewardsArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "referralsAccountKey",
            "type": "publicKey"
          },
          {
            "name": "pendingRewards",
            "type": "u64"
          },
          {
            "name": "overwrite",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "ExpireSeriesOverrideArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "settlementNonce",
            "type": "u8"
          },
          {
            "name": "settlementPrice",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeMarketArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "marketNonce",
            "type": "u8"
          },
          {
            "name": "baseMintNonce",
            "type": "u8"
          },
          {
            "name": "quoteMintNonce",
            "type": "u8"
          },
          {
            "name": "zetaBaseVaultNonce",
            "type": "u8"
          },
          {
            "name": "zetaQuoteVaultNonce",
            "type": "u8"
          },
          {
            "name": "dexBaseVaultNonce",
            "type": "u8"
          },
          {
            "name": "dexQuoteVaultNonce",
            "type": "u8"
          },
          {
            "name": "vaultSignerNonce",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeStateArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stateNonce",
            "type": "u8"
          },
          {
            "name": "serumNonce",
            "type": "u8"
          },
          {
            "name": "mintAuthNonce",
            "type": "u8"
          },
          {
            "name": "strikeInitializationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "pricingFrequencySeconds",
            "type": "u32"
          },
          {
            "name": "liquidatorLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "insuranceVaultLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "nativeD1TradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeD1UnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionTradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeWhitelistUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeDepositLimit",
            "type": "u64"
          },
          {
            "name": "expirationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "positionMovementFeeBps",
            "type": "u8"
          },
          {
            "name": "marginConcessionPercentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "InitializeMarketNodeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "OverrideExpiryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expiryIndex",
            "type": "u8"
          },
          {
            "name": "activeTs",
            "type": "u64"
          },
          {
            "name": "expiryTs",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateStateArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "strikeInitializationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "pricingFrequencySeconds",
            "type": "u32"
          },
          {
            "name": "liquidatorLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "insuranceVaultLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "nativeD1TradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeD1UnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionTradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeWhitelistUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeDepositLimit",
            "type": "u64"
          },
          {
            "name": "expirationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "positionMovementFeeBps",
            "type": "u8"
          },
          {
            "name": "marginConcessionPercentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "UpdatePricingParametersArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "optionTradeNormalizer",
            "type": "u64"
          },
          {
            "name": "futureTradeNormalizer",
            "type": "u64"
          },
          {
            "name": "maxVolatilityRetreat",
            "type": "u64"
          },
          {
            "name": "maxInterestRetreat",
            "type": "u64"
          },
          {
            "name": "minDelta",
            "type": "u64"
          },
          {
            "name": "maxDelta",
            "type": "u64"
          },
          {
            "name": "minInterestRate",
            "type": "i64"
          },
          {
            "name": "maxInterestRate",
            "type": "i64"
          },
          {
            "name": "minVolatility",
            "type": "u64"
          },
          {
            "name": "maxVolatility",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateMarginParametersArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "futureMarginInitial",
            "type": "u64"
          },
          {
            "name": "futureMarginMaintenance",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionShortPutCapPercentage",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdatePerpParametersArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "maxFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "perpImpactCashDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeZetaGroupArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "perpsOnly",
            "type": "bool"
          },
          {
            "name": "flexUnderlying",
            "type": "bool"
          },
          {
            "name": "assetOverride",
            "type": {
              "option": {
                "defined": "Asset"
              }
            }
          },
          {
            "name": "zetaGroupNonce",
            "type": "u8"
          },
          {
            "name": "underlyingNonce",
            "type": "u8"
          },
          {
            "name": "greeksNonce",
            "type": "u8"
          },
          {
            "name": "vaultNonce",
            "type": "u8"
          },
          {
            "name": "insuranceVaultNonce",
            "type": "u8"
          },
          {
            "name": "socializedLossAccountNonce",
            "type": "u8"
          },
          {
            "name": "perpSyncQueueNonce",
            "type": "u8"
          },
          {
            "name": "interestRate",
            "type": "i64"
          },
          {
            "name": "volatility",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          },
          {
            "name": "optionTradeNormalizer",
            "type": "u64"
          },
          {
            "name": "futureTradeNormalizer",
            "type": "u64"
          },
          {
            "name": "maxVolatilityRetreat",
            "type": "u64"
          },
          {
            "name": "maxInterestRetreat",
            "type": "u64"
          },
          {
            "name": "maxDelta",
            "type": "u64"
          },
          {
            "name": "minDelta",
            "type": "u64"
          },
          {
            "name": "minInterestRate",
            "type": "i64"
          },
          {
            "name": "maxInterestRate",
            "type": "i64"
          },
          {
            "name": "minVolatility",
            "type": "u64"
          },
          {
            "name": "maxVolatility",
            "type": "u64"
          },
          {
            "name": "futureMarginInitial",
            "type": "u64"
          },
          {
            "name": "futureMarginMaintenance",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionShortPutCapPercentage",
            "type": "u64"
          },
          {
            "name": "expiryIntervalSeconds",
            "type": "u32"
          },
          {
            "name": "newExpiryThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "minFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "maxFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "perpImpactCashDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateZetaGroupExpiryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expiryIntervalSeconds",
            "type": "u32"
          },
          {
            "name": "newExpiryThresholdSeconds",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "UpdateGreeksArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "theo",
            "type": "u64"
          },
          {
            "name": "delta",
            "type": "u32"
          },
          {
            "name": "gamma",
            "type": "u32"
          },
          {
            "name": "volatility",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "PositionMovementArg",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "size",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "ExpirySeriesStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Initialized"
          },
          {
            "name": "Live"
          },
          {
            "name": "Expired"
          },
          {
            "name": "ExpiredDirty"
          }
        ]
      }
    },
    {
      "name": "Kind",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Call"
          },
          {
            "name": "Put"
          },
          {
            "name": "Future"
          },
          {
            "name": "Perp"
          }
        ]
      }
    },
    {
      "name": "OrderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Limit"
          },
          {
            "name": "PostOnly"
          },
          {
            "name": "FillOrKill"
          },
          {
            "name": "ImmediateOrCancel"
          },
          {
            "name": "PostOnlySlide"
          }
        ]
      }
    },
    {
      "name": "Side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Bid"
          },
          {
            "name": "Ask"
          }
        ]
      }
    },
    {
      "name": "Asset",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SOL"
          },
          {
            "name": "BTC"
          },
          {
            "name": "ETH"
          },
          {
            "name": "APT"
          },
          {
            "name": "UNDEFINED"
          }
        ]
      }
    },
    {
      "name": "MovementType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Undefined"
          },
          {
            "name": "Lock"
          },
          {
            "name": "Unlock"
          }
        ]
      }
    },
    {
      "name": "TreasuryMovementType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Undefined"
          },
          {
            "name": "ToTreasuryFromInsurance"
          },
          {
            "name": "ToInsuranceFromTreasury"
          },
          {
            "name": "ToTreasuryFromReferralsRewards"
          },
          {
            "name": "ToReferralsRewardsFromTreasury"
          }
        ]
      }
    },
    {
      "name": "OrderCompleteType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Cancel"
          },
          {
            "name": "Fill"
          },
          {
            "name": "Booted"
          }
        ]
      }
    },
    {
      "name": "MarginRequirement",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initial"
          },
          {
            "name": "Maintenance"
          },
          {
            "name": "MaintenanceIncludingOrders"
          },
          {
            "name": "MarketMakerConcession"
          }
        ]
      }
    },
    {
      "name": "MarginAccountType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Normal"
          },
          {
            "name": "MarketMaker"
          }
        ]
      }
    },
    {
      "name": "PlaceOrderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "PlaceOrder"
          },
          {
            "name": "PlacePerpOrder"
          }
        ]
      }
    },
    {
      "name": "ValidationType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Place"
          },
          {
            "name": "Cancel"
          },
          {
            "name": "OpenOrders"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "TradeEvent",
      "fields": [
        {
          "name": "marginAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "index",
          "type": "u8",
          "index": false
        },
        {
          "name": "size",
          "type": "u64",
          "index": false
        },
        {
          "name": "costOfTrades",
          "type": "u64",
          "index": false
        },
        {
          "name": "isBid",
          "type": "bool",
          "index": false
        },
        {
          "name": "clientOrderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "TradeEventV2",
      "fields": [
        {
          "name": "marginAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "index",
          "type": "u8",
          "index": false
        },
        {
          "name": "size",
          "type": "u64",
          "index": false
        },
        {
          "name": "costOfTrades",
          "type": "u64",
          "index": false
        },
        {
          "name": "isBid",
          "type": "bool",
          "index": false
        },
        {
          "name": "clientOrderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u128",
          "index": false
        },
        {
          "name": "asset",
          "type": "u8",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isTaker",
          "type": "bool",
          "index": false
        },
        {
          "name": "sequenceNumber",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PositionMovementEvent",
      "fields": [
        {
          "name": "netBalanceTransfer",
          "type": "i64",
          "index": false
        },
        {
          "name": "marginAccountBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "spreadAccountBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "movementFees",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PlaceOrderEvent",
      "fields": [
        {
          "name": "fee",
          "type": "u64",
          "index": false
        },
        {
          "name": "oraclePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u128",
          "index": false
        },
        {
          "name": "expiryTs",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidationEvent",
      "fields": [
        {
          "name": "liquidatorReward",
          "type": "u64",
          "index": false
        },
        {
          "name": "insuranceReward",
          "type": "u64",
          "index": false
        },
        {
          "name": "costOfTrades",
          "type": "u64",
          "index": false
        },
        {
          "name": "size",
          "type": "i64",
          "index": false
        },
        {
          "name": "remainingLiquidateeBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "remainingLiquidatorBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "markPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "underlyingPrice",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "OrderCompleteEvent",
      "fields": [
        {
          "name": "marginAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "asset",
          "type": {
            "defined": "Asset"
          },
          "index": false
        },
        {
          "name": "marketIndex",
          "type": "u8",
          "index": false
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          },
          "index": false
        },
        {
          "name": "unfilledSize",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u128",
          "index": false
        },
        {
          "name": "clientOrderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderCompleteType",
          "type": {
            "defined": "OrderCompleteType"
          },
          "index": false
        }
      ]
    },
    {
      "name": "ApplyFundingEvent",
      "fields": [
        {
          "name": "marginAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "asset",
          "type": {
            "defined": "Asset"
          },
          "index": false
        },
        {
          "name": "balanceChange",
          "type": "i64",
          "index": false
        },
        {
          "name": "remainingBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "fundingRate",
          "type": "i64",
          "index": false
        },
        {
          "name": "oraclePrice",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "DepositOverflow",
      "msg": "Deposit overflow"
    },
    {
      "code": 6001,
      "name": "Unreachable",
      "msg": "Unreachable"
    },
    {
      "code": 6002,
      "name": "FailedInitialMarginRequirement",
      "msg": "Failed initial margin requirement"
    },
    {
      "code": 6003,
      "name": "LiquidatorFailedMarginRequirement",
      "msg": "Liquidator failed margin requirement"
    },
    {
      "code": 6004,
      "name": "CannotLiquidateOwnAccount",
      "msg": "Cannot liquidate own account"
    },
    {
      "code": 6005,
      "name": "CrankInvalidRemainingAccounts",
      "msg": "Invalid cranking remaining accounts"
    },
    {
      "code": 6006,
      "name": "IncorrectTickSize",
      "msg": "Incorrect tick size"
    },
    {
      "code": 6007,
      "name": "ZeroPrice",
      "msg": "ZeroPrice"
    },
    {
      "code": 6008,
      "name": "ZeroSize",
      "msg": "ZeroSize"
    },
    {
      "code": 6009,
      "name": "ZeroWithdrawableBalance",
      "msg": "Zero withdrawable balance"
    },
    {
      "code": 6010,
      "name": "DepositAmountExceeded",
      "msg": "Deposit amount exceeds limit and user is not whitelisted"
    },
    {
      "code": 6011,
      "name": "WithdrawalAmountExceedsWithdrawableBalance",
      "msg": "Withdrawal amount exceeds withdrawable balance"
    },
    {
      "code": 6012,
      "name": "AccountHasSufficientMarginPostCancels",
      "msg": "Account has sufficient margin post cancels"
    },
    {
      "code": 6013,
      "name": "OverBankrupt",
      "msg": "Over bankrupt"
    },
    {
      "code": 6014,
      "name": "AccountHasSufficientMargin",
      "msg": "Account has sufficient margin"
    },
    {
      "code": 6015,
      "name": "UserHasNoActiveOrders",
      "msg": "User has no active orders"
    },
    {
      "code": 6016,
      "name": "InvalidExpirationInterval",
      "msg": "Invalid expiration interval"
    },
    {
      "code": 6017,
      "name": "ProductMarketsAlreadyInitialized",
      "msg": "Product markets already initialized"
    },
    {
      "code": 6018,
      "name": "InvalidProductMarketKey",
      "msg": "Invalid product market key"
    },
    {
      "code": 6019,
      "name": "MarketNotLive",
      "msg": "Market not live"
    },
    {
      "code": 6020,
      "name": "MarketPricingNotReady",
      "msg": "Market pricing not ready"
    },
    {
      "code": 6021,
      "name": "UserHasRemainingOrdersOnExpiredMarket",
      "msg": "User has remaining orders on expired market"
    },
    {
      "code": 6022,
      "name": "InvalidSeriesExpiration",
      "msg": "Invalid series expiration"
    },
    {
      "code": 6023,
      "name": "InvalidExpiredOrderCancel",
      "msg": "Invalid expired order cancel"
    },
    {
      "code": 6024,
      "name": "NoMarketsToAdd",
      "msg": "No markets to add"
    },
    {
      "code": 6025,
      "name": "UserHasUnsettledPositions",
      "msg": "User has unsettled positions"
    },
    {
      "code": 6026,
      "name": "NoMarginAccountsToSettle",
      "msg": "No margin accounts to settle"
    },
    {
      "code": 6027,
      "name": "CannotSettleUserWithActiveOrders",
      "msg": "Cannot settle users with active orders"
    },
    {
      "code": 6028,
      "name": "OrderbookNotEmpty",
      "msg": "Orderbook not empty"
    },
    {
      "code": 6029,
      "name": "InvalidNumberOfAccounts",
      "msg": "Invalid number of accounts"
    },
    {
      "code": 6030,
      "name": "InvalidMarketAccounts",
      "msg": "Bids or Asks don't match the Market"
    },
    {
      "code": 6031,
      "name": "ProductStrikeUninitialized",
      "msg": "Product strike uninitialized"
    },
    {
      "code": 6032,
      "name": "PricingNotUpToDate",
      "msg": "Pricing not up to date"
    },
    {
      "code": 6033,
      "name": "RetreatsAreStale",
      "msg": "Retreats are stale"
    },
    {
      "code": 6034,
      "name": "ProductDirty",
      "msg": "Product dirty"
    },
    {
      "code": 6035,
      "name": "ProductStrikesInitialized",
      "msg": "Product strikes initialized"
    },
    {
      "code": 6036,
      "name": "StrikeInitializationNotReady",
      "msg": "Strike initialization not ready"
    },
    {
      "code": 6037,
      "name": "UnsupportedKind",
      "msg": "Unsupported kind"
    },
    {
      "code": 6038,
      "name": "InvalidZetaGroup",
      "msg": "Invalid zeta group"
    },
    {
      "code": 6039,
      "name": "InvalidMarginAccount",
      "msg": "Invalid margin account"
    },
    {
      "code": 6040,
      "name": "InvalidGreeksAccount",
      "msg": "Invalid greeks account"
    },
    {
      "code": 6041,
      "name": "InvalidSettlementAccount",
      "msg": "Invalid settlement account"
    },
    {
      "code": 6042,
      "name": "InvalidCancelAuthority",
      "msg": "Invalid cancel authority"
    },
    {
      "code": 6043,
      "name": "CannotUpdatePricingAfterExpiry",
      "msg": "Cannot update pricing after expiry"
    },
    {
      "code": 6044,
      "name": "LoadAccountDiscriminatorAlreadySet",
      "msg": "Account discriminator already set"
    },
    {
      "code": 6045,
      "name": "AccountAlreadyInitialized",
      "msg": "Account already initialized"
    },
    {
      "code": 6046,
      "name": "GreeksAccountSeedsMismatch",
      "msg": "Greeks account seeds mismatch"
    },
    {
      "code": 6047,
      "name": "ZetaGroupAccountSeedsMismatch",
      "msg": "Zeta group account seeds mismatch"
    },
    {
      "code": 6048,
      "name": "MarginAccountSeedsMismatch",
      "msg": "Margin account seeds mismatch"
    },
    {
      "code": 6049,
      "name": "OpenOrdersAccountSeedsMismatch",
      "msg": "Open orders account seeds mismatch"
    },
    {
      "code": 6050,
      "name": "MarketNodeAccountSeedsMismatch",
      "msg": "Market node seeds mismatch"
    },
    {
      "code": 6051,
      "name": "UserTradingFeeWhitelistAccountSeedsMismatch",
      "msg": "User trading fee whitelist account seeds mismatch"
    },
    {
      "code": 6052,
      "name": "UserDepositWhitelistAccountSeedsMismatch",
      "msg": "User deposit whitelist account seeds mismatch"
    },
    {
      "code": 6053,
      "name": "MarketIndexesUninitialized",
      "msg": "Market indexes uninitialized"
    },
    {
      "code": 6054,
      "name": "MarketIndexesAlreadyInitialized",
      "msg": "Market indexes already initialized"
    },
    {
      "code": 6055,
      "name": "CannotGetUnsetStrike",
      "msg": "Cannot get unset strike"
    },
    {
      "code": 6056,
      "name": "CannotSetInitializedStrike",
      "msg": "Cannot set initialized strike"
    },
    {
      "code": 6057,
      "name": "CannotResetUninitializedStrike",
      "msg": "Cannot set initialized strike"
    },
    {
      "code": 6058,
      "name": "CrankMarginAccountNotMutable",
      "msg": "CrankMarginAccountNotMutable"
    },
    {
      "code": 6059,
      "name": "InvalidAdminSigner",
      "msg": "InvalidAdminSigner"
    },
    {
      "code": 6060,
      "name": "UserHasActiveOrders",
      "msg": "User still has active orders"
    },
    {
      "code": 6061,
      "name": "UserForceCancelInProgress",
      "msg": "User has a force cancel in progress"
    },
    {
      "code": 6062,
      "name": "FailedPriceBandCheck",
      "msg": "Failed price band check"
    },
    {
      "code": 6063,
      "name": "UnsortedOpenOrdersAccounts",
      "msg": "Unsorted open orders accounts"
    },
    {
      "code": 6064,
      "name": "AccountNotMutable",
      "msg": "Account not mutable"
    },
    {
      "code": 6065,
      "name": "AccountDiscriminatorMismatch",
      "msg": "Account discriminator mismatch"
    },
    {
      "code": 6066,
      "name": "InvalidMarketNodeIndex",
      "msg": "Invalid market node index"
    },
    {
      "code": 6067,
      "name": "InvalidMarketNode",
      "msg": "Invalid market node"
    },
    {
      "code": 6068,
      "name": "LUTOutOfBounds",
      "msg": "Lut out of bounds"
    },
    {
      "code": 6069,
      "name": "RebalanceInsuranceInvalidRemainingAccounts",
      "msg": "Rebalance insurance vault with no margin accounts"
    },
    {
      "code": 6070,
      "name": "InvalidMintDecimals",
      "msg": "Invalid mint decimals"
    },
    {
      "code": 6071,
      "name": "InvalidZetaGroupOracle",
      "msg": "Invalid oracle for this zeta group"
    },
    {
      "code": 6072,
      "name": "InvalidZetaGroupDepositMint",
      "msg": "Invalid zeta group deposit mint"
    },
    {
      "code": 6073,
      "name": "InvalidZetaGroupRebalanceMint",
      "msg": "Invalid zeta group rebalance insurance vault mint"
    },
    {
      "code": 6074,
      "name": "InvalidDepositAmount",
      "msg": "Invalid deposit amount"
    },
    {
      "code": 6075,
      "name": "InvalidTokenAccountOwner",
      "msg": "Invalid token account owner"
    },
    {
      "code": 6076,
      "name": "InvalidWithdrawAmount",
      "msg": "Invalid withdraw amount"
    },
    {
      "code": 6077,
      "name": "InvalidDepositRemainingAccounts",
      "msg": "Invalid number of remaining accounts in deposit"
    },
    {
      "code": 6078,
      "name": "InvalidPlaceOrderRemainingAccounts",
      "msg": "Invalid number of remaining accounts in place order"
    },
    {
      "code": 6079,
      "name": "ClientOrderIdCannotBeZero",
      "msg": "ClientOrderIdCannotBeZero"
    },
    {
      "code": 6080,
      "name": "ZetaGroupHalted",
      "msg": "Zeta group halted"
    },
    {
      "code": 6081,
      "name": "ZetaGroupNotHalted",
      "msg": "Zeta group not halted"
    },
    {
      "code": 6082,
      "name": "HaltMarkPriceNotSet",
      "msg": "Halt mark price not set"
    },
    {
      "code": 6083,
      "name": "HaltMarketsNotCleaned",
      "msg": "Halt markets not cleaned"
    },
    {
      "code": 6084,
      "name": "HaltMarketNodesNotCleaned",
      "msg": "Halt market nodes not cleaned"
    },
    {
      "code": 6085,
      "name": "CannotExpireOptionsAfterExpirationThreshold",
      "msg": "Cannot expire options after expiration threshold"
    },
    {
      "code": 6086,
      "name": "PostOnlyInCross",
      "msg": "Post only order in cross"
    },
    {
      "code": 6087,
      "name": "FillOrKillNotFullSize",
      "msg": "Fill or kill order was not filled for full size"
    },
    {
      "code": 6088,
      "name": "InvalidOpenOrdersMapOwner",
      "msg": "Invalid open orders map owner"
    },
    {
      "code": 6089,
      "name": "AccountDidNotSerialize",
      "msg": "Failed to serialize the account"
    },
    {
      "code": 6090,
      "name": "OpenOrdersWithNonEmptyPositions",
      "msg": "Cannot close open orders account with non empty positions"
    },
    {
      "code": 6091,
      "name": "CannotCloseNonEmptyMarginAccount",
      "msg": "Cannot close margin account that is not empty"
    },
    {
      "code": 6092,
      "name": "InvalidTagLength",
      "msg": "Invalid tag length"
    },
    {
      "code": 6093,
      "name": "NakedShortCallIsNotAllowed",
      "msg": "Naked short call is not allowed"
    },
    {
      "code": 6094,
      "name": "InvalidSpreadAccount",
      "msg": "Invalid spread account"
    },
    {
      "code": 6095,
      "name": "CannotCloseNonEmptySpreadAccount",
      "msg": "Cannot close non empty spread account"
    },
    {
      "code": 6096,
      "name": "SpreadAccountSeedsMismatch",
      "msg": "Spread account seeds mismatch"
    },
    {
      "code": 6097,
      "name": "SpreadAccountHasUnsettledPositions",
      "msg": "Spread account seeds mismatch"
    },
    {
      "code": 6098,
      "name": "SpreadAccountInvalidExpirySeriesState",
      "msg": "Spread account invalid expiry series state"
    },
    {
      "code": 6099,
      "name": "InsufficientFundsToCollateralizeSpreadAccount",
      "msg": "Insufficient funds to collateralize spread account"
    },
    {
      "code": 6100,
      "name": "FailedMaintenanceMarginRequirement",
      "msg": "Failed maintenance margin requirement"
    },
    {
      "code": 6101,
      "name": "InvalidMovement",
      "msg": "Invalid movement"
    },
    {
      "code": 6102,
      "name": "MovementOnExpiredSeries",
      "msg": "Movement on expired series"
    },
    {
      "code": 6103,
      "name": "InvalidMovementSize",
      "msg": "Invalid movement size"
    },
    {
      "code": 6104,
      "name": "ExceededMaxPositionMovements",
      "msg": "Exceeded max position movements"
    },
    {
      "code": 6105,
      "name": "ExceededMaxSpreadAccountContracts",
      "msg": "Exceeded max spread account contracts"
    },
    {
      "code": 6106,
      "name": "OraclePriceIsInvalid",
      "msg": "Fetched oracle price is invalid"
    },
    {
      "code": 6107,
      "name": "InvalidUnderlyingMint",
      "msg": "Provided underlying mint address is invalid"
    },
    {
      "code": 6108,
      "name": "InvalidReferrerAlias",
      "msg": "Invalid referrer alias - Invalid length"
    },
    {
      "code": 6109,
      "name": "ReferrerAlreadyHasAlias",
      "msg": "Referrer already has alias"
    },
    {
      "code": 6110,
      "name": "InvalidTreasuryMovementAmount",
      "msg": "Invalid treasury movement amount"
    },
    {
      "code": 6111,
      "name": "InvalidReferralsAdminSigner",
      "msg": "Invalid referrals admin signer"
    },
    {
      "code": 6112,
      "name": "InvalidSetReferralsRewardsRemainingAccounts",
      "msg": "Invalid set referrals rewards remaining accounts"
    },
    {
      "code": 6113,
      "name": "SetReferralsRewardsAccountNotMutable",
      "msg": "Referrals account not mutable"
    },
    {
      "code": 6114,
      "name": "InvalidClaimReferralsRewardsAmount",
      "msg": "Invalid claim referrals rewards: not enough in refererals rewards wallet"
    },
    {
      "code": 6115,
      "name": "InvalidClaimReferralsRewardsAccount",
      "msg": "Invalid claim referrals rewards: referrals account is not a referral or referrer account"
    },
    {
      "code": 6116,
      "name": "ReferralAccountSeedsMismatch",
      "msg": "Referral account seeds mismatch"
    },
    {
      "code": 6117,
      "name": "ReferrerAccountSeedsMismatch",
      "msg": "Referrer account seeds mismatch"
    },
    {
      "code": 6118,
      "name": "ProtectedMmMarginAccount",
      "msg": "Market maker accounts are protected from liquidation"
    },
    {
      "code": 6119,
      "name": "CannotWithdrawWithOpenOrders",
      "msg": "Cannot withdraw with open orders"
    },
    {
      "code": 6120,
      "name": "FundingRateNotUpToDate",
      "msg": "Perp funding rate not up to date"
    },
    {
      "code": 6121,
      "name": "PerpSyncQueueFull",
      "msg": "Perp taker/maker sync queue is full"
    },
    {
      "code": 6122,
      "name": "PerpSyncQueueAccountSeedsMismatch",
      "msg": "PerpSyncQueue account seeds mismatch"
    },
    {
      "code": 6123,
      "name": "PerpSyncQueueEmpty",
      "msg": "Program tried to pop from an empty perpSyncQueue"
    },
    {
      "code": 6124,
      "name": "InvalidNonPerpMarket",
      "msg": "Perp product index given in placeOrder, use placePerpOrder"
    },
    {
      "code": 6125,
      "name": "InvalidPerpMarket",
      "msg": "Non-perp product index given in placePerpOrder, use placeOrder"
    },
    {
      "code": 6126,
      "name": "CannotInitializePerpMarketNode",
      "msg": "Not allowed to initialize market node for a perp market"
    },
    {
      "code": 6127,
      "name": "DeprecatedInstruction",
      "msg": "Instruction is deprecated, please use the newer version"
    },
    {
      "code": 6128,
      "name": "ForceCancelExpiredTIFOrdersOnly",
      "msg": "Can only force cancel expired TIF orders"
    },
    {
      "code": 6129,
      "name": "InvalidPlaceOrderAuthority",
      "msg": "Invalid place order authority"
    },
    {
      "code": 6130,
      "name": "InvalidOpenOrdersAuthority",
      "msg": "Invalid open orders authority"
    }
  ]
};

export const IDL: Zeta = {
  "version": "0.1.0",
  "name": "zeta",
  "instructions": [
    {
      "name": "initializeZetaGroup",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "underlyingMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "perpSyncQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "underlying",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeZetaGroupArgs"
          }
        }
      ]
    },
    {
      "name": "overrideExpiry",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "OverrideExpiryArgs"
          }
        }
      ]
    },
    {
      "name": "initializeMarginAccount",
      "accounts": [
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "zetaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeSpreadAccount",
      "accounts": [
        {
          "name": "spreadAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "zetaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeMarginAccount",
      "accounts": [
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeSpreadAccount",
      "accounts": [
        {
          "name": "spreadAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializePerpSyncQueue",
      "accounts": [
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "zetaProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpSyncQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeMarketIndexes",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketIndexes",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeMarketNode",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeMarketNodeArgs"
          }
        }
      ]
    },
    {
      "name": "haltZetaGroup",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "unhaltZetaGroup",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateHaltState",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "HaltZetaGroupArgs"
          }
        }
      ]
    },
    {
      "name": "updateVolatility",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateVolatilityArgs"
          }
        }
      ]
    },
    {
      "name": "updateInterestRate",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateInterestRateArgs"
          }
        }
      ]
    },
    {
      "name": "addMarketIndexes",
      "docs": [
        "This instruction allows us to generate the market PDA index seed we require",
        "to initialize markets in an order that remains sorted.",
        "Future unlisted markets can still retain this sorted property.",
        "",
        "There are two stages of this instruction:",
        "1. Generating the market pdas that use their respective index as seed 0..TOTAL_MARKETS -1",
        "and populating the keys inside zeta_group. These will be set back to default.",
        "2. Sorting the generated market pdas and storing their respective index seed within",
        "market indexes."
      ],
      "accounts": [
        {
          "name": "marketIndexes",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeZetaState",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referralsAdmin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralsRewardsWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeStateArgs"
          }
        }
      ]
    },
    {
      "name": "initializeZetaTreasuryWallet",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeZetaReferralsRewardsWallet",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referralsRewardsWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateAdmin",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newAdmin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateReferralsAdmin",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newAdmin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "updateZetaState",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateStateArgs"
          }
        }
      ]
    },
    {
      "name": "updateOracle",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updateOracleBackupFeed",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updatePricingParameters",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdatePricingParametersArgs"
          }
        }
      ]
    },
    {
      "name": "updateMarginParameters",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateMarginParametersArgs"
          }
        }
      ]
    },
    {
      "name": "updatePerpParameters",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdatePerpParametersArgs"
          }
        }
      ]
    },
    {
      "name": "updateZetaGroupExpiryParameters",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "UpdateZetaGroupExpiryArgs"
          }
        }
      ]
    },
    {
      "name": "cleanZetaMarkets",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "cleanZetaMarketsHalted",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "settlePositions",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "settlementAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryTs",
          "type": "u64"
        },
        {
          "name": "settlementNonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "settlePositionsHalted",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "settleSpreadPositions",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "settlementAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryTs",
          "type": "u64"
        },
        {
          "name": "settlementNonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "settleSpreadPositionsHalted",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeMarketStrikes",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "expireSeriesOverride",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "settlementAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "ExpireSeriesOverrideArgs"
          }
        }
      ]
    },
    {
      "name": "expireSeries",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "settlementAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "settlementNonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeZetaMarket",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketIndexes",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "requestQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "baseMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "quoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaBaseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaQuoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexBaseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexQuoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "defined": "InitializeMarketArgs"
          }
        }
      ]
    },
    {
      "name": "initializeMarketTifEpochCycle",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "epochLength",
          "type": "u16"
        }
      ]
    },
    {
      "name": "retreatMarketNodes",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "cleanMarketNodes",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateVolatilityNodes",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "nodes",
          "type": {
            "array": [
              "u64",
              5
            ]
          }
        }
      ]
    },
    {
      "name": "updatePricing",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpBids",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpAsks",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "applyPerpFunding",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "updatePricingHalted",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "perpMarket",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpBids",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpAsks",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "expiryIndex",
          "type": "u8"
        }
      ]
    },
    {
      "name": "deposit",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "depositInsuranceVault",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawInsuranceVault",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "percentageAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeOpenOrders",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrdersMap",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "closeOpenOrders",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrdersMap",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "mapNonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeWhitelistDepositAccount",
      "accounts": [
        {
          "name": "whitelistDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeWhitelistInsuranceAccount",
      "accounts": [
        {
          "name": "whitelistInsuranceAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeWhitelistTradingFeesAccount",
      "accounts": [
        {
          "name": "whitelistTradingFeesAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeInsuranceDepositAccount",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "insuranceDepositAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "whitelistInsuranceAccount",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "nonce",
          "type": "u8"
        }
      ]
    },
    {
      "name": "placeOrder",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "placeOrderV2",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        }
      ]
    },
    {
      "name": "placeOrderV3",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "tag",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "placePerpOrder",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpSyncQueue",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "tag",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "placePerpOrderV2",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "perpSyncQueue",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "tag",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "tifOffset",
          "type": {
            "option": "u16"
          }
        }
      ]
    },
    {
      "name": "placeOrderV4",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "openOrders",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketAccounts",
          "accounts": [
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "requestQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "orderPayerTokenAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcVault",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "coinWallet",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "pcWallet",
              "isMut": true,
              "isSigner": false
            }
          ]
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marketNode",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "marketMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "size",
          "type": "u64"
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderType",
          "type": {
            "defined": "OrderType"
          }
        },
        {
          "name": "clientOrderId",
          "type": {
            "option": "u64"
          }
        },
        {
          "name": "tag",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "tifOffset",
          "type": {
            "option": "u16"
          }
        }
      ]
    },
    {
      "name": "cancelOrder",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "cancelOrderNoError",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "cancelAllMarketOrders",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": []
    },
    {
      "name": "cancelOrderHalted",
      "accounts": [
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "cancelOrderByClientOrderId",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "clientOrderId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelOrderByClientOrderIdNoError",
      "accounts": [
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "clientOrderId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "cancelExpiredOrder",
      "accounts": [
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "pruneExpiredTifOrders",
      "accounts": [
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "bids",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "asks",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQueue",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "forceCancelOrderByOrderId",
      "accounts": [
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": [
        {
          "name": "side",
          "type": {
            "defined": "Side"
          }
        },
        {
          "name": "orderId",
          "type": "u128"
        }
      ]
    },
    {
      "name": "forceCancelOrders",
      "accounts": [
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "cancelAccounts",
          "accounts": [
            {
              "name": "zetaGroup",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "state",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "marginAccount",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "dexProgram",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "serumAuthority",
              "isMut": false,
              "isSigner": false
            },
            {
              "name": "openOrders",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "market",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "bids",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "asks",
              "isMut": true,
              "isSigner": false
            },
            {
              "name": "eventQueue",
              "isMut": true,
              "isSigner": false
            }
          ]
        }
      ],
      "args": []
    },
    {
      "name": "crankEventQueue",
      "docs": [
        "The only events that need to be cranked are maker fills."
      ],
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "eventQueue",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "collectTreasuryFunds",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "treasuryMovement",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referralsRewardsWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "treasuryMovementType",
          "type": {
            "defined": "TreasuryMovementType"
          }
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "rebalanceInsuranceVault",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "insuranceVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasuryWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "socializedLossAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "liquidate",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidator",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "liquidatorMarginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "liquidatedMarginAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "size",
          "type": "u64"
        }
      ]
    },
    {
      "name": "burnVaultTokens",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "settleDexFunds",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "market",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaBaseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "zetaQuoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexBaseVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dexQuoteVault",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "serumAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dexProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "positionMovement",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "spreadAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "greeks",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupFeed",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "movementType",
          "type": {
            "defined": "MovementType"
          }
        },
        {
          "name": "movements",
          "type": {
            "vec": {
              "defined": "PositionMovementArg"
            }
          }
        }
      ]
    },
    {
      "name": "transferExcessSpreadBalance",
      "accounts": [
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "spreadAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "toggleMarketMaker",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "isMarketMaker",
          "type": "bool"
        }
      ]
    },
    {
      "name": "initializeReferrerAccount",
      "accounts": [
        {
          "name": "referrer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "referrerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "referUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "referrerAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initializeReferrerAlias",
      "accounts": [
        {
          "name": "referrer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "referrerAlias",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "referrerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "alias",
          "type": "string"
        }
      ]
    },
    {
      "name": "setReferralsRewards",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralsAdmin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "args",
          "type": {
            "vec": {
              "defined": "SetReferralsRewardsArgs"
            }
          }
        }
      ]
    },
    {
      "name": "claimReferralsRewards",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "referralsRewardsWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userReferralsAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "user",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    },
    {
      "name": "editDelegatedPubkey",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "marginAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newKey",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "modifyAsset",
      "accounts": [
        {
          "name": "state",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "zetaGroup",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "newOracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newBackupOracle",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "oracleBackupProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newAsset",
          "type": {
            "defined": "Asset"
          }
        }
      ]
    },
    {
      "name": "resetNumFlexUnderlyings",
      "accounts": [
        {
          "name": "state",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "greeks",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "markPrices",
            "type": {
              "array": [
                "u64",
                46
              ]
            }
          },
          {
            "name": "markPricesPadding",
            "type": {
              "array": [
                "u64",
                91
              ]
            }
          },
          {
            "name": "perpMarkPrice",
            "type": "u64"
          },
          {
            "name": "productGreeks",
            "type": {
              "array": [
                {
                  "defined": "ProductGreeks"
                },
                22
              ]
            }
          },
          {
            "name": "productGreeksPadding",
            "type": {
              "array": [
                {
                  "defined": "ProductGreeks"
                },
                44
              ]
            }
          },
          {
            "name": "updateTimestamp",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          },
          {
            "name": "updateTimestampPadding",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          },
          {
            "name": "retreatExpirationTimestamp",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          },
          {
            "name": "retreatExpirationTimestampPadding",
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          },
          {
            "name": "interestRate",
            "type": {
              "array": [
                "i64",
                2
              ]
            }
          },
          {
            "name": "interestRatePadding",
            "type": {
              "array": [
                "i64",
                4
              ]
            }
          },
          {
            "name": "nodes",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          },
          {
            "name": "volatility",
            "type": {
              "array": [
                "u64",
                10
              ]
            }
          },
          {
            "name": "volatilityPadding",
            "type": {
              "array": [
                "u64",
                20
              ]
            }
          },
          {
            "name": "nodeKeys",
            "type": {
              "array": [
                "publicKey",
                138
              ]
            }
          },
          {
            "name": "haltForcePricing",
            "type": {
              "array": [
                "bool",
                6
              ]
            }
          },
          {
            "name": "perpUpdateTimestamp",
            "type": "u64"
          },
          {
            "name": "perpFundingDelta",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "perpLatestFundingRate",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "perpLatestMidpoint",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                1593
              ]
            }
          }
        ]
      }
    },
    {
      "name": "marketIndexes",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "indexes",
            "type": {
              "array": [
                "u8",
                138
              ]
            }
          }
        ]
      }
    },
    {
      "name": "openOrdersMap",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "state",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "stateNonce",
            "type": "u8"
          },
          {
            "name": "serumNonce",
            "type": "u8"
          },
          {
            "name": "mintAuthNonce",
            "type": "u8"
          },
          {
            "name": "numUnderlyings",
            "type": "u8"
          },
          {
            "name": "numFlexUnderlyings",
            "type": "u8"
          },
          {
            "name": "null",
            "type": {
              "array": [
                "u8",
                7
              ]
            }
          },
          {
            "name": "strikeInitializationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "pricingFrequencySeconds",
            "type": "u32"
          },
          {
            "name": "liquidatorLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "insuranceVaultLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "nativeD1TradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeD1UnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeWhitelistUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeDepositLimit",
            "type": "u64"
          },
          {
            "name": "expirationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "positionMovementFeeBps",
            "type": "u8"
          },
          {
            "name": "marginConcessionPercentage",
            "type": "u8"
          },
          {
            "name": "treasuryWalletNonce",
            "type": "u8"
          },
          {
            "name": "nativeOptionTradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "referralsAdmin",
            "type": "publicKey"
          },
          {
            "name": "referralsRewardsWalletNonce",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                107
              ]
            }
          }
        ]
      }
    },
    {
      "name": "underlying",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "settlementAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "settlementPrice",
            "type": "u64"
          },
          {
            "name": "strikes",
            "type": {
              "array": [
                "u64",
                23
              ]
            }
          }
        ]
      }
    },
    {
      "name": "perpSyncQueue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "head",
            "type": "u16"
          },
          {
            "name": "length",
            "type": "u16"
          },
          {
            "name": "queue",
            "type": {
              "array": [
                {
                  "defined": "AnchorDecimal"
                },
                600
              ]
            }
          }
        ]
      }
    },
    {
      "name": "zetaGroup",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "vaultNonce",
            "type": "u8"
          },
          {
            "name": "insuranceVaultNonce",
            "type": "u8"
          },
          {
            "name": "frontExpiryIndex",
            "type": "u8"
          },
          {
            "name": "haltState",
            "type": {
              "defined": "HaltState"
            }
          },
          {
            "name": "underlyingMint",
            "type": "publicKey"
          },
          {
            "name": "oracle",
            "type": "publicKey"
          },
          {
            "name": "greeks",
            "type": "publicKey"
          },
          {
            "name": "pricingParameters",
            "type": {
              "defined": "PricingParameters"
            }
          },
          {
            "name": "marginParameters",
            "type": {
              "defined": "MarginParameters"
            }
          },
          {
            "name": "products",
            "type": {
              "array": [
                {
                  "defined": "Product"
                },
                46
              ]
            }
          },
          {
            "name": "productsPadding",
            "type": {
              "array": [
                {
                  "defined": "Product"
                },
                91
              ]
            }
          },
          {
            "name": "perp",
            "type": {
              "defined": "Product"
            }
          },
          {
            "name": "expirySeries",
            "type": {
              "array": [
                {
                  "defined": "ExpirySeries"
                },
                2
              ]
            }
          },
          {
            "name": "expirySeriesPadding",
            "type": {
              "array": [
                {
                  "defined": "ExpirySeries"
                },
                4
              ]
            }
          },
          {
            "name": "totalInsuranceVaultDeposits",
            "type": "u64"
          },
          {
            "name": "asset",
            "type": {
              "defined": "Asset"
            }
          },
          {
            "name": "expiryIntervalSeconds",
            "type": "u32"
          },
          {
            "name": "newExpiryThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "perpParameters",
            "type": {
              "defined": "PerpParameters"
            }
          },
          {
            "name": "perpSyncQueue",
            "type": "publicKey"
          },
          {
            "name": "oracleBackupFeed",
            "type": "publicKey"
          },
          {
            "name": "perpsOnly",
            "type": "bool"
          },
          {
            "name": "flexUnderlying",
            "type": "bool"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                964
              ]
            }
          }
        ]
      }
    },
    {
      "name": "marketNode",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "nodeUpdates",
            "type": {
              "array": [
                "i64",
                5
              ]
            }
          },
          {
            "name": "interestUpdate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "spreadAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "seriesExpiry",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          },
          {
            "name": "seriesExpiryPadding",
            "type": "u64"
          },
          {
            "name": "positions",
            "type": {
              "array": [
                {
                  "defined": "Position"
                },
                46
              ]
            }
          },
          {
            "name": "positionsPadding",
            "type": {
              "array": [
                {
                  "defined": "Position"
                },
                92
              ]
            }
          },
          {
            "name": "asset",
            "type": {
              "defined": "Asset"
            }
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                262
              ]
            }
          }
        ]
      }
    },
    {
      "name": "marginAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "balance",
            "type": "u64"
          },
          {
            "name": "forceCancelFlag",
            "type": "bool"
          },
          {
            "name": "openOrdersNonce",
            "type": {
              "array": [
                "u8",
                138
              ]
            }
          },
          {
            "name": "seriesExpiry",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          },
          {
            "name": "seriesExpiryPadding",
            "type": "u64"
          },
          {
            "name": "productLedgers",
            "type": {
              "array": [
                {
                  "defined": "ProductLedger"
                },
                46
              ]
            }
          },
          {
            "name": "productLedgersPadding",
            "type": {
              "array": [
                {
                  "defined": "ProductLedger"
                },
                91
              ]
            }
          },
          {
            "name": "perpProductLedger",
            "type": {
              "defined": "ProductLedger"
            }
          },
          {
            "name": "rebalanceAmount",
            "type": "i64"
          },
          {
            "name": "asset",
            "type": {
              "defined": "Asset"
            }
          },
          {
            "name": "accountType",
            "type": {
              "defined": "MarginAccountType"
            }
          },
          {
            "name": "lastFundingDelta",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "delegatedPubkey",
            "type": "publicKey"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                338
              ]
            }
          }
        ]
      }
    },
    {
      "name": "socializedLossAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "overbankruptAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "whitelistDepositAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "userKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "whitelistInsuranceAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "userKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "insuranceDepositAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "whitelistTradingFeesAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "userKey",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "referrerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "hasAlias",
            "type": "bool"
          },
          {
            "name": "referrer",
            "type": "publicKey"
          },
          {
            "name": "pendingRewards",
            "type": "u64"
          },
          {
            "name": "claimedRewards",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "referralAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "referrer",
            "type": "publicKey"
          },
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "pendingRewards",
            "type": "u64"
          },
          {
            "name": "claimedRewards",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "referrerAlias",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "alias",
            "type": {
              "array": [
                "u8",
                15
              ]
            }
          },
          {
            "name": "referrer",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "ProductGreeks",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "delta",
            "type": "u64"
          },
          {
            "name": "vega",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "volatility",
            "type": {
              "defined": "AnchorDecimal"
            }
          }
        ]
      }
    },
    {
      "name": "AnchorDecimal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "flags",
            "type": "u32"
          },
          {
            "name": "hi",
            "type": "u32"
          },
          {
            "name": "lo",
            "type": "u32"
          },
          {
            "name": "mid",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "HaltState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "halted",
            "type": "bool"
          },
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "markPricesSet",
            "type": {
              "array": [
                "bool",
                2
              ]
            }
          },
          {
            "name": "markPricesSetPadding",
            "type": {
              "array": [
                "bool",
                3
              ]
            }
          },
          {
            "name": "perpMarkPriceSet",
            "type": "bool"
          },
          {
            "name": "marketNodesCleaned",
            "type": {
              "array": [
                "bool",
                2
              ]
            }
          },
          {
            "name": "marketNodesCleanedPadding",
            "type": {
              "array": [
                "bool",
                4
              ]
            }
          },
          {
            "name": "marketCleaned",
            "type": {
              "array": [
                "bool",
                46
              ]
            }
          },
          {
            "name": "marketCleanedPadding",
            "type": {
              "array": [
                "bool",
                91
              ]
            }
          },
          {
            "name": "perpMarketCleaned",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "PricingParameters",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "optionTradeNormalizer",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "futureTradeNormalizer",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "maxVolatilityRetreat",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "maxInterestRetreat",
            "type": {
              "defined": "AnchorDecimal"
            }
          },
          {
            "name": "maxDelta",
            "type": "u64"
          },
          {
            "name": "minDelta",
            "type": "u64"
          },
          {
            "name": "minVolatility",
            "type": "u64"
          },
          {
            "name": "maxVolatility",
            "type": "u64"
          },
          {
            "name": "minInterestRate",
            "type": "i64"
          },
          {
            "name": "maxInterestRate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "MarginParameters",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "futureMarginInitial",
            "type": "u64"
          },
          {
            "name": "futureMarginMaintenance",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionShortPutCapPercentage",
            "type": "u64"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          }
        ]
      }
    },
    {
      "name": "PerpParameters",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "maxFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "impactCashDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "ExpirySeries",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "activeTs",
            "type": "u64"
          },
          {
            "name": "expiryTs",
            "type": "u64"
          },
          {
            "name": "dirty",
            "type": "bool"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                15
              ]
            }
          }
        ]
      }
    },
    {
      "name": "Strike",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isSet",
            "type": "bool"
          },
          {
            "name": "value",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "Product",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "publicKey"
          },
          {
            "name": "strike",
            "type": {
              "defined": "Strike"
            }
          },
          {
            "name": "dirty",
            "type": "bool"
          },
          {
            "name": "kind",
            "type": {
              "defined": "Kind"
            }
          }
        ]
      }
    },
    {
      "name": "Position",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "size",
            "type": "i64"
          },
          {
            "name": "costOfTrades",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "OrderState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "closingOrders",
            "type": "u64"
          },
          {
            "name": "openingOrders",
            "type": {
              "array": [
                "u64",
                2
              ]
            }
          }
        ]
      }
    },
    {
      "name": "ProductLedger",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "position",
            "type": {
              "defined": "Position"
            }
          },
          {
            "name": "orderState",
            "type": {
              "defined": "OrderState"
            }
          }
        ]
      }
    },
    {
      "name": "HaltZetaGroupArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "spotPrice",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateVolatilityArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expiryIndex",
            "type": "u8"
          },
          {
            "name": "volatility",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          }
        ]
      }
    },
    {
      "name": "UpdateInterestRateArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expiryIndex",
            "type": "u8"
          },
          {
            "name": "interestRate",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "SetReferralsRewardsArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "referralsAccountKey",
            "type": "publicKey"
          },
          {
            "name": "pendingRewards",
            "type": "u64"
          },
          {
            "name": "overwrite",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "ExpireSeriesOverrideArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "settlementNonce",
            "type": "u8"
          },
          {
            "name": "settlementPrice",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeMarketArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "marketNonce",
            "type": "u8"
          },
          {
            "name": "baseMintNonce",
            "type": "u8"
          },
          {
            "name": "quoteMintNonce",
            "type": "u8"
          },
          {
            "name": "zetaBaseVaultNonce",
            "type": "u8"
          },
          {
            "name": "zetaQuoteVaultNonce",
            "type": "u8"
          },
          {
            "name": "dexBaseVaultNonce",
            "type": "u8"
          },
          {
            "name": "dexQuoteVaultNonce",
            "type": "u8"
          },
          {
            "name": "vaultSignerNonce",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeStateArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "stateNonce",
            "type": "u8"
          },
          {
            "name": "serumNonce",
            "type": "u8"
          },
          {
            "name": "mintAuthNonce",
            "type": "u8"
          },
          {
            "name": "strikeInitializationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "pricingFrequencySeconds",
            "type": "u32"
          },
          {
            "name": "liquidatorLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "insuranceVaultLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "nativeD1TradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeD1UnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionTradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeWhitelistUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeDepositLimit",
            "type": "u64"
          },
          {
            "name": "expirationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "positionMovementFeeBps",
            "type": "u8"
          },
          {
            "name": "marginConcessionPercentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "InitializeMarketNodeArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nonce",
            "type": "u8"
          },
          {
            "name": "index",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "OverrideExpiryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expiryIndex",
            "type": "u8"
          },
          {
            "name": "activeTs",
            "type": "u64"
          },
          {
            "name": "expiryTs",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateStateArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "strikeInitializationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "pricingFrequencySeconds",
            "type": "u32"
          },
          {
            "name": "liquidatorLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "insuranceVaultLiquidationPercentage",
            "type": "u32"
          },
          {
            "name": "nativeD1TradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeD1UnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionTradeFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeOptionUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeWhitelistUnderlyingFeePercentage",
            "type": "u64"
          },
          {
            "name": "nativeDepositLimit",
            "type": "u64"
          },
          {
            "name": "expirationThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "positionMovementFeeBps",
            "type": "u8"
          },
          {
            "name": "marginConcessionPercentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "UpdatePricingParametersArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "optionTradeNormalizer",
            "type": "u64"
          },
          {
            "name": "futureTradeNormalizer",
            "type": "u64"
          },
          {
            "name": "maxVolatilityRetreat",
            "type": "u64"
          },
          {
            "name": "maxInterestRetreat",
            "type": "u64"
          },
          {
            "name": "minDelta",
            "type": "u64"
          },
          {
            "name": "maxDelta",
            "type": "u64"
          },
          {
            "name": "minInterestRate",
            "type": "i64"
          },
          {
            "name": "maxInterestRate",
            "type": "i64"
          },
          {
            "name": "minVolatility",
            "type": "u64"
          },
          {
            "name": "maxVolatility",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateMarginParametersArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "futureMarginInitial",
            "type": "u64"
          },
          {
            "name": "futureMarginMaintenance",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionShortPutCapPercentage",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdatePerpParametersArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "minFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "maxFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "perpImpactCashDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "InitializeZetaGroupArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "perpsOnly",
            "type": "bool"
          },
          {
            "name": "flexUnderlying",
            "type": "bool"
          },
          {
            "name": "assetOverride",
            "type": {
              "option": {
                "defined": "Asset"
              }
            }
          },
          {
            "name": "zetaGroupNonce",
            "type": "u8"
          },
          {
            "name": "underlyingNonce",
            "type": "u8"
          },
          {
            "name": "greeksNonce",
            "type": "u8"
          },
          {
            "name": "vaultNonce",
            "type": "u8"
          },
          {
            "name": "insuranceVaultNonce",
            "type": "u8"
          },
          {
            "name": "socializedLossAccountNonce",
            "type": "u8"
          },
          {
            "name": "perpSyncQueueNonce",
            "type": "u8"
          },
          {
            "name": "interestRate",
            "type": "i64"
          },
          {
            "name": "volatility",
            "type": {
              "array": [
                "u64",
                5
              ]
            }
          },
          {
            "name": "optionTradeNormalizer",
            "type": "u64"
          },
          {
            "name": "futureTradeNormalizer",
            "type": "u64"
          },
          {
            "name": "maxVolatilityRetreat",
            "type": "u64"
          },
          {
            "name": "maxInterestRetreat",
            "type": "u64"
          },
          {
            "name": "maxDelta",
            "type": "u64"
          },
          {
            "name": "minDelta",
            "type": "u64"
          },
          {
            "name": "minInterestRate",
            "type": "i64"
          },
          {
            "name": "maxInterestRate",
            "type": "i64"
          },
          {
            "name": "minVolatility",
            "type": "u64"
          },
          {
            "name": "maxVolatility",
            "type": "u64"
          },
          {
            "name": "futureMarginInitial",
            "type": "u64"
          },
          {
            "name": "futureMarginMaintenance",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongInitial",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortInitial",
            "type": "u64"
          },
          {
            "name": "optionMarkPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageLongMaintenance",
            "type": "u64"
          },
          {
            "name": "optionSpotPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionDynamicPercentageShortMaintenance",
            "type": "u64"
          },
          {
            "name": "optionShortPutCapPercentage",
            "type": "u64"
          },
          {
            "name": "expiryIntervalSeconds",
            "type": "u32"
          },
          {
            "name": "newExpiryThresholdSeconds",
            "type": "u32"
          },
          {
            "name": "minFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "maxFundingRatePercent",
            "type": "i64"
          },
          {
            "name": "perpImpactCashDelta",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UpdateZetaGroupExpiryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "expiryIntervalSeconds",
            "type": "u32"
          },
          {
            "name": "newExpiryThresholdSeconds",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "UpdateGreeksArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "theo",
            "type": "u64"
          },
          {
            "name": "delta",
            "type": "u32"
          },
          {
            "name": "gamma",
            "type": "u32"
          },
          {
            "name": "volatility",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "PositionMovementArg",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "size",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "ExpirySeriesStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Initialized"
          },
          {
            "name": "Live"
          },
          {
            "name": "Expired"
          },
          {
            "name": "ExpiredDirty"
          }
        ]
      }
    },
    {
      "name": "Kind",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Call"
          },
          {
            "name": "Put"
          },
          {
            "name": "Future"
          },
          {
            "name": "Perp"
          }
        ]
      }
    },
    {
      "name": "OrderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Limit"
          },
          {
            "name": "PostOnly"
          },
          {
            "name": "FillOrKill"
          },
          {
            "name": "ImmediateOrCancel"
          },
          {
            "name": "PostOnlySlide"
          }
        ]
      }
    },
    {
      "name": "Side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Uninitialized"
          },
          {
            "name": "Bid"
          },
          {
            "name": "Ask"
          }
        ]
      }
    },
    {
      "name": "Asset",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "SOL"
          },
          {
            "name": "BTC"
          },
          {
            "name": "ETH"
          },
          {
            "name": "APT"
          },
          {
            "name": "UNDEFINED"
          }
        ]
      }
    },
    {
      "name": "MovementType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Undefined"
          },
          {
            "name": "Lock"
          },
          {
            "name": "Unlock"
          }
        ]
      }
    },
    {
      "name": "TreasuryMovementType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Undefined"
          },
          {
            "name": "ToTreasuryFromInsurance"
          },
          {
            "name": "ToInsuranceFromTreasury"
          },
          {
            "name": "ToTreasuryFromReferralsRewards"
          },
          {
            "name": "ToReferralsRewardsFromTreasury"
          }
        ]
      }
    },
    {
      "name": "OrderCompleteType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Cancel"
          },
          {
            "name": "Fill"
          },
          {
            "name": "Booted"
          }
        ]
      }
    },
    {
      "name": "MarginRequirement",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Initial"
          },
          {
            "name": "Maintenance"
          },
          {
            "name": "MaintenanceIncludingOrders"
          },
          {
            "name": "MarketMakerConcession"
          }
        ]
      }
    },
    {
      "name": "MarginAccountType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Normal"
          },
          {
            "name": "MarketMaker"
          }
        ]
      }
    },
    {
      "name": "PlaceOrderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "PlaceOrder"
          },
          {
            "name": "PlacePerpOrder"
          }
        ]
      }
    },
    {
      "name": "ValidationType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Place"
          },
          {
            "name": "Cancel"
          },
          {
            "name": "OpenOrders"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "TradeEvent",
      "fields": [
        {
          "name": "marginAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "index",
          "type": "u8",
          "index": false
        },
        {
          "name": "size",
          "type": "u64",
          "index": false
        },
        {
          "name": "costOfTrades",
          "type": "u64",
          "index": false
        },
        {
          "name": "isBid",
          "type": "bool",
          "index": false
        },
        {
          "name": "clientOrderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u128",
          "index": false
        }
      ]
    },
    {
      "name": "TradeEventV2",
      "fields": [
        {
          "name": "marginAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "index",
          "type": "u8",
          "index": false
        },
        {
          "name": "size",
          "type": "u64",
          "index": false
        },
        {
          "name": "costOfTrades",
          "type": "u64",
          "index": false
        },
        {
          "name": "isBid",
          "type": "bool",
          "index": false
        },
        {
          "name": "clientOrderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u128",
          "index": false
        },
        {
          "name": "asset",
          "type": "u8",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "isTaker",
          "type": "bool",
          "index": false
        },
        {
          "name": "sequenceNumber",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PositionMovementEvent",
      "fields": [
        {
          "name": "netBalanceTransfer",
          "type": "i64",
          "index": false
        },
        {
          "name": "marginAccountBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "spreadAccountBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "movementFees",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "PlaceOrderEvent",
      "fields": [
        {
          "name": "fee",
          "type": "u64",
          "index": false
        },
        {
          "name": "oraclePrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u128",
          "index": false
        },
        {
          "name": "expiryTs",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidationEvent",
      "fields": [
        {
          "name": "liquidatorReward",
          "type": "u64",
          "index": false
        },
        {
          "name": "insuranceReward",
          "type": "u64",
          "index": false
        },
        {
          "name": "costOfTrades",
          "type": "u64",
          "index": false
        },
        {
          "name": "size",
          "type": "i64",
          "index": false
        },
        {
          "name": "remainingLiquidateeBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "remainingLiquidatorBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "markPrice",
          "type": "u64",
          "index": false
        },
        {
          "name": "underlyingPrice",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "OrderCompleteEvent",
      "fields": [
        {
          "name": "marginAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "asset",
          "type": {
            "defined": "Asset"
          },
          "index": false
        },
        {
          "name": "marketIndex",
          "type": "u8",
          "index": false
        },
        {
          "name": "side",
          "type": {
            "defined": "Side"
          },
          "index": false
        },
        {
          "name": "unfilledSize",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderId",
          "type": "u128",
          "index": false
        },
        {
          "name": "clientOrderId",
          "type": "u64",
          "index": false
        },
        {
          "name": "orderCompleteType",
          "type": {
            "defined": "OrderCompleteType"
          },
          "index": false
        }
      ]
    },
    {
      "name": "ApplyFundingEvent",
      "fields": [
        {
          "name": "marginAccount",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "asset",
          "type": {
            "defined": "Asset"
          },
          "index": false
        },
        {
          "name": "balanceChange",
          "type": "i64",
          "index": false
        },
        {
          "name": "remainingBalance",
          "type": "u64",
          "index": false
        },
        {
          "name": "fundingRate",
          "type": "i64",
          "index": false
        },
        {
          "name": "oraclePrice",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "DepositOverflow",
      "msg": "Deposit overflow"
    },
    {
      "code": 6001,
      "name": "Unreachable",
      "msg": "Unreachable"
    },
    {
      "code": 6002,
      "name": "FailedInitialMarginRequirement",
      "msg": "Failed initial margin requirement"
    },
    {
      "code": 6003,
      "name": "LiquidatorFailedMarginRequirement",
      "msg": "Liquidator failed margin requirement"
    },
    {
      "code": 6004,
      "name": "CannotLiquidateOwnAccount",
      "msg": "Cannot liquidate own account"
    },
    {
      "code": 6005,
      "name": "CrankInvalidRemainingAccounts",
      "msg": "Invalid cranking remaining accounts"
    },
    {
      "code": 6006,
      "name": "IncorrectTickSize",
      "msg": "Incorrect tick size"
    },
    {
      "code": 6007,
      "name": "ZeroPrice",
      "msg": "ZeroPrice"
    },
    {
      "code": 6008,
      "name": "ZeroSize",
      "msg": "ZeroSize"
    },
    {
      "code": 6009,
      "name": "ZeroWithdrawableBalance",
      "msg": "Zero withdrawable balance"
    },
    {
      "code": 6010,
      "name": "DepositAmountExceeded",
      "msg": "Deposit amount exceeds limit and user is not whitelisted"
    },
    {
      "code": 6011,
      "name": "WithdrawalAmountExceedsWithdrawableBalance",
      "msg": "Withdrawal amount exceeds withdrawable balance"
    },
    {
      "code": 6012,
      "name": "AccountHasSufficientMarginPostCancels",
      "msg": "Account has sufficient margin post cancels"
    },
    {
      "code": 6013,
      "name": "OverBankrupt",
      "msg": "Over bankrupt"
    },
    {
      "code": 6014,
      "name": "AccountHasSufficientMargin",
      "msg": "Account has sufficient margin"
    },
    {
      "code": 6015,
      "name": "UserHasNoActiveOrders",
      "msg": "User has no active orders"
    },
    {
      "code": 6016,
      "name": "InvalidExpirationInterval",
      "msg": "Invalid expiration interval"
    },
    {
      "code": 6017,
      "name": "ProductMarketsAlreadyInitialized",
      "msg": "Product markets already initialized"
    },
    {
      "code": 6018,
      "name": "InvalidProductMarketKey",
      "msg": "Invalid product market key"
    },
    {
      "code": 6019,
      "name": "MarketNotLive",
      "msg": "Market not live"
    },
    {
      "code": 6020,
      "name": "MarketPricingNotReady",
      "msg": "Market pricing not ready"
    },
    {
      "code": 6021,
      "name": "UserHasRemainingOrdersOnExpiredMarket",
      "msg": "User has remaining orders on expired market"
    },
    {
      "code": 6022,
      "name": "InvalidSeriesExpiration",
      "msg": "Invalid series expiration"
    },
    {
      "code": 6023,
      "name": "InvalidExpiredOrderCancel",
      "msg": "Invalid expired order cancel"
    },
    {
      "code": 6024,
      "name": "NoMarketsToAdd",
      "msg": "No markets to add"
    },
    {
      "code": 6025,
      "name": "UserHasUnsettledPositions",
      "msg": "User has unsettled positions"
    },
    {
      "code": 6026,
      "name": "NoMarginAccountsToSettle",
      "msg": "No margin accounts to settle"
    },
    {
      "code": 6027,
      "name": "CannotSettleUserWithActiveOrders",
      "msg": "Cannot settle users with active orders"
    },
    {
      "code": 6028,
      "name": "OrderbookNotEmpty",
      "msg": "Orderbook not empty"
    },
    {
      "code": 6029,
      "name": "InvalidNumberOfAccounts",
      "msg": "Invalid number of accounts"
    },
    {
      "code": 6030,
      "name": "InvalidMarketAccounts",
      "msg": "Bids or Asks don't match the Market"
    },
    {
      "code": 6031,
      "name": "ProductStrikeUninitialized",
      "msg": "Product strike uninitialized"
    },
    {
      "code": 6032,
      "name": "PricingNotUpToDate",
      "msg": "Pricing not up to date"
    },
    {
      "code": 6033,
      "name": "RetreatsAreStale",
      "msg": "Retreats are stale"
    },
    {
      "code": 6034,
      "name": "ProductDirty",
      "msg": "Product dirty"
    },
    {
      "code": 6035,
      "name": "ProductStrikesInitialized",
      "msg": "Product strikes initialized"
    },
    {
      "code": 6036,
      "name": "StrikeInitializationNotReady",
      "msg": "Strike initialization not ready"
    },
    {
      "code": 6037,
      "name": "UnsupportedKind",
      "msg": "Unsupported kind"
    },
    {
      "code": 6038,
      "name": "InvalidZetaGroup",
      "msg": "Invalid zeta group"
    },
    {
      "code": 6039,
      "name": "InvalidMarginAccount",
      "msg": "Invalid margin account"
    },
    {
      "code": 6040,
      "name": "InvalidGreeksAccount",
      "msg": "Invalid greeks account"
    },
    {
      "code": 6041,
      "name": "InvalidSettlementAccount",
      "msg": "Invalid settlement account"
    },
    {
      "code": 6042,
      "name": "InvalidCancelAuthority",
      "msg": "Invalid cancel authority"
    },
    {
      "code": 6043,
      "name": "CannotUpdatePricingAfterExpiry",
      "msg": "Cannot update pricing after expiry"
    },
    {
      "code": 6044,
      "name": "LoadAccountDiscriminatorAlreadySet",
      "msg": "Account discriminator already set"
    },
    {
      "code": 6045,
      "name": "AccountAlreadyInitialized",
      "msg": "Account already initialized"
    },
    {
      "code": 6046,
      "name": "GreeksAccountSeedsMismatch",
      "msg": "Greeks account seeds mismatch"
    },
    {
      "code": 6047,
      "name": "ZetaGroupAccountSeedsMismatch",
      "msg": "Zeta group account seeds mismatch"
    },
    {
      "code": 6048,
      "name": "MarginAccountSeedsMismatch",
      "msg": "Margin account seeds mismatch"
    },
    {
      "code": 6049,
      "name": "OpenOrdersAccountSeedsMismatch",
      "msg": "Open orders account seeds mismatch"
    },
    {
      "code": 6050,
      "name": "MarketNodeAccountSeedsMismatch",
      "msg": "Market node seeds mismatch"
    },
    {
      "code": 6051,
      "name": "UserTradingFeeWhitelistAccountSeedsMismatch",
      "msg": "User trading fee whitelist account seeds mismatch"
    },
    {
      "code": 6052,
      "name": "UserDepositWhitelistAccountSeedsMismatch",
      "msg": "User deposit whitelist account seeds mismatch"
    },
    {
      "code": 6053,
      "name": "MarketIndexesUninitialized",
      "msg": "Market indexes uninitialized"
    },
    {
      "code": 6054,
      "name": "MarketIndexesAlreadyInitialized",
      "msg": "Market indexes already initialized"
    },
    {
      "code": 6055,
      "name": "CannotGetUnsetStrike",
      "msg": "Cannot get unset strike"
    },
    {
      "code": 6056,
      "name": "CannotSetInitializedStrike",
      "msg": "Cannot set initialized strike"
    },
    {
      "code": 6057,
      "name": "CannotResetUninitializedStrike",
      "msg": "Cannot set initialized strike"
    },
    {
      "code": 6058,
      "name": "CrankMarginAccountNotMutable",
      "msg": "CrankMarginAccountNotMutable"
    },
    {
      "code": 6059,
      "name": "InvalidAdminSigner",
      "msg": "InvalidAdminSigner"
    },
    {
      "code": 6060,
      "name": "UserHasActiveOrders",
      "msg": "User still has active orders"
    },
    {
      "code": 6061,
      "name": "UserForceCancelInProgress",
      "msg": "User has a force cancel in progress"
    },
    {
      "code": 6062,
      "name": "FailedPriceBandCheck",
      "msg": "Failed price band check"
    },
    {
      "code": 6063,
      "name": "UnsortedOpenOrdersAccounts",
      "msg": "Unsorted open orders accounts"
    },
    {
      "code": 6064,
      "name": "AccountNotMutable",
      "msg": "Account not mutable"
    },
    {
      "code": 6065,
      "name": "AccountDiscriminatorMismatch",
      "msg": "Account discriminator mismatch"
    },
    {
      "code": 6066,
      "name": "InvalidMarketNodeIndex",
      "msg": "Invalid market node index"
    },
    {
      "code": 6067,
      "name": "InvalidMarketNode",
      "msg": "Invalid market node"
    },
    {
      "code": 6068,
      "name": "LUTOutOfBounds",
      "msg": "Lut out of bounds"
    },
    {
      "code": 6069,
      "name": "RebalanceInsuranceInvalidRemainingAccounts",
      "msg": "Rebalance insurance vault with no margin accounts"
    },
    {
      "code": 6070,
      "name": "InvalidMintDecimals",
      "msg": "Invalid mint decimals"
    },
    {
      "code": 6071,
      "name": "InvalidZetaGroupOracle",
      "msg": "Invalid oracle for this zeta group"
    },
    {
      "code": 6072,
      "name": "InvalidZetaGroupDepositMint",
      "msg": "Invalid zeta group deposit mint"
    },
    {
      "code": 6073,
      "name": "InvalidZetaGroupRebalanceMint",
      "msg": "Invalid zeta group rebalance insurance vault mint"
    },
    {
      "code": 6074,
      "name": "InvalidDepositAmount",
      "msg": "Invalid deposit amount"
    },
    {
      "code": 6075,
      "name": "InvalidTokenAccountOwner",
      "msg": "Invalid token account owner"
    },
    {
      "code": 6076,
      "name": "InvalidWithdrawAmount",
      "msg": "Invalid withdraw amount"
    },
    {
      "code": 6077,
      "name": "InvalidDepositRemainingAccounts",
      "msg": "Invalid number of remaining accounts in deposit"
    },
    {
      "code": 6078,
      "name": "InvalidPlaceOrderRemainingAccounts",
      "msg": "Invalid number of remaining accounts in place order"
    },
    {
      "code": 6079,
      "name": "ClientOrderIdCannotBeZero",
      "msg": "ClientOrderIdCannotBeZero"
    },
    {
      "code": 6080,
      "name": "ZetaGroupHalted",
      "msg": "Zeta group halted"
    },
    {
      "code": 6081,
      "name": "ZetaGroupNotHalted",
      "msg": "Zeta group not halted"
    },
    {
      "code": 6082,
      "name": "HaltMarkPriceNotSet",
      "msg": "Halt mark price not set"
    },
    {
      "code": 6083,
      "name": "HaltMarketsNotCleaned",
      "msg": "Halt markets not cleaned"
    },
    {
      "code": 6084,
      "name": "HaltMarketNodesNotCleaned",
      "msg": "Halt market nodes not cleaned"
    },
    {
      "code": 6085,
      "name": "CannotExpireOptionsAfterExpirationThreshold",
      "msg": "Cannot expire options after expiration threshold"
    },
    {
      "code": 6086,
      "name": "PostOnlyInCross",
      "msg": "Post only order in cross"
    },
    {
      "code": 6087,
      "name": "FillOrKillNotFullSize",
      "msg": "Fill or kill order was not filled for full size"
    },
    {
      "code": 6088,
      "name": "InvalidOpenOrdersMapOwner",
      "msg": "Invalid open orders map owner"
    },
    {
      "code": 6089,
      "name": "AccountDidNotSerialize",
      "msg": "Failed to serialize the account"
    },
    {
      "code": 6090,
      "name": "OpenOrdersWithNonEmptyPositions",
      "msg": "Cannot close open orders account with non empty positions"
    },
    {
      "code": 6091,
      "name": "CannotCloseNonEmptyMarginAccount",
      "msg": "Cannot close margin account that is not empty"
    },
    {
      "code": 6092,
      "name": "InvalidTagLength",
      "msg": "Invalid tag length"
    },
    {
      "code": 6093,
      "name": "NakedShortCallIsNotAllowed",
      "msg": "Naked short call is not allowed"
    },
    {
      "code": 6094,
      "name": "InvalidSpreadAccount",
      "msg": "Invalid spread account"
    },
    {
      "code": 6095,
      "name": "CannotCloseNonEmptySpreadAccount",
      "msg": "Cannot close non empty spread account"
    },
    {
      "code": 6096,
      "name": "SpreadAccountSeedsMismatch",
      "msg": "Spread account seeds mismatch"
    },
    {
      "code": 6097,
      "name": "SpreadAccountHasUnsettledPositions",
      "msg": "Spread account seeds mismatch"
    },
    {
      "code": 6098,
      "name": "SpreadAccountInvalidExpirySeriesState",
      "msg": "Spread account invalid expiry series state"
    },
    {
      "code": 6099,
      "name": "InsufficientFundsToCollateralizeSpreadAccount",
      "msg": "Insufficient funds to collateralize spread account"
    },
    {
      "code": 6100,
      "name": "FailedMaintenanceMarginRequirement",
      "msg": "Failed maintenance margin requirement"
    },
    {
      "code": 6101,
      "name": "InvalidMovement",
      "msg": "Invalid movement"
    },
    {
      "code": 6102,
      "name": "MovementOnExpiredSeries",
      "msg": "Movement on expired series"
    },
    {
      "code": 6103,
      "name": "InvalidMovementSize",
      "msg": "Invalid movement size"
    },
    {
      "code": 6104,
      "name": "ExceededMaxPositionMovements",
      "msg": "Exceeded max position movements"
    },
    {
      "code": 6105,
      "name": "ExceededMaxSpreadAccountContracts",
      "msg": "Exceeded max spread account contracts"
    },
    {
      "code": 6106,
      "name": "OraclePriceIsInvalid",
      "msg": "Fetched oracle price is invalid"
    },
    {
      "code": 6107,
      "name": "InvalidUnderlyingMint",
      "msg": "Provided underlying mint address is invalid"
    },
    {
      "code": 6108,
      "name": "InvalidReferrerAlias",
      "msg": "Invalid referrer alias - Invalid length"
    },
    {
      "code": 6109,
      "name": "ReferrerAlreadyHasAlias",
      "msg": "Referrer already has alias"
    },
    {
      "code": 6110,
      "name": "InvalidTreasuryMovementAmount",
      "msg": "Invalid treasury movement amount"
    },
    {
      "code": 6111,
      "name": "InvalidReferralsAdminSigner",
      "msg": "Invalid referrals admin signer"
    },
    {
      "code": 6112,
      "name": "InvalidSetReferralsRewardsRemainingAccounts",
      "msg": "Invalid set referrals rewards remaining accounts"
    },
    {
      "code": 6113,
      "name": "SetReferralsRewardsAccountNotMutable",
      "msg": "Referrals account not mutable"
    },
    {
      "code": 6114,
      "name": "InvalidClaimReferralsRewardsAmount",
      "msg": "Invalid claim referrals rewards: not enough in refererals rewards wallet"
    },
    {
      "code": 6115,
      "name": "InvalidClaimReferralsRewardsAccount",
      "msg": "Invalid claim referrals rewards: referrals account is not a referral or referrer account"
    },
    {
      "code": 6116,
      "name": "ReferralAccountSeedsMismatch",
      "msg": "Referral account seeds mismatch"
    },
    {
      "code": 6117,
      "name": "ReferrerAccountSeedsMismatch",
      "msg": "Referrer account seeds mismatch"
    },
    {
      "code": 6118,
      "name": "ProtectedMmMarginAccount",
      "msg": "Market maker accounts are protected from liquidation"
    },
    {
      "code": 6119,
      "name": "CannotWithdrawWithOpenOrders",
      "msg": "Cannot withdraw with open orders"
    },
    {
      "code": 6120,
      "name": "FundingRateNotUpToDate",
      "msg": "Perp funding rate not up to date"
    },
    {
      "code": 6121,
      "name": "PerpSyncQueueFull",
      "msg": "Perp taker/maker sync queue is full"
    },
    {
      "code": 6122,
      "name": "PerpSyncQueueAccountSeedsMismatch",
      "msg": "PerpSyncQueue account seeds mismatch"
    },
    {
      "code": 6123,
      "name": "PerpSyncQueueEmpty",
      "msg": "Program tried to pop from an empty perpSyncQueue"
    },
    {
      "code": 6124,
      "name": "InvalidNonPerpMarket",
      "msg": "Perp product index given in placeOrder, use placePerpOrder"
    },
    {
      "code": 6125,
      "name": "InvalidPerpMarket",
      "msg": "Non-perp product index given in placePerpOrder, use placeOrder"
    },
    {
      "code": 6126,
      "name": "CannotInitializePerpMarketNode",
      "msg": "Not allowed to initialize market node for a perp market"
    },
    {
      "code": 6127,
      "name": "DeprecatedInstruction",
      "msg": "Instruction is deprecated, please use the newer version"
    },
    {
      "code": 6128,
      "name": "ForceCancelExpiredTIFOrdersOnly",
      "msg": "Can only force cancel expired TIF orders"
    },
    {
      "code": 6129,
      "name": "InvalidPlaceOrderAuthority",
      "msg": "Invalid place order authority"
    },
    {
      "code": 6130,
      "name": "InvalidOpenOrdersAuthority",
      "msg": "Invalid open orders authority"
    }
  ]
};

import * as anchor from "@zetamarkets/anchor";
import { constants, Client, Exchange, programTypes } from "@zetamarkets/sdk";
import { asset } from "./liquidator";

export async function findAccountsAtRisk(
  accounts: anchor.ProgramAccount[]
): Promise<anchor.ProgramAccount[]> {
  let accountsAtRisk: anchor.ProgramAccount[] = [];
  await Promise.all(
    accounts.map((account: anchor.ProgramAccount) => {
      if (account.account == null) {
        return;
      }
      let marginAccountState = Exchange.riskCalculator.getMarginAccountState(
        account.account as programTypes.MarginAccount
      );
      if (marginAccountState.availableBalanceInitial >= 0) {
        return;
      }
      console.log(
        `[ACCOUNT_AT_RISK] [ACCOUNT]: ${account.publicKey.toString()} [BALANCE]: ${
          marginAccountState.balance
        } [INITIAL] ${marginAccountState.initialMargin} [MAINTENANCE]: ${
          marginAccountState.maintenanceMargin
        } [UNREALIZED PNL] ${
          marginAccountState.unrealizedPnl
        } [AVAILABLE BALANCE INITIAL] ${
          marginAccountState.availableBalanceInitial
        } [AVAILABLE BALANCE MAINTENANCE] ${
          marginAccountState.availableBalanceMaintenance
        }`
      );
      accountsAtRisk.push(account);
    })
  );
  return accountsAtRisk;
}

export async function findLiquidatableAccounts(
  accounts: anchor.ProgramAccount[]
): Promise<anchor.ProgramAccount[]> {
  let liquidatableAccounts: anchor.ProgramAccount[] = [];
  await Promise.all(
    accounts.map((account: anchor.ProgramAccount) => {
      if (account.account == null) {
        return;
      }

      let marginAccountState = Exchange.riskCalculator.getMarginAccountState(
        account.account as programTypes.MarginAccount
      );

      // We assume the accounts passed in have had their open orders cancelled.
      // Therefore can just use availableBalanceLiquidation which assumes 0 open orders.
      if (marginAccountState.availableBalanceMaintenance >= 0) {
        return;
      }
      console.log(
        `[LIQUIDATABLE ACCOUNT] [ACCOUNT] ${account.publicKey.toString()} [BALANCE] ${
          marginAccountState.balance
        } [AVAILABLE BALANCE MAINTENANCE] ${
          marginAccountState.availableBalanceMaintenance
        }`
      );
      liquidatableAccounts.push(account);
    })
  );
  return liquidatableAccounts;
}

export async function cancelAllActiveOrders(
  client: Client,
  accountsAtRisk: anchor.ProgramAccount[]
) {
  await Promise.all(
    accountsAtRisk.map(async (programAccount) => {
      let marginAccount = programAccount.account as programTypes.MarginAccount;
      for (var i = 0; i < marginAccount.productLedgers.length; i++) {
        // If they have any active orders, we can cancel.
        let position = marginAccount.productLedgers[i].orderState;
        if (
          position.openingOrders[0].toNumber() != 0 ||
          position.openingOrders[1].toNumber() != 0 ||
          position.closingOrders.toNumber() != 0
        ) {
          let market = Exchange.getMarket(asset, i);
          console.log(
            "[FORCE_CANCEL] " +
              programAccount.publicKey.toString() +
              " [KIND] " +
              market.kind +
              " [STRIKE] " +
              market.strike +
              " [EXPIRY] " +
              new Date(market.expirySeries.expiryTs * 1000)
          );
          try {
            await client.forceCancelOrders(
              asset,
              market.address,
              programAccount.publicKey
            );
          } catch (e) {
            console.log(e);
          }
        }
      }
    })
  );
}

// Naively liquidates all accounts up to initial margin requirement limits.
export async function liquidateAccounts(
  client: Client,
  accounts: anchor.ProgramAccount[]
) {
  for (var i = 0; i < accounts.length; i++) {
    const liquidateeMarginAccount = accounts[i]
      .account as programTypes.MarginAccount;
    const liquidateeKey = accounts[i].publicKey;

    for (
      var marketIndex = 0;
      marketIndex < liquidateeMarginAccount.productLedgers.length;
      marketIndex++
    ) {
      const position =
        liquidateeMarginAccount.productLedgers[
          marketIndex
        ].position.size.toNumber();

      // Cannot liquidate a position on an expired market.
      if (
        position == 0 ||
        !Exchange.getMarket(asset, marketIndex).expirySeries.isLive()
      ) {
        continue;
      }

      // Get latest state for your margin account.
      await client.updateState();
      let clientState = Exchange.riskCalculator.getMarginAccountState(
        client.getMarginAccount(asset)
      );

      let marginConstrainedSize = calculateMaxLiquidationNativeSize(
        clientState.availableBalanceInitial,
        marketIndex,
        position > 0
      );

      const size = Math.min(marginConstrainedSize, Math.abs(position));
      const side = position > 0 ? "Bid" : "Ask";

      let market = Exchange.getMarket(asset, marketIndex);

      console.log(
        "[LIQUIDATE] " +
          liquidateeKey.toString() +
          " [KIND] " +
          market.kind +
          " [STRIKE] " +
          market.strike +
          " [EXPIRY] " +
          new Date(market.expirySeries.expiryTs * 1000) +
          " [SIDE] " +
          side +
          " [AMOUNT] " +
          size +
          " [MAX CAPACITY WITH MARGIN] " +
          marginConstrainedSize +
          " [AVAILABLE SIZE] " +
          Math.abs(position)
      );
      try {
        let txId = await client.liquidate(
          asset,
          market.address,
          liquidateeKey,
          size
        );
        console.log(`TX ID: ${txId}`);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

/**
 * @param availableBalance  Available balance for the liquidator.
 * @param marketIndex       The market index of the position to be liquidated.
 * @param long              Whether the liquidatee is long or short.
 * @returns native lot size given liquidator available balance.
 */
export function calculateMaxLiquidationNativeSize(
  availableMargin: number,
  marketIndex: number,
  long: boolean
): number {
  // Initial margin requirement per contract in decimals.
  // We use this so you are not at margin requirement limits after liquidation.
  let initialMarginRequirement = long
    ? Exchange.riskCalculator.getMarginRequirements(asset)[marketIndex]
        .initialLong
    : Exchange.riskCalculator.getMarginRequirements(asset)[marketIndex]
        .initialShort;

  return parseInt(
    (
      (availableMargin / initialMarginRequirement) *
      Math.pow(10, constants.POSITION_PRECISION)
    ).toFixed(0)
  );
}

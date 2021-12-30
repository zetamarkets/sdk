import * as anchor from "@project-serum/anchor";
import { constants, Client, Exchange, programTypes } from "@zetamarkets/sdk";

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
      if (marginAccountState.availableBalance >= 0) {
        return;
      }
      console.log(
        `[ACCOUNT_AT_RISK] [ACCOUNT]: ${account.publicKey.toString()} [BALANCE]: ${
          marginAccountState.balance
        } [INITIAL] ${marginAccountState.initialMargin} [MAINTENANCE]: ${
          marginAccountState.maintenanceMargin
        } [TOTAL] ${marginAccountState.totalMargin} [UNREALIZED PNL] ${
          marginAccountState.unrealizedPnl
        } [AVAILABLE BALANCE] ${marginAccountState.availableBalance}`
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
      // Therefore we can add back the initial margin calculated from their
      // current margin account state.
      let adjustedAvailableBalance =
        marginAccountState.availableBalance + marginAccountState.initialMargin;
      if (adjustedAvailableBalance >= 0) {
        return;
      }
      console.log(
        `[LIQUIDATABLE ACCOUNT] [ACCOUNT] ${account.publicKey.toString()} [BALANCE] ${
          marginAccountState.balance
        } [ADJUSTED AVAILABLE BALANCE] ${adjustedAvailableBalance}`
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
      for (var i = 0; i < marginAccount.positions.length; i++) {
        // If they have any active orders, we can cancel.
        let position = marginAccount.positions[i];
        if (
          position.openingOrders[0].toNumber() != 0 ||
          position.openingOrders[1].toNumber() != 0 ||
          position.closingOrders.toNumber() != 0
        ) {
          console.log(
            "[FORCE_CANCEL] " +
              programAccount.publicKey.toString() +
              " [KIND] " +
              Exchange.markets.markets[i].kind +
              " [STRIKE] " +
              Exchange.markets.markets[i].strike +
              " [EXPIRY] " +
              new Date(Exchange.markets.markets[i].expirySeries.expiryTs * 1000)
          );
          try {
            await client.forceCancelOrders(
              Exchange.markets.markets[i].address,
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
      marketIndex < liquidateeMarginAccount.positions.length;
      marketIndex++
    ) {
      const position =
        liquidateeMarginAccount.positions[marketIndex].position.toNumber();

      // Cannot liquidate a position on an expired market.
      if (
        position == 0 ||
        !Exchange.markets.markets[marketIndex].expirySeries.isLive()
      ) {
        continue;
      }

      // Get latest state for your margin account.
      await client.updateState();
      let clientState = Exchange.riskCalculator.getMarginAccountState(
        client.marginAccount
      );

      let marginConstrainedSize = calculateMaxLiquidationNativeSize(
        clientState.availableBalance,
        marketIndex,
        position > 0
      );

      const size = Math.min(marginConstrainedSize, Math.abs(position));
      const side = position > 0 ? "Bid" : "Ask";

      console.log(
        "[LIQUIDATE] " +
          liquidateeKey.toString() +
          " [KIND] " +
          Exchange.markets.markets[marketIndex].kind +
          " [STRIKE] " +
          Exchange.markets.markets[marketIndex].strike +
          " [EXPIRY] " +
          new Date(
            Exchange.markets.markets[marketIndex].expirySeries.expiryTs * 1000
          ) +
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
          Exchange.markets.markets[marketIndex].address,
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
    ? Exchange.riskCalculator.marginRequirement[marketIndex].initialLong
    : Exchange.riskCalculator.marginRequirement[marketIndex].initialShort;

  return parseInt(
    (
      (availableMargin / initialMarginRequirement) *
      Math.pow(10, constants.POSITION_PRECISION)
    ).toFixed(0)
  );
}

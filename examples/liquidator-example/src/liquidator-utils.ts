import * as anchor from "@zetamarkets/anchor";
import {
  constants,
  CrossClient,
  Exchange,
  programTypes,
} from "@zetamarkets/sdk";
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
  client: CrossClient,
  accountsAtRisk: anchor.ProgramAccount[]
) {
  await Promise.all(
    accountsAtRisk.map(async (programAccount) => {
      let marginAccount = programAccount.account as programTypes.MarginAccount;
      // If they have any active orders, we can cancel.
      let position = marginAccount.perpProductLedger.orderState;
      if (
        position.openingOrders[0].toNumber() != 0 ||
        position.openingOrders[1].toNumber() != 0 ||
        position.closingOrders.toNumber() != 0
      ) {
        console.log("[FORCE_CANCEL] " + programAccount.publicKey.toString());
        try {
          await client.forceCancelOrders(asset, programAccount.publicKey);
        } catch (e) {
          console.log(e);
        }
      }
    })
  );
}

// Naively liquidates all accounts up to initial margin requirement limits.
export async function liquidateAccounts(
  client: CrossClient,
  accounts: anchor.ProgramAccount[]
) {
  for (var i = 0; i < accounts.length; i++) {
    const liquidateeMarginAccount = accounts[i]
      .account as programTypes.MarginAccount;
    const liquidateeKey = accounts[i].publicKey;

    const position =
      liquidateeMarginAccount.perpProductLedger.position.size.toNumber();

    if (position == 0) {
      continue;
    }

    // Get latest state for your margin account.
    await client.updateState();
    let clientState = Exchange.riskCalculator.getCrossMarginAccountState(
      client.account
    );

    let marginConstrainedSize = calculateMaxLiquidationNativeSize(
      clientState.availableBalanceInitial,
      position > 0
    );

    const size = Math.min(marginConstrainedSize, Math.abs(position));
    const side = position > 0 ? "Bid" : "Ask";

    console.log(
      "[LIQUIDATE] " +
        liquidateeKey.toString() +
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
      let txId = await client.liquidate(asset, liquidateeKey, size);
      console.log(`TX ID: ${txId}`);
    } catch (e) {
      console.log(e);
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
  long: boolean
): number {
  // Initial margin requirement per contract in decimals.
  // We use this so you are not at margin requirement limits after liquidation.
  let initialMarginRequirement = long
    ? Exchange.riskCalculator.getPerpMarginRequirements(asset).initialLong
    : Exchange.riskCalculator.getPerpMarginRequirements(asset).initialShort;

  return parseInt(
    (
      (availableMargin / initialMarginRequirement) *
      Math.pow(10, constants.POSITION_PRECISION)
    ).toFixed(0)
  );
}

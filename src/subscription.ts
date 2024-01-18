import * as types from "./types";
import { PublicKey, Context, KeyedAccountInfo } from "@solana/web3.js";
import * as anchor from "@zetamarkets/anchor";
import * as bs58 from "bs58";
import { Asset } from "./constants";
import { exchange as Exchange } from "./exchange";

export interface AccountSubscriptionData<T> {
  key: PublicKey;
  account: T;
  context: Context;
}

export function subscribeProgramAccounts<T>(
  accountType: types.ProgramAccountType,
  callback?: (data: AccountSubscriptionData<T>) => void
) {
  const discriminator =
    anchor.BorshAccountsCoder.accountDiscriminator(accountType);

  const subscriptionId = Exchange.connection.onProgramAccountChange(
    Exchange.programId,
    async (keyedAccountInfo: KeyedAccountInfo, context: Context) => {
      let acc =
        Exchange.program.account.crossMarginAccount.coder.accounts.decode(
          accountType,
          keyedAccountInfo.accountInfo.data
        );
      callback({ key: keyedAccountInfo.accountId, account: acc as T, context });
    },
    "confirmed",
    [
      {
        memcmp: {
          offset: 0,
          bytes: bs58.encode(discriminator),
        },
      },
    ]
  );

  Exchange.addProgramSubscriptionId(subscriptionId);
}

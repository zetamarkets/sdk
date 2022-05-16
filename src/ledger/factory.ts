import { LedgerWalletProvider } from "./ledger";

export class WalletProviderFactory {
  static getProvider(args) {
    return new LedgerWalletProvider(args);
  }
}

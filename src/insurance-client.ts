import * as anchor from "@zetamarkets/anchor";
import * as utils from "./utils";
import { exchange as Exchange } from "./exchange";
import {
  InsuranceDepositAccount,
  WhitelistInsuranceAccount,
} from "./program-types";
import {
  PublicKey,
  Connection,
  ConfirmOptions,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import idl from "./idl/zeta.json";
import * as types from "./types";
import * as instructions from "./program-instructions";

export class InsuranceClient {
  /**
   * Returns the user wallet public key.
   */
  public get publicKey(): PublicKey {
    return this._provider.wallet.publicKey;
  }

  /**
   * Anchor provider for client, including wallet.
   */
  public get provider(): anchor.AnchorProvider {
    return this._provider;
  }
  private _provider: anchor.AnchorProvider;

  /**
   * Anchor program wrapper for the IDL.
   */
  private _program: anchor.Program;

  /**
   * InsuranceCLient insurance vault deposit account to track how much they deposited / are allowed to withdraw
   */
  public get insuranceDepositAccount(): InsuranceDepositAccount | null {
    return this._insuranceDepositAccount;
  }
  private _insuranceDepositAccount: InsuranceDepositAccount | null;

  /**
   * InsuranceClient insurance vault deposit account address
   */
  public get insuranceDepositAccountAddress(): PublicKey {
    return this._insuranceDepositAccountAddress;
  }
  private _insuranceDepositAccountAddress: PublicKey;

  /**
   * InsuranceClient white list insurance account address
   */
  public get whitelistInsuranceAccountAddress(): PublicKey | null {
    return this._whitelistInsuranceAccountAddress;
  }
  private _whitelistInsuranceAccountAddress: PublicKey | null;

  /**
   * InsuranceClient usdc account address.
   */
  public get usdcAccountAddress(): PublicKey {
    return this._usdcAccountAddress;
  }
  private _usdcAccountAddress: PublicKey;

  private constructor(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions
  ) {
    this._provider = new anchor.AnchorProvider(connection, wallet, opts);
    this._program = new anchor.Program(
      idl as anchor.Idl,
      Exchange.programId,
      this._provider
    );
    this._insuranceDepositAccount = null;
  }

  /**
   * Returns a new instance of InsuranceClient based of the Exchange singleton
   * Requires Exchange to be loaded
   */
  public static async load(
    connection: Connection,
    wallet: types.Wallet,
    opts: ConfirmOptions = utils.defaultCommitment()
  ): Promise<InsuranceClient> {
    console.log(`Loading insurance client: ${wallet.publicKey.toString()}`);
    let insuranceClient = new InsuranceClient(connection, wallet, opts);

    await insuranceClient.insuranceWhitelistCheck();

    let [insuranceDepositAccountAddress, _insuranceDepositAccountNonce] =
      await utils.getUserInsuranceDepositAccount(
        Exchange.programId,
        wallet.publicKey
      );

    insuranceClient._insuranceDepositAccountAddress =
      insuranceDepositAccountAddress;

    insuranceClient._usdcAccountAddress = await utils.getAssociatedTokenAddress(
      Exchange.usdcMintAddress,
      wallet.publicKey
    );

    try {
      await insuranceClient.updateInsuranceDepositAccount();
    } catch (e) {}

    return insuranceClient;
  }

  public async reloadInsuranceDepositAccount(): Promise<void> {
    let [insuranceDepositAccountAddress, _insuranceDepositAccountNonce] =
      utils.getUserInsuranceDepositAccount(Exchange.programId, this.publicKey);

    this._insuranceDepositAccountAddress = insuranceDepositAccountAddress;
    await this.updateInsuranceDepositAccount();
  }

  /**
   * @param amount the native amount to deposit to the insurance vault (6 d.p)
   */
  public async deposit(amount: number): Promise<TransactionSignature> {
    await this.usdcAccountCheck();

    let tx = new Transaction();
    if (this._insuranceDepositAccount === null) {
      console.log(
        "User has no insurance vault deposit account. Creating insurance vault deposit account..."
      );
      tx.add(
        await instructions.initializeInsuranceDepositAccountIx(
          this.publicKey,
          this.publicKey,
          this.whitelistInsuranceAccountAddress
        )
      );
    }
    tx.add(
      instructions.depositInsuranceVaultV2Ix(
        amount,
        this._insuranceDepositAccountAddress,
        this._usdcAccountAddress,
        this.publicKey
      )
    );
    let txId = await utils.processTransaction(this._provider, tx);
    console.log(
      `[DEPOSIT INSURANCE VAULT] $${utils.convertNativeIntegerToDecimal(
        amount
      )}. Transaction: ${txId}`
    );

    await this.updateInsuranceDepositAccount();
    return txId;
  }

  /**
   * @param percentageAmount the percentage amount to withdraw from the insurance vault (integer percentage)
   */
  public async withdraw(
    percentageAmount: number
  ): Promise<TransactionSignature> {
    let tx = new Transaction();
    tx.add(
      instructions.withdrawInsuranceVaultV2Ix(
        percentageAmount,
        this._insuranceDepositAccountAddress,
        this._usdcAccountAddress,
        this.publicKey
      )
    );
    let txId = await utils.processTransaction(this._provider, tx);
    console.log(
      `[WITHDRAW INSURANCE VAULT] ${percentageAmount}% of Deposit. Transaction: ${txId}`
    );

    await this.updateInsuranceDepositAccount();
    return txId;
  }

  public async updateInsuranceDepositAccount() {
    try {
      this._insuranceDepositAccount =
        (await this._program.account.insuranceDepositAccount.fetch(
          this._insuranceDepositAccountAddress
        )) as unknown as InsuranceDepositAccount;
    } catch (e) {
      console.log(
        "User has no insurance deposit account. Please deposit into the insurance vault if you are whitelisted."
      );
    }
  }

  private async usdcAccountCheck() {
    try {
      let tokenAccountInfo = await utils.getTokenAccountInfo(
        this._provider.connection,
        this._usdcAccountAddress
      );
      console.log(
        `Found user USDC associated token account ${this._usdcAccountAddress.toString()}. Balance = $${utils.convertNativeBNToDecimal(
          tokenAccountInfo.amount
        )}.`
      );
    } catch (e) {
      throw Error(
        "User has no USDC associated token account. Please create one and deposit USDC."
      );
    }
  }

  public async insuranceWhitelistCheck() {
    let [whitelistInsuranceAccountAddress, _whitelistInsuranceAccountNonce] =
      await utils.getUserWhitelistInsuranceAccount(
        Exchange.programId,
        this.publicKey
      );

    try {
      (await this._program.account.whitelistInsuranceAccount.fetch(
        whitelistInsuranceAccountAddress
      )) as unknown as WhitelistInsuranceAccount;
    } catch (e) {
      throw Error("User is not white listed for the insurance vault.");
    }

    this._whitelistInsuranceAccountAddress = whitelistInsuranceAccountAddress;
  }
}

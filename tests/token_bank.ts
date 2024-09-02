import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { TokenBank } from "../target/types/token_bank";
import {
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";

import tokenBankSDK from "../sdk/token_bank";

describe("6-token-bank", () => {
  // let context: ProgramTestContext;
  // let tester: BankrunContextWrapper;
  let program: Program<TokenBank>;
  let provider: anchor.AnchorProvider;

  const keypairs = [
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
  ];

  before(async () => {
    provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    program = anchor.workspace.TokenBank as Program<TokenBank>;
  });

  it("Initialize bank program account", async () => {
    const [mint] = tokenBankSDK.getTokenBankMint(program.programId);

    await program.methods
      .initialize()
      .accounts({
        mint,
      })
      .rpc();

    const [tokenBank] = tokenBankSDK.getTokenBankAddress(program.programId);
    const tokenBankAcc = await program.account.tokenBank.fetch(tokenBank);

    assert.equal(
      tokenBankAcc.authority.toString(),
      provider.wallet.publicKey.toString()
    );
  });

  it("Should be able to mint token", async () => {
    const [mint] = tokenBankSDK.getTokenBankMint(program.programId);
    const [tokenBank] = tokenBankSDK.getTokenBankAddress(program.programId);
    const ata = getAssociatedTokenAddressSync(
      mint,
      provider.wallet.publicKey
    );

    const amount = 10;
    const amountBN = new anchor.BN(amount);

    await program.methods
      .mintToken(amountBN)
      .accounts({
        ata: ata,
        mint: mint,
        tokenBank: tokenBank
      })
      .rpc();

    const balance = await provider.connection.getTokenAccountBalance(ata);
    assert.equal(
      Number(balance.value.amount),
      amount
    );
  });

  // it("Should be able to mint token", async () => {
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   const associatedToken = getAssociatedTokenAddressSync(
  //     mintPk,
  //     context.payer.publicKey
  //   );
  //   const createAtaIx = createAssociatedTokenAccountInstruction(
  //     context.payer.publicKey,
  //     associatedToken,
  //     context.payer.publicKey,
  //     mintPk
  //   );

  //   const mintToIx = createMintToInstruction(
  //     mintPk,
  //     associatedToken,
  //     context.payer.publicKey,
  //     amount
  //   );

  //   const transaction = new anchor.web3.Transaction().add(
  //     createAtaIx,
  //     mintToIx
  //   );
  //   transaction.recentBlockhash = context.lastBlockhash;
  //   transaction.sign(context.payer);
  //   await context.banksClient.processTransaction(transaction);

  //   const account = await getAccount(provider.connection, associatedToken);
  //   assert.equal(Number(account.amount), amount);
  // });

  // it("Should completely deposit", async () => {
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   const seeds = [context.payer.publicKey.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );

  //   const lamportsBefore = await context.banksClient.getBalance(
  //     context.payer.publicKey
  //   );

  //   const transaction = await getDepositTransaction(
  //     amount,
  //     context.payer.publicKey
  //   );
  //   transaction.recentBlockhash = context.lastBlockhash;
  //   transaction.sign(context.payer);
  //   await context.banksClient.processTransaction(transaction);

  //   const lamportsAfter = await context.banksClient.getBalance(
  //     context.payer.publicKey
  //   );
  //   const rentPaid = await context.banksClient.getBalance(pda);
  //   const txFee = BigInt(5000);

  //   const accountData = await program.account.bankAccount.fetch(pda);
  //   assert.equal(accountData.balance.toNumber(), amount);
  //   assert.equal(
  //     lamportsAfter,
  //     lamportsBefore - BigInt(amount) - rentPaid - txFee
  //   );
  // });

  // it("Should completely withdraw", async () => {
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   const seeds = [context.payer.publicKey.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );

  //   const [bankPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );

  //   const walletLamportsBefore = await context.banksClient.getBalance(
  //     context.payer.publicKey
  //   );
  //   const bankLamportsBefore = await context.banksClient.getBalance(bankPda);

  //   const transaction = await getWithdrawTransaction(
  //     amount,
  //     context.payer.publicKey
  //   );
  //   transaction.recentBlockhash = context.lastBlockhash;
  //   transaction.sign(context.payer);

  //   await context.banksClient.processTransaction(transaction);

  //   const transactionFee = BigInt(5000);

  //   const accountData = await program.account.bankAccount.fetch(pda);
  //   assert.equal(accountData.balance.toNumber(), 0);

  //   const walletLamportsAfter = await context.banksClient.getBalance(
  //     context.payer.publicKey
  //   );
  //   const bankLamportsAfter = await context.banksClient.getBalance(bankPda);

  //   assert.equal(
  //     walletLamportsAfter,
  //     walletLamportsBefore + BigInt(amount) - transactionFee
  //   );
  //   assert.equal(bankLamportsAfter, bankLamportsBefore - BigInt(amount));
  // });

  // it("Should completely transfer", async () => {
  //   const numRound = 4;
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   const destinationKeypair = keypairs[numRound];
  //   for (let index in Array.from(new Array(numRound))) {
  //     const keypair = keypairs[index];
  //     await fundKeypair(keypair.publicKey, amount * 2);

  //     const depositTx = await getDepositTransaction(amount, keypair.publicKey);
  //     depositTx.recentBlockhash = context.lastBlockhash;
  //     depositTx.sign(keypair);
  //     await context.banksClient.processTransaction(depositTx);

  //     const transferTx = await getTransferTransaction(
  //       amount,
  //       keypair.publicKey,
  //       destinationKeypair.publicKey
  //     );
  //     transferTx.recentBlockhash = context.lastBlockhash;
  //     transferTx.sign(keypair);
  //     await context.banksClient.processTransaction(transferTx);
  //   }

  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [destinationKeypair.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   const accountData = await program.account.bankAccount.fetch(pda);
  //   assert.equal(accountData.balance.toNumber(), amount * numRound);
  // });

  // it("Should fail when withdraw the transferred balance", async () => {
  //   const keypair = keypairs[0];
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   let withdrawTx: anchor.web3.Transaction;
  //   withdrawTx = await getWithdrawTransaction(amount, keypair.publicKey);
  //   withdrawTx.recentBlockhash = context.lastBlockhash;
  //   withdrawTx.sign(keypair);
  //   const result = await context.banksClient.simulateTransaction(withdrawTx);

  //   const anchorError = anchor.AnchorError.parse(result.meta.logMessages);
  //   if (anchorError) {
  //     assert.equal(anchorError.error.errorCode.code, "InsufficientBalance");
  //   } else {
  //     assert.fail("Should throw error");
  //   }
  // });

  // it("Should successfully withdraw the received balance", async () => {
  //   const index = 4; // Using a different index to avoid conflicts with other tests
  //   const keypair = keypairs[index];
  //   await fundKeypair(keypair.publicKey, 1 * anchor.web3.LAMPORTS_PER_SOL);

  //   const withdrawAmount = 4 * anchor.web3.LAMPORTS_PER_SOL;

  //   const seeds = [keypair.publicKey.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );

  //   const [bankPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );

  //   const walletLamportsBefore = await context.banksClient.getBalance(
  //     keypair.publicKey
  //   );
  //   const bankLamportsBefore = await context.banksClient.getBalance(bankPda);

  //   const withdrawTx = await getWithdrawTransaction(
  //     withdrawAmount,
  //     keypair.publicKey
  //   );
  //   withdrawTx.recentBlockhash = context.lastBlockhash;
  //   withdrawTx.sign(keypair);
  //   await context.banksClient.processTransaction(withdrawTx);

  //   const accountData = await program.account.bankAccount.fetch(pda);
  //   assert.equal(
  //     accountData.balance.toNumber(),
  //     0
  //   );

  //   const walletLamportsAfter = await context.banksClient.getBalance(
  //     keypair.publicKey
  //   );
  //   const bankLamportsAfter = await context.banksClient.getBalance(bankPda);
  //   const transactionFee = BigInt(5000);

  //   assert.equal(
  //     walletLamportsAfter,
  //     walletLamportsBefore + BigInt(withdrawAmount) - transactionFee
  //   );
  //   assert.equal(bankLamportsAfter, bankLamportsBefore - BigInt(withdrawAmount));
  // });

  // it("Should close bank account", async () => {
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   // First, deposit some SOL
  //   const depositTx = await getDepositTransaction(amount, context.payer.publicKey);
  //   depositTx.recentBlockhash = context.lastBlockhash;
  //   depositTx.sign(context.payer)
  //   await context.banksClient.processTransaction(depositTx);

  //   // Then, withdraw all the SOL
  //   const withdrawTx = await getWithdrawTransaction(amount, context.payer.publicKey);
  //   withdrawTx.recentBlockhash = await context.banksClient.getLatestBlockhash().then(res => res[0])
  //   withdrawTx.sign(context.payer)
  //   await context.banksClient.processTransaction(withdrawTx);

  //   const [bankProgramAcc] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );
  //   const bankAccBefore = await program.account.tokenBank.fetch(bankProgramAcc);

  //   // Now, close the account
  //   const closeTx = await getCloseAccountTransaction(context.payer.publicKey);
  //   closeTx.recentBlockhash = await context.banksClient.getLatestBlockhash().then(res => res[0])
  //   closeTx.sign(context.payer)
  //   await context.banksClient.processTransaction(closeTx);

  //   // Check if the account is closed
  //   const seeds = [context.payer.publicKey.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );
  //   const accountInfo = await context.banksClient.getAccount(pda);
  //   assert.isNull(accountInfo, "Account should be closed");

  //   const bankAccAfter = await program.account.tokenBank.fetch(bankProgramAcc);
  //   assert.equal(bankAccAfter.customerCount.toNumber(), bankAccBefore.customerCount.toNumber() - 1, "Customer count should be decreased");
  // });

  // it("Should fail to close bank account with non-zero balance", async () => {
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   // First, deposit some SOL
  //   const depositTx = await getDepositTransaction(amount, context.payer.publicKey);
  //   depositTx.recentBlockhash = await context.banksClient.getLatestBlockhash().then(res => res[0])
  //   depositTx.sign(context.payer);
  //   await context.banksClient.processTransaction(depositTx)

  //   // Try to close the account without withdrawing
  //   const closeTx = await getCloseAccountTransaction(context.payer.publicKey);
  //   closeTx.recentBlockhash = await context.banksClient.getLatestBlockhash().then(res => res[0])
  //   closeTx.sign(context.payer);
  //   const result = await context.banksClient.simulateTransaction(closeTx);

  //   const anchorError = anchor.AnchorError.parse(result.meta.logMessages)

  //   if (anchorError) {
  //     assert.equal(anchorError.error.errorCode.code, "NonZeroBalance");
  //   } else {
  //     assert.fail("Should throw error");
  //   }

  // });
});

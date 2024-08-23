import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { SolBank } from "../target/types/sol_bank";

// const IDL = require("../target/idl/sol_bank.json") as SolBank;

import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";

describe("5-sol-bank", () => {
  // const provider = anchor.AnchorProvider.env();
  let provider: BankrunProvider;
  let program: Program<SolBank>;

  // anchor.setProvider(provider);
  // const program = anchor.workspace.SolBank as Program<SolBank>;

  // const keypairs = [
  //   anchor.web3.Keypair.generate(),
  //   anchor.web3.Keypair.generate(),
  //   anchor.web3.Keypair.generate(),
  //   anchor.web3.Keypair.generate(),
  //   anchor.web3.Keypair.generate(),
  // ];

  // const getProviderAtIndex = (index: number) => {
  //   const connection = new anchor.web3.Connection(
  //     program.provider.connection.rpcEndpoint
  //   );
  //   const wallet = new anchor.Wallet(keypairs[index]);
  //   const provider = new anchor.AnchorProvider(connection, wallet);
  //   return provider;
  // };

  // const topupSol = async (to: anchor.web3.PublicKey, amount: number) => {
  //   const transferInstruction = anchor.web3.SystemProgram.transfer({
  //     fromPubkey: provider.wallet.publicKey,
  //     toPubkey: to,
  //     lamports: amount * anchor.web3.LAMPORTS_PER_SOL,
  //   });
  //   const transaction = new anchor.web3.Transaction();
  //   transaction.add(transferInstruction);
  //   await provider.sendAndConfirm(transaction);
  // };

  // const getDepositTransaction = async (
  //   amount: number,
  //   walletAddr: anchor.web3.PublicKey
  // ) => {
  //   const seeds = [walletAddr.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );

  //   const [bankProgramAcc] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );

  //   const accountInfo = await provider.connection.getAccountInfo(pda);

  //   const transaction = new anchor.web3.Transaction();
  //   if (!accountInfo) {
  //     const initializeBankAccIx = await program.methods
  //       .initializeAccount()
  //       .accounts({ user: walletAddr, signer: walletAddr })
  //       .instruction();
  //     transaction.add(initializeBankAccIx);
  //   }

  //   const depositIx = await program.methods
  //     .deposit(new anchor.BN(amount))
  //     .accounts({ signer: walletAddr, bank: bankProgramAcc, data: pda })
  //     .instruction();

  //   transaction.add(depositIx);

  //   return transaction;
  // };

  // const getWithdrawTransaction = async (
  //   amount: number,
  //   walletAddr: anchor.web3.PublicKey
  // ) => {
  //   const seeds = [walletAddr.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );
  //   const [bankProgramAcc] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );

  //   const transaction = new anchor.web3.Transaction();
  //   const withdrawIx = await program.methods
  //     .withdraw(new anchor.BN(amount))
  //     .accounts({ bank: bankProgramAcc, data: pda, signer: walletAddr })
  //     .instruction();

  //   transaction.add(withdrawIx);

  //   return transaction;
  // };

  // const getTransferTransaction = async (
  //   amount: number,
  //   fromAddr: anchor.web3.PublicKey,
  //   toAddr: anchor.web3.PublicKey
  // ) => {
  //   const [fromPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [fromAddr.toBuffer()],
  //     program.programId
  //   );
  //   const [toPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [toAddr.toBuffer()],
  //     program.programId
  //   );

  //   const accountInfo = await provider.connection.getAccountInfo(toPda);
  //   const transaction = new anchor.web3.Transaction();
  //   if (!accountInfo) {
  //     const initializeIx = await program.methods
  //       .initializeAccount()
  //       .accounts({ user: toAddr, signer: fromAddr })
  //       .instruction();
  //     transaction.add(initializeIx);
  //   }

  //   const transferIx = await program.methods
  //     .transfer(new anchor.BN(amount))
  //     .accounts({
  //       fromAcc: fromPda,
  //       toAcc: toPda,
  //       to: toAddr,
  //       signer: fromAddr,
  //     })
  //     .instruction();

  //   transaction.add(transferIx);

  //   return transaction;
  // };

  // const getCloseAccountTransaction = async (walletAddr: anchor.web3.PublicKey) => {
  //   const seeds = [walletAddr.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );
  //   const [bankProgramAcc] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );

  //   const transaction = new anchor.web3.Transaction();
  //   const closeAccountIx = await program.methods
  //     .closeAccount()
  //     .accounts({ bank: bankProgramAcc, data: pda, signer: walletAddr })
  //     .instruction();

  //   transaction.add(closeAccountIx);

  //   return transaction;
  // };

  // before(async () => {
  //   await Promise.all(keypairs.map((kp) => topupSol(kp.publicKey, 10)));
  // });

  beforeEach(async () => {
    const context = await startAnchor("./", [], []);
    provider = new BankrunProvider(context);
    program = anchor.workspace.SolBank as Program<SolBank>;
    // const puppetProgram = new Program<Puppet>(
    //   PuppetIDL,
    //   PUPPET_PROGRAM_ID,
    //   provider,
    // );
  })

  it("Initialize bank program account", async () => {
    // const seeds = [];
    // const [bankProgramAcc] = anchor.web3.PublicKey.findProgramAddressSync(
    //   seeds,
    //   program.programId
    // );
    // await program.methods.initialize().rpc();
    // const accountData = await program.account.solBank.fetch(bankProgramAcc);
    // assert.equal(accountData.customerCount.toNumber(), 0);
  });

  // it("Should completely deposit", async () => {
  //   const index = 0;
  //   const provider = getProviderAtIndex(index);

  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   const seeds = [provider.wallet.publicKey.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );

  //   const transaction = await getDepositTransaction(
  //     amount,
  //     provider.wallet.publicKey
  //   );
  //   const result = await provider.sendAndConfirm(transaction);
  //   await provider.connection.confirmTransaction(result, "finalized");

  //   const accountData = await program.account.bankAccount.fetch(pda);
  //   assert.equal(accountData.balance.toNumber(), amount);
  // });

  // it("Should completely withdraw", async () => {
  //   const index = 0;
  //   const provider = getProviderAtIndex(index);

  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   const seeds = [provider.wallet.publicKey.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );

  //   const [bankPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );

  //   const walletLamportsBefore = await provider.connection.getBalance(
  //     provider.wallet.publicKey
  //   );
  //   const bankLamportsBefore = await provider.connection.getBalance(bankPda);

  //   const transaction = await getWithdrawTransaction(
  //     amount,
  //     provider.wallet.publicKey
  //   );
  //   const signature = await provider.sendAndConfirm(transaction);

  //   await provider.connection.confirmTransaction(signature, "finalized");
  //   const transactionDetails =
  //     await provider.connection.getConfirmedTransaction(signature);
  //   const transactionFee = transactionDetails.meta.fee;

  //   const accountData = await program.account.bankAccount.fetch(pda);
  //   assert.equal(accountData.balance.toNumber(), 0);

  //   const walletLamportsAfter = await provider.connection.getBalance(
  //     provider.wallet.publicKey
  //   );
  //   const bankLamportsAfter = await provider.connection.getBalance(bankPda);

  //   assert.equal(
  //     walletLamportsAfter,
  //     walletLamportsBefore + amount - transactionFee
  //   );
  //   assert.equal(bankLamportsAfter, bankLamportsBefore - amount);
  // });

  // xit("Should completely transfer", async () => {
  //   const numRound = 4;
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   const destinationKeypair = keypairs[numRound];
  //   for (let index in Array.from(new Array(numRound))) {
  //     const provider = getProviderAtIndex(+index);
  //     const depositTx = await getDepositTransaction(
  //       amount,
  //       provider.wallet.publicKey
  //     );
  //     await provider.sendAndConfirm(depositTx, undefined, { commitment: "finalized" });
  //     const transferTx = await getTransferTransaction(
  //       amount,
  //       provider.wallet.publicKey,
  //       destinationKeypair.publicKey
  //     );
  //     await provider.sendAndConfirm(transferTx, undefined, { commitment: "finalized" });
  //   }

  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [destinationKeypair.publicKey.toBuffer()],
  //     program.programId
  //   );
  //   const accountData = await program.account.bankAccount.fetch(pda);
  //   assert.equal(accountData.balance.toNumber(), amount * numRound);
  // });

  // xit("Should fail when withdraw the transferred balance", async () => {
  //   const provider = getProviderAtIndex(0);
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   try {
  //     const withdrawTx = await getWithdrawTransaction(
  //       amount,
  //       provider.wallet.publicKey
  //     );
  //     await provider.sendAndConfirm(withdrawTx);
  //     assert.fail("Should not be able to withdraw");
  //   } catch (err) {
  //     const anchorError = anchor.AnchorError.parse(err.logs);
  //     if (anchorError) {
  //       assert.equal(anchorError.error.errorCode.code, "InsufficientBalance");
  //     } else {
  //       assert.fail("Unknown error");
  //     }
  //   }
  // });

  // xit("Should successfully withdraw the received balance", async () => {
  //   const index = 4; // Using a different index to avoid conflicts with other tests
  //   const provider = getProviderAtIndex(index);

  //   const withdrawAmount = 4 * anchor.web3.LAMPORTS_PER_SOL;

  //   const seeds = [provider.wallet.publicKey.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );

  //   const [bankPda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );

  //   const walletLamportsBefore = await provider.connection.getBalance(
  //     provider.wallet.publicKey
  //   );
  //   const bankLamportsBefore = await provider.connection.getBalance(bankPda);

  //   const withdrawTx = await getWithdrawTransaction(
  //     withdrawAmount,
  //     provider.wallet.publicKey
  //   );
  //   const signature = await provider.sendAndConfirm(withdrawTx);

  //   await provider.connection.confirmTransaction(signature, "finalized");
  //   const transactionDetails =
  //     await provider.connection.getConfirmedTransaction(signature);
  //   const transactionFee = transactionDetails.meta.fee;

  //   const accountData = await program.account.bankAccount.fetch(pda);
  //   assert.equal(
  //     accountData.balance.toNumber(),
  //     0
  //   );

  //   const walletLamportsAfter = await provider.connection.getBalance(
  //     provider.wallet.publicKey
  //   );
  //   const bankLamportsAfter = await provider.connection.getBalance(bankPda);

  //   assert.equal(
  //     walletLamportsAfter,
  //     walletLamportsBefore + withdrawAmount - transactionFee
  //   );
  //   assert.equal(bankLamportsAfter, bankLamportsBefore - withdrawAmount);
  // });

  // it("Should close bank account", async () => {
  //   const index = 0; // Use a different index to avoid conflicts with previous tests
  //   const provider = getProviderAtIndex(index);
  //   const program = new anchor.Program(IDL, provider)
    
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   // First, deposit some SOL
  //   const depositTx = await getDepositTransaction(amount, provider.wallet.publicKey);
  //   await provider.sendAndConfirm(depositTx);

  //   // Then, withdraw all the SOL
  //   const withdrawTx = await getWithdrawTransaction(amount, provider.wallet.publicKey);
  //   await provider.sendAndConfirm(withdrawTx);

  //   const [bankPAcc] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );
  //   const bd = await program.account.solBank.fetch(bankPAcc);
  //   console.log("Customer count: ", bd.customerCount.toNumber())

  //   // Now, close the account
  //   const closeTx = await getCloseAccountTransaction(provider.wallet.publicKey);
  //   await provider.sendAndConfirm(closeTx);

  //   // Check if the account is closed
  //   const seeds = [provider.wallet.publicKey.toBuffer()];
  //   const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
  //     seeds,
  //     program.programId
  //   );
  //   const accountInfo = await provider.connection.getAccountInfo(pda);
  //   assert.isNull(accountInfo, "Account should be closed");

  //   // Check if the customer count has decreased
  //   const [bankProgramAcc] = anchor.web3.PublicKey.findProgramAddressSync(
  //     [],
  //     program.programId
  //   );
  //   const bankData = await program.account.solBank.fetch(bankProgramAcc);
  //   assert.equal(bankData.customerCount.toNumber(), 0, "Customer count should be decreased");
  // });

  // xit("Should fail to close bank account with non-zero balance", async () => {
  //   const index = 2; // Use a different index to avoid conflicts with previous tests
  //   const provider = getProviderAtIndex(index);
  //   const amount = 1 * anchor.web3.LAMPORTS_PER_SOL;

  //   // First, deposit some SOL
  //   const depositTx = await getDepositTransaction(amount, provider.wallet.publicKey);
  //   await provider.sendAndConfirm(depositTx);

  //   // Try to close the account without withdrawing
  //   const closeTx = await getCloseAccountTransaction(provider.wallet.publicKey);
    
  //   try {
  //     await provider.sendAndConfirm(closeTx);
  //     assert.fail("Should not be able to close account with non-zero balance");
  //   } catch (err) {
  //     assert.equal(err.error.errorCode.code, "Account balance must be zero to close");
  //   }
  // });


});

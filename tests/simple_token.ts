import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { SimpleToken } from "../target/types/simple_token";

describe("3-simple-token", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.SimpleToken as Program<SimpleToken>;

  const anotherKeypair = anchor.web3.Keypair.generate();

  const airdrop = async (to: anchor.web3.PublicKey, amount: number) => {
    const signature = await provider.connection.requestAirdrop(
      to,
      amount * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
  };

  it("Initialized owner", async () => {
    const seeds = [Buffer.from("owner")];
    const [ownerAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      seeds,
      program.programId
    );

    const tx = await program.methods.initializeOwner().rpc();
    const data = await program.account.ownerAccount.fetch(ownerAccount);
    assert.equal(data.owner.toString(), provider.wallet.publicKey.toString());
  });

  it("Successfully created a balance account", async () => {
    const seeds = [provider.wallet.publicKey.toBuffer()];
    const [balanceAccount, _bump] =
      anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    const tx = await program.methods.initializeBalance(provider.wallet.publicKey).rpc();
    const data = await program.account.balanceAccount.fetch(balanceAccount);
    assert.equal(data.balance.toNumber(), 0);
  });

  it("Successfully minted 100 token", async () => {
    const amount = new anchor.BN(100);

    const ownerSeeds = [Buffer.from("owner")];
    const [ownerAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      ownerSeeds,
      program.programId
    );

    const balanceSeeds = [provider.wallet.publicKey.toBuffer()];
    const [balanceAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      balanceSeeds,
      program.programId
    );

    const tx = await program.methods
      .mint(amount)
      .accounts({
        balance: balanceAccount,
        owner: ownerAccount,
      })
      .rpc();

    const data = await program.account.balanceAccount.fetch(balanceAccount);
    assert.equal(data.balance.toNumber(), 100);
  });

  it("Fail to mint token by other wallet", async () => {
    const newKeypair = anchor.web3.Keypair.generate();

    const amount = new anchor.BN(100);

    const ownerSeeds = [Buffer.from("owner")];
    const [ownerAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      ownerSeeds,
      program.programId
    );

    const balanceSeeds = [provider.wallet.publicKey.toBuffer()];
    const [balanceAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      balanceSeeds,
      program.programId
    );

    try {
      await program.methods
        .mint(amount)
        .accounts({
          balance: balanceAccount,
          owner: ownerAccount,
          signer: newKeypair.publicKey,
        })
        .signers([newKeypair])
        .rpc();
      assert.fail("The transaction should have failed");
    } catch (err) {
      assert.equal(err.error.errorCode.code, "Unauthorized");
    }
  });

  it("Successfully transfer 100 token", async () => {
    const amount = new anchor.BN(100);

    const fromSeeds = [provider.wallet.publicKey.toBuffer()];
    const [fromAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      fromSeeds,
      program.programId
    );

    const toSeeds = [anotherKeypair.publicKey.toBuffer()];
    const [toAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      toSeeds,
      program.programId
    );

    const ix0 = await program.methods
      .initializeBalance(anotherKeypair.publicKey)
      .instruction();

    const ix1 = await program.methods
    .transfer(amount)
    .accounts({
      fromAcc: fromAccount,
      toAcc: toAccount,
    })
    .instruction();

    const transaction = new anchor.web3.Transaction();
    transaction.add(ix0, ix1);
    const result = await provider.sendAndConfirm(transaction);

    const fromBalanceAcc = await program.account.balanceAccount.fetch(
      fromAccount
    );
    assert.equal(fromBalanceAcc.balance.toNumber(), 0);
    const toBalanceAcc = await program.account.balanceAccount.fetch(toAccount);
    assert.equal(toBalanceAcc.balance.toNumber(), 100);
  });

  it("Fail to transfer another 100 token", async () => {
    const amount = new anchor.BN(100);

    const fromSeeds = [provider.wallet.publicKey.toBuffer()];
    const [fromAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      fromSeeds,
      program.programId
    );

    const toSeeds = [anotherKeypair.publicKey.toBuffer()];
    const [toAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      toSeeds,
      program.programId
    );

    try {
      const tx = await program.methods
        .transfer(amount)
        .accounts({
          fromAcc: fromAccount,
          toAcc: toAccount,
        })
        .rpc();
      assert.fail("The transaction should have failed");
    } catch (err) {
      assert.equal(err.error.errorCode.code, "InsufficientBalance");
    }
  });
});

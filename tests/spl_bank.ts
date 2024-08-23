import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { SplBank } from "../target/types/spl_bank";

describe("5-spl-bank", () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);
  const program = anchor.workspace.SplBank as Program<SplBank>;

  it("transferLamports", async () => {
    // Generate keypair for the new account
    const newAccountKp = new anchor.web3.Keypair();
    // Send transaction
    const data = new anchor.BN(1000000);
    const txHash = await program.methods
      .transferLamports(data)
      .accounts({
        from: provider.wallet.publicKey,
        to: newAccountKp.publicKey,
      })
      .rpc();

    const oldAccBalance = await provider.connection.getBalance(
      provider.wallet.publicKey
    );
    console.log("Old acc: ", oldAccBalance / anchor.web3.LAMPORTS_PER_SOL);
    const newAccountBalance = await provider.connection.getBalance(
      newAccountKp.publicKey
    );
    console.log("New acc: ", newAccountBalance / anchor.web3.LAMPORTS_PER_SOL);
    assert.strictEqual(
      newAccountBalance,
      data.toNumber(),
      "The new account should have the transferred lamports"
    );
  });
});

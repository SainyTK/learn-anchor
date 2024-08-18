import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BasicStorage } from "../target/types/basic_storage";
import { assert } from "chai";

describe("1-basic-storage", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BasicStorage as Program<BasicStorage>;

  it("Is initialized!", async () => {
    const seeds = [];
    const [storageAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);

    const data = await program.account.myStorage.fetch(storageAccount);
    console.log("Data: ", data)
    assert.equal(data.x.toNumber(), 0)
  });
});

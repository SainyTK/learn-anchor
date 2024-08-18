import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { MappingStorage } from "../target/types/mapping_storage";

describe("2-mapping-storage", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.MappingStorage as Program<MappingStorage>;

  it("Is initialized with id!", async () => {
    const id = new anchor.BN(100);
    const seeds = [id.toArrayLike(Buffer, "le", 8)];
    const [storageAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    const tx = await program.methods.initializeById(id).rpc();
    console.log("Your transaction signature", tx);

    const data = await program.account.myStorage.fetch(storageAccount);
    console.log("Data: ", data)
    assert.equal(data.x.toNumber(), 0)
  });

  it("Is initialized with wallet!", async () => {
    const seeds = [provider.wallet.publicKey.toBuffer()];
    const [storageAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    // This function will be failed if public key used to generate seed is not signer
    const tx = await program.methods.initializeByAddr().rpc();
    console.log("Your transaction signature", tx);

    const data = await program.account.myStorage.fetch(storageAccount);
    console.log("Data: ", data)
    assert.equal(data.x.toNumber(), 0)
  });

  it("Is initialized with wallet and id!", async () => {
    const id = new anchor.BN(100);
    const seeds = [provider.wallet.publicKey.toBuffer(), id.toArrayLike(Buffer, 'le', 8)];
    const [storageAccount, _bump] = anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    // This function will be failed if public key used to generate seed is not signer
    const tx = await program.methods.initializeByAddrAndId(id).rpc();
    console.log("Your transaction signature", tx);

    const data = await program.account.myStorage.fetch(storageAccount);
    console.log("Data: ", data)
    assert.equal(data.x.toNumber(), 0)
  });

});

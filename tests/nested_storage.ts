import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { NestedStorage } from "../target/types/nested_storage";

describe("4-nested-storage", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.NestedStorage as Program<NestedStorage>;

  const keypairs = [
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
    anchor.web3.Keypair.generate(),
  ];

  const airdrop = async (to: anchor.web3.PublicKey, amount: number) => {
    const signature = await provider.connection.requestAirdrop(
      to,
      amount * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
  };

  const getMintPriceSlotTx = async (
    time: number,
    price: number,
    amount: number
  ) => {
    const timeBN = new anchor.BN(time);
    const priceBN = new anchor.BN(price);

    const seeds = [
      timeBN.toArrayLike(Buffer, "le", 8),
      priceBN.toArrayLike(Buffer, "le", 8),
    ];
    const [priceSlotAccPk, _bump] =
      anchor.web3.PublicKey.findProgramAddressSync(seeds, program.programId);

    const isExist = await provider.connection
      .getAccountInfo(priceSlotAccPk)
      .then((info) => !!info);

    const transaction = new anchor.web3.Transaction();

    if (!isExist) {
      const initializeIx = await program.methods
        .initialize(timeBN, priceBN)
        .instruction();
      transaction.add(initializeIx);
    }

    const mintIx = await program.methods
      .mint(new anchor.BN(amount))
      .accounts({ data: priceSlotAccPk })
      .instruction();

    transaction.add(mintIx);

    return {
      account: priceSlotAccPk,
      transaction,
    };
  };

  it("Initialized price slot", async () => {
    const time = Math.floor(new Date().valueOf() / 1000);
    const price = 60000;
    const amount = 50;

    const { transaction: tx, account } = await getMintPriceSlotTx(
      time,
      price,
      amount
    );
    await provider.sendAndConfirm(tx);

    const data = await program.account.priceSlot.fetch(account);
    assert.equal(data.time.toNumber(), time);
    assert.equal(data.price.toNumber(), price);
    assert.equal(data.count.toNumber(), amount);
  });

  it("Minted price slot", async () => {
    const time = Math.floor(new Date().valueOf() / 1000);
    const price = 60000;
    const amount = 10;

    await airdrop(keypairs[0].publicKey, 10);
    const { transaction, account } = await getMintPriceSlotTx(
      time,
      price,
      amount
    );

    const { blockhash } =
      await program.provider.connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = keypairs[0].publicKey;
    transaction.sign(keypairs[0]);
    await provider.sendAndConfirm(transaction, [keypairs[0]]);
  });
});

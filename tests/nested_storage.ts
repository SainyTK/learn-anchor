import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { NestedStorage } from "../target/types/nested_storage";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

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
    amount: number,
    signer: anchor.web3.PublicKey
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
        .accounts({ signer })
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
    const time = 10000;
    const price = 60000;
    const amount = 50;

    const { transaction: tx, account } = await getMintPriceSlotTx(
      time,
      price,
      amount,
      provider.publicKey
    );
    await provider.sendAndConfirm(tx);

    const data = await program.account.priceSlot.fetch(account);
    assert.equal(data.time.toNumber(), time);
    assert.equal(data.price.toNumber(), price);
    assert.equal(data.count.toNumber(), amount);
  });

  it("Minted price slot", async () => {
    const params1 = {
      time: 10000,
      price: 60002,
      amount: 10,
    };
    const params2 = {
      time: 10002,
      price: 50000,
      amount: 10,
    };

    await airdrop(keypairs[0].publicKey, 10);

    const connection = new anchor.web3.Connection(
      program.provider.connection.rpcEndpoint
    );
    const wallet = new anchor.Wallet(keypairs[0]);
    const provider = new anchor.AnchorProvider(connection, wallet);

    for (let param of [params1, params2]) {
      const { transaction, account } = await getMintPriceSlotTx(
        param.time,
        param.price,
        param.amount,
        provider.publicKey
      );
      await provider.sendAndConfirm(transaction);
    }

    // Fetch all
    const accounts = await program.account.priceSlot.all();
    const cases = [
      {
        time: 10000,
        price: 60000,
        amount: 50,
      },
      {
        time: 10000,
        price: 60002,
        amount: 10,
      },
      {
        time: 10002,
        price: 50000,
        amount: 10,
      },
    ];
    accounts.forEach((acc, index) => {
      const caseValue = cases[index];
      assert.equal(acc.account.time.toNumber(), caseValue.time)
      assert.equal(acc.account.price.toNumber(), caseValue.price)
      assert.equal(acc.account.count.toNumber(), caseValue.amount)
    });

    const number = 10000; // Example number
    const buffer = Buffer.alloc(4); // 4 bytes for a 32-bit integer
    buffer.writeUInt32LE(number, 0); // Write the number to the buffer
    const encodedBytes = bs58.encode(buffer);

    // Fetch only at time = 10000
    const filteredAccounts = await program.account.priceSlot.all([
      {
        memcmp: {
          offset: 8,
          bytes: encodedBytes,
        },
      },
    ]);
    const filteredCases = [
      {
        time: 10000,
        price: 60000,
        amount: 50,
      },
      {
        time: 10000,
        price: 60002,
        amount: 10,
      },
    ];
    filteredAccounts.forEach((acc, index) => {
      const caseValue = filteredCases[index];
      assert.equal(acc.account.time.toNumber(), caseValue.time)
      assert.equal(acc.account.price.toNumber(), caseValue.price)
      assert.equal(acc.account.count.toNumber(), caseValue.amount)
    });
  });
});

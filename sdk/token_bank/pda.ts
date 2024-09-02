import * as anchor from "@coral-xyz/anchor";

function getTokenBankAddress(programId: anchor.web3.PublicKey) {
  const seeds = [Buffer.from("token_bank")];
  return anchor.web3.PublicKey.findProgramAddressSync(seeds, programId);
}

function getTokenBankMint(programId: anchor.web3.PublicKey) {
  const seeds = [Buffer.from("bank_mint")];
  return anchor.web3.PublicKey.findProgramAddressSync(seeds, programId);
}

function getBankAddress(
  user: anchor.web3.PublicKey,
  programId: anchor.web3.PublicKey
) {
  const seeds = [
    Buffer.from("bank"),
    user.toBuffer(),
  ];
  return anchor.web3.PublicKey.findProgramAddressSync(seeds, programId);
}

const pda = {
  getTokenBankAddress,
  getTokenBankMint,
  getBankAddress,
};

export default pda;

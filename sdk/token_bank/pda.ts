import * as anchor from "@coral-xyz/anchor";

function getTokenBankAddress(programId: anchor.web3.PublicKey) {
  const seeds = [Buffer.from(anchor.utils.bytes.utf8.encode("token_bank"))];
  return anchor.web3.PublicKey.findProgramAddressSync(seeds, programId);
}

function getBankAddress(
  user: anchor.web3.PublicKey,
  programId: anchor.web3.PublicKey
) {
  const seeds = [
    Buffer.from(anchor.utils.bytes.utf8.encode("bank")),
    user.toBuffer(),
  ];
  return anchor.web3.PublicKey.findProgramAddressSync(seeds, programId);
}

const pda = {
  getTokenBankAddress,
  getBankAddress,
};

export default pda;

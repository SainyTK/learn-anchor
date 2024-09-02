import * as anchor from "@coral-xyz/anchor";
import { TokenBank } from "./types";
import pda from "./pda";

// const getDepositTransaction = async (
//   program: anchor.Program<TokenBank>,
//   payer: anchor.web3.PublicKey,
//   time: number,
//   price: number,
//   amount: number
// ): Promise<anchor.web3.TransactionInstruction[]> => {
//   const timeBN = new anchor.BN(time);
//   const priceBN = new anchor.BN(price);
//   const amountBN = new anchor.BN(amount);

//   const [priceSlotPk] = pda.getPriceSlotAddress(time, program.programId);
//   const accountInfo = await program.provider.connection.getAccountInfo(
//     priceSlotPk
//   );

//   const instructions: anchor.web3.TransactionInstruction[] = [];
//   if (!accountInfo) {
//     instructions.push(
//       await program.methods
//         .initializeSlot(timeBN, priceBN)
//         .accounts({
//           priceSlot: priceSlotPk,
//           signer: payer,
//         })
//         .instruction()
//     );
//   }
//   instructions.push(
//     await program.methods
//       .mint(timeBN, priceBN, amountBN)
//       .accounts({ priceSlot: priceSlotPk, signer: payer })
//       .instruction()
//   );

//   return instructions;
// };

const instructions = {
};

export default instructions;

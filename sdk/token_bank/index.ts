import instructions from "./instruction";
import pda from "./pda";

const tokenBankSDK = {
    ...pda,
    ...instructions
}

export default tokenBankSDK;
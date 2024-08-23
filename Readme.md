# Solana Anchor Learn
This is the repository where I learn all basic to complicated concepts of Solana program development.

## Pre-requisite
1. Rust
2. Solana v1.18.17
3. Anchor v0.3.11

## Installation guide
1. Rust, Solana, Anchor installation guide: https://www.anchor-lang.com/docs/installation.
2. If you encounter Solana/Anchor version incompatible problem, run the suggested command to upgrade Solana into the compatible version: https://www.anchor-lang.com/release-notes/0.30.1#recommended-solana-version.

## Gettings started
1. Clone this repository
2. Compile programs: `anchor build`.
3. Test programs: `anchor test`.

## Useful commands
1. Create a new program: `anchor new <program-name>`.

## Table of content
1. Storing data in a Solana program: `programs/1_basic_storage/src/lib.rs`.
2. Creating a storage account in a Solana program: `tests/basic_storage.ts`.
3. Fetching an account data: `tests/basic_storage.ts`.
4. Letting users have their own storage mapped by incremental id and wallet address: `programs/2_mapping_storage/src/lib.rs`.
5. Using u64 as user id: `tests/mapping_storage.ts`.
6. Using wallet address as user id: `tests/mapping_storage.ts`.
7. Fetching all accounts owned by a program: `tests/mapping_storage.ts`.
8. Ownable program: `programs/3_simple_token/src/lib.rs`.
9. Using program error: `programs/3_simple_token/src/lib.rs`.
10. Adding logic into the program functions: `programs/3_simple_token/src/lib.rs`.
11. Using many wallets in a test script: `tests/simple_token.ts`.
12. Creating account if not exist and batch tx: `tests/simple_token.ts`.
13. Failure test case handling: `tests/simple_token.ts`.
14. Letting users mint the limited tokens in the same time and price slot: `programs/4_nested_storage/src/lib.rs`.
15. Filtering fixed sized struct data using `memcmp`: `tests/nested_storage.ts`.
16. Transferring SOL from a wallet to a program: `programs/5_sol_bank/src/lib.rs`. Good read: https://www.rareskills.io/post/solana-account-owner
17. Transferring SOL from a program to an account: `programs/5_sol_bank/src/lib.rs`. 
18. Checking SOL balance after paying transaction fee: `tests/sol_bank.ts`.
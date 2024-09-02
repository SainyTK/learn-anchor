use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{Metadata, CreateMetadataAccountsV3, create_metadata_accounts_v3},
    token::{Mint, Token},
};
use mpl_token_metadata::{programs::MPL_TOKEN_METADATA_ID, types::DataV2};
use std::mem::size_of;

declare_id!("7MZ2ti4hzAEsn3Xp7DecavavHxNKAAfmPZ3qCmgp3hqi");

#[program]
pub mod token_metadata {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // let token_bank = &mut ctx.accounts.token_bank;
        // token_bank.authority = ctx.accounts.signer.key();

        // // PDA seeds and bump to "sign" for CPI
        // let seeds = b"bank_mint";
        // let bump = ctx.bumps.mint;
        // let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

        // let token_metadata = DataV2 {
        //     name: String::from("Solana Gold"),
        //     symbol: String::from("GOLDSOL"),
        //     uri:  String::from("https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json"),
        //     seller_fee_basis_points: 0,
        //     creators: None,
        //     collection: None,
        //     uses: None,
        // };

        // // CPI Context
        // let cpi_ctx = CpiContext::new_with_signer(
        //     ctx.accounts.token_metadata_program.to_account_info(),
        //     CreateMetadataAccountsV3 {
        //         metadata: ctx.accounts.metadata_account.to_account_info(),
        //         mint: ctx.accounts.mint.to_account_info(),
        //         mint_authority: ctx.accounts.mint.to_account_info(),
        //         payer: ctx.accounts.signer.to_account_info(),
        //         update_authority: ctx.accounts.mint.to_account_info(),
        //         system_program: ctx.accounts.system_program.to_account_info(),
        //         rent: ctx.accounts.rent.to_account_info(),
        //     },
        //     signer,
        // );

        // create_metadata_accounts_v3(
        //     cpi_ctx,
        //     token_metadata,
        //     true,
        //     true,
        //     None
        // )?;

        Ok(())
    }
}


#[derive(Accounts)]
pub struct Initialize<'info> {
    // #[account(
    //     init,
    //     seeds = [b"bank_mint".as_ref()],
    //     bump,
    //     payer = signer,
    //     mint::decimals = 9,
    //     mint::authority = mint
    // )]
    // pub mint: Account<'info, Mint>,
    ///CHECK: Using "address" constraint to validate metadata account address
    // #[account(
    //     mut,
    //     seeds = [
    //         b"metadata",
    //         MPL_TOKEN_METADATA_ID.as_ref(),
    //         mint.key().as_ref()
    //     ],
    //     bump,
    //     seeds::program = MPL_TOKEN_METADATA_ID
    // )]
    // pub metadata_account: UncheckedAccount<'info>,
    #[account(
        init,
        payer = signer,
        space = size_of::<TokenBank>() + 8,
        seeds = [b"token_bank".as_ref()],
        bump
    )]
    pub token_bank: Account<'info, TokenBank>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct TokenBank {
    pub customer_count: u64,
    pub authority: Pubkey,
}
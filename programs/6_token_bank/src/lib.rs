use anchor_lang::prelude::*;
use anchor_spl::{
    token::{Mint, Token, TokenAccount, MintTo, mint_to},
    associated_token::AssociatedToken
};
use std::mem::size_of;

declare_id!("BUQLvDwcBi8qf5PGhkJsPq5fSx6B2LgAA3Bf4dyYEViV");

#[program]
pub mod token_bank {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let token_bank = &mut ctx.accounts.token_bank;
        token_bank.authority = ctx.accounts.signer.key();
        Ok(())
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        // PDA seeds and bump to "sign" for CPI
        let seeds = b"bank_mint".as_ref();
        let bump = ctx.bumps.mint;
        let signer: &[&[&[u8]]] = &[&[seeds, &[bump]]];

        // require!(ctx.accounts.signer.key.eq(&ctx.accounts.token_bank.authority), CustomError::OnlyOwner);

        // CPI Context
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.ata.to_account_info(),
                authority: ctx.accounts.mint.to_account_info(),
            },
            signer,
        );

        mint_to(cpi_ctx, amount)?;

        Ok(())
    }

}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        seeds = [b"bank_mint".as_ref()],
        bump,
        payer = signer,
        mint::decimals = 9,
        mint::authority = mint
    )]
    pub mint: Account<'info, Mint>,
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
    pub token_program: Program<'info, Token>
}

#[derive(Accounts)]
pub struct MintToken<'info> {
    // Initialize player token account if it doesn't exist
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer
    )]
    pub ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"bank_mint".as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        seeds = [b"token_bank".as_ref()],
        bump
    )]
    pub token_bank: Account<'info, TokenBank>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>
}

#[account]
pub struct TokenBank {
    pub customer_count: u64,
    pub authority: Pubkey,
}

#[account]
pub struct BankAccount {
    pub balance: u64,
}

#[error_code]
pub enum CustomError {
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Account balance must be zero to close")]
    NonZeroBalance,
    #[msg("Invalid token address")]
    InvalidTokenAddress,
    #[msg("Only owner")]
    OnlyOwner
}

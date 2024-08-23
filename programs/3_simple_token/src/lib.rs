use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("49Y21ERXmx4XwtVNoKDF97z83t9CcEPgX7ePDJPJDbbd");

#[program]
pub mod simple_token {
    use super::*;

    pub fn initialize_owner(ctx: Context<InitializeOwner>) -> Result<()> {
        let owner_acc = &mut ctx.accounts.owner;
        owner_acc.owner = ctx.accounts.signer.key();
        Ok(())
    }

    pub fn initialize_balance(ctx: Context<InitializeBalance>, authority: Pubkey) -> Result<()> {
        let balance_acc = &mut ctx.accounts.balance;
        balance_acc.balance = 0;
        Ok(())
    }

    pub fn mint(ctx: Context<Mint>, amount: u64) -> Result<()> {
        let owner_acc = &mut ctx.accounts.owner;
        let balance_acc = &mut ctx.accounts.balance;

        require!(ctx.accounts.signer.key().eq(&owner_acc.owner), ProgramError::Unauthorized);

        balance_acc.balance += amount;

        Ok(())
    }

    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        let from_acc = &mut ctx.accounts.from_acc;
        let to_acc = &mut ctx.accounts.to_acc;

        require!(from_acc.balance >= amount, ProgramError::InsufficientBalance);

        from_acc.balance -= amount;
        to_acc.balance += amount;

        Ok(())
    }

}

#[derive(Accounts)]
pub struct InitializeOwner<'info> {
    #[account(
        init,
        payer = signer,
        space = size_of::<OwnerAccount>() + 8,
        seeds = [b"owner"],
        bump
    )]
    pub owner: Account<'info, OwnerAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(authority: Pubkey)]
pub struct InitializeBalance<'info> {
    #[account(
        init,
        payer = signer,
        space = size_of::<BalanceAccount>() + 8,
        seeds = [&authority.key().as_ref()],
        bump
    )]
    pub balance: Account<'info, BalanceAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(mut)]
    pub balance: Account<'info, BalanceAccount>,
    #[account(
        seeds = ["owner".as_ref()],
        bump
    )]
    pub owner: Account<'info, OwnerAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(mut)]
    pub to_acc: Account<'info, BalanceAccount>,
    #[account(
        mut,
        seeds = [&signer.key().as_ref()],
        bump
    )]
    pub from_acc: Account<'info, BalanceAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[account]
pub struct OwnerAccount {
    pub owner: Pubkey
}

#[account]
pub struct BalanceAccount {
    pub balance: u64
}

#[error_code]
pub enum ProgramError {
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Insufficient balance")]
    InsufficientBalance
}
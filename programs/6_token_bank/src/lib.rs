use anchor_lang::prelude::*;
use std::mem::size_of;
use anchor_spl::token::{self, Token, TokenAccount, Transfer as SplTransfer};
use anchor_spl::associated_token::get_associated_token_address;

declare_id!("BUQLvDwcBi8qf5PGhkJsPq5fSx6B2LgAA3Bf4dyYEViV");

#[program]
pub mod token_bank {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, mint: Pubkey) -> Result<()> {
        let data = &mut ctx.accounts.data;
        data.mint = mint;
        data.owner = ctx.accounts.signer.key();
        Ok(())
    }

    pub fn initialize_account(ctx: Context<InitializeBankAccount>) -> Result<()> {
        let bank = &mut ctx.accounts.bank;
        bank.customer_count += 1;
        Ok(())
    }

    pub fn deposit(ctx: Context<BankAccountAction>, amount: u64) -> Result<()> {
        let user_acc = &mut ctx.accounts.data;
        let signer_acc = &ctx.accounts.signer;
        let bank_acc = &ctx.accounts.bank;

        let source_acc = &mut ctx.accounts.source;
        let dest_acc = &mut ctx.accounts.destination;

        let token_program = &mut ctx.accounts.token_program;

        user_acc.balance += amount;

        let mint = &bank_acc.mint;
        let source_account = get_associated_token_address(&signer_acc.key(), &mint);
        let destination_account = get_associated_token_address(&bank_acc.key(), &mint);

        require!(source_account == source_acc.key() && destination_account == dest_acc.key(), ProgramError::InvalidTokenAddress);
   
        // Transfer tokens from source to destination
        let cpi_accounts = SplTransfer {
            from: source_acc.to_account_info().clone(),
            to: dest_acc.to_account_info().clone(),
            authority: signer_acc.to_account_info().clone(),
        };
        let cpi_program = token_program.to_account_info();
   
        // Invoke SPL token transfer
        token::transfer(CpiContext::new(cpi_program, cpi_accounts), amount)?;

        Ok(())
    }

    // pub fn withdraw(ctx: Context<BankAccountAction>, amount: u64) -> Result<()> {
    //     let user_acc = &mut ctx.accounts.data;
    //     let signer_acc = &ctx.accounts.signer;
    //     let bank_acc = &ctx.accounts.bank;

    //     require!(
    //         user_acc.balance >= amount,
    //         ProgramError::InsufficientBalance
    //     );
    //     user_acc.balance -= amount;

    //     // Transfer sol from program to wallet
    //     bank_acc.sub_lamports(amount)?;
    //     signer_acc.add_lamports(amount)?;

    //     Ok(())
    // }

    // pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
    //     let from_acc = &mut ctx.accounts.from_acc;
    //     let to_acc = &mut ctx.accounts.to_acc;

    //     require!(
    //         from_acc.balance >= amount,
    //         ProgramError::InsufficientBalance
    //     );
    //     from_acc.balance -= amount;
    //     to_acc.balance += amount;
    //     Ok(())
    // }

    // // Close bank account, decrease depositor count
    // pub fn close_account(ctx: Context<CloseAccount>) -> Result<()> {

    //     let bank = &mut ctx.accounts.bank;
    //     let user_acc = &ctx.accounts.data;

    //     // Ensure the account balance is zero before closing
    //     require!(user_acc.balance == 0, ProgramError::NonZeroBalance);

    //     // Decrease the customer count
    //     bank.customer_count -= 1;

    //     Ok(())
    // }


}


#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = signer,
        space = size_of::<TokenBank>() + 8,
        seeds = [],
        bump
    )]
    pub data: Account<'info, TokenBank>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeBankAccount<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [],
        bump
    )]
    pub bank: Account<'info, TokenBank>,
    #[account(
        init,
        payer = signer,
        space = size_of::<BankAccount>() + 8,
        seeds = [user.key().as_ref()],
        bump
    )]
    pub data: Account<'info, BankAccount>,
    #[account(mut)]
    /// CHECK: User can initialize account for other users
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BankAccountAction<'info> {
    #[account(mut)]
    pub source: Account<'info, TokenAccount>,
    #[account(mut)]
    pub destination: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [],
        bump
    )]
    pub bank: Account<'info, TokenBank>,
    #[account(
        mut,
        seeds = [signer.key().as_ref()],
        bump
    )]
    pub data: Account<'info, BankAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

// #[derive(Accounts)]
// pub struct Transfer<'info> {
//     #[account(
//         mut,
//         seeds = [to.key().as_ref()],
//         bump
//     )]
//     pub to_acc: Account<'info, BankAccount>,
//     #[account(
//         mut,
//         seeds = [signer.key().as_ref()],
//         bump
//     )]
//     pub from_acc: Account<'info, BankAccount>,
//     #[account(mut)]
//     /// CHECK: signer decides who they transfer SOL to
//     pub to: AccountInfo<'info>,
//     #[account(mut)]
//     pub signer: Signer<'info>,
// }

// #[derive(Accounts)]
// pub struct CloseAccount<'info> {
//     #[account(
//         mut,
//         seeds = [],
//         bump
//     )]
//     pub bank: Account<'info, TokenBank>,
//     #[account(
//         mut,
//         seeds = [signer.key().as_ref()],
//         bump,
//         close = signer
//     )]
//     pub data: Account<'info, BankAccount>,
//     #[account(mut)]
//     pub signer: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

#[account]
pub struct TokenBank {
    pub customer_count: u64,
    pub mint: Pubkey,
    pub owner: Pubkey
}

#[account]
pub struct BankAccount {
    pub balance: u64,
}

#[error_code]
pub enum ProgramError {
    #[msg("Insufficient balance")]
    InsufficientBalance,
    #[msg("Account balance must be zero to close")]
    NonZeroBalance,
    #[msg("Invalid token address")]
    InvalidTokenAddress,
}

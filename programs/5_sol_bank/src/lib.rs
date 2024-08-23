use anchor_lang::prelude::*;
use anchor_lang::system_program;
use std::mem::size_of;

// Notes
// 1. The owner of an account can decrease amount of SOL of it (for transferring out). The same way with data in the account, only account owner can modify that data.
// 2. The owner of a regular account is SystemProgram
// 3. The owner of a PDA is a program deployed by developers
// 4. Uninitialized keypair (general wallet) and PDA have no owner (null).
// 5. Keypair is initialized by transferring SOL into it (or airdrop). This way SystemProgram owns it.
// 6. Keypair can also be initialized via program. This way the called program owns it.
// 7. PDA owner is assigned when it is used for account initialization via program.

declare_id!("2TtfrjoAQiDGqXqSSb4K8g9dc6u2t6NhjFsoSKaEU4Z8");

#[program]
pub mod sol_bank {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
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

        user_acc.balance += amount;

        // Transfer sol from user wallet to contract
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: signer_acc.to_account_info().clone(),
                to: bank_acc.to_account_info().clone(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        Ok(())
    }

    pub fn withdraw(ctx: Context<BankAccountAction>, amount: u64) -> Result<()> {
        let user_acc = &mut ctx.accounts.data;
        let signer_acc = &ctx.accounts.signer;
        let bank_acc = &ctx.accounts.bank;

        require!(
            user_acc.balance >= amount,
            ProgramError::InsufficientBalance
        );
        user_acc.balance -= amount;

        // Transfer sol from program to wallet
        bank_acc.sub_lamports(amount)?;
        signer_acc.add_lamports(amount)?;

        Ok(())
    }

    pub fn transfer(ctx: Context<Transfer>, amount: u64) -> Result<()> {
        let from_acc = &mut ctx.accounts.from_acc;
        let to_acc = &mut ctx.accounts.to_acc;

        require!(
            from_acc.balance >= amount,
            ProgramError::InsufficientBalance
        );
        from_acc.balance -= amount;
        to_acc.balance += amount;
        Ok(())
    }

    // Close bank account, decrease depositor count
    pub fn close_account(ctx: Context<CloseAccount>) -> Result<()> {
        let bank = &mut ctx.accounts.bank;
        let user_acc = &ctx.accounts.data;

        // Ensure the account balance is zero before closing
        require!(user_acc.balance == 0, ProgramError::NonZeroBalance);

        // Decrease the customer count
        bank.customer_count -= 1;

        Ok(())
    }

}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = signer,
        space = size_of::<SolBank>() + 8,
        seeds = [],
        bump
    )]
    pub data: Account<'info, SolBank>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeBankAccount<'info> {
    #[account(
        mut,
        seeds = [],
        bump
    )]
    pub bank: Account<'info, SolBank>,
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
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BankAccountAction<'info> {
    #[account(
        mut,
        seeds = [],
        bump
    )]
    pub bank: Account<'info, SolBank>,
    #[account(
        mut,
        seeds = [signer.key().as_ref()],
        bump
    )]
    pub data: Account<'info, BankAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(
        mut,
        seeds = [to.key().as_ref()],
        bump
    )]
    pub to_acc: Account<'info, BankAccount>,
    #[account(
        mut,
        seeds = [signer.key().as_ref()],
        bump
    )]
    pub from_acc: Account<'info, BankAccount>,
    #[account(mut)]
    /// CHECK: signer decides who they transfer SOL to
    pub to: AccountInfo<'info>,
    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct CloseAccount<'info> {
    #[account(
        mut,
        seeds = [],
        bump
    )]
    pub bank: Account<'info, SolBank>,
    #[account(
        mut,
        seeds = [signer.key().as_ref()],
        bump,
        close = signer
    )]
    pub data: Account<'info, BankAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct SolBank {
    pub customer_count: u64,
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
}
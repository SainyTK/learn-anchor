use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("5hRP4nKKCL4HXRwCZjUiyi3cmt4Zww3mPfaz1FQQ1naQ");

#[program]
pub mod nested_storage {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, time: u64, price: u64) -> Result<()> {
        let data_acc = &mut ctx.accounts.data;

        data_acc.time = time;
        data_acc.price = price;
        data_acc.count = 0;
        Ok(())
    }

    pub fn mint(ctx: Context<Mint>, amount: u64) -> Result<()> {
        let data_acc = &mut ctx.accounts.data;

        require!(data_acc.count + amount <= 100, ProgramError::LimitReached);
        data_acc.count += amount;
        Ok(())
    }

}

#[derive(Accounts)]
#[instruction(time: u64, price: u64)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = signer,
        space = size_of::<PriceSlot>() + 8,
        seeds = [time.to_le_bytes().as_ref(), price.to_le_bytes().as_ref()],
        bump
    )]
    pub data: Account<'info, PriceSlot>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Mint<'info> {
    #[account(mut)]
    pub data: Account<'info, PriceSlot>,
}

#[account]
pub struct PriceSlot {
    pub time: u64,
    pub price: u64,
    pub count: u64
}

#[error_code]
pub enum ProgramError {
    #[msg("Limit reached")]
    LimitReached
}
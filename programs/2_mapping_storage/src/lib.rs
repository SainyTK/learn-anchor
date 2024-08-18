use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("CyZPQjTKMXF7f6MSite1AAWVTGyPRjVS963mbVStEvZY");

#[program]
pub mod mapping_storage {
    use super::*;

    pub fn initialize_by_id(ctx: Context<InitializeById>, id: u64) -> Result<()> {
        Ok(())
    }

    pub fn initialize_by_addr(ctx: Context<InitializeByAddr>) -> Result<()> {
        Ok(())
    }

    pub fn initialize_by_addr_and_id(ctx: Context<InitializeByAddrAndId>, id: u64) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct InitializeById<'info> {
    #[account(
        init,
        payer = signer,
        space = size_of::<MyStorage>() + 8,
        seeds = [id.to_le_bytes().as_ref()],
        bump
    )]
    pub data: Account<'info, MyStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeByAddr<'info> {
    #[account(
        init,
        payer = signer,
        space = size_of::<MyStorage>() + 8,
        seeds = [signer.key().as_ref()],
        bump
    )]
    pub data: Account<'info, MyStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct InitializeByAddrAndId<'info> {
    #[account(
        init,
        payer = signer,
        space = size_of::<MyStorage>() + 8,
        seeds = [signer.key().as_ref(), id.to_le_bytes().as_ref()],
        bump
    )]
    pub data: Account<'info, MyStorage>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MyStorage {
    pub x: u64
}


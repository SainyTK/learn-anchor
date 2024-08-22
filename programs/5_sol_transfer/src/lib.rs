use anchor_lang::prelude::*;

declare_id!("6t9QWCJqW6KxsxyCaYnuBaaDyUyZejZA3kEZZEcBQB7q");

#[program]
pub mod sol_transfer {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

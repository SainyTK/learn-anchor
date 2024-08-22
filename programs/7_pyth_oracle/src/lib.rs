use anchor_lang::prelude::*;

declare_id!("BWq4y8zqrVAHZbZJFFA9wyTLuMu1dKT6NZyDJ2b6pA1n");

#[program]
pub mod pyth_oracle {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

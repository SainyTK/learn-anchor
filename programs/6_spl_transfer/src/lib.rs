use anchor_lang::prelude::*;

declare_id!("EyLth7xqMmRWxxdT3jsA1qZBNWv9deLzvaYTN6SqhUDE");

#[program]
pub mod spl_transfer {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

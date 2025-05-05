use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod chain_cloud_rewards {
    use super::*;


    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let reward_data = &mut ctx.accounts.reward_data;
        reward_data.admin = ctx.accounts.admin.key();
        reward_data.reward_mint = ctx.accounts.reward_mint.key();
        reward_data.reward_vault = ctx.accounts.reward_vault.key();
        reward_data.bump = *ctx.bumps.get("reward_data").unwrap();
        reward_data.vault_bump = *ctx.bumps.get("reward_vault").unwrap();
        
        Ok(())
    }


    pub fn register_provider(
        ctx: Context<RegisterProvider>,
        amount: u64,
    ) -> Result<()> {
        let provider_data = &mut ctx.accounts.provider_data;
        provider_data.provider = ctx.accounts.provider.key();
        provider_data.reward_amount = amount;
        provider_data.claimed = false;
        provider_data.bump = *ctx.bumps.get("provider_data").unwrap();

        Ok(())
    }


    pub fn update_reward(
        ctx: Context<UpdateReward>,
        new_amount: u64,
    ) -> Result<()> {
        let provider_data = &mut ctx.accounts.provider_data;
        
        // Only allow updating if not claimed yet
        require!(!provider_data.claimed, ErrorCode::AlreadyClaimed);
        
        provider_data.reward_amount = new_amount;

        Ok(())
    }

    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        let provider_data = &mut ctx.accounts.provider_data;
        let reward_data = &ctx.accounts.reward_data;
        

        require!(!provider_data.claimed, ErrorCode::AlreadyClaimed);
        

        let amount = provider_data.reward_amount;
        

        provider_data.claimed = true;
        

        let seeds = &[
            b"reward_data".as_ref(),
            reward_data.reward_mint.as_ref(),
            &[reward_data.bump],
        ];
        let signer = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.reward_vault.to_account_info(),
            to: ctx.accounts.provider_token_account.to_account_info(),
            authority: ctx.accounts.reward_data.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::transfer(cpi_ctx, amount)?;
        
        Ok(())
    }
}


#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub reward_mint: UncheckedAccount<'info>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + RewardData::SIZE,
        seeds = [b"reward_data".as_ref(), reward_mint.key().as_ref()],
        bump
    )]
    pub reward_data: Account<'info, RewardData>,
    
    #[account(
        init,
        payer = admin,
        token::mint = reward_mint,
        token::authority = reward_data,
        seeds = [b"reward_vault".as_ref(), reward_mint.key().as_ref()],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

/// Accounts for registering a provider
#[derive(Accounts)]
pub struct RegisterProvider<'info> {
    #[account(
        mut,
        constraint = reward_data.admin == admin.key() @ ErrorCode::Unauthorized
    )]
    pub admin: Signer<'info>,
    
    #[account(
        seeds = [b"reward_data".as_ref(), reward_data.reward_mint.as_ref()],
        bump = reward_data.bump
    )]
    pub reward_data: Account<'info, RewardData>,
    
    pub provider: UncheckedAccount<'info>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + ProviderData::SIZE,
        seeds = [b"provider_data".as_ref(), provider.key().as_ref()],
        bump
    )]
    pub provider_data: Account<'info, ProviderData>,
    
    pub system_program: Program<'info, System>,
}

/// Accounts for updating a provider's reward
#[derive(Accounts)]
pub struct UpdateReward<'info> {
    #[account(
        mut,
        constraint = reward_data.admin == admin.key() @ ErrorCode::Unauthorized
    )]
    pub admin: Signer<'info>,
    
    #[account(
        seeds = [b"reward_data".as_ref(), reward_data.reward_mint.as_ref()],
        bump = reward_data.bump
    )]
    pub reward_data: Account<'info, RewardData>,
    
    pub provider: UncheckedAccount<'info>,
    
    #[account(
        mut,
        seeds = [b"provider_data".as_ref(), provider.key().as_ref()],
        bump = provider_data.bump,
        constraint = provider_data.provider == provider.key() @ ErrorCode::InvalidProvider
    )]
    pub provider_data: Account<'info, ProviderData>,
}

/// Accounts for claiming a reward
#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub provider: Signer<'info>,
    
    #[account(
        seeds = [b"reward_data".as_ref(), reward_data.reward_mint.as_ref()],
        bump = reward_data.bump
    )]
    pub reward_data: Account<'info, RewardData>,
    
    #[account(
        mut,
        seeds = [b"reward_vault".as_ref(), reward_data.reward_mint.as_ref()],
        bump = reward_data.vault_bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"provider_data".as_ref(), provider.key().as_ref()],
        bump = provider_data.bump,
        constraint = provider_data.provider == provider.key() @ ErrorCode::InvalidProvider
    )]
    pub provider_data: Account<'info, ProviderData>,
    
    #[account(
        init_if_needed,
        payer = provider,
        associated_token::mint = reward_mint,
        associated_token::authority = provider
    )]
    pub provider_token_account: Account<'info, TokenAccount>,
    
    /// CHECK: This is the reward mint
    #[account(
        constraint = reward_mint.key() == reward_data.reward_mint @ ErrorCode::InvalidMint
    )]
    pub reward_mint: UncheckedAccount<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}


#[account]
pub struct RewardData {
    pub admin: Pubkey,
    pub reward_mint: Pubkey,
    pub reward_vault: Pubkey,
    pub bump: u8,
    pub vault_bump: u8,
}

impl RewardData {
    pub const SIZE: usize = 32 + 32 + 32 + 1 + 1;
}


#[account]
pub struct ProviderData {
    pub provider: Pubkey,
    pub reward_amount: u64,
    pub claimed: bool,
    pub bump: u8,
}

impl ProviderData {
    pub const SIZE: usize = 32 + 8 + 1 + 1;
}

/// Error codes
#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Invalid provider")]
    InvalidProvider,
    #[msg("Reward already claimed")]
    AlreadyClaimed,
    #[msg("Invalid mint")]
    InvalidMint,
} 
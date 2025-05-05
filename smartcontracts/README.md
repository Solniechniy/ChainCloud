# ChainCloud Rewards Smart Contract

A Solana smart contract built with Anchor framework for distributing rewards to storage providers in the ChainCloud network.

## Overview

This smart contract handles the distribution of SPL tokens as rewards to storage providers who maintain and serve data in the ChainCloud network. The core functionality includes:

- Setting up an admin who manages the reward distribution
- Registering storage providers and assigning rewards
- Allowing providers to claim their earned rewards
- Tracking which rewards have been claimed

## Contract Structure

The program contains several key components:

1. **RewardData**: Main program data that stores:

   - Admin authority
   - Reward token mint address
   - Reward vault address for holding tokens

2. **ProviderData**: Per-provider data that stores:

   - Provider's public key
   - Reward amount assigned
   - Claim status

3. **Instructions**:
   - `initialize`: Set up the reward program with an admin
   - `registerProvider`: Register a storage provider and assign rewards
   - `updateReward`: Update the reward amount for a provider
   - `claimReward`: Allow a provider to claim their reward

## Setup and Deployment

### Prerequisites

- Solana CLI
- Anchor Framework
- Node.js and npm/yarn

### Installation

```bash
# Install dependencies
yarn install

# Build the program
anchor build

# Test the program
anchor test
```

### Deployment

To deploy to Solana devnet:

```bash
# Update program ID in Anchor.toml and lib.rs
solana address -k target/deploy/chain_cloud_rewards-keypair.json

# Deploy
anchor deploy --provider.cluster devnet
```

## Usage

1. **Initialize the program**:

   - Create an SPL token to be used as reward
   - Initialize the reward program with the token mint

2. **Register providers**:

   - Admin registers providers with their public key
   - Assign initial reward amounts

3. **Provider claims rewards**:
   - Provider connects with their wallet
   - Claims their assigned rewards

## Security

The contract ensures:

- Only the admin can register providers and update rewards
- Providers can only claim their own rewards
- Rewards can only be claimed once

## License

MIT

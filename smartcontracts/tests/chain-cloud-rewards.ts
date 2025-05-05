import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ChainCloudRewards } from "../target/types/chain_cloud_rewards";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  createAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import { expect } from "chai";

describe("chain-cloud-rewards", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .ChainCloudRewards as Program<ChainCloudRewards>;
  const admin = anchor.web3.Keypair.generate();
  const storageProvider = anchor.web3.Keypair.generate();

  let rewardMint: anchor.web3.PublicKey;
  let rewardData: anchor.web3.PublicKey;
  let rewardVault: anchor.web3.PublicKey;
  let providerData: anchor.web3.PublicKey;
  let providerTokenAccount: anchor.web3.PublicKey;

  const rewardAmount = new anchor.BN(1000000);

  before(async () => {
    await provider.connection.requestAirdrop(
      admin.publicKey,
      10 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.requestAirdrop(
      storageProvider.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );

    rewardMint = await createMint(
      provider.connection,
      admin,
      admin.publicKey,
      null,
      6
    );

    [rewardData] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("reward_data"), rewardMint.toBuffer()],
      program.programId
    );

    [rewardVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("reward_vault"), rewardMint.toBuffer()],
      program.programId
    );

    [providerData] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("provider_data"), storageProvider.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initialize the reward program", async () => {
    await program.methods
      .initialize()
      .accounts({
        admin: admin.publicKey,
        rewardMint,
        rewardData,
        rewardVault,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([admin])
      .rpc();

    const rewardDataAccount = await program.account.rewardData.fetch(
      rewardData
    );
    expect(rewardDataAccount.admin.toString()).to.equal(
      admin.publicKey.toString()
    );
    expect(rewardDataAccount.rewardMint.toString()).to.equal(
      rewardMint.toString()
    );
    expect(rewardDataAccount.rewardVault.toString()).to.equal(
      rewardVault.toString()
    );

    await mintTo(
      provider.connection,
      admin,
      rewardMint,
      rewardVault,
      admin.publicKey,
      1000000000
    );
  });

  it("Register a storage provider", async () => {
    await program.methods
      .registerProvider(rewardAmount)
      .accounts({
        admin: admin.publicKey,
        rewardData,
        provider: storageProvider.publicKey,
        providerData,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([admin])
      .rpc();

    const providerDataAccount = await program.account.providerData.fetch(
      providerData
    );
    expect(providerDataAccount.provider.toString()).to.equal(
      storageProvider.publicKey.toString()
    );
    expect(providerDataAccount.rewardAmount.toString()).to.equal(
      rewardAmount.toString()
    );
    expect(providerDataAccount.claimed).to.be.false;
  });

  it("Update provider reward amount", async () => {
    const newRewardAmount = new anchor.BN(2000000); // 2 tokens with 6 decimals

    await program.methods
      .updateReward(newRewardAmount)
      .accounts({
        admin: admin.publicKey,
        rewardData,
        provider: storageProvider.publicKey,
        providerData,
      })
      .signers([admin])
      .rpc();

    const providerDataAccount = await program.account.providerData.fetch(
      providerData
    );
    expect(providerDataAccount.rewardAmount.toString()).to.equal(
      newRewardAmount.toString()
    );
  });

  it("Provider claims their reward", async () => {
    providerTokenAccount = await createAssociatedTokenAccount(
      provider.connection,
      storageProvider,
      rewardMint,
      storageProvider.publicKey
    );

    let tokenBalance = await provider.connection.getTokenAccountBalance(
      providerTokenAccount
    );
    expect(tokenBalance.value.amount).to.equal("0");

    await program.methods
      .claimReward()
      .accounts({
        provider: storageProvider.publicKey,
        rewardData,
        rewardVault,
        providerData,
        providerTokenAccount,
        rewardMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([storageProvider])
      .rpc();

    const providerDataAccount = await program.account.providerData.fetch(
      providerData
    );
    expect(providerDataAccount.claimed).to.be.true;

    tokenBalance = await provider.connection.getTokenAccountBalance(
      providerTokenAccount
    );
    expect(tokenBalance.value.amount).to.equal("2000000");
  });

  it("Should fail when trying to claim twice", async () => {
    try {
      await program.methods
        .claimReward()
        .accounts({
          provider: storageProvider.publicKey,
          rewardData,
          rewardVault,
          providerData,
          providerTokenAccount,
          rewardMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([storageProvider])
        .rpc();

      expect.fail("The transaction should have failed");
    } catch (error) {
      expect(error.message).to.include("Reward already claimed");
    }
  });
});

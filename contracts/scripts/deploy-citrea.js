// Script to deploy contracts to Citrea network
require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts to Citrea network...");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Account balance: ${ethers.formatEther(balance)} ETH`);

  // Deploy UserRegistry
  console.log("Deploying UserRegistry...");
  const UserRegistry = await ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy(deployer.address);
  await userRegistry.waitForDeployment();
  console.log(`UserRegistry deployed to: ${await userRegistry.getAddress()}`);

  // Deploy SkillVerification
  console.log("Deploying SkillVerification...");
  const SkillVerification = await ethers.getContractFactory("SkillVerification");
  const skillVerification = await SkillVerification.deploy(deployer.address);
  await skillVerification.waitForDeployment();
  console.log(`SkillVerification deployed to: ${await skillVerification.getAddress()}`);

  // Deploy SkillToken
  console.log("Deploying SkillToken...");
  const SkillToken = await ethers.getContractFactory("SkillToken");
  const skillToken = await SkillToken.deploy(deployer.address);
  await skillToken.waitForDeployment();
  console.log(`SkillToken deployed to: ${await skillToken.getAddress()}`);

  // Deploy ReputationToken
  console.log("Deploying ReputationToken...");
  const ReputationToken = await ethers.getContractFactory("ReputationToken");
  const reputationToken = await ReputationToken.deploy(deployer.address);
  await reputationToken.waitForDeployment();
  console.log(`ReputationToken deployed to: ${await reputationToken.getAddress()}`);

  // Deploy ProjectEscrow
  console.log("Deploying ProjectEscrow...");
  const ProjectEscrow = await ethers.getContractFactory("ProjectEscrow");
  const projectEscrow = await ProjectEscrow.deploy(deployer.address);
  await projectEscrow.waitForDeployment();
  console.log(`ProjectEscrow deployed to: ${await projectEscrow.getAddress()}`);

  // Deploy SkillPlatform
  console.log("Deploying SkillPlatform...");
  const SkillPlatform = await ethers.getContractFactory("SkillPlatform");
  const skillPlatform = await SkillPlatform.deploy(
    deployer.address,
    await userRegistry.getAddress(),
    await skillVerification.getAddress(),
    await projectEscrow.getAddress(),
    await skillToken.getAddress(),
    await reputationToken.getAddress()
  );
  await skillPlatform.waitForDeployment();
  console.log(`SkillPlatform deployed to: ${await skillPlatform.getAddress()}`);

  // Set up roles and permissions
  console.log("Setting up roles and permissions...");

  // Grant PLATFORM_ROLE to SkillPlatform in ProjectEscrow
  const PLATFORM_ROLE = await projectEscrow.PLATFORM_ROLE();
  const platformRoleTx = await projectEscrow.grantRole(PLATFORM_ROLE, await skillPlatform.getAddress());
  await platformRoleTx.wait();
  console.log(`Granted PLATFORM_ROLE to SkillPlatform in ProjectEscrow`);

  // Grant MINTER_ROLE to SkillPlatform in SkillToken
  const MINTER_ROLE = await skillToken.MINTER_ROLE();
  const minterRoleTx = await skillToken.grantRole(MINTER_ROLE, await skillPlatform.getAddress());
  await minterRoleTx.wait();
  console.log(`Granted MINTER_ROLE to SkillPlatform in SkillToken`);

  // Grant MINTER_ROLE to SkillPlatform in ReputationToken
  const MINTER_ROLE_REPUTATION = await reputationToken.MINTER_ROLE();
  const minterRoleReputationTx = await reputationToken.grantRole(MINTER_ROLE_REPUTATION, await skillPlatform.getAddress());
  await minterRoleReputationTx.wait();
  console.log(`Granted MINTER_ROLE to SkillPlatform in ReputationToken`);

  // Grant VERIFIER_ROLE to deployer in SkillVerification
  const VERIFIER_ROLE = await skillVerification.VERIFIER_ROLE();
  const verifierRoleTx = await skillVerification.grantRole(VERIFIER_ROLE, deployer.address);
  await verifierRoleTx.wait();
  console.log(`Granted VERIFIER_ROLE to deployer in SkillVerification`);

  // Grant MODERATOR_ROLE to deployer in SkillPlatform
  const MODERATOR_ROLE = await skillPlatform.MODERATOR_ROLE();
  const moderatorRoleTx = await skillPlatform.grantRole(MODERATOR_ROLE, deployer.address);
  await moderatorRoleTx.wait();
  console.log(`Granted MODERATOR_ROLE to deployer in SkillPlatform`);

  // Set platform fee rate (optional)
   const platformFeeRateTx = await skillPlatform.setPlatformFeeRate(250); // 2.5%
   await platformFeeRateTx.wait();
   console.log(`Set platform fee rate to 2.5%`);

  console.log("\nDeployment Summary:");
  console.log(`UserRegistry: ${await userRegistry.getAddress()}`);
  console.log(`SkillVerification: ${await skillVerification.getAddress()}`);
  console.log(`ProjectEscrow: ${await projectEscrow.getAddress()}`);
  console.log(`SkillToken: ${await skillToken.getAddress()}`);
  console.log(`ReputationToken: ${await reputationToken.getAddress()}`);
  console.log(`SkillPlatform: ${await skillPlatform.getAddress()}`);
  console.log("\nDeployment completed successfully!");

  // Verify contracts on Citrea Explorer (if supported)
  if (process.env.VERIFY_CONTRACTS === "true") {
    console.log("\nVerifying contracts on Citrea Explorer...");
    try {
      console.log("Verifying UserRegistry...");
      await hre.run("verify:verify", {
        address: await userRegistry.getAddress(),
        constructorArguments: [deployer.address],
      });

      console.log("Verifying SkillVerification...");
      await hre.run("verify:verify", {
        address: await skillVerification.getAddress(),
        constructorArguments: [deployer.address],
      });

      console.log("Verifying SkillToken...");
      await hre.run("verify:verify", {
        address: await skillToken.getAddress(),
        constructorArguments: [deployer.address],
      });

      console.log("Verifying ReputationToken...");
      await hre.run("verify:verify", {
        address: await reputationToken.getAddress(),
        constructorArguments: [deployer.address],
      });

      console.log("Verifying ProjectEscrow...");
      await hre.run("verify:verify", {
        address: await projectEscrow.getAddress(),
        constructorArguments: [deployer.address],
      });

      console.log("Verifying SkillPlatform...");
      await hre.run("verify:verify", {
        address: await skillPlatform.getAddress(),
        constructorArguments: [
          deployer.address,
          await userRegistry.getAddress(),
          await skillVerification.getAddress(),
          await projectEscrow.getAddress(),
          await skillToken.getAddress(),
          await reputationToken.getAddress(),
        ],
      });

      console.log("Contract verification completed!");
    } catch (error) {
      console.error("Error during contract verification:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
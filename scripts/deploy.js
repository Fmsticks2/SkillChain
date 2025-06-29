// Deployment script for Web3 Skill Platform contracts on Citrea
const hre = require("hardhat");

async function main() {
  console.log("Deploying Web3 Skill Platform contracts to", network.name);

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy UserRegistry
  const UserRegistry = await ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy(deployer.address);
  await userRegistry.deployed();
  console.log("UserRegistry deployed to:", userRegistry.address);

  // Deploy SkillVerification
  const SkillVerification = await ethers.getContractFactory("SkillVerification");
  const skillVerification = await SkillVerification.deploy(deployer.address, userRegistry.address);
  await skillVerification.deployed();
  console.log("SkillVerification deployed to:", skillVerification.address);

  // Deploy ProjectEscrow
  const ProjectEscrow = await ethers.getContractFactory("ProjectEscrow");
  const projectEscrow = await ProjectEscrow.deploy(deployer.address);
  await projectEscrow.deployed();
  console.log("ProjectEscrow deployed to:", projectEscrow.address);

  // Deploy SkillToken
  const SkillToken = await ethers.getContractFactory("SkillToken");
  const skillToken = await SkillToken.deploy(deployer.address);
  await skillToken.deployed();
  console.log("SkillToken deployed to:", skillToken.address);

  // Deploy ReputationToken
  const ReputationToken = await ethers.getContractFactory("ReputationToken");
  const reputationToken = await ReputationToken.deploy(deployer.address);
  await reputationToken.deployed();
  console.log("ReputationToken deployed to:", reputationToken.address);

  // Deploy SkillPlatform (main contract)
  const SkillPlatform = await ethers.getContractFactory("SkillPlatform");
  const skillPlatform = await SkillPlatform.deploy(
    deployer.address,
    userRegistry.address,
    skillVerification.address,
    projectEscrow.address,
    skillToken.address,
    reputationToken.address
  );
  await skillPlatform.deployed();
  console.log("SkillPlatform deployed to:", skillPlatform.address);

  // Set up roles and permissions
  console.log("Setting up roles and permissions...");

  // Grant PLATFORM_ROLE to SkillPlatform in UserRegistry
  const PLATFORM_ROLE = await userRegistry.PLATFORM_ROLE();
  await userRegistry.grantRole(PLATFORM_ROLE, skillPlatform.address);
  console.log("Granted PLATFORM_ROLE to SkillPlatform in UserRegistry");

  // Grant MINTER_ROLE to SkillPlatform in SkillToken
  const MINTER_ROLE = await skillToken.MINTER_ROLE();
  await skillToken.grantRole(MINTER_ROLE, skillPlatform.address);
  console.log("Granted MINTER_ROLE to SkillPlatform in SkillToken");

  // Grant MINTER_ROLE to SkillPlatform in ReputationToken
  const REP_MINTER_ROLE = await reputationToken.MINTER_ROLE();
  await reputationToken.grantRole(REP_MINTER_ROLE, skillPlatform.address);
  console.log("Granted MINTER_ROLE to SkillPlatform in ReputationToken");

  console.log("Deployment complete!");

  // Return the deployed contract addresses for verification
  return {
    UserRegistry: userRegistry.address,
    SkillVerification: skillVerification.address,
    ProjectEscrow: projectEscrow.address,
    SkillToken: skillToken.address,
    ReputationToken: reputationToken.address,
    SkillPlatform: skillPlatform.address,
  };
}

// Execute the deployment
main()
  .then((deployedContracts) => {
    console.log("Deployed contracts:", deployedContracts);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
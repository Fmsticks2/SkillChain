const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkillPlatform", function () {
  let skillPlatform;
  let userRegistry;
  let skillVerification;
  let projectEscrow;
  let skillToken;
  let reputationToken;
  let owner;
  let client;
  let freelancer;
  let moderator;
  let projectId;

  const PROJECT_AMOUNT = ethers.parseEther("1");
  const FUTURE_DEADLINE = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
  const PROJECT_METADATA = "ipfs://QmXZQeZZrJMsXfBGvwwf7sF7u3jNXLNEBgLcGBRSrDSky3";

  beforeEach(async function () {
    // Get signers
    [owner, client, freelancer, moderator] = await ethers.getSigners();

    // Deploy UserRegistry
    const UserRegistry = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistry.deploy(owner.address);

    // Deploy SkillVerification
    const SkillVerification = await ethers.getContractFactory("SkillVerification");
    skillVerification = await SkillVerification.deploy(owner.address);

    // Deploy SkillToken
    const SkillToken = await ethers.getContractFactory("SkillToken");
    skillToken = await SkillToken.deploy(owner.address);

    // Deploy ReputationToken
    const ReputationToken = await ethers.getContractFactory("ReputationToken");
    reputationToken = await ReputationToken.deploy(owner.address);

    // Deploy ProjectEscrow
    const ProjectEscrow = await ethers.getContractFactory("ProjectEscrow");
    projectEscrow = await ProjectEscrow.deploy(owner.address);

    // Deploy SkillPlatform
    const SkillPlatform = await ethers.getContractFactory("SkillPlatform");
    skillPlatform = await SkillPlatform.deploy(
      owner.address,
      await userRegistry.getAddress(),
      await skillVerification.getAddress(),
      await projectEscrow.getAddress(),
      await skillToken.getAddress(),
      await reputationToken.getAddress()
    );

    // Set up roles
    const PLATFORM_ROLE = await projectEscrow.PLATFORM_ROLE();
    await projectEscrow.grantRole(PLATFORM_ROLE, await skillPlatform.getAddress());

    const MINTER_ROLE = await skillToken.MINTER_ROLE();
    await skillToken.grantRole(MINTER_ROLE, await skillPlatform.getAddress());

    const MINTER_ROLE_REPUTATION = await reputationToken.MINTER_ROLE();
    await reputationToken.grantRole(MINTER_ROLE_REPUTATION, await skillPlatform.getAddress());

    // Register users
    await userRegistry.registerUser(
      client.address,
      "Client User",
      "client@example.com",
      "Client Company",
      ["project management", "marketing"],
      5,
      0 // Client role
    );

    await userRegistry.registerUser(
      freelancer.address,
      "Freelancer User",
      "freelancer@example.com",
      "Freelancer LLC",
      ["web development", "smart contracts"],
      3,
      1 // Freelancer role
    );

    // Grant moderator role
    const MODERATOR_ROLE = await skillPlatform.MODERATOR_ROLE();
    await skillPlatform.grantRole(MODERATOR_ROLE, moderator.address);
  });

  describe("Project Creation", function () {
    it("Should create a project successfully", async function () {
      // Create a project
      const tx = await skillPlatform.connect(client).createProject(
        freelancer.address,
        PROJECT_AMOUNT,
        FUTURE_DEADLINE,
        PROJECT_METADATA,
        { value: PROJECT_AMOUNT }
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "ProjectCreated"
      );

      expect(event).to.not.be.undefined;
      projectId = event.args[0];

      // Check project details
      const project = await skillPlatform.getProject(projectId);
      expect(project.client).to.equal(client.address);
      expect(project.freelancer).to.equal(freelancer.address);
      expect(project.amount).to.equal(PROJECT_AMOUNT);
      expect(project.deadline).to.equal(FUTURE_DEADLINE);
      expect(project.status).to.equal(0); // ProjectStatus.Created
      expect(project.metadata).to.equal(PROJECT_METADATA);
    });

    it("Should fail to create a project if client is not registered", async function () {
      const [, , , unregisteredUser] = await ethers.getSigners();

      await expect(
        skillPlatform.connect(unregisteredUser).createProject(
          freelancer.address,
          PROJECT_AMOUNT,
          FUTURE_DEADLINE,
          PROJECT_METADATA,
          { value: PROJECT_AMOUNT }
        )
      ).to.be.revertedWith("SkillPlatform: client not registered");
    });

    it("Should fail to create a project if freelancer is not registered", async function () {
      const [, , , unregisteredUser] = await ethers.getSigners();

      await expect(
        skillPlatform.connect(client).createProject(
          unregisteredUser.address,
          PROJECT_AMOUNT,
          FUTURE_DEADLINE,
          PROJECT_METADATA,
          { value: PROJECT_AMOUNT }
        )
      ).to.be.revertedWith("SkillPlatform: freelancer not registered");
    });
  });

  describe("Project Status Updates", function () {
    beforeEach(async function () {
      // Create a project first
      const tx = await skillPlatform.connect(client).createProject(
        freelancer.address,
        PROJECT_AMOUNT,
        FUTURE_DEADLINE,
        PROJECT_METADATA,
        { value: PROJECT_AMOUNT }
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "ProjectCreated"
      );
      projectId = event.args[0];
    });

    it("Should allow freelancer to update status to InProgress", async function () {
      await skillPlatform.connect(freelancer).updateProjectStatus(projectId, 1); // ProjectStatus.InProgress

      const project = await skillPlatform.getProject(projectId);
      expect(project.status).to.equal(1); // ProjectStatus.InProgress
    });

    it("Should allow client to update status to Completed", async function () {
      // First set to InProgress
      await skillPlatform.connect(freelancer).updateProjectStatus(projectId, 1); // ProjectStatus.InProgress

      // Then complete it
      await skillPlatform.connect(client).updateProjectStatus(projectId, 2); // ProjectStatus.Completed

      const project = await skillPlatform.getProject(projectId);
      expect(project.status).to.equal(2); // ProjectStatus.Completed
    });

    it("Should allow client to cancel a project", async function () {
      await skillPlatform.connect(client).updateProjectStatus(projectId, 3); // ProjectStatus.Cancelled

      const project = await skillPlatform.getProject(projectId);
      expect(project.status).to.equal(3); // ProjectStatus.Cancelled
    });

    it("Should not allow freelancer to cancel a project", async function () {
      await expect(
        skillPlatform.connect(freelancer).updateProjectStatus(projectId, 3) // ProjectStatus.Cancelled
      ).to.be.revertedWith("SkillPlatform: invalid status transition for freelancer");
    });
  });

  describe("Payment Release", function () {
    beforeEach(async function () {
      // Create a project first
      const tx = await skillPlatform.connect(client).createProject(
        freelancer.address,
        PROJECT_AMOUNT,
        FUTURE_DEADLINE,
        PROJECT_METADATA,
        { value: PROJECT_AMOUNT }
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "ProjectCreated"
      );
      projectId = event.args[0];

      // Set to InProgress
      await skillPlatform.connect(freelancer).updateProjectStatus(projectId, 1); // ProjectStatus.InProgress
    });

    it("Should allow client to release payment", async function () {
      const freelancerBalanceBefore = await ethers.provider.getBalance(freelancer.address);

      await skillPlatform.connect(client).releasePayment(projectId);

      const project = await skillPlatform.getProject(projectId);
      expect(project.status).to.equal(2); // ProjectStatus.Completed

      // Check if freelancer received payment (minus platform fee)
      const freelancerBalanceAfter = await ethers.provider.getBalance(freelancer.address);
      const platformFeeRate = await skillPlatform.platformFeeRate();
      const expectedFee = (PROJECT_AMOUNT * platformFeeRate) / 10000;
      const expectedPayment = PROJECT_AMOUNT - expectedFee;

      // Allow for some gas price variation
      expect(freelancerBalanceAfter - freelancerBalanceBefore).to.be.closeTo(
        expectedPayment,
        ethers.parseEther("0.01")
      );
    });

    it("Should not allow freelancer to release payment", async function () {
      await expect(
        skillPlatform.connect(freelancer).releasePayment(projectId)
      ).to.be.revertedWith("SkillPlatform: not authorized");
    });
  });

  describe("Dispute Handling", function () {
    beforeEach(async function () {
      // Create a project first
      const tx = await skillPlatform.connect(client).createProject(
        freelancer.address,
        PROJECT_AMOUNT,
        FUTURE_DEADLINE,
        PROJECT_METADATA,
        { value: PROJECT_AMOUNT }
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "ProjectCreated"
      );
      projectId = event.args[0];

      // Set to InProgress
      await skillPlatform.connect(freelancer).updateProjectStatus(projectId, 1); // ProjectStatus.InProgress
    });

    it("Should allow client to create a dispute", async function () {
      await skillPlatform.connect(client).createDispute(projectId, "Work not as expected");

      const project = await skillPlatform.getProject(projectId);
      expect(project.status).to.equal(4); // ProjectStatus.Disputed
    });

    it("Should allow freelancer to create a dispute", async function () {
      await skillPlatform.connect(freelancer).createDispute(projectId, "Client changed requirements");

      const project = await skillPlatform.getProject(projectId);
      expect(project.status).to.equal(4); // ProjectStatus.Disputed
    });

    it("Should allow moderator to resolve a dispute", async function () {
      // Create dispute
      await skillPlatform.connect(client).createDispute(projectId, "Work not as expected");

      // Resolve dispute (50/50 split)
      await skillPlatform.connect(moderator).resolveDispute(projectId, 50, 50);

      const project = await skillPlatform.getProject(projectId);
      expect(project.status).to.equal(2); // ProjectStatus.Completed
    });

    it("Should not allow non-moderators to resolve a dispute", async function () {
      // Create dispute
      await skillPlatform.connect(client).createDispute(projectId, "Work not as expected");

      // Try to resolve as client
      await expect(
        skillPlatform.connect(client).resolveDispute(projectId, 50, 50)
      ).to.be.reverted;

      // Try to resolve as freelancer
      await expect(
        skillPlatform.connect(freelancer).resolveDispute(projectId, 50, 50)
      ).to.be.reverted;
    });
  });

  describe("Project Queries", function () {
    beforeEach(async function () {
      // Create multiple projects
      for (let i = 0; i < 3; i++) {
        await skillPlatform.connect(client).createProject(
          freelancer.address,
          PROJECT_AMOUNT,
          FUTURE_DEADLINE,
          PROJECT_METADATA + i,
          { value: PROJECT_AMOUNT }
        );
      }
    });

    it("Should return all client projects", async function () {
      const projects = await skillPlatform.getClientProjects(client.address);
      expect(projects.length).to.equal(3);
      expect(projects[0].client).to.equal(client.address);
      expect(projects[1].client).to.equal(client.address);
      expect(projects[2].client).to.equal(client.address);
    });

    it("Should return all freelancer projects", async function () {
      const projects = await skillPlatform.getFreelancerProjects(freelancer.address);
      expect(projects.length).to.equal(3);
      expect(projects[0].freelancer).to.equal(freelancer.address);
      expect(projects[1].freelancer).to.equal(freelancer.address);
      expect(projects[2].freelancer).to.equal(freelancer.address);
    });
  });

  describe("Platform Fee Management", function () {
    it("Should allow admin to update platform fee rate", async function () {
      const newFeeRate = 300; // 3%
      await skillPlatform.connect(owner).setPlatformFeeRate(newFeeRate);

      const updatedFeeRate = await skillPlatform.platformFeeRate();
      expect(updatedFeeRate).to.equal(newFeeRate);
    });

    it("Should not allow non-admin to update platform fee rate", async function () {
      const newFeeRate = 300; // 3%
      await expect(
        skillPlatform.connect(client).setPlatformFeeRate(newFeeRate)
      ).to.be.reverted;
    });

    it("Should not allow fee rate above 10%", async function () {
      const newFeeRate = 1100; // 11%
      await expect(
        skillPlatform.connect(owner).setPlatformFeeRate(newFeeRate)
      ).to.be.revertedWith("SkillPlatform: fee rate cannot exceed 10%");
    });
  });
});
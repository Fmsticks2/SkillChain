const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProjectEscrow", function () {
  let projectEscrow;
  let owner;
  let client;
  let freelancer;
  let arbitrator;
  let platform;
  let escrowId;
  
  const PROJECT_ID = 1;
  const ESCROW_AMOUNT = ethers.parseEther("1");
  
  beforeEach(async function () {
    // Get signers
    [owner, client, freelancer, arbitrator, platform] = await ethers.getSigners();
    
    // Deploy ProjectEscrow
    const ProjectEscrow = await ethers.getContractFactory("ProjectEscrow");
    projectEscrow = await ProjectEscrow.deploy(owner.address);
    
    // Set up roles
    const PLATFORM_ROLE = await projectEscrow.PLATFORM_ROLE();
    const ARBITRATOR_ROLE = await projectEscrow.ARBITRATOR_ROLE();
    
    await projectEscrow.grantRole(PLATFORM_ROLE, platform.address);
    await projectEscrow.grantRole(ARBITRATOR_ROLE, arbitrator.address);
  });
  
  describe("Escrow Creation", function () {
    it("Should create an escrow successfully", async function () {
      const tx = await projectEscrow.connect(platform).createEscrow(
        PROJECT_ID,
        client.address,
        freelancer.address,
        ESCROW_AMOUNT
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowCreated"
      );
      
      expect(event).to.not.be.undefined;
      escrowId = event.args[0];
      
      // Check escrow details
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.id).to.equal(escrowId);
      expect(escrow.projectId).to.equal(PROJECT_ID);
      expect(escrow.client).to.equal(client.address);
      expect(escrow.freelancer).to.equal(freelancer.address);
      expect(escrow.amount).to.equal(ESCROW_AMOUNT);
      expect(escrow.status).to.equal(0); // EscrowStatus.Created
    });
    
    it("Should fail to create an escrow with invalid parameters", async function () {
      // Zero amount
      await expect(
        projectEscrow.connect(platform).createEscrow(
          PROJECT_ID,
          client.address,
          freelancer.address,
          0
        )
      ).to.be.revertedWith("ProjectEscrow: amount must be greater than 0");
      
      // Zero address for client
      await expect(
        projectEscrow.connect(platform).createEscrow(
          PROJECT_ID,
          ethers.ZeroAddress,
          freelancer.address,
          ESCROW_AMOUNT
        )
      ).to.be.revertedWith("ProjectEscrow: invalid client address");
      
      // Zero address for freelancer
      await expect(
        projectEscrow.connect(platform).createEscrow(
          PROJECT_ID,
          client.address,
          ethers.ZeroAddress,
          ESCROW_AMOUNT
        )
      ).to.be.revertedWith("ProjectEscrow: invalid freelancer address");
    });
    
    it("Should fail if caller is not platform", async function () {
      await expect(
        projectEscrow.connect(client).createEscrow(
          PROJECT_ID,
          client.address,
          freelancer.address,
          ESCROW_AMOUNT
        )
      ).to.be.reverted; // AccessControl error
    });
  });
  
  describe("Escrow Funding", function () {
    beforeEach(async function () {
      // Create an escrow first
      const tx = await projectEscrow.connect(platform).createEscrow(
        PROJECT_ID,
        client.address,
        freelancer.address,
        ESCROW_AMOUNT
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowCreated"
      );
      
      escrowId = event.args[0];
    });
    
    it("Should fund an escrow successfully", async function () {
      const tx = await projectEscrow.connect(client).fundEscrow(escrowId, {
        value: ESCROW_AMOUNT
      });
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowFunded"
      );
      
      expect(event).to.not.be.undefined;
      expect(event.args[0]).to.equal(escrowId);
      expect(event.args[1]).to.equal(ESCROW_AMOUNT);
      
      // Check escrow status
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(1); // EscrowStatus.Funded
    });
    
    it("Should fail to fund with incorrect amount", async function () {
      await expect(
        projectEscrow.connect(client).fundEscrow(escrowId, {
          value: ethers.parseEther("0.5") // Less than required
        })
      ).to.be.revertedWith("ProjectEscrow: incorrect funding amount");
    });
    
    it("Should fail if not funded by client", async function () {
      await expect(
        projectEscrow.connect(freelancer).fundEscrow(escrowId, {
          value: ESCROW_AMOUNT
        })
      ).to.be.revertedWith("ProjectEscrow: only client can fund escrow");
    });
    
    it("Should fail to fund non-existent escrow", async function () {
      await expect(
        projectEscrow.connect(client).fundEscrow(999, {
          value: ESCROW_AMOUNT
        })
      ).to.be.revertedWith("ProjectEscrow: escrow does not exist");
    });
  });
  
  describe("Escrow Release", function () {
    beforeEach(async function () {
      // Create and fund an escrow
      const tx = await projectEscrow.connect(platform).createEscrow(
        PROJECT_ID,
        client.address,
        freelancer.address,
        ESCROW_AMOUNT
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowCreated"
      );
      
      escrowId = event.args[0];
      
      await projectEscrow.connect(client).fundEscrow(escrowId, {
        value: ESCROW_AMOUNT
      });
    });
    
    it("Should release escrow to freelancer", async function () {
      const freelancerBalanceBefore = await ethers.provider.getBalance(freelancer.address);
      
      const tx = await projectEscrow.connect(client).releaseEscrow(escrowId);
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowReleased"
      );
      
      expect(event).to.not.be.undefined;
      
      // Check escrow status
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(2); // EscrowStatus.Released
      
      // Check if freelancer received payment (minus platform fee)
      const freelancerBalanceAfter = await ethers.provider.getBalance(freelancer.address);
      const platformFeeRate = await projectEscrow.platformFeeRate();
      const expectedFee = (ESCROW_AMOUNT * platformFeeRate) / 10000n;
      const expectedPayment = ESCROW_AMOUNT - expectedFee;
      
      expect(freelancerBalanceAfter - freelancerBalanceBefore).to.equal(expectedPayment);
    });
    
    it("Should allow platform to release escrow", async function () {
      await projectEscrow.connect(platform).releaseEscrow(escrowId);
      
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(2); // EscrowStatus.Released
    });
    
    it("Should fail if freelancer tries to release escrow", async function () {
      await expect(
        projectEscrow.connect(freelancer).releaseEscrow(escrowId)
      ).to.be.revertedWith("ProjectEscrow: only client or platform can release escrow");
    });
  });
  
  describe("Escrow Refund", function () {
    beforeEach(async function () {
      // Create and fund an escrow
      const tx = await projectEscrow.connect(platform).createEscrow(
        PROJECT_ID,
        client.address,
        freelancer.address,
        ESCROW_AMOUNT
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowCreated"
      );
      
      escrowId = event.args[0];
      
      await projectEscrow.connect(client).fundEscrow(escrowId, {
        value: ESCROW_AMOUNT
      });
    });
    
    it("Should refund escrow to client", async function () {
      const clientBalanceBefore = await ethers.provider.getBalance(client.address);
      
      const tx = await projectEscrow.connect(freelancer).refundEscrow(escrowId);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowRefunded"
      );
      
      expect(event).to.not.be.undefined;
      
      // Check escrow status
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(3); // EscrowStatus.Refunded
      
      // Check if client received refund
      const clientBalanceAfter = await ethers.provider.getBalance(client.address);
      
      // Client should receive the full escrow amount
      expect(clientBalanceAfter - clientBalanceBefore).to.equal(ESCROW_AMOUNT);
    });
    
    it("Should allow platform to refund escrow", async function () {
      await projectEscrow.connect(platform).refundEscrow(escrowId);
      
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(3); // EscrowStatus.Refunded
    });
    
    it("Should allow arbitrator to refund escrow", async function () {
      await projectEscrow.connect(arbitrator).refundEscrow(escrowId);
      
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(3); // EscrowStatus.Refunded
    });
    
    it("Should fail if client tries to refund escrow", async function () {
      await expect(
        projectEscrow.connect(client).refundEscrow(escrowId)
      ).to.be.revertedWith("ProjectEscrow: only freelancer, platform, or arbitrator can refund escrow");
    });
  });
  
  describe("Escrow Dispute", function () {
    beforeEach(async function () {
      // Create and fund an escrow
      const tx = await projectEscrow.connect(platform).createEscrow(
        PROJECT_ID,
        client.address,
        freelancer.address,
        ESCROW_AMOUNT
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowCreated"
      );
      
      escrowId = event.args[0];
      
      await projectEscrow.connect(client).fundEscrow(escrowId, {
        value: ESCROW_AMOUNT
      });
    });
    
    it("Should allow client to create a dispute", async function () {
      const tx = await projectEscrow.connect(client).disputeEscrow(escrowId, "Work not completed");
      const receipt = await tx.wait();
      
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowDisputed"
      );
      
      expect(event).to.not.be.undefined;
      expect(event.args[0]).to.equal(escrowId);
      expect(event.args[1]).to.equal(client.address);
      expect(event.args[2]).to.equal("Work not completed");
      
      // Check escrow status
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(4); // EscrowStatus.Disputed
    });
    
    it("Should allow freelancer to create a dispute", async function () {
      await projectEscrow.connect(freelancer).disputeEscrow(escrowId, "Client changed requirements");
      
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(4); // EscrowStatus.Disputed
    });
    
    it("Should fail if platform tries to create a dispute", async function () {
      await expect(
        projectEscrow.connect(platform).disputeEscrow(escrowId, "Platform dispute")
      ).to.be.revertedWith("ProjectEscrow: only client or freelancer can dispute escrow");
    });
  });
  
  describe("Dispute Resolution", function () {
    beforeEach(async function () {
      // Create, fund, and dispute an escrow
      const tx = await projectEscrow.connect(platform).createEscrow(
        PROJECT_ID,
        client.address,
        freelancer.address,
        ESCROW_AMOUNT
      );
      
      const receipt = await tx.wait();
      const event = receipt.logs.find(
        (log) => log.fragment && log.fragment.name === "EscrowCreated"
      );
      
      escrowId = event.args[0];
      
      await projectEscrow.connect(client).fundEscrow(escrowId, {
        value: ESCROW_AMOUNT
      });
      
      await projectEscrow.connect(client).disputeEscrow(escrowId, "Work not completed");
    });
    
    it("Should resolve dispute with 50/50 split", async function () {
      const clientBalanceBefore = await ethers.provider.getBalance(client.address);
      const freelancerBalanceBefore = await ethers.provider.getBalance(freelancer.address);
      
      await projectEscrow.connect(arbitrator).resolveDispute(escrowId, 50, 50);
      
      // Check escrow status
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(2); // EscrowStatus.Released
      
      // Check balances
      const clientBalanceAfter = await ethers.provider.getBalance(client.address);
      const freelancerBalanceAfter = await ethers.provider.getBalance(freelancer.address);
      
      const expectedAmount = ESCROW_AMOUNT / 2n;
      
      expect(clientBalanceAfter - clientBalanceBefore).to.equal(expectedAmount);
      expect(freelancerBalanceAfter - freelancerBalanceBefore).to.equal(expectedAmount);
    });
    
    it("Should resolve dispute with custom split", async function () {
      await projectEscrow.connect(arbitrator).resolveDispute(escrowId, 75, 25);
      
      // Check escrow status
      const escrow = await projectEscrow.getEscrow(escrowId);
      expect(escrow.status).to.equal(2); // EscrowStatus.Released
    });
    
    it("Should fail if non-arbitrator tries to resolve dispute", async function () {
      await expect(
        projectEscrow.connect(client).resolveDispute(escrowId, 50, 50)
      ).to.be.reverted; // AccessControl error
      
      await expect(
        projectEscrow.connect(freelancer).resolveDispute(escrowId, 50, 50)
      ).to.be.reverted; // AccessControl error
      
      await expect(
        projectEscrow.connect(platform).resolveDispute(escrowId, 50, 50)
      ).to.be.reverted; // AccessControl error
    });
    
    it("Should fail if shares sum to more than 100", async function () {
      await expect(
        projectEscrow.connect(arbitrator).resolveDispute(escrowId, 60, 50)
      ).to.be.revertedWith("ProjectEscrow: shares must sum to 100 or less");
    });
  });
  
  describe("Query Functions", function () {
    beforeEach(async function () {
      // Create multiple escrows
      for (let i = 0; i < 3; i++) {
        await projectEscrow.connect(platform).createEscrow(
          PROJECT_ID + i,
          client.address,
          freelancer.address,
          ESCROW_AMOUNT
        );
      }
    });
    
    it("Should return all project escrows", async function () {
      const escrows = await projectEscrow.getProjectEscrows(PROJECT_ID);
      expect(escrows.length).to.equal(1);
      expect(escrows[0].projectId).to.equal(PROJECT_ID);
    });
    
    it("Should return all client escrows", async function () {
      const escrows = await projectEscrow.getClientEscrows(client.address);
      expect(escrows.length).to.equal(3);
      expect(escrows[0].client).to.equal(client.address);
      expect(escrows[1].client).to.equal(client.address);
      expect(escrows[2].client).to.equal(client.address);
    });
    
    it("Should return all freelancer escrows", async function () {
      const escrows = await projectEscrow.getFreelancerEscrows(freelancer.address);
      expect(escrows.length).to.equal(3);
      expect(escrows[0].freelancer).to.equal(freelancer.address);
      expect(escrows[1].freelancer).to.equal(freelancer.address);
      expect(escrows[2].freelancer).to.equal(freelancer.address);
    });
  });
  
  describe("Admin Functions", function () {
    it("Should allow admin to update platform fee rate", async function () {
      const newFeeRate = 300; // 3%
      await projectEscrow.connect(owner).setPlatformFeeRate(newFeeRate);
      
      const updatedFeeRate = await projectEscrow.platformFeeRate();
      expect(updatedFeeRate).to.equal(newFeeRate);
    });
    
    it("Should not allow fee rate above 10%", async function () {
      const newFeeRate = 1100; // 11%
      await expect(
        projectEscrow.connect(owner).setPlatformFeeRate(newFeeRate)
      ).to.be.revertedWith("ProjectEscrow: fee rate cannot exceed 10%");
    });
    
    it("Should allow admin to update fee recipient", async function () {
      const newRecipient = arbitrator.address;
      await projectEscrow.connect(owner).setFeeRecipient(newRecipient);
      
      const updatedRecipient = await projectEscrow.feeRecipient();
      expect(updatedRecipient).to.equal(newRecipient);
    });
    
    it("Should not allow setting fee recipient to zero address", async function () {
      await expect(
        projectEscrow.connect(owner).setFeeRecipient(ethers.ZeroAddress)
      ).to.be.revertedWith("ProjectEscrow: invalid fee recipient address");
    });
    
    it("Should not allow non-admin to update fee settings", async function () {
      await expect(
        projectEscrow.connect(client).setPlatformFeeRate(300)
      ).to.be.reverted; // AccessControl error
      
      await expect(
        projectEscrow.connect(client).setFeeRecipient(client.address)
      ).to.be.reverted; // AccessControl error
    });
  });
});
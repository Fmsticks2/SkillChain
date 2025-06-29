/// <reference path="../types/ethereum.d.ts" />
import { ethers } from 'ethers';
import SkillPlatformABI from '../artifacts/contracts/core/SkillPlatform.sol/SkillPlatform.json';
import UserRegistryABI from '../artifacts/contracts/core/UserRegistry.sol/UserRegistry.json';
import SkillVerificationABI from '../artifacts/contracts/core/SkillVerification.sol/SkillVerification.json';
import ProjectEscrowABI from '../artifacts/contracts/escrow/ProjectEscrow.sol/ProjectEscrow.json';
import SkillTokenABI from '../artifacts/contracts/tokens/SkillToken.sol/SkillToken.json';
import ReputationTokenABI from '../artifacts/contracts/tokens/ReputationToken.sol/ReputationToken.json';

// Contract addresses - these would be populated after deployment
const CONTRACT_ADDRESSES = {
  // Citrea Testnet
  testnet: {
    skillPlatform: '',
    userRegistry: '',
    skillVerification: '',
    projectEscrow: '',
    skillToken: '',
    reputationToken: '',
  },
  // Citrea Mainnet
  mainnet: {
    skillPlatform: '',
    userRegistry: '',
    skillVerification: '',
    projectEscrow: '',
    skillToken: '',
    reputationToken: '',
  },
};

// Network configuration
const NETWORKS = {
  testnet: {
    chainId: '0x13FB', // Citrea testnet chain ID (5115 in decimal)
    chainName: 'Citrea Testnet',
    nativeCurrency: {
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.testnet.citrea.xyz'], // Citrea testnet RPC URL
    blockExplorerUrls: ['https://testnet-explorer.citrea.xyz'], // Replace with actual Citrea testnet explorer URL
  },
  mainnet: {
    chainId: '0x5678', // Replace with actual Citrea mainnet chain ID
    chainName: 'Citrea Mainnet',
    nativeCurrency: {
      name: 'Bitcoin',
      symbol: 'BTC',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.citrea.xyz'], // Replace with actual Citrea mainnet RPC URL
    blockExplorerUrls: ['https://explorer.citrea.xyz'], // Replace with actual Citrea mainnet explorer URL
  },
};

// Enum types for TypeScript
export enum ProjectStatus {
  Created,
  InProgress,
  Completed,
  Cancelled,
  Disputed,
}

export enum UserRole {
  Client,
  Freelancer,
  Both,
}

export enum VerificationStatus {
  Unverified,
  Pending,
  Verified,
  Rejected,
}

export enum SkillVerificationStatus {
  None,
  Pending,
  Verified,
  Rejected,
}

export enum EscrowStatus {
  Created,
  Funded,
  Released,
  Refunded,
  Disputed,
  Resolved,
}

// Type definitions
export interface Project {
  id: number;
  client: string;
  freelancer: string;
  amount: bigint;
  deadline: number;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
  metadata: string;
}

export interface UserProfile {
  userAddress: string;
  name: string;
  email: string;
  company: string;
  skills: string[];
  experience: number;
  role: UserRole;
  verificationStatus: VerificationStatus;
  reputation: number;
  createdAt: number;
  updatedAt: number;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  createdAt: number;
}

export interface SkillAttestation {
  id: number;
  skillId: number;
  userAddress: string;
  attestorAddress: string;
  status: SkillVerificationStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Escrow {
  id: number;
  projectId: number;
  client: string;
  freelancer: string;
  amount: bigint;
  status: EscrowStatus;
  createdAt: number;
  updatedAt: number;
}

// Contract integration class
export class ContractIntegration {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private network: 'testnet' | 'mainnet' = 'testnet';
  private contracts: {
    skillPlatform: ethers.Contract | null;
    userRegistry: ethers.Contract | null;
    skillVerification: ethers.Contract | null;
    projectEscrow: ethers.Contract | null;
    skillToken: ethers.Contract | null;
    reputationToken: ethers.Contract | null;
  };

  constructor(network: 'testnet' | 'mainnet' = 'testnet') {
    this.network = network;
    this.contracts = {
      skillPlatform: null,
      userRegistry: null,
      skillVerification: null,
      projectEscrow: null,
      skillToken: null,
      reputationToken: null,
    };
  }

  /**
   * Initialize the contract integration
   */
  async init() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Ethereum provider not found. Please install MetaMask or another wallet.');
    }

    try {
      // Request account access
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create provider and signer
      if (!window.ethereum) throw new Error('MetaMask is not installed');
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Check if we're on the correct network
      const chainId = await this.provider.getNetwork().then(network => network.chainId);
      const targetChainId = BigInt(NETWORKS[this.network].chainId);

      if (chainId !== targetChainId) {
        // Prompt user to switch networks
        try {
          if (!window.ethereum) throw new Error('MetaMask is not installed');
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: NETWORKS[this.network].chainId }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              if (!window.ethereum) throw new Error('MetaMask is not installed');
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [NETWORKS[this.network]],
              });
            } catch (addError) {
              throw new Error('Failed to add the Citrea network to your wallet.');
            }
          } else {
            throw new Error('Failed to switch to the Citrea network.');
          }
        }

        // Refresh provider and signer after network switch
        if (!window.ethereum) throw new Error('MetaMask is not installed');
        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
      }

      // Initialize contracts
      this.initContracts();

      return true;
    } catch (error) {
      console.error('Error initializing contract integration:', error);
      throw error;
    }
  }

  /**
   * Initialize contract instances
   */
  private initContracts() {
    const addresses = CONTRACT_ADDRESSES[this.network];

    if (!this.signer) {
      throw new Error('Signer not initialized');
    }

    this.contracts = {
      skillPlatform: new ethers.Contract(addresses.skillPlatform, SkillPlatformABI.abi, this.signer),
      userRegistry: new ethers.Contract(addresses.userRegistry, UserRegistryABI.abi, this.signer),
      skillVerification: new ethers.Contract(addresses.skillVerification, SkillVerificationABI.abi, this.signer),
      projectEscrow: new ethers.Contract(addresses.projectEscrow, ProjectEscrowABI.abi, this.signer),
      skillToken: new ethers.Contract(addresses.skillToken, SkillTokenABI.abi, this.signer),
      reputationToken: new ethers.Contract(addresses.reputationToken, ReputationTokenABI.abi, this.signer),
    };
  }

  /**
   * Get the connected wallet address
   */
  async getWalletAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return await this.signer.getAddress();
  }

  /**
   * Register a new user
   */
  async registerUser(
    name: string,
    email: string,
    company: string,
    skills: string[],
    experience: number,
    role: UserRole
  ): Promise<boolean> {
    if (!this.contracts.userRegistry) {
      throw new Error('UserRegistry contract not initialized');
    }

    try {
      const tx = await this.contracts.userRegistry.registerUser(
        await this.getWalletAddress(),
        name,
        email,
        company,
        skills,
        experience,
        role
      );
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(address?: string): Promise<UserProfile> {
    if (!this.contracts.userRegistry) {
      throw new Error('UserRegistry contract not initialized');
    }

    try {
      const userAddress = address || await this.getWalletAddress();
      const profile = await this.contracts.userRegistry.getUserProfile(userAddress);
      return {
        userAddress: profile.userAddress,
        name: profile.name,
        email: profile.email,
        company: profile.company,
        skills: profile.skills,
        experience: profile.experience,
        role: profile.role,
        verificationStatus: profile.verificationStatus,
        reputation: Number(profile.reputation),
        createdAt: Number(profile.createdAt),
        updatedAt: Number(profile.updatedAt),
      };
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  async createProject(
    freelancerAddress: string,
    amount: bigint,
    deadline: number,
    metadata: string
  ): Promise<number> {
    if (!this.contracts.skillPlatform) {
      throw new Error('SkillPlatform contract not initialized');
    }

    try {
      const tx = await this.contracts.skillPlatform.createProject(
        freelancerAddress,
        amount,
        deadline,
        metadata,
        { value: amount }
      );
      const receipt = await tx.wait();
      
      // Find the ProjectCreated event to get the project ID
      const event = receipt.logs.find(
        (log: any) => log.fragment && log.fragment.name === 'ProjectCreated'
      );
      
      if (!event) {
        throw new Error('Project creation event not found');
      }
      
      return Number(event.args[0]); // Project ID
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  /**
   * Get project details
   */
  async getProject(projectId: number): Promise<Project> {
    if (!this.contracts.skillPlatform) {
      throw new Error('SkillPlatform contract not initialized');
    }

    try {
      const project = await this.contracts.skillPlatform.getProject(projectId);
      return {
        id: Number(project.id),
        client: project.client,
        freelancer: project.freelancer,
        amount: project.amount,
        deadline: Number(project.deadline),
        status: project.status,
        createdAt: Number(project.createdAt),
        updatedAt: Number(project.updatedAt),
        metadata: project.metadata,
      };
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  }

  /**
   * Update project status
   */
  async updateProjectStatus(projectId: number, status: ProjectStatus): Promise<boolean> {
    if (!this.contracts.skillPlatform) {
      throw new Error('SkillPlatform contract not initialized');
    }

    try {
      const tx = await this.contracts.skillPlatform.updateProjectStatus(projectId, status);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error updating project status:', error);
      throw error;
    }
  }

  /**
   * Release payment for a project
   */
  async releasePayment(projectId: number): Promise<boolean> {
    if (!this.contracts.skillPlatform) {
      throw new Error('SkillPlatform contract not initialized');
    }

    try {
      const tx = await this.contracts.skillPlatform.releasePayment(projectId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error releasing payment:', error);
      throw error;
    }
  }

  /**
   * Create a dispute for a project
   */
  async createDispute(projectId: number, reason: string): Promise<boolean> {
    if (!this.contracts.skillPlatform) {
      throw new Error('SkillPlatform contract not initialized');
    }

    try {
      const tx = await this.contracts.skillPlatform.createDispute(projectId, reason);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error creating dispute:', error);
      throw error;
    }
  }

  /**
   * Get client projects
   */
  async getClientProjects(clientAddress?: string): Promise<Project[]> {
    if (!this.contracts.skillPlatform) {
      throw new Error('SkillPlatform contract not initialized');
    }

    try {
      const address = clientAddress || await this.getWalletAddress();
      const projects = await this.contracts.skillPlatform.getClientProjects(address);
      
      return projects.map((project: any) => ({
        id: Number(project.id),
        client: project.client,
        freelancer: project.freelancer,
        amount: project.amount,
        deadline: Number(project.deadline),
        status: project.status,
        createdAt: Number(project.createdAt),
        updatedAt: Number(project.updatedAt),
        metadata: project.metadata,
      }));
    } catch (error) {
      console.error('Error getting client projects:', error);
      throw error;
    }
  }

  /**
   * Get freelancer projects
   */
  async getFreelancerProjects(freelancerAddress?: string): Promise<Project[]> {
    if (!this.contracts.skillPlatform) {
      throw new Error('SkillPlatform contract not initialized');
    }

    try {
      const address = freelancerAddress || await this.getWalletAddress();
      const projects = await this.contracts.skillPlatform.getFreelancerProjects(address);
      
      return projects.map((project: any) => ({
        id: Number(project.id),
        client: project.client,
        freelancer: project.freelancer,
        amount: project.amount,
        deadline: Number(project.deadline),
        status: project.status,
        createdAt: Number(project.createdAt),
        updatedAt: Number(project.updatedAt),
        metadata: project.metadata,
      }));
    } catch (error) {
      console.error('Error getting freelancer projects:', error);
      throw error;
    }
  }

  /**
   * Get token balance
   */
  async getTokenBalance(address?: string): Promise<bigint> {
    if (!this.contracts.skillToken) {
      throw new Error('SkillToken contract not initialized');
    }

    try {
      const userAddress = address || await this.getWalletAddress();
      return await this.contracts.skillToken.balanceOf(userAddress);
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  /**
   * Get reputation tokens
   */
  async getReputationTokens(address?: string): Promise<any[]> {
    if (!this.contracts.reputationToken) {
      throw new Error('ReputationToken contract not initialized');
    }

    try {
      const userAddress = address || await this.getWalletAddress();
      const balance = await this.contracts.reputationToken.balanceOf(userAddress);
      
      const tokens = [];
      for (let i = 0; i < Number(balance); i++) {
        const tokenId = await this.contracts.reputationToken.tokenOfOwnerByIndex(userAddress, i);
        const tokenData = await this.contracts.reputationToken.getTokenData(tokenId);
        const tokenURI = await this.contracts.reputationToken.tokenURI(tokenId);
        
        tokens.push({
          tokenId: Number(tokenId),
          skillId: Number(tokenData.skillId),
          score: Number(tokenData.score),
          tokenURI,
        });
      }
      
      return tokens;
    } catch (error) {
      console.error('Error getting reputation tokens:', error);
      throw error;
    }
  }

  /**
   * Add a skill (admin only)
   */
  async addSkill(name: string, category: string): Promise<number> {
    if (!this.contracts.skillVerification) {
      throw new Error('SkillVerification contract not initialized');
    }

    try {
      const tx = await this.contracts.skillVerification.addSkill(name, category);
      const receipt = await tx.wait();
      
      // Find the SkillAdded event to get the skill ID
      const event = receipt.logs.find(
        (log: any) => log.fragment && log.fragment.name === 'SkillAdded'
      );
      
      if (!event) {
        throw new Error('Skill addition event not found');
      }
      
      return Number(event.args[0]); // Skill ID
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  }

  /**
   * Create a skill attestation
   */
  async createSkillAttestation(skillId: number, userAddress: string): Promise<number> {
    if (!this.contracts.skillVerification) {
      throw new Error('SkillVerification contract not initialized');
    }

    try {
      const tx = await this.contracts.skillVerification.createAttestation(skillId, userAddress);
      const receipt = await tx.wait();
      
      // Find the AttestationCreated event to get the attestation ID
      const event = receipt.logs.find(
        (log: any) => log.fragment && log.fragment.name === 'AttestationCreated'
      );
      
      if (!event) {
        throw new Error('Attestation creation event not found');
      }
      
      return Number(event.args[0]); // Attestation ID
    } catch (error) {
      console.error('Error creating skill attestation:', error);
      throw error;
    }
  }

  /**
   * Verify a skill attestation (verifier only)
   */
  async verifySkillAttestation(attestationId: number): Promise<boolean> {
    if (!this.contracts.skillVerification) {
      throw new Error('SkillVerification contract not initialized');
    }

    try {
      const tx = await this.contracts.skillVerification.verifyAttestation(attestationId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error verifying skill attestation:', error);
      throw error;
    }
  }

  /**
   * Get user's skill attestations
   */
  async getUserSkillAttestations(address?: string): Promise<SkillAttestation[]> {
    if (!this.contracts.skillVerification) {
      throw new Error('SkillVerification contract not initialized');
    }

    try {
      const userAddress = address || await this.getWalletAddress();
      const attestationIds = await this.contracts.skillVerification.getUserAttestations(userAddress);
      
      const attestations = [];
      for (const id of attestationIds) {
        const attestation = await this.contracts.skillVerification.getAttestation(id);
        attestations.push({
          id: Number(attestation.id),
          skillId: Number(attestation.skillId),
          userAddress: attestation.userAddress,
          attestorAddress: attestation.attestorAddress,
          status: attestation.status,
          createdAt: Number(attestation.createdAt),
          updatedAt: Number(attestation.updatedAt),
        });
      }
      
      return attestations;
    } catch (error) {
      console.error('Error getting user skill attestations:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const contractIntegration = new ContractIntegration();
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ContractIntegration, UserProfile, Project } from '../../lib/contract-integration';
import { useEthereum } from '../../hooks/use-ethereum';

// Create context
interface ContractContextType {
  contractIntegration: ContractIntegration | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
  walletAddress: string | null;
  userProfile: UserProfile | null;
  clientProjects: Project[];
  freelancerProjects: Project[];
  tokenBalance: bigint;
  reputationTokens: any[];
  initializeContracts: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  isMetaMaskInstalled: boolean;
  chainId: string | null;
}

export const ContractContext = createContext<ContractContextType>({
  contractIntegration: null,
  isInitialized: false,
  isInitializing: false,
  error: null,
  walletAddress: null,
  userProfile: null,
  clientProjects: [],
  freelancerProjects: [],
  tokenBalance: BigInt(0),
  reputationTokens: [],
  initializeContracts: async () => {},
  refreshUserProfile: async () => {},
  refreshProjects: async () => {},
  refreshTokens: async () => {},
  isMetaMaskInstalled: false,
  chainId: null,
});

// Provider component
export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [contractIntegration, setContractIntegration] = useState<ContractIntegration | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [clientProjects, setClientProjects] = useState<Project[]>([]);
  const [freelancerProjects, setFreelancerProjects] = useState<Project[]>([]);
  const [tokenBalance, setTokenBalance] = useState<bigint>(BigInt(0));
  const [reputationTokens, setReputationTokens] = useState<any[]>([]);

  // Initialize contract integration
  const initializeContracts = async () => {
    if (isInitializing) return;
    
    setIsInitializing(true);
    setError(null);

    try {
      // First connect wallet if not already connected
      if (!currentAccount) {
        const account = await connectWallet();
        if (!account) {
          throw new Error('Failed to connect wallet');
        }
      }

      // Dynamic import to avoid SSR issues
      const { contractIntegration } = await import('../../lib/contract-integration');
      
      await contractIntegration.init();
      setContractIntegration(contractIntegration);
      setIsInitialized(true);

      // Get wallet address
      const address = await contractIntegration.getWalletAddress();
      setWalletAddress(address);

      // Load initial data
      await refreshUserProfile();
      await refreshProjects();
      await refreshTokens();
    } catch (err: any) {
      console.error('Failed to initialize contracts:', err);
      setError(err.message || 'Failed to initialize contracts');
    } finally {
      setIsInitializing(false);
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (!contractIntegration || !isInitialized) return;

    try {
      const profile = await contractIntegration.getUserProfile();
      setUserProfile(profile);
    } catch (err: any) {
      // If user is not registered, profile will be null
      if (err.message.includes('not registered')) {
        setUserProfile(null);
      } else {
        console.error('Failed to fetch user profile:', err);
        setError(err.message || 'Failed to fetch user profile');
      }
    }
  };

  // Refresh projects
  const refreshProjects = async () => {
    if (!contractIntegration || !isInitialized) return;

    try {
      // Get client projects
      const clientProjs = await contractIntegration.getClientProjects();
      setClientProjects(clientProjs);

      // Get freelancer projects
      const freelancerProjs = await contractIntegration.getFreelancerProjects();
      setFreelancerProjects(freelancerProjs);
    } catch (err: any) {
      console.error('Failed to fetch projects:', err);
      setError(err.message || 'Failed to fetch projects');
    }
  };

  // Refresh tokens
  const refreshTokens = async () => {
    if (!contractIntegration || !isInitialized) return;

    try {
      // Get token balance
      const balance = await contractIntegration.getTokenBalance();
      setTokenBalance(balance);

      // Get reputation tokens
      const repTokens = await contractIntegration.getReputationTokens();
      setReputationTokens(repTokens);
    } catch (err: any) {
      console.error('Failed to fetch tokens:', err);
      setError(err.message || 'Failed to fetch tokens');
    }
  };

  // Use the Ethereum hook
  const { 
    ethereum, 
    isMetaMaskInstalled, 
    currentAccount, 
    chainId, 
    error: ethereumError,
    connect: connectWallet
  } = useEthereum();

  // Update wallet address when account changes
  useEffect(() => {
    if (currentAccount) {
      setWalletAddress(currentAccount);
      refreshUserProfile().catch(console.error);
      refreshProjects().catch(console.error);
      refreshTokens().catch(console.error);
    } else if (walletAddress) {
      // Only reset if we previously had a wallet address
      setWalletAddress(null);
      setUserProfile(null);
      setClientProjects([]);
      setFreelancerProjects([]);
      setTokenBalance(BigInt(0));
      setReputationTokens([]);
      setIsInitialized(false);
    }
  }, [currentAccount]);

  // Combine errors from Ethereum and contract integration
  useEffect(() => {
    if (ethereumError && !error) {
      setError(ethereumError);
    }
  }, [ethereumError, error]);

  const value = {
    contractIntegration,
    isInitialized,
    isInitializing,
    error,
    walletAddress,
    userProfile,
    clientProjects,
    freelancerProjects,
    tokenBalance,
    reputationTokens,
    initializeContracts,
    refreshUserProfile,
    refreshProjects,
    refreshTokens,
    isMetaMaskInstalled,
    chainId
  };

  return <ContractContext.Provider value={value}>{children}</ContractContext.Provider>;
};

// Custom hook to use the contract context
export const useContract = () => useContext(ContractContext);
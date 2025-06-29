import { useState, useEffect, useCallback } from 'react';
import type { MetaMaskInpageProvider } from '@metamask/providers';

type EthereumState = {
  ethereum: MetaMaskInpageProvider | null;
  isMetaMaskInstalled: boolean;
  currentAccount: string | null;
  chainId: string | null;
  error: string | null;
};

export function useEthereum() {
  const [state, setState] = useState<EthereumState>({
    ethereum: null,
    isMetaMaskInstalled: false,
    currentAccount: null,
    chainId: null,
    error: null,
  });

  // Initialize ethereum state
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ethereum = window.ethereum;
    
    if (!ethereum) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask is not installed',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      ethereum,
      isMetaMaskInstalled: true,
    }));

    // Get initial state
    const getInitialState = async () => {
      try {
        // Get chain ID
        const chainId = await ethereum.request({ method: 'eth_chainId' }) as string;
        
        // Get accounts
        const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[];
        const currentAccount = accounts.length > 0 ? accounts[0] : null;

        setState(prev => ({
          ...prev,
          chainId,
          currentAccount,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to get initial state',
        }));
      }
    };

    getInitialState();
  }, []);

  // Set up event listeners
  useEffect(() => {
    if (!state.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      if (Array.isArray(accounts)) {
        setState(prev => ({
          ...prev,
          currentAccount: accounts.length > 0 ? accounts[0] as string : null,
        }));
      }
    };

    const handleChainChanged = (chainId: unknown) => {
      if (typeof chainId === 'string') {
        setState(prev => ({
          ...prev,
          chainId,
        }));
        // Reload the page when chain changes as recommended by MetaMask
        window.location.reload();
      }
    };

    const handleDisconnect = (error: { code: number; message: string }) => {
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
    };

    // Add event listeners
    state.ethereum.on('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
    state.ethereum.on('chainChanged', handleChainChanged as (...args: unknown[]) => void);
    state.ethereum.on('disconnect', handleDisconnect as (...args: unknown[]) => void);

    // Clean up event listeners
    return () => {
      if (state.ethereum) {
        state.ethereum.removeListener('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void);
        state.ethereum.removeListener('chainChanged', handleChainChanged as (...args: unknown[]) => void);
        state.ethereum.removeListener('disconnect', handleDisconnect as (...args: unknown[]) => void);
      }
    };
  }, [state.ethereum]);

  // Connect to MetaMask
  const connect = useCallback(async () => {
    if (!state.ethereum) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask is not installed',
      }));
      return null;
    }

    try {
      const accounts = await state.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length > 0) {
        setState(prev => ({
          ...prev,
          currentAccount: accounts[0],
          error: null,
        }));
        return accounts[0];
      }
      
      return null;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Failed to connect to MetaMask',
      }));
      return null;
    }
  }, [state.ethereum]);

  // Switch network
  const switchNetwork = useCallback(async (chainId: string, networkParams?: any) => {
    if (!state.ethereum) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask is not installed',
      }));
      return false;
    }

    try {
      await state.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      return true;
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902 && networkParams) {
        try {
          await state.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams],
          });
          return true;
        } catch (addError) {
          setState(prev => ({
            ...prev,
            error: 'Failed to add the network to your wallet',
          }));
          return false;
        }
      } else {
        setState(prev => ({
          ...prev,
          error: 'Failed to switch network',
        }));
        return false;
      }
    }
  }, [state.ethereum]);

  return {
    ...state,
    connect,
    switchNetwork,
  };
}
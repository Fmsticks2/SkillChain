# Custom Hooks

This directory contains custom React hooks used throughout the Web3 Skill Platform application.

## Available Hooks

### `useEthereum`

A custom hook for interacting with Ethereum wallets (primarily MetaMask). This hook provides a clean interface for:

- Checking if MetaMask is installed
- Getting the current connected account
- Connecting to MetaMask
- Handling account and chain changes
- Switching networks
- Error handling

#### Usage

```tsx
import { useEthereum } from '@/hooks/use-ethereum';

function MyComponent() {
  const { 
    ethereum,              // The MetaMask provider instance
    isMetaMaskInstalled,  // Boolean indicating if MetaMask is installed
    currentAccount,       // Current connected Ethereum address or null
    chainId,              // Current chain ID or null
    error,                // Error message or null
    connect,              // Function to connect to MetaMask
    switchNetwork         // Function to switch networks
  } = useEthereum();

  const handleConnect = async () => {
    if (!isMetaMaskInstalled) {
      // Show message to install MetaMask
      return;
    }
    
    try {
      const account = await connect();
      if (account) {
        // Successfully connected
        console.log(`Connected to ${account}`);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  return (
    <div>
      {isMetaMaskInstalled ? (
        <button onClick={handleConnect}>
          {currentAccount ? 'Connected' : 'Connect Wallet'}
        </button>
      ) : (
        <p>Please install MetaMask to use this application</p>
      )}
    </div>
  );
}
```

### `useToast`

Provides toast notification functionality.

### `useMobile`

Detects if the current device is a mobile device.
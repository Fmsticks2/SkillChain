# Smart Contract Integration Guide

## Overview

This guide explains how to integrate the Citrea blockchain smart contracts with the Web3 Skill Platform front-end application. The platform uses a set of smart contracts deployed on the Citrea network to manage user profiles, projects, escrow payments, and skill verification.

## Architecture

The integration between the front-end application and the smart contracts follows this architecture:

```
+-------------------+        +-------------------+        +-------------------+
|                   |        |                   |        |                   |
|  React Components |<------>| ContractProvider |<------>| ContractIntegration|
|                   |        |   (Context)      |        |    (Service)      |
+-------------------+        +-------------------+        +-------------------+
                                                                   |
                                                                   v
                                                         +-------------------+
                                                         |                   |
                                                         | Smart Contracts   |
                                                         | on Citrea Network |
                                                         |                   |
                                                         +-------------------+
```

## Key Components

### 1. ContractIntegration (Service Layer)

Location: `lib/contract-integration.ts`

This service handles the direct interaction with the smart contracts. It provides methods for:

- Initializing contract connections
- Connecting to wallets
- User registration and profile management
- Project creation and management
- Payment handling
- Skill verification

### 2. ContractProvider (Context Provider)

Location: `components/contract/ContractProvider.tsx`

This React context provider wraps the application and provides:

- State management for contract interactions
- Wallet connection status
- User profile information
- Project data
- Token balances

### 3. UI Components

Location: `components/contract/`

- `ConnectWallet.tsx`: Handles wallet connection and user registration
- `CreateProject.tsx`: Interface for creating new projects
- `ProjectsList.tsx`: Displays and manages user projects

## Integration Steps

### 1. Setup ContractProvider

Wrap your application or specific pages with the `ContractProvider` component:

```tsx
// In your page or layout component
import { ContractProvider } from "../components/contract/ContractProvider";

export default function YourPage() {
  return (
    <ContractProvider>
      {/* Your components */}
    </ContractProvider>
  );
}
```

### 2. Connect Wallet

Use the `ConnectWallet` component to allow users to connect their wallets and register profiles:

```tsx
import { ConnectWallet } from "../components/contract/ConnectWallet";

export default function YourPage() {
  return (
    <div>
      <ConnectWallet />
      {/* Other components */}
    </div>
  );
}
```

### 3. Create Projects

Use the `CreateProject` component to allow clients to create new projects:

```tsx
import { CreateProject } from "../components/contract/CreateProject";

export default function YourPage() {
  return (
    <div>
      <CreateProject />
      {/* Other components */}
    </div>
  );
}
```

### 4. Display Projects

Use the `ProjectsList` component to display and manage projects:

```tsx
import { ProjectsList } from "../components/contract/ProjectsList";

export default function YourPage() {
  return (
    <div>
      <ProjectsList />
      {/* Other components */}
    </div>
  );
}
```

### 5. Access Contract Data in Custom Components

Use the `useContract` hook to access contract data and functions in your custom components:

```tsx
import { useContract } from "../components/contract/ContractProvider";

export default function YourCustomComponent() {
  const { 
    isInitialized,
    walletAddress,
    userProfile,
    projects,
    tokenBalance,
    reputationTokens,
    connectWallet,
    registerUser,
    createProject,
    updateProjectStatus,
    releasePayment,
    createDispute
  } = useContract();

  // Your component logic

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
```

## Example: Complete Integration Page

A complete example of a page that integrates all contract components:

```tsx
'use client';

import { ContractProvider } from "../components/contract/ContractProvider";
import { ConnectWallet } from "../components/contract/ConnectWallet";
import { CreateProject } from "../components/contract/CreateProject";
import { ProjectsList } from "../components/contract/ProjectsList";

export default function ContractsPage() {
  return (
    <ContractProvider>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Web3 Skill Platform on Citrea</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <ConnectWallet />
          <CreateProject />
        </div>
        
        <div className="mb-8">
          <ProjectsList />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">About Citrea Integration</h2>
          <p className="text-gray-600 mb-4">
            This platform is built on Citrea, a Bitcoin Layer 2 solution that uses ZK-rollups and BitVM to enable
            complex smart contracts on Bitcoin.
          </p>
        </div>
      </div>
    </ContractProvider>
  );
}
```

## Configuration

### Contract Addresses

Contract addresses are configured in `lib/contract-integration.ts`. Update these addresses after deploying your contracts to the Citrea network:

```typescript
// Contract addresses for Citrea testnet
const TESTNET_ADDRESSES = {
  userRegistry: "0x...",
  skillVerification: "0x...",
  projectEscrow: "0x...",
  skillToken: "0x...",
  reputationToken: "0x...",
  skillPlatform: "0x..."
};

// Contract addresses for Citrea mainnet
const MAINNET_ADDRESSES = {
  userRegistry: "0x...",
  skillVerification: "0x...",
  projectEscrow: "0x...",
  skillToken: "0x...",
  reputationToken: "0x...",
  skillPlatform: "0x..."
};
```

### Network Configuration

Citrea network configuration is also defined in `lib/contract-integration.ts`:

```typescript
const NETWORKS = {
  citreaTestnet: {
    chainId: "0x849", // 2121 in decimal
    chainName: "Citrea Testnet",
    nativeCurrency: {
      name: "Bitcoin",
      symbol: "BTC",
      decimals: 18
    },
    rpcUrls: ["https://testnet-rpc.citrea.xyz"],
    blockExplorerUrls: ["https://testnet-explorer.citrea.xyz"]
  },
  citreaMainnet: {
    chainId: "0x84A", // 2122 in decimal
    chainName: "Citrea Mainnet",
    nativeCurrency: {
      name: "Bitcoin",
      symbol: "BTC",
      decimals: 18
    },
    rpcUrls: ["https://rpc.citrea.xyz"],
    blockExplorerUrls: ["https://explorer.citrea.xyz"]
  }
};
```

## Troubleshooting

### Common Issues

1. **Wallet Connection Issues**
   - Ensure MetaMask or another compatible wallet is installed
   - Check that the wallet is configured for the Citrea network

2. **Transaction Failures**
   - Ensure the user has enough BTC for gas fees
   - Check console for error messages from the contract calls
   - Verify contract addresses are correct

3. **Contract Initialization Failures**
   - Check that ABIs match the deployed contracts
   - Verify network configuration is correct
   - Ensure the RPC endpoint is accessible

### Debugging

The `ContractProvider` includes error handling and logging. Check the browser console for detailed error messages when transactions fail.

## Best Practices

1. **Error Handling**
   - Always wrap contract calls in try/catch blocks
   - Display user-friendly error messages
   - Log detailed errors to the console for debugging

2. **Loading States**
   - Show loading indicators during contract interactions
   - Disable buttons during pending transactions
   - Provide feedback on transaction progress

3. **Security**
   - Never store private keys in the front-end code
   - Use wallet providers for transaction signing
   - Validate user inputs before sending to contracts

## Resources

- [Citrea Documentation](https://docs.citrea.xyz)
- [Ethers.js Documentation](https://docs.ethers.org)
- [MetaMask Documentation](https://docs.metamask.io)
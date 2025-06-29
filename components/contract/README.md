# Contract Components

## Overview

This directory contains React components for integrating with the Citrea blockchain smart contracts. These components provide a user interface for interacting with the Web3 Skill Platform smart contracts.

## Components

### ContractProvider.tsx

A React context provider that manages the state and functions for interacting with the smart contracts. It provides:

- Contract initialization
- Wallet connection status
- User profile information
- Project data
- Token balances
- Functions for refreshing data

### useContract.ts

A custom hook that provides access to the ContractProvider context. Use this hook in your components to access contract-related state and functions.

### ConnectWallet.tsx

A component that handles wallet connection and user registration. It displays different UI states based on connection and registration status.

### CreateProject.tsx

A component that allows clients to create new projects on the platform. It includes form validation and contract interaction.

### ProjectsList.tsx

A component that displays and manages user projects. It shows different projects based on the user's role (client or freelancer) and provides functions for updating project status, releasing payments, and creating disputes.

### UserDashboard.tsx

A component that displays user information, token balances, reputation tokens, and projects in a dashboard format. It automatically refreshes data and provides a manual refresh button.

## Usage

### Basic Setup

1. Wrap your application or specific pages with the `ContractProvider` component:

```tsx
import { ContractProvider } from "../components/contract/ContractProvider";

export default function YourPage() {
  return (
    <ContractProvider>
      {/* Your components */}
    </ContractProvider>
  );
}
```

2. Use the contract components in your pages:

```tsx
import { ConnectWallet } from "../components/contract/ConnectWallet";
import { CreateProject } from "../components/contract/CreateProject";
import { ProjectsList } from "../components/contract/ProjectsList";
import { UserDashboard } from "../components/contract/UserDashboard";

export default function YourPage() {
  return (
    <div>
      <ConnectWallet />
      <CreateProject />
      <UserDashboard />
      <ProjectsList />
    </div>
  );
}
```

### Using the useContract Hook

You can use the `useContract` hook in your custom components to access contract data and functions:

```tsx
import { useContract } from "../components/contract/useContract";

export default function YourCustomComponent() {
  const { 
    isInitialized,
    walletAddress,
    userProfile,
    clientProjects,
    freelancerProjects,
    tokenBalance,
    reputationTokens,
    initializeContracts,
    refreshUserProfile,
    refreshProjects,
    refreshTokens
  } = useContract();

  // Your component logic

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
```

## Dependencies

These components depend on:

- `lib/contract-integration.ts`: Service layer for interacting with the smart contracts
- React context and hooks for state management
- Tailwind CSS for styling

## Error Handling

All components include error handling for contract interactions. Errors are displayed to the user and logged to the console for debugging.

## Customization

You can customize the UI of these components by modifying the Tailwind CSS classes or by creating your own components that use the `useContract` hook.
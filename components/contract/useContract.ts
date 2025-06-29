'use client';

/**
 * Hook to access the contract context and its functions
 * 
 * This hook provides access to all contract-related state and functions
 * from the ContractProvider context. It can be used in any component
 * that needs to interact with the smart contracts.
 * 
 * @returns The contract context object with all state and functions
 * 
 * @example
 * ```tsx
 * import { useContract } from '../components/contract/useContract';
 * 
 * function MyComponent() {
 *   const { 
 *     isInitialized, 
 *     walletAddress, 
 *     userProfile,
 *     clientProjects,
 *     freelancerProjects,
 *     initializeContracts 
 *   } = useContract();
 *   
 *   // Use the contract context here
 *   
 *   return <div>...</div>;
 * }
 * ```
 */
export { useContract } from './ContractProvider';
'use client';

import { useState } from 'react';
import { useContract } from './ContractProvider';
import { Button } from "../ui/button";
import { UserRole } from '../../lib/contract-integration';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export function ConnectWallet() {
  const {
    isInitialized,
    isInitializing,
    error,
    walletAddress,
    userProfile,
    initializeContracts,
    refreshUserProfile,
    isMetaMaskInstalled,
  } = useContract();

  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    company: '',
    skills: '',
    experience: 0,
    role: UserRole.Client,
  });

  // Handle wallet connection
  const handleConnect = async () => {
    try {
      await initializeContracts();
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  // Handle user registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized || isRegistering) return;

    setIsRegistering(true);

    try {
      const { contractIntegration } = await import('../../lib/contract-integration');
      
      await contractIntegration.registerUser(
        registrationData.name,
        registrationData.email,
        registrationData.company,
        registrationData.skills.split(',').map(skill => skill.trim()),
        registrationData.experience,
        registrationData.role
      );

      // Refresh user profile after registration
      await refreshUserProfile();
    } catch (err) {
      console.error('Failed to register user:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) || 0 : 
              name === 'role' ? parseInt(value) : value,
    }));
  };

  // Render wallet connection button if not connected
  if (!isInitialized && !isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6 text-center">
          Connect your wallet to access the Web3 Skill Platform on Citrea.
        </p>
        
        {!isMetaMaskInstalled && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>MetaMask Not Installed</AlertTitle>
            <AlertDescription>
              Please install MetaMask to use this application.
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                Download MetaMask
              </a>
            </AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleConnect} 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={!isMetaMaskInstalled}
        >
          Connect Wallet
        </Button>
        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  }

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Connecting...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show registration form if wallet is connected but user is not registered
  if (isInitialized && walletAddress && !userProfile) {
    return (
      <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>
        <p className="text-gray-600 mb-6">
          Your wallet is connected ({walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}), but you need to register to use the platform.
        </p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={registrationData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={registrationData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company/Organization</label>
            <input
              type="text"
              id="company"
              name="company"
              value={registrationData.company}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={registrationData.skills}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. JavaScript, Solidity, React"
            />
          </div>
          
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={registrationData.experience}
              onChange={handleInputChange}
              min="0"
              max="50"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
            <select
              id="role"
              name="role"
              value={registrationData.role}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={UserRole.Client}>Client</option>
              <option value={UserRole.Freelancer}>Freelancer</option>
              <option value={UserRole.Both}>Both</option>
            </select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isRegistering}
          >
            {isRegistering ? 'Registering...' : 'Register'}
          </Button>
        </form>
        
        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  }

  // Show connected wallet info if user is registered
  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Wallet Connected</h2>
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-semibold">Address:</span> {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
        </p>
        {userProfile && (
          <>
            <p className="text-gray-600">
              <span className="font-semibold">Name:</span> {userProfile.name}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Role:</span> {
                userProfile.role === UserRole.Client ? 'Client' :
                userProfile.role === UserRole.Freelancer ? 'Freelancer' : 'Both'
              }
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Verification Status:</span> {
                ['Unverified', 'Pending', 'Verified', 'Rejected'][userProfile.verificationStatus]
              }
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Reputation:</span> {userProfile.reputation} points
            </p>
          </>
        )}
      </div>
    </div>
  );
}
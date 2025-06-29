'use client';

import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { UserRole } from '../../lib/contract-integration';

export function UserDashboard() {
  const {
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
    refreshTokens
  } = useContract();

  const [isLoading, setIsLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Initialize contracts if not already initialized
  useEffect(() => {
    if (!isInitialized && !isInitializing) {
      initializeContracts();
    }
  }, [isInitialized, isInitializing, initializeContracts]);

  // Refresh data periodically
  useEffect(() => {
    if (!isInitialized) return;

    const refreshData = async () => {
      try {
        await refreshUserProfile();
        await refreshProjects();
        await refreshTokens();
      } catch (err: any) {
        console.error('Error refreshing data:', err);
        setDashboardError(err.message || 'Failed to refresh data');
      }
    };

    // Initial refresh
    refreshData();

    // Set up interval for periodic refresh
    const intervalId = setInterval(refreshData, 30000); // Every 30 seconds

    return () => clearInterval(intervalId);
  }, [isInitialized, refreshUserProfile, refreshProjects, refreshTokens]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    setDashboardError(null);

    try {
      await refreshUserProfile();
      await refreshProjects();
      await refreshTokens();
    } catch (err: any) {
      console.error('Error refreshing data:', err);
      setDashboardError(err.message || 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        {isInitializing ? (
          <p className="text-gray-600">Initializing contracts...</p>
        ) : (
          <button
            onClick={initializeContracts}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Connect to Contracts
          </button>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-600">Please connect your wallet to view your dashboard.</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-gray-600">Please register your profile to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Dashboard</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {dashboardError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {dashboardError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Profile</h3>
          <p><strong>Name:</strong> {userProfile.name}</p>
          <p><strong>Role:</strong> {userProfile.role === UserRole.Client ? 'Client' : 'Freelancer'}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Verification Status:</strong> {userProfile.verificationStatus}</p>
          <p><strong>Reputation Score:</strong> {userProfile.reputation.toString()}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Tokens</h3>
          <p><strong>SKILL Balance:</strong> {tokenBalance.toString()}</p>
          <p><strong>Reputation Tokens:</strong> {reputationTokens.length}</p>
          <div className="mt-2">
            {reputationTokens.map((token, index) => (
              <div key={index} className="bg-gray-100 p-2 rounded mb-2">
                <p><strong>Token ID:</strong> {token.id}</p>
                <p><strong>Skill:</strong> {token.skill}</p>
                <p><strong>Score:</strong> {token.score}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          {userProfile.role === UserRole.Client ? 'My Projects (as Client)' : 'My Projects (as Freelancer)'}
        </h3>
        
        {userProfile.role === UserRole.Client ? (
          clientProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {clientProjects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium mb-1">Project #{project.id.toString()}</h4>
                  <p><strong>Freelancer:</strong> {project.freelancer}</p>
                  <p><strong>Amount:</strong> {project.amount.toString()}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  <p><strong>Deadline:</strong> {new Date(Number(project.deadline) * 1000).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No projects found. Create a new project to get started.</p>
          )
        ) : (
          freelancerProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {freelancerProjects.map((project, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="text-lg font-medium mb-1">Project #{project.id.toString()}</h4>
                  <p><strong>Client:</strong> {project.client}</p>
                  <p><strong>Amount:</strong> {project.amount.toString()}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  <p><strong>Deadline:</strong> {new Date(Number(project.deadline) * 1000).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No projects found. Browse available projects to get started.</p>
          )
        )}
      </div>
    </div>
  );
}
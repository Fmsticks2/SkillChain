'use client';

import { useState } from 'react';
import { useContract } from './ContractProvider';
import { Button } from "../ui/button";
import { ethers } from 'ethers';

export function CreateProject() {
  const {
    isInitialized,
    walletAddress,
    userProfile,
    refreshProjects,
  } = useContract();

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [projectData, setProjectData] = useState({
    freelancerAddress: '',
    amount: '',
    deadline: '',
    metadata: '',
  });

  // Handle project creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized || isCreating || !userProfile) return;

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate inputs
      if (!ethers.isAddress(projectData.freelancerAddress)) {
        throw new Error('Invalid freelancer address');
      }

      const amount = parseFloat(projectData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      const deadline = new Date(projectData.deadline).getTime() / 1000;
      if (isNaN(deadline) || deadline <= Math.floor(Date.now() / 1000)) {
        throw new Error('Deadline must be in the future');
      }

      if (!projectData.metadata.trim()) {
        throw new Error('Project metadata is required');
      }

      const { contractIntegration } = await import('../../lib/contract-integration');
      
      // Convert amount to wei
      const amountInWei = ethers.parseEther(projectData.amount);
      
      // Create project
      const projectId = await contractIntegration.createProject(
        projectData.freelancerAddress,
        amountInWei,
        Math.floor(deadline),
        projectData.metadata
      );

      // Reset form
      setProjectData({
        freelancerAddress: '',
        amount: '',
        deadline: '',
        metadata: '',
      });

      // Refresh projects list
      await refreshProjects();

      setSuccess(`Project created successfully! Project ID: ${projectId}`);
    } catch (err: any) {
      console.error('Failed to create project:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // If wallet is not connected or user is not registered, show message
  if (!isInitialized || !walletAddress || !userProfile) {
    return (
      <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Create a Project</h2>
        <p className="text-gray-600">
          Please connect your wallet and complete your profile to create a project.
        </p>
      </div>
    );
  }

  // Show project creation form
  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create a Project</h2>
      
      <form onSubmit={handleCreateProject} className="space-y-4">
        <div>
          <label htmlFor="freelancerAddress" className="block text-sm font-medium text-gray-700">
            Freelancer Address
          </label>
          <input
            type="text"
            id="freelancerAddress"
            name="freelancerAddress"
            value={projectData.freelancerAddress}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0x..."
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (BTC)
          </label>
          <input
            type="text"
            id="amount"
            name="amount"
            value={projectData.amount}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.01"
          />
        </div>
        
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
            Deadline
          </label>
          <input
            type="datetime-local"
            id="deadline"
            name="deadline"
            value={projectData.deadline}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="metadata" className="block text-sm font-medium text-gray-700">
            Project Description/Metadata
          </label>
          <textarea
            id="metadata"
            name="metadata"
            value={projectData.metadata}
            onChange={handleInputChange}
            required
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe your project or provide an IPFS hash for detailed specifications"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isCreating}
        >
          {isCreating ? 'Creating Project...' : 'Create Project'}
        </Button>
      </form>
      
      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}
      
      {success && (
        <p className="mt-4 text-green-500 text-sm">{success}</p>
      )}
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useContract } from './ContractProvider';
import { Button } from "../ui/button";
import { Project, ProjectStatus } from '../../lib/contract-integration';
import { ethers } from 'ethers';

export function ProjectsList() {
  const {
    isInitialized,
    walletAddress,
    userProfile,
    clientProjects,
    freelancerProjects,
    refreshProjects,
  } = useContract();

  const [activeTab, setActiveTab] = useState<'client' | 'freelancer'>('client');
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  // Get projects based on active tab
  const projects = activeTab === 'client' ? clientProjects : freelancerProjects;

  // Handle project status update
  const handleUpdateStatus = async (projectId: number, newStatus: ProjectStatus) => {
    if (!isInitialized || isUpdating) return;

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const { contractIntegration } = await import('../../lib/contract-integration');
      
      await contractIntegration.updateProjectStatus(projectId, newStatus);
      
      // Refresh projects list
      await refreshProjects();
      
      setSuccess(`Project status updated successfully!`);
    } catch (err: any) {
      console.error('Failed to update project status:', err);
      setError(err.message || 'Failed to update project status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle payment release
  const handleReleasePayment = async (projectId: number) => {
    if (!isInitialized || isUpdating) return;

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const { contractIntegration } = await import('../../lib/contract-integration');
      
      await contractIntegration.releasePayment(projectId);
      
      // Refresh projects list
      await refreshProjects();
      
      setSuccess(`Payment released successfully!`);
    } catch (err: any) {
      console.error('Failed to release payment:', err);
      setError(err.message || 'Failed to release payment');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle dispute creation
  const handleCreateDispute = async (projectId: number) => {
    if (!isInitialized || isUpdating || !disputeReason.trim()) return;

    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const { contractIntegration } = await import('../../lib/contract-integration');
      
      await contractIntegration.createDispute(projectId, disputeReason);
      
      // Refresh projects list
      await refreshProjects();
      
      setSuccess(`Dispute created successfully!`);
      setDisputeReason('');
    } catch (err: any) {
      console.error('Failed to create dispute:', err);
      setError(err.message || 'Failed to create dispute');
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // Format status string
  const formatStatus = (status: ProjectStatus) => {
    const statusNames = ['Created', 'In Progress', 'Completed', 'Cancelled', 'Disputed'];
    return statusNames[status];
  };

  // Format amount
  const formatAmount = (amount: bigint) => {
    return ethers.formatEther(amount);
  };

  // If wallet is not connected or user is not registered, show message
  if (!isInitialized || !walletAddress || !userProfile) {
    return (
      <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">My Projects</h2>
        <p className="text-gray-600">
          Please connect your wallet and complete your profile to view your projects.
        </p>
      </div>
    );
  }

  // Show projects list
  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">My Projects</h2>
      
      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'client' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('client')}
        >
          As Client
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'freelancer' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('freelancer')}
        >
          As Freelancer
        </button>
      </div>
      
      {/* Projects list */}
      {projects.length === 0 ? (
        <p className="text-gray-600">
          You don't have any projects as a {activeTab} yet.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg overflow-hidden">
              {/* Project header */}
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              >
                <div>
                  <h3 className="font-semibold">Project #{project.id}</h3>
                  <p className="text-sm text-gray-500">
                    Status: <span className={`font-medium ${project.status === ProjectStatus.Completed ? 'text-green-600' : project.status === ProjectStatus.Disputed ? 'text-red-600' : 'text-blue-600'}`}>
                      {formatStatus(project.status)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatAmount(project.amount)} BTC</p>
                  <p className="text-sm text-gray-500">
                    Deadline: {formatDate(project.deadline)}
                  </p>
                </div>
              </div>
              
              {/* Expanded project details */}
              {expandedProject === project.id && (
                <div className="p-4 border-t">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-mono">{project.client.slice(0, 6)}...{project.client.slice(-4)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Freelancer</p>
                      <p className="font-mono">{project.freelancer.slice(0, 6)}...{project.freelancer.slice(-4)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p>{formatDate(project.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Updated At</p>
                      <p>{formatDate(project.updatedAt)}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Metadata/Description</p>
                    <p className="bg-gray-50 p-2 rounded">{project.metadata}</p>
                  </div>
                  
                  {/* Actions based on role and project status */}
                  <div className="space-y-2">
                    {/* Client actions */}
                    {activeTab === 'client' && (
                      <>
                        {project.status === ProjectStatus.Created && (
                          <Button 
                            onClick={() => handleUpdateStatus(project.id, ProjectStatus.Cancelled)}
                            className="w-full bg-red-600 hover:bg-red-700"
                            disabled={isUpdating}
                          >
                            Cancel Project
                          </Button>
                        )}
                        
                        {project.status === ProjectStatus.InProgress && (
                          <>
                            <Button 
                              onClick={() => handleReleasePayment(project.id)}
                              className="w-full bg-green-600 hover:bg-green-700"
                              disabled={isUpdating}
                            >
                              Release Payment
                            </Button>
                            
                            <Button 
                              onClick={() => handleUpdateStatus(project.id, ProjectStatus.Completed)}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              disabled={isUpdating}
                            >
                              Mark as Completed
                            </Button>
                          </>
                        )}
                        
                        {(project.status === ProjectStatus.Created || project.status === ProjectStatus.InProgress) && (
                          <div className="space-y-2 mt-2">
                            <textarea
                              placeholder="Reason for dispute"
                              value={disputeReason}
                              onChange={(e) => setDisputeReason(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              rows={2}
                            />
                            <Button 
                              onClick={() => handleCreateDispute(project.id)}
                              className="w-full bg-yellow-600 hover:bg-yellow-700"
                              disabled={isUpdating || !disputeReason.trim()}
                            >
                              Create Dispute
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Freelancer actions */}
                    {activeTab === 'freelancer' && (
                      <>
                        {project.status === ProjectStatus.Created && (
                          <Button 
                            onClick={() => handleUpdateStatus(project.id, ProjectStatus.InProgress)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={isUpdating}
                          >
                            Start Working
                          </Button>
                        )}
                        
                        {(project.status === ProjectStatus.Created || project.status === ProjectStatus.InProgress) && (
                          <div className="space-y-2 mt-2">
                            <textarea
                              placeholder="Reason for dispute"
                              value={disputeReason}
                              onChange={(e) => setDisputeReason(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              rows={2}
                            />
                            <Button 
                              onClick={() => handleCreateDispute(project.id)}
                              className="w-full bg-yellow-600 hover:bg-yellow-700"
                              disabled={isUpdating || !disputeReason.trim()}
                            >
                              Create Dispute
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <p className="mt-4 text-red-500 text-sm">{error}</p>
      )}
      
      {success && (
        <p className="mt-4 text-green-500 text-sm">{success}</p>
      )}
    </div>
  );
}
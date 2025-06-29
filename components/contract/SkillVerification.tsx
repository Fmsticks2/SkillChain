'use client';

import { useState } from 'react';
import { useContract } from './useContract';
import { SkillVerificationStatus } from '../../lib/contract-integration';

export function SkillVerification() {
  const {
    isInitialized,
    walletAddress,
    userProfile,
    contractIntegration
  } = useContract();

  const [skillName, setSkillName] = useState('');
  const [skillCategory, setSkillCategory] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null);
  const [attestationId, setAttestationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userAttestations, setUserAttestations] = useState<any[]>([]);

  // Add a new skill (admin only)
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized || !contractIntegration) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const skillId = await contractIntegration.addSkill(skillName, skillCategory);
      setSuccess(`Skill added successfully with ID: ${skillId}`);
      setSkillName('');
      setSkillCategory('');
    } catch (err: any) {
      console.error('Error adding skill:', err);
      setError(err.message || 'Failed to add skill');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a skill attestation
  const handleCreateAttestation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInitialized || !contractIntegration || selectedSkillId === null) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const attestationId = await contractIntegration.createSkillAttestation(
        selectedSkillId,
        userAddress
      );
      setSuccess(`Attestation created successfully with ID: ${attestationId}`);
      setAttestationId(attestationId);
      setUserAddress('');
      setSelectedSkillId(null);
    } catch (err: any) {
      console.error('Error creating attestation:', err);
      setError(err.message || 'Failed to create attestation');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify a skill attestation (verifier only)
  const handleVerifyAttestation = async () => {
    if (!isInitialized || !contractIntegration || attestationId === null) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await contractIntegration.verifySkillAttestation(attestationId);
      setSuccess(`Attestation ${attestationId} verified successfully`);
      setAttestationId(null);
    } catch (err: any) {
      console.error('Error verifying attestation:', err);
      setError(err.message || 'Failed to verify attestation');
    } finally {
      setIsLoading(false);
    }
  };

  // Get user's skill attestations
  const handleGetUserAttestations = async () => {
    if (!isInitialized || !contractIntegration) return;

    setIsLoading(true);
    setError(null);

    try {
      const attestations = await contractIntegration.getUserSkillAttestations();
      setUserAttestations(attestations);
      setSuccess(`Retrieved ${attestations.length} attestations`);
    } catch (err: any) {
      console.error('Error getting attestations:', err);
      setError(err.message || 'Failed to get attestations');
      setUserAttestations([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized || !walletAddress) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Skill Verification</h2>
        <p className="text-gray-600">Please connect your wallet to use skill verification features.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Skill Verification</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Skill Form (Admin Only) */}
        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Add Skill (Admin Only)</h3>
          <form onSubmit={handleAddSkill}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skillName">
                Skill Name
              </label>
              <input
                id="skillName"
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skillCategory">
                Skill Category
              </label>
              <input
                id="skillCategory"
                type="text"
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
            >
              {isLoading ? 'Adding...' : 'Add Skill'}
            </button>
          </form>
        </div>

        {/* Create Attestation Form */}
        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Create Skill Attestation</h3>
          <form onSubmit={handleCreateAttestation}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skillId">
                Skill ID
              </label>
              <input
                id="skillId"
                type="number"
                value={selectedSkillId || ''}
                onChange={(e) => setSelectedSkillId(parseInt(e.target.value) || null)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userAddress">
                User Address
              </label>
              <input
                id="userAddress"
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
            >
              {isLoading ? 'Creating...' : 'Create Attestation'}
            </button>
          </form>
        </div>

        {/* Verify Attestation Form */}
        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">Verify Skill Attestation (Verifier Only)</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="attestationId">
              Attestation ID
            </label>
            <input
              id="attestationId"
              type="number"
              value={attestationId || ''}
              onChange={(e) => setAttestationId(parseInt(e.target.value) || null)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            onClick={handleVerifyAttestation}
            disabled={isLoading || attestationId === null}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-green-300"
          >
            {isLoading ? 'Verifying...' : 'Verify Attestation'}
          </button>
        </div>

        {/* User Attestations */}
        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-4">My Skill Attestations</h3>
          <button
            onClick={handleGetUserAttestations}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300 mb-4"
          >
            {isLoading ? 'Loading...' : 'Load My Attestations'}
          </button>

          {userAttestations.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-lg font-medium mb-2">Your Attestations:</h4>
              <div className="space-y-2">
                {userAttestations.map((attestation, index) => (
                  <div key={index} className="bg-gray-100 p-3 rounded">
                    <p><strong>ID:</strong> {attestation.id}</p>
                    <p><strong>Skill ID:</strong> {attestation.skillId}</p>
                    <p><strong>Attestor:</strong> {attestation.attestorAddress.substring(0, 6)}...{attestation.attestorAddress.substring(38)}</p>
                    <p><strong>Status:</strong> {
                      attestation.status === SkillVerificationStatus.None ? 'None' :
                      attestation.status === SkillVerificationStatus.Pending ? 'Pending' :
                      attestation.status === SkillVerificationStatus.Verified ? 'Verified' :
                      'Rejected'
                    }</p>
                    <p><strong>Created:</strong> {new Date(Number(attestation.createdAt) * 1000).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No attestations found. Load your attestations or create new ones.</p>
          )}
        </div>
      </div>
    </div>
  );
}
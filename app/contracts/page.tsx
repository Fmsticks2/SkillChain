'use client';

import { useState } from 'react';
import { ContractProvider } from "../../components/contract/ContractProvider";
import { ConnectWallet } from "../../components/contract/ConnectWallet";
import { CreateProject } from "../../components/contract/CreateProject";
import { ProjectsList } from "../../components/contract/ProjectsList";
import { UserDashboard } from "../../components/contract/UserDashboard";
import { SkillVerification } from "../../components/contract/SkillVerification";
import { ContractNavigation } from "../../components/contract/ContractNavigation";

export default function ContractsPage() {
  const [activeSection, setActiveSection] = useState<'connect' | 'dashboard' | 'create' | 'projects' | 'skills' | 'about'>('connect');

  return (
    <ContractProvider>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Web3 Skill Platform on Citrea</h1>
        
        <ContractNavigation 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        {activeSection === 'connect' && (
          <div className="mb-8">
            <ConnectWallet />
          </div>
        )}
        
        {activeSection === 'dashboard' && (
          <div className="mb-8">
            <UserDashboard />
          </div>
        )}
        
        {activeSection === 'create' && (
          <div className="mb-8">
            <CreateProject />
          </div>
        )}
        
        {activeSection === 'projects' && (
          <div className="mb-8">
            <ProjectsList />
          </div>
        )}
        
        {activeSection === 'skills' && (
          <div className="mb-8">
            <SkillVerification />
          </div>
        )}
        
        {activeSection === 'about' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">About Citrea Integration</h2>
            <p className="text-gray-600 mb-4">
              This platform is built on Citrea, a Bitcoin Layer 2 solution that uses ZK-rollups and BitVM to enable
              complex smart contracts on Bitcoin. Our smart contracts handle user registration, project management,
              escrow payments, and skill verification.
            </p>
            <p className="text-gray-600 mb-4">
              The platform uses the following smart contracts:
            </p>
            <ul className="list-disc pl-5 mb-4 text-gray-600">
              <li><strong>SkillPlatform</strong>: The main contract that orchestrates all platform functionality</li>
              <li><strong>UserRegistry</strong>: Manages user profiles and verification</li>
              <li><strong>SkillVerification</strong>: Handles skill attestations and verification</li>
              <li><strong>ProjectEscrow</strong>: Manages secure payment escrows for projects</li>
              <li><strong>SkillToken</strong>: ERC20 token for platform rewards and governance</li>
              <li><strong>ReputationToken</strong>: ERC721 token representing verified skills and reputation</li>
            </ul>
            <p className="text-gray-600">
              Connect your wallet to start using the platform. You'll need to register your profile before you can create
              or work on projects. All payments are securely handled through smart contracts on the Citrea network.
            </p>
          </div>
        )}
      </div>
    </ContractProvider>
  );
}
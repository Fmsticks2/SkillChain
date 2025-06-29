'use client';

import { useState } from 'react';

type Section = 'connect' | 'dashboard' | 'create' | 'projects' | 'skills' | 'about';

interface ContractNavigationProps {
  onSectionChange: (section: Section) => void;
  activeSection: Section;
}

export function ContractNavigation({ onSectionChange, activeSection }: ContractNavigationProps) {
  const sections: { id: Section; label: string }[] = [
    { id: 'connect', label: 'Connect Wallet' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'create', label: 'Create Project' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skill Verification' },
    { id: 'about', label: 'About' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      <nav className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
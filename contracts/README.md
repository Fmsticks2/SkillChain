# Smart Contracts for Web3 Skill Platform on Citrea

This directory contains the smart contracts for the Web3 Skill Platform deployed on Citrea, a ZK-rollup for Bitcoin that is fully EVM compatible.

## Overview

The smart contracts in this repository are designed to facilitate the following functionalities:

- User profile management and verification
- Skill verification and attestation
- Escrow services for freelance projects
- Payment processing and token management
- Reputation system

## Contract Structure

- `core/`: Core contracts for the platform
  - `SkillPlatform.sol`: Main contract that orchestrates the platform
  - `UserRegistry.sol`: Manages user profiles and verification
  - `SkillVerification.sol`: Handles skill verification and attestations

- `escrow/`: Contracts for handling escrow services
  - `ProjectEscrow.sol`: Manages escrow for projects
  - `MilestoneEscrow.sol`: Handles milestone-based payments

- `tokens/`: Token-related contracts
  - `SkillToken.sol`: Platform utility token
  - `ReputationToken.sol`: Non-transferable token for reputation

- `interfaces/`: Contract interfaces
  - `ISkillPlatform.sol`: Interface for the main platform contract
  - `IUserRegistry.sol`: Interface for user registry
  - `ISkillVerification.sol`: Interface for skill verification

- `libraries/`: Utility libraries
  - `Verification.sol`: Utilities for verification processes
  - `Escrow.sol`: Utilities for escrow operations

## Development

### Prerequisites

- Node.js and npm/yarn
- Hardhat

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile contracts:
   ```bash
   npx hardhat compile
   ```

3. Run tests:
   ```bash
   npx hardhat test
   ```

### Deployment

1. Configure deployment settings in `hardhat.config.js`
2. Deploy to Citrea testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network citrea-testnet
   ```

## Citrea Specifics

Citrea is a ZK-rollup for Bitcoin that is fully EVM compatible. This means that all Ethereum-based smart contracts can be deployed on Citrea without modification. The platform leverages BitVM for its trust-minimized two-way peg program.

### Connecting to Citrea

To connect to the Citrea network, use the following RPC endpoints:

- Testnet: `https://rpc-testnet.citrea.xyz`
- Chain ID: `2121`

## License

MIT
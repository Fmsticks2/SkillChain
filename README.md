# ⛓️ SkillChain

## 🌐 Overview

SkillChain is a decentralized application built on the Citrea network that connects clients and freelancers in a trustless environment. The platform leverages blockchain technology to provide verified skill attestations, secure payment escrow, and a portable reputation system.

### ✨ Key Features

- **🔐 Blockchain Verification**: Skills verified through cryptographic challenges and peer review
- **💼 Smart Contract Escrow**: Automated payments and milestone releases through secure smart contracts
- **🌍 Global Talent Pool**: Access to 25,000+ verified Web3 professionals worldwide
- **🏆 Portable Reputation**: Build a reputation that follows you across platforms and projects

## 🏗️ Technical Architecture

The platform consists of two main components:

1. **📝 Smart Contracts**: Solidity contracts deployed on the Citrea network
   - User profile management and verification
   - Skill verification and attestation
   - Escrow services for freelance projects
   - Payment processing and token management
   - Reputation system

2. **🖥️ Frontend Application**: Next.js web application deployed on Vercel
   - React components for contract interaction
   - Wallet integration
   - User dashboard
   - Project management interface

## 🔄 Citrea Integration

The platform is built on Citrea, a ZK-rollup for Bitcoin that is fully EVM compatible. This provides:

- 💰 Low transaction fees
- ⚡ High throughput
- 🔒 Security backed by Bitcoin
- 🔌 Full compatibility with Ethereum tooling

## 🛣️ Development Roadmap

### 🚀 Phase 1: Core Platform (Current)

- Smart contract deployment on Citrea testnet
- Basic user registration and profile management
- Project creation and escrow functionality
- Skill verification system

### 🔍 Phase 2: Enhanced Features (Upcoming)

- Reputation token implementation
- Dispute resolution mechanism
- Advanced search and matching algorithms
- Mobile application development

### 🌱 Phase 3: Ecosystem Expansion

- Cross-chain integration with other networks
- DAO governance implementation
- Decentralized skill certification partnerships
- AI-powered talent matching

## 🚦 Getting Started

### 📋 Prerequisites

- Node.js and npm/yarn
- MetaMask or other Web3 wallet
- Citrea testnet tokens for testing

### 🔧 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/skillchain.git
   cd skillchain
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## 📚 Documentation

Detailed documentation is available in the `docs` directory:

- [Smart Contract Deployment Guide](./docs/smart-contract-deployment-guide.md)
- [Contract Verification Guide](./docs/contract-verification-guide.md)
- [Frontend Deployment Guide](./docs/frontend-deployment-guide.md)
- [Contract Integration Guide](./docs/contract-integration-guide.md)

## 📜 License

MIT

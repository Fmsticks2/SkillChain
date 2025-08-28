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

## 📁 Project Structure

```
SkillChain/
├── 📱 app/                          # Next.js App Router pages
│   ├── admin/                       # Admin dashboard
│   ├── analytics/                   # Analytics and reporting
│   ├── api/                         # API routes
│   │   ├── auth/                    # Authentication endpoints
│   │   └── ws/                      # WebSocket handlers
│   ├── auth/                        # Authentication pages
│   │   ├── signin/                  # Sign-in page
│   │   └── signup/                  # Sign-up page
│   ├── dashboard/                   # User dashboards
│   │   ├── client/                  # Client-specific dashboard pages
│   │   └── freelancer/              # Freelancer-specific dashboard pages
│   ├── contracts/                   # Smart contract interaction page
│   ├── wallet/                      # Wallet integration page
│   └── [other pages]/               # Various application pages
├── 🔧 components/                   # React components
│   ├── auth/                        # Authentication components
│   ├── payments/                    # Payment interface components
│   ├── ui/                          # Reusable UI components (shadcn/ui)
│   ├── client-dashboard.tsx         # Client dashboard component
│   ├── freelancer-dashboard.tsx     # Freelancer dashboard component
│   └── wallet-integration.tsx       # Wallet integration component
├── 📜 contracts/                    # Smart contracts (Solidity)
│   ├── core/                        # Core platform contracts
│   │   ├── SkillPlatform.sol        # Main platform contract
│   │   └── UserRegistry.sol         # User management contract
│   ├── escrow/                      # Escrow system contracts
│   │   └── ProjectEscrow.sol        # Project escrow contract
│   ├── tokens/                      # Token contracts
│   │   └── SkillToken.sol           # Platform token contract
│   └── scripts/                     # Deployment scripts
├── 🎣 hooks/                        # Custom React hooks
│   ├── use-citrea-payments.ts       # Citrea payment integration
│   ├── use-ethereum.ts              # Ethereum wallet integration
│   └── use-toast.ts                 # Toast notifications
├── 📚 lib/                          # Utility libraries
│   ├── auth.ts                      # Authentication utilities
│   ├── contract-integration.ts      # Smart contract integration
│   ├── web3auth-config.ts           # Web3 authentication config
│   └── utils.ts                     # General utilities
├── 🏗️ artifacts/                    # Compiled contract artifacts
│   └── contracts/                   # Generated contract ABIs
├── 📖 docs/                         # Documentation
│   ├── contract-integration-guide.md
│   ├── deployment-readme.md
│   └── frontend-deployment-guide.md
├── 🎨 public/                       # Static assets
├── 🔧 scripts/                      # Build and deployment scripts
├── 🎭 types/                        # TypeScript type definitions
└── ⚙️ Configuration files           # Various config files
    ├── hardhat.config.js            # Hardhat configuration
    ├── next.config.mjs              # Next.js configuration
    ├── tailwind.config.ts           # Tailwind CSS configuration
    └── tsconfig.json                # TypeScript configuration
```

## 🚦 Getting Started

### 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MetaMask or other Web3 wallet
- Citrea testnet tokens for testing
- Hardhat for smart contract development

### 🔧 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Fmsticks2/SkillChain
   cd SkillChain
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Compile smart contracts
   ```bash
   npx hardhat compile
   ```

4. Configure environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:3000`

## 📚 Documentation

Detailed documentation is available in the `docs` directory:

- [Smart Contract Deployment Guide](./docs/smart-contract-deployment-guide.md)
- [Contract Verification Guide](./docs/contract-verification-guide.md)
- [Frontend Deployment Guide](./docs/frontend-deployment-guide.md)
- [Contract Integration Guide](./docs/contract-integration-guide.md)

## 📜 License

MIT

# Smart Contract Deployment Guide

This guide explains how to deploy the Web3 Skill Platform smart contracts to the Citrea network and verify them on the blockchain explorer.

## Prerequisites

1. Node.js (v16 or later) and npm installed
2. Git repository cloned locally
3. Dependencies installed (`npm install`)
4. `.env` file properly configured with the following variables:
   - `PRIVATE_KEY`: Your wallet's private key for deployment
   - `ETHERSCAN_API_KEY`: API key for contract verification (if available for Citrea)
   - `VERIFY_CONTRACTS`: Set to "true" to enable automatic contract verification

## Deployment Steps

### 1. Configure Environment Variables

Ensure your `.env` file is properly set up with the required variables. Never commit this file to version control.

```
PRIVATE_KEY=your_wallet_private_key_here
CITREA_API_KEY=your_citrea_api_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here  # Alternative/fallback
VERIFY_CONTRACTS=true
```

**Note:** For contract verification on the Citrea network, `CITREA_API_KEY` is preferred. The system will fall back to `ETHERSCAN_API_KEY` if `CITREA_API_KEY` is not provided.

### 2. Ensure Sufficient Funds

Make sure the wallet associated with your private key has sufficient funds (BTC) on the Citrea network for deployment gas fees.

### 3. Deploy to Citrea Testnet

Run the deployment script for the Citrea testnet:

```bash
npx hardhat run contracts/scripts/deploy-citrea.js --network citrea-testnet
```

This script will:
- Deploy all contracts (UserRegistry, SkillVerification, SkillToken, ReputationToken, ProjectEscrow, SkillPlatform)
- Set up roles and permissions between contracts
- Configure initial platform settings
- Verify contracts on the explorer (if `VERIFY_CONTRACTS=true`)

### 4. Record Contract Addresses

After successful deployment, the script will output the addresses of all deployed contracts. Update your `.env` file with these addresses:

```
NEXT_PUBLIC_TESTNET_SKILL_PLATFORM_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_USER_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_SKILL_VERIFICATION_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_PROJECT_ESCROW_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_SKILL_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_REPUTATION_TOKEN_ADDRESS=0x...
```

### 5. Update Contract Addresses in Frontend

The frontend code uses the contract addresses from the `.env` file. After updating the `.env` file, the frontend will automatically use the new contract addresses.

### 6. Deploy to Citrea Mainnet (Production)

When ready for production, deploy to the Citrea mainnet:

```bash
npx hardhat run contracts/scripts/deploy-citrea.js --network citrea-mainnet
```

Update your `.env` file with the mainnet contract addresses:

```
NEXT_PUBLIC_MAINNET_SKILL_PLATFORM_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_USER_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_SKILL_VERIFICATION_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_PROJECT_ESCROW_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_SKILL_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_REPUTATION_TOKEN_ADDRESS=0x...
```

## Contract Verification

If `VERIFY_CONTRACTS` is set to "true" in your `.env` file, the deployment script will automatically attempt to verify the contracts on the Citrea explorer.

If automatic verification fails, you can manually verify each contract using:

```bash
npx hardhat verify --network citrea-testnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Replace `<CONTRACT_ADDRESS>` with the deployed contract address and `<CONSTRUCTOR_ARGS>` with the constructor arguments used during deployment.

## Troubleshooting

### Failed Transactions

If a transaction fails during deployment:
1. Check that your wallet has sufficient funds
2. Ensure the Citrea network is operational
3. Verify that your `PRIVATE_KEY` is correct

### Verification Failures

If contract verification fails:
1. Ensure your `CITREA_API_KEY` is valid and correctly set in your `.env` file
2. If you don't have a Citrea API key, you can try using `ETHERSCAN_API_KEY` as a fallback
3. Check that the Citrea explorer supports verification
4. Verify that the contract was compiled with the same settings as the deployed version
5. Check the Citrea documentation for any specific verification requirements

### Network Connection Issues

If you encounter network connection issues:
1. Verify that the RPC URL in `hardhat.config.js` is correct
2. Check if the Citrea network is experiencing downtime
3. Try using a different RPC endpoint if available

## Post-Deployment Steps

After successful deployment:

1. Test the contracts on the testnet to ensure they function as expected
2. Update the frontend configuration with the new contract addresses
3. Document the deployment details (block numbers, transaction hashes, etc.)
4. Backup your deployment information securely
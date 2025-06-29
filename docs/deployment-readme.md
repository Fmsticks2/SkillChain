# Web3 Skill Platform Deployment Guide

This directory contains comprehensive guides for deploying the Web3 Skill Platform, including both the smart contracts and the frontend application.

## Overview

The Web3 Skill Platform is a decentralized application built on the Citrea network that connects clients and freelancers in a trustless environment. The platform consists of:

1. **Smart Contracts**: Solidity contracts deployed on the Citrea network
2. **Frontend Application**: Next.js web application deployed on Vercel

## Deployment Guides

### 1. [Smart Contract Deployment Guide](./smart-contract-deployment-guide.md)

This guide covers:
- Prerequisites for contract deployment
- Step-by-step deployment process to Citrea testnet and mainnet
- Contract verification on the blockchain explorer
- Troubleshooting common deployment issues
- Post-deployment configuration

### 2. [Contract Verification Guide](./contract-verification-guide.md)

This guide covers:
- API keys for contract verification (Citrea API Key vs Etherscan API Key)
- How to obtain API keys
- Automatic and manual verification processes
- Troubleshooting verification issues
- Best practices for contract verification

### 3. [Frontend Deployment Guide](./frontend-deployment-guide.md)

This guide covers:
- Deploying the Next.js frontend to Vercel
- Configuring environment variables in Vercel
- Setting up continuous deployment
- Custom domain configuration
- Troubleshooting deployment issues

## Environment Variables

Both the smart contracts and frontend require specific environment variables to function correctly. A `.env` file has been created at the root of the project with all necessary variables. Make sure to:

1. Fill in the values for each variable before deployment
2. Never commit the `.env` file to version control
3. Configure the same variables in your Vercel deployment

## Deployment Workflow

The recommended deployment workflow is:

1. Deploy smart contracts to testnet
2. Update `.env` with testnet contract addresses
3. Deploy frontend to Vercel preview environment
4. Test thoroughly on testnet
5. Deploy smart contracts to mainnet
6. Update `.env` with mainnet contract addresses
7. Deploy frontend to Vercel production environment

## Security Considerations

- Keep your private keys secure and never share them
- Use different keys for testnet and mainnet deployments
- Regularly rotate API keys and secrets
- Follow security best practices for smart contract deployment

## Support

If you encounter issues during deployment, please:

1. Check the troubleshooting sections in each guide
2. Review the Hardhat and Vercel documentation
3. Reach out to the development team for assistance

## Maintenance

After deployment, regular maintenance is required:

1. Monitor smart contract performance and gas usage
2. Keep dependencies updated
3. Apply security patches promptly
4. Perform regular backups of deployment information
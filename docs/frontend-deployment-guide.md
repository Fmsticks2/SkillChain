# Frontend Deployment Guide for Vercel

This guide explains how to deploy the Web3 Skill Platform frontend to Vercel, including environment variable configuration and deployment options.

## Prerequisites

1. [Vercel account](https://vercel.com/signup)
2. GitHub repository with your project code
3. Smart contracts deployed to Citrea network (see the Smart Contract Deployment Guide)
4. Environment variables ready for configuration

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Log in to your Vercel account
2. Click on "Add New..." → "Project"
3. Import your GitHub repository
4. Select the Web3 Skill Platform repository

### 2. Configure Environment Variables

Before deploying, you need to configure the environment variables in Vercel. These are the same variables from your local `.env` file, but they need to be added to Vercel's environment configuration.

1. In the Vercel project settings, navigate to the "Environment Variables" tab
2. Add the following environment variables:

#### Authentication Variables
```
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# OAuth Providers (if using)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
```

#### Contract Addresses (from your deployment)
```
# Testnet
NEXT_PUBLIC_TESTNET_SKILL_PLATFORM_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_USER_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_SKILL_VERIFICATION_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_PROJECT_ESCROW_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_SKILL_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_TESTNET_REPUTATION_TOKEN_ADDRESS=0x...

# Mainnet (if deployed)
NEXT_PUBLIC_MAINNET_SKILL_PLATFORM_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_USER_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_SKILL_VERIFICATION_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_PROJECT_ESCROW_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_SKILL_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_MAINNET_REPUTATION_TOKEN_ADDRESS=0x...
```

#### RPC URLs
```
NEXT_PUBLIC_TESTNET_RPC_URL=https://rpc-testnet.citrea.xyz
NEXT_PUBLIC_MAINNET_RPC_URL=https://rpc.citrea.xyz
```

> **Important**: Make sure all variables that need to be accessible in the browser start with `NEXT_PUBLIC_`.

### 3. Configure Build Settings

Vercel should automatically detect that this is a Next.js project, but you can verify the build settings:

1. Framework Preset: Next.js
2. Build Command: `next build`
3. Output Directory: `.next`
4. Install Command: `npm install`

### 4. Deploy the Project

1. Click "Deploy"
2. Vercel will build and deploy your project
3. Once deployment is complete, Vercel will provide you with a URL to access your deployed application

### 5. Set Up Custom Domain (Optional)

1. In your project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS settings for your domain

## Environment-Specific Deployments

### Preview Deployments

Vercel automatically creates preview deployments for pull requests. You can configure environment variables specifically for preview deployments:

1. Go to "Settings" → "Environment Variables"
2. When adding variables, select "Preview" environment
3. Add preview-specific variables (e.g., pointing to testnet contracts)

### Production vs. Development

You can configure different environment variables for different deployment environments:

1. Production: Use mainnet contract addresses and production API keys
2. Preview/Development: Use testnet contract addresses and development API keys

## Continuous Deployment

Vercel automatically deploys your application when changes are pushed to the main branch. To customize this behavior:

1. Go to "Settings" → "Git"
2. Configure production branch and ignored build step settings

## Troubleshooting

### Build Failures

If your build fails:

1. Check the build logs for specific errors
2. Ensure all dependencies are correctly installed
3. Verify that environment variables are correctly set
4. Make sure your code works locally before deploying

### Environment Variable Issues

If your application can't access environment variables:

1. Ensure variables that need to be accessible in the browser start with `NEXT_PUBLIC_`
2. Check for typos in variable names
3. Verify that the variables are set in the correct environment (Production/Preview/Development)

### Contract Connection Issues

If your application can't connect to the smart contracts:

1. Verify that the contract addresses in environment variables are correct
2. Check that the RPC URLs are accessible
3. Ensure MetaMask or other wallet providers can connect to the specified networks

## Post-Deployment Steps

1. Test the deployed application thoroughly
2. Set up monitoring and analytics
3. Configure custom error pages if needed
4. Set up a custom domain with HTTPS

## Updating Your Deployment

To update your deployment:

1. Push changes to your GitHub repository
2. Vercel will automatically build and deploy the updated version
3. If you need to update environment variables, do so in the Vercel dashboard

## Deployment Best Practices

1. Use environment variables for all configuration
2. Never commit sensitive information to your repository
3. Test your application in a preview environment before deploying to production
4. Set up proper error handling and monitoring
5. Use Vercel's preview deployments for testing changes before merging to main
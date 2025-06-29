# Contract Verification Guide for Citrea Network

## Overview

This guide explains how to verify smart contracts on the Citrea network explorer after deployment. Contract verification is an important step that allows users to view and interact with your contract's source code on the blockchain explorer.

## API Keys for Verification

### Citrea API Key (Preferred)

For verifying contracts on the Citrea network, you should use a Citrea API key. This is the preferred method for verification on Citrea's explorer.

```
CITREA_API_KEY=your_citrea_api_key_here
```

### Etherscan API Key (Alternative/Fallback)

If you don't have a Citrea API key or if the Citrea explorer uses Etherscan's verification API under the hood, you can use an Etherscan API key as a fallback.

```
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

Our configuration is set up to try the Citrea API key first, and if not available, it will fall back to using the Etherscan API key.

## How to Obtain API Keys

### Citrea API Key

To obtain a Citrea API key:

1. Visit the Citrea Explorer website
2. Create an account or log in
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the key and add it to your `.env` file

### Etherscan API Key

To obtain an Etherscan API key (as a fallback):

1. Visit [https://etherscan.io/](https://etherscan.io/)
2. Create an account or log in
3. Navigate to your account's API Keys section
4. Generate a new API key
5. Copy the key and add it to your `.env` file

## Automatic Verification

The deployment script (`deploy-citrea.js`) includes automatic verification if `VERIFY_CONTRACTS` is set to `true` in your `.env` file:

```javascript
if (process.env.VERIFY_CONTRACTS === "true") {
  console.log("\nVerifying contracts on Citrea Explorer...");
  try {
    // Verification code for each contract
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [...],
    });
  } catch (error) {
    console.error("Verification failed:", error);
  }
}
```

## Manual Verification

If automatic verification fails, you can manually verify each contract using the Hardhat verify task:

```bash
npx hardhat verify --network citrea-testnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example:

```bash
npx hardhat verify --network citrea-testnet 0x123abc... "0xDeployer"
```

## Troubleshooting Verification Issues

### API Key Issues

1. **Invalid API Key**: Ensure your API key is valid and correctly copied to your `.env` file
2. **Rate Limiting**: Some API providers have rate limits; wait and try again later
3. **Network Mismatch**: Make sure you're using the correct API key for the network you're verifying on

### Contract Issues

1. **Constructor Arguments**: Ensure you're providing the exact constructor arguments used during deployment
2. **Compiler Version**: The verification must use the same compiler version as the deployment
3. **Optimizer Settings**: Optimizer settings must match those used during deployment

### Explorer Issues

1. **Explorer Downtime**: The explorer might be experiencing issues; try again later
2. **Unsupported Features**: Some contract features might not be supported by the explorer
3. **Verification Delay**: Verification might take some time to process

## Best Practices

1. **Keep API Keys Secure**: Never commit your `.env` file to version control
2. **Verify Immediately After Deployment**: Verify contracts right after deployment when constructor arguments are fresh in memory
3. **Document Deployment Details**: Keep a record of all deployment details, including constructor arguments
4. **Use Hardhat's Built-in Verification**: The Hardhat verification plugin handles most of the complexity for you

## Conclusion

Contract verification is an essential step in the deployment process that enhances transparency and trust in your smart contracts. By following this guide, you should be able to successfully verify your contracts on the Citrea network explorer.
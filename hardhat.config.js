require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    'citrea-testnet': {
      url: 'https://rpc.testnet.citrea.xyz',
      chainId: 5115,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 'auto',
    },
    'citrea-mainnet': {
      url: 'https://rpc.mainnet.citrea.xyz', // This is a placeholder, update when mainnet is available
      chainId: 2122, // This is a placeholder, update when mainnet is available
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 'auto',
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  etherscan: {
    apiKey: process.env.CITREA_API_KEY || process.env.ETHERSCAN_API_KEY,
    // Custom config for Citrea explorer when available
    customChains: [
      {
        network: "citrea-testnet",
        chainId: 5115,
        urls: {
          apiURL: "https://explorer-api-testnet.citrea.xyz/api", // Placeholder, update when available
          browserURL: "https://explorer-testnet.citrea.xyz" // Placeholder, update when available
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
};
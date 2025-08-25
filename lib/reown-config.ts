import { createAppKit } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum, polygon } from '@reown/appkit/networks'

// 1. Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'YOUR_REOWN_PROJECT_ID'

// 2. Set up the Ethers Adapter
const ethersAdapter = new EthersAdapter()

// 3. Configure the metadata
const metadata = {
  name: 'SkillChain',
  description: 'Decentralized freelancing platform with blockchain-verified skills',
  url: 'https://skillchain.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Create the modal
export const reownModal = createAppKit({
  adapters: [ethersAdapter],
  projectId,
  networks: [mainnet, arbitrum, polygon],
  defaultNetwork: mainnet,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: true, // default to true
    socials: ['google', 'x', 'github', 'discord', 'apple'],
    emailShowWallets: true // default to true
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-color-mix': '#00DCFF',
    '--w3m-color-mix-strength': 20
  }
})

// 5. Export utility functions
export const connectWallet = async () => {
  try {
    await reownModal.open()
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    throw error
  }
}

export const disconnectWallet = async () => {
  try {
    await reownModal.disconnect()
  } catch (error) {
    console.error('Failed to disconnect wallet:', error)
    throw error
  }
}

// Note: This function should be replaced with useAppKitAccount hook in components
// This is kept for backward compatibility but will return default values
export const getWalletInfo = () => {
  return {
    isConnected: false,
    address: undefined,
    chainId: undefined,
    provider: undefined
  }
}

// Export the modal for hook usage
export { reownModal as appKit }
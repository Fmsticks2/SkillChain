import { Web3Auth } from '@web3auth/modal'
import { Web3AuthOptions } from '@web3auth/modal'
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS, WEB3AUTH_NETWORK } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || 'YOUR_WEB3AUTH_CLIENT_ID'

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x1', // Ethereum Mainnet
  rpcTarget: 'https://rpc.ankr.com/eth',
  displayName: 'Ethereum Mainnet',
  blockExplorerUrl: 'https://etherscan.io',
  ticker: 'ETH',
  tickerName: 'Ethereum',
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

// Attach currentChain to satisfy IBaseProvider requirement expected by downstream types
;(privateKeyProvider as any).currentChain = chainConfig

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider: privateKeyProvider as any,
  uiConfig: {
    appName: 'SkillChain',
    mode: 'dark',
    logoLight: 'https://web3auth.io/images/web3authlog.png',
    logoDark: 'https://web3auth.io/images/web3authlogodark.png',
    defaultLanguage: 'en',
    theme: {
      primary: '#768729',
    },
  },
}

const openloginAdapter = new OpenloginAdapter({
  adapterSettings: {
    uxMode: 'popup',
    whiteLabel: {
      appName: 'SkillChain',
      logoLight: 'https://web3auth.io/images/web3authlog.png',
      logoDark: 'https://web3auth.io/images/web3authlogodark.png',
      defaultLanguage: 'en',
      mode: 'dark',
    },
  },
  loginSettings: {
    mfaLevel: 'optional',
  },
  privateKeyProvider: privateKeyProvider as any,
})

export class Web3AuthService {
  private web3auth: Web3Auth | null = null
  private provider: IProvider | null = null

  async init(): Promise<void> {
    try {
      this.web3auth = new Web3Auth(web3AuthOptions)
      // Note: configureAdapter is only available in Web3AuthNoModal
      // For Web3Auth modal, adapters are configured automatically
      await this.web3auth.init()
    } catch (error) {
      console.error('Web3Auth initialization failed:', error)
      throw error
    }
  }

  async login(loginProvider?: string): Promise<{ provider: IProvider; userInfo: any }> {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized')
    }

    try {
      // For Web3Auth Modal, connect does not accept provider arguments
      const provider = await this.web3auth.connect()
      this.provider = provider
      const userInfo = await this.web3auth.getUserInfo()
      return { provider: provider as IProvider, userInfo }
    } catch (error) {
      console.error('Web3Auth login failed:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    if (!this.web3auth) return
    try {
      await this.web3auth.logout()
      this.provider = null
    } catch (error) {
      console.error('Web3Auth logout failed:', error)
      throw error
    }
  }

  async getUserInfo(): Promise<any> {
    if (!this.web3auth) throw new Error('Web3Auth not initialized')
    try {
      return await this.web3auth.getUserInfo()
    } catch (error) {
      console.error('Failed to get user info:', error)
      throw error
    }
  }

  getProvider(): IProvider | null {
    return this.provider
  }

  isConnected(): boolean {
    return !!this.provider
  }
}

export const web3AuthService = new Web3AuthService()
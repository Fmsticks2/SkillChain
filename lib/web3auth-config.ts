import { Web3Auth } from '@web3auth/modal'
import { Web3AuthOptions } from '@web3auth/modal'
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || 'YOUR_WEB3AUTH_CLIENT_ID'

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: '0x1', // Ethereum Mainnet
  rpcTarget: 'https://rpc.ankr.com/eth',
  displayName: 'Ethereum Mainnet',
  blockExplorerUrl: 'https://etherscan.io/',
  ticker: 'ETH',
  tickerName: 'Ethereum',
  logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})

const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: 'sapphire_mainnet', // Use 'testnet' for testing
  chainConfig,
  privateKeyProvider,
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
  privateKeyProvider,
})

export class Web3AuthService {
  private web3auth: Web3Auth | null = null
  private provider: IProvider | null = null

  async init(): Promise<void> {
    try {
      this.web3auth = new Web3Auth(web3AuthOptions)
      this.web3auth.configureAdapter(openloginAdapter)
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
      this.provider = await this.web3auth.connect({
        verifier: loginProvider || 'google',
      })
      
      if (!this.provider) {
        throw new Error('Failed to connect to Web3Auth')
      }

      const userInfo = await this.web3auth.getUserInfo()
      return { provider: this.provider, userInfo }
    } catch (error) {
      console.error('Web3Auth login failed:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized')
    }

    try {
      await this.web3auth.logout()
      this.provider = null
    } catch (error) {
      console.error('Web3Auth logout failed:', error)
      throw error
    }
  }

  async getUserInfo(): Promise<any> {
    if (!this.web3auth) {
      throw new Error('Web3Auth not initialized')
    }

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
    return this.web3auth?.status === 'connected'
  }
}

export const web3AuthService = new Web3AuthService()
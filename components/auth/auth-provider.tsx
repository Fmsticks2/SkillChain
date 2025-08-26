"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { web3AuthService } from '@/lib/web3auth-config'
import { reownModal } from '@/lib/reown-config'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { IProvider } from '@web3auth/base'

interface AuthContextType {
  // Web3Auth state
  isWeb3AuthConnected: boolean
  web3AuthProvider: IProvider | null
  web3AuthUserInfo: any
  
  // Reown wallet state
  isWalletConnected: boolean
  walletAddress: string | null
  walletChainId: number | null
  
  // Auth methods
  loginWithSocial: (provider: string) => Promise<void>
  loginWithWallet: () => Promise<void>
  logout: () => Promise<void>
  
  // Loading states
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isWeb3AuthConnected, setIsWeb3AuthConnected] = useState(false)
  const [web3AuthProvider, setWeb3AuthProvider] = useState<IProvider | null>(null)
  const [web3AuthUserInfo, setWeb3AuthUserInfo] = useState(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Use AppKit hooks for wallet connection state
  const { address, isConnected: isWalletConnected } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  
  // Convert to expected types
  const walletAddress = address ?? null
  const walletChainId = chainId ? Number(chainId) : null

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      
      // Check if Web3Auth client ID is configured
      const web3AuthClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
      const reownProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
      
      if (!web3AuthClientId || web3AuthClientId === 'your_web3auth_client_id_here') {
        console.warn('Web3Auth client ID not configured. Social login will be disabled.')
      } else {
        try {
          // Initialize Web3Auth only if properly configured
          await web3AuthService.init()
          
          // Check if Web3Auth is already connected
          if (web3AuthService.isConnected()) {
            const userInfo = await web3AuthService.getUserInfo()
            const provider = web3AuthService.getProvider()
            setIsWeb3AuthConnected(true)
            setWeb3AuthProvider(provider)
            setWeb3AuthUserInfo(userInfo)
          }
        } catch (web3AuthError) {
          console.error('Web3Auth initialization failed:', web3AuthError)
          // Don't set error for Web3Auth failure, just log it
        }
      }
      
      if (!reownProjectId || reownProjectId === 'your_reown_project_id_here') {
        console.warn('Reown project ID not configured. Wallet connection may not work properly.')
      }
      
      // Wallet connection status will be handled by useAppKitAccount hook
      // This will be updated in the component body
      
    } catch (err) {
      console.error('Auth initialization failed:', err)
      setError('Authentication services are not properly configured. Please check your environment variables.')
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithSocial = async (provider: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const web3AuthClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID
      if (!web3AuthClientId || web3AuthClientId === 'your_web3auth_client_id_here') {
        throw new Error('Social login is not configured. Please set up Web3Auth client ID.')
      }
      
      const { provider: web3Provider, userInfo } = await web3AuthService.login(provider)
      
      setIsWeb3AuthConnected(true)
      setWeb3AuthProvider(web3Provider)
      setWeb3AuthUserInfo(userInfo)
      
    } catch (err) {
      console.error('Social login failed:', err)
      setError(err instanceof Error ? err.message : 'Social login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithWallet = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const reownProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
      if (!reownProjectId || reownProjectId === 'your_reown_project_id_here') {
        throw new Error('Wallet connection is not configured. Please set up Reown project ID.')
      }
      
      await reownModal.open()
      
      // Connection state will be updated automatically by useAppKitAccount hook
      
    } catch (err) {
      console.error('Wallet connection failed:', err)
      setError(err instanceof Error ? err.message : 'Wallet connection failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      
      // Logout from Web3Auth if connected
      if (isWeb3AuthConnected) {
        await web3AuthService.logout()
        setIsWeb3AuthConnected(false)
        setWeb3AuthProvider(null)
        setWeb3AuthUserInfo(null)
      }
      
      // Disconnect wallet if connected
      if (isWalletConnected) {
        await reownModal.disconnect()
      }
      
    } catch (err) {
      console.error('Logout failed:', err)
      setError('Logout failed')
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    isWeb3AuthConnected,
    web3AuthProvider,
    web3AuthUserInfo,
    isWalletConnected,
    walletAddress,
    walletChainId,
    loginWithSocial,
    loginWithWallet,
    logout,
    isLoading,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
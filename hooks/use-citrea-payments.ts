import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useEthereum } from './use-ethereum'

// Contract ABI for CitreaPaymentManager (simplified for key functions)
const CITREA_PAYMENT_MANAGER_ABI = [
  // Payment functions
  'function createPayment(address payee, uint256 amount, address token, string metadata) external payable returns (uint256)',
  'function completePayment(uint256 paymentId) external',
  
  // Withdrawal functions
  'function requestWithdrawal(uint256 amount, address token, string destinationAddress) external returns (uint256)',
  'function getUserBalance(address user, address token) external view returns (uint256)',
  
  // Escrow functions
  'function createMilestoneEscrow(uint256 projectId, address freelancer, uint256[] milestoneAmounts, address token) external payable returns (uint256)',
  'function releaseMilestone(uint256 escrowId, uint256 milestoneIndex) external',
  
  // View functions
  'function payments(uint256) external view returns (uint256, address, address, uint256, address, uint8, uint256, uint256, string)',
  'function withdrawals(uint256) external view returns (uint256, address, uint256, address, uint8, uint256, uint256, string)',
  'function milestoneEscrows(uint256) external view returns (uint256, uint256, address, address, uint256, uint256, address, bool)',
  'function getUserPayments(address user) external view returns (uint256[])',
  'function getUserWithdrawals(address user) external view returns (uint256[])',
  'function getUserEscrows(address user) external view returns (uint256[])',
  
  // Configuration
  'function supportedTokens(address) external view returns (bool)',
  'function platformFeeRate() external view returns (uint256)',
  'function minimumWithdrawalAmount() external view returns (uint256)',
  
  // Events
  'event PaymentCreated(uint256 indexed paymentId, address indexed payer, address indexed payee, uint256 amount, address token)',
  'event PaymentCompleted(uint256 indexed paymentId, uint256 completedAt)',
  'event WithdrawalRequested(uint256 indexed withdrawalId, address indexed user, uint256 amount, address token, string destinationAddress)',
  'event WithdrawalCompleted(uint256 indexed withdrawalId, uint256 completedAt)',
  'event MilestoneEscrowCreated(uint256 indexed escrowId, uint256 indexed projectId, address indexed client, address freelancer, uint256 totalAmount)',
  'event MilestoneReleased(uint256 indexed escrowId, uint256 milestoneIndex, uint256 amount)',
  'event BalanceDeposited(address indexed user, uint256 amount, address token)',
  'event BalanceWithdrawn(address indexed user, uint256 amount, address token)'
]

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  'citrea-testnet': '0x0000000000000000000000000000000000000000', // To be updated after deployment
  'citrea-mainnet': '0x0000000000000000000000000000000000000000', // To be updated after deployment
  'localhost': '0x0000000000000000000000000000000000000000' // For local development
}

// Supported tokens
const SUPPORTED_TOKENS = {
  BTC: '0x0000000000000000000000000000000000000000', // Native BTC
  USDC: '0x0000000000000000000000000000000000000000', // To be updated with actual USDC address
  SKILL: '0x0000000000000000000000000000000000000000' // To be updated with actual SKILL token address
}

export interface Payment {
  id: string
  payer: string
  payee: string
  amount: string
  token: string
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed'
  createdAt: number
  completedAt: number
  metadata: string
}

export interface Withdrawal {
  id: string
  user: string
  amount: string
  token: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  requestedAt: number
  processedAt: number
  destinationAddress: string
}

export interface MilestoneEscrow {
  id: string
  projectId: string
  client: string
  freelancer: string
  totalAmount: string
  releasedAmount: string
  token: string
  isActive: boolean
  createdAt: number
}

export interface UserBalance {
  btc: string
  usdc: string
  skill: string
}

export function useCitreaPayments() {
  const { ethereum, currentAccount, chainId } = useEthereum()
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userBalance, setUserBalance] = useState<UserBalance>({ btc: '0', usdc: '0', skill: '0' })
  const [payments, setPayments] = useState<Payment[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [escrows, setEscrows] = useState<MilestoneEscrow[]>([])

  // Initialize contract
  useEffect(() => {
    if (ethereum && chainId) {
      const networkName = getNetworkName(chainId ? parseInt(chainId, 16) : 1)
      const contractAddress = CONTRACT_ADDRESSES[networkName as keyof typeof CONTRACT_ADDRESSES]
      
      if (contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
        const provider = new ethers.BrowserProvider(ethereum)
        provider.getSigner().then(signerInstance => {
          setSigner(signerInstance)
          const contractInstance = new ethers.Contract(
            contractAddress,
            CITREA_PAYMENT_MANAGER_ABI,
            signerInstance
          )
          setContract(contractInstance)
        })
      }
    }
  }, [ethereum, chainId])

  // Load user data when account changes
  useEffect(() => {
    if (contract && currentAccount) {
      loadUserData()
    }
  }, [contract, currentAccount])

  const getNetworkName = (chainId: number): string => {
    switch (chainId) {
      case 5115:
        return 'citrea-testnet'
      case 2122:
        return 'citrea-mainnet'
      case 31337:
        return 'localhost'
      default:
        return 'unknown'
    }
  }

  const loadUserData = useCallback(async () => {
    if (!contract || !currentAccount) return

    try {
      setIsLoading(true)
      setError(null)

      // Load user balances
      const [btcBalance, usdcBalance, skillBalance] = await Promise.all([
        contract.getUserBalance(currentAccount, SUPPORTED_TOKENS.BTC),
        contract.getUserBalance(currentAccount, SUPPORTED_TOKENS.USDC),
        contract.getUserBalance(currentAccount, SUPPORTED_TOKENS.SKILL)
      ])

      setUserBalance({
        btc: ethers.formatEther(btcBalance),
        usdc: ethers.formatUnits(usdcBalance, 6), // USDC has 6 decimals
        skill: ethers.formatEther(skillBalance)
      })

      // Load user payments
      const paymentIds = await contract.getUserPayments(currentAccount)
      const paymentPromises = paymentIds.map(async (id: bigint) => {
        const paymentData = await contract.payments(id)
        return {
          id: id.toString(),
          payer: paymentData[1],
          payee: paymentData[2],
          amount: ethers.formatEther(paymentData[3]),
          token: paymentData[4],
          status: getPaymentStatus(paymentData[5]),
          createdAt: Number(paymentData[6]),
          completedAt: Number(paymentData[7]),
          metadata: paymentData[8]
        }
      })
      const paymentsData = await Promise.all(paymentPromises)
      setPayments(paymentsData)

      // Load user withdrawals
      const withdrawalIds = await contract.getUserWithdrawals(currentAccount)
      const withdrawalPromises = withdrawalIds.map(async (id: bigint) => {
        const withdrawalData = await contract.withdrawals(id)
        return {
          id: id.toString(),
          user: withdrawalData[1],
          amount: ethers.formatEther(withdrawalData[2]),
          token: withdrawalData[3],
          status: getWithdrawalStatus(withdrawalData[4]),
          requestedAt: Number(withdrawalData[5]),
          processedAt: Number(withdrawalData[6]),
          destinationAddress: withdrawalData[7]
        }
      })
      const withdrawalsData = await Promise.all(withdrawalPromises)
      setWithdrawals(withdrawalsData)

      // Load user escrows
      const escrowIds = await contract.getUserEscrows(currentAccount)
      const escrowPromises = escrowIds.map(async (id: bigint) => {
        const escrowData = await contract.milestoneEscrows(id)
        return {
          id: id.toString(),
          projectId: escrowData[1].toString(),
          client: escrowData[2],
          freelancer: escrowData[3],
          totalAmount: ethers.formatEther(escrowData[4]),
          releasedAmount: ethers.formatEther(escrowData[5]),
          token: escrowData[6],
          isActive: escrowData[7],
          createdAt: Date.now() // This would need to be stored in the contract
        }
      })
      const escrowsData = await Promise.all(escrowPromises)
      setEscrows(escrowsData)

    } catch (err) {
      console.error('Error loading user data:', err)
      setError('Failed to load user data')
    } finally {
      setIsLoading(false)
    }
  }, [contract, currentAccount])

  const getPaymentStatus = (status: number): Payment['status'] => {
    switch (status) {
      case 0: return 'pending'
      case 1: return 'completed'
      case 2: return 'failed'
      case 3: return 'refunded'
      case 4: return 'disputed'
      default: return 'pending'
    }
  }

  const getWithdrawalStatus = (status: number): Withdrawal['status'] => {
    switch (status) {
      case 0: return 'pending'
      case 1: return 'processing'
      case 2: return 'completed'
      case 3: return 'failed'
      default: return 'pending'
    }
  }

  const createPayment = useCallback(async (
    payee: string,
    amount: string,
    token: 'BTC' | 'USDC' | 'SKILL',
    metadata: string = ''
  ) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected')
    }

    try {
      setIsLoading(true)
      setError(null)

      const tokenAddress = SUPPORTED_TOKENS[token]
      const amountWei = token === 'USDC' 
        ? ethers.parseUnits(amount, 6)
        : ethers.parseEther(amount)

      const tx = token === 'BTC'
        ? await contract.createPayment(payee, amountWei, tokenAddress, metadata, { value: amountWei })
        : await contract.createPayment(payee, amountWei, tokenAddress, metadata)

      const receipt = await tx.wait()
      
      // Reload user data after successful transaction
      await loadUserData()
      
      return receipt
    } catch (err) {
      console.error('Error creating payment:', err)
      setError('Failed to create payment')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [contract, signer, loadUserData])

  const completePayment = useCallback(async (paymentId: string) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected')
    }

    try {
      setIsLoading(true)
      setError(null)

      const tx = await contract.completePayment(paymentId)
      const receipt = await tx.wait()
      
      // Reload user data after successful transaction
      await loadUserData()
      
      return receipt
    } catch (err) {
      console.error('Error completing payment:', err)
      setError('Failed to complete payment')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [contract, signer, loadUserData])

  const requestWithdrawal = useCallback(async (
    amount: string,
    token: 'BTC' | 'USDC' | 'SKILL',
    destinationAddress: string
  ) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected')
    }

    try {
      setIsLoading(true)
      setError(null)

      const tokenAddress = SUPPORTED_TOKENS[token]
      const amountWei = token === 'USDC' 
        ? ethers.parseUnits(amount, 6)
        : ethers.parseEther(amount)

      const tx = await contract.requestWithdrawal(amountWei, tokenAddress, destinationAddress)
      const receipt = await tx.wait()
      
      // Reload user data after successful transaction
      await loadUserData()
      
      return receipt
    } catch (err) {
      console.error('Error requesting withdrawal:', err)
      setError('Failed to request withdrawal')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [contract, signer, loadUserData])

  const createMilestoneEscrow = useCallback(async (
    projectId: string,
    freelancer: string,
    milestoneAmounts: string[],
    token: 'BTC' | 'USDC' | 'SKILL'
  ) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected')
    }

    try {
      setIsLoading(true)
      setError(null)

      const tokenAddress = SUPPORTED_TOKENS[token]
      const amountsWei = milestoneAmounts.map(amount => 
        token === 'USDC' 
          ? ethers.parseUnits(amount, 6)
          : ethers.parseEther(amount)
      )
      
      const totalAmount = amountsWei.reduce((sum, amount) => sum + amount, BigInt(0))

      const tx = token === 'BTC'
        ? await contract.createMilestoneEscrow(projectId, freelancer, amountsWei, tokenAddress, { value: totalAmount })
        : await contract.createMilestoneEscrow(projectId, freelancer, amountsWei, tokenAddress)

      const receipt = await tx.wait()
      
      // Reload user data after successful transaction
      await loadUserData()
      
      return receipt
    } catch (err) {
      console.error('Error creating milestone escrow:', err)
      setError('Failed to create milestone escrow')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [contract, signer, loadUserData])

  const releaseMilestone = useCallback(async (escrowId: string, milestoneIndex: number) => {
    if (!contract || !signer) {
      throw new Error('Contract not initialized or wallet not connected')
    }

    try {
      setIsLoading(true)
      setError(null)

      const tx = await contract.releaseMilestone(escrowId, milestoneIndex)
      const receipt = await tx.wait()
      
      // Reload user data after successful transaction
      await loadUserData()
      
      return receipt
    } catch (err) {
      console.error('Error releasing milestone:', err)
      setError('Failed to release milestone')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [contract, signer, loadUserData])

  const refreshData = useCallback(() => {
    if (contract && currentAccount) {
      return loadUserData()
    }
  }, [contract, currentAccount, loadUserData])

  return {
    // State
    isLoading,
    error,
    userBalance,
    payments,
    withdrawals,
    escrows,
    contract,
    
    // Actions
    createPayment,
    completePayment,
    requestWithdrawal,
    createMilestoneEscrow,
    releaseMilestone,
    refreshData,
    
    // Utils
    supportedTokens: SUPPORTED_TOKENS,
    isContractReady: !!contract
  }
}
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import {
  Wallet,
  Send,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Bitcoin,
  Coins,
  Shield,
  Lock,
  Unlock,
  Eye,
  Copy,
  ExternalLink,
  Plus,
  Minus
} from "lucide-react"

interface PaymentInterfaceProps {
  userAddress?: string
  userBalance?: {
    btc: number
    usdc: number
    skill: number
  }
}

interface Payment {
  id: string
  type: 'sent' | 'received'
  amount: number
  token: 'BTC' | 'USDC' | 'SKILL'
  counterparty: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  timestamp: string
  txHash?: string
  metadata?: string
}

interface Withdrawal {
  id: string
  amount: number
  token: 'BTC' | 'USDC' | 'SKILL'
  destinationAddress: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  requestedAt: string
  processedAt?: string
}

interface MilestoneEscrow {
  id: string
  projectId: string
  projectName: string
  totalAmount: number
  releasedAmount: number
  token: 'BTC' | 'USDC' | 'SKILL'
  milestones: {
    amount: number
    description: string
    completed: boolean
  }[]
  client: string
  freelancer: string
  isActive: boolean
}

const mockPayments: Payment[] = [
  {
    id: '1',
    type: 'received',
    amount: 2500,
    token: 'USDC',
    counterparty: '0x1234...5678',
    status: 'completed',
    timestamp: '2 hours ago',
    txHash: '0xabcd...efgh',
    metadata: 'Project payment for DeFi Dashboard'
  },
  {
    id: '2',
    type: 'sent',
    amount: 0.05,
    token: 'BTC',
    counterparty: '0x2345...6789',
    status: 'pending',
    timestamp: '1 day ago',
    metadata: 'Payment for smart contract audit'
  }
]

const mockWithdrawals: Withdrawal[] = [
  {
    id: '1',
    amount: 0.1,
    token: 'BTC',
    destinationAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    status: 'completed',
    requestedAt: '3 days ago',
    processedAt: '2 days ago'
  },
  {
    id: '2',
    amount: 1000,
    token: 'USDC',
    destinationAddress: '0x742d35Cc6634C0532925a3b8D4C9db96DfbF3b6C',
    status: 'processing',
    requestedAt: '1 day ago'
  }
]

const mockEscrows: MilestoneEscrow[] = [
  {
    id: '1',
    projectId: 'proj_001',
    projectName: 'DeFi Dashboard Redesign',
    totalAmount: 8500,
    releasedAmount: 6375,
    token: 'USDC',
    milestones: [
      { amount: 2125, description: 'UI/UX Design', completed: true },
      { amount: 2125, description: 'Frontend Development', completed: true },
      { amount: 2125, description: 'Backend Integration', completed: true },
      { amount: 2125, description: 'Testing & Deployment', completed: false }
    ],
    client: '0x1234...5678',
    freelancer: '0x9876...5432',
    isActive: true
  }
]

const supportedTokens = [
  { symbol: 'BTC', name: 'Bitcoin', icon: Bitcoin },
  { symbol: 'USDC', name: 'USD Coin', icon: Coins },
  { symbol: 'SKILL', name: 'Skill Token', icon: Coins }
]

export function PaymentInterface({ userAddress, userBalance }: PaymentInterfaceProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(mockWithdrawals)
  const [escrows, setEscrows] = useState<MilestoneEscrow[]>(mockEscrows)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    recipient: '',
    amount: '',
    token: 'USDC',
    metadata: ''
  })

  // Withdrawal form state
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    token: 'BTC',
    destinationAddress: ''
  })

  // Escrow form state
  const [escrowForm, setEscrowForm] = useState({
    projectId: '',
    freelancer: '',
    token: 'USDC',
    milestones: [{ amount: '', description: '' }]
  })

  const handleSendPayment = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to create payment
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newPayment: Payment = {
        id: Date.now().toString(),
        type: 'sent',
        amount: parseFloat(paymentForm.amount),
        token: paymentForm.token as 'BTC' | 'USDC' | 'SKILL',
        counterparty: paymentForm.recipient,
        status: 'pending',
        timestamp: 'Just now',
        metadata: paymentForm.metadata
      }
      
      setPayments(prev => [newPayment, ...prev])
      setPaymentForm({ recipient: '', amount: '', token: 'USDC', metadata: '' })
      
      toast({
        title: "Payment Sent",
        description: "Your payment has been submitted and is being processed."
      })
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRequestWithdrawal = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to request withdrawal
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newWithdrawal: Withdrawal = {
        id: Date.now().toString(),
        amount: parseFloat(withdrawalForm.amount),
        token: withdrawalForm.token as 'BTC' | 'USDC' | 'SKILL',
        destinationAddress: withdrawalForm.destinationAddress,
        status: 'pending',
        requestedAt: 'Just now'
      }
      
      setWithdrawals(prev => [newWithdrawal, ...prev])
      setWithdrawalForm({ amount: '', token: 'BTC', destinationAddress: '' })
      
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted for processing."
      })
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal request.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEscrow = async () => {
    setIsLoading(true)
    try {
      // Simulate API call to create escrow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const totalAmount = escrowForm.milestones.reduce((sum, milestone) => 
        sum + parseFloat(milestone.amount || '0'), 0
      )
      
      const newEscrow: MilestoneEscrow = {
        id: Date.now().toString(),
        projectId: escrowForm.projectId,
        projectName: `Project ${escrowForm.projectId}`,
        totalAmount,
        releasedAmount: 0,
        token: escrowForm.token as 'BTC' | 'USDC' | 'SKILL',
        milestones: escrowForm.milestones.map(m => ({
          amount: parseFloat(m.amount),
          description: m.description,
          completed: false
        })),
        client: userAddress || '0x0000...0000',
        freelancer: escrowForm.freelancer,
        isActive: true
      }
      
      setEscrows(prev => [newEscrow, ...prev])
      setEscrowForm({
        projectId: '',
        freelancer: '',
        token: 'USDC',
        milestones: [{ amount: '', description: '' }]
      })
      
      toast({
        title: "Escrow Created",
        description: "Milestone-based escrow has been created successfully."
      })
    } catch (error) {
      toast({
        title: "Escrow Creation Failed",
        description: "There was an error creating the escrow.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addMilestone = () => {
    setEscrowForm(prev => ({
      ...prev,
      milestones: [...prev.milestones, { amount: '', description: '' }]
    }))
  }

  const removeMilestone = (index: number) => {
    setEscrowForm(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  const updateMilestone = (index: number, field: 'amount' | 'description', value: string) => {
    setEscrowForm(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'refunded':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Center</h1>
          <p className="text-slate-400">Manage your payments, withdrawals, and escrow contracts on Citrea network</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-900 border-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">Overview</TabsTrigger>
            <TabsTrigger value="send" className="data-[state=active]:bg-slate-800">Send Payment</TabsTrigger>
            <TabsTrigger value="withdraw" className="data-[state=active]:bg-slate-800">Withdraw</TabsTrigger>
            <TabsTrigger value="escrow" className="data-[state=active]:bg-slate-800">Escrow</TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-slate-800">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {supportedTokens.map((token) => {
                const balance = userBalance?.[token.symbol.toLowerCase() as keyof typeof userBalance] || 0
                const Icon = token.icon
                return (
                  <Card key={token.symbol} className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">{token.name}</CardTitle>
                      <Icon className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {balance.toLocaleString()} {token.symbol}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Available for withdrawal
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Recent Activity */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-slate-400">
                  Your latest payments and transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {payment.type === 'sent' ? (
                          <ArrowUpRight className="h-5 w-5 text-red-400" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-green-400" />
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {payment.type === 'sent' ? 'Sent to' : 'Received from'} {payment.counterparty}
                          </p>
                          <p className="text-slate-400 text-sm">{payment.timestamp}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {payment.amount} {payment.token}
                        </p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="send" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Send Payment</CardTitle>
                <CardDescription className="text-slate-400">
                  Send payments directly to other users on Citrea network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient" className="text-white">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={paymentForm.recipient}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, recipient: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="token" className="text-white">Token</Label>
                    <Select value={paymentForm.token} onValueChange={(value) => setPaymentForm(prev => ({ ...prev, token: value }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {supportedTokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                            {token.name} ({token.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metadata" className="text-white">Description (Optional)</Label>
                  <Textarea
                    id="metadata"
                    placeholder="Payment description..."
                    value={paymentForm.metadata}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, metadata: e.target.value }))}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button 
                  onClick={handleSendPayment} 
                  disabled={isLoading || !paymentForm.recipient || !paymentForm.amount}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Payment
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Withdrawal Form */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Request Withdrawal</CardTitle>
                  <CardDescription className="text-slate-400">
                    Withdraw funds to your external wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-token" className="text-white">Token</Label>
                    <Select value={withdrawalForm.token} onValueChange={(value) => setWithdrawalForm(prev => ({ ...prev, token: value }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {supportedTokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                            {token.name} ({token.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="withdraw-amount" className="text-white">Amount</Label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawalForm.amount}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-white">Destination Address</Label>
                    <Input
                      id="destination"
                      placeholder={withdrawalForm.token === 'BTC' ? 'bc1q...' : '0x...'}
                      value={withdrawalForm.destinationAddress}
                      onChange={(e) => setWithdrawalForm(prev => ({ ...prev, destinationAddress: e.target.value }))}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <Button 
                    onClick={handleRequestWithdrawal} 
                    disabled={isLoading || !withdrawalForm.amount || !withdrawalForm.destinationAddress}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Request Withdrawal
                  </Button>
                </CardContent>
              </Card>

              {/* Withdrawal History */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Withdrawal History</CardTitle>
                  <CardDescription className="text-slate-400">
                    Track your withdrawal requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {withdrawals.map((withdrawal) => (
                      <div key={withdrawal.id} className="p-4 bg-slate-800 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Download className="h-4 w-4 text-slate-400" />
                            <span className="text-white font-medium">
                              {withdrawal.amount} {withdrawal.token}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(withdrawal.status)}
                            <Badge className={getStatusColor(withdrawal.status)}>
                              {withdrawal.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mb-1">
                          To: {withdrawal.destinationAddress.slice(0, 20)}...
                        </p>
                        <p className="text-slate-400 text-sm">
                          Requested: {withdrawal.requestedAt}
                        </p>
                        {withdrawal.processedAt && (
                          <p className="text-slate-400 text-sm">
                            Processed: {withdrawal.processedAt}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="escrow" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Escrow Form */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Create Milestone Escrow</CardTitle>
                  <CardDescription className="text-slate-400">
                    Set up milestone-based payments for projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-id" className="text-white">Project ID</Label>
                      <Input
                        id="project-id"
                        placeholder="proj_001"
                        value={escrowForm.projectId}
                        onChange={(e) => setEscrowForm(prev => ({ ...prev, projectId: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freelancer" className="text-white">Freelancer Address</Label>
                      <Input
                        id="freelancer"
                        placeholder="0x..."
                        value={escrowForm.freelancer}
                        onChange={(e) => setEscrowForm(prev => ({ ...prev, freelancer: e.target.value }))}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="escrow-token" className="text-white">Payment Token</Label>
                    <Select value={escrowForm.token} onValueChange={(value) => setEscrowForm(prev => ({ ...prev, token: value }))}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {supportedTokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                            {token.name} ({token.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Milestones</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMilestone}
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Milestone
                      </Button>
                    </div>
                    
                    {escrowForm.milestones.map((milestone, index) => (
                      <div key={index} className="p-4 bg-slate-800 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">Milestone {index + 1}</span>
                          {escrowForm.milestones.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMilestone(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={milestone.amount}
                            onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                          <Input
                            placeholder="Description"
                            value={milestone.description}
                            onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                            className="bg-slate-700 border-slate-600 text-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={handleCreateEscrow} 
                    disabled={isLoading || !escrowForm.projectId || !escrowForm.freelancer || escrowForm.milestones.some(m => !m.amount || !m.description)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    Create Escrow
                  </Button>
                </CardContent>
              </Card>

              {/* Active Escrows */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">Active Escrows</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage your milestone-based payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escrows.filter(escrow => escrow.isActive).map((escrow) => {
                      const progress = (escrow.releasedAmount / escrow.totalAmount) * 100
                      const completedMilestones = escrow.milestones.filter(m => m.completed).length
                      
                      return (
                        <div key={escrow.id} className="p-4 bg-slate-800 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-white font-medium">{escrow.projectName}</h4>
                              <p className="text-slate-400 text-sm">ID: {escrow.projectId}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">
                              Active
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-400">Progress</span>
                              <span className="text-white">
                                {completedMilestones}/{escrow.milestones.length} milestones
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Released</span>
                            <span className="text-white">
                              {escrow.releasedAmount} / {escrow.totalAmount} {escrow.token}
                            </span>
                          </div>
                          
                          <div className="mt-3 space-y-2">
                            {escrow.milestones.map((milestone, index) => (
                              <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  {milestone.completed ? (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-slate-400" />
                                  )}
                                  <span className={milestone.completed ? 'text-green-400' : 'text-slate-400'}>
                                    {milestone.description}
                                  </span>
                                </div>
                                <span className={milestone.completed ? 'text-green-400' : 'text-slate-400'}>
                                  {milestone.amount} {escrow.token}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Transaction History</CardTitle>
                <CardDescription className="text-slate-400">
                  Complete history of all your payments and transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {payment.type === 'sent' ? (
                          <ArrowUpRight className="h-5 w-5 text-red-400" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-green-400" />
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {payment.type === 'sent' ? 'Sent to' : 'Received from'} {payment.counterparty}
                          </p>
                          <p className="text-slate-400 text-sm">{payment.timestamp}</p>
                          {payment.metadata && (
                            <p className="text-slate-500 text-sm">{payment.metadata}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">
                          {payment.amount} {payment.token}
                        </p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                        {payment.txHash && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-slate-400 hover:text-white"
                              onClick={() => navigator.clipboard.writeText(payment.txHash!)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-slate-400 hover:text-white"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
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
import { useCitreaPayments } from "@/hooks/use-citrea-payments"
import { useEthereum } from "@/hooks/use-ethereum"
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

// Using interfaces from the useCitreaPayments hook

const supportedTokens = [
  { symbol: 'BTC', name: 'Bitcoin', icon: Bitcoin },
  { symbol: 'USDC', name: 'USD Coin', icon: Coins },
  { symbol: 'SKILL', name: 'Skill Token', icon: Coins }
]

export function PaymentInterface({ userAddress, userBalance }: PaymentInterfaceProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const { toast } = useToast()
  const { currentAccount } = useEthereum()
  const {
    isLoading,
    error,
    userBalance: cryptoBalance,
    payments,
    withdrawals,
    escrows,
    createPayment,
    requestWithdrawal,
    createMilestoneEscrow,
    refreshData,
    isContractReady
  } = useCitreaPayments()

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
    if (!currentAccount) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send payments.",
        variant: "destructive"
      })
      return
    }

    try {
      await createPayment(
        paymentForm.recipient,
        paymentForm.amount,
        paymentForm.token as 'BTC' | 'USDC' | 'SKILL',
        paymentForm.metadata
      )
      
      setPaymentForm({ recipient: '', amount: '', token: 'USDC', metadata: '' })
      
      toast({
        title: "Payment Sent",
        description: "Your payment has been submitted and is being processed."
      })
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive"
      })
    }
  }

  const handleRequestWithdrawal = async () => {
    if (!currentAccount) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to request withdrawals.",
        variant: "destructive"
      })
      return
    }

    try {
      await requestWithdrawal(
        withdrawalForm.amount,
        withdrawalForm.token as 'BTC' | 'USDC' | 'SKILL',
        withdrawalForm.destinationAddress
      )
      
      setWithdrawalForm({ amount: '', token: 'BTC', destinationAddress: '' })
      
      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted for processing."
      })
    } catch (error) {
      console.error('Withdrawal error:', error)
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal request.",
        variant: "destructive"
      })
    }
  }

  const handleCreateEscrow = async () => {
    if (!isContractReady || !currentAccount) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to create an escrow.",
        variant: "destructive"
      })
      return
    }

    try {
      const milestoneAmounts = escrowForm.milestones.map(m => m.amount || '0')
      
      await createMilestoneEscrow(
         escrowForm.projectId,
         escrowForm.freelancer,
         milestoneAmounts,
         escrowForm.token as 'BTC' | 'USDC' | 'SKILL'
       )
      
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
      console.error('Escrow creation error:', error)
      toast({
        title: "Escrow Creation Failed",
        description: "There was an error creating the escrow.",
        variant: "destructive"
      })
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

  // Show connection prompt if wallet is not connected
  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Payment Center</h1>
            <p className="text-slate-400">Manage your payments, withdrawals, and escrow contracts on Citrea network</p>
          </div>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-16 w-16 text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
              <p className="text-slate-400 text-center mb-6">
                Please connect your wallet to access the payment center and manage your crypto transactions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Center</h1>
          <p className="text-slate-400">Manage your payments, withdrawals, and escrow contracts on Citrea network</p>
          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}
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
                const balance = cryptoBalance?.[token.symbol.toLowerCase() as keyof typeof cryptoBalance] || '0'
                const Icon = token.icon
                return (
                  <Card key={token.symbol} className="bg-slate-900 border-slate-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">{token.name}</CardTitle>
                      <Icon className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 6 })} {token.symbol}
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
                  {payments.slice(0, 5).map((payment) => {
                    const isReceived = payment.payee === currentAccount
                    const counterparty = isReceived ? payment.payer : payment.payee
                    const formattedDate = new Date(payment.createdAt * 1000).toLocaleDateString()
                    
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {isReceived ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-400" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-400" />
                          )}
                          <div>
                            <p className="text-white font-medium">
                              {isReceived ? 'Received from' : 'Sent to'} {counterparty.slice(0, 6)}...{counterparty.slice(-4)}
                            </p>
                            <p className="text-slate-400 text-sm">{formattedDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            {parseFloat(payment.amount).toLocaleString(undefined, { maximumFractionDigits: 6 })} {payment.token}
                          </p>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(payment.status)}
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
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
                  {isLoading ? 'Processing...' : 'Send Payment'}
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
                    {isLoading ? 'Processing...' : 'Request Withdrawal'}
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
                      const progress = (parseFloat(escrow.releasedAmount) / parseFloat(escrow.totalAmount)) * 100
                      const completedMilestones = 0 // Milestone details not available in current interface
                      
                      return (
                        <div key={escrow.id} className="p-4 bg-slate-800 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="text-white font-medium">Project #{escrow.projectId}</h4>
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
                                Released: {parseFloat(escrow.releasedAmount).toLocaleString(undefined, { maximumFractionDigits: 6 })} / {parseFloat(escrow.totalAmount).toLocaleString(undefined, { maximumFractionDigits: 6 })}
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
                          
                          <div className="mt-3">
                            <div className="text-sm text-slate-400">
                              Milestone details not available in current interface
                            </div>
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
                  {payments.map((payment) => {
                    const isReceived = payment.payee === currentAccount
                    const counterparty = isReceived ? payment.payer : payment.payee
                    const formattedDate = new Date(payment.createdAt * 1000).toLocaleDateString()
                    
                    return (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {isReceived ? (
                            <ArrowDownLeft className="h-5 w-5 text-green-400" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-red-400" />
                          )}
                          <div>
                            <p className="text-white font-medium">
                              {isReceived ? 'Received from' : 'Sent to'} {counterparty.slice(0, 6)}...{counterparty.slice(-4)}
                            </p>
                            <p className="text-slate-400 text-sm">{formattedDate}</p>
                            {payment.metadata && (
                              <p className="text-slate-500 text-sm">{payment.metadata}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            {parseFloat(payment.amount).toLocaleString(undefined, { maximumFractionDigits: 6 })} {payment.token}
                          </p>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(payment.status)}
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-slate-400 hover:text-white"
                              onClick={() => navigator.clipboard.writeText(payment.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
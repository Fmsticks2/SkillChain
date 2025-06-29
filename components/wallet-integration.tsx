"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  Copy,
  ExternalLink,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
  Coins,
  Lock,
  Unlock,
  Zap,
  CheckCircle,
  DollarSign,
  BarChart3,
} from "lucide-react"

const walletData = {
  address: "0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C",
  balance: {
    eth: 2.45,
    usdc: 15420.5,
    skill: 8750.25,
  },
  staked: {
    skill: 5000,
    apy: 12.5,
    rewards: 156.25,
  },
}

const transactions = [
  {
    id: 1,
    type: "received",
    amount: 2500,
    token: "USDC",
    from: "Project Payment",
    hash: "0x1234...5678",
    timestamp: "2 hours ago",
    status: "confirmed",
  },
  {
    id: 2,
    type: "sent",
    amount: 1000,
    token: "SKILL",
    to: "Staking Pool",
    hash: "0x2345...6789",
    timestamp: "1 day ago",
    status: "confirmed",
  },
  {
    id: 3,
    type: "received",
    amount: 156.25,
    token: "SKILL",
    from: "Staking Rewards",
    hash: "0x3456...7890",
    timestamp: "3 days ago",
    status: "confirmed",
  },
  {
    id: 4,
    type: "sent",
    amount: 500,
    token: "USDC",
    to: "Gas Fees",
    hash: "0x4567...8901",
    timestamp: "1 week ago",
    status: "confirmed",
  },
]

const escrowContracts = [
  {
    id: 1,
    project: "DeFi Dashboard Redesign",
    amount: 8500,
    token: "USDC",
    status: "active",
    progress: 75,
    releaseDate: "2024-02-15",
    client: "CryptoVault Inc.",
  },
  {
    id: 2,
    project: "Smart Contract Audit",
    amount: 6000,
    token: "USDC",
    status: "pending_release",
    progress: 100,
    releaseDate: "2024-01-30",
    client: "DeFi Protocol",
  },
  {
    id: 3,
    project: "NFT Marketplace Frontend",
    amount: 12000,
    token: "USDC",
    status: "completed",
    progress: 100,
    releaseDate: "2024-01-20",
    client: "ArtChain Labs",
  },
]

export function WalletIntegration() {
  const [isConnected, setIsConnected] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.address)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Wallet</h1>
              <p className="text-slate-400">Manage your crypto assets and earnings</p>
            </div>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-sm">Connected</span>
                  <Button variant="ghost" size="sm" onClick={copyAddress} className="text-slate-400 hover:text-white">
                    {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
                    <Copy className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {isConnected ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="escrow">Escrow</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">ETH</span>
                        </div>
                        <span className="font-medium">Ethereum</span>
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold">{walletData.balance.eth} ETH</p>
                    <p className="text-slate-400 text-sm">≈ ${(walletData.balance.eth * 2340).toLocaleString()}</p>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">USDC</span>
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold">${walletData.balance.usdc.toLocaleString()}</p>
                    <p className="text-slate-400 text-sm">Stable Coin</p>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">SKILL</span>
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold">{walletData.balance.skill.toLocaleString()} SKILL</p>
                    <p className="text-slate-400 text-sm">Platform Token</p>
                  </Card>
                </motion.div>
              </div>

              {/* Portfolio Overview */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <h3 className="text-xl font-semibold mb-6">Portfolio Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Total Portfolio Value</h4>
                      <p className="text-3xl font-bold text-emerald-400 mb-2">$47,320.50</p>
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm">+12.5% (24h)</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-4">Asset Allocation</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">USDC</span>
                          <span>65%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">SKILL</span>
                          <span>25%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">ETH</span>
                          <span>10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Recent Transactions</h3>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>
                </div>

                <div className="space-y-4">
                  {transactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            tx.type === "received" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {tx.type === "received" ? (
                            <ArrowDownLeft className="w-5 h-5" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {tx.type === "received" ? "Received" : "Sent"} {tx.amount} {tx.token}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {tx.type === "received" ? `From: ${tx.from}` : `To: ${tx.to}`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm text-emerald-400">Confirmed</span>
                        </div>
                        <p className="text-slate-400 text-sm">{tx.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="escrow" className="space-y-6">
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <h3 className="text-xl font-semibold mb-6">Escrow Contracts</h3>

                <div className="space-y-4">
                  {escrowContracts.map((contract, index) => (
                    <motion.div
                      key={contract.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{contract.project}</h4>
                          <p className="text-slate-400 text-sm">{contract.client}</p>
                        </div>
                        <Badge
                          className={
                            contract.status === "active"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : contract.status === "pending_release"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          }
                        >
                          {contract.status === "active"
                            ? "Active"
                            : contract.status === "pending_release"
                              ? "Pending Release"
                              : "Completed"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-slate-400 text-sm">Amount</p>
                          <p className="font-semibold">
                            ${contract.amount.toLocaleString()} {contract.token}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Release Date</p>
                          <p className="font-semibold">{contract.releaseDate}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-400">Progress</span>
                          <span className="text-sm font-medium">{contract.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${contract.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {contract.status === "pending_release" && (
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                          <Unlock className="w-4 h-4 mr-2" />
                          Release Funds
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="staking" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <h3 className="text-xl font-semibold mb-6">Staking Overview</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-slate-400 text-sm">Staked Amount</p>
                          <p className="text-2xl font-bold text-purple-400">
                            {walletData.staked.skill.toLocaleString()} SKILL
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Lock className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-slate-400 text-sm">APY</p>
                          <p className="text-2xl font-bold text-emerald-400">{walletData.staked.apy}%</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div>
                          <p className="text-slate-400 text-sm">Pending Rewards</p>
                          <p className="text-2xl font-bold text-amber-400">{walletData.staked.rewards} SKILL</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <Coins className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        <Lock className="w-4 h-4 mr-2" />
                        Stake More
                      </Button>
                      <Button variant="outline" className="flex-1 border-slate-700 bg-transparent">
                        <Unlock className="w-4 h-4 mr-2" />
                        Unstake
                      </Button>
                    </div>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <h3 className="text-xl font-semibold mb-6">Staking Benefits</h3>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <Shield className="w-8 h-8 text-blue-400" />
                        <div>
                          <h4 className="font-medium">Reputation Boost</h4>
                          <p className="text-slate-400 text-sm">+15% reputation score multiplier</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <Zap className="w-8 h-8 text-purple-400" />
                        <div>
                          <h4 className="font-medium">Priority Matching</h4>
                          <p className="text-slate-400 text-sm">Get matched with premium projects first</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <BarChart3 className="w-8 h-8 text-emerald-400" />
                        <div>
                          <h4 className="font-medium">Governance Rights</h4>
                          <p className="text-slate-400 text-sm">Vote on platform decisions and upgrades</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg">
                        <Coins className="w-8 h-8 text-amber-400" />
                        <div>
                          <h4 className="font-medium">Passive Income</h4>
                          <p className="text-slate-400 text-sm">Earn rewards while you work</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                      <Coins className="w-4 h-4 mr-2" />
                      Claim Rewards
                    </Button>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <Card className="p-12 bg-slate-900/50 backdrop-blur-sm border-slate-800 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-slate-400 mb-8">
                Connect your Web3 wallet to access your earnings, manage escrow contracts, and stake tokens.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                onClick={() => setIsConnected(true)}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

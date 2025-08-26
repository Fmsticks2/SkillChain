"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/components/auth/auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Briefcase, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const router = useRouter()
  const { isWeb3AuthConnected, isWalletConnected, web3AuthUserInfo, isLoading } = useAuthContext()

  useEffect(() => {
    // If not authenticated, redirect to signup
    if (!isLoading && !isWeb3AuthConnected && !isWalletConnected) {
      router.push('/auth/signup')
    }
  }, [isWeb3AuthConnected, isWalletConnected, isLoading, router])

  const handleRoleSelection = (role: 'client' | 'freelancer') => {
    router.push(`/dashboard/${role}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!isWeb3AuthConnected && !isWalletConnected) {
    return null // Will redirect to signup
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to SkillChain
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose your role to get started with the decentralized freelancing platform
          </p>
          {web3AuthUserInfo && (
            <p className="text-lg text-slate-400 mt-4">
              Hello, {web3AuthUserInfo.name || web3AuthUserInfo.email || 'User'}!
            </p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleRoleSelection('client')}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <Briefcase className="w-8 h-8 text-blue-400" />
                </div>
                <CardTitle className="text-2xl text-white">I'm a Client</CardTitle>
                <CardDescription className="text-slate-300">
                  Post projects and hire talented freelancers
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-slate-400 space-y-2 mb-6">
                  <li>• Post project requirements</li>
                  <li>• Review freelancer proposals</li>
                  <li>• Manage project milestones</li>
                  <li>• Secure escrow payments</li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-blue-500">
                  Continue as Client
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer group"
                  onClick={() => handleRoleSelection('freelancer')}>
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-2xl text-white">I'm a Freelancer</CardTitle>
                <CardDescription className="text-slate-300">
                  Find projects and showcase your skills
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="text-slate-400 space-y-2 mb-6">
                  <li>• Browse available projects</li>
                  <li>• Submit competitive proposals</li>
                  <li>• Build your reputation</li>
                  <li>• Verify your skills on-chain</li>
                </ul>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:bg-green-500">
                  Continue as Freelancer
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
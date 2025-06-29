"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Wallet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Github,
  Chrome,
  Linkedin,
  Zap,
  Shield,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { WalletConnect } from "./wallet-connect"
import { useAuth, mockUsers } from "@/lib/auth"

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOAuthSignIn = async (provider: string) => {
    if (!mounted) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful OAuth login - use first freelancer for demo
      const user = mockUsers.find((u) => u.role === "freelancer")
      if (user) {
        login(user)
        router.push("/dashboard/freelancer")
      }
    } catch (err) {
      setError("OAuth sign in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mounted) return

    setIsLoading(true)
    setError("")

    try {
      // Simulate email sign in
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Find user by email
      const user = mockUsers.find((u) => u.email === email)
      if (user) {
        login(user)
        // Redirect based on role
        switch (user.role) {
          case "freelancer":
            router.push("/dashboard/freelancer")
            break
          case "client":
            router.push("/dashboard/client")
            break
          case "admin":
            router.push("/admin")
            break
          default:
            router.push("/")
        }
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Sign in failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = (wallet: string, address: string) => {
    if (!mounted) return

    setIsLoading(true)

    // Simulate wallet sign in
    setTimeout(() => {
      const user = mockUsers.find((u) => u.role === "freelancer")
      if (user) {
        login({ ...user, walletAddress: address })
        router.push("/dashboard/freelancer")
      }
      setIsLoading(false)
      setShowWalletConnect(false)
    }, 1000)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </Link>

            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SkillChain</span>
            </div>

            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your account to continue building your reputation</p>
          </div>

          <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Demo Accounts */}
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <h3 className="font-medium mb-2">Demo Accounts:</h3>
              <div className="space-y-1 text-sm text-slate-300">
                <p>Freelancer: john@example.com</p>
                <p>Client: sarah@techcorp.com</p>
                <p>Admin: admin@skillchain.com</p>
              </div>
            </div>

            {/* OAuth Providers */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 border-0 h-12"
              >
                <Chrome className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>

              <Button
                onClick={() => handleOAuthSignIn("github")}
                disabled={isLoading}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 h-12"
              >
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </Button>

              <Button
                onClick={() => handleOAuthSignIn("linkedin")}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-12"
              >
                <Linkedin className="w-5 h-5 mr-3" />
                Continue with LinkedIn
              </Button>

              <Button
                onClick={() => setShowWalletConnect(true)}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 h-12"
              >
                <Wallet className="w-5 h-5 mr-3" />
                Connect Wallet
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator className="bg-slate-700" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-sm text-slate-400">
                or continue with email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded border-slate-700 bg-slate-800" />
                  <span className="text-slate-400">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-6">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-900/20 to-purple-900/20 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6">
            Join the Future of{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Decentralized Work
            </span>
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cryptographic Verification</h3>
                <p className="text-slate-400 text-sm">
                  Your skills are verified through blockchain-based challenges and peer review
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-slate-400 text-sm">Smart contract escrow ensures you get paid for your work</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Portable Reputation</h3>
                <p className="text-slate-400 text-sm">
                  Build a reputation that follows you across platforms and projects
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-sm font-medium">50,000+ verified professionals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium">$50M+ in total value locked</span>
            </div>
          </div>
        </motion.div>
      </div>
      {showWalletConnect && (
        <WalletConnect onConnect={handleWalletConnect} onCancel={() => setShowWalletConnect(false)} />
      )}
    </div>
  )
}

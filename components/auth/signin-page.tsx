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
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuthContext } from "@/components/auth/auth-provider"

export function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mounted, setMounted] = useState(false)

  const {
    loginWithSocial,
    loginWithWallet,
    isLoading,
    error,
    isWeb3AuthConnected,
    isWalletConnected
  } = useAuthContext()
  
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Redirect if already authenticated
    if (isWeb3AuthConnected || isWalletConnected) {
      // Check for stored user role from signup
      const storedRole = localStorage.getItem('userRole')
      if (storedRole && (storedRole === 'client' || storedRole === 'freelancer')) {
        router.push(`/dashboard/${storedRole}`)
      } else {
        // Fallback to generic dashboard if no role is stored
        router.push('/dashboard')
      }
    }
  }, [isWeb3AuthConnected, isWalletConnected, router])

  const handleSocialSignIn = async (provider: string) => {
    if (!mounted) return

    try {
      await loginWithSocial(provider)
      // Redirect will be handled by useEffect when auth state changes
    } catch (err: any) {
      console.error('Social sign in failed:', err)
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mounted) return

    // For now, we'll redirect to Web3Auth social login
    // In a full implementation, you might want to integrate email/password with Web3Auth
    await handleSocialSignIn('google')
  }

  const handleWalletSignIn = async () => {
    if (!mounted) return

    try {
      await loginWithWallet()
      // Redirect will be handled by useEffect when auth state changes
    } catch (err: any) {
      console.error('Wallet sign in failed:', err)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block space-y-8"
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">SkillChain</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Welcome back to the future of
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> freelancing</span>
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Connect with verified professionals using Web3Auth and secure wallet connections.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-slate-300">Secure Web3Auth social authentication</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300">Reown wallet integration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-slate-300">Blockchain-verified reputation</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Sign in form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">SkillChain</h1>
            </div>
          </div>

          <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400">Choose your preferred sign-in method</p>
            </div>

            {error && (
              <Alert className="mb-6 bg-red-500/10 border-red-500/20 text-red-400">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Social Login Options */}
            <div className="space-y-4 mb-6">
              <Button
                onClick={() => handleSocialSignIn("google")}
                disabled={isLoading}
                className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 font-medium transition-all duration-200 hover:scale-[1.02]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Chrome className="w-5 h-5 mr-3" />
                    Continue with Google
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleSocialSignIn("github")}
                disabled={isLoading}
                className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium border border-gray-700 transition-all duration-200 hover:scale-[1.02]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Github className="w-5 h-5 mr-3" />
                    Continue with GitHub
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleSocialSignIn("linkedin")}
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 hover:scale-[1.02]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Linkedin className="w-5 h-5 mr-3" />
                    Continue with LinkedIn
                  </>
                )}
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator className="bg-slate-700" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-sm text-slate-400">
                or
              </span>
            </div>

            {/* Wallet Connection */}
            <Button
              onClick={handleWalletSignIn}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium transition-all duration-200 hover:scale-[1.02]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Wallet className="w-5 h-5 mr-3" />
                  Connect Wallet
                </>
              )}
            </Button>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to home</span>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

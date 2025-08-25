"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Github,
  Chrome,
  Linkedin,
  Zap,
  User,
  Building,
  CheckCircle,
  Shield,
  Star,
  Wallet,
  MapPin,
  Phone,
  Globe,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuthContext } from "./auth-provider"
import type { UserRole } from "@/lib/auth"

const skillCategories = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "UI/UX Design",
  "Blockchain Development",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Cybersecurity",
  "Product Management",
  "Digital Marketing",
]

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (3-5 years)" },
  { value: "senior", label: "Senior Level (6-10 years)" },
  { value: "expert", label: "Expert Level (10+ years)" },
]

const companySizes = [
  { value: "startup", label: "Startup (1-10 employees)" },
  { value: "small", label: "Small (11-50 employees)" },
  { value: "medium", label: "Medium (51-200 employees)" },
  { value: "large", label: "Large (201-1000 employees)" },
  { value: "enterprise", label: "Enterprise (1000+ employees)" },
]

export function SignUpPage() {
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState<UserRole>("freelancer")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    // Additional fields for all signup methods
    phone: "",
    location: "",
    bio: "",
    website: "",
    skills: [] as string[],
    experienceLevel: "",
    hourlyRate: "",
    // Client specific fields
    companySize: "",
    industry: "",
    projectBudget: "",
  })
  const [showDetailsForm, setShowDetailsForm] = useState(false)
  const [signupMethod, setSignupMethod] = useState<"social" | "wallet" | null>(null)
  const [error, setError] = useState("")

  const {
    user,
    loginWithSocial,
    loginWithWallet,
    isLoading,
    error: authError,
    isWeb3AuthConnected,
    isWalletConnected
  } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  const handleSocialSignUp = async (provider: string) => {
    setError("")
    setSignupMethod("social")

    try {
      const result = await loginWithSocial(provider)
      if (result.success && result.user) {
        // Pre-fill form data from social profile
        setFormData((prev) => ({
          ...prev,
          firstName: result.user.name?.split(" ")[0] || "",
          lastName: result.user.name?.split(" ").slice(1).join(" ") || "",
          email: result.user.email || "",
        }))
        setShowDetailsForm(true)
      }
    } catch (err: any) {
      setError(`${provider} sign up failed. Please try again.`)
    }
  }

  const handleWalletSignUp = async () => {
    setError("")
    setSignupMethod("wallet")

    try {
      const result = await loginWithWallet()
      if (result.success && result.user) {
        // Pre-fill form data from wallet info
        setFormData((prev) => ({
          ...prev,
          email: result.user.email || "",
        }))
        setShowDetailsForm(true)
      }
    } catch (err: any) {
      setError("Wallet connection failed. Please try again.")
    }
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Since user is already authenticated via Web3Auth/Reown,
      // we just need to save additional profile information
      // This would typically involve an API call to save user profile
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Redirect to dashboard after profile completion
      router.push("/dashboard")
    } catch (err) {
      setError("Profile setup failed. Please try again.")
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
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
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">SkillChain</h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Join the future of
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> decentralized work</span>
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Create your account using Web3Auth and connect your wallet with Reown for secure blockchain authentication.
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
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-slate-300">Blockchain-verified reputation</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Sign up form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">SkillChain</h1>
            </div>
          </div>

          <Card className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            {!showDetailsForm ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Create your account</h2>
                  <p className="text-slate-400">Choose your preferred sign-up method</p>
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
                    onClick={() => handleSocialSignUp("google")}
                    disabled={isLoading}
                    className="w-full h-12 bg-white hover:bg-gray-100 text-gray-900 font-medium transition-all duration-200 hover:scale-[1.02]"
                  >
                    {isLoading && signupMethod === "social" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Chrome className="w-5 h-5 mr-3" />
                        Continue with Google
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleSocialSignUp("github")}
                    disabled={isLoading}
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium border border-gray-700 transition-all duration-200 hover:scale-[1.02]"
                  >
                    {isLoading && signupMethod === "social" ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Github className="w-5 h-5 mr-3" />
                        Continue with GitHub
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => handleSocialSignUp("linkedin")}
                    disabled={isLoading}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 hover:scale-[1.02]"
                  >
                    {isLoading && signupMethod === "social" ? (
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
                  <Separator className="bg-white/10" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-sm text-slate-400">
                    or
                  </span>
                </div>

                {/* Wallet Connection */}
                <Button
                  onClick={handleWalletSignUp}
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium transition-all duration-200 hover:scale-[1.02]"
                >
                  {isLoading && signupMethod === "wallet" ? (
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
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-medium">
                      Sign in
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
              </>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Complete your profile</h3>
                  <p className="text-slate-400">Tell us more about yourself to get started</p>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4 text-white">I'm joining as a...</h4>
                    <RadioGroup
                      value={userType}
                      onValueChange={(value) => setUserType(value as UserRole)}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-3 p-4 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                        <RadioGroupItem value="freelancer" id="freelancer" />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <Label htmlFor="freelancer" className="font-medium cursor-pointer text-white">
                              Freelancer
                            </Label>
                            <p className="text-sm text-slate-400">I want to offer my skills and find projects</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
                        <RadioGroupItem value="client" id="client" />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <Label htmlFor="client" className="font-medium cursor-pointer text-white">
                              Client
                            </Label>
                            <p className="text-sm text-slate-400">I want to hire verified talent for projects</p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-slate-800 border-slate-700 focus:border-blue-500 text-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-slate-800 border-slate-700 focus:border-blue-500 text-white"
                        required
                      />
                    </div>
                  </div>

                  {userType === "client" && (
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-white">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="company"
                          placeholder="Acme Inc."
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500 text-white"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="location"
                        placeholder="New York, NY"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="bg-slate-800 border-slate-700 focus:border-blue-500 text-white min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <input type="checkbox" className="mt-1 rounded border-slate-700 bg-slate-800" required />
                    <p className="text-sm text-slate-400">
                      I agree to the{" "}
                      <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Complete Profile"
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-400">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300 font-medium">
                      Sign in
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
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

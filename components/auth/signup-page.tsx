"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
} from "lucide-react"
import Link from "next/link"
import { WalletConnect } from "./wallet-connect"
import { useAuth, type UserRole } from "@/lib/auth"

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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  const [showDetailsForm, setShowDetailsForm] = useState(false)
  const [signupMethod, setSignupMethod] = useState<"email" | "oauth" | "wallet" | null>(null)
  const [walletInfo, setWalletInfo] = useState<{ wallet: string; address: string } | null>(null)
  const [oauthSession, setOauthSession] = useState<any>(null)
  const [error, setError] = useState("")

  const { login } = useAuth()
  const router = useRouter()

  const handleOAuthSignUp = async (provider: string) => {
    setIsLoading(true)
    setError("")
    setSignupMethod("oauth")

    try {
      // Use NextAuth signIn with redirect disabled
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: window.location.origin + "/auth/signup",
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Get the session after successful OAuth
      const session = await getSession()
      if (session) {
        setOauthSession(session)
        // Pre-fill form data from OAuth profile
        if (session.user) {
          setFormData((prev) => ({
            ...prev,
            firstName: session.user?.name?.split(" ")[0] || "",
            lastName: session.user?.name?.split(" ").slice(1).join(" ") || "",
            email: session.user?.email || "",
          }))
        }
        setShowDetailsForm(true)
      }
    } catch (err: any) {
      setError(`${provider} sign up failed. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = () => {
    if (step === 1) {
      setSignupMethod("email")
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3) {
      setShowDetailsForm(true)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Simulate account creation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setShowDetailsForm(true)
    } catch (err) {
      setError("Account creation failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = (wallet: string, address: string) => {
    setWalletInfo({ wallet, address })
    setShowWalletConnect(false)
    setSignupMethod("wallet")
    setShowDetailsForm(true)
  }

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate account creation with details
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newUser = {
        id: Date.now().toString(),
        email: formData.email || (walletInfo ? `${walletInfo.address.slice(0, 8)}@wallet.com` : "user@example.com"),
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: userType,
        company: userType === "client" ? formData.company : undefined,
        walletAddress: walletInfo?.address,
        isVerified: false,
        createdAt: new Date().toISOString(),
        // OAuth specific data
        oauthProvider: oauthSession?.provider,
        oauthId: oauthSession?.providerAccountId,
        avatar: oauthSession?.user?.image,
      }

      login(newUser)
      router.push("/onboarding")
    } catch (err) {
      setError("Account creation failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }))
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

            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-slate-400">Join thousands of verified professionals</p>
          </div>

          <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {step === 1 && !showDetailsForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                {/* OAuth Providers */}
                <div className="space-y-3">
                  <Button
                    onClick={() => handleOAuthSignUp("google")}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 border-0 h-12"
                  >
                    <Chrome className="w-5 h-5 mr-3" />
                    {isLoading && signupMethod === "oauth" ? "Connecting..." : "Continue with Google"}
                  </Button>

                  <Button
                    onClick={() => handleOAuthSignUp("github")}
                    disabled={isLoading}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 h-12"
                  >
                    <Github className="w-5 h-5 mr-3" />
                    {isLoading && signupMethod === "oauth" ? "Connecting..." : "Continue with GitHub"}
                  </Button>

                  <Button
                    onClick={() => handleOAuthSignUp("linkedin")}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-12"
                  >
                    <Linkedin className="w-5 h-5 mr-3" />
                    {isLoading && signupMethod === "oauth" ? "Connecting..." : "Continue with LinkedIn"}
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

                <div className="relative">
                  <Separator className="bg-slate-700" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-sm text-slate-400">
                    or create with email
                  </span>
                </div>

                <Button
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12"
                >
                  Continue with Email
                </Button>
              </motion.div>
            )}

            {step === 2 && !showDetailsForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">I'm joining as a...</h3>
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
                          <Label htmlFor="freelancer" className="font-medium cursor-pointer">
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
                          <Label htmlFor="client" className="font-medium cursor-pointer">
                            Client
                          </Label>
                          <p className="text-sm text-slate-400">I want to hire verified talent for projects</p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={handleNextStep}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 h-12"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {step === 3 && !showDetailsForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="bg-slate-800 border-slate-700 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="bg-slate-800 border-slate-700 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {userType === "client" && (
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="company"
                          placeholder="Acme Inc."
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="pl-10 pr-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
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
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Continue to Details"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Details Form - Shown for all signup methods */}
            {showDetailsForm && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="mb-6">
                  {walletInfo && (
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Wallet Connected</h3>
                        <p className="text-sm text-slate-400">
                          {walletInfo.address.slice(0, 8)}...{walletInfo.address.slice(-6)}
                        </p>
                      </div>
                    </div>
                  )}

                  {oauthSession && (
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">OAuth Connected</h3>
                        <p className="text-sm text-slate-400">Connected via {oauthSession.provider}</p>
                      </div>
                    </div>
                  )}

                  {/* User Type Selection for wallet/oauth users */}
                  {(signupMethod === "wallet" || signupMethod === "oauth") && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">I'm joining as a...</h3>
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
                              <Label htmlFor="freelancer" className="font-medium cursor-pointer">
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
                              <Label htmlFor="client" className="font-medium cursor-pointer">
                                Client
                              </Label>
                              <p className="text-sm text-slate-400">I want to hire verified talent for projects</p>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  {/* Basic Information */}
                  {signupMethod !== "email" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="bg-slate-800 border-slate-700 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="bg-slate-800 border-slate-700 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email {signupMethod === "wallet" ? "(Optional)" : "*"}</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                            required={signupMethod !== "wallet"}
                            disabled={signupMethod === "oauth"} // Disable for OAuth as it's pre-filled
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          id="location"
                          placeholder="New York, NY"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {userType === "freelancer" && (
                    <>
                      {/* Freelancer Fields */}
                      <div className="space-y-2">
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea
                          id="bio"
                          placeholder="Tell us about your experience and expertise..."
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="bg-slate-800 border-slate-700 focus:border-blue-500 min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Portfolio/Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="website"
                            placeholder="https://yourportfolio.com"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Skills (Select up to 5)</Label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                          {skillCategories.map((skill) => (
                            <div
                              key={skill}
                              onClick={() => handleSkillToggle(skill)}
                              className={`p-2 text-sm border rounded-lg cursor-pointer transition-colors ${
                                formData.skills.includes(skill)
                                  ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                  : "border-slate-700 hover:border-slate-600"
                              } ${formData.skills.length >= 5 && !formData.skills.includes(skill) ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="experienceLevel">Experience Level</Label>
                          <Select
                            value={formData.experienceLevel}
                            onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hourlyRate">Hourly Rate (USD)</Label>
                          <Input
                            id="hourlyRate"
                            placeholder="50"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                            className="bg-slate-800 border-slate-700 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {userType === "client" && (
                    <>
                      {/* Client Fields */}
                      {signupMethod !== "email" && (
                        <div className="space-y-2">
                          <Label htmlFor="company">Company Name *</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              id="company"
                              placeholder="Acme Inc."
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="companySize">Company Size</Label>
                          <Select
                            value={formData.companySize}
                            onValueChange={(value) => setFormData({ ...formData, companySize: value })}
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              {companySizes.map((size) => (
                                <SelectItem key={size.value} value={size.value}>
                                  {size.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            placeholder="Technology"
                            value={formData.industry}
                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            className="bg-slate-800 border-slate-700 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectBudget">Typical Project Budget (USD)</Label>
                        <Select
                          value={formData.projectBudget}
                          onValueChange={(value) => setFormData({ ...formData, projectBudget: value })}
                        >
                          <SelectTrigger className="bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-5k">Under $5,000</SelectItem>
                            <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                            <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="over-100k">Over $100,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

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
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </motion.div>
            )}

            <p className="text-center text-sm text-slate-400 mt-6">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </Card>

          {/* Progress Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  showDetailsForm ? "bg-blue-500" : i <= step ? "bg-blue-500" : "bg-slate-700"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-900/20 to-blue-900/20 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6">
            Start Building Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Web3 Career
            </span>
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instant Verification</h3>
                <p className="text-slate-400 text-sm">Get verified through our blockchain-based skill challenges</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secure & Transparent</h3>
                <p className="text-slate-400 text-sm">All transactions and reputation scores are on-chain</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Premium Opportunities</h3>
                <p className="text-slate-400 text-sm">Access to high-value projects from top Web3 companies</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h4 className="font-semibold mb-3">Join the community</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Average project value</span>
                <span className="font-medium">$12,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Success rate</span>
                <span className="font-medium text-emerald-400">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Time to first project</span>
                <span className="font-medium">&lt; 24 hours</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {showWalletConnect && (
        <WalletConnect 
          onConnect={handleWalletConnect} 
          onSuccess={(address, userType, formData) => {
            console.log("WalletConnect onSuccess called with:", { address, userType, formData });
            // Set wallet info
            setWalletInfo({ wallet: 'metamask', address });
            // Set user type
            setUserType(userType === 'client' ? 'client' : 'freelancer');
            // Update form data
            setFormData(prev => ({
              ...prev,
              firstName: formData.name.split(' ')[0] || '',
              lastName: formData.name.split(' ').slice(1).join(' ') || '',
              email: formData.email || '',
              company: userType === 'client' ? formData.company : '',
              skills: userType === 'freelancer' ? [formData.skills] : [],
              experienceLevel: userType === 'freelancer' ? formData.experience : '',
            }));
            // Hide wallet connect and show details form
            setShowWalletConnect(false);
            setShowDetailsForm(true);
          }}
          onCancel={() => setShowWalletConnect(false)} 
        />
      )}
    </div>
  )
}

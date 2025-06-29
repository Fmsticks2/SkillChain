"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Wallet, Code, Palette, Database, CheckCircle, ArrowRight, Zap, Upload, LinkIcon } from "lucide-react"

const skillCategories = [
  { name: "Frontend Development", icon: Code, color: "from-blue-500 to-cyan-500" },
  { name: "Backend Development", icon: Database, color: "from-emerald-500 to-teal-500" },
  { name: "UI/UX Design", icon: Palette, color: "from-purple-500 to-pink-500" },
  { name: "Blockchain Development", icon: Code, color: "from-amber-500 to-orange-500" },
]

export function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isConnectingWallet, setIsConnectingWallet] = useState(false)

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleConnectWallet = async () => {
    setIsConnectingWallet(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnectingWallet(false)
    setStep(step + 1)
  }

  const handleComplete = () => {
    window.location.href = "/dashboard/freelancer"
  }

  const progress = (step / 4) * 100

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">SkillChain</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to SkillChain!</h1>
          <p className="text-slate-400">Let's set up your profile in a few quick steps</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Skills Selection */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-slate-800">
              <h2 className="text-2xl font-bold mb-4">What are your main skills?</h2>
              <p className="text-slate-400 mb-6">Select the areas where you have expertise. You can add more later.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {skillCategories.map((category) => (
                  <div
                    key={category.name}
                    onClick={() => handleSkillToggle(category.name)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedSkills.includes(category.name)
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}
                      >
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{category.name}</h3>
                        {selectedSkills.includes(category.name) && (
                          <CheckCircle className="w-5 h-5 text-blue-400 mt-1" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={selectedSkills.length === 0}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Connect Wallet */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-slate-800 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <Wallet className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
              <p className="text-slate-400 mb-8">
                Connect your Web3 wallet to receive payments and build your on-chain reputation.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-center space-x-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Secure smart contract payments</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Portable reputation on blockchain</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Earn and stake platform tokens</span>
                </div>
              </div>

              <Button
                onClick={handleConnectWallet}
                disabled={isConnectingWallet}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 mb-4"
              >
                {isConnectingWallet ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>

              <Button onClick={() => setStep(3)} variant="ghost" className="w-full text-slate-400 hover:text-white">
                Skip for now
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Portfolio Setup */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-slate-800">
              <h2 className="text-2xl font-bold mb-4">Showcase Your Work</h2>
              <p className="text-slate-400 mb-6">Add your portfolio items to stand out to potential clients.</p>

              <div className="space-y-4 mb-8">
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Upload Portfolio Files</h3>
                  <p className="text-slate-400 text-sm">Drag and drop your best work or click to browse</p>
                </div>

                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 transition-colors cursor-pointer">
                  <LinkIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Add Portfolio Links</h3>
                  <p className="text-slate-400 text-sm">GitHub, Dribbble, Behance, or personal website</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => setStep(4)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button onClick={() => setStep(4)} variant="outline" className="border-slate-700 bg-transparent">
                  Skip
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-slate-800 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold mb-4">You're All Set!</h2>
              <p className="text-slate-400 mb-8">
                Your profile is ready. Start exploring opportunities and building your Web3 reputation.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="font-medium mb-2">Take Skill Challenges</h3>
                  <p className="text-slate-400 text-sm">Verify your expertise</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="font-medium mb-2">Browse Projects</h3>
                  <p className="text-slate-400 text-sm">Find your next opportunity</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="font-medium mb-2">Build Reputation</h3>
                  <p className="text-slate-400 text-sm">Earn on-chain credibility</p>
                </div>
              </div>

              <Button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

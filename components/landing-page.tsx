"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Zap,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  Star,
  CheckCircle,
  Globe,
  Wallet,
  Code,
  Palette,
  Database,
  Smartphone,
  Target,
  DollarSign,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: Shield,
    title: "Blockchain Verification",
    description: "Skills verified through cryptographic challenges and peer review",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Wallet,
    title: "Smart Contract Escrow",
    description: "Automated payments and milestone releases through secure smart contracts",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Global Talent Pool",
    description: "Access to 25,000+ verified Web3 professionals worldwide",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Portable Reputation",
    description: "Build a reputation that follows you across platforms and projects",
    color: "from-amber-500 to-orange-500",
  },
]

const skills = [
  { icon: Code, name: "Smart Contract Development", professionals: "2,500+" },
  { icon: Globe, name: "DApp Frontend Development", professionals: "3,200+" },
  { icon: Database, name: "Blockchain Architecture", professionals: "1,800+" },
  { icon: Palette, name: "Web3 UI/UX Design", professionals: "2,100+" },
  { icon: Smartphone, name: "Mobile DApp Development", professionals: "1,600+" },
  { icon: Shield, name: "Security Auditing", professionals: "900+" },
]

const stats = [
  { label: "Verified Professionals", value: "25,000+", icon: Users },
  { label: "Projects Completed", value: "50,000+", icon: CheckCircle },
  { label: "Total Value Transacted", value: "$500M+", icon: DollarSign },
  { label: "Success Rate", value: "98%", icon: Target },
]

const testimonials = [
  {
    name: "Alex Chen",
    role: "Smart Contract Developer",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "SkillChain transformed my freelance career. The blockchain verification gave me instant credibility.",
    rating: 5,
  },
  {
    name: "Maria Rodriguez",
    role: "Product Manager",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "We found exceptional talent quickly. The smart contract escrow eliminated all payment concerns.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "DApp Developer",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "The platform's reputation system is game-changing. Clients trust my verified skills immediately.",
    rating: 5,
  },
]

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "freelancer") {
        router.push("/dashboard/freelancer")
      } else if (user?.role === "client") {
        router.push("/dashboard/client")
      } else {
        router.push("/auth/signup")
      }
    } else {
      router.push("/auth/signup")
    }
  }

  const handleSignIn = () => {
    if (isAuthenticated) {
      if (user?.role === "freelancer") {
        router.push("/dashboard/freelancer")
      } else if (user?.role === "client") {
        router.push("/dashboard/client")
      } else {
        router.push("/auth/signin")
      }
    } else {
      router.push("/auth/signin")
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold">SkillChain</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              <Link href="/projects" className="text-slate-300 hover:text-white transition-colors text-sm lg:text-base">
                Find Projects
              </Link>
              <Link href="/talent" className="text-slate-300 hover:text-white transition-colors text-sm lg:text-base">
                Browse Talent
              </Link>
              <Link href="/for-freelancers" className="text-slate-300 hover:text-white transition-colors text-sm lg:text-base">
                For Freelancers
              </Link>
              <Link href="/for-clients" className="text-slate-300 hover:text-white transition-colors text-sm lg:text-base">
                For Clients
              </Link>
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors text-sm lg:text-base">
                Pricing
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <Button onClick={handleSignIn} variant="ghost" className="text-slate-300 hover:text-white text-sm lg:text-base px-2 lg:px-4">
                Sign In
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-sm lg:text-base px-2 lg:px-4"
              >
                Get Started
              </Button>
            </div>

            <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-800 overflow-y-auto max-h-[calc(100vh-80px)]">
              <div className="flex flex-col space-y-4 pt-4">
                <Link
                  href="/projects"
                  className="text-slate-300 hover:text-white transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Find Projects
                </Link>
                <Link
                  href="/talent"
                  className="text-slate-300 hover:text-white transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Browse Talent
                </Link>
                <Link
                  href="/for-freelancers"
                  className="text-slate-300 hover:text-white transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  For Freelancers
                </Link>
                <Link
                  href="/for-clients"
                  className="text-slate-300 hover:text-white transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  For Clients
                </Link>
                <Link
                  href="/pricing"
                  className="text-slate-300 hover:text-white transition-colors px-2 py-1"
                  onClick={closeMobileMenu}
                >
                  Pricing
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button onClick={handleSignIn} variant="ghost" className="text-slate-300 hover:text-white w-full">
                    Sign In
                  </Button>
                  <Button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 w-full"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-6 bg-slate-800 text-blue-400 border-blue-500/20">
                <Zap className="w-3 h-3 mr-1" />
                The Future of Work is Here
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                The First{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cryptographically-Verified
                </span>{" "}
                Skill Matching Platform
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Connect with top talent, prove your expertise, and build portable reputation on the blockchain. Smart
                contracts ensure secure payments and verified skills create trust.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 text-lg"
                >
                  Start Building Your Reputation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleSignIn}
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg bg-transparent"
                >
                  Explore the Platform
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-6 bg-slate-900/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SkillChain?
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Experience the future of work with blockchain-verified skills, smart contract payments, and a global
                network of verified professionals.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                        <p className="text-slate-400">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-6 bg-slate-900/30">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                In-Demand{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Web3 Skills
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Connect with verified professionals across all Web3 disciplines.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <skill.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">{skill.name}</h3>
                        <p className="text-slate-400 text-sm">{skill.professionals} professionals</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Trusted by{" "}
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Thousands
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                See what our community of verified professionals and clients have to say.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-slate-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-300 text-sm">{testimonial.content}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
          <div className="container mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Join the{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Future of Work?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Whether you're a freelancer looking to prove your skills or a client seeking verified talent, SkillChain
                is your gateway to the decentralized economy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/for-freelancers">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 text-lg"
                  >
                    I'm a Freelancer
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/for-clients">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 text-lg"
                  >
                    I'm a Client
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
              <p className="text-slate-400 text-sm mt-4">Free to join • No setup fees • Start earning immediately</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

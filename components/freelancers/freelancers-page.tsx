"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Shield,
  Star,
  TrendingUp,
  Wallet,
  ArrowRight,
  Code,
  Palette,
  Database,
  Smartphone,
  Globe,
  DollarSign,
  Clock,
  Users,
  Target,
  Sparkles,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: Shield,
    title: "Blockchain Verification",
    description: "Get your skills verified through cryptographic challenges and peer review",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Wallet,
    title: "Secure Payments",
    description: "Smart contract escrow ensures you get paid automatically upon completion",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Star,
    title: "Portable Reputation",
    description: "Build a reputation that follows you across platforms and projects",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "Premium Projects",
    description: "Access high-value Web3 projects from top companies worldwide",
    color: "from-amber-500 to-orange-500",
  },
]

const skills = [
  { icon: Code, name: "Smart Contract Development", demand: "High", rate: "$120/hr" },
  { icon: Globe, name: "DApp Frontend Development", demand: "High", rate: "$85/hr" },
  { icon: Database, name: "Blockchain Architecture", demand: "Medium", rate: "$150/hr" },
  { icon: Palette, name: "Web3 UI/UX Design", demand: "Medium", rate: "$75/hr" },
  { icon: Smartphone, name: "Mobile DApp Development", demand: "Growing", rate: "$95/hr" },
  { icon: Shield, name: "Security Auditing", demand: "Critical", rate: "$200/hr" },
]

const stats = [
  { label: "Average Project Value", value: "$12,500", icon: DollarSign },
  { label: "Success Rate", value: "98%", icon: Target },
  { label: "Time to First Project", value: "< 24 hours", icon: Clock },
  { label: "Active Freelancers", value: "25,000+", icon: Users },
]

const testimonials = [
  {
    name: "Alex Chen",
    role: "Smart Contract Developer",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "SkillChain transformed my freelance career. The blockchain verification gave me credibility, and I've earned over $150k in my first year.",
    rating: 5,
    earnings: "$150,000+",
  },
  {
    name: "Maria Rodriguez",
    role: "Web3 Designer",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The platform's reputation system is game-changing. Clients trust my verified skills, and I can charge premium rates.",
    rating: 5,
    earnings: "$85,000+",
  },
  {
    name: "David Kim",
    role: "DApp Developer",
    avatar: "/placeholder.svg?height=60&width=60",
    content: "Smart contract payments mean I never worry about getting paid. The escrow system is bulletproof.",
    rating: 5,
    earnings: "$120,000+",
  },
]

export function FreelancersPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "freelancer") {
        router.push("/dashboard/freelancer")
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
      } else {
        router.push("/auth/signin")
      }
    } else {
      router.push("/auth/signin")
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">SkillChain</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/projects" className="text-slate-300 hover:text-white transition-colors">
                Find Projects
              </Link>
              <Link href="/talent" className="text-slate-300 hover:text-white transition-colors">
                Browse Talent
              </Link>
              <Link href="/for-freelancers" className="text-blue-400 font-medium">
                For Freelancers
              </Link>
              <Link href="/for-clients" className="text-slate-300 hover:text-white transition-colors">
                For Clients
              </Link>
              <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button onClick={handleSignIn} variant="ghost" className="text-slate-300 hover:text-white">
                Sign In
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24">
        {/* Back to Home Button */}
        <div className="container mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-6 bg-slate-800 text-blue-400 border-blue-500/20">
                <Sparkles className="w-3 h-3 mr-1" />
                For Freelancers
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Build Your{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Web3 Career
                </span>
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Join the future of work with blockchain-verified skills, smart contract payments, and access to premium
                Web3 projects from top companies worldwide.
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
                  Already a Member? Sign In
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
                Experience the future of freelancing with blockchain technology, verified skills, and guaranteed
                payments.
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

        {/* Skills in Demand */}
        <section className="py-20 px-6 bg-slate-900/30">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Skills in{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  High Demand
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Web3 skills are commanding premium rates. Get verified and start earning more.
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
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <skill.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{skill.name}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <Badge
                            className={
                              skill.demand === "High" || skill.demand === "Critical"
                                ? "bg-red-500/20 text-red-400 border-red-500/30"
                                : skill.demand === "Medium"
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            }
                          >
                            {skill.demand}
                          </Badge>
                          <span className="text-emerald-400 font-semibold">{skill.rate}</span>
                        </div>
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
                Success{" "}
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Stories
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                See how freelancers are building successful careers on SkillChain.
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
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-slate-400 text-sm">{testimonial.role}</p>
                      </div>
                      <div className="ml-auto">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {testimonial.earnings}
                        </Badge>
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
                Ready to Start Your{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Web3 Journey?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of verified professionals building the future of decentralized work. Get started today
                and unlock premium opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 text-lg"
                >
                  Create Your Profile
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleSignIn}
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg bg-transparent"
                >
                  Sign In to Dashboard
                </Button>
              </div>
              <p className="text-slate-400 text-sm mt-4">Free to join • No setup fees • Start earning immediately</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

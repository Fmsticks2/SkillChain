"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Shield,
  Users,
  ArrowRight,
  Search,
  Clock,
  Award,
  DollarSign,
  Target,
  Globe,
  Sparkles,
  Star,
  Building,
  Briefcase,
  Home,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: Users,
    title: "Verified Talent Pool",
    description: "Access 25,000+ blockchain-verified professionals with proven skills",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Smart Contract Escrow",
    description: "Automated payments and milestone releases through secure smart contracts",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Search,
    title: "Advanced Matching",
    description: "AI-powered talent matching based on skills, experience, and project requirements",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Award,
    title: "Quality Assurance",
    description: "Peer-reviewed work and blockchain-verified reputation scores",
    color: "from-amber-500 to-orange-500",
  },
]

const benefits = [
  {
    icon: Clock,
    title: "Faster Hiring",
    description: "Find and hire talent 3x faster with our verified talent pool",
    stat: "3x Faster",
  },
  {
    icon: DollarSign,
    title: "Cost Effective",
    description: "Save up to 40% on project costs with competitive rates",
    stat: "40% Savings",
  },
  {
    icon: Target,
    title: "Higher Success Rate",
    description: "98% project success rate with verified professionals",
    stat: "98% Success",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access talent from 150+ countries worldwide",
    stat: "150+ Countries",
  },
]

const projectTypes = [
  {
    icon: Building,
    title: "DeFi Platforms",
    description: "Build decentralized finance applications and protocols",
    avgBudget: "$25,000 - $100,000",
    timeline: "3-6 months",
  },
  {
    icon: Briefcase,
    title: "NFT Marketplaces",
    description: "Create NFT trading platforms and digital asset marketplaces",
    avgBudget: "$15,000 - $75,000",
    timeline: "2-4 months",
  },
  {
    icon: Shield,
    title: "Smart Contracts",
    description: "Develop and audit secure smart contracts for various use cases",
    avgBudget: "$5,000 - $50,000",
    timeline: "1-3 months",
  },
  {
    icon: Globe,
    title: "Web3 Applications",
    description: "Build decentralized applications with modern user interfaces",
    avgBudget: "$10,000 - $60,000",
    timeline: "2-5 months",
  },
]

const testimonials = [
  {
    name: "Michael Chen",
    role: "CTO at DeFi Labs",
    company: "DeFi Labs",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "SkillChain helped us find exceptional blockchain developers. The verification system gave us confidence in their skills from day one.",
    rating: 5,
    projectValue: "$150,000",
  },
  {
    name: "Sarah Williams",
    role: "Product Manager at CryptoVault",
    company: "CryptoVault",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The smart contract escrow system eliminated payment disputes. Our projects are delivered on time and within budget.",
    rating: 5,
    projectValue: "$85,000",
  },
  {
    name: "David Rodriguez",
    role: "Founder at NFT Studio",
    company: "NFT Studio",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "We've completed 12 projects through SkillChain with a 100% success rate. The talent quality is unmatched.",
    rating: 5,
    projectValue: "$200,000+",
  },
]

export function ClientsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "client") {
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
      if (user?.role === "client") {
        router.push("/dashboard/client")
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
              <Link href="/for-freelancers" className="text-slate-300 hover:text-white transition-colors">
                For Freelancers
              </Link>
              <Link href="/for-clients" className="text-blue-400 font-medium">
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
              <Badge className="mb-6 bg-slate-800 text-purple-400 border-purple-500/20">
                <Sparkles className="w-3 h-3 mr-1" />
                For Clients
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                Hire{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Verified
                </span>{" "}
                Web3 Talent
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
                Access the world's largest pool of blockchain-verified professionals. Build your Web3 projects with
                confidence using smart contract escrow and guaranteed quality.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 text-lg"
                >
                  Start Hiring Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleSignIn}
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg bg-transparent"
                >
                  Already a Client? Sign In
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-6 bg-slate-900/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2 text-purple-400">{benefit.stat}</div>
                  <div className="font-medium mb-1">{benefit.title}</div>
                  <div className="text-slate-400 text-sm">{benefit.description}</div>
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
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  SkillChain?
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Experience the future of hiring with blockchain-verified talent, smart contract security, and guaranteed
                project success.
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

        {/* Project Types */}
        <section className="py-20 px-6 bg-slate-900/30">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">
                Popular{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  Project Types
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                From DeFi platforms to NFT marketplaces, find the right talent for any Web3 project.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projectTypes.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <project.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-slate-400 mb-4">{project.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Avg Budget:</span>
                            <div className="font-semibold text-emerald-400">{project.avgBudget}</div>
                          </div>
                          <div>
                            <span className="text-slate-400">Timeline:</span>
                            <div className="font-semibold">{project.timeline}</div>
                          </div>
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
                Client{" "}
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  Success Stories
                </span>
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                See how companies are building successful Web3 projects with SkillChain talent.
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
                      <div className="flex-1">
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-slate-400 text-sm">{testimonial.role}</p>
                        <p className="text-slate-500 text-xs">{testimonial.company}</p>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        {testimonial.projectValue}
                      </Badge>
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
        <section className="py-20 px-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
          <div className="container mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Build Your{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Next Project?
                </span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join hundreds of companies building the future with verified Web3 talent. Post your first project today
                and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 text-lg"
                >
                  Post Your First Project
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleSignIn}
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg bg-transparent"
                >
                  Access Your Dashboard
                </Button>
              </div>
              <p className="text-slate-400 text-sm mt-4">Free to post • No upfront costs • Pay only when you hire</p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

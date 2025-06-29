"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, Zap, Star, Users, Crown, Rocket, Home } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for getting started",
    icon: Zap,
    color: "from-slate-500 to-slate-600",
    features: [
      "Basic profile creation",
      "Apply to 5 projects/month",
      "Standard verification",
      "Community support",
      "Basic analytics",
    ],
    limitations: ["Limited project applications", "No priority support", "Basic verification only"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "For serious freelancers",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Enhanced profile with portfolio",
      "Unlimited project applications",
      "Advanced skill verification",
      "Priority support",
      "Advanced analytics",
      "Custom proposal templates",
      "Direct client messaging",
    ],
    limitations: [],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For teams and agencies",
    icon: Crown,
    color: "from-purple-500 to-pink-500",
    features: [
      "Everything in Professional",
      "Team management",
      "White-label solutions",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "Advanced reporting",
      "Custom verification workflows",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
]

const clientPlans = [
  {
    name: "Basic",
    price: "5%",
    description: "Platform fee per project",
    icon: Users,
    color: "from-emerald-500 to-teal-500",
    features: [
      "Post unlimited projects",
      "Access to all talent",
      "Basic project management",
      "Standard support",
      "Payment protection",
    ],
    limitations: ["5% platform fee", "Standard verification only"],
    cta: "Start Hiring",
    popular: false,
  },
  {
    name: "Pro",
    price: "3%",
    description: "Platform fee per project",
    icon: Rocket,
    color: "from-amber-500 to-orange-500",
    features: [
      "Everything in Basic",
      "Advanced talent matching",
      "Priority support",
      "Advanced project analytics",
      "Custom contracts",
      "Dedicated success manager",
    ],
    limitations: ["3% platform fee"],
    cta: "Upgrade to Pro",
    popular: true,
  },
]

const faqs = [
  {
    question: "How does skill verification work?",
    answer:
      "Our blockchain-based verification system uses cryptographic challenges, peer review, and real project outcomes to verify skills. Once verified, your skills are permanently recorded on the blockchain.",
  },
  {
    question: "Are payments really secure?",
    answer:
      "Yes! We use smart contract escrow to hold funds securely. Payments are automatically released when milestones are completed, eliminating payment disputes.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time. Your account will remain active until the end of your current billing period.",
  },
  {
    question: "What's the difference between verification levels?",
    answer:
      "Basic verification covers fundamental skills, while advanced verification includes complex challenges, portfolio review, and peer assessment for premium skills.",
  },
  {
    question: "Do you take a cut from freelancer earnings?",
    answer:
      "No! Freelancers keep 100% of their earnings. Only clients pay platform fees, which fund the verification system and platform development.",
  },
]

export function PricingPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const handleSelectPlan = (planName: string) => {
    if (!isAuthenticated) {
      router.push("/auth/signup")
      return
    }

    if (planName === "Contact Sales") {
      // Handle enterprise contact
      console.log("Contact sales for enterprise plan")
      return
    }

    // Handle plan selection
    console.log(`Selected plan: ${planName}`)
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
              <Link href="/for-clients" className="text-slate-300 hover:text-white transition-colors">
                For Clients
              </Link>
              <Link href="/pricing" className="text-blue-400 font-medium">
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link href={user?.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client"}>
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="text-slate-300 hover:text-white">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 p-6">
        {/* Back to Home Button */}
        <div className="container mx-auto mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Simple,{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Transparent
                </span>{" "}
                Pricing
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                Choose the plan that fits your needs. Upgrade or downgrade at any time.
              </p>
            </motion.div>
          </div>

          {/* Freelancer Plans */}
          <div className="mb-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">For Freelancers</h2>
              <p className="text-slate-400">Build your reputation and find premium projects</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card
                    className={`p-8 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300 h-full ${
                      plan.popular ? "ring-2 ring-blue-500/20" : ""
                    }`}
                  >
                    <div className="text-center mb-8">
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}
                      >
                        <plan.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-slate-400 mb-4">{plan.description}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.period && <span className="text-slate-400">{plan.period}</span>}
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <span className="text-sm text-slate-400">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          : "bg-slate-800 hover:bg-slate-700"
                      }`}
                      onClick={() => handleSelectPlan(plan.cta)}
                    >
                      {plan.cta}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Client Plans */}
          <div className="mb-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">For Clients</h2>
              <p className="text-slate-400">Hire verified talent with confidence</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {clientPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="relative"
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                        Recommended
                      </Badge>
                    </div>
                  )}
                  <Card
                    className={`p-8 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300 h-full ${
                      plan.popular ? "ring-2 ring-amber-500/20" : ""
                    }`}
                  >
                    <div className="text-center mb-8">
                      <div
                        className={`w-16 h-16 rounded-lg bg-gradient-to-r ${plan.color} flex items-center justify-center mx-auto mb-4`}
                      >
                        <plan.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-slate-400 mb-4">{plan.description}</p>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">{plan.price}</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                          <span className="text-sm text-slate-400">{limitation}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                          : "bg-slate-800 hover:bg-slate-700"
                      }`}
                      onClick={() => handleSelectPlan(plan.cta)}
                    >
                      {plan.cta}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-slate-400">Everything you need to know about our pricing</p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-slate-400">{faq.answer}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-slate-400 mb-8">Join thousands of professionals building the future of work</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/for-freelancers">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    Start as Freelancer
                  </Button>
                </Link>
                <Link href="/for-clients">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Start as Client
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

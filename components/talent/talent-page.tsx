"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  MessageSquare,
  Heart,
  Eye,
  Users,
  Award,
  Home,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

const talents = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    title: "Senior Full Stack Developer",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 85,
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript", "AWS"],
    availability: "Available",
    completedProjects: 47,
    successRate: 98,
    totalEarnings: 156000,
    description:
      "Experienced full-stack developer with 8+ years building scalable web applications. Specialized in React, Node.js, and cloud architecture.",
    verified: true,
    topRated: true,
    responseTime: "1 hour",
    languages: ["English", "Mandarin"],
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    avatar: "/placeholder.svg?height=80&width=80",
    title: "Blockchain Developer",
    location: "Austin, TX",
    rating: 4.8,
    reviews: 89,
    hourlyRate: 120,
    skills: ["Solidity", "Web3", "DeFi", "Smart Contracts", "Ethereum"],
    availability: "Busy",
    completedProjects: 32,
    successRate: 96,
    totalEarnings: 98000,
    description:
      "Blockchain specialist with deep expertise in DeFi protocols and smart contract development. Built multiple successful DApps.",
    verified: true,
    topRated: true,
    responseTime: "2 hours",
    languages: ["English", "Spanish"],
  },
  {
    id: 3,
    name: "Emily Johnson",
    avatar: "/placeholder.svg?height=80&width=80",
    title: "UI/UX Designer",
    location: "New York, NY",
    rating: 4.9,
    reviews: 156,
    hourlyRate: 75,
    skills: ["Figma", "Design Systems", "Prototyping", "User Research", "Branding"],
    availability: "Available",
    completedProjects: 63,
    successRate: 99,
    totalEarnings: 124000,
    description:
      "Creative designer focused on user-centered design and modern interfaces. Expert in design systems and user experience optimization.",
    verified: true,
    topRated: false,
    responseTime: "30 minutes",
    languages: ["English"],
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "/placeholder.svg?height=80&width=80",
    title: "DevOps Engineer",
    location: "Seattle, WA",
    rating: 4.7,
    reviews: 73,
    hourlyRate: 95,
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
    availability: "Available",
    completedProjects: 28,
    successRate: 94,
    totalEarnings: 87000,
    description:
      "DevOps specialist with expertise in cloud infrastructure and automation. Helps teams deploy and scale applications efficiently.",
    verified: true,
    topRated: false,
    responseTime: "1 hour",
    languages: ["English", "Korean"],
  },
]

const savedTalents = [
  {
    id: 1,
    name: "Sarah Chen",
    title: "Senior Full Stack Developer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    hourlyRate: 85,
    savedDate: "2024-01-15",
  },
  {
    id: 3,
    name: "Emily Johnson",
    title: "UI/UX Designer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4.9,
    hourlyRate: 75,
    savedDate: "2024-01-12",
  },
]

export function TalentPage() {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const handleMessageTalent = (talentId: number) => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }
    router.push("/messages")
  }

  const handleViewProfile = (talentId: number) => {
    console.log(`Viewing talent profile ${talentId}`)
  }

  const handleSaveTalent = (talentId: number) => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }
    console.log(`Saving talent ${talentId}`)
  }

  const handleHireTalent = (talentId: number) => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }
    console.log(`Hiring talent ${talentId}`)
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
              <Link href="/talent" className="text-blue-400 font-medium">
                Browse Talent
              </Link>
              <Link href="/for-freelancers" className="text-slate-300 hover:text-white transition-colors">
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Browse Talent</h1>
              <p className="text-slate-400">Discover and hire verified Web3 professionals</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-slate-700 bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by skills, name, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="browse">Browse Talent</TabsTrigger>
              <TabsTrigger value="saved">Saved ({savedTalents.length})</TabsTrigger>
              <TabsTrigger value="hired">Hired</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {talents.map((talent, index) => (
                  <motion.div
                    key={talent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="relative">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={talent.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {talent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {talent.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg">{talent.name}</h3>
                              <p className="text-slate-400 text-sm">{talent.title}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {talent.topRated && (
                                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                  <Award className="w-3 h-3 mr-1" />
                                  Top Rated
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => handleSaveTalent(talent.id)}
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4 mb-3 text-sm text-slate-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{talent.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-amber-400 fill-current" />
                              <span>{talent.rating}</span>
                              <span>({talent.reviews} reviews)</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                            <div>
                              <p className="text-slate-400">Rate</p>
                              <p className="font-semibold text-emerald-400">${talent.hourlyRate}/hr</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Success Rate</p>
                              <p className="font-semibold">{talent.successRate}%</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Projects</p>
                              <p className="font-semibold">{talent.completedProjects}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{talent.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {talent.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {talent.skills.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{talent.skills.length - 5} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <Badge
                          className={
                            talent.availability === "Available"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                          }
                        >
                          {talent.availability}
                        </Badge>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>Responds in {talent.responseTime}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          onClick={() => handleMessageTalent(talent.id)}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 bg-transparent"
                          onClick={() => handleViewProfile(talent.id)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-emerald-500 to-teal-500"
                          onClick={() => handleHireTalent(talent.id)}
                        >
                          Hire
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-6">
              {savedTalents.length > 0 ? (
                <div className="space-y-4">
                  {savedTalents.map((talent, index) => (
                    <motion.div
                      key={talent.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="p-4 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={talent.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {talent.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{talent.name}</h3>
                              <p className="text-slate-400 text-sm">{talent.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-amber-400 fill-current" />
                                <span className="text-sm">{talent.rating}</span>
                              </div>
                              <p className="text-sm text-slate-400">${talent.hourlyRate}/hr</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-blue-500 to-cyan-500"
                                onClick={() => handleMessageTalent(talent.id)}
                              >
                                Message
                              </Button>
                              <Button size="sm" variant="outline" className="border-slate-700 bg-transparent">
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Saved Talent</h3>
                  <p className="text-slate-400">Save talented professionals to easily find them later</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="hired" className="space-y-6">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Hired Talent Yet</h3>
                <p className="text-slate-400">Your hired talent will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

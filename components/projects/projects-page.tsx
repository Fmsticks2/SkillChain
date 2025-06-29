"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  MessageSquare,
  FileText,
  Home,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

const projects = [
  {
    id: 1,
    title: "DeFi Dashboard Redesign",
    client: "CryptoVault Inc.",
    budget: 8500,
    spent: 6375,
    progress: 75,
    deadline: "2024-02-15",
    status: "In Progress",
    priority: "High",
    skills: ["React", "TypeScript", "Web3"],
    description: "Complete redesign of the DeFi dashboard with modern UI/UX principles",
    startDate: "2024-01-15",
    milestones: 4,
    completedMilestones: 3,
  },
  {
    id: 2,
    title: "NFT Marketplace Frontend",
    client: "ArtChain Labs",
    budget: 12000,
    spent: 5400,
    progress: 45,
    deadline: "2024-03-01",
    status: "In Progress",
    priority: "Medium",
    skills: ["Next.js", "Solidity", "IPFS"],
    description: "Build a modern NFT marketplace with advanced filtering and search",
    startDate: "2024-01-20",
    milestones: 5,
    completedMilestones: 2,
  },
  {
    id: 3,
    title: "Smart Contract Audit",
    client: "DeFi Protocol",
    budget: 6000,
    spent: 5800,
    progress: 95,
    deadline: "2024-01-30",
    status: "Review",
    priority: "High",
    skills: ["Solidity", "Security", "Testing"],
    description: "Comprehensive security audit of DeFi smart contracts",
    startDate: "2024-01-10",
    milestones: 3,
    completedMilestones: 3,
  },
  {
    id: 4,
    title: "Mobile Wallet App",
    client: "WalletTech",
    budget: 15000,
    spent: 0,
    progress: 0,
    deadline: "2024-04-15",
    status: "Not Started",
    priority: "Low",
    skills: ["React Native", "Web3", "Security"],
    description: "Cross-platform mobile wallet with advanced security features",
    startDate: "2024-02-01",
    milestones: 6,
    completedMilestones: 0,
  },
]

const opportunities = [
  {
    id: 5,
    title: "Web3 Gaming Platform",
    client: "GameFi Studios",
    budget: 15000,
    deadline: "2024-03-15",
    skills: ["React", "Web3", "Gaming"],
    description: "Build a decentralized gaming platform with NFT integration",
    posted: "2 hours ago",
    proposals: 12,
    match: 94,
  },
  {
    id: 6,
    title: "DAO Governance Interface",
    client: "DecentralDAO",
    budget: 9500,
    deadline: "2024-02-28",
    skills: ["Vue.js", "Governance", "UI/UX"],
    description: "Create an intuitive interface for DAO voting and proposals",
    posted: "5 hours ago",
    proposals: 8,
    match: 87,
  },
]

export function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const handleApplyToProject = (projectId: number) => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }
    // Handle project application logic
    console.log(`Applying to project ${projectId}`)
  }

  const handleViewProject = (projectId: number) => {
    // Handle view project details
    console.log(`Viewing project ${projectId}`)
  }

  const handleMessageClient = (projectId: number) => {
    if (!isAuthenticated) {
      router.push("/auth/signin")
      return
    }
    router.push("/messages")
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
              <Link href="/projects" className="text-blue-400 font-medium">
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
              <h1 className="text-3xl font-bold mb-2">Find Projects</h1>
              <p className="text-slate-400">Discover and apply to Web3 projects that match your skills</p>
            </div>
            {isAuthenticated && user?.role === "client" && (
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Post Project
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>
            <Button variant="outline" className="border-slate-700 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="border-slate-700 bg-transparent">
              <Calendar className="w-4 h-4 mr-2" />
              Timeline
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="active">Available Projects</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {opportunities.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                          <p className="text-slate-400 text-sm">{project.client}</p>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          {project.match}% match
                        </Badge>
                      </div>

                      <p className="text-slate-300 text-sm mb-4 line-clamp-2">{project.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-slate-400 text-xs">Budget</p>
                          <p className="font-semibold text-emerald-400">${project.budget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Deadline</p>
                          <p className="font-semibold">{project.deadline}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-slate-400">
                          <span>{project.posted}</span>
                          <span>{project.proposals} proposals</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500"
                          onClick={() => handleApplyToProject(project.id)}
                        >
                          Apply Now
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 bg-transparent"
                          onClick={() => handleViewProject(project.id)}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-700 bg-transparent"
                          onClick={() => handleMessageClient(project.id)}
                        >
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applied" className="space-y-6">
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Applied Projects</h3>
                <p className="text-slate-400">Projects you apply to will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects
                  .filter((p) => p.status !== "Completed")
                  .map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{project.title}</h3>
                            <p className="text-slate-400 text-sm">{project.client}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              className={
                                project.priority === "High"
                                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                                  : project.priority === "Medium"
                                    ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                    : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                              }
                            >
                              {project.priority}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{project.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-slate-400 text-xs">Budget</p>
                            <p className="font-semibold">${project.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs">Spent</p>
                            <p className="font-semibold text-blue-400">${project.spent.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-400">Progress</span>
                            <span className="text-sm font-medium">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>Due {project.deadline}</span>
                          </div>
                          <Badge
                            className={
                              project.status === "In Progress"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : project.status === "Review"
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                  : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                            onClick={() => handleViewProject(project.id)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-700 bg-transparent"
                            onClick={() => handleMessageClient(project.id)}
                          >
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-slate-700 bg-transparent">
                            <FileText className="w-3 h-3" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

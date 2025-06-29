"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Plus,
  Users,
  DollarSign,
  CheckCircle,
  Star,
  BarChart3,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  Target,
  Briefcase,
  Shield,
  MoreHorizontal,
  ArrowUpRight,
  Eye,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Link from "next/link"

const activeProjects = [
  {
    id: 1,
    title: "DeFi Dashboard Redesign",
    freelancer: "John Doe",
    avatar: "/placeholder.svg?height=32&width=32",
    budget: 8500,
    spent: 6375,
    progress: 75,
    deadline: "2024-02-15",
    status: "In Progress",
    skills: ["React", "TypeScript", "Web3"],
    rating: 4.9,
  },
  {
    id: 2,
    title: "Smart Contract Audit",
    freelancer: "Alice Smith",
    avatar: "/placeholder.svg?height=32&width=32",
    budget: 12000,
    spent: 5400,
    progress: 45,
    deadline: "2024-03-01",
    status: "In Progress",
    skills: ["Solidity", "Security", "Testing"],
    rating: 4.8,
  },
  {
    id: 3,
    title: "NFT Marketplace Frontend",
    freelancer: "Bob Wilson",
    avatar: "/placeholder.svg?height=32&width=32",
    budget: 15000,
    spent: 13500,
    progress: 90,
    deadline: "2024-01-30",
    status: "Review",
    skills: ["Next.js", "IPFS", "Web3"],
    rating: 5.0,
  },
]

const topTalent = [
  {
    id: 1,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Full Stack Developer",
    rating: 4.9,
    hourlyRate: 85,
    skills: ["React", "Node.js", "PostgreSQL"],
    availability: "Available",
    completedProjects: 47,
    successRate: 98,
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "Blockchain Developer",
    rating: 4.8,
    hourlyRate: 120,
    skills: ["Solidity", "Web3", "DeFi"],
    availability: "Busy",
    completedProjects: 32,
    successRate: 96,
  },
  {
    id: 3,
    name: "Emily Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    title: "UI/UX Designer",
    rating: 4.9,
    hourlyRate: 75,
    skills: ["Figma", "Design Systems", "Prototyping"],
    availability: "Available",
    completedProjects: 63,
    successRate: 99,
  },
]

function AppSidebar() {
  return (
    <Sidebar className="border-r border-slate-800">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>TC</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">TechCorp Inc.</h3>
            <p className="text-sm text-slate-400">Enterprise Client</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-blue-400 bg-blue-500/10">
              <Target className="w-4 h-4" />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/projects">
              <SidebarMenuButton>
                <Briefcase className="w-4 h-4" />
                Projects
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/talent">
              <SidebarMenuButton>
                <Users className="w-4 h-4" />
                Talent
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/messages">
              <SidebarMenuButton>
                <MessageSquare className="w-4 h-4" />
                Messages
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/analytics">
              <SidebarMenuButton>
                <BarChart3 className="w-4 h-4" />
                Analytics
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/settings">
              <SidebarMenuButton>
                <Settings className="w-4 h-4" />
                Settings
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-950 text-white flex">
        <AppSidebar />

        <div className="flex-1">
          {/* Header */}
          <header className="border-b border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold">Client Dashboard</h1>
                  <p className="text-slate-400">Manage your projects and talent</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search talent, projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-slate-800 border-slate-700"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Project
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Active Projects</p>
                      <p className="text-2xl font-bold text-blue-400">12</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-emerald-400 text-sm">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +3 this month
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Spent</p>
                      <p className="text-2xl font-bold text-emerald-400">$247K</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-emerald-400 text-sm">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +18% this quarter
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Success Rate</p>
                      <p className="text-2xl font-bold text-purple-400">96%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-slate-400 text-sm">47 of 49 projects</div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Avg. Rating</p>
                      <p className="text-2xl font-bold text-amber-400">4.8</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-slate-400 text-sm">From 127 reviews</div>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Active Projects */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Active Projects</h3>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Timeline
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {activeProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={project.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {project.freelancer
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{project.title}</h4>
                              <p className="text-slate-400 text-sm">{project.freelancer}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span className="text-sm">{project.rating}</span>
                            </div>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-slate-400 text-sm">Budget</p>
                            <p className="font-semibold">${project.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-slate-400 text-sm">Spent</p>
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

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {project.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <Badge
                            className={
                              project.status === "In Progress"
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button variant="ghost" className="w-full mt-4">
                    View All Projects
                  </Button>
                </Card>
              </motion.div>

              {/* Top Talent */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Top Talent</h3>
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Verified</Badge>
                  </div>

                  <div className="space-y-4">
                    {topTalent.map((talent, index) => (
                      <motion.div
                        key={talent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={talent.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {talent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium group-hover:text-blue-400 transition-colors">{talent.name}</h4>
                            <p className="text-slate-400 text-sm">{talent.title}</p>
                          </div>
                          <Badge
                            className={
                              talent.availability === "Available"
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            }
                          >
                            {talent.availability}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-amber-400 fill-current" />
                            <span>{talent.rating}</span>
                          </div>
                          <div className="text-slate-400">${talent.hourlyRate}/hr</div>
                          <div className="text-slate-400">{talent.completedProjects} projects</div>
                          <div className="text-emerald-400">{talent.successRate}% success</div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {talent.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Users className="w-4 h-4 mr-2" />
                    Browse All Talent
                  </Button>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <Plus className="w-6 h-6" />
                    <span>Post New Project</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 border-slate-700 hover:bg-slate-800 bg-transparent"
                  >
                    <Search className="w-6 h-6" />
                    <span>Find Talent</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 border-slate-700 hover:bg-slate-800 bg-transparent"
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 border-slate-700 hover:bg-slate-800 bg-transparent"
                  >
                    <Shield className="w-6 h-6" />
                    <span>Escrow Status</span>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

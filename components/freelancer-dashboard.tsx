"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Code,
  Award,
  Target,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Filter,
  ExternalLink,
  ArrowUpRight,
  Zap,
  LogOut,
  Briefcase,
  BarChart3,
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
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

// Type definitions
interface Skill {
  id: string
  name: string
  level: number
  experience: string
  verified: boolean
  projects: number
  earnings: number
}

interface Project {
  id: string
  title: string
  client: string
  avatar?: string
  budget: number
  status: string
  progress: number
  skills: string[]
  deadline: string
  description?: string
  match?: number
  posted?: string
}

// Skills data will be loaded from user's profile
const getSkillsData = (): Skill[] => {
  // In a real app, this would fetch from user's skill profile
  const savedSkills = localStorage.getItem('userSkills')
  if (savedSkills) {
    return JSON.parse(savedSkills)
  }
  return []
}

// Active projects will be loaded from freelancer's accepted projects
const getActiveProjects = (): Project[] => {
  // In a real app, this would fetch from freelancer's project assignments
  const savedProjects = localStorage.getItem('freelancerProjects')
  if (savedProjects) {
    return JSON.parse(savedProjects)
  }
  return []
}

// Recommended projects will be loaded based on freelancer's skills
const getRecommendedProjects = (): Project[] => {
  // In a real app, this would fetch projects matching freelancer's skills
  const savedRecommendations = localStorage.getItem('recommendedProjects')
  if (savedRecommendations) {
    return JSON.parse(savedRecommendations)
  }
  return []
}

function AppSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    // Load user profile from localStorage
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const displayName = `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'Freelancer'
  const initials = `${userProfile?.firstName?.[0] || ''}${userProfile?.lastName?.[0] || ''}`.toUpperCase() || 'FL'

  return (
    <Sidebar className="border-r border-slate-700/50 bg-gradient-to-b from-slate-900 to-slate-950">
      <SidebarHeader className="p-6 border-b border-slate-700/30">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 ring-2 ring-blue-500/20">
            <AvatarImage src="/placeholder.svg?height=48&width=48" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white text-lg">{displayName}</h3>
            <p className="text-sm text-blue-300/80">Blockchain Developer</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton className="text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg border-0 rounded-lg py-3 px-4 font-medium">
              <Target className="w-5 h-5" />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/projects">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <Briefcase className="w-5 h-5" />
                Projects
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/skills">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <Award className="w-5 h-5" />
                Skills
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/messages">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <MessageSquare className="w-5 h-5" />
                Messages
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/analytics">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <BarChart3 className="w-5 h-5" />
                Analytics
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/settings">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <Settings className="w-5 h-5" />
                Settings
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-auto pt-4 border-t border-slate-700/30">
            <SidebarMenuButton onClick={handleLogout} className="text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-lg py-3 px-4 transition-all duration-200 border-0">
              <LogOut className="w-5 h-5" />
              Sign Out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export function FreelancerDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const [skillsData, setSkillsData] = useState<Skill[]>([])
  const [activeProjects, setActiveProjects] = useState<Project[]>([])
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([])

  useEffect(() => {
    // Load dynamic data when component mounts
    setSkillsData(getSkillsData())
    setActiveProjects(getActiveProjects())
    setRecommendedProjects(getRecommendedProjects())
  }, [])

  return (
    <SidebarProvider>
      <div className="h-screen w-screen bg-slate-950 text-white flex overflow-hidden">
        <AppSidebar />

        <div className="flex-1">
          {/* Header */}
          <header className="border-b border-slate-800 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <p className="text-slate-400">Welcome back, John!</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" onClick={() => console.log('Search clicked')}>
                  <Search className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => console.log('Notifications clicked')}>
                  <Bell className="w-5 h-5" />
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => console.log('Boost Profile clicked')}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Boost Profile
                </Button>
              </div>
            </div>
          </header>

          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Reputation Score</p>
                      <p className="text-2xl font-bold text-emerald-400">4.9</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={98} className="h-2" />
                    <p className="text-xs text-slate-400 mt-2">Top 2% of developers</p>
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold text-blue-400">$47,320</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-emerald-400 text-sm">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +12% this month
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Active Projects</p>
                      <p className="text-2xl font-bold text-purple-400">3</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-slate-400 text-sm">2 due this week</div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Success Rate</p>
                      <p className="text-2xl font-bold text-emerald-400">98%</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-slate-400 text-sm">47 of 48 projects</div>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Skills Portfolio */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2"
              >
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Skills Portfolio</h3>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {skillsData.length > 0 ? (
                      skillsData.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <Code className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium">{skill.name}</h4>
                              <div className="flex items-center space-x-2">
                                {skill.verified && (
                                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                <span className="text-sm text-slate-400">
                                  {skill.projects} projects • ${skill.earnings.toLocaleString()} earned
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-blue-400">{skill.level}%</p>
                          </div>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Code className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400 mb-4">No Skills Added Yet</p>
                        <Button 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          onClick={() => console.log('Add Your First Skill clicked')}
                        >
                          Add Your First Skill
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Recommended Projects */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Recommended</h3>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">AI Matched</Badge>
                  </div>

                  <div className="space-y-4">
                    {recommendedProjects.length > 0 ? (
                      recommendedProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium group-hover:text-blue-400 transition-colors">{project.title}</h4>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            {project.match}% match
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">{project.client}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-semibold text-blue-400">
                            ${project.budget.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400">{project.posted}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {project.skills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Target className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400 mb-4">No Recommended Projects</p>
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                          Browse All Projects
                        </Button>
                      </div>
                    )}
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    View All Opportunities
                  </Button>
                </Card>
              </motion.div>
            </div>

            {/* Active Projects */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
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
                  {activeProjects.length > 0 ? (
                    activeProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-lg">{project.title}</h4>
                          <p className="text-slate-400">{project.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-400">${project.budget.toLocaleString()}</p>
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
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>Due {project.deadline}</span>
                        </div>
                      </div>
                    </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">No Active Projects</p>
                      <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                        Find Projects
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

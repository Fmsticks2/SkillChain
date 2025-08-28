"use client"

import { useState, useEffect } from "react"
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
  LogOut,
  Wallet,
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
  freelancer?: string
  rating?: number
  spent?: number
}

interface Talent {
  id: string
  name: string
  avatar?: string
  title: string
  rating: number
  hourlyRate: number
  skills: string[]
  location?: string
  availability?: string
  completedProjects?: number
  successRate?: number
}

// Active projects will be loaded from user's actual project data
const getActiveProjects = (): Project[] => {
  // In a real app, this would fetch from an API or database
  // For now, return empty array - projects will be added when user creates them
  const savedProjects = localStorage.getItem('userProjects')
  if (savedProjects) {
    return JSON.parse(savedProjects)
  }
  return []
}

// Top talent will be loaded from platform's freelancer data
const getTopTalent = (): Talent[] => {
  // In a real app, this would fetch from an API
  // For now, return empty array - talent will be populated from actual freelancer profiles
  const savedTalent = localStorage.getItem('platformTalent')
  if (savedTalent) {
    return JSON.parse(savedTalent)
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

  const displayName = userProfile?.company || `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim() || 'Client'
  const initials = userProfile?.company 
    ? userProfile.company.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase()
    : `${userProfile?.firstName?.[0] || ''}${userProfile?.lastName?.[0] || ''}`.toUpperCase() || 'CL'

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
            <p className="text-sm text-blue-300/80">{userProfile?.company ? 'Enterprise Client' : 'Client'}</p>
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
            <Link href="/dashboard/client/projects">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <Briefcase className="w-5 h-5" />
                Projects
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/client/talent">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <Users className="w-5 h-5" />
                Talent
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/client/messages">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <MessageSquare className="w-5 h-5" />
                Messages
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/client/analytics">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <BarChart3 className="w-5 h-5" />
                Analytics
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/wallet">
              <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg py-3 px-4 transition-all duration-200 border-0">
                <Wallet className="w-5 h-5" />
                Crypto Payments
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/dashboard/client/settings">
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

export function ClientDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeProjects, setActiveProjects] = useState<Project[]>([])
  const [topTalent, setTopTalent] = useState<Talent[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Load user's projects and available talent
    setActiveProjects(getActiveProjects())
    setTopTalent(getTopTalent())
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
                  <h1 className="text-2xl font-bold">Client Dashboard</h1>
                  <p className="text-slate-400">Welcome back, {user?.firstName || 'User'}!</p>
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
                <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/client/notifications')}>
                  <Bell className="w-5 h-5" />
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  onClick={() => router.push('/dashboard/client/projects/new')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Project
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
                      <p className="text-xs text-slate-500 mt-1">≈ 10.8 BTC • 185K USDC</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-emerald-400 text-sm">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      +18% this quarter
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-emerald-400 hover:text-emerald-300"
                      onClick={() => router.push('/wallet')}
                    >
                      Pay with Crypto
                    </Button>
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
                      <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/client/projects?view=filter')}>
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/client/projects?view=timeline')}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Timeline
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {activeProjects.length === 0 ? (
                      <div className="text-center py-8">
                        <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-slate-400 mb-2">No Active Projects</h4>
                        <p className="text-slate-500 mb-4">Start by posting your first project to find talented freelancers.</p>
                        <Button 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          onClick={() => router.push('/dashboard/client/projects/new')}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Post Your First Project
                        </Button>
                      </div>
                    ) : (
                      activeProjects.map((project, index) => (
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
                              <AvatarFallback className="bg-slate-700">
                                {project.freelancer
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("") || "FL"}
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
                            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => router.push(`/dashboard/client/projects/${project.id}`)}>
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
                            <p className="font-semibold text-blue-400">${project.spent?.toLocaleString() || '0'}</p>
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
                      ))
                    )}
                  </div>

                  <Button variant="ghost" className="w-full mt-4" onClick={() => router.push('/dashboard/client/projects')}>
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
                    {topTalent.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-slate-400 mb-2">No Talent Available</h4>
                        <p className="text-slate-500 mb-4">Browse our marketplace to discover skilled freelancers.</p>
                        <Button 
                          variant="outline" 
                          className="border-slate-700 hover:bg-slate-800"
                          onClick={() => router.push('/dashboard/client/talent')}
                        >
                          <Search className="w-4 h-4 mr-2" />
                          Browse Talent
                        </Button>
                      </div>
                    ) : (
                      topTalent.map((talent, index) => (
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
                            onClick={() => router.push(`/dashboard/client/messages?user=${talent.id}`)}
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => router.push(`/dashboard/client/talent/${talent.id}`)}>
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </motion.div>
                      ))
                    )}
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" onClick={() => router.push('/dashboard/client/talent')}>
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
                  <Button className="h-20 flex-col space-y-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600" onClick={() => router.push('/dashboard/client/projects/new')}>
                    <Plus className="w-6 h-6" />
                    <span>Post New Project</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 border-slate-700 hover:bg-slate-800 bg-transparent"
                    onClick={() => router.push('/dashboard/client/talent')}
                  >
                    <Search className="w-6 h-6" />
                    <span>Find Talent</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 border-slate-700 hover:bg-slate-800 bg-transparent"
                    onClick={() => router.push('/dashboard/client/analytics')}
                  >
                    <BarChart3 className="w-6 h-6" />
                    <span>View Analytics</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 border-slate-700 hover:bg-slate-800 bg-transparent"
                    onClick={() => router.push('/dashboard/client/escrow')}
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

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
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Settings,
  BarChart3,
  DollarSign,
  TrendingUp,
  Clock,
  MoreHorizontal,
  LogOut,
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
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

// Define TypeScript interfaces for different user types
interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  avatar: string;
}

interface PendingFreelancer extends BaseUser {
  skills: string[];
  documents: number;
}

interface PendingClient extends BaseUser {
  company: string;
  documents: number;
}

interface VerifiedFreelancer extends BaseUser {
  lastActive: string;
  projects: number;
  earnings: number;
}

interface VerifiedClient extends BaseUser {
  lastActive: string;
  projects: number;
  spent: number;
}

interface ReportedUser extends BaseUser {
  reports: number;
  reason: string;
  reportDate: string;
}

type User = PendingFreelancer | PendingClient | VerifiedFreelancer | VerifiedClient | ReportedUser;

// Type guard functions
function isVerifiedFreelancer(user: User): user is VerifiedFreelancer {
  return user.role === 'freelancer' && user.status === 'verified';
}

function isVerifiedClient(user: User): user is VerifiedClient {
  return user.role === 'client' && user.status === 'verified';
}

function isPendingFreelancer(user: User): user is PendingFreelancer {
  return user.role === 'freelancer' && user.status === 'pending';
}

function isPendingClient(user: User): user is PendingClient {
  return user.role === 'client' && user.status === 'pending';
}

function isReportedUser(user: User): user is ReportedUser {
  return 'reports' in user && 'reason' in user;
}

// Combined type guards for skills and company access
function hasSkills(user: User): user is PendingFreelancer | VerifiedFreelancer {
  return user.role === 'freelancer';
}

function hasCompany(user: User): user is PendingClient | VerifiedClient {
  return user.role === 'client';
}

const pendingUsers: (PendingFreelancer | PendingClient)[] = [
  {
    id: "4",
    name: "Alex Thompson",
    email: "alex@example.com",
    role: "freelancer",
    skills: ["React", "Node.js", "Python"],
    joinDate: "2024-01-20",
    status: "pending",
    documents: 3,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Maria Garcia",
    email: "maria@startup.com",
    role: "client",
    company: "Tech Startup Inc.",
    joinDate: "2024-01-18",
    status: "pending",
    documents: 2,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "David Chen",
    email: "david@freelance.com",
    role: "freelancer",
    skills: ["Solidity", "Web3", "Smart Contracts"],
    joinDate: "2024-01-22",
    status: "pending",
    documents: 4,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

const allUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "freelancer",
    status: "verified",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    projects: 12,
    earnings: 45000,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@techcorp.com",
    role: "client",
    status: "verified",
    joinDate: "2024-01-10",
    lastActive: "1 day ago",
    projects: 8,
    spent: 120000,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  ...pendingUsers,
]

const reportedUsers: ReportedUser[] = [
  {
    id: "7",
    name: "Suspicious User",
    email: "suspicious@example.com",
    role: "freelancer",
    reports: 3,
    reason: "Fake portfolio, missed deadlines",
    reportDate: "2024-01-19",
    joinDate: "2024-01-15",
    status: "under_review",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

function AdminSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  
  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <Sidebar className="border-r border-slate-800">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar || "/placeholder.svg"} />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">Admin Panel</h3>
            <p className="text-sm text-slate-400">System Administrator</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-blue-400 bg-blue-500/10">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Users className="w-4 h-4" />
              User Management
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Shield className="w-4 h-4" />
              Verification
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <AlertTriangle className="w-4 h-4" />
              Reports
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="w-4 h-4" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")

  const handleVerifyUser = (userId: string) => {
    console.log("Verifying user:", userId)
    // Implement verification logic
  }

  const handleRejectUser = (userId: string) => {
    console.log("Rejecting user:", userId)
    // Implement rejection logic
  }

  const handleSuspendUser = (userId: string) => {
    console.log("Suspending user:", userId)
    // Implement suspension logic
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-slate-950 text-white flex">
        <AdminSidebar />

        <div className="flex-1">
          {/* Header */}
          <header className="border-b border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                  <p className="text-slate-400">Manage users and platform operations</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-slate-800 border-slate-700"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Filter className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </header>

          <div className="p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Users</p>
                      <p className="text-2xl font-bold text-blue-400">2,847</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-emerald-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +12% this month
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Pending Verification</p>
                      <p className="text-2xl font-bold text-amber-400">{pendingUsers.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-slate-400 text-sm">Requires attention</div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Platform Revenue</p>
                      <p className="text-2xl font-bold text-emerald-400">$847K</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-emerald-400 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    +8% this month
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Active Reports</p>
                      <p className="text-2xl font-bold text-red-400">{reportedUsers.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-red-400 text-sm">Needs investigation</div>
                </Card>
              </motion.div>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="bg-slate-800 border-slate-700">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="verification">Verification Queue</TabsTrigger>
                <TabsTrigger value="users">All Users</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Verifications */}
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <h3 className="text-xl font-semibold mb-4">Recent Verifications</h3>
                    <div className="space-y-4">
                      {pendingUsers.slice(0, 3).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-slate-400">{user.role}</p>
                            </div>
                          </div>
                          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Pending</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Platform Statistics */}
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <h3 className="text-xl font-semibold mb-4">Platform Statistics</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Freelancers</span>
                        <span className="font-semibold">1,847</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Clients</span>
                        <span className="font-semibold">1,000</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Active Projects</span>
                        <span className="font-semibold">342</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Completed Projects</span>
                        <span className="font-semibold">2,156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Success Rate</span>
                        <span className="font-semibold text-emerald-400">96.8%</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="verification" className="space-y-6">
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Verification Queue</h3>
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      {pendingUsers.length} Pending
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {pendingUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-slate-400 text-sm">{user.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {user.role}
                                </Badge>
                                <span className="text-xs text-slate-400">Applied {user.joinDate}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleVerifyUser(user.id)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectUser(user.id)}>
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Documents:</span>
                            <span className="ml-2">{user.documents} uploaded</span>
                          </div>
                          {hasSkills(user) && isPendingFreelancer(user) && (
                            <div>
                              <span className="text-slate-400">Skills:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.skills.map((skill: string) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {hasCompany(user) && isPendingClient(user) && (
                            <div>
                              <span className="text-slate-400">Company:</span>
                              <span className="ml-2">{user.company}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <div className="text-sm">
                            <span className="text-slate-400">Email:</span>
                            <span className="ml-2">{user.email}</span>
                          </div>
                          {hasSkills(user) && (
                            <div className="text-sm">
                              <span className="text-slate-400">Skills:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {user.skills.map((skill: string) => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {hasCompany(user) && (
                            <div className="text-sm">
                              <span className="text-slate-400">Company:</span>
                              <span className="ml-2">{user.company}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">All Users</h3>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {allUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-slate-400 text-sm">{user.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {user.role}
                                </Badge>
                                <Badge
                                  className={
                                    user.status === "verified"
                                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                      : user.status === "pending"
                                        ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                        : "bg-red-500/20 text-red-400 border-red-500/30"
                                  }
                                >
                                  {user.status}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right text-sm">
                              <p className="text-slate-400">{user.role === "freelancer" ? "Projects:" : "Spent:"}</p>
                              <p className="font-medium">
                                {isVerifiedFreelancer(user)
                                  ? `${user.projects} projects`
                                  : isVerifiedClient(user)
                                    ? `$${user.spent.toLocaleString()}`
                                    : "0"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">User Reports</h3>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                      {reportedUsers.length} Active
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {reportedUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-slate-800/50 rounded-lg border border-red-500/20"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{user.name}</h4>
                              <p className="text-slate-400 text-sm">{user.email}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {user.role}
                                </Badge>
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                  {user.reports} reports
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                              <Eye className="w-4 h-4 mr-1" />
                              Investigate
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleSuspendUser(user.id)}>
                              <Ban className="w-4 h-4 mr-1" />
                              Suspend
                            </Button>
                          </div>
                        </div>

                        <div className="bg-red-900/20 p-3 rounded border border-red-500/30">
                          <p className="text-sm text-red-300 mb-1">
                            <strong>Reason:</strong> {user.reason}
                          </p>
                          <p className="text-xs text-slate-400">Reported on {user.reportDate}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

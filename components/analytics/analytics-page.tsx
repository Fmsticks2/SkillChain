"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Clock, Star, Target, Download, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react"

const timeframes = ["7d", "30d", "90d", "1y"]

const metrics = [
  {
    title: "Total Earnings",
    value: "$47,320",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Active Projects",
    value: "12",
    change: "+3",
    trend: "up",
    icon: Target,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Client Rating",
    value: "4.9",
    change: "+0.1",
    trend: "up",
    icon: Star,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Response Time",
    value: "2.3h",
    change: "-0.5h",
    trend: "up",
    icon: Clock,
    color: "from-purple-500 to-pink-500",
  },
]

const projectData = [
  { name: "DeFi Dashboard", earnings: 8500, hours: 120, rating: 4.9, status: "Completed" },
  { name: "NFT Marketplace", earnings: 12000, hours: 180, rating: 4.8, status: "In Progress" },
  { name: "Smart Contract Audit", earnings: 6000, hours: 80, rating: 5.0, status: "Completed" },
  { name: "Mobile Wallet", earnings: 15000, hours: 200, rating: 4.7, status: "In Progress" },
]

export function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-slate-400">Track your performance and earnings</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-900/50 rounded-lg p-1">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={selectedTimeframe === timeframe ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-slate-800"}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
            <Button variant="outline" className="border-slate-700 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center`}
                  >
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-sm ${
                      metric.trend === "up" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                <p className="text-slate-400 text-sm">{metric.title}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Chart */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <h3 className="text-xl font-semibold mb-6">Earnings Trend</h3>
                  <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg">
                    <p className="text-slate-400">Chart visualization would go here</p>
                  </div>
                </Card>
              </motion.div>

              {/* Project Distribution */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <h3 className="text-xl font-semibold mb-6">Project Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>In Progress</span>
                      </div>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span>Completed</span>
                      </div>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span>Under Review</span>
                      </div>
                      <span className="font-semibold">3</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: "Project completed", project: "DeFi Dashboard", time: "2 hours ago", amount: "$8,500" },
                    { action: "Payment received", project: "NFT Marketplace", time: "1 day ago", amount: "$6,000" },
                    { action: "New project started", project: "Mobile Wallet", time: "3 days ago", amount: "$15,000" },
                    {
                      action: "Milestone completed",
                      project: "Smart Contract Audit",
                      time: "1 week ago",
                      amount: "$2,000",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-slate-400 text-sm">{activity.project}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-400">{activity.amount}</p>
                        <p className="text-slate-400 text-sm">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <h3 className="text-xl font-semibold mb-6">Earnings Breakdown</h3>
                <div className="h-96 flex items-center justify-center bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400">Detailed earnings chart would go here</p>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Project Performance</h3>
                  <Button variant="outline" className="border-slate-700 bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4">Project</th>
                        <th className="text-left py-3 px-4">Earnings</th>
                        <th className="text-left py-3 px-4">Hours</th>
                        <th className="text-left py-3 px-4">Rating</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectData.map((project, index) => (
                        <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                          <td className="py-3 px-4 font-medium">{project.name}</td>
                          <td className="py-3 px-4 text-emerald-400">${project.earnings.toLocaleString()}</td>
                          <td className="py-3 px-4">{project.hours}h</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-amber-400 fill-current" />
                              <span>{project.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                project.status === "Completed"
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                  : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              }
                            >
                              {project.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <h3 className="text-xl font-semibold mb-6">Skill Performance</h3>
                  <div className="space-y-4">
                    {[
                      { skill: "React", projects: 15, rating: 4.9, earnings: 28500 },
                      { skill: "TypeScript", projects: 12, rating: 4.8, earnings: 22000 },
                      { skill: "Node.js", projects: 8, rating: 4.7, earnings: 18000 },
                      { skill: "Web3", projects: 6, rating: 5.0, earnings: 24000 },
                    ].map((skill, index) => (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{skill.skill}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="text-sm">{skill.rating}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                          <div>
                            <span>{skill.projects} projects</span>
                          </div>
                          <div>
                            <span className="text-emerald-400">${skill.earnings.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                  <h3 className="text-xl font-semibold mb-6">Client Feedback</h3>
                  <div className="space-y-4">
                    {[
                      {
                        client: "CryptoVault Inc.",
                        rating: 5,
                        feedback: "Exceptional work on the dashboard redesign. Highly recommended!",
                      },
                      { client: "ArtChain Labs", rating: 4, feedback: "Great communication and delivered on time." },
                      {
                        client: "DeFi Protocol",
                        rating: 5,
                        feedback: "Outstanding security audit. Found critical issues we missed.",
                      },
                      {
                        client: "GameFi Studios",
                        rating: 4,
                        feedback: "Solid development skills and good problem-solving.",
                      },
                    ].map((review, index) => (
                      <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{review.client}</h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? "text-amber-400 fill-current" : "text-slate-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm">{review.feedback}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Clock, 
  Star,
  Award,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

export default function FreelancerAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')

  const stats = {
    totalEarnings: 15750,
    earningsChange: 12.5,
    activeProjects: 4,
    projectsChange: -2,
    completedProjects: 23,
    completedChange: 8.3,
    avgRating: 4.8,
    ratingChange: 0.2,
    responseTime: '2.3 hours',
    timeChange: -15,
    profileViews: 156,
    viewsChange: 23.1
  }

  const monthlyEarnings = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 1800 },
    { month: 'Mar', amount: 3200 },
    { month: 'Apr', amount: 2800 },
    { month: 'May', amount: 3600 },
    { month: 'Jun', amount: 2200 }
  ]

  const topSkills = [
    { skill: 'React.js', projects: 12, earnings: 8500, avgRate: 45 },
    { skill: 'Node.js', projects: 8, earnings: 4200, avgRate: 42 },
    { skill: 'UI/UX Design', projects: 6, earnings: 2800, avgRate: 38 },
    { skill: 'Python', projects: 4, earnings: 2100, avgRate: 40 }
  ]

  const recentProjects = [
    {
      id: '1',
      title: 'E-commerce Platform',
      client: 'TechCorp',
      status: 'Completed',
      earnings: 4500,
      rating: 5,
      completedDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mobile App Design',
      client: 'StartupXYZ',
      status: 'In Progress',
      earnings: 2800,
      rating: null,
      completedDate: null
    },
    {
      id: '3',
      title: 'Website Redesign',
      client: 'DesignCo',
      status: 'Completed',
      earnings: 1200,
      rating: 4.8,
      completedDate: '2024-01-10'
    }
  ]

  const getChangeIcon = (change) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  const getChangeColor = (change) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
            <p className="text-slate-600 mt-2">Track your freelance performance and earnings</p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-slate-900">${stats.totalEarnings.toLocaleString()}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(stats.earningsChange)}
                    <span className={`text-sm ${getChangeColor(stats.earningsChange)}`}>
                      {Math.abs(stats.earningsChange)}% from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Projects</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.activeProjects}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(stats.projectsChange)}
                    <span className={`text-sm ${getChangeColor(stats.projectsChange)}`}>
                      {Math.abs(stats.projectsChange)} from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed Projects</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.completedProjects}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(stats.completedChange)}
                    <span className={`text-sm ${getChangeColor(stats.completedChange)}`}>
                      {Math.abs(stats.completedChange)}% from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Average Rating</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.avgRating}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(stats.ratingChange)}
                    <span className={`text-sm ${getChangeColor(stats.ratingChange)}`}>
                      {Math.abs(stats.ratingChange)} from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.responseTime}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(stats.timeChange)}
                    <span className={`text-sm ${getChangeColor(stats.timeChange)}`}>
                      {Math.abs(stats.timeChange)}% from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Profile Views</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.profileViews}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {getChangeIcon(stats.viewsChange)}
                    <span className={`text-sm ${getChangeColor(stats.viewsChange)}`}>
                      {Math.abs(stats.viewsChange)}% from last period
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-cyan-100 rounded-lg">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="earnings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="skills">Skills Performance</TabsTrigger>
            <TabsTrigger value="projects">Recent Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="earnings" className="space-y-6">
            {/* Monthly Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Monthly Earnings Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {monthlyEarnings.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-md transition-all hover:from-blue-600 hover:to-cyan-600"
                        style={{ height: `${(data.amount / 4000) * 200}px` }}
                      ></div>
                      <span className="text-sm text-slate-600 mt-2">{data.month}</span>
                      <span className="text-xs text-slate-500">${data.amount}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            {/* Top Skills Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Top Performing Skills</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSkills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{skill.skill}</h4>
                          <p className="text-sm text-slate-600">{skill.projects} projects completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${skill.earnings.toLocaleString()}</p>
                        <p className="text-sm text-slate-600">${skill.avgRate}/hr avg</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Recent Projects</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{project.title}</h4>
                        <p className="text-sm text-slate-600">Client: {project.client}</p>
                        {project.completedDate && (
                          <p className="text-xs text-slate-500">Completed: {project.completedDate}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${project.earnings.toLocaleString()}</p>
                          {project.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-sm text-slate-600">{project.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Briefcase, 
  Clock,
  Star,
  Target,
  Calendar,
  Download
} from 'lucide-react'

export default function ClientAnalyticsPage() {
  const stats = [
    {
      title: 'Total Spent',
      value: '$24,580',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign
    },
    {
      title: 'Active Projects',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Briefcase
    },
    {
      title: 'Freelancers Hired',
      value: '23',
      change: '+5',
      trend: 'up',
      icon: Users
    },
    {
      title: 'Avg. Project Time',
      value: '18 days',
      change: '-3 days',
      trend: 'down',
      icon: Clock
    }
  ]

  const projectPerformance = [
    {
      name: 'E-commerce Website',
      freelancer: 'Sarah Johnson',
      budget: '$5,000',
      spent: '$3,200',
      progress: 64,
      status: 'On Track',
      rating: 4.9
    },
    {
      name: 'Mobile App Design',
      freelancer: 'Michael Chen',
      budget: '$3,000',
      spent: '$2,800',
      progress: 85,
      status: 'Near Completion',
      rating: 4.8
    },
    {
      name: 'Marketing Campaign',
      freelancer: 'Lisa Wang',
      budget: '$2,500',
      spent: '$1,200',
      progress: 45,
      status: 'In Progress',
      rating: 4.7
    }
  ]

  const topFreelancers = [
    {
      name: 'Sarah Johnson',
      projects: 5,
      totalEarned: '$12,500',
      rating: 4.9,
      specialty: 'Full Stack Development'
    },
    {
      name: 'Michael Chen',
      projects: 3,
      totalEarned: '$8,200',
      rating: 4.8,
      specialty: 'UI/UX Design'
    },
    {
      name: 'Emily Rodriguez',
      projects: 4,
      totalEarned: '$9,800',
      rating: 4.9,
      specialty: 'Mobile Development'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-slate-400 mt-2">Track your project performance and spending</p>
          </div>
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className="bg-blue-900 p-3 rounded-full">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-slate-400 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Project Performance */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Target className="w-5 h-5 mr-2" />
                Project Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projectPerformance.map((project) => (
                  <div key={project.name} className="border-b border-slate-800 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{project.name}</h4>
                      <Badge variant={project.status === 'On Track' ? 'default' : project.status === 'Near Completion' ? 'secondary' : 'outline'} className="bg-slate-800 text-slate-300">
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">by {project.freelancer}</p>
                    <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                      <span>Budget: {project.budget}</span>
                      <span>Spent: {project.spent}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Progress value={project.progress} className="flex-1 mr-4" />
                      <span className="text-sm font-medium text-white">{project.progress}%</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-white">{project.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Freelancers */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Users className="w-5 h-5 mr-2" />
                Top Freelancers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topFreelancers.map((freelancer, index) => (
                  <div key={freelancer.name} className="flex items-center space-x-4 p-4 bg-slate-800 rounded-lg">
                    <div className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{freelancer.name}</h4>
                      <p className="text-sm text-slate-400">{freelancer.specialty}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span className="text-xs font-medium text-white">{freelancer.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">{freelancer.totalEarned}</p>
                      <p className="text-sm text-slate-400">{freelancer.projects} projects</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Spending Chart Placeholder */}
        <Card className="mt-8 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Calendar className="w-5 h-5 mr-2" />
              Monthly Spending Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-slate-400">
                <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium text-white">Spending Chart</p>
                <p className="text-sm">Chart visualization would be implemented here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
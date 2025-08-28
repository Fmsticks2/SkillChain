'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  MapPin, 
  Star, 
  Heart,
  Send,
  Bookmark,
  TrendingUp
} from 'lucide-react'

export default function FreelancerProjectsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('browse')

  const availableProjects = [
    {
      id: '1',
      title: 'E-commerce Website Development',
      description: 'Looking for an experienced full-stack developer to build a modern e-commerce platform with React and Node.js. The project includes user authentication, payment integration, and admin dashboard.',
      client: 'Tech Innovations Inc.',
      clientAvatar: '/placeholder-user.jpg',
      budget: '$3,000 - $5,000',
      duration: '2-3 months',
      location: 'Remote',
      posted: '2 hours ago',
      proposals: 8,
      skills: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      match: 95,
      saved: false
    },
    {
      id: '2',
      title: 'Mobile App UI/UX Design',
      description: 'Need a creative designer to create user interface designs for our iOS and Android mobile application. Must have experience with modern design principles and mobile-first approach.',
      client: 'StartupXYZ',
      clientAvatar: '/placeholder-user.jpg',
      budget: '$2,000 - $3,500',
      duration: '1-2 months',
      location: 'Remote',
      posted: '5 hours ago',
      proposals: 12,
      skills: ['UI/UX', 'Figma', 'Mobile Design', 'Prototyping'],
      match: 88,
      saved: true
    },
    {
      id: '3',
      title: 'Python Data Analysis Script',
      description: 'Looking for a Python developer to create data analysis scripts for processing large datasets. Experience with pandas, numpy, and data visualization libraries required.',
      client: 'DataCorp',
      clientAvatar: '/placeholder-user.jpg',
      budget: '$800 - $1,200',
      duration: '2-4 weeks',
      location: 'Remote',
      posted: '1 day ago',
      proposals: 15,
      skills: ['Python', 'Pandas', 'Data Analysis', 'Matplotlib'],
      match: 92,
      saved: false
    }
  ]

  const myProjects = [
    {
      id: '1',
      title: 'Corporate Website Redesign',
      client: 'ABC Corporation',
      status: 'In Progress',
      progress: 65,
      budget: '$4,500',
      deadline: '2024-02-15',
      lastUpdate: '2 hours ago'
    },
    {
      id: '2',
      title: 'Mobile App Development',
      client: 'TechStart',
      status: 'Review',
      progress: 90,
      budget: '$6,000',
      deadline: '2024-02-10',
      lastUpdate: '1 day ago'
    }
  ]

  const proposals = [
    {
      id: '1',
      title: 'E-learning Platform',
      client: 'EduTech Solutions',
      proposedBudget: '$3,500',
      status: 'Pending',
      submittedDate: '2024-01-20',
      responseTime: '3 days'
    },
    {
      id: '2',
      title: 'Inventory Management System',
      client: 'RetailCorp',
      proposedBudget: '$2,800',
      status: 'Shortlisted',
      submittedDate: '2024-01-18',
      responseTime: '5 days'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-2">Find and manage your freelance projects</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse Projects</TabsTrigger>
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="proposals">My Proposals</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search projects by title, skills, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="writing">Writing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Projects */}
            <div className="space-y-6">
              {availableProjects.map((project) => (
                <Card key={project.id} className="bg-slate-900 border-slate-800 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {project.match}% match
                          </Badge>
                        </div>
                        <p className="text-slate-400 mb-4">{project.description}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Bookmark className={`w-4 h-4 ${project.saved ? 'fill-current text-blue-500' : ''}`} />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={project.clientAvatar} alt={project.client} />
                          <AvatarFallback>{project.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{project.client}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {project.budget}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {project.duration}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span>Posted {project.posted}</span>
                        <span>{project.proposals} proposals</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                          <Send className="w-4 h-4 mr-2" />
                          Submit Proposal
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-projects" className="space-y-6">
            <div className="grid gap-6">
              {myProjects.map((project) => (
                <Card key={project.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                        <p className="text-slate-400">Client: {project.client}</p>
                      </div>
                      <Badge variant={project.status === 'In Progress' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-400">Budget</p>
                        <p className="font-medium text-white">{project.budget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Deadline</p>
                        <p className="font-medium text-white">{project.deadline}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Progress</p>
                        <p className="font-medium text-white">{project.progress}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Last Update</p>
                        <p className="font-medium text-white">{project.lastUpdate}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        View Details
                      </Button>
                      <Button size="sm">
                        Update Progress
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="proposals" className="space-y-6">
            <div className="grid gap-6">
              {proposals.map((proposal) => (
                <Card key={proposal.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{proposal.title}</h3>
                        <p className="text-slate-400">Client: {proposal.client}</p>
                      </div>
                      <Badge variant={proposal.status === 'Shortlisted' ? 'default' : 'secondary'}>
                        {proposal.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-400">Proposed Budget</p>
                        <p className="font-medium text-white">{proposal.proposedBudget}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Submitted</p>
                        <p className="font-medium text-white">{proposal.submittedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Response Time</p>
                        <p className="font-medium text-white">{proposal.responseTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        View Proposal
                      </Button>
                      <Button size="sm">
                        Edit Proposal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
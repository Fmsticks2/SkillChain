'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, Filter, Search, Calendar, DollarSign, Clock, Users } from 'lucide-react'
import Link from 'next/link'

export default function ClientProjectsPage() {
  const projects = [
    {
      id: '1',
      title: 'E-commerce Website Development',
      description: 'Build a modern e-commerce platform with React and Node.js',
      budget: 5000,
      proposals: 12,
      status: 'Active',
      deadline: '2024-02-15',
      skills: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: '2',
      title: 'Mobile App UI/UX Design',
      description: 'Design user interface for iOS and Android mobile application',
      budget: 3000,
      proposals: 8,
      status: 'In Review',
      deadline: '2024-02-20',
      skills: ['UI/UX', 'Figma', 'Mobile Design']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
            <p className="text-slate-600 mt-2">Manage and track your posted projects</p>
          </div>
          <Link href="/dashboard/client/projects/new">
            <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
              <Plus className="w-4 h-4 mr-2" />
              Post New Project
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                    <p className="text-slate-600">{project.description}</p>
                  </div>
                  <Badge variant={project.status === 'Active' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-slate-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${project.budget.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Users className="w-4 h-4 mr-1" />
                      {project.proposals} proposals
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock className="w-4 h-4 mr-1" />
                      Due {project.deadline}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View Proposals
                    </Button>
                    <Button size="sm">
                      Manage
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
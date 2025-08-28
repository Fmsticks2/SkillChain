'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Star, MapPin, DollarSign, Clock, MessageSquare, Eye, Filter, Search } from 'lucide-react'
import Link from 'next/link'

export default function ClientTalentPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const freelancers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Full Stack Developer',
      avatar: '/placeholder-user.jpg',
      rating: 4.9,
      reviews: 127,
      hourlyRate: 85,
      location: 'San Francisco, CA',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
      description: 'Experienced full-stack developer with 8+ years building scalable web applications.',
      availability: 'Available now',
      completedProjects: 89
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'UI/UX Designer',
      avatar: '/placeholder-user.jpg',
      rating: 4.8,
      reviews: 94,
      hourlyRate: 75,
      location: 'New York, NY',
      skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
      description: 'Creative designer specializing in modern, user-centered design solutions.',
      availability: 'Available in 1 week',
      completedProjects: 67
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'Mobile App Developer',
      avatar: '/placeholder-user.jpg',
      rating: 4.9,
      reviews: 156,
      hourlyRate: 90,
      location: 'Austin, TX',
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      description: 'Mobile development expert with a track record of successful app launches.',
      availability: 'Available now',
      completedProjects: 112
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Browse Talent</h1>
          <p className="text-slate-600 mt-2">Find skilled freelancers for your projects</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search by skills, name, or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
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
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Freelancers Grid */}
        <div className="grid gap-6">
          {freelancers.map((freelancer) => (
            <Card key={freelancer.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                    <AvatarFallback>{freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{freelancer.name}</h3>
                        <p className="text-slate-600">{freelancer.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{freelancer.rating}</span>
                          <span className="text-slate-500 text-sm ml-1">({freelancer.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center text-slate-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">${freelancer.hourlyRate}/hr</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 mb-3">{freelancer.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {freelancer.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {freelancer.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {freelancer.availability}
                        </div>
                        <div>
                          {freelancer.completedProjects} projects completed
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link href={`/dashboard/client/talent/${freelancer.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/dashboard/client/messages?user=${freelancer.id}`}>
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Freelancers
          </Button>
        </div>
      </div>
    </div>
  )
}
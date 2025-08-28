'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Award, 
  TrendingUp,
  Code,
  Palette,
  PenTool,
  BarChart3
} from 'lucide-react'

export default function FreelancerSkillsPage() {
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: '',
    level: [3],
    experience: '',
    description: ''
  })

  const skills = [
    {
      id: '1',
      name: 'React.js',
      category: 'Frontend Development',
      level: 5,
      experience: '3 years',
      description: 'Expert in building modern web applications with React, including hooks, context, and state management.',
      projects: 15,
      earnings: '$12,500',
      icon: Code
    },
    {
      id: '2',
      name: 'UI/UX Design',
      category: 'Design',
      level: 4,
      experience: '2 years',
      description: 'Proficient in creating user-centered designs with Figma, Adobe XD, and modern design principles.',
      projects: 8,
      earnings: '$8,200',
      icon: Palette
    },
    {
      id: '3',
      name: 'Node.js',
      category: 'Backend Development',
      level: 4,
      experience: '2.5 years',
      description: 'Experienced in building scalable backend services, APIs, and microservices architecture.',
      projects: 12,
      earnings: '$9,800',
      icon: Code
    },
    {
      id: '4',
      name: 'Content Writing',
      category: 'Writing',
      level: 3,
      experience: '1.5 years',
      description: 'Skilled in creating engaging content for blogs, websites, and marketing materials.',
      projects: 6,
      earnings: '$3,400',
      icon: PenTool
    }
  ]

  const skillCategories = [
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Design',
    'Writing',
    'Marketing',
    'Data Science',
    'DevOps'
  ]

  const getLevelText = (level: number) => {
    switch(level) {
      case 1: return 'Beginner'
      case 2: return 'Basic'
      case 3: return 'Intermediate'
      case 4: return 'Advanced'
      case 5: return 'Expert'
      default: return 'Intermediate'
    }
  }

  const getLevelColor = (level: number) => {
    switch(level) {
      case 1: return 'bg-red-100 text-red-700'
      case 2: return 'bg-orange-100 text-orange-700'
      case 3: return 'bg-yellow-100 text-yellow-700'
      case 4: return 'bg-blue-100 text-blue-700'
      case 5: return 'bg-green-100 text-green-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  const handleAddSkill = () => {
    // Add skill logic here
    console.log('Adding skill:', newSkill)
    setIsAddSkillOpen(false)
    setNewSkill({
      name: '',
      category: '',
      level: [3],
      experience: '',
      description: ''
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Skills</h1>
            <p className="text-slate-600 mt-2">Manage your skills and expertise to attract better projects</p>
          </div>
          <Dialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Skill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input
                    id="skill-name"
                    placeholder="e.g., React.js, Photoshop, Content Writing"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="skill-category">Category</Label>
                  <Select value={newSkill.category} onValueChange={(value) => setNewSkill({...newSkill, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="skill-level">Skill Level: {getLevelText(newSkill.level[0])}</Label>
                  <Slider
                    value={newSkill.level}
                    onValueChange={(value) => setNewSkill({...newSkill, level: value})}
                    max={5}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="skill-experience">Years of Experience</Label>
                  <Input
                    id="skill-experience"
                    placeholder="e.g., 2 years, 6 months"
                    value={newSkill.experience}
                    onChange={(e) => setNewSkill({...newSkill, experience: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="skill-description">Description</Label>
                  <Textarea
                    id="skill-description"
                    placeholder="Describe your expertise and experience with this skill..."
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({...newSkill, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddSkillOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSkill}>
                    Add Skill
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Skills Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{skills.length}</p>
                  <p className="text-sm text-slate-600">Total Skills</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{skills.filter(s => s.level >= 4).length}</p>
                  <p className="text-sm text-slate-600">Expert Skills</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{skills.reduce((sum, skill) => sum + skill.projects, 0)}</p>
                  <p className="text-sm text-slate-600">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    ${skills.reduce((sum, skill) => sum + parseInt(skill.earnings.replace(/[$,]/g, '')), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600">Total Earnings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const IconComponent = skill.icon
            return (
              <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        <p className="text-sm text-slate-600">{skill.category}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Skill Level</span>
                      <Badge className={getLevelColor(skill.level)}>
                        {getLevelText(skill.level)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Experience</span>
                      <span className="text-sm font-medium">{skill.experience}</span>
                    </div>
                    
                    <p className="text-sm text-slate-600 line-clamp-2">{skill.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div className="text-center">
                        <p className="text-lg font-bold text-slate-900">{skill.projects}</p>
                        <p className="text-xs text-slate-600">Projects</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{skill.earnings}</p>
                        <p className="text-xs text-slate-600">Earned</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Skill Recommendations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recommended Skills to Add</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'TypeScript', demand: 'High', avgRate: '$45/hr' },
                { name: 'Python', demand: 'Very High', avgRate: '$50/hr' },
                { name: 'AWS', demand: 'High', avgRate: '$60/hr' }
              ].map((recommendation, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{recommendation.name}</h4>
                    <Button variant="outline" size="sm">
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <p className="text-sm text-slate-600">Demand: {recommendation.demand}</p>
                  <p className="text-sm text-green-600">Avg Rate: {recommendation.avgRate}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
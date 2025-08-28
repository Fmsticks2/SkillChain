'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  FileText,
  Download,
  Plus,
  Search,
  Filter
} from 'lucide-react'

export default function ClientEscrowPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateEscrowOpen, setIsCreateEscrowOpen] = useState(false)

  const escrowTransactions = [
    {
      id: 'ESC-001',
      project: 'E-commerce Website Development',
      freelancer: 'Sarah Johnson',
      freelancerAvatar: '/placeholder-user.jpg',
      amount: 4500,
      status: 'active',
      createdDate: '2024-01-15',
      releaseDate: '2024-02-15',
      milestones: [
        { id: 1, title: 'Homepage Design', amount: 1500, status: 'completed', releaseDate: '2024-01-20' },
        { id: 2, title: 'Product Pages', amount: 1500, status: 'in_review', releaseDate: null },
        { id: 3, title: 'Payment Integration', amount: 1500, status: 'pending', releaseDate: null }
      ]
    },
    {
      id: 'ESC-002',
      project: 'Mobile App UI Design',
      freelancer: 'David Chen',
      freelancerAvatar: '/placeholder-user.jpg',
      amount: 2800,
      status: 'completed',
      createdDate: '2024-01-10',
      releaseDate: '2024-01-25',
      milestones: [
        { id: 1, title: 'Wireframes', amount: 800, status: 'completed', releaseDate: '2024-01-15' },
        { id: 2, title: 'UI Design', amount: 1200, status: 'completed', releaseDate: '2024-01-20' },
        { id: 3, title: 'Prototype', amount: 800, status: 'completed', releaseDate: '2024-01-25' }
      ]
    },
    {
      id: 'ESC-003',
      project: 'Content Writing Package',
      freelancer: 'Emily Rodriguez',
      freelancerAvatar: '/placeholder-user.jpg',
      amount: 1200,
      status: 'disputed',
      createdDate: '2024-01-08',
      releaseDate: null,
      milestones: [
        { id: 1, title: 'Blog Articles (5)', amount: 600, status: 'completed', releaseDate: '2024-01-12' },
        { id: 2, title: 'Product Descriptions', amount: 600, status: 'disputed', releaseDate: null }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'disputed': return 'bg-red-100 text-red-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'in_review': return 'bg-orange-100 text-orange-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <Clock className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'disputed': return <AlertCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'in_review': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredTransactions = escrowTransactions.filter(transaction => {
    const matchesSearch = transaction.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.freelancer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalEscrowAmount = escrowTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  const activeEscrows = escrowTransactions.filter(t => t.status === 'active').length
  const completedEscrows = escrowTransactions.filter(t => t.status === 'completed').length
  const disputedEscrows = escrowTransactions.filter(t => t.status === 'disputed').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Escrow Management</h1>
            <p className="text-slate-600 mt-2">Secure payments and milestone tracking for your projects</p>
          </div>
          <Dialog open={isCreateEscrowOpen} onOpenChange={setIsCreateEscrowOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Escrow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Escrow</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-select">Select Project</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project1">Website Redesign</SelectItem>
                      <SelectItem value="project2">Mobile App Development</SelectItem>
                      <SelectItem value="project3">Logo Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="freelancer-select">Select Freelancer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a freelancer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freelancer1">Sarah Johnson</SelectItem>
                      <SelectItem value="freelancer2">David Chen</SelectItem>
                      <SelectItem value="freelancer3">Emily Rodriguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="total-amount">Total Amount (USD)</Label>
                  <Input id="total-amount" type="number" placeholder="5000" />
                </div>
                <div>
                  <Label htmlFor="release-date">Expected Release Date</Label>
                  <Input id="release-date" type="date" />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateEscrowOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateEscrowOpen(false)}>
                    Create Escrow
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">${totalEscrowAmount.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Total in Escrow</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{activeEscrows}</p>
                  <p className="text-sm text-slate-600">Active Escrows</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{completedEscrows}</p>
                  <p className="text-sm text-slate-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">{disputedEscrows}</p>
                  <p className="text-sm text-slate-600">Disputed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by project or freelancer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Escrow Transactions */}
        <div className="space-y-6">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{transaction.project}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-slate-600">ID: {transaction.id}</span>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1 capitalize">{transaction.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">${transaction.amount.toLocaleString()}</p>
                    <p className="text-sm text-slate-600">Total Amount</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={transaction.freelancerAvatar} alt={transaction.freelancer} />
                      <AvatarFallback>{transaction.freelancer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-slate-900">{transaction.freelancer}</p>
                      <p className="text-sm text-slate-600">Freelancer</p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{transaction.createdDate}</p>
                    <p className="text-sm text-slate-600">Created Date</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {transaction.releaseDate || 'Pending'}
                    </p>
                    <p className="text-sm text-slate-600">Release Date</p>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-900">Milestones</h4>
                  {transaction.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          milestone.status === 'completed' ? 'bg-green-500' :
                          milestone.status === 'in_review' ? 'bg-orange-500' :
                          milestone.status === 'disputed' ? 'bg-red-500' :
                          'bg-slate-300'
                        }`}></div>
                        <div>
                          <p className="font-medium text-slate-900">{milestone.title}</p>
                          <p className="text-sm text-slate-600">
                            {milestone.releaseDate ? `Released: ${milestone.releaseDate}` : 'Pending release'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-green-600">${milestone.amount.toLocaleString()}</span>
                        <Badge className={getStatusColor(milestone.status)} variant="outline">
                          {milestone.status.replace('_', ' ')}
                        </Badge>
                        {milestone.status === 'in_review' && (
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        )}
                        {milestone.status === 'completed' && (
                          <Button size="sm" className="bg-green-500 hover:bg-green-600">
                            Released
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Contract
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                  {transaction.status === 'disputed' && (
                    <Button size="sm" className="bg-red-500 hover:bg-red-600">
                      Resolve Dispute
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No escrow transactions found</h3>
              <p className="text-slate-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Create your first escrow to secure payments for your projects.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Escrow
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
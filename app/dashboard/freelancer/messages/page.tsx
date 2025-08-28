'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  Star,
  Clock,
  CheckCheck
} from 'lucide-react'

export default function FreelancerMessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState('1')
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMessageAlignment = (senderId: string) => {
    return senderId === 'freelancer' ? 'justify-end' : 'justify-start'
  }

  const conversations = [
    {
      id: '1',
      client: 'Sarah Johnson',
      clientAvatar: '/placeholder-user.jpg',
      project: 'E-commerce Website',
      lastMessage: 'Great work on the homepage! Can we discuss the payment integration?',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      priority: 'high'
    },
    {
      id: '2',
      client: 'Tech Innovations Inc.',
      clientAvatar: '/placeholder-user.jpg',
      project: 'Mobile App Development',
      lastMessage: 'The wireframes look perfect. When can we start development?',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      priority: 'medium'
    },
    {
      id: '3',
      client: 'David Chen',
      clientAvatar: '/placeholder-user.jpg',
      project: 'Logo Design',
      lastMessage: 'Thank you for the quick turnaround!',
      timestamp: '3 hours ago',
      unread: 0,
      online: true,
      priority: 'low'
    },
    {
      id: '4',
      client: 'Marketing Pro',
      clientAvatar: '/placeholder-user.jpg',
      project: 'Content Writing',
      lastMessage: 'Could you send the revised articles by tomorrow?',
      timestamp: '1 day ago',
      unread: 1,
      online: false,
      priority: 'medium'
    }
  ]

  const messages: Record<string, Array<{id: string, sender: string, content: string, timestamp: string, read: boolean}>> = {
    '1': [
      {
        id: '1',
        sender: 'client',
        content: 'Hi! I reviewed your proposal for the e-commerce website. Very impressive!',
        timestamp: '10:30 AM',
        read: true
      },
      {
        id: '2',
        sender: 'freelancer',
        content: 'Thank you! I\'m excited to work on this project. When would you like to start?',
        timestamp: '10:35 AM',
        read: true
      },
      {
        id: '3',
        sender: 'client',
        content: 'We can start immediately. I\'ve already prepared the requirements document.',
        timestamp: '10:40 AM',
        read: true
      },
      {
        id: '4',
        sender: 'freelancer',
        content: 'Perfect! I\'ve completed the homepage design. Take a look and let me know your thoughts.',
        timestamp: '2:15 PM',
        read: true
      },
      {
        id: '5',
        sender: 'client',
        content: 'Great work on the homepage! Can we discuss the payment integration?',
        timestamp: '3:45 PM',
        read: false
      }
    ],
    '2': [
      {
        id: '1',
        sender: 'client',
        content: 'Hello! We\'re looking for a mobile app developer for our startup.',
        timestamp: '9:00 AM',
        read: true
      },
      {
        id: '2',
        sender: 'freelancer',
        content: 'Hi! I\'d love to help with your mobile app. What platform are you targeting?',
        timestamp: '9:15 AM',
        read: true
      },
      {
        id: '3',
        sender: 'client',
        content: 'We need both iOS and Android. React Native would be perfect.',
        timestamp: '9:30 AM',
        read: true
      },
      {
        id: '4',
        sender: 'freelancer',
        content: 'Excellent! I have extensive experience with React Native. I\'ve sent you some wireframes.',
        timestamp: '11:00 AM',
        read: true
      },
      {
        id: '5',
        sender: 'client',
        content: 'The wireframes look perfect. When can we start development?',
        timestamp: '2:30 PM',
        read: false
      }
    ]
  }

  const currentConversation = conversations.find(c => c.id === selectedConversation)
  const currentMessages = messages[selectedConversation] || []

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  const filteredConversations = conversations.filter(conv => 
    conv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.project.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-slate-400 mt-2">Communicate with your clients</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 bg-slate-900 border-slate-800">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 cursor-pointer hover:bg-slate-800 transition-colors border-l-4 ${
                      selectedConversation === conversation.id 
                        ? 'bg-slate-800 border-l-blue-500' 
                        : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.clientAvatar} alt={conversation.client} />
                          <AvatarFallback>{conversation.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white truncate">{conversation.client}</h4>
                          <div className="flex items-center space-x-1">
                            {conversation.unread > 0 && (
                              <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                                {conversation.unread}
                              </Badge>
                            )}
                            <span className="text-xs text-slate-400">{conversation.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-sm text-blue-400 mb-1">{conversation.project}</p>
                        <p className="text-sm text-slate-400 truncate">{conversation.lastMessage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col bg-slate-900 border-slate-800">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={currentConversation.clientAvatar} alt={currentConversation.client} />
                          <AvatarFallback>{currentConversation.client.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {currentConversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{currentConversation.client}</h3>
                        <p className="text-sm text-blue-400">{currentConversation.project}</p>
                        <p className="text-xs text-slate-400">
                          {currentConversation.online ? 'Online' : 'Last seen 2 hours ago'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {currentMessages.map((message: {id: string, sender: string, content: string, timestamp: string, read: boolean}) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'freelancer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'freelancer'
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={`flex items-center justify-end mt-1 space-x-1 ${
                            message.sender === 'freelancer' ? 'text-blue-100' : 'text-slate-500'
                          }`}>
                            <span className="text-xs">{message.timestamp}</span>
                            {message.sender === 'freelancer' && (
                              <CheckCheck className={`w-3 h-3 ${message.read ? 'text-blue-200' : 'text-blue-300'}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Select a conversation</h3>
                  <p className="text-slate-600">Choose a conversation from the list to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
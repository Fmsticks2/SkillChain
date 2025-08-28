'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Search, Paperclip, MoreVertical } from 'lucide-react'

export default function ClientMessagesPage() {
  const [selectedChat, setSelectedChat] = useState('1')
  const [newMessage, setNewMessage] = useState('')

  const conversations = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '/placeholder-user.jpg',
      lastMessage: 'I\'ve completed the initial wireframes for your project.',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      project: 'E-commerce Website'
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: '/placeholder-user.jpg',
      lastMessage: 'When would be a good time to discuss the design requirements?',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      project: 'Mobile App Design'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: '/placeholder-user.jpg',
      lastMessage: 'The app is ready for testing. Here\'s the TestFlight link.',
      timestamp: '3 hours ago',
      unread: 1,
      online: true,
      project: 'iOS App Development'
    }
  ]

  const messages = [
    {
      id: '1',
      senderId: '1',
      senderName: 'Sarah Johnson',
      content: 'Hi! I\'ve started working on your e-commerce project. I\'ve reviewed the requirements and have a few questions.',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: '2',
      senderId: 'client',
      senderName: 'You',
      content: 'Great! I\'m excited to see what you come up with. What questions do you have?',
      timestamp: '10:35 AM',
      isOwn: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Sarah Johnson',
      content: 'I\'ve completed the initial wireframes for your project. Would you like to review them before I proceed with the detailed designs?',
      timestamp: '2:15 PM',
      isOwn: false
    }
  ]

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="text-slate-400 mt-2">Communicate with your freelancers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="lg:col-span-1 bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Conversations</CardTitle>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-800">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Search conversations..." className="pl-10 bg-slate-800 border-slate-700 text-white" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedChat(conversation.id)}
                    className={`p-4 cursor-pointer hover:bg-slate-800 transition-colors ${
                      selectedChat === conversation.id ? 'bg-slate-800 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-white truncate">{conversation.name}</h4>
                          <span className="text-xs text-slate-400">{conversation.timestamp}</span>
                        </div>
                        <Badge variant="outline" className="text-xs mb-1 bg-slate-800 text-slate-300 border-slate-700">{conversation.project}</Badge>
                        <p className="text-sm text-slate-400 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col bg-slate-900 border-slate-800">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="/placeholder-user.jpg" alt="Sarah Johnson" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-white">Sarah Johnson</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-700">E-commerce Website</Badge>
                        <span className="text-xs text-green-500">● Online</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-800 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isOwn ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-slate-800 p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-800">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 bg-slate-800 border-slate-700 text-white"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <h3 className="text-lg font-medium mb-2 text-white">Select a conversation</h3>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
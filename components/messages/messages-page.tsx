"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { TypingIndicator } from "./typing-indicator"
import { ConnectionStatus } from "./connection-status"
import { MessageStatus } from "./message-status"

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: string
  status: "sent" | "delivered" | "read"
  type: "text" | "file" | "image"
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMessage?: Message
  unreadCount: number
  isOnline: boolean
  lastSeen: string
  type: "direct" | "group"
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder-user.jpg",
    lastMessage: {
      id: "1",
      content: "The smart contract audit is complete. Ready for review.",
      senderId: "user2",
      timestamp: "2024-01-15T10:30:00Z",
      status: "read",
      type: "text",
    },
    unreadCount: 0,
    isOnline: true,
    lastSeen: "2024-01-15T10:30:00Z",
    type: "direct",
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    avatar: "/placeholder-user.jpg",
    lastMessage: {
      id: "2",
      content: "Can we schedule a call to discuss the project requirements?",
      senderId: "user3",
      timestamp: "2024-01-15T09:15:00Z",
      status: "delivered",
      type: "text",
    },
    unreadCount: 2,
    isOnline: false,
    lastSeen: "2024-01-15T08:45:00Z",
    type: "direct",
  },
  {
    id: "3",
    name: "DeFi Protocol Team",
    avatar: "/placeholder-user.jpg",
    lastMessage: {
      id: "3",
      content: "Meeting scheduled for tomorrow at 2 PM EST",
      senderId: "user4",
      timestamp: "2024-01-14T16:20:00Z",
      status: "read",
      type: "text",
    },
    unreadCount: 0,
    isOnline: true,
    lastSeen: "2024-01-15T10:00:00Z",
    type: "group",
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hi! I saw your profile and I'm interested in hiring you for a DeFi project.",
    senderId: "user2",
    timestamp: "2024-01-15T09:00:00Z",
    status: "read",
    type: "text",
  },
  {
    id: "2",
    content: "That sounds great! I'd love to hear more about the project. What kind of DeFi protocol are you building?",
    senderId: "current",
    timestamp: "2024-01-15T09:05:00Z",
    status: "read",
    type: "text",
  },
  {
    id: "3",
    content:
      "We're building a yield farming protocol with innovative tokenomics. The project involves smart contract development, frontend integration, and security auditing.",
    senderId: "user2",
    timestamp: "2024-01-15T09:10:00Z",
    status: "read",
    type: "text",
  },
  {
    id: "4",
    content:
      "Perfect! I have extensive experience with yield farming protocols and have audited several similar projects. When would you like to discuss the details?",
    senderId: "current",
    timestamp: "2024-01-15T09:15:00Z",
    status: "delivered",
    type: "text",
  },
  {
    id: "5",
    content: "The smart contract audit is complete. Ready for review.",
    senderId: "user2",
    timestamp: "2024-01-15T10:30:00Z",
    status: "read",
    type: "text",
  },
]

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const { user } = useAuth()

  const filteredConversations = mockConversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedConv = mockConversations.find((conv) => conv.id === selectedConversation)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Simulate sending message
      console.log("Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Active now"
    if (diffInHours < 24) return `Active ${diffInHours}h ago`
    return `Active ${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex h-screen">
        {/* Sidebar - Conversations List */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/dashboard/freelancer"
                className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.5)" }}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-4 cursor-pointer border-b border-slate-800/50 ${
                  selectedConversation === conversation.id ? "bg-slate-800" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate">{conversation.name}</h3>
                      <div className="flex items-center space-x-2">
                        {conversation.lastMessage && (
                          <span className="text-xs text-slate-400">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-blue-500 text-white text-xs px-2 py-1">{conversation.unreadCount}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-400 truncate">
                        {conversation.lastMessage?.content || "No messages yet"}
                      </p>
                      {conversation.lastMessage && <MessageStatus status={conversation.lastMessage.status} />}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConv.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{selectedConv.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {selectedConv.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold">{selectedConv.name}</h2>
                      <p className="text-sm text-slate-400">
                        {selectedConv.isOnline ? "Online" : formatLastSeen(selectedConv.lastSeen)}
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
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <ConnectionStatus status="connected" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.senderId === "current" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === "current" ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-100"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
                        {message.senderId === "current" && <MessageStatus status={message.status} />}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && <TypingIndicator userNames={[selectedConv?.name || "Someone"]} />}
              </div>

              {/* Message Input */}
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="bg-slate-800 border-slate-700 focus:border-blue-500 pr-10"
                    />
                    <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                <p className="text-slate-400">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { create } from "zustand"
import { useWebSocket } from "./websocket"

export interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  type: "text" | "file" | "image" | "system"
  attachment?: {
    name: string
    url: string
    type: string
  }
  isRead: boolean
  status: "sending" | "sent" | "delivered" | "read"
}

export interface Conversation {
  id: string
  participants: string[]
  participantNames: string[]
  participantAvatars: string[]
  participantStatus: Record<string, "online" | "offline" | "away">
  lastMessage?: Message
  unreadCount: number
  projectId?: string
  projectName?: string
  createdAt: string
  updatedAt: string
  isTyping: Record<string, boolean>
}

interface ChatState {
  conversations: Conversation[]
  messages: Record<string, Message[]>
  activeConversation: string | null
  isLoading: boolean
  connectionStatus: "connected" | "disconnected" | "connecting"
  typingUsers: Record<string, string[]>

  // Actions
  addMessage: (conversationId: string, message: Omit<Message, "id" | "timestamp" | "status">) => void
  updateMessageStatus: (conversationId: string, messageId: string, status: Message["status"]) => void
  markAsRead: (conversationId: string, messageId: string) => void
  setActiveConversation: (conversationId: string | null) => void
  createConversation: (participants: string[], participantNames: string[], projectId?: string) => string
  loadMessages: (conversationId: string) => void
  setUserOnlineStatus: (userId: string, status: "online" | "offline" | "away") => void
  setTypingStatus: (conversationId: string, userId: string, isTyping: boolean) => void
  initializeWebSocket: (userId: string) => void
  sendMessageViaWebSocket: (conversationId: string, content: string, type?: Message["type"]) => void
}

// Mock data with enhanced structure
const mockConversations: Conversation[] = [
  {
    id: "1",
    participants: ["user1", "user2"],
    participantNames: ["Sarah Chen", "You"],
    participantAvatars: ["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"],
    participantStatus: { user1: "online", user2: "online" },
    unreadCount: 2,
    projectId: "project1",
    projectName: "DeFi Dashboard Redesign",
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    isTyping: {},
  },
  {
    id: "2",
    participants: ["user1", "user3"],
    participantNames: ["Michael Rodriguez", "You"],
    participantAvatars: ["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"],
    participantStatus: { user1: "online", user3: "away" },
    unreadCount: 0,
    projectId: "project2",
    projectName: "Smart Contract Audit",
    createdAt: "2024-01-19T15:30:00Z",
    updatedAt: "2024-01-20T11:20:00Z",
    isTyping: {},
  },
  {
    id: "3",
    participants: ["user1", "user4"],
    participantNames: ["Emily Johnson", "You"],
    participantAvatars: ["/placeholder.svg?height=40&width=40", "/placeholder.svg?height=40&width=40"],
    participantStatus: { user1: "online", user4: "offline" },
    unreadCount: 1,
    projectId: "project3",
    projectName: "Mobile Wallet App",
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-20T16:30:00Z",
    isTyping: {},
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      senderId: "user2",
      senderName: "Sarah Chen",
      content: "Hi! I've finished the initial design for the dashboard. Would you like to review it?",
      timestamp: "2024-01-20T10:30:00Z",
      type: "text",
      isRead: true,
      status: "read",
    },
    {
      id: "2",
      senderId: "user1",
      senderName: "You",
      content: "That's great! Yes, please share the designs.",
      timestamp: "2024-01-20T10:32:00Z",
      type: "text",
      isRead: true,
      status: "read",
    },
    {
      id: "3",
      senderId: "user2",
      senderName: "Sarah Chen",
      content: "Here's the Figma link with all the screens and components.",
      timestamp: "2024-01-20T10:35:00Z",
      type: "text",
      attachment: {
        name: "Dashboard Design - Figma",
        url: "#",
        type: "link",
      },
      isRead: true,
      status: "read",
    },
    {
      id: "4",
      senderId: "user1",
      senderName: "You",
      content: "Looks amazing! I love the color scheme and the layout is very intuitive.",
      timestamp: "2024-01-20T11:15:00Z",
      type: "text",
      isRead: true,
      status: "read",
    },
    {
      id: "5",
      senderId: "user2",
      senderName: "Sarah Chen",
      content: "I've completed the dashboard redesign. Please review when you have a chance.",
      timestamp: "2024-01-20T14:45:00Z",
      type: "text",
      isRead: false,
      status: "delivered",
    },
  ],
  "2": [
    {
      id: "6",
      senderId: "user3",
      senderName: "Michael Rodriguez",
      content: "The smart contract audit is progressing well. Found a few minor issues that need attention.",
      timestamp: "2024-01-20T11:20:00Z",
      type: "text",
      isRead: true,
      status: "read",
    },
  ],
  "3": [
    {
      id: "7",
      senderId: "user4",
      senderName: "Emily Johnson",
      content: "Here are the updated wireframes for the mobile app. Let me know what you think!",
      timestamp: "2024-01-20T16:30:00Z",
      type: "text",
      isRead: false,
      status: "sent",
    },
  ],
}

export const useChat = create<ChatState>((set, get) => ({
  conversations: mockConversations,
  messages: mockMessages,
  activeConversation: null,
  isLoading: false,
  connectionStatus: "disconnected",
  typingUsers: {},

  addMessage: (conversationId, messageData) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: "sending",
    }

    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), newMessage],
      },
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: newMessage,
              updatedAt: newMessage.timestamp,
              unreadCount: messageData.senderId !== "user1" ? conv.unreadCount + 1 : conv.unreadCount,
            }
          : conv,
      ),
    }))

    // Simulate message status updates
    setTimeout(() => {
      get().updateMessageStatus(conversationId, newMessage.id, "sent")
    }, 500)

    setTimeout(() => {
      get().updateMessageStatus(conversationId, newMessage.id, "delivered")
    }, 1000)
  },

  updateMessageStatus: (conversationId, messageId, status) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]:
          state.messages[conversationId]?.map((msg) => (msg.id === messageId ? { ...msg, status } : msg)) || [],
      },
    }))
  },

  markAsRead: (conversationId, messageId) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]:
          state.messages[conversationId]?.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true, status: "read" } : msg,
          ) || [],
      },
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
      ),
    }))
  },

  setActiveConversation: (conversationId) => {
    set({ activeConversation: conversationId })
    if (conversationId) {
      get().loadMessages(conversationId)
      // Mark all messages as read when opening conversation
      const messages = get().messages[conversationId] || []
      messages.forEach((msg) => {
        if (!msg.isRead && msg.senderId !== "user1") {
          get().markAsRead(conversationId, msg.id)
        }
      })
    }
  },

  createConversation: (participants, participantNames, projectId) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      participants,
      participantNames,
      participantAvatars: participants.map(() => "/placeholder.svg?height=40&width=40"),
      participantStatus: participants.reduce((acc, id) => ({ ...acc, [id]: "online" }), {}),
      unreadCount: 0,
      projectId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isTyping: {},
    }

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      messages: {
        ...state.messages,
        [newConversation.id]: [],
      },
    }))

    return newConversation.id
  },

  loadMessages: (conversationId) => {
    set({ isLoading: true })
    // Simulate loading delay
    setTimeout(() => {
      set({ isLoading: false })
    }, 300)
  },

  setUserOnlineStatus: (userId, status) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => ({
        ...conv,
        participantStatus: {
          ...conv.participantStatus,
          [userId]: status,
        },
      })),
    }))
  },

  setTypingStatus: (conversationId, userId, isTyping) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              isTyping: {
                ...conv.isTyping,
                [userId]: isTyping,
              },
            }
          : conv,
      ),
    }))

    // Auto-clear typing status after 3 seconds
    if (isTyping) {
      setTimeout(() => {
        get().setTypingStatus(conversationId, userId, false)
      }, 3000)
    }
  },

  initializeWebSocket: (userId) => {
    const { connect, onMessage, onConnect, onDisconnect, onError } = useWebSocket.getState()

    set({ connectionStatus: "connecting" })

    // Set up WebSocket event handlers
    onConnect(() => {
      set({ connectionStatus: "connected" })
    })

    onDisconnect(() => {
      set({ connectionStatus: "disconnected" })
    })

    onError((error) => {
      console.error("WebSocket error:", error)
      set({ connectionStatus: "disconnected" })
    })

    onMessage((data) => {
      const { type, ...payload } = data

      switch (type) {
        case "message":
          get().addMessage(payload.conversationId, {
            senderId: payload.senderId,
            senderName: payload.senderName,
            content: payload.content,
            type: payload.messageType || "text",
            isRead: false,
          })
          break

        case "message_status":
          get().updateMessageStatus(payload.conversationId, payload.messageId, payload.status)
          break

        case "user_online":
          get().setUserOnlineStatus(payload.userId, "online")
          break

        case "user_offline":
          get().setUserOnlineStatus(payload.userId, "offline")
          break

        case "typing_start":
          get().setTypingStatus(payload.conversationId, payload.userId, true)
          break

        case "typing_stop":
          get().setTypingStatus(payload.conversationId, payload.userId, false)
          break

        default:
          console.log("Unknown message type:", type)
      }
    })

    // Connect to WebSocket
    connect(userId)
  },

  sendMessageViaWebSocket: (conversationId, content, type = "text") => {
    const { sendMessage } = useWebSocket.getState()
    const { connectionStatus } = get()

    if (connectionStatus !== "connected") {
      console.error("WebSocket not connected")
      return
    }

    const messageData = {
      type: "message",
      conversationId,
      content,
      messageType: type,
      senderId: "user1", // Current user ID
      senderName: "You",
      timestamp: new Date().toISOString(),
    }

    // Add message to local state immediately
    get().addMessage(conversationId, {
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      content: messageData.content,
      type: messageData.messageType as Message["type"],
      isRead: false,
    })

    // Send via WebSocket
    sendMessage(messageData)
  },
}))

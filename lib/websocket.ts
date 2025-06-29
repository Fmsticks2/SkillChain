"use client"

import { create } from "zustand"

export interface WebSocketState {
  socket: WebSocket | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connect: (userId: string) => void
  disconnect: () => void
  sendMessage: (data: any) => void
  onMessage: (callback: (data: any) => void) => void
  onConnect: (callback: () => void) => void
  onDisconnect: (callback: () => void) => void
  onError: (callback: (error: string) => void) => void
}

const messageCallbacks: ((data: any) => void)[] = []
const connectCallbacks: (() => void)[] = []
const disconnectCallbacks: (() => void)[] = []
const errorCallbacks: ((error: string) => void)[] = []

export const useWebSocket = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  isConnecting: false,
  error: null,

  connect: (userId: string) => {
    const { socket, isConnected, isConnecting } = get()

    if (isConnected || isConnecting || socket) {
      return
    }

    set({ isConnecting: true, error: null })

    try {
      // In a real implementation, this would connect to your WebSocket server
      // For demo purposes, we'll simulate a WebSocket connection
      const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/ws?userId=${userId}`

      // Simulate WebSocket connection
      const mockSocket = {
        send: (data: string) => {
          console.log("Sending message:", data)
          // Simulate echo back for demo
          setTimeout(() => {
            const parsedData = JSON.parse(data)
            if (parsedData.type === "message") {
              // Simulate receiving the message back
              messageCallbacks.forEach((callback) =>
                callback({
                  ...parsedData,
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString(),
                  isRead: false,
                }),
              )
            }
          }, 100)
        },
        close: () => {
          set({ isConnected: false, socket: null })
          disconnectCallbacks.forEach((callback) => callback())
        },
        readyState: 1, // OPEN
      } as WebSocket

      set({
        socket: mockSocket,
        isConnected: true,
        isConnecting: false,
        error: null,
      })

      connectCallbacks.forEach((callback) => callback())

      // Simulate connection events
      setTimeout(() => {
        messageCallbacks.forEach((callback) =>
          callback({
            type: "user_online",
            userId: "user2",
            timestamp: new Date().toISOString(),
          }),
        )
      }, 1000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Connection failed"
      set({
        isConnecting: false,
        error: errorMessage,
      })
      errorCallbacks.forEach((callback) => callback(errorMessage))
    }
  },

  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.close()
    }
    set({ socket: null, isConnected: false, isConnecting: false })
  },

  sendMessage: (data: any) => {
    const { socket, isConnected } = get()
    if (socket && isConnected) {
      socket.send(JSON.stringify(data))
    }
  },

  onMessage: (callback: (data: any) => void) => {
    messageCallbacks.push(callback)
    return () => {
      const index = messageCallbacks.indexOf(callback)
      if (index > -1) {
        messageCallbacks.splice(index, 1)
      }
    }
  },

  onConnect: (callback: () => void) => {
    connectCallbacks.push(callback)
    return () => {
      const index = connectCallbacks.indexOf(callback)
      if (index > -1) {
        connectCallbacks.splice(index, 1)
      }
    }
  },

  onDisconnect: (callback: () => void) => {
    disconnectCallbacks.push(callback)
    return () => {
      const index = disconnectCallbacks.indexOf(callback)
      if (index > -1) {
        disconnectCallbacks.splice(index, 1)
      }
    }
  },

  onError: (callback: (error: string) => void) => {
    errorCallbacks.push(callback)
    return () => {
      const index = errorCallbacks.indexOf(callback)
      if (index > -1) {
        errorCallbacks.splice(index, 1)
      }
    }
  },
}))

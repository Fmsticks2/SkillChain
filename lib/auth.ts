import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "freelancer" | "client" | "admin"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  company?: string
  walletAddress?: string
  isVerified: boolean
  createdAt: string
  avatar?: string
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
    role: "freelancer",
    isVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    email: "sarah@techcorp.com",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "client",
    company: "TechCorp Inc.",
    isVerified: true,
    createdAt: "2024-01-02T00:00:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    email: "admin@skillchain.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    isVerified: true,
    createdAt: "2024-01-01T00:00:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false
        }
      },
    },
  ),
)

"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  allowedRoles = ["freelancer", "client", "admin"],
  redirectTo = "/auth/signin",
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, setLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Set loading to false after hydration
    const timer = setTimeout(() => {
      setLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [setLoading])

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo)
        return
      }

      if (user && !allowedRoles.includes(user.role)) {
        // Redirect based on user role
        switch (user.role) {
          case "freelancer":
            router.push("/dashboard/freelancer")
            break
          case "client":
            router.push("/dashboard/client")
            break
          case "admin":
            router.push("/admin")
            break
          default:
            router.push("/")
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}

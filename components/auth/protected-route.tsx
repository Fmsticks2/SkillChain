"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "./auth-provider"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  allowedRoles = ["freelancer", "client", "admin"],
  redirectTo = "/auth/signup",
}: ProtectedRouteProps) {
  const { isWeb3AuthConnected, isWalletConnected, isLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // Check if user is authenticated via Web3Auth or wallet connection
      if (!isWeb3AuthConnected && !isWalletConnected) {
        router.push(redirectTo)
        return
      }
    }
  }, [isWeb3AuthConnected, isWalletConnected, isLoading, redirectTo, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  if (!isWeb3AuthConnected && !isWalletConnected) {
    return null
  }

  return <>{children}</>
}

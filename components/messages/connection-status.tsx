"use client"

import { motion } from "framer-motion"
import { Wifi, WifiOff, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ConnectionStatusProps {
  status: "connected" | "disconnected" | "connecting"
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          text: "Connected",
          className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
        }
      case "connecting":
        return {
          icon: Loader2,
          text: "Connecting...",
          className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        }
      case "disconnected":
        return {
          icon: WifiOff,
          text: "Disconnected",
          className: "bg-red-500/20 text-red-400 border-red-500/30",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center p-2"
    >
      <Badge className={`${config.className} flex items-center space-x-1`}>
        <Icon className={`w-3 h-3 ${status === "connecting" ? "animate-spin" : ""}`} />
        <span className="text-xs">{config.text}</span>
      </Badge>
    </motion.div>
  )
}

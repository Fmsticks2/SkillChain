"use client"

import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react"
import type { Message } from "@/lib/chat"

interface MessageStatusProps {
  status: Message["status"]
  className?: string
}

export function MessageStatus({ status, className = "" }: MessageStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return <Clock className={`w-3 h-3 text-slate-400 ${className}`} />
      case "sent":
        return <Check className={`w-3 h-3 text-slate-400 ${className}`} />
      case "delivered":
        return <CheckCheck className={`w-3 h-3 text-slate-400 ${className}`} />
      case "read":
        return <CheckCheck className={`w-3 h-3 text-emerald-400 ${className}`} />
      default:
        return <AlertCircle className={`w-3 h-3 text-red-400 ${className}`} />
    }
  }

  return getStatusIcon()
}

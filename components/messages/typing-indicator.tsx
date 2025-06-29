"use client"

import { motion } from "framer-motion"

interface TypingIndicatorProps {
  userNames: string[]
}

export function TypingIndicator({ userNames }: TypingIndicatorProps) {
  if (userNames.length === 0) return null

  const displayText =
    userNames.length === 1
      ? `${userNames[0]} is typing...`
      : userNames.length === 2
        ? `${userNames[0]} and ${userNames[1]} are typing...`
        : `${userNames[0]} and ${userNames.length - 1} others are typing...`

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center space-x-2 px-4 py-2 text-slate-400 text-sm"
    >
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-slate-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      <span>{displayText}</span>
    </motion.div>
  )
}

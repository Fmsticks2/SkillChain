"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  Palette,
  Database,
  Star,
  CheckCircle,
  Clock,
  Trophy,
  Zap,
  Users,
  Play,
  Eye,
  ThumbsUp,
  MessageSquare,
  Lock,
  Crown,
} from "lucide-react"

const skillCategories = [
  {
    name: "Frontend Development",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    skills: [
      { name: "React", level: "Expert", verified: true, xp: 2400, nextLevel: 2500 },
      { name: "TypeScript", level: "Advanced", verified: true, xp: 1800, nextLevel: 2000 },
      { name: "Vue.js", level: "Intermediate", verified: false, xp: 800, nextLevel: 1000 },
      { name: "Angular", level: "Beginner", verified: false, xp: 200, nextLevel: 500 },
    ],
  },
  {
    name: "Backend Development",
    icon: Database,
    color: "from-emerald-500 to-teal-500",
    skills: [
      { name: "Node.js", level: "Expert", verified: true, xp: 2200, nextLevel: 2500 },
      { name: "Python", level: "Advanced", verified: true, xp: 1600, nextLevel: 2000 },
      { name: "Go", level: "Intermediate", verified: false, xp: 600, nextLevel: 1000 },
      { name: "Rust", level: "Beginner", verified: false, xp: 100, nextLevel: 500 },
    ],
  },
  {
    name: "Design",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    skills: [
      { name: "UI/UX Design", level: "Advanced", verified: true, xp: 1900, nextLevel: 2000 },
      { name: "Figma", level: "Expert", verified: true, xp: 2300, nextLevel: 2500 },
      { name: "Adobe Creative Suite", level: "Intermediate", verified: false, xp: 700, nextLevel: 1000 },
      { name: "Prototyping", level: "Advanced", verified: true, xp: 1700, nextLevel: 2000 },
    ],
  },
]

const challenges = [
  {
    id: 1,
    title: "React Component Architecture",
    difficulty: "Expert",
    duration: "2 hours",
    xpReward: 500,
    description: "Build a complex dashboard with reusable components",
    status: "available",
    participants: 234,
  },
  {
    id: 2,
    title: "TypeScript Advanced Patterns",
    difficulty: "Advanced",
    duration: "90 minutes",
    xpReward: 350,
    description: "Implement complex type systems and generics",
    status: "completed",
    participants: 156,
    score: 95,
  },
  {
    id: 3,
    title: "Performance Optimization",
    difficulty: "Expert",
    duration: "3 hours",
    xpReward: 600,
    description: "Optimize a React application for maximum performance",
    status: "locked",
    participants: 89,
    requirement: "Complete React Component Architecture",
  },
]

const peerReviews = [
  {
    id: 1,
    reviewer: "Sarah Chen",
    avatar: "/placeholder.svg?height=32&width=32",
    skill: "React Development",
    rating: 5,
    comment: "Excellent code quality and architecture. Clean, maintainable solutions.",
    date: "2 days ago",
    helpful: 12,
  },
  {
    id: 2,
    reviewer: "Michael Rodriguez",
    avatar: "/placeholder.svg?height=32&width=32",
    skill: "TypeScript",
    rating: 4,
    comment: "Strong understanding of advanced TypeScript patterns. Minor improvements in error handling.",
    date: "1 week ago",
    helpful: 8,
  },
  {
    id: 3,
    reviewer: "Emily Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    skill: "UI/UX Design",
    rating: 5,
    comment: "Outstanding design thinking and user experience considerations.",
    date: "2 weeks ago",
    helpful: 15,
  },
]

function SkillCard({ category }: { category: (typeof skillCategories)[0] }) {
  return (
    <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
          <category.icon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold">{category.name}</h3>
      </div>

      <div className="space-y-3">
        {category.skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {skill.verified ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400" />
                )}
                <span className="font-medium">{skill.name}</span>
              </div>
              <Badge
                className={
                  skill.level === "Expert"
                    ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    : skill.level === "Advanced"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                      : skill.level === "Intermediate"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                }
              >
                {skill.level}
              </Badge>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">{skill.xp} XP</p>
              <Progress value={(skill.xp / skill.nextLevel) * 100} className="w-16 h-1 mt-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

export function SkillVerification() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Skill Verification</h1>
              <p className="text-slate-400">Prove your expertise and unlock new opportunities</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Total XP</p>
                <p className="text-2xl font-bold text-blue-400">12,450</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Rank</p>
                <div className="flex items-center space-x-1">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <p className="text-lg font-bold text-amber-400">Expert</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="reviews">Peer Reviews</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Skill Categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {skillCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <SkillCard category={category} />
                </motion.div>
              ))}
            </div>

            {/* Progress Overview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                <h3 className="text-xl font-semibold mb-6">Verification Progress</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="font-semibold text-emerald-400">7 Skills Verified</h4>
                    <p className="text-slate-400 text-sm">Cryptographically proven</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="font-semibold text-blue-400">15 Challenges Completed</h4>
                    <p className="text-slate-400 text-sm">Hands-on validation</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h4 className="font-semibold text-purple-400">23 Peer Reviews</h4>
                    <p className="text-slate-400 text-sm">Community validated</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        className={
                          challenge.difficulty === "Expert"
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : challenge.difficulty === "Advanced"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        }
                      >
                        {challenge.difficulty}
                      </Badge>
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-medium">{challenge.xpReward} XP</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{challenge.description}</p>

                    <div className="flex items-center justify-between mb-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{challenge.participants} participants</span>
                      </div>
                    </div>

                    {challenge.status === "completed" && (
                      <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-emerald-400 font-medium">Completed</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="text-amber-400 font-medium">{challenge.score}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {challenge.status === "locked" && (
                      <div className="mb-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm">{challenge.requirement}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      className={
                        challenge.status === "available"
                          ? "w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                          : challenge.status === "completed"
                            ? "w-full bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : "w-full"
                      }
                      disabled={challenge.status === "locked"}
                      variant={challenge.status === "completed" ? "outline" : "default"}
                    >
                      {challenge.status === "available" && (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start Challenge
                        </>
                      )}
                      {challenge.status === "completed" && (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          View Solution
                        </>
                      )}
                      {challenge.status === "locked" && (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      )}
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {peerReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {review.reviewer
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{review.reviewer}</h4>
                        <p className="text-slate-400 text-sm">{review.skill}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "text-amber-400 fill-current" : "text-slate-600"}`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4">{review.comment}</p>

                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{review.date}</span>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 hover:text-emerald-400 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{review.helpful}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-slate-300 transition-colors">
                          <MessageSquare className="w-4 h-4" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Achievement cards would go here */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-slate-800 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Expert Developer</h3>
                  <p className="text-slate-400 text-sm mb-4">Achieved expert level in 3+ skills</p>
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Legendary</Badge>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

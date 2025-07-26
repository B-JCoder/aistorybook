"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Trash2, Eye, Calendar, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UserButton } from "@clerk/nextjs"
import { toast } from "sonner"
import { formatDate } from "@/lib/utils"
import type { Story } from "@/types"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function MyStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserStories()
  }, [])

  const fetchUserStories = async () => {
    try {
      const response = await fetch("/api/stories")
      if (response.ok) {
        const { data } = await response.json()
        setStories(data.stories)
      } else {
        throw new Error("Failed to fetch stories")
      }
    } catch (error) {
      toast.error("Failed to load your stories")
    } finally {
      setLoading(false)
    }
  }

  const deleteStory = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete story")
      }

      setStories(stories.filter((story) => story.id !== storyId))
      toast.success("Story deleted successfully")
    } catch (error) {
      toast.error("Failed to delete story")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI Storybook
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/create-story">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create Story
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              My Stories
            </h1>
            <p className="text-xl text-gray-600">Your collection of AI-generated personalized stories</p>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full bg-white/80 backdrop-blur-sm shadow-xl border-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <div className="w-full h-48 bg-gray-200 animate-pulse" />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
                        <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <motion.div variants={fadeInUp} className="text-center">
              <Card className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-2xl border-0">
                <CardContent className="p-12">
                  <BookOpen className="w-20 h-20 text-purple-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">No Stories Yet</h2>
                  <p className="text-gray-600 mb-8">
                    You haven&apos;t created any stories yet. Start your storytelling journey by creating your first
                    AI-powered story!
                  </p>
                  <Link href="/create-story">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story) => (
                  <motion.div key={story.id} variants={fadeInUp} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                    <Card className="h-full bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={story.chapters[0]?.imageUrl || "/placeholder.svg?height=200&width=300"}
                          alt={story.title}
                          width={300}
                          height={200}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                         <Badge className="bg-white/90 text-gray-700">{story.metadata?.genre}</Badge>
                        </div>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">{story.title}</CardTitle>
                        <p className="text-gray-600">Featuring {story.metadata?.mainCharacter}</p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="text-purple-600 border-purple-200">
                            {story.metadata?.tone}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(story.createdAt)}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link href={`/story/${story.id}`} className="flex-1">
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                              <Eye className="w-4 h-4 mr-2" />
                              Read
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => deleteStory(story.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeInUp} className="text-center mt-16">
                <Link href="/create-story">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Another Story
                  </Button>
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

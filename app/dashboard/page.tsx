"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, ImageIcon, BookOpen, TrendingUp, Heart, Eye, Plus } from "lucide-react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { StoryCard } from "@/components/dashboard/story-card"
import { ImageCard } from "@/components/dashboard/image-card"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import type { Story, GeneratedImage } from "@/types"

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

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [stories, setStories] = useState<Story[]>([])
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalStories: 0,
    totalImages: 0,
    totalViews: 0,
    totalLikes: 0,
  })

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserContent()
    }
  }, [isLoaded, user])

  const fetchUserContent = async () => {
    try {
      const [storiesRes, imagesRes] = await Promise.all([fetch("/api/stories/user"), fetch("/api/images/user")])

      if (storiesRes.ok) {
        const storiesData = await storiesRes.json()
        setStories(storiesData.data || [])
      }

      if (imagesRes.ok) {
        const imagesData = await imagesRes.json()
        setImages(imagesData.data || [])
      }

      // Calculate stats
      const totalViews =
        stories.reduce((sum, story) => sum + story.views, 0) + images.reduce((sum, image) => sum + image.views, 0)
      const totalLikes =
        stories.reduce((sum, story) => sum + story.likes, 0) + images.reduce((sum, image) => sum + image.likes, 0)

      setStats({
        totalStories: stories.length,
        totalImages: images.length,
        totalViews,
        totalLikes,
      })
    } catch (error) {
      console.error("Error fetching user content:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <DashboardNav />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial="initial" animate="animate" variants={staggerContainer}>
            {/* Header */}
            <motion.div variants={fadeInUp} className="mb-8">
              <h1 className="text-4xl font-bold gradient-text mb-2">Welcome back, {user?.firstName || "Creator"}!</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Here's what you've been creating</p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeInUp} className="mb-8">
              <QuickActions />
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="Stories Created"
                value={stats.totalStories}
                icon={<BookOpen className="w-6 h-6" />}
                gradient="from-purple-500 to-pink-500"
                change="+12%"
              />
              <StatsCard
                title="Images Generated"
                value={stats.totalImages}
                icon={<ImageIcon className="w-6 h-6" />}
                gradient="from-blue-500 to-cyan-500"
                change="+8%"
              />
              <StatsCard
                title="Total Views"
                value={stats.totalViews}
                icon={<Eye className="w-6 h-6" />}
                gradient="from-green-500 to-teal-500"
                change="+24%"
              />
              <StatsCard
                title="Total Likes"
                value={stats.totalLikes}
                icon={<Heart className="w-6 h-6" />}
                gradient="from-red-500 to-pink-500"
                change="+18%"
              />
            </motion.div>

            {/* Content Tabs */}
            <motion.div variants={fadeInUp}>
              <Tabs defaultValue="recent" className="space-y-6">
                <TabsList className="glass-effect border-0">
                  <TabsTrigger value="recent">Recent Activity</TabsTrigger>
                  <TabsTrigger value="stories">My Stories</TabsTrigger>
                  <TabsTrigger value="images">My Images</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="recent" className="space-y-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card className="glass-effect border-0">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Recent Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RecentActivity stories={stories.slice(0, 5)} images={images.slice(0, 5)} />
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <Card className="glass-effect border-0">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Quick Start
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Link href="/generate?type=story">
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Generate Story
                            </Button>
                          </Link>
                          <Link href="/generate?type=image">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Generate Image
                            </Button>
                          </Link>
                          <Link href="/generate?type=instagram">
                            <Button className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white">
                              <Plus className="w-4 h-4 mr-2" />
                              Import from Instagram
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stories" className="space-y-6">
                  {stories.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {stories.map((story) => (
                        <StoryCard key={story.id} story={story} />
                      ))}
                    </div>
                  ) : (
                    <Card className="glass-effect border-0">
                      <CardContent className="p-12 text-center">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No stories yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Create your first AI-generated story to get started
                        </p>
                        <Link href="/generate?type=story">
                          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Story
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="images" className="space-y-6">
                  {images.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {images.map((image) => (
                        <ImageCard key={image.id} image={image} />
                      ))}
                    </div>
                  ) : (
                    <Card className="glass-effect border-0">
                      <CardContent className="p-12 text-center">
                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No images yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          Generate your first AI image to get started
                        </p>
                        <Link href="/generate?type=image">
                          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Generate Image
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="glass-effect border-0">
                      <CardHeader>
                        <CardTitle>Performance Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Average Views per Story</span>
                            <span className="font-semibold">
                              {stories.length > 0 ? Math.round(stats.totalViews / stories.length) : 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Average Likes per Story</span>
                            <span className="font-semibold">
                              {stories.length > 0 ? Math.round(stats.totalLikes / stories.length) : 0}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Engagement Rate</span>
                            <span className="font-semibold">
                              {stats.totalViews > 0 ? Math.round((stats.totalLikes / stats.totalViews) * 100) : 0}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-effect border-0">
                      <CardHeader>
                        <CardTitle>Content Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Public Stories</span>
                            <span className="font-semibold">{stories.filter((s) => s.isPublic).length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Private Stories</span>
                            <span className="font-semibold">{stories.filter((s) => !s.isPublic).length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">Public Images</span>
                            <span className="font-semibold">{images.filter((i) => i.isPublic).length}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

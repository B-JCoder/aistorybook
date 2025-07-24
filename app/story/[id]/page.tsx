"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import { toast } from "sonner"
import type { Story } from "@/types"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function StoryPage() {
  const params = useParams()
  const storyId = params.id as string
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentChapter, setCurrentChapter] = useState(0)

  useEffect(() => {
    if (storyId) {
      fetchStory()
    }
  }, [storyId])

  const fetchStory = async () => {
    try {
      const response = await fetch(`/api/stories/${storyId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch story")
      }

      const { data } = await response.json()
      setStory(data.story)
    } catch (error) {
      toast.error("Failed to load story")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your story...</p>
        </div>
      </div>
    )
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Story Not Found</h2>
            <p className="text-gray-600 mb-6">
              The story you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link href="/my-stories">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                Back to My Stories
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentChapterData = story.chapters[currentChapter]
  const totalChapters = story.chapters.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/my-stories">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Stories
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
          <UserButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}>
          {/* Story Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              {story.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <BookOpen className="w-3 h-3 mr-1" />
                {story.metadata.genre}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {story.metadata.tone}
              </Badge>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                Ages {story.metadata.ageGroup}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {story.metadata.setting}
              </Badge>
            </div>
            <p className="text-lg text-gray-600">
              A personalized story featuring {story.metadata.mainCharacter}
              {story.metadata.supportingCharacters?.length > 0 &&
                ` and ${story.metadata.supportingCharacters.join(", ")}`}
            </p>
          </motion.div>

          {/* Chapter Navigation */}
          {totalChapters > 1 && (
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                disabled={currentChapter === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Chapter {currentChapter + 1} of {totalChapters}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentChapter(Math.min(totalChapters - 1, currentChapter + 1))}
                disabled={currentChapter === totalChapters - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Current Chapter */}
          <motion.div
            key={currentChapter}
            variants={fadeInUp}
            className="flex flex-col md:flex-row gap-8 items-start mb-12"
          >
            <div className="flex-1">
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentChapterData.title || `Chapter ${currentChapterData.chapterNumber}`}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    {currentChapterData.content.split("\n").map((paragraph, index) => (
                      <p key={index} className="text-lg leading-relaxed text-gray-700 mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chapter Image */}
            {currentChapterData.imageUrl && (
              <div className="flex-1">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                  <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                    <CardContent className="p-4">
                      <Image
                        src={currentChapterData.imageUrl || "/placeholder.svg"}
                        alt={`Chapter ${currentChapterData.chapterNumber} illustration`}
                        width={500}
                        height={500}
                        className="w-full rounded-xl shadow-lg"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* Story End */}
          {currentChapter === totalChapters - 1 && (
            <motion.div variants={fadeInUp} className="text-center mt-16">
              <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl border-0">
                <CardContent className="p-12">
                  <h2 className="text-3xl font-bold mb-4">The End</h2>
                  <p className="text-xl opacity-90 mb-8">
                    And so, {story.metadata.mainCharacter}&apos;s adventure comes to a close. What magical story will
                    you create next?
                  </p>
                  <Link href="/create-story">
                    <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                      Create Another Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

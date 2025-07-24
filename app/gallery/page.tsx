"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"

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

const sampleStories = [
  {
    id: "1",
    title: "Luna's Magical Adventure",
    character: "Luna",
    genre: "Fantasy",
    theme: "Courage",
    likes: 124,
    views: 1250,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Captain Max's Space Journey",
    character: "Max",
    genre: "Science Fiction",
    theme: "Discovery",
    likes: 89,
    views: 890,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Princess Aria and the Dragon",
    character: "Aria",
    genre: "Fairy Tale",
    theme: "Friendship",
    likes: 156,
    views: 1680,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "Detective Sam's Mystery",
    character: "Sam",
    genre: "Mystery",
    theme: "Problem Solving",
    likes: 73,
    views: 650,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "5",
    title: "Mia's Underwater Kingdom",
    character: "Mia",
    genre: "Adventure",
    theme: "Environmental Care",
    likes: 198,
    views: 2100,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "6",
    title: "The Superhero Twins",
    character: "Alex & Jordan",
    genre: "Superhero",
    theme: "Teamwork",
    likes: 142,
    views: 1420,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
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
            <SignedOut>
              <SignInButton>
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Story Gallery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing stories created by our community. Get inspired and create your own magical tale!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleStories.map((story) => (
              <motion.div key={story.id} variants={fadeInUp} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
                <Card className="h-full bg-white/80 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={story.image || "/placeholder.svg"}
                      alt={story.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-gray-700">{story.genre}</Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2">{story.title}</CardTitle>
                    <p className="text-gray-600">Featuring {story.character}</p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="text-purple-600 border-purple-200">
                        {story.theme}
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {story.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {story.views}
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Read Story
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="text-center mt-16">
            <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl border-0 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Ready to Create Your Own?</h2>
                <p className="text-lg opacity-90 mb-6">
                  Join our community of storytellers and bring your imagination to life with AI.
                </p>
                <SignedOut>
                  <SignInButton>
                    <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                      Get Started Free
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/create-story">
                    <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                      Create Your Story
                    </Button>
                  </Link>
                </SignedIn>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

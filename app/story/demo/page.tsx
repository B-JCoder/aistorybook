"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, Heart, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import SocialShare from "@/components/social-share"

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

// Demo story content
const demoStory = {
  title: "Luna's Magical Adventure",
  metadata: {
    mainCharacter: "Luna",
    genre: "Fantasy",
    tone: "Magical",
    ageGroup: "8-12 years",
    setting: "Enchanted Forest",
    supportingCharacters: ["Sparkle the Fairy", "Oliver the Owl"],
  },
  chapters: [
    {
      chapterNumber: 1,
      content: `Once upon a time, in a mystical enchanted forest where the trees whispered secrets and flowers glowed with inner light, there lived a brave young girl named Luna. She had sparkling eyes full of curiosity and a heart as pure as morning dew.

Luna loved exploring the magical forest near her home, but she had never ventured deep into its mysterious heart. Today felt different though - today felt like the beginning of something extraordinary.`,
      imageUrl: "/placeholder.svg?height=400&width=500",
    },
    {
      chapterNumber: 2,
      content: `As Luna walked deeper into the forest, she met Sparkle, a tiny fairy with wings that shimmered like diamonds. "Luna!" Sparkle chimed in her bell-like voice, "The forest needs your help! All the magical creatures have lost their voices, and only someone with a pure heart can restore them."

Luna's eyes widened with wonder and determination. She had always dreamed of helping others, and now the forest itself was calling for her aid.`,
      imageUrl: "/placeholder.svg?height=400&width=500",
    },
    {
      chapterNumber: 3,
      content: `Together with Sparkle and Oliver the wise owl, Luna discovered that an ancient crystal deep in the forest had been covered by shadows of doubt and fear. This crystal was the source of all voices and joy in the magical realm.

"Only a song sung with true love and courage can clear away the shadows," Oliver hooted wisely. Luna took a deep breath, knowing that this was her moment to make a difference.`,
      imageUrl: "/placeholder.svg?height=400&width=500",
    },
    {
      chapterNumber: 4,
      content: `Luna placed her hands gently on the crystal and began to sing a melody that came straight from her heart. Her voice was filled with all the love she had for her friends, her family, and the beautiful world around her.

As she sang, the shadows began to melt away like morning mist, and the crystal started to glow with a warm, golden light that spread throughout the entire forest.`,
      imageUrl: "/placeholder.svg?height=400&width=500",
    },
    {
      chapterNumber: 5,
      content: `Suddenly, the forest erupted in joyful sounds! Birds began singing their sweetest songs, squirrels chattered happily, and all the magical creatures thanked Luna for her brave and loving heart.

From that day forward, Luna was known as the Guardian of Voices, and whenever someone in the forest felt sad or lost, they would remember Luna's song and find their courage again. And Luna learned that the greatest magic of all comes from kindness, courage, and believing in yourself.`,
      imageUrl: "/placeholder.svg?height=400&width=500",
    },
  ],
}

export default function DemoStoryPage() {
  const searchParams = useSearchParams()
  const title = searchParams.get("title") || demoStory.title
  const [currentChapter, setCurrentChapter] = useState(0)

  const currentChapterData = demoStory.chapters[currentChapter]
  const totalChapters = demoStory.chapters.length

  const shareStory = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: `Check out this demo AI-generated story: ${title}`,
        url: window.location.href,
      });
    } catch (error) {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard.");
    }
  } else {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard.");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/create-story">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Create
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <SocialShare
              title={title}
              description={`Check out this demo AI-generated story: ${title}`}
              hashtags={["AIStorybook", "ChildrensStories"]}
              size="sm"
              variant="outline"
            />
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </motion.div>

    
      <button
  onClick={shareStory}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
>
  Share Story
</button>


      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}>
          {/* Story Header */}
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                📖 <strong>Demo Story</strong> - This is a sample story to showcase the app's capabilities. Configure
                your API keys to generate personalized stories!
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              {title}
            </h1>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <BookOpen className="w-3 h-3 mr-1" />
                {demoStory.metadata.genre}
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {demoStory.metadata.tone}
              </Badge>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                Ages {demoStory.metadata.ageGroup}
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {demoStory.metadata.setting}
              </Badge>
            </div>
            <p className="text-lg text-gray-600">
              A personalized story featuring {demoStory.metadata.mainCharacter}
              {demoStory.metadata.supportingCharacters.length > 0 &&
                ` and ${demoStory.metadata.supportingCharacters.join(", ")}`}
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

         {currentChapterData && (
  <motion.div
    key={currentChapter}
    variants={fadeInUp}
    className="flex flex-col md:flex-row gap-8 items-start mb-12"
  >
    <div className="flex-1">
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Chapter {currentChapterData.chapterNumber}
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
    <div className="flex-1">
      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
        <Image
          src={currentChapterData.imageUrl || "/placeholder.svg"}
          alt={`Chapter ${currentChapterData.chapterNumber} illustration`}
          width={500}
          height={400}
          className="w-full rounded-2xl shadow-2xl"
        />
      </motion.div>
    </div>
  </motion.div>
)}

          {/* Story End */}
          {currentChapter === totalChapters - 1 && (
            <motion.div variants={fadeInUp} className="text-center mt-16">
              <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-2xl border-0">
                <CardContent className="p-12">
                  <h2 className="text-3xl font-bold mb-4">The End</h2>
                  <p className="text-xl opacity-90 mb-8">
                    And so, {demoStory.metadata.mainCharacter}'s adventure comes to a close. Configure your API keys to
                    create your own personalized stories!
                  </p>
                  <Link href="/create-story">
                    <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                      Create Your Own Story
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

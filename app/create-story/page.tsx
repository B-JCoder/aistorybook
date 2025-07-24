"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Wand2, X, Plus, BookOpen, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import type { StoryFormData } from "@/types"

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

export default function CreateStoryPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState<StoryFormData>({
    title: "",
    mainCharacter: "",
    ageGroup: "",
    supportingCharacters: [],
    genre: "",
    tone: "",
    setting: "",
    customPrompt: "",
  })
  const [newCharacter, setNewCharacter] = useState("")

  const ageGroups = ["4-7 years", "8-12 years", "13-16 years"]
  const genres = [
    "Fantasy",
    "Adventure",
    "Sci-Fi",
    "Mystery",
    "Friendship",
    "Educational",
    "Fairy Tale",
    "Animal Story",
    "Superhero",
  ]
  const tones = ["Wholesome", "Funny", "Educational", "Inspiring", "Adventurous", "Magical"]
  const settings = [
    "Enchanted Forest",
    "Space Station",
    "Underwater Kingdom",
    "Mountain Village",
    "Magic School",
    "Pirate Ship",
    "Dinosaur Land",
    "Robot City",
    "Fairy Garden",
    "Ancient Castle",
    "Jungle Adventure",
    "Arctic Expedition",
  ]

  const handleInputChange = (field: keyof StoryFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addCharacter = () => {
    if (newCharacter.trim() && !formData.supportingCharacters.includes(newCharacter.trim())) {
      setFormData((prev) => ({
        ...prev,
        supportingCharacters: [...prev.supportingCharacters, newCharacter.trim()],
      }))
      setNewCharacter("")
    }
  }

  const removeCharacter = (character: string) => {
    setFormData((prev) => ({
      ...prev,
      supportingCharacters: prev.supportingCharacters.filter((c) => c !== character),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.mainCharacter || !formData.ageGroup || !formData.genre || !formData.tone || !formData.setting) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsGenerating(true)

    try {
      const generateResponse = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!generateResponse.ok) {
        const error = await generateResponse.json()
        throw new Error(error.error || "Failed to generate story")
      }

      const { data } = await generateResponse.json()

      const saveResponse = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!saveResponse.ok) {
        const error = await saveResponse.json()
        throw new Error(error.error || "Failed to save story")
      }

      const { data: saveData } = await saveResponse.json()

      toast.success("Story created successfully!")
      router.push(`/story/${saveData.storyId}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create story")
    } finally {
      setIsGenerating(false)
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
          <UserButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div initial="initial" animate="animate" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Create Your AI Story
            </h1>
            <p className="text-xl text-gray-600">
              Tell us about your characters and preferences, and watch AI bring your story to life
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Wand2 className="w-6 h-6 text-purple-600" />
                  Story Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Story Title (Optional)</Label>
                      <Input
                        id="title"
                        placeholder="e.g., The Magical Adventure"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mainCharacter">
                        Main Character Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="mainCharacter"
                        placeholder="e.g., Emma, Alex, Luna"
                        value={formData.mainCharacter}
                        onChange={(e) => handleInputChange("mainCharacter", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ageGroup">
                      Age Group <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={(value) => handleInputChange("ageGroup", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age group" />
                      </SelectTrigger>
                      <SelectContent>
                        {ageGroups.map((age) => (
                          <SelectItem key={age} value={age}>
                            {age}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Supporting Characters</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add supporting characters"
                        value={newCharacter}
                        onChange={(e) => setNewCharacter(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCharacter())}
                      />
                      <Button type="button" onClick={addCharacter} variant="outline" size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.supportingCharacters.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.supportingCharacters.map((character) => (
                          <Badge key={character} variant="secondary" className="flex items-center gap-1">
                            {character}
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeCharacter(character)} />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="genre">
                        Genre <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("genre", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tone">
                        Tone <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("tone", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((tone) => (
                            <SelectItem key={tone} value={tone}>
                              {tone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="setting">
                        Setting <span className="text-red-500">*</span>
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("setting", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose setting" />
                        </SelectTrigger>
                        <SelectContent>
                          {settings.map((setting) => (
                            <SelectItem key={setting} value={setting}>
                              {setting}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customPrompt">Additional Instructions (Optional)</Label>
                    <Textarea
                      id="customPrompt"
                      placeholder="Any specific plot points, themes, or details you'd like to include in your story..."
                      value={formData.customPrompt}
                      onChange={(e) => handleInputChange("customPrompt", e.target.value)}
                      rows={4}
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg"
                      disabled={
                        isGenerating ||
                        !formData.mainCharacter ||
                        !formData.ageGroup ||
                        !formData.genre ||
                        !formData.tone ||
                        !formData.setting
                      }
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating Your Story...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Story with AI
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {isGenerating && (
                    <div className="text-center text-sm text-gray-600 mt-4">
                      <p>✨ Crafting your personalized story with GPT-4...</p>
                      <p>🎨 Generating custom DALL-E illustrations...</p>
                      <p>📚 This may take 1-2 minutes for the best results</p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

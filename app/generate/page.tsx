"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, ImageIcon, Upload, Instagram, Loader2, Eye } from "lucide-react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { InstagramImport } from "@/components/generate/instagram-import"
import { GeneratedContent } from "@/components/generate/generated-content"
import { toast } from "sonner"
import { useDropzone } from "react-dropzone"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") || "story"

  const [activeTab, setActiveTab] = useState(defaultType)
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  // Form states
  const [storyPrompt, setStoryPrompt] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imageStyle, setImageStyle] = useState("realistic")
  const [storyLength, setStoryLength] = useState("medium")

 const onDrop = useCallback((acceptedFiles: File[]) => {
  if (acceptedFiles.length > 0) {
    setUploadedImage(acceptedFiles[0] ?? null)
  }
}, [])


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
  })

  const generateStory = async () => {
    if (!storyPrompt.trim() && !uploadedImage) {
      toast.error("Please provide a prompt or upload an image")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("prompt", storyPrompt)
      formData.append("length", storyLength)
      if (uploadedImage) {
        formData.append("image", uploadedImage)
      }

      const response = await fetch("/api/generate/story", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to generate story")
      }

      const data = await response.json()
      setGeneratedContent(data.data)
      toast.success("Story generated successfully!")
    } catch (error) {
      toast.error("Failed to generate story")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error("Please provide an image prompt")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: imageStyle,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const data = await response.json()
      setGeneratedContent(data.data)
      toast.success("Image generated successfully!")
    } catch (error) {
      toast.error("Failed to generate image")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <DashboardNav />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold gradient-text mb-2">AI Content Generator</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Create amazing stories and images with the power of AI
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Generation Panel */}
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Create Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4 glass-effect border-0">
                      <TabsTrigger value="story">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Story
                      </TabsTrigger>
                      <TabsTrigger value="image">
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Image
                      </TabsTrigger>
                      <TabsTrigger value="upload">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </TabsTrigger>
                      <TabsTrigger value="instagram">
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="story" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="story-prompt">Story Prompt</Label>
                          <Textarea
                            id="story-prompt"
                            placeholder="Describe the story you want to create..."
                            value={storyPrompt}
                            onChange={(e) => setStoryPrompt(e.target.value)}
                            rows={4}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="story-length">Story Length</Label>
                          <Select value={storyLength} onValueChange={setStoryLength}>
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Short (200-400 words)</SelectItem>
                              <SelectItem value="medium">Medium (500-800 words)</SelectItem>
                              <SelectItem value="long">Long (1000-1500 words)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          onClick={generateStory}
                          disabled={loading || (!storyPrompt.trim() && !uploadedImage)}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating Story...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Generate Story
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="image" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="image-prompt">Image Prompt</Label>
                          <Textarea
                            id="image-prompt"
                            placeholder="Describe the image you want to create..."
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                            rows={4}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="image-style">Style</Label>
                          <Select value={imageStyle} onValueChange={setImageStyle}>
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realistic">Realistic</SelectItem>
                              <SelectItem value="artistic">Artistic</SelectItem>
                              <SelectItem value="cartoon">Cartoon</SelectItem>
                              <SelectItem value="abstract">Abstract</SelectItem>
                              <SelectItem value="vintage">Vintage</SelectItem>
                              <SelectItem value="futuristic">Futuristic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button
                          onClick={generateImage}
                          disabled={loading || !imagePrompt.trim()}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Generating Image...
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Generate Image
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <div>
                          <Label>Upload Image</Label>
                          <div
                            {...getRootProps()}
                            className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                              isDragActive
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                                : "border-gray-300 dark:border-gray-600 hover:border-purple-400"
                            }`}
                          >
                            <input {...getInputProps()} />
                            {uploadedImage ? (
                              <div>
                                <Upload className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-green-600 dark:text-green-400">{uploadedImage.name}</p>
                              </div>
                            ) : (
                              <div>
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {isDragActive
                                    ? "Drop the image here..."
                                    : "Drag & drop an image here, or click to select"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="upload-prompt">Story Prompt (Optional)</Label>
                          <Textarea
                            id="upload-prompt"
                            placeholder="Additional context for the story..."
                            value={storyPrompt}
                            onChange={(e) => setStoryPrompt(e.target.value)}
                            rows={3}
                            className="mt-2"
                          />
                        </div>

                        <Button
                          onClick={generateStory}
                          disabled={loading || !uploadedImage}
                          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Analyzing & Generating...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              Generate from Image
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="instagram" className="space-y-6 mt-6">
                      <InstagramImport
                        onImport={(data) => {
                          setGeneratedContent(data)
                          toast.success("Content imported from Instagram!")
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Results Panel */}
              <Card className="glass-effect border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Generated Content
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedContent ? (
                    <GeneratedContent content={generatedContent} type={activeTab} />
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Ready to Create</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Choose a generation type and start creating amazing content with AI
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

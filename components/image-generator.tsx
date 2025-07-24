"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Wand2, Download, RefreshCw } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ImageGeneratorProps {
  storyTitle?: string
  chapterNumber?: number
  initialPrompt?: string
  onImageGenerated?: (imageUrl: string) => void
}

export default function ImageGenerator({
  storyTitle,
  chapterNumber,
  initialPrompt = "",
  onImageGenerated,
}: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter an image description")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          storyTitle,
          chapterNumber,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate image")
      }

      const { imageUrl } = await response.json()
      setGeneratedImage(imageUrl)
      onImageGenerated?.(imageUrl)
      toast.success("Image generated successfully!")
    } catch (error) {
      console.error("Error generating image:", error)
      toast.error("Failed to generate image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async () => {
    if (!generatedImage) return

    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `story-illustration-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Image downloaded!")
    } catch (error) {
      console.error("Error downloading image:", error)
      toast.error("Failed to download image")
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-600" />
          AI Image Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="imagePrompt">Describe the scene you want to illustrate</Label>
          <Textarea
            id="imagePrompt"
            placeholder="e.g., A brave young girl with sparkling eyes standing in an enchanted forest with glowing flowers and friendly woodland creatures"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={generateImage}
          disabled={isGenerating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Image...
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Image with DALL-E
            </>
          )}
        </Button>

        {generatedImage && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={generatedImage || "/placeholder.svg"}
                alt="Generated story illustration"
                width={512}
                height={512}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadImage} variant="outline" className="flex-1 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={() => {
                  setGeneratedImage(null)
                  generateImage()
                }}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="text-center text-sm text-gray-600">
            <p>🎨 Creating your custom illustration...</p>
            <p>This may take 10-30 seconds for the best results</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

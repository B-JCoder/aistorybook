"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Wand2, X } from "lucide-react"
import { AIStoryService } from "@/lib/ai-service"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface StoryCreationFormProps {
  user: { id: string; name: string; email: string }
}

const STORY_CATEGORIES = [
  "Adventure",
  "Fantasy",
  "Educational",
  "Fairy Tale",
  "Mystery",
  "Science Fiction",
  "Animal Stories",
  "Friendship",
  "Family",
]

const STORY_TEMPLATES = [
  {
    id: "hero-journey",
    name: "Hero's Journey",
    description: "A character goes on an adventure and learns valuable lessons",
  },
  {
    id: "problem-solution",
    name: "Problem & Solution",
    description: "A character faces a challenge and finds a creative solution",
  },
  { id: "friendship", name: "Friendship Tale", description: "A story about making friends and working together" },
  { id: "lesson-learned", name: "Moral Lesson", description: "A story that teaches an important life lesson" },
  { id: "magical-world", name: "Magical Adventure", description: "An adventure in a world full of magic and wonder" },
]

export function StoryCreationForm({ user }: StoryCreationFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    template: "",
    prompt: "",
    length: "medium" as "short" | "medium" | "long",
    tags: [] as string[],
    isPublic: true,
  })
  const [newTag, setNewTag] = useState("")
  const router = useRouter()

  const handleGenerateStory = async () => {
    if (!formData.prompt) return

    setIsGenerating(true)
    try {
      const result = await AIStoryService.createStory({
        prompt: formData.prompt,
        template: formData.template,
        category: formData.category,
        length: formData.length,
      })

      setFormData((prev) => ({
        ...prev,
        title: result.title,
        content: result.content,
        category: result.category,
        tags: [...prev.tags, ...result.tags.filter((tag) => !prev.tags.includes(tag))],
      }))
    } catch (error) {
      // Error handling would be implemented here
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSaveStory = async () => {
    if (!formData.title || !formData.content || !formData.category) return

    setIsSaving(true)
    try {
      const { error } = await supabase.from("stories").insert({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        template: formData.template,
        author_id: user.id,
        author_name: user.name,
        is_public: formData.isPublic,
        likes: 0,
        views: 0,
        tags: formData.tags,
        collaborators: [],
      })

      if (!error) {
        router.push("/stories")
      }
    } catch (error) {
      // Error handling would be implemented here
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5" />
            <span>AI Story Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {STORY_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Template</label>
              <Select
                value={formData.template}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, template: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  {STORY_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Length</label>
              <Select
                value={formData.length}
                onValueChange={(value: "short" | "medium" | "long") =>
                  setFormData((prev) => ({ ...prev, length: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (200-400 words)</SelectItem>
                  <SelectItem value="medium">Medium (500-800 words)</SelectItem>
                  <SelectItem value="long">Long (1000-1500 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Visibility</label>
              <Select
                value={formData.isPublic.toString()}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, isPublic: value === "true" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Public</SelectItem>
                  <SelectItem value="false">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Story Prompt</label>
            <Textarea
              placeholder="Describe the story you want to create..."
              value={formData.prompt}
              onChange={(e) => setFormData((prev) => ({ ...prev, prompt: e.target.value }))}
              rows={3}
            />
          </div>

          <Button onClick={handleGenerateStory} disabled={!formData.prompt || isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Story...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Story with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {(formData.title || formData.content) && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Story</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter story title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Write your story here..."
                rows={15}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>{tag}</span>
                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSaveStory}
              disabled={!formData.title || !formData.content || !formData.category || isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Story...
                </>
              ) : (
                "Save Story"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import OpenAI from "openai"
import type { ApiResponse, GenerateStoryResponse, StoryFormData, StoryWithMetadata, Story } from "@/types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<StoryWithMetadata>>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData: StoryFormData = await request.json()

    if (!formData.mainCharacter || !formData.ageGroup || !formData.genre || !formData.tone || !formData.setting) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const supportingCharacters: string[] = Array.isArray(formData.supportingCharacters)
      ? formData.supportingCharacters
      : typeof formData.supportingCharacters === "string"
        ? formData.supportingCharacters.split(",").map((s) => s.trim())
        : []

    const storyPrompt = `Create a ${formData.tone.toLowerCase()} ${formData.genre.toLowerCase()} story for children aged ${formData.ageGroup}.

Story Details:
- Title: ${formData.title || `${formData.mainCharacter}'s Adventure`}
- Main Character: ${formData.mainCharacter}
- Supporting Characters: ${supportingCharacters.length > 0 ? supportingCharacters.join(", ") : "None"}
- Setting: ${formData.setting}
- Tone: ${formData.tone}
- Genre: ${formData.genre}
${formData.customPrompt ? `- Additional Instructions: ${formData.customPrompt}` : ""}

Create a story with exactly 5 chapters. Each chapter should be 2-3 paragraphs long and engaging. Format as JSON:
{
  "story": {
    "title": "...",
    "chapters": [
      {
        "title": "...",
        "text": "...",
        "imagePrompt": "..."
      }
    ]
  },
  "metadata": {
    "createdAt": "...",
    "userId": "..."
  }
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a creative children's story writer. Respond with valid JSON. Include image prompts for DALL·E illustrations.",
        },
        {
          role: "user",
          content: storyPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    })

    const storyContent = completion.choices?.[0]?.message?.content ?? ""
    if (!storyContent) {
      throw new Error("No story content received from OpenAI.")
    }

    let parsedStory: GenerateStoryResponse

    try {
      parsedStory = JSON.parse(storyContent)

      if (!parsedStory?.story?.title || !parsedStory.story.chapters) {
        throw new Error("Invalid story format")
      }
    } catch (e) {
      console.warn("Using fallback story due to parsing error:", e)

     const fallbackStory: Story = {
  id: "fallback-id",
  userId,
  title: formData.title || `${formData.mainCharacter}'s ${formData.genre} Adventure`,
  prompt: storyPrompt,
  chapters: Array.from({ length: 5 }).map((_, i) => ({
    chapterNumber: i + 1,
    content: [],
    title: `Chapter ${i + 1}`,
    text: i === 0 ? storyContent : `Placeholder text for chapter ${i + 1}`,
    imagePrompt: `${formData.mainCharacter} in ${formData.setting}, ${formData.genre.toLowerCase()} style`,
    imageUrl: "",
  })),
  content: "",
  collaborators: [],
  metadata: {
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "draft",
  },
  imageUrl: "",
  sourceImageUrl: "",
  sourceType: "generated",
  tags: [],
  isPublic: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  likes: 0,
  views: 0,
}

parsedStory = {
  title: fallbackStory.title,
  description: "A wonderful adventure story created just for you!",
  story: fallbackStory,
  metadata: {
    author: userId,
    genre: formData.genre,
    length: fallbackStory.chapters.length,
  },
  chapters: fallbackStory.chapters,
}

      parsedStory = {
  title: fallbackStory.title,
  description: "A wonderful adventure story created just for you!",
  story: fallbackStory,
  metadata: {
    author: userId,
    genre: formData.genre,
    length: fallbackStory.chapters.length,
  },
  chapters: fallbackStory.chapters,
}
    }

    const chaptersWithImages = await Promise.all(
      parsedStory.story.chapters.map(async (chapter) => {
        try {
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Children's book illustration: ${chapter.imagePrompt}. Style: colorful, friendly, cartoon-like.`,
            size: "1024x1024",
            quality: "standard",
            n: 1,
          })

          return {
            ...chapter,
            imageUrl: imageResponse.data?.[0]?.url ?? "",
          }
        } catch {
          return {
            ...chapter,
            imageUrl: "",
          }
        }
      })
    )

    const storyWithMetadata: StoryWithMetadata = {
    story: {
      ...parsedStory.story,
      chapters: chaptersWithImages,
      description: "",
      story: parsedStory.story,
      metadata: parsedStory.metadata,
    },

      metadata: {
        mainCharacter: formData.mainCharacter,
        ageGroup: formData.ageGroup,
        supportingCharacters,
        genre: formData.genre,
        tone: formData.tone,
        setting: formData.setting,
        userId,
        isDemo: false,
      },
    }

    return NextResponse.json({
      success: true,
      data: storyWithMetadata,
    })
  } catch (error) {
    console.error("Story generation failed:", error)
    return NextResponse.json({ success: false, error: "Failed to generate story" }, { status: 500 })
  }
}

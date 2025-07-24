import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import OpenAI from "openai"
import type { ApiResponse, GenerateStoryResponse, StoryFormData, StoryWithMetadata } from "@/types"

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

    // Validate required fields
    if (!formData.mainCharacter || !formData.ageGroup || !formData.genre || !formData.tone || !formData.setting) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Ensure supportingCharacters is always an array
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
  "title": "...",
  "description": "...",
  "chapters": [
    {
      "title": "...",
      "text": "...",
      "imagePrompt": "..."
    }
  ]
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

      // Validate that the parsed story has the required structure
      if (!parsedStory.title || !parsedStory.chapters || !Array.isArray(parsedStory.chapters)) {
        throw new Error("Invalid story structure from OpenAI")
      }
    } catch (parseError) {
      console.warn("Failed to parse OpenAI response, using fallback:", parseError)

      // Fallback if OpenAI JSON is malformed


try {
  parsedStory = JSON.parse(storyContent)
} 
    catch {
  parsedStory = {
    story: {
      title: formData.title || `${formData.mainCharacter}'s ${formData.genre} Adventure`,
      description: "A wonderful adventure story created just for you!",
      chapters: [
        {
          title: "Chapter 1: The Beginning",
          text: storyContent || "Once upon a time, there was an amazing adventure waiting to unfold...",
          imagePrompt: `${formData.mainCharacter} in a ${formData.setting}, ${formData.genre.toLowerCase()} style illustration, colorful and friendly`,
          imageUrl: "" // <-- Required to match type
        },
        {
          title: "Chapter 2: The Journey Continues",
          text: "The adventure grows more exciting as our hero discovers new challenges and friends.",
          imagePrompt: `${formData.mainCharacter} exploring ${formData.setting}, meeting new friends, ${formData.genre.toLowerCase()} adventure scene`,
          imageUrl: ""
        },
        {
          title: "Chapter 3: Challenges Ahead",
          text: "Every great story has obstacles to overcome, and this one is no different.",
          imagePrompt: `${formData.mainCharacter} facing a challenge in ${formData.setting}, determined and brave`,
          imageUrl: ""
        },
        {
          title: "Chapter 4: Finding Solutions",
          text: "With courage and creativity, our hero finds a way to solve the problems ahead.",
          imagePrompt: `${formData.mainCharacter} solving problems with friends in ${formData.setting}`,
          imageUrl: ""
        },
        {
          title: "Chapter 5: A Happy Ending",
          text: "The adventure comes to a wonderful conclusion, with lessons learned and friendships made.",
          imagePrompt: `${formData.mainCharacter} celebrating success in ${formData.setting}, happy ending scene`,
          imageUrl: ""
        },
      ]
    },
    metadata: {
      createdAt: new Date().toISOString(),
      userId: "guest" // Replace with real user ID if available
    }
  }
}}

    // Generate images for all chapters
    const chaptersWithImages = await Promise.all(
      parsedStory.chapters.map(async (chapter, index) => {
        try {
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Children's book illustration: ${chapter.imagePrompt}. Style: colorful, friendly, cartoon-like, safe atmosphere for children.`,
            size: "1024x1024",
            quality: "standard",
            n: 1,
          })

          return {
            ...chapter,
            imageUrl: imageResponse.data?.[0]?.url ?? "",
          }
        } catch (imageError) {
          console.error(`Image generation failed for chapter ${index + 1}:`, imageError)
          return {
            ...chapter,
            imageUrl: "", // Fallback to empty string if image generation fails
          }
        }
      }),
    )

    // ✅ Fixed: Return structure that matches StoryWithMetadata type
    const storyWithMetadata: StoryWithMetadata = {
      story: {
        title: parsedStory.title,
        description: parsedStory.description || "An amazing adventure story",
        chapters: chaptersWithImages,
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

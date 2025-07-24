import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import OpenAI from "openai"
import type { ApiResponse, GenerateStoryResponse, StoryFormData } from "@/types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<GenerateStoryResponse>>> {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData: StoryFormData = await request.json()

    if (!formData.mainCharacter || !formData.ageGroup || !formData.genre || !formData.tone || !formData.setting) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const storyPrompt = `
Create a ${formData.tone.toLowerCase()} ${formData.genre.toLowerCase()} story for children aged ${formData.ageGroup}.

Story Details:
- Title: ${formData.title || `${formData.mainCharacter}'s Adventure`}
- Main Character: ${formData.mainCharacter}
- Supporting Characters: ${formData.supportingCharacters?.join(", ") || "None"}
- Setting: ${formData.setting}
- Tone: ${formData.tone}
- Genre: ${formData.genre}
${formData.customPrompt ? `- Additional Instructions: ${formData.customPrompt}` : ""}

Please create a story with exactly 5 chapters. Each chapter should be 2-3 paragraphs long and engaging for the target age group. Format the response as a JSON object with this structure:

{
  "title": "An engaging story title",
  "chapters": [
    {
      "chapterNumber": 1,
      "title": "Chapter title",
      "content": "Chapter content here...",
      "imagePrompt": "Detailed description for DALL-E illustration showing the scene, characters, and setting in a child-friendly art style"
    }
  ]
}

Make sure the story is age-appropriate, engaging, teaches positive values, and has a satisfying conclusion. Each imagePrompt should be detailed and specific for generating beautiful children's book illustrations with DALL-E.
    `

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a creative children's story writer who creates engaging, age-appropriate stories with positive messages. Always respond with valid JSON. Create detailed image prompts for each chapter that will work well with DALL-E for children's book illustrations.",
        },
        {
          role: "user",
          content: storyPrompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 3000,
    })

    const storyContent = completion.choices[0].message.content

    if (!storyContent) {
      throw new Error("No story content generated")
    }

    let parsedStory
    try {
      parsedStory = JSON.parse(storyContent)
    } catch {
      parsedStory = {
        title: formData.title || `${formData.mainCharacter}'s ${formData.genre} Adventure`,
        chapters: [
          {
            chapterNumber: 1,
            title: "The Beginning",
            content: storyContent,
            imagePrompt: `${formData.mainCharacter} in a ${formData.setting}, ${formData.genre.toLowerCase()} style illustration for children's book, colorful and friendly`,
          },
        ],
      }
    }

    const chaptersWithImages = await Promise.all(
      parsedStory.chapters.map(async (chapter: any) => {
        try {
          const imageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Children's book illustration: ${chapter.imagePrompt}. Style: Colorful, friendly, cartoon-like, safe and welcoming atmosphere, high quality, detailed but not scary, appropriate for young readers.`,
            size: "1024x1024",
            quality: "standard",
            n: 1,
          })

          return {
            ...chapter,
            imageUrl: imageResponse.data[0].url,
          }
        } catch {
          return chapter
        }
      }),
    )

    return NextResponse.json({
      success: true,
      data: {
        story: {
          ...parsedStory,
          chapters: chaptersWithImages,
        },
        metadata: {
          mainCharacter: formData.mainCharacter,
          ageGroup: formData.ageGroup,
          supportingCharacters: formData.supportingCharacters || [],
          genre: formData.genre,
          tone: formData.tone,
          setting: formData.setting,
          userId,
          isDemo: false,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate story" }, { status: 500 })
  }
}

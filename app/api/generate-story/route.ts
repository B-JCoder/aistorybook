import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated (optional for demo mode)
    let userId = null
    try {
      const { auth } = await import("@clerk/nextjs/server")
      const authResult = await auth()
      userId = authResult.userId
    } catch (error) {
      // Continue in demo mode if authentication is not available
      console.log("Authentication not available, continuing in demo mode")
    }

    const { title, mainCharacter, ageGroup, supportingCharacters, genre, tone, setting, customPrompt } =
      await request.json()

    // Validate required fields
    if (!mainCharacter || !ageGroup || !genre || !tone || !setting) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a comprehensive prompt for story generation
    const storyPrompt = `
Create a ${tone.toLowerCase()} ${genre.toLowerCase()} story for children aged ${ageGroup}.

Story Details:
- Title: ${title || `${mainCharacter}'s Adventure`}
- Main Character: ${mainCharacter}
- Supporting Characters: ${supportingCharacters?.join(", ") || "None"}
- Setting: ${setting}
- Tone: ${tone}
- Genre: ${genre}
${customPrompt ? `- Additional Instructions: ${customPrompt}` : ""}

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


    const storyContent = completion.choices?.[0]?.message?.content;



    if (!storyContent) {
      throw new Error("No story content generated")
    }

    // Parse the JSON response
    let parsedStory
    try {
      parsedStory = JSON.parse(storyContent)
    } catch (parseError) {
      // If JSON parsing fails, create a fallback structure
      parsedStory = {
        title: title || `${mainCharacter}'s ${genre} Adventure`,
        chapters: [
          {
            chapterNumber: 1,
            title: "The Beginning",
            content: storyContent,
            imagePrompt: `${mainCharacter} in a ${setting}, ${genre.toLowerCase()} style illustration for children's book, colorful and friendly`,
          },
        ],
      }
    }

    return NextResponse.json({
      success: true,
      story: parsedStory,
      metadata: {
        title: parsedStory.title,
        mainCharacter,
        ageGroup,
        supportingCharacters: supportingCharacters || [],
        genre,
        tone,
        setting,
        customPrompt,
        userId: userId || "demo-user",
        isDemo: !userId,
      },
    })
  } catch (error) {
    console.error("Error generating story:", error)
    return NextResponse.json({ error: "Failed to generate story" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { prompt, template, category, length = "medium" } = await request.json()

    const lengthGuide = {
      short: "200-400 words",
      medium: "500-800 words",
      long: "1000-1500 words",
    }

    const systemPrompt = `You are a creative children's storyteller. Create engaging, age-appropriate stories that are educational and entertaining. 
    ${template ? `Use this template structure: ${template}` : ""}
    ${category ? `Story category: ${category}` : ""}
    Target length: ${lengthGuide[length as keyof typeof lengthGuide]}
    
    Return a JSON response with:
    - title: A catchy, child-friendly title
    - content: The complete story with proper paragraphs
    - category: Story category (adventure, fantasy, educational, etc.)
    - tags: Array of relevant tags`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: prompt,
    })

    let parsedResponse
    try {
      parsedResponse = JSON.parse(text)
    } catch {
      // Fallback if AI doesn't return valid JSON
      parsedResponse = {
        title: "Generated Story",
        content: text,
        category: category || "general",
        tags: ["ai-generated"],
      }
    }

    return NextResponse.json(parsedResponse)
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate story" }, { status: 500 })
  }
}

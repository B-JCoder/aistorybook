import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { content, enhancement } = await request.json()

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a story editor. Enhance the given story based on the user's request while maintaining the original story's essence and child-friendly nature.`,
      prompt: `Original story: ${content}\n\nEnhancement request: ${enhancement}\n\nReturn only the enhanced story content.`,
    })

    return NextResponse.json({ enhancedContent: text })
  } catch (error) {
    return NextResponse.json({ error: "Failed to enhance story" }, { status: 500 })
  }
}

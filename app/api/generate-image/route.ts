import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import OpenAI from "openai"
import type { ApiResponse, GenerateImageResponse } from "@/types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<GenerateImageResponse>>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ success: false, error: "Image prompt is required" }, { status: 400 })
    }

    const enhancedPrompt = `
Children's book illustration: ${prompt}
Style: Colorful, friendly, cartoon-like illustration suitable for children's books
Art style: Digital art, bright vibrant colors, safe and welcoming atmosphere
Quality: High quality, detailed but not scary, appropriate for young readers
Character design: Cute, expressive, and appealing to children
Background: Rich, imaginative, and story-appropriate
Lighting: Warm and inviting
No text or words in the image
    `.trim()

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    })

    const imageUrl = response.data?.[0]?.url || "";


    if (!imageUrl) {
      throw new Error("No image URL returned from DALL-E")
    }

    return NextResponse.json({
      success: true,
      data: {
        imageUrl,
        originalPrompt: prompt,
        enhancedPrompt,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate image" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import type { ApiResponse, GenerateImageResponse } from "@/types";

// Initialize OpenAI once
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<GenerateImageResponse>>> {
  try {
    // Authenticate the user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const prompt = body?.prompt?.trim();

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: "Prompt is required for image generation." },
        { status: 400 }
      );
    }

    // Enhance prompt for image generation
    const enhancedPrompt = [
      `Children's book illustration: ${prompt}`,
      "Style: Colorful, friendly, cartoon-like illustration suitable for children",
      "Art style: Digital, bright and vibrant colors",
      "Character: Cute, expressive, child-appealing",
      "Background: Imaginative and story-relevant",
      "Lighting: Warm and inviting",
      "No text or words in the image"
    ].join("\n");

    // Call DALL·E-3 for image generation
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "No image returned from OpenAI." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        imageUrl,
        originalPrompt: prompt,
        enhancedPrompt,
      },
    });
  } catch (error) {
    console.error("Image Generation Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error. Could not generate image." },
      { status: 500 }
    );
  }
}

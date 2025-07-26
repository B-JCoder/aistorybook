import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import OpenAI from "openai"
import type { ApiResponse, TranscribeAudioResponse } from "@/types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<TranscribeAudioResponse>>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const audioFile = formData.get("audio") as File

    if (!audioFile) {
      return NextResponse.json({ success: false, error: "Audio file is required" }, { status: 400 })
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "Audio file too large. Maximum size is 25MB." },
        { status: 400 },
      )
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
      response_format: "json",
      temperature: 0.2,
    })

    return NextResponse.json({
      success: true,
      data: {
        text: transcription.text,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to transcribe audio" }, { status: 500 })
  }
}

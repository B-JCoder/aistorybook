import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const { story, metadata } = await request.json()

    if (!story || !metadata) {
      return NextResponse.json({ error: "Missing story data" }, { status: 400 })
    }

    // Check if user is authenticated (optional for demo mode)
    let userId = null
    try {
      const { auth } = await import("@clerk/nextjs/server")
      const authResult = await auth()
      userId = authResult.userId
    } catch (error) {
      // Clerk not configured or user not authenticated - continue in demo mode
      console.log("Authentication not available, saving in demo mode")
    }

    // Save story to Firestore
    const docRef = await addDoc(collection(db, "stories"), {
      title: story.title,
      chapters: story.chapters,
      metadata: {
        ...metadata,
        userId: userId || "demo-user",
        isDemo: !userId,
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    return NextResponse.json({
      success: true,
      storyId: docRef.id,
    })
  } catch (error) {
    console.error("Error saving story:", error)
    return NextResponse.json({ error: "Failed to save story" }, { status: 500 })
  }
}

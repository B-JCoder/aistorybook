import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storyId = searchParams.get("storyId")
    const chapterNumber = Number.parseInt(searchParams.get("chapter") || "1")

    if (!storyId) {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 })
    }

    // Get the story
    const storyRef = doc(db, "stories", storyId)
    const storyDoc = await getDoc(storyRef)

    if (!storyDoc.exists()) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    const storyData = storyDoc.data()
    const isOwner = storyData.metadata.userId === userId
    const collaborators = storyData.collaborators || []
    const userCollaboration = collaborators.find((c: any) => c.id === userId)
    const hasAccess = isOwner || userCollaboration

    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Find the specific chapter
    const chapters = storyData.chapters || []
    const chapter = chapters.find((c: any) => c.chapterNumber === chapterNumber)

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 })
    }

    // Simulate active edit sessions (in a real app, this would come from a real-time database)
    const editSessions = [
      // Mock data - in real implementation, track active editing sessions
    ]

    return NextResponse.json({
      success: true,
      content: chapter.content,
      editSessions,
      lastEditedBy: storyData.lastEditedBy,
    })
  } catch (error) {
    console.error("Error checking updates:", error)
    return NextResponse.json({ error: "Failed to check updates" }, { status: 500 })
  }
}

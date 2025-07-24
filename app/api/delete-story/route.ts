import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { doc, deleteDoc, getDoc } from "firebase/firestore"

export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated
    let userId = null
    try {
      const { auth } = await import("@clerk/nextjs/server")
      const authResult = auth()
      userId = authResult.userId
    } catch (error) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storyId = searchParams.get("id")

    if (!storyId) {
      return NextResponse.json({ error: "Story ID required" }, { status: 400 })
    }

    // Verify the story belongs to the user
    const storyRef = doc(db, "stories", storyId)
    const storyDoc = await getDoc(storyRef)

    if (!storyDoc.exists()) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    const storyData = storyDoc.data()
    if (storyData.metadata.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized to delete this story" }, { status: 403 })
    }

    // Delete the story
    await deleteDoc(storyRef)

    return NextResponse.json({
      success: true,
      message: "Story deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting story:", error)
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 })
  }
}

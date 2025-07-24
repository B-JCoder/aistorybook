import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { storyId, chapterNumber, content, userName } = await request.json()

    if (!storyId || chapterNumber === undefined || content === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get the story and verify permissions
    const storyRef = doc(db, "stories", storyId)
    const storyDoc = await getDoc(storyRef)

    if (!storyDoc.exists()) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    const storyData = storyDoc.data()
    const isOwner = storyData.metadata.userId === userId
    const collaborators = storyData.collaborators || []
    const userCollaboration = collaborators.find((c: any) => c.id === userId)
    const canEdit = isOwner || (userCollaboration && userCollaboration.role === "editor")

    if (!canEdit) {
      return NextResponse.json({ error: "Insufficient permissions to edit" }, { status: 403 })
    }

    // Update the specific chapter content
    const chapters = storyData.chapters || []
    const updatedChapters = chapters.map((chapter: any) =>
      chapter.chapterNumber === chapterNumber ? { ...chapter, content } : chapter,
    )

    // Update the story with new content and edit history
    await updateDoc(storyRef, {
      chapters: updatedChapters,
      updatedAt: serverTimestamp(),
      lastEditedBy: {
        userId,
        userName: userName || "Anonymous",
        timestamp: serverTimestamp(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Content saved successfully",
    })
  } catch (error) {
    console.error("Error saving content:", error)
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 })
  }
}

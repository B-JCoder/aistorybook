import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { storyId, collaboratorId } = await request.json()

    if (!storyId || !collaboratorId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify the user is the owner of the story
    const storyRef = doc(db, "stories", storyId)
    const storyDoc = await getDoc(storyRef)

    if (!storyDoc.exists()) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 })
    }

    const storyData = storyDoc.data()
    if (storyData.metadata.userId !== userId) {
      return NextResponse.json({ error: "Only the story owner can remove collaborators" }, { status: 403 })
    }

    // Remove the collaborator
    const collaborators = storyData.collaborators || []
    const updatedCollaborators = collaborators.filter((c: any) => c.id !== collaboratorId)

    await updateDoc(storyRef, {
      collaborators: updatedCollaborators,
    })

    return NextResponse.json({
      success: true,
      message: "Collaborator removed successfully",
    })
  } catch (error) {
    console.error("Error removing collaborator:", error)
    return NextResponse.json({ error: "Failed to remove collaborator" }, { status: 500 })
  }
}

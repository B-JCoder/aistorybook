import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { storyId, collaboratorId, role } = await request.json()

    if (!storyId || !collaboratorId || !role) {
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
      return NextResponse.json({ error: "Only the story owner can update roles" }, { status: 403 })
    }

    // Update the collaborator's role
    const collaborators = storyData.collaborators || []
    const updatedCollaborators = collaborators.map((c: any) => (c.id === collaboratorId ? { ...c, role } : c))

    await updateDoc(storyRef, {
      collaborators: updatedCollaborators,
    })

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
    })
  } catch (error) {
    console.error("Error updating role:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}

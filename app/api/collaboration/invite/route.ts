import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { storyId, email, role } = await request.json()

    if (!storyId || !email || !role) {
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
      return NextResponse.json({ error: "Only the story owner can invite collaborators" }, { status: 403 })
    }

    // In a real implementation, you would:
    // 1. Look up the user by email in your user database
    // 2. Send an email invitation
    // 3. Create a pending invitation record

    // For this demo, we'll simulate adding a collaborator directly
    const newCollaborator = {
      id: `collab_${Date.now()}`, // In real app, this would be the actual user ID
      email,
      name: email.split("@")[0], // In real app, get from user profile
      role,
      joinedAt: new Date().toISOString(),
    }

    // Update the story with the new collaborator
    await updateDoc(storyRef, {
      collaborators: arrayUnion(newCollaborator),
    })

    return NextResponse.json({
      success: true,
      collaborator: newCollaborator,
    })
  } catch (error) {
    console.error("Error inviting collaborator:", error)
    return NextResponse.json({ error: "Failed to invite collaborator" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore"
import type { ApiResponse, Story } from "@/types"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<ApiResponse<{ story: Story }>>> {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const storyRef = doc(db, "stories", params.id)
    const storyDoc = await getDoc(storyRef)

    if (!storyDoc.exists()) {
      return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 })
    }

    const storyData = storyDoc.data() as Story
    const isOwner = storyData.metadata.userId === userId
    const isCollaborator = storyData.collaborators?.some((c) => c.id === userId)

    if (!isOwner && !isCollaborator) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: { story: { id: storyDoc.id, ...storyData } },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch story" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse>> {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const storyRef = doc(db, "stories", params.id)
    const storyDoc = await getDoc(storyRef)

    if (!storyDoc.exists()) {
      return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 })
    }

    const storyData = storyDoc.data()
    if (storyData.metadata.userId !== userId) {
      return NextResponse.json({ success: false, error: "Unauthorized to delete this story" }, { status: 403 })
    }

    await deleteDoc(storyRef)

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete story" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams): Promise<NextResponse<ApiResponse>> {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { chapters } = await request.json()

    const storyRef = doc(db, "stories", params.id)
    const storyDoc = await getDoc(storyRef)

    if (!storyDoc.exists()) {
      return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 })
    }

    const storyData = storyDoc.data()
    const isOwner = storyData.metadata.userId === userId
    const collaborator = storyData.collaborators?.find((c: { id: string }) => c.id === userId)
    const canEdit = isOwner || (collaborator && collaborator.role === "editor")

    if (!canEdit) {
      return NextResponse.json({ success: false, error: "Insufficient permissions" }, { status: 403 })
    }

    await updateDoc(storyRef, {
      chapters,
      updatedAt: new Date(),
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update story" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore"
import type { ApiResponse, Story } from "@/types"


type Context = {
  params: Promise<{
    id: string
  }>
}


export async function GET(
  _req: NextRequest,
  { params }: Context,
): Promise<NextResponse<ApiResponse<{ story: Story }>>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    
    const { id } = await params

    const storyRef = doc(db, "stories", id)
    const storySnap = await getDoc(storyRef)

    if (!storySnap.exists()) {
      return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 })
    }

   const storyData = storySnap.data() as Story

const isOwner = storyData.metadata?.userId === userId

const isCollaborator = storyData.collaborators?.some(
  (c: { userId: string; role?: string }) => c.userId === userId
)

if (!isOwner && !isCollaborator) {
  return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 })
}

return NextResponse.json({
  success: true,
  data: { story: { ...storyData, id: storySnap.id } },
})
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch story" }, { status: 500 })
  }
}

// ✅ DELETE /api/stories/[id]
export async function DELETE(_req: NextRequest, { params }: Context): Promise<NextResponse<ApiResponse>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // ✅ Await params to get the actual parameters
    const { id } = await params

    const storyRef = doc(db, "stories", id)
    const storySnap = await getDoc(storyRef)

    if (!storySnap.exists()) {
      return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 })
    }

    const storyData = storySnap.data() as Story
  if (!storyData.metadata || storyData.metadata.userId !== userId) {
  return NextResponse.json({ success: false, error: "Unauthorized to delete this story" }, { status: 403 })
}

    await deleteDoc(storyRef)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete story" }, { status: 500 })
  }
}

// ✅ PUT /api/stories/[id]
export async function PUT(req: NextRequest, { params }: Context): Promise<NextResponse<ApiResponse>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { chapters } = await req.json()

   
    const { id } = await params

    const storyRef = doc(db, "stories", id)
    const storySnap = await getDoc(storyRef)

    if (!storySnap.exists()) {
      return NextResponse.json({ success: false, error: "Story not found" }, { status: 404 })
    }

    const storyData = storySnap.data() as Story;

const isOwner = storyData.metadata?.userId === userId;

const collaborator = storyData.collaborators?.find(
  (c) => c.userId === userId && c.role === "editor"
);

const canEdit = isOwner || (collaborator?.role === "editor");

    if (!canEdit) {
      return NextResponse.json({ success: false, error: "Insufficient permissions" }, { status: 403 })
    }

    await updateDoc(storyRef, {
      chapters,
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update story" }, { status: 500 })
  }
}

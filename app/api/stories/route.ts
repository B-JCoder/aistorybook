import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore"
import type { ApiResponse, Story } from "@/types"

// ✅ For /api/stories route (no dynamic params needed)
// If this route doesn't use dynamic parameters, remove the Context type entirely

// ✅ GET /api/stories - Fetch all stories for the authenticated user
export async function GET(_req: NextRequest): Promise<NextResponse<ApiResponse<{ stories: Story[] }>>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const storiesRef = collection(db, "stories")
    const q = query(storiesRef, where("metadata.userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const stories: Story[] = []

    querySnapshot.forEach((doc) => {
      stories.push({ id: doc.id, ...doc.data() } as Story)
    })

    return NextResponse.json({
      success: true,
      data: { stories },
    })
  } catch (error) {
    console.error("Error fetching stories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stories" }, { status: 500 })
  }
}

// ✅ POST /api/stories - Create a new story
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<{ story: Story }>>> {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, genre, targetAudience } = body

    if (!title || !description) {
      return NextResponse.json({ success: false, error: "Title and description are required" }, { status: 400 })
    }

    const newStory = {
      title,
      description,
      genre: genre || "fantasy",
      targetAudience: targetAudience || "children",
      chapters: [],
      metadata: {
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "draft",
      },
      collaborators: [],
    }

    const docRef = await addDoc(collection(db, "stories"), newStory)
    const createdStory = { id: docRef.id, ...newStory } as unknown as Story

    return NextResponse.json({
      success: true,
      data: { story: createdStory },
    })
  } catch (error) {
    console.error("Error creating story:", error)
    return NextResponse.json({ success: false, error: "Failed to create story" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore"
import type { ApiResponse, Story, GenerateStoryResponse } from "@/types"

export async function GET(_req: NextRequest,
  _context: { params: { id: string } }): Promise<NextResponse<ApiResponse<{ stories: Story[] }>>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    

    const q = query(collection(db, "stories"), where("metadata.userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const stories: Story[] = []

    querySnapshot.forEach((doc) => {
      stories.push({
       id: doc.id,
  ...(doc.data() as Omit<Story, "id">),
      } as Story)
    })

    return NextResponse.json({
      success: true,
      data: { stories },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ storyId: string }>>> {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { story, metadata }: GenerateStoryResponse = await request.json()

    if (!story || !metadata) {
      return NextResponse.json({ success: false, error: "Missing story data" }, { status: 400 })
    }
    
const docRef = await addDoc(collection(db, "stories"), {
  title: story.title,
  chapters: story.chapters, 
  metadata: {
    ...metadata,
    userId,
    isDemo: false,
  },
  collaborators: [],
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});


    return NextResponse.json({
      success: true,
      data: { storyId: docRef.id },
    })
  } catch (error) {
    console.error("GET/POST Error:", error);
    return NextResponse.json({ success: false, error: "Failed to save story" }, { status: 500 })
  }
  
}

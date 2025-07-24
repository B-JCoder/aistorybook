import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"

export async function GET(_request: NextRequest) {
  try {
    // Check if user is authenticated (optional for demo mode)
    let userId = null
    try {
      const { auth } = await import("@clerk/nextjs/server")
      const authResult = await auth()
      userId = authResult.userId
    } catch (error) {
      // Clerk not configured - return demo stories or empty array
      console.log("Authentication not available")
    }

    if (!userId) {
      // Return demo stories or empty array for unauthenticated users
      return NextResponse.json({
        success: true,
        stories: [],
      })
    }

    // Query user's stories from Firestore
    const q = query(collection(db, "stories"), where("metadata.userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const stories: any[] = []

    querySnapshot.forEach((doc) => {
      stories.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return NextResponse.json({
      success: true,
      stories,
    })
  } catch (error) {
    console.error("Error fetching stories:", error)
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 })
  }
}

import { Navigation } from "@/components/navigation"
import { StoryCard } from "@/components/story-card"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

async function getUser() {
  const cookieStore = cookies()
  const token = (await cookieStore).get("token")
  if (!token) {
    return null
  }
  const supabaseUser = await supabase.auth.getUser()
  return supabaseUser.data.user
}

async function getUserStories(userId: string) {
  const { data: stories, error } = await supabase
    .from("stories")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    return []
  }

  return stories || []
}

export default async function StoriesPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userData = {
    id: user.id,
    name: user.user_metadata?.name || "User",
    email: user.email || "",
  }

  const stories = await getUserStories(user.id)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation user={userData} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Stories</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage and view all your created stories</p>
          </div>
          <Link href="/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Story
            </Button>
          </Link>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <PlusCircle className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No stories yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Start creating your first story with AI assistance</p>
            <Link href="/create">
              <Button>Create Your First Story</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

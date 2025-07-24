import { Navigation } from "@/components/navigation"
import { StoryCreationForm } from "@/components/story-creation-form"
import { supabase } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function getUser() {
  const cookieStore = cookies()
  const session = await (await cookieStore).get('supabase-auth')
  if (!session) return null
  const supabaseUser = await supabase.auth.getUser()
  return supabaseUser.data.user
}

export default async function CreatePage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const userData = {
    id: user.id,
    name: user.user_metadata?.name || "User",
    email: user.email || "",
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation user={userData} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create a New Story</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Use AI to generate amazing stories or write your own from scratch
          </p>
        </div>
        <StoryCreationForm user={userData} />
      </main>
    </div>
  )
}

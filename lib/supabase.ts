import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string
          title: string
          content: string
          category: string
          template: string
          author_id: string
          author_name: string
          created_at: string
          updated_at: string
          is_public: boolean
          likes: number
          views: number
          audio_url: string | null
          cover_image: string | null
          tags: string[]
          collaborators: string[]
        }
        Insert: Omit<Database["public"]["Tables"]["stories"]["Row"], "id" | "created_at" | "updated_at">
        Update: Partial<Database["public"]["Tables"]["stories"]["Insert"]>
      }
      story_templates: {
        Row: {
          id: string
          name: string
          description: string
          content_structure: string
          category: string
        }
        Insert: Omit<Database["public"]["Tables"]["story_templates"]["Row"], "id">
        Update: Partial<Database["public"]["Tables"]["story_templates"]["Insert"]>
      }
      collaborations: {
        Row: {
          id: string
          story_id: string
          user_id: string
          permission: "read" | "write" | "admin"
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["collaborations"]["Row"], "id" | "created_at">
        Update: Partial<Database["public"]["Tables"]["collaborations"]["Insert"]>
      }
    }
  }
}

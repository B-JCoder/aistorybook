export interface Story {
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
  audio_url?: string
  cover_image?: string
  tags: string[]
  collaborators: string[]
}

export interface StoryTemplate {
  id: string
  name: string
  description: string
  content_structure: string
  category: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
}

export interface Collaboration {
  id: string
  story_id: string
  user_id: string
  permission: "read" | "write" | "admin"
  created_at: string
}

export interface Analytics {
  story_id: string
  views: number
  likes: number
  shares: number
  reading_time: number
  completion_rate: number
}

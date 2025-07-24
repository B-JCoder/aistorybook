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

export interface StoryFormData {
  title: string
  mainCharacter: string
  ageGroup: string
  genre: string
  tone: string
  setting: string
  additionalInstructions?: string
}

export interface GenerateStoryResponse {
  title: string
  description: string
  chapters: {
    title: string
    text: string
    imagePrompt: string
    imageUrl?: string
  }[]
}

export interface GenerateStoryRequest {
  prompt?: string
  imageUrl?: string
  style?: string
  length?: "short" | "medium" | "long"
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}
export interface GenerateStoryResponse {
  title: string;
  description: string;
  chapters: {
    title: string;
    text: string;
    imagePrompt: string;
    imageUrl?: string;
  }[];
}
// in your /types.ts
export interface StoryWithMetadata {
  story: GenerateStoryResponse;
  metadata: {
    mainCharacter: string;
    ageGroup: string;
    supportingCharacters: string[];
    genre: string;
    tone: string;
    setting: string;
    userId: string;
    isDemo: boolean;
  };
}

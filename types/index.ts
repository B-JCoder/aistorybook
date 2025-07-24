export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  imageUrl?: string
  createdAt: Date
  isAdmin: boolean
}

export interface Story {
  id: string
  userId: string
  title: string
  content: string
  prompt: string
  imageUrl?: string
  sourceImageUrl?: string
  sourceType: "upload" | "instagram" | "generated"
  tags: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  likes: number
  views: number
}

export interface GeneratedImage {
  id: string
  userId: string
  prompt: string
  imageUrl: string
  sourceImageUrl?: string
  sourceType: "upload" | "instagram" | "text"
  style: string
  isPublic: boolean
  createdAt: Date
  likes: number
  views: number
}

export interface InstagramMedia {
  id: string
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM"
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
}

export interface AdminStats {
  totalUsers: number
  totalStories: number
  totalImages: number
  todayUsers: number
  todayStories: number
  todayImages: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface GenerateStoryRequest {
  prompt?: string
  imageUrl?: string
  style?: string
  length?: "short" | "medium" | "long"
}

export interface GenerateImageRequest {
  prompt: string
  style?: string
  size?: "1024x1024" | "1792x1024" | "1024x1792"
  sourceImageUrl?: string
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

export interface StoryWithMetadata {
  story: GenerateStoryResponse
  metadata: {
    mainCharacter: string
    ageGroup: string
    supportingCharacters: string[]
    genre: string
    tone: string
    setting: string
    userId: string
    isDemo: boolean
  }
}
export interface StoryFormData {
  title: string
  mainCharacter: string
  ageGroup: string
  genre: string
  tone: string
  setting: string
  supportingCharacters?: string[] | string
  customPrompt?: string
  userId?: string
}
export interface GenerateImageResponse {
  imageUrl: string
  originalPrompt: string
  enhancedPrompt: string
  sourceImageUrl?: string
  sourceType?: "upload" | "instagram" | "text"
  style?: string
  size?: "1024x1024" | "1792x1024" | "1024x1792"
  createdAt?: Date
  likes?: number
  views?: number
  isPublic?: boolean
  completion_rate?: number
  error?: string
  success?: boolean
  data?: GenerateImageResponse
  prompt?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}
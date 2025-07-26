// export interface User {
//   id: string
//   email: string
//   firstName: string
//   lastName: string
//   imageUrl?: string
//   createdAt: Date
//   isAdmin: boolean
// }

// export interface Story {
//   collaborators: any
//   metadata: any
//   id: string
//   userId: string
//   title: string
//   chapters: Chapter[]
//   content: string
//   prompt: string
//   imageUrl?: string
//   sourceImageUrl?: string
//   sourceType: 'upload' | 'instagram' | 'generated'
//   tags: string[]
//   isPublic: boolean
//   createdAt: Date
//   updatedAt: Date
//   likes: number
//   views: number
// }

// export interface GeneratedImage {
//   id: string
//   userId: string
//   prompt: string
//   imageUrl: string
//   sourceImageUrl?: string
//   sourceType: 'upload' | 'instagram' | 'text'
//   style: string
//   isPublic: boolean
//   createdAt: Date
//   likes: number
//   views: number
// }

// export interface InstagramMedia {
//   id: string
//   media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
//   media_url: string
//   permalink: string
//   caption?: string
//   timestamp: string
// }

// export interface AdminStats {
//   totalUsers: number
//   totalStories: number
//   totalImages: number
//   todayUsers: number
//   todayStories: number
//   todayImages: number
// }

// export interface ApiResponse<T = any> {
//   success: boolean
//   data?: T
//   error?: string
// }

// export interface GenerateStoryRequest {
//   prompt?: string
//   imageUrl?: string
//   style?: string
//   length?: 'short' | 'medium' | 'long'
// }

// export interface GenerateImageRequest {
//   prompt: string
//   style?: string
//   size?: '1024x1024' | '1792x1024' | '1024x1792'
//   sourceImageUrl?: string
// }
// export interface Metadata {
//   author?: string
//   genre?: string
//   length?: number
//   [key: string]: any // optional catch-all
// }
// export interface Chapter {
//   chapterNumber: any
//   content: any
//   title: string
//   text: string
//   imagePrompt: string
//   imageUrl?: string
// }

// export interface GenerateStoryResponse {
//   title: string
//   description: string
//   story: Story
//   metadata: Metadata
//   chapters: {
//     title: string
//     text: string
//     imagePrompt: string
//     imageUrl?: string
//   }[]
// }
// export interface StoryWithMetadata {
//   story: GenerateStoryResponse
//   metadata: {
//     mainCharacter: string
//     ageGroup: string
//     supportingCharacters: string[]
//     genre: string
//     tone: string
//     setting: string
//     userId: string
//     isDemo: boolean
//   }
// }
// export interface StoryFormData {
//   title: string
//   mainCharacter: string
//   ageGroup: string
//   supportingCharacters: string[] // ✅ required
//   genre: string
//   tone: string
//   setting: string
//   customPrompt: string
// }
// export interface GenerateImageResponse {
//   imageUrl: string
//   originalPrompt: string
//   enhancedPrompt: string
//   sourceImageUrl?: string
//   sourceType?: 'upload' | 'instagram' | 'text'
//   style?: string
//   size?: '1024x1024' | '1792x1024' | '1024x1792'
//   createdAt?: Date
//   likes?: number
//   views?: number
//   isPublic?: boolean
//   completion_rate?: number
//   error?: string
//   success?: boolean
//   data?: GenerateImageResponse
//   prompt?: string
// }

// export interface ApiResponse<T = any> {
//   success: boolean
//   data?: T
//   error?: string
// }
// export interface TranscribeAudioResponse {
//   text: string
//   confidence?: number
//   language?: string
// }
// export interface User {
//   id: string
//   email: string
//   firstName: string
//   lastName: string
//   imageUrl?: string
//   createdAt: Date
//   isAdmin: boolean
// }
// export interface ApiResponse<T = any> {
//   success: boolean
//   data?: T
//   error?: string
// }
// export interface InstagramMedia {
//   id: string
//   media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
// }
// export interface ApiResponse<T = any> {
//   success: boolean
//   data?: T
//   error?: string
// }
// export interface AdminStats {
//   totalUsers: number
//   totalStories: number
//   totalImages: number
//   todayUsers: number
//   todayStories: number
//   todayImages: number
// }
// export interface TranscribeAudioResponse {
//   text: string
//   confidence?: number
//   language?: string
// }
// export interface GenerateStoryRequest {
//   prompt?: string
//   imageUrl?: string
//   style?: string
//   length?: 'short' | 'medium' | 'long'
// }



// ==================== User ====================
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  imageUrl?: string
  createdAt: Date
  isAdmin: boolean
}

// ==================== API Response ====================
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// ==================== Story ====================
export interface Story {
  id: string
  userId: string
  title: string
  chapters: Chapter[]
  content: string
  prompt: string
  imageUrl?: string
  sourceImageUrl?: string
  sourceType: 'upload' | 'instagram' | 'generated'
  tags: string[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  likes: number
  views: number
  collaborators?: { userId: string; role?: string }[]
  metadata?: Metadata
}

// ==================== Chapter ====================
export interface Chapter {
  chapterNumber: number
  content: string
  title: string
  text: string
  imagePrompt: string
  imageUrl?: string
}

// ==================== Metadata ====================
export interface Metadata {
  author?: string
  genre?: string
  length?: number
  [key: string]: any
}

// ==================== Image Generation ====================
export interface GeneratedImage {
  id: string
  userId: string
  prompt: string
  imageUrl: string
  sourceImageUrl?: string
  sourceType: 'upload' | 'instagram' | 'text'
  style: string
  isPublic: boolean
  createdAt: Date
  likes: number
  views: number
}

export interface GenerateImageRequest {
  prompt: string
  style?: string
  size?: '1024x1024' | '1792x1024' | '1024x1792'
  sourceImageUrl?: string
}

export interface GenerateImageResponse {
  imageUrl: string
  originalPrompt: string
  enhancedPrompt: string
  sourceImageUrl?: string
  sourceType?: 'upload' | 'instagram' | 'text'
  style?: string
  size?: '1024x1024' | '1792x1024' | '1024x1792'
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

// ==================== Story Generation ====================
export interface GenerateStoryRequest {
  prompt?: string
  imageUrl?: string
  style?: string
  length?: 'short' | 'medium' | 'long'
}

export interface GenerateStoryResponse {
  title: string
  description: string
  story: Story
  metadata: Metadata
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
  supportingCharacters: string[]
  genre: string
  tone: string
  setting: string
  customPrompt: string
}

// ==================== Instagram ====================
export interface InstagramMedia {
  id: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
  caption?: string
  timestamp: string
}

// ==================== Audio Transcription ====================
export interface TranscribeAudioResponse {
  text: string
  confidence?: number
  language?: string
}

// ==================== Admin ====================
export interface AdminStats {
  totalUsers: number
  totalStories: number
  totalImages: number
  todayUsers: number
  todayStories: number
  todayImages: number
}
export interface AdminResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface SessionUser {
  id: string
  email: string
  name: string
  image?: string
  role?: 'user' | 'admin'
}
export interface FileUploadResponse {
  fileUrl: string
  fileType: string
  size: number
}
export interface Collaborator {
  userId: string
  role: 'editor' | 'viewer'
}
export interface StoryCreationState {
  loading: boolean
  error?: string
  story?: Story
}

export interface FirestoreDocument<T> {
  id: string
  data: T
}
export interface ApiError {
  message: string
  statusCode: number
}

      
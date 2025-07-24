interface AIGenerationRequest {
  prompt: string
  template?: string
  category?: string
  length?: "short" | "medium" | "long"
}

interface AIGenerationResponse {
  title: string
  content: string
  category: string
  tags: string[]
}

export class AIStoryService {
  private static async generateStory(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      const response = await fetch("/api/ai/generate-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error("Failed to generate story")
      }

      return await response.json()
    } catch (error) {
      throw new Error("AI service unavailable")
    }
  }

  static async createStory(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    return this.generateStory(request)
  }

  static async enhanceStory(content: string, enhancement: string): Promise<string> {
    try {
      const response = await fetch("/api/ai/enhance-story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, enhancement }),
      })

      if (!response.ok) {
        throw new Error("Failed to enhance story")
      }

      const result = await response.json()
      return result.enhancedContent
    } catch (error) {
      throw new Error("Story enhancement failed")
    }
  }
}

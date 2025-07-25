// lib/openai.ts
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStory(
  prompt: string,
  imageUrl?: string,
  length: "short" | "medium" | "long" = "medium"
): Promise<string> {
  const lengthGuide = {
    short: "200-400 words",
    medium: "500-800 words",
    long: "1000-1500 words",
  };

  const systemPrompt = `You are a creative storyteller. Generate engaging, well-structured stories based on the user's prompt${imageUrl ? " and the provided image" : ""}.

Target length: ${lengthGuide[length]}

The story should be:
- Engaging and well-paced
- Have a clear beginning, middle, and end
- Include vivid descriptions and dialogue
- Be appropriate for all audiences
- Have a satisfying conclusion

Return only the story text, no additional formatting or metadata.`;

  const userPrompt = imageUrl
    ? `Create a story based on this prompt: "${prompt}" and incorporate elements from the image at: ${imageUrl}`
    : `Create a story based on this prompt: "${prompt}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: length === "long" ? 2000 : length === "medium" ? 1200 : 600,
  });

  const message = response.choices?.[0]?.message?.content;
  if (!message) {
    throw new Error("Failed to generate story");
  }
  return message;
}

export async function generateImage(
  prompt: string,
  style?: string,
  size: "1024x1024" | "1792x1024" | "1024x1792" = "1024x1024"
): Promise<string> {
  const enhancedPrompt = style
    ? `${prompt}, ${style} style, high quality, detailed, professional`
    : `${prompt}, high quality, detailed, professional`;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: enhancedPrompt,
    size,
    quality: "standard",
    n: 1,
  });

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error("Failed to generate image");
  }

  return imageUrl;
}

export async function analyzeImage(imageUrl: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this image and provide a detailed description that could be used as a story prompt. Focus on the setting, characters, mood, and any interesting elements that could inspire a creative story.`,
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  const description = response.choices?.[0]?.message?.content;
  if (!description) {
    throw new Error("Failed to analyze image");
  }

  return description;
}
export async function getStoryMetadata(storyId: string): Promise<any> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are an expert in analyzing story structures and metadata.",
      },
      {
        role: "user",
        content: `Extract metadata for the story with ID ${storyId}. Include title, main character, genre, tone, setting, and any other relevant details.`,
      },
    ],
    max_tokens: 500,
  });

  const metadata = response.choices?.[0]?.message?.content;
  if (!metadata) {
    throw new Error("Failed to retrieve story metadata");
  }

  return JSON.parse(metadata);
}
// components/generate/generated-content.tsx
"use client"

import React from "react"
import Image from "next/image"

interface StoryChapter {
  title: string
  text: string
  imageUrl?: string
}

interface GeneratedContentProps {
  type: "story" | "image" | string
  content: {
    title?: string
    description?: string
    chapters?: StoryChapter[]
    imageUrl?: string
  }
}

export function GeneratedContent({ type, content }: GeneratedContentProps) {
  if (type === "story" && content.chapters) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">{content.title}</h2>
        <p className="italic mb-4">{content.description}</p>
        <div className="space-y-8">
          {content.chapters.map((ch, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-2">{ch.title}</h3>
              <p className="mb-4">{ch.text}</p>
              {ch.imageUrl && (
                <Image src={ch.imageUrl} alt={ch.title} width={500} height={300} className="rounded" />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "image" && content.imageUrl) {
    return (
      <div className="text-center">
        <Image src={content.imageUrl} alt="Generated" width={600} height={400} className="mx-auto rounded-lg" />
      </div>
    )
  }

  return <p>No content available.</p>
}

// components/generate/instagram-import.tsx
"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
// import { ImageIcon } from "lucide-react"


interface InstaMedia {
  id: string
  media_url: string
  permalink: string
}

export function InstagramImport({ onImport }: { onImport: (data: InstaMedia[]) => void }) {
  const [media, setMedia] = useState<InstaMedia[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMedia() {
      setLoading(true)
      try {
        const resp = await fetch("/api/instagram/media") // your backend endpoint
        if (!resp.ok) throw new Error("Failed to fetch")
        const json = await resp.json()
        setMedia(json.data)
      } catch (err: any) {
        setError(err.message || "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    fetchMedia()
  }, [])

  if (loading) return <p>Loading Instagram media...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (media.length === 0) return <p>No media found.</p>

  return (
    <div className="grid grid-cols-3 gap-4">
      {media.map(item => (
        <Button
          key={item.id}
          variant="ghost"
          onClick={() => onImport(media)}
          className="p-0"
        >
          <img src={item.media_url} alt="Instagram media" className="rounded-lg object-cover w-full h-32" />
        </Button>
      ))}
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Eye, Share2, Play, Pause, Users } from "lucide-react"
import type { Story } from "@/types/story"
import { AudioService } from "@/lib/audio-service"

interface StoryCardProps {
  story: Story
  onLike?: (storyId: string) => void
  onShare?: (story: Story) => void
  showActions?: boolean
}

export function StoryCard({ story, onLike, onShare, showActions = true }: StoryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handlePlayAudio = async () => {
    try {
      if (isPlaying) {
        AudioService.stop()
        setIsPlaying(false)
      } else {
        await AudioService.generateAudio(story.content)
        setIsPlaying(true)
      }
    } catch (error) {
      setIsPlaying(false)
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (onLike) {
      onLike(story.id)
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare(story)
    }
  }

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        {story.cover_image && (
          <div className="w-full h-48 bg-gray-200 rounded-md mb-3 overflow-hidden">
            <img
              src={story.cover_image || "/placeholder.svg"}
              alt={story.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2">{story.title}</h3>
          {story.collaborators.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              <Users className="h-3 w-3 mr-1" />
              {story.collaborators.length}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline">{story.category}</Badge>
          {story.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{story.content.substring(0, 150)}...</p>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span>by {story.author_name}</span>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {story.views}
            </span>
            <span className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {story.likes}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Link href={`/stories/${story.id}`} className="flex-1">
            <Button variant="default" className="w-full">
              Read Story
            </Button>
          </Link>
          {showActions && (
            <>
              <Button variant="outline" size="icon" onClick={handlePlayAudio}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={handleLike} className={isLiked ? "text-red-500" : ""}>
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

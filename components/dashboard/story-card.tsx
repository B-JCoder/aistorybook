"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Share2, MoreHorizontal } from "lucide-react"
import { formatTimeAgo, truncateText } from "@/lib/utils"
import type { Story } from "@/types"
import Image from "next/image"

interface StoryCardProps {
  story: Story
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="glass-effect border-0 overflow-hidden group">
        {story.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={story.imageUrl || "/placeholder.svg"}
              alt={story.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 right-4">
              <Badge variant={story.isPublic ? "default" : "secondary"}>{story.isPublic ? "Public" : "Private"}</Badge>
            </div>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2">{story.title}</h3>
            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{formatTimeAgo(story.createdAt)}</p>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{truncateText(story.content, 150)}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {story.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{story.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{story.likes}</span>
              </div>
            </div>

            <Button variant="ghost" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

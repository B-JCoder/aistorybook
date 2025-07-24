"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ImageIcon } from "lucide-react"
import { formatTimeAgo } from "@/lib/utils"
import { Clock } from "lucide-react" // Import Clock component
import type { Story, GeneratedImage } from "@/types"

interface RecentActivityProps {
  stories: Story[]
  images: GeneratedImage[]
}

export function RecentActivity({ stories, images }: RecentActivityProps) {
  // Combine and sort activities by date
  const activities = [
    ...stories.map((story) => ({
      id: story.id,
      type: "story" as const,
      title: story.title,
      createdAt: story.createdAt,
      imageUrl: story.imageUrl,
    })),
    ...images.map((image) => ({
      id: image.id,
      type: "image" as const,
      title: image.prompt,
      createdAt: image.createdAt,
      imageUrl: image.imageUrl,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={activity.imageUrl || "/placeholder.svg"} />
            <AvatarFallback>
              {activity.type === "story" ? <BookOpen className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <Badge variant={activity.type === "story" ? "default" : "secondary"} className="text-xs">
                {activity.type === "story" ? "Story" : "Image"}
              </Badge>
              <span className="text-sm text-gray-600 dark:text-gray-400">{formatTimeAgo(activity.createdAt)}</span>
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

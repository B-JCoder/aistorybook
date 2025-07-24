"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Download, MoreHorizontal } from "lucide-react"
import { formatTimeAgo } from "@/lib/utils"
import type { GeneratedImage } from "@/types"
import Image from "next/image"

interface ImageCardProps {
  image: GeneratedImage
}

export function ImageCard({ image }: ImageCardProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(image.imageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `ai-image-${image.id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading image:", error)
    }
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card className="glass-effect border-0 overflow-hidden group">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image.imageUrl || "/placeholder.svg"}
            alt={image.prompt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-sm">
              <MoreHorizontal className="w-4 h-4 text-white" />
            </Button>
          </div>
          <div className="absolute top-2 left-2">
            <Badge variant={image.isPublic ? "default" : "secondary"}>{image.isPublic ? "Public" : "Private"}</Badge>
          </div>
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-white text-sm">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{image.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{image.likes}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">{image.prompt}</p>
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>{formatTimeAgo(image.createdAt)}</span>
            <Badge variant="outline" className="text-xs">
              {image.style}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

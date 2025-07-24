"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Share2, Copy, Facebook, Twitter, Linkedin, Mail, LinkIcon } from "lucide-react"
import { toast } from "sonner"

interface SocialShareProps {
  title: string
  url?: string
  description?: string
  hashtags?: string[]
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export default function SocialShare({
  title,
  url = typeof window !== "undefined" ? window.location.href : "",
  description = "Check out this amazing AI-generated story!",
  hashtags = ["AIStorybook", "ChildrensStories"],
  size = "default",
  variant = "outline",
  className = "",
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState(url)

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)
  const encodedHashtags = hashtags.join(",")

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success("Link copied to clipboard!")
  }

  const handleShare = async (platform: string) => {
    if (platform === "native" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        })
        toast.success("Shared successfully!")
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else if (platform !== "copy") {
      window.open(shareLinks[platform as keyof typeof shareLinks], "_blank")
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {size === "icon" ? <Share2 className="h-4 w-4" /> : <Share2 className="h-4 w-4 mr-2" />}
          {size !== "icon" && "Share"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Story</DialogTitle>
          <DialogDescription>Share this amazing AI-generated story with others</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => handleShare("facebook")}
              size="icon"
              variant="outline"
              className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white border-none"
            >
              <Facebook className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => handleShare("twitter")}
              size="icon"
              variant="outline"
              className="rounded-full w-12 h-12 bg-sky-500 hover:bg-sky-600 text-white border-none"
            >
              <Twitter className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => handleShare("linkedin")}
              size="icon"
              variant="outline"
              className="rounded-full w-12 h-12 bg-blue-700 hover:bg-blue-800 text-white border-none"
            >
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => handleShare("email")}
              size="icon"
              variant="outline"
              className="rounded-full w-12 h-12 bg-gray-500 hover:bg-gray-600 text-white border-none"
            >
              <Mail className="h-5 w-5" />
            </Button>
            {"share" in navigator && typeof navigator.share === "function" && (
  <Button
    onClick={() => handleShare("native")}
    size="icon"
    variant="outline"
    className="rounded-full w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white border-none"
  >
    <Share2 className="h-5 w-5" />
  </Button>
)}

          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="link" className="text-sm font-medium">
              Story Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center border rounded-md pl-3 bg-gray-50 dark:bg-gray-900">
                <LinkIcon className="h-4 w-4 text-gray-400 mr-2" />
                <Input
                  id="link"
                  value={shareUrl}
                  onChange={(e) => setShareUrl(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <Button onClick={handleCopyLink} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

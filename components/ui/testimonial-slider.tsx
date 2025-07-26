"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Content Creator",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "This AI tool has revolutionized my content creation process. The stories it generates are incredibly engaging and the images are stunning!",
    rating: 5,
  },
  {
    id: 2,
    name: "Mike Chen",
    role: "Digital Marketer",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "I've been using this platform for months now. The Instagram import feature is a game-changer for my social media campaigns.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Blogger",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "The quality of AI-generated content is amazing. It saves me hours of work and the results are always professional.",
    rating: 5,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Creative Director",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Perfect for brainstorming and creating initial concepts. The AI understands context incredibly well.",
    rating: 5,
  },
]

export function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative max-w-4xl mx-auto">
    <AnimatePresence mode="wait">
  {testimonials[currentIndex] && (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-effect border-0">
        <CardContent className="p-8">
          <div className="flex items-center mb-4">
            {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <blockquote className="text-lg text-gray-700 dark:text-gray-300 mb-6 italic">
            "{testimonials[currentIndex].content}"
          </blockquote>
          <div className="flex items-center">
            <Avatar className="w-12 h-12 mr-4">
              <AvatarImage src={testimonials[currentIndex].avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {testimonials[currentIndex].name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {testimonials[currentIndex].name}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {testimonials[currentIndex].role}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )}
</AnimatePresence>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-6 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-purple-600 scale-125" : "bg-gray-300 dark:bg-gray-600 hover:bg-purple-400"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

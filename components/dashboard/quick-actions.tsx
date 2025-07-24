"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ImageIcon, Upload, Instagram } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Generate Story",
    description: "Create a story from text prompt",
    icon: <Sparkles className="w-6 h-6" />,
    href: "/generate?type=story",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Generate Image",
    description: "Create images from descriptions",
    icon: <ImageIcon className="w-6 h-6" />,
    href: "/generate?type=image",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Upload & Transform",
    description: "Upload image and create story",
    icon: <Upload className="w-6 h-6" />,
    href: "/generate?type=upload",
    gradient: "from-green-500 to-teal-500",
  },
  {
    title: "Instagram Import",
    description: "Import from Instagram",
    icon: <Instagram className="w-6 h-6" />,
    href: "/generate?type=instagram",
    gradient: "from-pink-500 to-red-500",
  },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -2 }}
        >
          <Link href={action.href}>
            <Card className="glass-effect border-0 cursor-pointer group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

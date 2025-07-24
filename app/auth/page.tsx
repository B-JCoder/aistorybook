"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function AuthPage() {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isConfigured = clerkKey && clerkKey !== "your_clerk_publishable_key_here"

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" initial="initial" animate="animate" variants={fadeInUp}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Storybook
            </h1>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="flex justify-center">
          <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0 w-full max-w-md">
            <CardContent className="p-8 text-center">
              {!isConfigured ? (
                <>
                  <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Not Configured</h2>
                  <p className="text-gray-600 mb-8">
                    To enable user authentication and story saving, please configure your Clerk API keys in the
                    environment variables.
                  </p>
                  <div className="space-y-4">
                    <Link href="/create-story">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                        Try Demo Mode
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="w-full bg-transparent">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Ready</h2>
                  <p className="text-gray-600 mb-8">
                    Authentication is configured! The sign-in components will appear here when you set up your Clerk
                    components properly.
                  </p>
                  <Link href="/create-story">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Continue to Story Creation
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

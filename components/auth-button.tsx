"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import Link from "next/link"

export function AuthButton() {
  const [user] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [UserButton, setUserButton] = useState<any>(null)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        const hasValidKey = clerkPublishableKey && clerkPublishableKey !== "your_clerk_publishable_key_here"

        if (hasValidKey) {
          // Dynamically import Clerk components
          const { UserButton: ClerkUserButton } = await import("@clerk/nextjs")

          // We can't use hooks here, so we'll handle this differently
          setUserButton(() => ClerkUserButton)
        }

        setIsLoaded(true)
      } catch (error) {
        console.log("Clerk not available")
        setIsLoaded(true)
      }
    }

    initializeAuth()
  }, [])

  if (!isLoaded) {
    return (
      <Button variant="outline" disabled>
        <User className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    )
  }

  if (UserButton && user) {
    const Component = UserButton
    return (
      <Component
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
          },
        }}
      />
    )
  }

  return (
    <Link href="/auth">
      <Button variant="outline">
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    </Link>
  )
}

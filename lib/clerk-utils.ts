"use client"

import { useState, useEffect } from "react"

// Safe wrapper for Clerk hooks that handles when Clerk is not available
export function useSafeUser() {
  const [user, setUser] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasClerk, setHasClerk] = useState(false)

  useEffect(() => {
    // Check if we're in a ClerkProvider context
    const checkClerkAvailability = async () => {
      try {
        const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        const isValidKey = clerkPublishableKey && clerkPublishableKey !== "your_clerk_publishable_key_here"

        if (isValidKey) {
          // Dynamically import Clerk hooks only when available
          const { useUser } = await import("@clerk/nextjs")
          setHasClerk(true)
        } else {
          setIsLoaded(true)
        }
      } catch (error) {
        console.log("Clerk not available:", error)
        setIsLoaded(true)
      }
    }

    checkClerkAvailability()
  }, [])

  return { user, isLoaded, hasClerk }
}

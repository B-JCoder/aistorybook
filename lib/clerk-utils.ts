// "use client"

// import { useState, useEffect } from "react"

// export function useSafeUser() {
//   const [user, setUser] = useState(null)
//   const [isLoaded, setIsLoaded] = useState(false)
//   const [hasClerk, setHasClerk] = useState(false)

//   useEffect(() => {
//     const checkClerkAvailability = async () => {
//       try {
//         const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
//         const isValidKey = clerkPublishableKey && clerkPublishableKey !== "your_clerk_publishable_key_here"

//         if (isValidKey) {
//           const { useUser } = await import("@clerk/nextjs")
//           const { user, isLoaded } = useUser() // ✅ use it here
//           setUser(user)
//           setIsLoaded(isLoaded)
//           setHasClerk(true)
//         } else {
//           setIsLoaded(true)
//         }
//       } catch (error) {
//         console.log("Clerk not available:", error)
//         setIsLoaded(true)
//       }
//     }

//     checkClerkAvailability()
//   }, [])

//   return { user, isLoaded, hasClerk }
// }
"use client"

import { useUser } from "@clerk/nextjs" // Will throw if Clerk isn't set up correctly
import { useEffect, useState } from "react"

export function useSafeUser() {
  const clerkEnabled =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "your_clerk_publishable_key_here"

  const clerkUser = clerkEnabled ? useUser() : { user: null, isLoaded: true }
  const [hasClerk, setHasClerk] = useState(clerkEnabled)

  useEffect(() => {
    if (!clerkEnabled) {
      setHasClerk(false)
    }
  }, [clerkEnabled])

  return {
    user: clerkUser.user,
    isLoaded: clerkUser.isLoaded,
    hasClerk,
  }
}
export function useClerk() {
  const { user, isLoaded, hasClerk } = useSafeUser()

  return {
    user,
    isLoaded,
    hasClerk,
  }
}
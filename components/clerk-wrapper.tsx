"use client"

import { ClerkProvider } from "@clerk/nextjs"
import type React from "react"

interface ClerkWrapperProps {
  children: React.ReactNode
}

export function ClerkWrapper({ children }: ClerkWrapperProps) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const hasValidClerkKey = clerkPublishableKey && clerkPublishableKey !== "your_clerk_publishable_key_here"

  if (hasValidClerkKey) {
    return <ClerkProvider publishableKey={clerkPublishableKey}>{children}</ClerkProvider>
  }

  // Return children without ClerkProvider when not configured
  return <>{children}</>
}

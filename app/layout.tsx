import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Story & Image Generator",
  description: "Generate amazing stories and images with AI",
  keywords: "AI, stories, images, generator, creative, artificial intelligence",
  authors: [{ name: "AI Story Generator Team" }],
  openGraph: {
    title: "AI Story & Image Generator",
    description: "Create stunning stories and images with the power of AI",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body className={inter.className}>
          {children}
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  )
}

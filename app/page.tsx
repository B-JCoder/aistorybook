"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, ImageIcon, BookOpen, Zap, Users, Star } from "lucide-react"
import Link from "next/link"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import { FloatingElements } from "@/components/ui/floating-elements"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { FeatureCard } from "@/components/ui/feature-card"
import { TestimonialSlider } from "@/components/ui/testimonial-slider"
// import HeroSection from "@/components/Hero"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      <FloatingElements />

      {/* Navigation */}
      <nav className="glass-effect fixed top-0 w-full z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {/* <span className="text-xl font-bold gradient-text">AI Creator</span> */}
            </motion.div>

            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton>
                  <Button variant="ghost" className="text-gray-700 dark:text-gray-300">
                    Sign In
                  </Button>
                </SignInButton>
                <SignInButton>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Get Started
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                    Dashboard
                  </Button>
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

{/* <main>
      <HeroSection />
    </main> */}
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center" initial="initial" animate="animate" variants={staggerContainer}>
            <motion.h1 className="text-5xl md:text-7xl font-bold mb-6" variants={fadeInUp}>
              <span className="gradient-text">Create Magic</span>
              <br />
              <span className="text-gray-800 dark:text-white">with AI</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              Transform your ideas into stunning stories and images. Upload photos, import from Instagram, or start from
              scratch.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-16" variants={fadeInUp}>
              <SignedOut>
                <SignInButton>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Creating Free
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/generate">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Creating
                  </Button>
                </Link>
              </SignedIn>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg glass-effect bg-transparent">
                <BookOpen className="w-5 h-5 mr-2" />
                View Examples
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20" variants={fadeInUp}>
              <div className="text-center">
                <AnimatedCounter end={10000} className="text-3xl font-bold text-purple-600" />
                <p className="text-gray-600 dark:text-gray-400">Stories Created</p>
              </div>
              <div className="text-center">
                <AnimatedCounter end={25000} className="text-3xl font-bold text-blue-600" />
                <p className="text-gray-600 dark:text-gray-400">Images Generated</p>
              </div>
              <div className="text-center">
                <AnimatedCounter end={5000} className="text-3xl font-bold text-indigo-600" />
                <p className="text-gray-600 dark:text-gray-400">Happy Users</p>
              </div>
              <div className="text-center">
                <AnimatedCounter end={98} suffix="%" className="text-3xl font-bold text-green-600" />
                <p className="text-gray-600 dark:text-gray-400">Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Powerful Features</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to create amazing content with AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="AI Story Generation"
              description="Create compelling stories from text prompts or images using advanced AI"
              gradient="from-purple-500 to-pink-500"
            />
            <FeatureCard
              icon={<ImageIcon className="w-8 h-8" />}
              title="Image Generation"
              description="Generate stunning images from text descriptions or enhance existing photos"
              gradient="from-blue-500 to-cyan-500"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Instagram Import"
              description="Import your Instagram photos and transform them into creative stories"
              gradient="from-indigo-500 to-purple-500"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Lightning Fast"
              description="Generate content in seconds with our optimized AI pipeline"
              gradient="from-yellow-500 to-orange-500"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Community"
              description="Share your creations and discover amazing content from others"
              gradient="from-green-500 to-teal-500"
            />
            <FeatureCard
              icon={<Star className="w-8 h-8" />}
              title="Premium Quality"
              description="High-resolution outputs with professional-grade AI models"
              gradient="from-red-500 to-pink-500"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">What Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of creators who love our platform
            </p>
          </motion.div>

          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="glass-effect border-0 shadow-2xl">
              <CardContent className="p-12 text-center">
                <h2 className="text-4xl font-bold mb-4 gradient-text">Ready to Create?</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Join thousands of creators and start making amazing content today
                </p>
                <SignedOut>
                  <SignInButton>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                    >
                      Get Started Free
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                </SignedIn>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

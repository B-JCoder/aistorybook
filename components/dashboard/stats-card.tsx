"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: number
  icon: ReactNode
  gradient: string
  change?: string
}

export function StatsCard({ title, value, icon, gradient, change }: StatsCardProps) {
  const isPositive = change?.startsWith("+")

  return (
    <motion.div whileHover={{ y: -2, scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="glass-effect border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
              {change && (
                <div className={`flex items-center mt-2 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {change}
                </div>
              )}
            </div>
            <div
              className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center text-white`}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

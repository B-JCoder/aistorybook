import { auth } from "@clerk/nextjs/server"

export async function isAdmin(): Promise<boolean> {
  const { userId } =await auth()
  if (!userId) return false

  const adminIds = process.env.ADMIN_USER_IDS?.split(",") || []
  return adminIds.includes(userId)
}

export function requireAdmin() {
  if (!isAdmin()) {
    throw new Error("Admin access required")
  }
}

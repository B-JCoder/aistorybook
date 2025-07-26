// File: components/CollaborativeEditor.tsx

"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Users, Clock, AlertCircle, Eye } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs"

interface CollaborativeEditorProps {
  storyId: string
  chapterNumber: number
  initialContent: string
  onContentChange: (content: string) => void
  userRole: "owner" | "editor" | "viewer"
  activeCollaborators: Array<{
    id: string
    name: string
    avatar?: string
    lastSeen: string
  }>
}

interface EditSession {
  userId: string
  userName: string
  startTime: string
  isActive: boolean
}

export default function CollaborativeEditor({
  storyId,
  chapterNumber,
  initialContent,
  onContentChange,
  userRole,
  activeCollaborators,
}: CollaborativeEditorProps) {
  const { user } = useUser()
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [editSessions, setEditSessions] = useState<EditSession[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  const wsRef = useRef<WebSocket>()

  const canEdit = userRole === "owner" || userRole === "editor"

  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeWebSocket()
    }
    return () => {
      if (wsRef.current) wsRef.current.close()
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [storyId, chapterNumber])

  const initializeWebSocket = () => {
    const interval = setInterval(() => {
      checkForUpdates()
    }, 5000)
    return () => clearInterval(interval)
  }

  const checkForUpdates = async () => {
    try {
      const response = await fetch(`/api/collaboration/check-updates?storyId=${storyId}&chapter=${chapterNumber}`)
      if (response.ok) {
        const { content: latestContent, editSessions: sessions } = await response.json()
        if (latestContent !== content && !isEditing) {
          setContent(latestContent)
          onContentChange(latestContent)
        }
        setEditSessions(sessions)
      }
    } catch (error) {
      console.error("Error checking for updates:", error)
    }
  }

  const handleContentChange = (newContent: string) => {
    if (!canEdit) return
    setContent(newContent)
    setHasUnsavedChanges(true)
    setIsEditing(true)
    onContentChange(newContent)
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      saveContent(newContent)
      setIsEditing(false)
    }, 2000)
  }

  const saveContent = async (contentToSave?: string) => {
    const finalContent = contentToSave || content
    setIsSaving(true)
    try {
      const response = await fetch("/api/collaboration/save-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyId,
          chapterNumber,
          content: finalContent,
          userId: user?.id ?? "",
          userName: user?.fullName || user?.firstName || "Anonymous",
        }),
      })
      if (!response.ok) throw new Error("Failed to save content")
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
      toast.success("Changes saved automatically")
    } catch (error) {
      console.error("Error saving content:", error)
      toast.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const manualSave = () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveContent()
    setIsEditing(false)
  }

  const formatLastSaved = () => {
    if (!lastSaved) return "Never"
    const now = new Date()
    const diff = now.getTime() - lastSaved.getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return "Just now"
    if (minutes === 1) return "1 minute ago"
    return `${minutes} minutes ago`
  }

const getActiveEditorsText = () => {
  const currentUserId = user?.id
  if (!editSessions || !currentUserId) return null

  const activeEditors = editSessions.filter(
    (session) => session?.isActive && session?.userId !== currentUserId
  )

  if (activeEditors.length === 0) return null

  // ✅ Fix: use optional chaining or fallback in case userName is undefined
  const name = activeEditors[0]?.userName || "Someone"
  if (activeEditors.length === 1) return `${name} is editing`

  return `${activeEditors.length} people are editing`
}


  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Chapter {chapterNumber}</CardTitle>
          <div className="flex items-center space-x-2">
            {activeCollaborators.length > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-500" />
                <div className="flex -space-x-1">
                  {activeCollaborators.slice(0, 3).map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white text-xs font-medium text-purple-600"
                      title={collaborator.name}
                    >
                      {collaborator.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {activeCollaborators.length > 3 && (
                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white text-xs font-medium text-gray-600">
                      +{activeCollaborators.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {isSaving ? (
                <div className="flex items-center space-x-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-600" />
                  <span>Saving...</span>
                </div>
              ) : hasUnsavedChanges ? (
                <div className="flex items-center space-x-1 text-orange-600">
                  <AlertCircle className="w-3 h-3" />
                  <span>Unsaved changes</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-green-600">
                  <Clock className="w-3 h-3" />
                  <span>Saved {formatLastSaved()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {getActiveEditorsText() && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
              <Users className="w-3 h-3 mr-1" />
              {getActiveEditorsText()}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder={canEdit ? "Write your chapter content here..." : "You have view-only access to this story"}
          rows={12}
          disabled={!canEdit}
          className={`resize-none ${!canEdit ? "bg-gray-50 cursor-not-allowed" : ""}`}
        />

        {canEdit && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {content.length} characters • {Math.ceil(content.length / 5)} words
            </div>
            <Button
              onClick={manualSave}
              disabled={isSaving || !hasUnsavedChanges}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Now
            </Button>
          </div>
        )}

        {!canEdit && (
          <div className="text-center py-4">
            <Badge variant="outline" className="text-gray-600">
              <Eye className="w-4 h-4 mr-2" />
              View-only access
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
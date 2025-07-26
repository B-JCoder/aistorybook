"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Trash2, Mail, Crown, Edit, Eye } from "lucide-react"
import { toast } from "sonner"
// import { useUser } from "@clerk/nextjs"

interface Collaborator {
  id: string
  email: string
  name: string
  role: "owner" | "editor" | "viewer"
  joinedAt: string
  avatar?: string
}

interface CollaborationManagerProps {
  storyId: string
  collaborators: Collaborator[]
  onCollaboratorsUpdate: (collaborators: Collaborator[]) => void
  isOwner: boolean
}

export default function CollaborationManager({
  storyId,
  collaborators,
  onCollaboratorsUpdate,
  isOwner,
}: CollaborationManagerProps) {
  // const { user } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor")
  const [isInviting, setIsInviting] = useState(false)

  const sendInvitation = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address")
      return
    }

    // Check if user is already a collaborator
    if (collaborators.some((c) => c.email === inviteEmail)) {
      toast.error("User is already a collaborator")
      return
    }

    setIsInviting(true)

    try {
      const response = await fetch("/api/collaboration/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId,
          email: inviteEmail,
          role: inviteRole,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send invitation")
      }

      const { collaborator } = await response.json()
      onCollaboratorsUpdate([...collaborators, collaborator])
      setInviteEmail("")
      toast.success("Invitation sent successfully!")
    } catch (error) {
      console.error("Error sending invitation:", error)
      toast.error("Failed to send invitation")
    } finally {
      setIsInviting(false)
    }
  }

  const updateCollaboratorRole = async (collaboratorId: string, newRole: "editor" | "viewer") => {
    try {
      const response = await fetch("/api/collaboration/update-role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId,
          collaboratorId,
          role: newRole,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update role")
      }

      const updatedCollaborators = collaborators.map((c) => (c.id === collaboratorId ? { ...c, role: newRole } : c))
      onCollaboratorsUpdate(updatedCollaborators)
      toast.success("Role updated successfully!")
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("Failed to update role")
    }
  }

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      const response = await fetch("/api/collaboration/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyId,
          collaboratorId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove collaborator")
      }

      const updatedCollaborators = collaborators.filter((c) => c.id !== collaboratorId)
      onCollaboratorsUpdate(updatedCollaborators)
      toast.success("Collaborator removed successfully!")
    } catch (error) {
      console.error("Error removing collaborator:", error)
      toast.error("Failed to remove collaborator")
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-600" />
      case "editor":
        return <Edit className="w-4 h-4 text-blue-600" />
      case "viewer":
        return <Eye className="w-4 h-4 text-gray-600" />
      default:
        return null
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="w-4 h-4 mr-2" />
          Collaborators ({collaborators.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Story Collaborators</DialogTitle>
          <DialogDescription>Manage who can view and edit this story</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Collaborators */}
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-purple-600">
                      {collaborator.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                    <p className="text-xs text-gray-500">{collaborator.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getRoleBadgeColor(collaborator.role)}>
                    <span className="flex items-center space-x-1">
                      {getRoleIcon(collaborator.role)}
                      <span className="capitalize">{collaborator.role}</span>
                    </span>
                  </Badge>
                  {isOwner && collaborator.role !== "owner" && (
                    <div className="flex space-x-1">
                      <Select
                        value={collaborator.role}
                        onValueChange={(value: "editor" | "viewer") => updateCollaboratorRole(collaborator.id, value)}
                      >
                        <SelectTrigger className="w-20 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => removeCollaborator(collaborator.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Invite New Collaborator */}
          {isOwner && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Invite Collaborator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendInvitation()}
                    />
                  </div>
                  <Select value={inviteRole} onValueChange={(value: "editor" | "viewer") => setInviteRole(value)}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={sendInvitation} disabled={isInviting} className="w-full" size="sm">
                  {isInviting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Role Descriptions */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Owner:</strong> Full control over the story and collaborators
            </p>
            <p>
              <strong>Editor:</strong> Can view and edit the story content
            </p>
            <p>
              <strong>Viewer:</strong> Can only view the story
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

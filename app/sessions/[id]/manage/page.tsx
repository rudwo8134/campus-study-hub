"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JoinRequestCard } from "@/components/join-request-card"
import { ArrowLeft, Users } from "lucide-react"
import type { StudySession, SessionParticipant } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function ManageSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [session, setSession] = useState<StudySession | null>(null)
  const [participants, setParticipants] = useState<SessionParticipant[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadSessionData()
  }, [resolvedParams.id])

  const loadSessionData = async () => {
    setIsLoading(true)
    try {
      // Load session details
      const sessionResponse = await fetch(`/api/sessions/${resolvedParams.id}`)
      if (!sessionResponse.ok) throw new Error("Failed to load session")
      const sessionData = await sessionResponse.json()
      setSession(sessionData)

      // Load participants
      const participantsResponse = await fetch(`/api/sessions/${resolvedParams.id}/participants`)
      if (!participantsResponse.ok) throw new Error("Failed to load participants")
      const participantsData = await participantsResponse.json()
      setParticipants(participantsData)
    } catch (error) {
      console.error("[v0] Error loading session data:", error)
      toast({
        title: "Error",
        description: "Failed to load session data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (participantId: string) => {
    try {
      const response = await fetch(`/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      })

      if (!response.ok) throw new Error("Failed to approve request")

      toast({
        title: "Request Approved",
        description: "The participant has been approved",
      })

      loadSessionData()
    } catch (error) {
      console.error("[v0] Error approving request:", error)
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (participantId: string) => {
    try {
      const response = await fetch(`/api/participants/${participantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })

      if (!response.ok) throw new Error("Failed to reject request")

      toast({
        title: "Request Rejected",
        description: "The participant has been rejected",
      })

      loadSessionData()
    } catch (error) {
      console.error("[v0] Error rejecting request:", error)
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Session not found</p>
      </div>
    )
  }

  const pendingRequests = participants.filter((p) => p.status === "pending")
  const approvedParticipants = participants.filter((p) => p.status === "approved")
  const rejectedParticipants = participants.filter((p) => p.status === "rejected")

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/my-sessions">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Manage Session</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-balance">{session.subject}</CardTitle>
            <CardDescription>{session.description || "No description"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {approvedParticipants.length} / {session.capacity} participants
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Pending Requests ({pendingRequests.length})</h2>
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">No pending requests</CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingRequests.map((participant) => (
                <JoinRequestCard
                  key={participant.id}
                  participant={participant}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </div>

        {/* Approved Participants */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Approved Participants ({approvedParticipants.length})</h2>
          {approvedParticipants.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">No approved participants yet</CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {approvedParticipants.map((participant) => (
                <JoinRequestCard key={participant.id} participant={participant} />
              ))}
            </div>
          )}
        </div>

        {/* Rejected Requests */}
        {rejectedParticipants.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Rejected Requests ({rejectedParticipants.length})</h2>
            <div className="flex flex-col gap-3">
              {rejectedParticipants.map((participant) => (
                <JoinRequestCard key={participant.id} participant={participant} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

"use client"

import type { StudySession } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users, Settings } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

interface MySessionsListProps {
  sessions: StudySession[]
}

export function MySessionsList({ sessions }: MySessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">You haven't created any sessions yet</p>
        <Link href="/create">
          <Button className="mt-4">Create Your First Session</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {sessions.map((session) => {
        const sessionDate = new Date(session.date)
        const pendingCount = session.participants?.filter((p) => p.status === "pending").length || 0
        const approvedCount = session.participants?.filter((p) => p.status === "approved").length || 0

        return (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-balance">{session.subject}</CardTitle>
                  <CardDescription className="mt-1">{session.description || "No description"}</CardDescription>
                </div>
                <Link href={`/sessions/${session.id}/manage`}>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {session.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{format(sessionDate, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {session.startTime} - {session.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-pretty">{session.location.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {approvedCount} / {session.capacity} participants
                  </span>
                  {pendingCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {pendingCount} pending
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

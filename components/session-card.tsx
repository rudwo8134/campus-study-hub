"use client"

import type { StudySession } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { format } from "date-fns"

interface SessionCardProps {
  session: StudySession
  onJoinClick?: (sessionId: string) => void
  distance?: number
}

export function SessionCard({ session, onJoinClick, distance }: SessionCardProps) {
  const sessionDate = new Date(session.date)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-balance">{session.subject}</CardTitle>
            <CardDescription className="mt-1">{session.description || "No description provided"}</CardDescription>
          </div>
          {distance !== undefined && <Badge variant="secondary">{distance.toFixed(1)} km</Badge>}
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
          {/* Date and Time */}
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

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-pretty">{session.location.address}</span>
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {session.participants?.filter((p) => p.status === "approved").length || 0} / {session.capacity}{" "}
              participants
            </span>
          </div>

          {/* Join Button */}
          {onJoinClick && (
            <Button onClick={() => onJoinClick(session.id)} className="w-full mt-2">
              Request to Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

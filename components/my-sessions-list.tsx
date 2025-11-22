"use client";

import type { StudySession } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Settings } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface MySessionsListProps {
  sessions: StudySession[];
}

export function MySessionsList({ sessions }: MySessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          You haven't created any sessions yet
        </p>
        <Link href="/create">
          <Button className="mt-4">Create Your First Session</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sessions.map((session, index) => {
        const sessionDate = new Date(session.date);
        const pendingCount =
          session.participants?.filter((p) => p.status === "pending").length ||
          0;
        const approvedCount =
          session.participants?.filter((p) => p.status === "approved").length ||
          0;

        return (
          <Card
            key={session.id}
            className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-balance text-primary">
                    {session.subject}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {session.description || "No description"}
                  </CardDescription>
                </div>
                <Link href={`/sessions/${session.id}/manage`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {session.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-primary/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{format(sessionDate, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>
                    {session.startTime} - {session.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-pretty">
                    {session.location.address}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    {approvedCount} / {session.capacity} participants
                  </span>
                  {pendingCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-primary/10 text-primary border-primary/20"
                    >
                      {pendingCount} pending
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

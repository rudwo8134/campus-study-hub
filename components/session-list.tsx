"use client";

import type { SessionSearchResult } from "@/lib/types";
import { SessionCard } from "./session-card";

interface SessionListProps {
  sessions: SessionSearchResult[];
  onJoinClick?: (sessionId: string) => void;
  onCancelClick?: (sessionId: string) => void;
  currentUserId?: string | null;
}

export function SessionList({
  sessions,
  onJoinClick,
  onCancelClick,
  currentUserId,
}: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No study sessions found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your filters or create a new session
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {sessions.map((session, index) => (
        <div
          key={session.id}
          className="animate-in fade-in slide-in-from-bottom duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <SessionCard
            session={session}
            onJoinClick={onJoinClick}
            onCancelClick={onCancelClick}
            distance={session.distance}
            currentUserId={currentUserId}
          />
        </div>
      ))}
    </div>
  );
}

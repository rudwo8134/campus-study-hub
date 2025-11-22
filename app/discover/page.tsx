"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SessionFilters } from "@/components/session-filters";
import { SessionList } from "@/components/session-list";
import { SessionMap } from "@/components/session-map";
import { LogoutButton } from "@/components/logout-button";
import { ArrowLeft } from "lucide-react";
import type {
  SessionSearchResult,
  SessionFilters as Filters,
} from "@/lib/types";
import type { RankingType } from "@/lib/ranking/ranking-factory";
import { useToast } from "@/hooks/use-toast";
import { getSessionMediator } from "@/lib/mediator/session-mediator";

export default function DiscoverPage() {
  const [sessions, setSessions] = useState<SessionSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<Filters>({});
  const [currentRanking, setCurrentRanking] =
    useState<RankingType>("relevance");
  const { toast } = useToast();

  useEffect(() => {
    loadSessions({}, "relevance");

    // Fetch current user
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserId(data.user.id);
        }
      })
      .catch((err) => console.error("Failed to fetch user:", err));

    const mediator = getSessionMediator();
    mediator.registerComponent("discover-page", (event, data) => {
      if (event === "session:created" || event === "session:updated") {
        loadSessions({}, "relevance");
      }
    });

    return () => {
      mediator.unregisterComponent("discover-page");
    };
  }, []);

  const loadSessions = async (
    filters: Filters,
    rankingType: RankingType = "relevance"
  ) => {
    setCurrentFilters(filters);
    setCurrentRanking(rankingType);
    setIsLoading(true);
    try {
      const response = await fetch("/api/sessions/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filters, rankingType }),
      });

      if (!response.ok) throw new Error("Failed to load sessions");

      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("[v0] Error loading sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load study sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRequest = async (sessionId: string) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to join a session",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId }),
      });

      if (!response.ok) throw new Error("Failed to request join");

      toast({
        title: "Request Sent",
        description: "Your join request has been sent to the host",
      });

      // Refresh sessions to show updated status
      loadSessions(currentFilters, currentRanking);

      const mediator = getSessionMediator();
      mediator.notifyParticipantStatusChanged(sessionId, userId, "pending");
    } catch (error) {
      console.error("[v0] Error requesting to join:", error);
      toast({
        title: "Error",
        description: "Failed to send join request",
        variant: "destructive",
      });
    }
  };

  const handleCancelRequest = async (sessionId: string) => {
    if (!userId) return;

    try {
      const response = await fetch("/api/participants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId }),
      });

      if (!response.ok) throw new Error("Failed to cancel request");

      toast({
        title: "Request Cancelled",
        description: "Your join request has been cancelled",
      });

      // Refresh sessions to show updated status
      loadSessions(currentFilters, currentRanking);
    } catch (error) {
      console.error("[v0] Error cancelling request:", error);
      toast({
        title: "Error",
        description: "Failed to cancel request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Discover Study Sessions</h1>
                <p className="text-sm text-muted-foreground">
                  Find and join study groups near you
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters (fixed width) */}
          <aside className="w-80 flex-shrink-0">
            <div className="sticky top-6">
              <SessionFilters onFilterChange={loadSessions} />
            </div>
          </aside>

          {/* Right Content - Map and List */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Map Section */}
            <div className="w-full">
              <h2 className="text-lg font-semibold mb-3">Map View</h2>
              <SessionMap
                sessions={sessions}
                onSessionClick={handleJoinRequest}
              />
            </div>

            {/* List Section */}
            <div className="w-full">
              <h2 className="text-lg font-semibold mb-3">
                Study Sessions ({sessions.length})
              </h2>
              {isLoading ? (
                <div className="text-center py-12 bg-card rounded-lg border">
                  <p className="text-muted-foreground">Loading sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border">
                  <p className="text-muted-foreground mb-4">
                    No study sessions found
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting your filters or create a new session
                  </p>
                  <Link href="/create">
                    <Button>Create First Session</Button>
                  </Link>
                </div>
              ) : (
                <SessionList
                  sessions={sessions}
                  onJoinClick={handleJoinRequest}
                  onCancelClick={handleCancelRequest}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

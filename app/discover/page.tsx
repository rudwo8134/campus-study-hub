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
  const [focusedSessionId, setFocusedSessionId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions({}, "relevance");


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

  const handleSessionFocus = (sessionId: string) => {
    setFocusedSessionId(sessionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[5%] right-[10%] w-[25%] h-[25%] rounded-full bg-primary/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-[15%] left-[5%] w-[30%] h-[30%] rounded-full bg-accent/15 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80 animate-in fade-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left duration-700">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 transition-all"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <img src="/logo.svg" alt="Campus Study Hub Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold text-primary">
                  Discover Study Sessions
                </h1>
                <p className="text-sm text-muted-foreground">
                  Find and join study groups near you
                </p>
              </div>
            </div>
            <div className="animate-in fade-in slide-in-from-right duration-700">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex gap-6">

          <aside className="w-80 flex-shrink-0 animate-in fade-in slide-in-from-left duration-700">
            <div className="sticky top-24">
              <SessionFilters onFilterChange={loadSessions} />
            </div>
          </aside>


          <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-right duration-700">

            <div className="w-full animate-scale-in">
              <h2 className="text-lg font-semibold mb-3 text-primary">
                Map View
              </h2>
              <SessionMap
                sessions={sessions}
                onSessionClick={handleJoinRequest}
                focusedSessionId={focusedSessionId}
              />
            </div>


            <div className="w-full">
              <h2 className="text-lg font-semibold mb-3 text-primary">
                Study Sessions ({sessions.length})
              </h2>
              {isLoading ? (
                <div className="text-center py-12 bg-card rounded-lg border border-primary/20 animate-pulse">
                  <div className="inline-block h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-muted-foreground">Loading sessions...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-primary/20 animate-in fade-in duration-500">
                  <p className="text-muted-foreground mb-4">
                    No study sessions found
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Try adjusting your filters or create a new session
                  </p>
                  <Link href="/create">
                    <Button className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                      Create First Session
                    </Button>
                  </Link>
                </div>
              ) : (
                <SessionList
                  sessions={sessions}
                  onJoinClick={handleJoinRequest}
                  onCancelClick={handleCancelRequest}
                  onSessionClick={handleSessionFocus}
                  currentUserId={userId}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

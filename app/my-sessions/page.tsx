"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MySessionsList } from "@/components/my-sessions-list";
import { LogoutButton } from "@/components/logout-button";
import { ArrowLeft, Plus } from "lucide-react";
import type { StudySession } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMySessions();
  }, []);

  const loadMySessions = async () => {
    setIsLoading(true);
    try {
      // Mock user ID (replace with actual auth)
      const userId = "mock-user-id";

      const response = await fetch(`/api/sessions?hostId=${userId}`);
      if (!response.ok) throw new Error("Failed to load sessions");

      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error("[v0] Error loading sessions:", error);
      toast({
        title: "Error",
        description: "Failed to load your sessions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">My Sessions</h1>
            </div>
            <div className="flex gap-2">
              <Link href="/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your sessions...</p>
          </div>
        ) : (
          <MySessionsList sessions={sessions} />
        )}
      </main>
    </div>
  );
}

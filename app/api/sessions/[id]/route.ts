import { type NextRequest, NextResponse } from "next/server";
import { getSessionRepository } from "@/lib/repository/session-repository";
import { getParticipantRepository } from "@/lib/repository/participant-repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionRepo = getSessionRepository();
    const session = await sessionRepo.findById(id);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Load participants for this session
    const participantRepo = getParticipantRepository();
    const participants = await participantRepo.findBySessionId(id);

    const sessionWithParticipants = {
      ...session,
      participants,
    };

    return NextResponse.json(sessionWithParticipants);
  } catch (error) {
    console.error("[v0] Error fetching session:", error);
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    );
  }
}

import { type NextRequest, NextResponse } from "next/server";
import { getSessionRepository } from "@/lib/repository/session-repository";
import { getParticipantRepository } from "@/lib/repository/participant-repository";
import { cookies } from "next/headers";

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sessionRepo = getSessionRepository();
    const session = await sessionRepo.findById(id);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }


    if (session.hostId !== userId) {
      return NextResponse.json(
        { error: "Only the host can delete this session" },
        { status: 403 }
      );
    }


    const participantRepo = getParticipantRepository();
    const participants = await participantRepo.findBySessionId(id);
    for (const participant of participants) {
      await participantRepo.delete(participant.id);
    }


    await sessionRepo.delete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[v0] Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}

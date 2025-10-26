import { type NextRequest, NextResponse } from "next/server";
import { getParticipantRepository } from "@/lib/repository/participant-repository";
import type { SessionParticipant } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId } = body;

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const participantRepo = getParticipantRepository();

    const existing = await participantRepo.findBySessionId(sessionId);
    const alreadyRequested = existing.some((p) => p.userId === userId);

    if (alreadyRequested) {
      return NextResponse.json(
        { error: "Already requested to join this session" },
        { status: 400 }
      );
    }

    const participant = await participantRepo.create({
      sessionId,
      userId,
      status: "pending",
      requestedAt: new Date(),
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating participant request:", error);
    return NextResponse.json(
      { error: "Failed to create join request" },
      { status: 500 }
    );
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getParticipantRepository } from "@/lib/repository/participant-repository"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const participantRepo = getParticipantRepository()
    const participant = await participantRepo.updateStatus(id, status)

    return NextResponse.json(participant)
  } catch (error) {
    console.error("[v0] Error updating participant status:", error)
    return NextResponse.json({ error: "Failed to update participant status" }, { status: 500 })
  }
}

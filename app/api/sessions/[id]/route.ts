import { type NextRequest, NextResponse } from "next/server"
import { getSessionRepository } from "@/lib/repository/session-repository"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sessionRepo = getSessionRepository()
    const session = await sessionRepo.findById(id)

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("[v0] Error fetching session:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}

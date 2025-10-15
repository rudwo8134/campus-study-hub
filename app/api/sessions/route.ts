import { type NextRequest, NextResponse } from "next/server"
import { getSessionRepository } from "@/lib/repository/session-repository"
import { getGeocodingProvider } from "@/lib/geocoding/geocoding-factory"
import { getSessionMediator } from "@/lib/mediator/session-mediator"
import type { StudySession } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const sessionRepo = getSessionRepository()
    const sessions = await sessionRepo.findUpcoming()

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("[v0] Error fetching sessions:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { hostId, subject, tags, date, startTime, endTime, capacity, address, description } = body

    // Validate required fields
    if (!hostId || !subject || !date || !startTime || !endTime || !capacity || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const geocodingProvider = getGeocodingProvider()
    const location = await geocodingProvider.geocode(address)

    const sessionRepo = getSessionRepository()
    const session = await sessionRepo.create({
      hostId,
      subject,
      tags: tags || [],
      date: new Date(date),
      startTime,
      endTime,
      capacity,
      location,
      description,
    } as Omit<StudySession, "id" | "createdAt" | "updatedAt">)

    const mediator = getSessionMediator()
    mediator.notifySessionCreated(session.id)

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

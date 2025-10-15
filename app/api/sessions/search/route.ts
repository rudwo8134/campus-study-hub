import { type NextRequest, NextResponse } from "next/server"
import { getSessionRepository } from "@/lib/repository/session-repository"
import type { SessionFilters } from "@/lib/types"
import { RankingFactory, type RankingType } from "@/lib/ranking/ranking-factory"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const filters: SessionFilters = body.filters || body
    const rankingType: RankingType = body.rankingType || "relevance"

    const sessionRepo = getSessionRepository()
    let sessions = await sessionRepo.findByFilters(filters)

    const rankingStrategy = RankingFactory.createStrategy(rankingType)
    sessions = rankingStrategy.rank(sessions, filters)

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("[v0] Error searching sessions:", error)
    return NextResponse.json({ error: "Failed to search sessions" }, { status: 500 })
  }
}

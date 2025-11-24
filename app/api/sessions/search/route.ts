import { type NextRequest, NextResponse } from "next/server";
import { getSessionRepository } from "@/lib/repository/session-repository";
import type { SessionFilters, SessionSearchResult } from "@/lib/types";
import {
  RankingFactory,
  type RankingType,
} from "@/lib/ranking/ranking-factory";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const filters: SessionFilters = body.filters || body;
    const rankingType: RankingType = body.rankingType || "relevance";


    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    const sessionRepo = getSessionRepository();
    let sessions = await sessionRepo.findByFilters(filters);

    const rankingStrategy = RankingFactory.createStrategy(rankingType);
    sessions = rankingStrategy.rank(sessions, filters);


    if (userId) {
      sessions = sessions.map((session) => {
        const participant = session.participants?.find(
          (p) => p.userId === userId
        );
        return {
          ...session,
          participationStatus: participant ? participant.status : null,
        };
      });
    }

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("[v0] Error searching sessions:", error);
    return NextResponse.json(
      { error: "Failed to search sessions" },
      { status: 500 }
    );
  }
}

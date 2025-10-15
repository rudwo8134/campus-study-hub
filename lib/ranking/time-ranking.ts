// Time-based ranking strategy (soonest sessions first)
import { RankingStrategy } from "./ranking-strategy"
import type { SessionSearchResult, SessionFilters } from "../types"

export class TimeRankingStrategy extends RankingStrategy {
  rank(sessions: SessionSearchResult[], filters: SessionFilters): SessionSearchResult[] {
    return sessions
      .map((session) => ({
        ...session,
        relevanceScore: this.calculateScore(session, filters),
      }))
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
  }

  private calculateScore(session: SessionSearchResult, filters: SessionFilters): number {
    let score = 100

    // Time until session (sooner = higher score)
    const daysUntilSession = Math.floor((session.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

    if (daysUntilSession <= 1) {
      score += 50 // Today or tomorrow
    } else if (daysUntilSession <= 3) {
      score += 30 // Within 3 days
    } else if (daysUntilSession <= 7) {
      score += 15 // Within a week
    } else {
      score -= daysUntilSession // Penalty for far future
    }

    // Available capacity
    const participantCount = session.participants?.filter((p) => p.status === "approved").length || 0
    const availableSpots = session.capacity - participantCount
    if (availableSpots > 0) {
      score += 10
    }

    return Math.max(0, score)
  }
}

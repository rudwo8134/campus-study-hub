
import { RankingStrategy } from "./ranking-strategy";
import type { SessionSearchResult, SessionFilters } from "../types";

export class RelevanceRankingStrategy extends RankingStrategy {
  rank(
    sessions: SessionSearchResult[],
    filters: SessionFilters
  ): SessionSearchResult[] {
    return sessions
      .map((session) => ({
        ...session,
        relevanceScore: this.calculateScore(session, filters),
      }))
      .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  }

  private calculateScore(
    session: SessionSearchResult,
    filters: SessionFilters
  ): number {
    let score = 0;


    if (filters.subject) {
      const subjectLower = session.subject.toLowerCase();
      const filterLower = filters.subject.toLowerCase();

      if (subjectLower === filterLower) {
        score += 50;
      } else if (subjectLower.includes(filterLower)) {
        score += 30;
      }
    }


    if (filters.tags && filters.tags.length > 0) {
      const matchingTags = session.tags.filter((tag) =>
        filters.tags!.some((filterTag) =>
          tag.toLowerCase().includes(filterTag.toLowerCase())
        )
      );
      score += matchingTags.length * 15;
    }


    const participantCount =
      session.participants?.filter((p) => p.status === "approved").length || 0;
    const availableSpots = session.capacity - participantCount;
    if (availableSpots > 0) {
      score += 10;
    } else {

      score -= 50;
    }


    score += 10;


    if (session.distance !== undefined) {
      score -= session.distance * 2;
    }

    return Math.max(0, score);
  }
}

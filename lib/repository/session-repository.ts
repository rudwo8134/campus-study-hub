// Repository Pattern Implementation for Study Sessions
import type { BaseRepository } from "./base-repository"
import type { StudySession, SessionFilters, SessionSearchResult } from "../types"

export interface ISessionRepository extends BaseRepository<StudySession> {
  findByFilters(filters: SessionFilters): Promise<SessionSearchResult[]>
  findByHostId(hostId: string): Promise<StudySession[]>
  findUpcoming(): Promise<StudySession[]>
}

// In-memory implementation (will be replaced with PostgreSQL)
export class InMemorySessionRepository implements ISessionRepository {
  private sessions: Map<string, StudySession> = new Map()

  async findById(id: string): Promise<StudySession | null> {
    return this.sessions.get(id) || null
  }

  async findAll(): Promise<StudySession[]> {
    return Array.from(this.sessions.values())
  }

  async create(data: Omit<StudySession, "id" | "createdAt" | "updatedAt">): Promise<StudySession> {
    const session: StudySession = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.sessions.set(session.id, session)
    return session
  }

  async update(id: string, data: Partial<StudySession>): Promise<StudySession> {
    const existing = this.sessions.get(id)
    if (!existing) throw new Error("Session not found")

    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    }
    this.sessions.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id)
  }

  async findByFilters(filters: SessionFilters): Promise<SessionSearchResult[]> {
    let results = Array.from(this.sessions.values())

    if (filters.subject) {
      results = results.filter((s) => s.subject.toLowerCase().includes(filters.subject!.toLowerCase()))
    }

    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((s) => filters.tags!.some((tag) => s.tags.includes(tag)))
    }

    if (filters.date) {
      const filterDate = filters.date.toDateString()
      results = results.filter((s) => s.date.toDateString() === filterDate)
    }

    // Calculate distance if user location provided
    if (filters.userLocation && filters.maxDistance) {
      results = results
        .map((session) => ({
          ...session,
          distance: this.calculateDistance(filters.userLocation!, session.location),
        }))
        .filter((s) => s.distance! <= filters.maxDistance!)
    }

    return results as SessionSearchResult[]
  }

  async findByHostId(hostId: string): Promise<StudySession[]> {
    return Array.from(this.sessions.values()).filter((s) => s.hostId === hostId)
  }

  async findUpcoming(): Promise<StudySession[]> {
    const now = new Date()
    return Array.from(this.sessions.values())
      .filter((s) => s.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  private calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number },
  ): number {
    // Haversine formula for distance calculation
    const R = 6371 // Earth's radius in km
    const dLat = this.toRad(point2.latitude - point1.latitude)
    const dLon = this.toRad(point2.longitude - point1.longitude)
    const lat1 = this.toRad(point1.latitude)
    const lat2 = this.toRad(point2.latitude)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}

// Singleton instance
let sessionRepository: ISessionRepository | null = null

export function getSessionRepository(): ISessionRepository {
  if (!sessionRepository) {
    sessionRepository = new InMemorySessionRepository()
  }
  return sessionRepository
}

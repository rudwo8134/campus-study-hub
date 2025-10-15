// Repository for managing session participants and join requests
import type { BaseRepository } from "./base-repository"
import type { SessionParticipant } from "../types"

export interface IParticipantRepository extends BaseRepository<SessionParticipant> {
  findBySessionId(sessionId: string): Promise<SessionParticipant[]>
  findByUserId(userId: string): Promise<SessionParticipant[]>
  findPendingRequests(sessionId: string): Promise<SessionParticipant[]>
  updateStatus(id: string, status: "approved" | "rejected"): Promise<SessionParticipant>
}

export class InMemoryParticipantRepository implements IParticipantRepository {
  private participants: Map<string, SessionParticipant> = new Map()

  async findById(id: string): Promise<SessionParticipant | null> {
    return this.participants.get(id) || null
  }

  async findAll(): Promise<SessionParticipant[]> {
    return Array.from(this.participants.values())
  }

  async create(data: Omit<SessionParticipant, "id" | "requestedAt">): Promise<SessionParticipant> {
    const participant: SessionParticipant = {
      ...data,
      id: crypto.randomUUID(),
      requestedAt: new Date(),
      status: "pending",
    }
    this.participants.set(participant.id, participant)
    return participant
  }

  async update(id: string, data: Partial<SessionParticipant>): Promise<SessionParticipant> {
    const existing = this.participants.get(id)
    if (!existing) throw new Error("Participant not found")

    const updated = { ...existing, ...data }
    this.participants.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    this.participants.delete(id)
  }

  async findBySessionId(sessionId: string): Promise<SessionParticipant[]> {
    return Array.from(this.participants.values()).filter((p) => p.sessionId === sessionId)
  }

  async findByUserId(userId: string): Promise<SessionParticipant[]> {
    return Array.from(this.participants.values()).filter((p) => p.userId === userId)
  }

  async findPendingRequests(sessionId: string): Promise<SessionParticipant[]> {
    return Array.from(this.participants.values()).filter((p) => p.sessionId === sessionId && p.status === "pending")
  }

  async updateStatus(id: string, status: "approved" | "rejected"): Promise<SessionParticipant> {
    const existing = this.participants.get(id)
    if (!existing) throw new Error("Participant not found")

    const updated = {
      ...existing,
      status,
      respondedAt: new Date(),
    }
    this.participants.set(id, updated)
    return updated
  }
}

let participantRepository: IParticipantRepository | null = null

export function getParticipantRepository(): IParticipantRepository {
  if (!participantRepository) {
    participantRepository = new InMemoryParticipantRepository()
  }
  return participantRepository
}

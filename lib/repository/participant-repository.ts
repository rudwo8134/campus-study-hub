// Repository for managing session participants and join requests
import { query, queryOne } from "../db";
import type { BaseRepository } from "./base-repository";
import type { SessionParticipant, User } from "../types";

export interface IParticipantRepository
  extends BaseRepository<SessionParticipant> {
  findBySessionId(sessionId: string): Promise<SessionParticipant[]>;
  findByUserId(userId: string): Promise<SessionParticipant[]>;
  findPendingRequests(sessionId: string): Promise<SessionParticipant[]>;
  updateStatus(
    id: string,
    status: "approved" | "rejected"
  ): Promise<SessionParticipant>;
}

export class PostgreSQLParticipantRepository implements IParticipantRepository {
  async findById(id: string): Promise<SessionParticipant | null> {
    const row = await queryOne<any>(
      `SELECT p.*,
              u.id as user_id, u.email as user_email, u.name as user_name, u.created_at as user_created_at
       FROM session_participants p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    return row ? this.mapRowToParticipant(row) : null;
  }

  async findAll(): Promise<SessionParticipant[]> {
    const rows = await query<any>(
      `SELECT p.*,
              u.id as user_id, u.email as user_email, u.name as user_name, u.created_at as user_created_at
       FROM session_participants p
       LEFT JOIN users u ON p.user_id = u.id
       ORDER BY p.requested_at DESC`
    );

    return rows.map((row) => this.mapRowToParticipant(row));
  }

  async create(
    data: Omit<SessionParticipant, "id" | "requestedAt">
  ): Promise<SessionParticipant> {
    const row = await queryOne<any>(
      `INSERT INTO session_participants 
       (session_id, user_id, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.sessionId, data.userId, data.status || "pending"]
    );

    if (!row) throw new Error("Failed to create participant");
    return this.mapRowToParticipant(row);
  }

  async update(
    id: string,
    data: Partial<SessionParticipant>
  ): Promise<SessionParticipant> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.respondedAt !== undefined) {
      updates.push(`responded_at = $${paramIndex++}`);
      values.push(data.respondedAt);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const row = await queryOne<any>(
      `UPDATE session_participants 
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (!row) throw new Error("Participant not found");
    return this.mapRowToParticipant(row);
  }

  async delete(id: string): Promise<void> {
    await query("DELETE FROM session_participants WHERE id = $1", [id]);
  }

  async findBySessionId(sessionId: string): Promise<SessionParticipant[]> {
    const rows = await query<any>(
      `SELECT p.*,
              u.id as user_id, u.email as user_email, u.name as user_name, u.created_at as user_created_at
       FROM session_participants p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.session_id = $1
       ORDER BY p.requested_at DESC`,
      [sessionId]
    );

    return rows.map((row) => this.mapRowToParticipant(row));
  }

  async findByUserId(userId: string): Promise<SessionParticipant[]> {
    const rows = await query<any>(
      `SELECT p.*,
              u.id as user_id, u.email as user_email, u.name as user_name, u.created_at as user_created_at
       FROM session_participants p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.user_id = $1
       ORDER BY p.requested_at DESC`,
      [userId]
    );

    return rows.map((row) => this.mapRowToParticipant(row));
  }

  async findPendingRequests(sessionId: string): Promise<SessionParticipant[]> {
    const rows = await query<any>(
      `SELECT p.*,
              u.id as user_id, u.email as user_email, u.name as user_name, u.created_at as user_created_at
       FROM session_participants p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.session_id = $1 AND p.status = 'pending'
       ORDER BY p.requested_at ASC`,
      [sessionId]
    );

    return rows.map((row) => this.mapRowToParticipant(row));
  }

  async updateStatus(
    id: string,
    status: "approved" | "rejected"
  ): Promise<SessionParticipant> {
    const row = await queryOne<any>(
      `UPDATE session_participants 
       SET status = $1, responded_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (!row) throw new Error("Participant not found");
    return this.mapRowToParticipant(row);
  }

  private mapRowToParticipant(row: any): SessionParticipant {
    const participant: SessionParticipant = {
      id: row.id,
      sessionId: row.session_id,
      userId: row.user_id,
      status: row.status,
      requestedAt: new Date(row.requested_at),
      respondedAt: row.responded_at ? new Date(row.responded_at) : undefined,
    };

    // Add user information if available
    if (row.user_email) {
      participant.user = {
        id: row.user_id,
        email: row.user_email,
        name: row.user_name,
        createdAt: new Date(row.user_created_at),
      };
    }

    return participant;
  }
}

let participantRepository: IParticipantRepository | null = null;

export function getParticipantRepository(): IParticipantRepository {
  if (!participantRepository) {
    participantRepository = new PostgreSQLParticipantRepository();
  }
  return participantRepository;
}

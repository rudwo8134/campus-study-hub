// Repository Pattern Implementation for Study Sessions
import { query, queryOne } from "../db";
import type { BaseRepository } from "./base-repository";
import type {
  StudySession,
  SessionFilters,
  SessionSearchResult,
  User,
} from "../types";

export interface ISessionRepository extends BaseRepository<StudySession> {
  findByFilters(filters: SessionFilters): Promise<SessionSearchResult[]>;
  findByHostId(hostId: string): Promise<StudySession[]>;
  findUpcoming(): Promise<StudySession[]>;
}

// PostgreSQL implementation
export class PostgreSQLSessionRepository implements ISessionRepository {
  async findById(id: string): Promise<StudySession | null> {
    const row = await queryOne<any>(
      `SELECT s.*, 
              u.id as host_id, u.email as host_email, u.name as host_name, u.created_at as host_created_at
       FROM study_sessions s
       LEFT JOIN users u ON s.host_id = u.id
       WHERE s.id = $1`,
      [id]
    );

    return row ? this.mapRowToSession(row) : null;
  }

  async findAll(): Promise<StudySession[]> {
    const rows = await query<any>(
      `SELECT s.*, 
              u.id as host_id, u.email as host_email, u.name as host_name, u.created_at as host_created_at
       FROM study_sessions s
       LEFT JOIN users u ON s.host_id = u.id
       ORDER BY s.date ASC, s.start_time ASC`
    );

    return rows.map((row) => this.mapRowToSession(row));
  }

  async create(
    data: Omit<StudySession, "id" | "createdAt" | "updatedAt">
  ): Promise<StudySession> {
    const row = await queryOne<any>(
      `INSERT INTO study_sessions 
       (host_id, subject, tags, date, start_time, end_time, capacity, address, latitude, longitude, place_id, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        data.hostId,
        data.subject,
        data.tags,
        data.date,
        data.startTime,
        data.endTime,
        data.capacity,
        data.location.address,
        data.location.latitude,
        data.location.longitude,
        data.location.placeId || null,
        data.description || null,
      ]
    );

    if (!row) throw new Error("Failed to create session");
    return this.mapRowToSession(row);
  }

  async update(id: string, data: Partial<StudySession>): Promise<StudySession> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.subject !== undefined) {
      updates.push(`subject = $${paramIndex++}`);
      values.push(data.subject);
    }
    if (data.tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`);
      values.push(data.tags);
    }
    if (data.date !== undefined) {
      updates.push(`date = $${paramIndex++}`);
      values.push(data.date);
    }
    if (data.startTime !== undefined) {
      updates.push(`start_time = $${paramIndex++}`);
      values.push(data.startTime);
    }
    if (data.endTime !== undefined) {
      updates.push(`end_time = $${paramIndex++}`);
      values.push(data.endTime);
    }
    if (data.capacity !== undefined) {
      updates.push(`capacity = $${paramIndex++}`);
      values.push(data.capacity);
    }
    if (data.location !== undefined) {
      updates.push(`address = $${paramIndex++}`);
      values.push(data.location.address);
      updates.push(`latitude = $${paramIndex++}`);
      values.push(data.location.latitude);
      updates.push(`longitude = $${paramIndex++}`);
      values.push(data.location.longitude);
      updates.push(`place_id = $${paramIndex++}`);
      values.push(data.location.placeId || null);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }

    if (updates.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const row = await queryOne<any>(
      `UPDATE study_sessions 
       SET ${updates.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (!row) throw new Error("Session not found");
    return this.mapRowToSession(row);
  }

  async delete(id: string): Promise<void> {
    await query("DELETE FROM study_sessions WHERE id = $1", [id]);
  }

  async findByFilters(filters: SessionFilters): Promise<SessionSearchResult[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (filters.subject) {
      conditions.push(`s.subject ILIKE $${paramIndex++}`);
      values.push(`%${filters.subject}%`);
    }

    if (filters.tags && filters.tags.length > 0) {
      conditions.push(`s.tags && $${paramIndex++}`);
      values.push(filters.tags);
    }

    if (filters.date) {
      conditions.push(`s.date = $${paramIndex++}`);
      values.push(filters.date);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let distanceSelect = "";
    if (filters.userLocation) {
      const { latitude, longitude } = filters.userLocation;
      // Calculate distance using Haversine formula in SQL
      distanceSelect = `,
        (6371 * acos(
          cos(radians(${latitude})) * 
          cos(radians(s.latitude)) * 
          cos(radians(s.longitude) - radians(${longitude})) + 
          sin(radians(${latitude})) * 
          sin(radians(s.latitude))
        )) as distance`;
    }

    const rows = await query<any>(
      `SELECT s.*,
              u.id as host_id, u.email as host_email, u.name as host_name, u.created_at as host_created_at
              ${distanceSelect}
       FROM study_sessions s
       LEFT JOIN users u ON s.host_id = u.id
       ${whereClause}
       ORDER BY s.date ASC, s.start_time ASC`,
      values
    );

    let results = rows.map((row) => {
      const session = this.mapRowToSession(row);
      const result: SessionSearchResult = {
        ...session,
        distance: row.distance || undefined,
      };
      return result;
    });

    // Filter by distance if specified
    if (filters.maxDistance && filters.userLocation) {
      results = results.filter(
        (s) => s.distance !== undefined && s.distance <= filters.maxDistance!
      );
    }

    return results;
  }

  async findByHostId(hostId: string): Promise<StudySession[]> {
    const rows = await query<any>(
      `SELECT s.*,
              u.id as host_id, u.email as host_email, u.name as host_name, u.created_at as host_created_at
       FROM study_sessions s
       LEFT JOIN users u ON s.host_id = u.id
       WHERE s.host_id = $1
       ORDER BY s.date DESC, s.start_time DESC`,
      [hostId]
    );

    return rows.map((row) => this.mapRowToSession(row));
  }

  async findUpcoming(): Promise<StudySession[]> {
    const rows = await query<any>(
      `SELECT s.*,
              u.id as host_id, u.email as host_email, u.name as host_name, u.created_at as host_created_at
       FROM study_sessions s
       LEFT JOIN users u ON s.host_id = u.id
       WHERE s.date >= CURRENT_DATE
       ORDER BY s.date ASC, s.start_time ASC`
    );

    return rows.map((row) => this.mapRowToSession(row));
  }

  private mapRowToSession(row: any): StudySession {
    const session: StudySession = {
      id: row.id,
      hostId: row.host_id,
      subject: row.subject,
      tags: row.tags || [],
      date: new Date(row.date),
      startTime: row.start_time,
      endTime: row.end_time,
      capacity: row.capacity,
      location: {
        address: row.address,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        placeId: row.place_id || undefined,
      },
      description: row.description || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };

    // Add host information if available
    if (row.host_email) {
      session.host = {
        id: row.host_id,
        email: row.host_email,
        name: row.host_name,
        createdAt: new Date(row.host_created_at),
      };
    }

    return session;
  }
}

// Singleton instance
let sessionRepository: ISessionRepository | null = null;

export function getSessionRepository(): ISessionRepository {
  if (!sessionRepository) {
    sessionRepository = new PostgreSQLSessionRepository();
  }
  return sessionRepository;
}

import { Pool, QueryResult } from "pg";

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Test connection on startup
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

// Helper function to execute queries
export async function query<T = any>(
  queryText: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const result: QueryResult = await pool.query(queryText, params);
    return result.rows as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Helper function to execute single row queries
export async function queryOne<T = any>(
  queryText: string,
  params: any[] = []
): Promise<T | null> {
  const rows = await query<T>(queryText, params);
  return rows.length > 0 ? rows[0] : null;
}

// Export pool for advanced usage
export { pool };

import { Pool, QueryResult } from "pg";


const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

const sslConfig = () => {
  if (process.env.DATABASE_SSL === 'false' || process.env.POSTGRES_SSL === 'false') {
    return false;
  }
  
  if (process.env.DATABASE_SSL === 'true' || process.env.POSTGRES_SSL === 'true') {
    return { rejectUnauthorized: false };
  }
  
  if (process.env.NODE_ENV === 'production' && connectionString?.includes('sslmode=require')) {
    return { rejectUnauthorized: false };
  }
  
  return false;
};

const pool = new Pool({
  connectionString,
  ssl: sslConfig(),
});


pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});


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


export async function queryOne<T = any>(
  queryText: string,
  params: any[] = []
): Promise<T | null> {
  const rows = await query<T>(queryText, params);
  return rows.length > 0 ? rows[0] : null;
}


export { pool };

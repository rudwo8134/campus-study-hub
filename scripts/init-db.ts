import { config } from "dotenv";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local
config({ path: path.join(__dirname, "..", ".env.local") });

async function initDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  });

  try {
    console.log("🔄 Starting database initialization...");
    console.log("📡 Connecting to database...");

    // Test connection
    await pool.query("SELECT NOW()");
    console.log("✅ Connected to database successfully!");

    // Read and execute schema file
    const schemaPath = path.join(__dirname, "001-create-schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf-8");

    console.log("\n📝 Executing schema file...");
    try {
      await pool.query(schema);
      console.log("✅ Database schema initialized successfully!");
    } catch (error: any) {
      // If error is about existing objects, that's okay
      if (error.message?.includes("already exists")) {
        console.log("⚠️  Some objects already exist (this is okay)");
      } else {
        console.error("❌ Schema error:", error.message);
        throw error;
      }
    }

    // Read and execute seed data file
    const seedPath = path.join(__dirname, "002-seed-data.sql");
    if (fs.existsSync(seedPath)) {
      console.log("\n🔄 Loading seed data...");
      const seedData = fs.readFileSync(seedPath, "utf-8");

      try {
        await pool.query(seedData);
        console.log("✅ Seed data loaded!");
      } catch (error: any) {
        console.log("⚠️  Seed error (might be duplicate data):", error.message);
      }
    }

    await pool.end();
    console.log("\n🎉 Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    await pool.end();
    process.exit(1);
  }
}

initDatabase();

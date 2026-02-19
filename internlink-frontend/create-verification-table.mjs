import { readFileSync } from "fs";
import pg from "pg";

// Load .env.local
const envFile = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^'(.*)'$/, "$1");
}

const pool = new pg.Pool({ connectionString: env["DATABASE_URL"] });
const client = await pool.connect();

console.log("Creating missing verification table...");
await client.query(`
  CREATE TABLE IF NOT EXISTS "verification" (
    "id" text NOT NULL PRIMARY KEY,
    "identifier" text NOT NULL,
    "value" text NOT NULL,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp,
    "updated_at" timestamp
  );
`);
console.log("✅ verification table created (or already existed).");

// Verify all tables exist
const res = await client.query(`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name IN ('user', 'session', 'account', 'verification')
  ORDER BY table_name;
`);
const found = res.rows.map(r => r.table_name);
for (const t of ["user", "session", "account", "verification"]) {
  console.log(`  ${t}: ${found.includes(t) ? "✅" : "❌ STILL MISSING"}`);
}

client.release();
await pool.end();

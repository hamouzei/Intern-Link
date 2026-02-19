import { readFileSync } from "fs";
import pg from "pg";

// Load env vars from .env.local manually
const envFile = readFileSync(".env.local", "utf8");
const env = {};
for (const line of envFile.split("\n")) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^'(.*)'$/, "$1").replace(/^"(.*)"$/, "$1");
  }
}

const DATABASE_URL = env["DATABASE_URL"];
const GOOGLE_CLIENT_ID = env["GOOGLE_CLIENT_ID"];
const GOOGLE_CLIENT_SECRET = env["GOOGLE_CLIENT_SECRET"];
const GITHUB_CLIENT_ID = env["GITHUB_CLIENT_ID"];
const GITHUB_CLIENT_SECRET = env["GITHUB_CLIENT_SECRET"];

console.log("=== Auth Diagnostics ===\n");
console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Missing");
console.log("GOOGLE_CLIENT_SECRET:", GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Missing");
console.log("GITHUB_CLIENT_ID:", GITHUB_CLIENT_ID ? "✅ Set" : "❌ Missing");
console.log("GITHUB_CLIENT_SECRET length:", GITHUB_CLIENT_SECRET?.length);
console.log("GitHub ID == Secret?", GITHUB_CLIENT_ID === GITHUB_CLIENT_SECRET ? "❌ SAME (bug!)" : "✅ Different");
console.log("DATABASE_URL:", DATABASE_URL ? "✅ Set" : "❌ Missing");

const pool = new pg.Pool({ connectionString: DATABASE_URL });

try {
  console.log("\n--- DB Connection ---");
  const client = await pool.connect();
  console.log("✅ Connected to database");

  // Check auth tables
  const res = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('user', 'session', 'account', 'verification')
    ORDER BY table_name;
  `);
  console.log("\n--- Auth Tables ---");
  const found = res.rows.map(r => r.table_name);
  for (const t of ["user", "session", "account", "verification"]) {
    console.log(`  ${t}: ${found.includes(t) ? "✅ Exists" : "❌ MISSING"}`);
  }

  // Try to simulate what Better Auth does - insert check
  console.log("\n--- Simulating OAuth flow readiness ---");
  try {
    await client.query(`SELECT id FROM "account" LIMIT 1`);
    console.log("  account table: ✅ Readable");
  } catch (e) {
    console.log("  account table: ❌ Error:", e.message);
  }

  client.release();
  await pool.end();
} catch (e) {
  console.error("❌ DB Error:", e.message);
}

// Also call the actual endpoint
console.log("\n--- Testing /api/auth/sign-in/social endpoint ---");
try {
  const resp = await fetch("http://localhost:3000/api/auth/sign-in/social", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: "google", callbackURL: "/dashboard" }),
  });
  console.log("  Status:", resp.status);
  const text = await resp.text();
  console.log("  Response:", text.slice(0, 500));
} catch (e) {
  console.log("  Fetch error:", e.message);
}

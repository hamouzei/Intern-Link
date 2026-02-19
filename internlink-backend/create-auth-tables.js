const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL?.replace(/^'|'$/g, ''),
});

async function createTables() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "email_verified" BOOLEAN NOT NULL DEFAULT false,
        "image" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "session" (
        "id" TEXT PRIMARY KEY,
        "expires_at" TIMESTAMP NOT NULL,
        "token" TEXT NOT NULL UNIQUE,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "ip_address" TEXT,
        "user_agent" TEXT,
        "user_id" TEXT NOT NULL REFERENCES "user"("id")
      );

      CREATE TABLE IF NOT EXISTS "account" (
        "id" TEXT PRIMARY KEY,
        "account_id" TEXT NOT NULL,
        "provider_id" TEXT NOT NULL,
        "user_id" TEXT NOT NULL REFERENCES "user"("id"),
        "access_token" TEXT,
        "refresh_token" TEXT,
        "id_token" TEXT,
        "access_token_expires_at" TIMESTAMP,
        "refresh_token_expires_at" TIMESTAMP,
        "scope" TEXT,
        "password" TEXT,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS "verification" (
        "id" TEXT PRIMARY KEY,
        "identifier" TEXT NOT NULL,
        "value" TEXT NOT NULL,
        "expires_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ All Better Auth tables created successfully!');

    // Verify
    const res = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;`);
    console.log('Tables in database:', res.rows.map(r => r.tablename));
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

createTables();

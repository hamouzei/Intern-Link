import * as dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { session } from "./src/db/auth-schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

(async () => {
  const sessions = await db.select().from(session).limit(10);
  console.log("Sessions in DB:", sessions.length);
  sessions.forEach(s => console.log({
    userId: s.userId,
    expires: s.expiresAt,
    tokenStart: s.token?.substring(0, 30)
  }));
  await pool.end();
})();

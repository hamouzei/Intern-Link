import * as dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { session, user } from "./src/db/auth-schema";
import { companies } from "./src/db/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

(async () => {
  // Get all sessions
  const sessions = await db.select().from(session);
  console.log(`Sessions: ${sessions.length}`);

  for (const s of sessions) {
    // Get the user for each session
    const [u] = await db.select().from(user).where((await import("drizzle-orm")).eq(user.id, s.userId)).limit(1);
    console.log(`\nSession userId: ${s.userId}`);
    console.log(`User: ${u?.email}, university=${u?.university}, roleApplied=${u?.roleApplied}, bio=${u?.bio}`);
    console.log(`Token: ${s.token.substring(0, 40)}...`);
    console.log(`Expires: ${s.expiresAt}`);
  }

  const [co] = await db.select().from(companies).limit(1);
  console.log(`\nUsing company: ${co?.name} (${co?.id})`);

  if (sessions.length > 0 && co) {
    const tok = sessions[0].token;
    console.log(`\nCalling POST /applications/send with token...`);
    const res = await fetch("http://localhost:4000/applications/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tok}`
      },
      body: JSON.stringify({ company_id: co.id, email_subject: "Test", email_body: "Test" })
    });
    const body = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Response:`, JSON.stringify(body, null, 2));
  }

  await pool.end();
})().catch(console.error);

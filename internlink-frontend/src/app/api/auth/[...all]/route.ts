import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const handler = toNextJsHandler(auth);

export async function GET(req: NextRequest) {
  try {
    return await handler.GET(req);
  } catch (err) {
    console.error("[Better Auth] GET error:", err);
    return new Response(JSON.stringify({ error: "Internal server error", details: String(err) }), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    return await handler.POST(req);
  } catch (err) {
    console.error("[Better Auth] POST error:", err);
    return new Response(JSON.stringify({ error: "Internal server error", details: String(err) }), { status: 500 });
  }
}


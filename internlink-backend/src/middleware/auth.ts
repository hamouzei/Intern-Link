import type { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  userId?: string;
}

export async function verifyJwt(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: missing token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    // Better Auth session token verification via the database
    // We validate sessions by querying the sessions table directly
    const { db } = await import("../db");
    const { session: sessionTable, user: userTable } = await import("../db/auth-schema");
    const { eq } = await import("drizzle-orm");

    const [sessionRecord] = await db
      .select({ userId: sessionTable.userId, expiresAt: sessionTable.expiresAt })
      .from(sessionTable)
      .where(eq(sessionTable.token, token))
      .limit(1);

    if (!sessionRecord) {
      res.status(401).json({ error: "Unauthorized: invalid token" });
      return;
    }

    if (new Date(sessionRecord.expiresAt) < new Date()) {
      res.status(401).json({ error: "Unauthorized: token expired" });
      return;
    }

    req.userId = sessionRecord.userId;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

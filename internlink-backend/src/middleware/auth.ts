import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { session as sessionTable } from "../db/auth-schema";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  userId?: string;
}

export async function verifyJwt(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: missing token" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Unauthorized: empty token" });
    return;
  }

  try {
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

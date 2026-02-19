import { Router, Response } from "express";
import { AuthRequest, verifyJwt } from "../middleware/auth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET /profile
router.get("/", verifyJwt, async (req: AuthRequest, res: Response) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.userId!)).limit(1);
    if (!user) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /profile
router.put("/", verifyJwt, async (req: AuthRequest, res: Response) => {
  const { university, roleApplied, githubLink, portfolioLink, bio, fullName } = req.body;
  try {
    const [updated] = await db
      .update(users)
      .set({ university, roleApplied, githubLink, portfolioLink, bio, fullName })
      .where(eq(users.id, req.userId!))
      .returning();
    res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

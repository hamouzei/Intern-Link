import { Router, Response } from "express";
import { AuthRequest, verifyJwt } from "../middleware/auth";
import { db } from "../db";
import { user } from "../db/auth-schema";
import { eq } from "drizzle-orm";

const router = Router();

// GET /profile
router.get("/", verifyJwt, async (req: AuthRequest, res: Response) => {
  try {
    const [userRecord] = await db.select().from(user).where(eq(user.id, req.userId!)).limit(1);
    if (!userRecord) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    // Map DB fields to camelCase response if needed, or just return record
    // The frontend expects camelCase, so let's map it or ensure frontend handles snake_case
    // For now, let's map critical fields to match previous contract
    const response = {
      ...userRecord,
      fullName: userRecord.fullName, // It's stored as full_name in DB but drizzle maps it to camelCase if defined? 
      // Drizzle standard behavior: columns are mapped to properties.
      // In auth-schema.ts: fullName: text("full_name") -> property is fullName.
      // So userRecord.fullName should be correct.
    };
    res.json(response);
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
      .update(user)
      .set({
        university,
        roleApplied,
        githubLink,
        portfolioLink,
        bio,
        fullName,
        updatedAt: new Date()
      })
      .where(eq(user.id, req.userId!))
      .returning();
    res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { Router, Response } from "express";
import { z } from "zod";
import { AuthRequest, verifyJwt } from "../middleware/auth";
import { db } from "../db";
import { user } from "../db/auth-schema";
import { documents } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const updateProfileSchema = z.object({
  fullName: z.string().trim().min(1, "Full name cannot be empty").optional(),
  university: z.string().trim().min(1, "University cannot be empty").optional(),
  roleApplied: z.string().trim().min(1, "Role applied cannot be empty").optional(),
  githubLink: z.string().trim().url("Invalid GitHub URL").optional().or(z.literal("")).nullable(),
  portfolioLink: z.string().trim().url("Invalid Portfolio URL").optional().or(z.literal("")).nullable(),
  bio: z.string().trim().max(500, "Bio must be at most 500 characters").optional(),
});

// GET /profile
router.get("/", verifyJwt, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [userRecord] = await db.select().from(user).where(eq(user.id, req.userId!)).limit(1);
    if (!userRecord) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }

    const [docRecord] = await db
      .select({
        cvUrl: documents.cvUrl,
        supportLetterUrl: documents.supportLetterUrl,
        uploadedAt: documents.uploadedAt,
      })
      .from(documents)
      .where(eq(documents.userId, req.userId!))
      .limit(1);

    res.json({
      ...userRecord,
      documents: docRecord || { cvUrl: null, supportLetterUrl: null, uploadedAt: null },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /profile
router.put("/", verifyJwt, async (req: AuthRequest, res: Response): Promise<void> => {
  const parseResult = updateProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: "Validation error",
      details: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const { university, roleApplied, githubLink, portfolioLink, bio, fullName } = parseResult.data;

  try {
    const [updated] = await db
      .update(user)
      .set({
        ...(university !== undefined && { university }),
        ...(roleApplied !== undefined && { roleApplied }),
        ...(githubLink !== undefined && { githubLink: githubLink || null }),
        ...(portfolioLink !== undefined && { portfolioLink: portfolioLink || null }),
        ...(bio !== undefined && { bio }),
        ...(fullName !== undefined && { fullName }),
        updatedAt: new Date(),
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

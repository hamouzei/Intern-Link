import { Router, Response } from "express";
import multer from "multer";
import { AuthRequest, verifyJwt } from "../middleware/auth";
import { uploadFile } from "../services/cloudinary";
import { db } from "../db";
import { documents } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"));
    } else {
      cb(null, true);
    }
  },
});

// POST /upload/cv
router.post("/cv", verifyJwt, upload.single("cv"), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }
  try {
    const url = await uploadFile(req.file.buffer, "internlink/cv", `${req.userId}-cv`);

    // Upsert document record
    const existing = await db.select().from(documents).where(eq(documents.userId, req.userId!));
    if (existing.length > 0) {
      await db.update(documents).set({ cvUrl: url }).where(eq(documents.userId, req.userId!));
    } else {
      await db.insert(documents).values({ userId: req.userId!, cvUrl: url });
    }

    res.json({ url });
  } catch (err) {
    console.error("CV upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

// POST /upload/support-letter
router.post("/support-letter", verifyJwt, upload.single("supportLetter"), async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }
  try {
    const url = await uploadFile(req.file.buffer, "internlink/letters", `${req.userId}-support-letter`);

    const existing = await db.select().from(documents).where(eq(documents.userId, req.userId!));
    if (existing.length > 0) {
      await db.update(documents).set({ supportLetterUrl: url }).where(eq(documents.userId, req.userId!));
    } else {
      await db.insert(documents).values({ userId: req.userId!, supportLetterUrl: url });
    }

    res.json({ url });
  } catch (err) {
    console.error("Support letter upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;

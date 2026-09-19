import { Router, Response } from "express";
import { z } from "zod";
import { AuthRequest, verifyJwt } from "../middleware/auth";
import { db } from "../db";
import { companies, applications, documents } from "../db/schema";
import { user } from "../db/auth-schema";
import { eq, and, sql } from "drizzle-orm";
import { generateInternshipEmail } from "../services/ai";
import { sendApplicationEmail } from "../services/email";
import { downloadCloudinaryFiles } from "../services/cloudinary";

const router = Router();

const generateSchema = z.object({
  company_id: z.string().uuid("Invalid company ID"),
});

const sendSchema = z.object({
  company_id: z.string().uuid("Invalid company ID"),
  email_subject: z.string().trim().min(1, "Email subject is required"),
  email_body: z.string().trim().min(1, "Email body is required"),
});

// POST /applications/generate
router.post("/generate", verifyJwt, async (req: AuthRequest, res: Response): Promise<void> => {
  const parseResult = generateSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Validation error", details: parseResult.error.flatten().fieldErrors });
    return;
  }

  const { company_id } = parseResult.data;

  try {
    const [userRecord] = await db.select().from(user).where(eq(user.id, req.userId!)).limit(1);
    const [company] = await db.select().from(companies).where(eq(companies.id, company_id)).limit(1);

    if (!userRecord || !company) {
      res.status(404).json({ error: "User or Company not found" });
      return;
    }

    // Required fields check
    if (!userRecord.university || !userRecord.roleApplied || !userRecord.bio) {
      res.status(400).json({ error: "Profile incomplete. Please complete your profile first." });
      return;
    }

    const emailContent = await generateInternshipEmail(
      userRecord.name,
      userRecord.university,
      userRecord.roleApplied,
      userRecord.bio,
      company.name,
      userRecord.githubLink,
      userRecord.portfolioLink
    );

    res.json(emailContent);
  } catch (err) {
    console.error("Generate email error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /applications/send
router.post("/send", verifyJwt, async (req: AuthRequest, res: Response): Promise<void> => {
  const parseResult = sendSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Validation error", details: parseResult.error.flatten().fieldErrors });
    return;
  }

  const { company_id, email_subject, email_body } = parseResult.data;

  try {
    // Rate limiting check: max 5 apps per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parallelize rate limit count, user profile, documents, and company queries
    const [
      [countResult],
      [userRecord],
      [doc],
      [company]
    ] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(applications)
        .where(and(
          eq(applications.userId, req.userId!),
          sql`${applications.sentAt} >= ${today.toISOString()}`
        )),
      db.select().from(user).where(eq(user.id, req.userId!)).limit(1),
      db.select().from(documents).where(eq(documents.userId, req.userId!)).limit(1),
      db.select().from(companies).where(eq(companies.id, company_id)).limit(1),
    ]);

    if (countResult && Number(countResult.count) >= 5) {
      res.status(429).json({ error: "Daily application limit reached (5/day)." });
      return;
    }

    if (!userRecord || !company || !doc || !doc.cvUrl || !doc.supportLetterUrl) {
      res.status(400).json({ error: "Missing profile or required documents (CV and support letter are required)." });
      return;
    }

    // Download attachments from Cloudinary (leveraging in-memory cache or bundled single archive)
    const baseName = userRecord.name.replace(/\s+/g, '_');
    const filesMap = await downloadCloudinaryFiles([doc.cvUrl!, doc.supportLetterUrl!]);
    const cvBuffer = filesMap.get(doc.cvUrl!);
    const letterBuffer = filesMap.get(doc.supportLetterUrl!);

    if (!cvBuffer || !letterBuffer) {
      res.status(500).json({ error: "Failed to retrieve application documents." });
      return;
    }

    // Send email with buffer attachments and set reply_to as the student's email
    await sendApplicationEmail(
      company.email,
      email_subject,
      email_body,
      [
        { filename: `${baseName}_CV.pdf`, content: cvBuffer },
        { filename: `${baseName}_Letter.pdf`, content: letterBuffer },
      ],
      userRecord.email
    );

    // Record application
    await db.insert(applications).values({
      userId: req.userId!,
      companyId: company_id,
      emailSubject: email_subject,
      emailBody: email_body,
      status: "sent",
    });

    res.json({ success: true });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Send application error:", error);
    res.status(500).json({ error: "Internal server error", detail: error?.message || String(err) });
  }
});

// GET /applications
router.get("/", verifyJwt, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const apps = await db
      .select({
        id: applications.id,
        companyName: companies.name,
        roleApplied: user.roleApplied,
        status: applications.status,
        sentAt: applications.sentAt,
        createdAt: applications.sentAt, // Alias for frontend compatibility
        emailSubject: applications.emailSubject,
        emailBody: applications.emailBody
      })
      .from(applications)
      .innerJoin(companies, eq(applications.companyId, companies.id))
      .innerJoin(user, eq(applications.userId, user.id))
      .where(eq(applications.userId, req.userId!))
      .orderBy(sql`${applications.sentAt} DESC`);

    res.json(apps);
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

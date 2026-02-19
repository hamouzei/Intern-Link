import { Router, Response } from "express";
import { AuthRequest, verifyJwt } from "../middleware/auth";
import { db } from "../db";
import { users, companies, applications, documents } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";
import { generateInternshipEmail } from "../services/ai";
import { sendApplicationEmail } from "../services/email";

const router = Router();

// POST /applications/generate
router.post("/generate", verifyJwt, async (req: AuthRequest, res: Response) => {
  const { company_id } = req.body;
  if (!company_id) { res.status(400).json({ error: "Missing company_id" }); return; }

  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.userId!)).limit(1);
    const [company] = await db.select().from(companies).where(eq(companies.id, company_id)).limit(1);

    if (!user || !company) { res.status(404).json({ error: "User or Company not found" }); return; }

    // Required fields check
    if (!user.university || !user.roleApplied || !user.bio) {
      res.status(400).json({ error: "Profile incomplete. Please complete your profile first." });
      return;
    }

    const emailContent = await generateInternshipEmail(
      user.fullName,
      user.university,
      user.roleApplied,
      user.bio,
      company.name
    );

    res.json(emailContent);
  } catch (err) {
    console.error("Generate email error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /applications/send
router.post("/send", verifyJwt, async (req: AuthRequest, res: Response) => {
  const { company_id, email_subject, email_body } = req.body;

  try {
    // Rate limiting check: max 5 apps per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(applications)
      .where(and(
        eq(applications.userId, req.userId!),
        sql`${applications.sentAt} >= ${today.toISOString()}`
      ));

    if (Number(countResult.count) >= 5) {
      res.status(429).json({ error: "Daily application limit reached (5/day)." });
      return;
    }

    const [user] = await db.select().from(users).where(eq(users.id, req.userId!)).limit(1);
    const [doc] = await db.select().from(documents).where(eq(documents.userId, req.userId!)).limit(1);
    const [company] = await db.select().from(companies).where(eq(companies.id, company_id)).limit(1);

    if (!user || !company || !doc || !doc.cvUrl || !doc.supportLetterUrl) {
      res.status(400).json({ error: "Missing proflie or documents." });
      return;
    }

    // Send email
    await sendApplicationEmail(
      company.email,
      email_subject,
      email_body,
      [
        { filename: `${user.fullName.replace(/\s+/g, '_')}_CV.pdf`, path: doc.cvUrl },
        { filename: `${user.fullName.replace(/\s+/g, '_')}_Letter.pdf`, path: doc.supportLetterUrl },
      ]
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
  } catch (err) {
    console.error("Send application error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /applications
router.get("/", verifyJwt, async (req: AuthRequest, res: Response) => {
  try {
    const apps = await db
      .select({
        id: applications.id,
        companyName: companies.name,
        roleApplied: users.roleApplied,
        status: applications.status,
        sentAt: applications.sentAt,
        emailSubject: applications.emailSubject,
        emailBody: applications.emailBody
      })
      .from(applications)
      .innerJoin(companies, eq(applications.companyId, companies.id))
      .innerJoin(users, eq(applications.userId, users.id))
      .where(eq(applications.userId, req.userId!))
      .orderBy(sql`${applications.sentAt} DESC`);

    res.json(apps);
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

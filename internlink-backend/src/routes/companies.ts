import { Router, Response } from "express";
import { z } from "zod";
import { AuthRequest, verifyJwt } from "../middleware/auth";
import { db } from "../db";
import { companies } from "../db/schema";
import { ilike, eq } from "drizzle-orm";

const router = Router();

const createCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required"),
  email: z.string().trim().email("Valid company email is required"),
  address: z.string().trim().optional(),
  telephone: z.string().trim().optional(),
  website: z.string().trim().url("Invalid website URL").optional().or(z.literal("")),
  acceptsInterns: z.boolean().default(true),
});

// GET /companies
router.get("/", verifyJwt, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, accepting } = req.query;

    let query = db.select().from(companies).$dynamic();

    if (search && typeof search === "string") {
      query = query.where(ilike(companies.name, `%${search.trim()}%`));
    }
    if (accepting === "true") {
      query = query.where(eq(companies.acceptsInterns, true));
    }

    const results = await query;
    res.json(results);
  } catch (err) {
    console.error("Get companies error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /companies (admin)
router.post("/", verifyJwt, async (req: AuthRequest, res: Response): Promise<void> => {
  const parseResult = createCompanySchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Validation error", details: parseResult.error.flatten().fieldErrors });
    return;
  }

  const { name, email, address, telephone, website, acceptsInterns } = parseResult.data;

  try {
    const [company] = await db
      .insert(companies)
      .values({
        name,
        email,
        address: address || null,
        telephone: telephone || null,
        website: website || null,
        acceptsInterns,
      })
      .returning();

    res.status(201).json(company);
  } catch (err) {
    console.error("Create company error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

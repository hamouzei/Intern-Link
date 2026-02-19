import { Router, Response } from "express";
import { AuthRequest, verifyJwt } from "../middleware/auth";
import { db } from "../db";
import { companies } from "../db/schema";
import { ilike, eq, and } from "drizzle-orm";

const router = Router();

// GET /companies
router.get("/", verifyJwt, async (req: AuthRequest, res: Response) => {
  try {
    const { search, accepting } = req.query;

    let query = db.select().from(companies).$dynamic();

    if (search && typeof search === "string") {
      query = query.where(ilike(companies.name, `%${search}%`));
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
router.post("/", verifyJwt, async (req: AuthRequest, res: Response) => {
  const { name, email, address, acceptsInterns } = req.body;
  try {
    const [company] = await db.insert(companies).values({ name, email, address, acceptsInterns }).returning();
    res.status(201).json(company);
  } catch (err) {
    console.error("Create company error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateInternshipEmail(
  studentName: string,
  university: string,
  role: string,
  bio: string,
  companyName: string,
  githubLink?: string | null,
  portfolioLink?: string | null
): Promise<{ subject: string; body: string }> {
  const optionalLinks = [
    githubLink ? `- GitHub: ${githubLink}` : null,
    portfolioLink ? `- Portfolio: ${portfolioLink}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `
        You are a professional career assistant helping a student write a cold email for an internship application.
        
        Student Details:
        - Name: ${studentName}
        - University: ${university}
        - Role Applying For: ${role}
        - Bio: ${bio}
        ${optionalLinks ? optionalLinks : ""}

        Target Company:
        - Name: ${companyName}

        Task:
        Generate a professional, persuasive, and concise email tailored to this company and role.
        ${optionalLinks ? "If a GitHub or portfolio link is provided, naturally mention it in the email body to support the application." : ""}
        
        Output Format (JSON only):
        {
            "subject": "Email Subject Line",
            "body": "Email Body Text (use \\n for newlines)"
        }
        
        Do not include any other text or markdown formatting. Just valid JSON.
        `;

  const maxRetries = 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up markdown code blocks if present
      const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (error: unknown) {
      lastError = error;
      const err = error as { status?: number; message?: string };
      console.warn(`Gemini attempt ${attempt} failed (${err.status || err.message}). Retrying...`);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  console.error("Gemini AI generation failed after retries:", lastError);
  // Fallback
    const linksText = [
      githubLink ? `GitHub: ${githubLink}` : null,
      portfolioLink ? `Portfolio: ${portfolioLink}` : null,
    ]
      .filter(Boolean)
      .join(" | ");
    return {
      subject: `Internship Application - ${role} - ${studentName}`,
      body: `Dear Hiring Manager at ${companyName},\n\nI am writing to express my interest in the ${role} internship position.\n\nI am a student at ${university} with a passion for software development. ${bio}${linksText ? `\n\nYou can find more about my work here: ${linksText}` : ""}\n\nPlease find my CV and supporting letter attached.\n\nBest regards,\n${studentName}`
    };
}

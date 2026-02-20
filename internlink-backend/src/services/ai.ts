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
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        Generate a professional, persuasive, and concise email.
        ${optionalLinks ? "If a GitHub or portfolio link is provided, naturally mention it in the email body to support the application." : ""}
        
        Output Format (JSON only):
        {
            "subject": "Email Subject Line",
            "body": "Email Body Text (use \\n for newlines)"
        }
        
        Do not include any other text or markdown formatting. Just the JSON.
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up markdown code blocks if present
    const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini AI generation failed:", error);
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
}

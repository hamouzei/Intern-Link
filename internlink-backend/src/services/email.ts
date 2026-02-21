import { Resend } from "resend";
import * as dotenv from "dotenv";
dotenv.config();

// Ensure RESEND_API_KEY is available in the environment
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendApplicationEmail(
  to: string,
  subject: string,
  body: string,
  attachments: { filename: string; content: Buffer }[]
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "InternLink <onboarding@resend.dev>", // Resend test domain
      to,
      subject,
      text: body,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(error.message);
    }

    console.log(`Email sent via Resend to ${to}, ID: ${data?.id}`);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}



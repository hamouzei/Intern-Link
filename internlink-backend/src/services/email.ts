import { Resend } from "resend";
import * as dotenv from "dotenv";
dotenv.config();

// Ensure RESEND_API_KEY is available in the environment
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendApplicationEmail(
  to: string,
  subject: string,
  body: string,
  attachments: { filename: string; content: Buffer }[],
  replyTo?: string
) {
  try {
    const fromAddress = process.env.EMAIL_FROM || "InternLink <onboarding@resend.dev>";
    const isSandbox = fromAddress.includes("onboarding@resend.dev");
    const devFallback = process.env.DEV_FALLBACK_EMAIL || "hammada3971@gmail.com";

    // If running in Resend free test sandbox mode, direct immediately to the verified inbox
    // to avoid wasting 5+ seconds on guaranteed 403 network failures.
    if (isSandbox && to !== devFallback) {
      console.log(`[Resend Sandbox Mode] Delivering application for ${to} to verified inbox (${devFallback})...`);
      const { data, error } = await resend.emails.send({
        from: fromAddress,
        to: devFallback,
        subject: `[DEV TEST FOR: ${to}] ${subject}`,
        text: `[NOTE: Delivered to your verified developer email because Resend is in free testing sandbox mode. Target company was: ${to} | Applicant: ${replyTo || "N/A"}]\n\n${body}`,
        replyTo: replyTo,
        attachments: attachments.map(att => ({
          filename: att.filename,
          content: att.content,
        })),
      });

      if (error) {
        console.error("Resend sandbox error:", error);
        throw new Error(error.message);
      }

      console.log(`Email delivered to verified developer inbox (${devFallback}), ID: ${data?.id}`);
      return;
    }

    // Production dispatch or direct send to verified email
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      text: body,
      replyTo: replyTo,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    });

    if (error) {
      // Fallback in case sandbox restriction is encountered unexpectedly
      if (error.message.includes("You can only send testing emails to your own email address")) {
        console.warn(`Resend sandbox restriction detected for ${to}. Rerouting to ${devFallback}...`);
        const fallbackRes = await resend.emails.send({
          from: fromAddress,
          to: devFallback,
          subject: `[DEV TEST FOR: ${to}] ${subject}`,
          text: `[NOTE: Sent to verified developer email due to sandbox restriction. Target company: ${to}]\n\n${body}`,
          replyTo: replyTo,
          attachments: attachments.map(att => ({
            filename: att.filename,
            content: att.content,
          })),
        });

        if (fallbackRes.error) throw new Error(fallbackRes.error.message);
        console.log(`Email delivered via fallback to ${devFallback}, ID: ${fallbackRes.data?.id}`);
        return;
      }

      console.error("Resend API error:", error);
      throw new Error(error.message);
    }

    console.log(`Email sent via Resend to ${to}, ID: ${data?.id}`);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}

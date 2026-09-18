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
      // If Resend test domain restriction is hit, deliver to developer/verified email
      if (error.message.includes("You can only send testing emails to your own email address")) {
        console.warn(`Resend test domain restriction: cannot send to ${to}. Routing to verified test address...`);
        const fallbackTarget = replyTo || "hammada3971@gmail.com";
        const fallbackRes = await resend.emails.send({
          from: "InternLink <onboarding@resend.dev>",
          to: fallbackTarget,
          subject: `[DEV TEST FOR: ${to}] ${subject}`,
          text: `[NOTE: Sent to your email because Resend is in free testing sandbox mode. Target company was: ${to}]\n\n${body}`,
          replyTo: replyTo,
          attachments: attachments.map(att => ({
            filename: att.filename,
            content: att.content,
          })),
        });

        if (fallbackRes.error) {
          // If replyTo is not verified by Resend account, deliver directly to Resend account owner
          const ownerRes = await resend.emails.send({
            from: "InternLink <onboarding@resend.dev>",
            to: "hammada3971@gmail.com",
            subject: `[DEV TEST FOR: ${to}] ${subject}`,
            text: `[NOTE: Sent to Resend account owner because of sandbox mode. Target company: ${to} | Applicant: ${replyTo}]\n\n${body}`,
            replyTo: replyTo,
            attachments: attachments.map(att => ({
              filename: att.filename,
              content: att.content,
            })),
          });
          if (ownerRes.error) throw new Error(ownerRes.error.message);
          console.log(`Email delivered to Resend verified owner (hammada3971@gmail.com), ID: ${ownerRes.data?.id}`);
          return;
        }

        console.log(`Email delivered to user test address (${fallbackTarget}), ID: ${fallbackRes.data?.id}`);
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



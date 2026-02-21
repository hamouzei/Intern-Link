import nodemailer from "nodemailer";
import dns from "dns";
import * as dotenv from "dotenv";
dotenv.config();

// Force IPv4 for DNS resolution. 
// Railway's IPv6 outbound routing can sometimes fail with ENETUNREACH when connecting to Gmail's SMTP.
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendApplicationEmail(
  to: string,
  subject: string,
  body: string,
  attachments: { filename: string; content: Buffer }[]
) {
  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text: body,
      attachments,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
}



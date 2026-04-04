import nodemailer from "nodemailer";

// Get email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "keon202508@gmail.com";

// Create transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter && SMTP_HOST && SMTP_USER && SMTP_PASSWORD) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

/**
 * Send contact form email to admin
 */
export async function sendContactFormEmail(data: ContactMessage): Promise<boolean> {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn("Email transporter not configured. Skipping email send.");
      return false;
    }

    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject || "No subject"}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
      <hr>
      <p><small>This is an automated message from the Kapiri Mposhi Baraka Learning Center website.</small></p>
    `;

    await transporter.sendMail({
      from: SMTP_USER,
      to: ADMIN_EMAIL,
      subject: `New Contact Form: ${data.subject || data.name}`,
      html: emailContent,
      replyTo: data.email,
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Send confirmation email to user
 */
export async function sendConfirmationEmail(userEmail: string, userName: string): Promise<boolean> {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn("Email transporter not configured. Skipping confirmation email.");
      return false;
    }

    const emailContent = `
      <h2>Thank You for Contacting Us!</h2>
      <p>Dear ${userName},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>Our team at Kapiri Mposhi Baraka Learning Center is committed to responding to all inquiries within 24-48 hours.</p>
      <hr>
      <p>Best regards,<br>Kapiri Mposhi Baraka Learning Center</p>
    `;

    await transporter.sendMail({
      from: SMTP_USER,
      to: userEmail,
      subject: "We received your message - Kapiri Mposhi Baraka Learning Center",
      html: emailContent,
    });

    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
}

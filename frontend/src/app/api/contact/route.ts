import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
const smtpSecure = process.env.SMTP_SECURE === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFrom = process.env.SMTP_FROM || smtpUser || "no-reply@mthunzitrust.org";
const contactEmail = process.env.CONTACT_EMAIL || "info@mthunzitrust.org";

const hasSmtpConfig = Boolean(smtpHost && smtpUser && smtpPassword);
const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPassword },
    })
  : nodemailer.createTransport({ jsonTransport: true });

const inquiryLabels = {
  general: "General Inquiry",
  partnership: "Partnership",
  donation: "Donation",
  volunteer: "Volunteer",
  support: "Support",
};

type InquiryTypeKey = keyof typeof inquiryLabels;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, inquiryType, message } = body;
    const inquiryTypeKey =
      typeof inquiryType === "string" && inquiryType in inquiryLabels
        ? (inquiryType as InquiryTypeKey)
        : "general";
    const inquiryLabel = inquiryLabels[inquiryTypeKey];
    const submissionSubject = subject?.trim() || inquiryLabel;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!hasSmtpConfig && process.env.NODE_ENV === "production") {
      console.error("SMTP configuration is missing in production.");
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    if (!hasSmtpConfig) {
      console.warn("SMTP config missing, using JSON transport for local development only.");
    }

    const submittedAt = new Date().toLocaleString();
    const referenceId = `MT-${Date.now()}`;
    const messagePreview = message && message.length > 300 ? message.slice(0, 297) + '...' : message;

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <h2 style="margin-bottom: 12px; color: #0f5132;">New Contact Form Submission</h2>
        <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px;"><strong>Ref:</strong> ${referenceId} &nbsp;•&nbsp; <strong>Date:</strong> ${submittedAt}</p>
        <p style="margin: 0 0 14px;">A new message was received from the website contact form.</p>
        <div style="padding: 18px; background: #f8fdf9; border: 1px solid #d1e7dd; border-radius: 14px;">
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email}</p>
          ${phone ? `<p style="margin: 0 0 8px;"><strong>Phone:</strong> ${phone}</p>` : ""}
          <p style="margin: 0 0 8px;"><strong>Inquiry Type:</strong> ${inquiryLabel}</p>
          <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${submissionSubject}</p>
          <div style="margin-top: 12px; padding: 12px; background: #fff; border-radius: 10px; border: 1px solid #e9ecef; white-space: pre-wrap; max-height: 240px; overflow: auto;"><strong>Message preview:</strong>
            <div style="margin-top:8px; color:#333">${messagePreview}</div>
          </div>
          <div style="margin-top: 12px; padding: 14px; background: #fff; border-radius: 12px; border: 1px solid #e9ecef; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    `;

    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #eef2f5; border-radius: 12px;">
          <h2 style="margin-bottom: 12px; color: #0b3d2e; font-size: 20px;">Acknowledgement of Receipt</h2>
          <p style="margin: 0 0 8px; color: #6c757d; font-size: 13px;"><strong>Ref:</strong> ${referenceId} &nbsp;•&nbsp; <strong>Date:</strong> ${submittedAt}</p>
          <p style="margin: 0 0 16px; color: #333;">Dear ${name},</p>
          <p style="margin: 0 0 16px; color: #333;">Thank you for contacting Mthunzi Trust. We hereby acknowledge receipt of your message and appreciate you taking the time to reach out to us.</p>
          <div style="background: #f7faf8; border-left: 4px solid #2e8b57; padding: 14px; border-radius: 10px; margin-bottom: 18px;">
            <p style="margin: 0 0 6px; color: #0b3d2e;"><strong>Summary of your submission</strong></p>
            <p style="margin: 6px 0 0; color: #333;"><strong>Type:</strong> ${inquiryLabel}</p>
            <p style="margin: 6px 0 0; color: #333;"><strong>Subject:</strong> ${submissionSubject}</p>
            <p style="margin: 8px 0 0; color: #333;"><strong>Message preview:</strong> ${messagePreview ? messagePreview.replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''}</p>
          </div>
          <p style="margin: 0 0 16px; color: #333;">A member of our team will review your message and respond within 3–5 business days. If your request is urgent, please reply to this email or contact us at <a href="mailto:${contactEmail}" style="color:#0b6b46">${contactEmail}</a>.</p>
          <p style="margin: 0 0 8px; color: #333;">A member of our team will....</p>
          <p style="margin: 0 0 8px; color: #333;">Regards,</p>
          <p style="margin: 0 0 2px; color: #333;"><strong>Mthunzi Trust Team</strong></p>
            <p style="margin: 0; color: #6c757d; font-size: 13px;">Please note: this is an automated message. Replies to this email may not be monitored. If you require further assistance, please reply to this email or contact us at <a href="mailto:${contactEmail}" style="color:#0b6b46">${contactEmail}</a>. Please do not redact or remove the reference information above when replying.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: smtpFrom,
      to: contactEmail,
      subject: `New Contact Form: ${submissionSubject}`,
      html: adminHtml,
      text: `Ref: ${referenceId}
    Date: ${submittedAt}

    ${name} (${email}) submitted a new contact request.

    Type: ${inquiryLabel}
    Subject: ${submissionSubject}

    Message preview:
    ${messagePreview}

    Full message:
    ${message}
    ${phone ? `\nPhone: ${phone}` : ""}`,
      replyTo: email,
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: email,
      subject: "Acknowledgement of receipt — Mthunzi Trust",
      html: confirmationHtml,
      text: `Ref: ${referenceId}
    Date: ${submittedAt}

    Dear ${name},

    Thank you for contacting Mthunzi Trust. We acknowledge receipt of your message and will review it promptly.

    Summary:
    Type: ${inquiryLabel}
    Subject: ${submissionSubject}

    Message preview:
    ${messagePreview}

    A member of our team will respond within 3–5 business days. If your matter is urgent, please reply to this email or contact us at ${contactEmail}.

    A member of our team will....

    Regards,
    Mthunzi Trust Team
    ${contactEmail}`,
    });

    return NextResponse.json(
      {
        message: "Message received successfully. We will get back to you soon.",
        success: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}

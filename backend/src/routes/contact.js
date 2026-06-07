import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

// Sanitize user input to prevent XSS in HTML emails
const escapeHtml = (str) => String(str || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#x27;');

// Configure email service
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const mailFrom = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@mthunzitrust.org';
const contactEmail = process.env.CONTACT_EMAIL || 'info@mthunzitrust.org';
const inquiryLabels = {
  general: 'General Inquiry',
  partnership: 'Partnership',
  donation: 'Donation',
  volunteer: 'Volunteer',
  support: 'Support',
};

/**
 * POST - Submit Contact Form
 */
router.post('/', async (req, res) => {
  try {
    const body = req.body;
    const inquiryType = inquiryLabels[body.inquiryType] || 'General Inquiry';
    const submissionSubject = escapeHtml(body.subject?.trim() || inquiryType);
    const safeName = escapeHtml(body.name);
    const safeEmail = escapeHtml(body.email);
    const safePhone = escapeHtml(body.phone || '');
    const safeMessage = escapeHtml(body.message).replace(/\n/g, '<br>');

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const messageHtml = `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <div style="margin-bottom: 28px;">
          <h2 style="margin: 0 0 12px; color: #0f5132;">New Contact Form Submission</h2>
          <p style="margin: 0; font-size: 14px; color: #333333;">A new contact request has been submitted through the website.</p>
        </div>
        <div style="background: #f8fdf9; border: 1px solid #d1e7dd; border-radius: 12px; padding: 18px;">
          <p style="margin: 0 0 10px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin: 0 0 10px;"><strong>Email:</strong> ${safeEmail}</p>
          ${safePhone ? `<p style="margin: 0 0 10px;"><strong>Phone:</strong> ${safePhone}</p>` : ''}
          <p style="margin: 0 0 10px;"><strong>Inquiry Type:</strong> ${inquiryType}</p>
          <p style="margin: 0 0 10px;"><strong>Subject:</strong> ${submissionSubject}</p>
          <p style="margin: 0 0 8px;"><strong>Message:</strong></p>
          <div style="padding: 14px; background: #ffffff; border-radius: 10px; border: 1px solid #e9ecef; white-space: pre-wrap;">${safeMessage}</div>
        </div>
      </div>
    `;

    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e8f5e9; border-radius: 14px;">
          <h1 style="margin-bottom: 8px; color: #0f5132; font-size: 24px;">Thank you for contacting Mthunzi Trust</h1>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">Hi ${safeName},</p>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">We have received your message and our team will review it shortly. We aim to respond as soon as possible.</p>
          <div style="background: #f1f8f4; border-left: 4px solid #35a56c; padding: 16px; border-radius: 10px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #0f5132;"><strong>Your Inquiry</strong></p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #333333;"><strong>Type:</strong> ${inquiryType}</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #333333;"><strong>Subject:</strong> ${submissionSubject}</p>
          </div>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">If you need to update your message, reply to this email and we will take it from there.</p>
          <p style="margin: 0; font-size: 15px; color: #333333;">Warm regards,<br />Mthunzi Trust Team</p>
          <p style="margin-top: 20px; font-size: 13px; color: #6c757d;">This is an automated confirmation. Please do not reply to this email unless you need to update your request.</p>
        </div>
      </div>
    `;

    // Send email notification
    try {
      await transporter.sendMail({
        from: mailFrom,
        to: contactEmail,
        subject: `New Contact Form: ${submissionSubject}`,
        html: messageHtml,
        text: `${safeName} (${safeEmail}) sent a new contact request:\n\nInquiry Type: ${inquiryType}\nSubject: ${submissionSubject}\nMessage:\n${body.message}${body.phone ? `\nPhone: ${body.phone}` : ''}`,
        replyTo: body.email,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      await transporter.sendMail({
        from: mailFrom,
        to: body.email,
        subject: 'We received your message - Mthunzi Trust',
        html: confirmationHtml,
        text: `Hi ${body.name},\n\nThank you for contacting Mthunzi Trust. We have received your message and will get back to you soon.\n\nInquiry Type: ${inquiryType}\nSubject: ${submissionSubject}\n\nBest regards,\nMthunzi Trust Team`,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully. We will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process contact form',
    });
  }
});

export default router;

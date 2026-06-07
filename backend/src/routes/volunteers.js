import { Router } from 'express';
import nodemailer from 'nodemailer';
import prisma from '../lib/prisma.js';

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

/**
 * POST - Submit Volunteer Application
 */
router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, gender, location, qualification, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !gender || !location || !qualification) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Please fill out all required details.',
      });
    }

    // Sanitized values for HTML email templates
    const sf = escapeHtml(fullName);
    const se = escapeHtml(email);
    const sp = escapeHtml(phone);
    const sg = escapeHtml(gender);
    const sl = escapeHtml(location);
    const sq = escapeHtml(qualification);
    const sm = escapeHtml(message || '');

    // Save to Database
    const volunteer = await prisma.volunteer.create({
      data: {
        fullName,
        email,
        phone,
        gender,
        location,
        qualification,
        message: message || '',
      },
    });

    const messageHtml = `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <div style="margin-bottom: 28px;">
          <h2 style="margin: 0 0 12px; color: #0056b3;">New Volunteer Application</h2>
          <p style="margin: 0; font-size: 14px; color: #333333;">A new volunteer application has been submitted through the website.</p>
        </div>
        <div style="background: #f0f7ff; border: 1px solid #cfe2ff; border-radius: 12px; padding: 18px;">
          <p style="margin: 0 0 10px;"><strong>Full Name:</strong> ${sf}</p>
          <p style="margin: 0 0 10px;"><strong>Email:</strong> ${se}</p>
          <p style="margin: 0 0 10px;"><strong>Phone Number:</strong> ${sp}</p>
          <p style="margin: 0 0 10px;"><strong>Gender:</strong> ${sg}</p>
          <p style="margin: 0 0 10px;"><strong>Location:</strong> ${sl}</p>
          <p style="margin: 0 0 10px;"><strong>Qualification:</strong> ${sq}</p>
          ${message ? `<p style="margin: 0 0 8px;"><strong>Message / Motivation:</strong></p>
          <div style="padding: 14px; background: #ffffff; border-radius: 10px; border: 1px solid #e9ecef; white-space: pre-wrap;">${sm.replace(/\n/g, '<br>')}</div>` : ''}
        </div>
      </div>
    `;

    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e3f2fd; border-radius: 14px;">
          <h1 style="margin-bottom: 8px; color: #0056b3; font-size: 24px;">Volunteer Application Received</h1>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">Hi ${sf},</p>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">Thank you for your interest in volunteering with Mthunzi Trust. We have received your application and will review your qualifications and details.</p>
          <div style="background: #f1f8ff; border-left: 4px solid #0056b3; padding: 16px; border-radius: 10px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 14px; color: #0056b3;"><strong>Your Application Details</strong></p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #333333;"><strong>Full Name:</strong> ${sf}</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #333333;"><strong>Location:</strong> ${sl}</p>
            <p style="margin: 4px 0 0; font-size: 14px; color: #333333;"><strong>Qualification:</strong> ${sq}</p>
          </div>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">Our coordinator will contact you if your profile matches our active project needs.</p>
          <p style="margin: 0; font-size: 15px; color: #333333;">Warm regards,<br />Mthunzi Trust Team</p>
        </div>
      </div>
    `;

    // Send email notification to trust admin
    try {
      await transporter.sendMail({
        from: mailFrom,
        to: contactEmail,
        subject: `New Volunteer: ${fullName} (${location})`,
        html: messageHtml,
        text: `New volunteer application from ${fullName} (${email})\nPhone: ${phone}\nLocation: ${location}\nQualification: ${qualification}\n\nMessage:\n${message || ''}`,
        replyTo: email,
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    // Send confirmation email to applicant
    try {
      await transporter.sendMail({
        from: mailFrom,
        to: email,
        subject: 'Thank you for applying to volunteer - Mthunzi Trust',
        html: confirmationHtml,
        text: `Hi ${fullName},\n\nThank you for applying to volunteer with Mthunzi Trust. We have received your application and will review it shortly.\n\nBest regards,\nMthunzi Trust Team`,
      });
    } catch (emailError) {
      console.error('Confirmation email error:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: 'Your volunteer application has been submitted successfully!',
      data: volunteer,
    });
  } catch (error) {
    console.error('Volunteer application error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process volunteer application',
    });
  }
});

export default router;

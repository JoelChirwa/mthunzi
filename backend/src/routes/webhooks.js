import { Router } from 'express';
import nodemailer from 'nodemailer';
import prisma from '../lib/prisma.js';
import crypto from 'crypto';

const router = Router();

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
const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL || 'info@mthunzitrust.org';

async function sendEmail({ to, subject, html, replyTo }) {
  try {
    await transporter.sendMail({
      from: mailFrom,
      to,
      subject,
      html,
      replyTo,
    });
  } catch (emailError) {
    console.error('Webhook email send error:', emailError);
  }
}

function buildDonationDetailsHtml(data) {
  return `
    <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 10px; padding: 18px; margin: 15px 0;">
      <p style="margin: 0 0 10px; font-size: 14px; color: #495057;"><strong>Transaction Reference:</strong> ${data.tx_ref || data.txRef || 'N/A'}</p>
      <p style="margin: 0 0 10px; font-size: 14px; color: #495057;"><strong>Status:</strong> <span style="font-weight: bold; color: ${data.status === 'completed' || data.status === 'Completed' || data.status === 'COMPLETED' ? '#28a745' : '#dc3545'};">${data.status || 'N/A'}</span></p>
      <p style="margin: 0 0 10px; font-size: 14px; color: #495057;"><strong>Amount:</strong> <span style="font-size: 16px; font-weight: bold; color: #0056b3;">${data.currency || 'MWK'} ${data.amount || 'N/A'}</span></p>
      <p style="margin: 0 0 10px; font-size: 14px; color: #495057;"><strong>Email:</strong> ${data.email || 'N/A'}</p>
      <p style="margin: 0 0 10px; font-size: 14px; color: #495057;"><strong>Payment Type:</strong> ${data.payment_type || data.type || 'N/A'}</p>
      <p style="margin: 0; font-size: 14px; color: #495057;"><strong>Transaction ID:</strong> ${data.transaction_id || data.id || 'N/A'}</p>
    </div>
  `;
}

async function sendDonationReceiptEmail(data) {
  if (!data.email) return;

  await sendEmail({
    to: data.email,
    subject: 'Thank you for your donation to Mthunzi Trust',
    html: `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e3f2fd; border-radius: 14px;">
          <h1 style="margin-bottom: 8px; color: #28a745; font-size: 24px;">Donation Received successfully!</h1>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">Dear donor,</p>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">Thank you for your generous support. Your contribution goes a long way in assisting our ongoing development efforts in Malawi.</p>
          ${buildDonationDetailsHtml(data)}
          <p style="margin: 16px 0 0; font-size: 15px; color: #333333;">We appreciate your support and contribution to our mission.</p>
          <p style="margin: 20px 0 0; font-size: 15px; color: #333333;">Warm regards,<br />Mthunzi Trust Team</p>
        </div>
      </div>
    `,
  });
}

async function sendDonationFailureEmail(data) {
  if (!data.email) return;

  await sendEmail({
    to: data.email,
    subject: 'Donation Payment Failed',
    html: `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #f8d7da; border-radius: 14px;">
          <h1 style="margin-bottom: 8px; color: #dc3545; font-size: 24px;">Donation Payment Failed</h1>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">Dear donor,</p>
          <p style="margin: 0 0 16px; font-size: 15px; color: #333333;">We were unable to complete your payment process. Please review your credentials or try again. Contact support if you need immediate assistance.</p>
          ${buildDonationDetailsHtml(data)}
          <p style="margin: 16px 0 0; font-size: 15px; color: #333333;">If you need help, reply directly to this message.</p>
          <p style="margin: 20px 0 0; font-size: 15px; color: #333333;">Sincerely,<br />Mthunzi Trust Team</p>
        </div>
      </div>
    `,
  });
}

async function notifyAdmin(data, status) {
  const color = status === 'Completed' ? '#28a745' : status === 'Expired' ? '#ffc107' : '#dc3545';
  await sendEmail({
    to: adminEmail,
    subject: `Donation ${status} - Mthunzi Trust`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111111; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #cfe2ff; border-radius: 14px;">
          <h2 style="margin: 0 0 12px; color: ${color};">Donation ${status} Notification</h2>
          <p style="margin: 0; font-size: 14px; color: #333333;">The following payment event was received from PayChangu:</p>
          ${buildDonationDetailsHtml(data)}
          <p style="margin: 20px 0 0; font-size: 13px; color: #6c757d;">This is an automated administrative notification. Please log into the administration panel to view complete logs.</p>
        </div>
      </div>
    `,
  });
}

/**
 * POST - Handle Paychangu Webhooks
 */
router.post('/paychangu', async (req, res) => {
  try {
    const signature = req.headers['paychangu-signature'] || req.headers['x-paychangu-signature'];
    const secret = process.env.PAYCHANGU_WEBHOOK_SECRET;

    // Verify webhook signature if a secret is configured in the environment
    if (secret) {
      if (!signature) {
        console.warn('Missing PayChangu webhook signature header');
        return res.status(401).json({ success: false, message: 'Missing signature header' });
      }

      const hash = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash !== signature) {
        console.warn('Invalid PayChangu webhook signature');
        return res.status(401).json({ success: false, message: 'Invalid signature' });
      }
    } else {
      console.warn('PAYCHANGU_WEBHOOK_SECRET is not set. Webhook signature verification is skipped.');
    }

    const body = req.body;
    const payload = body.data?.data || body.data || body;

    console.log('Received Paychangu webhook:', {
      event: body.event,
      transactionRef: payload.tx_ref || payload.txRef || payload.transaction_id,
      status: payload.status,
    });

    // Handle different webhook events
    switch (body.event) {
      case 'charge.completed':
        await handleChargeCompleted(body.data);
        break;

      case 'charge.failed':
        await handleChargeFailed(body.data);
        break;

      case 'charge.expired':
        await handleChargeExpired(body.data);
        break;

      default:
        console.log(`Unhandled webhook event: ${body.event}`);
    }

    // Respond with 200 to acknowledge receipt
    return res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
});

/**
 * Handle successful payment
 */
async function handleChargeCompleted(data) {
  const payload = data.data || data;
  const reference = payload.tx_ref || payload.txRef || payload.transaction_id;
  try {
    console.log(`Processing completed charge: ${reference}`);

    const updateResult = await prisma.donation.updateMany({
      where: { paymentRef: reference },
      data: {
        status: 'COMPLETED',
        updatedAt: new Date(),
      },
    });

    if (updateResult.count === 0) {
      console.warn(`No matching donation record found for reference ${reference}`);
    }

    await Promise.all([
      sendDonationReceiptEmail(payload),
      notifyAdmin(payload, 'Completed'),
    ]);

    console.log('Charge completed processed successfully');
  } catch (error) {
    console.error('Error handling charge completed:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handleChargeFailed(data) {
  const payload = data.data || data;
  const reference = payload.tx_ref || payload.txRef || payload.transaction_id;
  try {
    console.log(`Processing failed charge: ${reference}`);

    const updateResult = await prisma.donation.updateMany({
      where: { paymentRef: reference },
      data: {
        status: 'FAILED',
        updatedAt: new Date(),
      },
    });

    if (updateResult.count === 0) {
      console.warn(`No matching donation record found for reference ${reference}`);
    }

    await Promise.all([
      sendDonationFailureEmail(payload),
      notifyAdmin(payload, 'Failed'),
    ]);

    console.log('Charge failed processed successfully');
  } catch (error) {
    console.error('Error handling charge failed:', error);
    throw error;
  }
}

/**
 * Handle expired payment
 */
async function handleChargeExpired(data) {
  const payload = data.data || data;
  const reference = payload.tx_ref || payload.txRef || payload.transaction_id;
  try {
    console.log(`Processing expired charge: ${reference}`);

    const updateResult = await prisma.donation.updateMany({
      where: { paymentRef: reference },
      data: {
        status: 'EXPIRED',
        updatedAt: new Date(),
      },
    });

    if (updateResult.count === 0) {
      console.warn(`No matching donation record found for reference ${reference}`);
    }

    await notifyAdmin(payload, 'Expired');

    console.log('Charge expired processed successfully');
  } catch (error) {
    console.error('Error handling charge expired:', error);
    throw error;
  }
}

export default router;

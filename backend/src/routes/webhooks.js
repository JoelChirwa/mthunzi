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
    <h2>Donation Details</h2>
    <p><strong>Transaction Reference:</strong> ${data.tx_ref || data.txRef || 'N/A'}</p>
    <p><strong>Status:</strong> ${data.status || 'N/A'}</p>
    <p><strong>Amount:</strong> ${data.currency || ''} ${data.amount || 'N/A'}</p>
    <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
    <p><strong>Payment Type:</strong> ${data.payment_type || data.type || 'N/A'}</p>
    <p><strong>Transaction ID:</strong> ${data.transaction_id || data.id || 'N/A'}</p>
  `;
}

async function sendDonationReceiptEmail(data) {
  if (!data.email) return;

  await sendEmail({
    to: data.email,
    subject: 'Thank you for your donation to Mthunzi Trust',
    html: `
      <h1>Donation Received</h1>
      <p>Dear donor,</p>
      <p>Thank you for your support. Your donation has been received successfully.</p>
      ${buildDonationDetailsHtml(data)}
      <p>We appreciate your contribution to our mission.</p>
    `,
  });
}

async function sendDonationFailureEmail(data) {
  if (!data.email) return;

  await sendEmail({
    to: data.email,
    subject: 'Donation Payment Failed',
    html: `
      <h1>Donation Payment Failed</h1>
      <p>Dear donor,</p>
      <p>We were unable to complete your payment. Please try again or contact support if you need assistance.</p>
      ${buildDonationDetailsHtml(data)}
      <p>If you need help, reply to this message or contact us through the website.</p>
    `,
  });
}

async function notifyAdmin(data, status) {
  await sendEmail({
    to: adminEmail,
    subject: `Donation ${status} - Mthunzi Trust`,
    html: `
      <h1>Donation ${status}</h1>
      <p>The following donation event was recorded by PayChangu:</p>
      ${buildDonationDetailsHtml(data)}
      <p>Check the admin dashboard for more details.</p>
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

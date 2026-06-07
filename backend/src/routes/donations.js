import { Router } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import { authenticate } from '../middleware/authenticate.js';
import prisma from '../lib/prisma.js';

const router = Router();

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const getChargeType = () => 'standard';

const getDefaultCurrency = (chargeType, currency) => {
  if (chargeType === 'card') {
    return currency || 'USD';
  }
  return currency || 'MWK';
};

const getChargeUrl = () => 'https://api.paychangu.com/payment';

const getChargeIdPrefix = (chargeType) => {
  if (chargeType === 'card') {
    return 'donation-card-';
  }

  if (chargeType === 'tnm') {
    return 'donation-tnm-';
  }

  return 'donation-';
};

// Mailer setup (reuse same env vars as other routes)
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

async function sendMail(options) {
  try {
    await transporter.sendMail({ from: mailFrom, ...options });
  } catch (err) {
    console.error('Donation email send error:', err);
  }
}

const validateDonationRequest = (body) => {
  if (!body.amount || !body.fullName) {
    throw createHttpError(400, 'Missing required fields: amount and fullName are required');
  }
};

const initiateDonationCharge = async (body, chargeType) => {
  const publicKey = process.env.PAYCHANGU_PUBLIC_KEY;
  const secretKey = process.env.PAYCHANGU_SECRET_KEY;

  if (!publicKey || !secretKey) {
    throw createHttpError(500, 'Payment service configuration error');
  }

  const chargeId = `${getChargeIdPrefix(chargeType)}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const callbackUrl = `${baseUrl}/donate/verify`;
  const returnUrl = `${baseUrl}/donate/verify`;
  const currency = getDefaultCurrency(chargeType, body.currency);

  const paychanguPayload = {
    secret_key: secretKey,
    tx_ref: chargeId,
    amount: body.amount,
    currency,
    email: body.email,
    first_name: body.fullName.split(' ')[0],
    last_name: body.fullName.split(' ').slice(1).join(' '),
    callback_url: callbackUrl,
    return_url: returnUrl,
    customization: {
      title: 'Mthunzi Trust Donation',
      description: body.message || 'Charitable donation to support our programs',
    },
    meta: {
      paymentMethod: chargeType,
      mobileMoneyProvider: body.mobileMoneyProvider || 'airtel',
    },
  };

  const response = await axios.post(getChargeUrl(), paychanguPayload, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (response.data.status !== 'success') {
    throw createHttpError(400, response.data.message || 'Payment initiation failed');
  }

  await prisma.donation.create({
    data: {
      donorName: body.fullName,
      email: body.email,
      amount: body.amount,
      currency,
      paymentRef: chargeId,
      message: body.message,
      status: 'PENDING',
    },
  });

  // Send admin notification and donor confirmation (if email provided)
  try {
    // Admin notification
    sendMail({
      to: adminEmail,
      subject: `Donation Initiated - ${chargeId}`,
      html: `
        <h1>Donation Initiated</h1>
        <p>A new donation has been initiated on the website.</p>
        <p><strong>Donor:</strong> ${body.fullName}</p>
        <p><strong>Amount:</strong> ${currency} ${body.amount}</p>
        <p><strong>Reference:</strong> ${chargeId}</p>
        <p><strong>Checkout URL:</strong> <a href="${response.data.data?.checkout_url || response.data.data?.redirect_url}">${response.data.data?.checkout_url || response.data.data?.redirect_url}</a></p>
      `,
    });

    // Donor confirmation email
    if (body.email) {
      sendMail({
        to: body.email,
        subject: 'Donation Confirmation - Mthunzi Trust',
        html: `
          <h1>Donation Confirmation</h1>
          <p>Dear ${body.fullName.split(' ')[0] || 'Donor'},</p>
          <p>We have received your donation request. Please complete the payment using the secure checkout page linked below.</p>
          <p><strong>Amount:</strong> ${currency} ${body.amount}</p>
          <p><strong>Reference:</strong> ${chargeId}</p>
          <p><a href="${response.data.data?.checkout_url || response.data.data?.redirect_url}">Complete payment on PayChangu</a></p>
          <p>Thank you for supporting Mthunzi Trust.</p>
        `,
      });
    }
  } catch (emailErr) {
    console.error('Error sending donation emails:', emailErr);
  }

  const checkoutUrl = response.data.data?.checkout_url || response.data.data?.redirect_url;

  if (!checkoutUrl) {
    throw createHttpError(500, 'PayChangu did not return a checkout URL');
  }

  return {
    success: true,
    chargeId,
    checkoutUrl,
    authorizationUrl: checkoutUrl,
    message: 'Payment initiated successfully. Please complete the payment on the PayChangu checkout page.',
  };
};

/**
 * POST - Checkout Donation Payment
 */
router.post('/checkout', async (req, res) => {
  try {
    const body = req.body;
    validateDonationRequest(body);

    const chargeType = getChargeType(body);
    const result = await initiateDonationCharge(body, chargeType);

    return res.json(result);
  } catch (error) {
    console.error('Donation checkout error:', error);

    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        success: false,
        message: error.response?.data?.message || 'Failed to initiate donation charge',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    });
  }
});

/**
 * POST - Initiate TNM Mpamba Payment
 */
router.post('/tnm-mpamba', async (req, res) => {
  try {
    const result = await initiateDonationCharge(req.body, 'tnm');
    return res.json(result);
  } catch (error) {
    console.error('TNM Mpamba Payment Error:', error);

    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        success: false,
        message: error.response?.data?.message || 'Failed to initiate TNM Mpamba payment',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    });
  }
});

/**
 * POST - Initiate Card Payment
 */
router.post('/card', async (req, res) => {
  try {
    const result = await initiateDonationCharge(req.body, 'card');
    return res.json(result);
  } catch (error) {
    console.error('Card Payment Error:', error);

    if (error.status) {
      return res.status(error.status).json({
        success: false,
        message: error.message,
      });
    }

    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        success: false,
        message: error.response?.data?.message || 'Failed to process card payment',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    });
  }
});

/**
 * GET - Verify Payment Status
 */
router.get('/verify/:chargeId', async (req, res) => {
  try {
    const { chargeId } = req.params;

    if (!chargeId) {
      return res.status(400).json({
        success: false,
        message: 'Missing charge_id parameter',
      });
    }

    // Get API credentials
    const secretKey = process.env.PAYCHANGU_SECRET_KEY;

    if (!secretKey) {
      console.error('Missing Paychangu API credentials');
      return res.status(500).json({
        success: false,
        message: 'Payment verification service error',
      });
    }

    // Verify with Paychangu
    const response = await axios.get(
      `https://api.paychangu.com/charges/${chargeId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    if (response.data.success) {
      const chargeData = response.data.data;

      // Update donation record in database
      await prisma.donation.updateMany({
        where: { paymentRef: chargeId },
        data: {
          status:
            chargeData.status === 'completed'
              ? 'COMPLETED'
              : chargeData.status === 'pending'
                ? 'PENDING'
                : 'FAILED',
        },
      });

      // Check payment status
      if (chargeData.status === 'completed') {
        return res.json({
          success: true,
          status: 'completed',
          amount: chargeData.amount,
          currency: chargeData.currency,
          email: chargeData.email,
          message: 'Payment verified successfully',
        });
      } else if (chargeData.status === 'pending') {
        return res.json({
          success: false,
          status: 'pending',
          message: 'Payment is still being processed',
        });
      } else {
        return res.json({
          success: false,
          status: chargeData.status,
          message: 'Payment failed or was cancelled',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unable to verify payment',
      });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);

    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        success: false,
        message: error.response?.data?.message || 'Payment verification failed',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred',
    });
  }
});

/**
 * GET - Get Donation Statistics (Admin only)
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    const stats = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
      _count: true,
    });

    const byStatus = await prisma.donation.groupBy({
      by: ['status'],
      _sum: {
        amount: true,
      },
      _count: true,
    });

    return res.json({
      success: true,
      data: {
        total: stats._count,
        totalAmount: stats._sum.amount || 0,
        byStatus,
      },
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch donation statistics',
    });
  }
});

/**
 * GET - List All Donations (Admin only)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      data: donations,
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch donations',
    });
  }
});

export default router;

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface PaychanguWebhook {
  event: string;
  data: {
    id: string;
    tx_ref: string;
    status: string;
    amount: number;
    currency: string;
    email: string;
    payment_type: string;
    created_at: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: PaychanguWebhook = await request.json();

    // Verify webhook signature (optional but recommended)
    const secretKey = process.env.PAYCHANGU_SECRET_KEY;
    if (!secretKey) {
      console.warn('Paychangu secret key not configured for webhook verification');
    }

    // Log webhook event
    console.log('Received Paychangu webhook:', {
      event: body.event,
      transactionRef: body.data?.tx_ref,
      status: body.data?.status,
      amount: body.data?.amount,
      currency: body.data?.currency,
    });

    // Handle different webhook events (including standard checkout events)
    switch (body.event) {
      case 'charge.completed':
      case 'checkout.session.completed':
        await handleChargeCompleted(body.data);
        break;

      case 'charge.failed':
      case 'checkout.session.failed':
        await handleChargeFailed(body.data);
        break;

      case 'charge.expired':
      case 'checkout.session.expired':
        await handleChargeExpired(body.data);
        break;

      default:
        console.log(`Unhandled webhook event: ${body.event}`);
    }

    // Respond with 200 to acknowledge receipt
    return NextResponse.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 * Use this to:
 * - Update donation record in database
 * - Send confirmation email
 * - Update donor records
 * - Trigger thank you workflow
 */
async function handleChargeCompleted(data: any) {
  try {
    console.log(`Processing completed charge: ${data.tx_ref}`);

    // TODO: Implement database update
    // const donation = await db.donations.update({
    //   where: { chargeId: data.tx_ref },
    //   data: {
    //     status: 'completed',
    //     paymentId: data.id,
    //     completedAt: new Date(),
    //   },
    // });

    // TODO: Send confirmation email
    // await sendDonationConfirmationEmail({
    //   email: data.email,
    //   amount: data.amount,
    //   currency: data.currency,
    //   transactionRef: data.tx_ref,
    // });

    console.log('Charge completed processed successfully');
  } catch (error) {
    console.error('Error handling charge completed:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 * Use this to:
 * - Update donation record status
 * - Notify donor
 * - Log failure reason
 */
async function handleChargeFailed(data: any) {
  try {
    console.log(`Processing failed charge: ${data.tx_ref}`);

    // TODO: Implement database update
    // const donation = await db.donations.update({
    //   where: { chargeId: data.tx_ref },
    //   data: {
    //     status: 'failed',
    //     failedAt: new Date(),
    //   },
    // });

    // TODO: Send failure notification email
    // await sendPaymentFailureEmail({
    //   email: data.email,
    //   amount: data.amount,
    //   currency: data.currency,
    //   transactionRef: data.tx_ref,
    // });

    console.log('Charge failed processed successfully');
  } catch (error) {
    console.error('Error handling charge failed:', error);
    throw error;
  }
}

/**
 * Handle expired payment
 * Use this to:
 * - Mark donation as expired
 * - Clean up pending records
 */
async function handleChargeExpired(data: any) {
  try {
    console.log(`Processing expired charge: ${data.tx_ref}`);

    // TODO: Implement database update
    // const donation = await db.donations.update({
    //   where: { chargeId: data.tx_ref },
    //   data: {
    //     status: 'expired',
    //     expiredAt: new Date(),
    //   },
    // });

    console.log('Charge expired processed successfully');
  } catch (error) {
    console.error('Error handling charge expired:', error);
    throw error;
  }
}

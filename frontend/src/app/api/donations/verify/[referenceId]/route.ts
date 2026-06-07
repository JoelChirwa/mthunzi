import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ referenceId: string }> | { referenceId: string } }
) {
  try {
    const { referenceId } = await context.params;

    if (!referenceId) {
      return NextResponse.json(
        { message: 'Missing reference ID parameter' },
        { status: 400 }
      );
    }

    // Get API credentials from environment variables
    const secretKey = process.env.PAYCHANGU_SECRET_KEY;

    if (!secretKey) {
      console.error('Missing Paychangu API credentials');
      return NextResponse.json(
        { message: 'Payment verification service error' },
        { status: 500 }
      );
    }

    // Try to verify using transaction verification endpoint (for standard checkout)
    let response;
    try {
      response = await axios.get(
        `https://api.paychangu.com/transaction/verify/${referenceId}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
    } catch (error) {
      // If transaction verification fails, try charge verification (for legacy charges)
      console.log('Transaction verification failed, trying charge verification...');
      response = await axios.get(
        `https://api.paychangu.com/charges/${referenceId}/verify`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
    }

    if (response.data.success) {
      const chargeData = response.data.data;

      // Check if payment was successful
      if (chargeData.status === 'completed') {
        return NextResponse.json({
          success: true,
          status: 'completed',
          amount: chargeData.amount,
          currency: chargeData.currency,
          email: chargeData.email,
          message: 'Payment verified successfully',
        });
      } else if (chargeData.status === 'pending') {
        return NextResponse.json({
          success: false,
          status: 'pending',
          message: 'Payment is still being processed',
        });
      } else {
        return NextResponse.json({
          success: false,
          status: chargeData.status,
          message: 'Payment failed or was cancelled',
        });
      }
    } else {
      return NextResponse.json(
        { success: false, message: 'Unable to verify payment' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.response?.data?.message || 'Payment verification failed',
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

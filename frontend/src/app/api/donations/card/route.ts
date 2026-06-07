import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface CardPayloadRequest {
  amount: number;
  email: string;
  fullName: string;
  phone: string;
  message?: string;
  currency: string;
  paymentMethod: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CardPayloadRequest = await request.json();

    // Validate required fields
    if (!body.amount || !body.email || !body.fullName || !body.phone) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get API credentials from environment variables
    const publicKey = process.env.PAYCHANGU_PUBLIC_KEY;
    const secretKey = process.env.PAYCHANGU_SECRET_KEY;

    if (!publicKey || !secretKey) {
      console.error('Missing Paychangu API credentials');
      return NextResponse.json(
        { message: 'Payment service configuration error' },
        { status: 500 }
      );
    }

    // Generate unique charge ID
    const chargeId = `donation-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/donate/verify?charge_id=${chargeId}`;

    // Prepare the payload for Paychangu Card API
    const paychanguPayload = {
      public_key: publicKey,
      tx_ref: chargeId,
      amount: body.amount,
      currency: body.currency || 'USD',
      email: body.email,
      phone_number: body.phone,
      first_name: body.fullName.split(' ')[0],
      last_name: body.fullName.split(' ').slice(1).join(' '),
      title: 'Donation to Mthunzi Trust',
      description: body.message || 'Charitable donation to support our programs',
      customizations: {
        title: 'Mthunzi Trust',
        description: 'Supporting life-changing programs in Malawi',
      },
      redirect_url: redirectUrl,
    };

    // Call Paychangu Card API
    const response = await axios.post(
      'https://api.paychangu.com/charges?type=card',
      paychanguPayload,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      // Check if 3DS authentication is required
      if (response.data.data?.requires_3ds_auth) {
        return NextResponse.json({
          success: true,
          chargeId,
          requires3ds: true,
          authorizationUrl: response.data.data?.['3ds_auth_link'],
          message: 'Complete 3D Secure authentication to proceed',
        });
      } else {
        // Payment successful without 3DS
        return NextResponse.json({
          success: true,
          chargeId,
          requires3ds: false,
          message: 'Payment processed successfully',
        });
      }
    } else {
      return NextResponse.json(
        { message: response.data.message || 'Payment processing failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Card Payment Error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          message:
            error.response?.data?.message || 'Failed to process card payment',
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

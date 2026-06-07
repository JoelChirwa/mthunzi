import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface CheckoutPayload {
  amount: number;
  email: string;
  fullName: string;
  phone?: string;
  message?: string;
  currency: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutPayload = await request.json();

    // Validate required fields
    if (!body.amount || !body.email || !body.fullName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get API credentials from environment variables
    const secretKey = process.env.PAYCHANGU_SECRET_KEY;

    if (!secretKey) {
      console.error('Missing Paychangu API credentials');
      return NextResponse.json(
        { message: 'Payment service configuration error' },
        { status: 500 }
      );
    }

    // Generate unique transaction reference
    const txRef = `donation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Construct callback and return URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const callbackUrl = `${baseUrl}/api/webhooks/paychangu`;
    const returnUrl = `${baseUrl}/donate/verify?tx_ref=${txRef}`;

    // Split full name into first and last name
    const nameParts = body.fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // Prepare the payload for Paychangu Standard Checkout API
    const paychanguPayload = {
      amount: body.amount.toString(),
      currency: body.currency || 'MWK',
      email: body.email,
      first_name: firstName,
      last_name: lastName,
      callback_url: callbackUrl,
      return_url: returnUrl,
      tx_ref: txRef,
      customization: {
        title: 'Donation to Mthunzi Trust',
        description: body.message || 'Charitable donation to support our programs',
      },
      meta: {
        phone: body.phone || '',
        message: body.message || '',
        full_name: body.fullName,
      },
    };

    // Call Paychangu Standard Checkout API
    const response = await axios.post(
      'https://api.paychangu.com/payment',
      paychanguPayload,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'success' && response.data.data?.checkout_url) {
      return NextResponse.json({
        success: true,
        tx_ref: txRef,
        checkout_url: response.data.data.checkout_url,
        message: 'Payment session created successfully',
      });
    } else {
      return NextResponse.json(
        { message: response.data.message || 'Failed to create payment session' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Standard Checkout Error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          message:
            error.response?.data?.message || 'Failed to initiate payment checkout',
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

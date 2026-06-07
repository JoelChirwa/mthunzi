'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface VerificationResult {
  success: boolean;
  status: string;
  amount?: number;
  currency?: string;
  email?: string;
  message: string;
}

export function VerificationPage() {
  const searchParams = useSearchParams();
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const chargeId = searchParams.get('charge_id');
        const txRef = searchParams.get('tx_ref');
        const status = searchParams.get('status');

        const referenceId = chargeId || txRef;

        if (!referenceId) {
          setError('No transaction reference provided');
          setIsLoading(false);
          return;
        }

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/donations/verify/${referenceId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        setVerification(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/donate">
              <Button className="w-full bg-green-700 hover:bg-green-800">
                Return to Donation
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="p-8 max-w-md w-full">
          <p className="text-gray-600 text-center">No verification data available</p>
        </Card>
      </div>
    );
  }

  const isSuccess = verification.success && verification.status === 'completed';
  const isPending = verification.status === 'pending';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="p-8 max-w-md w-full">
        <div className="text-center">
          {isSuccess ? (
            <>
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You for Your Donation!
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Amount:</strong> {verification.currency} {verification.amount}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Email:</strong> {verification.email}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> <span className="text-green-600">Completed</span>
                </p>
              </div>
              <p className="text-gray-600 mb-6">
                Your donation has been successfully received. We'll send you a receipt to your email
                shortly.
              </p>
            </>
          ) : isPending ? (
            <>
              <div className="text-yellow-500 text-5xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h2>
              <p className="text-gray-600 mb-6">
                Your payment is being processed. Please check your email for updates shortly.
              </p>
            </>
          ) : (
            <>
              <div className="text-red-500 text-5xl mb-4">✕</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-6">{verification.message}</p>
              <Link href="/donate">
                <Button className="w-full bg-green-700 hover:bg-green-800 mb-3">
                  Try Again
                </Button>
              </Link>
            </>
          )}

          <Link href="/">
            <Button variant="outline" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

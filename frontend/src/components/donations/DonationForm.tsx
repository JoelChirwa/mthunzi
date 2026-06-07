'use client';

import React, { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

const donationSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0').min(1),
  email: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().email('Invalid email address').optional()
  ),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.preprocess(
    (val) => (typeof val === 'string' && val.trim() === '' ? undefined : val),
    z.string().min(7, 'Phone number is too short').optional()
  ),
  message: z.string().optional(),
  currency: z.enum(['USD', 'MWK']),
});

type DonationFormData = z.infer<typeof donationSchema>;

export function DonationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema) as Resolver<DonationFormData, unknown>,
    defaultValues: {
      currency: 'MWK',
    },
  });

  const amount = watch('amount');
  const currency = watch('currency');

  const onSubmit = async (data: DonationFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/donations/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Payment initiation failed');
      }

      const paymentUrl = result.authorizationUrl || result.checkoutUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      throw new Error(result.message || 'No payment redirect URL returned');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Make a Donation</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          Thank you for your donation! Your payment is being processed.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">Donation Amount *</label>
          <div className="flex gap-2 flex-col sm:flex-row">
            <Input
              type="number"
              step="0.01"
              placeholder="Enter amount"
              {...register('amount', { valueAsNumber: true })}
              className={errors.amount ? 'border-red-500' : ''}
            />
            <select
              {...register('currency')}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            >
              <option value="MWK">MWK</option>
              <option value="USD">USD</option>
            </select>
          </div>
          {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Full Name *</label>
            <Input
              placeholder="John Doe"
              {...register('fullName')}
              className={errors.fullName ? 'border-red-500' : ''}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Email Address (Optional)</label>
            <Input
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Phone Number (Optional)</label>
          <Input
            type="tel"
            placeholder="+265 991 234 567"
            {...register('phone')}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          <p className="text-xs text-gray-500">For payment notifications and receipt delivery</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-900">Message (Optional)</label>
          <textarea
            placeholder="Tell us how we can impact your life or community"
            rows={4}
            {...register('message')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
          />
        </div>

        <Card className="p-4 bg-gray-50 border-gray-200">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Donation Amount:</span>
              <span className="font-semibold text-gray-900">
                {currency} {amount?.toFixed(2) || '0.00'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-semibold text-gray-900">
                Selected on PayChangu checkout
              </span>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-lg uppercase tracking-wide"
        >
          {isLoading ? 'Processing...' : `Donate ${currency} ${amount?.toFixed(2) || '0.00'}`}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Your donation is secure and encrypted. All payments are processed through PayChangu&apos;s secure checkout.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-center">
          <span className="text-xs text-gray-500">Accepted payment methods:</span>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Airtel Money</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">TNM Mpamba</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Visa</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Mastercard</span>
          </div>
        </div>
      </form>
    </div>
  );
}

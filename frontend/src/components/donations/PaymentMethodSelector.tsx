'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export type PaymentMethod = 'mobile_money' | 'card';
export type MobileMoneyProvider = 'airtel' | 'tnm';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  mobileMoneyProvider?: MobileMoneyProvider;
  onMobileMoneyProviderChange?: (provider: MobileMoneyProvider) => void;
}

export function PaymentMethodSelector({ 
  value, 
  onChange,
  mobileMoneyProvider = 'airtel',
  onMobileMoneyProviderChange
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Select Payment Method</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mobile Money Option */}
        <Card 
          className={`p-4 cursor-pointer border-2 transition-all ${
            value === 'mobile_money' 
              ? 'border-green-600 bg-green-50' 
              : 'border-gray-200 hover:border-green-300'
          }`}
          onClick={() => onChange('mobile_money')}
        >
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="payment-method"
              value="mobile_money"
              checked={value === 'mobile_money'}
              onChange={(e) => onChange(e.target.value as PaymentMethod)}
              className="w-4 h-4 text-green-600"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Mobile Money</p>
              <p className="text-sm text-gray-600">Airtel Money, TNM Mpamba</p>
            </div>
          </label>
        </Card>

        {/* Card Option */}
        <Card 
          className={`p-4 cursor-pointer border-2 transition-all ${
            value === 'card' 
              ? 'border-blue-600 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          }`}
          onClick={() => onChange('card')}
        >
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="payment-method"
              value="card"
              checked={value === 'card'}
              onChange={(e) => onChange(e.target.value as PaymentMethod)}
              className="w-4 h-4 text-blue-600"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Debit/Credit Card</p>
              <p className="text-sm text-gray-600">Visa, Mastercard, and more</p>
            </div>
          </label>
        </Card>
      </div>

      {/* Mobile Money Provider Selection */}
      {value === 'mobile_money' && onMobileMoneyProviderChange && (
        <div className="mt-4 space-y-3">
          <h4 className="text-sm font-semibold text-gray-900">Select Mobile Money Provider</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`p-3 cursor-pointer border-2 transition-all ${
                mobileMoneyProvider === 'airtel' 
                  ? 'border-red-600 bg-red-50' 
                  : 'border-gray-200 hover:border-red-300'
              }`}
              onClick={() => onMobileMoneyProviderChange('airtel')}
            >
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mobile-money-provider"
                  value="airtel"
                  checked={mobileMoneyProvider === 'airtel'}
                  onChange={(e) => onMobileMoneyProviderChange(e.target.value as MobileMoneyProvider)}
                  className="w-4 h-4 text-red-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Airtel Money</p>
                </div>
              </label>
            </Card>

            <Card 
              className={`p-3 cursor-pointer border-2 transition-all ${
                mobileMoneyProvider === 'tnm' 
                  ? 'border-orange-600 bg-orange-50' 
                  : 'border-gray-200 hover:border-orange-300'
              }`}
              onClick={() => onMobileMoneyProviderChange('tnm')}
            >
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mobile-money-provider"
                  value="tnm"
                  checked={mobileMoneyProvider === 'tnm'}
                  onChange={(e) => onMobileMoneyProviderChange(e.target.value as MobileMoneyProvider)}
                  className="w-4 h-4 text-orange-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">TNM Mpamba</p>
                </div>
              </label>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

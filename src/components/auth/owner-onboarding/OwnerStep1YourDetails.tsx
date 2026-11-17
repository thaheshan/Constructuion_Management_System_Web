'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  updateOwnerDetails,
  completeStep,
} from '@/store/slices/ownerOnboardingSlice';
import { useStepNavigation } from '@/hooks/useStepNavigation';
import {
  validateOwnerStep1,
  validateOwnerStep1Field,
} from '@/utils/validators';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Eye, EyeOff, ArrowRight, HelpCircle } from 'lucide-react';
import { OwnerDetails } from '@/types/onboarding';

interface OwnerStep1YourDetailsProps {
  onOpenHelp?: () => void;
}

export const OwnerStep1YourDetails: React.FC<OwnerStep1YourDetailsProps> = ({
  onOpenHelp,
}) => {
  const dispatch = useAppDispatch();
  const { goToStep } = useStepNavigation();
  const ownerDetails = useAppSelector((state) => state.ownerOnboarding.ownerDetails);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: keyof OwnerDetails) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldError = validateOwnerStep1Field(field, ownerDetails[field], ownerDetails);
    setErrors((prev) => {
      const next = { ...prev };
      if (fieldError) {
        next[field] = fieldError;
      } else {
        delete next[field];
      }
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateOwnerStep1(ownerDetails);
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agreedToTerms: true,
    });

    if (Object.keys(validationErrors).length === 0) {
      dispatch(completeStep(1));
      goToStep(2);
    }
  };

  return (
    <div className="w-full">
      {/* ── Main Form Card ── */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-7 sm:p-9">
        {/* ── Badge & Header ── */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f0fe] border border-[#d2e3fc] text-[#1a73e8] text-xs font-semibold mb-3">
            <User className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Registering as: Owner</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
            Create your Owner account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            You are setting up a new company. You will be the Owner with full control.
          </p>
        </div>

        {/* ── Form Inputs ── */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <Input
            label="Full Name (As on NIC) *"
            placeholder="e.g. Kamal Bandara Perera"
            value={ownerDetails.fullName}
            onChange={(e) => dispatch(updateOwnerDetails({ fullName: e.target.value }))}
            onBlur={() => handleBlur('fullName')}
            error={touched.fullName ? errors.fullName : undefined}
          />

          {/* Email */}
          <Input
            label="Email Address *"
            type="email"
            placeholder="kamal@futuraconstruction.lk"
            value={ownerDetails.email}
            onChange={(e) => dispatch(updateOwnerDetails({ email: e.target.value }))}
            onBlur={() => handleBlur('email')}
            error={touched.email ? errors.email : undefined}
          />

          {/* Sri Lankan Mobile Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mobile Number (Sri Lanka) *
            </label>
            <div className="flex items-center rounded-lg shadow-sm border border-slate-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 bg-white overflow-hidden">
              <span className="px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-500 bg-slate-50 border-r border-slate-200 select-none">
                {ownerDetails.phonePrefix || '+94'}
              </span>
              <input
                type="tel"
                placeholder="77 123 4567"
                value={ownerDetails.phone}
                onChange={(e) => dispatch(updateOwnerDetails({ phone: e.target.value }))}
                onBlur={() => handleBlur('phone')}
                className="w-full px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            {touched.phone && errors.phone ? (
              <p className="mt-1.5 text-xs text-red-600 font-medium animate-fadeIn">
                {errors.phone}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-slate-400">
                A 6-digit OTP code will be sent to this number for identity verification
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Input
              label="Password *"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={ownerDetails.password}
              onChange={(e) => dispatch(updateOwnerDetails({ password: e.target.value }))}
              onBlur={() => handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Password Strength Meter */}
            <PasswordStrengthMeter password={ownerDetails.password} />
          </div>

          {/* Confirm Password */}
          <Input
            label="Confirm Password *"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={ownerDetails.confirmPassword || ''}
            onChange={(e) => dispatch(updateOwnerDetails({ confirmPassword: e.target.value }))}
            onBlur={() => handleBlur('confirmPassword')}
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
          />

          {/* Terms & Responsibility Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={ownerDetails.agreedToTerms}
                onChange={(e) =>
                  dispatch(updateOwnerDetails({ agreedToTerms: e.target.checked }))
                }
                onBlur={() => handleBlur('agreedToTerms')}
                className="mt-0.5 w-4 h-4 text-futura-500 border-slate-300 rounded focus:ring-futura-500 cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-relaxed select-none group-hover:text-slate-800 transition">
                I agree to Futura Constructions&apos;{' '}
                <Link
                  href="/terms"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Privacy Policy
                </Link>
                , and accept full administrative responsibility as Master Owner.
              </span>
            </label>
            {touched.agreedToTerms && errors.agreedToTerms && (
              <p className="mt-1.5 text-xs text-red-600 font-medium animate-fadeIn">
                {errors.agreedToTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold py-3.5 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Company Details</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Support Link */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onOpenHelp}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Having trouble? Contact support</span>
        </button>
      </div>
    </div>
  );
};

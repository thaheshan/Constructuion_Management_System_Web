'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateOwnerDetails, setStep } from '@/store/slices/ownerOnboardingSlice';
import { PasswordStrengthMeter, calculatePasswordStrength } from './PasswordStrengthMeter';
import {
  User,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';

interface OwnerStep1YourDetailsProps {
  onOpenHelp?: () => void;
}

export const OwnerStep1YourDetails: React.FC<OwnerStep1YourDetailsProps> = ({
  onOpenHelp,
}) => {
  const dispatch = useAppDispatch();
  const ownerDetails = useAppSelector((state) => state.ownerOnboarding.ownerDetails);

  // Local state initialized from Redux
  const [fullName, setFullName] = useState(ownerDetails.fullName || '');
  const [email, setEmail] = useState(ownerDetails.email || '');
  const [phonePrefix, setPhonePrefix] = useState(ownerDetails.phonePrefix || '+94');
  const [phone, setPhone] = useState(ownerDetails.phone || '');
  const [password, setPassword] = useState(ownerDetails.password || '');
  const [confirmPassword, setConfirmPassword] = useState(
    ownerDetails.confirmPassword || ''
  );
  const [agreedToTerms, setAgreedToTerms] = useState(
    ownerDetails.agreedToTerms || false
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    // Full name validation (As on NIC)
    const cleanName = fullName.trim();
    if (!cleanName) {
      errs.fullName = 'Full Name as on your National Identity Card (NIC) is required';
    } else if (cleanName.length < 3) {
      errs.fullName = 'Full Name must be at least 3 characters';
    } else if (!/^[A-Za-z\s.'-]+$/.test(cleanName)) {
      errs.fullName = 'Full Name can only contain letters, spaces, and periods';
    }

    // Email validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    // Sri Lanka phone validation (+94 7X XXX XXXX)
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!cleanPhone) {
      errs.phone = 'Mobile number is required for SMS verification';
    } else if (!/^7[0-9]{8}$/.test(cleanPhone)) {
      errs.phone = 'Enter a valid 9-digit Sri Lankan mobile number (e.g. 77 123 4567)';
    }

    // Password validation
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters long';
    } else {
      const { score } = calculatePasswordStrength(password);
      if (score < 2) {
        errs.password = 'Password is too weak. Include uppercase, numbers, or symbols.';
      }
    }

    // Confirm password
    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (confirmPassword !== password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    // Terms
    if (!agreedToTerms) {
      errs.agreedToTerms = 'You must agree to the Terms of Service and Master Owner responsibilities';
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
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
      // Dispatch updates to Redux
      dispatch(
        updateOwnerDetails({
          fullName: fullName.trim(),
          email: email.trim(),
          phonePrefix,
          phone: phone.trim(),
          password,
          confirmPassword,
          agreedToTerms,
        })
      );
      // Advance to Step 2 smoothly
      dispatch(setStep(2));
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('step', '2');
        window.history.pushState({}, '', url.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
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

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* ── Full Name ── */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="As on your NIC"
              className={`w-full px-4 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                touched.fullName && errors.fullName
                  ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                  : 'border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
              }`}
            />
            {touched.fullName && errors.fullName && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* ── Side-by-Side: Email Address & Mobile Number ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="name@company.com"
                className={`w-full px-4 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                  touched.email && errors.email
                    ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                    : 'border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
              >
                Mobile Number
              </label>
              <div
                className={`flex items-center rounded-xl border transition focus-within:ring-2 focus-within:ring-futura-500 bg-white overflow-hidden ${
                  touched.phone && errors.phone
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-sm font-semibold text-slate-600 pl-4 pr-3 py-3 select-none">
                  +94
                </span>
                <div className="h-5 w-[1px] bg-slate-200 my-auto flex-shrink-0" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="77 123 4567"
                  className="flex-1 px-3 py-3 text-sm font-medium bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>

          {/* ── Password ── */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className={`w-full pl-4 pr-11 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                  touched.password && errors.password
                    ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                    : 'border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            <PasswordStrengthMeter password={password} />

            {touched.password && errors.password && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* ── Confirm Password ── */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-xs sm:text-[13px] font-bold text-slate-800 mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="••••••••"
                className={`w-full pl-4 pr-11 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                    : 'border-slate-200 text-slate-900 placeholder:text-slate-400 hover:border-slate-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          {/* ── Terms & Responsibility Checkbox (with Blue Links) ── */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-futura-500 border-slate-300 rounded focus:ring-futura-500 cursor-pointer"
              />
              <span className="text-xs text-slate-600 leading-relaxed select-none group-hover:text-slate-800 transition">
                I agree to Futura Constructions&apos;{' '}
                <a href="#" className="text-blue-600 font-semibold hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 font-semibold hover:underline">
                  Privacy Policy
                </a>
                . I understand I am creating a Master Owner account.
              </span>
            </label>
            {touched.agreedToTerms && errors.agreedToTerms && (
              <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errors.agreedToTerms}</span>
              </p>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold text-sm sm:text-base tracking-wide shadow-md shadow-futura-500/20 transition duration-150 flex items-center justify-center cursor-pointer"
            >
              <span>Continue</span>
            </button>

            <div className="text-center">
              <Link
                href="/register/role-selection"
                className="inline-block text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-800 transition py-1"
              >
                Back to role selection
              </Link>
            </div>
          </div>
        </form>
      </div>

      {/* ── Centered Contact Support below the card ── */}
      <div className="mt-6 text-center text-xs sm:text-sm text-slate-500">
        <span>Need help with registration? </span>
        <button
          type="button"
          onClick={onOpenHelp}
          className="text-blue-600 font-semibold hover:underline cursor-pointer focus:outline-none"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

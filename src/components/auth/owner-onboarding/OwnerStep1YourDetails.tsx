'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateOwnerDetails, setStep } from '@/store/slices/ownerOnboardingSlice';
import { PasswordStrengthMeter, calculatePasswordStrength } from './PasswordStrengthMeter';
import {
  UserCheck,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';

export const OwnerStep1YourDetails: React.FC = () => {
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
      // Advance to Step 2
      dispatch(setStep(2));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validationErrors = validate();
    setErrors(validationErrors);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden p-6 sm:p-10">
      {/* ── Badge & Header ── */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold tracking-wide uppercase mb-3.5">
          <UserCheck className="w-3.5 h-3.5 text-futura-600" />
          <span>Registering as: Owner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create your Owner account
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          You are setting up a new company. You will be the Owner with full legal and administrative control.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* ── Full Name ── */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="fullName"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700"
            >
              Full Name <span className="text-futura-500">*</span>
            </label>
            <span className="text-[11px] font-medium text-slate-400">As on your NIC</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <UserCheck className="w-4 h-4" />
            </div>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="e.g. Kasun Chamara Perera"
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                touched.fullName && errors.fullName
                  ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                  : 'border-slate-300 text-slate-900 hover:border-slate-400'
              }`}
            />
          </div>
          {touched.fullName && errors.fullName && (
            <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* ── Email Address ── */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Email Address <span className="text-futura-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="owner@company.lk"
              className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                touched.email && errors.email
                  ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                  : 'border-slate-300 text-slate-900 hover:border-slate-400'
              }`}
            />
          </div>
          {touched.email && errors.email && (
            <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* ── Mobile Number (+94) ── */}
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Mobile Number <span className="text-futura-500">*</span>
          </label>
          <div className="flex rounded-xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-1.5 px-3.5 py-3 bg-slate-100 border border-r-0 border-slate-300 text-slate-700 text-sm font-bold select-none">
              <span className="text-base" role="img" aria-label="Sri Lanka">
                🇱🇰
              </span>
              <span>+94</span>
            </div>
            <div className="relative flex-1">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="77 123 4567"
                className={`w-full px-4 py-3 rounded-r-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                  touched.phone && errors.phone
                    ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                    : 'border-slate-300 text-slate-900 hover:border-slate-400'
                }`}
              />
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>Used for SMS verification and two-factor security alerts</span>
          </p>
          {touched.phone && errors.phone && (
            <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* ── Password ── */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Password <span className="text-futura-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="At least 8 characters"
              className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                touched.password && errors.password
                  ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                  : 'border-slate-300 text-slate-900 hover:border-slate-400'
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
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Confirm Password <span className="text-futura-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Re-enter your password"
              className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm font-medium border transition focus:outline-none focus:ring-2 focus:ring-futura-500 ${
                touched.confirmPassword && errors.confirmPassword
                  ? 'border-red-400 bg-red-50/20 text-red-900 focus:ring-red-400'
                  : 'border-slate-300 text-slate-900 hover:border-slate-400'
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

        {/* ── Terms & Responsibility Checkbox ── */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-futura-500 border-slate-300 rounded focus:ring-futura-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 leading-relaxed select-none group-hover:text-slate-800 transition">
              I agree to Futura Constructions&apos;{' '}
              <a href="#" className="text-futura-600 font-bold hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-futura-600 font-bold hover:underline">
                Privacy Policy
              </a>
              . I understand I am creating a Master Owner account with enterprise legal and financial responsibilities.
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
        <div className="pt-4 flex flex-col gap-4">
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-futura-500/25 transition duration-150 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <div className="text-center">
            <Link
              href="/register/role-selection"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to role selection</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

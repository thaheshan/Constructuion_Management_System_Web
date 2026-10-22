'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';
import { UserRole } from '@/types/auth';

interface CreateAccountFormProps {
  redirectPath?: string;
  className?: string;
}

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  redirectPath = '/',
  className = '',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const selectedRole = (searchParams.get('role') as UserRole) || 'STAFF';
  const selectedSubRole = searchParams.get('subRole') || '';

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    companyName?: string;
    emailOrPhone?: string;
    password?: string;
  }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!fullName.trim()) {
      errs.fullName = 'Full name is required';
    }
    if (!companyName.trim()) {
      errs.companyName = 'Company name is required';
    }
    if (!emailOrPhone.trim()) {
      errs.emailOrPhone = 'Email or mobile number is required';
    } else {
      const isEmail = /\S+@\S+\.\S+/.test(emailOrPhone.trim());
      const isPhone = /^(\+?[0-9]{7,15}|0[0-9]{9})$/.test(
        emailOrPhone.trim().replace(/[\s-]/g, '')
      );
      if (!isEmail && !isPhone) {
        errs.emailOrPhone = 'Enter a valid email address or phone number';
      }
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(password)) {
      errs.password = 'Password must contain at least 1 number';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(loginStart());

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const isEmail = emailOrPhone.includes('@');
      dispatch(
        loginSuccess({
          user: {
            id: 'cms_usr_' + Math.random().toString(36).substring(2, 8),
            fullName: fullName.trim(),
            email: isEmail ? emailOrPhone.trim() : `${emailOrPhone.trim()}@futura.lk`,
            phone: !isEmail ? emailOrPhone.trim() : undefined,
            role: selectedRole,
          },
          token: 'cms_token_' + Date.now(),
        })
      );

      router.push(redirectPath);
    } catch {
      dispatch(loginFailure('Failed to create account. Please try again.'));
    }
  };

  const roleLabel = selectedRole
    ? selectedRole.replace('_', ' ')
    : 'Team Member';

  return (
    <div className={`w-full ${className}`}>
      {/* Title & Subtitle */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Join Futura Constructions to manage your sites.
        </p>

        {/* Selected Role Pill */}
        {selectedRole && (
          <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200/80 uppercase tracking-wider">
            <span>Role:</span>
            <span className="font-black">{roleLabel}</span>
            {selectedSubRole && (
              <span className="text-orange-600/80 font-normal">
                ({selectedSubRole.replace('_', ' ')})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-700 text-xs font-medium flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Account Creation Failed</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="create-fullname"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600"
          >
            FULL NAME
          </label>
          <input
            id="create-fullname"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName)
                setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            className={`block w-full rounded-xl border text-sm transition focus:outline-none focus:ring-2 py-3 px-3.5 text-slate-900 placeholder:text-slate-400 ${
              errors.fullName
                ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 focus:border-futura-500 focus:ring-futura-100 focus:bg-white'
            }`}
          />
          {errors.fullName && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Company Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="create-company"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600"
          >
            COMPANY NAME
          </label>
          <input
            id="create-company"
            type="text"
            placeholder="e.g. Acme Constructions"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (errors.companyName)
                setErrors((prev) => ({ ...prev, companyName: undefined }));
            }}
            className={`block w-full rounded-xl border text-sm transition focus:outline-none focus:ring-2 py-3 px-3.5 text-slate-900 placeholder:text-slate-400 ${
              errors.companyName
                ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 focus:border-futura-500 focus:ring-futura-100 focus:bg-white'
            }`}
          />
          {errors.companyName && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.companyName}</span>
            </p>
          )}
        </div>

        {/* Email or Mobile Number */}
        <div className="space-y-1.5">
          <label
            htmlFor="create-email-phone"
            className="block text-[11px] font-bold uppercase tracking-wider text-slate-600"
          >
            EMAIL OR MOBILE NUMBER
          </label>
          <input
            id="create-email-phone"
            type="text"
            placeholder="john@example.com"
            value={emailOrPhone}
            onChange={(e) => {
              setEmailOrPhone(e.target.value);
              if (errors.emailOrPhone)
                setErrors((prev) => ({ ...prev, emailOrPhone: undefined }));
            }}
            className={`block w-full rounded-xl border text-sm transition focus:outline-none focus:ring-2 py-3 px-3.5 text-slate-900 placeholder:text-slate-400 ${
              errors.emailOrPhone
                ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 focus:border-futura-500 focus:ring-futura-100 focus:bg-white'
            }`}
          />
          {errors.emailOrPhone && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.emailOrPhone}</span>
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="create-password"
              className="block text-[11px] font-bold uppercase tracking-wider text-slate-600"
            >
              PASSWORD
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition"
            >
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          <input
            id="create-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            className={`block w-full rounded-xl border text-sm transition focus:outline-none focus:ring-2 py-3 px-3.5 text-slate-900 placeholder:text-slate-400 ${
              errors.password
                ? 'border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 focus:border-futura-500 focus:ring-futura-100 focus:bg-white'
            }`}
          />
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-mono">
            <span>Min. 08 characters with 1 number</span>
          </div>
          {errors.password && (
            <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Primary CTA Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-futura-500/25 transition duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider disabled:opacity-60 disabled:cursor-not-allowed group mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>CREATE ACCOUNT</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        {/* Already have an account link */}
        <div className="pt-2 text-center">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-futura-500 hover:text-futura-600 font-bold hover:underline transition"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* OR SIGN UP WITH Divider */}
        <div className="relative flex items-center justify-center my-4 pt-1">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 absolute">
            OR SIGN UP WITH
          </span>
        </div>

        {/* Social Buttons */}
        <div className="flex items-center justify-center gap-3.5 pt-1">
          {/* Google Button */}
          <button
            type="button"
            className="w-11 h-11 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-center shadow-sm"
            aria-label="Sign up with Google"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </button>

          {/* Microsoft Button */}
          <button
            type="button"
            className="w-11 h-11 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-center shadow-sm"
            aria-label="Sign up with Microsoft"
          >
            <svg className="w-4 h-4" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
          </button>
        </div>
      </form>

      {/* Footer Terms */}
      <div className="mt-8 text-center">
        <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
          By joining, you agree to our{' '}
          <Link
            href="/terms"
            className="font-semibold text-slate-700 hover:text-slate-900 underline"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="font-semibold text-slate-700 hover:text-slate-900 underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default CreateAccountForm;

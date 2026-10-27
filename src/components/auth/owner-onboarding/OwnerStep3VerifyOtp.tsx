'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setStep,
  completeStep,
  setVerificationCode,
  setVerificationChannel,
  decrementCountdown,
  resetCountdown,
  verifyOtp,
  updateOwnerDetails,
} from '@/store/slices/ownerOnboardingSlice';
import { OtpInputGrid } from './OtpInputGrid';
import {
  Shield,
  Mail,
  Smartphone,
  AlertCircle,
  Lock,
  CheckCircle2,
  Edit2,
  X,
} from 'lucide-react';

interface OwnerStep3VerifyOtpProps {
  onOpenHelp?: () => void;
}

export const OwnerStep3VerifyOtp: React.FC<OwnerStep3VerifyOtpProps> = ({
  onOpenHelp,
}) => {
  const dispatch = useAppDispatch();
  const { ownerDetails, verification } = useAppSelector(
    (state) => state.ownerOnboarding
  );

  const {
    code,
    channel,
    resendCountdown,
    isVerified,
    attemptsRemaining,
    lockedUntil,
    error,
  } = verification;

  // Local state for "Use different number or email" dialog
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [tempPhone, setTempPhone] = useState(ownerDetails.phone || '');
  const [tempEmail, setTempEmail] = useState(ownerDetails.email || '');
  const [editError, setEditError] = useState<string | null>(null);

  // Success message after resend
  const [resendNotification, setResendNotification] = useState<string | null>(
    null
  );

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        dispatch(decrementCountdown());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dispatch, resendCountdown]);

  // Masking helpers
  const getMaskedPhone = (phoneNum: string) => {
    const clean = phoneNum.replace(/\s+/g, '');
    if (clean.length < 9) return '+94 7X XXX 1234';
    const prefix = clean.slice(0, 2);
    const suffix = clean.slice(-4);
    return `+94 ${prefix} ••• ${suffix}`;
  };

  const getMaskedEmail = (emailStr: string) => {
    if (!emailStr.includes('@')) return 'owner@company.lk';
    const [local, domain] = emailStr.split('@');
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.slice(0, 2)}***${local.slice(-1)}@${domain}`;
  };

  const currentDestinationText =
    channel === 'SMS'
      ? getMaskedPhone(ownerDetails.phone || '771234567')
      : getMaskedEmail(ownerDetails.email || 'owner@company.lk');

  const fullCode = code.join('');
  const isCodeComplete = fullCode.length === 6;

  // Check if locked out
  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isCodeComplete || isLocked) return;

    dispatch(verifyOtp(fullCode));
  };

  const handleResend = () => {
    if (resendCountdown > 0 || isLocked) return;

    dispatch(resetCountdown(59));
    dispatch(setVerificationCode(['', '', '', '', '', '']));
    setResendNotification(
      `A fresh 6-digit verification code has been dispatched via ${channel}.`
    );
    setTimeout(() => setResendNotification(null), 5000);
  };

  const handleSwitchChannel = () => {
    const nextChannel = channel === 'SMS' ? 'EMAIL' : 'SMS';
    dispatch(setVerificationChannel(nextChannel));
    setResendNotification(`Verification code sent to your ${nextChannel === 'SMS' ? 'mobile number' : 'email address'}.`);
    setTimeout(() => setResendNotification(null), 5000);
  };

  const handleSaveContact = () => {
    setEditError(null);
    const cleanP = tempPhone.replace(/\s+/g, '');
    if (!cleanP || !/^7[0-9]{8}$/.test(cleanP)) {
      setEditError('Enter a valid 9-digit mobile number (e.g. 77 123 4567)');
      return;
    }
    if (!tempEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempEmail)) {
      setEditError('Enter a valid email address');
      return;
    }

    dispatch(
      updateOwnerDetails({
        phone: cleanP,
        email: tempEmail.trim(),
      })
    );
    setShowEditContactModal(false);
    dispatch(resetCountdown(59));
    dispatch(setVerificationCode(['', '', '', '', '', '']));
    setResendNotification('Contact updated. A new verification code has been dispatched.');
    setTimeout(() => setResendNotification(null), 5000);
  };

  const handleBack = () => {
    dispatch(setStep(2));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep = useCallback(() => {
    // When verification succeeds, complete Step 3 and move to Review / Step 4
    dispatch(completeStep(3));
    dispatch(setStep(4));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [dispatch]);

  useEffect(() => {
    if (isVerified) {
      handleNextStep();
    }
  }, [isVerified, handleNextStep]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      {/* ── Main Form Card ── */}
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-7 sm:p-9 text-center">
        {/* ── Top Icon Badge ── */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-50/80 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-blue-600" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Verify your account
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md leading-relaxed mx-auto">
            We sent a 6-digit code to{' '}
            <span className="font-bold text-slate-800">{currentDestinationText}</span>. Enter it below to secure your identity.
          </p>
        </div>

        {/* ── Resend Notification Toast ── */}
        {resendNotification && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{resendNotification}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          {/* ── 6-Digit OTP Box Grid ── */}
          <div>
            <OtpInputGrid
              value={code}
              onChange={(digits) => dispatch(setVerificationCode(digits))}
              hasError={Boolean(error)}
              disabled={isLocked}
            />

            {/* Error Message */}
            {error && (
              <div className="mt-3 text-center flex items-center justify-center gap-1.5 text-xs text-red-600 font-semibold animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* ── Resend Timer Section ── */}
          <div className="text-center">
            {resendCountdown > 0 ? (
              <p className="text-xs text-slate-500">
                Didn&apos;t receive a code?{' '}
                <span className="text-slate-400 font-medium">
                  Resend code in {formatTimer(resendCountdown)}
                </span>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Didn&apos;t receive a code?{' '}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLocked}
                  className="font-semibold text-blue-600 hover:underline focus:outline-none cursor-pointer"
                >
                  Resend code
                </button>
              </p>
            )}
          </div>

          {/* ── Alternative Channels Box ── */}
          <div className="rounded-xl border border-slate-100 bg-[#f8fafc] p-4 text-left space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setTempPhone(ownerDetails.phone || '');
                setTempEmail(ownerDetails.email || '');
                setShowEditContactModal(true);
              }}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:underline cursor-pointer group text-left"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <span>Use a different number or email</span>
            </button>

            <button
              type="button"
              onClick={handleSwitchChannel}
              className="flex items-center gap-2 text-xs sm:text-sm font-medium text-blue-600 hover:underline cursor-pointer group text-left"
            >
              {channel === 'SMS' ? (
                <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              ) : (
                <Smartphone className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              )}
              <span>
                {channel === 'SMS'
                  ? 'Send code to my email instead'
                  : 'Send code via SMS instead'}
              </span>
            </button>
          </div>

          {/* ── Action Buttons ── */}
          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={!isCodeComplete || isLocked}
              className="w-full py-3.5 px-6 rounded-xl bg-futura-500 hover:bg-futura-600 active:bg-futura-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-base tracking-wide shadow-md shadow-futura-500/20 transition cursor-pointer"
            >
              <span>Verify and continue</span>
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="w-full py-2.5 px-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-medium text-xs sm:text-sm transition text-center cursor-pointer"
            >
              Back
            </button>
          </div>
        </form>
      </div>

      {/* ── Below Card: End-to-End Encrypted Verification Note ── */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-400 select-none">
        <Lock className="w-3.5 h-3.5 text-slate-400" />
        <span>END-TO-END ENCRYPTED VERIFICATION</span>
      </div>

      {/* ── Edit Contact Modal ── */}
      {showEditContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setShowEditContactModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Update Contact Destination
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Change the phone number or email where your verification code will be sent.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Mobile Number (+94)
                </label>
                <input
                  type="tel"
                  value={tempPhone}
                  onChange={(e) => setTempPhone(e.target.value)}
                  placeholder="77 123 4567"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-futura-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="owner@company.lk"
                  className="w-full px-4 py-2.5 rounded-xl text-sm border border-slate-300 focus:outline-none focus:ring-2 focus:ring-futura-500"
                />
              </div>

              {editError && (
                <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{editError}</span>
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEditContactModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-bold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveContact}
                className="flex-1 py-2.5 rounded-xl bg-futura-500 hover:bg-futura-600 text-white text-sm font-bold shadow-md shadow-futura-500/20 transition"
              >
                Save &amp; Resend
              </button>
            </div>
          </div>
        </div>
      )}

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

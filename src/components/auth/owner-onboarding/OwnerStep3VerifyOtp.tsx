'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setVerificationCode,
  setVerificationChannel,
  decrementCountdown,
  resetCountdown,
  verifyOtp,
  updateOwnerDetails,
} from '@/store/slices/ownerOnboardingSlice';
import { useStepNavigation } from '@/hooks/useStepNavigation';
import { isValidEmail, isValidSriLankaMobile } from '@/utils/validators';
import { OtpInputGrid } from './OtpInputGrid';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  Mail,
  Smartphone,
  AlertCircle,
  Lock,
  Edit2,
  X,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface OwnerStep3VerifyOtpProps {
  onOpenHelp?: () => void;
}

export const OwnerStep3VerifyOtp: React.FC<OwnerStep3VerifyOtpProps> = ({
  onOpenHelp,
}) => {
  const dispatch = useAppDispatch();
  const { goToStep } = useStepNavigation();
  const { ownerDetails, verification } = useAppSelector(
    (state) => state.ownerOnboarding
  );

  const {
    code,
    channel,
    resendCountdown,
    attemptsRemaining,
    lockedUntil,
    error,
  } = verification;

  // Local state for "Use different number or email" modal
  const [showEditContactModal, setShowEditContactModal] = useState(false);
  const [tempPhone, setTempPhone] = useState(ownerDetails.phone || '');
  const [tempEmail, setTempEmail] = useState(ownerDetails.email || '');
  const [editError, setEditError] = useState<string | null>(null);

  // Success message after resend
  const [resendNotification, setResendNotification] = useState<string | null>(null);

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
  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isCodeComplete || isLocked) return;

    // Check if 6-digit numeric
    const isCodeNumeric = /^[0-9]{6}$/.test(fullCode);
    dispatch(verifyOtp(fullCode));

    if (isCodeNumeric) {
      // Direct navigation on successful verification without racing in useEffect
      goToStep(4);
    }
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
    setResendNotification(
      `Verification code sent to your ${
        nextChannel === 'SMS' ? 'mobile number' : 'email address'
      }.`
    );
    setTimeout(() => setResendNotification(null), 5000);
  };

  const handleSaveContact = () => {
    setEditError(null);
    const cleanP = tempPhone.replace(/\s+/g, '');
    if (!cleanP || !isValidSriLankaMobile(cleanP)) {
      setEditError('Enter a valid 9-digit mobile number (e.g. 77 123 4567)');
      return;
    }
    if (!tempEmail || !isValidEmail(tempEmail)) {
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
    setResendNotification(
      'Contact updated. A new verification code has been dispatched.'
    );
    setTimeout(() => setResendNotification(null), 5000);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 p-7 sm:p-9 text-center">
        {/* ── Shield Icon Badge ── */}
        <div className="w-14 h-14 rounded-2xl bg-[#e8f0fe] border border-[#d2e3fc] flex items-center justify-center text-[#1a73e8] mx-auto mb-5 shadow-sm">
          <Shield className="w-7 h-7" />
        </div>

        {/* ── Title & Destination ── */}
        <span className="text-[11px] font-bold text-futura-600 tracking-wider uppercase mb-1 block">
          Step 3 of 5
        </span>
        <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
          Verify your identity
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          We&apos;ve sent a 6-digit confirmation code to{' '}
          <span className="font-semibold text-slate-800">{currentDestinationText}</span>.
        </p>

        {/* Resend notification toast */}
        {resendNotification && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium animate-fadeIn">
            {resendNotification}
          </div>
        )}

        {/* Lockout alert */}
        {isLocked && (
          <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2.5 text-left animate-fadeIn">
            <Lock className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>
              Too many invalid attempts. Verification is locked. Please try again in a few minutes.
            </span>
          </div>
        )}

        {/* ── 6-Box OTP Input Grid ── */}
        <div className="mt-6 mb-4">
          <OtpInputGrid
            value={code}
            onChange={(newDigits) => dispatch(setVerificationCode(newDigits))}
            hasError={!!error}
            disabled={isLocked}
          />

          {error && (
            <p className="mt-2 text-xs text-red-600 font-medium flex items-center justify-center gap-1.5 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </p>
          )}

          {!error && !isLocked && attemptsRemaining < 5 && (
            <p className="mt-2 text-xs text-amber-600 font-medium">
              {attemptsRemaining} verification attempt(s) remaining before temporary lockout.
            </p>
          )}
        </div>

        {/* ── Resend Countdown & Channel Switcher ── */}
        <div className="space-y-3 pt-2 text-xs">
          <div className="text-slate-500">
            Didn&apos;t receive the code?{' '}
            {resendCountdown > 0 ? (
              <span className="font-semibold text-slate-700">
                Resend in{' '}
                <span className="text-futura-600 font-mono font-bold">
                  00:{resendCountdown < 10 ? `0${resendCountdown}` : resendCountdown}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isLocked}
                className="font-bold text-futura-600 hover:text-futura-700 underline cursor-pointer disabled:opacity-50"
              >
                Resend Code
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 text-slate-400">
            <button
              type="button"
              onClick={handleSwitchChannel}
              disabled={isLocked}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition font-medium cursor-pointer"
            >
              {channel === 'SMS' ? (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send via Email instead</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Send via SMS instead</span>
                </>
              )}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setTempPhone(ownerDetails.phone || '');
                setTempEmail(ownerDetails.email || '');
                setEditError(null);
                setShowEditContactModal(true);
              }}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 transition font-medium cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit number or email</span>
            </button>
          </div>
        </div>

        {/* ── Submit / Verify Button ── */}
        <div className="pt-8 space-y-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => handleVerify()}
            disabled={!isCodeComplete || isLocked}
            className="w-full bg-futura-500 hover:bg-futura-600 active:bg-futura-700 disabled:opacity-50 text-white font-bold py-3.5 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Verify and Continue</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => goToStep(2)}
            className="w-full text-slate-600 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Company Details</span>
          </Button>
        </div>
      </div>

      {/* Security Note Footer */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>END-TO-END ENCRYPTED VERIFICATION PROTOCOL</span>
        </p>
      </div>

      {/* ── Edit Contact Modal ── */}
      {showEditContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Update Verification Contact
              </h3>
              <button
                type="button"
                onClick={() => setShowEditContactModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editError && (
              <p className="text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                {editError}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number (Sri Lanka)
                </label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden shadow-sm">
                  <span className="px-3 py-2 text-xs font-bold text-slate-500 bg-slate-50 border-r border-slate-200">
                    +94
                  </span>
                  <input
                    type="tel"
                    value={tempPhone}
                    onChange={(e) => setTempPhone(e.target.value)}
                    placeholder="77 123 4567"
                    className="w-full px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  placeholder="owner@company.lk"
                  className="w-full px-3 py-2 text-sm text-slate-900 rounded-lg border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-futura-500/20 focus:border-futura-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowEditContactModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSaveContact}
                className="bg-futura-500 hover:bg-futura-600 text-white"
              >
                Update and Resend
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

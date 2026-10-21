'use client';

import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setStep,
  setVerificationCode,
  setVerificationChannel,
  decrementCountdown,
  resetCountdown,
  verifyOtp,
  updateOwnerDetails,
} from '@/store/slices/ownerOnboardingSlice';
import { OtpInputGrid } from './OtpInputGrid';
import {
  ShieldCheck,
  RotateCcw,
  Mail,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Lock,
  CheckCircle2,
  Edit2,
  X,
} from 'lucide-react';

export const OwnerStep3VerifyOtp: React.FC = () => {
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextStep = () => {
    // When verification succeeds, move to Review / Step 4
    dispatch(setStep(4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden p-6 sm:p-10">
      {/* ── Top Icon Badge ── */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-futura-50 border border-futura-100 flex items-center justify-center text-futura-600 mb-4 shadow-sm">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verify your account
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-md leading-relaxed">
          We sent a 6-digit verification code to{' '}
          <span className="font-bold text-slate-800">{currentDestinationText}</span>. Enter it below to secure your identity.
        </p>

        {/* Demo Code Helper */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
          <span>Demo verification code:</span>
          <span className="font-mono font-bold text-futura-600">123456</span>
        </div>
      </div>

      {/* ── Resend Notification Toast ── */}
      {resendNotification && (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{resendNotification}</span>
        </div>
      )}

      {/* ── Verified State Banner ── */}
      {isVerified ? (
        <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold text-emerald-900">
            Identity Verified Successfully!
          </h3>
          <p className="text-xs text-emerald-700 max-w-sm mx-auto">
            Your identity has been authenticated. You can now proceed to review your company registration and complete onboarding.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleNextStep}
              className="py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2 mx-auto cursor-pointer"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
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
              <p className="text-xs font-medium text-slate-500">
                Didn&apos;t receive the code? Resend in{' '}
                <span className="font-bold text-slate-800 font-mono">
                  {formatTimer(resendCountdown)}
                </span>
              </p>
            ) : (
              <div className="flex items-center justify-center gap-2 text-xs">
                <span className="text-slate-500">Didn&apos;t receive a code?</span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLocked}
                  className="font-bold text-futura-600 hover:text-futura-700 underline focus:outline-none cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Resend code</span>
                </button>
              </div>
            )}
          </div>

          {/* ── Alternative Channels & Contact Info Box ── */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2.5 text-xs text-slate-700">
            {/* Switch Channel */}
            <button
              type="button"
              onClick={handleSwitchChannel}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white transition text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                {channel === 'SMS' ? (
                  <Mail className="w-4 h-4 text-futura-600" />
                ) : (
                  <Smartphone className="w-4 h-4 text-futura-600" />
                )}
                <span className="font-medium group-hover:text-slate-900">
                  {channel === 'SMS'
                    ? `Send code to my email instead (${getMaskedEmail(ownerDetails.email || 'owner@company.lk')})`
                    : `Send code via SMS instead (${getMaskedPhone(ownerDetails.phone || '771234567')})`}
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Edit Contact Number */}
            <button
              type="button"
              onClick={() => {
                setTempPhone(ownerDetails.phone || '');
                setTempEmail(ownerDetails.email || '');
                setShowEditContactModal(true);
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white transition text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <Edit2 className="w-4 h-4 text-slate-500" />
                <span className="font-medium group-hover:text-slate-900">
                  Use a different phone number or email
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* ── Action Buttons ── */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="py-3.5 px-6 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={!isCodeComplete || isLocked}
              className="flex-1 py-3.5 px-6 rounded-xl bg-futura-500 hover:bg-futura-600 active:bg-futura-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm tracking-wide shadow-lg shadow-futura-500/25 transition duration-150 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Verify and continue</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* ── End-to-End Encrypted Verification Note ── */}
          <div className="pt-4 text-center border-t border-slate-100">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-slate-400">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>END-TO-END ENCRYPTED VERIFICATION</span>
            </div>
          </div>
        </form>
      )}

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
    </div>
  );
};

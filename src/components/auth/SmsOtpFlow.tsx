'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, ShieldCheck, RefreshCw, AlertCircle, Phone, CheckCircle2 } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { loginStart, loginSuccess, loginFailure } from '@/store/slices/authSlice';

interface SmsOtpFlowProps {
  initialPhone?: string;
  onBackToPassword: () => void;
  redirectPath?: string;
}

export const SmsOtpFlow: React.FC<SmsOtpFlowProps> = ({
  initialPhone = '',
  onBackToPassword,
  redirectPath = '/',
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Step: 'enter-phone' | 'enter-otp'
  const [step, setStep] = useState<'enter-phone' | 'enter-otp'>('enter-phone');
  const [countryCode, setCountryCode] = useState('+94'); // Default Sri Lanka
  const [phoneNumber, setPhoneNumber] = useState(
    initialPhone.replace(/^\+94/, '').replace(/^0/, '')
  );
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // OTP state (6 digits)
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Timers: Resend (45s), Expiry (180s)
  const [resendCooldown, setResendCooldown] = useState(45);
  const [expiryCountdown, setExpiryCountdown] = useState(180);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer effect for countdowns
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (step === 'enter-otp') {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        setExpiryCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step]);

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === 'enter-otp') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  const fullPhoneNumber = `${countryCode} ${phoneNumber.trim()}`;

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\s+/g, '');

    if (!cleanNumber) {
      setPhoneError('Please enter your mobile phone number');
      return;
    }
    if (cleanNumber.length < 7 || cleanNumber.length > 12) {
      setPhoneError('Please enter a valid 7 to 10 digit mobile number');
      return;
    }

    setPhoneError(null);
    setIsSending(true);

    // Simulate sending OTP SMS with realistic latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsSending(false);
    setResendCooldown(45);
    setExpiryCountdown(180);
    setOtp(['', '', '', '', '', '']);
    setOtpError(null);
    setStep('enter-otp');
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setIsSending(true);
    setOtpError(null);

    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSending(false);
    setResendCooldown(45);
    setExpiryCountdown(180);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleanVal = value.replace(/[^0-9]/g, '');

    const newOtp = [...otp];

    if (cleanVal.length > 1) {
      // Handles multi-character typing or pasting into single box
      const chars = cleanVal.slice(0, 6).split('');
      chars.forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextFocus = Math.min(index + chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      if (newOtp.every((d) => d !== '')) {
        validateAndSubmitOtp(newOtp.join(''));
      }
      return;
    }

    newOtp[index] = cleanVal;
    setOtp(newOtp);
    if (otpError) setOtpError(null);

    // Auto-advance focus to next input
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (cleanVal && index === 5 && newOtp.every((d) => d !== '')) {
      validateAndSubmitOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous box on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);

    const targetFocus = Math.min(pastedData.length, 5);
    inputRefs.current[targetFocus]?.focus();

    if (pastedData.length === 6) {
      validateAndSubmitOtp(pastedData);
    }
  };

  const validateAndSubmitOtp = async (codeToVerify: string) => {
    if (codeToVerify.length !== 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    if (expiryCountdown <= 0) {
      setOtpError('This verification code has expired. Please click "Resend Code".');
      return;
    }

    setIsVerifying(true);
    setOtpError(null);
    dispatch(loginStart());

    // Simulated verification delay
    await new Promise((resolve) => setTimeout(resolve, 700));

    // For testing: '000000' can simulate an invalid OTP, while '123456' or any other 6 digits succeeds
    if (codeToVerify === '000000') {
      setIsVerifying(false);
      setOtpError('Invalid verification code. Please check your SMS or try again.');
      dispatch(loginFailure('Invalid OTP code.'));
      return;
    }

    // Authenticate site worker successfully
    const cleanPhone = `${countryCode}${phoneNumber.replace(/\s+/g, '')}`;
    dispatch(
      loginSuccess({
        user: {
          id: 'cms_worker_' + Math.random().toString(36).substring(2, 8),
          email: `${cleanPhone.replace('+', '')}@worker.futura.lk`,
          fullName: 'Site Worker (' + cleanPhone + ')',
          role: 'SITE_SUPERVISOR',
          phone: cleanPhone,
        },
        token: 'cms_otp_auth_token_' + Date.now(),
      })
    );

    setIsVerifying(false);
    router.push(redirectPath);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Back button */}
      <button
        type="button"
        onClick={onBackToPassword}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition -mt-2 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Password Sign In</span>
      </button>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-futura-50 text-futura-600 text-[11px] font-bold tracking-wide uppercase mb-2 border border-futura-200">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Passwordless SMS Sign-In</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {step === 'enter-phone' ? 'Sign in with SMS' : 'Enter 6-Digit Code'}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          {step === 'enter-phone'
            ? 'We will send a one-time verification code directly to your mobile phone.'
            : `Enter the 6-digit code sent to ${fullPhoneNumber}`}
        </p>
      </div>

      {/* STEP 1: Phone Number Input */}
      {step === 'enter-phone' && (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Mobile Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-28 px-3 py-2.5 text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:border-futura-500 focus:ring-2 focus:ring-futura-100"
              >
                <option value="+94">🇱🇰 +94</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
                <option value="+65">🇸🇬 +65</option>
                <option value="+61">🇦🇺 +61</option>
              </select>

              <div className="relative flex-1">
                <input
                  type="tel"
                  placeholder="77 123 4567"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  autoFocus
                  className={`w-full px-3.5 py-2.5 text-sm font-medium rounded-xl border transition focus:outline-none focus:ring-2 ${
                    phoneError
                      ? 'border-red-400 focus:border-red-500 focus:ring-red-100 text-red-900'
                      : 'border-slate-300 focus:border-futura-500 focus:ring-futura-100 text-slate-900'
                  }`}
                />
              </div>
            </div>
            {phoneError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{phoneError}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-futura-500/25 transition flex items-center justify-center gap-2 text-sm disabled:opacity-60"
          >
            {isSending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Sending Code...</span>
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4" />
                <span>Send Verification Code</span>
              </>
            )}
          </button>

          {/* Quick Demo Hint */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2">
            <span className="text-futura-500 font-bold">TIP:</span>
            <span>
              Enter any valid phone number (e.g. <strong className="text-slate-800">771234567</strong>) to test the OTP flow. Demo code is <strong className="text-futura-600">123456</strong>.
            </span>
          </div>
        </form>
      )}

      {/* STEP 2: 6-Digit OTP Code Input */}
      {step === 'enter-otp' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Code sent to {fullPhoneNumber}</span>
            <button
              type="button"
              onClick={() => setStep('enter-phone')}
              className="text-futura-600 hover:text-futura-700 font-semibold hover:underline"
            >
              Edit Number
            </button>
          </div>

          {/* 6 Digit Inputs */}
          <div className="space-y-2">
            <div className="flex justify-between gap-1.5 sm:gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border transition focus:outline-none focus:ring-2 shadow-sm ${
                    otpError
                      ? 'border-red-400 text-red-700 focus:border-red-500 focus:ring-red-100 bg-red-50/30'
                      : digit
                      ? 'border-futura-500 text-slate-900 bg-futura-50/20 focus:ring-futura-100'
                      : 'border-slate-300 text-slate-900 focus:border-futura-500 focus:ring-futura-100 bg-white'
                  }`}
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-red-600 font-medium flex items-center gap-1 animate-fadeIn pt-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{otpError}</span>
              </p>
            )}
          </div>

          {/* Code Expiry Status & Resend */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <div className="text-slate-500">
              {expiryCountdown > 0 ? (
                <span>
                  Code expires in{' '}
                  <strong className="text-slate-700 font-semibold">
                    {formatTime(expiryCountdown)}
                  </strong>
                </span>
              ) : (
                <span className="text-rose-600 font-semibold">Code expired</span>
              )}
            </div>

            <div>
              {resendCooldown > 0 ? (
                <span className="text-slate-400">
                  Resend in <span className="font-semibold">{resendCooldown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSending}
                  className="text-futura-600 hover:text-futura-700 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isSending ? 'animate-spin' : ''}`} />
                  <span>Resend Code</span>
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={() => validateAndSubmitOtp(otp.join(''))}
            disabled={isVerifying || otp.some((d) => d === '')}
            className="w-full bg-futura-500 hover:bg-futura-600 active:bg-futura-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-futura-500/25 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Sign In</span>
              </>
            )}
          </button>

          {/* Demo Code Helper */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-700">DEMO CODE:</span>
              <code className="px-1.5 py-0.5 bg-white rounded border border-amber-300 font-mono font-bold text-amber-900">
                123456
              </code>
            </div>
            <button
              type="button"
              onClick={() => {
                setOtp(['1', '2', '3', '4', '5', '6']);
                validateAndSubmitOtp('123456');
              }}
              className="text-xs font-bold text-futura-600 hover:text-futura-700 underline"
            >
              Auto-fill & Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmsOtpFlow;

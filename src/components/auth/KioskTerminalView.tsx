'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Monitor, ArrowLeft, Radio, CheckCircle2, AlertCircle, Clock, ShieldCheck, UserCheck } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { loginSuccess } from '@/store/slices/authSlice';
import { FuturaLogo } from './FuturaLogo';

interface KioskTerminalViewProps {
  onExit: () => void;
  redirectPath?: string;
}

export const KioskTerminalView: React.FC<KioskTerminalViewProps> = ({
  onExit,
  redirectPath = '/',
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [pin, setPin] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'info' | 'success' | 'error' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBackspace = React.useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setStatusMessage(null);
  }, []);

  const handleClear = () => {
    setPin('');
    setStatusMessage(null);
  };

  const handlePinSubmit = React.useCallback(
    async (pinToVerify: string) => {
      if (pinToVerify.length < 4) {
        setStatusMessage({ text: 'PIN must be at least 4 digits.', type: 'error' });
        return;
      }

      setIsProcessing(true);
      setStatusMessage({ text: 'Authenticating terminal credentials...', type: 'info' });

      await new Promise((resolve) => setTimeout(resolve, 600));

      // Test fail PIN: '0000'
      if (pinToVerify === '0000') {
        setIsProcessing(false);
        setPin('');
        setStatusMessage({ text: 'Access Denied: Invalid Terminal PIN.', type: 'error' });
        return;
      }

      // Success authentication
      dispatch(
        loginSuccess({
          user: {
            id: 'cms_kiosk_operator_04',
            email: 'terminal04@portcity.futura.lk',
            fullName: 'Site Terminal Operator (Gate 2)',
            role: 'SITE_SUPERVISOR',
          },
          token: 'cms_kiosk_token_' + Date.now(),
        })
      );

      setStatusMessage({
        text: 'Verified: Terminal Session Opened (Gate 2)',
        type: 'success',
      });

      setTimeout(() => {
        router.push(redirectPath);
      }, 400);
    },
    [dispatch, redirectPath, router]
  );

  const handleKeyPress = React.useCallback(
    (num: string) => {
      setPin((prev) => {
        if (prev.length >= 6) return prev;
        const newPin = prev + num;
        setStatusMessage(null);
        if (newPin.length === 4 || newPin.length === 6) {
          handlePinSubmit(newPin);
        }
        return newPin;
      });
    },
    [handlePinSubmit]
  );

  // Listen to keyboard digits
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        setPin((current) => {
          if (current.length >= 4) handlePinSubmit(current);
          return current;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBackspace, handleKeyPress, handlePinSubmit]);


  const handleRfidTap = async () => {
    setIsProcessing(true);
    setStatusMessage({ text: 'Scanning RFID Badge Card...', type: 'info' });

    await new Promise((resolve) => setTimeout(resolve, 800));

    dispatch(
      loginSuccess({
        user: {
          id: 'cms_rfid_worker_8921',
          email: 'worker8921@futura.lk',
          fullName: 'Sunil Perera (Site ID: FTR-8921)',
          role: 'SITE_SUPERVISOR',
        },
        token: 'cms_rfid_token_' + Date.now(),
      })
    );

    setStatusMessage({
      text: 'Badge Verified: Sunil Perera — Clock In Recorded!',
      type: 'success',
    });

    setTimeout(() => {
      router.push(redirectPath);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c121e] text-white flex flex-col justify-between p-4 sm:p-8 overflow-y-auto animate-fadeIn">

      {/* Top Bar: Terminal ID & Exit button */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <FuturaLogo size="md" theme="dark" />
          <div className="hidden sm:block w-[1px] h-6 bg-slate-800" />
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-futura-500/10 border border-futura-500/30 text-futura-400 text-xs font-bold tracking-wider uppercase">
            <Monitor className="w-3.5 h-3.5" />
            <span>KIOSK HARDWARE TERMINAL</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Kiosk Mode</span>
        </button>
      </div>

      {/* Main Terminal Body */}
      <div className="relative z-10 my-auto py-6 max-w-xl mx-auto w-full">
        {/* Live Clock & Site Information Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-futura-400 font-semibold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>SITE TERMINAL #04 • COLOMBO PORT CITY PROJECT</span>
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight text-white mt-1">
            {currentTime || '08:30:00 AM'}
          </div>
          <div className="text-xs uppercase font-medium tracking-widest text-slate-400 mt-1">
            {currentDate}
          </div>
        </div>

        {/* PIN Display */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-5">
            <h2 className="text-lg font-bold text-white tracking-wide">
              Quick PIN or Badge Sign-In
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your 4-digit staff PIN or tap employee site card
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-3 mb-6">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  pin.length > idx
                    ? 'bg-futura-500 border-futura-500 scale-125 shadow-lg shadow-futura-500/50'
                    : 'border-slate-700 bg-slate-800/60'
                }`}
              />
            ))}
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`mb-5 p-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 animate-fadeIn ${
                statusMessage.type === 'error'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : statusMessage.type === 'success'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-futura-500/20 text-futura-300 border border-futura-500/30'
              }`}
            >
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4" />}
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {statusMessage.type === 'info' && <Radio className="w-4 h-4 animate-spin" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Touchscreen Numpad Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                disabled={isProcessing}
                className="h-14 sm:h-16 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:bg-futura-600 active:scale-95 text-xl font-bold text-white border border-slate-700/80 transition shadow-sm flex items-center justify-center select-none"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              disabled={isProcessing || !pin}
              className="h-14 sm:h-16 rounded-xl bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-xs font-bold uppercase tracking-wider text-slate-400 border border-slate-800 transition flex items-center justify-center select-none disabled:opacity-40"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              disabled={isProcessing}
              className="h-14 sm:h-16 rounded-xl bg-slate-800/80 hover:bg-slate-700 active:bg-futura-600 active:scale-95 text-xl font-bold text-white border border-slate-700/80 transition shadow-sm flex items-center justify-center select-none"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              disabled={isProcessing || !pin}
              className="h-14 sm:h-16 rounded-xl bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-xs font-bold uppercase tracking-wider text-slate-400 border border-slate-800 transition flex items-center justify-center select-none disabled:opacity-40"
            >
              ⌫ Del
            </button>
          </div>

          {/* RFID Site Badge Tap Option */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleRfidTap}
              disabled={isProcessing}
              className="w-full max-w-xs mx-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition shadow-sm group"
            >
              <Radio className="w-4 h-4 text-futura-400 group-hover:animate-pulse" />
              <span>Simulate RFID Site Badge Tap</span>
            </button>
          </div>
        </div>

        {/* Demo Helper */}
        <div className="text-center mt-4">
          <p className="text-[11px] text-slate-500">
            Kiosk Demo PIN: <code className="text-futura-400 font-bold">1234</code> or tap RFID badge button above
          </p>
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Terminal Status: Synchronized & Online</span>
        </div>
        <div>Futura CMS Kiosk Firmware v2.4 • Offline Local Cache Ready</div>
      </div>
    </div>
  );
};

export default KioskTerminalView;

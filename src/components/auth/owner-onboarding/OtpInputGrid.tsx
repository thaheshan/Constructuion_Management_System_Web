'use client';

import React, { useRef, useEffect } from 'react';

interface OtpInputGridProps {
  value: string[];
  onChange: (digits: string[]) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export const OtpInputGrid: React.FC<OtpInputGridProps> = ({
  value,
  onChange,
  hasError = false,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount if empty
  useEffect(() => {
    if (!disabled && inputRefs.current[0] && value.every((d) => !d)) {
      inputRefs.current[0].focus();
    }
  }, [disabled, value]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Move back to previous and clear it
        const nextDigits = [...value];
        nextDigits[index - 1] = '';
        onChange(nextDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const nextDigits = [...value];
        nextDigits[index] = '';
        onChange(nextDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const val = e.target.value;
    // Extract only digits
    const cleanDigit = val.replace(/\D/g, '').slice(-1);

    const nextDigits = [...value];
    nextDigits[index] = cleanDigit;
    onChange(nextDigits);

    // Auto advance if digit entered
    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();

    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const nextDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < pastedData.length; i++) {
      nextDigits[i] = pastedData[i];
    }
    onChange(nextDigits);

    // Focus on next box or last box
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          aria-label={`Digit ${index + 1}`}
          className={`w-11 h-13 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border transition-all duration-150 focus:outline-none ${
            hasError
              ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-2 focus:ring-red-400'
              : 'border-slate-300 bg-white text-slate-900 focus:border-futura-500 focus:ring-2 focus:ring-futura-500/20 shadow-sm'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'hover:border-slate-400'}`}
        />
      ))}
    </div>
  );
};

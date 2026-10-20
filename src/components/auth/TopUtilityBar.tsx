'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Globe, ChevronDown, HelpCircle, Check, Wifi, WifiOff } from 'lucide-react';

export type LanguageCode = 'en' | 'si' | 'ta';

interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'EN' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල (SI)' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ் (TA)' },
];

interface TopUtilityBarProps {
  variant?: 'desktop' | 'mobile-top' | 'mobile-card';
  onOpenHelp?: () => void;
  className?: string;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  variant = 'desktop',
  onOpenHelp,
  className = '',
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  // Mobile Top variant: Globe + EN + Help inside top dark navbar
  if (variant === 'mobile-top') {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        {/* Language dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-sm transition border border-white/10"
            aria-label="Select language"
            aria-expanded={dropdownOpen}
          >
            <Globe className="w-3.5 h-3.5 text-white/80" />
            <span className="uppercase">{activeLangObj.code}</span>
            <ChevronDown className="w-3 h-3 text-white/60" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-slate-900/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-700/80 py-1.5 z-50 animate-fadeIn">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center justify-between text-slate-200 hover:bg-white/10 transition"
                >
                  <span className="font-medium">{lang.label}</span>
                  {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-futura-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-[1px] h-3.5 bg-white/20" />

        {/* Help icon button */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition border border-white/10"
          aria-label="Help Center"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // Mobile Card variant: Inside the white card top (Online status on left, English button on right)
  if (variant === 'mobile-card') {
    return (
      <div className={`flex items-center justify-between w-full select-none ${className}`}>
        {/* Online Status Pill */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
            isOnline
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
              : 'bg-red-50 text-red-700 border border-red-200/60'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
            }`}
          />
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Language selector button */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="uppercase tracking-wider">{activeLangObj.label}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setCurrentLang(lang.code);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center justify-between text-slate-700 hover:bg-slate-50 transition"
                >
                  <span className="font-medium">{lang.label}</span>
                  {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-futura-500" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop variant: Top right of screen: System Online pill + Language + Help button
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Online Status Badge */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border transition ${
          isOnline
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
            : 'bg-rose-50 text-rose-700 border-rose-200/80'
        }`}
        title={isOnline ? 'Network connection active' : 'Network offline - local caching active'}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
          }`}
        />
        <span>{isOnline ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}</span>
      </div>

      {/* Language Selector Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-expanded={dropdownOpen}
          aria-label="Change language"
        >
          <Globe className="w-4 h-4 text-slate-600" />
          <span className="font-bold tracking-wider uppercase">{activeLangObj.code}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-100 mb-1">
              Select Language
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setCurrentLang(lang.code);
                  setDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-xs flex items-center justify-between text-slate-700 hover:bg-slate-50 transition"
              >
                <div>
                  <div className="font-medium">{lang.label}</div>
                  <div className="text-[10px] text-slate-400">{lang.nativeLabel}</div>
                </div>
                {currentLang === lang.code && <Check className="w-4 h-4 text-futura-500" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Help Circle Button */}
      <button
        type="button"
        onClick={onOpenHelp}
        className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        title="Help Center & Emergency Support"
        aria-label="Help Center"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default TopUtilityBar;

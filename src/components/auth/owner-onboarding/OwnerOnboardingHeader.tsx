'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, HelpCircle, ChevronDown, Check, X, Phone, Mail } from 'lucide-react';

export const OwnerOnboardingHeader: React.FC = () => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'SI' | 'TA'>('EN');
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <>
      <header className="bg-[#131c2e] text-white border-b border-slate-800/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/login" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-futura-500 rounded-lg p-1">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#1a253a] border border-slate-700/60 flex items-center justify-center p-1.5 shadow-sm group-hover:border-futura-500/50 transition">
              <Image
                src="/images/Background.png"
                alt="Futura Constructions Helmet Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-white uppercase group-hover:text-futura-400 transition">
                FUTURA CONSTRUCTIONS
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
                BUILDING SRI LANKA&apos;S FUTURE
              </span>
            </div>
          </Link>

          {/* Right Utilities */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* System Online Badge */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-futura-500"
                aria-label="Select Language"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang('EN');
                      setLangDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center justify-between text-slate-200 hover:bg-slate-800 transition"
                  >
                    <span>English (EN)</span>
                    {currentLang === 'EN' && <Check className="w-3.5 h-3.5 text-futura-500" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang('SI');
                      setLangDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center justify-between text-slate-200 hover:bg-slate-800 transition"
                  >
                    <span>සිංහල (SI)</span>
                    {currentLang === 'SI' && <Check className="w-3.5 h-3.5 text-futura-500" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLang('TA');
                      setLangDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left flex items-center justify-between text-slate-200 hover:bg-slate-800 transition"
                  >
                    <span>தமிழ் (TA)</span>
                    {currentLang === 'TA' && <Check className="w-3.5 h-3.5 text-futura-500" />}
                  </button>
                </div>
              )}
            </div>

            {/* Help Button */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-futura-500"
              title="Help & Support"
              aria-label="Help & Support"
            >
              <HelpCircle className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Futura Registration Help
            </h3>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Need assistance creating your Master Owner account or entering company details? Our support team in Colombo is here to assist you.
            </p>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone className="w-4 h-4 text-futura-500 flex-shrink-0" />
                <span className="font-medium">+94 11 234 5678 (Hotline)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Mail className="w-4 h-4 text-futura-500 flex-shrink-0" />
                <span className="font-medium">support@futura.lk</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-futura-500 hover:bg-futura-600 text-white font-bold text-sm transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

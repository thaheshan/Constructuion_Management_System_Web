'use client';

import React from 'react';
import Link from 'next/link';
import { BookmarkCheck, X, ArrowRight, ArrowLeft } from 'lucide-react';

interface SaveDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedTime?: string | null;
}

export const SaveDraftModal: React.FC<SaveDraftModalProps> = ({
  isOpen,
  onClose,
  savedTime,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
          <BookmarkCheck className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Progress Saved Successfully
        </h3>

        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          Your company details and personal information have been safely saved as a draft. You can close this tab and return whenever you are ready.
        </p>

        {savedTime && (
          <p className="text-xs text-slate-400 mb-6 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            Last saved at: <span className="font-semibold text-slate-600">{new Date(savedTime).toLocaleTimeString()}</span>
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-sm font-bold transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Keep Editing</span>
          </button>
          <Link
            href="/login"
            className="flex-1 py-3 px-4 rounded-xl bg-futura-500 hover:bg-futura-600 text-white text-sm font-bold transition flex items-center justify-center gap-2 shadow-md shadow-futura-500/20"
          >
            <span>Exit to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { X, Headphones, Shield, FileText, Phone, Mail, ExternalLink } from 'lucide-react';

export type SupportModalType = 'help' | 'privacy' | 'legal';

interface SupportModalProps {
  type: SupportModalType | null;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'help' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-futura-50 border border-futura-100 flex items-center justify-center text-futura-600">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Futura Help Center</h3>
                <p className="text-xs text-slate-500">24/7 Site Support & Operations Desk</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <Phone className="w-5 h-5 text-futura-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Construction Site Emergency Hotline</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">+94 11 234 5678 / +94 77 999 0000</p>
                  <p className="text-[11px] text-slate-400 mt-1">Available 24 hours across all active construction sites</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <Mail className="w-5 h-5 text-futura-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">IT Systems & Credentials Support</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-mono">support@futura.lk</p>
                  <p className="text-[11px] text-slate-400 mt-1">For password resets, badge assignments & RBAC issues</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Close Help Center
              </button>
            </div>
          </div>
        )}

        {type === 'privacy' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Privacy Policy</h3>
                <p className="text-xs text-slate-500">Data protection & site telemetry standards</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-60 overflow-y-auto pr-2">
              <p>
                <strong>1. Site Data & GPS Telemetry:</strong> Futura Constructions collects geolocation timestamps and biometric/PIN attendance solely for site safety, labor compliance, and payroll verification.
              </p>
              <p>
                <strong>2. Offline Sync Privacy:</strong> Offline logs stored on site tablets or kiosk devices are encrypted with AES-256 before synchronization to central enterprise servers.
              </p>
              <p>
                <strong>3. Access Controls:</strong> Strict Role-Based Access Control (RBAC) ensures financial records, burn rates, and personal worker logs are restricted to authorized personnel.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Accept & Close
              </button>
            </div>
          </div>
        )}

        {type === 'legal' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Legal & Compliance Notice</h3>
                <p className="text-xs text-slate-500">Construction industry governance</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-60 overflow-y-auto pr-2">
              <p>
                <strong>Audit Compliance:</strong> All digital entries, material requisitions, and site logs generated in the Futura Construction Management System constitute legally binding construction operational records.
              </p>
              <p>
                <strong>Authorized Use Only:</strong> Accessing this system with unauthorized credentials or sharing PIN/badges violates site safety guidelines and is subject to disciplinary action.
              </p>
              <p>
                © 2026 Futura Constructions PLC. All rights reserved. Registered under Construction Industry Development Authority (CIDA).
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
              >
                Close Notice
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportModal;

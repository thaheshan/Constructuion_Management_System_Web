import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export interface AuthCardProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  error?: string | null;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> & {
  Header: typeof AuthCardHeader;
  Body: typeof AuthCardBody;
  Footer: typeof AuthCardFooter;
} = ({
  title = 'Quick Stop Portal',
  subtitle = 'Sign in with your corporate credentials to continue',
  badge = 'Quick Stop Auth',
  error,
  children,
  footer,
  className = '',
}) => {
  return (
    <div
      className={`w-full max-w-md mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-6 sm:p-8 transition-all ${className}`}
    >
      <AuthCardHeader title={title} subtitle={subtitle} badge={badge} />

      {error && (
        <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-700 text-xs font-medium animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      <AuthCardBody>{children}</AuthCardBody>

      {footer && <AuthCardFooter>{footer}</AuthCardFooter>}
    </div>
  );
};

export const AuthCardHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: string;
}> = ({ title, subtitle, badge }) => {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/30 mb-3.5">
        <ShieldCheck className="w-6 h-6" />
      </div>
      {badge && (
        <div>
          <span className="inline-block px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-700 bg-primary-50 rounded-full border border-primary-200/60 mb-2">
            {badge}
          </span>
        </div>
      )}
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">{subtitle}</p>}
    </div>
  );
};

export const AuthCardBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};

export const AuthCardFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
      {children}
    </div>
  );
};

AuthCard.Header = AuthCardHeader;
AuthCard.Body = AuthCardBody;
AuthCard.Footer = AuthCardFooter;

export default AuthCard;

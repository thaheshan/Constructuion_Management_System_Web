import './globals.css';
import React from 'react';
import StoreProvider from '@/store/provider';
import SplashScreen from '@/components/splash-screen/SplashScreen';

export const metadata = {
  title: 'Construction Management System (CMS) — Portal',
  description: 'Enterprise Construction Management System with Redux & RBAC Authentication',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        <StoreProvider>
          <SplashScreen>{children}</SplashScreen>
        </StoreProvider>
      </body>
    </html>
  );
}


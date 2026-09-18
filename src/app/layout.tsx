import './globals.css';
import React from 'react';
import StoreProvider from '@/store/provider';

export const metadata = {
  title: 'Quick Stop - Construction Management Portal',
  description: 'Quick Stop enterprise frontend platform with Redux & Authentication',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}


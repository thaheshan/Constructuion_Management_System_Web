import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Sri Lanka Construction Management System',
  description: 'Comprehensive ERP for Sri Lankan Construction Industry',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

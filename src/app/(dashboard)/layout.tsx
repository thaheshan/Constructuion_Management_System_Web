import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">Owner Dashboard & Control Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full">
              IRD Tax Mode Ready
            </span>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Sunil Perera</p>
              <p className="text-xs text-slate-500">Construction Owner</p>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

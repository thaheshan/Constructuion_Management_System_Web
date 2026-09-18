import React from 'react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/projects' },
    { label: 'Inventory & Stock', href: '/inventory' },
    { label: 'Labour & Attendance', href: '/labour' },
    { label: 'Salary & Payroll', href: '/payroll' },
    { label: 'Credit & Financials', href: '/finance' },
    { label: 'Sri Lanka Tax (IRD)', href: '/tax' },
    { label: 'Reports & Analytics', href: '/reports' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-black text-white shadow-sm">QS</div>
          <div>
            <span className="font-bold text-base tracking-wide block leading-tight">QUICK STOP</span>
            <span className="text-[10px] text-primary-300 font-semibold tracking-wider uppercase">Management Portal</span>
          </div>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-xs">
        <p className="font-semibold text-slate-200">Sri Lanka Edition 2026</p>
        <p className="text-slate-400 mt-0.5">VAT 18% | EPF/ETF Compliant</p>
      </div>
    </aside>
  );
};

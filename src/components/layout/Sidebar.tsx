'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Receipt, 
  Boxes, 
  Users, 
  CreditCard, 
  DollarSign, 
  BarChart3 
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', href: '/', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Projects', href: '/projects', icon: <FolderKanban className="w-4 h-4" /> },
    { label: 'Sri Lanka Tax (IRD)', href: '/tax', icon: <Receipt className="w-4 h-4" /> },
    { label: 'Inventory & Stock', href: '#', icon: <Boxes className="w-4 h-4" />, comingSoon: true },
    { label: 'Labour & Attendance', href: '#', icon: <Users className="w-4 h-4" />, comingSoon: true },
    { label: 'Salary & Payroll', href: '#', icon: <DollarSign className="w-4 h-4" />, comingSoon: true },
    { label: 'Credit & Financials', href: '#', icon: <CreditCard className="w-4 h-4" />, comingSoon: true },
    { label: 'Reports & Analytics', href: '#', icon: <BarChart3 className="w-4 h-4" />, comingSoon: true },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="flex items-center gap-2.5 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center font-black text-white shadow-sm">CMS</div>
          <div>
            <span className="font-bold text-base tracking-wide block leading-tight">CONSTRUCTION</span>
            <span className="text-[10px] text-primary-300 font-semibold tracking-wider uppercase">Management System</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            if (item.comingSoon) {
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 cursor-not-allowed select-none group"
                  title="Module coming in future release"
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60">
                    Soon
                  </span>
                </div>
              );
            }

            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-xs">
        <p className="font-semibold text-slate-200">Sri Lanka Edition 2026</p>
        <p className="text-slate-400 mt-0.5">VAT 18% | EPF/ETF Compliant</p>
      </div>
    </aside>
  );
};

export default Sidebar;

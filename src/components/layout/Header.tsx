'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export const Header: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-bold text-slate-800">Quick Stop — Management Control Panel</h1>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
          <Shield className="w-3 h-3 text-emerald-600" />
          Protected Route Active
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-100 border border-primary-200 flex items-center justify-center text-primary-700 font-bold text-sm">
            {(user?.name || user?.fullName) ? (user.name || user.fullName)!.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.name || user?.fullName || 'Authenticated User'}
            </p>
            <p className="text-xs text-slate-500 capitalize">
              {user?.role ? String(user.role).toLowerCase() : 'Staff Member'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          title="Sign out of Quick Stop"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

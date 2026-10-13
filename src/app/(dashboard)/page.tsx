'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { useAppSelector } from '@/store/hooks';
import { CheckCircle2, ShieldCheck, Database, Layers } from 'lucide-react';

export default function OwnerDashboardPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      {/* CMS Architecture & Auth Integration Status Banner */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              CMS Operational Dashboard
            </div>
            <h2 className="text-xl md:text-2xl font-bold">
              Welcome, {user?.fullName || 'Administrator'}
            </h2>
            <p className="text-xs md:text-sm text-slate-300">
              Signed in as <span className="font-semibold text-white">{user?.email || 'N/A'}</span> ({user?.role || 'STAFF'}).
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary-300" />
              <div>
                <span className="text-[10px] text-slate-400 block">Redux Store</span>
                <span className="font-semibold">{isAuthenticated ? 'Connected' : 'Idle'}</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <div>
                <span className="text-[10px] text-slate-400 block">Route Access</span>
                <span className="font-semibold">{isAuthenticated ? 'Granted' : 'Restricted'}</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-300" />
              <div>
                <span className="text-[10px] text-slate-400 block">RBAC Role</span>
                <span className="font-semibold">{user?.role || 'STAFF'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Active Projects" className="border-l-4 border-l-primary-600">
          <p className="text-3xl font-black text-slate-900 mt-2">12</p>
          <p className="text-xs text-slate-500 mt-1">3 Milestones Overdue</p>
        </Card>
        <Card title="Today's Workforce" className="border-l-4 border-l-emerald-500">
          <p className="text-3xl font-black text-slate-900 mt-2">184</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">94% Attendance Rate</p>
        </Card>
        <Card title="Receivables Due" className="border-l-4 border-l-amber-500">
          <p className="text-3xl font-black text-slate-900 mt-2">LKR 14.2M</p>
          <p className="text-xs text-amber-600 font-medium mt-1">Client Overdue 30d: LKR 2.1M</p>
        </Card>
        <Card title="IRD Tax Position (YTD)" className="border-l-4 border-l-purple-600">
          <p className="text-3xl font-black text-slate-900 mt-2">LKR 3.8M</p>
          <p className="text-xs text-purple-600 font-medium mt-1">VAT 18% Output Net: LKR 1.4M</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Current Session Profile">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Full Name:</span>
              <span className="font-semibold text-slate-800">{user?.fullName || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Work Email:</span>
              <span className="font-semibold text-slate-800">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Assigned Role:</span>
              <span className="font-semibold text-primary-600">{user?.role || 'STAFF'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Session Status:</span>
              <span className={`font-semibold ${isAuthenticated ? 'text-emerald-600' : 'text-slate-500'}`}>
                {isAuthenticated ? 'Authenticated' : 'Unauthenticated'}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Urgent Action Items">
          <ul className="divide-y divide-slate-100 text-sm">
            <li className="py-3 flex justify-between items-center">
              <span>PO #1042 Cement Order &gt; LKR 50,000 threshold</span>
              <button className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded font-medium hover:bg-primary-700 transition">Approve</button>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>EPF/ETF Monthly Return Due in 3 days</span>
              <button className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded font-medium hover:bg-slate-900 transition">Review</button>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>Galle Highway Site Low Stock: TMT Steel Bars</span>
              <button className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded font-medium hover:bg-amber-700 transition">Reorder</button>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

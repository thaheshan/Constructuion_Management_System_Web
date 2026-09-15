import React from 'react';
import { Card } from '@/components/ui/Card';

export default function OwnerDashboardPage() {
  return (
    <div className="space-y-6">
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
        <Card title="Project Cost vs Actual (LKR)">
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-400 text-sm">
            [Chart: Budgeted vs Actual Spend per Site]
          </div>
        </Card>
        <Card title="Urgent Action Items">
          <ul className="divide-y divide-slate-100 text-sm">
            <li className="py-3 flex justify-between items-center">
              <span>PO #1042 Cement Order &gt; LKR 50,000 threshold</span>
              <button className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded font-medium">Approve</button>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>EPF/ETF Monthly Return Due in 3 days</span>
              <button className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded font-medium">Review</button>
            </li>
            <li className="py-3 flex justify-between items-center">
              <span>Galle Highway Site Low Stock: TMT Steel Bars</span>
              <button className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded font-medium">Reorder</button>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

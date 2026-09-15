import React from 'react';
import { Card } from '@/components/ui/Card';

export default function SriLankaTaxPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-purple-900 text-white p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-black">Sri Lanka IRD Tax Officer Mode</h2>
          <p className="text-sm text-purple-200 mt-1">One-click compliance reporting for Inland Revenue Department audits</p>
        </div>
        <button className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all">
          ⚡ Generate IRD Report (60s)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="VAT 18% Summary">
          <div className="mt-2 text-sm space-y-1">
            <p>Output VAT Collected: <strong>LKR 4,200,000</strong></p>
            <p>Input VAT Deductible: <strong>LKR 2,800,000</strong></p>
            <p className="text-base font-bold text-primary-600 mt-2">Net VAT Payable: LKR 1,400,000</p>
          </div>
        </Card>

        <Card title="EPF (8%+12%) & ETF (3%)">
          <div className="mt-2 text-sm space-y-1">
            <p>EPF Employee (8%): <strong>LKR 320,000</strong></p>
            <p>EPF Employer (12%): <strong>LKR 480,000</strong></p>
            <p>ETF Employer (3%): <strong>LKR 120,000</strong></p>
            <p className="text-xs text-slate-500 mt-2">Due before 15th of next month</p>
          </div>
        </Card>

        <Card title="Progressive Income Tax">
          <div className="mt-2 text-sm space-y-1">
            <p>YTD Taxable Profit: <strong>LKR 18,500,000</strong></p>
            <p>Effective Tax Rate: <strong>24% (Top Bracket)</strong></p>
            <p className="text-base font-bold text-purple-700 mt-2">Est. Tax Liability: LKR 4,440,000</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Project Management</h2>
          <p className="text-sm text-slate-500">Track full project lifecycle from tender to handover</p>
        </div>
        <Button>+ New Project</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Galle Highway Extension" subtitle="Ref: CMS-PRJ-2026-001">
          <div className="mt-2 space-y-2 text-sm text-slate-600">
            <p><strong>Client:</strong> RDA Sri Lanka</p>
            <p><strong>Contract:</strong> LKR 120,000,000</p>
            <p><strong>Stage:</strong> <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded font-semibold">IN_PROGRESS</span></p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-right text-slate-400">65% Completed</p>
          </div>
        </Card>

        <Card title="Kandy Commercial Tower" subtitle="Ref: CMS-PRJ-2026-004">
          <div className="mt-2 space-y-2 text-sm text-slate-600">
            <p><strong>Client:</strong> Prime Group PLC</p>
            <p><strong>Contract:</strong> LKR 350,000,000</p>
            <p><strong>Stage:</strong> <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded font-semibold">PLANNING</span></p>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
            <p className="text-xs text-right text-slate-400">20% Completed</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

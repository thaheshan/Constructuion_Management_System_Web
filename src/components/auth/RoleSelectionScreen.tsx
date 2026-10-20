'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Crown,
  BarChart2,
  Users,
  HardHat,
  Compass,
  Hammer,
  Package,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  CircleCheck,
  ShieldCheck,
  Circle,
  ChevronUp,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────────────────────

interface SubRole {
  id: string;
  label: string;
}

interface RoleCard {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  scope: string;
  subRoles?: SubRole[];
}

// ── Role Data ────────────────────────────────────────────────────────────────

const ROLES: RoleCard[] = [
  {
    id: 'OWNER',
    icon: <Crown className="w-6 h-6" />,
    title: 'Owner',
    description:
      'Full legal and financial responsibility for the enterprise account.',
    tags: ['BILLING', 'LEGAL', 'USERS'],
    scope: 'COMPANY WIDE',
  },
  {
    id: 'PROJECT_MANAGER',
    icon: <BarChart2 className="w-6 h-6" />,
    title: 'Project Manager',
    description: 'Manages timelines, budgets, and overall project delivery metrics.',
    tags: ['SCHEDULES', 'BUDGETING'],
    scope: 'PROJECT SPECIFIC',
  },
  {
    id: 'SITE_SUPERVISOR',
    icon: <HardHat className="w-6 h-6" />,
    title: 'Site Supervisor',
    description: 'Daily on-site operations management and safety compliance.',
    tags: ['SITE LOGS', 'SAFETY'],
    scope: 'JOB SITE',
  },
  {
    id: 'ARCHITECT',
    icon: <Compass className="w-6 h-6" />,
    title: 'Architect',
    description: 'Design oversight, blueprint management, and technical compliance.',
    tags: ['DRAWINGS', 'RFIS'],
    scope: 'DESIGN DEPT',
  },
  {
    id: 'LABOURER',
    icon: <Hammer className="w-6 h-6" />,
    title: 'Labourer',
    description:
      'Direct site work, equipment handling, and task completion reporting.',
    tags: ['TASKS', 'TIMESHEETS'],
    scope: 'FIELD WORKS',
  },
  {
    id: 'ACCOUNTANT',
    icon: <DollarSign className="w-6 h-6" />,
    title: 'Accountant',
    description: 'Handling invoices, payroll, tax documentation, and financial audits.',
    tags: ['INVOICES', 'PAYROLL'],
    scope: 'HQ OFFICE',
  },
  {
    id: 'STORE_KEEPER',
    icon: <Package className="w-6 h-6" />,
    title: 'Store Keeper',
    description:
      'Inventory management, materials receiving, and supply dispatch.',
    tags: ['INVENTORY', 'LOGISTICS'],
    scope: 'WAREHOUSE',
  },
  {
    id: 'STAFF',
    icon: <Users className="w-6 h-6" />,
    title: 'Staff',
    description: 'Administrative and workforce support functions for the HQ.',
    tags: [],
    scope: 'HQ OFFICE',
    subRoles: [
      { id: 'SUPPORT_OPS', label: 'Support Operations' },
      { id: 'WORKFORCE_ADMIN', label: 'Workforce Administration' },
    ],
  },
];

// ── What's Next Card ────────────────────────────────────────────────────────

const NEXT_STEPS = [
  "You'll be asked to verify your professional identity via email or SMS.",
  'A request will be sent to the company Owner or Admin for approval.',
  'Once approved, your dashboard will be populated with relevant project data.',
];

// ── RoleSelectionScreen ──────────────────────────────────────────────────────

export const RoleSelectionScreen: React.FC = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedSubRole, setSelectedSubRole] = useState<string | null>(null);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    const role = ROLES.find((r) => r.id === roleId);
    // Reset sub-role if switching away from STAFF
    if (role?.subRoles && role.subRoles.length > 0) {
      setSelectedSubRole(role.subRoles[0].id);
    } else {
      setSelectedSubRole(null);
    }
  };

  const canContinue =
    selectedRole !== null &&
    (ROLES.find((r) => r.id === selectedRole)?.subRoles
      ? selectedSubRole !== null
      : true);

  const handleContinue = () => {
    if (!canContinue) return;
    const params = new URLSearchParams();
    if (selectedRole) params.set('role', selectedRole);
    if (selectedSubRole) params.set('subRole', selectedSubRole);
    router.push(`/register/create-account?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans">
      {/* ── Page Body ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Back Link */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>

        {/* Heading */}
        <div className="text-center mb-10 lg:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose your role
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2.5 max-w-lg mx-auto leading-relaxed">
            Pick the role that matches your job. Your company Owner confirms it
            before access is activated.
          </p>
        </div>

        {/* ── Role Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.id;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role.id)}
                className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-futura-500 focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'border-futura-500 bg-futura-50 shadow-md shadow-futura-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/60'
                }`}
              >
                {/* Selected checkmark badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <CircleCheck className="w-5 h-5 text-futura-500 fill-futura-500 text-white" />
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-futura-100 text-futura-600'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {role.icon}
                </div>

                {/* Title */}
                <h3 className="text-[15px] font-bold text-slate-900 mb-1">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {role.description}
                </p>

                {/* Tags */}
                {role.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {role.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                          isSelected
                            ? 'bg-futura-100/60 border-futura-200 text-futura-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sub-roles (Staff only) */}
                {role.subRoles && isSelected && (
                  <div className="mt-2 rounded-xl bg-white border border-slate-200 overflow-hidden">
                    {role.subRoles.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubRole(sub.id);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition hover:bg-slate-50 ${
                          sub.id !== role.subRoles![role.subRoles!.length - 1].id
                            ? 'border-b border-slate-100'
                            : ''
                        }`}
                      >
                        {selectedSubRole === sub.id ? (
                          <span className="w-4 h-4 rounded-full bg-futura-500 border-4 border-futura-200 flex-shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                        )}
                        <span
                          className={
                            selectedSubRole === sub.id
                              ? 'text-futura-700 font-semibold'
                              : 'text-slate-600'
                          }
                        >
                          {sub.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Scope tag */}
                <div
                  className={`inline-flex items-center gap-1 mt-3 text-[10px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-futura-600' : 'text-slate-400'
                  }`}
                >
                  <ChevronUp className="w-3 h-3" />
                  {role.scope}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Continue Button ── */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinue}
            className="flex items-center gap-2 bg-futura-500 hover:bg-futura-600 active:bg-futura-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-futura-500/25 transition duration-150 group"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* ── What's Next Info Card ── */}
        <div className="mt-8 rounded-2xl bg-[#1a2032] text-white overflow-hidden relative">
          {/* Decorative shield watermark */}
          <div className="absolute right-6 bottom-4 opacity-[0.07] pointer-events-none select-none">
            <ShieldCheck className="w-28 h-28" />
          </div>

          <div className="p-6 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-futura-500/20 flex items-center justify-center flex-shrink-0">
                <Circle className="w-3 h-3 fill-futura-500 text-futura-500" />
              </div>
              <h2 className="text-base font-bold text-white">What happens next?</h2>
            </div>

            <ol className="space-y-3">
              {NEXT_STEPS.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-futura-500 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-8" />
      </main>
    </div>
  );
};

export default RoleSelectionScreen;

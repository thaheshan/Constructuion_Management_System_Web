'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserCheck, FileText, PieChart } from 'lucide-react';

interface CreateAccountHeroPanelProps {
  className?: string;
}

const HIGHLIGHTS = [
  {
    icon: <UserCheck className="w-4 h-4 text-futura-500" />,
    title: 'Real-time attendance',
    description:
      'Track site presence instantly with geo-fencing and biometric verification.',
  },
  {
    icon: <FileText className="w-4 h-4 text-futura-500" />,
    title: 'Automated payroll',
    description:
      'Generate accurate wage reports directly from attendance logs in seconds.',
  },
  {
    icon: <PieChart className="w-4 h-4 text-futura-500" />,
    title: 'Project profit control',
    description:
      'Monitor labor costs against project budgets with real-time analytics.',
  },
];

export const CreateAccountHeroPanel: React.FC<CreateAccountHeroPanelProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`relative bg-[#121927] text-white flex flex-col justify-between p-8 lg:p-12 xl:p-16 ${className}`}
    >
      {/* Top Header: Logo */}
      <div className="flex items-center gap-3">
        <Link href="/login" className="flex items-center gap-3 group select-none">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-md shadow-orange-500/20 transition-transform group-hover:scale-105">
            <Image
              src="/images/Background.png"
              alt="Futura Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="text-xl font-black tracking-wider uppercase text-white">
            FUTURA
          </span>
        </Link>
      </div>

      {/* Middle: Headline + 3 Features */}
      <div className="my-8 lg:my-10 max-w-lg">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
          Build your digital <br />
          <span className="text-futura-500">site office.</span>
        </h1>

        <div className="flex flex-col gap-6 mt-8 sm:mt-10">
          {HIGHLIGHTS.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-slate-800/90 border border-slate-700/60 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Construction Site Image Card + Trusted Note */}
      <div className="pt-4">
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl aspect-[16/9] w-full max-w-lg bg-slate-900">
          <Image
            src="/images/register_iamge_building.png"
            alt="Active construction site with illuminated buildings and cranes at dusk"
            width={800}
            height={450}
            className="w-full h-full object-cover"
            priority
          />
          {/* Subtle gradient vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
        </div>

        <p className="text-[11px] font-bold tracking-[0.22em] text-slate-400 uppercase mt-4">
          TRUSTED BY 500+ CIVIL ENGINEERING FIRMS
        </p>
      </div>
    </div>
  );
};

export default CreateAccountHeroPanel;

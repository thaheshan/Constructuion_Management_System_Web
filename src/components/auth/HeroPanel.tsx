"use client";

import React from "react";
import { FuturaLogo } from "./FuturaLogo";
import { TopUtilityBar } from "./TopUtilityBar";
import { WifiOff, ShieldCheck, Receipt } from "lucide-react";

interface HeroPanelProps {
  onOpenHelp?: () => void;
  className?: string;
}

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: <img src="./images/Question.png" alt="" />,
    title: "Offline-First Sync",
    description:
      "Capture site logs even in zero-connectivity zones. Auto-syncs when back in range.",
  },
  {
    icon: <img src="./images/Question.png" alt="" />,
    title: "Audit-Ready Compliance",
    description:
      "Every transaction and attendance record is verified with GPS and timestamps.",
  },
  {
    icon: <Receipt className="w-5 h-5 text-futura-400" />,
    title: "Automated Costing",
    description:
      "Real-time project burn rates linked directly to payroll and inventory usage.",
  },
];

export const HeroPanel: React.FC<HeroPanelProps> = ({
  onOpenHelp,
  className = "",
}) => {
  return (
    <div
      className={`relative bg-[#131b26] text-white flex flex-col justify-between ${className}`}
    >
      {/* Content Container */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-14 xl:p-16">
        {/* Top Header Row on Hero: Logo (Desktop & Mobile) */}
        <div className="flex items-center justify-between">
          <FuturaLogo size="md" theme="dark" />
          {/* Mobile-only Utility Bar in top header */}
          <div className="lg:hidden">
            <TopUtilityBar variant="mobile-top" onOpenHelp={onOpenHelp} />
          </div>
        </div>

        {/* Hero Middle Content */}
        <div className="my-auto pt-24 pb-6 lg:py-12 max-w-xl">
          {/* Main Headline */}
          <h1 className="text-[28px] sm:text-[30px] lg:text-[48px] font-extrabold tracking-tight text-white leading-[1.15]">
            From site activity <br className="hidden sm:inline" />
            to profit control.
          </h1>

          {/* Subtitle - Desktop only */}
          <p className="hidden lg:block text-slate-400 text-sm md:text-base leading-relaxed mt-4 max-w-lg">
            Attendance, stock, payroll, tax and project cost — connected from
            the construction site to the office.
          </p>

          {/* 3 Key Feature Points - Desktop only */}
          <div className="hidden lg:flex flex-col gap-5 mt-10">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-sm">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-[20px] font-bold text-slate-100 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-[14px] text-slate-400 leading-relaxed mt-0.5 max-w-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Metrics/Stats Row - Desktop only */}
        <div className="hidden lg:block pt-8 border-t border-slate-800/90">
          <div className="flex items-center gap-12">
            <div>
              <div className="text-2xl lg:text-[20px] font-black text-white tracking-tight">
                2, 450+
              </div>
              <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-slate-400 mt-0.5">
                ACTIVE SITES
              </div>
            </div>

            <div className="w-[1px] h-8 bg-slate-800" />

            <div>
              <div className="text-2xl lg:text-[20px] font-black text-white tracking-tight">
                99.9%
              </div>
              <div className="text-[12px] font-bold tracking-[0.2em] uppercase text-slate-400 mt-0.5">
                UPTIME
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPanel;

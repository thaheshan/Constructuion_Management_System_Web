'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TopUtilityBar } from './TopUtilityBar';

interface AuthHeaderProps {
  onOpenHelp?: () => void;
  className?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  onOpenHelp,
  className = '',
}) => {
  return (
    <header
      className={`w-full bg-white border-b border-slate-100 shadow-sm ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo in square card */}
        <Link href="/login" className="flex items-center gap-3 select-none group">
          {/* Square icon container with Background.png image */}
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-md shadow-orange-400/20 transition-transform group-hover:scale-105">
            <Image
              src="/images/Background.png"
              alt="Futura Constructions Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Brand text */}
          <div className="flex flex-col leading-none">
            <span className="text-[15px] sm:text-[17px] font-black tracking-wider uppercase text-slate-900">
              FUTURA
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] text-futura-500 uppercase mt-0.5">
              CONSTRUCTIONS
            </span>
          </div>
        </Link>

        {/* Right: System status + Language + Help */}
        <TopUtilityBar variant="desktop" onOpenHelp={onOpenHelp} />
      </div>
    </header>
  );
};

export default AuthHeader;

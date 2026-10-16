import React from "react";
import Image from "next/image";

interface FuturaLogoProps {
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light";
  showText?: boolean;
  className?: string;
}

export const FuturaLogo: React.FC<FuturaLogoProps> = ({
  size = "md",
  theme = "dark",
  showText = true,
  className = "",
}) => {
  const iconDimensions = {
    sm: { box: "w-8 h-8 rounded-md", img: 20 },
    md: { box: "w-10 h-10 rounded-md", img: 26 },
    lg: { box: "w-12 h-12 rounded-md", img: 32 },
  }[size];

  const titleSize = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  const subSize = {
    sm: "text-[9px]",
    md: "text-[11px]",
    lg: "text-xs",
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Logo Icon Container */}
      <div
        className={`${iconDimensions.box} flex items-center justify-center shadow-md shadow-orange-500/20 flex-shrink-0 relative overflow-hidden mt-1`}
      >
        <Image
          src="/images/Background.png"
          alt="Futura Constructions"
          width={157}
          height={157}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`${titleSize} font-black tracking-wider uppercase ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}
          >
            FUTURA
          </span>
          <span
            className={`${subSize} font-bold tracking-[0.22em] text-futura-500 uppercase mt-0.5`}
          >
            CONSTRUCTIONS
          </span>
        </div>
      )}
    </div>
  );
};

export default FuturaLogo;

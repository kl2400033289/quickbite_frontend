import React from 'react';

interface QuickBiteLogoProps {
  variant?: 'full' | 'mark' | 'wordmark';
  theme?: 'light' | 'dark'; // 'light' means dark text for light bg; 'dark' means white text for dark bg
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showHelmetGlow?: boolean;
}

export const QuickBiteLogo: React.FC<QuickBiteLogoProps> = ({
  variant = 'full',
  theme = 'light',
  size = 'md',
  className = '',
  showHelmetGlow = true,
}) => {
  // Sizing maps
  const emblemSizes = {
    sm: 'w-7 h-7 rounded-xl text-base',
    md: 'w-9 h-9 sm:w-10 sm:h-10 rounded-2xl text-xl',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-2xl',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 rounded-3xl text-4xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-4xl sm:text-5xl',
  };

  const quickColor = theme === 'dark' ? 'text-white' : 'text-[#14171B]';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* 1. Official Teal Helmet 'Q' Emblem (from Video & Character Sheet) */}
      {variant !== 'wordmark' && (
        <div
          className={`relative flex items-center justify-center font-black transition-transform duration-300 group-hover:scale-105 ${emblemSizes[size]} ${
            showHelmetGlow ? 'shadow-md shadow-teal-500/25' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 55%, #0F766E 100%)',
          }}
        >
          {/* Subtle 3D helmet curvature highlight */}
          <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-t from-transparent via-white/10 to-white/30 pointer-events-none" />

          {/* Crisp, clean white "Q" Monogram identical to Pip's Helmet in the video */}
          <svg
            viewBox="0 0 100 100"
            className="w-3/5 h-3/5 fill-white drop-shadow-sm"
            style={{ transform: 'skewX(-6deg)' }}
          >
            {/* Smooth outer & inner Q contour */}
            <path
              d="M 50 15 
                 C 29 15 15 29 15 50 
                 C 15 71 29 85 50 85 
                 C 59 85 67 81.5 73.5 75.5 
                 L 81 83 
                 C 82.5 84.5 85 84 85 82 
                 L 85 73 
                 C 85 71.5 84 70.5 82.5 70.5 
                 L 77.5 70.5 
                 C 82.2 65 85 58 85 50 
                 C 85 29 71 15 50 15 Z 
                 M 50 31 
                 C 60.5 31 69 39.5 69 50 
                 C 69 60.5 60.5 69 50 69 
                 C 39.5 69 31 60.5 31 50 
                 C 31 39.5 39.5 31 50 31 Z"
            />
          </svg>
        </div>
      )}

      {/* 2. Official Slanted Wordmark: "Quick" (Charcoal/White) + "Bite" (Orange #FF5A1F) */}
      {variant !== 'mark' && (
        <span
          className={`font-black tracking-tight leading-none italic transform -skew-x-6 ${textSizes[size]}`}
          style={{ fontFamily: 'var(--font-display, "Plus Jakarta Sans", system-ui, sans-serif)' }}
        >
          <span className={`${quickColor} transition-colors duration-200`}>Quick</span>
          <span className="text-[#FF5A1F] transition-colors duration-200">Bite</span>
        </span>
      )}
    </div>
  );
};

export default QuickBiteLogo;

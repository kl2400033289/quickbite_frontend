import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHARACTER_MANIFEST, CharacterType } from './characterManifest';

export interface CharacterCompanionProps {
  character: CharacterType;
  variant?: 'hero' | 'guide' | 'corner' | 'inline' | 'floating';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  badge?: string;
  interactive?: boolean;
  flip?: boolean;
  className?: string;
  onCharacterClick?: () => void;
}

export const CharacterCompanion: React.FC<CharacterCompanionProps> = ({
  character,
  variant = 'inline',
  size = 'md',
  speechBubble,
  badge,
  interactive = true,
  flip = false,
  className = '',
  onCharacterClick,
}) => {
  const config = CHARACTER_MANIFEST[character];
  const [videoPlayable, setVideoPlayable] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(true);
  const [bubbleOpen, setBubbleOpen] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check user motion preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Performance: Pause video when element is scrolled off-screen
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (videoRef.current && videoPlayable) {
          if (entry.isIntersecting && !prefersReducedMotion) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [videoPlayable, prefersReducedMotion]);

  // Explicit, robust size styling tokens for both mobile and desktop
  const sizeClasses = {
    xs: 'w-16 h-16 sm:w-20 sm:h-20',
    sm: 'w-24 h-24 sm:w-28 sm:h-28',
    md: 'w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44',
    lg: 'w-44 h-44 sm:w-52 sm:h-52 md:w-60 md:h-60',
    xl: 'w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72',
  }[size];

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col items-center justify-center select-none pointer-events-none ${className}`}
    >
      {/* Speech Bubble / Status Badge */}
      <AnimatePresence>
        {speechBubble && bubbleOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.92 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto mb-2 max-w-[200px] sm:max-w-[250px] relative z-20 group"
          >
            <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl shadow-card border border-warm-200/90 text-charcoal-900 text-xs font-semibold leading-snug flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0 animate-ping"
                style={{ backgroundColor: config.primaryColor }}
              />
              <span className="truncate">{speechBubble}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBubbleOpen(false);
                }}
                className="ml-auto text-warm-400 hover:text-charcoal-700 text-[10px] p-0.5 rounded-full cursor-pointer"
                title="Dismiss speech bubble"
                aria-label="Dismiss speech bubble"
              >
                ✕
              </button>
            </div>
            {/* Speech bubble arrow pointer */}
            <div className="w-2.5 h-2.5 bg-white border-r border-b border-warm-200/90 transform rotate-45 mx-auto -mt-1.5 shadow-xs" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Character Body Container */}
      <motion.div
        animate={
          !prefersReducedMotion && isIntersecting
            ? { y: character === 'dog' ? [0, -4, 0] : [0, -6, 0] }
            : { y: 0 }
        }
        transition={
          !prefersReducedMotion
            ? {
                duration: character === 'dog' ? 2 : 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined
        }
        whileHover={interactive && !prefersReducedMotion ? { scale: 1.06 } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        onClick={() => {
          if (interactive && onCharacterClick) onCharacterClick();
          if (interactive && speechBubble) setBubbleOpen((prev) => !prev);
        }}
        className={`relative ${sizeClasses} ${flip ? '-scale-x-100' : ''} ${
          interactive ? 'pointer-events-auto cursor-pointer' : ''
        }`}
      >
        {/* Subtle Ambient Color Glow */}
        <div
          className="absolute inset-2 rounded-full blur-xl opacity-30 pointer-events-none -z-10"
          style={{ backgroundColor: config.primaryColor }}
        />

        {/* Optional Looping Video (Active only when video is successfully verified) */}
        {videoPlayable && !prefersReducedMotion && (
          <video
            ref={videoRef}
            src={config.webmLoopSrc}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoPlayable(false)}
            className="absolute inset-0 w-full h-full object-contain z-10"
          />
        )}

        {/* Primary Illustrated Artwork Fallback (Always rendered visibly and instantly!) */}
        <img
          src={config.fallbackImageSrc}
          alt={config.altText}
          loading="eager"
          decoding="async"
          className={`w-full h-full object-contain relative z-0 transition-opacity duration-300 ${
            videoPlayable ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Floating Quick Action Badge */}
        {badge && (
          <span
            className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold text-white shadow-md border border-white/40 z-20"
            style={{ backgroundColor: config.primaryColor }}
          >
            {badge}
          </span>
        )}
      </motion.div>
    </div>
  );
};

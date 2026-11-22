import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FastForward, VolumeX, Volume2, Video, ArrowRight, Sparkles } from 'lucide-react';
import { QuickBiteLogo } from '../common/QuickBiteLogo';

interface WelcomeIntroModalProps {
  videoSrc?: string;
  tagline?: string;
  onComplete?: () => void;
}

export const WelcomeIntroModal: React.FC<WelcomeIntroModalProps> = ({
  videoSrc = '/assets/intro/quickbite-intro.mp4',
  tagline = 'GOOD FOOD. ZERO FRICTION.',
  onComplete,
}) => {
  const location = useLocation();

  // Lifecycle phase: 'video' | 'endcard' | 'dismissed'
  const [phase, setPhase] = useState<'video' | 'endcard' | 'dismissed'>('dismissed');
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const endCardTimerRef = useRef<number | null>(null);

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1.0;
      setIsMuted(nextMuted);
    }
  };

  // Evaluate whether intro should be shown on mount or URL change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const searchParams = new URLSearchParams(location.search);
    const forceIntro = searchParams.get('intro') === 'true' || location.hash === '#replay-intro';
    const devAlwaysReplay = localStorage.getItem('quickbite_dev_replay_always') === 'true';
    const hasSeenIntro = sessionStorage.getItem('quickbite_intro_seen') === 'true';

    // Development preview / forced replay via ?intro=true or localStorage dev setting
    if (forceIntro || devAlwaysReplay) {
      if (mediaQuery.matches) {
        setPhase('endcard');
        endCardTimerRef.current = window.setTimeout(() => {
          dismissIntro();
        }, 2400);
      } else {
        setPhase('video');
        setVideoReady(false);
        setVideoFailed(false);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }
      return;
    }

    // Normal production: play on fresh session or first visit
    if (!hasSeenIntro) {
      if (mediaQuery.matches) {
        setPhase('endcard');
        endCardTimerRef.current = window.setTimeout(() => {
          dismissIntro();
        }, 2400);
      } else {
        setPhase('video');
      }
    } else {
      setPhase('dismissed');
    }

    // Custom event listener to replay anytime (e.g. from footer preview button)
    const handleReplayEvent = () => {
      sessionStorage.removeItem('quickbite_intro_seen');
      setPhase('video');
      setVideoReady(false);
      setVideoFailed(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('quickbite:replay-intro', handleReplayEvent);
    return () => {
      window.removeEventListener('quickbite:replay-intro', handleReplayEvent);
      if (endCardTimerRef.current) clearTimeout(endCardTimerRef.current);
    };
  }, [location.search, location.hash]);

  // Support Escape key to skip current stage
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && phase !== 'dismissed') {
        if (phase === 'video') {
          showEndCard();
        } else if (phase === 'endcard') {
          dismissIntro();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  // Transition into the clean Brand End Card
  const showEndCard = () => {
    setPhase('endcard');
    if (endCardTimerRef.current) clearTimeout(endCardTimerRef.current);
    // Hold brand reveal for 2.4 seconds before smoothly transitioning into the homepage
    endCardTimerRef.current = window.setTimeout(() => {
      dismissIntro();
    }, 2400);
  };

  // Dismiss intro and reveal homepage
  const dismissIntro = () => {
    if (endCardTimerRef.current) clearTimeout(endCardTimerRef.current);
    setPhase('dismissed');
    sessionStorage.setItem('quickbite_intro_seen', 'true');
    if (onComplete) onComplete();
  };

  const handleVideoError = () => {
    setVideoFailed(true);
    setVideoReady(false);
  };

  if (phase === 'dismissed') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        key="quickbite-welcome-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden select-none bg-[#0B0D10]"
        role="dialog"
        aria-modal="true"
        aria-label="Welcome to QuickBite"
      >
        {/* ============================================================== */}
        {/* STAGE 1: VIDEO INTRO STAGE                                     */}
        {/* ============================================================== */}
        {phase === 'video' && (
          <div className="relative w-full h-full flex items-center justify-center bg-[#0B0D10]">
            {/* Top Skip Button */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={showEndCard}
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/85 text-warm-100 hover:text-white text-xs sm:text-sm font-semibold backdrop-blur-md border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                title="Skip intro and view brand reveal (Esc)"
                aria-label="Skip video intro"
              >
                <span>Skip Intro</span>
                <FastForward className="w-4 h-4 text-tangerine-400 group-hover:text-white transition-colors" />
                <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono text-warm-300 bg-white/10 rounded border border-white/15">
                  ESC
                </kbd>
              </motion.button>
            </div>

            {/* HTML5 Autoplay Video */}
            {!videoFailed && (
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted={isMuted}
                playsInline
                preload="auto"
                onClick={toggleAudio}
                onLoadedData={() => {
                  setVideoReady(true);
                  setVideoFailed(false);
                }}
                onEnded={showEndCard}
                onError={handleVideoError}
                className={`w-full h-full object-cover transition-opacity duration-500 cursor-pointer ${
                  videoReady ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            {/* Interactive Unmute / Sound Control Button */}
            {videoReady && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={toggleAudio}
                className={`absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-50 flex items-center gap-2.5 text-xs sm:text-sm font-bold backdrop-blur-md px-4 py-2.5 rounded-full border transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95 ${
                  isMuted
                    ? 'bg-tangerine-500 hover:bg-tangerine-600 text-white border-tangerine-300 shadow-glow-tangerine animate-pulse'
                    : 'bg-black/75 hover:bg-black/90 text-emerald-400 border-white/20'
                }`}
                title={isMuted ? 'Click to unmute video audio' : 'Click to mute video audio'}
                aria-label={isMuted ? 'Click to unmute video audio' : 'Click to mute video audio'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-white" />
                    <span>Click to Unmute Sound 🔊</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-white">Audio Playing 🎵</span>
                  </>
                )}
              </motion.button>
            )}

            {/* Fallback Notice if video cannot load */}
            {videoFailed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-md mx-4 p-8 rounded-3xl bg-charcoal-900 border border-warm-200/20 backdrop-blur-xl text-center space-y-5 shadow-2xl relative z-40 text-warm-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-tangerine-500/20 border border-tangerine-500/40 flex items-center justify-center mx-auto text-tangerine-400">
                  <Video className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-white">QuickBite Food Journey</h3>
                  <p className="text-xs text-warm-300">Proceeding to QuickBite brand experience...</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={showEndCard}
                    className="w-full sm:w-auto px-5 py-2.5 bg-tangerine-500 hover:bg-tangerine-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    View Brand Reveal
                  </button>
                  <button
                    onClick={dismissIntro}
                    className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition-all cursor-pointer"
                  >
                    Enter Homepage
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* STAGE 2: CINEMATIC LUXURY BRAND REVEAL END CARD               */}
        {/* ============================================================== */}
        {phase === 'endcard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={dismissIntro}
            className="w-full h-full flex flex-col items-center justify-center bg-[#0C0E11] relative overflow-hidden cursor-pointer px-6"
            title="Click to enter homepage immediately"
          >
            {/* Ambient radiant center glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-tangerine-500/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col items-center justify-center max-w-xl w-full text-center relative z-10 space-y-5">
              {/* Trio Crew Artwork (Pip, Maya, Biscuit celebrating warm delivery) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative max-w-sm sm:max-w-md w-full px-4"
              >
                {/* Radiant backdrop glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 via-tangerine-500/30 to-amber-500/20 rounded-full blur-2xl opacity-60 pointer-events-none" />
                <motion.img
                  src="/assets/characters/trio-crew.png"
                  alt="Pip the Rider, Maya the Customer, and Biscuit the Pup"
                  className="w-full max-h-48 sm:max-h-56 object-contain relative z-10 drop-shadow-2xl"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              {/* Official QuickBite Video Logo */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col items-center gap-3"
              >
                <QuickBiteLogo
                  theme="dark"
                  size="xl"
                  showHelmetGlow={true}
                  className="hover:scale-105 transition-transform"
                />

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono font-bold tracking-widest text-teal-300 uppercase"
                >
                  <Sparkles className="w-3 h-3 text-tangerine-400" />
                  <span>Demand-Driven Microservices Platform</span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="font-editorial text-base sm:text-lg font-medium tracking-wide text-warm-200/90 italic"
                >
                  {tagline}
                </motion.p>
              </motion.div>

              {/* Progress & Quick Enter Action */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="pt-2 flex flex-col items-center gap-3"
              >
                <button
                  type="button"
                  onClick={dismissIntro}
                  className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-tangerine-500 text-white text-xs font-bold backdrop-blur-md border border-white/20 hover:border-tangerine-500 shadow-lg hover:shadow-glow-tangerine transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Enter QuickBite</span>
                  <ArrowRight className="w-3.5 h-3.5 text-tangerine-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </button>

                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.3, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-tangerine-500 to-amber-400 rounded-full"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeIntroModal;

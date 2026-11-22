import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Sparkles, ChevronDown, ChevronUp, Heart, Volume2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAudio } from '../../context/AudioContext';

type ActiveCompanion = 'all' | 'pip' | 'maya' | 'biscuit';

interface SpeechState {
  text: string;
  sender: string;
  emoji: string;
}

const DIALOGUES: Record<ActiveCompanion, SpeechState[]> = {
  all: [
    { text: "Welcome to QuickBite! We're here for your cravings!", sender: 'QuickBite Crew', emoji: '✨' },
    { text: 'Hot, chef-crafted meals arriving in lightning time!', sender: 'QuickBite Crew', emoji: '🛵' },
    { text: 'Need a recommendation? Check out chef specialties!', sender: 'QuickBite Crew', emoji: '🍛' },
  ],
  pip: [
    { text: 'Scooter is charged & hot bag is preheated! Where to?', sender: 'Pip the Rider', emoji: '🛵' },
    { text: 'Average delivery ETA is under 18 minutes today!', sender: 'Pip the Rider', emoji: '⚡' },
    { text: 'Safe riding, zero spills guaranteed!', sender: 'Pip the Rider', emoji: '🧤' },
  ],
  maya: [
    { text: 'That Biryani & Paneer look absolutely heavenly!', sender: 'Maya', emoji: '😋' },
    { text: 'Comfort food makes any evening 100x better!', sender: 'Maya', emoji: '🧡' },
    { text: 'Add that dessert to your cart, you deserve it!', sender: 'Maya', emoji: '🍰' },
  ],
  biscuit: [
    { text: 'Woof woof! Biscuit smelled something delicious!', sender: 'Biscuit', emoji: '🐾' },
    { text: '*Wags tail vigorously* Did someone say QuickBite?!', sender: 'Biscuit', emoji: '🐶' },
    { text: 'Biscuit approved: 10/10 good boy rating!', sender: 'Biscuit', emoji: '🦴' },
  ],
};

export const SideCompanionsDock: React.FC = () => {
  const [activeCompanion, setActiveCompanion] = useState<ActiveCompanion>('all');
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [speechIndex, setSpeechIndex] = useState<number>(0);
  const [showSpeech, setShowSpeech] = useState<boolean>(true);
  const [isExcited, setIsExcited] = useState<boolean>(false);

  const { itemCount } = useCart();
  const { playAddToCart } = useAudio();

  // Trigger cute celebration jump when user adds something to cart!
  useEffect(() => {
    if (itemCount > 0) {
      setIsExcited(true);
      setShowSpeech(true);
      const timer = setTimeout(() => setIsExcited(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  // Rotate speech lines periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeechIndex((prev) => (prev + 1) % DIALOGUES[activeCompanion].length);
    }, 7500);
    return () => clearInterval(timer);
  }, [activeCompanion]);

  const currentSpeech = isExcited
    ? {
        text: activeCompanion === 'biscuit' ? 'WOOF! Yummy food added to cart! 🐾' : 'Awesome pick! Your food is getting prepared!',
        sender: activeCompanion === 'pip' ? 'Pip' : activeCompanion === 'maya' ? 'Maya' : activeCompanion === 'biscuit' ? 'Biscuit' : 'Crew',
        emoji: '🎉',
      }
    : DIALOGUES[activeCompanion][speechIndex % DIALOGUES[activeCompanion].length];

  const handleCompanionClick = () => {
    playAddToCart();
    setIsExcited(true);
    setSpeechIndex((prev) => (prev + 1) % DIALOGUES[activeCompanion].length);
    setShowSpeech(true);
    setTimeout(() => setIsExcited(false), 1200);
  };

  return (
    <aside
      aria-label="QuickBite Companions"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 select-none pointer-events-none flex flex-col items-end"
    >
      {/* 1. Cute Interactive Speech Bubble */}
      <AnimatePresence>
        {!isMinimized && showSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto mb-2 mr-2 max-w-[240px] sm:max-w-[280px] relative z-20 group"
          >
            <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-warm-200/90 text-charcoal-900 text-xs leading-relaxed relative">
              <div className="flex items-center justify-between pb-1.5 border-b border-warm-100 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-tangerine-600">
                  <span>{currentSpeech.emoji}</span>
                  <span>{currentSpeech.sender}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSpeech(false)}
                  className="text-warm-400 hover:text-charcoal-600 p-0.5 rounded cursor-pointer transition-colors"
                  title="Dismiss message"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="font-medium text-charcoal-700">{currentSpeech.text}</p>
            </div>
            {/* Bubble triangular pointer */}
            <div className="w-3 h-3 bg-white border-r border-b border-warm-200/90 transform rotate-45 mr-8 ml-auto -mt-1.5 shadow-xs" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Floating Character Dock */}
      <div className="pointer-events-auto relative flex flex-col items-end">
        {/* Minimized Pill Toggle */}
        {isMinimized ? (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsMinimized(false);
              setShowSpeech(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 hover:bg-white text-charcoal-900 shadow-2xl border border-warm-200 backdrop-blur-md text-xs font-bold cursor-pointer group transition-all"
            title="Expand QuickBite Companions"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <img
              src="/assets/characters/biscuit-pup.png?v=2"
              alt="Biscuit"
              className="w-5 h-5 object-contain"
            />
            <span>QuickBite Crew</span>
            <ChevronUp className="w-3.5 h-3.5 text-warm-400 group-hover:text-tangerine-500 transition-colors" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-end relative"
          >
            {/* Companion Character Display with Micro-Animations */}
            <div
              onClick={handleCompanionClick}
              className="relative cursor-pointer group"
              title="Click to interact with the QuickBite Crew!"
            >
              {/* Soft colorful backdrop halo */}
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-35 transition-all duration-500 -z-10"
                style={{
                  background:
                    activeCompanion === 'pip'
                      ? '#14B8A6'
                      : activeCompanion === 'maya'
                      ? '#EA580C'
                      : activeCompanion === 'biscuit'
                      ? '#F59E0B'
                      : 'linear-gradient(90deg, #14B8A6, #EA580C, #F59E0B)',
                }}
              />

              {/* Floating Characters with Framer Motion idle & celebration states */}
              <motion.div
                animate={
                  isExcited
                    ? { y: [0, -18, 0, -10, 0], rotate: [0, -4, 4, -2, 0] }
                    : { y: [0, -7, 0] }
                }
                transition={
                  isExcited
                    ? { duration: 1.2, ease: 'easeOut' }
                    : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
                }
                whileHover={{ scale: 1.05 }}
                className="relative flex items-end justify-center"
              >
                {/* Mode A: ALL 3 TOGETHER */}
                {activeCompanion === 'all' && (
                  <div className="relative w-44 sm:w-56 h-36 sm:h-44 flex items-end justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
                    <img
                      src="/assets/characters/trio-crew.png?v=2"
                      alt="QuickBite Crew: Pip, Maya, Biscuit"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Mode B: PIP THE RIDER */}
                {activeCompanion === 'pip' && (
                  <div className="relative w-28 sm:w-36 h-40 sm:h-48 flex items-end justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
                    <img
                      src="/assets/characters/pip-rider.png?v=2"
                      alt="Pip the Delivery Rider"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Mode C: MAYA THE CUSTOMER */}
                {activeCompanion === 'maya' && (
                  <div className="relative w-24 sm:w-32 h-40 sm:h-48 flex items-end justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
                    <img
                      src="/assets/characters/maya-customer.png?v=2"
                      alt="Maya the Customer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Mode D: BISCUIT THE PUP */}
                {activeCompanion === 'biscuit' && (
                  <div className="relative w-28 sm:w-36 h-28 sm:h-36 flex items-end justify-center filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
                    <img
                      src="/assets/characters/biscuit-pup.png?v=2"
                      alt="Biscuit the Pup"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Happy heart reaction floating up on click */}
                {isExcited && (
                  <motion.div
                    initial={{ opacity: 1, y: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: -40, scale: 1.4 }}
                    transition={{ duration: 1 }}
                    className="absolute top-2 right-4 text-tangerine-500 font-bold pointer-events-none"
                  >
                    ❤️
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Character Selector Pill Dock */}
            <div className="mt-1 flex items-center gap-1 p-1 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-warm-200/90">
              <button
                type="button"
                onClick={() => setActiveCompanion('all')}
                className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  activeCompanion === 'all'
                    ? 'bg-charcoal-900 text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-warm-100'
                }`}
                title="Show Pip, Maya, and Biscuit together"
              >
                ✨ Trio
              </button>
              <button
                type="button"
                onClick={() => setActiveCompanion('pip')}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  activeCompanion === 'pip'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-warm-100'
                }`}
                title="Show Pip the Rider"
              >
                🛵 Pip
              </button>
              <button
                type="button"
                onClick={() => setActiveCompanion('maya')}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  activeCompanion === 'maya'
                    ? 'bg-tangerine-500 text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-warm-100'
                }`}
                title="Show Maya"
              >
                👩 Maya
              </button>
              <button
                type="button"
                onClick={() => setActiveCompanion('biscuit')}
                className={`px-2 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  activeCompanion === 'biscuit'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-warm-100'
                }`}
                title="Show Biscuit the Pup"
              >
                🐶 Biscuit
              </button>
              <div className="w-px h-3.5 bg-warm-200 mx-0.5" />
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="p-1 rounded-full text-warm-400 hover:text-charcoal-700 hover:bg-warm-100 transition-colors cursor-pointer"
                title="Minimize companions"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </aside>
  );
};

export default SideCompanionsDock;

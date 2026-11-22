import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Flame, Bike, CheckCircle2 } from 'lucide-react';
import { CinematicVideo } from '../common/CinematicVideo';

const STORY_STAGES = [
  {
    step: '01',
    icon: Compass,
    title: 'Discover Your Craving',
    subtitle: 'Demand-Driven Discovery',
    description:
      'Browse artisan neighborhood kitchens or let our intelligent curation match your exact palate. Select bespoke ingredients and customize your tray with zero friction.',
    videoSrc: '/assets/story/story-craving.mp4',
    posterSrc:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    stats: '500+ Curated Dishes Available',
    statusBadge: 'Phase 1: Browsing & Tray Orchestration',
  },
  {
    step: '02',
    icon: Flame,
    title: 'Kitchen Handcrafts With Fire',
    subtitle: 'Live Kitchen Acceptance',
    description:
      'Our Restaurant Service instantly confirms incoming orders. Master chefs fire up the ovens, grill flame-seared meats, and assemble your order fresh to specification.',
    videoSrc: '/assets/story/story-kitchen.mp4',
    posterSrc:
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
    stats: 'Average Kitchen Prep: 14 mins',
    statusBadge: 'Phase 2: Restaurant Microservice Processing',
  },
  {
    step: '03',
    icon: Bike,
    title: 'Dispatched & Tracked in Real-Time',
    subtitle: 'High-Velocity Fulfillment',
    description:
      'Dedicated logistics partners receive automated route-optimized dispatch. Follow your meal from the kitchen counter directly to your doorstep with live status synchronization.',
    videoSrc: '/assets/story/story-delivery.mp4',
    posterSrc:
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
    stats: 'Sub-30 Minute Express Delivery',
    statusBadge: 'Phase 3: Valet Dispatch & Order Finalization',
  },
];

export const ScrollStory: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const currentStage = STORY_STAGES[activeStage];
  const IconComponent = currentStage.icon;

  return (
    <section className="py-24 bg-charcoal-950 text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-tangerine-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-tangerine-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
            The QuickBite Journey
          </span>
          <h2 className="text-3xl sm:text-5xl font-black font-editorial text-warm-50 tracking-tight leading-tight">
            From Craving to Your Doorstep. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tangerine-400 to-amber-300">
              Orchestrated in Seconds.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-warm-300 font-light max-w-xl mx-auto">
            Experience the three-part synchronized journey powered by QuickBite intelligent culinary dispatch.
          </p>
        </div>

        {/* Stage Selector Pills */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-charcoal-900 rounded-2xl border border-charcoal-800 gap-2">
            {STORY_STAGES.map((stage, idx) => {
              const isActive = activeStage === idx;
              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveStage(idx)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-tangerine-500 text-white shadow-glow-tangerine'
                      : 'text-warm-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="opacity-70 font-mono">{stage.step}</span>
                  <span>{stage.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Showcase Box */}
        <div className="bg-charcoal-900/80 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Visual / Google Flow Media Slot */}
            <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[460px] overflow-hidden bg-charcoal-950">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStage.step}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <CinematicVideo
                    videoSrc={currentStage.videoSrc}
                    posterSrc={currentStage.posterSrc}
                    altText={currentStage.title}
                    className="w-full h-full"
                    overlayGradient={true}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Status Tag Overlay */}
              <div className="absolute top-4 left-4 bg-charcoal-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[11px] font-mono text-warm-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{currentStage.statusBadge}</span>
              </div>
            </div>

            {/* Stage Description & Details */}
            <div className="lg:col-span-5 p-8 lg:p-12 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-tangerine-400 bg-tangerine-500/10 px-3 py-1 rounded-full border border-tangerine-500/20">
                  <IconComponent className="w-4 h-4 text-tangerine-400" />
                  <span>STAGE {currentStage.step} — {currentStage.subtitle}</span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {currentStage.title}
                </h3>

                <p className="text-sm text-warm-300 leading-relaxed font-light">
                  {currentStage.description}
                </p>
              </div>

              {/* Feature highlight note */}
              <div className="p-4 rounded-2xl bg-charcoal-950/60 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{currentStage.stats}</span>
                </div>
                <p className="text-[11px] text-warm-400 leading-normal">
                  Google Flow animation ready. Slots pre-wired with fallback photography and video loop handlers.
                </p>
              </div>

              {/* Navigation Indicators */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs text-warm-400">
                <button
                  disabled={activeStage === 0}
                  onClick={() => setActiveStage((p) => Math.max(0, p - 1))}
                  className="hover:text-white disabled:opacity-30 disabled:hover:text-warm-400 transition-colors font-semibold"
                >
                  ← Previous Stage
                </button>

                <div className="flex gap-1.5">
                  {STORY_STAGES.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 rounded-full transition-all ${
                        activeStage === i ? 'w-6 bg-tangerine-500' : 'w-2 bg-charcoal-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeStage === STORY_STAGES.length - 1}
                  onClick={() => setActiveStage((p) => Math.min(STORY_STAGES.length - 1, p + 1))}
                  className="hover:text-white disabled:opacity-30 disabled:hover:text-warm-400 transition-colors font-semibold"
                >
                  Next Stage →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

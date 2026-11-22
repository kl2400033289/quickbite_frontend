import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight, Sparkles, Flame, Clock, Award, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CinematicVideo } from '../common/CinematicVideo';
import { useAudio } from '../../context/AudioContext';

export const HeroSection: React.FC = () => {
  const { isAmbientPlaying, toggleAmbient } = useAudio();
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center bg-charcoal-950 overflow-hidden text-white pt-20 pb-16">
      {/* Background Cinematic Food Visual / Google Flow Video Slot */}
      <div className="absolute inset-0 opacity-45 pointer-events-none scale-105 transform">
        <CinematicVideo
          videoSrc="/assets/hero/hero-loop.mp4"
          posterSrc="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=85"
          altText="Cinematic Gourmet Culinary Hero"
          className="w-full h-full"
          overlayGradient={true}
        />
      </div>

      {/* Ambient gradient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-tangerine-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-olive-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Hero Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Headline & Actions */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Microbadge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-tangerine-400"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demand-Driven Food Orchestration</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl xl:text-7xl font-black font-editorial tracking-tight leading-[1.08] text-warm-50"
          >
            GOOD FOOD. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-tangerine-400 via-tangerine-500 to-amber-300">
              ZERO FRICTION.
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-warm-200/90 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Your cravings, orchestrated. Savor hand-curated dishes from the city’s most distinguished kitchens, delivered with lightning culinary precision.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-tangerine-500 to-tangerine-600 hover:from-tangerine-600 hover:to-tangerine-700 text-white font-bold rounded-2xl shadow-glow-tangerine transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base"
            >
              <span>Order Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#discovery"
              className="w-full sm:w-auto px-7 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-semibold rounded-2xl transition-all hover:border-white/30 flex items-center justify-center gap-2 text-base"
            >
              <span>Explore Restaurants</span>
            </a>

            <button
              type="button"
              onClick={toggleAmbient}
              className={`w-full sm:w-auto px-5 py-4 rounded-2xl backdrop-blur-md border transition-all flex items-center justify-center gap-2 text-sm cursor-pointer ${
                isAmbientPlaying
                  ? 'bg-tangerine-500/20 border-tangerine-400 text-tangerine-300 shadow-glow-tangerine animate-pulse'
                  : 'bg-white/5 hover:bg-white/10 border-white/15 text-warm-200 hover:text-white'
              }`}
            >
              {isAmbientPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-tangerine-400" />
                  <span>Kitchen Sizzle: Playing</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-warm-400" />
                  <span>Turn On Kitchen Sound</span>
                </>
              )}
            </button>
          </motion.div>

          {/* Value Props Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg mx-auto lg:mx-0"
          >
            <div className="flex items-center gap-2 text-left">
              <Clock className="w-4 h-4 text-tangerine-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">25-35 Mins</div>
                <div className="text-[11px] text-warm-400">Average Dispatch</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-left">
              <Flame className="w-4 h-4 text-tangerine-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Live Flame</div>
                <div className="text-[11px] text-warm-400">Fresh Preparation</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-left">
              <Award className="w-4 h-4 text-tangerine-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">4.8+ Rated</div>
                <div className="text-[11px] text-warm-400">Artisan Kitchens</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Layered Hero Showcase Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative hidden lg:block"
        >
          {/* Floating Chef Signature Dish Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-charcoal-900/90 backdrop-blur-md group">
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85"
              alt="Artisanal Ribeye Steak & Chimichurri"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-tangerine-500/20 text-tangerine-400 border border-tangerine-500/30">
                  Featured Creation
                </span>
                <span className="text-sm font-extrabold text-white">₹649</span>
              </div>
              <h3 className="font-editorial text-xl font-bold text-white">
                Smoked Wagyu &amp; Truffle Reduction
              </h3>
              <p className="text-xs text-warm-300">
                Slow-roasted over hickory embers with house bordelaise glaze.
              </p>
            </div>
          </div>

          {/* Floating Live Dispatch Pill & Animated Rider Companion */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-6 -left-8 bg-white text-charcoal-900 p-4 rounded-2xl shadow-xl border border-warm-200 flex items-center gap-3 z-20"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
              ✓
            </div>
            <div>
              <div className="text-xs font-bold">Kitchen Dispatched</div>
              <div className="text-[11px] text-charcoal-700">Order #QB-8192 on the move</div>
            </div>
          </motion.div>

          {/* Living Character: QuickBite Express Delivery Rider */}
          
        </motion.div>
      </div>

      {/* Obvious Scroll Cue */}
      <a
        href="#discovery"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-warm-400 hover:text-white transition-colors group cursor-pointer"
        aria-label="Scroll down to explore"
      >
        <span className="text-[10px] uppercase font-bold tracking-widest text-warm-400 group-hover:text-tangerine-400">
          Scroll Down
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"
        >
          <ArrowDown className="w-4 h-4 text-warm-200" />
        </motion.div>
      </a>
    </section>
  );
};

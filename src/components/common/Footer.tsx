import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Sparkles, Play, RefreshCw, Heart } from 'lucide-react';
import { QuickBiteLogo } from './QuickBiteLogo';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [devAlwaysReplay, setDevAlwaysReplay] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDevAlwaysReplay(localStorage.getItem('quickbite_dev_replay_always') === 'true');
    }
  }, []);

  const handlePreviewIntro = () => {
    sessionStorage.removeItem('quickbite_intro_seen');
    window.dispatchEvent(new CustomEvent('quickbite:replay-intro'));
    // If not on home or intro query, navigate with ?intro=true
    navigate('/?intro=true');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDevReplayAlways = () => {
    const next = !devAlwaysReplay;
    setDevAlwaysReplay(next);
    localStorage.setItem('quickbite_dev_replay_always', String(next));
  };

  return (
    <footer className="bg-charcoal-950 text-warm-300 pt-16 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-charcoal-800">
          {/* Brand & Mission Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <QuickBiteLogo theme="dark" size="lg" showHelmetGlow={true} />
            </div>
            <p className="text-sm text-warm-400 max-w-sm leading-relaxed">
              Curated chef specialties and comforting neighborhood favorites delivered to your door with warmth and speed.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-serif italic text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Good Food, Brighter Days.</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h4>
            <ul className="space-y-2 text-sm text-warm-400">
              <li>
                <Link to="/" className="hover:text-tangerine-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-tangerine-400 transition-colors">
                  Explore Restaurants
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-tangerine-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-tangerine-400 transition-colors flex items-center gap-1">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-tangerine-500" />
                  <span>For Restaurants</span>
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-tangerine-400 transition-colors">
                  Track Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Culinary Highlights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Curations</h4>
            <ul className="space-y-2 text-sm text-warm-400">
              <li>
                <Link to="/explore?category=pizza" className="hover:text-tangerine-400 transition-colors">
                  Artisan Pizza &amp; Pasta
                </Link>
              </li>
              <li>
                <Link to="/explore?category=bowls" className="hover:text-tangerine-400 transition-colors">
                  Nourish Bowls &amp; Greens
                </Link>
              </li>
              <li>
                <Link to="/explore?category=desserts" className="hover:text-tangerine-400 transition-colors">
                  Signature Pastries
                </Link>
              </li>
              <li>
                <Link to="/explore?category=specialties" className="hover:text-tangerine-400 transition-colors">
                  Chef Seasonal Menus
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer & Experience Controls */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Experience</h4>
            <div className="space-y-3 pt-1">
              {/* Working Footer Control: Preview Welcome Intro */}
              <button
                onClick={handlePreviewIntro}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 border border-charcoal-700 hover:border-tangerine-500/50 text-xs font-medium text-warm-200 transition-all cursor-pointer group"
                title="Reset session and replay the full animated welcome intro"
              >
                <Play className="w-3.5 h-3.5 text-tangerine-400 group-hover:scale-110 transition-transform" />
                <span>Preview Welcome Intro</span>
              </button>

              {/* Dev setting: Always replay on page load */}
              <button
                onClick={toggleDevReplayAlways}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-charcoal-900 border border-charcoal-800 text-[11px] text-warm-400 hover:text-warm-200 transition-colors cursor-pointer"
                title="Toggle setting to replay intro on every page load"
              >
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3 text-warm-500" />
                  <span>Replay on Load</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    devAlwaysReplay
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-warm-800/40 text-warm-500 border border-warm-700/30'
                  }`}
                >
                  {devAlwaysReplay ? 'Active' : 'Off'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright & brand note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-warm-500 gap-4">
          <p>© {new Date().getFullYear()} QuickBite Inc. All rights reserved. Good Food, Brighter Days.</p>
          <div className="flex items-center gap-1 text-warm-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-tangerine-500 fill-tangerine-500 inline" />
            <span>for great culinary moments.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

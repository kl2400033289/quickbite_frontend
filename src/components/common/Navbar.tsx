import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  LogOut,
  UtensilsCrossed,
  ChevronRight,
  Volume2,
  VolumeX,
  Flame,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useAudio } from '../../context/AudioContext';
import { QuickBiteLogo } from './QuickBiteLogo';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { isSoundEnabled, isAmbientPlaying, toggleSound, toggleAmbient } = useAudio();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-warm-200/80 py-3 text-charcoal-900'
          : isHome
          ? 'bg-gradient-to-b from-charcoal-950/80 via-charcoal-950/40 to-transparent py-5 text-white'
          : 'bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-warm-200 py-4 text-charcoal-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* 1. Official QuickBite logo and brand name */}
          <Link to="/" className="flex items-center group" aria-label="QuickBite Home">
            <QuickBiteLogo
              theme={isScrolled ? 'light' : isHome ? 'dark' : 'light'}
              size="md"
              showHelmetGlow={true}
            />
          </Link>

          {/* 2-5. Desktop Navigation Links (Home, Explore, How It Works, For Restaurants) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors hover:text-tangerine-500 ${
                location.pathname === '/'
                  ? 'text-tangerine-500'
                  : isScrolled
                  ? 'text-charcoal-700'
                  : isHome
                  ? 'text-warm-100'
                  : 'text-charcoal-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`text-sm font-semibold transition-colors hover:text-tangerine-500 ${
                location.pathname === '/explore'
                  ? 'text-tangerine-500'
                  : isScrolled
                  ? 'text-charcoal-700'
                  : isHome
                  ? 'text-warm-100'
                  : 'text-charcoal-700'
              }`}
            >
              Explore
            </Link>
            <a
              href="#how-it-works"
              onClick={(e) => {
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/#how-it-works');
                }
              }}
              className={`text-sm font-semibold transition-colors hover:text-tangerine-500 ${
                isScrolled ? 'text-charcoal-700' : isHome ? 'text-warm-100' : 'text-charcoal-700'
              }`}
            >
              How It Works
            </a>
            <Link
              to="/dashboard"
              className={`text-sm font-semibold transition-colors hover:text-tangerine-500 flex items-center gap-1.5 ${
                location.pathname.startsWith('/dashboard')
                  ? 'text-tangerine-500'
                  : isScrolled
                  ? 'text-charcoal-700'
                  : isHome
                  ? 'text-warm-100'
                  : 'text-charcoal-700'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>For Restaurants</span>
            </Link>
          </nav>

          {/* 6-9. Actions: Sound, Search, Cart, Log In, Sign Up */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Kitchen Sizzle Ambient Sound Toggle */}
            <button
              onClick={toggleAmbient}
              title={isAmbientPlaying ? 'Kitchen Ambience: Playing (Click to Stop)' : 'Kitchen Ambience: Off (Click to Play Sizzle)'}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isAmbientPlaying
                  ? 'bg-tangerine-500 text-white border-tangerine-600 shadow-glow-tangerine animate-pulse'
                  : isScrolled
                  ? 'bg-warm-100 text-charcoal-700 border-warm-200 hover:bg-warm-200'
                  : isHome
                  ? 'bg-white/10 text-warm-200 border-white/20 hover:bg-white/20'
                  : 'bg-warm-100 text-charcoal-700 border-warm-200 hover:bg-warm-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAmbientPlaying ? 'Sizzle: ON' : 'Kitchen Sizzle'}</span>
            </button>

            {/* Sound FX Mute/Unmute Toggle */}
            <button
              onClick={toggleSound}
              title={isSoundEnabled ? 'Sound Effects: ON (Click to Mute)' : 'Sound Effects: MUTED (Click to Enable)'}
              className={`p-2.5 rounded-full transition-all flex items-center gap-1.5 ${
                isSoundEnabled
                  ? isScrolled
                    ? 'text-tangerine-600 bg-tangerine-50 hover:bg-tangerine-100'
                    : isHome
                    ? 'text-tangerine-400 bg-white/10 hover:bg-white/20'
                    : 'text-tangerine-600 bg-tangerine-50 hover:bg-tangerine-100'
                  : isScrolled
                  ? 'text-charcoal-700 hover:bg-warm-100'
                  : isHome
                  ? 'text-warm-400 hover:bg-white/10'
                  : 'text-charcoal-700 hover:bg-warm-100'
              }`}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4 text-tangerine-500" /> : <VolumeX className="w-4 h-4 text-charcoal-700" />}
            </button>

            {/* Search */}
            <Link
              to="/explore"
              className={`p-2.5 rounded-full transition-colors ${
                isScrolled
                  ? 'text-charcoal-700 hover:bg-warm-100'
                  : isHome
                  ? 'text-warm-100 hover:bg-white/10'
                  : 'text-charcoal-700 hover:bg-warm-100'
              }`}
              title="Search food & restaurants"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-tangerine-500/10 text-tangerine-600 hover:bg-tangerine-500 hover:text-white transition-all active:scale-95 cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-tangerine-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth Buttons: Log In & Sign Up */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/orders"
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    isScrolled
                      ? 'bg-warm-100 text-charcoal-800 hover:bg-warm-200'
                      : isHome
                      ? 'bg-white/10 text-white hover:bg-white/20'
                      : 'bg-warm-100 text-charcoal-800 hover:bg-warm-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="max-w-[100px] truncate">{user?.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isScrolled
                      ? 'text-charcoal-700 hover:text-rose-600'
                      : isHome
                      ? 'text-warm-200 hover:text-rose-400'
                      : 'text-charcoal-700 hover:text-rose-600'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    isScrolled
                      ? 'text-charcoal-700 hover:text-charcoal-900'
                      : isHome
                      ? 'text-warm-100 hover:text-white'
                      : 'text-charcoal-700 hover:text-charcoal-900'
                  }`}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1.5 bg-tangerine-500 hover:bg-tangerine-600 text-white text-xs font-semibold rounded-full shadow-sm shadow-tangerine-500/30 transition-all hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-colors cursor-pointer ${
                isScrolled ? 'text-charcoal-800' : isHome ? 'text-white' : 'text-charcoal-800'
              }`}
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-warm-200/40 bg-white/98 backdrop-blur-lg rounded-2xl shadow-xl p-4 text-charcoal-900 space-y-3">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-semibold border-b border-warm-100"
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </Link>
            <Link
              to="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-semibold border-b border-warm-100"
            >
              <span>Explore</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </Link>
            <a
              href="#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-semibold border-b border-warm-100"
            >
              <span>How It Works</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </a>
            <Link
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-semibold border-b border-warm-100 text-tangerine-600"
            >
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                <span>For Restaurants</span>
              </div>
              <ChevronRight className="w-4 h-4 text-tangerine-600" />
            </Link>
            <Link
              to="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-sm font-semibold border-b border-warm-100"
            >
              <span>Order Tracking</span>
              <ChevronRight className="w-4 h-4 text-charcoal-400" />
            </Link>

            <div className="pt-2 flex gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-semibold border border-warm-300 rounded-xl"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 text-xs font-semibold bg-tangerine-500 text-white rounded-xl"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600 border border-rose-200 rounded-xl"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

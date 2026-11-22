import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, ChefHat, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QuickBiteLogo } from '../components/common/QuickBiteLogo';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, setSelectedOperatorRestaurantId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = (type: 'customer' | 'operator') => {
    if (type === 'customer') {
      setEmail('customer@quickbite.io');
      setPassword('password123');
    } else {
      setEmail('chef.bistro@quickbite.io');
      setPassword('password123');
      setSelectedOperatorRestaurantId(1);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-4xl p-8 sm:p-10 border border-warm-200 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <QuickBiteLogo size="lg" theme="light" showHelmetGlow={true} />
          </div>
          <h1 className="text-2xl font-black font-editorial text-charcoal-900">
            Welcome to QuickBite
          </h1>
          <p className="text-xs text-charcoal-700">
            Sign in to access your orders and kitchen operations.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal-700 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@quickbite.io"
                className="w-full pl-11 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30 focus:border-tangerine-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-700 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30 focus:border-tangerine-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-tangerine-500 hover:bg-tangerine-600 disabled:opacity-60 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-glow-tangerine transition-all text-sm active:scale-95"
          >
            {isSubmitting ? (
              <span>Authenticating with Auth Service...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Persona Shortcuts for Evaluation */}
        <div className="pt-2 border-t border-warm-100 space-y-2">
          <div className="text-[11px] font-bold text-charcoal-700 text-center uppercase tracking-wider">
            Quick Academic Test Personas
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('customer')}
              className="p-2 rounded-xl bg-warm-100 hover:bg-warm-200 text-charcoal-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-tangerine-600" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('operator')}
              className="p-2 rounded-xl bg-warm-100 hover:bg-warm-200 text-charcoal-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <ChefHat className="w-3.5 h-3.5 text-tangerine-600" />
              <span>Operator Demo</span>
            </button>
          </div>
        </div>

        {/* Footnote */}
        <div className="text-center text-xs text-charcoal-700 space-y-2">
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="text-tangerine-600 font-bold hover:underline">
              Create an Account
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1 text-[11px] text-warm-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>JWT Security Filter at Auth Service (Port 8081)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

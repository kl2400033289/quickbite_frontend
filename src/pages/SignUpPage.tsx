import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QuickBiteLogo } from '../components/common/QuickBiteLogo';

export const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long (Backend requirement).');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({ email, password });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Registration failed. The email may already be in use.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-4xl p-8 sm:p-10 border border-warm-200 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <QuickBiteLogo size="lg" theme="light" showHelmetGlow={true} />
          </div>
          <h1 className="text-2xl font-black font-editorial text-charcoal-900">
            Create an Account
          </h1>
          <p className="text-xs text-charcoal-700">
            Join QuickBite for curated culinary dining and real-time dispatch.
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
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              Password (Min 6 Characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-700 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-tangerine-500/30 focus:border-tangerine-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-700 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>Registering User...</span>
            ) : (
              <>
                <span>Create QuickBite Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-700 space-y-2">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-tangerine-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>

          <div className="flex items-center justify-center gap-1 text-[11px] text-warm-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>BCrypt Password Hashing at Auth Service</span>
          </div>
        </div>
      </div>
    </div>
  );
};

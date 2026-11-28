import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  ChefHat,
  User,
  Bike,
  Shield,
} from 'lucide-react';
import { useAuth, getDefaultRouteForRole, ROLE_META } from '../context/AuthContext';
import { UserRole } from '../types/api';
import { QuickBiteLogo } from '../components/common/QuickBiteLogo';
import { CaptchaField } from '../components/common/CaptchaField';

const ROLE_OPTIONS: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { role: 'CUSTOMER', label: 'Customer', icon: User },
  { role: 'RESTAURANT', label: 'Restaurant', icon: ChefHat },
  { role: 'DELIVERY_PARTNER', label: 'Delivery', icon: Bike },
  { role: 'ADMIN', label: 'Admin', icon: Shield },
];

const DEMO_ACCOUNTS: Record<UserRole, { email: string; password: string }> = {
  CUSTOMER: { email: 'customer@quickbite.io', password: 'password123' },
  RESTAURANT: { email: 'chef.bistro@quickbite.io', password: 'password123' },
  DELIVERY_PARTNER: { email: 'rider.alex@quickbite.io', password: 'password123' },
  ADMIN: { email: 'admin@quickbite.io', password: 'password123' },
};

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaRefresh, setCaptchaRefresh] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, setSelectedOperatorRestaurantId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const loggedInUser = await login({ email, password, role: selectedRole, captchaId, captchaAnswer });
      const target =
        loggedInUser.role === 'CUSTOMER' && from
          ? from
          : getDefaultRouteForRole(loggedInUser.role);
      navigate(target, { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Invalid credentials. Please verify your email, password, and role.');
      setCaptchaAnswer('');
      setCaptchaRefresh((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickDemo = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_ACCOUNTS[role].email);
    setPassword(DEMO_ACCOUNTS[role].password);
    if (role === 'RESTAURANT') {
      setSelectedOperatorRestaurantId(1);
    }
    setError(null);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-4xl p-8 sm:p-10 border border-warm-200 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <QuickBiteLogo size="lg" theme="light" showHelmetGlow={true} />
          </div>
          <h1 className="text-2xl font-black font-editorial text-charcoal-900">
            Role-Based Sign In
          </h1>
          <p className="text-xs text-charcoal-700">
            Select your account role to access your dedicated QuickBite portal.
          </p>
        </div>

        {/* 4-Role Selector */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider">
            Sign In As
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ROLE_OPTIONS.map(({ role, label, icon: Icon }) => {
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    setError(null);
                  }}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-tangerine-500 text-white border-tangerine-600 shadow-glow-tangerine'
                      : 'bg-warm-50 text-charcoal-700 border-warm-200 hover:bg-warm-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-tangerine-600'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-charcoal-600 text-center">
            {ROLE_META[selectedRole].description}
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

          <CaptchaField
            value={captchaAnswer}
            onChange={setCaptchaAnswer}
            onCaptchaIdChange={setCaptchaId}
            refreshTrigger={captchaRefresh}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-tangerine-500 hover:bg-tangerine-600 disabled:opacity-60 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-glow-tangerine transition-all text-sm active:scale-95 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Authenticating {ROLE_META[selectedRole].shortLabel}...</span>
            ) : (
              <>
                <span>Sign In as {ROLE_META[selectedRole].shortLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Personas for All 4 Roles */}
        <div className="pt-2 border-t border-warm-100 space-y-2">
          <div className="text-[11px] font-bold text-charcoal-700 text-center uppercase tracking-wider">
            Quick Demo Accounts (All 4 Roles)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ROLE_OPTIONS.map(({ role, label, icon: Icon }) => (
              <button
                key={role}
                type="button"
                onClick={() => fillQuickDemo(role)}
                className="p-2 rounded-xl bg-warm-100 hover:bg-warm-200 text-charcoal-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Icon className="w-3.5 h-3.5 text-tangerine-600 shrink-0" />
                <span>{label}</span>
              </button>
            ))}
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
            <span>Role-Verified JWT Authentication (Port 8081)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

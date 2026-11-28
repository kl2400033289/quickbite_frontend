import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  User,
  ChefHat,
  Bike,
  Shield,
  Check,
} from 'lucide-react';
import { useAuth, getDefaultRouteForRole, ROLE_META } from '../context/AuthContext';
import { UserRole } from '../types/api';
import { QuickBiteLogo } from '../components/common/QuickBiteLogo';
import { CaptchaField } from '../components/common/CaptchaField';

type PasswordStrength = 'Weak' | 'Medium' | 'Strong';

function evaluatePassword(password: string): {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasSpecial: boolean;
  isValid: boolean;
  strength: PasswordStrength;
} {
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isValid = hasMinLength && hasUppercase && hasSpecial;

  const requiredCount = [hasMinLength, hasUppercase, hasSpecial].filter(Boolean).length;
  let strength: PasswordStrength = 'Weak';
  if (isValid && password.length >= 8 && /[a-z]/.test(password) && /[0-9]/.test(password)) {
    strength = 'Strong';
  } else if (hasMinLength && requiredCount >= 2) {
    strength = 'Medium';
  }

  return { hasMinLength, hasUppercase, hasSpecial, isValid, strength };
}

const ROLE_OPTIONS: { role: UserRole; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { role: 'CUSTOMER', label: 'Customer', icon: User },
  { role: 'RESTAURANT', label: 'Restaurant', icon: ChefHat },
  { role: 'DELIVERY_PARTNER', label: 'Delivery', icon: Bike },
  { role: 'ADMIN', label: 'Admin', icon: Shield },
];

export const SignUpPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaId, setCaptchaId] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaRefresh, setCaptchaRefresh] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const passwordEval = evaluatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordEval.isValid) {
      setError('Password must be at least 6 characters and include at least one capital letter and one special character.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdUser = await register({ email, password, role: selectedRole, captchaId, captchaAnswer });
      navigate(getDefaultRouteForRole(createdUser.role), { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Registration failed. The email may already be in use.');
      setCaptchaAnswer('');
      setCaptchaRefresh((prev) => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-4xl p-8 sm:p-10 border border-warm-200 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <QuickBiteLogo size="lg" theme="light" showHelmetGlow={true} />
          </div>
          <h1 className="text-2xl font-black font-editorial text-charcoal-900">
            Create an Account
          </h1>
          <p className="text-xs text-charcoal-700">
            Choose your role to join QuickBite as a Customer, Restaurant, Delivery Partner, or Admin.
          </p>
        </div>

        {/* 4-Role Selector */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-charcoal-700 uppercase tracking-wider">
            Account Role
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ROLE_OPTIONS.map(({ role, label, icon: Icon }) => {
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
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
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              Password (Min 6 Chars, 1 Capital, 1 Special)
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

            {password.length > 0 && (
              <div className="mt-2.5 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-charcoal-600">Password Strength</span>
                  <span
                    className={
                      passwordEval.strength === 'Strong'
                        ? 'text-emerald-600'
                        : passwordEval.strength === 'Medium'
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }
                  >
                    {passwordEval.strength}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 h-1.5">
                  <div
                    className={`rounded-full transition-colors ${
                      passwordEval.strength === 'Strong'
                        ? 'bg-emerald-500'
                        : passwordEval.strength === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-colors ${
                      passwordEval.strength === 'Strong'
                        ? 'bg-emerald-500'
                        : passwordEval.strength === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-warm-200'
                    }`}
                  />
                  <div
                    className={`rounded-full transition-colors ${
                      passwordEval.strength === 'Strong' ? 'bg-emerald-500' : 'bg-warm-200'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      passwordEval.hasMinLength ? 'text-emerald-700 font-semibold' : 'text-charcoal-500'
                    }`}
                  >
                    <Check className={`w-3 h-3 ${passwordEval.hasMinLength ? 'text-emerald-600' : 'text-warm-400'}`} />
                    6+ chars
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      passwordEval.hasUppercase ? 'text-emerald-700 font-semibold' : 'text-charcoal-500'
                    }`}
                  >
                    <Check className={`w-3 h-3 ${passwordEval.hasUppercase ? 'text-emerald-600' : 'text-warm-400'}`} />
                    1 capital (A-Z)
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 ${
                      passwordEval.hasSpecial ? 'text-emerald-700 font-semibold' : 'text-charcoal-500'
                    }`}
                  >
                    <Check className={`w-3 h-3 ${passwordEval.hasSpecial ? 'text-emerald-600' : 'text-warm-400'}`} />
                    1 special (!@#$)
                  </span>
                </div>
              </div>
            )}
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
              <span>Registering {ROLE_META[selectedRole].shortLabel}...</span>
            ) : (
              <>
                <span>Create {ROLE_META[selectedRole].shortLabel} Account</span>
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
            <span>BCrypt Password Hashing &amp; Role Storage at Auth Service</span>
          </div>
        </div>
      </div>
    </div>
  );
};

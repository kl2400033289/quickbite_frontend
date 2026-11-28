import React from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth, getDefaultRouteForRole, ROLE_META } from '../../context/AuthContext';
import { UserRole } from '../../types/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const effectiveRole: UserRole = role || user.role || 'CUSTOMER';
  if (allowedRoles && !allowedRoles.includes(effectiveRole)) {
    const portalRoute = getDefaultRouteForRole(effectiveRole);
    return (
      <div className="pt-32 pb-20 min-h-screen bg-warm-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-4xl p-8 border border-warm-200 shadow-card text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-warm-100 text-charcoal-700">
              Signed in as {ROLE_META[effectiveRole].label}
            </span>
            <h1 className="text-2xl font-black font-editorial text-charcoal-900">
              Role Access Restricted
            </h1>
            <p className="text-sm text-charcoal-700">
              This portal requires {allowedRoles.map((r) => ROLE_META[r].shortLabel).join(' or ')} permissions.
            </p>
          </div>
          <Link
            to={portalRoute}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-tangerine-500 hover:bg-tangerine-600 text-white text-sm font-bold rounded-2xl shadow-glow-tangerine transition-all"
          >
            <span>Go to My {ROLE_META[effectiveRole].shortLabel} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};


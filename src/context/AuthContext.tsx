import React, { createContext, useContext, useEffect, useState } from 'react';
import { LoginRequest, RegisterRequest, UserResponse, UserRole } from '../types/api';
import { authService } from '../services/authService';
import { getAuthToken } from '../services/api';

export const ROLE_META: Record<
  UserRole,
  { label: string; shortLabel: string; defaultRoute: string; description: string }
> = {
  CUSTOMER: {
    label: 'Customer',
    shortLabel: 'Customer',
    defaultRoute: '/',
    description: 'Browse restaurants, order food & track live delivery',
  },
  RESTAURANT: {
    label: 'Restaurant Partner',
    shortLabel: 'Restaurant',
    defaultRoute: '/dashboard',
    description: 'Manage kitchen menu, accept or reject incoming orders',
  },
  DELIVERY_PARTNER: {
    label: 'Delivery Partner',
    shortLabel: 'Delivery',
    defaultRoute: '/delivery',
    description: 'Pick up confirmed orders and update live delivery status',
  },
  ADMIN: {
    label: 'Platform Admin',
    shortLabel: 'Admin',
    defaultRoute: '/admin',
    description: 'Oversee users, restaurants, and all platform orders',
  },
};

export function getDefaultRouteForRole(role?: UserRole | null): string {
  return role ? ROLE_META[role]?.defaultRoute || '/' : '/';
}

interface AuthContextType {
  user: UserResponse | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOperatorMode: boolean;
  selectedOperatorRestaurantId: number;
  login: (req: LoginRequest) => Promise<UserResponse>;
  register: (req: RegisterRequest) => Promise<UserResponse>;
  logout: () => void;
  toggleOperatorMode: () => void;
  setSelectedOperatorRestaurantId: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(() => {
    try {
      const saved = localStorage.getItem('quickbite_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState(false);
  const [isOperatorMode, setIsOperatorMode] = useState<boolean>(() => {
    return localStorage.getItem('quickbite_operator_mode') === 'true';
  });
  const [selectedOperatorRestaurantId, setSelectedOperatorRestaurantIdState] = useState<number>(() => {
    const saved = localStorage.getItem('quickbite_operator_rest_id');
    return saved ? Number(saved) : 1;
  });

  const setSelectedOperatorRestaurantId = (id: number) => {
    setSelectedOperatorRestaurantIdState(id);
    localStorage.setItem('quickbite_operator_rest_id', String(id));
  };

  const toggleOperatorMode = () => {
    setIsOperatorMode((prev) => {
      const next = !prev;
      localStorage.setItem('quickbite_operator_mode', String(next));
      return next;
    });
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem('quickbite_user');
  };

  useEffect(() => {
    if (token && (!user || !user.role)) {
      authService
        .getCurrentUser()
        .then((fetchedUser) => {
          const normalized: UserResponse = {
            ...fetchedUser,
            role: fetchedUser.role || 'CUSTOMER',
          };
          setUser(normalized);
          localStorage.setItem('quickbite_user', JSON.stringify(normalized));
        })
        .catch(() => {
          logout();
        });
    }
  }, [token, user]);

  const login = async (req: LoginRequest): Promise<UserResponse> => {
    setIsLoading(true);
    try {
      const authRes = await authService.login(req);
      setToken(authRes.token);
      let currentUser: UserResponse;
      if (authRes.userId && authRes.email && authRes.role) {
        currentUser = {
          userId: authRes.userId,
          email: authRes.email,
          role: authRes.role,
        };
      } else {
        currentUser = await authService.getCurrentUser();
      }
      setUser(currentUser);
      localStorage.setItem('quickbite_user', JSON.stringify(currentUser));
      return currentUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (req: RegisterRequest): Promise<UserResponse> => {
    setIsLoading(true);
    try {
      const registered = await authService.register(req);
      if (registered.token) {
        setToken(registered.token);
      }
      const normalized: UserResponse = {
        userId: registered.userId,
        email: registered.email,
        role: registered.role || req.role || 'CUSTOMER',
      };
      setUser(normalized);
      localStorage.setItem('quickbite_user', JSON.stringify(normalized));
      return normalized;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!token,
        isLoading,
        isOperatorMode,
        selectedOperatorRestaurantId,
        login,
        register,
        logout,
        toggleOperatorMode,
        setSelectedOperatorRestaurantId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState } from 'react';
import { LoginRequest, RegisterRequest, UserResponse } from '../types/api';
import { authService } from '../services/authService';
import { getAuthToken } from '../services/api';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOperatorMode: boolean;
  selectedOperatorRestaurantId: number;
  login: (req: LoginRequest) => Promise<void>;
  register: (req: RegisterRequest) => Promise<void>;
  logout: () => void;
  toggleOperatorMode: () => void;
  setSelectedOperatorRestaurantId: (id: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(() => {
    const saved = localStorage.getItem('quickbite_user');
    return saved ? JSON.parse(saved) : null;
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

  useEffect(() => {
    if (token && !user) {
      authService
        .getCurrentUser()
        .then((fetchedUser) => {
          setUser(fetchedUser);
          localStorage.setItem('quickbite_user', JSON.stringify(fetchedUser));
        })
        .catch(() => {
          // Token might be expired or mock
        });
    }
  }, [token, user]);

  const login = async (req: LoginRequest) => {
    setIsLoading(true);
    try {
      const authRes = await authService.login(req);
      setToken(authRes.token);
      let currentUser: UserResponse;
      try {
        currentUser = await authService.getCurrentUser();
      } catch {
        currentUser = { userId: 1, email: req.email };
      }
      setUser(currentUser);
      localStorage.setItem('quickbite_user', JSON.stringify(currentUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (req: RegisterRequest) => {
    setIsLoading(true);
    try {
      const newUser = await authService.register(req);
      // Auto login upon successful registration
      await login({ email: req.email, password: req.password });
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    localStorage.removeItem('quickbite_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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

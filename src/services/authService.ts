import { apiClient, getAuthToken, setAuthToken, USE_MOCK_FALLBACK } from './api';
import { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '../types/api';

export const authService = {
  async register(data: RegisterRequest): Promise<UserResponse> {
    try {
      const res = await apiClient<UserResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        // Safe demo mock registration
        const mockUser: UserResponse = {
          userId: Date.now(),
          email: data.email,
        };
        return mockUser;
      }
      throw error;
    }
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const res = await apiClient<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      if (res.token) {
        setAuthToken(res.token);
      }
      return res;
    } catch (error) {
      if (USE_MOCK_FALLBACK) {
        // Safe demo fallback token
        const mockToken = `mock_jwt_token_${btoa(data.email)}_${Date.now()}`;
        setAuthToken(mockToken);
        return {
          token: mockToken,
          tokenType: 'Bearer',
        };
      }
      throw error;
    }
  },

  async getCurrentUser(): Promise<UserResponse> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      return await apiClient<UserResponse>('/api/auth/me', {
        method: 'GET',
      });
    } catch (error) {
      if (USE_MOCK_FALLBACK && token.startsWith('mock_jwt_token_')) {
        return {
          userId: 1,
          email: 'gourmet.user@quickbite.io',
        };
      }
      throw error;
    }
  },

  logout(): void {
    setAuthToken(null);
  },

  isAuthenticated(): boolean {
    return !!getAuthToken();
  },
};

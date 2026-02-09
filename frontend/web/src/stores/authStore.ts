import { create } from 'zustand';
import { loginUser, registerUser, type User, type AuthResponse } from '@/lib/api/auth';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await loginUser(email, password);
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      set({
        token: response.accessToken,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: AuthResponse = await registerUser(email, password, name);
      localStorage.setItem('auth_token', response.accessToken);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      set({
        token: response.accessToken,
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Registration failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as User;
          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          set({ isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

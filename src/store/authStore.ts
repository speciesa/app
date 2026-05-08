import { create } from 'zustand';
import { storage } from '@/lib/storage';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hasPremium: boolean;
  setHasPremium: (val: boolean) => void;
  rehydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasPremium: false,

  setTokens: (access, refresh) => {
    storage.set('access_token', access);
    storage.set('refresh_token', refresh);
    set({ isAuthenticated: true });
  },

  setUser: (user) => set({ user }),

  logout: () => {
    storage.delete('access_token');
    storage.delete('refresh_token');
    set({ user: null, isAuthenticated: false, hasPremium: false });
  },

  setHasPremium: (val) => set({ hasPremium: val }),

  rehydrate: () => {
    const token = storage.getString('access_token');
    if (token) set({ isAuthenticated: true });
  }
}));

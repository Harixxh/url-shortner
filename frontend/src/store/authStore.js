import { create } from 'zustand';
import { authAPI } from '../utils/api';

export const useAuthStore = create((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  signup: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.signup(data);
      const { user, token } = response.data.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      set({ user, token, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Signup failed';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.login(data);
      const { user, token } = response.data.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      set({ user, token, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  me: async () => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.me();
      const { user } = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, loading: false });
      return user;
    } catch (error) {
      set({ loading: false, error: 'Failed to load profile' });
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await authAPI.updateProfile(data);
      const { user } = response.data.data;
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, loading: false });
      return user;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Profile update failed';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

import { create } from 'zustand';
import { urlsAPI, analyticsAPI } from '../utils/api';

export const useUrlStore = create((set, get) => ({
  urls: [],
  currentUrl: null,
  analytics: null,
  summary: null,
  loading: false,
  error: null,
  pagination: { current: 1, total: 1, count: 0, totalCount: 0 },

  // Create shortened URL
  createUrl: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await urlsAPI.create(data);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to create URL';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Get all URLs
  getUrls: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await urlsAPI.getAll({ page, limit });
      const { urls, pagination } = response.data.data;
      set({ urls, pagination, loading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch URLs';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Get single URL
  getUrl: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await urlsAPI.getOne(id);
      set({ currentUrl: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch URL';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Update URL
  updateUrl: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await urlsAPI.update(id, data);
      set({ loading: false });
      // Refresh URLs list
      get().getUrls();
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update URL';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  incrementClickCount: (id) => {
    set((state) => ({
      urls: state.urls.map((url) =>
        url._id === id ? { ...url, clickCount: (url.clickCount || 0) + 1 } : url
      ),
      summary: state.summary
        ? {
            ...state.summary,
            totalClicks: typeof state.summary.totalClicks === 'number'
              ? state.summary.totalClicks + 1
              : state.summary.totalClicks,
            topPerforming: state.summary.topPerforming?.map((url) =>
              url._id === id ? { ...url, clickCount: (url.clickCount || 0) + 1 } : url
            )
          }
        : state.summary
    }));
  },

  // Delete URL
  deleteUrl: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await urlsAPI.delete(id);
      set({ loading: false });
      // Refresh URLs list
      get().getUrls();
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete URL';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Get analytics
  getAnalytics: async (urlId, days = 7) => {
    set({ loading: true, error: null });
    try {
      const response = await analyticsAPI.getAnalytics(urlId, { days });
      set({ analytics: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch analytics';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  // Get dashboard summary
  getDashboardSummary: async () => {
    set({ loading: true, error: null });
    try {
      const response = await analyticsAPI.getDashboardSummary();
      set({ summary: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to fetch summary';
      set({ error: errorMsg, loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  reset: () => set({ urls: [], currentUrl: null, analytics: null, error: null })
}));

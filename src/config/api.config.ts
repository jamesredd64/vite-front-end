import UserMetadata from '../types/user';
import { useApi } from '../services/api.service';

// Helper function to determine the base API URL
export const getBaseApiUrl = (): string => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // Remove '/api' if it exists in the URL
  const apiUrl = import.meta.env.VITE_API_URL || '';
  return apiUrl.replace('/api', '');
};

// Get the full API URL including the /api path
export const getApiUrl = (): string => {
  const baseUrl = getBaseApiUrl();
  return `${baseUrl}/api`;
};

// Get the URL for serving images
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  const baseUrl = getBaseApiUrl();
  return `${baseUrl}/images/${imagePath}`;
};

// Log environment info in development
if (import.meta.env.DEV) {
  console.log('🚀 Environment:', {
    mode: import.meta.env.MODE,
    dev: import.meta.env.DEV,
    apiUrl: getApiUrl(),
    baseUrl: getBaseApiUrl(),
    envApiUrl: import.meta.env.VITE_API_URL
  });
}

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
    },
    // User endpoints
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${encodeURIComponent(id.replace('google-oauth2|', 'auth0|'))}`,
    USER_BY_EMAIL: (email: string) => `/users/email/${encodeURIComponent(email)}`,
    SAVE_USER_DATA: (id: string) => `/users/${encodeURIComponent(id)}`,
    
    // Calendar endpoints
    CALENDAR: '/calendar',
    USER_CALENDAR_EVENTS: (id: string) => `/calendar/${encodeURIComponent(id)}`,
    
    // Notification endpoints
    NOTIFICATIONS: '/notifications',
    USER_NOTIFICATIONS: (id: string) => `/notifications/user/${encodeURIComponent(id)}`,
    
    // Asset endpoints
    ASSETS: {
      UPLOAD: '/assets/upload',
      DELETE: (filename: string) => `/assets/${encodeURIComponent(filename)}`,
      GET: (filename: string) => `/assets/${encodeURIComponent(filename)}`,
    },
    
    // Health check
    HEALTH: '/health',
  }
} as const;

// Type for API response
interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

// API service hook with proper error handling
export const useApiService = () => {
  const api = useApi();
  
  return {
    // User operations
    getUsers: async () => {
      const response = await api.fetchWithAuth(API_CONFIG.ENDPOINTS.USERS);
      return response.data;
    },
    
    getUserById: async (id: string) => {
      const response = await api.fetchWithAuth(API_CONFIG.ENDPOINTS.USER_BY_ID(id));
      return response.data;
    },
    
    updateUser: async (id: string, data: UserMetadata) => {
      const response = await api.fetchWithAuth(
        API_CONFIG.ENDPOINTS.SAVE_USER_DATA(id),
        {
          method: 'PUT',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
    
    // Asset operations
    uploadImage: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.fetchWithAuth(
        API_CONFIG.ENDPOINTS.ASSETS.UPLOAD,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    
    deleteImage: async (filename: string) => {
      const response = await api.fetchWithAuth(
        API_CONFIG.ENDPOINTS.ASSETS.DELETE(filename),
        {
          method: 'DELETE'
        }
      );
      return response.data;
    },
    
    // Health check
    checkHealth: async () => {
      const response = await api.fetchWithAuth(API_CONFIG.ENDPOINTS.HEALTH);
      return response.data;
    },
  };
};

// Export types for better TypeScript support
export type { ApiResponse };

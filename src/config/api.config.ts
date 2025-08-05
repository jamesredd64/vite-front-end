import UserMetadata from '../types/user';
import { useApi } from '../services/api.service';

// Helper function to determine the base API URL
export const getBaseApiUrl = (): string => {
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  
  // Remove '/api' if it exists in the URL
  const apiUrl = import.meta.env.VITE_API_URL || '';
  return apiUrl;
  // return apiUrl.replace('/api', '');
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
    // Admin endpoints
    ADMIN: {
      GENERATE_CODE: '/admin/generate-code',
      VERIFY_CODE: '/admin/verify-code',
      SETTINGS: '/admin/settings',
      OVERWRITE_ALL: '/admin/settings/overwriteAll'
    },
    // Email endpoints
    EMAIL: '/email',
    SEND_BULK_EMAIL: '/email/send-bulk-email',
    // User endpoints
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${encodeURIComponent(id)}`,
    USER_BY_EMAIL: (email: string) => `/users/email/${encodeURIComponent(email)}`,
    SAVE_USER_DATA: (id: string) => `/users/${encodeURIComponent(id)}`,
    ALL_USERS: '/users',
    
    // Calendar endpoints
    CALENDAR: '/calendar',
    USER_CALENDAR_EVENTS: (id: string) => `/calendar/${encodeURIComponent(id)}`,

    // Scheduled Events endpoints
    SCHEDULED_EVENTS: '/events',
    USER_SCHEDULED_EVENTS: (id: string) => `/scheduled-events/${encodeURIComponent(id)}`,
    EVENT_INVITATION: '/email/event-invitation',
    BULK_EVENT_INVITATION: '/email/bulk-event-invitation',
    

    
    // Notification endpoints
    NOTIFICATIONS: '/notifications',
    USER_NOTIFICATIONS: (auth0Id: string) => `/notifications/${encodeURIComponent(auth0Id)}`,
    NOTIFICATION_BY_ID: (id: string) => `/notifications/id/${encodeURIComponent(id)}`,
    
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

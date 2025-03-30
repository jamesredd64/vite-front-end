import UserMetadata from '../types/user';
import { useApi } from '../services/api.service';

export const getApiUrl = () => {
  const mode = import.meta.env.DEV ? 'development' : 'production';
  const apiUrl = import.meta.env.DEV ? 'http://localhost:5000' : import.meta.env.VITE_API_URL;
  
  console.log(`🚀 App running in ${mode} mode`);
  console.log(`📡 API URL: ${apiUrl}`);
  console.log('Environment variables:', {
    DEV: import.meta.env.DEV,
    MODE: import.meta.env.MODE,
    VITE_API_URL: import.meta.env.VITE_API_URL
  });
  
  return apiUrl;
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  ENDPOINTS: {
    USERS: '/api/users',
    USER_BY_ID: (id: string) => `/users/${encodeURIComponent(id)}`,
    USER_BY_EMAIL: (email: string) => `/users/email/${encodeURIComponent(email)}`,
    SAVE_USER_DATA: (id: string) => `/users/${encodeURIComponent(id)}`,
    USER_CALENDAR_EVENTS: (id: string) => `/calendar/${encodeURIComponent(id)}`
  }
} as const;

// Create a hook for API operations
export const useApiService = () => {
  const api = useApi();
  
  return {
    getUsers: () => api.getUsers(),
    getUserById: (id: string) => api.getUserById(id),
    updateUser: (id: string, data: UserMetadata) => api.updateUser(id, data),
  };
};

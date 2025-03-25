import UserMetadata from '../types/user';
import { useApi } from '../services/api.service';

export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production'
    ? 'https://admin-backend-eta.vercel.app/api'  // Production URL
    : 'http://localhost:5000/api',                // Development URL
  ENDPOINTS: {
    USERS: '/users',
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

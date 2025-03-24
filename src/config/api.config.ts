import UserMetadata from '../types/user';
import { useApi } from '../services/api.service';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://admin-backend-eta.vercel.app',
  ENDPOINTS: {
    USERS: '/api/users',
    USER_BY_ID: (id: string) => `/api/users/${encodeURIComponent(id)}`,
    USER_BY_EMAIL: (email: string) => `/api/users/email/${encodeURIComponent(email)}`,
    SAVE_USER_DATA: (id: string) => `/api/users/${encodeURIComponent(id)}`,
    USER_CALENDAR_EVENTS: (id: string) => `/api/calendar/${encodeURIComponent(id)}`
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

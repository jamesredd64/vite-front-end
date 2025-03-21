export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE,
  ENDPOINTS: {
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${encodeURIComponent(id)}`,
    USER_BY_EMAIL: (email: string) => `/users/email/${encodeURIComponent(email)}`,
    SAVE_USER_DATA: (id: string) => `/users/${encodeURIComponent(id)}/save`,
    HEALTH: '/health'
  }
} as const;

// Add type definition
export type ApiConfig = typeof API_CONFIG;

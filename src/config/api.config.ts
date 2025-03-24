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
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    USERS: '/users',
    USER_BY_ID: (id: string) => `/users/${encodeURIComponent(id)}`,
    USER_BY_EMAIL: (email: string) => `/users/email/${encodeURIComponent(email)}`,
    SAVE_USER_DATA: (id: string) => `/users/${encodeURIComponent(id)}`,
    USER_CALENDAR_EVENTS: (auth0Id: string) => `/calendar/events/user/${encodeURIComponent(auth0Id)}`
  }
};

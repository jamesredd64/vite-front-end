import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { getAccessTokenSilently } = useAuth0();
  try {
    const token = await getAccessTokenSilently();
    config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error('Error getting access token:', error);
  }
  return config;
});

export default api;

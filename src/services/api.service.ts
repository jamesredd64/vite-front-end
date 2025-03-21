
import { API_CONFIG } from '../config/api.config';
import { useAuth0 } from '@auth0/auth0-react';

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getHeaders = async () => {
    const token = await getAccessTokenSilently();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'API request failed');
    }
    return response.json();
  };

  return {
    // User operations
    getAllUsers: async () => {
      const headers = await getHeaders();
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`, { headers });
      return handleResponse(response);
    },

    getUserByEmail: async (email: string) => {
      const headers = await getHeaders();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_EMAIL(email)}`, 
        { headers }
      );
      return handleResponse(response);
    },

    updateUserByEmail: async (email: string, userData: any) => {
      const headers = await getHeaders();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_EMAIL(email)}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(userData),
        }
      );
      return handleResponse(response);
    },

    // Health check
    checkHealth: async () => {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`);
      return handleResponse(response);
    }
  };
};
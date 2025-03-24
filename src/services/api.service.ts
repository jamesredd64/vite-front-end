
import { API_CONFIG } from '../config/api.config';
import { useAuth0 } from '@auth0/auth0-react';

interface UserData {
  email: string;
  name?: string;
  picture?: string;
  // Add other user properties as needed
}

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getHeaders = async () => {
    const token = await getAccessTokenSilently();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  };

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `API request failed: ${response.status}`);
    }
    return response.json();
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = await getHeaders();
    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers }
    });
    return handleResponse(response);
  };

  return {
    fetchWithAuth,
    // Add your API methods here
    getUsers: () => fetchWithAuth(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`),
    getUserById: (id: string) => fetchWithAuth(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_BY_ID(id)}`),
    updateUser: (id: string, data: UserData) => fetchWithAuth(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SAVE_USER_DATA(id)}`,
      {
        method: 'PUT',
        body: JSON.stringify(data)
      }
    )
  };
};

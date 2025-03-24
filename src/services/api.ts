import { useAuth0 } from '@auth0/auth0-react';

const API_URL = import.meta.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://admin-backend-eta.vercel.app'
    : 'https://admin-backend-eta.vercel.app');

interface UserData {
  email: string;
  name?: string;
  picture?: string;
}

interface ApiError {
  message: string;
  status: number;
}

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getHeaders = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email'
      }
    });
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin
    };
  };

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || 'An error occurred';
      } catch {
        errorMessage = await response.text();
      }
      
      const error: ApiError = {
        message: errorMessage,
        status: response.status
      };
      throw error;
    }
    return response.json();
  };

  const fetchWithConfig = async (url: string, options: RequestInit = {}) => {
    const headers = await getHeaders();
    const defaultOptions: RequestInit = {
      headers,
      credentials: 'include',
      mode: 'cors'
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: { ...headers, ...options.headers }
    });

    return handleResponse(response);
  };

  const saveUser = async (userData: UserData) => {
    try {
      return await fetchWithConfig(`${API_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    } catch (error) {
      console.error('Save user error:', error);
      throw error;
    }
  };

  const getUserByEmail = async (email: string) => {
    try {
      return await fetchWithConfig(`${API_URL}/users/email/${encodeURIComponent(email)}`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  };

  return {
    saveUser,
    getUserByEmail,
  };
};
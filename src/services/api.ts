import { useAuth0 } from '@auth0/auth0-react';

const API_URL = import.meta.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'admin-backend-eta.vercel.app'
    : 'admin-backend-eta.vercel.app');

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
    const token = await getAccessTokenSilently();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin
    };
  };
  

  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error: ApiError = {
        message: await response.text(),
        status: response.status
      };
      throw error;
    }
    return response.json();
  };

  const saveUser = async (userData: UserData) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData),
        credentials: 'include',
        mode: 'cors'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Save user error:', error);
      throw error;
    }
  };

  const getUserByEmail = async (email: string) => {
    try {
      const headers = await getHeaders();
      const response = await fetch(`${API_URL}/users/email/${email}`, {
        method: 'GET',
        headers,
        credentials: 'include',
        mode: 'cors'
      });
      return handleResponse(response);
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

import { useAuth0 } from '@auth0/auth0-react';

const API_URL = import.meta.env.VITE_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'admin-backend-eta.vercel.app'
    : 'admin-backend-eta.vercel.app');

interface UserData {
  email: string;
  name?: string;
  picture?: string;
  // Add other user fields as needed based on your application's requirements
}

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  // https://admin-backend-eta.vercel.app/api

  const getHeaders = async () => {
    const token = await getAccessTokenSilently();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const saveUser = async (userData: UserData) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(userData),
    });
    return response.json();
  };

  const getUserByEmail = async (email: string) => {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/users/email/${email}`, {
      headers,
    });
    return response.json();
  };

  return {
    saveUser,
    getUserByEmail,
  };
};

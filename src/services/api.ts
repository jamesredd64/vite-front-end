import { useAuth0 } from '@auth0/auth0-react';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://admin-backend-fe464w9bo-jamesredd64s-projects.vercel.app'
  : 'http://localhost:5000/api';

export const useApi = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getHeaders = async () => {
    const token = await getAccessTokenSilently();
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const saveUser = async (userData: any) => {
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
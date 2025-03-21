import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

export const AuthTokenHandler = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          console.log('Access Token:', token);
          // Store token as needed
          // localStorage.setItem('access_token', token);
        } catch (error) {
          console.error('Error getting access token:', error);
        }
      }
    };

    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return null;
};
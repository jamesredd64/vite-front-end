import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface ApiError {
  message: string;
  status?: number;
}

export const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [error] = useState<ApiError | null>(null);
  const [loading] = useState(false);

  const getAuthHeaders = async () => {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://dev-uizu7j8qzflxzjpy.us.auth0.com/api/v2/',
        scope: 'openid profile email'
      }
    });
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  // const handleError = (err: unknown) => {
  //   // Generic error message for production
  //   const apiError: ApiError = {
  //     message: process.env.NODE_ENV === 'development' 
  //       ? (err instanceof Error ? err.message : 'An unknown error occurred')
  //       : 'An error occurred',
  //   };
  //   setError(apiError);
  //   setLoading(false);
    
  //   // Log only in development
  //   if (process.env.NODE_ENV === 'development') {
  //     console.error('API Error:', err);
  //   }
  // };

  // Add Auth0-specific operations here if needed

  return {
    getAuthHeaders,
    error,
    loading,
  };
};


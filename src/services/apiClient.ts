import { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface ApiError {
  message: string;
  status?: number;
}

export const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleError = (err: any) => {
    console.error('Auth0 API Error:', err);
    const apiError: ApiError = {
      message: err instanceof Error ? err.message : 'An unknown error occurred',
    };
    setError(apiError);
    setLoading(false);
  };

  // Add Auth0-specific operations here if needed

  return {
    getAuthHeaders,
    error,
    loading,
  };
};


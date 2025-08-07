// services/authToken.service.ts
import { Auth0ContextInterface, useAuth0 } from '@auth0/auth0-react';
import { AUTH_CONFIG } from '../config/auth.config';

export const useAccessToken = () => {
  const { getAccessTokenSilently }: Auth0ContextInterface = useAuth0();

  const getToken = async (): Promise<string> => {
    return await getAccessTokenSilently({
      authorizationParams: {
        audience: AUTH_CONFIG.audience,
        scope: AUTH_CONFIG.scope
      }
    });
  };

  return { getToken };
};

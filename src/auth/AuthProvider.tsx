import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email'
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      skipRedirectCallback={window.location.pathname === '/signed-out'}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;

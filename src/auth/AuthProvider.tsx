/* eslint-disable @typescript-eslint/no-unused-vars */
import { Auth0Provider } from '@auth0/auth0-react';
import React, { useEffect } from 'react';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Add console logs to monitor changes in environment variables
  console.log("Auth0 Domain:", import.meta.env.VITE_AUTH0_DOMAIN);
  console.log("Auth0 Client ID:", import.meta.env.VITE_AUTH0_CLIENT_ID);
  console.log("Auth0 Audience:", import.meta.env.VITE_AUTH0_AUDIENCE);

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}`,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email',
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={(appState?: { returnTo?: string }) => {
        // Log the appState during redirect handling
        console.log("Redirect Callback appState:", appState);

        if (appState && typeof appState.returnTo === 'string' && appState.returnTo.length > 0) {
          console.log("Navigating to returnTo:", appState.returnTo);
          window.history.replaceState({}, document.title, appState.returnTo);
        } else {
          console.log("Default navigation to '/'");
          window.history.replaceState({}, document.title, appState?.returnTo || '/'); // Default to '/'
        }
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;

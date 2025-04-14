import { Auth0Client } from '@auth0/auth0-spa-js';

export const forceLogout = async (auth0Client?: Auth0Client) => {
  // Clear all storage
  localStorage.clear();
  sessionStorage.clear();

  // Save the current theme preference if needed
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    localStorage.setItem('theme', savedTheme);
  }

  // If auth0Client is provided, use it to logout
  if (auth0Client) {
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
      }
    });
  }

  // Force reload the page
  window.location.href = '/signed-out';
};
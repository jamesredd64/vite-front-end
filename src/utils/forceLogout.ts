import { Auth0Client } from '@auth0/auth0-spa-js';
import { useNavigate } from "react-router-dom";

export const forceLogout = async (auth0Client?: Auth0Client) => {
  // Cancel all pending requests
  window.stop();
  
  // Clear all storage except theme
  const savedTheme = localStorage.getItem('theme');
  // localStorage.clear();
  // sessionStorage.clear();
  if (savedTheme) {
    localStorage.setItem('theme', savedTheme);
  }

  // Clear any existing timeouts and intervals
  // const highestTimeoutId = setTimeout(() => {});
  // for (let i = 0; i < highestTimeoutId; i++) {
  //   clearTimeout(i);
  //   clearInterval(i);
  // }

  // Remove all event listeners (if any were set globally)
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const navigate = useNavigate();
  events.forEach(event => {
    window.removeEventListener(event, () => {});
  });

  if (auth0Client) {
    try {
      await auth0Client.logout({
        logoutParams: {
          returnTo: `${window.location.origin}/signed-out`,
          clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback to manual redirect
      window.location.href = '/signed-out';
    }
  } else {
    // window.location.href = '/signed-out';
    navigate('/signed-out');
  }
};

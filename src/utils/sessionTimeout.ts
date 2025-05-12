// import { useNavigate } from "react-router-dom";

interface TimeoutClient {
  logout: () => Promise<void>;
}

const SESSION_TIMEOUT = 20 * 60 * 1000; // 30 minutes in milliseconds
  
let timeoutId: NodeJS.Timeout;
let client: TimeoutClient | undefined;

const handleTimeout = async () => {
    // const navigate = useNavigate();
  // import {useNavigate } from "react-router-dom";
  // const navigate = useNavigate();

  if (client) {
    try {
      // Cancel all pending requests
      window.stop();
      
      // Clear all storage except theme and userRole
      const savedTheme = localStorage.getItem('theme');
      const userRole = localStorage.getItem('userRole');
      
      // Clear specific items instead of everything
      for (const key of Object.keys(localStorage)) {
        if (key !== 'theme' && key !== 'userRole') {
          localStorage.removeItem(key);
        }
      }
      // sessionStorage.clear();

      // Clear any existing timeouts and intervals
      // const highestTimeoutId = setTimeout(() => {});
      // for (let i = 0; i < highestTimeoutId; i++) {
      //   clearTimeout(i);
      //   clearInterval(i);
      // }

      // Redirect to signed-out page
      window.location.href = '/signed-out';
      
    } catch (error) {
      console.error('Session timeout error:', error);
      window.location.href = '/signed-out';
      // navigate('/signed-out');
    }
  }
};

const resetTimeout = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(handleTimeout, SESSION_TIMEOUT);
};

export const initSessionTimeout = (timeoutClient: TimeoutClient) => {
  client = timeoutClient;
  
  // Reset timeout on user activity
  const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
  events.forEach(event => {
    window.addEventListener(event, resetTimeout);
  });

  // Initial timeout setup
  resetTimeout();

  // Cleanup function
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    events.forEach(event => {
      window.removeEventListener(event, resetTimeout);
    });
    client = undefined;
  };
};



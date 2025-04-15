interface TimeoutClient {
  logout: () => Promise<void>;
}

const SESSION_TIMEOUT = 10 * 60 * 1000; // 30 minutes in milliseconds
let timeoutId: NodeJS.Timeout;
let client: TimeoutClient | undefined;

const resetTimeout = () => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  timeoutId = setTimeout(() => {
    if (client) {
      client.logout();
    }
  }, SESSION_TIMEOUT);
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
  };
};


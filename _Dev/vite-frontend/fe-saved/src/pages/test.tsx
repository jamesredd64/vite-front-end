import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

const TestPage = () => {
  const { logout } = useAuth0();

  const handleLogout = async () => {
    // Clear storage
    localStorage.clear();
    sessionStorage.clear();

    // Logout with Auth0
    logout({
      logoutParams: {
        returnTo: window.location.origin,
        clientId: import.meta.env.VITE_AUTH0_CLIENT_ID
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-boxdark-2">
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center px-4">
          <h1 className="mb-4 text-4xl font-bold text-black dark:text-black">
            Test Page
          </h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 bg-red-500 text-white hover:bg-red-600 transform transition-transform duration-200 hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
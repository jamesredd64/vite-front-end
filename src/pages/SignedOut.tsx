import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VERSION } from '../config/version';

const SignedOut = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const buildDate = new Date(VERSION.buildDate).toLocaleDateString();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      return;
    }

    // Ensure cleanup happens regardless of how we got here
    const cleanup = () => {
      // Clear any remaining auth state
      const savedTheme = localStorage.getItem('theme');
      localStorage.clear();
      sessionStorage.clear();
      if (savedTheme) {
        localStorage.setItem('theme', savedTheme);
      }

      // Cancel any pending requests
      window.stop();
      
      // Clear any existing timeouts and intervals
      const highestTimeoutId = setTimeout(() => { });
      for (let i = 0; i < Number(highestTimeoutId); i++) {
        clearTimeout(i);
        clearInterval(i);
      }
      
      // Remove any query parameters from URL
      if (window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    cleanup();
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-gray-900">
      <div className="relative flex min-h-screen w-full items-center justify-center p-6 overflow-hidden z-1">
        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800/90 backdrop-blur-sm">
          <h1 className="mb-3 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Our Dashboard
          </h1>
          
          <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
            Please sign in to access your personalized dashboard and manage your account.
          </p>
          
          <button
            onClick={() => loginWithRedirect()}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </div>

        {/* Copyright and Version */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Stagholme Inc. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Version {VERSION.number} 
            {VERSION.isVercel && ' • Vercel'} 
            {VERSION.environment !== 'production' && ` • ${VERSION.environment}`}
            {' • '}{buildDate}
          </p>
        </div>
      </div>
    </div>
  );
}
export default SignedOut;

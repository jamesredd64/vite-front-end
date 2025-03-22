import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

export const SignedOut = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="relative flex min-h-screen w-full items-center justify-center p-6 overflow-hidden z-1">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-50/50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50" />
          <div className="absolute h-full w-full" style={{
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800/90 backdrop-blur-sm">
          {/* Logo */}
          {/* <div className="mb-8 flex justify-center">
            <img
              src="/images/logo/logo.webp"
              alt="Logo"
              className="h-12 w-auto dark:hidden"
            />
            <img
              src="/images/logo/logo.webp"
              alt="Logo"
              className="hidden h-12 w-auto dark:block"
            />
          </div> */}

          {/* Welcome Text */}
          <h1 className="mb-3 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to Our Dashboard
          </h1>
          
          <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
            Please sign in to access your personalized dashboard and manage your account.
          </p>

          {/* Sign In Button */}
          <div className="flex justify-center">
            <button
              onClick={() => loginWithRedirect()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              <svg 
                className="h-5 w-5" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              Sign In to Continue
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};



/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '../components/common/PageMeta';
import { VERSION } from '../config/version';

const Welcome: React.FC = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const buildDate = new Date(VERSION.buildDate).toLocaleDateString();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen w-screen bg-white dark:bg-gray-900">
      <div className="relative flex min-h-screen w-screen items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-screen rounded-none bg-white p-6 shadow-lg dark:bg-gray-800/90 backdrop-blur-sm">
          <div className="w-screen mx-auto">
            <h1 className="mb-6 text-center text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Welcome to Our Dashboard
            </h1>
            
            <div className="mb-8 text-center">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
                Your all-in-one solution for business management and analytics
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Get started by signing in to access your personalized dashboard, manage your account, and explore powerful features.
              </p>
            </div>

            <div className="flex justify-center mb-12">
              <button
                onClick={() => loginWithRedirect()}
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In to Get Started
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  title: "Real-time Analytics",
                  description: "Monitor your business performance with live data and insights"
                },
                {
                  title: "User Management",
                  description: "Efficiently manage users and their permissions"
                },
                {
                  title: "Marketing Tools",
                  description: "Powerful tools to boost your marketing campaigns"
                }
              ].map((feature, index) => (
                <div key={index} className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-shadow duration-200">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Stagholme Inc. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Version {VERSION.number} 
                {VERSION.isVercel && ' • Vercel'} 
                {VERSION.environment !== 'production' && ` • ${VERSION.environment}`}
                {' • '}{buildDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;




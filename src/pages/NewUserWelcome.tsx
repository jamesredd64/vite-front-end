import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';

const NewUserWelcome: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  
  const handleProfileClick = () => {
    navigate('/attendee/profile');
  };

  return (
    <div className="relative font-normal font-sans z-[1] bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <div className="p-4 md:p-6 2xl:p-2">
        <div className="rounded-md border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-800/50">
          <PageMeta title="Welcome" description="Welcome to your dashboard" />
          <PageBreadcrumb pageTitle="Welcome" />

          {/* Welcome Header */}
          <div className="mb-8 text-center">
            <div className="mb-4">
              <img
                src={user?.picture || '/default-avatar.png'}
                alt="Profile"
                className="mx-auto h-20 w-20 rounded-full border-4 border-brand-100 dark:border-gray-700"
              />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Welcome, {user?.name || 'New User'}!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Let's get started by setting up your profile
            </p>
          </div>

          {/* Main Content */}
          <div className="mb-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Getting Started Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Getting Started
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Create your account
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-brand-500">→</span>
                    Complete your profile
                  </li>
                  <li className="flex items-center opacity-50">
                    <span className="mr-2">○</span>
                    Explore the dashboard
                  </li>
                </ul>
              </div>

              {/* Why Complete Profile Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                  Why Complete Your Profile?
                </h2>
                <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Personalized experience
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Access to all features
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    Better communication
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={handleProfileClick}
              className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-3 text-base font-medium text-white transition duration-300 ease-in-out hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Complete Your Profile
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUserWelcome;
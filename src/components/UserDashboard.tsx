import React from 'react';
import PageMeta from './common/PageMeta';import PageBreadcrumb from './common/PageBreadCrumb';
const UserDashboard: React.FC = () => {
  return (    <>
      <PageMeta        title="User Dashboard | TailAdmin"
        description="User dashboard showing personalized metrics and options"      />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="grid grid-cols-12 gap-4 md:gap-6">        {/* Main Content Area */}
        <div className="col-span-12 space-y-6 xl:col-span-8">          {/* Welcome Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Welcome Back            </h3>
            <p className="text-gray-600 dark:text-gray-300">              Here's what's happening with your account today.
            </p>          </div>
          {/* Activity Summary */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Your Activity            </h3>
            <div className="grid grid-cols-2 gap-4">              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Login</h4>                <p className="text-lg font-semibold text-gray-900 dark:text-white">Today, 9:30 AM</p>
              </div>              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</h4>                <p className="text-lg font-semibold text-green-500">Active</p>
              </div>            </div>
          </div>        </div>
        {/* Sidebar */}
        <div className="col-span-12 space-y-6 xl:col-span-4">          {/* Quick Links */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
              Quick Links            </h3>
            <div className="space-y-3">              <button className="w-full rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">
                View Profile              </button>
              <button className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300">                Settings
              </button>            </div>
          </div>
          {/* Notifications */}          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">              Recent Notifications
            </h3>            <div className="space-y-4">
              {/* Add notification items here */}            </div>
          </div>        </div>
      </div>    </>
  );};

export default UserDashboard;








































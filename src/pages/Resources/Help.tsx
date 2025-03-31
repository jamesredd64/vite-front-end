import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const Help: React.FC = () => {
  return (
    <>
      <PageMeta title="Help Center" />
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Help Center</h1>
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="border-b border-stroke dark:border-strokedark pb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">How do I reset my password?</h3>
                  <p className="text-gray-600 dark:text-gray-300">Click on the "Forgot Password" link on the login page...</p>
                </div>
                <div className="border-b border-stroke dark:border-strokedark pb-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">How do I contact support?</h3>
                  <p className="text-gray-600 dark:text-gray-300">You can reach our support team through...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;
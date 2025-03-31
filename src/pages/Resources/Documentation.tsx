import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const Documentation: React.FC = () => {
  return (
    <>
      <PageMeta title="Documentation" />
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Documentation</h1>
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Getting Started</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn how to get started with our platform and make the most of its features.
              </p>
              <div className="space-y-2">
                <a href="#" className="block text-primary hover:underline">Quick Start Guide</a>
                <a href="#" className="block text-primary hover:underline">API Documentation</a>
                <a href="#" className="block text-primary hover:underline">Best Practices</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Documentation;
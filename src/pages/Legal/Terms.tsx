import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const Terms: React.FC = () => {
  return (
    <>
      <PageMeta title="Terms of Service" description={''} />
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Terms</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  By accessing this website, you are agreeing to be bound by these terms of service...
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Use License</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Permission is granted to temporarily download one copy of the materials...
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
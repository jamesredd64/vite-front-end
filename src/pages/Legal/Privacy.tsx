import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const Privacy: React.FC = () => {
  return (
    <>
      <PageMeta title="Privacy Policy" />
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
            <div className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Data Collection</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We collect information that you provide directly to us...
                </p>
              </section>
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Use of Information</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We use the information we collect to operate and improve our services...
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
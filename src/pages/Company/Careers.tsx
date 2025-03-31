import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const Careers: React.FC = () => {
  return (
    <>
      <PageMeta title="Careers" />
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Careers</h1>
          <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6 2xl:p-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Join Our Team</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're always looking for talented individuals to join our growing team. Explore opportunities in:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-6">
              <li>Software Development</li>
              <li>Product Design</li>
              <li>Customer Success</li>
              <li>Sales & Marketing</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Careers;
import React from 'react';
import PageMeta from '../../components/common/PageMeta';

const Blog: React.FC = () => {
  return (
    <>
      <PageMeta title="Blog" />
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
          <div className="space-y-6">
            {[1, 2, 3].map((post) => (
              <div key={post} className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Latest Updates and Insights</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Stay up to date with our latest features, tips, and industry insights.
                </p>
                <a href="#" className="text-primary hover:underline">Read more →</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
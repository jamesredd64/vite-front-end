import React from 'react';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ChangelogViewer from '../../components/Changelog/ChangelogViewer';

const ChangelogPage: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Changelog | Dashboard"
        description="View the latest changes and updates to our application"
      />
      <PageBreadcrumb pageTitle="Changelog" />
      
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Release History
          </h1>
        </div>
        
        <ChangelogViewer />
      </div>
    </>
  );
};

export default ChangelogPage;
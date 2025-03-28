import React, { useEffect, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';

const MarketingDashboard: React.FC = () => {
  const [loaded, setLoaded] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    // Get initial dark mode from localStorage
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoaded(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Save dark mode preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark bg-gray-900' : ''}>
      {/* Preloader */}
      {loaded && (
        <div className="fixed left-0 top-0 z-[999999] flex h-screen w-screen items-center justify-center bg-white dark:bg-black">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-brand-500 border-t-transparent"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen">
        <PageMeta 
          title="Marketing Dashboard | TailAdmin - React Admin Template"
          description="Marketing dashboard showing key metrics and analytics"
        />
        
        <PageBreadcrumb pageTitle="Marketing Dashboard" />

        {/* Your dashboard content here */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* Add your dashboard widgets/cards here */}
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;
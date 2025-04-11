import React from 'react';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import PageMeta from '../components/common/PageMeta';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen">
      <PageMeta
        title="Admin Dashboard | TailAdmin"
        description="Admin dashboard and management interface"
      />
      <PageBreadcrumb pageTitle="Admin" />
      
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {children}
      </div>
    </div>
  );
}
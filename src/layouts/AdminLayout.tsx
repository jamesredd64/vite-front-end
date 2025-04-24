import React from 'react';
import AdminSidebar from '../layout/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 ml-[90px] lg:ml-[290px] p-4">
        {children}
      </main>
    </div>
  );
}

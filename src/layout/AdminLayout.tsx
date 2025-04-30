/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useAdmin } from '../hooks/useAdmin';
import AdminSidebar from './AdminSidebar';
import AppHeader from './AppHeader';
import Backdrop from './Backdrop';
import { useSidebar } from '../context/SidebarContext';
import AppFooter from './AppFooter';

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading: isAuth0Loading } = useAuth0();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  if (isAuth0Loading || isAdminLoading) {
    return <div>Loading Admin Layout...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signed-out" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AdminSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default AdminLayout;  

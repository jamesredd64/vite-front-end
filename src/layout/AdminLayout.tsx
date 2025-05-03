/* eslint-disable @typescript-eslint/no-unused-vars */
<<<<<<< Updated upstream
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useAdmin } from '../hooks/useAdmin';
import AdminSidebar from './AdminSidebar';
import AppHeader from './AppHeader';
import Backdrop from './Backdrop';
import { useSidebar } from '../context/SidebarContext';
import AppFooter from './AppFooter';
=======
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useGlobalStorage } from '../hooks/useGlobalStorage';
import { UserMetadata } from '../types/user';
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AdminSidebar from "./AdminSidebar";
import AppFooter from "./AppFooter";
import { useAdmin } from "../hooks/useAdmin";
// import AdminSidebar from "./AdminSidebar";
>>>>>>> Stashed changes

const AdminLayout: React.FC = () => {
  const { isAuthenticated, isLoading: isAuth0Loading } = useAuth0();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
<<<<<<< Updated upstream
<<<<<<< Updated upstream

  if (isAuth0Loading || isAdminLoading) {
    return <div>Loading Admin Layout...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signed-out" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
=======
=======
>>>>>>> Stashed changes
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { isAdmin } = useAdmin();
  const isAdminUser = isAdmin; 
  // userMetadata?.profile?.role === 'admin' || userMetadata?.profile?.role === 'super-admin';
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
export default AdminLayout;  
=======
interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC = () => {
// React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AdminLayout;
>>>>>>> Stashed changes

/* eslint-disable @typescript-eslint/no-unused-vars */
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useGlobalStorage } from '../hooks/useGlobalStorage';
import { useAdmin } from '../hooks/useAdmin';
import { UserMetadata } from '../types/user';
import { Outlet, Navigate } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import AdminSidebar from "./AdminSidebar";
import { useAuth0 } from '@auth0/auth0-react';

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { isAuthenticated, isLoading: isAuth0Loading } = useAuth0();

  // Wait for both Auth0 and admin status to load
  if (isAuth0Loading || isAdminLoading) {
    return <div>Loading App Layout</div>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signed-out" replace />;
  }
=======
=======
>>>>>>> Stashed changes
import { useAdmin } from "../hooks/useAdmin";
// import AdminSidebar from "./AdminSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        {isAdmin ? <AppSidebar /> : <AppSidebar />}
=======
       <AppSidebar />
        {/* {isAdminUser ? <AppSidebar /> : <AppSidebar />} */}
>>>>>>> Stashed changes
=======
       <AppSidebar />
        {/* {isAdminUser ? <AppSidebar /> : <AppSidebar />} */}
>>>>>>> Stashed changes
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

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;

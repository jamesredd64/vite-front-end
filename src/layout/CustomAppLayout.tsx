import React from 'react';
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useGlobalStorage } from '../hooks/useGlobalStorage';
import { UserMetadata } from '../types/user';
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";
import AdminSidebar from "./AdminSidebar";
import { useAdmin } from "../hooks/useAdmin";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { isAdmin } = useAdmin();

  const isAdminUser = isAdmin;

  return (
    <div className="min-h-screen flex flex-col xl:flex-row">
      <div>
        {/* Conditionally render the correct sidebar */}
        {isAdminUser ? <AdminSidebar /> : <AppSidebar />}
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        {/* Wrap header and main content in a container with controlled spacing */}
        <div className="pt-1"> {/* Adjust padding-top here to control gap */}
          <AppHeader />
          <main className="p-4 mx-auto max-w-screen-3xl md:p-6">
            <Outlet />
          </main>
          <AppFooter />
        </div>
      </div>
    </div>
  );
};

const CustomAppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default CustomAppLayout;

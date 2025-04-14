import React from 'react';
import { useSidebar } from "../context/SidebarContext";
import AppHeader from "../layout/AppHeader";
import Backdrop from "../layout/Backdrop";
import AppSidebar from "../layout/AppSidebar";
import AppFooter from "../layout/AppFooter";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default AdminLayout;
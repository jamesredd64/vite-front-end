// src/layout/UserDashboard.tsx
import React from 'react';
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useGlobalStorage } from '../hooks/useGlobalStorage';
import { UserMetadata } from '../types/user';
import { Outlet } from "react-router";
import AppHeader from "../layout/AppHeader";
import Backdrop from "../layout/Backdrop";
import AppSidebar from "../layout/AppSidebar";
import AppFooter from "../layout/AppFooter";
import { useAdmin } from "../hooks/useAdmin";

const { isExpanded, isHovered, isMobileOpen } = useSidebar();
const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
const { isAdmin } = useAdmin();
const isAdminUser = isAdmin;

export const UserDashboard: React.FC = () => {
  return (
    <div className="min-h-screen xl:flex">
      <div>
       <AppSidebar />
        {/* {isAdminUser ? <AppSidebar /> : <AppSidebar />} */}
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

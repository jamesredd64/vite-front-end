import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useGlobalStorage } from '../hooks/useGlobalStorage';
import { UserMetadata } from '../types/user';
import { Outlet } from "react-router-dom"; // Fixed import
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import AppFooter from "./AppFooter";
import AdminSidebar from "./AdminSidebar";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);

  const isAdminUser = userMetadata?.profile?.role === 'admin' || userMetadata?.profile?.role === 'super-admin';

  return (
    <div className="min-h-screen xl:flex">
      <div>
        {/* Conditionally render the correct sidebar */}
        {/* {isAdminUser ? <AdminSidebar /> : <AppSidebar />} */}
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6"> {/* Fixed Tailwind class */}
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

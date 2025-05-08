import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { useGlobalStorage } from '../hooks/useGlobalStorage';
import { UserMetadata } from '../types/user';
import { Outlet } from "react-router-dom"; // Ensuring correct import
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AdminSidebar from "./AdminSidebar";
import AppFooter from "./AppFooter";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  // const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);

  // const isAdminUser = userMetadata?.profile?.role === 'admin' || userMetadata?.profile?.role === 'super-admin';

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
        <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
          <Outlet /> {/* Renders nested routes properly */}
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

const AdminLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AdminLayout;

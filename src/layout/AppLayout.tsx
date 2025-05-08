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

  console.log("************************isAdminUser************", isAdminUser);

  return (
    <div className="min-h-screen flex flex-col xl:flex-row">
      <div>
        {/* Conditionally render the correct sidebar */}
        {isAdminUser ? <AdminSidebar /> : <AppSidebar />}       
        {/* <AppSidebar /> */}
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <main className="p-4 mx-auto max-w-screen-3xl md:p-6">
          <Outlet />
        </main>
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


// import { useSidebar, SidebarProvider } from "../context/SidebarContext";
// import { useGlobalStorage } from "../hooks/useGlobalStorage";
// import { UserMetadata } from "../types/user";
// import { Outlet } from "react-router-dom";
// import AppHeader from "./AppHeader";
// import Backdrop from "./Backdrop";
// import AppSidebar from "./AppSidebar";
// import AppFooter from "./AppFooter";
// import AdminSidebar from "./AdminSidebar";
// import { useAdmin } from "../hooks/useAdmin";

// const LayoutContent: React.FC = () => {
//   const { isExpanded, isHovered, isMobileOpen } = useSidebar(); // ✅ Using context values
//   const [userMetadata] = useGlobalStorage<UserMetadata | null>("userMetadata", null);
//   const { isAdmin } = useAdmin();

//   console.log("Admin Status:", isAdmin);

//   return (
//     <div className="min-h-screen xl:flex">
//       <div>
//         {/* Conditionally render the correct sidebar */}
//         {isAdmin ? <AdminSidebar /> : <AppSidebar />}
//         <Backdrop />
//       </div>
//       <div
//         className={`flex-1 transition-all duration-300 ease-in-out ${
//           isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
//         } ${isMobileOpen ? "ml-0" : ""}`}
//       >
//         <AppHeader />
//         <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
//           <Outlet />
//         </div>
//         <AppFooter />
//       </div>
//     </div>
//   );
// };

// const AppLayout: React.FC = () => {
//   return (
//     <SidebarProvider>
//       <LayoutContent />
//     </SidebarProvider>
//   );
// };

// export default AppLayout;





// import { SidebarProvider, useSidebar } from "../context/SidebarContext";
// import { useGlobalStorage } from '../hooks/useGlobalStorage';
// import { UserMetadata } from '../types/user';
// import { Outlet } from "react-router-dom"; // Fixed import
// import AppHeader from "./AppHeader";
// import Backdrop from "./Backdrop";
// import AppSidebar from "./AppSidebar";
// import AppFooter from "./AppFooter";
// import AdminSidebar from "./AdminSidebar";
// import { useState, useEffect } from "react";
// import { useAdmin } from "../hooks/useAdmin";


// const LayoutContent: React.FC = () => {
//   const { isExpanded, isHovered, isMobileOpen } = useSidebar();
//   const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
//   const { isAdmin, isLoading: isAdminLoading } = useAdmin();

//   const [sidebarState, setSidebarState] = useState(localStorage.getItem("sidebar") || "open");

//   useEffect(() => {
//     localStorage.setItem("sidebar", sidebarState);
//   }, [sidebarState]);
  

//   // const adminStatus = localStorage.getItem("adminStatus") === "admin";
//   console.log('xxxxxxxxxxxxxxxxxxxxxxxxx-adminStatus = ', isAdmin);

//   //userMetadata?.profile?.role === 'admin' || userMetadata?.profile?.role === 'super-admin';

//   return (
//     <div className="min-h-screen xl:flex">
//       <div>
//         {/* Conditionally render the correct sidebar */}
//         {isAdmin ? <AdminSidebar /> : <AppSidebar />}
//         {/* <AppSidebar /> */}
//         <Backdrop />
//       </div>
//       <div
//         className={`flex-1 transition-all duration-300 ease-in-out ${
//           isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
//         } ${isMobileOpen ? "ml-0" : ""}`}
//       >
//         <AppHeader />
//         <div className="p-4 mx-auto max-w-screen-2xl md:p-6"> {/* Fixed Tailwind class */}
//           <Outlet />
//         </div>
//         <AppFooter />
//       </div>
//     </div>
//   );
// };

// const AppLayout: React.FC = () => {
//   return (
//     <SidebarProvider >
//       <LayoutContent />
//     </SidebarProvider>
//   );
// };

// export default AppLayout;
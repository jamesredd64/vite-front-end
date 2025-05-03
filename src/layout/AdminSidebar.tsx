/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useNavigation } from "../hooks/useNavigation";
import { useAuth0 } from "@auth0/auth0-react";
import { useAdmin } from '../hooks/useAdmin';
import React from "react";

import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  UserCircleIcon,
  TaskIcon,
  InfoIcon,
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { 
    name: string; 
    path: string; 
    pro?: boolean; 
    new?: boolean;
    icon?: React.ReactNode;
    requiresAdmin?: boolean;
  }[];
  requiresAdmin?: boolean;
};

const navItems: NavItem[] = [
  {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    icon: <GridIcon />,
    name: "Admin Dashboard",
    subItems: [   
      { name: "Home", path: "/admin", icon: <TaskIcon /> },
      { name: "Calendar", path: "/admin/calendar", icon: <CalenderIcon /> },      
      { name: "Marketing Overview", path: "/admin/marketing-overview", icon: <InfoIcon /> },
      { name: "Demographics", path: "/admin/customer-demographics", icon: <UserCircleIcon /> },
      { name: "Changelog", path: "/admin/changelog", icon: <TaskIcon /> },
      { name: "User Admin", path: "/admin/user-management", icon: <UserCircleIcon /> },
      { name: "Invitations", path: "/admin/invite", icon: <TaskIcon /> },
    ],
=======
=======
>>>>>>> Stashed changes
      icon: <GridIcon />,
      name: "Admin Dashboard",
      subItems: [
          { name: "Dashboard", path: "/admin/dashboard", icon: <CalenderIcon /> },
          { name: "Users", path: "/admin/users", icon: <UserCircleIcon /> },
          { name: "Calendar", path: "/admin/calendar", icon: <CalenderIcon /> },
          { name: "Marketing Overview", path: "/admin/marketing-overview", icon: <InfoIcon /> },
          { name: "Customer Demographics", path: "/admin/customer-demographics", icon: <UserCircleIcon /> },
          { name: "Changelog", path: "/admin/changelog", icon: <TaskIcon /> },
          { name: "Invite", path: "/admin/invite", icon: <TaskIcon /> },
      ],
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  },
];
// const navItems: NavItem[] = [
//   {
//     icon: <GridIcon />,
//     name: "Admin Dashboard",
//     subItems: [   
//       { name: "Calendar", path: "/calendar", icon: <CalenderIcon /> },      
//       { name: "Marketing Overview", path: "/marketing-overview", icon: <InfoIcon /> },
//       { name: "Demographics", path: "admin/customer-demographics", icon: <UserCircleIcon /> },
//       { name: "Changelog", path: "admin/changelog", icon: <TaskIcon /> },
//       { name: "User Admin", path: "/admin/users", icon: <UserCircleIcon /> },
//       { name: "Invitations", path: "/admin/invite", icon: <TaskIcon /> },
//     ],
//   },
// ];

const AdminSidebar: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const location = useLocation();
  const { handleNavigation } = useNavigation();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    if (isAuthenticated && !isAdminLoading && !isAdmin) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, isAdmin, isAdminLoading, navigate]);

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : [];
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    
    if (window.innerWidth < 768) {
      toggleMobileSidebar();
    }

    if (handleNavigation && handleNavigation(path)) {
      navigate(path);
    }
  };

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // Add loading state handling
  if (isAdminLoading) {
    return <div className="loading-spinner" />; // Add your loading component
  }

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-2">
      {items.map((nav, index) => {
        if (!nav) return null;
        
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        openSubmenu?.type === menuType &&
                        openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                      }`}
                    />
                  </>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  onClick={(e) => handleLinkClick(e, nav.path!)}
                  className={`menu-item group ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && openSubmenu?.type === menuType && openSubmenu?.index === index && (
              <div className="mt-2">
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        onClick={(e) => handleLinkClick(e, subItem.path)}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.icon && (
                          <span className={`menu-item-icon-size mr-2 ${
                            isActive(subItem.path)
                              ? "menu-item-icon-active"
                              : "menu-item-icon-inactive"
                          }`}>
                            {subItem.icon}
                          </span>
                        )}
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}>
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}>
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
            ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 py-4">
            {renderMenuItems(navItems, "main")}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;

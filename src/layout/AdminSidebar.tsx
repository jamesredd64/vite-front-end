/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useNavigation } from "../hooks/useNavigation";
import { useAuth0 } from "@auth0/auth0-react";
import { useAdmin } from '../hooks/useAdmin';
import React from "react";
import { LogoDarkIcon, LogoLightIcon } from "../icons";

import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
  TaskIcon,
  InfoIcon,
  ShootingStarIcon,
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
    icon: <GridIcon />,
    name: "Admin Dashboard",
    subItems: [  
      { name: "Home", path: "/admin/adm-dashboard", icon: <UserCircleIcon /> },
      // { name: "Create User Notifications", path: "/admin/notif", icon: <UserCircleIcon /> },
      { name: "Demographic Statistics", path: "/admin/customer-demographics", icon: <UserCircleIcon /> },
      { name: "Event Calendar", path: "/admin/calendar", icon: <CalenderIcon /> },      
      { name: "Marketing Statistics", path: "/admin/marketing", icon: <InfoIcon /> },
      { name: "Profile", path: "/admin/profile", icon: <UserCircleIcon /> },
      { name: "Send Event Invitations", path: "/admin/invite", icon: <TaskIcon /> },  
        
      { name: "Scheduled Events History", path: "/admin/sch-events", icon: <TaskIcon /> },
      { name: "Send Users Email", path: "/admin/send-email", icon: <TaskIcon /> },
      { name: "User Administration", path: "/admin/userman", icon: <UserCircleIcon /> },
    
     
      
      
    ],
  },
      {
        icon: <GridIcon />,
        name: "Settings",
        subItems: [  
          { name: "App Changelog", path: "/admin/changelog", icon: <TaskIcon /> },         
          // { name: "Admin Settings", path: "/admin/settings", icon: <UserCircleIcon /> },
          { name: "Template Settings", path: "/admin/settings-admin", icon: <ShootingStarIcon /> },      
          // { name: "Profile", path: "/admin/profile", icon: <UserCircleIcon /> },
          
        ],
      },
];

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { handleNavigation } = useNavigation();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuthenticated } = useAuth0();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { isAdmin } = useAdmin();

  // console.log('🚀 Initializing isAdmin From AdminSidebar..', isAdmin);

  // const [sidebarState, setSidebarState] = useState(localStorage.getItem("sidebar") || "open");

  //   useEffect(() => {
  //     localStorage.setItem("sidebar", sidebarState);
  //   }, [sidebarState]);


    useEffect(() => {
      console.log('AppSidebar mounted');
    }, []);
  
    useEffect(() => {
      console.log('AppSidebar updated');
    });


  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    
    if (window.innerWidth < 768) {
      toggleMobileSidebar();
    }

    if (handleNavigation && handleNavigation(path)) {
      navigate(path);
    }
  };

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

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

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
    <aside
      className={`fixed mt-20 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-6 flex mt-8 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="flex justify-center ">
          {(isExpanded || isHovered || isMobileOpen) ? (
            <>
              {/* Logo when expanded */}
              <div className="dark:hidden relative w-[249px] h-[40px]">
                <LogoLightIcon className="absolute inset-0 w-full h-full mx-0" />
              </div>
              <div className="hidden dark:block relative w-[249px] h-[40px]">
                <LogoDarkIcon className="absolute inset-0 w-full h-full mx-0" />
              </div>
            </>
          ) : (
            // Show HorizontaLDots when collapsed
            <HorizontaLDots className="size-6" />
          )}
        </Link>     
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {!isExpanded && !isHovered && !isMobileOpen ? <HorizontaLDots className="size-6" /> : ""}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
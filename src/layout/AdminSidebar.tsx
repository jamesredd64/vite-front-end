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
  HorizontaLDots,
  UserCircleIcon,
  TaskIcon,
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
      { name: "Calendar", path: "/admin/calendar", icon: <CalenderIcon /> },
      { name: "Marketing", path: "/admin/marketing" },
      { name: "Create Notification", path: "/admin/notifications/create" },
      { name: "Marketing Overview", path: "/admin/marketing-overview" },
      { name: "Demographics", path: "/admin/customer-demographics" },
      { name: "Changelog", path: "/admin/changelog" },
      { name: "Users", path: "/admin/users", icon: <UserCircleIcon /> },
      { name: "Invitations", path: "/admin/invite", icon: <TaskIcon /> },
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
  const { isAdmin } = useAdmin();

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

    if (handleNavigation(path)) {
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
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        if (!nav) return null;
        
        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <>
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
                      <span className="ml-auto">
                        <ChevronDownIcon
                          className={`h-5 w-5 transition-transform duration-200 ${
                            openSubmenu?.type === menuType &&
                            openSubmenu?.index === index
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>
                    </>
                  )}
                </button>
                <div
                  ref={(el) =>
                    (subMenuRefs.current[`${menuType}-${index}`] = el)
                  }
                  className={`overflow-hidden transition-all duration-300 ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? "mt-4"
                      : ""
                  }`}
                  style={{
                    height:
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? subMenuHeight[`${menuType}-${index}`]
                        : 0,
                  }}
                >
                  <ul className="flex flex-col gap-4 pl-4">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.path}>
                        <Link
                          to={subItem.path}
                          onClick={(e) => handleLinkClick(e, subItem.path)}
                          className={`submenu-item group ${
                            isActive(subItem.path)
                              ? "submenu-item-active"
                              : "submenu-item-inactive"
                          }`}
                        >
                          {subItem.icon && (
                            <span
                              className={`submenu-item-icon-size ${
                                isActive(subItem.path)
                                  ? "submenu-item-icon-active"
                                  : "submenu-item-icon-inactive"
                              }`}
                            >
                              {subItem.icon}
                            </span>
                          )}
                          {(isExpanded || isHovered || isMobileOpen) && (
                            <span className="submenu-item-text">
                              {subItem.name}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
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
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900 ${
        isExpanded || isHovered ? "w-[290px]" : "w-[90px]"
      } ${isMobileOpen ? "left-0" : "-left-full lg:left-0"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-[72px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-10 w-10 shrink-0"
          />
          {(isExpanded || isHovered || isMobileOpen) && (
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Admin Panel
            </span>
          )}
        </Link>
        {(isExpanded || isHovered || isMobileOpen) && (
          <button className="lg:hidden" onClick={toggleMobileSidebar}>
            <HorizontaLDots className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>
      <div className="custom-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-6">
        <nav className="flex flex-col gap-2">
          <div className="px-4">
            <h3
              className={`mb-2 font-medium text-gray-400 dark:text-gray-500 ${
                !isExpanded && !isHovered && !isMobileOpen ? "text-center" : ""
              }`}
            >
              {(isExpanded || isHovered || isMobileOpen) ? (
                "MENU"
              ) : (
                "MENU"
              )}
            </h3>
          </div>
          {renderMenuItems(navItems, "main")}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;

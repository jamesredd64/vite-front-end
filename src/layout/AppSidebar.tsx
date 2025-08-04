/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MarketingOverview from "../pages/MarketingOverview";
import { useSidebar } from "../context/SidebarContext";
import { useNavigation } from "../hooks/useNavigation";
import { useAuth0 } from "@auth0/auth0-react";
import { useAdmin } from '../hooks/useAdmin';
// import { useGlobalStorage } from './hooks/useGlobalStorage';



// Assume these icons are imported from an icon library
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  BellIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ShieldIcon, 
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


// Add this function to check if user is admin
// const username = () => {
  
//   return user.firstName;
// };


const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [
      { name: "Dashboard", path: "/attendee/dashboard", icon: <ShieldIcon /> },
      { name: "Profile", path: "/attendee/profile", icon: <UserCircleIcon /> },
      // { name: "Dashboard", path: "/user/dashboard", icon: <ShieldIcon /> },
      // { name: "Profile", path: "/user/profile", icon: <UserCircleIcon /> },
  ],
  },
];
  // {
  //   icon: <ShieldIcon />,
  //   name: "Admin",
  //   requiresAdmin: true,
  //   subItems: [      
  //     { name: "Attendee Demographics", path: "/customer-demographics", pro: false, requiresAdmin: true },
  //     { name: "Ecommerce", path: "/dashboard", pro: false, requiresAdmin: true },          
  //     { name: "MarketingOverview", path: "/marketing-overview", pro: false, icon: <MarketingOverview />, requiresAdmin: true },
  //     { name: "User Management", path: "/users", pro: false, icon: <UserCircleIcon />, requiresAdmin: true },
  //     // { name: "Admin Management", path: "/admin/manage", pro: false, icon: <ShieldIcon />, requiresAdmin: true },
  //   ],
  // },
  
  
  


const othersItems: NavItem[] = [
  // {
  //   icon: <PieChartIcon />,
  //   name: "Charts",
  //   subItems: [
  //     { name: "Line Chart", path: "/line-chart", pro: false },
  //     { name: "Bar Chart", path: "/bar-chart", pro: false },
  //   ],
  // },
  // {
  //   icon: <BoxCubeIcon />,
  //   name: "UI Elements",
  //   subItems: [
  //     { name: "Alerts", path: "/alerts", pro: false },
  //     { name: "Avatar", path: "/avatars", pro: false },
  //     { name: "Badge", path: "/badge", pro: false },
  //     { name: "Buttons", path: "/buttons", pro: false },
  //     { name: "Images", path: "/images", pro: false },
  //     { name: "Videos", path: "/videos", pro: false },
  //   ],
  // },
  // {
  //   icon: <PlugInIcon />,
  //   name: "Authentication",
  //   subItems: [
  //     { name: "Sign In", path: "/signin", pro: false },
  //     { name: "Sign Up", path: "/signup", pro: false },
  //   ],
  // },
];

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { handleNavigation } = useNavigation();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuthenticated } = useAuth0();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { isAdmin } = useAdmin();

  // console.log('🚀 Initializing isAdmin From AdminSidebar..', isAdmin);


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
      console.log('AppSidebar mounted');
    }, []);
  
    useEffect(() => {
      console.log('AppSidebar updated');
    });

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
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
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
        className={`py-6 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {/* <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden h-8"
                src="/images/logo/logo.svg"
                alt="Logo"
              />
              <img
                className="hidden dark:block h-8"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              className="h-8"
            />
          )}
        </Link> */}
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

// const AppSidebar: React.FC = () => {
//   const navigate = useNavigate();
//   const { handleNavigation } = useNavigation();
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
//   const location = useLocation();
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { isAuthenticated } = useAuth0();
//   // const { isAdmin } = useAdmin();
  
//   // console.log('🚀 Initializing isAdmin From AppSidebar..', isAdmin);
//   // Filter menu items based on admin role
//   const filteredNavItems = useMemo(() => 
//     navItems
//       .filter(item => !item.requiresAdmin) // Filter out non-admin items if the user isn't admin
//       .map(item => ({
//         ...item,
//         subItems: item.subItems?.filter(subItem => !subItem.requiresAdmin  // Filter subItems for admin
//       })),
//     [ navItems] // Dependencies now include navItems for better safety
//   );
  
//   // const filteredNavItems = useMemo(() => {
//   //   return navItems.map(item => {
//   //     if (item.requiresAdmin && !isAdmin) {
//   //       return null;
//   //     }
      
//   //     return {
//   //       ...item,
//   //       subItems: item.subItems?.filter(subItem => {
//   //         if (subItem.requiresAdmin && !isAdmin) {
//   //           return false;
//   //         }
//   //         return true;
//   //       })
//   //     };
//   //   }).filter(Boolean);
//   // }, [isAdmin]);

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main" | "others";
//     index: number;
//   } | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
//     {}
//   );
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   // const isActive = (path: string) => location.pathname === path;
//   const isActive = useCallback(
//     (path: string) => location.pathname === path,
//     [location.pathname]
//   );

//   const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
//     e.preventDefault();
    
//     if (window.innerWidth < 768) {
//       toggleMobileSidebar();
//     }

//     if (handleNavigation && handleNavigation(path)) {
//       navigate(path);
//     }
//   };

//   useEffect(() => {
//     let submenuMatched = false;
//     ["main", "others"].forEach((menuType) => {
//       const items = menuType === "main" ? navItems : othersItems;
//       items.forEach((nav, index) => {
//         if (nav.subItems) {
//           nav.subItems.forEach((subItem) => {
//             if (isActive(subItem.path)) {
//               setOpenSubmenu({
//                 type: menuType as "main" | "others",
//                 index,
//               });
//               submenuMatched = true;
//             }
//           });
//         }
//       });
//     });

//     if (!submenuMatched) {
//       setOpenSubmenu(null);
//     }
//   }, [location, isActive]);

//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prevHeights) => ({
//           ...prevHeights,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
//     setOpenSubmenu((prevOpenSubmenu) => {
//       if (
//         prevOpenSubmenu &&
//         prevOpenSubmenu.type === menuType &&
//         prevOpenSubmenu.index === index
//       ) {
//         return null;
//       }
//       return { type: menuType, index };
//     });
//   };

//   const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
//     <ul className="flex flex-col gap-4">
//       {items.map((nav, index) => {
//         if (!nav) return null;
        
//         return (
//           <li key={nav.name}>
//             {nav.subItems ? (
//               <button
//                 onClick={() => handleSubmenuToggle(index, menuType)}
//                 className={`menu-item group ${
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? "menu-item-active"
//                     : "menu-item-inactive"
//                 // } ${nav.requiresAdmin && !isAdmin ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
//                 // disabled={nav.requiresAdmin && !isAdmin}
//               >
//                 <span
//                   className={`menu-item-icon-size  ${
//                     openSubmenu?.type === menuType && openSubmenu?.index === index
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <ChevronDownIcon
//                     className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                       openSubmenu?.type === menuType &&
//                       openSubmenu?.index === index
//                         ? "rotate-180 text-brand-500"
//                         : ""
//                     }`}
//                   />
//                 )}
//               </button>
//             ) : (
//               nav.path && (
//                 <Link
//                   to={nav.path}
//                   onClick={(e) => {
//                     if (nav.requiresAdmin && !isAdmin) {
//                       e.preventDefault();
//                       return;
//                     }
//                     handleLinkClick(e, nav.path!)
//                   }}
//                   className={`menu-item group ${
//                     isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                   } ${nav.requiresAdmin && !isAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
//                 >
//                   <span
//                     className={`menu-item-icon-size ${
//                       isActive(nav.path)
//                         ? "menu-item-icon-active"
//                         : "menu-item-icon-inactive"
//                     }`}
//                   >
//                     {nav.icon}
//                   </span>
//                   {(isExpanded || isHovered || isMobileOpen) && (
//                     <span className="menu-item-text">{nav.name}</span>
//                   )}
//                 </Link>
//               )
//             )}
//             {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//               <div
//                 ref={(el) => {
//                   subMenuRefs.current[`${menuType}-${index}`] = el;
//                 }}
//                 className="overflow-hidden transition-all duration-300"
//                 style={{
//                   height:
//                     openSubmenu?.type === menuType && openSubmenu?.index === index
//                       ? `${subMenuHeight[`${menuType}-${index}`]}px`
//                       : "0px",
//                 }}
//               >
//                 <ul className="mt-2 space-y-1 ml-9">
//                   {nav.subItems.map((subItem) => (
//                     <li key={subItem.name}>
//                       <Link
//                         to={subItem.path}
//                         onClick={(e) => handleLinkClick(e, subItem.path)}
//                         className={`menu-dropdown-item ${
//                           isActive(subItem.path)
//                             ? "menu-dropdown-item-active"
//                             : "menu-dropdown-item-inactive"
//                         }`}
//                       >
//                         {subItem.name}
//                         <span className="flex items-center gap-1 ml-auto">
//                           {subItem.new && (
//                             <span
//                               className={`ml-auto ${
//                                 isActive(subItem.path)
//                                   ? "menu-dropdown-badge-active"
//                                   : "menu-dropdown-badge-inactive"
//                               } menu-dropdown-badge`}
//                             >
//                               new
//                             </span>
//                           )}
//                           {subItem.pro && (
//                             <span
//                               className={`ml-auto ${
//                                 isActive(subItem.path)
//                                   ? "menu-dropdown-badge-active"
//                                   : "menu-dropdown-badge-inactive"
//                               } menu-dropdown-badge`}
//                             >
//                               pro
//                             </span>
//                           )}
//                         </span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
//         ${
//           isExpanded || isMobileOpen
//             ? "w-[290px]"
//             : isHovered
//             ? "w-[290px]"
//             : "w-[90px]"
//         }
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`py-8 flex ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         {/* <Link to="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <img
//                 className="dark:hidden logo-default"
//                 src="/images/logo/logo.svg"
//                 alt="Logo"
//               />
//               <img
//                 className="hidden dark:block logo-default"
//                 src="/images/logo/logo-dark.svg"
//                 alt="Logo"
//               />
//             </>
//           ) : (
//             <img
//               src="/images/logo/logo-icon.svg"
//               alt="Logo"
//               className="logo-default"
//               width={32}
//               height={32}
//             />
//           )}
//         </Link> */}
//       </div>
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <HorizontaLDots className="size-6" />
//                 )}
//               </h2>
//               {renderMenuItems(filteredNavItems.filter((item): item is NonNullable<typeof item> => item !== null), "main")}
//             </div>
//             <div className="">
//               {/* <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Others"
//                 ) : (
//                   <HorizontaLDots />
//                 )}
//               </h2> */}
//               {renderMenuItems(othersItems, "others")}
//             </div>
//           </div>
//         </nav>
//         {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;

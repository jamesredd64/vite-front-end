import { useGlobalStorage } from './useGlobalStorage';
import { UserMetadata } from '../types/user';
import { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export const useAdmin = () => {
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [state, setState] = useState({
    isAdmin: false,
    isLoading: true,
    route: '',
    userRole: '', // NEW: to track current role
  });

  const getUserRole = useCallback(() => {
    if (!user || !isAuthenticated) return '';
    const namespace = "https://dev-rq8rokyotwtjem12.jr.com/roles";
    const roles = user?.[namespace] || [];
    return roles[0] || ''; // Assuming only one role
  }, [user, isAuthenticated]);

  const getRoute = useCallback((role: string) => {
    const roleRoutes: Record<string, string> = {
      showcase_admin: "/admin",
      showcase_attendee: "/attendee",
      showcase_agent: "/agent",
      showcase_team: "/team",
    };

    console.log("Current Path is ", window.location.pathname);
    return roleRoutes[role] || "/default";
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const role = getUserRole();
    const route = getRoute(role);
    const isAdmin = role === "showcase_admin";

    console.log("Role from useAdmin: ", role);
    console.log('[useAdmin Hook] Setting state:', {
      isAdmin,
      userMetadata,
      route,
    });

    setState((prevState) => ({
      ...prevState,
      isAdmin,
      isLoading: false,
      route,
      userRole: role,
    }));
  }, [userMetadata, getUserRole, getRoute, isLoading]);

  return state;
};


// import { useGlobalStorage } from './useGlobalStorage';
// import { UserMetadata } from '../types/user';
// import { useEffect, useState, useCallback } from 'react';
// import { useAuth0 } from "@auth0/auth0-react";

// export const useAdmin = () => {
//   const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
//   const { user, isAuthenticated, isLoading } = useAuth0();
  
//   // Initialize state properly
//   const [state, setState] = useState({
//     isAdmin: false,
//     isLoading: true,
//     route: '', // Added route to state
//   });

//   const checkAdminStatus = useCallback(() => {    
//     if (!user || !isAuthenticated) return false; // Prevent checks when user isn't set
    
//     const namespace = "https://dev-rq8rokyotwtjem12.jr.com/roles"; // Match Auth0 custom namespace   
    
//     const roles = user?.[namespace] || [];
    
//     console.log("Roles Array from useAdmin: ", user , " -- " ,roles);
    
//     // Correctly check if any role matches 'admin' or 'super-admin'
//     return roles.some(role => ['showcase_admin'].includes(role)); 
//     // return roles.some(role => ['admin', 'super-admin'].includes(role)); 
//   }, [user, isAuthenticated]);

//   const getRoute = useCallback(() => {
//     const currentPath = window.location.pathname;
//     console.log("Current Path is ", currentPath);
  
//     // // If already on an admin or user route, return the current path
//     // if (currentPath.startsWith("/admin") || currentPath.startsWith("/attendee")) {
//     //   console.log("Already on Path ", currentPath);
//     //   return currentPath;
      
//     // }
  
//     // Determine the route based on admin status
//     // console.log("************************************state.isAdmin ", state.isAdmin);
//     return state.isAdmin ? "/showcase_admin" : "/showcase_attendee";
//   }, [state.isAdmin]);

  
//   // const getRoute = useCallback(() => {
//   //   return state.isAdmin ? '/admin' : '/user'; // Determine route based on isAdmin
//   // }, [state.isAdmin]);
    
//   useEffect(() => {
//     if (isLoading) return; // Don't run logic until authentication completes
    
//     const adminStatus = checkAdminStatus();
//     console.log("state.isAdmin ?", adminStatus );
//     console.log('[useAdmin Hook] Setting state:', {
//       isAdmin: adminStatus,
//       userMetadata: userMetadata,
//     });

//     setState((prevState) => ({
//       isAdmin: adminStatus,
//       isLoading: false,
//       route: getRoute(), // Set the route based on admin status
//     }));
//   }, [userMetadata, checkAdminStatus, isLoading, getRoute]);

//   return state;
// };



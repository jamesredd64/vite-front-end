import { useGlobalStorage } from './useGlobalStorage';
import { UserMetadata } from '../types/user';
import { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export const useAdmin = () => {
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { user, isAuthenticated, isLoading } = useAuth0();
  
  // Initialize state properly
  const [state, setState] = useState({
    isAdmin: false,
    isLoading: true,
    route: '', // Added route to state
  });

  const checkAdminStatus = useCallback(() => {    
    if (!user || !isAuthenticated) return false; // Prevent checks when user isn't set
    
    const namespace = "https://dev-uizu7j8qzflxzjpy.jr.com/roles"; // Match Auth0 custom namespace      
    const roles = user?.[namespace] || [];
    
    console.log("Roles Array: ", roles);
    
    // Correctly check if any role matches 'admin' or 'super-admin'
    return roles.some(role => ['admin', 'super-admin'].includes(role)); 
  }, [user, isAuthenticated]);

  const getRoute = useCallback(() => {
    const currentPath = window.location.pathname;
    console.log("Current Path is ", currentPath);
  
    // If already on an admin or user route, return the current path
    if (currentPath.startsWith("/admin") || currentPath.startsWith("/user")) {
      console.log("Already on Path ", currentPath);
      return currentPath;
      
    }
  
    // Determine the route based on admin status
    // console.log("************************************state.isAdmin ", state.isAdmin);
    return state.isAdmin ? "/admin" : "/user";
  }, [state.isAdmin]);

  
  // const getRoute = useCallback(() => {
  //   return state.isAdmin ? '/admin' : '/user'; // Determine route based on isAdmin
  // }, [state.isAdmin]);
    
  useEffect(() => {
    if (isLoading) return; // Don't run logic until authentication completes
    
    const adminStatus = checkAdminStatus();
    console.log("state.isAdmin ?", adminStatus );
    console.log('[useAdmin Hook] Setting state:', {
      isAdmin: adminStatus,
      userMetadata: userMetadata,
    });

    setState((prevState) => ({
      isAdmin: adminStatus,
      isLoading: false,
      route: getRoute(), // Set the route based on admin status
    }));
  }, [userMetadata, checkAdminStatus, isLoading, getRoute]);

  return state;
};


// import { useGlobalStorage } from './useGlobalStorage';
// import { UserMetadata } from '../types/user';
// import { useEffect, useState, useCallback } from 'react';
// import { useAuth0 } from "@auth0/auth0-react";

// export const useAdmin = (role: string) => {
//   const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
//   const { user, isAuthenticated, isLoading } = useAuth0();
  
//   // Initialize state properly
//   const [state, setState] = useState({
//     isAdmin: false,
//     isLoading: true,
//   });

//   const checkAdminStatus = useCallback(() => {    
//     if (!user || !isAuthenticated) return false; // Prevent checks when user isn't set
    
//     const namespace = "https://dev-uizu7j8qzflxzjpy.jr.com/roles"; // Match Auth0 custom namespace      
//     const roles = user?.[namespace] || [];
    
//     console.log("Roles Array: ", roles);
    
//     // Correctly check if any role matches 'admin' or 'super-admin'
//     return roles.some(role => ['admin', 'super-admin'].includes(role)); 
//   }, [user, isAuthenticated]);

//   useEffect(() => {
//     if (isLoading) return; // Don't run logic until authentication completes
    
//     const adminStatus = checkAdminStatus();
    
//     console.log('[useAdmin Hook] Setting state:', {
//       isAdmin: adminStatus,
//       userMetadata: userMetadata
//     });

//     setState({
//       isAdmin: adminStatus,
//       isLoading: false,
//     });
//   }, [userMetadata, checkAdminStatus, isLoading]);

//   return state;
// };

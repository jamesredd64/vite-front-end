import { useState, useEffect } from 'react';
import { RolePermissions, RoleBasedAccess } from '../types/rbac.types';
import { initialSettings } from '../pages/AdminSettings'; // Using initialSettings for demo

// In a real application, you would fetch the current user's role and permissions
// This is a placeholder function
const fetchUserPermissions = (userRole: string): RolePermissions | undefined => {
  const roleAccess = initialSettings.roleBasedAccess.find(
    (rbac) => rbac.role === userRole
  );
  
  return roleAccess?.permissions;
};

const useRbac = (userRole: string) => {
  const [permissions, setPermissions] = useState<RolePermissions | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate fetching user permissions
    const userPermissions = fetchUserPermissions(userRole);
    setPermissions(userPermissions);
    setLoading(false);
  }, [userRole]);
  const canAccess = (rbacAppType: string, accessFunction: string): boolean => {
    if (loading || !permissions) {
      return false;
    }
    
    const appTypePermissions = permissions[rbacAppType];
    if (!appTypePermissions) {
      return false;
    }
    // Allow combined 'read-write' access check
    if (accessFunction === 'read-write') {
      return !!appTypePermissions.read?.access && !!appTypePermissions.write?.access;
    }
    return !!appTypePermissions[accessFunction]?.access;
  };
  console.log("User Permissions:", permissions);
  console.log("Checking read-write access:", canAccess("users", "read-write"));

  return { canAccess, loading };
};

export default useRbac;
  // const canAccess = (rbacAppType: string, accessFunction: string): boolean => {
  //   if (loading || !permissions) {
  //     return false; // Or handle loading state as needed
  //   }

  //   // Check if the rbacAppType exists
  //   const appTypePermissions = permissions[rbacAppType];
  //   if (!appTypePermissions) {
  //     return false;
  //   }

  //   // Check if the accessFunction exists and has access set to true
  //   const accessFunctionPermission = appTypePermissions[accessFunction];
  //   if (!accessFunctionPermission || !accessFunctionPermission.access) {
  //     return false;
  //   }

  //   return true;
  // };


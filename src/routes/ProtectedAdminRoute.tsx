import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  // Check if user is authenticated and has admin role
  const isAdmin = isAuthenticated && user?.['https://dev-rq8rokyotwtjem12.jr.com/roles/roles']?.includes('showcase_admin');
  // const isAdmin = isAuthenticated && user?.['https://dev-rq8rokyotwtjem12/roles']?.includes('showcase_admin');

  if (!isAuthenticated) {
    return <Navigate to="/signed-out" replace />;
  }

  if (!isAdmin) {
     return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
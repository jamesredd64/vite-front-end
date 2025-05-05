import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth0();

  // Check if user is authenticated and has admin role
  const isAdmin = isAuthenticated && user?.['https://dev-uizu7j8qzflxzjpy.jr.com/roles']?.includes('admin');

  if (!isAuthenticated) {
    return <Navigate to="/signed-out" replace />;
  }

  if (!isAdmin) {
     return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
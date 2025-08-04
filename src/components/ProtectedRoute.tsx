import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useAdmin } from '../hooks/useAdmin';
import { UserRoleStorage } from "../utils/userStorage";

interface ProtectedRouteProps {
  element: React.ReactElement;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requireAdmin = true }) => {
  const { isAuthenticated, user, isLoading: isAuth0Loading, error: auth0Error } = useAuth0();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleAuthentication = async () => {
      if (isAuth0Loading) return; // Wait until Auth0 is finished loading

      try {
        if (isAuthenticated) {
          const userRole = user?.email ? UserRoleStorage.getRole(user.email) : null;

          if (userRole === 'showcase_admin') {
            
            navigate('/showcase_admin');
          } else {
            navigate('/showcase_attendee');
            // navigate('/user');
          }
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    handleAuthentication();
  }, [isAuthenticated, user, isAuth0Loading]); // Watch relevant values

  console.log('Auth0 loading:', isAuth0Loading);
  console.log('Admin loading:', isAdminLoading);
  if (auth0Error) {
    console.log('Auth0 error:', auth0Error);
  } else {
    console.log('No Auth0 error:');
  }

  // Optionally render a loading state or the element if authenticated
  if (isAuth0Loading || isAdminLoading) {
    return <div>Loading...</div>; // Show a loading state while checking auth
  }

  return element; // Render the protected element if authenticated
};

export default ProtectedRoute;

// /* eslint-disable @typescript-eslint/no-unused-vars */
// import React, { useEffect } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useAdmin } from '../hooks/useAdmin';

// interface ProtectedRouteProps {
//   element: React.ReactElement;
//   requireAdmin?: boolean;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, requireAdmin = false }) => {
//   const { isAuthenticated, isLoading: isAuth0Loading } = useAuth0();
//   const { isAdmin, isLoading: isAdminLoading } = useAdmin();

//       // Check the requireAdmin value
//       console.log("Require Admin:", requireAdmin);

//   // Wait for both Auth0 and admin status to load
//   if (isAuth0Loading || isAdminLoading) {
//     return <div>Loading Protected Routes...</div>;
//   }

//   // Handle authentication check
//   if (!isAuthenticated) {
//     return <Navigate to="/signed-out" replace />;
//   }

//   // Handle admin route protection
//   if (requireAdmin && !isAdmin) {
//     // Add debug logging
//     console.log('Admin check failed:', {
//       requireAdmin,
//       isAdmin,
//       userRole: localStorage.getItem('userRole')
//     });
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // Render the protected component
//   return element;
// };

// export default ProtectedRoute;

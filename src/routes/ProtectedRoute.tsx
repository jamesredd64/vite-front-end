import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return <Navigate to="/signed-out" replace />;
  }

  return <Outlet />; // Render nested routes
};

export default ProtectedRoute;



// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useAdmin } from "../hooks/useAdmin";

// interface ProtectedRouteProps {
//   requireAdmin?: boolean;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireAdmin = false }) => {
//   const { isAuthenticated, isLoading: isAuth0Loading } = useAuth0();
//   const { isAdmin, isLoading: isAdminLoading } = useAdmin();

//   console.log("Auth0 loading:", isAuth0Loading);
//   console.log("Admin loading:", isAdminLoading);
//   console.log("Require Admin:", requireAdmin);

//   // Wait for authentication and role checks to complete
//   if (isAuth0Loading || isAdminLoading) {
//     return <div>Loading Protected Routes...</div>;
//   }

//   // Redirect if user is not authenticated
//   if (!isAuthenticated) {
//     return <Navigate to="/signed-out" replace />;
//   }

//   // Redirect non-admin users if `requireAdmin` is true
//   if (requireAdmin && !isAdmin) {
//     console.log("Admin check failed:", {
//       requireAdmin,
//       isAdmin,
//       userRole: localStorage.getItem("userRole"),
//     });
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return <Outlet />; // Allow nested routes within protected areas

// }
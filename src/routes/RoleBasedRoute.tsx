import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const RoleBasedRoute = () => {
  const { user } = useAuth0();
  const roles = user?.["https://dev-uizu7j8qzflxzjpy.jr.com/roles"] || [];

  if (roles.includes("admin") || roles.includes("super-admin")) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/user" replace />;
};

export default RoleBasedRoute;

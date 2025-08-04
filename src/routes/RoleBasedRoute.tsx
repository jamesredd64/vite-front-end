import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const RoleBasedRoute = () => {
  const { user } = useAuth0();
  const roles = user?.["https://dev-rq8rokyotwtjem12.jr.com/roles"] || [];
  console.log("roles are ", roles);

  if (roles.includes("admin") || roles.includes("showcase_admin")) {
    return <Navigate to="/admin" replace />;
  }
  else {
    return <Navigate to="/attendee" replace />;
  }

  // Need to add support for the other roles here
  // return <Navigate to="/attendee" replace />;
};

export default RoleBasedRoute;



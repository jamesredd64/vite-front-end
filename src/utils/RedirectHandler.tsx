import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function RedirectHandler({ appState }: { appState: any }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const returnTo = appState?.returnTo || location.pathname;

    // if (userRole === "admin" || userRole === "super-admin") {
    if (userRole === "showcase_admin") {
      navigate(returnTo.includes("/admin") ? returnTo : "/admin");
    } else {
      navigate(returnTo.includes("/admin") ? "/dashboard" : returnTo);
    }
  }, [navigate, appState, location]);

  return null; // ✅ Component only handles navigation
}

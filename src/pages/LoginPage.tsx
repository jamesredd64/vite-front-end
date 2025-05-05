import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            // Redirect based on role after login
            const roles = user?.["https://dev-uizu7j8qzflxzjpy.jr.com/roles"] || []; // Correct namespace
  
    // Ensure roles are defined before navigating
    if (roles.length === 0) return;
  
    // Redirect based on role
    if (roles.includes("admin") && window.location.pathname !== "/admin") {
      console.log("Navigating to /admin...");
      navigate("/admin", { replace: true });
    } else if (window.location.pathname !== "/user") {
      console.log("Navigating to /user...");
      navigate("/user", { replace: true });
    }
        }
    }, [isAuthenticated, user, navigate]);

    const handleLogin = async () => {
        await loginWithRedirect();
    };

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
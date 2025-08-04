import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            // Redirect based on role after login
            const roles = user?.["https://dev-rq8rokyotwtjem12.jr.com/roles/roles"] || []; // Correct namespace
  
    // Ensure roles are defined before navigating
    if (roles.length === 0) return;
  
    // Redirect based on role
    if (roles.includes("showcase_admin") && window.location.pathname !== "/admin") {
      console.log("Navigating to /admin...");
      navigate("/admin", { replace: true });
    } else if (window.location.pathname !== "/attendee") {
      console.log("Navigating to /attendee...");
      navigate("/attendee", { replace: true });
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
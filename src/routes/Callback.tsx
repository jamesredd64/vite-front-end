import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Callback: React.FC = () => {
  const { handleRedirectCallback, isLoading, error, user, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      await handleRedirectCallback();

      if (!isAuthenticated || !user) return; // Ensure authentication is complete

      // Retrieve user roles from Auth0 token
      const roles = user?.["https://dev-rq8rokyotwtjem12.jr.com/roles"] || [];

      if (roles.length === 0) return; // Prevent redirects before roles are available

      // Redirect based on user role
      if (roles.includes("showcase_admin")) {
        console.log("Navigating to /admin...");
        navigate("/admin", { replace: true });
      } else {
        console.log("Navigating to /attendee...");
        navigate("/attendee", { replace: true });
      }
    };

    if (!isLoading) {
      handleAuth();
    }
  }, [isLoading, handleRedirectCallback, isAuthenticated, user]);

  if (isLoading) {
    return <div>Loading Auth Callback...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>Redirecting...</div>;
};

export default Callback;


// // Callback.tsx
// import React, { useEffect } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useNavigate } from 'react-router-dom';

// const Callback: React.FC = () => {
//   const { handleRedirectCallback, isLoading, error } = useAuth0();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleAuth = async () => {
//       await handleRedirectCallback();
//       navigate('/'); // Redirect to your desired page after successful login
//     };

    
//     if (!isLoading) {
//       handleAuth();
//     }
//   }, [isLoading, handleRedirectCallback, navigate]);

//   if (isLoading) {
//     return <div>Loading Auth Callback...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   return <div>Redirecting...</div>;
// };

// export default Callback;
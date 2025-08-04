// Auth0Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface CustomClaims {
  [key: string]: string;
}

interface Auth0LoginProps {
  children: React.ReactNode;
}

const Auth0Login: React.FC<Auth0LoginProps> = () => {
  const { getAccessTokenSilently, loginWithRedirect, user, isAuthenticated } = useAuth0();
  const [customClaims, setCustomClaims] = useState<CustomClaims>({});
  const navigate = useNavigate();
  console.log("Auth0Login running");

  useEffect(() => {
    const getCustomClaims = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${'dev-rq8rokyotwtjem12.us.auth0.com'}/userinfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData: { [key: string]: string } = await response.json();
        setCustomClaims(userData);
      } catch (error) {
        console.error(error);
      }
    };
    getCustomClaims();
  }, [getAccessTokenSilently]);

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <h2>Custom Claims:</h2>
          <ul>
            {Object.keys(customClaims).map((claim) => (
              <li key={claim}>{`${claim}: ${customClaims[claim]}`}</li>
            ))}
          </ul>
        </div>
      ) : (
        <button onClick={handleLogin}>Log in with Auth0</button>
      )}
    </div>
  );
};

export default Auth0Login;
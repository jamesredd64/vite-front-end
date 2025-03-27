// Auth0Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface CustomClaims {
  [key: string]: string;
}

interface Auth0LoginProps {
  children: React.ReactNode;
}

const Auth0Login: React.FC<Auth0LoginProps> = () => {
  const { getAccessTokenSilently, loginWithRedirect, user } = useAuth0();
  const [customClaims, setCustomClaims] = useState<CustomClaims>({});

  useEffect(() => {
    const getCustomClaims = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${'dev-uizu7j8qzflxzjpy.us.auth0.com'}/userinfo`, {
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
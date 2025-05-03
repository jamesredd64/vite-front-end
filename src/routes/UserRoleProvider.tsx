import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMongoDbClient } from '../services/mongoDbClient';

interface UserRoleProviderProps {
  children: ReactNode; // Simplified type definition
}

interface UserRoleContextType {
  userRole: string | null;
  error: string | null;
  loading: boolean;
}

const UserRoleContext = createContext<UserRoleContextType | null>(null);

const UserRoleProvider: React.FC<UserRoleProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth0(); // Extract `user` to get auth0Id
  const { getUsersRole } = useMongoDbClient();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!isAuthenticated || !user?.sub) return; // Ensure user is authenticated and has an auth0Id

      setLoading(true);
      try {
        console.log("Fetching user role for:", user.sub);
        const role = await getUsersRole(user.sub); // Pass `auth0Id` instead of token
        setUserRole(role);
      } catch (err) {
        console.error("Error fetching user role:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch role");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [isAuthenticated, user?.sub, getUsersRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <UserRoleContext.Provider value={{ userRole, error, loading }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export { UserRoleProvider, UserRoleContext };

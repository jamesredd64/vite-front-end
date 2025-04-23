/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '../services/api.service';
import { API_CONFIG } from '../config/api.config';
import  Loader  from '../components/common/Loader';
import type  User  from '../types/user';

interface UserLookupProps {
  isModal?: boolean;
  onUserSelect?: (selectedUsers: string[]) => void;
}

const UserLookup: React.FC<UserLookupProps> = ({ 
  isModal = false, 
  onUserSelect 
}) => {
  const { isAuthenticated } = useAuth0();
  const { fetchWithAuth } = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const fetchUsers = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);

    try {
      const endpoint = searchTerm.trim() 
        ? API_CONFIG.ENDPOINTS.USER_LOOKUP.SEARCH(searchTerm)
        : API_CONFIG.ENDPOINTS.USER_LOOKUP.ALL;

      const response = await fetchWithAuth(`${API_CONFIG.BASE_URL}${endpoint}`);
      
      if (!response?.success) {
        throw new Error(response?.message || "Failed to fetch users");
      }

      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error("Failed to fetch users"));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchWithAuth, searchTerm]);

  // Initial load
  // useEffect(() => {
  //   fetchUsers();
  // }, [fetchUsers]);
 fetchUsers();
  // Handle user selection
  // useEffect(() => {
  //   if (isModal && onUserSelect) {
  //     onUserSelect(selectedUsers);
  //   }
  // }, [isModal, onUserSelect, selectedUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  if (!isAuthenticated) {
    return <div>Please log in to view users.</div>;
  }

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="space-y-2">
        {users.map(user => (
          <div 
            key={user.auth0Id}
            className="p-2 border rounded flex justify-between items-center"
          >
            <div>
              <div>{user.firstName} {user.lastName}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.auth0Id)}
              onChange={() => handleUserSelect(user.auth0Id)}
            />
          </div>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center text-gray-500">No users found</div>
      )}
    </div>
  );
};

export default UserLookup;


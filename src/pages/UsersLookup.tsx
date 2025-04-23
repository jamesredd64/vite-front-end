import React, { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Loader from '../components/common/Loader';
import type User from '../types/user';
import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import { API_CONFIG } from '../config/api.config';

interface UsersLookupProps {
  isModal?: boolean;
  onUserSelect?: (selectedUsers: string[], users: User[]) => void;
  onClose?: () => void;
}

const UsersLookup: React.FC<UsersLookupProps> = ({ isModal = false, onUserSelect, onClose }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
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
      console.log('Fetching users...');
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch users');
      
      const rawUsers = await response.json();
      const formattedUsers = rawUsers.map((user: User) => ({
        auth0Id: user.auth0Id,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        isActive: user.isActive,
        profile: {
          role: user.profile?.role || '',
          gender: user.profile?.gender || '',
          dateOfBirth: user.profile?.dateOfBirth || null,
          profilePictureUrl: user.profile?.profilePictureUrl || ''
        }
      }));
      
      console.log('Users fetched successfully:', formattedUsers);
      setUsers(formattedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err : new Error("Failed to fetch users"));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      // If all are selected, unselect all
      setSelectedUsers([]);
    } else {
      // Otherwise, select all
      setSelectedUsers(users.map(user => user.auth0Id));
    }
  };

  const handleConfirmSelection = () => {
    if (onUserSelect) {
      onUserSelect(selectedUsers, users);
    }
    if (onClose) {
      onClose();
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchLower))
    );
  });

  if (!isAuthenticated) {
    return <div>Please log in to view users.</div>;
  }

  const content = (
    <div className={`rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ${isModal ? 'border-0 shadow-none' : ''}`}>
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedUsers.length === users.length}
            onChange={handleSelectAll}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Select All Users
          </span>
        </label>
      </div>

      {loading && <Loader />}
      
      {error && (
        <div className="mb-6 text-danger">{error.message}</div>
      )}

      <div className="space-y-2">
        {filteredUsers.map(user => (
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

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center text-gray-500">No users found</div>
      )}

      {isModal && (
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stroke rounded-lg hover:bg-gray-100 dark:hover:bg-meta-4"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSelection}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            disabled={selectedUsers.length === 0}
          >
            Select ({selectedUsers.length})
          </button>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <>
      <PageMeta title="Users Lookup" description={''} />
      <PageBreadcrumb pageTitle="Users Lookup" />
      {content}
    </>
  );
};

export default UsersLookup;






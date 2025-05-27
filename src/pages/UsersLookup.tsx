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
  fetchOnLoad?: boolean;
}

const UsersLookup: React.FC<UsersLookupProps> = ({ isModal = false, onUserSelect, onClose, fetchOnLoad = true }) => {
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
    if (fetchOnLoad) {
      fetchUsers();
    }
  }, [fetchUsers, fetchOnLoad]);

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
    <div className={`rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-gray-900 sm:px-7.5 xl:pb-1 ${isModal ? 'border-0 shadow-none' : ''}`}>
      <div className="mb-2">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search users..."
          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {!fetchOnLoad && users.length === 0 && !loading && (
        <div className="mb-6 text-center">
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading Users...' : 'Load All Users'}
          </button>
        </div>
      )}

      {loading && <Loader />}
      
      {error && (
        <div className="mb-6 text-danger">{error.message}</div>
      )}

      {users.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between"> {/* Use flex to align items */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedUsers.length === users.length && users.length > 0} 
                onChange={handleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All Users
              </span>
            </label>
            {isModal && (
              <button
                onClick={handleConfirmSelection}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                disabled={selectedUsers.length === 0}
              >
                Select ({selectedUsers.length})
              </button>
            )}
          </div>

          <div className="space-y-2">
            {filteredUsers.map(user => (
              <div
                key={user.auth0Id}
                className="p-2 border rounded flex items-center gap-4 dark:border-strokedark" // Use flex and gap
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.auth0Id)}
                  onChange={() => handleUserSelect(user.auth0Id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
                />
                <div>
                  <div className="text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && !loading && (
            <div className="text-center text-gray-500 dark:text-gray-400">No users found matching your search.</div>
          )}
        </>
      )}

      {isModal && (
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stroke rounded-lg hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4 dark:text-gray-300"
          >
            Cancel
          </button>
          {/* Select button moved to the top */}
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






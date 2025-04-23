/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMongoDbClient } from '../../services/mongoDbClient';
import debounce from 'lodash/debounce';

interface User {
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  profile: {
    dateOfBirth: string;
    gender: string;
    profilePictureUrl: string;
    role?: string;
  };
}

interface AttendeeSelectorProps {
  onAttendeesSelected: (attendees: Array<{ email: string; name: string }>) => void;
  currentAttendees: Array<{ email: string; name: string }>;
  disabled?: boolean;
}

export const AttendeeSelector: React.FC<AttendeeSelectorProps> = ({
  onAttendeesSelected,
  currentAttendees,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(
    new Set(currentAttendees.map(a => a.email))
  );
  const mongoDbClient = useMongoDbClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add this helper function to check if all users are selected
  const areAllUsersSelected = () => {
    return users.length > 0 && users.every(u => selectedUsers.has(u.email));
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search function
  const debouncedFetchUsers = useCallback(
    debounce(async (search: string) => {
      if (search.length < 2) {
        setUsers([]);
        return;
      }

      try {
        const response = await mongoDbClient.fetchUserData(search);
        if (Array.isArray(response)) {
          setUsers(response);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    }, 300),
    [mongoDbClient]
  );

  // Effect for search term changes
  useEffect(() => {
    debouncedFetchUsers(searchTerm);
    
    // Cleanup
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [searchTerm, debouncedFetchUsers]);

  const handleSelectUser = (user: User) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(user.email)) {
      newSelected.delete(user.email);
    } else {
      newSelected.add(user.email);
    }
    setSelectedUsers(newSelected);

    const updatedAttendees = users
      .filter(u => newSelected.has(u.email))
      .map(u => ({
        email: u.email,
        name: `${u.firstName} ${u.lastName}`
      }));

    onAttendeesSelected(updatedAttendees);
  };

  const handleSelectAll = () => {
    const allEmails = users.map(u => u.email);
    const newSelected = new Set(selectedUsers);
    
    if (allEmails.every(email => selectedUsers.has(email))) {
      // If all are selected, unselect all
      allEmails.forEach(email => newSelected.delete(email));
    } else {
      // Otherwise, select all
      allEmails.forEach(email => newSelected.add(email));
    }

    setSelectedUsers(newSelected);
    
    const updatedAttendees = users
      .filter(u => newSelected.has(u.email))
      .map(u => ({
        email: u.email,
        name: `${u.firstName} ${u.lastName}`
      }));

    onAttendeesSelected(updatedAttendees);
  };

  return (
    <div className={`relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`} ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        placeholder={disabled ? "All users will be invited" : "Type to search attendees..."}
        disabled={disabled}
        className="w-full rounded-lg border border-stroke bg-transparent py-2 pl-3 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4 dark:text-white disabled:cursor-not-allowed"
      />

      {/* Only show tags if not disabled */}
      {!disabled && (
        <div className="mt-2 flex flex-wrap gap-2">
          {currentAttendees.map((attendee) => (
            <div
              key={attendee.email}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-sm dark:bg-gray-700"
            >
              <span className="text-gray-700 dark:text-gray-200">
                {attendee.name}
              </span>
              <button
                onClick={() => {
                  const newSelected = new Set(selectedUsers);
                  newSelected.delete(attendee.email);
                  setSelectedUsers(newSelected);
                  onAttendeesSelected(currentAttendees.filter(a => a.email !== attendee.email));
                }}
                className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown remains the same but will be disabled due to pointer-events-none */}
      {showDropdown && searchTerm.length >= 2 && users.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800">
          <div className="max-h-60 overflow-auto rounded-md py-1">
            {/* Select All Option */}
            <div className="px-3 py-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={users.every(u => selectedUsers.has(u.email))}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm">Select All</span>
              </label>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700"></div>

            {users.map((user) => (
              <div
                key={user.auth0Id}
                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.email)}
                    onChange={() => handleSelectUser(user)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm">
                    {user.firstName} {user.lastName} ({user.email})
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};













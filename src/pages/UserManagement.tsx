import React, { useState, useEffect, useMemo } from "react";
import { API_CONFIG } from "../config/api.config";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import Switch from "../components/form/switch/Switch";
import NotificationModal from "../components/modals/NotificationModal";
// import { useNavigate } from "react-router-dom";
import UserProfileView from './UserProfileView';
import { useGlobalStorage } from "../hooks/useGlobalStorage";
import UserMetadata from "../types/user";


interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick, disabled }) => (
  <button
    className={`px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
      isActive 
        ? 'bg-primary text-white' 
        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
    } ${
      disabled 
        ? 'opacity-50 cursor-not-allowed' 
        : ''
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

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
    status?: boolean;
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: string[];
  users: User[];
}

type ViewMode = 'table' | 'card' | 'profile';

export default function UserManagement() {
  // const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive' | 'current'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  // userProfilePic={userMetadata?.profile?.profilePictureUrl}

  const handleNotificationSent = () => {
    setSelectedUsers([]);  // Reset selected users
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      switch (activeTab) {
        case 'active':
          return user.isActive === true;
        case 'inactive':
          return user.isActive === false;
        case 'current':
          return user.auth0Id === selectedUserId;
        default:
          return true;
      }
    });
  }, [users, activeTab, selectedUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center p-4 text-red-800 bg-red-100 rounded-lg">
          <span className="font-medium">Error: {error.message}</span>
        </div>
      </div>
    );
  }

  const handleViewDetails = (userId: string) => {
    console.log('Viewing details for user:', userId);  // Add logging for debugging
    setSelectedUserId(userId);
    setViewMode('profile');
    setActiveTab('current');
  };

  const handleTabChange = (tab: 'all' | 'active' | 'inactive' | 'current') => {
    console.log('Tab changed to:', tab);
    console.log('Total users before filtering:', users.length);
    
    // Reset view mode to card/table when switching away from current tab
    if (tab !== 'current') {
      setViewMode('card'); // or 'table' depending on your default view
      setSelectedUserId(null);
    }
    
    setActiveTab(tab);
  };

  const renderTabs = () => (
    <div className="flex gap-2 mb-6">
      <Tab
        label="All Users"
        isActive={activeTab === 'all'}
        onClick={() => handleTabChange('all')}
      />
      <Tab
        label="Active"
        isActive={activeTab === 'active'}
        onClick={() => handleTabChange('active')}
      />
      <Tab
        label="Inactive"
        isActive={activeTab === 'inactive'}
        onClick={() => handleTabChange('inactive')}
      />
      <Tab
        label="Current"
        isActive={activeTab === 'current'}
        onClick={() => handleTabChange('current')}
        disabled={!selectedUserId}
      />
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Switch
                    label=""
                    defaultChecked={false}
                    onChange={(checked) => {
                      if (checked) {
                        setSelectedUsers(users.map(user => user.auth0Id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                  <span className="text-sm">Select All</span>
                </div>
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                User
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Email
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Phone
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Role
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredUsers.map((user) => (
              <TableRow key={user.auth0Id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.auth0Id)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setSelectedUsers(prevSelected => 
                          isChecked 
                            ? [...prevSelected, user.auth0Id]
                            : prevSelected.filter(id => id !== user.auth0Id)
                        );
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800"
                    />
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full">
                      {user.profile?.profilePictureUrl ? (
                        <img
                          src={user.profile.profilePictureUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.firstName} {user.lastName}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {user.profile?.gender || 'N/A'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.phoneNumber}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.profile?.role || 'User'}
                </TableCell>
                <TableCell className="py-3">
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    user.isActive === true
                      ? 'bg-success/10 text-success' 
                      : 'bg-danger/10 text-danger'
                  }`}>
                    {user.isActive === true ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewDetails(user.auth0Id)}
                      className="px-3 py-1 text-xs text-primary hover:text-primary-dark border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="relative font-normal font-sans z-[1] bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <div className="p-4 md:p-6 2xl:p-10">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                User Management
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage and view all users in the system
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
                className="px-4 py-2 text-sm font-medium text-brand-500 bg-brand-50 rounded-lg hover:bg-brand-100 dark:bg-brand-500/[0.12] dark:text-brand-400 dark:hover:bg-brand-500/[0.18]"
              >
                Switch to {viewMode === 'card' ? 'Table' : 'Card'} View
              </button>
              <button
                onClick={() => setShowNotificationModal(true)}
                disabled={selectedUsers.length === 0}
                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2
                  ${selectedUsers.length === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Send Notification ({selectedUsers.length})
              </button>
            </div>
          </div>
        </div>

        {renderTabs()}

        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredUsers.map((user) => (
              <div
                key={user.auth0Id}
                className="border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user.profile?.profilePictureUrl ? (
                      <img
                        src={user.profile.profilePictureUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xl font-bold text-gray-600">
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Phone</span>
                    <span className="text-sm font-medium text-black dark:text-white">
                      {user.phoneNumber || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Date of Birth</span>
                    <span className="text-sm font-medium text-black dark:text-white">
                      {user.profile?.dateOfBirth
                        ? new Date(user.profile.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Gender</span>
                    <span className="text-sm font-medium text-black dark:text-white">
                      {user.profile?.gender || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Role</span>
                    <span className="text-sm font-medium text-black dark:text-white">
                      {user.profile?.role || "User"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span
                      className={`text-sm font-medium ${
                        user.isActive === true
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {user.isActive === true ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  {/* <button className="px-3 py-1 text-sm text-primary hover:text-primary-dark border border-primary rounded-md hover:bg-primary hover:text-white transition-colors">
                    Edit
                  </button> */}
                  <button 
                    onClick={() => handleViewDetails(user.auth0Id)}
                    className="px-3 py-1 text-sm text-primary hover:text-primary-dark border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : viewMode === 'profile' && selectedUserId ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => {
                  setViewMode('card');
                  setSelectedUserId(null);
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back to List
              </button>
            </div>
            <UserProfileView 
              userId={selectedUserId}
              onClose={() => {
                setViewMode('card');
                setSelectedUserId(null);
              }}
            />
          </div>
        ) : (
          renderTableView()
        )}
      </div>

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        selectedUsers={selectedUsers}
        users={users.map(user => ({
          ...user,
          profile: {
            ...user.profile,
            status: user.isActive ? 'active' : 'inactive'
          }
        }))}
        onNotificationSent={handleNotificationSent}
        // userProfilePic={users[0]?.profile?.profilePictureUrl}
        userProfilePic={userMetadata?.profile?.profilePictureUrl}
      />
    </div>
  );
}
























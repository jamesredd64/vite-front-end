/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { API_CONFIG } from "../config/api.config";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import Switch from "../components/form/switch/Switch";
import NotificationModal from "../components/modals/NotificationModal";
import { useNavigate, useLocation } from "react-router-dom";
import { UserManagementHelper } from "../helpers/UserManagementHelper";
// import UserProfileView from './UserProfileView';
import { useGlobalStorage } from "../hooks/useGlobalStorage";
import UserMetadata from "../types/user";
import ProfileView from './ProfileView';
import Loader from '../components/common/Loader';
import { useAuth0 } from "@auth0/auth0-react";
import { useMongoDbClient } from "../services/mongoDbClient";
import useRbac from "../hooks/useRbac";
import UserUpdateModal from '../components/UserUpdateModal'; // Import the new modal component


interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick, disabled }) => (
  <button className={`hidden sm:block px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
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

interface ApiError extends Error {
  status?: number;
}

// const [error, setError] = useState<ApiError | null>(null);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: string[];
  users: User[];
}

type ViewMode = 'table' | 'card' | 'profile';

export default function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive' | 'current'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const isInitialMount = useRef(true);
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { canAccess, loading: rbacLoading } = useRbac(userMetadata?.profile?.role || 'showcase_attendee'); // Assuming 'user' as a default role
  const { getAllUsers, saveUserData } = useMongoDbClient();
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const [state, setState] = useState({
    isLoading: true,
    users: [] as User[],
    error: null as Error | null,
  });

  // Define handleNotificationSent before using it in useMemo
  const handleNotificationSent = useCallback(() => {
    setSelectedUsers([]);  // Reset selected users
  }, []); // Empty dependency array since it only uses setState

  const fetchAllUsers = useCallback(async () => {
    if (!isAuthenticated) {
      console.log("fetchAllUsers: Not authenticated, returning null");
      return null;
    }
  
    setLoading(true);
    console.log("fetchAllUsers: Fetching all users...");
  
    try {
      // const headers = await getAuthHeaders();
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ALL_USERS}`;
  
      console.log("fetchAllUsers: Making request to:", url);
  
      const response = await fetch(url, {
        method: "GET",
        credentials: "include", // Keep this if your API requires authentication cookies
        headers: {
          "Content-Type": "application/json", // Retain this if the API expects JSON format
        },
      });
      
  
      console.log("fetchAllUsers: Response status:", response.status);
  
      if (response.status === 204) {
        console.log("fetchAllUsers: No users found");
        return [];
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const users = await response.json();
      console.log("fetchAllUsers: Received user list:", users);
      return users;
    } catch (error) {
      console.error("fetchAllUsers: Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
      const status = error instanceof Response ? error.status : undefined;
      
      const apiError = new Error(errorMessage) as ApiError;
      if (status !== undefined) {
        apiError.status = status;
      }
      
      setState(prev => ({
        ...prev,
        error: apiError,
        isLoading: false
      }));

      setError(apiError);
      return [];
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    let isMounted = true;

    const getUsers = async () => {
      const fetchedUsers = await fetchAllUsers();
      if (!isMounted) return;

      if (fetchedUsers) {
        setUsers(fetchedUsers);
      }
    };

    getUsers();

    return () => {
      isMounted = false;
    };
  }, [fetchAllUsers]); // Added fetchAllUsers to dependencies as it's used inside

  // Add effect to handle navigation state
  useEffect(() => {
    const state = location.state as { userId?: string; viewMode?: ViewMode } | null;
    
    if (state?.userId && state.userId !== selectedUserId) {
      setSelectedUserId(state.userId);
      console.log("Setting selected user ID:", state.userId);
  
      // Ensure viewMode updates only when needed
      setViewMode((prev) => state.viewMode ?? prev);
    }
  }, [location.state]);     
    
  
  // Memoize filtered users
  const filteredUsers = useMemo(() => {
    // Skip filtering on initial mount
    if (isInitialMount.current) {
      console.log("filteredUsers just ran:");
      isInitialMount.current = false;
      return users;
    }

    // Return empty array if users is not valid
    if (!Array.isArray(users) || users.length === 0) {
      return [];
    }
    
    // Filter valid users
    const validUsers = users.filter(user => {
      if (!user || typeof user !== 'object') return false;
      
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

    // Log only if we have actual users (avoid empty array logs)
    if (process.env.NODE_ENV === 'development' && validUsers.length > 0) {
      console.log('Filtered users:', validUsers);
    }

    return validUsers;
  }, [users, activeTab, selectedUserId]);

  // Calculate paged users for current page
  const pagedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Reset current page to 1 when pageSize changes
  useEffect(() => {
    setCurrentPage(1);
  }, [pageSize]);

  // Memoize notification modal props to prevent unnecessary re-renders
  const notificationModalProps = useMemo(() => ({
    isOpen: showNotificationModal,
    onClose: () => setShowNotificationModal(false),
    selectedUsers,
    users: users.map((user) => ({
      ...user,
      profile: {
        ...user.profile,
        status: user.isActive ? "active" : "inactive",
      },
    })),
    onNotificationSent: handleNotificationSent,
    userProfilePic: userMetadata?.profile?.profilePictureUrl
  }), [showNotificationModal, selectedUsers, users, userMetadata?.profile?.profilePictureUrl, handleNotificationSent]);
  
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
    // if (!canAccess('users', 'read') || !canAccess('users', 'write')) {
    //   alert('You do not have permission to view user details.');
    //   return;
    // }
    console.log('Viewing details for user:', userId);  // Add logging for debugging
    
    setSelectedUserId(userId);
   // setIsModalOpen(true);
    setViewMode('profile');
    setActiveTab('current');
    navigate(`${location.pathname}`, {
      state: { userId , viewMode: "profile"  },
      replace: true // Use replace to avoid adding to history stack
    });
  };

  const handleTabChange = (tab: 'all' | 'active' | 'inactive' | 'current') => {
    if (tab !== 'current') {
      // Comment out view mode changes
       setViewMode('table');
      console.log('Selected user ID changed to:', selectedUserId);
      setSelectedUserId(null);
    }
    setActiveTab(tab);
  };

  const renderTabs = () => (
    <div className="flex gap-2 mb-4 mt-4">
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

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      // Optimistically update UI before API call
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.auth0Id === userId ? { ...user, isActive: currentStatus } : user
        )
      );
  
      // 🔹 Call your frontend service instead of direct API fetch
      const updatedUser = await saveUserData(userId, { isActive: currentStatus });
  
      if (!updatedUser) {
        throw new Error("Failed to update user status");
      }
  
      console.log("User status updated successfully:", updatedUser);
    } catch (error) {
      console.error("Error toggling user status:", error);
  
      // 🔹 Revert UI changes if API call fails
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.auth0Id === userId ? { ...user, isActive: currentStatus } : user
        )
      );
    }
  };
  

  const getAuthHeaders = async () => {
    const token = await getAccessTokenSilently();
    console.log("getAuthHeaders just ran: ", token);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  console.log("viewMode", viewMode);
  
  const renderTableView = () => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-2 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-2 sm:pt-6">
      <div className="max-w-full overflow-x-auto p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Switch
                    label="Select All"
                    defaultChecked={false}
                    onChange={(checked) => {
                      if (checked) {
                        setSelectedUsers(users.map(user => user.auth0Id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                  {/* <span className="text-sm">Select All</span> */}
                </div>
              </TableCell>
              <TableCell isHeader className="py-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                User
              </TableCell>
              <TableCell isHeader className="py-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 hidden sm:table-cell">
              Email
              </TableCell>
              <TableCell isHeader className="py-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 hidden sm:table-cell">
              Phone
              </TableCell>
              <TableCell isHeader className="py-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Role
              </TableCell>
              <TableCell isHeader className="py-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
              <TableCell isHeader className="py-6 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 ">
            {pagedUsers.map((user) => (
              <TableRow key={user.auth0Id}  className="cursor-pointer">
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
                <TableCell className="py-7">
                  <div className="flex items-center gap-4">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-full hidden sm:table-cell">
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
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400 hidden sm:table-cell">
                        {user.profile?.gender || 'N/A'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 hidden sm:table-cell">
                  {user.email}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 hidden sm:table-cell">
                  {UserManagementHelper.formatPhoneNumber(user.phoneNumber)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {UserManagementHelper.capitalizeFirstLetter(user.profile?.role || 'showcase_attendee')}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center">
                  <Switch
                      label={user.isActive ? 'Active' : 'Inactive'}
                      defaultChecked={user.isActive}
                      onChange={(checked) => { (async () => { await handleStatusToggle(user.auth0Id, checked); })(); }}
                      color={user.isActive ? 'blue' : 'gray'}
                    />                    
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      {/* {user.isActive ? 'Active' : 'Inactive'} */}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex space-x-2">
                    {/* {canAccess('users', 'read') && ( */}
                     { (<button
                        onClick={(e) => { e.stopPropagation(); handleViewDetails(user.auth0Id); }}
                        className="px-3 py-1 text-xs text-primary hover:text-primary-dark border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

    // ************************************
  // NEW CARD VIEW IMPLEMENTATION
  // ************************************
  const renderCardView = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {pagedUsers.map((user) => (
        <div key={user.auth0Id} className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-start justify-between">
            {/* Profile Pic and Name/Email Block */}
            <div className="flex items-center gap-3">
               <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                  {user.profile?.profilePictureUrl ? (
                    <img
                      src={user.profile.profilePictureUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-lg font-bold">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400" title={user.email}>
                    {user.email}
                  </p>
                </div>
            </div>
             {/* Checkbox */}
             <div className="ml-2 flex-shrink-0">
                <input
                    type="checkbox"
                    id={`select-card-${user.auth0Id}`}
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
                 <label htmlFor={`select-card-${user.auth0Id}`} className="sr-only">Select user {user.firstName} {user.lastName}</label>
            </div>
          </div>

           {/* Details Section */}
           <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{user.phoneNumber || 'N/A'}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Role:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{user.profile?.role || 'showcase_attendee'}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    {canAccess('users', 'write') ? ( // Check write permission for status toggle
                      <div className="flex items-center">
                        <Switch
                          label={user.isActive ? 'Active' : 'Inactive'}
                          defaultChecked={user.isActive}
                          onChange={(checked) => handleStatusToggle(user.auth0Id, checked)}
                          color={user.isActive ? 'blue' : 'gray'}
                        />
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                </div>
           </div>

           {/* Actions Section */}
           <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                {canAccess('users', 'read') && ( // Check read permission for view details button
                  <button
                      onClick={() => handleViewDetails(user.auth0Id)}
                      className="w-full rounded-md border border-primary px-3 py-1.5 text-center text-xs font-medium text-primary transition-colors hover:bg-primary/10 dark:hover:bg-primary/20"
                  >
                      View Details
                  </button>
                )}
           </div>
        </div>
      ))}
       {filteredUsers.length === 0 && viewMode === 'card' && (
             <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                 No users found matching the current filter.
             </div>
        )}
    </div>
  );
  // ************************************
  // END OF CARD VIEW IMPLEMENTATION
  // ************************************
  
    if (isLoading) {
      return <Loader size="medium" />;
    }

  return (
    
    <div className="relative font-normal font-sans z-[1] bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <div className="p-1 md:p-1 2xl:p-1">
        {" "}
        {/* Further reduced padding */}
        <div className="mb-1">
          {" "}
          {/* Changed from mb-1 to mb-2 to double the space */}
          <div className="flex justify-between items-center">
            <div>
              <div className="text-center sm:hidden mb-2">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Management
                </h4>
              </div>
              <div className="sm:hidden flex justify-between items-center gap-8 px-2 py-2 border-b border-gray-300 dark:border-gray-700 mb-2">
                <Switch
                  key={selectedUsers.join(',')}
                  label="Select All"
                  defaultChecked={filteredUsers.length > 0 && filteredUsers.every(user => selectedUsers.includes(user.auth0Id))}
                  onChange={(checked) => {
                    if (checked) {
                      setSelectedUsers(filteredUsers.map(user => user.auth0Id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
                <button
                  onClick={() => setShowNotificationModal(true)}
                  disabled={selectedUsers.length === 0}
                  className={`px-2 py-1 text-xs font-medium rounded-lg flex items-center gap-4
                    ${
                      selectedUsers.length === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary-dark"
                    }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Send Notification ({selectedUsers.length})
                </button>
              </div>
              <div className="hidden sm:block">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Management
                </h4>
                <p className="text-sm mb-2 p-4 text-gray-500 dark:text-gray-400">
                  Manage and view all users in the system
                </p>
              </div>
              <div className="flex gap-4 items-center hidden sm:flex">
                <div>
                  <button
                    onClick={() =>
                      setViewMode(viewMode === "table" ? "card" : "table")
                    }
                    className="px-4 py-2 text-sm font-medium text-brand-500 bg-brand-50 rounded-lg hover:bg-brand-100 dark:bg-brand-500/[0.12] dark:text-brand-400 dark:hover:bg-brand-500/[0.18]"
                  >
                    Switch to {viewMode === "table" ? "Card" : "Table"} View
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setShowNotificationModal(true)}
                    disabled={selectedUsers.length === 0}
                    className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2
                      ${
                        selectedUsers.length === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary-dark"
                      }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    Send Notification ({selectedUsers.length})
                  </button>
                </div>
              </div>
            </div>
        </div>
        {renderTabs()}
        <div className="mt-1">
          {" "}
          {/* Further reduced top margin */}
          {viewMode === 'table' && <div className="hidden sm:block">{renderTableView()}</div>}
          {viewMode === 'card' && <div className="block">{renderCardView()}</div>}
          {viewMode === 'profile' && selectedUserId && (
             <ProfileView userId={selectedUserId} />
          )}
          {(viewMode === 'table' || viewMode === 'card') && filteredUsers.length > pageSize && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <label htmlFor="pageSizeSelect" className="text-sm text-gray-700 dark:text-gray-300">
                Page Size:
              </label>
              <select
                id="pageSizeSelect"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 px-2 py-1"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {Math.ceil(filteredUsers.length / pageSize)}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(filteredUsers.length / pageSize)))}
                disabled={currentPage === Math.ceil(filteredUsers.length / pageSize)}
                className={`px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium ${
                  currentPage === Math.ceil(filteredUsers.length / pageSize) ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:bg-primary/10 dark:hover:bg-primary/20'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        selectedUsers={selectedUsers}
        users={users.map((user) => ({
          ...user,
          profile: {
            ...user.profile,
            status: user.isActive ? "active" : "inactive",
          },
        }))}
        onNotificationSent={handleNotificationSent}        
        userProfilePic={userMetadata?.profile?.profilePictureUrl}
      />
      </div>
    </div>
      
  );
}

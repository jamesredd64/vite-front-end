import React, { useState, useEffect, useMemo, useRef } from "react";
import { API_CONFIG } from "../config/api.config";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../components/ui/table";
import Switch from "../components/form/switch/Switch";
import NotificationModal from "../components/modals/NotificationModal";
// import { useNavigate } from "react-router-dom";
// import UserProfileView from './UserProfileView';
import { useGlobalStorage } from "../hooks/useGlobalStorage";
import UserMetadata from "../types/user";
// import ProfileView from './ProfileView';
import Loader from '../components/common/Loader';
import  Input  from "../components/form/input/InputField";
import  Label from "../components/form/Label";

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

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  role: string;
  isActive: boolean;
  profilePictureUrl: string;
}

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive' | 'current'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    role: '',
    isActive: true,
    profilePictureUrl: ''
  });
  const formRef = useRef<HTMLDivElement>(null);

  // Add a useEffect to handle scrolling after state updates
  useEffect(() => {
    if (showForm) {
      // Add a marker element at the top of the form section
      const marker = document.createElement('div');
      marker.id = 'form-scroll-marker';
      marker.style.position = 'relative';
      marker.style.top = '-20px'; // Offset to ensure proper scroll position
      
      if (formRef.current) {
        formRef.current.insertBefore(marker, formRef.current.firstChild);
        
        setTimeout(() => {
          marker.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Clean up the marker after scrolling
          setTimeout(() => marker.remove(), 1000);
        }, 100);
      }
    }
  }, [showForm]);

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
        
        // Type guard to ensure data is an array
        if (!Array.isArray(data)) {
          throw new Error('Expected array of users from API');
        }
        
        // Ensure the data is properly structured with type safety
        const formattedUsers: Array<{
          auth0Id: string;
          profile: {
            dateOfBirth: string | null;
            gender: string;
            profilePictureUrl: string;
            role: string;
          };
          firstName: string;
          lastName: string;
          email: string;
          phoneNumber: string;
          isActive: boolean;
        }> = data.map((user: Partial<User>) => ({
          auth0Id: user.auth0Id || '',
          profile: {
            dateOfBirth: user.profile?.dateOfBirth || null,
            gender: user.profile?.gender || '',
            profilePictureUrl: user.profile?.profilePictureUrl || '',
            role: user.profile?.role || 'User'
          },
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          isActive: typeof user.isActive === 'boolean' ? user.isActive : true
        }));

        setUsers(formattedUsers as User[]);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if we're not already loading
    if (loading) {
      fetchUsers();
    }
  }, [loading]); // Add loading as dependency

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

  // Add console.log to debug filtered users
  console.log('Filtered users:', filteredUsers);

  if (loading) {
    return <Loader size="large" />;
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
    console.log('Viewing details for user:', userId);
    
    const user = users.find(u => u.auth0Id === userId);
    console.log('Found user:', user);
    
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        gender: user.profile?.gender || '',
        role: user.profile?.role || 'User',
        isActive: user.isActive || false,
        profilePictureUrl: user.profile?.profilePictureUrl || ''
      });
      
      setShowForm(true);
      
      // Add small delay to ensure form is rendered before scrolling
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
          });
        }
      }, 100);
    }
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
    <div className="flex gap-2 mb-4">
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
                  <div className="flex items-center gap-1">
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
    // Hidden by default
    
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleShowForm = () => {
    setShowForm(true);
    setTimeout(() => {
      const formSection = document.getElementById('event-form-section');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleInputChange = (field: keyof UserFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'isActive' 
        ? (e.target as HTMLInputElement).checked 
        : e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderForm = () => (
    <div 
      id="event-form-section"
      className={`mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 ${
        showForm ? 'block' : 'hidden'
      }`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Personal Information
            </h3>
            
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange('phoneNumber')}
                className="mt-1"
              />
            </div>
          </div>

          {/* Profile Settings Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile Settings
            </h3>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleInputChange('gender')}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={handleInputChange('role')}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary focus:outline-none focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>

            <div>
              <Label htmlFor="profilePicture">Profile Picture URL</Label>
              <Input
                id="profilePicture"
                type="url"
                value={formData.profilePictureUrl}
                onChange={handleInputChange('profilePictureUrl')}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="isActive">Active Status</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="relative font-normal font-sans bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <div className="p-1 md:p-1 2xl:p-1">
        {/* Top section with tabs */}
        <div className="relative z-10">
          {renderTabs()}
        </div>
        
        {/* Table/Card view section */}
        <div className="relative z-10 mt-1">
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.auth0Id}
                  className="border-[0.5px] mb-5 border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6"
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
                      <span className="text-sm text-gray-500">
                        Date of Birth
                      </span>
                      <span className="text-sm font-medium text-black dark:text-white">
                        {user.profile?.dateOfBirth
                          ? new Date(
                              user.profile.dateOfBirth
                            ).toLocaleDateString()
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
                      className="px-3 py-1 text-sm text-primary hover:text-primary-dark border-[0.5px] border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderTableView()
          )}
        </div>

        {/* Form section */}
        <div 
          ref={formRef}
          className={`relative z-10 mt-8 mb-8 scroll-mt-8 ${showForm ? '' : 'hidden'}`}
          id="user-details-form"
        >
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                User Details
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <span className="sr-only">Close form</span>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission
              console.log('Form submitted:', formData);
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="isActive">Status</Label>
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notification Modal */}
        {showNotificationModal && (
          <NotificationModal
            isOpen={showNotificationModal}
            onClose={() => setShowNotificationModal(false)}
            selectedUsers={selectedUsers}
            users={users.map(user => ({
              ...user,
              profile: {
                ...user.profile,
                status: user.isActive ? "active" : "inactive"
              }
            }))}
            onNotificationSent={handleNotificationSent}
          />
        )}
      </div>
    </div>
  );
}


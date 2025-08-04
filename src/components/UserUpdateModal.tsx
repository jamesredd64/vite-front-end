import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other potential user fields here if needed, e.g.,
  // isActive: boolean;
  // lastLogin: string;
}

interface UserUpdateModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<User | null>(user);
  const [activeTab, setActiveTab] = useState('general'); // State for active tab

  useEffect(() => {
    setFormData(user);
    setActiveTab('general'); // Reset to general tab when user changes or modal opens
  }, [user]);

  if (!isOpen || !formData) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      if (!prevData) return null;
      return { ...prevData, [name]: value };
    });
  };

  // Handle switch changes (example for a boolean field if added to User interface)
  // const handleSwitchChange = (name: keyof User, checked: boolean) => {
  //   setFormData(prevData => {
  //     if (!prevData) return null;
  //     return { ...prevData, [name]: checked };
  //   });
  // };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {/* Example of a switch if you add a boolean field like 'isActive' */}
            {/* <div className="mb-4 flex items-center">
              <label htmlFor="isActive" className="block text-gray-700 text-sm font-bold mr-2">
                Active:
              </label>
              <input
                type="checkbox" // Use checkbox for simplicity, replace with a custom switch component if available
                id="isActive"
                name="isActive"
                checked={formData.isActive || false} // Provide a default value
                onChange={(e) => handleSwitchChange('isActive', e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
            </div> */}
          </div>
        );
      case 'role':
        return (
          <div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                Role:
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                {/* Replace with actual roles from your application */}
                <option value="showcase_attendee">User</option>
                <option value="showcase_agent">Admin</option>
                <option value="showcase_team">Admin</option>
                <option value="showcase_admin">Admin</option>
                {/* Add other roles as needed */}
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ID:
          </label>
          <p className="text-gray-800">{formData.id}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('general')}
            >
              General Information
            </button>
            <button
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'role' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('role')}
            >
              Role
            </button>
            {/* Add more tabs as needed */}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserUpdateModal;
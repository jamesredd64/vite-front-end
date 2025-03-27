import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useModal } from '../../hooks/useModal';
import { useUserProfileStore } from '../../stores/userProfileStore';

interface UserAddressCardProps {
  onUpdate: (data: any) => void;
  initialData: {
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
}

export const UserAddressCard: React.FC<UserAddressCardProps> = ({ onUpdate, initialData }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth0();
  const userProfile = useUserProfileStore();
  const [saveResult, setSaveResult] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    address: {
      street: initialData.address?.street || '',
      city: initialData.address?.city || '',
      state: initialData.address?.state || '',
      zipCode: initialData.address?.zipCode || '',
      country: initialData.address?.country || ''
    }
  });

  useEffect(() => {
    const newFormData = {
      address: {
        street: initialData.address?.street || '',
        city: initialData.address?.city || '',
        state: initialData.address?.state || '',
        zipCode: initialData.address?.zipCode || '',
        country: initialData.address?.country || ''
      }
    };

    // Only update if the data has actually changed
    if (JSON.stringify(formData) !== JSON.stringify(newFormData)) {
      setFormData(newFormData);
    }
  }, [initialData]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      address: {
        ...prev.address,
        [field]: e.target.value
      }
    }));
    userProfile.setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      onUpdate(formData);
      // setSaveResult('Address saved successfully');
      closeModal();
    } catch (error) {
      console.error('Error saving address info:', error);
      setSaveResult('Error saving address');
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 group hover:bg-gray-50 dark:hover:bg-gray-800/50">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <h3 className="font-medium text-black dark:text-white">
            Address Information
          </h3>
          <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 min-w-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>

        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400">
            {formData.address.street}, {formData.address.city}
            <br />
            {formData.address.state} {formData.address.zipCode}
            <br />
            {formData.address.country}
          </p>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Edit Address</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Street"
                value={formData.address.street}
                onChange={handleInputChange('street')}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="City"
                value={formData.address.city}
                onChange={handleInputChange('city')}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="State"
                value={formData.address.state}
                onChange={handleInputChange('state')}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={formData.address.zipCode}
                onChange={handleInputChange('zipCode')}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.address.country}
                onChange={handleInputChange('country')}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {saveResult && (
        <div className="mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900">
          <p className="text-green-700 dark:text-green-300">{saveResult}</p>
        </div>
      )}
    </>
  );
};

export default UserAddressCard;

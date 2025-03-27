import { useEffect, useState } from 'react';
import { useGlobalStorage } from '../hooks/useGlobalStorage';
import UserInfoCard from '../components/UserProfile/UserInfoCard';
import UserMetaCard from '../components/UserProfile/UserMetaCard';
import UserAddressCard from '../components/UserProfile/UserAddressCard';
import { useMongoDbClient, UserData } from '../services/mongoDbClient';
import { UserMetadata } from '../types/user';
import React from 'react';
import Button from '../components/ui/button/Button';

const UserProfiles = () => {
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const [mongoUser, setMongoUser] = useGlobalStorage<UserData | null>('mongoUser', null);
  const { getUserByEmail, createOrUpdateUser } = useMongoDbClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedAddress, setEditedAddress] = useState(userMetadata?.address || {});

  const handleEditClick = () => {
    // Add your edit logic here
    console.log('Edit button clicked');
    // You might want to:
    // 1. Open a modal
    // 2. Set some editing state
    // 3. Navigate to an edit page
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userMetadata?.email) {
        console.log('No user email available in metadata');
        setLoading(false);
        return;
      }

      try {
        const result = await getUserByEmail(userMetadata.email);
        if (result) {
          console.log('Existing user found:', result);
          setMongoUser(result);
        } else {
          console.log('No existing user found - new user needs to complete profile');
          setMongoUser(null);
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        // Only set error for actual API/network failures, not for 404 (user not found)
        if (err.status !== 404) {
          setError(`Failed to fetch user data: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userMetadata?.email, getUserByEmail, setMongoUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <div>Loading user data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!userMetadata || !mongoUser) {
    return (
      <div className="p-4">
        {/* <p>No user data available</p> */}
        <p className="text-sm text-gray-500">Debug info:</p>
        <pre className="text-xs bg-gray-100 p-2 mt-2 rounded">
          {JSON.stringify({ userMetadata, mongoUser }, null, 2)}
        </pre>
      </div>
    );
  }

  return (
                   
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h4 className="font-semibold text-black dark:text-white">
          Address Information
        </h4>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleEditClick}
        startIcon={
          <svg
            className="fill-current"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.8196 3.06667L12.9329 3.95333L11.0663 2.08667L11.9529 1.2C12.0996 1.05333 12.2796 0.98 12.4929 0.98C12.7063 0.98 12.8863 1.05333 13.0329 1.2L13.8196 1.98667C13.9663 2.13333 14.0396 2.31333 14.0396 2.52667C14.0396 2.74 13.9663 2.92 13.8196 3.06667ZM2.66626 10.4867L10.3996 2.75333L12.2663 4.62L4.53292 12.3533H2.66626V10.4867Z"
              fill=""
            />
          </svg>
        }
      >
        Edit
      </Button>
      <div className="p-7">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Street</span>
            <span>{userMetadata.address.street}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">City</span>
            <span>{userMetadata.address.city}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">State</span>
            <span>{userMetadata.address.state}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">ZIP Code</span>
            <span>{userMetadata.address.zipCode}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-black dark:text-white">Country</span>
            <span>{userMetadata.address.country}</span>
          </div>
        
        </div>
      </div>
    </div>
  );
};
export default UserAddressCard;

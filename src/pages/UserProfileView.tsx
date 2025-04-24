/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api.config";
import { UserMetaCard } from "../components/UserProfile/UserMetaCard";
import { UserAddressCard } from "../components/UserProfile/UserAddressCard";
import { UserMarketingCard } from "../components/UserProfile/UserMarketingCard";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useMongoDbClient } from "../services/mongoDbClient";
import { UnsavedChangesNotification } from "../components/UnsavedChangesNotification";
import UserMetadata from "../types/user";
import { useAdmin } from '../hooks/useAdmin';
import { useNavigate } from 'react-router-dom';


interface User {
  _id: string;
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profile: {
    dateOfBirth: string | null;
    gender: string;
    profilePictureUrl: string;
    role: string;
  };
  marketingBudget: {
    adBudget: number;
    costPerAcquisition: number;
    dailySpendingLimit: number;
    marketingChannels: string;
    monthlyBudget: number;
    preferredPlatforms: string;
    notificationPreferences: string[];
    roiTarget: number;
    frequency: "daily" | "monthly" | "quarterly" | "yearly";
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
}

interface UserProfileViewProps {
  userId: string;
  onClose: () => void;
}
console.log('UserProfileView.tsx is being executed');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UserProfileView({ userId, onClose }: UserProfileViewProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { saveUserData } = useMongoDbClient();
  const [saveStatus, setSaveStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const navigate = useNavigate();

  // Define default values
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const defaultMarketingBudget = {
    adBudget: 0,
    costPerAcquisition: 0,
    dailySpendingLimit: 0,
    marketingChannels: '',
    monthlyBudget: 0,
    preferredPlatforms: '',
    notificationPreferences: [] as string[],
    roiTarget: 0,
    frequency: 'monthly' as const
  };




  const defaultAddress = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };

  const handleUpdate = (updates: Partial<UserMetadata>) => {
    if (!userData) return;

    setUserData((prevData: User | null) => {
      if (!prevData) return null;
      
      const newData: User = {
        ...prevData,
        email: updates.email || prevData.email,
        firstName: updates.firstName || prevData.firstName,
        lastName: updates.lastName || prevData.lastName,
        phoneNumber: updates.phoneNumber || prevData.phoneNumber,
        address: {
          ...prevData.address,
          ...(updates.address || {})
        },
        profile: {
          ...prevData.profile,
          dateOfBirth: updates.profile?.dateOfBirth || prevData.profile.dateOfBirth,
          gender: updates.profile?.gender || prevData.profile.gender,
          profilePictureUrl: updates.profile?.profilePictureUrl || prevData.profile.profilePictureUrl,
          role: updates.profile?.role || prevData.profile.role,
        },
        marketingBudget: {
          ...prevData.marketingBudget,
          ...(updates.marketingBudget || {})
        },
        isActive: prevData.isActive
      };

      setHasUnsavedChanges(true);
      return newData;
    });
  };

  const handleSaveChanges = async () => {
    if (!userData) return;

    try {
      await saveUserData(userId, {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        profile: {
          dateOfBirth: userData.profile.dateOfBirth || '',
          gender: userData.profile.gender,
          profilePictureUrl: userData.profile.profilePictureUrl,
          role: (userData.profile.role as 'user' | 'admin' | 'manager')
        },
        address: userData.address,
        marketingBudget: userData.marketingBudget,
        isActive: userData.isActive
      });
      
      setHasUnsavedChanges(false);
      setSaveStatus({ message: "Changes saved successfully", isError: false });
    } catch (error) {
      console.error("Error saving changes:", error);
      setSaveStatus({
        message: error instanceof Error ? error.message : "Failed to save changes",
        isError: true
      });
    }
  };

  const handleDiscardChanges = async () => {
    await fetchUserData();
    setHasUnsavedChanges(false);
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS}/${userId}`,
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

      const rawResponse = await response.text();
      if (!rawResponse) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(rawResponse);
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError(error instanceof Error ? error : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  useEffect(() => {
    if (!saveStatus) return;
    
    const timeoutId = setTimeout(() => {
      setSaveStatus(null);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [saveStatus]);

  if (!useAdmin) {
    // navigate('/dashboard', { replace: true });
    // return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !userData) {
    return <div>Error loading user profile</div>;
  }

  return (
    <>
      <PageMeta
        title={`User Profile - ${userData.firstName} ${userData.lastName}`}
        description="User Profile Details"
      />
      <PageBreadcrumb pageTitle="User Profile" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/50 lg:p-6">
        <div className="flex flex-col gap-5">
          {/* UnsavedChanges notification */}
          <div className={`${hasUnsavedChanges ? 'block' : 'hidden'}`}>
            <UnsavedChangesNotification
              onSave={handleSaveChanges}
              onDiscard={handleDiscardChanges}
            />
          </div>

          {/* Save Status Message Container */}
          <div className="h-1 flex items-center justify-center">
            {saveStatus && (
              <span
                className={`text-center ${
                  saveStatus.isError ? "text-red-500" : "text-green-500"
                }`}
              >
                {saveStatus.message}
              </span>
            )}
          </div>

          {/* Remove any extra divs or containers here - render cards directly */}
          <UserMetaCard
            onUpdate={handleUpdate}
            initialData={{
              email: userData.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phoneNumber: userData.phoneNumber,
              profile: {
                dateOfBirth: userData.profile.dateOfBirth || "",
                gender: userData.profile.gender,
                profilePictureUrl: userData.profile.profilePictureUrl,
                role: userData.profile.role as 'user' | 'admin' | 'manager' | 'super-admin'
              },
            }}
          />

          <UserAddressCard
            onUpdate={(updates: unknown) => handleUpdate(updates as Partial<UserMetadata>)}
            initialData={{
              address: userData.address || defaultAddress,
            }}
          />

          <UserMarketingCard
            onUpdate={handleUpdate}
            initialData={{
              marketingBudget: {
                frequency: userData.marketingBudget.frequency || 'monthly',
                adBudget: userData.marketingBudget.adBudget || 0,
                costPerAcquisition: userData.marketingBudget.costPerAcquisition || 0,
                dailySpendingLimit: userData.marketingBudget.dailySpendingLimit || 0,
                marketingChannels: userData.marketingBudget.marketingChannels || '',
                monthlyBudget: userData.marketingBudget.monthlyBudget || 0,
                preferredPlatforms: userData.marketingBudget.preferredPlatforms || '',
                notificationPreferences: Array.isArray(userData.marketingBudget.notificationPreferences)
                  ? userData.marketingBudget.notificationPreferences
                  : [],
                roiTarget: userData.marketingBudget.roiTarget || 0
              }
            }}
          />
        </div>
      </div>
    </>
  );
}


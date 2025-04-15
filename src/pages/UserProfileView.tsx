import React, { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api.config";
import { UserMetaCard } from "../components/UserProfile/UserMetaCard";
import { UserAddressCard } from "../components/UserProfile/UserAddressCard";
import { UserMarketingCard } from "../components/UserProfile/UserMarketingCard";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useMongoDbClient } from "../services/mongoDbClient";
import { UnsavedChangesNotification } from "../components/UnsavedChangesNotification";
import  UserMetadata  from "../types/user";

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
  },
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
  },   
  
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function UserProfileView({ userId, onClose }: UserProfileViewProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { saveUserData } = useMongoDbClient();

  // Handler for updating user data
  const handleUpdate = (updates: Partial<UserMetadata>) => {
    if (!userData) return;
    
    setUserData((prevData: User | null): User | null => {
      if (!prevData) return null;
      return {
        ...prevData,
        ...updates,
        marketingBudget: {
          ...prevData.marketingBudget,
          ...(updates.marketingBudget || {})
          // monthlyBudget: updates.marketingBudget?.monthlyBudget || prevData.marketingBudget.monthlyBudget,
          // frequency: updates.marketingBudget?.frequency || prevData.marketingBudget.frequency,
          // adBudget: updates.marketingBudget?.adBudget || prevData.marketingBudget.adBudget,
          // costPerAcquisition: prevData.marketingBudget.costPerAcquisition,
          // dailySpendingLimit: prevData.marketingBudget.dailySpendingLimit,
          // marketingChannels: prevData.marketingBudget.marketingChannels,
          // preferredPlatforms: prevData.marketingBudget.preferredPlatforms,
          // notificationPreferences: prevData.marketingBudget.notificationPreferences,
          // roiTarget: prevData.marketingBudget.roiTarget
        }
      };
    });
    setHasUnsavedChanges(true);
  };

  // Handler for saving changes
  const handleSaveChanges = async () => {
    try {
      if (!userData) return;
      
      await saveUserData(userId, {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        profile: {
          dateOfBirth: userData.profile.dateOfBirth || '',
          gender: userData.profile.gender || '',
          profilePictureUrl: userData.profile.profilePictureUrl || '',
        },
        address: {
          street: userData.address.street || '',
          city: userData.address.city || '',
          state: userData.address.state || '',
          zipCode: userData.address.zipCode || '',
          country: userData.address.country || '',
        },
        marketingBudget: {
          adBudget: userData.marketingBudget.adBudget,
          costPerAcquisition: userData.marketingBudget.costPerAcquisition,
          dailySpendingLimit: userData.marketingBudget.dailySpendingLimit,
          marketingChannels: userData.marketingBudget.marketingChannels || '',
          monthlyBudget: userData.marketingBudget.monthlyBudget,
          preferredPlatforms: userData.marketingBudget.preferredPlatforms || '',
          notificationPreferences: userData.marketingBudget.notificationPreferences || [],
          roiTarget: userData.marketingBudget.roiTarget,
          frequency: userData.marketingBudget.frequency
        },
        isActive: userData.isActive
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  // Handler for discarding changes
  const handleDiscardChanges = () => {
    // Reload the original data
    fetchUserData();
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
        {hasUnsavedChanges && (
          <UnsavedChangesNotification
            onSave={handleSaveChanges}
            onDiscard={handleDiscardChanges}
          />
        )}
        
        <div className="flex flex-col gap-5">
          <UserMetaCard
            onUpdate={handleUpdate}
            initialData={{
              email: userData?.email || "",
              firstName: userData?.firstName || "",
              lastName: userData?.lastName || "",              
              profile: {
                dateOfBirth: userData?.profile?.dateOfBirth || "",
                gender: userData?.profile?.gender || "",
                profilePictureUrl: (userData?.profile?.profilePictureUrl || "") 
              },              
            }}
          />

          <UserAddressCard
            onUpdate={(updates: unknown) => handleUpdate(updates as Partial<UserMetadata>)}
            initialData={{
              address: userData.address
            }}
          />

          <UserMarketingCard
            onUpdate={handleUpdate}
            initialData={{
              marketingBudget: {
                frequency: userData.marketingBudget.frequency || "monthly",
                adBudget: 0,
                costPerAcquisition: 0,
                dailySpendingLimit: 0,
                marketingChannels: "",
                monthlyBudget: 0,
                preferredPlatforms: "",
                notificationPreferences: [],
                roiTarget: 0
              }
            }}
          />
        </div>
      </div>
    </>
  );
}












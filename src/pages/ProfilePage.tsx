
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { UserMetaCard } from "../components/UserProfile/UserMetaCard";
import { UserAddressCard } from "../components/UserProfile/UserAddressCard";
import { UserMarketingCard } from "../components/UserProfile/UserMarketingCard";
import { UnsavedChangesNotification } from "../components/UnsavedChangesNotification";
import { useMongoDbClient } from "../services/mongoDbClient";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetadata from "../types/user";
// import { useUnsavedChanges } from "../hooks/useUnsavedChanges";
import { useNavigation } from "../hooks/useNavigation";
import deepEqual from 'fast-deep-equal';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Button from "../components/ui/button/Button";

// Logger utility
const logger = (message: string, data?: unknown) => {
  if (import.meta.env.DEV) {
    console.log(message, data);
  }
};

interface UserData {
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profile: {    
    dateOfBirth: string;
    gender: string;
    profilePictureUrl: string;
    marketingBudget: {
      adBudget: number;
      costPerAcquisition: number;
      dailySpendingLimit: number;
      marketingChannels: string;
      monthlyBudget: number;
      preferredPlatforms: string;
      notificationPreferences: string[];
      roiTarget: number;
      frequency: 'daily' | 'monthly' | 'quarterly' | 'yearly';
    };
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type ViewMode = 'table' | 'card' | 'profile';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const [viewMode, setViewMode] = useState<ViewMode>('table');

interface UserProfileProps {
  auth0Id?: string;  // Made optional with '?'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserProfile: React.FC<UserProfileProps> = ({ auth0Id }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { getUserById, saveUserData } = useMongoDbClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleNavigation } = useNavigation();
  
  // Add viewMode state inside component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [initialUserData, setInitialUserData] = useState<UserData | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Update both states together
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateUnsavedChanges = (value: boolean) => {
    setHasUnsavedChanges(value);
  };

  // Define default marketing budget
  const defaultMarketingBudget = {
    adBudget: 0,
    costPerAcquisition: 0,
    dailySpendingLimit: 0,
    marketingChannels: '',
    monthlyBudget: 0,
    preferredPlatforms: '',
    notificationPreferences:  [],
    roiTarget: 0,
    frequency: "monthly" as const
  };

  // Initialize state with default values
  const [userData, setUserData] = useState<UserData>({
    auth0Id: "",
    email: "",
    firstName: "",
    lastName: "",    
    phoneNumber: "",
    profile: {
      dateOfBirth: "",
      gender: "",
      profilePictureUrl: "",
      marketingBudget: {
        ...defaultMarketingBudget,
        adBudget: 0,
        costPerAcquisition: 0,
        dailySpendingLimit: 0,
        marketingChannels: "",
        monthlyBudget: 0,
        preferredPlatforms: "",
        notificationPreferences: [],
        roiTarget: 0,
        frequency: "daily"
      }
    },    
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    },
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(true);

  // Navigation handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onNavigate = async (path: string) => {
    if (hasUnsavedChanges) {
      // Let the user continue navigation, the notification will handle saving
      navigate(path);
    } else {
      navigate(path);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      setHasUnsavedChanges(false);
    } catch (error) {
      logger('Error saving changes:', error);
    }
  };

  const handleDiscardChanges = () => {
    if (initialUserData) {
      setUserData(initialUserData);
      setHasUnsavedChanges(false);
    }
  };

  // Improved beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return function cleanup() {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Improved change detection using fast-deep-equal
  useEffect(() => {
    if (isInitialLoad) {
      logger('Skipping change detection during initial load');
      return;
    }

    if (!initialUserData || !userData) {
      logger('Missing data for change detection');
      return;
    }

    const hasChanges = !deepEqual(initialUserData, userData);
    logger('Change detection:', { hasChanges, userData, initialUserData });
    setHasUnsavedChanges(hasChanges);
  }, [userData, initialUserData, isInitialLoad]);

  // Clear save status after 5 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (saveStatus) {
      timeoutId = setTimeout(() => {
        setSaveStatus(null);
      }, 5000); // Changed from 15000 to 5000 (5 seconds)
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [saveStatus]);

  useEffect(() => {
    const fetchUserData = async () => {
      // If auth0Id is provided (from UserManagement), use it
      // Otherwise, use the authenticated user's ID
      const userIdToFetch = auth0Id || (isAuthenticated && user?.sub);

      if (userIdToFetch) {
        try {
          const fetchedUserData = await getUserById(userIdToFetch);
          setUserData(() => ({
            ...fetchedUserData,
            marketingBudget: {
              ...defaultMarketingBudget,
              ...fetchedUserData?.marketingBudget,
            },
          }));
          
          setInitialUserData(fetchedUserData);
          console.log('Initial user data loaded:', fetchedUserData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Handle error case...
        } finally {
          setIsLoading(false);
          setTimeout(() => {
            setIsInitialLoad(false);
            setHasUnsavedChanges(false);
          }, 500);
        }
      }
    };

    fetchUserData();
  // Remove defaultMarketingBudget from dependencies
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, getUserById, auth0Id]);

  const handleUpdate = (updates: Partial<UserMetadata>) => {
    console.log('handleUpdate called with:', updates);
    setUserData((prevData: UserData) => {
      const processedUpdates: Partial<UserMetadata> = {
        ...updates,
        profile: updates.profile ? {
          ...updates.profile
        } : updates.profile
      };

      const newData: UserData = {
        ...prevData,
        ...processedUpdates as UserData
      };
      
      console.log('Previous data:', prevData);
      console.log('New data:', newData);
      return newData;
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      const transformedData: Partial<UserMetadata> = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        profile: {
          // Use the correct profile picture based on context
          profilePictureUrl: auth0Id ? userData.profile.profilePictureUrl : (user?.picture || userData?.profile.profilePictureUrl),
          dateOfBirth: userData.profile.dateOfBirth || "",
          gender: userData.profile.gender || "",
          marketingBudget: {
            adBudget: userData.profile.marketingBudget.adBudget || 0,
            costPerAcquisition: userData.profile.marketingBudget.costPerAcquisition || 0,
            dailySpendingLimit: userData.profile.marketingBudget.dailySpendingLimit || 0,
            marketingChannels: userData.profile.marketingBudget.marketingChannels || "",
            monthlyBudget: userData.profile.marketingBudget.monthlyBudget || 0,
            preferredPlatforms: userData.profile.marketingBudget.preferredPlatforms  || "",
            notificationPreferences: userData.profile.marketingBudget.notificationPreferences  || "",
            roiTarget: userData.profile.marketingBudget.roiTarget || 0,
            frequency: userData.profile.marketingBudget.frequency|| 0,
            // "daily" | "monthly" | "quarterly" | "yearly";
          },
        },
       
         address: {
          street: userData.address.street || "",
          city: userData.address.city || "",
          state: userData.address.state || "",
          zipCode: userData.address.zipCode || "",
          country: userData.address.country || ""
        },
        isActive: userData.isActive,
      };      
      
      await saveUserData(userData.auth0Id, transformedData);
      setSaveStatus({ message: "Changes Saved Successfully", isError: false });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving user data:", error);
      setSaveStatus({
        message: "Something went wrong, please try again",
        isError: true,
      });
    }
  };

  // Add loading state handling
  if (isLoading || auth0Loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb 
        pageTitle="Profile" 
        // onNavigate={onNavigate}
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/50 lg:p-6">
        <div className="flex flex-col gap-5">
          {/* Replace the existing unsaved changes UI with UnsavedChangesNotification */}
          <div className={`${hasUnsavedChanges ? 'block' : 'hidden'}`}>
            <UnsavedChangesNotification
              onSave={handleSaveChanges}
              onDiscard={handleDiscardChanges}
            />
          </div>

          {/* Save Status Message Container with fixed height */}
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

          <UserMetaCard
            onUpdate={(newInfo: Partial<UserMetadata>) => {
              handleUpdate({
                firstName: newInfo.firstName || userData.firstName || user?.name,
                lastName: newInfo.lastName || userData.lastName,
                profile: {
                  dateOfBirth: userData.profile.dateOfBirth || '',
                  gender: userData.profile.gender || '',
                  profilePictureUrl: userData.profile.profilePictureUrl || (user?.picture || userData?.profile.profilePictureUrl),
                  marketingBudget: {
                    adBudget: 0 ,
                    costPerAcquisition: 0,
                    dailySpendingLimit: 0,
                    marketingChannels: "",
                    monthlyBudget: 0,
                    preferredPlatforms: "",
                    notificationPreferences: [],
                    roiTarget: 0,
                    frequency: "daily"
                  }
                },
              });
            }}
            initialData={{
              email: userData?.email || "",
              firstName: userData?.firstName || "",
              lastName: userData?.lastName || "",
              name: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim(),
              profilePictureUrl: auth0Id ? (userData?.profile?.profilePictureUrl || "") : (user?.picture || userData?.profile?.profilePictureUrl || "")
            }}
          />

          <UserAddressCard
            onUpdate={(data: unknown) => handleUpdate(data as Partial<UserMetadata>)}
            initialData={{
              address: userData?.address || {},
            }}
          />

          <UserMarketingCard
            onUpdate={handleUpdate}
            initialData={{
              marketingBudget: {
                frequency: userData.profile.marketingBudget?.frequency || 'monthly',                  
                adBudget: userData.profile.marketingBudget?.adBudget || 0,
                costPerAcquisition: userData.profile.marketingBudget?.costPerAcquisition || 0,
                dailySpendingLimit: userData.profile.marketingBudget?.dailySpendingLimit || 0,
                marketingChannels: userData.profile.marketingBudget?.marketingChannels || '',
                monthlyBudget: userData.profile.marketingBudget?.monthlyBudget || 0,
                preferredPlatforms: userData.profile.marketingBudget?.preferredPlatforms || '',
                notificationPreferences: Array.isArray(userData.profile.marketingBudget?.notificationPreferences) 
                  ? userData.profile.marketingBudget.notificationPreferences 
                  : [],
                roiTarget: userData.profile.marketingBudget?.roiTarget || 0
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(UserProfile);

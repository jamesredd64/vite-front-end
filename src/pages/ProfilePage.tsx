
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
  name: string;
  lastName: string;
  phoneNumber: string;
  profile: {    
    // gender?: string;
    profilePictureUrl?: string;
  },
  marketingBudget: {
    adBudget: number;
    costPerAcquisition: number;
    dailySpendingLimit: number;
    marketingChannels: string;
    monthlyBudget: number;
    preferredPlatforms: string;
    notificationPreferences: [];
    roiTarget: number;
    frequency: 'daily' | 'monthly' | 'quarterly' | 'yearly';
    
  },  
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

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { getUserById, saveUserData } = useMongoDbClient();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleNavigation } = useNavigation();
  
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
    name: "",
    phoneNumber: "",
    profile: {      
      // gender: "",
      profilePictureUrl: "",
    },
    marketingBudget: {
      ...defaultMarketingBudget,
      adBudget: 0,
      costPerAcquisition: 0,
      dailySpendingLimit: 0,
      marketingChannels: '',
      monthlyBudget: 0,
      preferredPlatforms: '',
      notificationPreferences: [],
      roiTarget: 0,
      frequency: 'monthly' as const,
      
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
      if (isAuthenticated && user?.sub) {
        try {
          const fetchedUserData = await getUserById(user.sub);
          setUserData({
            ...fetchedUserData,
            marketingBudget: {
              ...defaultMarketingBudget,
              ...fetchedUserData?.marketingBudget,
            },
          });
          
          setInitialUserData(fetchedUserData);
          console.log('Initial user data loaded:', fetchedUserData);
          console.log('Auth0 user data loaded:', user.name);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserData(prevState => ({
            ...prevState,
            auth0Id: user?.sub || '',
            email: user?.email || '',
            firstName: user?.given_name || '',
            name: user?.name || '',
            lastName: user?.family_name || '',
            phoneNumber: '',
            profile: {
              profilePictureUrl: user?.picture || '',
            },
            marketingBudget: {
              adBudget: 0,
              costPerAcquisition: 0,
              dailySpendingLimit: 0,
              marketingChannels: '',
              monthlyBudget: 0,
              preferredPlatforms: '',
              notificationPreferences: [],
              roiTarget: 0,
              frequency: 'monthly' as const,
              
            },
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            },
            isActive: true
          }));
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, getUserById]);

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
        // auth0Id: userData.auth0Id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        profile: {          
          // gender: userData.profile.gender,
          profilePictureUrl:  user?.picture || userData?.profile.profilePictureUrl,    
        },
        marketingBudget: {
          adBudget: userData.marketingBudget.adBudget || 0,
          costPerAcquisition: userData.marketingBudget.costPerAcquisition || 0,
          dailySpendingLimit: userData.marketingBudget.dailySpendingLimit || 0,
          marketingChannels: userData.marketingBudget.marketingChannels || "",
          monthlyBudget: userData.marketingBudget.monthlyBudget || 0,
          preferredPlatforms: userData.marketingBudget.preferredPlatforms  || "",
          notificationPreferences: userData.marketingBudget.notificationPreferences  || "",
          roiTarget: userData.marketingBudget.roiTarget || 0,
          frequency: userData.marketingBudget.frequency|| 0,
          // "daily" | "monthly" | "quarterly" | "yearly";
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
        onNavigate={onNavigate}
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
                  profilePictureUrl: user?.picture || userData?.profile.profilePictureUrl,
                },
              });
            }}
            initialData={{
              email: userData?.email || "",
              firstName: userData?.firstName || "",
              lastName: userData?.lastName || "",
              name: userData?.name || "",
              profilePictureUrl: user?.picture || userData?.profile.profilePictureUrl || ""
            }}
          />

          <UserAddressCard
            onUpdate={(updates: unknown) => handleUpdate(updates as Partial<UserMetadata>)}
            initialData={{
              address: userData?.address || {},
            }}
          />

          <UserMarketingCard
            onUpdate={handleUpdate}
            initialData={{
              marketingBudget: {
                frequency: userData.marketingBudget?.frequency || 'monthly',                  
                adBudget: userData.marketingBudget?.adBudget || 0,
                costPerAcquisition: userData.marketingBudget?.costPerAcquisition || 0,
                dailySpendingLimit: userData.marketingBudget?.dailySpendingLimit || 0,
                marketingChannels: userData.marketingBudget?.marketingChannels || '',
                monthlyBudget: userData.marketingBudget?.monthlyBudget || 0,
                preferredPlatforms: userData.marketingBudget?.preferredPlatforms || '',
                notificationPreferences: Array.isArray(userData.marketingBudget?.notificationPreferences) 
                  ? userData.marketingBudget.notificationPreferences 
                  : [],
                roiTarget: userData.marketingBudget?.roiTarget || 0
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(UserProfile);

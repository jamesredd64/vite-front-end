import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
// import { UserInfoCard } from "../components/UserProfile/UserInfoCard";
import { UserMetaCard } from "../components/UserProfile/UserMetaCard";
import { UserAddressCard } from "../components/UserProfile/UserAddressCard";
import { UserMarketingCard } from "../components/UserProfile/UserMarketingCard";
import  UserMetadata  from "../types/user";
import { useMongoDbClient } from "../services/mongoDbClient";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
// import { useGlobalStorage } from '../hooks/useGlobalStorage';

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
  const { user, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { getUserById, saveUserData } = useMongoDbClient();
  
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
  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialUserData, setInitialUserData] = useState<UserData | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Add this useEffect to track changes
  useEffect(() => {
    if (isInitialLoad) {
      console.log('Skipping change detection during initial load');
      return;
    }

    const hasChanges = JSON.stringify(initialUserData) !== JSON.stringify(userData);
    console.log('Checking for changes:', {
      isInitialLoad,
      initialData: initialUserData,
      currentData: userData,
      hasChanges
    });
    setHasUnsavedChanges(hasChanges);
  }, [userData, initialUserData, isInitialLoad]);

  // Clear save status after 15 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (saveStatus) {
      timeoutId = setTimeout(() => {
        setSaveStatus(null);
      }, 15000); // 15 seconds
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
        auth0Id: userData.auth0Id,
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
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/50 lg:p-6">
        <div className="flex flex-col gap-5">
          {/* Centered Save All button with logging */}
          <div 
            className={`${hasUnsavedChanges ? 'flex' : 'hidden'} justify-center`}
            onClick={() => console.log('Save button container clicked, hasUnsavedChanges:', hasUnsavedChanges)}
          >
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              disabled={!hasUnsavedChanges}
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
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
              Save All Changes
            </button>
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
            onUpdate={handleUpdate}
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

export default UserProfile;




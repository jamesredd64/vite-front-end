
import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
// import { useNavigate } from "react-router-dom";
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
// import deepEqual from 'fast-deep-equal';
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
    dateOfBirth: string | null;
    gender: string;
    profilePictureUrl: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
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
  // const navigate = useNavigate();
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

  // Define default marketing budget matching schema defaults
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

  // Define default address
  const defaultAddress = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };

  // Initialize state with schema-matching defaults
  const [userData, setUserData] = useState<UserData>({
    auth0Id: "",
    email: "",
    firstName: "",
    lastName: "",    
    phoneNumber: "",
    profile: {
      dateOfBirth: null,
      gender: "",
      profilePictureUrl: "",          
    },    
    address: {
      ...defaultAddress
    },
    marketingBudget: {
      ...defaultMarketingBudget
    },
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(true);

  
    
  
  // Navigation handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const onNavigate = async (path: string) => {
  //   if (hasUnsavedChanges) {
  //     // Let the user continue navigation, the notification will handle saving
  //     navigate(path);
  //   } else {
  //     navigate(path);
  //   }
  // };

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

    const hasChanges = JSON.stringify(initialUserData) !== JSON.stringify(userData);
    console.log('Checking for changes:', {
      isInitialLoad,
      initialData: initialUserData,
      currentData: userData,
      hasChanges
    });
    setHasUnsavedChanges(hasChanges);
  }, [userData, initialUserData, isInitialLoad]);


  //   const hasChanges = !deepEqual(initialUserData, userData);
  //   logger('Change detection:', { hasChanges, userData, initialUserData });
  //   setHasUnsavedChanges(hasChanges);
  // }, [userData, initialUserData, isInitialLoad]);

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
      const userIdToFetch = auth0Id || (isAuthenticated && user?.sub);

      if (userIdToFetch) {
        try {
          const fetchedUserData = await getUserById(userIdToFetch);
          // Restructure the data to ensure marketingBudget is only under profile
          const restructuredData: UserData = {
            auth0Id: fetchedUserData.auth0Id,
            email: fetchedUserData.email,
            firstName: fetchedUserData.firstName,
            lastName: fetchedUserData.lastName,
            phoneNumber: fetchedUserData.phoneNumber,            
            isActive: fetchedUserData.isActive,
            profile: {
              dateOfBirth: fetchedUserData.profile?.dateOfBirth || '',
              gender: fetchedUserData.profile?.gender || '',
              profilePictureUrl: fetchedUserData.profile?.profilePictureUrl || '',
            },
            marketingBudget: {
              ...defaultMarketingBudget
            },
            address: {
              ...defaultAddress
            }
          };
          
          setUserData(restructuredData);
          setInitialUserData(restructuredData);
          console.log('Initial user data loaded:', restructuredData);
        } catch (error) {
          console.error('Error fetching user data:', error);
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
  }, [isAuthenticated, user, getUserById, auth0Id]);

  const handleUpdate = (updates: Partial<UserMetadata>) => {
    console.log('handleUpdate called with:', updates);
    setUserData((prevData: UserData) => {
      // Create a new data object with correct nested structure
      const newData: UserData = {
        ...prevData,
        auth0Id: prevData.auth0Id,
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
        },
        marketingBudget: {
          ...prevData.marketingBudget,
          ...(updates.marketingBudget || {})
        },
        isActive: prevData.isActive
      };
      
      console.log('Previous data:', prevData);
      console.log('New data:', newData);
      return newData;
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      console.group('ProfilePage - handleSubmit');
      console.log('Current userData state:', userData);
      console.log('Current marketingBudget:', userData.marketingBudget);
      
      const transformedData: Partial<UserMetadata> = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        profile: {
          profilePictureUrl: auth0Id ? userData.profile.profilePictureUrl : (user?.picture || userData?.profile.profilePictureUrl),
          dateOfBirth: userData.profile.dateOfBirth || "",
          gender: userData.profile.gender || "",          
        },
        marketingBudget: {
          ...userData.marketingBudget
        }
      };
      
      console.log('Transformed data being sent to updateUser:', transformedData);
      console.log('Marketing budget being sent:', transformedData.marketingBudget);
      console.groupEnd();

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
                  ...userData.profile,
                  dateOfBirth: newInfo.profile?.dateOfBirth || userData.profile.dateOfBirth || '',
                  gender: newInfo.profile?.gender || userData.profile.gender || '',
                  profilePictureUrl: newInfo.profile?.profilePictureUrl || userData.profile.profilePictureUrl || (user?.picture || ''),
                  
                },
                marketingBudget: {
                  ...userData.marketingBudget,
                  ...defaultMarketingBudget,
                  ...(newInfo.marketingBudget || {})
                }
              });
            }}
            initialData={{
              email: userData?.email || "",
              firstName: userData?.firstName || "",
              lastName: userData?.lastName || "",              
              profile: {
                dateOfBirth: userData?.profile?.dateOfBirth || "",
                gender: userData?.profile?.gender || "",
                profilePictureUrl: auth0Id ? (userData?.profile?.profilePictureUrl || "") : (user?.picture || userData?.profile?.profilePictureUrl || "")
              },              
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
              }
            }
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(UserProfile);

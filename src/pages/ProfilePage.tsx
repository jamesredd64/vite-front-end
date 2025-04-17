
import React, { useState, useEffect, useCallback } from "react";
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
console.log('ProfilePage.tsx is being executed at high level');
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
    role: string;
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ViewMode = 'table' | 'card' | 'profile';


interface ProfilePageProps {
  userId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserProfile: React.FC<ProfilePageProps> = ({ userId }) => {
  const { user, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { getUserById, saveUserData } = useMongoDbClient();
  const auth0Id = userId || user?.sub;
  
  // const { handleNavigation } = useNavigation();
  
  // const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [initialUserData, setInitialUserData] = useState<UserData | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Define default values outside of the component or use useMemo
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
  console.log('UserProfile is being executed from inside');
  const defaultAddress = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };

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
      role: ""
    },    
    address: { ...defaultAddress },
    marketingBudget: { ...defaultMarketingBudget },
    isActive: true
  });

  // Single source of truth for change detection
  const detectChanges = useCallback(() => {
    if (!initialUserData || !userData) return false;

    const sanitizeData = (data: UserData) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = data;
      return rest;
    };

    const initial = sanitizeData(initialUserData);
    const current = sanitizeData(userData);

    return JSON.stringify(initial) !== JSON.stringify(current);
  }, [initialUserData, userData]);

  // Single effect for change detection
  useEffect(() => {
    if (isInitialLoad) return;

    const hasChanges = detectChanges();
    if (hasChanges !== hasUnsavedChanges) {
      setHasUnsavedChanges(hasChanges);
    }
  }, [userData, isInitialLoad, detectChanges, hasUnsavedChanges]);

  // Effect for initial data fetch
  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      if (!isAuthenticated || auth0Loading || (!auth0Id && !user?.sub)) {
        setIsLoading(false);
        setIsInitialLoad(false);
        return;
      }

      const userIdToFetch = auth0Id || user?.sub;
      
      try {
        const fetchedUserData = await getUserById(userIdToFetch!);
        if (!isMounted) return;
        
        if (!fetchedUserData) {
          const defaultUserData: UserData = {
            auth0Id: userIdToFetch!,
            email: user?.email || '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            profile: {
              dateOfBirth: null,
              gender: '',
              profilePictureUrl: user?.picture || '',
              role: 'user'
            },
            address: { ...defaultAddress },
            marketingBudget: { ...defaultMarketingBudget },
            isActive: true
          };
          setUserData(defaultUserData);
          setInitialUserData(defaultUserData);
        } else {
          const restructuredData: UserData = {
            auth0Id: fetchedUserData.auth0Id,
            email: fetchedUserData.email || '',
            firstName: fetchedUserData.firstName || '',
            lastName: fetchedUserData.lastName || '',
            phoneNumber: fetchedUserData.phoneNumber || '',
            profile: {
              dateOfBirth: fetchedUserData.profile?.dateOfBirth || null,
              gender: fetchedUserData.profile?.gender || '',
              profilePictureUrl: fetchedUserData.profile?.profilePictureUrl || user?.picture || '',
              role: fetchedUserData.profile?.role || 'user'
            },
            address: {
              ...defaultAddress,
              ...fetchedUserData.address
            },
            marketingBudget: {
              ...defaultMarketingBudget,
              ...fetchedUserData.marketingBudget
            },
            isActive: fetchedUserData.isActive ?? true
          };
          setUserData(restructuredData);
          setInitialUserData(restructuredData);
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Error fetching user data:', error);
        setSaveStatus({
          message: error instanceof Error ? error.message : 'Failed to fetch user data',
          isError: true
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, auth0Loading, user?.sub, auth0Id]);

  // Effect for save status cleanup
  useEffect(() => {
    if (!saveStatus) return;
    const timeoutId = setTimeout(() => setSaveStatus(null), 5000);
    return () => clearTimeout(timeoutId);
  }, [saveStatus]);

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
    if (isInitialLoad || !initialUserData || !userData) {
      return;
    }

    // Create shallow copies of the objects, excluding dynamic properties
    const compareInitial = {
      ...initialUserData,
      createdAt: undefined,
      updatedAt: undefined
    };
    
    const compareCurrent = {
      ...userData,
      createdAt: undefined,
      updatedAt: undefined
    };

    // Use stable stringification for comparison
    const initialStr = JSON.stringify(compareInitial, Object.keys(compareInitial).sort());
    const currentStr = JSON.stringify(compareCurrent, Object.keys(compareCurrent).sort());
    
    if (initialStr !== currentStr && !hasUnsavedChanges) {
      setHasUnsavedChanges(true);
    } else if (initialStr === currentStr && hasUnsavedChanges) {
      setHasUnsavedChanges(false);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Removed duplicate useEffect for fetching data

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
          dateOfBirth: updates.profile?.dateOfBirth ?? prevData.profile.dateOfBirth,
          gender: updates.profile?.gender ?? prevData.profile.gender,
          profilePictureUrl: updates.profile?.profilePictureUrl ?? prevData.profile.profilePictureUrl,
          role: updates.profile?.role ?? prevData.profile.role
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
    
    setHasUnsavedChanges(true);
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
          profilePictureUrl: auth0Id ? userData.profile.profilePictureUrl : (user?.picture || userData.profile.profilePictureUrl),
          dateOfBirth: userData.profile.dateOfBirth || '',
          gender: userData.profile.gender,
          role: (userData.profile.role as 'user' | 'admin' | 'manager') || 'user'
        },
        address: userData.address,
        marketingBudget: userData.marketingBudget,
        isActive: userData.isActive
      };
      
      console.log('Transformed data being sent to saveUserData:', transformedData);
      console.log('Marketing budget being sent:', transformedData.marketingBudget);
      console.groupEnd();

      await saveUserData(userData.auth0Id, transformedData);
      setSaveStatus({ message: "Changes Saved Successfully", isError: false });
      setHasUnsavedChanges(false);
      setInitialUserData(userData); // Update initial data after successful save
    } catch (error) {
      console.error("Error saving user data:", error);
      setSaveStatus({
        message: error instanceof Error ? error.message : "Something went wrong, please try again",
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
                email: newInfo?.email || "",
                firstName: newInfo.firstName || userData.firstName || user?.name,
                lastName: newInfo.lastName || userData.lastName,
                phoneNumber: newInfo?.lastName || "",   
                profile: {
                  ...userData.profile,
                  dateOfBirth: newInfo.profile?.dateOfBirth || userData.profile.dateOfBirth || '',
                  gender: newInfo.profile?.gender || userData.profile.gender || '',
                  profilePictureUrl: newInfo.profile?.profilePictureUrl || userData.profile.profilePictureUrl || (user?.picture || ''),
                  // Explicitly handle role updates
                  role: (newInfo.profile?.role as 'user' | 'admin' | 'manager') || userData.profile.role || 'user'
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
              phoneNumber: userData?.lastName || "",   
              profile: {
                dateOfBirth: userData?.profile?.dateOfBirth || "",
                gender: userData?.profile?.gender || "",
                profilePictureUrl: auth0Id ? (userData?.profile?.profilePictureUrl || "") : (user?.picture || userData?.profile?.profilePictureUrl || ""),
                role: (userData?.profile?.role as 'user' | 'admin' | 'manager' | 'super-admin') || 'user'
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

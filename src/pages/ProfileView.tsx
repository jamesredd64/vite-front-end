import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { UserMetaCard } from "../components/UserProfile/UserMetaCard";
import { UserAddressCard } from "../components/UserProfile/UserAddressCard";
import { UserMarketingCard } from "../components/UserProfile/UserMarketingCard";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Loader from "../components/common/Loader";
import { useMongoDbClient } from "../services/mongoDbClient";
import UserMetadata from "../types/user";

interface ProfileViewProps {
  userId?: string;
  onClose?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userId, onClose }) => {
  const { user, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { getUserById, saveUserData } = useMongoDbClient();
  const auth0Id = userId || user?.sub;
  
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserMetadata | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ message: string; isError: boolean } | null>(null);

  // Define default values
  const defaultMarketingBudget = useMemo(() => ({
    adBudget: 0,
    costPerAcquisition: 0,
    dailySpendingLimit: 0,
    marketingChannels: '',
    monthlyBudget: 0,
    preferredPlatforms: '',
    notificationPreferences: [] as string[],
    roiTarget: 0,
    frequency: 'monthly' as const
  }), []);

  const defaultAddress = useMemo(() => ({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  }), []);

  // Effect for initial data fetch with optimized loading state
  useEffect(() => {
    let isMounted = true;

    /**
     * Fetches user data from the database and updates the component state.
     * 
     * This function is responsible for retrieving user data based on the user's authentication status
     * and updating the component's state with the fetched data. It handles loading states and error
     * reporting as well.
     * 
     * @returns {Promise<void>} A promise that resolves when the user data has been fetched and the state updated.
     */
    const fetchUserData = async () => {
      if (!isAuthenticated || auth0Loading || !auth0Id) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const fetchedUserData = await getUserById(auth0Id);
        if (!isMounted) return;

        if (fetchedUserData) {
          const restructuredData: UserMetadata = {
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
        }
      } catch (error) {
        if (!isMounted) return;
        console.error("Error fetching user data:", error);
        setSaveStatus({
          message: "Failed to load user data",
          isError: true
        });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, auth0Loading, auth0Id, getUserById, user?.picture, defaultAddress, defaultMarketingBudget]);

  // Optimized update handlers with better error handling
  /**
   * Updates the user's metadata information and saves it to the database.
   *
   * @param updates - Partial object containing the user's metadata fields to be updated.
   *                  This can include email, firstName, lastName, phoneNumber, and profile.
   * @returns A promise that resolves when the user's metadata has been successfully updated
   *          and saved, or rejects if an error occurs during the process.
   */
  const handleMetaUpdate = async (updates: Partial<UserMetadata>) => {
    if (!userData?.auth0Id) return;

    try {
      const metaUpdates = {
        email: updates.email,
        firstName: updates.firstName,
        lastName: updates.lastName,
        phoneNumber: updates.phoneNumber,
        profile: updates.profile
      };

      await saveUserData(userData.auth0Id, metaUpdates, 'meta');
      setUserData(prev => prev ? {
        ...prev,
        email: metaUpdates.email ?? prev.email,
        firstName: metaUpdates.firstName ?? prev.firstName,
        lastName: metaUpdates.lastName ?? prev.lastName,
        phoneNumber: metaUpdates.phoneNumber ?? prev.phoneNumber,
        profile: metaUpdates.profile ? {
          ...prev.profile,
          ...metaUpdates.profile
        } : prev.profile
      } : null);
      setSaveStatus({ message: "Profile information saved", isError: false });
    } catch (error) {
      console.error("Error saving meta info:", error);
      setSaveStatus({ message: "Failed to save profile information", isError: true });
    }
  };

  // Optimized update handlers with better error handling
  /**
   * Updates the user's address information and saves it to the database.
   *
   * @param updates - A partial object containing the user's address fields to be updated.
   *                  This should include the address object with fields like street, city, state, etc.
   * @returns A promise that resolves when the user's address has been successfully updated
   *          and saved, or rejects if an error occurs during the process.
   */
  const handleAddressUpdate = async (updates: Partial<UserMetadata>) => {
    if (!userData?.auth0Id) return;

    try {
      await saveUserData(userData.auth0Id, { address: updates.address }, 'address');
      setUserData(prev => prev ? {
        ...prev,
        address: { ...prev.address, ...(updates.address || {}) }
      } : null);
      setSaveStatus({ message: "Address saved", isError: false });
    } catch (error) {
      console.error("Error saving address:", error);
      setSaveStatus({ message: "Failed to save address", isError: true });
    }
  };

  // Optimized update handlers with better error handling
  /**
   * Updates the user's marketing preferences and saves them to the database.
   *
   * @param updates - A partial object containing the user's marketing budget fields to be updated.
   *                  This should include the marketingBudget object with fields like adBudget, costPerAcquisition, etc.
   * @returns A promise that resolves when the user's marketing preferences have been successfully updated
   *          and saved, or rejects if an error occurs during the process.
   */
  const handleMarketingUpdate = async (updates: Partial<UserMetadata>) => {
    if (!userData?.auth0Id) return;

    try {
      await saveUserData(userData.auth0Id, { marketingBudget: updates.marketingBudget }, 'marketing');
      setUserData(prev => prev ? {
        ...prev,
        marketingBudget: { ...prev.marketingBudget, ...updates.marketingBudget }
      } : null);
      setSaveStatus({ message: "Marketing preferences saved", isError: false });
    } catch (error) {
      console.error("Error saving marketing preferences:", error);
      setSaveStatus({ message: "Failed to save marketing preferences", isError: true });
    }
  };

  /**
   * Effect hook that manages the automatic clearing of the save status message after a delay.
   *
   * This hook sets a timeout to clear the save status message after 5 seconds, providing feedback
   * to the user about the success or failure of their actions. It ensures that the message is
   * automatically removed from the UI after a short period.
   *
   * @param saveStatus - The current status of the save operation, which includes a message and an error flag.
   *                     If this value is null, the effect does nothing.
   * @returns A cleanup function that clears the timeout when the component is unmounted or when the
   *          saveStatus changes, preventing memory leaks and ensuring the timeout is properly managed.
   */
  useEffect(() => {
    if (!saveStatus) return;
    const timeoutId = setTimeout(() => setSaveStatus(null), 5000);
    return () => clearTimeout(timeoutId);
  }, [saveStatus]);

  /**
   * Renders a loading spinner when the authentication or user data is still being loaded.
   *
   * @returns A JSX element that displays a large loader component, indicating that the
   *          application is in a loading state.
   */
  if (isLoading || auth0Loading) {
    return <Loader size="large" />;
  }

  /**
   * Renders a message indicating that no user data is available.
   *
   * This function returns a JSX element that displays a message to the user
   * when no user data is available. It suggests refreshing the page to attempt
   * to load the data again.
   *
   * @returns A JSX element containing a message about the absence of user data.
   */
  if (!userData) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <h2 className="text-xl font-semibold mb-2">No user data available</h2>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative font-normal font-sans z-[1] bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300">
      <div className="p-2 md:p-6 2xl:p-4">
        {onClose && (
          <button
            onClick={onClose}
            className="mb-4 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Back to List
          </button>
        )}
        <Suspense fallback={<Loader size="large" />}>
          {/* Main container with styling for light/dark themes */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/50 lg:p-6">
            {/* Meta information for SEO and page title */}
            <PageMeta title="Profile View" description="View and edit your profile" />
            <PageBreadcrumb pageTitle="Profile View" />

            {/* Container for profile sections with vertical spacing */}
            <div className="space-y-6">
              {/* Conditional render of status message for save operations */}
              {saveStatus && (
                <div 
                  className={`p-4 rounded ${
                    // Dynamic styling based on error state
                    saveStatus.isError 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                  }`}
                >
                  {saveStatus.message}
                </div>
              )}

              {/* User metadata section (basic info) */}
              <UserMetaCard
                onUpdate={handleMetaUpdate}
                initialData={{
                  email: userData.email,
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  phoneNumber: userData.phoneNumber,
                  profile: userData.profile
                }}
              />

              {/* User address section */}
              <UserAddressCard
                onUpdate={(data: unknown) => handleAddressUpdate(data as Partial<UserMetadata>)}
                initialData={{
                  address: userData.address
                }}
              />

              {/* User marketing preferences section */}
              <UserMarketingCard
                onUpdate={handleMarketingUpdate}
                initialData={{
                  marketingBudget: userData.marketingBudget
                }}
              />
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  );
};

export default ProfileView;












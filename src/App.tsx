/* eslint-disable react-refresh/only-export-components */

import { Routes, Route, useNavigate, Navigate, useParams } from "react-router-dom";
import { useAuth0} from '@auth0/auth0-react';
import { useGlobalStorage } from './hooks/useGlobalStorage';
import AppLayout from "./layout/AppLayout";
import { useEffect, useRef, useState, useCallback } from 'react';
import NotFound from "./pages/OtherPage/NotFound";
import UserProfile from "./pages/ProfilePage";
import UserProfileView from "./pages/UserProfileView";
import  Calendar from "./pages/Calendar";
import DashboardHome from "./pages/Dashboard/Home";
import React from "react";
import { SignedOut } from "./pages/SignedOut";
import Loader from './components/common/Loader';
import { useMongoDbClient } from './services/mongoDbClient';
import Marketing from "./pages/Dashboard/Marketing";
import MarketingOverview from "./pages/MarketingOverview";
import CreateNotification from "./pages/CreateNotification";
import CustomerDemographics from "./pages/Dashboard/CustomerDemographics";
import Changelog from "./pages/Changelog/index";
import UserManagement from "./pages/UserManagement";
import { initSessionTimeout } from './utils/sessionTimeout';
// import { forceLogout } from './utils/forceLogout';
// import { UnsavedChangesModal } from "./components/UnsavedChangesModal";

// import Mypage from "./pages/test";

// import Marketing2 from './pages/Dashboard/Main/Marketing';
// import Marketing from "./pages/Dashboard/Main/Marketing";
// import About from "./pages/Company/About";
// import Careers from "./pages/Company/Careers";
// import Contact from "./pages/Company/Contact";
// import Blog from "./pages/Resources/Blog";
// import Documentation from "./pages/Resources/Documentation";
// import Help from "./pages/Resources/Help";
// import Privacy from "./pages/Legal/Privacy";
// import Terms from "./pages/Legal/Terms";

interface UserMetadata {
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
      frequency: "daily" | "monthly" | "quarterly" | "yearly";
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
  createdAt: string | Date;
  updatedAt: string | Date;
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
}

interface NavigationContextType {
  handleNavigation: (path: string) => boolean;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

type NavigationState = {
  isModalOpen: boolean;
  pendingPath: string | null;
};

export const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined);

function App() {
  const { isLoading, isAuthenticated, getAccessTokenSilently, error: auth0Error, user } = useAuth0();
  const navigate = useNavigate();
  // const location = useLocation();
  const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { updateUser, getUserById } = useMongoDbClient();
  const initializationAttempted = useRef(false);
  const params = useParams<{ userId: string }>();
  const userId = params.userId;

  useEffect(() => {
    if (isAuthenticated) {
      const cleanup = initSessionTimeout({
        logout: async () => {
          try {
            // Get a fresh token before logout to ensure the request goes through
            await getAccessTokenSilently();
            
            // Cancel all pending requests
            window.stop();
            
            // Clear all storage except theme
            const savedTheme = localStorage.getItem('theme');
            localStorage.clear();
            sessionStorage.clear();
            if (savedTheme) {
              localStorage.setItem('theme', savedTheme);
            }

            // Navigate to signed-out page
            window.location.href = '/signed-out';
          } catch (error) {
            console.error('Timeout logout error:', error);
            // Force navigation to signed-out page if token refresh fails
            window.location.href = '/signed-out';
          }
        }
      });
      return cleanup;
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Clear all storage except theme
      const savedTheme = localStorage.getItem('theme');
      localStorage.clear();
      sessionStorage.clear();
      if (savedTheme) {
        localStorage.setItem('theme', savedTheme);
      }
      
      // Cancel any pending requests
      window.stop();
    }
  }, [isLoading, isAuthenticated]);
  
  // Add new effect to fetch MongoDB user data early
  useEffect(() => {
    const fetchMongoUserData = async () => {
      if (!isAuthenticated || !user?.sub) return;

      try {
        const normalizedAuthId = user.sub;
        const mongoUser = await getUserById(normalizedAuthId);
        
        // If no existing MongoDB user data, initialize with Auth0 data
        if (!mongoUser) {
          // Split name into first and last name if available
          const [firstName = '', lastName = ''] = (user.name || '').split(' ');
          
          const newUserData = {
            auth0Id: user.sub,
            email: user.email || '',
            firstName: firstName,
            lastName: lastName,
            profile: {
              dateOfBirth: '',
              gender: '',
              profilePictureUrl: user.picture || ''
            }
          };

          // Update MongoDB and local storage
          const createdUser = await updateUser(user.sub, {
            email: newUserData.email,
            firstName: newUserData.firstName,
            lastName: newUserData.lastName,
            profile: {
              dateOfBirth: '',
              gender: '',
              profilePictureUrl: newUserData.profile.profilePictureUrl,
              marketingBudget: {
                adBudget: 0,
                costPerAcquisition: 0,
                dailySpendingLimit: 0,
                marketingChannels: '',
                monthlyBudget: 0,
                preferredPlatforms: '',
                notificationPreferences: [],
                roiTarget: 0,
                frequency: 'monthly'
              }
            }
          });
          setUserMetadata(createdUser);
          return;
        }

        // Existing user logic
        if (mongoUser?.profile?.profilePictureUrl) {
          setUserMetadata(prevState => prevState ? {
            ...prevState,
            profile: {
              ...prevState.profile,
              profilePictureUrl: mongoUser.profile.profilePictureUrl
            }
          } : null);
        } else if (user.picture) {
          setUserMetadata(prevState => prevState ? {
            ...prevState,
            profile: {
              ...prevState.profile,
              profilePictureUrl: user.picture || ''
            }
          } : null);
        }
      } catch (error) {
        console.error('Error fetching MongoDB user data:', error);
        // Initialize with Auth0 data on error
        const [firstName = '', lastName = ''] = (user.name || '').split(' ');
        setUserMetadata({
          auth0Id: user.sub,
          email: user.email || '',
          firstName: firstName,
          lastName: lastName,
          profile: {
            dateOfBirth: '',
            gender: '',
            profilePictureUrl: user.picture || ''
          }
        } as UserMetadata);
      }
    };

    fetchMongoUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.sub, user?.picture, user?.email, user?.name, getUserById, updateUser]);

  // Update your existing profile picture effect to avoid conflicts
  useEffect(() => {
    if (user?.picture && userMetadata && !userMetadata.profile.profilePictureUrl) {
      console.log('Setting default Auth0 Profile Picture URL:', user.picture);
      setUserMetadata(prevState => prevState ? {
        ...prevState,
        profilePictureUrl: user.picture || '',
        firstName: prevState?.firstName || '',
        lastName:  prevState?.lastName || ''
      } : null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.picture]);

  // Add state for handling unsaved changes
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isModalOpen: false,
    pendingPath: null,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Add context or global state management for unsaved changes
  const handleNavigation = useCallback((path: string) => {
    if (hasUnsavedChanges) {
      setNavigationState({
        isModalOpen: true,
        pendingPath: path,
      });
      return false; // Prevent immediate navigation
    }
    return true; // Allow navigation
  }, [hasUnsavedChanges]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleConfirmNavigation = () => {
    if (navigationState.pendingPath) {
      setHasUnsavedChanges(false);
      navigate(navigationState.pendingPath);
      setNavigationState({
        isModalOpen: false,
        pendingPath: null,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCancelNavigation = () => {
    setNavigationState({
      isModalOpen: false,
      pendingPath: null,
    });
  };

  // Add this function to check if user is admin
  const isAdmin = () => {
    return user && user['https://your-namespace/roles']?.includes('admin');
  };

  // Handle authentication state changes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setUserMetadata(null);
      navigate('/signed-out');
    }
  }, [isLoading, isAuthenticated, navigate, setUserMetadata]);

  // Initialize user data
  useEffect(() => {
    const initializeUserData = async () => {
      if (!isAuthenticated || !user?.sub || initializationAttempted.current) {
        return;
      }

      initializationAttempted.current = true;

      try {
        const userId = user.sub;  // Use the original Auth0 ID directly
        const userData = await updateUser(userId, {
          email: user?.email || '',
          firstName: user?.name?.split(' ')[0] || '',
          lastName: user?.name?.split(' ')[1] || '',
          profile: {
            dateOfBirth: '',
            gender: '',
            profilePictureUrl: user?.picture || '',
            marketingBudget: {
              adBudget: 0,
              costPerAcquisition: 0,
              dailySpendingLimit: 0,
              marketingChannels: '',
              monthlyBudget: 0,
              preferredPlatforms: '',
              notificationPreferences: [],
              roiTarget: 0,
              frequency: 'monthly'
            }
          },
          // phoneNumber: '',
          // dateOfBirth: '',
          // gender: '',
          // 
          // adBudget: 0,
          // costPerAcquisition: 0,
          // dailySpendingLimit: 0,
          // marketingChannels: '',
          // monthlyBudget: 0,
          // preferredPlatforms: '',
          // notificationPreferences: [],
          // roiTarget: 0,
          // marketingBudget: {
          //   amount: 0,
          //   frequency: 'monthly',
          //   adCosts: 0
          // },
          // address: {
          //   street: '',
          //   city: '',
          //   state: '',
          //   zipCode: '',
          //   country: ''
          // },
          //auth0Id: user.sub
        });

        if (userData) {
          setUserMetadata(userData);
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };

    if (isAuthenticated && user?.sub) {
      initializeUserData();
    }
  }, [isAuthenticated, user?.sub]);

  if (isLoading) {
    return <Loader />;
  }

  if (auth0Error) {
    return <div className="text-center p-4">Authentication Error: {auth0Error.message}</div>;
  }

  return (
    <NavigationContext.Provider value={{ handleNavigation, hasUnsavedChanges, setHasUnsavedChanges }}>
      <div className="dark:bg-boxdark-2 dark:text-bodydark min-h-screen">
        <div className="flex h-screen overflow-hidden">
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Routes>        
              <Route path="/signed-out" element={<SignedOut />} />
              {isAuthenticated ? (
                <Route element={<AppLayout />}>
                  <Route index path="/" element={<Navigate to="/marketing-overview" replace />} />              
                  <Route path="/dashboard" element={<DashboardHome />} />
                  <Route path="/profile" element={<UserProfile/>} />                
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="notifications/create" element={<CreateNotification />} />
                  <Route path="/marketing-overview" element={<MarketingOverview />} />
                  <Route path="/customer-demographics" element={<CustomerDemographics />} />
                  <Route path="/changelog" element={<Changelog />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route 
                    path="/user-profile/:userId" 
                    element={
                      <UserProfileView 
                        userId={userId || ''}
                        onClose={() => navigate(-1)} 
                      />
                    } 
                  />
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={
                    isAdmin() ? (
                      <Routes>
                        {/* <Route path="notifications/create" element={<CreateNotification />} /> */}
                        {/* Add more admin routes here */}
                      </Routes>
                    ) : (
                      <Navigate to="/dashboard" replace />
                    )
                  } />

                  <Route path="*" element={<NotFound />} />
                </Route>
              ) : (
                <Route path="*" element={<Navigate to="/signed-out" replace />} />
              )}
            </Routes>
          </div>
        </div>
        {/* {navigationState.isModalOpen && (
          <UnsavedChangesModal
            onConfirm={handleConfirmNavigation}
            onCancel={handleCancelNavigation}
          />
        )} */}
      </div>
    </NavigationContext.Provider>
  );
}

export default App;


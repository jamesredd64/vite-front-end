/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { buildUserMetadata } from './utils/buildUserMetadata';
import { Routes, Route, Navigate, useNavigate, useParams, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useAdmin } from './hooks/useAdmin';
import { useGlobalStorage } from './hooks/useGlobalStorage';
import AppLayout from "./layout/AppLayout";
// import AdminLayout from "./layout/AdminLayout";
import CustomAppLayout from "./layout/CustomAppLayout";
import { useEffect, useRef, useState, useCallback } from 'react';
import NotFound from "./pages/OtherPage/NotFound";
// import UserProfileView from "./pages/UserProfileView";
import  Calendar from "./pages/CalendarPage";
import DashboardHome from "./pages/Dashboard/Home";
import React from "react";
import SignedOut from "./pages/SignedOut";
import Loader from './components/common/Loader';
import { useMongoDbClient } from './services/mongoDbClient';
import Marketing from "./pages/Dashboard/Marketing";
import MarketingOverview from "./pages/MarketingOverview";
import CreateNotification from "./pages/CreateNotification";
import CustomerDemographics from "./pages/Dashboard/CustomerDemographics";
import Changelog from "./pages/Changelog/index";
import UserManagement from "./pages/UserManagement";
import { initSessionTimeout } from './utils/sessionTimeout';
import { IdleTimeoutHandler } from "./components/IdleTimeoutHandler";
// import AdminSettingsTest from './components/AdminSettingsTest';
import EventInvitation from "./pages/EventInvitation";
import UserAdmin from './pages/admin/Users';
// Add this to your imports
import NewUserWelcome from './pages/NewUserWelcome';
import ProfileView from "./pages/ProfileView";
import RoleBasedRoute from "./routes/RoleBasedRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import Home from "./pages/Dashboard/Home";
import ScheduledEventsPage from "./pages/ScheduledEventsPage";
import SendEmailPage from "./pages/SendEmailPage";
import SettingsAdmin from "./pages/SettingsAdmin";
import AdminSettings from "./pages/AdminSettings";

// import { forceLogout } from './utils/forceLogout';
// import { UnsavedChangesModal } from "./components/UnsavedChangesModal";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import ProtectedAdminRoute from './components/ProtectedAdminRoute';
// import { AdminManagement } from './components/admin/AdminManagement';
// import { AdminCodeVerification } from "./components/admin/AdminCodeVerification";
// import { ProtectedRoute } from "./components/ProtectedRoute";
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

type UserRole = "showcase_attendee" | "showcase_agent" | "showcase_team" | "showcase_admin";

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
    role: UserRole;
    timezone: string;
  };
  // marketingBudget: {
  //   adBudget: number;
  //   costPerAcquisition: number;
  //   dailySpendingLimit: number;
  //   marketingChannels: string;
  //   monthlyBudget: number;
  //   preferredPlatforms: string;
  //   notificationPreferences: string[];
  //   roiTarget: number;
  //   frequency: "daily" | "monthly" | "quarterly" | "yearly";
  // };  
  // address: {
  //   street: string;
  //   city: string;
  //   state: string;
  //   zipCode: string;
  //   country: string;
  // };
   isActive: boolean;
  // createdAt: string | Date;
  // updatedAt: string | Date;  
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
  const { updateUser, getUserById, saveUserData } = useMongoDbClient();
  const initializationAttempted = useRef(false);
  const params = useParams<{ userId: string }>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userId = params.userId;

  // Cleanup
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
            // window.location.href = '/signed-out';
            navigate('/signed-out');
          } catch (error) {
            console.error('Timeout logout error:', error);
            // Force navigation to signed-out page if token refresh fails
            // window.location.href = '/signed-out';
            navigate('/signed-out');
          }
        }
      });
      return cleanup;
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  // Save Theme Mode
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
  
  // fetch MongoDB user data 
  useEffect(() => {
    const initializeUserMetadata = async () => {
      if (!isAuthenticated || !user?.sub) return;
         
          // In your initializeUserMetadata or similar:
          // const metadata = buildUserMetadata(user, {
          //   adBudget: 5000,
          //   roiTarget: 120,
          //   preferredCuisine: 'Thai',
          // });

          // Then insert into MongoDB or whatever backend logic you’ve got:
          // await createUserInMongo(metadata);
            
      try {
        const auth0Id = user.sub;
        let mongoUser = await getUserById(auth0Id);
  
        // If the user doesn't exist, create a new minimal user record
        if (!mongoUser) {
          console.log("User not found, inserting new user record...");
  
          const newUserMetadata: Partial<UserMetadata> = {
            auth0Id,
            email: user.email || "",
            firstName: user.given_name || user.name?.split(" ")[0] || "",
            lastName: user.family_name || user.name?.split(" ")[1] || "",
            phoneNumber: "",
            profile: {
              dateOfBirth: "",
              gender: "",
              profilePictureUrl: user.picture || "",
              role: user['https://dev-rq8rokyotwtjem12.jr.com/roles']?.[0] ,
              // || "showcase_attendee",
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,            
            },
            isActive: true,
          };

          // Set in local storage
          setUserMetadata(newUserMetadata as UserMetadata);
  
          // Save to MongoDB
          await saveUserData(auth0Id, newUserMetadata, "meta"); 
          
          return;
        }
  
        // If the user exists, update local storage without fetching again
        console.log("User found, updating user record...");
        const updatedMetadata: UserMetadata = {
          auth0Id,
          email: user.email || mongoUser.email,
          firstName: mongoUser.firstName,
          lastName: mongoUser.lastName,
          phoneNumber: mongoUser.phoneNumber,
          profile: {
            dateOfBirth: mongoUser.profile.dateOfBirth || "",
            gender: mongoUser.profile.gender || "",
            profilePictureUrl: user.picture || mongoUser.profile.profilePictureUrl,
            role: user['https://dev-rq8rokyotwtjem12.jr.com/roles']?.[0] || mongoUser.profile.role || "showcase_attendee",
            
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          isActive: mongoUser.isActive || true,
        };
  
        setUserMetadata(updatedMetadata);
      } catch (error) {
        console.error("Error initializing user metadata:", error);
      }
    };
    
    initializeUserMetadata();
  }, [isAuthenticated, user, getUserById]);
  

  // useEffect(() => {
  //   const fetchMongoUserData = async () => {
  //     if (!isAuthenticated || !user?.sub) return;

  //     try {
  //       const normalizedAuthId = user.sub;
  //       const mongoUser = await getUserById(normalizedAuthId);

  //       if (!mongoUser) {
  //         const firstName = user.given_name || user.name?.split(' ')[0] || '';
  //         const lastName = user.family_name || user.name?.split(' ')[1] || '';
          
  //         const newUserData = {
  //           auth0Id: user.sub,
  //           email: user.email || '',
  //           firstName: firstName,
  //           phoneNumber: user.phoneNumber || '',
  //           lastName: lastName,
  //           profile: {
  //             dateOfBirth: '',
  //             gender: '',
  //             profilePictureUrl: user.picture || '',
  //             role: 'user' as 'user' | 'admin' | 'manager' | 'super-admin',
  //             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  //           },
  //           marketingBudget: {
  //             adBudget: user.marketingBudget?.adBudget || 0,
  //             costPerAcquisition: user.marketingBudget?.costPerAcquisition || 0,
  //             dailySpendingLimit: user.marketingBudget?.dailySpendingLimit || 0,
  //             marketingChannels: user.marketingBudget?.marketingChannels || '',
  //             monthlyBudget: user.marketingBudget?.monthlyBudget || 0,
  //             preferredPlatforms: user.marketingBudget?.preferredPlatforms || '',
  //             notificationPreferences: user.marketingBudget?.notificationPreferences || [],
  //             roiTarget: user.marketingBudget?.roiTarget || 0,
  //             frequency: user.marketingBudget?.frequency || 'monthly'
  //           },
  //           isActive: user.isActive || true    
  //         };

  //         // Update MongoDB and local storage
  //         const createdUser = await updateUser(user.sub, {
  //           ...newUserData,
  //           profile: {
  //             ...newUserData.profile,
  //             role: 'user' as 'user' | 'admin' | 'manager' | 'super-admin'
  //           }
  //         });
  //         setUserMetadata(createdUser as UserMetadata);
  //         return;
  //       }

  //       // If user exists, update with any new Auth0 data while preserving existing data
  //       initializationAttempted.current = true;

  //       const updatedData = {
  //         email: user.email || mongoUser.email,
  //         firstName: mongoUser.firstName,
  //         lastName: mongoUser.lastName,
  //         phoneNumber: mongoUser.phoneNumber,
  //         profile: {
  //           dateOfBirth: mongoUser.profile.dateOfBirth || '',
  //           gender: mongoUser.profile.gender || '',
  //           profilePictureUrl: user.picture || mongoUser.profile.profilePictureUrl,
  //           role: mongoUser.profile.role || '',
  //           timezone: mongoUser.profile.role || "user",
  //         },
  //         marketingBudget: {
  //           adBudget: mongoUser.marketingBudget?.adBudget || 0,
  //           costPerAcquisition: mongoUser.marketingBudget?.costPerAcquisition || 0,
  //           dailySpendingLimit: mongoUser.marketingBudget?.dailySpendingLimit || 0,
  //           marketingChannels: mongoUser.marketingBudget?.marketingChannels || '',
  //           monthlyBudget: mongoUser.marketingBudget?.monthlyBudget || 0,
  //           preferredPlatforms: mongoUser.marketingBudget?.preferredPlatforms || '',
  //           notificationPreferences: mongoUser.marketingBudget?.notificationPreferences || [],
  //           roiTarget: mongoUser.marketingBudget?.roiTarget || 0,
  //           frequency: mongoUser.marketingBudget?.frequency || 'monthly'
  //         },
  //         isActive: mongoUser.isActive || true
  //       };

  //       const userData = await updateUser(user.sub, updatedData);
  //       if (userData) {
  //         setUserMetadata(userData as UserMetadata);
  //       }
  //     } catch (error) {
  //       console.error('Error updating user:', error);
  //     }
  //   };

  //   fetchMongoUserData();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated, user, getUserById, updateUser]);

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
    return userMetadata?.profile?.role === 'showcase_admin';
      // || userMetadata?.profile?.role === 'super-admin';
  };

  console.log("userMetadata?.profile?.role Is", userMetadata?.profile?.role);
  
  // Handle authentication state changes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setUserMetadata(null);
      navigate('/signed-out');
    }
  }, [isLoading, isAuthenticated, navigate, setUserMetadata]);

  // Initialize user data
  // useEffect(() => {
  //   const initializeUserData = async () => {
  //     if (!isAuthenticated || !user?.sub || initializationAttempted.current) {
  //       return;
  //     }

  //     initializationAttempted.current = true;

  //     try {
  //       const userId = user.sub;  // Use the original Auth0 ID directly
  //       const userData = await updateUser(userId, {
  //         email: user?.email || '',
  //         // firstName: user?.?,
  //         // lastName: user?.name?.split(' ')[1] || '',
  //         // phoneNumber: user.phone_number,                   
  //         profile: {
  //           dateOfBirth: '',
  //           gender: '',
  //           profilePictureUrl: user?.picture || '',
  //           role: "user",
  //           timezone: "",
            
  //         },
  //         marketingBudget: {
  //           adBudget: 0,
  //           costPerAcquisition: 0,
  //           dailySpendingLimit: 0,
  //           marketingChannels: '',
  //           monthlyBudget: 0,
  //           preferredPlatforms: '',
  //           notificationPreferences: [],
  //           roiTarget: 0,
  //           frequency: 'monthly'
            
  //         }
          
  //       });

  //       if (userData) {
  //         setUserMetadata(userData as UserMetadata);
  //       }
  //     } catch (error) {
  //       console.error('Error updating user:', error);
  //     }
  //   };

  //   if (isAuthenticated && user?.sub) {
  //     initializeUserData();
  //   }
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isAuthenticated, user?.sub]);

  if (isLoading) {
    // return (<span style={{ color: '#60a5fa', fontSize: '16px', marginTop: '10px' }}>
    //     Loading...
    //   </span>
    // )
    return <Loader size="medium" />;
  }

  if (auth0Error) {
    return <div className="text-center p-4">Authentication Error: {auth0Error.message}</div>;
  }

  return (
    <NavigationContext.Provider value={{ handleNavigation, hasUnsavedChanges, setHasUnsavedChanges }}>
      <IdleTimeoutHandler />
      <div className="dark:bg-boxdark-2 dark:text-bodydark min-h-screen">
        <div className="flex h-screen overflow-hidden">
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Routes>
                <Route path="/signed-out" element={<SignedOut />} />
                {/* <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* Handle Role-Based Navigation */}
                <Route path="/" element={<RoleBasedRoute />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  {/* Admin Routes */}
                  <Route path="/admin/*" element={<CustomAppLayout />}>
                    <Route index element={<Navigate to="adm-dashboard" replace />} />
                    <Route path="adm-dashboard" element={<AdminDashboard />} />
                    <Route path="dashboard" element={<Home />} />
                    <Route path="invite" element={<EventInvitation />} />
                    <Route path="userman" element={<UserManagement />} />
                    <Route path="profile" element={<ProfileView />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="marketing" element={<Marketing />} />
                    <Route path="notif" element={<CreateNotification />} />
                    <Route path="marketing-overview" element={<MarketingOverview />} />
                    <Route path="customer-demographics" element={<CustomerDemographics />} />
                    <Route path="changelog" element={<Changelog />} />
                    <Route path="welcome" element={<NewUserWelcome />} />                    
                    <Route path="sch-events" element={<ScheduledEventsPage />} />
                    <Route path="send-email" element={<SendEmailPage />} />
                  <Route path="settings-admin" element={<SettingsAdmin />} />  
                  {/* <Route path="admin-settings" element={<AdminSettings />} />   */}
                  
                  </Route>

                  {/* User Routes */}
                  <Route path="/attendee/*" element={<AppLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<NewUserWelcome />} />
                    <Route path="profile" element={<ProfileView />} />
                    
                  </Route>                  
                </Route>

                {/* Catch All Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>

          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}

export default App;






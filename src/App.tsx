/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { IdleTimeoutHandler }  from './components/IdleTimeoutHandler';
import { Routes, Route, Navigate, useNavigate, useParams, Outlet } from "react-router-dom";
import { BrowserRouter as Router  } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useAdmin } from './hooks/useAdmin';
import { useGlobalStorage } from './hooks/useGlobalStorage';
import AppLayout from "./layout/AppLayout";
import AdminLayout from "./layout/AdminLayout";
import { useEffect, useRef, useState, useCallback } from 'react';
import NotFound from "./pages/OtherPage/NotFound";
import  Calendar from "./pages/Calendar";
import DashboardHome from "./pages/Dashboard/Home";
import React from "react";
import SignedOut from "./pages/SignedOut";
import Loader from './components/common/Loader';
import { useMongoDbClient } from './services/mongoDbClient';
// const { getUsersRole } = useMongoDbClient();
// import { getUsersRole } from './services/mongoDbClient';
const { getUsersRole, getUserById } = useMongoDbClient();

import Marketing from "./pages/Dashboard/Marketing";
import MarketingOverview from "./pages/MarketingOverview";
import CreateNotification from "./pages/CreateNotification";
import CustomerDemographics from "./pages/Dashboard/CustomerDemographics";
import Changelog from "./pages/Changelog/index";
import UserManagement from "./pages/UserManagement";
import EventInvitation from "./pages/EventInvitation";
import UserAdmin from './pages/admin/Users';
// Add this to your imports
import NewUserWelcome from './pages/NewUserWelcome';
import ProfilePage from "./pages/ProfilePage";
import AdminSidebar from "./layout/AdminSidebar";
import AppSidebar from "./layout/AppSidebar";
import  ProtectedRoute  from './components/ProtectedRoute';
import AuthProvider from "./auth/AuthProvider";
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import Unauthorized from './pages/Unauthorized';
import { setLoading } from "./store/slices/userProfileSlice";
import { UserRoleStorage } from "./utils/userStorage";

// import UserManagement from "./pages/UserManagement";
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

type UserRole = "user" | "admin" | "manager" | "super-admin";

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
    timezone: "";
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
  createdAt: string | Date;
  updatedAt: string | Date;  
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
  // const { isLoading, isAuthenticated, error: auth0Error, user } = useAuth0();
  // const navigate = useNavigate();
  // const location = useLocation();

  const { isLoading, isAuthenticated, getAccessTokenSilently, error: auth0Error, user } = useAuth0();
  const [loading, setLoadingState] = useState(true);
  const [userRole, setUserRole] = useState(''); // Move this to the top level
  const navigate = useNavigate();
  // let userRole =  ''; // Track user role
  // const location = useLocation();
  const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { updateUser, getUserById } = useMongoDbClient();
  const initializationAttempted = useRef(false);
  const params = useParams<{ userId: string }>();
  
  const userId = params.userId;

  interface UserRoleMap {
    [email: string]: string;
  }
 
  useEffect(() => {
    console.log("Auth0 Authentication State:");
    console.log("Is Loading:", isLoading);
    console.log("Is Authenticated:", isAuthenticated);
    console.log("User Info:", user);
  }, [isLoading, isAuthenticated, user]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     const cleanup = initSessionTimeout({
  //       logout: async () => {
  //         try {
  //           // Get a fresh token before logout to ensure the request goes through
  //           await getAccessTokenSilently();
            
  //           // Cancel all pending requests
  //           window.stop();
            
  //           // Clear all storage except theme
  //           const savedTheme = localStorage.getItem('theme');
  //           localStorage.clear();
  //           sessionStorage.clear();
  //           if (savedTheme) {
  //             localStorage.setItem('theme', savedTheme);
  //           }

  //           // Navigate to signed-out page
  //           window.location.href = '/signed-out';
  //         } catch (error) {
  //           console.error('Timeout logout error:', error);
  //           // Force navigation to signed-out page if token refresh fails
  //           window.location.href = '/signed-out';
  //         }
  //       }
  //     });
  //     return cleanup;
  //   }
  // }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Clear all storage except theme
      const savedTheme = localStorage.getItem('theme');
      // localStorage.clear();
      // sessionStorage.clear();
      if (savedTheme) {
        localStorage.setItem('theme', savedTheme);
      }
      
      // Cancel any pending requests
      window.stop();
    }
  }, [isLoading, isAuthenticated]);
  
  // Update your existing profile picture effect to avoid conflicts
  useEffect(() => {
    if (user?.picture && userMetadata && !userMetadata.profile.profilePictureUrl) {
      console.log('Setting default Auth0 Profile Picture URL:', user.picture);
      setUserMetadata(prevState => prevState ? {
        ...prevState,
        profilePictureUrl: user.picture || '',
        firstName: prevState?.firstName || '',
        lastName: prevState?.lastName || ''
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

  // console.log('MongoDB user role:', userMetadata?.profile?.role);

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
  // const isAdmin = () => {
  //   return userMetadata?.profile?.role === 'admin' || userMetadata?.profile?.role === 'super-admin';
  // };

  // useEffect(() => { 
  //   const initializeRole = async () => { 
  //     if (isAuthenticated && user?.sub) {
  //       const userId = user.sub; // Now user.sub is guaranteed to be a string
  //       const userData = await getUsersRole(userId);
  //       console.log("Fetched Role for User ", userId);
  //   }
      
  //   initializeRole();
  // }
  // }, [user?.sub]); 


  useEffect(() => {
    const initializeUserData = async () => {
      console.log("initialize User Data called ", isAuthenticated, user?.sub);
      console.log("user.sub", user?.sub);
      if (isAuthenticated && user?.sub) {
        try {
          
          const userId = user?.sub;  // Use the original Auth0 ID directly
          const userData = await getUserById(userId);     
          
          // When user logs in
          const email = user.email;
          const role = userMetadata?.profile?.role;
          if (email && role) {
             UserRoleStorage.storeRole(email, role);
          }

          // When you need to check the role
          //const userStorage = UserRoleStorage.getRole(user.email);

          // When user logs out
          // UserRoleStorage.removeRole(user.email);
            
          if (userData) {
             setUserMetadata(userData as UserMetadata);
            console.log('meta role: ', role);
             setUserRole(userData.profile?.role || null);
            
            //  setUserRole(userData.profile?.role || ''); // Set user role from userData

            // Navigation logic
            // nSavigate(userData.profile.role === 'admin' ? '/admin' : '/user', { replace: true });
            console.log("Just set metadata ", userData.profile.role);
          }
        } catch (error) {
          console.error('Error setUserMetadata:', error);
        } finally {
          setLoadingState(false); // Stop loading when done
          console.log("Loading state set to false");
        }
      }
    };

    initializeUserData();
  }, [isAuthenticated, user?.sub]); // Ensure this effect runs when isAuthenticated or user.sub changes


    
// const fetchMongoUserData = async () => {
//   if (!isAuthenticated || !user?.sub) return;

//   try {
//     const normalizedAuthId = user.sub;
//     const mongoUser = await getUserById(normalizedAuthId);

//     // If no existing MongoDB user data, initialize with Auth0 data
//     if (!mongoUser) {
//       console.log('No Existing User Found');
//       const [firstName = '', lastName = ''] = (user.name || '').split(' ');

//       const newUserData = {
//         auth0Id: user.sub,
//         email: user.email || '',
//         profile: {
//           dateOfBirth: '',
//           gender: '',
//           profilePictureUrl: user.picture || '',
//           role: '',
//           timezone: '',
//         },
//       };

//       // Update MongoDB and local storage
//       const createdUser = await updateUser(user.sub, {
//         email: newUserData.email,
//         profile: {
//           dateOfBirth: '',
//           gender: '',
//           profilePictureUrl: user?.picture || '',
//           role: "user",
//           timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get user's local timezone
//         },
//       });
//       setUserMetadata(createdUser);
//       console.log('setUserMetadata, createdUser');
//       return;
//     }

//     // Existing user logic
//     if (mongoUser?.profile?.profilePictureUrl) {
//       console.log('Existing User Found');
//       setUserMetadata((prevState) =>
//         prevState
//           ? {
//               ...prevState,
//               profile: {
//                 ...prevState.profile,
//                 profilePictureUrl: mongoUser.profile.profilePictureUrl,
//                 role: mongoUser.profile.role,
//               },
//             }
//           : null
//       );
//     } else if (user.picture) {
//       setUserMetadata((prevState) =>
//         prevState
//           ? {
//               ...prevState,
//               profile: {
//                 ...prevState.profile,
//                 profilePictureUrl: user.picture || '',
//                 role: mongoUser.profile.role || '',
//               },
//             }
//           : null
//       );
//     }
//   } catch (error) {
//     console.error('Error fetching MongoDB user data:', error);
//     setUserMetadata({
//       auth0Id: user.sub,
//       email: user.email || '',
//       profile: {
//         dateOfBirth: '',
//         gender: '',
//         profilePictureUrl: user.picture || '',
//       },
//     } as UserMetadata);
//   }
// };

// fetchMongoUserData(); // Ensure this is called properly

// // Corrected dependency array: Removing the extra closing bracket
// }, [isAuthenticated, user?.sub, user?.picture, user?.email, user?.name, getUserById, updateUser]);


    // Handle authentication state changes
    // useEffect(() => {
    //   console.log("!isLoading ", !isLoading);
    //   console.log("!isAuthenticated ", !isAuthenticated);
    //   if (!isLoading && !isAuthenticated) {
    //     //setUserMetadata(null);
    //     initializationAttempted.current = false;
    //     navigate('/signed-out');
    //   }
    // }, [isLoading, isAuthenticated, navigate, setUserMetadata]);

  // Initialize user data
  // useEffect(() => {
  //   const initializeUserData = async () => {
  //     console.log("initialize User Data called ", isAuthenticated, user?.sub);
  //     console.log("user.sub", user?.sub);
  //     if (isAuthenticated && user?.sub) {
  //       try {
          
  //         const userId = user?.sub;  // Use the original Auth0 ID directly
  //         const userData = await updateUser(userId, {
  //           email: user?.email || '',
  //           // firstName: user?.?,
  //           // lastName: user?.name?.split(' ')[1] || '',
  //           // phoneNumber: user.phone_number,                   
  //           profile: {
  //             dateOfBirth: '',
  //             gender: '',
  //             profilePictureUrl: user?.picture || '',
  //             role: "user",
  //             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Get user's local timezone
  //           },
  //           marketingBudget: {
  //             adBudget: 0,
  //             costPerAcquisition: 0,
  //             dailySpendingLimit: 0,
  //             marketingChannels: '',
  //             monthlyBudget: 0,
  //             preferredPlatforms: '',
  //             notificationPreferences: [],
  //             roiTarget: 0,
  //             frequency: 'monthly'
              
  //           }
            
  //         });

  //         if (userData) {
  //           setUserMetadata(userData as UserMetadata);
  //           console.log('userData.profile?.role: ', userData.profile?.role);
  //           setUserRole(userData.profile?.role || ''); // Set user role from userData

  //           // Navigation logic
  //           navigate(userData.profile.role === 'admin' ? '/admin' : '/user', { replace: true });
  //           console.log("Navigating to route for ", userData.profile.role);
  //         }
  //       } catch (error) {
  //         console.error('Error setUserMetadata:', error);
  //       } finally {
  //         setLoadingState(false); // Stop loading when done
  //         console.log("Loading state set to false");
  //       }
  //     }
  //   };

  //   initializeUserData();
  // }, [isAuthenticated, user?.sub]); // Ensure this effect runs when isAuthenticated or user.sub changes

    // Navigation effect based on user role
    // useEffect(() => {
    //   console.log("userRole is ", userRole);
    //   if (userRole) {
    //     console.log("userRole", userRole);
    //     console.log("Navigating to", userRole === 'admin' ? '/admin' : '/user');
    //     navigate(userRole === 'admin' ? '/admin' : '/user');
    //   }
    // }, [userRole, navigate]);

  if (isLoading) {
    return <Loader />;
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
            <AuthProvider>
              <Routes>
                <Route path="/signed-out" element={<SignedOut />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Admin Routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute 
                      element={<AdminLayout />}
                      requireAdmin={true} 
                    />
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  {/* <Route path="signed-out" element={<SignedOut />} /> */}
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="marketing-overview" element={<MarketingOverview />} />
                  <Route path="customer-demographics" element={<CustomerDemographics />} />
                  <Route path="changelog" element={<Changelog />} />
                  <Route path="users" element={<UserAdmin />} />
                  <Route path="users/:userId/profile" element={<ProfilePage />} />
                  <Route path="invite" element={<EventInvitation />} />
                  <Route path="user-management" element={<UserManagement />} />
                  <Route path="login" element={<SignedOut />} />
                </Route>

                {/* User Routes */}
                <Route 
                  path="/user/*" 
                  element={
                    <ProtectedRoute 
                      element={<AppLayout />}
                      requireAdmin={false} 
                    />
                  }
                >
                  <Route index element={<UserDashboard />} />
                  <Route path="welcome-new" element={<NewUserWelcome />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="login" element={<SignedOut />} />
                </Route>

                {/* Root Route */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute
                      element={
                        userRole === 'admin' || userRole === 'super-admin' 
                          ? <Navigate to="/admin" replace /> 
                          : <Navigate to="/user" replace />
                      }
                      requireAdmin={false}
                    />
                  }
                />
                <Route path="/login" element={<SignedOut />} />
                {/* <Route
                  path="/"
                  element={
                    <ProtectedRoute
                      element={
                        localStorage.getItem('userRole') === 'admin' || 
                        localStorage.getItem('userRole') === 'super-admin' 
                          ? <Navigate to="/admin" replace /> 
                          : <Navigate to="/user" replace />
                      }
                      requireAdmin={false}
                    />
                  }
                /> */}
              </Routes>
            </AuthProvider>
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}

export default App;
  // const PageWithCustomLayout = () => {
  //   return (
  //     <AdminLayout>
  //       <UserAdmin />
  //     </AdminLayout>
  //   );
  // };

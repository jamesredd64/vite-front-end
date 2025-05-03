<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
const { getUsersRole, getUserById } = useMongoDbClient();
// const { getUsersRole } = useMongoDbClient();
// import { getUsersRole } from './services/mongoDbClient';
const { getUsersRole, getUserById } = useMongoDbClient();

import Marketing from "./pages/Dashboard/Marketing";
=======
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SignedOut from "./pages/SignedOut";
// import AdminDashboard from './pages/AdminDashboard';
// import {UserDashboard} from './pages/UserDashboard';
import NewUserWelcome from './pages/NewUserWelcome';
import AppLayout from "./layout/AppLayout";
import AdminLayout from "./layout/AdminLayout";
import DashboardHome from "./pages/Dashboard/Home";
import UserAdmin from './pages/admin/Users';
import Calendar from './pages/Calendar';
>>>>>>> Stashed changes
=======
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import SignedOut from "./pages/SignedOut";
// import AdminDashboard from './pages/AdminDashboard';
// import {UserDashboard} from './pages/UserDashboard';
import NewUserWelcome from './pages/NewUserWelcome';
import AppLayout from "./layout/AppLayout";
import AdminLayout from "./layout/AdminLayout";
import DashboardHome from "./pages/Dashboard/Home";
import UserAdmin from './pages/admin/Users';
import Calendar from './pages/Calendar';
>>>>>>> Stashed changes
import MarketingOverview from "./pages/MarketingOverview";
import CustomerDemographics from "./pages/Dashboard/CustomerDemographics";
import Changelog from "./pages/Changelog/index";
import UserManagement from "./pages/UserManagement";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
import Profile from "./pages/ProfilePage";
import EventInvitation from "./pages/EventInvitation";
>>>>>>> Stashed changes
=======
import Profile from "./pages/ProfilePage";
import EventInvitation from "./pages/EventInvitation";
>>>>>>> Stashed changes

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
// Components
const AdminDashboard = () => <h1>Admin Dashboard</h1>;
const UserDashboard = () => <h1>User Dashboard</h1>;
const LoginPage = () => <h1>Login Page</h1>;

<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
      const initializeRole = async () => { 
        if (isAuthenticated && user?.sub) {
          const userId = user.sub; // Now user.sub is guaranteed to be a string
          const userData = await getUsersRole(userId);
          console.log("Fetched Role for User ", userId);
      }
        
      initializeRole();
    }
    }, [user?.sub]); 

  // Clear Session Storage if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Clear all storage except theme
      const savedTheme = localStorage.getItem('theme');
      // localStorage.clear();
      // sessionStorage.clear();
      if (savedTheme) {
        localStorage.setItem('theme', savedTheme);
=======
// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuth0();
    const navigate = useNavigate();

=======
// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user } = useAuth0();
    const navigate = useNavigate();

>>>>>>> Stashed changes
    // useEffect(() => {
    //     if (!isAuthenticated) {
    //         navigate('/signed-out');
    //     } else if (requiredRole && (!user || !user['https://dev-uizu7j8qzflxzjpy.jr.com/roles'] || !user['https://dev-uizu7j8qzflxzjpy.jr.com/roles'].includes(requiredRole))) {
    //         navigate('/unauthorized'); // Or handle unauthorized access differently
    //     }
    // }, [isAuthenticated, user, requiredRole, navigate]);
    useEffect(() => {
      if (isAuthenticated && user) {
          const roles = user['https://dev-uizu7j8qzflxzjpy.jr.com/roles'] || [];
          if (roles.includes('admin')) {
              navigate('/admin');
          } else {
              navigate('/user');
          }
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      }
  }, [user]);

    if (!isAuthenticated || (requiredRole && (!user || !user['https://dev-uizu7j8qzflxzjpy.jr.com/roles'] || !user['https://dev-uizu7j8qzflxzjpy.jr.com/roles'].includes(requiredRole)))) {
        return null; // Or a loading indicator
    }
     console.log("useeffect runnung for isAuthenticated");
    return children;
};

export const App = () => {
    const { isAuthenticated, user, loginWithRedirect } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated && user) {
            const roles = user['https://dev-uizu7j8qzflxzjpy.jr.com/roles'] || []; // Ensure this matches your namespacing
            if (roles.includes('admin')) {
                navigate('/admin');
            } else {
                navigate('/user');
            }
        }
    }, [isAuthenticated, user, navigate]);

    console.log("useeffect runnung for isAuthenticated  && user");
    return (
      <Routes>
      <Route path="/signed-out" element={<SignedOut />} />
      <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
  
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  // fetch MongoDB user data early
  useEffect(() => {
    const fetchMongoUserData = async () => {
      if (!isAuthenticated || !user?.sub) return;

      try {
        const normalizedAuthId = user.sub;
        const mongoUser = await getUserById(normalizedAuthId);

        if (!mongoUser) {
          const firstName = user.given_name || user.name?.split(' ')[0] || '';
          const lastName = user.family_name || user.name?.split(' ')[1] || '';
          
          const newUserData = {
            auth0Id: user.sub,
            email: user.email || '',
            firstName: firstName,
            phoneNumber: user.phoneNumber || '',
            lastName: lastName,
            profile: {
              dateOfBirth: '',
              gender: '',
              profilePictureUrl: user.picture || '',
              role: '',
              timezone: '',
            },
            marketingBudget: {
              adBudget: user.marketingBudget?.adBudget || 0,
              costPerAcquisition: user.marketingBudget?.costPerAcquisition || 0,
              dailySpendingLimit: user.marketingBudget?.dailySpendingLimit || 0,
              marketingChannels: user.marketingBudget?.marketingChannels || '',
              monthlyBudget: user.marketingBudget?.monthlyBudget || 0,
              preferredPlatforms: user.marketingBudget?.preferredPlatforms || '',
              notificationPreferences: user.marketingBudget?.notificationPreferences || [],
              roiTarget: user.marketingBudget?.roiTarget || 0,
              frequency: user.marketingBudget?.frequency || 'monthly'
            }    
          };

          // Update MongoDB and local storage
          const createdUser = await updateUser(user.sub, {
            ...newUserData,
            profile: {
              ...newUserData.profile,
              role: 'user' as 'user' | 'admin' | 'manager' | 'super-admin'
            }
          });
          setUserMetadata(createdUser as UserMetadata);
          return;
        }

        // If user exists, update with any new Auth0 data while preserving existing data
        initializationAttempted.current = true;

        const updatedData = {
          email: user.email || mongoUser.email,
          firstName: mongoUser.firstName,
          lastName: mongoUser.lastName,
          phoneNumber: mongoUser.phoneNumber,
          profile: {
            dateOfBirth: mongoUser.profile.dateOfBirth || '',
            gender: mongoUser.profile.gender || '',
            profilePictureUrl: user.picture || mongoUser.profile.profilePictureUrl,
            role: mongoUser.profile.role || '',
            timezone: mongoUser.profile.role || "user",
          },
          marketingBudget: {
            adBudget: mongoUser.marketingBudget?.adBudget || 0,
            costPerAcquisition: mongoUser.marketingBudget?.costPerAcquisition || 0,
            dailySpendingLimit: mongoUser.marketingBudget?.dailySpendingLimit || 0,
            marketingChannels: mongoUser.marketingBudget?.marketingChannels || '',
            monthlyBudget: mongoUser.marketingBudget?.monthlyBudget || 0,
            preferredPlatforms: mongoUser.marketingBudget?.preferredPlatforms || '',
            notificationPreferences: mongoUser.marketingBudget?.notificationPreferences || [],
            roiTarget: mongoUser.marketingBudget?.roiTarget || 0,
            frequency: mongoUser.marketingBudget?.frequency || 'monthly'
          }
        };

        const userData = await updateUser(user.sub, updatedData);
        if (userData) {
          setUserMetadata(userData as UserMetadata);
        }
      } catch (error) {
        console.error('Error updating user:', error);
      }
    };

    fetchMongoUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, getUserById, updateUser]);

  
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
=======
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="marketing-overview" element={<MarketingOverview />} />
                <Route path="customer-demographics" element={<CustomerDemographics />} />
                <Route path="changelog" element={<Changelog />} />
                <Route path="invite" element={<EventInvitation />} />
                <Route path="profile" element={<Profile />} />
            </Route>
        
            {/* User Routes */}
            <Route path="/user" element={<ProtectedRoute requiredRole="user"><AppLayout /></ProtectedRoute>}>                
                <Route path="dashboard" element={<UserDashboard />} />
                <Route index element={<Navigate to="/user/dashboard" replace />} />
                <Route path="profile" element={<Profile />} />
            </Route>
            </Routes>
            // <Routes>
            //     <Route path="/signed-out" element={<SignedOut />} />
            //     <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
            //     {/* Admin Routes */}
            //     <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout/></ProtectedRoute>} />
            //     <Route index element={<Navigate to="/admin/user-admin" replace />} />
            //     <Route path="user-admin" element={<UserAdmin />} />
            //     <Route path="admin/calendar" element={<Calendar />} />                             
            //     <Route path="marketing-overview" element={<MarketingOverview />} />
            //     <Route path="/customer-demographics" element={<CustomerDemographics />} />
            //     <Route path="/changelog" element={<Changelog />} />                  
            //     <Route path="/invite" element={<EventInvitation />} />
            //     <Route path="/profile" element={<Profile />} />
                
            //     {/* User Routes */}
            //     <Route path="/user" element={<ProtectedRoute requiredRole="user"><AppLayout /></ProtectedRoute>} />
            //     <Route index element={<Navigate to="/welcome-new" replace />} />
            //     <Route path="/dashboard" element={<DashboardHome />} />                           
            //     <Route path="/welcome-new" element={<NewUserWelcome />} />  
            //     <Route path="/" element={isAuthenticated ? <Navigate to={user && user['http://your-namespace/roles'] && user['http://your-namespace/roles'].includes('admin') ? '/admin' : '/user'} replace /> : <button onClick={() => loginWithRedirect()}>Login</button>} />
                
                
            // </Routes>
        
    );
};

=======
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="marketing-overview" element={<MarketingOverview />} />
                <Route path="customer-demographics" element={<CustomerDemographics />} />
                <Route path="changelog" element={<Changelog />} />
                <Route path="invite" element={<EventInvitation />} />
                <Route path="profile" element={<Profile />} />
            </Route>
        
            {/* User Routes */}
            <Route path="/user" element={<ProtectedRoute requiredRole="user"><AppLayout /></ProtectedRoute>}>                
                <Route path="dashboard" element={<UserDashboard />} />
                <Route index element={<Navigate to="/user/dashboard" replace />} />
                <Route path="profile" element={<Profile />} />
            </Route>
            </Routes>
            // <Routes>
            //     <Route path="/signed-out" element={<SignedOut />} />
            //     <Route path="/unauthorized" element={<h1>Unauthorized</h1>} />
            //     {/* Admin Routes */}
            //     <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout/></ProtectedRoute>} />
            //     <Route index element={<Navigate to="/admin/user-admin" replace />} />
            //     <Route path="user-admin" element={<UserAdmin />} />
            //     <Route path="admin/calendar" element={<Calendar />} />                             
            //     <Route path="marketing-overview" element={<MarketingOverview />} />
            //     <Route path="/customer-demographics" element={<CustomerDemographics />} />
            //     <Route path="/changelog" element={<Changelog />} />                  
            //     <Route path="/invite" element={<EventInvitation />} />
            //     <Route path="/profile" element={<Profile />} />
                
            //     {/* User Routes */}
            //     <Route path="/user" element={<ProtectedRoute requiredRole="user"><AppLayout /></ProtectedRoute>} />
            //     <Route index element={<Navigate to="/welcome-new" replace />} />
            //     <Route path="/dashboard" element={<DashboardHome />} />                           
            //     <Route path="/welcome-new" element={<NewUserWelcome />} />  
            //     <Route path="/" element={isAuthenticated ? <Navigate to={user && user['http://your-namespace/roles'] && user['http://your-namespace/roles'].includes('admin') ? '/admin' : '/user'} replace /> : <button onClick={() => loginWithRedirect()}>Login</button>} />
                
                
            // </Routes>
        
    );
};

>>>>>>> Stashed changes
// const AppWrapper = () => (
    
//         <Router>
//             <App />
//         </Router>
    
// );

// export default AppWrapper;

// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable react-refresh/only-export-components */

// import { Routes, Route, Navigate, useNavigate, useParams, Outlet } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// import { useAdmin } from './hooks/useAdmin';
// import { useGlobalStorage } from './hooks/useGlobalStorage';
// import AppLayout from "./layout/AppLayout";
// import AdminLayout from "./layout/AdminLayout";
// import { useEffect, useRef, useState, useCallback } from 'react';
// import NotFound from "./pages/OtherPage/NotFound";
// import ProfileView from "./pages/ProfileView";
// // import UserProfileView from "./pages/UserProfileView";
// import  Calendar from "./pages/Calendar";
// import DashboardHome from "./pages/Dashboard/Home";
// import React from "react";
// import SignedOut from "./pages/SignedOut";
// import Loader from './components/common/Loader';
// import { useMongoDbClient } from './services/mongoDbClient';
// import Marketing from "./pages/Dashboard/Marketing";
// import MarketingOverview from "./pages/MarketingOverview";
// import CreateNotification from "./pages/CreateNotification";
// import CustomerDemographics from "./pages/Dashboard/CustomerDemographics";
// import Changelog from "./pages/Changelog/index";
// import UserManagement from "./pages/UserManagement";
// import { initSessionTimeout } from './utils/sessionTimeout';
// import { IdleTimeoutHandler } from "./components/IdleTimeoutHandler";
// import EventInvitation from "./pages/EventInvitation";
// import UserAdmin from './pages/admin/Users';
// // Add this to your imports
// import NewUserWelcome from './pages/NewUserWelcome';
// import ProfilePage from "./pages/ProfilePage";
// // import AdminDashboard from "./components/AdminDashboard";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import AdminDashboard from './pages/AdminDashboard';
// import {UserDashboard} from './pages/UserDashboard';



// // import { forceLogout } from './utils/forceLogout';
// // import { UnsavedChangesModal } from "./components/UnsavedChangesModal";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// // import ProtectedAdminRoute from './components/ProtectedAdminRoute';
// // import { AdminManagement } from './components/admin/AdminManagement';
// // import { AdminCodeVerification } from "./components/admin/AdminCodeVerification";
// // import { ProtectedRoute } from "./components/ProtectedRoute";



// // function App() {
// //   const { user, isAuthenticated, isLoading } = useAuth0();
// //   const roles = user['https://myroles.com/roles'];

// //   // Check if the user has a specific role
// //   let isAdmin = roles.includes('admin');

// //   // Use the role to conditionally render components
// //   if (isAdmin) {
// //     return <AdminComponent />;
// //   } else {
// //     return <UserComponent />;
// //   }
// // }


// // import Marketing2 from './pages/Dashboard/Main/Marketing';
// // import Marketing from "./pages/Dashboard/Main/Marketing";
// // import About from "./pages/Company/About";
// // import Careers from "./pages/Company/Careers";
// // import Contact from "./pages/Company/Contact";
// // import Blog from "./pages/Resources/Blog";
// // import Documentation from "./pages/Resources/Documentation";
// // import Help from "./pages/Resources/Help";
// // import Privacy from "./pages/Legal/Privacy";
// // import Terms from "./pages/Legal/Terms";

// type UserRole = "user" | "admin" | "manager" | "super-admin";

// interface UserMetadata {
//   auth0Id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   profile: {
//     dateOfBirth: string;
//     gender: string;
//     profilePictureUrl: string;
//     role: UserRole;
//     timezone: "";
//   };
//   marketingBudget: {
//     adBudget: number;
//     costPerAcquisition: number;
//     dailySpendingLimit: number;
//     marketingChannels: string;
//     monthlyBudget: number;
//     preferredPlatforms: string;
//     notificationPreferences: string[];
//     roiTarget: number;
//     frequency: "daily" | "monthly" | "quarterly" | "yearly";
//   };  
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   isActive: boolean;
//   createdAt: string | Date;
//   updatedAt: string | Date;  
// }

// interface NavigationContextType {
//   handleNavigation: (path: string) => boolean;
//   hasUnsavedChanges: boolean;
//   setHasUnsavedChanges: (value: boolean) => void;
// }

// type NavigationState = {
//   isModalOpen: boolean;
//   pendingPath: string | null;
// };

// export const NavigationContext = React.createContext<NavigationContextType | undefined>(undefined);

// function App() {
//   const { isLoading, isAuthenticated, getAccessTokenSilently, error: auth0Error, user } = useAuth0();
//   const navigate = useNavigate();
//   // const location = useLocation();
//   const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
//   const { updateUser, getUserById } = useMongoDbClient();
//   const initializationAttempted = useRef(false);
//   const params = useParams<{ userId: string }>();
//   // Initialize state properly
//   const [state, setState] = useState({
//     isAdmin: false,
//     isLoading: true,
//     route: '', // Added route to state
//   });
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const userId = params.userId;
//   // const { user, isAuthenticated, isLoading } = useAuth0();
//   //const roles = user ? user['https://dev-uizu7j8qzflxzjpy.us.auth0.com/api/v2/roles'] || [] : [];
//   if (user && isAuthenticated) {
//      // Check if the user has a specific role
//   // let isUserAdmin = roles.includes('admin') || roles.includes('super-admin');
//   // console.log("Auth0 User Role Is ", user , isUserAdmin, roles,  isAuthenticated);
//   //console.log("Roles Array: ", roles);
//   const namespace = "https://dev-uizu7j8qzflxzjpy.jr.com/roles"; // Match Auth0 custom namespace
//   // return user?.[namespace]?.[0] || "No role found"; // Extract the role
//   console.log("Roles Array: ", user?.[namespace] || []);
  

//     // const useUserRole = () => {
    
//     //   const namespace = "https://dev-uizu7j8qzflxzjpy.us.auth0.com/api/v2/roles"; // Match Auth0 custom namespace
//     //   return user?.[namespace]?.[0] || "No role found"; // Extract the role
//     //   console.log("Roles Array: ", useUserRole);
//     // };
//   }
//   // // Check if the user has a specific role
//   // let isUserAdmin = roles.includes('admin') || roles.includes('super-admin');

//   // // Use the role to conditionally render components
//   // if (isUserAdmin) {
//   //   console.log("Auth0 User Role Is ", isUserAdmin );
//   //   // return <AdminComponent />;
//   // } else {
//   //   console.log("Auth0 User Role Is ", isUserAdmin[0] );
//   //   // return <UserComponent />;
//   // }

//   useEffect(() => {
//     if (isAuthenticated) {
//       const cleanup = initSessionTimeout({
//         logout: async () => {
//           try {
//             // Get a fresh token before logout to ensure the request goes through
//             await getAccessTokenSilently();
            
//             // Cancel all pending requests
//             window.stop();
            
//             // Clear all storage except theme
//             const savedTheme = localStorage.getItem('theme');
//             localStorage.clear();
//             sessionStorage.clear();
//             if (savedTheme) {
//               localStorage.setItem('theme', savedTheme);
//             }

//             // Navigate to signed-out page
//             window.location.href = '/signed-out';
//           } catch (error) {
//             console.error('Timeout logout error:', error);
//             // Force navigation to signed-out page if token refresh fails
//             window.location.href = '/signed-out';
//           }
//         }
//       });
//       return cleanup;
//     }
//   }, [isAuthenticated, getAccessTokenSilently]);

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       // Clear all storage except theme
//       const savedTheme = localStorage.getItem('theme');
//       localStorage.clear();
//       sessionStorage.clear();
//       if (savedTheme) {
//         localStorage.setItem('theme', savedTheme);
//       }
      
//       // Cancel any pending requests
//       window.stop();
//     }
//   }, [isLoading, isAuthenticated]);
  
//   // Add new effect to fetch MongoDB user data early
//   useEffect(() => {
//     const fetchMongoUserData = async () => {
//       if (!isAuthenticated || !user?.sub) return;

//       try {
//         const normalizedAuthId = user.sub;
//         const mongoUser = await getUserById(normalizedAuthId);

//         if (!mongoUser) {
//           const firstName = user.given_name || user.name?.split(' ')[0] || '';
//           const lastName = user.family_name || user.name?.split(' ')[1] || '';
          
//           const newUserData = {
//             auth0Id: user.sub,
//             email: user.email || '',
//             firstName: firstName,
//             phoneNumber: user.phoneNumber || '',
//             lastName: lastName,
//             profile: {
//               dateOfBirth: '',
//               gender: '',
//               profilePictureUrl: user.picture || '',
//               role: '',
//               timezone: '',
//             },
//             marketingBudget: {
//               adBudget: user.marketingBudget?.adBudget || 0,
//               costPerAcquisition: user.marketingBudget?.costPerAcquisition || 0,
//               dailySpendingLimit: user.marketingBudget?.dailySpendingLimit || 0,
//               marketingChannels: user.marketingBudget?.marketingChannels || '',
//               monthlyBudget: user.marketingBudget?.monthlyBudget || 0,
//               preferredPlatforms: user.marketingBudget?.preferredPlatforms || '',
//               notificationPreferences: user.marketingBudget?.notificationPreferences || [],
//               roiTarget: user.marketingBudget?.roiTarget || 0,
//               frequency: user.marketingBudget?.frequency || 'monthly'
//             }    
//           };

//           // Update MongoDB and local storage
//           const createdUser = await updateUser(user.sub, {
//             ...newUserData,
//             profile: {
//               ...newUserData.profile,
//               role: 'user' as 'user' | 'admin' | 'manager' | 'super-admin'
//             }
//           });
//           setUserMetadata(createdUser as UserMetadata);
//           return;
//         }

//         // If user exists, update with any new Auth0 data while preserving existing data
//         initializationAttempted.current = true;

//         const updatedData = {
//           email: user.email || mongoUser.email,
//           firstName: mongoUser.firstName,
//           lastName: mongoUser.lastName,
//           phoneNumber: mongoUser.phoneNumber,
//           profile: {
//             dateOfBirth: mongoUser.profile.dateOfBirth || '',
//             gender: mongoUser.profile.gender || '',
//             profilePictureUrl: user.picture || mongoUser.profile.profilePictureUrl,
//             role: mongoUser.profile.role || '',
//             timezone: mongoUser.profile.role || "user",
//           },
//           marketingBudget: {
//             adBudget: mongoUser.marketingBudget?.adBudget || 0,
//             costPerAcquisition: mongoUser.marketingBudget?.costPerAcquisition || 0,
//             dailySpendingLimit: mongoUser.marketingBudget?.dailySpendingLimit || 0,
//             marketingChannels: mongoUser.marketingBudget?.marketingChannels || '',
//             monthlyBudget: mongoUser.marketingBudget?.monthlyBudget || 0,
//             preferredPlatforms: mongoUser.marketingBudget?.preferredPlatforms || '',
//             notificationPreferences: mongoUser.marketingBudget?.notificationPreferences || [],
//             roiTarget: mongoUser.marketingBudget?.roiTarget || 0,
//             frequency: mongoUser.marketingBudget?.frequency || 'monthly'
//           }
//         };

//         const userData = await updateUser(user.sub, updatedData);
//         if (userData) {
//           setUserMetadata(userData as UserMetadata);
//         }
//       } catch (error) {
//         console.error('Error updating user:', error);
//       }
//     };

//     fetchMongoUserData();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAuthenticated, user, getUserById, updateUser]);

//   // Update your existing profile picture effect to avoid conflicts
//   useEffect(() => {
//     if (user?.picture && userMetadata && !userMetadata.profile.profilePictureUrl) {
//       console.log('Setting default Auth0 Profile Picture URL:', user.picture);
//       setUserMetadata(prevState => prevState ? {
//         ...prevState,
//         profilePictureUrl: user.picture || '',
//         firstName: prevState?.firstName || '',
//         lastName:  prevState?.lastName || ''
//       } : null);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user?.picture]);

//   // Add state for handling unsaved changes
//   const [navigationState, setNavigationState] = useState<NavigationState>({
//     isModalOpen: false,
//     pendingPath: null,
//   });
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

//   // Add context or global state management for unsaved changes
//   const handleNavigation = useCallback((path: string) => {
//     if (hasUnsavedChanges) {
//       setNavigationState({
//         isModalOpen: true,
//         pendingPath: path,
//       });
//       return false; // Prevent immediate navigation
//     }
//     return true; // Allow navigation
//   }, [hasUnsavedChanges]);

//   // console.log('MongoDB user role:', userMetadata?.profile?.role);
//   // console.log('MongoDB user data:', userMetadata);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const handleConfirmNavigation = () => {
//     if (navigationState.pendingPath) {
//       setHasUnsavedChanges(false);
//       navigate(navigationState.pendingPath);
//       setNavigationState({
//         isModalOpen: false,
//         pendingPath: null,
//       });
//     }
//   };

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const handleCancelNavigation = () => {
//     setNavigationState({
//       isModalOpen: false,
//       pendingPath: null,
//     });
//   };

  

//   // Add this function to check if user is admin
//   const { isAdmin } = useAdmin();
//   // if(isAdmin) {   

//   //   const getRoute = useCallback(() => {
//   //     return state.isAdmin ? '/admin' : '/user'; // Determine route based on isAdmin
//   //   }, [state.isAdmin]);
//   // }
//   // const isAdmin = () => {
//   //   return userMetadata?.profile?.role === 'admin' || userMetadata?.profile?.role === 'super-admin';
//   // };

//   // Handle authentication state changes
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       setUserMetadata(null);
//       navigate('/signed-out');
//     }
//   }, [isLoading, isAuthenticated, navigate, setUserMetadata]);

//   // Initialize user data
//   useEffect(() => {
//     const initializeUserData = async () => {
//       if (!isAuthenticated || !user?.sub || initializationAttempted.current) {
//         return;
//       }

//       initializationAttempted.current = true;

//       try {
//         const userId = user.sub;  // Use the original Auth0 ID directly
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
//             timezone: "",
            
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
//         }
//       } catch (error) {
//         console.error('Error updating user:', error);
//       }
//     };

//     if (isAuthenticated && user?.sub) {
//       initializeUserData();
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAuthenticated, user?.sub]);

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (auth0Error) {
//     return <div className="text-center p-4">Authentication Error: {auth0Error.message}</div>;
//   }

//   return (
//     <NavigationContext.Provider value={{ handleNavigation, hasUnsavedChanges, setHasUnsavedChanges }}>
//   <IdleTimeoutHandler />
//   <div className="dark:bg-boxdark-2 dark:text-bodydark min-h-screen">
//     <div className="flex h-screen overflow-hidden">
//       <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
//         <Routes>        
//           <Route path="/signed-out" element={<SignedOut />} />
//           <Route element={<ProtectedRoute requireAdmin={true} />}>
//           <Route path="/admin/*" element={<AdminLayout />}>
//             <Route index element={<Navigate to="/admin/dashboard" replace />} />
//             {/* <Route path="dashboard" element={<AdminDashboard />} /> */}
//             <Route path="users" element={<UserManagement />} />
//           </Route>
//           </Route>

//           <Route element={<ProtectedRoute requireAdmin={false} />}>
//             <Route path="/user/*" element={<AppLayout />}>
//               <Route index element={<Navigate to="/user/dashboard" replace />} />
//               {/* <Route path="dashboard" element={<UserDashboard />} /> */}
//               <Route path="profile" element={<ProfilePage />} />
//             </Route>
//           </Route>
//           <Route path="*" element={<NotFound />} />

//           {/* Public Routes */}
//           <Route path="/" element={<Navigate to="/SignedOut" />} />
//           <Route path="/signed-out" element={<SignedOut />} />          
//           {/* <Route
//             path="/user"
//             element={
//               <ProtectedRoute requireAdmin={false} element={<AppLayout />} />} 
//               />   */}
//              {/* <Route element={<AppLayout />}>
//               <Route index element={<Navigate to="/welcome-new" replace />} />
//               <Route path="/dashboard" element={<DashboardHome />} />                           
//               <Route path="/welcome-new" element={<NewUserWelcome />} />  
//               <Route path="/profile" element={<ProfilePage />} />  
//               </Route>        
//               {/* Protected Admin Routes  */}
//               {/* <Route element={<ProtectedRoute requireAdmin={true}  element={<AdminLayout />} />} />
//                 <Route path="/admin/*" element={<AdminLayout />}/>
//                   <Route index element={<Navigate to="/admin/user-admin" replace />} />
//                   <Route path="user-admin" element={<UserAdmin />} />
//                   <Route path="users" element={
//                     <React.Suspense fallback={<Loader />}>
//                       <UserManagement />
//                     </React.Suspense>
//                   } />
//                   <Route path="invite" element={<EventInvitation />} />  */}
                
//           {/* Protected User Routes */}
//           {/* <Route element={<ProtectedRoute requireAdmin={false} element={<AdminDashboard />} />} />
//             <Route element={<AppLayout />}>
//               <Route index element={<Navigate to="/welcome-new" replace />} />
//               <Route path="/dashboard" element={<DashboardHome />} />                           
//               <Route path="/welcome-new" element={<NewUserWelcome />} />  
//               <Route path="/profile" element={<ProfilePage />} />  
//               <Route path="/invite" element={<EventInvitation />} />
//               <Route path="/profile-view" element={<ProfileView />} />
//               <Route path="user-admin" element={<UserAdmin />} />           
//               </Route> */}
         

//           {/* Protected Admin Routes */}
//           {/* <Route element={<ProtectedRoute requireAdmin={true}  element={<UserDashboard />} />} />
//             <Route path="/admin/*" element={<AdminLayout />}/>
//               <Route index element={<Navigate to="/admin/user-admin" replace />} />
//               <Route path="user-admin" element={<UserAdmin />} />
//               <Route path="users" element={
//                 <React.Suspense fallback={<Loader />}>
//                   <UserManagement />
//                 </React.Suspense>
//               } />
//               <Route path="invite" element={<EventInvitation />} /> */}
                  

//           {/* Unauthorized & Catch-all Routes */}
//           {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
          
//         </Routes>
//       </div>
//     </div>
//   </div>
// </NavigationContext.Provider>


//     // <NavigationContext.Provider value={{ handleNavigation, hasUnsavedChanges, setHasUnsavedChanges }}>
//     //   <IdleTimeoutHandler />
//     //   <div className="dark:bg-boxdark-2 dark:text-bodydark min-h-screen">
//     //     <div className="flex h-screen overflow-hidden">
//     //       <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
//     //         <Routes>        
//     //           <Route path="/signed-out" element={<SignedOut />} />
//     //           {isAuthenticated ? (
//     //             <>
//     //               {/* Main routes with AppLayout */}
//     //               <Route element={<AppLayout />}>
//     //                 <Route index element={<Navigate to="/welcome-new" replace />} />              
//     //                 <Route path="/dashboard" element={<DashboardHome />} />                           
//     //                 <Route path="/welcome-new" element={<NewUserWelcome />} />  
//     //                 <Route path="/profile" element={<ProfilePage />} />  
                    
//     //                 {/* <Route path="/calendar" element={<Calendar />} />
//     //                 <Route path="/marketing" element={<Marketing />} />                 
//     //                 {/* <Route path="/notifications/create" element={<CreateNotification />} /> */}
//     //                 {/* <Route path="/marketing-overview" element={<MarketingOverview />} />
//     //                 <Route path="/customer-demographics" element={<CustomerDemographics />} />
//     //                 <Route path="/changelog" element={<Changelog />} />                  
//     //                 <Route path="/invite" element={<EventInvitation />} />
//     //                 <Route path="/profile-view" element={<ProfileView />} />
//     //                 <Route path="user-admin" element={<UserAdmin />} /> */}
//     //               </Route>

//     //               {/* Admin routes with AdminLayout */}
//     //               {isAdmin ? (
//     //                 <Route path="/admin/*" element={<AdminLayout children={undefined} />}>
//     //                   <Route index element={<Navigate to="admin/user-admin" replace />} />                      
//     //                   {/* <Route path="calendar" element={<Calendar />} />
//     //                 <Route path="marketing" element={<Marketing />} />                  */}
//     //                 {/* <Route path="notifications/create" element={<CreateNotification />} />
//     //                 <Route path="marketing-overview" element={<MarketingOverview />} />
//     //                 <Route path="customer-demographics" element={<CustomerDemographics />} />
//     //                 <Route path="changelog" element={<Changelog />} />                  
//     //                   <Route path="invite" element={<EventInvitation />} />
//     //                   <Route path="users" element={
//     //                     <React.Suspense fallback={<Loader />}>
//     //                       <UserManagement />
//     //                     </React.Suspense>
//     //                   } /> */}
                    
//     //                 <Route path="user-admin" element={<UserAdmin />} />
//     //                   {/* Add other admin routes here */}
//     //                 </Route>
//     //               ) : (
//     //                 <Route path="/admin/*" element={<Navigate to="/user-admin" replace />} />
//     //               )}

//     //               {/* Catch all route */}
//     //               <Route path="*" element={<NotFound />} />
//     //             </>
//     //           ) : (
//     //             <Route path="*" element={<Navigate to="/signed-out" replace />} />
//     //           )}
//     //         </Routes>
//     //         <Routes>
//     //       <Route path="/" element={<Navigate to="/login" />} />
//     //       <Route path="/login" element={<Login />} />
//     //       <Route element={<AppLayout />}></Route>
//     //       <Route index element={<Navigate to="/welcome-new" replace />} />
          
//     //       <Route
//     //         path="/admin"
//     //         element={
//     //           <ProtectedRoute>
//     //             <Route index element={<Navigate to="admin/user-admin" replace />} />  
//     //           </ProtectedRoute>
//     //         }
//     //       />
//     //       <Route path="/admin/*" element={<AdminLayout children={undefined} />}>
          
//     //     </Routes>
//     //       </div>
//     //     </div>
//     //   </div>
//     // </NavigationContext.Provider>
//   );
// }

// // const PageWithCustomLayout = () => {
// //   return (
// //     <AdminLayout>
// //       <UserAdmin />
// //     </AdminLayout>
// //   );
// // };

// export default App;
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

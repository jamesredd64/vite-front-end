
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalStorage } from './hooks/useGlobalStorage';
import AppLayout from "./layout/AppLayout";
import { useEffect, useRef } from 'react';
import NotFound from "./pages/OtherPage/NotFound";
// import UserProfiles from "./pages/ProfilePage";
import Calendar from "./pages/Calendar";
import Home from "./pages/Dashboard/Home";
import Logout from "./pages/test";
import UserProfile from "./pages/TestPage";
import React from "react";
import { SignedOut } from "./pages/SignedOut";
import Loader from './components/common/Loader';
import { useMongoDbClient } from './services/mongoDbClient';


interface UserMetadata {
  auth0Id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: string;
  // gender: string;
  profilePictureUrl: string;
  adBudget: number;
  costPerAcquisition: number;
  dailySpendingLimit: number;
  marketingChannels: string;
  monthlyBudget: number;
  preferredPlatforms: string;
  notificationPreferences: string[];
  roiTarget: number;
  marketingBudget: {
    amount: number;
    frequency: "daily" | "monthly" | "quarterly" | "yearly";
    adCosts: number;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

function App() {
  const { isLoading, isAuthenticated, error: auth0Error, user } = useAuth0();
  const navigate = useNavigate();
  const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { updateUser } = useMongoDbClient();
  const initializationAttempted = useRef(false);

  // Update profile picture only when user data changes
  useEffect(() => {
    if (user?.picture && userMetadata && userMetadata.profilePictureUrl !== user.picture) {
      console.log('Auth0 Profile Picture URL:', user.picture);
      console.log('Current Profile Picture URL:', userMetadata.profilePictureUrl);
      setUserMetadata(prevState => prevState ? {
        ...prevState,
        profilePictureUrl: user.picture || prevState.profilePictureUrl || '',
         name: user.name || prevState.name || ''
      } : null);
    }
  }, [user?.picture]);

  // Handle authentication state changes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setUserMetadata(null);
      navigate('/signed-out');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Initialize user data
  useEffect(() => {
    const initializeUserData = async () => {
      if (!isAuthenticated || !user?.sub || initializationAttempted.current) {
        return;
      }

      initializationAttempted.current = true;

      try {
        const userData = await updateUser(user.sub, {
          email: user?.email || '',
          name: user?.name || '',          
          firstName: user?.given_name || '',
          lastName: user?.family_name || '',
          // profilePictureUrl: user?.picture || '',
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
        console.error('Error initializing user data:', error);
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
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/signed-out" element={<SignedOut />} />
            {isAuthenticated ? (
              <Route element={<AppLayout />}>
                <Route path="/" element={<Home />} />
                {/* <Route path="/test" element={
                  <ErrorBoundary>
                    <UserProfile />
                  </ErrorBoundary>
                } /> */}
                <Route path="/lg" element={<Logout />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            ) : (
              <Route path="*" element={<Navigate to="/signed-out" replace />} />
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

// last on 3-19-25 7-44pm

// import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
// import { useAuth0 } from '@auth0/auth0-react';
// import { useGlobalStorage } from './hooks/useGlobalStorage';
// import AppLayout from "./layout/AppLayout";
// import { useEffect, useRef } from 'react';
// import NotFound from "./pages/OtherPage/NotFound";
// // import UserProfiles from "./pages/ProfilePage";
// import Calendar from "./pages/Calendar";
// import Home from "./pages/Dashboard/Home";
// import Logout from "./pages/test";
// import UserProfile from "./pages/TestPage";
// import React from "react";
// import SignedOut from "./pages/SignedOut";
// import Loader from './components/common/Loader';
// import { useMongoDbClient } from './services/mongoDbClient';
// // import MongoInitializer from './components/MongoInitializer';
// import ErrorBoundary from './components/ErrorBoundary';

// interface UserMetadata {
//   adBudget: number;
//   costPerAcquisition: number;
//   dailySpendingLimit: number;
//   marketingChannels: string;
//   monthlyBudget: number;
//   preferredPlatforms: string;
//   notificationPreferences: string[]; // Changed from boolean to string[]
//   roiTarget: number;
//   name: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   dateOfBirth: string;
//   gender: string;
//   profilePictureUrl: string;
//   marketingBudget: {
//     amount: number;
//     frequency: "daily" | "monthly" | "quarterly" | "yearly";
//     adCosts: number;
//   };
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   auth0Id: string;
// }

// function App() {
//   const { isLoading, isAuthenticated, error: auth0Error, user } = useAuth0();
//   const navigate = useNavigate();
//   const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
//   const { updateUser } = useMongoDbClient();
//   const initializationAttempted = useRef(false);

//   // Update profile picture only when user data changes
//   useEffect(() => {
//     if (user?.picture && userMetadata && userMetadata.profilePictureUrl !== user.picture) {
//       setUserMetadata(prevState => prevState ? {
//         ...prevState,
//         profilePictureUrl: user.picture || prevState.profilePictureUrl || ''
//       } : null);
//     }
//   }, [user?.picture]);

//   // Handle authentication state changes
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       setUserMetadata(null);
//       navigate('/signed-out');
//     }
//   }, [isLoading, isAuthenticated, navigate]);

//   // Initialize user data
//   useEffect(() => {
//     const initializeUserData = async () => {
//       if (!isAuthenticated || !user?.sub || initializationAttempted.current) {
//         return;
//       }

//       initializationAttempted.current = true;

//       try {
//         const userData = await updateUser(user.sub, {
//           email: user?.email || '',
//           name: user?.name || `${user?.given_name || ''} ${user?.family_name || ''}`.trim()
//         });

//         if (userData) {
//           setUserMetadata({
//             adBudget: userData.adBudget || 0,
//             costPerAcquisition: userData.costPerAcquisition || 0,
//             dailySpendingLimit: userData.dailySpendingLimit || 0,
//             marketingChannels: userData.marketingChannels || '',
//             monthlyBudget: userData.monthlyBudget || 0,
//             preferredPlatforms: userData.preferredPlatforms || '',
//             notificationPreferences: Array.isArray(userData.notificationPreferences) 
//               ? userData.notificationPreferences 
//               : [],
//             roiTarget: userData.roiTarget || 0,
//             name: userData.name || '',
//             email: userData.email || '',
//             firstName: userData.firstName || '',
//             lastName: userData.lastName || '',
//             phoneNumber: userData.phoneNumber || '',
//             dateOfBirth: userData.dateOfBirth || '',
//             gender: userData.gender || '',
//             profilePictureUrl: user?.picture || '',
//             marketingBudget: {
//               amount: userData.marketingBudget?.amount || 0,
//               frequency: userData.marketingBudget?.frequency || 'monthly',
//               adCosts: userData.marketingBudget?.adCosts || 0
//             },
//             address: {
//               street: userData.address?.street || '',
//               city: userData.address?.city || '',
//               state: userData.address?.state || '',
//               zipCode: userData.address?.zipCode || '',
//               country: userData.address?.country || ''
//             },
//             auth0Id: userData.auth0Id || user.sub
//           });
//         }
//       } catch (error) {
//         console.error('Error initializing user data:', error);
//         // You might want to show an error message to the user here
//         // or implement a retry mechanism
//       }
//     };

//     if (isAuthenticated && user?.sub) {
//       initializeUserData();
//     }
//   }, [isAuthenticated, user?.sub, updateUser]);

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (auth0Error) {
//     return <div className="text-center p-4">Authentication Error: {auth0Error.message}</div>;
//   }

//   return (
//     <div className="dark:bg-boxdark-2 dark:text-bodydark">
//       <div className="flex h-screen overflow-hidden">
//         <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
//           <Routes>
//             <Route path="/signed-out" element={<SignedOut />} />
//             {isAuthenticated ? (
//               <Route element={<AppLayout />}>
//                 <Route path="/" element={<Home />} />
//                 {/* <Route path="/test" element={
//                   <ErrorBoundary>
//                     <UserProfile />
//                   </ErrorBoundary>
//                 } /> */}
//                 <Route path="/lg" element={<Logout />} />
//                 <Route path="/dashboard" element={<Home />} />
//                 <Route path="/profile" element={<UserProfile />} />
//                 <Route path="/calendar" element={<Calendar />} />
//                 <Route path="*" element={<NotFound />} />
//               </Route>
//             ) : (
//               <Route path="*" element={<Navigate to="/signed-out" replace />} />
//             )}
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
// import { useAuth0 } from '@auth0/auth0-react';
// import { useGlobalStorage } from './hooks/useGlobalStorage';
// import AppLayout from "./layout/AppLayout";
// import { useEffect, useRef } from 'react';
// import NotFound from "./pages/OtherPage/NotFound";
// import UserProfiles from "./pages/ProfilePage";
// import Calendar from "./pages/Calendar";
// import Home from "./pages/Dashboard/Home";
// import TestP from "./pages/test";
// import TestPage from "./pages/TestPage";
// import React from "react";
// import SignedOut from "./pages/SignedOut";
// import Loader from './components/common/Loader';
// import { useMongoDbClient } from './services/mongoDbClient';
// import MongoInitializer from './components/MongoInitializer';
// import ErrorBoundary from './components/ErrorBoundary';

// interface UserMetadata {
//   adBudget: number;
//   costPerAcquisition: number;
//   dailySpendingLimit: number;
//   marketingChannels: string;
//   monthlyBudget: number;
//   preferredPlatforms: string;
//   notificationPreferences: boolean;
//   roiTarget: number;
//   name: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string; 
//   dateOfBirth: string;
//   gender: string;
//   profilePictureUrl: string;
//   marketingBudget: {
//     adBudget: number;
//       costPerAcquisition: number;
//       dailySpendingLimit: number;
//       marketingChannels: string;
//       monthlyBudget: number;
//       preferredPlatforms: string;
//       notificationPreferences: string[]; // Changed from boolean to string[]
//       roiTarget: number;
//       frequency: "daily" | "monthly" | "quarterly" | "yearly";      
//   };
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;    
//   };
//   auth0Id: string;
// }

// function App() {
//   const { isLoading, isAuthenticated, error, user } = useAuth0();
//   const navigate = useNavigate();
//   const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
//   const { updateUser } = useMongoDbClient();
//   const initializationAttempted = useRef(false);

//   // Update profile picture only when user data changes
//   useEffect(() => {
//     if (user?.picture && userMetadata && userMetadata.profilePictureUrl !== user.picture) {
//       setUserMetadata({
//         ...userMetadata,
//         profilePictureUrl: user.picture
//       });
//     }
//   }, [user?.picture]); // Remove setUserMetadata and userMetadata from dependencies

//   // Handle authentication state changes
//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       setUserMetadata(null);
//       navigate('/signed-out');
//     }
//   }, [isLoading, isAuthenticated, navigate]); // Remove setUserMetadata from dependencies

//   // Initialize user data
//   useEffect(() => {
//     const initializeUserData = async () => {
//       if (!isAuthenticated || !user?.sub || initializationAttempted.current) {
//         return;
//       }
//       initializationAttempted.current = true;
//       try {
//         const userData = await updateUser(user.sub, {
//           email: user?.email || '',
//           name: user?.name || `${user?.given_name || ''} ${user?.family_name || ''}`.trim()
//         });
//         if (userData) {
//           setUserMetadata({
//             ...userData,
//             adBudget: userData.adBudget || 0,
//             costPerAcquisition: userData.costPerAcquisition || 0,
//             dailySpendingLimit: userData.dailySpendingLimit || 0,
//             marketingChannels: userData.marketingChannels || '',
//             monthlyBudget: userData.monthlyBudget || 0,
//             preferredPlatforms: userData.preferredPlatforms || '',
//             notificationPreferences: userData.notificationPreferences || false,
//             roiTarget: userData.roiTarget || 0,
//             name: userData.name || '',
//             email: userData.email || '',
//             firstName: userData.firstName || '',
//             lastName: userData.lastName || '',
//             phoneNumber: userData.phoneNumber || '',
//             dateOfBirth: userData.dateOfBirth || '',
//             gender: userData.gender || '',
//             profilePictureUrl: user?.picture || '',
//             marketingBudget: {
//               amount: userData.marketingBudget?.amount || 0,
//               frequency: userData.marketingBudget?.frequency || 'monthly',
//               adCosts: userData.marketingBudget?.adCosts || 0
//             },
//             address: {
//               street: userData.address?.street || '',
//               city: userData.address?.city || '',
//               state: userData.address?.state || '',
//               zipCode: userData.address?.zipCode || '',
//               country: userData.address?.country || ''
//             },
//             auth0Id: userData.auth0Id || user.sub
//           });
//         }
//       } catch (error) {
//         console.error('Error initializing user data:', error);
//       }
//     };

//     if (isAuthenticated && user?.sub) {
//       initializeUserData();
//     }
//   }, [isAuthenticated, user?.sub]); // Remove other dependencies that aren't strictly necessary

//   if (isLoading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <div>{error.message}</div>;
//   }

//   return (
//     <div className="dark:bg-boxdark-2 dark:text-bodydark">
//       <div className="flex h-screen overflow-hidden">
//         <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
//           <Routes>
//             <Route path="/signed-out" element={<SignedOut />} />
//             {isAuthenticated ? (
//               <Route element={<AppLayout />}>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/test" element={
//                   <ErrorBoundary>
//                     <TestPage />
//                   </ErrorBoundary>
//                 } />
//                 <Route path="/lg" element={<TestP />} />
//                 <Route path="/dashboard" element={<Home />} />
//                 <Route path="/profile" element={<UserProfiles />} />
//                 <Route path="/calendar" element={<Calendar />} />
//               </Route>
//             ) : (
//               <Route path="*" element={<Navigate to="/signed-out" replace />} />
//             )}
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
// // Removed unused functions at the bottom

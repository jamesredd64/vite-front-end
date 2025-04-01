
import { Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useGlobalStorage } from './hooks/useGlobalStorage';
import AppLayout from "./layout/AppLayout";
import { useEffect, useRef, useState, useCallback } from 'react';
import NotFound from "./pages/OtherPage/NotFound";
import UserProfile from "./pages/ProfilePage";
import  Calendar from "./pages/Calendar";
import DashboardHome from "./pages/Dashboard/Home";
import React from "react";
import { SignedOut } from "./pages/SignedOut";
import Loader from './components/common/Loader';
import { useMongoDbClient } from './services/mongoDbClient';
import Marketing from "./pages/Dashboard/Marketing";
import MarketingOverview from "./pages/MarketingOverview";
import { UnsavedChangesModal } from "./components/UnsavedChangesModal";

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
  const { isLoading, isAuthenticated, error: auth0Error, user } = useAuth0();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();
  const [userMetadata, setUserMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
  const { updateUser } = useMongoDbClient();
  const initializationAttempted = useRef(false);
  
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

  const handleCancelNavigation = () => {
    setNavigationState({
      isModalOpen: false,
      pendingPath: null,
    });
  };

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
          // firstName: user?.given_name || '',
          // lastName: user?.family_name || '',
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
    <NavigationContext.Provider value={{ 
      handleNavigation, 
      hasUnsavedChanges, 
      setHasUnsavedChanges 
    }}>
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
                  <Route path="/marketing-overview" element={<MarketingOverview />} />
                  {/* <Route path="/mypage" element={<Mypage />} /> */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              ) : (
                <Route path="*" element={<Navigate to="/signed-out" replace />} />
              )}
            </Routes>
            
            {/* Add the blocking modal */}
            <UnsavedChangesModal
              isOpen={navigationState.isModalOpen}
              onConfirm={handleConfirmNavigation}
              onDiscard={handleConfirmNavigation}
              onClose={handleCancelNavigation}
            />
          </div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
}

export default App;


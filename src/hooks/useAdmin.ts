import { useAuth0 } from '@auth0/auth0-react';
import { UserRoleStorage } from "../utils/userStorage";
import { useGlobalStorage } from '../hooks/useGlobalStorage'; 
import { useState } from 'react'; // Adding import statement for useState from React
import { useEffect } from 'react'; // Adding import statement for useEffect from React

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

type UserRole = "user" | "admin" | "manager" | "super-admin";

export const useAdmin = () => {
  const { user } = useAuth0();
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = () => {
      if (!user?.email) {
        setIsAdmin(false);
        setIsLoading(false);
        console.log("Setting isLoading false from useAdmin ");
        return;
      }

      const currentUserRole = UserRoleStorage.getRole(user.email);
      const isAdminUser = currentUserRole === 'admin' || currentUserRole === 'super-admin';
      setIsAdmin(isAdminUser);
      console.log("Setting isLoading false from useAdmin & User is Admin");
      setIsLoading(false);
    };

    if (userMetadata) {
      checkAdminStatus(); 
    } else {
      setIsLoading(false); 
    }
  }, [user, userMetadata]); 

  return { isAdmin, isLoading };
};


// export const useAdmin = () => {
//   const { isAuthenticated, isLoading: isAuth0Loading } = useAuth0();
//   const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);
//   const { error: auth0Error, user } = useAuth0();
//   const [state, setState] = useState({
//     isAdmin: false,
//     isLoading: true,
//     role: null as "admin" | "user" | "manager" | "super-admin" | null
//   });

//   useEffect(() => {
//     const checkAdminStatus = () => {
//       console.log("Cuser?.email:", user?.email);
//       if (!user?.email) {
//         return { isAdminUser: false, role: null };
//       }
    
//       const currentUserRole = UserRoleStorage.getRole(user.email);
//       console.log("Current user role from storage:", currentUserRole);
    
//       const isAdminUser = 
//         currentUserRole === 'admin' || 
//         currentUserRole === 'super-admin';
    
//       return { isAdminUser, role: currentUserRole };
//     };

//     if (!isAuth0Loading) {
//       console.log("isAuth0Loading: ", !isAuth0Loading);
//       if (userMetadata) {
//         // When user logs in, store their role first
//         if (user?.email && userMetadata?.profile?.role) {
//           UserRoleStorage.storeRole(user.email, userMetadata.profile.role);
//         }
    
//         // Then check admin status which will use the stored role
//         const { isAdminUser, role } = checkAdminStatus();
        
//         setState({
//           isAdmin: isAuthenticated && isAdminUser,
//           isLoading: false,
//           role
//         });
//       } else {
//         // If no metadata, still check admin status from stored role
//         const { isAdminUser, role } = checkAdminStatus();
//         setState({
//           isAdmin: isAuthenticated && isAdminUser,
//           isLoading: false,
//           role
//         });
//       }
//     }
//   }, [isAuth0Loading, isAuthenticated, userMetadata]);

//   useEffect(() => {
//     console.log("User role updated:", state.role);
//     // Perform any actions that depend on the updated role here
//   }, [state.role]);

//   return state;
// };

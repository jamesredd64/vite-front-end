import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { UserInfoCard } from "../components/UserProfile/UserInfoCard";
import { UserMetaCard } from "../components/UserProfile/UserMetaCard";
import { UserAddressCard } from "../components/UserProfile/UserAddressCard";
import { UserMarketingCard } from "../components/UserProfile/UserMarketingCard";
import { UserMetadata } from "../types/user";
import { useMongoDbClient } from "../services/mongoDbClient";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

interface UserData {
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profile: {
    dateOfBirth?: Date;
    gender?: string;
    profilePictureUrl?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

const UserProfile = () => {
  const { user, isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { getUserById, updateUser } = useMongoDbClient();
  const [userData, setUserData] = useState<UserData>({
    auth0Id: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    profile: {
      dateOfBirth: undefined,
      gender: "",
      profilePictureUrl: "",
      marketingBudget: {
        frequency: "monthly",
        adBudget: 0,
        costPerAcquisition: 0,
        dailySpendingLimit: 0,
        marketingChannels: "",
        monthlyBudget: 0,
        preferredPlatforms: "",
        notificationPreferences: [], // Changed from false to empty array
        roiTarget: 0,
      },
    },
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    isActive: true,
    
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  // Clear save status after 15 seconds
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (saveStatus) {
      timeoutId = setTimeout(() => {
        setSaveStatus(null);
      }, 15000); // 15 seconds
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [saveStatus]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isAuthenticated && user?.sub) {
        setIsLoading(true);
        try {
          const response = await getUserById(user.sub);
          if (response) {
            setUserData({
              auth0Id: response.auth0Id || "",
              email: response.email || "",
              firstName: response.firstName || "",
              lastName: response.lastName || "",
              phoneNumber: response.phoneNumber || "",
              profile: {
                dateOfBirth: response.profile?.dateOfBirth,
                gender: response.profile?.gender || "",
                profilePictureUrl: response.profile?.profilePictureUrl || "",
                marketingBudget: {
                  
                  frequency:
                    response.profile?.marketingBudget?.frequency || "monthly",
                  adBudget: response.profile?.marketingBudget?.adCosts || 0,
                  costPerAcquisition:
                    response.profile?.marketingBudget?.costPerAcquisition || 0,
                  dailySpendingLimit:
                    response.profile?.marketingBudget?.dailySpendingLimit || 0,
                  marketingChannels:
                    response.profile?.marketingBudget?.marketingChannels || '',
                  monthlyBudget:
                    response.profile?.marketingBudget?.monthlyBudget || 0,
                  preferredPlatforms:
                    response.profile?.marketingBudget?.preferredPlatforms || '',
                  notificationPreferences:
                    response.profile?.marketingBudget?.notificationPreferences || '',
                  roiTarget: response.profile?.marketingBudget?.notificationPreferences || 0,
                },
              },
              address: {
                street: response.address?.street || "",
                city: response.address?.city || "",
                state: response.address?.state || "",
                zipCode: response.address?.zipCode || "",
                country: response.address?.country || "",
              },
              isActive: response.isActive ?? true,
              createdAt: response.createdAt,
              updatedAt: response.updatedAt,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [isAuthenticated, user, getUserById]);

  const handleUpdate = (updatedInfo: Partial<UserData>) => {
    console.log("Handling update with:", updatedInfo);
    setUserData((prevUserData) => {
      const newData: UserData = {
        ...prevUserData,
        ...updatedInfo,
        profile: {
          ...prevUserData.profile,
          ...(updatedInfo.profile || {}),
        },
        address: {
          street: prevUserData.address?.street || "",
          city: prevUserData.address?.city || "",
          state: prevUserData.address?.state || "",
          zipCode: prevUserData.address?.zipCode || "",
          country: prevUserData.address?.country || "",
          ...(updatedInfo.address || {}),
        },
      };
      return newData;
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    try {
      console.log("Saving user data:", userData);
      const transformedData: Partial<UserMetadata> = {
        ...userData,
        address: userData.address
          ? {
              ...userData.address,
            }
          : undefined,
      };
      await updateUser(userData.auth0Id, transformedData);
      setSaveStatus({ message: "Changes Saved Successfully", isError: false });
    } catch (error) {
      console.error("Error updating user data:", error);
      setSaveStatus({
        message: "Something went wrong, please try again",
        isError: true,
      });
    }
  };

  return (
    <>
      <PageMeta
        title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/50 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6"></div>
        <UserMetaCard
          onUpdate={(newInfo: Partial<UserMetadata>) => {
            handleUpdate({
              firstName: newInfo.firstName,
              lastName: newInfo.lastName,
              profile: {
                ...userData.profile,
                profilePictureUrl: newInfo.profile?.profilePictureUrl
              }
            });
          }}
          initialData={{
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            profilePictureUrl: userData.profile.profilePictureUrl || ""
          }}
        />
        <UserMarketingCard            
          onUpdate={(newInfo: Partial<UserMetadata>) => {
            handleUpdate({
              profile: {
                ...userData.profile,
                marketingBudget: newInfo.profile?.marketingBudget || userData.profile.marketingBudget
              }
            });
          }}
          initialData={{
            marketingBudget: userData.profile.marketingBudget
          }}
        />
        <UserInfoCard
          onUpdate={(newInfo: Partial<UserMetadata>) => {
            handleUpdate({
              firstName: newInfo.firstName,
              lastName: newInfo.lastName,
              email: newInfo.email,
              phoneNumber: newInfo.phoneNumber,
            });
          }}
          initialData={{
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            phoneNumber: userData.phoneNumber,
          }}
        />
        <UserAddressCard
          onUpdate={(newInfo: Partial<UserMetadata>) => {
            handleUpdate({
              address: {
                ...userData.address,
                ...newInfo.address,
                street:
                  newInfo.address?.street || userData.address?.street || "",
                city: newInfo.address?.city || userData.address?.city || "",
                state: newInfo.address?.state || userData.address?.state || "",
                zipCode:
                  newInfo.address?.zipCode || userData.address?.zipCode || "",
                country:
                  newInfo.address?.country || userData.address?.country || "",
              },
            });
          }}
          initialData={{
            address: {
              street: userData.address?.street || "",
              city: userData.address?.city || "",
              state: userData.address?.state || "",
              zipCode: userData.address?.zipCode || "",
              country: userData.address?.country || "",
            },
          }}
        />

        {/* Save Status Message Container with fixed height */}
        <div className="h-8 flex items-center justify-center">
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

        {/* Centered button container */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
                fill=""
              />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

function getUserById(sub: any) {
  throw new Error("Function not implemented.");
}

// import React, { useState, useEffect } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { UserInfoCard } from '../components/UserProfile/UserInfoCard';
// import { UserMetaCard } from '../components/UserProfile/UserMetaCard';
// import { UserAddressCard } from '../components/UserProfile/UserAddressCard';
// import { UserMarketingCard } from '../components/UserProfile/UserMarketingCard';
// import { UserMetadata } from '../types/user';
// import { useMongoDbClient } from '../services/mongoDbClient';
// import PageMeta from "../components/common/PageMeta";
// import PageBreadcrumb from "../components/common/PageBreadCrumb";

// interface UserData {
//   auth0Id: string;
//   email: string;
//   name: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   dateOfBirth: string;
//   gender: string;
//   profilePictureUrl: string;

//   // Marketing and Budget fields
//   adBudget: number;
//   costPerAcquisition: number;
//   dailySpendingLimit: number;
//   marketingChannels: string;
//   monthlyBudget: number;
//   preferredPlatforms: string;
//   notificationPreferences: boolean;
//   roiTarget: number;

//   profile: {
//     dateOfBirth?: string;
//     gender?: string;
//     profilePictureUrl?: string;
//     marketingBudget: {
//       amount: number;
//       frequency: 'daily' | 'monthly' | 'quarterly' | 'yearly';
//       adCosts: number;
//     }
//   };

//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };

//   isActive: boolean;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const UserProfile = () => {
//   const { user, isAuthenticated, isLoading: auth0Loading } = useAuth0();
//   const { getUserById, updateUser } = useMongoDbClient();
//   const [userData, setUserData] = useState<UserData>({
//     auth0Id: '',
//     email: '',
//     name: '',
//     firstName: '',
//     lastName: '',
//     phoneNumber: '',
//     dateOfBirth: '',
//     gender: '',
//     profilePictureUrl: '',

//     // Initialize marketing and budget fields
//     adBudget: 0,
//     costPerAcquisition: 0,
//     dailySpendingLimit: 0,
//     marketingChannels: '',
//     monthlyBudget: 0,
//     preferredPlatforms: '',
//     notificationPreferences: false,
//     roiTarget: 0,

//     profile: {
//       dateOfBirth: '',
//       gender: '',
//       profilePictureUrl: '',
//       marketingBudget: {
//         amount: 0,
//         frequency: 'monthly',
//         adCosts: 0
//       }
//     },

//     address: {
//       street: '',
//       city: '',
//       state: '',
//       zipCode: '',
//       country: ''
//     },

//     isActive: true
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [saveStatus, setSaveStatus] = useState<{ message: string; isError: boolean } | null>(null);

//   // Clear save status after 15 seconds
//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout;
//     if (saveStatus) {
//       timeoutId = setTimeout(() => {
//         setSaveStatus(null);
//       }, 15000); // 15 seconds
//     }
//     return () => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
//     };
//   }, [saveStatus]);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (isAuthenticated && user?.sub) {
//         setIsLoading(true);
//         try {
//           const response = await getUserById(user.sub);
//           if (response) {
//             setUserData({
//               auth0Id: response.auth0Id || '',
//               email: response.email || '',
//               name: response.name || '',
//               firstName: response.firstName || '',
//               lastName: response.lastName || '',
//               phoneNumber: response.phoneNumber || '',
//               dateOfBirth: response.dateOfBirth || '',
//               gender: response.gender || '',
//               profilePictureUrl: response.profilePictureUrl || '',

//               adBudget: response.adBudget || 0,
//               costPerAcquisition: response.costPerAcquisition || 0,
//               dailySpendingLimit: response.dailySpendingLimit || 0,
//               marketingChannels: response.marketingChannels || '',
//               monthlyBudget: response.monthlyBudget || 0,
//               preferredPlatforms: response.preferredPlatforms || '',
//               notificationPreferences: response.notificationPreferences || false,
//               roiTarget: response.roiTarget || 0,

//               profile: {
//                 dateOfBirth: response.profile?.dateOfBirth || '',
//                 gender: response.profile?.gender || '',
//                 profilePictureUrl: response.profile?.profilePictureUrl || '',
//                 marketingBudget: {
//                   amount: response.profile?.marketingBudget?.amount || 0,
//                   frequency: response.profile?.marketingBudget?.frequency || 'monthly',
//                   adCosts: response.profile?.marketingBudget?.adCosts || 0
//                 }
//               },

//               address: {
//                 street: response.address?.street || '',
//                 city: response.address?.city || '',
//                 state: response.address?.state || '',
//                 zipCode: response.address?.zipCode || '',
//                 country: response.address?.country || ''
//               },

//               isActive: response.isActive ?? true,
//               createdAt: response.createdAt,
//               updatedAt: response.updatedAt
//             });
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     fetchUserData();
//   }, [isAuthenticated, user, getUserById]);

//   const handleUpdate = (updatedInfo: Partial<UserData>) => {
//     console.log('Handling update with:', updatedInfo);
//     setUserData(prevUserData => {
//       const newData: UserData = {
//         ...prevUserData,
//         ...updatedInfo,
//         profile: {
//           ...prevUserData.profile,
//           ...(updatedInfo.profile || {})
//         },
//         address: {
//           street: prevUserData.address?.street || '',
//           city: prevUserData.address?.city || '',
//           state: prevUserData.address?.state || '',
//           zipCode: prevUserData.address?.zipCode || '',
//           country: prevUserData.address?.country || '',
//           ...(updatedInfo.address || {})
//         }
//       };
//       return newData;
//     });
//   };

//   const handleSubmit = async (event: { preventDefault: () => void; }) => {
//     event.preventDefault();
//     try {
//       console.log('Saving user data:', userData);
//       const transformedData: Partial<UserMetadata> = {
//         ...userData,
//         address: userData.address ? {
//           ...userData.address
//         } : undefined
//       };
//       await updateUser(userData.auth0Id, transformedData);
//       setSaveStatus({ message: "Changes Saved Successfully", isError: false });
//     } catch (error) {
//       console.error('Error updating user data:', error);
//       setSaveStatus({ message: "Something went wrong, please try again", isError: true });
//     }
//   };

//   return (
//     <>
//       <PageMeta
//         title="React.js Profile Dashboard | TailAdmin - Next.js Admin Dashboard Template"
//         description="This is React.js Profile Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <PageBreadcrumb pageTitle="Profile" />
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800/50 lg:p-6">
//         <div className="flex flex-wrap items-center justify-between gap-3 mb-6"></div>

//         <UserMetaCard
//           onUpdate={(newInfo: Partial<UserMetadata>) => {
//             handleUpdate({
//               name: newInfo.name,
//               firstName: newInfo.firstName,
//               lastName: newInfo.lastName,
//               email: newInfo.email,
//               // phoneNumber: newInfo.phoneNumber,
//               // dateOfBirth: newInfo.dateOfBirth,
//               // gender: newInfo.gender,
//               // profilePictureUrl: newInfo.profilePictureUrl,
//               // profile: {
//               //   ...userData.profile,
//               //   dateOfBirth: newInfo.dateOfBirth,
//               //   gender: newInfo.gender,
//               //   profilePictureUrl: newInfo.profilePictureUrl
//             });
//           }} initialData={{
//             email: userData.email,
//             firstName: userData.firstName,
//             lastName: userData.lastName,
//             phoneNumber: '',
//             address: '',
//             city: '',
//             state: '',
//             zipCode: '',
//             country: '',
//             company: '',
//             jobTitle: '',
//             bio: '',
//             website: '',

//             profilePictureUrl: ''
//           }});
//           }}
//           initialData={{
//             profilePictureUrl: userData.profile.profilePictureUrl || ''
//             email: userData.email,
//             name: userData.name,
//             firstName: userData.firstName,
//             lastName: userData.lastName,
//             phoneNumber: userData.phoneNumber,
//             profilePictureUrl: userData.profilePictureUrl,
//             dateOfBirth: userData.dateOfBirth,
//             gender: userData.gender,
//             address: userData.address.street,
//             city: userData.address.city,
//             state: userData.address.state,
//             zipCode: userData.address.zipCode,
//             country: userData.address.country,

//           }}
//         />

//         <UserMarketingCard
//           onUpdate={(newInfo: Partial<UserMetadata>) => {
//             handleUpdate({
//               adBudget: newInfo.adBudget,
//               costPerAcquisition: newInfo.costPerAcquisition,
//               dailySpendingLimit: newInfo.dailySpendingLimit,
//               marketingChannels: newInfo.marketingChannels,
//               monthlyBudget: newInfo.monthlyBudget,
//               // preferredPlatforms: newInfo.preferredPlatforms,
//               // notificationPreferences: newInfo.notificationPreferences,
//               // roiTarget: newInfo.roiTarget,
//               profile: {
//                 ...userData.profile,
//                 marketingBudget: newInfo.marketingBudget
//               }
//             });
//           }}
//           initialData={{
//             adBudget: userData.adBudget,
//             costPerAcquisition: userData.costPerAcquisition,
//             dailySpendingLimit: userData.dailySpendingLimit,
//             marketingChannels: userData.marketingChannels,
//             monthlyBudget: userData.monthlyBudget,
//             preferredPlatforms: userData.preferredPlatforms,
//             notificationPreferences: userData.notificationPreferences,
//             roiTarget: userData.roiTarget,
//             marketingBudget: userData.profile.marketingBudget
//           }}
//         />
//         <UserInfoCard
//           onUpdate={(newInfo: Partial<UserMetadata>) => {
//             handleUpdate({
//               firstName: newInfo.firstName,
//               lastName: newInfo.lastName,
//               email: newInfo.email,
//               phoneNumber: newInfo.phoneNumber
//             });
//           }}
//           initialData={{
//             firstName: userData.firstName,
//             lastName: userData.lastName,
//             email: userData.email,
//             phoneNumber: userData.phoneNumber
//           }}
//         />
//         <UserAddressCard
//           onUpdate={(newInfo: Partial<UserMetadata>) => {
//             handleUpdate({
//               address: {
//                 ...userData.address,
//                 ...newInfo.address,
//                 street: (newInfo.address?.street || userData.address?.street || ''),
//                 city: (newInfo.address?.city || userData.address?.city || ''),
//                 state: (newInfo.address?.state || userData.address?.state || ''),
//                 zipCode: (newInfo.address?.zipCode || userData.address?.zipCode || ''),
//                 country: (newInfo.address?.country || userData.address?.country || '')
//               }
//             });
//           }}
//           initialData={{
//             address: {
//               street: userData.address?.street || '',
//               city: userData.address?.city || '',
//               state: userData.address?.state || '',
//               zipCode: userData.address?.zipCode || '',
//               country: userData.address?.country || ''
//             }
//           }}
//         />

//         {/* Save Status Message Container with fixed height */}
//         <div className="h-8 flex items-center justify-center">
//           {saveStatus && (
//             <span className={`text-center ${
//               saveStatus.isError ? 'text-red-500' : 'text-green-500'
//             }`}>
//               {saveStatus.message}
//             </span>
//           )}
//         </div>

//         {/* Centered button container
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleSubmit}
//             className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
//           >
//             <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z" fill=""/>
//             </svg>
//             Save Changes
//           </button>
//         </div> */}
//       </div>
//     </>
//   );
// };

// export default UserProfile;

// function getUserById(sub: any) {
//     throw new Error('Function not implemented.');
// }

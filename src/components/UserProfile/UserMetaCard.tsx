import React, { useState, useEffect } from "react";
import  UserMetadata  from "../../types/user.js";
import Button from "../ui/button/Button.js";
import { useAuth0 } from "@auth0/auth0-react";
// import { useUserProfileStore } from "../../stores/userProfileStore";
import Input from "../form/input/InputField.js";
import Label from "../form/Label.js";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
// import  User  from "../../../server/src/models/user.js";
// const { user, isAuthenticated, isLoading: auth0Loading } = useAuth0();


interface UserMetaCardProps {
  onUpdate: (newInfo: Partial<UserMetadata>) => void;
  initialData: {
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    profilePictureUrl: string;
  };
}

export const UserMetaCard: React.FC<UserMetaCardProps> = ({
  onUpdate,
  initialData,
}) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth0();
  // const userProfile = useUserProfileStore();

  // Initialize local state with initialData
  const [formData, setFormData] = useState({
    email: initialData.email || "",
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    name: initialData.name || "",
    profilePictureUrl: initialData.profilePictureUrl || "",
  });

  // const hasAnyChanges = userProfile.hasUnsavedChanges;

  // Update local state when initialData changes
  useEffect(() => {
    // Add check to prevent unnecessary updates
    if (
      JSON.stringify(formData) !==
      JSON.stringify({
        email: initialData.email || "",
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        name: user?.name || "",
        profilePictureUrl: initialData.profilePictureUrl || user?.picture || "",
      })
    ) {
      setFormData({
        email: initialData.email || "",
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        name: initialData.name || "",
        profilePictureUrl: initialData.profilePictureUrl || user?.picture || "",
      });
    }
  }, [initialData, user?.picture]); // Remove formData from dependencies

  const handleInputChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      onUpdate(formData);
      closeModal();
    } catch (error) {
      console.error("Error saving meta info:", error);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 group hover:bg-gray-50 dark:hover:bg-gray-800/50">
      {/* <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="font-medium text-black dark:text-white">User Profile</h3>
      </div> */}

      {/* Display Card Content */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 mt-5">
            <img
              src={formData.profilePictureUrl}
              alt={""}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left"></h4>
            <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
              {formData.firstName} {formData.lastName  || user?.name} 
            </p>
            <p className="text-gray-600 dark:text-gray-400">
            {formData.email || user?.email || "No email available"}
              <br />
            </p>
          </div>
          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end mt-3">
            <div className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
                  fill=""
                />
              </svg>
            </div>

            <div className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
                  fill=""
                />
              </svg>
            </div>

            <div className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
                  fill=""
                />
              </svg>
            </div>

            <div className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.8 1.9c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm0 3.8c-1.7 0-3.1 1.4-3.1 3.1v7.4c0 .5.4.9.9.9h4.4c.5 0 .9-.4.9-.9v-7.4c0-1.7-1.4-3.1-3.1-3.1zm8.4 0c-1.7 0-3.1 1.4-3.1 3.1v7.4c0 .5.4.9.9.9h4.4c.5 0 .9-.4.9-.9v-4.4c0-1.7-1.4-3.1-3.1-3.1zm0 2.2c.5 0 .9.4.9.9v4.4c0 .5-.4.9-.9.9h-2.2v-5.3c0-.5.4-.9.9-.9h2.2z"
                  fill=""
                />
              </svg>
            </div>
          </div>
        </div>
         <button
            onClick={openModal}
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 min-w-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg
              className="fill-current"
              width="16"
              height="16"
              viewBox="0 0 16 16"
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
            Edit
          </button> 
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="!w-[33vw]">
        <div className="p-6 bg-white rounded-lg dark:bg-gray-800 ">
          <h2 className="text-xl font-semibold mb-4">Edit Meta Information</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  value={formData.firstName}
                  onChange={handleInputChange("firstName")}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange("lastName")}
                />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  type="text"
                  value={formData.email}
                  disabled={true}
                  className="text-gray-700 dark:text-gray-300 opacity-75"
                  onChange={handleInputChange("email")}
                />
              </div>
              <div>
                <Label>Avatar</Label>
                <Input
                  type="text"
                  value={formData.profilePictureUrl}
                  disabled={true}
                  className="text-gray-700 dark:text-gray-300 opacity-75"
                  onChange={handleInputChange("profilePictureUrl")}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button onClick={closeModal} variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UserMetaCard;

// interface UserMetaCardProps {
//   onUpdate: (newInfo: Partial<UserMetadata>) => void;
//   initialData: {
//     phoneNumber: string;
//     address: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//     preferences: {};
//     email: string;
//     firstName: string;
//     lastName: string;
//     profilePictureUrl: string;

//   };
// }

// export const UserMetaCard: React.FC<UserMetaCardProps> = ({ onUpdate, initialData }) => {
//   const { isOpen, openModal, closeModal } = useModal();
//   const { user } = useAuth0();
//   const userProfile = useUserProfileStore();
//   const [saveStatus, setSaveStatus] = useState<{ message: string; isError: boolean } | null>(null);

//   // Use the global hasUnsavedChanges state from userProfile store
//   const hasAnyChanges = userProfile.hasUnsavedChanges;

//   // Initialize local state with ALL fields from initialData
//   const [formData, setFormData] = useState({
//     email: initialData.email || '',
//     firstName: initialData.firstName || '',
//     lastName: initialData.lastName || '',
//     profilePictureUrl: initialData.profilePictureUrl || '',
//     phoneNumber: initialData.phoneNumber || '',
//     address: initialData.address || '',
//     city: initialData.city || '',
//     state: initialData.state || '',
//     zipCode: initialData.zipCode || '',
//     country: initialData.country || '',
//     company: initialData.company || '',
//     jobTitle: initialData.jobTitle || '',
//     bio: initialData.bio || '',
//     website: initialData.website || '',
//     socialLinks: initialData.socialLinks || {},
//     preferences: initialData.preferences || {}
//   });

//   // Clear save status after 5 seconds
//   useEffect(() => {
//     let timeoutId: NodeJS.Timeout;
//     if (saveStatus) {
//       timeoutId = setTimeout(() => {
//         setSaveStatus(null);
//       }, 5000);
//     }
//     return () => {
//       if (timeoutId) {
//         clearTimeout(timeoutId);
//       }
//     };
//   }, [saveStatus]);

//   // Update local state when initialData changes
//   useEffect(() => {
//     setFormData({
//       email: initialData.email || '',
//       firstName: initialData.firstName || '',
//       lastName: initialData.lastName || '',
//       profilePictureUrl: initialData.profilePictureUrl || '',
//       phoneNumber: initialData.phoneNumber || '',
//       address: initialData.address || '',
//       city: initialData.city || '',
//       state: initialData.state || '',
//       zipCode: initialData.zipCode || '',
//       country: initialData.country || '',
//       company: initialData.company || '',
//       jobTitle: initialData.jobTitle || '',
//       bio: initialData.bio || '',
//       website: initialData.website || '',
//       socialLinks: initialData.socialLinks || {},
//       preferences: initialData.preferences || {}
//     });
//   }, [initialData]);

//   // Add debugging for state comparison
//   const hasChanges = useMemo(() => {
//     console.log('Current formData:', formData);
//     console.log('Initial Data:', initialData);

//     const changes = Object.keys(formData).some(key => {
//       const hasChange = formData[key as keyof typeof formData] !== initialData[key as keyof typeof initialData];
//       console.log(`Comparing ${key}:`, formData[key as keyof typeof formData], initialData[key as keyof typeof initialData], hasChange);
//       return hasChange;
//     });

//     console.log('Has changes:', changes);
//     return changes;
//   }, [formData, initialData]);

//   const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     console.log('Input changed:', field, e.target.value);
//     setFormData(prev => ({
//       ...prev,
//       [field]: e.target.value
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       if (!user?.sub) return;

//       // Transform formData to match UserMetadata structure
//       const transformedData: Partial<UserMetadata> = {
//         email: formData.email,
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         profilePictureUrl: formData.profilePictureUrl,
//         phoneNumber: formData.phoneNumber,
//         address: {
//           street: formData.address,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           country: formData.country
//         }
//       };

//       // Update through the store
//       onUpdate(transformedData);
//       setSaveStatus({ message: "Changes saved successfully", isError: false });

//       // Close the modal
//       closeModal();
//     } catch (error) {
//       console.error('Error saving meta info:', error);
//       setSaveStatus({ message: "Error saving changes", isError: true });
//     }
//   };

//   return (
//     <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 group">
//       {/* Save Status Message */}
//       {saveStatus && (
//         <div className="mt-4 flex justify-center">
//           <span className={`text-center ${
//             saveStatus.isError ? 'text-red-500' : 'text-green-500'
//           }`}>
//             {saveStatus.message}
//           </span>
//         </div>
//       )}

//       <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
//         <h3 className="font-medium text-black dark:text-white">
//           User Profile
//         </h3>
//       </div>

//       {/* Display Card Content */}
//       <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
//         <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
//           <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
//             {/* Profile Picture */}
//             <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
//               <img src={formData.profilePictureUrl} alt={formData.firstName} className="w-full h-full object-cover" />
//             </div>

//             {/* Email Section */}
//             <div className="order-3 xl:order-2">
//               <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
//                 {`${formData.firstName} ${formData.lastName}`}
//               </h4>
//               <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
//                 {formData.email}
//               </p>
//             </div>

//             {/* Social Icons */}
//             <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
//               <div
//                 className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
//               >
//                 <svg
//                   className="fill-current"
//                   width="20"
//                   height="20"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z"
//                     fill=""
//                   />
//                 </svg>
//               </div>

//               <div
//                 className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
//               >
//                 <svg
//                   className="fill-current"
//                   width="20"
//                   height="20"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M15.1708 1.875H17.9274L11.9049 8.75833L18.9899 18.125H13.4424L9.09742 12.4442L4.12578 18.125H1.36745L7.80912 10.7625L1.01245 1.875H6.70078L10.6283 7.0675L15.1708 1.875ZM14.2033 16.475H15.7308L5.87078 3.43833H4.23162L14.2033 16.475Z"
//                     fill=""
//                   />
//                 </svg>
//               </div>

//               <div
//                 className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
//               >
//                 <svg
//                   className="fill-current"
//                   width="20"
//                   height="20"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M5.78381 4.16645C5.78351 4.84504 5.37181 5.45569 4.74286 5.71045C4.11391 5.96521 3.39331 5.81321 2.92083 5.32613C2.44836 4.83904 2.31837 4.11413 2.59216 3.49323C2.86596 2.87233 3.48886 2.47942 4.16715 2.49978C5.06804 2.52682 5.78422 3.26515 5.78381 4.16645ZM5.83381 7.06645H2.50048V17.4998H5.83381V7.06645ZM11.1005 7.06645H7.78381V17.4998H11.0672V12.0248C11.0672 8.97475 15.0422 8.69142 15.0422 12.0248V17.4998H18.3338V10.8914C18.3338 5.74978 12.4505 5.94145 11.0672 8.46642L11.1005 7.06645Z"
//                     fill=""
//                   />
//                 </svg>
//               </div>

//               <div
//                 className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
//               >
//                 <svg
//                   className="fill-current"
//                   width="20"
//                   height="20"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M5.8 1.9c-.5 0-.9.4-.9.9s.4.9.9.9.9-.4.9-.9-.4-.9-.9-.9zm0 3.8c-1.7 0-3.1 1.4-3.1 3.1v7.4c0 .5.4.9.9.9h4.4c.5 0 .9-.4.9-.9v-7.4c0-1.7-1.4-3.1-3.1-3.1zm8.4 0c-1.7 0-3.1 1.4-3.1 3.1v7.4c0 .5.4.9.9.9h4.4c.5 0 .9-.4.9-.9v-4.4c0-1.7-1.4-3.1-3.1-3.1zm0 2.2c.5 0 .9.4.9.9v4.4c0 .5-.4.9-.9.9h-2.2v-5.3c0-.5.4-.9.9-.9h2.2z"
//                     fill=""
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Global Save Button - visible when ANY card has changes */}
//       <div className={`flex justify-center mt-6 transition-opacity duration-200 ${!hasAnyChanges ? 'opacity-0' : 'opacity-100'}`}>
//         <button
//           onClick={handleSave}
//           disabled={!hasAnyChanges}
//           className={`inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium shadow-theme-xs transform transition-all duration-200
//             ${!hasAnyChanges
//               ? 'cursor-not-allowed text-gray-400 dark:text-gray-600'
//               : 'text-gray-700 hover:bg-gray-50 hover:text-gray-800 hover:scale-105 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200'
//             }`}
//         >
//           <svg
//             className={`fill-current ${!hasAnyChanges ? 'opacity-50' : ''}`}
//             width="18"
//             height="18"
//             viewBox="0 0 18 18"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z" fill=""/>
//           </svg>
//           Save All Changes
//         </button>
//       </div>

//       {/* Edit Modal */}
//       <Modal isOpen={isOpen} onClose={closeModal} className="!w-[33vw]">
//         <div className="p-6 bg-white rounded-lg dark:bg-gray-800 ">
//           <h2 className="text-xl font-semibold mb-4">Edit Meta Information</h2>
//           <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//               <div>
//                 <Label>First Name</Label>
//                 <Input
//                   className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                   value={formData.firstName}
//                   onChange={handleInputChange('firstName')}
//                 />
//               </div>
//               <div>
//                 <Label>Last Name</Label>
//                 <Input
//                   type="text"
//                   value={formData.lastName}
//                   onChange={handleInputChange('lastName')}
//                 />
//               </div>
//               <div>
//                 <Label>E-mail</Label>
//                 <Input
//                   type="text"
//                   value={formData.email}
//                   disabled={true}
//                   className="text-gray-700 dark:text-gray-300 opacity-75"
//                   onChange={handleInputChange('email')}
//                 />
//               </div>
//               <div>
//                 <Label>Avatar</Label>
//                 <Input
//                   type="text"
//                   value={formData.profilePictureUrl}
//                   disabled={true}
//                   className="text-gray-700 dark:text-gray-300 opacity-75"
//                   onChange={handleInputChange('profilePictureUrl')}
//                 />
//               </div>
//             </div>
//             <div className="mt-6 flex justify-end gap-4">
//               <Button onClick={closeModal} variant="outline">
//                 Cancel
//               </Button>
//               <Button type="submit">
//                 Save Changes
//               </Button>
//             </div>
//           </form>
//         </div>
//       </Modal>

//     </div>
//   );
// };

// export default UserMetaCard;

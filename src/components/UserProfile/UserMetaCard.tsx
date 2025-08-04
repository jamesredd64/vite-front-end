/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState, useEffect, useCallback } from "react";
import UserMetadata from "../../types/user.js";
import { UserRoles } from "../../types/types";
import Button from "../ui/button/Button.js";
import { useAuth0 } from "@auth0/auth0-react";
import Input from "../form/input/InputField.js";
import Label from "../form/Label.js";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { useUserProfile } from "../../hooks/useUserProfile";
import Radio from "../form/input/Radio";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useAdmin } from "../../hooks/useAdmin.js";
import  Switch  from '../../components/form/switch/Switch';
// import Select from "../form/input/Select";

type UserRole = "showcase_attendee" | "showcase_agent" | "showcase_team" | "showcase_admin";

interface UserMetaCardProps {
  onUpdate: (newInfo: Partial<UserMetadata>) => void;
  initialData: {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    profile: {
      dateOfBirth: string | null;
      gender: string;
      profilePictureUrl: string;
      role: UserRole;
      timezone: string;
    };
    isActive: boolean;
  };
}

const roleOptions: UserRole[] = ["showcase_attendee", "showcase_agent", "showcase_team", "showcase_admin"];
const genderOptions = ["male", "female", "prefer_not_to_say"] as const;

const timezoneOptions = [
  { value: 'America/New_York', label: 'Eastern Standard Time (EST)', displayTime: '2 p.m.' },
  { value: 'America/Chicago', label: 'Central Standard Time (CST)', displayTime: '1 p.m.' },
  { value: 'America/Denver', label: 'Mountain Standard Time (MST)', displayTime: '12 p.m.' },
  { value: 'America/Los_Angeles', label: 'Pacific Standard Time (PST)', displayTime: '11 a.m.' },
  { value: 'America/Anchorage', label: 'Alaska Standard Time (AKST)', displayTime: '10 a.m.' },
  { value: 'Pacific/Honolulu', label: 'Hawaii-Aleutian Standard Time (HST)', displayTime: '8 a.m.' }
];

const getTimezoneLabel = (tzValue: string) => {
  const timezone = timezoneOptions.find(tz => tz.value === tzValue);
  return timezone ? timezone.label : tzValue;
};

export const UserMetaCard: React.FC<UserMetaCardProps> = ({
  onUpdate,
  initialData,
}) => {
  const { user } = useAuth0();
  const userProfile = useUserProfile();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const [isActive, setIsActive] = useState(initialData.isActive);

  const [formData, setFormData] = useState({
    email: initialData.email || "",
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    phoneNumber: initialData.phoneNumber || "",
    profile: {
      dateOfBirth: initialData.profile.dateOfBirth || "",
      gender: initialData.profile.gender || "",
      profilePictureUrl: initialData.profile.profilePictureUrl || user?.picture || "",
      role: initialData.profile.role || 'showcase_attendee',
      timezone: initialData.profile.timezone || "America/New_York",
    },
    isActive: initialData.isActive,
  });

    // Initialize state properly
    const [state, setState] = useState({
      isAdmin: false,
      isLoading: true,
      route: '', // Added route to state
    });

    //  console.log("State is admin", state.isAdmin);

  const handleIsActiveChange = (checked: boolean) => {
    console.log("Is checked " , checked);
    const updates = {
      ...formData,
      isActive: checked,
    };
    setFormData(updates);
    onUpdate(updates);
    userProfile.setHasUnsavedChanges(true);
  };

  
  useEffect(() => {
    if (!adminLoading) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          role: initialData.profile.role
        }
      }));
    }
  }, [adminLoading, initialData.profile.role]);

  if (adminLoading) {
    return <div>Loading...</div>;
  }
  // Calculate date ranges for the date picker
  const today = new Date();
  const maxDate = new Date(today.setFullYear(today.getFullYear() - 18)); // 18 years ago
  const minDate = new Date(today.setFullYear(today.getFullYear() - 92)); // 110 years ago from max date

  // Allow editing if it's the user's own profile or if they're an admin
  const isEditable = true; // Remove admin-only restriction

  const handleInputChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const newValue = e.target.value;
    let updates: Partial<typeof formData>;
    
    if (field.startsWith('profile.')) {
      const profileField = field.split('.')[1];
      // console.log("newValue " , newValue);
      updates = {
        ...formData,
        profile: {
          ...formData.profile,
          [profileField]: newValue,
        },
      };
      // console.log("profileField " , profileField);
    } else {
      updates = {
        ...formData,
        [field]: newValue,
      };
    }
    // console.log("newValue 2" , newValue);
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    onUpdate(updates); // Direct update instead of debounced
    userProfile.setHasUnsavedChanges(true);
  };

  // For immediate updates (like dropdowns, date picker)
  const handleImmediateUpdate = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }));
    onUpdate(updates);
    userProfile.setHasUnsavedChanges(true);
  };

  // Only restrict role changes to admins
  const handleRoleChange = (newRole: string) => {
    if (!isAdmin) return; // Keep role changes admin-only
    
    handleImmediateUpdate({
      ...formData,
      profile: {
        ...formData.profile,
        role: newRole as typeof roleOptions[number],
      },
    });
  };

  const handleGenderChange = (newGender: string) => {
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        gender: newGender,
      },
    }));
    
    onUpdate({
      ...formData,
      profile: {
        ...formData.profile,
        gender: newGender,
      },
    });
    userProfile.setHasUnsavedChanges(true);
  };

  const handleDateOfBirthChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toLocaleDateString("en-US"); // Change formatting for better user readability
      handleImmediateUpdate({
        ...formData,
        profile: {
          ...formData.profile,
          dateOfBirth: formattedDate, // Pass formatted date
        },
      });
    }
  };
  

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      
      // Ensure we're sending the complete profile data
      const updatedData = {
        ...formData,
        profile: {
          ...formData.profile,
          timezone: formData.profile.timezone,
          role: formData.profile.role as UserRole
        }
      };
      
      onUpdate(updatedData);
      userProfile.setHasUnsavedChanges(false);
      closeModal();
    } catch (error) {
      console.error("Error saving meta info:", error);
    }
  };

  // Helper function to format gender display
  const formatGender = (gender: string) => {
    return gender
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper function to format date for display
  const formatDateForDisplay = (dateString: string | null) => {
    if (!dateString) return 'Not Specified';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return 'Invalid Date';
    }
  };

  // Helper function to format phone number
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Remove leading '1' if present for formatting
    const normalizedDigits = digits.startsWith('1') ? digits.slice(1) : digits;
    
    // Only format if we have digits
    if (normalizedDigits.length === 0) return '';
    
    // Format as (XXX) XXX-XXXX
    if (normalizedDigits.length <= 3) {
      return `(${normalizedDigits}`;
    } else if (normalizedDigits.length <= 6) {
      return `(${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(3)}`;
    } else {
      return `(${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(3, 6)}-${normalizedDigits.slice(6, 10)}`;
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limit to 10 digits (excluding the potential leading 1)
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    // Add '1' prefix if not present
    const fullNumber = value.length === 10 ? `1${value}` : value;
    
    const updates = {
      ...formData,
      phoneNumber: fullNumber,
    };
    
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
    onUpdate(updates); // Direct update instead of debounced
    userProfile.setHasUnsavedChanges(true);
  };

  // Add timezone handler
  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimezone = e.target.value;
    
    const updates = {
      profile: {
        ...formData.profile,
        timezone: newTimezone,
      }
    };

    // Update local state
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        timezone: newTimezone,
      },
    }));

    // Trigger the update
    onUpdate(updates);
    userProfile.setHasUnsavedChanges(true);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <img 
              src={formData.profile.profilePictureUrl} 
              alt={formData.firstName || "User"} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {formData.firstName} {formData.lastName}
            </h4>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.email}
                </p>
                {formData.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Phone:
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                      {formatPhoneNumber(formData.phoneNumber)}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    User Role:
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
                    {formData.profile.role}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Gender:
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-50 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300">
                    {formData.profile.gender ? formatGender(formData.profile.gender) : 'Not Specified'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Birth Date:
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {formatDateForDisplay(formData.profile.dateOfBirth)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Timezone:
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                    {getTimezoneLabel(formData.profile.timezone)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <a
                 className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
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
              </a>

              <a
                
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
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
              </a>

              <a
                
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
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
              </a>

              <a
                
                className="flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
              >
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.8567 1.66699C11.7946 1.66854 12.2698 1.67351 12.6805 1.68573L12.8422 1.69102C13.0291 1.69766 13.2134 1.70599 13.4357 1.71641C14.3224 1.75738 14.9273 1.89766 15.4586 2.10391C16.0078 2.31572 16.4717 2.60183 16.9349 3.06503C17.3974 3.52822 17.6836 3.99349 17.8961 4.54141C18.1016 5.07197 18.2419 5.67753 18.2836 6.56433C18.2935 6.78655 18.3015 6.97088 18.3081 7.15775L18.3133 7.31949C18.3255 7.73011 18.3311 8.20543 18.3328 9.1433L18.3335 9.76463C18.3336 9.84055 18.3336 9.91888 18.3336 9.99972L18.3335 10.2348L18.333 10.8562C18.3314 11.794 18.3265 12.2694 18.3142 12.68L18.3089 12.8417C18.3023 13.0286 18.294 13.213 18.2836 13.4351C18.2426 14.322 18.1016 14.9268 17.8961 15.458C17.6842 16.0074 17.3974 16.4713 16.9349 16.9345C16.4717 17.397 16.0057 17.6831 15.4586 17.8955C14.9273 18.1011 14.3224 18.2414 13.4357 18.2831C13.2134 18.293 13.0291 18.3011 12.8422 18.3076L12.6805 18.3128C12.2698 18.3251 11.7946 18.3306 10.8567 18.3324L10.2353 18.333C10.1594 18.333 10.0811 18.333 10.0002 18.333H9.76516L9.14375 18.3325C8.20591 18.331 7.7306 18.326 7.31997 18.3137L7.15824 18.3085C6.97136 18.3018 6.78703 18.2935 6.56481 18.2831C5.67801 18.2421 5.07384 18.1011 4.5419 17.8955C3.99328 17.6838 3.5287 17.397 3.06551 16.9345C2.60231 16.4713 2.3169 16.0053 2.1044 15.458C1.89815 14.9268 1.75856 14.322 1.7169 13.4351C1.707 13.213 1.69892 13.0286 1.69238 12.8417L1.68714 12.68C1.67495 12.2694 1.66939 11.794 1.66759 10.8562L1.66748 9.1433C1.66903 8.20543 1.67399 7.73011 1.68621 7.31949L1.69151 7.15775C1.69815 6.97088 1.70648 6.78655 1.7169 6.56433C1.75786 5.67683 1.89815 5.07266 2.1044 4.54141C2.3162 3.9928 2.60231 3.52822 3.06551 3.06503C3.5287 2.60183 3.99398 2.31641 4.5419 2.10391C5.07315 1.89766 5.67731 1.75808 6.56481 1.71641C6.78703 1.70652 6.97136 1.69844 7.15824 1.6919L7.31997 1.68666C7.7306 1.67446 8.20591 1.6689 9.14375 1.6671L10.8567 1.66699ZM10.0002 5.83308C7.69781 5.83308 5.83356 7.69935 5.83356 9.99972C5.83356 12.3021 7.69984 14.1664 10.0002 14.1664C12.3027 14.1664 14.1669 12.3001 14.1669 9.99972C14.1669 7.69732 12.3006 5.83308 10.0002 5.83308ZM10.0002 7.49974C11.381 7.49974 12.5002 8.61863 12.5002 9.99972C12.5002 11.3805 11.3813 12.4997 10.0002 12.4997C8.6195 12.4997 7.50023 11.3809 7.50023 9.99972C7.50023 8.61897 8.61908 7.49974 10.0002 7.49974ZM14.3752 4.58308C13.8008 4.58308 13.3336 5.04967 13.3336 5.62403C13.3336 6.19841 13.8002 6.66572 14.3752 6.66572C14.9496 6.66572 15.4169 6.19913 15.4169 5.62403C15.4169 5.04967 14.9488 4.58236 14.3752 4.58308Z"
                    fill=""
                  />
                </svg>
              </a>
            </div>
        </div>

        <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
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
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[780px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white border border-gray-200 dark:border-gray-700 no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Profile Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>First Name</Label>
                  <Input
                    type="text"
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
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                  />
                </div>

                <div>
                  <Label>Profile Picture URL</Label>
                  <Input
                    type="text"
                    value={formData.profile.profilePictureUrl}
                    onChange={handleInputChange("profilePictureUrl")}
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label>Gender</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2 sm:grid-cols-3">
                    {genderOptions.map((gender) => (
                      <Radio
                        key={gender}
                        id={`gender-${gender}`}
                        name="gender"
                        value={gender}
                        checked={formData.profile.gender === gender}
                        onChange={handleGenderChange}
                        label={formatGender(gender)}
                        className="capitalize"
                      />
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <Label>Role</Label>
                   <div className="grid grid-cols-2 gap-4 mt-2 sm:grid-cols-4">
                    {roleOptions.map((role) => (
                      <Radio
                        key={role}
                        id={`role-${role}`}
                        name="role"
                        value={role}
                        checked={formData.profile.role === role}
                        onChange={handleRoleChange}
                        label={role.charAt(0).toUpperCase() + role.slice(1)}
                        className="capitalize"
                        // disabled={state.isAdmin} // Disable for non-admins
                      />
                      
                  ))}
                </div>

                </div>

                <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-x-6">
                  <div>
                    <Label>Date of Birth</Label>
                    <div className="relative">
                      <DatePicker
                        selected={formData.profile.dateOfBirth ? new Date(formData.profile.dateOfBirth) : null}
                        onChange={handleDateOfBirthChange}
                        dateFormat="MMMM d, yyyy"
                        maxDate={maxDate}
                        minDate={minDate}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={110}
                        placeholderText="Select your birth date"
                        disabled={!isEditable}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label>Timezone</Label>
                    <div className="relative">
                      <select
                        value={formData.profile.timezone}
                        onChange={handleTimezoneChange}
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                      >
                        {timezoneOptions.map((tz) => (
                          <option key={tz.value} value={tz.value}>
                            {tz.label} | {tz.displayTime}
                          </option>
                        ))}
                      </select>
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                  <Switch                    
                    label="Active Status"
                    defaultChecked={initialData.isActive}
                    onChange={handleIsActiveChange}
                  />
                  <span className="text-sm">User Active Status</span>
                </div>


                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.phoneNumber ? formatPhoneNumber(formData.phoneNumber) : ''}
                    onChange={handlePhoneNumberChange}
                    placeholder="(555) 555-5555"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Update & Close
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UserMetaCard;

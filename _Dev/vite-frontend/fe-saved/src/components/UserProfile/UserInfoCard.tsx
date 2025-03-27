import React, { useState, useEffect } from "react";
import  UserMetadata  from "../../types/user.js";
import Button from "../ui/button/Button.js";
import { useAuth0 } from "@auth0/auth0-react";
import { useUserProfileStore } from '../../stores/userProfileStore';
import Input from "../form/input/InputField.js";
import Label from "../form/Label.js";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";

interface UserInfoCardProps {
  onUpdate: (newInfo: Partial<UserMetadata>) => void;
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ onUpdate, initialData }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { user } = useAuth0();
  const userProfile = useUserProfileStore();
  
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phoneNumber: initialData.phoneNumber || ''
  });

  // Update local state when initialData changes
  useEffect(() => {
    const newFormData = {
      firstName: initialData.firstName || '',
      lastName: initialData.lastName || '',
      email: initialData.email || '',
      phoneNumber: initialData.phoneNumber || ''
    };

    // Only update if the data has actually changed
    if (JSON.stringify(formData) !== JSON.stringify(newFormData)) {
      setFormData(newFormData);
    }
  }, [initialData]); // Remove formData from dependencies

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    userProfile.setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!user?.sub) return;
      onUpdate(formData);
      closeModal();
    } catch (error) {
      console.error('Error saving info:', error);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 group">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <h3 className="font-medium text-black dark:text-white">
          Personal Information
        </h3>
      </div>
      
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                Personal Information Overview
              </h4>
              <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
                Name: {formData.firstName} {formData.lastName}
              </p>
              <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
                Email: {formData.email}
              </p>
              <p className="text-center text-gray-600 dark:text-gray-400 xl:text-left">
                Phone: {formData.phoneNumber}
              </p>
            </div>
          </div>
          <button 
            onClick={openModal} 
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z" fill=""/>
            </svg>
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="!w-[33vw]">
        <div className="p-6 bg-white rounded-lg dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4">Edit Personal Information</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  disabled={true}
                  className="text-gray-700 dark:text-gray-300 opacity-75"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange('phoneNumber')}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button onClick={closeModal} variant="outline">
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};



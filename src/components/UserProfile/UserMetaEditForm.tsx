import React from "react";
import { UserMetadata } from "../../types/user.js";
import Button from "../ui/button/Button.js";
import { Modal } from "../ui/modal/index";

interface UserMetaEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: UserMetadata;
  onSave: (data: Partial<UserMetadata>) => void;
}

const UserMetaEditForm = ({ isOpen, onClose, metadata, onSave }: UserMetaEditFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    onSave({
      // Add your metadata fields here
      firstName: e.currentTarget.firstName.value,
      lastName: e.currentTarget.lastName.value,
      email: e.currentTarget.email.value,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="!w-[50vw]"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Edit Profile Overview
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label 
              htmlFor="firstName" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              defaultValue={metadata.firstName}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label 
              htmlFor="lastName" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              defaultValue={metadata.lastName}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label 
              htmlFor="email" 
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              defaultValue={metadata.email}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserMetaEditForm;

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
  const handleSubmit = () => {
    // Add form submission logic here
    onSave({
      // Add updated metadata fields
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="!w-[50vw]"
    >
      <div className="space-y-4 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Edit Profile Overview
        </h2>
        <div className="space-y-4">
          {/* Add your form fields here */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              type="text"
              className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              defaultValue={metadata.firstName + " " + metadata.lastName}
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              defaultValue={metadata.email}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UserMetaEditForm;
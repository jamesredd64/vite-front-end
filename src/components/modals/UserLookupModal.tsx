import React from 'react';
import { Modal } from '../ui/modal/popover-modal';
import UserLookup from '../../pages/UserLookup';

interface UserLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect?: (selectedUsers: string[]) => void;
}

export const UserLookupModal: React.FC<UserLookupModalProps> = ({
  isOpen,
  onClose,
  onUserSelect
}) => {
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);

  const handleAccept = () => {
    if (onUserSelect) {
      onUserSelect(selectedUsers);
    }
    setSelectedUsers([]); // Reset selected users
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full max-w-6xl p-6"
      zIndex={2000000}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Select Users</h2>
        </div>
        <UserLookup 
          isModal={true} 
          onUserSelect={(users) => setSelectedUsers(users)} 
        />
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </Modal>
  );
};





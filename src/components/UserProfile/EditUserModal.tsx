import React from 'react';
import { Dialog } from '@headlessui/react';
import UserMetadata from '../../types/user';
import { UserInfoCard } from './UserInfoCard';
import { UserAddressCard } from './UserAddressCard';
import { UserMarketingCard } from './UserMarketingCard';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserMetadata;
  onSave: (user: UserMetadata) => Promise<void>;
  activeTab: 'info' | 'address' | 'marketing';
  onTabChange: (tab: 'info' | 'address' | 'marketing') => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
  activeTab,
  onTabChange,
  hasUnsavedChanges,
  setHasUnsavedChanges
}) => {
  const tabs = [
    { id: 'info', label: 'Personal Info' },
    { id: 'address', label: 'Address' },
    { id: 'marketing', label: 'Marketing' }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl shadow-xl">
          <div className="p-6">
            <Dialog.Title className="text-2xl font-semibold mb-6">
              Edit User Profile
            </Dialog.Title>

            <div className="flex space-x-4 mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 rounded-lg ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => onTabChange(tab.id as 'info' | 'address' | 'marketing')}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === 'info' && (
                <UserInfoCard
                  initialData={user}
                  onUpdate={(updates) => {
                    setHasUnsavedChanges(true);
                    onSave({ ...user, ...updates });
                  }}
                />
              )}
              {activeTab === 'address' && (
                <UserAddressCard
                  initialData={{
                    address: user.address || {}
                  }}
                  onUpdate={(updates) => {
                    setHasUnsavedChanges(true);
                    onSave({ ...user, ...(updates as Partial<UserMetadata>) });
                  }}
                />
              )}
              {activeTab === 'marketing' && (
                <UserMarketingCard
                  initialData={{
                    marketingBudget: user.marketingBudget
                  }}
                  onUpdate={(updates) => {
                    setHasUnsavedChanges(true);
                    onSave({ ...user, ...(updates as Partial<UserMetadata>) });
                  }}
                />
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={() => onSave(user)}
                disabled={!hasUnsavedChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};



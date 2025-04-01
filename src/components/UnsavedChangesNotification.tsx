import React from 'react';
import Button from './ui/button/Button';

interface UnsavedChangesNotificationProps {
  onSave: () => void;
  onDiscard: () => void;
}

export const UnsavedChangesNotification: React.FC<UnsavedChangesNotificationProps> = ({
  onSave,
  onDiscard,
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-800/50 w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
            <svg
              className="h-5 w-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              Unsaved Changes
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have unsaved changes. Would you like to save them?
            </p>
          </div>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            variant="outline"
            onClick={onDiscard}
            className="px-3 py-2 text-sm"
          >
            Discard
          </Button>
          <Button
            variant="primary"
            onClick={onSave}
            className="px-3 py-2 text-sm"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};


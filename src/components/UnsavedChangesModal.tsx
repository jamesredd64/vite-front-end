import React from 'react';
import { Modal } from './ui/modal/modal-block';
import Button from './ui/button/Button';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onDiscard: () => void;
  onClose?: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onConfirm,
  onDiscard,
  onClose
}) => {
  console.log('Modal render state:', { isOpen });
  
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose || (() => {})}
      isBlocking={true}
      showCloseButton={false}
      className="max-w-[400px]"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Unsaved Changes
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          You have unsaved changes. Would you like to save them before continuing?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onDiscard}
          >
            Discard Changes
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

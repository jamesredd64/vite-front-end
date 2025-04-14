import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { useAuth0 } from '@auth0/auth0-react';

interface User {
  auth0Id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profile: {
    dateOfBirth: string;
    gender: string;
    profilePictureUrl: string;
    role?: string;
    status?: "active" | "inactive";
  };
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: string[];
  users: User[];
  onNotificationSent?: () => void;  // Add this new prop
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function NotificationModal({ 
  isOpen, 
  onClose, 
  selectedUsers, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  users, 
  onNotificationSent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  userProfilePic 
}: NotificationModalProps & { userProfilePic?: string }) {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'selected' as const,
    recipients: selectedUsers
  });

  // Add effect to log when selectedUsers changes
  useEffect(() => {
    console.log('Selected users updated:', {
      selectedUsersCount: selectedUsers.length,
      selectedUserIds: selectedUsers
    });
    
    setFormData(prev => ({
      ...prev,
      recipients: selectedUsers
    }));
  }, [selectedUsers]);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.sub) {
      console.error('No user ID available');
      setStatus({ type: 'error', message: 'User ID not available. Please try again.' });
      return;
    }

    setLoading(true);
    try {
      const response = await notificationService.createNotification({
        ...formData,
        senderProfilePic: userProfilePic
      }, user.sub);

      console.log('Notification creation response:', response);
      
      setStatus({ type: 'success', message: 'Notification sent successfully!' });
      setTimeout(() => {
        onClose();
        setFormData({ title: '', message: '', type: 'selected', recipients: [] });
        onNotificationSent?.();  // Call the callback after successful notification
      }, 2000);
    } catch (error) {
      console.error('Error creating notification:', error);
      setStatus({ type: 'error', message: 'Failed to send notification. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Log state changes
  // useEffect(() => {
  //   console.log('NotificationModal state updated:', {
  //     isOpen,
  //     formData,
  //     loading,
  //     status,
  //     selectedUsersCount: selectedUsers.length
  //   });
  // }, [isOpen, formData, loading, status, selectedUsers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-theme-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Send Notification to {selectedUsers.length} Users
          </h3>
          <button
            onClick={onClose}
            className="flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status && (
          <div className={`mb-4 p-3 rounded ${
            status.type === 'success' 
              ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
              : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
          }`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                // console.log('Title changed:', e.target.value);
                setFormData({ ...formData, title: e.target.value });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => {
                // console.log('Message changed:', e.target.value);
                setFormData({ ...formData, message: e.target.value });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600' 
                  : 'bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700'
              }`}
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}








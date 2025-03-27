import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserProfileStore } from '../stores/userProfileStore';
import UserMetaCard from '../components/UserProfile/UserMetaCard';
import UserAddressCard from '../components/UserProfile/UserAddressCard';
import { UserInfoCard } from '../components/UserProfile/UserInfoCard';
import UserMarketingCard from '../components/UserProfile/UserMarketingCard';
import Button from '../components/ui/button/Button';
import { Modal } from '../components/ui/modal';
import { UserMetadata } from '../types/user';
import { useMongoDbClient } from '../services/mongoDbClient';

const UserProfiles = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const userProfile = useUserProfileStore();
  const mongoDbClient = useMongoDbClient();
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [navigationPath, setNavigationPath] = useState<string | null>(null);

  const handleUserDataUpdate = (updates: Partial<UserMetadata>) => {
    userProfile.updateProfile(updates);
  };

  const handleSaveAll = async () => {
    if (!user?.sub) return false;
    
    try {
      const success = await userProfile.saveChanges(user.sub, mongoDbClient);
      return success;
    } catch (error) {
      console.error('Failed to save changes:', error);
      return false;
    }
  };

  const handleNavigation = (path: string) => {
    if (userProfile.hasUnsavedChanges) {
      setNavigationPath(path);
      setShowUnsavedModal(true);
    } else {
      navigate(path);
    }
  };

  const handleUnsavedModalConfirm = async () => {
    if (await handleSaveAll()) {
      setShowUnsavedModal(false);
      if (navigationPath) {
        navigate(navigationPath);
      }
    }
  };

  const handleUnsavedModalCancel = () => {
    setShowUnsavedModal(false);
    if (navigationPath) {
      userProfile.resetChanges();
      navigate(navigationPath);
    }
  };

  if (userProfile.isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const currentProfile = userProfile.currentProfile || {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    bio: '',
    company: '',
    position: '',
    industry: ''
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <div className="flex gap-3">
          {userProfile.hasUnsavedChanges && (
            <Button
              onClick={handleSaveAll}
              variant="primary"
              disabled={userProfile.isLoading}
            >
              {userProfile.isLoading ? 'Saving...' : 'Save All Changes'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <UserInfoCard
          onUpdate={handleUserDataUpdate}
          initialData={{
            firstName: currentProfile.firstName,
            lastName: currentProfile.lastName,
            email: currentProfile.email,
            phoneNumber: currentProfile.phoneNumber
          }}
        />
        <UserMetaCard
          onUpdate={handleUserDataUpdate}
          initialData={{
            bio: currentProfile.bio || '',
            company: currentProfile.company || '',
            position: currentProfile.position || '',
            industry: currentProfile.industry || '',
          }}
        />
        <UserAddressCard
          onUpdate={handleUserDataUpdate}
        />
        <UserMarketingCard
          onUpdate={handleUserDataUpdate}
        />
      </div>

      <Modal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Unsaved Changes</h3>
          <p className="mb-4">You have unsaved changes. Would you like to save them before leaving?</p>
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleUnsavedModalCancel}
              variant="outline"
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleUnsavedModalConfirm}
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserProfiles;

import React from 'react';
import UserMetadata from "../../types/user";

interface UserProfileCardProps {
  user: UserMetadata;
  onEdit: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onEdit }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={user.profile.profilePictureUrl || '/default-avatar.png'}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <h3 className="text-xl font-semibold text-black dark:text-white">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-white hover:bg-opacity-90"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-black dark:text-white">Role</p>
          <p className="text-sm text-gray-500">{user.profile.role}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-black dark:text-white">Phone</p>
          <p className="text-sm text-gray-500">{user.phoneNumber || 'N/A'}</p>
        </div>
      </div>

      <div className="border-t border-stroke py-4 dark:border-strokedark">
        <p className="text-sm font-medium text-black dark:text-white">Location</p>
        <p className="text-sm text-gray-500">
          {[user.address.city, user.address.state, user.address.country]
            .filter(Boolean)
            .join(', ') || 'N/A'}
        </p>
      </div>
    </div>
  );
};
import React, { useState } from 'react';

interface UserAvatarProps {
  profilePictureUrl: string | undefined;
  firstName: string;
  lastName: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  profilePictureUrl, 
  firstName = '', 
  lastName = '', 
  className = "h-12 w-12" 
}) => {
  const [imageError, setImageError] = useState(false);

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  if (!profilePictureUrl || imageError) {
    return (
      <div 
        className={`${className} flex items-center justify-center bg-gray-200 dark:bg-meta-4 text-gray-600 dark:text-gray-400 font-bold rounded-full`}
        title={`${firstName} ${lastName}`}
      >
        {initials || '?'}
      </div>
    );
  }

  return (
    <img
      src={profilePictureUrl}
      alt={`${firstName} ${lastName}`}
      className={`${className} object-cover rounded-full`}
      onError={() => setImageError(true)}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      loading="lazy"
    />
  );
};

export default UserAvatar;


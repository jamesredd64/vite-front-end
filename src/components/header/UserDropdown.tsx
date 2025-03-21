import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import React from "react";
import { useGlobalStorage } from "../../hooks/useGlobalStorage";
import { UserMetadata } from "../../types/user";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, getIdTokenClaims, user } = useAuth0();  // Add user here
  const [userMetadata] = useGlobalStorage<UserMetadata | null>('userMetadata', null);

  // Display name logic - use metadata first, fallback to Auth0 user info
  const displayName = userMetadata?.email || user?.email || user?.name || "User";
  const profilePicture = user?.picture  || userMetadata?.profile.profilePictureUrl || "/icons/default-avatar.png";

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = async (e: React.MouseEvent) => {
    // Prevent event from bubbling up and closing dropdown prematurely
    e.stopPropagation();
    
    try {
      const idTokenClaims = await getIdTokenClaims();
      const idToken = idTokenClaims?.__raw;

      const domain = 'dev-uizu7j8qzflxzjpy.us.auth0.com';
      const clientId = 'XFt8FzJrPByvX5WFaBj9wMS2yFXTjji6';
      const returnTo = encodeURIComponent(`${window.location.origin}`);

      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();

      // Construct the OIDC logout URL with ID token hint
      const logoutUrl = `https://${domain}/v2/logout?` +
        `returnTo=${returnTo}&` +
        `client_id=${clientId}`;

      // Redirect to the logout URL
      window.location.assign(logoutUrl);
    } catch (error) {
      console.error('Logout error:', error);
      
      // Fallback logout if the above fails
      logout({
        logoutParams: {
          returnTo: window.location.origin,
          clientId: 'XFt8FzJrPByvX5WFaBj9wMS2yFXTjji6'
        }
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img 
            src={profilePicture} 
            alt="" 
            aria-label={`Profile picture for ${displayName}`}
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">
          {displayName}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.33325 1.5L5.99992 6.16667L10.6666 1.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="right-0 top-full mt-4 flex w-62.5 flex-col rounded-lg border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-gray-900"
      >
        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                />
              </svg>
              Profile
            </DropdownItem>
          </li>
          {/* <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/settings"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 8.89722L15.8167 5.08056L18.9194 8.18333L15.1028 12L18.9194 15.8167L15.8167 18.9194L12 15.1028L8.18333 18.9194L5.08056 15.8167L8.89722 12L5.08056 8.18333L8.18333 5.08056L12 8.89722ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                />
              </svg>
              Settings
            </DropdownItem>
          </li> */}
        </ul>
        <button
          onClick={(e) => handleLogout(e)}
          className="flex items-center gap-3 px-3 py-4 font-medium text-red-600 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-red-700 dark:text-red-500 dark:hover:bg-white/5 dark:hover:text-red-400"
        >
          <svg
            className="fill-red-600 group-hover:fill-red-700 dark:fill-red-500 dark:group-hover:fill-red-400"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z"
            />
          </svg>
          Sign Out
        </button>
      </Dropdown>
    </div>
  );
}

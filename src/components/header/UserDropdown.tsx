import { useState, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import React from "react";
import { useGlobalStorage } from "../../hooks/useGlobalStorage";
import UserMetadata from "../../types/user";
import { UserIcon } from "../../icons";
import { useLocation, useNavigate } from "react-router-dom";




export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user, isAuthenticated } = useAuth0();
  const [userMetadata] = useGlobalStorage<UserMetadata | null>("userMetadata", null);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/showcase_admin');
  const navigate = useNavigate();

  // Display name logic - use metadata first, fallback to Auth0 user info
  const displayName = useMemo(() => {
    if (!isAuthenticated) return '';
    return userMetadata?.email || user?.email || user?.name || '';
  }, [isAuthenticated, userMetadata?.email, user?.email, user?.name]);

  const profilePicture = useMemo(() => {
    if (!isAuthenticated) return "/icons/default-avatar.png";
    if (user?.picture) return user.picture;
    if (userMetadata?.profile.profilePictureUrl) return userMetadata.profile.profilePictureUrl;
    return "/icons/default-avatar.png";
  }, [isAuthenticated, user?.picture, userMetadata?.profile.profilePictureUrl]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const savedTheme = localStorage.getItem('theme');

      // Get the current userMetadata and extract the role before clearing
      // const userMetadataStr = localStorage.getItem('userMetadata');
      // const userRole = UserRoleStorage.getRole(user.email);
      // let savedRole = localStorage.getItem('userRole');

      // if (userMetadataStr) {
      //   const userMetadata = JSON.parse(userMetadataStr);
      //   // If we have a role in userMetadata, use that as the saved role
      //   if (userMetadata?.profile?.role) {
      //     savedRole = userMetadata.profile.role;
      //     if (savedRole) {
      //       localStorage.setItem('userRole', savedRole);
      //     }
      //   }
      // }

      // Clear specific items instead of everything
      // for (const key of Object.keys(localStorage)) {
      //   if (key !== 'theme' && key !== 'userRole') {
      //     localStorage.removeItem(key);
      //   }
      // }

      // // Restore saved values
      // if (savedTheme) {
      //   localStorage.setItem('theme', savedTheme);
      // }
      // if (savedRole) {
      //   localStorage.setItem('userRole', savedRole);
      // }

      // sessionStorage.clear();

      logout({
        logoutParams: {
          returnTo: `${window.location.origin}${isAdminRoute ? '/admin' : ''}/signed-out`,
          clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      navigate(isAdminRoute ? "/showcase_admin/signed-out" : "/signed-out");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-3 text-gray-700 dark:text-gray-400"
      >
        <span className="overflow-hidden rounded-full h-11 w-11 bg-gray-100 dark:bg-gray-700">
          <img
            src={profilePicture}
            alt=""
            className="w-full h-full object-cover"
            aria-label={`Profile picture for ${displayName}`}
          />
        </span>

        <span className="font-medium text-sm hidden sm:block">
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
        className="absolute right-0 top-full mt-2 w-[220px] rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="p-2">
          <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
             {/* <DropdownItem
              onClick={() => {
                closeDropdown();
                const isAdmin = userMetadata?.profile?.role === "admin" || userMetadata?.profile?.role === "super-admin";
                window.location.href = isAdmin ? "/admin/profile" : "/user/profile";
              }}
              as="button"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
            >

            {/* <DropdownItem
              onClick={() => {
                closeDropdown();
                window.location.href = '/user/profile';
              }}
              as="button"
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
            > */}
              {/* <UserIcon className="w-5 h-5" />
              Profile
            </DropdownItem> */} 
          </div>

          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM7 12C7 11.4477 7.44772 11 8 11H16C16.5523 11 17 11.4477 17 12C17 12.5523 16.5523 13 16 13H8C7.44772 13 7 12.5523 7 12Z"
                fill="currentColor"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </Dropdown>
    </div>
  );
}

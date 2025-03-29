import { useState } from "react";
import { useAuth0 } from '@auth0/auth0-react';
import ThemeTogglerTwo from "../common/ThemeTogglerTwo";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import { Link } from "react-router-dom";
import React from "react";

interface HeaderProps {
  onClick?: () => void;
  onToggle: () => void;
}

// eslint-disable-next-line no-empty-pattern
const Header: React.FC<HeaderProps> = ({  }) => {
  const [isApplicationMenuOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // const handleTestLogout = () => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   logout({
  //     logoutParams: {
  //       returnTo: window.location.origin,
  //       clientId: import.meta.env.VITE_AUTH0_CLIENT_ID
  //     }
  //   });
  // };

  return (
    <header className="sticky top-0 z-[999999] flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
          {/* Add temporary logout button */}
          
            {/* <button
              onClick={handleTestLogout}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Test Logout
            </button> */}
         

          <Link to="/" className="lg:hidden">
            <img
              className="dark:hidden logo-default"
              src="/images/logo/logo.svg"
              alt="Logo"
            />
            <img
              className="hidden dark:block logo-default"
              src="/images/logo/logo-dark.svg"
              alt="Logo"
            />
          </Link>

          <div className="flex items-center ml-auto">
            {!isAuthenticated ? (
              <button
                onClick={() => loginWithRedirect()}
                className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10 transform transition-transform duration-200 hover:scale-105 hover:shadow-lg"
              >
                Sign In
              </button>
            ) : (
              <div
                className={`${
                  isApplicationMenuOpen ? "flex" : "hidden"
                } items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-theme-md lg:justify-end lg:px-0 lg:shadow-none`}
              >
                <div className="flex items-center gap-2 2xsm:gap-3">
                  <ThemeTogglerTwo />
                  <NotificationDropdown />
                </div>
                <UserDropdown />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import App from './App';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import { HelmetProvider } from 'react-helmet-async';
import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';
import { CalendarProvider } from './context/CalendarContext';
import { UnsavedChangesProvider } from './context/UnsavedChangesContext';
// import { useNavigate } from "react-router-dom";

import { useAuth0} from '@auth0/auth0-react';
import { useState } from 'react';
import { UserRoleStorage } from "./utils/userStorage";

import ProtectedRoute from "./routes/ProtectedRoute";

const onRedirectCallback = (appState: any) => {
  const userRole = localStorage.getItem('userRole');
  const returnTo = appState?.returnTo || window.location.pathname;
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // const navigate = useNavigate();  
    
  
    
  
    if (userRole === 'showcase_admin') {
      window.location.href = returnTo.includes('/admin') ? returnTo : '/admin';
      console.log("Setting path to admin");
    } else {
      window.location.href = returnTo || '/attendee';
      console.log("Setting path to admin");
      // window.location.href = returnTo.includes('/user') ? returnTo : '/user';
    } // Add support for other roles here
  };



  // if (userRole === 'admin' || userRole === 'super-admin') {
  //   window.location.href = returnTo.includes('/admin') ? returnTo : '/admin';
  //   // navigate(isAdminRoute && returnTo.includes('/admin') ? returnTo : '/admin');

  // } else {
  //   window.location.href = returnTo.includes('/admin') ? '/dashboard' : returnTo;
  //   // navigate(isAdminRoute ? "/admin" : "/dashboard") 
  // }



// useEffect(() => {
//   const { user } = useAuth0();
//   const userRole = user && user.email ? UserRoleStorage.getRole(user.email) : null;
//   console.log('[Auth] Redirect - User role:', userRole);
  
//   // Get the intended return path or default to root
//   // const returnTo = (appState as { returnTo?: string })?.returnTo || '/';
  
//   if (userRole === 'admin' || userRole === 'super-admin') {
//     console.log('[Auth] Redirecting admin to:', '/admin');
//     window.location.href = '/admin';
//   } else {
//     console.log('[Auth] Redirecting user to:', '/user');
//     window.location.href = '/user';
//   }
// }, [useAuth0()]);
console.log("hello from main");
console.log("Redirect URI Is ", window.location.origin);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
              redirect_uri: window.location.origin,              
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: 'openid profile email'
            }}
            cacheLocation="localstorage"
            onRedirectCallback={onRedirectCallback}
          >
            <CalendarProvider>
              <Provider store={store}>
                <UnsavedChangesProvider>
                  <SidebarProvider>
                    <SearchProvider>
                      <App />
                    </SearchProvider>
                  </SidebarProvider>
                </UnsavedChangesProvider>
              </Provider>
            </CalendarProvider>
          </Auth0Provider>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
  
);


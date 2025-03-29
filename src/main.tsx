
import React from 'react';
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: 'openid profile email'
          }}
          cacheLocation="localstorage"
          useRefreshTokens={false}
          skipRedirectCallback={window.location.pathname === '/signed-out'}
        >
          <CalendarProvider>
            <Provider store={store}>
              <SidebarProvider>
                <SearchProvider>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
                </SearchProvider>
              </SidebarProvider>
            </Provider>
          </CalendarProvider>
        </Auth0Provider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);


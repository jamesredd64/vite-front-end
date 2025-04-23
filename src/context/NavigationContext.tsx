/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useContext, useState, useCallback } from 'react';

interface NavigationContextType {
  handleNavigation: (path: string) => boolean;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [navigationState, setNavigationState] = useState({
    isModalOpen: false,
    pendingPath: null,
  });

  const handleNavigation = useCallback(
    (path: string) => {
      if (hasUnsavedChanges) {
        setNavigationState({
          isModalOpen: true,
          pendingPath: null,
        });
        return false; // Prevent immediate navigation
      }
      return true; // Allow navigation
    },
    [hasUnsavedChanges]
  );

  return (
    <NavigationContext.Provider
      value={{ handleNavigation, hasUnsavedChanges, setHasUnsavedChanges }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};


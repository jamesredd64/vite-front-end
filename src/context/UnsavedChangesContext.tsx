import React, { createContext, useContext, useState } from 'react';

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  handleNavigation: (path: string) => boolean;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export const UnsavedChangesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNavigation = (path: string) => {
    if (hasUnsavedChanges) {
      // Handle through App.tsx navigation state
      return false;
    }
    return true;
  };

  return (
    <UnsavedChangesContext.Provider value={{ hasUnsavedChanges, setHasUnsavedChanges, handleNavigation }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (context === undefined) {
    throw new Error('useUnsavedChanges must be used within a UnsavedChangesProvider');
  }
  return context;
};

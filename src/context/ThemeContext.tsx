import React, { createContext, useState, useContext, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const saveThemeToStorage = (theme: Theme) => {
  console.log('🔧 Saving theme to localStorage:', theme);
  localStorage.setItem('theme', theme);
};

// Initialize theme immediately when the file loads
const initializeTheme = () => {
  console.log('🚀 Initializing theme...');
  const savedTheme = localStorage.getItem('theme');
  console.log('📦 Retrieved theme from localStorage:', savedTheme);
  
  // Set default theme to 'light' if no theme is saved
  const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
  console.log('✨ Determined initial theme:', initialTheme);
  
  // Save the initial theme if none exists
  if (!savedTheme) {
    console.log('📝 No theme found in localStorage, saving default theme:', initialTheme);
    localStorage.setItem('theme', initialTheme);
  }
  
  // Apply theme to document immediately
  if (initialTheme === 'dark') {
    console.log('🌙 Applying dark mode to document');
    document.documentElement.classList.add('dark');
  } else {
    console.log('☀️ Applying light mode to document');
    document.documentElement.classList.remove('dark');
  }
  
  return initialTheme;
};

// Execute immediately
console.log('📝 ThemeContext.tsx is being evaluated');
const initialTheme = initializeTheme();
console.log('✅ Initial theme setup complete:', initialTheme);

const getThemeFromStorage = (): Theme => {
  console.log('🔍 Getting theme from storage');
  const savedTheme = localStorage.getItem('theme');
  // Set default theme to 'light' if no theme is saved
  const theme = savedTheme === 'dark' ? 'dark' : 'light';
  console.log('📫 Retrieved theme:', theme);
  return theme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log('🎭 ThemeProvider rendering');
  const [theme, setTheme] = useState<Theme>(getThemeFromStorage());

  useEffect(() => {
    console.log('🔄 Theme effect running with theme:', theme);
    // Apply theme to document
    if (theme === 'dark') {
      console.log('🌙 Applying dark mode');
      document.documentElement.classList.add('dark');
    } else {
      console.log('☀️ Applying light mode');
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference
    saveThemeToStorage(theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log('🔄 Toggle theme requested');
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('🔄 Switching theme from', prevTheme, 'to', newTheme);
      return newTheme;
    });
  };

  console.log('📦 ThemeProvider current theme:', theme);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    console.error('❌ useTheme was called outside of ThemeProvider!');
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  console.log('🎨 useTheme hook accessed, current theme:', context.theme);
  return context;
};

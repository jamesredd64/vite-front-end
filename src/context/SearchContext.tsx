import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'user' | 'document' | 'event';
  url: string;
  start?: string;
  end?: string;
  extendedProps?: Record<string, unknown>;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};




import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: unknown[];
  setSearchResults: (results: unknown[]) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<unknown[]>([]);

  const value = {
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export { SearchProvider, useSearch };
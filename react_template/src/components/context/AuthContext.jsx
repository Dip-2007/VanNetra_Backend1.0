import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [mockData, setMockData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch mock data asynchronously when the component mounts.
  // Files in the `public` directory are served at the root and cannot be directly imported as modules.
  useEffect(() => {
    const fetchMockData = async () => {
      try {
        // The path should be absolute from the public root directory.
        const response = await fetch('/data/mockData.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMockData(data);
      } catch (error) {
        console.error("Could not fetch mock data:", error);
        // Set mockData to a default empty state to prevent crashes
        setMockData({ users: [], fraRecords: [], schemes: [] }); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchMockData();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  const login = (userToLogin) => {
    setUser(userToLogin);
  };

  const logout = () => {
    setUser(null);
  };
  
  // Render a loading state while fetching data. This prevents components
  // from trying to access `mockData` before it's available.
  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">Loading Application...</p>
            </div>
        </div>
    );
  }

  const value = {
    isAuthenticated: !!user,
    user,
    mockData,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'admin' | 'employee' | 'beneficiary') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: 'admin' | 'employee' | 'beneficiary'): Promise<boolean> => {
    // Simulate authentication
    if (password === 'demo123') {
      const mockUser: User = {
        id: '1',
        name: role === 'beneficiary' ? 'Ravi Kumar' : 'Dr. Priya Sharma',
        email,
        role,
        district: 'Bastar',
        state: 'Chhattisgarh',
        village: role === 'beneficiary' ? 'Kondagaon' : undefined,
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
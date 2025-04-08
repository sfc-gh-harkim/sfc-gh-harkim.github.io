'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isMounted: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The correct password for accessing the Design Lab
const DESIGN_LAB_PASSWORD = '$MakeItPop';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('designlab-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsMounted(true);
  }, []);

  const login = (password: string) => {
    if (password === DESIGN_LAB_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('designlab-auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('designlab-auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isMounted, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
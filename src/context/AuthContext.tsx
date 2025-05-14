
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '@/services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  registerUser: (username: string, email: string, password: string) => Promise<void>;
  registerAdmin: (username: string, email: string, password: string, secretKey: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, check if user is authenticated
    const user = authService.getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.login({ username, password });
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const user = await authService.registerUser({ username, email, password });
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const registerAdmin = async (username: string, email: string, password: string, secretKey: string) => {
    setLoading(true);
    try {
      const user = await authService.registerAdmin({ username, email, password, secretKey });
      setUser(user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    registerUser,
    registerAdmin,
    logout,
    loading
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

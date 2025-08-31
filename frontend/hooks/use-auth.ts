'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { User, getCurrentUser, setCurrentUser } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setUser(user);
    setCurrentUser(user);
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  return {
    user,
    login,
    logout,
    isLoading,
  };
};

export { AuthContext };